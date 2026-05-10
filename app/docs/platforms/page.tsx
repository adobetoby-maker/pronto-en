import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

interface Platform {
  id: string;
  name: string;
  badge?: string;
  badgeColor?: string;
  intro: string;
  install: string;
  config: string;
  note?: string;
}

const PLATFORMS: Platform[] = [
  {
    id: "wordpress",
    name: "WordPress",
    badge: "now supported",
    badgeColor: "emerald",
    intro:
      "Pronto scans your theme and plugin PHP files for translatable strings wrapped in WordPress i18n functions (__(), _e(), _n(), esc_html__(), etc.) and generates/updates your .pot and .po files.",
    install: "$ pronto init --framework wordpress --locales-dir ./languages",
    config: `{
  "framework": "wordpress",
  "localesDir": "./languages",
  "textDomain": "my-theme",
  "sourceLocale": "en",
  "targetLocales": ["es_ES", "ja"]
}`,
    note:
      "Pronto writes .po files compatible with Loco Translate and standard WordPress plugins. No extra plugins needed on the WordPress side.",
  },
  {
    id: "webflow",
    name: "Webflow",
    badge: "now supported",
    badgeColor: "emerald",
    intro:
      "Pronto connects to your Webflow site via the Webflow Data API. It extracts all static text from CMS collections and page content, translates only what changed, and pushes updates back.",
    install: "$ pronto init --framework webflow --webflow-token $WEBFLOW_TOKEN",
    config: `{
  "framework": "webflow",
  "siteId": "your-site-id",
  "sourceLocale": "en",
  "targetLocales": ["es", "ja"]
}`,
    note:
      "Requires a Webflow API token with CMS read/write permissions. Content staging is supported — Pronto can push to a staging locale before publishing.",
  },
  {
    id: "shopify",
    name: "Shopify",
    badge: "now supported",
    badgeColor: "emerald",
    intro:
      "Pronto works with Shopify's Translate & Adapt app and the Translations API. It scans your theme's locale JSON files and syncs product / collection metafields to target languages.",
    install: "$ pronto init --framework shopify --shop my-store.myshopify.com",
    config: `{
  "framework": "shopify",
  "shop": "my-store.myshopify.com",
  "localesDir": "./locales",
  "sourceLocale": "en",
  "targetLocales": ["es", "ja"]
}`,
  },
  {
    id: "squarespace",
    name: "Squarespace",
    badge: "now supported",
    badgeColor: "emerald",
    intro:
      "Pronto integrates with Squarespace's Developer Platform. Export your site strings, translate with Pronto, and import the updated locale files back via the Squarespace CLI.",
    install: "$ pronto init --framework squarespace",
    config: `{
  "framework": "squarespace",
  "localesDir": "./static/locales",
  "sourceLocale": "en",
  "targetLocales": ["es", "ja"]
}`,
  },
  {
    id: "framer",
    name: "Framer",
    badge: "now supported",
    badgeColor: "emerald",
    intro:
      "Pronto syncs with Framer Sites via the Framer Localization API. It reads your source locale, translates changed strings, and commits updated locale files back to your Framer project.",
    install: "$ pronto init --framework framer --framer-token $FRAMER_TOKEN",
    config: `{
  "framework": "framer",
  "projectId": "your-project-id",
  "sourceLocale": "en",
  "targetLocales": ["es", "ja"]
}`,
  },
  {
    id: "wix",
    name: "Wix",
    badge: "now supported",
    badgeColor: "emerald",
    intro:
      "Pronto integrates with Wix Multilingual via the Wix Studio API. It reads page content, CMS collections, and app texts, then pushes translated content to each target locale.",
    install: "$ pronto init --framework wix --wix-api-key $WIX_API_KEY",
    config: `{
  "framework": "wix",
  "siteId": "your-site-id",
  "sourceLocale": "en",
  "targetLocales": ["es", "ja"]
}`,
  },
  {
    id: "react",
    name: "React / Next.js",
    intro:
      "Pronto works with any react-i18next, next-intl, or i18next setup. It scans your source files for t() calls and updates your locale JSON files.",
    install: "$ pronto init --framework nextjs",
    config: `{
  "framework": "nextjs",
  "localesDir": "./public/locales",
  "sourceLocale": "en",
  "targetLocales": ["es", "ja"]
}`,
  },
  {
    id: "vue",
    name: "Vue / Nuxt",
    intro:
      "Works with vue-i18n. Pronto scans for $t() calls in .vue files and updates your messages JSON files.",
    install: "$ pronto init --framework vue",
    config: `{
  "framework": "vue",
  "localesDir": "./src/locales",
  "sourceLocale": "en",
  "targetLocales": ["es", "ja"]
}`,
  },
  {
    id: "flutter",
    name: "Flutter",
    intro:
      "Works with Flutter's arb-based localization. Pronto scans .arb files and generates updated arb files for each target locale.",
    install: "$ pronto init --framework flutter",
    config: `{
  "framework": "flutter",
  "localesDir": "./lib/l10n",
  "sourceLocale": "en",
  "targetLocales": ["es", "ja"]
}`,
  },
];

export default function PlatformsPage() {
  return (
    <>
      <Nav />
      <div className="min-h-screen pt-14 flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-zinc-800 pt-8 px-4 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <div className="mb-6">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">
              Getting Started
            </p>
            <Link href="/docs" className="block text-sm text-zinc-500 hover:text-zinc-200 py-1 pl-2">
              Quick Start
            </Link>
          </div>
          <div className="mb-6">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">
              CLI Reference
            </p>
            <Link href="/docs/cli" className="block text-sm text-zinc-500 hover:text-zinc-200 py-1 pl-2">
              All Commands
            </Link>
          </div>
          <div>
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">
              Platforms
            </p>
            {PLATFORMS.map((p) => (
              <Link
                key={p.id}
                href={`#${p.id}`}
                className="block text-sm text-zinc-500 hover:text-zinc-200 py-1 pl-2 transition-colors flex items-center gap-1.5"
              >
                {p.name}
                {p.badge && (
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 rounded px-1 py-0.5 font-semibold">
                    new
                  </span>
                )}
              </Link>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 max-w-3xl px-6 py-10">
          <div className="mb-10">
            <p className="text-xs text-indigo-400 font-mono mb-2">Platform Guides</p>
            <h1 className="text-3xl font-bold text-zinc-50 mb-3">
              Supported Platforms
            </h1>
            <p className="text-zinc-400">
              Setup snippets for every platform Pronto supports. The six site-builder
              platforms are unique to Pronto — you won&apos;t find WordPress, Webflow,
              Shopify, Squarespace, Framer, or Wix support anywhere else.
            </p>
          </div>

          {PLATFORMS.map((p) => (
            <section key={p.id} id={p.id} className="mb-14 scroll-mt-20">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-xl font-semibold text-zinc-100">{p.name}</h2>
                {p.badge && (
                  <span className="text-xs font-semibold bg-emerald-500 text-black rounded-full px-2.5 py-0.5">
                    {p.badge}
                  </span>
                )}
              </div>

              <p className="text-sm text-zinc-400 mb-4 leading-relaxed">{p.intro}</p>

              <div className="mb-3">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
                  Initialize
                </p>
                <div className="rounded-lg bg-[#0e0e10] border border-zinc-800 p-4 font-mono text-sm">
                  <span className="text-emerald-400">$ </span>
                  <span className="text-zinc-300">{p.install.slice(2)}</span>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-1.5">
                  pronto.config.json
                </p>
                <div className="rounded-lg bg-[#0e0e10] border border-zinc-800 p-4 font-mono text-xs leading-relaxed text-zinc-400 whitespace-pre">
                  {p.config}
                </div>
              </div>

              {p.note && (
                <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
                  <p className="text-xs text-indigo-300 leading-relaxed">{p.note}</p>
                </div>
              )}

              <hr className="border-zinc-800 mt-10" />
            </section>
          ))}
        </main>
      </div>
      <Footer />
    </>
  );
}
