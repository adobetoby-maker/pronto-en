import { test, expect } from '@playwright/test'

// API smoke tests — hit the real endpoints directly.
// These run against the deployed server (no browser).

const BASE = process.env.PRONTO_URL ?? 'https://pronto-en.worker-bee.app'

test.describe('API routes — smoke', () => {
  test('GET /api/subscription returns plan data or 404 before deploy', async ({ request }) => {
    const res = await request.get(`${BASE}/api/subscription`)
    // 200 once deployed, 404 before the route is live
    expect([200, 404]).toContain(res.status())
    if (res.status() === 200) {
      const body = await res.json()
      expect(body).toHaveProperty('plan')
      expect(['flex', 'studio', 'agency']).toContain(body.plan)
    }
  })

  test('GET /api/api-keys returns array', async ({ request }) => {
    const res = await request.get(`${BASE}/api/api-keys`)
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(Array.isArray(body)).toBe(true)
  })

  test('POST /api/auth/forgot-password always returns ok', async ({ request }) => {
    // Should never reveal whether email exists
    const res = await request.post(`${BASE}/api/auth/forgot-password`, {
      data: { email: 'nonexistent@example.com' },
    })
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
  })

  test('POST /api/auth/forgot-password with no email still returns ok', async ({ request }) => {
    const res = await request.post(`${BASE}/api/auth/forgot-password`, {
      data: {},
    })
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
  })

  test('GET /api/whoami without API key returns 401', async ({ request }) => {
    const res = await request.get(`${BASE}/api/whoami`)
    expect(res.status()).toBe(401)
  })

  test('GET /api/whoami with bad API key returns 401', async ({ request }) => {
    const res = await request.get(`${BASE}/api/whoami`, {
      headers: { Authorization: 'Bearer pronto_badkeyxxxxxxxx' },
    })
    expect(res.status()).toBe(401)
  })

  test('POST /api/translate without API key returns 401', async ({ request }) => {
    const res = await request.post(`${BASE}/api/translate`, {
      data: { strings: { greeting: 'Hello' }, targetLanguage: 'es' },
    })
    expect(res.status()).toBe(401)
  })
})
