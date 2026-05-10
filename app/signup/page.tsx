"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Check } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) { setError(data.error ?? "Signup failed"); return; }
      // After signup, log in automatically
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (loginRes.ok) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } catch {
      setError("Could not connect. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Nav />
      <main className="min-h-screen flex items-center justify-center pt-14 pb-20 px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block text-2xl font-bold tracking-tight mb-1">
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">P</span>
              <span className="text-zinc-50">ronto</span>
            </Link>
            <p className="text-sm text-zinc-500 mt-1">Start free — no credit card required</p>
          </div>

          <div className="flex flex-col gap-1.5 mb-6">
            {["Free Flex plan forever", "All 14 platforms supported", "CLI + web dashboard"].map(item => (
              <div key={item} className="flex items-center gap-2 text-xs text-zinc-500">
                <Check size={12} className="text-emerald-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-7">
            {error && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-950/20 px-4 py-2.5">
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full bg-zinc-800/50 border border-zinc-700 text-zinc-200 placeholder-zinc-600 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={8}
                  placeholder="Min 8 characters"
                  className="w-full bg-zinc-800/50 border border-zinc-700 text-zinc-200 placeholder-zinc-600 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Creating account…" : "Create free account"}
              </button>
            </form>

            <p className="text-xs text-zinc-600 text-center mt-4">
              By signing up you agree to our{" "}
              <Link href="/terms" className="text-zinc-500 hover:text-zinc-300">Terms</Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-zinc-500 hover:text-zinc-300">Privacy Policy</Link>.
            </p>
          </div>

          <p className="text-center text-xs text-zinc-600 mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-zinc-400 hover:text-zinc-200 transition-colors">Sign in</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
