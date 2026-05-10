import { NextRequest, NextResponse } from 'next/server'
import { getStripe, PLANS, PlanKey } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase-server'
import { getSessionUserId } from '@/lib/auth-session'

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan } = await req.json() as { plan: PlanKey }
  if (!PLANS[plan]) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

  const priceId = PLANS[plan].priceId
  if (!priceId) return NextResponse.json({ error: 'Plan not configured yet' }, { status: 503 })

  const { data: sub } = await supabaseAdmin
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single()

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('email')
    .eq('id', userId)
    .single()

  const stripe = getStripe()
  let customerId = sub?.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile?.email,
      metadata: { userId },
    })
    customerId = customer.id
  }

  const origin = req.headers.get('origin') ?? 'https://pronto-en.worker-bee.app'

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/dashboard/billing?success=1`,
    cancel_url: `${origin}/dashboard/billing?canceled=1`,
    metadata: { userId, plan },
    subscription_data: { metadata: { userId, plan } },
  })

  return NextResponse.json({ url: session.url })
}
