import type { Metadata } from 'next'
import Link from 'next/link'
import { Globe, Zap, CheckCircle, Clock, MessageSquare, ShieldCheck, ArrowRight, Languages } from 'lucide-react'
import { Nav } from '@/components/Nav'
import { Footer } from '@/components/Footer'

export const metadata: Metadata = {
  title: 'How Pronto Works — A Plain-English Guide',
  description: 'Everything you need to know about translating your website with Pronto. No technical knowledge required.',
}

const STEPS = [
  {
    number: '01',
    title: 'We connect Pronto to your site',
    body: 'Your web developer links Pronto to your website in about five minutes. You don\'t need to do anything during this step — just sit back.',
  },
  {
    number: '02',
    title: 'Pronto reads your content',
    body: 'Pronto automatically finds every word on your site — headlines, buttons, paragraphs, menus. It knows what to translate and what to leave alone (like your phone number or brand name).',
  },
  {
    number: '03',
    title: 'AI translates it, accurately',
    body: 'Our AI doesn\'t just swap words — it understands context. A "contact us" button becomes the natural, culturally appropriate phrase for your target language, not a robotic literal translation.',
  },
  {
    number: '04',
    title: 'You review before anything goes live',
    body: 'Every translation is prepared as a draft first. You (or a native speaker you trust) can read through it and request changes. Nothing appears on your live site until you approve it.',
  },
  {
    number: '05',
    title: 'Your site speaks a new language',
    body: 'Once approved, your translated site goes live. Visitors from Spanish-speaking countries see it in Spanish. You didn\'t have to write a single word.',
  },
]

const LANGUAGES = [
  { flag: '🇲🇽', name: 'Spanish' },
  { flag: '🇯🇵', name: 'Japanese' },
  { flag: '🇫🇷', name: 'French' },
  { flag: '🇩🇪', name: 'German' },
  { flag: '🇧🇷', name: 'Portuguese' },
  { flag: '🇰🇷', name: 'Korean' },
  { flag: '🇨🇳', name: 'Chinese' },
  { flag: '🇸🇦', name: 'Arabic' },
  { flag: '🇮🇹', name: 'Italian' },
  { flag: '🇷🇺', name: 'Russian' },
  { flag: '🇳🇱', name: 'Dutch' },
  { flag: '🇸🇪', name: 'Swedish' },
]

const FAQS = [
  {
    q: 'How accurate is AI translation?',
    a: 'For most business content — service descriptions, contact pages, pricing, FAQs — AI translation is excellent. It understands tone and context, not just words. For highly specialized or legal content, we recommend having a native speaker do a quick read-through before approving.',
  },
  {
    q: 'How long does it take?',
    a: 'Most websites are fully translated within 24 hours of setup. Larger sites with hundreds of pages may take a little longer. Once Pronto is connected, future updates to your content are translated automatically — usually within minutes.',
  },
  {
    q: 'Will it change my existing website?',
    a: 'No. Your current site stays exactly as it is. Pronto prepares the translation separately and only applies it after you give the green light. You can always roll it back.',
  },
  {
    q: 'What if I update my website content later?',
    a: 'Pronto is "diff-aware" — it tracks what changed. If you update a paragraph on your homepage, only that paragraph gets re-translated. You don\'t pay to re-translate everything every time.',
  },
  {
    q: 'Can I set a tone — formal vs. casual?',
    a: 'Yes. You can tell Pronto to use formal language (great for law firms, medical offices) or a casual, friendly tone (great for restaurants, retail, fitness). It will match that style across every page.',
  },
  {
    q: 'Do I need a developer to use this?',
    a: 'The initial setup takes a developer about five minutes. After that, most things — approving translations, choosing languages, requesting updates — happen through a simple dashboard that anyone can use.',
  },
  {
    q: 'What about my phone number, address, and brand name?',
    a: 'Those stay exactly as they are. Pronto knows not to translate things like contact details, URLs, or terms you want to keep in English (like your business name). You can also add a custom "do not translate" list.',
  },
  {
    q: 'How much does it cost?',
    a: 'Pronto offers a free tier for small sites, and paid plans starting at $49/month for unlimited translations. See the pricing page for details.',
  },
]

export default function GuidePage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen" style={{ background: '#09090b' }}>

        {/* Hero */}
        <section className="relative pt-28 pb-16 px-4 overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 40% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 70%)' }}
          />
          <div className="relative max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-xs font-medium border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 rounded-full px-3.5 py-1.5 mb-8">
              <Languages size={12} />
              Plain-English Guide
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-50 tracking-tight leading-tight mb-5">
              Your website,<br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                in any language.
              </span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
              No jargon. No tech degree required. Here's exactly how Pronto translates your site — and what it means for your business.
            </p>
          </div>
        </section>

        {/* Why it matters */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl p-8 sm:p-10" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)' }}>
              <Globe size={28} className="text-indigo-400 mb-5" />
              <h2 className="text-2xl font-bold text-zinc-50 mb-4">Why translate your website?</h2>
              <div className="space-y-3 text-zinc-400 leading-relaxed">
                <p>
                  Over <span className="text-zinc-200 font-medium">75% of internet users</span> prefer to browse in their native language — even if they speak some English. If your site is English-only, you're invisible to a huge chunk of potential customers.
                </p>
                <p>
                  A plumber in Twin Falls, Idaho with a Spanish-language site doesn't just get more calls — he gets <span className="text-zinc-200 font-medium">calls from the customers his competitors are missing.</span>
                </p>
                <p>
                  Pronto makes adding a second (or third) language as simple as flipping a switch.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works — steps */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-zinc-50 mb-2">How it works</h2>
            <p className="text-zinc-500 mb-10">Five steps from "English only" to "ready for the world."</p>

            <div className="space-y-4">
              {STEPS.map((step, i) => (
                <div key={i} className="flex gap-5 p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="shrink-0 text-2xl font-black tabular-nums" style={{ color: 'rgba(99,102,241,0.4)', fontVariantNumeric: 'tabular-nums' }}>
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-zinc-100 mb-1.5">{step.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-zinc-50 mb-10">What you get</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Zap, title: 'Fast turnaround', body: 'Most sites fully translated within 24 hours of setup.' },
                { icon: CheckCircle, title: 'You approve first', body: 'Review everything before a single word goes live on your site.' },
                { icon: Clock, title: 'Auto-updates', body: 'Change your English content? Only the new parts get re-translated — automatically.' },
                { icon: MessageSquare, title: 'Tone control', body: 'Set formal or casual tone to match your brand across every language.' },
                { icon: ShieldCheck, title: 'Nothing breaks', body: 'Your live site is untouched until you approve. Roll back any time.' },
                { icon: Globe, title: '20+ languages', body: 'Spanish, Japanese, French, German, Portuguese, Korean, Chinese, Arabic, and more.' },
              ].map(({ icon: Icon, title, body }) => (
                <div key={title} className="flex gap-4 p-5 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <Icon size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-zinc-200 mb-1">{title}</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Languages */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-zinc-50 mb-2">Available languages</h2>
            <p className="text-zinc-500 mb-8">More added regularly. Don't see yours? <Link href="/contact" className="text-indigo-400 hover:text-indigo-300">Ask us.</Link></p>
            <div className="flex flex-wrap gap-3">
              {LANGUAGES.map(({ flag, name }) => (
                <div key={name} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-zinc-300"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <span>{flag}</span> {name}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-zinc-50 mb-2">Common questions</h2>
            <p className="text-zinc-500 mb-10">Straight answers, no runaround.</p>
            <div className="space-y-4">
              {FAQS.map(({ q, a }) => (
                <div key={q} className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-sm font-semibold text-zinc-100 mb-2">{q}</p>
                  <p className="text-sm text-zinc-400 leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="rounded-2xl p-10 sm:p-14" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.08) 100%)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <h2 className="text-3xl font-bold text-zinc-50 mb-4">
                Ready to reach more customers?
              </h2>
              <p className="text-zinc-400 mb-8 max-w-md mx-auto leading-relaxed">
                Ask your web developer to connect Pronto to your site. It takes five minutes — and your site could be multilingual by tomorrow.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/signup"
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-7 py-3 rounded-lg transition-colors text-sm"
                >
                  Get started free <ArrowRight size={14} />
                </Link>
                <Link
                  href="/pricing"
                  className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 font-medium px-5 py-3 rounded-lg transition-colors text-sm"
                >
                  See pricing
                </Link>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
