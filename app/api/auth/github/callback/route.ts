import { NextRequest, NextResponse } from 'next/server'
import { getSessionUserId } from '@/lib/auth-session'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const userId = await getSessionUserId()
  const appUrl  = process.env.NEXT_PUBLIC_APP_URL || `https://${req.headers.get('host')}`

  if (!userId) return NextResponse.redirect(`${appUrl}/login`)

  const { searchParams } = new URL(req.url)
  const code        = searchParams.get('code')
  const state       = searchParams.get('state')
  const storedState = req.cookies.get('gh_oauth_state')?.value

  if (!code || !state || state !== storedState) {
    return NextResponse.redirect(`${appUrl}/dashboard/wizard?error=oauth_state_mismatch`)
  }

  // Exchange code for access token
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id:     process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${appUrl}/api/auth/github/callback`,
    }),
  })
  const tokenData = await tokenRes.json() as { access_token?: string }

  if (!tokenData.access_token) {
    return NextResponse.redirect(`${appUrl}/dashboard/wizard?error=token_exchange_failed`)
  }

  // Get GitHub identity
  const userRes    = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  })
  const githubUser = await userRes.json() as { login: string }

  await supabaseAdmin.from('github_connections').upsert({
    user_id:      userId,
    access_token: tokenData.access_token,
    github_login: githubUser.login,
    connected_at: new Date().toISOString(),
  })

  const res = NextResponse.redirect(`${appUrl}/dashboard/wizard?github=connected`)
  res.cookies.delete('gh_oauth_state')
  return res
}
