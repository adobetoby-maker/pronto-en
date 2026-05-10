import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase-server'
import { getSessionUserId } from '@/lib/auth-session'

function generateApiKey(): { raw: string; prefix: string } {
  const bytes = crypto.getRandomValues(new Uint8Array(24))
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
  const raw = `pronto_${hex}`
  return { raw, prefix: raw.slice(0, 12) }
}

// GET /api/api-keys — list keys for current user
export async function GET() {
  const userId = await getSessionUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('api_keys')
    .select('id, name, key_prefix, last_used_at, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST /api/api-keys — create a new key
export async function POST(req: NextRequest) {
  const userId = await getSessionUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { name } = await req.json() as { name?: string }

  const { raw, prefix } = generateApiKey()
  const keyHash = await bcrypt.hash(raw, 10)

  const { data, error } = await supabaseAdmin
    .from('api_keys')
    .insert({
      user_id: userId,
      name: name ?? 'Default',
      key_hash: keyHash,
      key_prefix: prefix,
    })
    .select('id, name, key_prefix, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Return the raw key ONCE — never stored again
  return NextResponse.json({ ...data, key: raw }, { status: 201 })
}
