"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  LayoutDashboard, Languages, Key, CreditCard, Settings,
  Check, Zap, Building2, Rocket, ExternalLink
} from "lucide-react";

const SIDEBAR = [
  { icon: LayoutDashboard, label: "Projects", href: "/dashboard" },
  { icon: Languages, label: "Translations", href: "/dashboard#translations" },
  { icon: Key, label: "API Keys", href: "/dashboard/api-keys" },
  { icon: CreditCard, label: "Billing", href: "/dashboard/billing", active: true },
  { icon: Settings, label: "Settings", href: "/dashboard#settings" },
];

const PLANS = [
  {
    key: "flex",
    name: "Flex",
    icon: Zap,
    price: "$0.79",
    unit: "per 1,000 words",
    description: "Pay only for what you translate. No monthly commitment.",
    features: [
      "All 14 platforms",
      "Diff-aware — only changed strings",
      "Translation memory",
      "1 API key",
    ],
    cta: "Start for free",
    highlight: false,
  },
  {
    key: "studio",
    name: "Studio",
    icon: Rocket,
    price: "$49",
    unit: "per month",
    description: "100,000 words included. Best for growing teams.",
    features: [
      "Everything in Flex",
      "100K words / month",
      "Overage at $0.69/1K",
      "5 API keys",
      "Priority support",
    ],
    cta: "Upgrade to Studio",
    highlight: true,
  },
  {
    key: "agency",
    name: "Agency",
    icon: Building2,
    price: "$149",
    unit: "per month",
    description: "300,000 words + team seats. Built for agencies.",
    features: [
      "Everything in Studio",
      "300K words / month",
      "Overage at $0.59/1K",
      "Unlimited API keys",
      "Team seats (up to 10)",
      "Dedicated support",
    ],
    cta: "Upgrade to Agency",
    highlight: false,
  },
];

type SubData = { plan: string; status: string | null; words_included: number; current_period_end: string | null }

function BillingContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);
  const [sub, setSub] = useState<SubData | null>(null);

  const hasSubscription = sub !== null && sub.plan !== 'flex' && sub.status === 'active';

  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");

  useEffect(() => {
    fetch('/api/subscription')
      .then(r => r.json())
      .then(d => setSub(d as SubData))
      .catch(() => {});
  }, []);

  async function checkout(plan: string) {
    setLoading(plan);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json() as { url?: string; error?: string };
    if (data.url) window.location.href = data.url;
    else {
      alert(data.error ?? "Something went wrong");
      setLoading(null);
    }
  }

  async function openPortal() {
    setLoading("portal");
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json() as { url?: string };
    if (data.url) window.location.href = data.url;
    else setLoading(null);
  }

  return (
    <main className="flex-1 px-8 py-10 max-w-5xl">
      <h1 className="text-2xl font-bold mb-1">Billing</h1>
      <p className="text-zinc-400 text-sm mb-8">
        Manage your plan and payment method.
      </p>

      {success && (
        <div className="mb-6 p-4 rounded-xl border border-emerald-700/60 bg-emerald-950/30 flex items-center gap-2 text-sm text-emerald-300">
          <Check size={15} />
          Subscription activated! You&apos;re all set.
        </div>
      )}
      {canceled && (
        <div className="mb-6 p-4 rounded-xl border border-zinc-700 bg-zinc-900/40 text-sm text-zinc-400">
          Checkout canceled — your plan was not changed.
        </div>
      )}

      {hasSubscription && (
        <div className="mb-8 p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              Manage subscription
              <span className="text-[10px] font-semibold uppercase tracking-wide bg-indigo-600/30 text-indigo-300 px-2 py-0.5 rounded-full">
                {sub?.plan}
              </span>
            </p>
            <p className="text-xs text-zinc-500 mt-0.5">Update payment method, download invoices, or cancel.</p>
          </div>
          <button
            onClick={openPortal}
            disabled={loading === "portal"}
            className="flex items-center gap-1.5 px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors disabled:opacity-40"
          >
            <ExternalLink size={13} />
            {loading === "portal" ? "Opening…" : "Billing portal"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANS.map(plan => {
          const Icon = plan.icon;
          const isCurrent = sub?.plan === plan.key && (sub?.status === 'active' || plan.key === 'flex');
          return (
            <div
              key={plan.key}
              className={`relative rounded-xl border p-6 flex flex-col ${
                plan.highlight
                  ? "border-indigo-600/60 bg-indigo-950/20"
                  : "border-zinc-800 bg-zinc-900/40"
              }`}
            >
              {isCurrent && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-semibold bg-emerald-600 text-white px-3 py-0.5 rounded-full">
                  Current plan
                </span>
              )}
              {!isCurrent && plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[11px] font-semibold bg-indigo-600 text-white px-3 py-0.5 rounded-full">
                  Most popular
                </span>
              )}

              <div className="flex items-center gap-2.5 mb-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${plan.highlight ? "bg-indigo-600/30" : "bg-zinc-800"}`}>
                  <Icon size={15} className={plan.highlight ? "text-indigo-400" : "text-zinc-400"} />
                </div>
                <span className="font-semibold text-zinc-100">{plan.name}</span>
              </div>

              <div className="mb-1">
                <span className="text-3xl font-bold text-zinc-50">{plan.price}</span>
                <span className="text-sm text-zinc-500 ml-1">{plan.unit}</span>
              </div>
              <p className="text-xs text-zinc-500 mb-5">{plan.description}</p>

              <ul className="space-y-2 mb-6 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-zinc-400">
                    <Check size={12} className={plan.highlight ? "text-indigo-400" : "text-emerald-500"} />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => !isCurrent && checkout(plan.key)}
                disabled={!!loading || isCurrent}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-40 ${
                  isCurrent
                    ? "bg-zinc-800/50 text-zinc-500 cursor-default"
                    : plan.highlight
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white"
                    : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                }`}
              >
                {loading === plan.key ? "Redirecting…" : isCurrent ? "Current plan" : plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-zinc-600">
        All plans include a 14-day free trial. No credit card required for Flex.
      </p>
    </main>
  );
}

export default function BillingPage() {
  return (
    <div className="min-h-screen flex bg-[#09090b] text-zinc-100">
      <aside className="w-56 shrink-0 border-r border-zinc-800 flex flex-col">
        <div className="h-14 flex items-center px-5 border-b border-zinc-800">
          <Link href="/" className="text-lg font-bold tracking-tight">
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">P</span>
            <span className="text-zinc-50">ronto</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {SIDEBAR.map(({ icon: Icon, label, href, active }) => (
            <Link key={label} href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                active ? "bg-indigo-600/20 text-indigo-300 font-medium" : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">Loading…</div>}>
        <BillingContent />
      </Suspense>
    </div>
  );
}
