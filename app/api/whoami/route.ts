import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const apiKey = authHeader?.replace('Bearer ', '').trim()

  if (!apiKey || !apiKey.startsWith('pronto_')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Hash the key and look it up
  const { data: keyRow } = await supabase
    .from('api_keys')
    .select('user_id, name')
    .eq('key_prefix', apiKey.slice(0, 12))
    .single()

  if (!keyRow) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
  }

  // Update last_used_at
  await supabase
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('user_id', keyRow.user_id)
    .eq('key_prefix', apiKey.slice(0, 12))

  const { data: profile } = await supabase
    .from('profiles')
    .select('email')
    .eq('id', keyRow.user_id)
    .single()

  return NextResponse.json({
    userId: keyRow.user_id,
    email: profile?.email ?? '',
  })
}
