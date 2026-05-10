import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-[#09090b]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <span className="text-xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  P
                </span>
                <span className="text-zinc-50">ronto</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-500 max-w-xs">
              Ship in any language, for any platform. Diff-aware localization
              for every framework and site builder.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
              Product
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/pricing"
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="/docs"
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Docs
              </Link>
              <Link
                href="/docs/cli"
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                CLI Reference
              </Link>
              <Link
                href="/docs/platforms"
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Platform Guides
              </Link>
              <Link
                href="https://github.com/adobetoby-maker/pronto-cli"
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                GitHub (CLI)
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
              Legal
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/privacy"
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Pronto. All rights reserved.
          </p>
          <p className="text-xs text-zinc-600">
            Made with{" "}
            <span className="text-indigo-400">♥</span>{" "}
            by the Worker-Bee team
          </p>
        </div>
      </div>
    </footer>
  );
}
