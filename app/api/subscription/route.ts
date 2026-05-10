import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { getSessionUserId } from '@/lib/auth-session'

export async function GET() {
  const userId = await getSessionUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data } = await supabaseAdmin
    .from('subscriptions')
    .select('plan, status, words_included, current_period_end')
    .eq('user_id', userId)
    .single()

  return NextResponse.json({
    plan: data?.plan ?? 'flex',
    status: data?.status ?? null,
    words_included: data?.words_included ?? 0,
    current_period_end: data?.current_period_end ?? null,
  })
}
