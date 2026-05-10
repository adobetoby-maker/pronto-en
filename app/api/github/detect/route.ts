import { NextRequest, NextResponse } from 'next/server'
import { getSessionUserId } from '@/lib/auth-session'
import { supabaseAdmin } from '@/lib/supabase-server'

// Common locale file patterns — all must be English source files
const LOCALE_PATTERNS = [
  /^(public\/)?locales\/en[\/-]/i,
  /^(src\/)?locales?\/en\.(json|js|ts)$/i,
  /^(src\/)?i18n\/en\.(json|js|ts)$/i,
  /^messages\/en\.(json|js|ts)$/i,
  /^lang\/en\.(json|js|ts)$/i,
  /^assets\/i18n\/en\.(json|js|ts)$/i,
  /^(src\/)?translations?\/en\.(json|js|ts)$/i,
  /strings\/en\.strings$/i,
  /Localizable\.strings$/i,
  /\/en\.arb$/i,
  /res\/values\/strings\.xml$/i,
]

type GHTreeItem = { path: string; type: string; url: string; sha: string }

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { owner, repo, branch } = await req.json() as { owner: string; repo: string; branch: string }

  const { data: conn } = await supabaseAdmin
    .from('github_connections')
    .select('access_token')
    .eq('user_id', userId)
    .single()

  if (!conn?.access_token) return NextResponse.json({ error: 'GitHub not connected' }, { status: 400 })

  const headers = { Authorization: `Bearer ${conn.access_token}`, Accept: 'application/vnd.github+json' }

  // Fetch the full file tree
  const treeRes  = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
    { headers }
  )
  const treeData = await treeRes.json() as { tree?: GHTreeItem[] }

  if (!treeData.tree) return NextResponse.json({ error: 'Could not read repo tree' }, { status: 400 })

  const matches = treeData.tree.filter(
    item => item.type === 'blob' && LOCALE_PATTERNS.some(p => p.test(item.path))
  )

  return NextResponse.json({ files: matches.map(f => ({ path: f.path, sha: f.sha })) })
}
