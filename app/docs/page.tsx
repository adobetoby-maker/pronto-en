import Link from "next/link";
import { Terminal, Layers, GitBranch, Cpu, BookOpen } from "lucide-react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

const NAV_SECTIONS = [
  {
    title: "Getting Started",
    items: [
      { label: "Quick Start", href: "/docs" },
      { label: "Installation", href: "/docs#install" },
      { label: "Configuration", href: "/docs#config" },
    ],
  },
  {
    title: "CLI Reference",
    items: [
      { label: "All Commands", href: "/docs/cli" },
      { label: "pronto init", href: "/docs/cli#init" },
      { label: "pronto translate", href: "/docs/cli#translate" },
      { label: "pronto status", href: "/docs/cli#status" },
    ],
  },
  {
    title: "Platforms",
    items: [
      { label: "Platform Guides", href: "/docs/platforms" },
      { label: "WordPress", href: "/docs/platforms#wordpress" },
      { label: "Webflow", href: "/docs/platforms#webflow" },
      { label: "React / Next.js", href: "/docs/platforms#react" },
    ],
  },
  {
    title: "CI/CD Integration",
    items: [
      { label: "GitHub Actions", href: "/docs#github-actions" },
      { label: "GitLab CI", href: "/docs#gitlab-ci" },
    ],
  },
];

export default function DocsPage() {
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
            <h1 className="text-3xl font-bold text-zinc-50 mb-3">
              Pronto Documentation
            </h1>
            <p className="text-zinc-400">
              Get your project fully localized in minutes. This guide assumes
              you have Node.js 18+ installed.
            </p>
          </div>

          {/* Quick start */}
          <section id="quickstart" className="mb-12">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <Terminal size={18} className="text-indigo-400" />
              Quick Start
            </h2>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-zinc-500 mb-2">
                  <strong className="text-zinc-300">1.</strong> Install the Pronto CLI globally:
                </p>
                <div className="rounded-lg bg-[#0e0e10] border border-zinc-800 p-4 font-mono text-sm">
                  <span className="text-emerald-400">$ </span>
                  <span className="text-zinc-300">npm install -g pronto-cli</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-zinc-500 mb-2">
                  <strong className="text-zinc-300">2.</strong> Authenticate with your Pronto account:
                </p>
                <div className="rounded-lg bg-[#0e0e10] border border-zinc-800 p-4 font-mono text-sm">
                  <span className="text-emerald-400">$ </span>
                  <span className="text-zinc-300">pronto login</span>
                  <br />
                  <span className="text-zinc-500">Opening browser to authenticate...</span>
                  <br />
                  <span className="text-emerald-400">✓ </span>
                  <span className="text-zinc-500">Logged in as you@example.com</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-zinc-500 mb-2">
                  <strong className="text-zinc-300">3.</strong> Run <code className="text-zinc-300 font-mono text-xs">pronto init</code> from your project root:
                </p>
                <div className="rounded-lg bg-[#0e0e10] border border-zinc-800 p-4 font-mono text-sm">
                  <span className="text-emerald-400">$ </span>
                  <span className="text-zinc-300">cd my-project && pronto init</span>
                  <br />
                  <span className="text-zinc-500">Detecting framework... Next.js</span>
                  <br />
                  <span className="text-zinc-500">Scanning for translatable strings...</span>
                  <br />
                  <span className="text-emerald-400">✓ </span>
                  <span className="text-zinc-500">847 strings discovered across 23 files</span>
                  <br />
                  <span className="text-zinc-500">Config written to pronto.config.json</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-zinc-500 mb-2">
                  <strong className="text-zinc-300">4.</strong> Translate to your target languages:
                </p>
                <div className="rounded-lg bg-[#0e0e10] border border-zinc-800 p-4 font-mono text-sm">
                  <span className="text-emerald-400">$ </span>
                  <span className="text-zinc-300">pronto translate --target es,ja</span>
                  <br />
                  <span className="text-zinc-500">847 strings · estimated cost $0.67</span>
                  <br />
                  <span className="text-zinc-500">Proceed? (y/n) y</span>
                  <br />
                  <span className="text-emerald-400">✓ </span>
                  <span className="text-zinc-500">Done in 4.2s. 2 files written.</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-zinc-500 mb-2">
                  <strong className="text-zinc-300">5.</strong> Commit and ship:
                </p>
                <div className="rounded-lg bg-[#0e0e10] border border-zinc-800 p-4 font-mono text-sm">
                  <span className="text-emerald-400">$ </span>
                  <span className="text-zinc-300">{"git add . && git commit -m 'chore: localize'"}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Docs links */}
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-zinc-100 mb-5">
              Explore the docs
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  icon: <Terminal size={16} className="text-indigo-400" />,
                  title: "CLI Reference",
                  desc: "Full command list with flags and examples.",
                  href: "/docs/cli",
                },
                {
                  icon: <Layers size={16} className="text-violet-400" />,
                  title: "Platform Guides",
                  desc: "Setup snippets for every supported platform.",
                  href: "/docs/platforms",
                },
                {
                  icon: <GitBranch size={16} className="text-emerald-400" />,
                  title: "CI/CD Integration",
                  desc: "Auto-localize on every push with GitHub Actions.",
                  href: "/docs#github-actions",
                },
                {
                  icon: <Cpu size={16} className="text-zinc-400" />,
                  title: "API Reference",
                  desc: "REST API for custom integrations and scripts.",
                  href: "/docs#api",
                },
              ].map((card) => (
                <Link
                  key={card.title}
                  href={card.href}
                  className="flex items-start gap-3 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 hover:bg-zinc-900/60 p-5 transition-all"
                >
                  <div className="mt-0.5">{card.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200 mb-1">
                      {card.title}
                    </p>
                    <p className="text-xs text-zinc-500">{card.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Config */}
          <section id="config" className="mb-12">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-violet-400" />
              Configuration
            </h2>
            <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
              After running <code className="text-zinc-300 font-mono text-xs">pronto init</code>,
              a <code className="text-zinc-300 font-mono text-xs">pronto.config.json</code> file
              is created at your project root.
            </p>
            <div className="rounded-lg bg-[#0e0e10] border border-zinc-800 p-4 font-mono text-xs leading-relaxed">
              <span className="text-zinc-600">{"// pronto.config.json"}</span>
              <br />
              <span className="text-zinc-300">{"{"}</span>
              <br />
              <span className="text-zinc-300 ml-4">&quot;framework&quot;:</span>
              <span className="text-emerald-400"> &quot;nextjs&quot;</span><span className="text-zinc-300">,</span>
              <br />
              <span className="text-zinc-300 ml-4">&quot;localesDir&quot;:</span>
              <span className="text-emerald-400"> &quot;./public/locales&quot;</span><span className="text-zinc-300">,</span>
              <br />
              <span className="text-zinc-300 ml-4">&quot;sourceLocale&quot;:</span>
              <span className="text-emerald-400"> &quot;en&quot;</span><span className="text-zinc-300">,</span>
              <br />
              <span className="text-zinc-300 ml-4">&quot;targetLocales&quot;:</span>
              <span className="text-zinc-300"> [</span>
              <span className="text-emerald-400">&quot;es&quot;</span><span className="text-zinc-300">,</span>
              <span className="text-emerald-400"> &quot;ja&quot;</span><span className="text-zinc-300">]</span>
              <br />
              <span className="text-zinc-300">{"}"}</span>
            </div>
          </section>

          {/* CI/CD */}
          <section id="github-actions" className="mb-12">
            <h2 className="text-xl font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <GitBranch size={18} className="text-emerald-400" />
              GitHub Actions
            </h2>
            <p className="text-sm text-zinc-500 mb-4 leading-relaxed">
              Auto-localize on every push to <code className="text-zinc-300 font-mono text-xs">main</code>.
            </p>
            <div className="rounded-lg bg-[#0e0e10] border border-zinc-800 p-4 font-mono text-xs leading-relaxed">
              <span className="text-zinc-500"># .github/workflows/localize.yml</span>
              <br />
              <span className="text-indigo-300">name</span><span className="text-zinc-300">: Localize</span>
              <br />
              <span className="text-indigo-300">on</span><span className="text-zinc-300">:</span>
              <br />
              <span className="text-zinc-300 ml-2">push:</span>
              <br />
              <span className="text-zinc-300 ml-4">branches: [main]</span>
              <br />
              <span className="text-indigo-300">jobs</span><span className="text-zinc-300">:</span>
              <br />
              <span className="text-zinc-300 ml-2">localize:</span>
              <br />
              <span className="text-zinc-300 ml-4">runs-on: ubuntu-latest</span>
              <br />
              <span className="text-zinc-300 ml-4">steps:</span>
              <br />
              <span className="text-zinc-300 ml-6">- uses: actions/checkout@v4</span>
              <br />
              <span className="text-zinc-300 ml-6">- run: npm install -g pronto-cli</span>
              <br />
              <span className="text-zinc-300 ml-6">- run: pronto translate --auto-approve</span>
              <br />
              <span className="text-zinc-300 ml-8">env:</span>
              <br />
              <span className="text-zinc-300 ml-10">PRONTO_TOKEN:</span>
              <span className="text-emerald-400"> {`\${{ secrets.PRONTO_TOKEN }}`}</span>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
