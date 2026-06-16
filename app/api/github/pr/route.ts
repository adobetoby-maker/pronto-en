import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { getSessionUserId } from '@/lib/auth-session'
import { supabaseAdmin } from '@/lib/supabase-server'

const LANG_NAMES: Record<string, string> = {
  es: 'Spanish', fr: 'French', de: 'German', it: 'Italian', pt: 'Portuguese',
  ja: 'Japanese', zh: 'Simplified Chinese', ko: 'Korean', ar: 'Arabic',
  ru: 'Russian', nl: 'Dutch', pl: 'Polish', tr: 'Turkish', sv: 'Swedish',
  hi: 'Hindi',
}

type GHFileResponse = { content: string; sha: string; encoding: string }

function flattenJson(obj: unknown, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const key = prefix ? `${prefix}.${k}` : k
    if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      Object.assign(out, flattenJson(v, key))
    } else {
      out[key] = String(v)
    }
  }
  return out
}

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { owner, repo, branch, filePath, targetLanguages } = await req.json() as {
    owner: string; repo: string; branch: string; filePath: string; targetLanguages: string[]
  }

  const { data: conn } = await supabaseAdmin
    .from('github_connections')
    .select('access_token')
    .eq('user_id', userId)
    .single()

  if (!conn?.access_token) return NextResponse.json({ error: 'GitHub not connected' }, { status: 400 })

  const headers = {
    Authorization: `Bearer ${conn.access_token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  }

  // Fetch source file
  const fileRes  = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`, { headers })
  const fileData = await fileRes.json() as GHFileResponse

  if (!fileData.content) return NextResponse.json({ error: 'Could not read source file' }, { status: 400 })

  const sourceContent = Buffer.from(fileData.content.replace(/\n/g, ''), 'base64').toString('utf-8')
  let sourceStrings: Record<string, string>
  try {
    sourceStrings = flattenJson(JSON.parse(sourceContent))
  } catch {
    return NextResponse.json({ error: 'Source file is not valid JSON' }, { status: 400 })
  }

  const wordCount = Object.values(sourceStrings).reduce(
    (n, s) => n + s.trim().split(/\s+/).filter(Boolean).length, 0
  )

  // Create a new branch for the PR
  const prBranch = `pronto/translations-${Date.now()}`

  // Get current branch SHA
  const refRes  = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`, { headers })
  const refData = await refRes.json() as { object?: { sha: string } }
  if (!refData.object?.sha) return NextResponse.json({ error: 'Could not read branch ref' }, { status: 400 })

  // Create new branch
  await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
    method: 'POST', headers,
    body: JSON.stringify({ ref: `refs/heads/${prBranch}`, sha: refData.object.sha }),
  })

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const committed: string[] = []

  // Translate + commit each language
  for (const lang of targetLanguages) {
    const langName = LANG_NAMES[lang] ?? lang
    const message  = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: Math.max(4096, JSON.stringify(sourceStrings).length * 2),
      system: `You are a professional localization expert. Translate UI strings from English to ${langName}.
- Preserve interpolation variables exactly: {{variable}}, {variable}, %s, %d
- Preserve HTML tags
- Return ONLY valid JSON, no explanation
- Keep all keys identical, translate only values`,
      messages: [{
        role: 'user',
        content: `Translate to ${langName}:\n\n${JSON.stringify(sourceStrings, null, 2)}\n\nReturn only the translated JSON.`,
      }],
    })

    const raw      = message.content[0].type === 'text' ? message.content[0].text : ''
    const match    = raw.match(/```(?:json)?\s*([\s\S]*?)```/) ?? raw.match(/(\{[\s\S]*\})/)
    const jsonStr  = match ? (match[1] ?? match[0]) : raw
    let translated: Record<string, string>
    try { translated = JSON.parse(jsonStr) } catch { continue }

    // Determine target file path (replace /en/ or en.json with target lang)
    const targetPath = filePath
      .replace(/\/en\//g, `/${lang}/`)
      .replace(/\/en\.(json|arb|strings)$/, `/${lang}.$1`)
      .replace(/\/en\.json$/, `/${lang}.json`)

    // Check if file exists to get its SHA (needed for updates)
    const existingRes  = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${targetPath}?ref=${prBranch}`,
      { headers }
    )
    const existingData = existingRes.ok ? await existingRes.json() as { sha?: string } : {}

    const fileContent = Buffer.from(JSON.stringify(translated, null, 2)).toString('base64')
    await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${targetPath}`, {
      method: 'PUT', headers,
      body: JSON.stringify({
        message: `feat(i18n): add ${langName} translations`,
        content: fileContent,
        branch: prBranch,
        ...(existingData.sha ? { sha: existingData.sha } : {}),
      }),
    })

    committed.push(lang)

    // Track usage
    await supabaseAdmin.from('usage_events').insert({
      user_id: userId, words: wordCount, target_language: lang,
      created_at: new Date().toISOString(),
    })
  }

  if (committed.length === 0) {
    return NextResponse.json({ error: 'No languages were translated successfully' }, { status: 500 })
  }

  // Open PR
  const langLabels = committed.map(c => LANG_NAMES[c] ?? c).join(', ')
  const prRes  = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
    method: 'POST', headers,
    body: JSON.stringify({
      title: `feat(i18n): add ${langLabels} translations via Pronto`,
      body: `## Translations added by [Pronto](https://pronto-en.worker-bee.app)\n\n**Source file:** \`${filePath}\`\n**Languages:** ${langLabels}\n**Strings translated:** ${Object.keys(sourceStrings).length}\n\n_Generated automatically. Review and merge when ready._`,
      head: prBranch,
      base: branch,
    }),
  })
  const prData = await prRes.json() as { html_url?: string; number?: number }

  return NextResponse.json({
    pr_url:    prData.html_url,
    pr_number: prData.number,
    languages: committed,
    strings:   Object.keys(sourceStrings).length,
  })
}
