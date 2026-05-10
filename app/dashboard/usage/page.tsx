"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Languages, Key, CreditCard, Settings,
  TrendingUp, Globe, Clock,
} from "lucide-react";

const SIDEBAR = [
  { icon: LayoutDashboard, label: "Projects", href: "/dashboard" },
  { icon: Languages, label: "Translate", href: "/dashboard/translate" },
  { icon: Key, label: "API Keys", href: "/dashboard/api-keys" },
  { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
  { icon: Settings, label: "Settings", href: "/dashboard#settings" },
];

const LANG_NAMES: Record<string, string> = {
  es: "Spanish", fr: "French", de: "German", it: "Italian", pt: "Portuguese",
  ja: "Japanese", zh: "Chinese", ko: "Korean", ar: "Arabic", ru: "Russian",
  nl: "Dutch", pl: "Polish", tr: "Turkish", sv: "Swedish", hi: "Hindi",
};

type UsageData = {
  words_this_month: number;
  cost_usd: string;
  by_language: Record<string, number>;
  recent: { words: number; target_language: string; created_at: string }[];
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days}d ago`;
  if (hrs > 0) return `${hrs}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "just now";
}

export default function UsagePage() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/usage-web")
      .then(r => r.json())
      .then(d => { setData(d as UsageData); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const maxLangWords = data ? Math.max(...Object.values(data.by_language), 1) : 1;
  const monthName = new Date().toLocaleString("en", { month: "long" });

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
          {SIDEBAR.map(({ icon: Icon, label, href }) => (
            <Link key={label} href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 px-8 py-10 max-w-4xl">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp size={16} className="text-indigo-400" />
          <h1 className="text-2xl font-bold">Usage</h1>
        </div>
        <p className="text-zinc-400 text-sm mb-8">{monthName} — current billing period</p>

        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 rounded-xl bg-zinc-900/40 border border-zinc-800 animate-pulse" />
            ))}
          </div>
        )}

        {!loading && data && (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <p className="text-xs text-zinc-500 mb-1 font-medium">Words translated</p>
                <p className="text-3xl font-bold text-zinc-100">
                  {data.words_this_month.toLocaleString()}
                </p>
                <p className="text-xs text-zinc-600 mt-1">this month</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <p className="text-xs text-zinc-500 mb-1 font-medium">Cost</p>
                <p className="text-3xl font-bold text-zinc-100">${data.cost_usd}</p>
                <p className="text-xs text-zinc-600 mt-1">at $0.79/1K words</p>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
                <p className="text-xs text-zinc-500 mb-1 font-medium">Languages used</p>
                <p className="text-3xl font-bold text-zinc-100">
                  {Object.keys(data.by_language).length}
                </p>
                <p className="text-xs text-zinc-600 mt-1">
                  {Object.keys(data.by_language).map(c => LANG_NAMES[c] ?? c).join(", ") || "none yet"}
                </p>
              </div>
            </div>

            {/* By language */}
            {Object.keys(data.by_language).length > 0 && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 mb-6">
                <div className="flex items-center gap-2 mb-5">
                  <Globe size={14} className="text-zinc-500" />
                  <h2 className="text-sm font-semibold text-zinc-300">Words by language</h2>
                </div>
                <div className="space-y-3">
                  {Object.entries(data.by_language)
                    .sort(([, a], [, b]) => b - a)
                    .map(([code, words]) => (
                      <div key={code}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-zinc-400">{LANG_NAMES[code] ?? code}</span>
                          <span className="text-sm font-mono text-zinc-400">{words.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all"
                            style={{ width: `${(words / maxLangWords) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Recent events */}
            {data.recent.length > 0 ? (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
                <div className="flex items-center gap-2 px-6 py-4 border-b border-zinc-800">
                  <Clock size={14} className="text-zinc-500" />
                  <h2 className="text-sm font-semibold text-zinc-300">Recent translations</h2>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-800/60">
                      <th className="text-left px-6 py-2.5 text-xs font-medium text-zinc-500">Language</th>
                      <th className="text-right px-6 py-2.5 text-xs font-medium text-zinc-500">Words</th>
                      <th className="text-right px-6 py-2.5 text-xs font-medium text-zinc-500">Cost</th>
                      <th className="text-right px-6 py-2.5 text-xs font-medium text-zinc-500">When</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/40">
                    {data.recent.map((e, i) => (
                      <tr key={i} className="hover:bg-zinc-800/20 transition-colors">
                        <td className="px-6 py-3 text-zinc-300">
                          {LANG_NAMES[e.target_language] ?? e.target_language}
                        </td>
                        <td className="px-6 py-3 text-right font-mono text-zinc-400">{e.words.toLocaleString()}</td>
                        <td className="px-6 py-3 text-right font-mono text-zinc-500">
                          ${((e.words / 1000) * 0.79).toFixed(3)}
                        </td>
                        <td className="px-6 py-3 text-right text-zinc-600 text-xs">{timeAgo(e.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-10 text-center">
                <Languages size={28} className="text-zinc-800 mx-auto mb-3" />
                <p className="text-sm text-zinc-600">No translations yet this month.</p>
                <Link
                  href="/dashboard/translate"
                  className="inline-block mt-3 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Translate something →
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
