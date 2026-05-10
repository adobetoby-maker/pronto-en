import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function resolveUserId(apiKey: string): Promise<string | null> {
  const { data } = await supabase
    .from('api_keys')
    .select('user_id')
    .eq('key_prefix', apiKey.slice(0, 12))
    .single()
  return data?.user_id ?? null
}

// POST /api/usage — record words translated
export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('authorization')?.replace('Bearer ', '').trim()
  if (!apiKey) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = await resolveUserId(apiKey)
  if (!userId) return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })

  const body = await req.json() as { words: number; project_id?: string }

  // Cost: $0.79 per 1000 words
  const costUsd = (body.words / 1000) * 0.79

  await supabase.from('usage').insert({
    user_id: userId,
    project_id: body.project_id,
    words: body.words,
    cost_usd: costUsd,
  })

  await supabase
    .from('subscriptions')
    .update({ words_used: supabase.rpc('words_used', { increment: body.words }) as unknown as number })
    .eq('user_id', userId)

  return NextResponse.json({ ok: true })
}
