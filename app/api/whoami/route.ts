import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('authorization')?.replace('Bearer ', '').trim()

  if (!apiKey?.startsWith('pronto_')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Narrow candidates by prefix (cheap), then bcrypt-verify the full key
  const prefix = apiKey.slice(0, 12)
  const { data: candidates } = await supabaseAdmin
    .from('api_keys')
    .select('id, user_id, key_hash')
    .eq('key_prefix', prefix)

  if (!candidates?.length) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
  }

  let matched: (typeof candidates)[0] | null = null
  for (const row of candidates) {
    if (await bcrypt.compare(apiKey, row.key_hash)) { matched = row; break }
  }

  if (!matched) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
  }

  await supabaseAdmin
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', matched.id)

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('email')
    .eq('id', matched.user_id)
    .single()

  return NextResponse.json({ userId: matched.user_id, email: profile?.email ?? '' })
}
