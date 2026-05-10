import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Check } from "lucide-react";

export default function SignupPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen flex items-center justify-center pt-14 pb-20 px-4">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block text-2xl font-bold tracking-tight mb-1">
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">P</span>
              <span className="text-zinc-50">ronto</span>
            </Link>
            <p className="text-sm text-zinc-500 mt-1">
              Start free — no credit card required
            </p>
          </div>

          {/* Value props */}
          <div className="flex flex-col gap-1.5 mb-6">
            {[
              "Free Flex plan forever",
              "All 14 platforms supported",
              "CLI + web dashboard",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-xs text-zinc-500">
                <Check size={12} className="text-emerald-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>

          {/* Card */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-7">
            {/* Auth coming soon notice */}
            <div className="mb-6 rounded-lg border border-indigo-500/20 bg-indigo-500/5 px-4 py-3">
              <p className="text-xs text-indigo-300 text-center">
                Auth backend coming soon —
                join the waitlist below to be first in line.
              </p>
            </div>

            {/* Google OAuth */}
            <button
              type="button"
              disabled
              className="w-full flex items-center justify-center gap-2.5 border border-zinc-700 bg-zinc-800/50 text-zinc-400 text-sm font-medium py-2.5 rounded-lg mb-5 cursor-not-allowed opacity-60"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-xs text-zinc-600">or</span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            {/* Waitlist form */}
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full bg-zinc-800/50 border border-zinc-700 text-zinc-200 placeholder-zinc-600 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  disabled
                  className="w-full bg-zinc-800/50 border border-zinc-700 text-zinc-400 placeholder-zinc-600 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors cursor-not-allowed opacity-60"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
              >
                Join the waitlist
              </button>
            </form>

            <p className="text-xs text-zinc-600 text-center mt-4">
              By signing up you agree to our{" "}
              <Link href="/terms" className="text-zinc-500 hover:text-zinc-300">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-zinc-500 hover:text-zinc-300">
                Privacy Policy
              </Link>
              .
            </p>
          </div>

          <p className="text-center text-xs text-zinc-600 mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-zinc-400 hover:text-zinc-200 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
