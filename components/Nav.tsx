"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? "bg-[#09090b]/90 backdrop-blur-md border-b border-zinc-800"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              P
            </span>
            <span className="text-zinc-50">ronto</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/#features"
            className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#platforms"
            className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
          >
            Platforms
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/guide"
            className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
          >
            Guide
          </Link>
          <Link
            href="/docs"
            className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
          >
            Docs
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors px-3 py-1.5 rounded-md"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/translate"
            className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-md font-medium transition-colors"
          >
            Translate now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-zinc-400 hover:text-zinc-50 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#09090b]/95 backdrop-blur-md border-b border-zinc-800 px-4 py-4 flex flex-col gap-4">
          <Link
            href="/#features"
            className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            Features
          </Link>
          <Link
            href="/#platforms"
            className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            Platforms
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            Pricing
          </Link>
          <Link
            href="/guide"
            className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            Guide
          </Link>
          <Link
            href="/docs"
            className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            Docs
          </Link>
          <div className="flex flex-col gap-2 pt-2 border-t border-zinc-800">
            <Link
              href="/dashboard"
              className="text-sm text-zinc-400 hover:text-zinc-50 transition-colors py-1.5"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/dashboard/translate"
              className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-md font-medium transition-colors text-center"
              onClick={() => setOpen(false)}
            >
              Translate now
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
