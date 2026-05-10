import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-zinc-50 mb-3">Privacy Policy</h1>
          <p className="text-sm text-zinc-600 mb-10">Last updated: May 2026</p>
          <div className="prose prose-invert prose-sm max-w-none text-zinc-400 space-y-6">
            <p>
              Pronto (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, and share information about you
              when you use our services.
            </p>
            <h2 className="text-zinc-200 text-lg font-semibold">Information we collect</h2>
            <p>
              We collect information you provide directly to us (email address, project data),
              information we collect automatically (usage data, CLI telemetry with your consent),
              and information from third parties (OAuth providers).
            </p>
            <h2 className="text-zinc-200 text-lg font-semibold">How we use your information</h2>
            <p>
              We use your information to provide and improve our services, process translations,
              communicate with you, and comply with legal obligations. We do not sell your data.
            </p>
            <h2 className="text-zinc-200 text-lg font-semibold">Contact</h2>
            <p>
              Questions? Email us at{" "}
              <a href="mailto:privacy@pronto.dev" className="text-indigo-400 hover:text-indigo-300">
                privacy@pronto.dev
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
