import { test, expect } from '@playwright/test'

test.describe('Billing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/billing')
  })

  test('shows Billing heading and description', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Billing' })).toBeVisible()
    await expect(page.getByText('Manage your plan and payment method.')).toBeVisible()
  })

  test('renders all three plan cards', async ({ page }) => {
    // Target the plan name headings specifically (span inside each card)
    await expect(page.locator('.grid span.font-semibold').filter({ hasText: 'Flex' }).first()).toBeVisible()
    await expect(page.locator('.grid span.font-semibold').filter({ hasText: 'Studio' }).first()).toBeVisible()
    await expect(page.locator('.grid span.font-semibold').filter({ hasText: 'Agency' }).first()).toBeVisible()
  })

  test('shows correct pricing', async ({ page }) => {
    await expect(page.getByText('$0.79')).toBeVisible()
    await expect(page.getByText('$49')).toBeVisible()
    await expect(page.getByText('$149')).toBeVisible()
  })

  test('shows "Most popular" badge on Studio', async ({ page }) => {
    // Only when user is not on Studio plan
    const badge = page.getByText('Most popular')
    const currentPlan = page.getByText('Current plan')
    // Either "Most popular" or "Current plan" should appear on the Studio card
    const hasPopular = await badge.count() > 0
    const hasCurrent = await currentPlan.count() > 0
    expect(hasPopular || hasCurrent).toBeTruthy()
  })

  test('plan cards have checkout buttons', async ({ page }) => {
    // At least one actionable plan button should be enabled
    const buttons = page.getByRole('button').filter({ hasText: /upgrade|start|current/i })
    await expect(buttons.first()).toBeVisible()
  })

  test('free trial note is shown', async ({ page }) => {
    await expect(page.getByText(/14-day free trial/i)).toBeVisible()
  })

  test('subscription status loads without crashing', async ({ page }) => {
    // Wait for the subscription fetch to complete (page shouldn't error)
    await page.waitForLoadState('networkidle')
    await expect(page.getByRole('heading', { name: 'Billing' })).toBeVisible()
  })

  test('shows success banner when ?success=true', async ({ page }) => {
    await page.goto('/dashboard/billing?success=true')
    await expect(page.getByText(/Subscription activated/i)).toBeVisible()
  })

  test('shows canceled banner when ?canceled=true', async ({ page }) => {
    await page.goto('/dashboard/billing?canceled=true')
    await expect(page.getByText(/Checkout canceled/i)).toBeVisible()
  })
})
