import Link from "next/link";
import { Check } from "lucide-react";

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  wordsIncluded: string;
  overage: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
}

export function PricingCard({
  name,
  price,
  period,
  description,
  wordsIncluded,
  overage,
  features,
  highlighted = false,
  ctaLabel = "Get started",
  ctaHref = "/signup",
}: PricingCardProps) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-7 ${
        highlighted
          ? "border-indigo-500/60 bg-indigo-950/30 shadow-xl shadow-indigo-950/30"
          : "border-zinc-800 bg-zinc-900/50"
      }`}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold bg-indigo-500 text-white px-3 py-1 rounded-full">
          Most popular
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-zinc-100 mb-1">{name}</h3>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-zinc-50">{price}</span>
          {period && (
            <span className="text-sm text-zinc-500">/{period}</span>
          )}
        </div>
        <p className="text-sm text-zinc-500 mt-1">{wordsIncluded}</p>
        <p className="text-xs text-zinc-600 mt-0.5">{overage}</p>
      </div>

      <ul className="flex flex-col gap-2.5 mb-8 flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-sm text-zinc-400">
            <Check size={15} className="text-emerald-500 mt-0.5 shrink-0" />
            {f}
          </li>
        ))}
      </ul>

      <Link
        href={ctaHref}
        className={`block text-center text-sm font-medium py-2.5 rounded-lg transition-colors ${
          highlighted
            ? "bg-indigo-600 hover:bg-indigo-500 text-white"
            : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
        }`}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
