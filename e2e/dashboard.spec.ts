import { test, expect } from '@playwright/test'

// Dashboard is accessible without login via DEV_USER_ID bypass.
// These tests verify the shell loads and navigation works.

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
  })

  test('loads and shows Pronto logo in sidebar', async ({ page }) => {
    await expect(page.getByText('ronto').first()).toBeVisible()
  })

  test('sidebar shows all navigation items', async ({ page }) => {
    const sidebar = page.locator('aside')
    await expect(sidebar.getByRole('link', { name: 'Projects' })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'API Keys', exact: true })).toBeVisible()
    await expect(sidebar.getByRole('link', { name: 'Billing' })).toBeVisible()
  })

  test('navigates to API Keys page', async ({ page }) => {
    await page.locator('aside').getByRole('link', { name: 'API Keys', exact: true }).click()
    await expect(page).toHaveURL(/\/dashboard\/api-keys/)
  })

  test('navigates to Billing page', async ({ page }) => {
    await page.getByRole('link', { name: 'Billing' }).click()
    await expect(page).toHaveURL(/\/dashboard\/billing/)
  })
})

test.describe('Dashboard — API Keys page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard/api-keys')
  })

  test('shows API Keys heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'API Keys' })).toBeVisible()
  })

  test('shows create key button or form', async ({ page }) => {
    // Either a "Create key" or "New key" button/text should be present
    const createEl = page.getByRole('button', { name: /create|new key/i })
      .or(page.getByText(/create|generate/i))
    await expect(createEl.first()).toBeVisible()
  })
})
