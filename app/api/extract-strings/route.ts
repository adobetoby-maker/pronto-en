import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { getSessionUserId } from '@/lib/auth-session'

export async function POST(req: NextRequest) {
  const userId = await getSessionUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null) as { url?: string; text?: string } | null
  if (!body) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  let content = ''

  if (body.url) {
    try {
      const res = await fetch(body.url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Pronto-Localization/1.0)' },
        signal: AbortSignal.timeout(12_000),
      })
      const html = await res.text()
      content = html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 10_000)
    } catch {
      return NextResponse.json(
        { error: 'Could not fetch that URL. Make sure it is publicly accessible and try again.' },
        { status: 400 }
      )
    }
  } else if (body.text) {
    content = body.text.slice(0, 10_000)
  } else {
    return NextResponse.json({ error: 'Provide a URL or paste your text' }, { status: 400 })
  }

  if (!content.trim()) {
    return NextResponse.json({ error: 'No readable content found on that page' }, { status: 400 })
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2048,
    system: `You extract translatable UI strings from website content and return them as a JSON object.

Rules:
- Extract: nav items, headings, subheadings, body text, button labels, CTAs, form labels, placeholder text, footer text, error messages, success messages
- Skip: URLs, email addresses, phone numbers (keep the label like "Call us" but not the number itself), code snippets, raw HTML
- Use readable dot-notation keys (e.g. "nav.about", "hero.headline", "cta.getStarted", "footer.tagline")
- Keep values as the original text, exactly as it appears
- Aim for 15–40 pairs — capture the most important visible strings
- Return ONLY a valid JSON object, no markdown fences, no explanation`,
    messages: [{
      role: 'user',
      content: `Extract the translatable UI strings from this page content:\n\n${content}`,
    }],
  })

  const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : ''
  const match = raw.match(/```(?:json)?\s*([\s\S]*?)```/) ?? raw.match(/(\{[\s\S]*\})/)
  const jsonStr = match ? (match[1] ?? match[0]) : raw

  try {
    const strings = JSON.parse(jsonStr) as Record<string, string>
    return NextResponse.json({ strings, count: Object.keys(strings).length })
  } catch {
    return NextResponse.json({ error: 'Could not parse extracted strings — try pasting your text instead' }, { status: 500 })
  }
}
