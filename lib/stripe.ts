import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-04-22.dahlia',
    })
  }
  return _stripe
}

export const PLANS = {
  flex: {
    name: 'Flex',
    pricePerThousand: 0.79,
    priceId: process.env.STRIPE_FLEX_PRICE_ID,
  },
  studio: {
    name: 'Studio',
    monthlyPrice: 49,
    wordsIncluded: 100_000,
    priceId: process.env.STRIPE_STUDIO_PRICE_ID,
  },
  agency: {
    name: 'Agency',
    monthlyPrice: 149,
    wordsIncluded: 300_000,
    priceId: process.env.STRIPE_AGENCY_PRICE_ID,
  },
} as const

export type PlanKey = keyof typeof PLANS
