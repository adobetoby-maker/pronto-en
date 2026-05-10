import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json() as { email?: string; password?: string }

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  // Use admin client to create user with email pre-confirmed (no email verification step)
  const { data: adminData, error: adminError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (adminError) {
    return NextResponse.json({ error: adminError.message }, { status: 400 })
  }

  if (adminData.user) {
    await supabaseAdmin.from('profiles').upsert({
      id: adminData.user.id,
      email,
      created_at: new Date().toISOString(),
    })
  }

  // Now sign them in so they get a session cookie
  const response = NextResponse.json({ ok: true }, { status: 201 })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  await supabase.auth.signInWithPassword({ email, password })

  return response
}
