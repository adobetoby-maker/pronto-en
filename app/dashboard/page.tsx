import Link from "next/link";
import { LayoutDashboard, Languages, Users, CreditCard, Settings, Plus, ArrowRight, Key } from "lucide-react";

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Projects", href: "/dashboard", active: true },
  { icon: Languages, label: "Translations", href: "/dashboard#translations" },
  { icon: Users, label: "Team", href: "/dashboard#team" },
  { icon: Key, label: "API Keys", href: "/dashboard/api-keys" },
  { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
  { icon: Settings, label: "Settings", href: "/dashboard#settings" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex bg-[#09090b]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-zinc-800 flex flex-col">
        {/* Logo */}
        <div className="h-14 flex items-center px-5 border-b border-zinc-800">
          <Link href="/" className="text-lg font-bold tracking-tight">
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">P</span>
            <span className="text-zinc-50">ronto</span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {SIDEBAR_ITEMS.map(({ icon: Icon, label, href, active }) => (
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

        {/* Account */}
        <div className="px-4 py-4 border-t border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-indigo-600/40 flex items-center justify-center text-xs font-bold text-indigo-300">
              Y
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-zinc-300 truncate">you@example.com</p>
              <p className="text-[10px] text-zinc-600">Flex plan</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-14 border-b border-zinc-800 flex items-center justify-between px-6">
          <h1 className="text-sm font-semibold text-zinc-200">Projects</h1>
          <button className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
            <Plus size={13} />
            New project
          </button>
        </header>

        {/* Body */}
        <main className="flex-1 flex items-center justify-center p-10">
          <div className="max-w-md text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
              <Languages size={24} className="text-indigo-400" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-100 mb-2">
              Welcome to Pronto
            </h2>
            <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
              Create your first project to start localizing. Connect your
              codebase or site builder and Pronto handles the rest.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
                <Plus size={15} />
                Create first project
              </button>
              <Link
                href="/docs"
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Read the docs <ArrowRight size={13} />
              </Link>
            </div>

            <div className="mt-10 pt-8 border-t border-zinc-800/60 text-left">
              <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest mb-3">
                Or connect via CLI
              </p>
              <div className="rounded-lg bg-[#0e0e10] border border-zinc-800 p-3 font-mono text-xs space-y-1">
                <div>
                  <span className="text-emerald-400">$ </span>
                  <span className="text-zinc-300">npm install -g pronto-cli</span>
                </div>
                <div>
                  <span className="text-emerald-400">$ </span>
                  <span className="text-zinc-300">pronto login</span>
                </div>
                <div>
                  <span className="text-emerald-400">$ </span>
                  <span className="text-zinc-300">pronto init</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
