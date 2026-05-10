import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

export async function GET(req: NextRequest) {
  const apiKey = req.headers.get('authorization')?.replace('Bearer ', '').trim()
  if (!apiKey) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: keyRow } = await supabaseAdmin
    .from('api_keys')
    .select('user_id')
    .eq('key_prefix', apiKey.slice(0, 12))
    .single()

  if (!keyRow) return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data } = await supabaseAdmin
    .from('usage')
    .select('words, cost_usd')
    .eq('user_id', keyRow.user_id)
    .gte('recorded_at', startOfMonth.toISOString())

  const words = (data ?? []).reduce((sum, r) => sum + (r.words ?? 0), 0)
  const cost = (data ?? []).reduce((sum, r) => sum + parseFloat(r.cost_usd ?? '0'), 0)

  return NextResponse.json({
    words_this_month: words,
    cost_usd: cost.toFixed(4),
  })
}
