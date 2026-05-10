import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { getSessionUserId } from '@/lib/auth-session'

const LANGUAGE_NAMES: Record<string, string> = {
  es: 'Spanish', fr: 'French', de: 'German', it: 'Italian', pt: 'Portuguese',
  ja: 'Japanese', zh: 'Simplified Chinese', ko: 'Korean', ar: 'Arabic',
  ru: 'Russian', nl: 'Dutch', pl: 'Polish', tr: 'Turkish', sv: 'Swedish',
  da: 'Danish', fi: 'Finnish', no: 'Norwegian', he: 'Hebrew', hi: 'Hindi',
}

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null) as {
    strings: Record<string, string>
    targetLanguage: string
    sourceLanguage?: string
    tone?: string
    domain?: string
  } | null

  if (!body?.strings || !body?.targetLanguage) {
    return NextResponse.json({ error: 'Missing strings or targetLanguage' }, { status: 400 })
  }

  const { strings, targetLanguage, sourceLanguage = 'en', tone, domain } = body
  const langName = LANGUAGE_NAMES[targetLanguage] ?? targetLanguage

  const toneInstruction = tone === 'formal'
    ? 'Use formal language and polite forms of address.'
    : tone === 'informal'
    ? 'Use casual, friendly language.'
    : 'Match the tone of the source text.'

  const domainInstruction = domain
    ? `This is ${domain} content. Use appropriate domain-specific terminology.`
    : ''

  const systemPrompt = `You are a professional localization expert. Translate UI strings from ${sourceLanguage} to ${langName}.

Rules:
- Preserve all interpolation variables exactly: {{variable}}, {variable}, %s, %d, etc.
- Preserve HTML tags if present.
- ${toneInstruction}
- ${domainInstruction}
- Return ONLY valid JSON, no explanation.
- Keep keys identical to input. Translate only values.`

  const inputJson = JSON.stringify(strings, null, 2)
  const wordCount = Object.values(strings).reduce(
    (sum, s) => sum + s.trim().split(/\s+/).filter(Boolean).length, 0
  )

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: Math.max(4096, inputJson.length * 2),
    system: systemPrompt,
    messages: [{
      role: 'user',
      content: `Translate these UI strings to ${langName}:\n\n${inputJson}\n\nReturn only the translated JSON object.`,
    }],
  })

  const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
  const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/) ?? responseText.match(/(\{[\s\S]*\})/)

  if (!jsonMatch) {
    return NextResponse.json({ error: 'Translation model returned unexpected response' }, { status: 500 })
  }

  const translated = JSON.parse(jsonMatch[1] ?? jsonMatch[0]) as Record<string, string>

  // Track usage
  try {
    await supabaseAdmin.from('usage_events').insert({
      user_id: userId,
      words: wordCount,
      target_language: targetLanguage,
      created_at: new Date().toISOString(),
    })
  } catch { /* non-critical */ }

  return NextResponse.json({
    strings: translated,
    wordsProcessed: wordCount,
    tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
  })
}
