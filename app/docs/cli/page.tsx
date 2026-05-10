import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const NAV_SECTIONS = [
  {
    title: "Getting Started",
    items: [{ label: "Quick Start", href: "/docs" }],
  },
  {
    title: "CLI Reference",
    items: [
      { label: "All Commands", href: "/docs/cli" },
      { label: "pronto init", href: "/docs/cli#init" },
      { label: "pronto translate", href: "/docs/cli#translate" },
      { label: "pronto status", href: "/docs/cli#status" },
      { label: "pronto login", href: "/docs/cli#login" },
      { label: "pronto logout", href: "/docs/cli#logout" },
      { label: "pronto whoami", href: "/docs/cli#whoami" },
    ],
  },
  {
    title: "Platforms",
    items: [{ label: "Platform Guides", href: "/docs/platforms" }],
  },
];

interface Command {
  id: string;
  name: string;
  description: string;
  usage: string;
  flags: { flag: string; description: string; default?: string }[];
  exitCodes: { code: number; meaning: string }[];
  example: string;
}

const COMMANDS: Command[] = [
  {
    id: "init",
    name: "pronto init",
    description:
      "Scan the current project for translatable strings and generate a pronto.config.json. Detects your framework automatically. Run once per project.",
    usage: "pronto init [options]",
    flags: [
      { flag: "--framework <name>", description: "Override framework detection (nextjs, vue, wordpress, webflow, etc.)" },
      { flag: "--locales-dir <path>", description: "Override where locale files are written", default: "./public/locales" },
      { flag: "--source-locale <lang>", description: "Source language code", default: "en" },
      { flag: "--dry-run", description: "Print discovered strings without writing config" },
    ],
    exitCodes: [
      { code: 0, meaning: "Success" },
      { code: 1, meaning: "No translatable strings found" },
      { code: 2, meaning: "Framework not recognized — use --framework" },
    ],
    example: "$ pronto init --framework wordpress --locales-dir ./languages",
  },
  {
    id: "translate",
    name: "pronto translate",
    description:
      "Translate strings that changed since the last run. Shows cost estimate before proceeding. Uses your Pronto translation memory to skip previously translated strings.",
    usage: "pronto translate [options]",
    flags: [
      { flag: "--target <langs>", description: "Comma-separated target language codes (e.g. es,ja,fr)", default: "from config" },
      { flag: "--all", description: "Re-translate all strings, not just changed ones" },
      { flag: "--auto-approve", description: "Skip the cost confirmation prompt (useful for CI)" },
      { flag: "--dry-run", description: "Show what would be translated without making API calls" },
      { flag: "--model <model>", description: "Translation model to use", default: "pronto-v2" },
    ],
    exitCodes: [
      { code: 0, meaning: "Success — all strings translated" },
      { code: 1, meaning: "Authentication error — run pronto login" },
      { code: 2, meaning: "Insufficient words remaining on plan" },
      { code: 3, meaning: "Aborted by user at cost confirmation" },
    ],
    example: "$ pronto translate --target es,ja --auto-approve",
  },
  {
    id: "status",
    name: "pronto status",
    description:
      "Show the translation status of your project: how many strings are translated, stale, or missing for each target locale.",
    usage: "pronto status [options]",
    flags: [
      { flag: "--locale <lang>", description: "Show status for a single locale only" },
      { flag: "--json", description: "Output machine-readable JSON" },
    ],
    exitCodes: [
      { code: 0, meaning: "All locales up to date" },
      { code: 1, meaning: "Stale or missing translations exist" },
    ],
    example: "$ pronto status --locale ja",
  },
  {
    id: "whoami",
    name: "pronto whoami",
    description: "Print the currently authenticated account and plan details.",
    usage: "pronto whoami",
    flags: [],
    exitCodes: [
      { code: 0, meaning: "Authenticated" },
      { code: 1, meaning: "Not authenticated — run pronto login" },
    ],
    example: "$ pronto whoami\nyou@example.com  ·  Studio plan  ·  62,400 / 150,000 words used",
  },
  {
    id: "login",
    name: "pronto login",
    description:
      "Authenticate with your Pronto account. Opens a browser window for OAuth. The token is stored in ~/.pronto/credentials.",
    usage: "pronto login [options]",
    flags: [
      { flag: "--token <token>", description: "Authenticate with a pre-generated API token (for CI environments)" },
    ],
    exitCodes: [
      { code: 0, meaning: "Authentication successful" },
      { code: 1, meaning: "Authentication failed or cancelled" },
    ],
    example: "$ pronto login --token $PRONTO_TOKEN",
  },
  {
    id: "logout",
    name: "pronto logout",
    description: "Remove stored credentials from the local machine.",
    usage: "pronto logout",
    flags: [],
    exitCodes: [
      { code: 0, meaning: "Credentials removed" },
    ],
    example: "$ pronto logout",
  },
];

export default function CLIReferencePage() {
  return (
    <>
      <Nav />
      <div className="min-h-screen pt-14 flex">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-zinc-800 pt-8 px-4 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="mb-6">
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">
                {section.title}
              </p>
              {section.items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block text-sm text-zinc-500 hover:text-zinc-200 transition-colors py-1 pl-2 rounded"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 max-w-3xl px-6 py-10">
          <div className="mb-10">
            <p className="text-xs text-indigo-400 font-mono mb-2">CLI Reference</p>
            <h1 className="text-3xl font-bold text-zinc-50 mb-3">
              Commands
            </h1>
            <p className="text-zinc-400">
              All CLI commands, flags, and exit codes. Install the CLI with{" "}
              <code className="text-zinc-300 font-mono text-xs bg-zinc-800 px-1.5 py-0.5 rounded">
                npm install -g pronto-cli
              </code>
              .
            </p>
          </div>

          {/* Command index */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-12">
            {COMMANDS.map((cmd) => (
              <Link
                key={cmd.id}
                href={`#${cmd.id}`}
                className="text-xs font-mono text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 bg-indigo-500/5 rounded px-2 py-1.5 transition-all text-center"
              >
                {cmd.id}
              </Link>
            ))}
          </div>

          {/* Command entries */}
          {COMMANDS.map((cmd) => (
            <section key={cmd.id} id={cmd.id} className="mb-14 scroll-mt-20">
              <div className="flex items-baseline gap-3 mb-3">
                <h2 className="text-xl font-semibold text-zinc-100 font-mono">
                  {cmd.name}
                </h2>
              </div>
              <p className="text-sm text-zinc-400 mb-4 leading-relaxed">
                {cmd.description}
              </p>

              {/* Usage */}
              <div className="rounded-lg bg-[#0e0e10] border border-zinc-800 p-4 font-mono text-sm mb-4">
                <span className="text-emerald-400">$ </span>
                <span className="text-zinc-300">{cmd.usage}</span>
              </div>

              {/* Flags */}
              {cmd.flags.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">
                    Flags
                  </p>
                  <div className="rounded-lg border border-zinc-800 overflow-hidden">
                    {cmd.flags.map((f, i) => (
                      <div
                        key={f.flag}
                        className={`flex flex-col sm:flex-row sm:items-start px-4 py-3 text-sm gap-1 sm:gap-4 ${
                          i > 0 ? "border-t border-zinc-800/60" : ""
                        }`}
                      >
                        <code className="shrink-0 text-indigo-300 font-mono text-xs w-full sm:w-64">
                          {f.flag}
                        </code>
                        <span className="text-zinc-500">
                          {f.description}
                          {f.default && (
                            <span className="text-zinc-600 ml-1">
                              (default: {f.default})
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exit codes */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">
                  Exit Codes
                </p>
                <div className="flex flex-wrap gap-2">
                  {cmd.exitCodes.map((ec) => (
                    <div
                      key={ec.code}
                      className="text-xs border border-zinc-800 rounded px-2.5 py-1.5 flex items-center gap-2"
                    >
                      <code
                        className={`font-mono font-bold ${
                          ec.code === 0 ? "text-emerald-400" : "text-zinc-400"
                        }`}
                      >
                        {ec.code}
                      </code>
                      <span className="text-zinc-500">{ec.meaning}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example */}
              <div>
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-2">
                  Example
                </p>
                <div className="rounded-lg bg-[#0e0e10] border border-zinc-800 p-4 font-mono text-xs leading-relaxed">
                  {cmd.example.split("\n").map((line, i) => (
                    <div key={i}>
                      {line.startsWith("$") ? (
                        <>
                          <span className="text-emerald-400">$ </span>
                          <span className="text-zinc-300">{line.slice(2)}</span>
                        </>
                      ) : (
                        <span className="text-zinc-500">{line}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </main>
      </div>
      <Footer />
    </>
  );
}
