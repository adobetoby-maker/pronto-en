import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

async function resolveUserId(apiKey: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from('api_keys')
    .select('user_id')
    .eq('key_prefix', apiKey.slice(0, 12))
    .single()
  return data?.user_id ?? null
}

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('authorization')?.replace('Bearer ', '').trim()
  if (!apiKey) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = await resolveUserId(apiKey)
  if (!userId) return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })

  const body = await req.json() as { words: number; project_id?: string }
  const costUsd = (body.words / 1000) * 0.79

  await supabaseAdmin.from('usage').insert({
    user_id: userId,
    project_id: body.project_id ?? null,
    words: body.words,
    cost_usd: costUsd,
  })

  return NextResponse.json({ ok: true })
}
