import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { getSessionUserId } from '@/lib/auth-session'

export async function GET() {
  const userId = await getSessionUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data: events } = await supabaseAdmin
    .from('usage_events')
    .select('words, target_language, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  const allEvents = events ?? []
  const thisMonth = allEvents.filter(e => new Date(e.created_at) >= startOfMonth)

  const wordsThisMonth = thisMonth.reduce((sum, e) => sum + (e.words ?? 0), 0)
  // Flex pricing: $0.79 per 1,000 words
  const costThisMonth = (wordsThisMonth / 1000) * 0.79

  const byLanguage: Record<string, number> = {}
  for (const e of thisMonth) {
    const lang = e.target_language ?? 'unknown'
    byLanguage[lang] = (byLanguage[lang] ?? 0) + (e.words ?? 0)
  }

  return NextResponse.json({
    words_this_month: wordsThisMonth,
    cost_usd: costThisMonth.toFixed(4),
    by_language: byLanguage,
    recent: allEvents.slice(0, 20),
  })
}
