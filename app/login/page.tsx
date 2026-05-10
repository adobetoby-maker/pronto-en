"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot-password state
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) { setError(data.error ?? "Login failed"); return; }
      router.push("/dashboard");
    } catch {
      setError("Could not connect. Try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setResetLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail }),
      });
    } finally {
      setResetSent(true);
      setResetLoading(false);
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
            <p className="text-sm text-zinc-500 mt-1">Sign in to your account</p>
          </div>

          {!showReset ? (
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
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-zinc-400">Password</label>
                    <button
                      type="button"
                      onClick={() => setShowReset(true)}
                      className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full bg-zinc-800/50 border border-zinc-700 text-zinc-200 placeholder-zinc-600 rounded-lg px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? "Signing in…" : "Sign in"}
                </button>
              </form>
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-7">
              {resetSent ? (
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-600/20 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-zinc-200 mb-1">Check your email</p>
                  <p className="text-xs text-zinc-500 mb-5">
                    If <span className="text-zinc-400">{resetEmail}</span> is registered, you&apos;ll get a reset link shortly.
                  </p>
                  <button
                    onClick={() => { setShowReset(false); setResetSent(false); setResetEmail(""); }}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Back to sign in
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm font-medium text-zinc-200 mb-1">Reset your password</p>
                  <p className="text-xs text-zinc-500 mb-5">Enter your email and we&apos;ll send a reset link.</p>
                  <form onSubmit={handleReset} className="space-y-4">
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={e => setResetEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full bg-zinc-800/50 border border-zinc-700 text-zinc-200 placeholder-zinc-600 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {resetLoading ? "Sending…" : "Send reset link"}
                    </button>
                  </form>
                  <button
                    onClick={() => setShowReset(false)}
                    className="mt-4 w-full text-center text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    Back to sign in
                  </button>
                </>
              )}
            </div>
          )}

          <p className="text-center text-xs text-zinc-600 mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-zinc-400 hover:text-zinc-200 transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
