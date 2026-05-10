import { test, expect } from '@playwright/test'

test.describe('Login page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('renders email + password fields and sign-in button', async ({ page }) => {
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible()
    await expect(page.getByPlaceholder('••••••••')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
  })

  test('shows Pronto logo link back to home', async ({ page }) => {
    const logo = page.getByRole('link', { name: /Pronto/i }).first()
    await expect(logo).toBeVisible()
    await expect(logo).toHaveAttribute('href', '/')
  })

  test('password reveal toggle switches input type', async ({ page }) => {
    // Use a stable locator — the password input is within a relative div next to the eye button
    const passwordInput = page.locator('input[name="password"], input[type="password"], input[type="text"]').first()
    await expect(page.locator('input[type="password"]').first()).toBeVisible()

    // The eye toggle is a button[type="button"] inside the password field container
    await page.locator('button[type="button"]').last().click()
    await expect(page.locator('input[type="text"]').first()).toBeVisible()

    // Toggle back
    await page.locator('button[type="button"]').last().click()
    await expect(page.locator('input[type="password"]').first()).toBeVisible()
  })

  test('forgot password link shows reset panel', async ({ page }) => {
    await page.getByRole('button', { name: 'Forgot password?' }).click()
    await expect(page.getByText('Reset your password')).toBeVisible()
    await expect(page.getByText("Enter your email and we'll send a reset link.")).toBeVisible()
  })

  test('reset panel shows confirmation after submit', async ({ page }) => {
    await page.getByRole('button', { name: 'Forgot password?' }).click()
    await page.getByPlaceholder('you@example.com').fill('test@example.com')
    await page.getByRole('button', { name: 'Send reset link' }).click()
    await expect(page.getByText('Check your email')).toBeVisible()
    await expect(page.getByText('test@example.com')).toBeVisible()
  })

  test('back to sign in from reset panel', async ({ page }) => {
    await page.getByRole('button', { name: 'Forgot password?' }).click()
    await page.getByRole('button', { name: 'Back to sign in' }).click()
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeVisible()
  })

  test('wrong credentials shows error message', async ({ page }) => {
    await page.getByPlaceholder('you@example.com').fill('wrong@example.com')
    await page.getByPlaceholder('••••••••').fill('badpassword')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.locator('.text-red-400')).toBeVisible({ timeout: 8_000 })
  })

  test('sign up link navigates to /signup', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Sign up free' })).toHaveAttribute('href', '/signup')
  })
})
