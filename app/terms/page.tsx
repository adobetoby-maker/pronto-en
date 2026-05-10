import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="pt-24 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-zinc-50 mb-3">Terms of Service</h1>
          <p className="text-sm text-zinc-600 mb-10">Last updated: May 2026</p>
          <div className="space-y-6 text-zinc-400 text-sm leading-relaxed">
            <p>
              These Terms of Service (&quot;Terms&quot;) govern your use of Pronto services operated by
              Worker-Bee. By accessing or using our services, you agree to be bound by these Terms.
            </p>
            <h2 className="text-zinc-200 text-lg font-semibold">Use of Services</h2>
            <p>
              You may use Pronto for lawful purposes. You are responsible for the content you
              submit for translation. You retain ownership of all content you submit.
            </p>
            <h2 className="text-zinc-200 text-lg font-semibold">Billing</h2>
            <p>
              Paid plans are billed monthly. Overage charges are calculated at the end of each
              billing period. Beta pricing is locked in for life when you upgrade during the beta period.
            </p>
            <h2 className="text-zinc-200 text-lg font-semibold">Termination</h2>
            <p>
              You may cancel your account at any time. We may terminate accounts that violate
              these Terms. Upon termination, you can export your locale files.
            </p>
            <h2 className="text-zinc-200 text-lg font-semibold">Contact</h2>
            <p>
              Questions? Email us at{" "}
              <a href="mailto:legal@pronto.dev" className="text-indigo-400 hover:text-indigo-300">
                legal@pronto.dev
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
