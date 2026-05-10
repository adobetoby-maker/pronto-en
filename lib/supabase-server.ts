import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Lazy proxy — defers createClient until first request so build doesn't crash on missing env vars
let _admin: SupabaseClient | null = null

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_t, prop) {
    if (!_admin) {
      _admin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      )
    }
    return (_admin as unknown as Record<string | symbol, unknown>)[prop]
  },
})
