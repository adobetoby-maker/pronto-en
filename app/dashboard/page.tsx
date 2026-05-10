import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard, Languages, CreditCard, Settings, Plus, ArrowRight, Key, LogOut } from "lucide-react";
import { getSessionUserId } from "@/lib/auth-session";
import { supabaseAdmin } from "@/lib/supabase-server";

const SIDEBAR_ITEMS = [
  { icon: LayoutDashboard, label: "Projects", href: "/dashboard", active: true },
  { icon: Languages, label: "Translations", href: "/dashboard#translations" },
  { icon: Key, label: "API Keys", href: "/dashboard/api-keys" },
  { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
  { icon: Settings, label: "Settings", href: "/dashboard#settings" },
];

export default async function DashboardPage() {
  const userId = await getSessionUserId();
  if (!userId) redirect("/login");

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("email, full_name")
    .eq("id", userId)
    .single();

  const { count: keyCount } = await supabaseAdmin
    .from("api_keys")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  const initial = (profile?.full_name ?? profile?.email ?? "?")[0].toUpperCase();
  const displayEmail = profile?.email ?? "your account";
  const plan = "Flex";

  return (
    <div className="min-h-screen flex bg-[#09090b]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 border-r border-zinc-800 flex flex-col">
        <div className="h-14 flex items-center px-5 border-b border-zinc-800">
          <Link href="/" className="text-lg font-bold tracking-tight">
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">P</span>
            <span className="text-zinc-50">ronto</span>
          </Link>
        </div>

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

        <div className="px-4 py-4 border-t border-zinc-800">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-full bg-indigo-600/40 flex items-center justify-center text-xs font-bold text-indigo-300">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-zinc-300 truncate">{displayEmail}</p>
              <p className="text-[10px] text-zinc-600">{plan} plan</p>
            </div>
          </div>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="flex items-center gap-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              <LogOut size={12} />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-zinc-800 flex items-center justify-between px-6">
          <h1 className="text-sm font-semibold text-zinc-200">Projects</h1>
          <button className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">
            <Plus size={13} />
            New project
          </button>
        </header>

        <main className="flex-1 flex items-center justify-center p-10">
          <div className="max-w-md text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
              <Languages size={24} className="text-indigo-400" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-100 mb-2">
              Welcome to Pronto, {profile?.full_name ?? displayEmail.split("@")[0]}
            </h2>
            <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
              {keyCount
                ? `You have ${keyCount} API key${keyCount !== 1 ? "s" : ""}. Run the CLI to start translating.`
                : "Create your first project or grab an API key to start translating with the CLI."}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard/api-keys"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                <Key size={15} />
                {keyCount ? "Manage API Keys" : "Create API Key"}
              </Link>
              <Link
                href="/docs"
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                Read the docs <ArrowRight size={13} />
              </Link>
            </div>

            <div className="mt-10 pt-8 border-t border-zinc-800/60 text-left">
              <p className="text-xs font-semibold text-zinc-600 uppercase tracking-widest mb-3">
                CLI quickstart
              </p>
              <div className="rounded-lg bg-[#0e0e10] border border-zinc-800 p-3 font-mono text-xs space-y-1">
                <div><span className="text-emerald-400">$ </span><span className="text-zinc-300">npm install -g pronto-cli</span></div>
                <div><span className="text-emerald-400">$ </span><span className="text-zinc-300">pronto login</span></div>
                <div><span className="text-emerald-400">$ </span><span className="text-zinc-300">pronto init</span></div>
                <div><span className="text-emerald-400">$ </span><span className="text-zinc-300">pronto translate</span></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
