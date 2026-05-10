import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// DEV BYPASS: hardcoded admin user — remove before public launch
const DEV_USER_ID = 'aca8ec9b-995f-4f82-b31b-58bc46ab2a48'

export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? DEV_USER_ID
}
