import Link from "next/link";
import { Check, X } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { PricingCard } from "@/components/PricingCard";

const COMPARE_ROWS = [
  { feature: "CLI tool (init, translate, ship)", flex: true, studio: true, agency: true },
  { feature: "Web translate (paste JSON, no install)", flex: true, studio: true, agency: true },
  { feature: "Git-native diffs — only pay for changed strings", flex: true, studio: true, agency: true },
  { feature: "All 14 platforms (React, Next.js, Vue, Flutter, iOS, Android, WordPress, Webflow, Shopify, Framer, Phoenix, go-i18n…)", flex: true, studio: true, agency: true },
  { feature: "Words included / month", flex: "Pay as you go", studio: "100K", agency: "300K" },
  { feature: "Overage rate per 1K words", flex: "$0.79", studio: "$0.69", agency: "$0.59" },
  { feature: "API keys", flex: "1", studio: "5", agency: "Unlimited" },
  { feature: "Translation memory", flex: false, studio: "coming soon", agency: "coming soon" },
  { feature: "Team members", flex: false, studio: "coming soon", agency: "coming soon" },
  { feature: "CI/CD GitHub Action", flex: false, studio: "coming soon", agency: "coming soon" },
  { feature: "Priority support", flex: false, studio: true, agency: true },
];

type CellValue = boolean | string;

function Cell({ val }: { val: CellValue }) {
  if (val === true) return <Check size={16} className="text-emerald-500 mx-auto" />;
  if (val === false) return <X size={14} className="text-zinc-700 mx-auto" />;
  return <span className="text-xs text-zinc-300">{val}</span>;
}

export default function PricingPage() {
  return (
    <>
      <Nav />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-zinc-50 mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-zinc-400 max-w-md mx-auto">
              No seat fees. No hidden charges. Pay for the words you translate.
            </p>
          </div>

          {/* Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
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
                "All 14 supported platforms",
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
              wordsIncluded="100K words included / month"
              overage="$0.69 / 1K words over"
              features={[
                "Everything in Flex",
                "100K words / month",
                "5 API keys",
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
              wordsIncluded="300K words included / month"
              overage="$0.59 / 1K words over"
              features={[
                "Everything in Studio",
                "300K words / month",
                "Unlimited API keys",
                "Priority support",
              ]}
              ctaLabel="Talk to us"
              ctaHref="/signup?plan=agency"
            />
          </div>

          <p className="text-center text-xs text-zinc-600 mb-20">
            Beta pricing. Lock in your rate for life when you upgrade during beta.
          </p>

          {/* Comparison table */}
          <div>
            <h2 className="text-xl font-semibold text-zinc-100 mb-6">
              Full feature comparison
            </h2>
            <div className="rounded-xl border border-zinc-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/60">
                    <th className="text-left px-5 py-3 text-zinc-400 font-medium w-1/2">
                      Feature
                    </th>
                    <th className="text-center px-4 py-3 text-zinc-400 font-medium">
                      Flex
                    </th>
                    <th className="text-center px-4 py-3 text-indigo-300 font-medium">
                      Studio
                    </th>
                    <th className="text-center px-4 py-3 text-zinc-400 font-medium">
                      Agency
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARE_ROWS.map((row, i) => (
                    <tr
                      key={row.feature}
                      className={`border-b border-zinc-800/60 ${
                        i % 2 === 0 ? "bg-transparent" : "bg-zinc-900/20"
                      }`}
                    >
                      <td className="px-5 py-3 text-zinc-400">{row.feature}</td>
                      <td className="px-4 py-3 text-center">
                        <Cell val={row.flex} />
                      </td>
                      <td className="px-4 py-3 text-center bg-indigo-950/10">
                        <Cell val={row.studio} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Cell val={row.agency} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ / notes */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-base font-semibold text-zinc-200 mb-2">
                What counts as a &quot;word&quot;?
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Words are counted in the source language (English by default).
                Translated text to multiple target languages counts once per
                unique string — not once per language.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-200 mb-2">
                Do unused words roll over?
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                No. Included words reset on your billing cycle. Overage charges
                are billed at the end of each month.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-200 mb-2">
                Can I change plans later?
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Yes. Upgrade or downgrade at any time. Beta users who lock in
                a rate keep it for life, even as prices increase.
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-200 mb-2">
                Is the CLI open source?
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed">
                The CLI is open source on GitHub. The translation engine and
                dashboard are hosted services. You always own your locale files.
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-10 text-center">
            <h2 className="text-2xl font-bold text-zinc-50 mb-3">
              Not sure which plan fits?
            </h2>
            <p className="text-zinc-400 mb-6">
              Start on Flex for free. Upgrade any time — or{" "}
              <Link href="mailto:hi@pronto.dev" className="text-indigo-400 hover:text-indigo-300">
                talk to us
              </Link>{" "}
              and we&apos;ll help you decide.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-7 py-3 rounded-lg transition-colors text-sm"
            >
              Start free — no card required
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
