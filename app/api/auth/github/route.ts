import { NextRequest, NextResponse } from 'next/server'
import { getSessionUserId } from '@/lib/auth-session'

export async function GET(req: NextRequest) {
  const userId = await getSessionUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const clientId = process.env.GITHUB_CLIENT_ID
  if (!clientId) {
    return NextResponse.redirect(new URL('/dashboard/wizard?error=github_not_configured', req.url))
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || `https://${req.headers.get('host')}`
  const state  = crypto.randomUUID()

  const params = new URLSearchParams({
    client_id:    clientId,
    redirect_uri: `${appUrl}/api/auth/github/callback`,
    scope:        'repo',
    state,
  })

  const res = NextResponse.redirect(`https://github.com/login/oauth/authorize?${params}`)
  res.cookies.set('gh_oauth_state', state, { httpOnly: true, maxAge: 600, path: '/', sameSite: 'lax' })
  return res
}
