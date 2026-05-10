import Link from "next/link";
import { Scan, Languages, GitCommit, FolderKanban, ShieldCheck, Repeat } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TerminalDemo } from "@/components/TerminalDemo";
import { PlatformGrid } from "@/components/PlatformGrid";
import { PricingCard } from "@/components/PricingCard";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        {/* ─── Hero ──────────────────────────────────────────── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-4 overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(99,102,241,0.15) 0%, transparent 70%)",
            }}
          />

          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 text-xs font-medium border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 rounded-full px-3.5 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Now in beta — lock in your rate for life
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                Ship in any language,
              </span>
              <br />
              <span className="text-zinc-50">for any platform.</span>
            </h1>

            <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              The only localization tool that works for your React app{" "}
              <span className="text-zinc-300">AND</span> your WordPress site.
              Diff-aware. Git-native. Built for teams.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <Link
                href="/signup"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-7 py-3 rounded-lg transition-colors text-sm"
              >
                Start free — no card required
              </Link>
              <Link
                href="/docs"
                className="w-full sm:w-auto border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 font-medium px-7 py-3 rounded-lg transition-colors text-sm"
              >
                Read the docs
              </Link>
            </div>

            <p className="text-xs text-zinc-600 mb-14">
              Used by developers at companies shipping in 40+ languages
            </p>

            <TerminalDemo />
          </div>
        </section>

        {/* ─── Platforms ──────────────────────────────────────── */}
        <section id="platforms" className="py-24 px-4 border-t border-zinc-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-50 mb-4">
                Every platform. One tool.
              </h2>
              <p className="text-zinc-400 max-w-xl mx-auto">
                Forthwith supports 7 developer frameworks. Pronto supports all
                of them — plus the platforms your clients actually use.
              </p>
            </div>
            <PlatformGrid />
          </div>
        </section>

        {/* ─── How it works ───────────────────────────────────── */}
        <section id="features" className="py-24 px-4 border-t border-zinc-800/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-50 mb-4">
                Three commands. Fully localized.
              </h2>
              <p className="text-zinc-400 max-w-lg mx-auto">
                Pronto slots into your existing workflow. No new dashboards
                required — unless you want one.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center mb-4">
                  <Scan size={17} className="text-indigo-400" />
                </div>
                <p className="text-xs text-indigo-400 font-mono mb-2">Step 1 — Scan</p>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                  Discover every string
                </h3>
                <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
                  <code className="text-zinc-300 font-mono">pronto init</code>{" "}
                  walks your codebase or CMS and finds every translatable string,
                  learning your file structure as it goes.
                </p>
                <div className="rounded-lg bg-[#0e0e10] border border-zinc-800 p-3 font-mono text-xs">
                  <span className="text-emerald-400">$ </span>
                  <span className="text-zinc-300">pronto init</span>
                  <br />
                  <span className="text-emerald-400">✓ </span>
                  <span className="text-zinc-500">847 strings found across 23 files</span>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="w-9 h-9 rounded-lg bg-violet-500/15 border border-violet-500/30 flex items-center justify-center mb-4">
                  <Languages size={17} className="text-violet-400" />
                </div>
                <p className="text-xs text-violet-400 font-mono mb-2">Step 2 — Translate</p>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                  Only what changed
                </h3>
                <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
                  <code className="text-zinc-300 font-mono">pronto translate</code>{" "}
                  shows the cost upfront, then translates only strings that
                  changed since the last run.
                </p>
                <div className="rounded-lg bg-[#0e0e10] border border-zinc-800 p-3 font-mono text-xs">
                  <span className="text-emerald-400">$ </span>
                  <span className="text-zinc-300">pronto translate --target es,ja</span>
                  <br />
                  <span className="text-zinc-500">12 changed strings · ~$0.01</span>
                  <br />
                  <span className="text-emerald-400">✓ </span>
                  <span className="text-zinc-500">Done. 2 files updated.</span>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-4">
                  <GitCommit size={17} className="text-emerald-400" />
                </div>
                <p className="text-xs text-emerald-400 font-mono mb-2">Step 3 — Ship</p>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                  Clean diffs, clean history
                </h3>
                <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
                  Pronto writes minimal diffs. Commit the updated locale files
                  like any other change — or let CI handle it automatically.
                </p>
                <div className="rounded-lg bg-[#0e0e10] border border-zinc-800 p-3 font-mono text-xs">
                  <span className="text-emerald-400">$ </span>
                  <span className="text-zinc-300">git add . && git commit</span>
                  <br />
                  <span className="text-zinc-500">-m &apos;chore: localize&apos;</span>
                  <br />
                  <span className="text-emerald-400">✓ </span>
                  <span className="text-zinc-500">Ready to deploy</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── For Teams ──────────────────────────────────────── */}
        <section className="py-24 px-4 border-t border-zinc-800/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-50 mb-4">
                Built for agencies and teams.
              </h2>
              <p className="text-zinc-400 max-w-lg mx-auto">
                Non-developers never need to open a terminal. Everyone works
                from the same source of truth.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
                <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center mb-4">
                  <FolderKanban size={17} className="text-indigo-400" />
                </div>
                <h3 className="text-base font-semibold text-zinc-100 mb-2">
                  Multi-project dashboard
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Manage localization across every client site from one place.
                  See progress, approve translations, and track spending at a glance.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
                <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center mb-4">
                  <ShieldCheck size={17} className="text-violet-400" />
                </div>
                <h3 className="text-base font-semibold text-zinc-100 mb-2">
                  Role-based access
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Devs push strings. Translators approve them. Clients review.
                  Every role gets exactly the permissions it needs — nothing more.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
                <div className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center mb-4">
                  <Repeat size={17} className="text-emerald-400" />
                </div>
                <h3 className="text-base font-semibold text-zinc-100 mb-2">
                  Shared translation memory
                </h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Previously translated strings are reused across all your
                  projects. The more you ship, the less you pay on repeat content.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Pricing ────────────────────────────────────────── */}
        <section id="pricing" className="py-24 px-4 border-t border-zinc-800/50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-50 mb-4">
                Pricing
              </h2>
              <p className="text-zinc-400 max-w-md mx-auto">
                Pay for what you use. Scale when you&apos;re ready.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <PricingCard
                name="Flex"
                price="$0"
                description="For individuals experimenting with localization."
                wordsIncluded="No monthly commitment"
                overage="$0.79 / 1K words"
                features={[
                  "Pay as you go",
                  "All CLI commands",
                  "Git-native diffs",
                  "All supported platforms",
                  "Community support",
                ]}
                ctaLabel="Start free"
                ctaHref="/signup"
              />
              <PricingCard
                name="Studio"
                price="$49"
                period="mo"
                description="For small teams shipping features fast."
                wordsIncluded="150K words included / month"
                overage="$0.55 / 1K words over"
                features={[
                  "Everything in Flex",
                  "150K words / month",
                  "Team members",
                  "Translation memory",
                  "CI/CD integration",
                  "Priority support",
                ]}
                highlighted
                ctaLabel="Start Studio trial"
                ctaHref="/signup?plan=studio"
              />
              <PricingCard
                name="Agency"
                price="$149"
                period="mo"
                description="For agencies managing localization at scale."
                wordsIncluded="500K words included / month"
                overage="$0.40 / 1K words over"
                features={[
                  "Everything in Studio",
                  "500K words / month",
                  "Multi-project dashboard",
                  "Role-based access",
                  "Shared translation memory",
                  "Priority support + SLA",
                ]}
                ctaLabel="Talk to us"
                ctaHref="/signup?plan=agency"
              />
            </div>

            <p className="text-center text-xs text-zinc-600">
              Beta pricing. Lock in your rate for life when you upgrade during beta.
            </p>
          </div>
        </section>

        {/* ─── CTA Banner ─────────────────────────────────────── */}
        <section className="py-20 px-4 border-t border-zinc-800/50">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-50 mb-4">
              Ready to ship in every language?
            </h2>
            <p className="text-zinc-400 mb-8">
              Join developers who are localizing faster with less effort.
              Start free — no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/signup"
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-7 py-3 rounded-lg transition-colors text-sm"
              >
                Get started free
              </Link>
              <Link
                href="/docs"
                className="w-full sm:w-auto border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-zinc-100 font-medium px-7 py-3 rounded-lg transition-colors text-sm"
              >
                Read the docs
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
