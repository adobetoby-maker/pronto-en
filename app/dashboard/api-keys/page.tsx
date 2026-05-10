"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Key,
  Copy,
  Trash2,
  Plus,
  LayoutDashboard,
  Languages,
  CreditCard,
  Settings,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  last_used_at: string | null;
  created_at: string;
}

interface NewKey extends ApiKey {
  key: string; // raw key shown once
}

const SIDEBAR = [
  { icon: LayoutDashboard, label: "Projects", href: "/dashboard" },
  { icon: Languages, label: "Translations", href: "/dashboard#translations" },
  { icon: Key, label: "API Keys", href: "/dashboard/api-keys", active: true },
  { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
  { icon: Settings, label: "Settings", href: "/dashboard#settings" },
];

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [revealed, setRevealed] = useState<NewKey | null>(null);
  const [copied, setCopied] = useState(false);
  const [revoking, setRevoking] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/api-keys");
    if (res.ok) setKeys(await res.json());
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function createKey() {
    if (!newKeyName.trim()) return;
    setCreating(true);
    const res = await fetch("/api/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newKeyName.trim() }),
    });
    if (res.ok) {
      const data: NewKey = await res.json();
      setRevealed(data);
      setNewKeyName("");
      await load();
    }
    setCreating(false);
  }

  async function revokeKey(id: string) {
    setRevoking(id);
    await fetch(`/api/api-keys/${id}`, { method: "DELETE" });
    setKeys(k => k.filter(x => x.id !== id));
    if (revealed?.id === id) setRevealed(null);
    setRevoking(null);
  }

  async function copyKey(key: string) {
    await navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function fmt(iso: string | null) {
    if (!iso) return "Never";
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <div className="min-h-screen flex bg-[#09090b] text-zinc-100">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-zinc-800 flex flex-col">
        <div className="h-14 flex items-center px-5 border-b border-zinc-800">
          <Link href="/" className="text-lg font-bold tracking-tight">
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">P</span>
            <span className="text-zinc-50">ronto</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {SIDEBAR.map(({ icon: Icon, label, href, active }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-indigo-600/20 text-indigo-300 font-medium"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 px-8 py-10 max-w-3xl">
        <h1 className="text-2xl font-bold mb-1">API Keys</h1>
        <p className="text-zinc-400 text-sm mb-8">
          Use these keys to authenticate the{" "}
          <code className="bg-zinc-800 px-1 rounded text-xs">pronto</code> CLI.
          Keys are shown only once at creation.
        </p>

        {/* Revealed key banner */}
        {revealed && (
          <div className="mb-6 p-4 rounded-xl border border-emerald-700/60 bg-emerald-950/30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={15} className="text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-300">
                Key created — copy it now. You won&apos;t see it again.
              </span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <code className="flex-1 text-xs bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 font-mono text-emerald-300 overflow-x-auto select-all">
                {revealed.key}
              </code>
              <button
                onClick={() => copyKey(revealed.key)}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 text-xs bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors"
              >
                {copied ? <CheckCircle size={13} className="text-emerald-400" /> : <Copy size={13} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-zinc-500 mt-2">
              Add to your shell: <code className="text-zinc-400">export PRONTO_API_KEY=&quot;{revealed.key}&quot;</code>
            </p>
          </div>
        )}

        {/* Create new key */}
        <div className="mb-8 p-5 rounded-xl border border-zinc-800 bg-zinc-900/40">
          <h2 className="text-sm font-semibold mb-3 text-zinc-200">Create new key</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyName}
              onChange={e => setNewKeyName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && createKey()}
              placeholder="Key name (e.g. CI/CD, Local dev)"
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={createKey}
              disabled={creating || !newKeyName.trim()}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-lg transition-colors"
            >
              <Plus size={14} />
              {creating ? "Creating…" : "Create"}
            </button>
          </div>
        </div>

        {/* Key list */}
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <div className="px-5 py-3 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Your keys</span>
            <span className="text-xs text-zinc-500">{keys.length} key{keys.length !== 1 ? "s" : ""}</span>
          </div>

          {loading ? (
            <div className="px-5 py-8 text-center text-zinc-500 text-sm">Loading…</div>
          ) : keys.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <Key size={28} className="mx-auto mb-3 text-zinc-700" />
              <p className="text-zinc-500 text-sm">No API keys yet. Create one above.</p>
            </div>
          ) : (
            <ul className="divide-y divide-zinc-800">
              {keys.map(k => (
                <li key={k.id} className="px-5 py-4 flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                    <Key size={14} className="text-zinc-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-zinc-200">{k.name}</p>
                    <p className="text-xs text-zinc-500 font-mono mt-0.5">
                      {k.key_prefix}••••••••••••••••••••••••••••••••••••
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-zinc-500">Created {fmt(k.created_at)}</p>
                    <p className="text-xs text-zinc-600 mt-0.5">Last used: {fmt(k.last_used_at)}</p>
                  </div>
                  <button
                    onClick={() => revokeKey(k.id)}
                    disabled={revoking === k.id}
                    className="shrink-0 p-2 text-zinc-600 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors disabled:opacity-40"
                    title="Revoke key"
                  >
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* CLI usage hint */}
        <div className="mt-6 p-4 rounded-xl border border-zinc-800 bg-zinc-900/20">
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="text-amber-400 mt-0.5 shrink-0" />
            <div className="text-xs text-zinc-500 space-y-1">
              <p>
                <span className="text-zinc-300 font-medium">Quick start:</span> After copying your key, run:
              </p>
              <code className="block bg-zinc-800 rounded px-2 py-1.5 text-zinc-300 font-mono">
                npm install -g pronto-cli<br />
                pronto login
              </code>
              <p className="mt-1">
                Then paste your key when prompted. Or set{" "}
                <code className="text-zinc-400">PRONTO_API_KEY</code> in your CI environment directly.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
