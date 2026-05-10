import { NextResponse } from 'next/server'
import { getSessionUserId } from '@/lib/auth-session'
import { supabaseAdmin } from '@/lib/supabase-server'

type GHRepo = {
  id: number
  name: string
  full_name: string
  owner: { login: string }
  default_branch: string
  private: boolean
  updated_at: string
  description: string | null
}

export async function GET() {
  const userId = await getSessionUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: conn } = await supabaseAdmin
    .from('github_connections')
    .select('access_token, github_login')
    .eq('user_id', userId)
    .single()

  if (!conn?.access_token) {
    return NextResponse.json({ error: 'GitHub not connected' }, { status: 400 })
  }

  const res   = await fetch('https://api.github.com/user/repos?sort=updated&per_page=50&type=all', {
    headers: { Authorization: `Bearer ${conn.access_token}`, Accept: 'application/vnd.github+json' },
  })
  const repos = await res.json() as GHRepo[]

  return NextResponse.json({
    login: conn.github_login,
    repos: repos.map(r => ({
      id:             r.id,
      name:           r.name,
      full_name:      r.full_name,
      owner:          r.owner.login,
      default_branch: r.default_branch,
      private:        r.private,
      updated_at:     r.updated_at,
      description:    r.description,
    })),
  })
}
