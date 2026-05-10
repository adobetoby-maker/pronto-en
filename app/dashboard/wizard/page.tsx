"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Languages, Key, CreditCard, TrendingUp, Settings,
  ArrowRight, ArrowLeft, Check, Download, Terminal, Sparkles, LogOut,
  Globe, FileText, FileJson, Loader2,
} from "lucide-react";

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const SIDEBAR = [
  { icon: LayoutDashboard, label: "Projects",     href: "/dashboard" },
  { icon: Languages,       label: "Translate",    href: "/dashboard/translate" },
  { icon: TrendingUp,      label: "Usage",        href: "/dashboard/usage" },
  { icon: Key,             label: "API Keys",     href: "/dashboard/api-keys" },
  { icon: CreditCard,      label: "Billing",      href: "/dashboard/billing" },
  { icon: Settings,        label: "Settings",     href: "/dashboard#settings" },
];

// ─── Platforms ────────────────────────────────────────────────────────────────

const PLATFORMS = [
  { id: "react",     label: "React / Next.js", emoji: "⚛️",  fmt: "JSON (react-i18next, next-intl)" },
  { id: "vue",       label: "Vue / Nuxt",      emoji: "🟢",  fmt: "JSON (vue-i18n)" },
  { id: "flutter",   label: "Flutter",          emoji: "🦋",  fmt: "ARB files" },
  { id: "ios",       label: "iOS / Swift",      emoji: "🍎",  fmt: "Localizable.strings" },
  { id: "android",   label: "Android",          emoji: "🤖",  fmt: "strings.xml" },
  { id: "wordpress", label: "WordPress",        emoji: "🔵",  fmt: "PO / POT files" },
  { id: "webflow",   label: "Webflow",          emoji: "🌊",  fmt: "CMS JSON export" },
  { id: "shopify",   label: "Shopify",          emoji: "🛍️", fmt: "JSON locales" },
  { id: "phoenix",   label: "Phoenix / Elixir", emoji: "🔥",  fmt: "PO files (Gettext)" },
  { id: "goI18n",    label: "go-i18n",          emoji: "🐹",  fmt: "JSON / TOML" },
  { id: "other",     label: "Other / Website",  emoji: "🌐",  fmt: "We'll extract strings from a URL" },
];

// ─── Languages ────────────────────────────────────────────────────────────────

const LANGUAGES = [
  { code: "es", name: "Spanish",    flag: "🇪🇸" },
  { code: "fr", name: "French",     flag: "🇫🇷" },
  { code: "de", name: "German",     flag: "🇩🇪" },
  { code: "it", name: "Italian",    flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇧🇷" },
  { code: "ja", name: "Japanese",   flag: "🇯🇵" },
  { code: "zh", name: "Chinese",    flag: "🇨🇳" },
  { code: "ko", name: "Korean",     flag: "🇰🇷" },
  { code: "ar", name: "Arabic",     flag: "🇸🇦" },
  { code: "ru", name: "Russian",    flag: "🇷🇺" },
  { code: "nl", name: "Dutch",      flag: "🇳🇱" },
  { code: "pl", name: "Polish",     flag: "🇵🇱" },
  { code: "tr", name: "Turkish",    flag: "🇹🇷" },
  { code: "sv", name: "Swedish",    flag: "🇸🇪" },
  { code: "hi", name: "Hindi",      flag: "🇮🇳" },
];

// ─── CLI commands ─────────────────────────────────────────────────────────────

function cliSteps(platformLabel: string, target: string) {
  return [
    { cmd: "npm install -g pronto-cli",                   comment: "Install once" },
    { cmd: "pronto login",                                comment: "Authenticate with your API key" },
    { cmd: "pronto init",                                 comment: `Scan ${platformLabel} strings in your project` },
    { cmd: `pronto translate --target ${target || "es,ja"}`, comment: "Only translates changed strings" },
  ];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function flattenJson(obj: unknown, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === "object" && v !== null && !Array.isArray(v)) {
      Object.assign(out, flattenJson(v, key));
    } else {
      out[key] = String(v);
    }
  }
  return out;
}

function wordCount(strings: Record<string, string>) {
  return Object.values(strings).reduce(
    (n, s) => n + s.trim().split(/\s+/).filter(Boolean).length, 0
  );
}

// ─── Step bar ─────────────────────────────────────────────────────────────────

const WEB_LABELS = ["Start", "Your content", "Languages", "Done"];
const CLI_LABELS = ["Start", "Platform", "CLI setup", "Done"];

function StepBar({ labels, current }: { labels: string[]; current: number }) {
  return (
    <div className="flex items-center mb-10">
      {labels.map((label, i) => {
        const done   = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                done   ? "bg-emerald-500 text-white" :
                active ? "bg-indigo-600 text-white ring-2 ring-indigo-400/40" :
                         "bg-zinc-800 text-zinc-600"
              }`}>
                {done ? <Check size={13} /> : i + 1}
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap ${active ? "text-zinc-300" : "text-zinc-600"}`}>
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div className={`h-px w-10 sm:w-16 mb-4 mx-1 transition-all ${done ? "bg-emerald-600" : "bg-zinc-800"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function WizardPage() {
  // flow state
  const [step,     setStep]     = useState(0);
  const [method,   setMethod]   = useState<"web" | "cli" | null>(null);
  const [platform, setPlatform] = useState("other");

  // string acquisition
  const [inputMode, setInputMode] = useState<"url" | "text" | "json">("url");
  const [urlInput,  setUrlInput]  = useState("");
  const [textInput, setTextInput] = useState("");
  const [jsonRaw,   setJsonRaw]   = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractErr, setExtractErr] = useState<string | null>(null);

  // translate state
  const [langs,   setLangs]   = useState<string[]>([]);
  const [results, setResults] = useState<Record<string, Record<string, string>>>({});
  const [busy,    setBusy]    = useState(false);
  const [err,     setErr]     = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  // derived
  let parsed: Record<string, string> = {};
  try { parsed = flattenJson(JSON.parse(jsonRaw || "{}")); } catch { /* */ }
  const strCount = Object.keys(parsed).length;
  const words    = wordCount(parsed);
  const cost     = ((words * langs.length) / 1000 * 0.79).toFixed(2);
  const labels   = method === "cli" ? CLI_LABELS : WEB_LABELS;

  // ── extract strings from URL or pasted text ──
  async function extract() {
    setExtracting(true);
    setExtractErr(null);
    try {
      const body = inputMode === "url"
        ? { url: urlInput }
        : { text: textInput };
      const res  = await fetch("/api/extract-strings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json() as { strings?: Record<string, string>; error?: string };
      if (data.strings) {
        setJsonRaw(JSON.stringify(data.strings, null, 2));
        setInputMode("json");
      } else {
        setExtractErr(data.error ?? "Extraction failed");
      }
    } catch {
      setExtractErr("Network error — please try again");
    }
    setExtracting(false);
  }

  // ── translate ──
  async function runTranslate() {
    if (strCount === 0 || langs.length === 0) return;
    setBusy(true);
    setErr(null);
    const out: Record<string, Record<string, string>> = {};
    for (const lang of langs) {
      try {
        const res  = await fetch("/api/web-translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ strings: parsed, targetLanguage: lang }),
        });
        const data = await res.json() as { strings?: Record<string, string>; error?: string };
        if (data.strings) out[lang] = data.strings;
        else setErr(data.error ?? "Translation failed");
      } catch {
        setErr("Network error — please try again");
      }
    }
    setResults(out);
    setBusy(false);
    setStep(3);
  }

  // ── downloads ──
  function download(lang: string) {
    const blob = new Blob([JSON.stringify(results[lang], null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${lang}.json`;
    a.click();
  }

  async function downloadAll() {
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    for (const [lang, strings] of Object.entries(results)) {
      zip.file(`${lang}.json`, JSON.stringify(strings, null, 2));
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "translations.zip";
    a.click();
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setJsonRaw(ev.target?.result as string); setInputMode("json"); };
    reader.readAsText(file);
  }

  function reset() {
    setStep(0); setMethod(null); setPlatform("other");
    setInputMode("url"); setUrlInput(""); setTextInput(""); setJsonRaw("");
    setLangs([]); setResults({}); setErr(null); setExtractErr(null);
  }

  // ─── Step renders ─────────────────────────────────────────────────────────

  // Step 0 — pick method
  if (step === 0) return render(
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold text-zinc-50 mb-2">Let's get your site translated</h2>
      <p className="text-zinc-400 text-sm mb-8">
        How do you want to work? You can always switch later.
      </p>
      <div className="grid sm:grid-cols-2 gap-4">
        <button
          onClick={() => { setMethod("web"); setStep(1); }}
          className="text-left rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-indigo-500/60 hover:bg-indigo-950/20 p-6 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center mb-4">
            <Globe size={18} className="text-indigo-400" />
          </div>
          <p className="font-semibold text-zinc-100 mb-1">Translate via web</p>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Give us your site URL — we pull the text and translate it. No files, no setup.
          </p>
          <p className="text-xs text-indigo-400 mt-3 flex items-center gap-1">
            Best for beginners <ArrowRight size={11} />
          </p>
        </button>
        <button
          onClick={() => { setMethod("cli"); setStep(1); }}
          className="text-left rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-emerald-500/60 hover:bg-emerald-950/20 p-6 transition-all"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center mb-4">
            <Terminal size={18} className="text-emerald-400" />
          </div>
          <p className="font-semibold text-zinc-100 mb-1">Use the CLI</p>
          <p className="text-sm text-zinc-500 leading-relaxed">
            Git-native. Diff-aware. Only translates what changed. Plugs into CI/CD.
          </p>
          <p className="text-xs text-emerald-400 mt-3 flex items-center gap-1">
            Best for developers <ArrowRight size={11} />
          </p>
        </button>
      </div>
    </div>,
    labels, 0
  );

  // Step 1 (CLI) — platform
  if (step === 1 && method === "cli") return render(
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-zinc-50 mb-2">What platform are you building on?</h2>
      <p className="text-zinc-400 text-sm mb-6">We'll show the right commands for your stack.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {PLATFORMS.map(p => (
          <button key={p.id} onClick={() => setPlatform(p.id)}
            className={`text-left rounded-xl border p-4 transition-all ${
              platform === p.id
                ? "border-indigo-500 bg-indigo-950/30"
                : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-600"
            }`}
          >
            <span className="text-xl mb-2 block">{p.emoji}</span>
            <p className="text-sm font-medium text-zinc-200">{p.label}</p>
            <p className="text-[11px] text-zinc-600 mt-0.5">{p.fmt}</p>
          </button>
        ))}
      </div>
      <nav className="flex gap-3">
        <BackBtn onClick={() => setStep(0)} />
        <NextBtn onClick={() => setStep(2)} />
      </nav>
    </div>,
    labels, 1
  );

  // Step 2 (CLI) — commands
  if (step === 2 && method === "cli") {
    const pLabel = PLATFORMS.find(p => p.id === platform)?.label ?? "your project";
    const steps  = cliSteps(pLabel, langs.join(",") || "es,ja");
    return render(
      <div className="max-w-xl">
        <h2 className="text-2xl font-bold text-zinc-50 mb-2">Set up the CLI</h2>
        <p className="text-zinc-400 text-sm mb-8">
          Run these four commands in your <span className="text-zinc-200">{pLabel}</span> project root.
        </p>
        <div className="rounded-xl border border-zinc-800 bg-[#0e0e10] overflow-hidden mb-8">
          {steps.map(({ cmd, comment }, i) => (
            <div key={i} className={`px-5 py-4 font-mono text-xs ${i < steps.length - 1 ? "border-b border-zinc-800/60" : ""}`}>
              <p className="text-zinc-600 mb-1"># {comment}</p>
              <p className="text-zinc-200"><span className="text-emerald-400">$ </span>{cmd}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 mb-8 space-y-2">
          {[
            "pronto init scans your codebase and finds every translatable string",
            "pronto translate only bills for strings that changed since last run",
            "Locale files land directly in your project — commit them like any other file",
          ].map(t => (
            <p key={t} className="flex items-start gap-2 text-sm text-zinc-400">
              <Check size={13} className="text-emerald-500 mt-0.5 shrink-0" />
              <span>{t}</span>
            </p>
          ))}
        </div>
        <nav className="flex gap-3">
          <BackBtn onClick={() => setStep(1)} />
          <button onClick={() => setStep(3)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
            I ran the commands <ArrowRight size={14} />
          </button>
        </nav>
      </div>,
      labels, 2
    );
  }

  // Step 3 (CLI) — done
  if (step === 3 && method === "cli") return render(
    <div className="max-w-md text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
        <Check size={28} className="text-emerald-400" />
      </div>
      <h2 className="text-2xl font-bold text-zinc-50 mb-3">You're set up!</h2>
      <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
        Your locale files are in your project. Commit them and deploy — your app will serve the right language automatically.
      </p>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5 text-left mb-8">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Next time you change copy</p>
        <p className="font-mono text-xs text-zinc-300"><span className="text-emerald-400">$ </span>pronto translate</p>
        <p className="font-mono text-xs text-zinc-600 mt-1 pl-4"># Only new/changed strings — you only pay for new work</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/dashboard/usage" className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2 rounded-lg transition-colors">
          View usage
        </Link>
        <Link href="/dashboard/api-keys" className="text-sm border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-medium px-5 py-2 rounded-lg transition-colors">
          Manage API keys
        </Link>
      </div>
    </div>,
    labels, 3
  );

  // Step 1 (Web) — get content
  if (step === 1 && method === "web") return render(
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-zinc-50 mb-2">Where is your content?</h2>
      <p className="text-zinc-400 text-sm mb-6">
        Give us your site URL and we'll pull the text automatically. Or paste it yourself.
      </p>

      {/* Mode tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-zinc-900 border border-zinc-800 w-fit mb-6">
        {([
          { id: "url",  icon: Globe,      label: "Website URL" },
          { id: "text", icon: FileText,   label: "Paste text" },
          { id: "json", icon: FileJson,   label: "I have JSON" },
        ] as const).map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => { setInputMode(id); setExtractErr(null); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              inputMode === id ? "bg-zinc-700 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            <Icon size={12} /> {label}
          </button>
        ))}
      </div>

      {/* URL mode */}
      {inputMode === "url" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={e => setUrlInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && urlInput && extract()}
              placeholder="https://yoursite.com"
              className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-200 text-sm px-4 py-2.5 focus:outline-none focus:border-indigo-500 placeholder:text-zinc-600"
            />
            <button
              onClick={extract}
              disabled={!urlInput || extracting}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
            >
              {extracting ? <><Loader2 size={14} className="animate-spin" /> Scanning…</> : <>Extract strings <Sparkles size={13} /></>}
            </button>
          </div>
          <p className="text-xs text-zinc-600">We'll scan the page and pull out all the text — headings, buttons, nav items, body copy.</p>
          {extractErr && <p className="text-red-400 text-sm">{extractErr}</p>}
        </div>
      )}

      {/* Paste text mode */}
      {inputMode === "text" && (
        <div className="space-y-4">
          <textarea
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            placeholder="Copy and paste the text from your website here — the homepage, about page, product page, whatever you want translated."
            rows={8}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-200 text-sm p-4 focus:outline-none focus:border-indigo-500 resize-none placeholder:text-zinc-600 leading-relaxed"
          />
          {extractErr && <p className="text-red-400 text-sm">{extractErr}</p>}
          <button
            onClick={extract}
            disabled={!textInput.trim() || extracting}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            {extracting ? <><Loader2 size={14} className="animate-spin" /> Extracting…</> : <>Turn into strings <Sparkles size={13} /></>}
          </button>
        </div>
      )}

      {/* JSON mode */}
      {inputMode === "json" && (
        <div className="space-y-3">
          <div className="relative">
            <textarea
              value={jsonRaw}
              onChange={e => setJsonRaw(e.target.value)}
              placeholder={'{\n  "nav.home": "Home",\n  "hero.title": "Welcome",\n  "cta": "Get started"\n}'}
              rows={10}
              spellCheck={false}
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-200 text-xs font-mono p-4 focus:outline-none focus:border-indigo-500 resize-none placeholder:text-zinc-700"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute top-3 right-3 text-[10px] text-zinc-600 hover:text-indigo-400 border border-zinc-700 hover:border-indigo-500/50 rounded px-2 py-0.5 transition-colors"
            >
              Upload file
            </button>
            <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFile} />
          </div>
          {jsonRaw && (
            <p className={`text-xs ${strCount > 0 ? "text-emerald-500" : "text-red-400"}`}>
              {strCount > 0 ? `✓ ${strCount} strings · ~${words} words` : "⚠ Invalid JSON"}
            </p>
          )}
        </div>
      )}

      {/* Extracted preview */}
      {inputMode === "json" && strCount > 0 && (
        <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Preview — first 4 strings</p>
          {Object.entries(parsed).slice(0, 4).map(([k, v]) => (
            <p key={k} className="font-mono text-xs text-zinc-500 truncate">
              <span className="text-zinc-400">{k}</span>: <span className="text-zinc-300">&quot;{v}&quot;</span>
            </p>
          ))}
          {strCount > 4 && <p className="text-xs text-zinc-700 mt-1">+{strCount - 4} more strings</p>}
        </div>
      )}

      <nav className="flex gap-3 mt-8">
        <BackBtn onClick={() => setStep(0)} />
        <button
          onClick={() => setStep(2)}
          disabled={strCount === 0}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          {strCount > 0 ? `Continue with ${strCount} strings` : "Continue"} <ArrowRight size={14} />
        </button>
      </nav>
    </div>,
    labels, 1
  );

  // Step 2 (Web) — pick languages
  if (step === 2 && method === "web") return render(
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-zinc-50 mb-2">Which languages do you need?</h2>
      <p className="text-zinc-400 text-sm mb-6">Select as many as you want — all translated in one run.</p>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-6">
        {LANGUAGES.map(l => {
          const on = langs.includes(l.code);
          return (
            <button key={l.code}
              onClick={() => setLangs(prev => on ? prev.filter(c => c !== l.code) : [...prev, l.code])}
              className={`flex flex-col items-center gap-1 rounded-xl border p-3 transition-all ${
                on ? "border-indigo-500 bg-indigo-950/30" : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-600"
              }`}
            >
              <span className="text-xl">{l.flag}</span>
              <span className={`text-xs font-medium ${on ? "text-indigo-300" : "text-zinc-400"}`}>{l.name}</span>
            </button>
          );
        })}
      </div>

      {langs.length > 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-300 font-medium">
              {langs.length} language{langs.length > 1 ? "s" : ""} · {strCount} strings · ~{words * langs.length} words
            </p>
            <p className="text-xs text-zinc-600 mt-0.5">Estimated at $0.79 / 1K words</p>
          </div>
          <p className="text-2xl font-bold text-zinc-100">${cost}</p>
        </div>
      )}

      {err && <p className="text-red-400 text-sm mb-4">{err}</p>}

      <nav className="flex gap-3">
        <BackBtn onClick={() => setStep(1)} />
        <button
          onClick={runTranslate}
          disabled={langs.length === 0 || busy}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors min-w-[140px] justify-center"
        >
          {busy ? (
            <><Loader2 size={14} className="animate-spin" /> Translating…</>
          ) : (
            <>Translate now <ArrowRight size={14} /></>
          )}
        </button>
      </nav>
    </div>,
    labels, 2
  );

  // Step 3 (Web) — results
  if (step === 3 && method === "web") return render(
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center">
          <Check size={16} className="text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-50">Translations ready</h2>
          <p className="text-zinc-500 text-sm">{langs.length} file{langs.length > 1 ? "s" : ""} · {strCount} strings each</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {langs.map(lang => {
          const meta   = LANGUAGES.find(l => l.code === lang);
          const sample = Object.entries(results[lang] ?? {}).slice(0, 2);
          return (
            <div key={lang} className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{meta?.flag}</span>
                  <span className="text-sm font-medium text-zinc-200">{meta?.name}</span>
                  <span className="text-xs text-zinc-600 font-mono">{lang}.json</span>
                </div>
                <button onClick={() => download(lang)}
                  className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 hover:border-indigo-400/50 px-3 py-1 rounded-md transition-colors"
                >
                  <Download size={11} /> Download
                </button>
              </div>
              {sample.map(([k, v]) => (
                <p key={k} className="font-mono text-xs text-zinc-600 truncate">
                  <span className="text-zinc-500">{k}</span>: <span className="text-zinc-400">&quot;{v}&quot;</span>
                </p>
              ))}
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        {langs.length > 1 && (
          <button onClick={downloadAll}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            <Download size={14} /> Download all (.zip)
          </button>
        )}
        <button onClick={reset}
          className="flex items-center justify-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
        >
          Translate another site
        </button>
        <Link href="/dashboard/usage"
          className="flex items-center justify-center text-sm text-zinc-500 hover:text-zinc-300 transition-colors px-3 py-2.5"
        >
          View usage →
        </Link>
      </div>
    </div>,
    labels, 3
  );

  return null;

  // ── shared layout wrapper ──
  function render(content: React.ReactNode, stepLabels: string[], current: number) {
    return (
      <div className="min-h-screen flex bg-[#09090b] text-zinc-100">
        <aside className="w-56 shrink-0 border-r border-zinc-800 flex flex-col">
          <div className="h-14 flex items-center px-5 border-b border-zinc-800">
            <Link href="/" className="text-lg font-bold tracking-tight">
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">P</span>
              <span className="text-zinc-50">ronto</span>
            </Link>
          </div>
          <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
            {SIDEBAR.map(({ icon: Icon, label, href }) => (
              <Link key={label} href={href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </nav>
          <div className="px-4 py-4 border-t border-zinc-800">
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="flex items-center gap-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                <LogOut size={12} /> Sign out
              </button>
            </form>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b border-zinc-800 flex items-center px-6 gap-3">
            <Sparkles size={15} className="text-indigo-400" />
            <h1 className="text-sm font-semibold text-zinc-200">Setup Wizard</h1>
          </header>
          <main className="flex-1 px-8 py-10">
            <StepBar labels={stepLabels} current={current} />
            {content}
          </main>
        </div>
      </div>
    );
  }
}

// ─── Small shared buttons ──────────────────────────────────────────────────────

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
      <ArrowLeft size={14} /> Back
    </button>
  );
}

function NextBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
      Continue <ArrowRight size={14} />
    </button>
  );
}
