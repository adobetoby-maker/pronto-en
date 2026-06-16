"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Languages, Key, CreditCard, TrendingUp, Settings,
  ArrowRight, ArrowLeft, Check, Download, Terminal, Sparkles, LogOut,
  Globe, FileText, FileJson, Loader2, GitBranch, FolderOpen, GitPullRequest,
  Lock, Unlock, RefreshCw,
} from "lucide-react";

// ─── Static data ─────────────────────────────────────────────────────────────

const SIDEBAR = [
  { icon: LayoutDashboard, label: "Projects",      href: "/dashboard" },
  { icon: Languages,       label: "Translate",     href: "/dashboard/translate" },
  { icon: TrendingUp,      label: "Usage",         href: "/dashboard/usage" },
  { icon: Key,             label: "API Keys",      href: "/dashboard/api-keys" },
  { icon: CreditCard,      label: "Billing",       href: "/dashboard/billing" },
  { icon: Settings,        label: "Settings",      href: "/dashboard#settings" },
];

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

const CLI_PLATFORMS = [
  { id: "react",     label: "React / Next.js", emoji: "⚛️" },
  { id: "vue",       label: "Vue / Nuxt",      emoji: "🟢" },
  { id: "flutter",   label: "Flutter",          emoji: "🦋" },
  { id: "ios",       label: "iOS / Swift",      emoji: "🍎" },
  { id: "android",   label: "Android",          emoji: "🤖" },
  { id: "wordpress", label: "WordPress",        emoji: "🔵" },
  { id: "shopify",   label: "Shopify",          emoji: "🛍️" },
  { id: "other",     label: "Other",            emoji: "📦" },
];

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

function wordCount(s: Record<string, string>) {
  return Object.values(s).reduce((n, v) => n + v.trim().split(/\s+/).filter(Boolean).length, 0);
}

// ─── Step bar ─────────────────────────────────────────────────────────────────

function StepBar({ labels, current }: { labels: string[]; current: number }) {
  return (
    <div className="flex items-center mb-10">
      {labels.map((label, i) => {
        const done = i < current, active = i === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${done ? "bg-emerald-500 text-white" : active ? "bg-indigo-600 text-white ring-2 ring-indigo-400/40" : "bg-zinc-800 text-zinc-600"}`}>
                {done ? <Check size={13} /> : i + 1}
              </div>
              <span className={`text-[10px] font-medium whitespace-nowrap ${active ? "text-zinc-300" : "text-zinc-600"}`}>{label}</span>
            </div>
            {i < labels.length - 1 && (
              <div className={`h-px w-10 sm:w-16 mb-4 mx-1 ${done ? "bg-emerald-600" : "bg-zinc-800"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
      <ArrowLeft size={14} /> Back
    </button>
  );
}

// ─── Lang picker (shared) ────────────────────────────────────────────────────

function LangPicker({ langs, setLangs }: { langs: string[]; setLangs: (f: (p: string[]) => string[]) => void }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
      {LANGUAGES.map(l => {
        const on = langs.includes(l.code);
        return (
          <button key={l.code}
            onClick={() => setLangs(prev => on ? prev.filter(c => c !== l.code) : [...prev, l.code])}
            className={`flex flex-col items-center gap-1 rounded-xl border p-3 transition-all
              ${on ? "border-indigo-500 bg-indigo-950/30" : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-600"}`}
          >
            <span className="text-xl">{l.flag}</span>
            <span className={`text-xs font-medium ${on ? "text-indigo-300" : "text-zinc-400"}`}>{l.name}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

type Method = "web" | "github" | "local" | "cli" | null;

type GHRepo = { id: number; name: string; full_name: string; owner: string; default_branch: string; private: boolean; description: string | null };
type LocaleFile = { path: string; sha: string };

export default function WizardPage() {
  const [method, setMethod] = useState<Method>(null);
  const [step,   setStep]   = useState(0);

  // Web path
  const [inputMode,  setInputMode]  = useState<"url" | "text" | "json">("url");
  const [urlInput,   setUrlInput]   = useState("");
  const [textInput,  setTextInput]  = useState("");
  const [jsonRaw,    setJsonRaw]    = useState("");
  const [extracting, setExtracting] = useState(false);
  const [extractErr, setExtractErr] = useState<string | null>(null);

  // GitHub path
  const [ghConnected,  setGhConnected]  = useState<string | null>(null); // login
  const [ghLoading,    setGhLoading]    = useState(false);
  const [repos,        setRepos]        = useState<GHRepo[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<GHRepo | null>(null);
  const [repoSearch,   setRepoSearch]   = useState("");
  const [localeFiles,  setLocaleFiles]  = useState<LocaleFile[]>([]);
  const [detectingFiles, setDetectingFiles] = useState(false);
  const [selectedFile, setSelectedFile] = useState<LocaleFile | null>(null);
  const [prResult,     setPrResult]     = useState<{ pr_url: string; languages: string[]; strings: number } | null>(null);
  const [prErr,        setPrErr]        = useState<string | null>(null);

  // Local path
  const [localFiles,   setLocalFiles]   = useState<{ name: string; content: string }[]>([]);
  const [localResults, setLocalResults] = useState<Record<string, Record<string, string>>>({});
  const dragRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const multiRef = useRef<HTMLInputElement>(null);

  // Shared
  const [langs,   setLangs]   = useState<string[]>([]);
  const [results, setResults] = useState<Record<string, Record<string, string>>>({});
  const [busy,    setBusy]    = useState(false);
  const [err,     setErr]     = useState<string | null>(null);

  // Derived (web/local)
  let parsed: Record<string, string> = {};
  try { parsed = flattenJson(JSON.parse(jsonRaw || "{}")); } catch { /* */ }
  const strCount = Object.keys(parsed).length;
  const words    = wordCount(parsed);
  const cost     = ((words * langs.length) / 1000 * 0.79).toFixed(2);

  // Check GitHub connection on mount and on redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("github") === "connected") {
      window.history.replaceState({}, "", "/dashboard/wizard");
      setMethod("github");
      setStep(1);
      loadRepos();
    }
    if (params.get("error")) {
      setMethod("github");
      setStep(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── GitHub helpers ──
  async function loadRepos() {
    setGhLoading(true);
    const res  = await fetch("/api/github/repos");
    const data = await res.json() as { login?: string; repos?: GHRepo[]; error?: string };
    if (data.repos) { setRepos(data.repos); setGhConnected(data.login ?? null); }
    setGhLoading(false);
  }

  async function detectLocales(repo: GHRepo) {
    setSelectedRepo(repo);
    setDetectingFiles(true);
    setLocaleFiles([]);
    setSelectedFile(null);
    const res  = await fetch("/api/github/detect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner: repo.owner, repo: repo.name, branch: repo.default_branch }),
    });
    const data = await res.json() as { files?: LocaleFile[] };
    setLocaleFiles(data.files ?? []);
    setDetectingFiles(false);
    setStep(3);
  }

  async function createPR() {
    if (!selectedRepo || !selectedFile || langs.length === 0) return;
    setBusy(true);
    setPrErr(null);
    const res  = await fetch("/api/github/pr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        owner: selectedRepo.owner, repo: selectedRepo.name,
        branch: selectedRepo.default_branch, filePath: selectedFile.path,
        targetLanguages: langs,
      }),
    });
    const data = await res.json() as { pr_url?: string; languages?: string[]; strings?: number; error?: string };
    if (data.pr_url) {
      setPrResult({ pr_url: data.pr_url, languages: data.languages ?? [], strings: data.strings ?? 0 });
      setStep(5);
    } else {
      setPrErr(data.error ?? "PR creation failed");
    }
    setBusy(false);
  }

  // ── Web/Local translate ──
  async function extract() {
    setExtracting(true); setExtractErr(null);
    const body = inputMode === "url" ? { url: urlInput } : { text: textInput };
    const res  = await fetch("/api/extract-strings", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
    });
    const data = await res.json() as { strings?: Record<string, string>; error?: string };
    if (data.strings) { setJsonRaw(JSON.stringify(data.strings, null, 2)); setInputMode("json"); }
    else setExtractErr(data.error ?? "Extraction failed");
    setExtracting(false);
  }

  async function translate(stringsToTranslate: Record<string, string>) {
    setBusy(true); setErr(null);
    const out: Record<string, Record<string, string>> = {};
    for (const lang of langs) {
      const res  = await fetch("/api/web-translate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ strings: stringsToTranslate, targetLanguage: lang }),
      });
      const data = await res.json() as { strings?: Record<string, string>; error?: string };
      if (data.strings) out[lang] = data.strings;
      else setErr(data.error ?? "Translation failed");
    }
    setBusy(false);
    return out;
  }

  async function runWebTranslate() {
    const out = await translate(parsed);
    setResults(out); setStep(3);
  }

  async function runLocalTranslate() {
    if (localFiles.length === 0) return;
    setBusy(true); setErr(null);
    const allResults: Record<string, Record<string, string>> = {};
    for (const file of localFiles) {
      let fileStrings: Record<string, string> = {};
      try { fileStrings = flattenJson(JSON.parse(file.content)); } catch { continue; }
      for (const lang of langs) {
        const res  = await fetch("/api/web-translate", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ strings: fileStrings, targetLanguage: lang }),
        });
        const data = await res.json() as { strings?: Record<string, string>; error?: string };
        if (data.strings) allResults[`${lang}__${file.name}`] = data.strings;
      }
    }
    setLocalResults(allResults);
    setBusy(false);
    setStep(3);
  }

  function downloadFile(lang: string, content: Record<string, string>, filename = `${lang}.json`) {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  }

  async function downloadAllZip(files: Record<string, Record<string, string>>) {
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    for (const [name, content] of Object.entries(files)) {
      zip.file(name.includes("__") ? name.split("__").reverse().join("/") : `${name}.json`, JSON.stringify(content, null, 2));
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "translations.zip"; a.click();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const items = Array.from(e.dataTransfer.files).filter(f => f.name.endsWith(".json"));
    items.forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setLocalFiles(prev => [...prev.filter(f => f.name !== file.name), { name: file.name, content: ev.target?.result as string }]);
      reader.readAsText(file);
    });
  }

  function handleMultiFile(e: React.ChangeEvent<HTMLInputElement>) {
    Array.from(e.target.files ?? []).forEach(file => {
      const reader = new FileReader();
      reader.onload = ev => setLocalFiles(prev => [...prev.filter(f => f.name !== file.name), { name: file.name, content: ev.target?.result as string }]);
      reader.readAsText(file);
    });
  }

  function reset() {
    setMethod(null); setStep(0); setInputMode("url"); setUrlInput(""); setTextInput(""); setJsonRaw("");
    setLangs([]); setResults({}); setErr(null); setExtractErr(null); setLocalFiles([]); setLocalResults({});
    setSelectedRepo(null); setLocaleFiles([]); setSelectedFile(null); setPrResult(null); setPrErr(null);
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  const stepLabels = method === "cli"
    ? ["Start", "Platform", "Commands", "Done"]
    : method === "github"
    ? ["Start", "Connect", "Pick repo", "Find files", "Languages", "Done"]
    : method === "local"
    ? ["Start", "Your files", "Languages", "Done"]
    : ["Start", "Content", "Languages", "Done"];

  return layout(
    <div>
      <StepBar labels={stepLabels} current={step} />
      {renderStep()}
    </div>
  );

  function renderStep(): React.ReactNode {

    // ── Step 0: method select ─────────────────────────────────────────────
    if (step === 0) return (
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold text-zinc-50 mb-2">Where is your content?</h2>
        <p className="text-zinc-400 text-sm mb-8">Pick how you want to bring your strings in.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { id: "web" as Method,    icon: Globe,      color: "indigo",  title: "Website URL",   desc: "Give us your URL — we scan the page and pull out all the text automatically.", tag: "No files needed" },
            { id: "github" as Method, icon: GitBranch,     color: "zinc",    title: "GitHub repo",   desc: "Connect GitHub, pick a repo, and Pronto opens a PR with translated locale files.", tag: "Auto PR" },
            { id: "local" as Method,  icon: FolderOpen, color: "violet",  title: "Local files",   desc: "Drag and drop JSON files from your computer. Download translations when done.", tag: "No account needed" },
            { id: "cli" as Method,    icon: Terminal,   color: "emerald", title: "CLI (developer)", desc: "Git-native, diff-aware. Only translates changed strings. Integrates with CI/CD.", tag: "Most powerful" },
          ].map(({ id, icon: Icon, color, title, desc, tag }) => (
            <button key={id!} onClick={() => { setMethod(id); setStep(1); if (id === "github") loadRepos(); }}
              className={`text-left rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-${color}-500/60 hover:bg-${color}-950/20 p-6 transition-all`}
            >
              <div className={`w-10 h-10 rounded-lg bg-${color}-600/15 border border-${color}-500/30 flex items-center justify-center mb-4`}>
                <Icon size={18} className={`text-${color}-400`} />
              </div>
              <p className="font-semibold text-zinc-100 mb-1">{title}</p>
              <p className="text-sm text-zinc-500 leading-relaxed mb-3">{desc}</p>
              <span className={`text-xs text-${color}-400 border border-${color}-500/30 rounded-full px-2 py-0.5`}>{tag}</span>
            </button>
          ))}
        </div>
      </div>
    );

    // ══════════════════════════════════════════════════════════════════════
    // GITHUB PATH
    // ══════════════════════════════════════════════════════════════════════

    // GH Step 1: connect
    if (method === "github" && step === 1) return (
      <div className="max-w-lg">
        <h2 className="text-2xl font-bold text-zinc-50 mb-2">Connect GitHub</h2>
        <p className="text-zinc-400 text-sm mb-8">Pronto needs read/write access to open a PR on your behalf.</p>

        {ghLoading ? (
          <div className="flex items-center gap-3 text-zinc-400 text-sm">
            <Loader2 size={16} className="animate-spin" /> Loading your repos…
          </div>
        ) : ghConnected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 px-5 py-4">
              <Check size={16} className="text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-zinc-200">Connected as <span className="text-emerald-300">@{ghConnected}</span></p>
                <p className="text-xs text-zinc-600">{repos.length} repos loaded</p>
              </div>
              <button onClick={loadRepos} className="ml-auto text-zinc-600 hover:text-zinc-400 transition-colors"><RefreshCw size={14} /></button>
            </div>
            <div className="flex gap-3">
              <BackBtn onClick={() => setStep(0)} />
              <button onClick={() => setStep(2)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
                Pick a repo <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <a href="/api/auth/github"
              className="inline-flex items-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors">
              <GitBranch size={16} /> Connect with GitHub
            </a>
            <p className="text-xs text-zinc-600">You'll be redirected to GitHub to authorize Pronto. We only request <code className="text-zinc-400">repo</code> scope.</p>
            <BackBtn onClick={() => setStep(0)} />
          </div>
        )}
      </div>
    );

    // GH Step 2: pick repo
    if (method === "github" && step === 2) {
      const filtered = repos.filter(r =>
        r.full_name.toLowerCase().includes(repoSearch.toLowerCase()) ||
        (r.description ?? "").toLowerCase().includes(repoSearch.toLowerCase())
      );
      return (
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold text-zinc-50 mb-2">Pick a repository</h2>
          <p className="text-zinc-400 text-sm mb-6">Pronto will scan it for locale files.</p>
          <input value={repoSearch} onChange={e => setRepoSearch(e.target.value)}
            placeholder="Search repos…"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-200 text-sm px-4 py-2.5 mb-4 focus:outline-none focus:border-indigo-500 placeholder:text-zinc-600"
          />
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {filtered.slice(0, 30).map(r => (
              <button key={r.id} onClick={() => detectLocales(r)}
                className="w-full text-left rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-indigo-500/50 hover:bg-indigo-950/10 px-4 py-3.5 transition-all flex items-center gap-3"
              >
                {r.private ? <Lock size={13} className="text-zinc-600 shrink-0" /> : <Unlock size={13} className="text-zinc-600 shrink-0" />}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate">{r.full_name}</p>
                  {r.description && <p className="text-xs text-zinc-600 truncate">{r.description}</p>}
                </div>
                <ArrowRight size={14} className="text-zinc-700 ml-auto shrink-0" />
              </button>
            ))}
            {filtered.length === 0 && <p className="text-sm text-zinc-600 text-center py-6">No repos match your search.</p>}
          </div>
          {detectingFiles && (
            <div className="flex items-center gap-2 mt-4 text-zinc-400 text-sm">
              <Loader2 size={14} className="animate-spin" /> Scanning for locale files…
            </div>
          )}
          <div className="mt-6"><BackBtn onClick={() => setStep(1)} /></div>
        </div>
      );
    }

    // GH Step 3: pick locale file
    if (method === "github" && step === 3) return (
      <div className="max-w-xl">
        <h2 className="text-2xl font-bold text-zinc-50 mb-1">Choose the source file</h2>
        <p className="text-zinc-400 text-sm mb-6">
          Found in <span className="text-zinc-300 font-mono">{selectedRepo?.full_name}</span>. Pick the English (source) locale file.
        </p>

        {localeFiles.length > 0 ? (
          <div className="space-y-2 mb-8">
            {localeFiles.map(f => (
              <button key={f.path} onClick={() => setSelectedFile(f)}
                className={`w-full text-left rounded-xl border px-4 py-3 transition-all font-mono text-sm
                  ${selectedFile?.path === f.path ? "border-indigo-500 bg-indigo-950/30 text-zinc-200" : "border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-zinc-600"}`}
              >
                {f.path}
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6 text-center mb-8">
            <p className="text-sm text-zinc-500 mb-2">No locale files detected automatically.</p>
            <p className="text-xs text-zinc-600">Make sure your repo has files like <code className="text-zinc-400">locales/en.json</code>, <code className="text-zinc-400">messages/en.json</code>, or similar.</p>
          </div>
        )}

        <div className="flex gap-3">
          <BackBtn onClick={() => setStep(2)} />
          {localeFiles.length > 0 && (
            <button onClick={() => setStep(4)} disabled={!selectedFile}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
              Continue <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    );

    // GH Step 4: languages
    if (method === "github" && step === 4) return (
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold text-zinc-50 mb-2">Which languages?</h2>
        <p className="text-zinc-400 text-sm mb-6">Pronto will translate <span className="text-zinc-300 font-mono">{selectedFile?.path}</span> and open one PR with all languages.</p>
        <LangPicker langs={langs} setLangs={setLangs} />
        {err && <p className="text-red-400 text-sm mt-4">{err}</p>}
        {prErr && <p className="text-red-400 text-sm mt-4">{prErr}</p>}
        <div className="flex gap-3 mt-6">
          <BackBtn onClick={() => setStep(3)} />
          <button onClick={createPR} disabled={langs.length === 0 || busy}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors min-w-[160px] justify-center">
            {busy ? <><Loader2 size={14} className="animate-spin" /> Creating PR…</> : <><GitPullRequest size={14} /> Open PR on GitHub</>}
          </button>
        </div>
      </div>
    );

    // GH Step 5: PR done
    if (method === "github" && step === 5 && prResult) return (
      <div className="max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
          <GitPullRequest size={28} className="text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-50 mb-3">PR opened!</h2>
        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
          Translated <strong className="text-zinc-200">{prResult.strings} strings</strong> into{" "}
          <strong className="text-zinc-200">{prResult.languages.map(c => LANGUAGES.find(l => l.code === c)?.name ?? c).join(", ")}</strong>.
          Review and merge when ready.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={prResult.pr_url} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
            <GitBranch size={14} /> View pull request
          </a>
          <button onClick={reset}
            className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
            Translate another repo
          </button>
        </div>
      </div>
    );

    // ══════════════════════════════════════════════════════════════════════
    // LOCAL PATH
    // ══════════════════════════════════════════════════════════════════════

    // Local Step 1: drop files
    if (method === "local" && step === 1) return (
      <div className="max-w-xl">
        <h2 className="text-2xl font-bold text-zinc-50 mb-2">Drop your locale files</h2>
        <p className="text-zinc-400 text-sm mb-6">Drag JSON files from your project — or click to browse. Multiple files supported.</p>

        <div ref={dragRef}
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => multiRef.current?.click()}
          className="rounded-xl border-2 border-dashed border-zinc-700 hover:border-indigo-500/50 bg-zinc-900/30 hover:bg-indigo-950/10 p-10 text-center cursor-pointer transition-all mb-4"
        >
          <FolderOpen size={28} className="text-zinc-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-zinc-400">Drop JSON files here, or click to browse</p>
          <p className="text-xs text-zinc-600 mt-1">Accepts .json — your en.json, translation.json, etc.</p>
          <input ref={multiRef} type="file" accept=".json" multiple className="hidden" onChange={handleMultiFile} />
        </div>

        {localFiles.length > 0 && (
          <div className="space-y-2 mb-6">
            {localFiles.map(f => {
              let count = 0;
              try { count = Object.keys(flattenJson(JSON.parse(f.content))).length; } catch { /* */ }
              return (
                <div key={f.name} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <FileJson size={14} className="text-indigo-400" />
                    <span className="text-sm font-mono text-zinc-300">{f.name}</span>
                  </div>
                  <span className="text-xs text-zinc-600">{count} strings</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex gap-3">
          <BackBtn onClick={() => setStep(0)} />
          <button onClick={() => setStep(2)} disabled={localFiles.length === 0}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
            Continue with {localFiles.length} file{localFiles.length !== 1 ? "s" : ""} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );

    // Local Step 2: languages
    if (method === "local" && step === 2) return (
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold text-zinc-50 mb-2">Which languages?</h2>
        <p className="text-zinc-400 text-sm mb-6">Pronto will translate all {localFiles.length} file{localFiles.length !== 1 ? "s" : ""} into each language you pick.</p>
        <LangPicker langs={langs} setLangs={setLangs} />
        {err && <p className="text-red-400 text-sm mt-4">{err}</p>}
        <div className="flex gap-3 mt-6">
          <BackBtn onClick={() => setStep(1)} />
          <button onClick={runLocalTranslate} disabled={langs.length === 0 || busy}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors min-w-[140px] justify-center">
            {busy ? <><Loader2 size={14} className="animate-spin" /> Translating…</> : <>Translate now <ArrowRight size={14} /></>}
          </button>
        </div>
      </div>
    );

    // Local Step 3: results
    if (method === "local" && step === 3) {
      const allFiles = Object.entries(localResults);
      return (
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-emerald-600/15 border border-emerald-500/30 flex items-center justify-center">
              <Check size={16} className="text-emerald-400" />
            </div>
            <h2 className="text-xl font-bold text-zinc-50">Translations ready — {allFiles.length} files</h2>
          </div>
          <div className="space-y-2 mb-6">
            {allFiles.map(([key, content]) => {
              const [lang, origName] = key.split("__");
              const meta = LANGUAGES.find(l => l.code === lang);
              return (
                <div key={key} className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/30 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{meta?.flag}</span>
                    <span className="text-sm text-zinc-300">{meta?.name}</span>
                    <span className="text-xs text-zinc-600 font-mono">{origName}</span>
                  </div>
                  <button onClick={() => downloadFile(lang, content, `${lang}-${origName}`)}
                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-md transition-colors">
                    <Download size={11} /> Download
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={() => downloadAllZip(localResults)}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
              <Download size={14} /> Download all (.zip)
            </button>
            <button onClick={reset}
              className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
              Translate more files
            </button>
          </div>
        </div>
      );
    }

    // ══════════════════════════════════════════════════════════════════════
    // WEB PATH
    // ══════════════════════════════════════════════════════════════════════

    if (method === "web" && step === 1) return (
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold text-zinc-50 mb-2">Where is your content?</h2>
        <p className="text-zinc-400 text-sm mb-6">Give us your URL and we'll extract the text — or paste it yourself.</p>

        <div className="flex gap-1 p-1 rounded-lg bg-zinc-900 border border-zinc-800 w-fit mb-6">
          {([
            { id: "url" as const,  icon: Globe,     label: "Website URL" },
            { id: "text" as const, icon: FileText,  label: "Paste text" },
            { id: "json" as const, icon: FileJson,  label: "I have JSON" },
          ]).map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => { setInputMode(id); setExtractErr(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all
                ${inputMode === id ? "bg-zinc-700 text-zinc-100" : "text-zinc-500 hover:text-zinc-300"}`}>
              <Icon size={12} /> {label}
            </button>
          ))}
        </div>

        {inputMode === "url" && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input type="url" value={urlInput} onChange={e => setUrlInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && urlInput && extract()}
                placeholder="https://yoursite.com"
                className="flex-1 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-200 text-sm px-4 py-2.5 focus:outline-none focus:border-indigo-500 placeholder:text-zinc-600"
              />
              <button onClick={extract} disabled={!urlInput || extracting}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap">
                {extracting ? <><Loader2 size={14} className="animate-spin" /> Scanning…</> : <>Extract <Sparkles size={13} /></>}
              </button>
            </div>
            <p className="text-xs text-zinc-600">We scan the page and pull out all the UI text automatically.</p>
            {extractErr && <p className="text-red-400 text-sm">{extractErr}</p>}
          </div>
        )}

        {inputMode === "text" && (
          <div className="space-y-3">
            <textarea value={textInput} onChange={e => setTextInput(e.target.value)} rows={8}
              placeholder="Copy and paste the text from your website here — home page, about page, product descriptions, whatever you need translated."
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-200 text-sm p-4 focus:outline-none focus:border-indigo-500 resize-none placeholder:text-zinc-600 leading-relaxed"
            />
            {extractErr && <p className="text-red-400 text-sm">{extractErr}</p>}
            <button onClick={extract} disabled={!textInput.trim() || extracting}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
              {extracting ? <><Loader2 size={14} className="animate-spin" /> Extracting…</> : <>Turn into strings <Sparkles size={13} /></>}
            </button>
          </div>
        )}

        {inputMode === "json" && (
          <div className="space-y-3">
            <div className="relative">
              <textarea value={jsonRaw} onChange={e => setJsonRaw(e.target.value)} rows={10} spellCheck={false}
                placeholder={'{\n  "nav.home": "Home",\n  "hero.title": "Welcome"\n}'}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-200 text-xs font-mono p-4 focus:outline-none focus:border-indigo-500 resize-none placeholder:text-zinc-700"
              />
              <button onClick={() => fileRef.current?.click()}
                className="absolute top-3 right-3 text-[10px] text-zinc-600 hover:text-indigo-400 border border-zinc-700 rounded px-2 py-0.5">
                Upload file
              </button>
              <input ref={fileRef} type="file" accept=".json" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = ev => { setJsonRaw(ev.target?.result as string); }; r.readAsText(f); }} />
            </div>
            {jsonRaw && <p className={`text-xs ${strCount > 0 ? "text-emerald-500" : "text-red-400"}`}>
              {strCount > 0 ? `✓ ${strCount} strings · ~${words} words` : "⚠ Invalid JSON"}
            </p>}
          </div>
        )}

        {inputMode === "json" && strCount > 0 && (
          <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900/30 p-4">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">Preview</p>
            {Object.entries(parsed).slice(0, 4).map(([k, v]) => (
              <p key={k} className="font-mono text-xs text-zinc-500 truncate">
                <span className="text-zinc-400">{k}</span>: <span className="text-zinc-300">&quot;{v}&quot;</span>
              </p>
            ))}
          </div>
        )}

        <div className="flex gap-3 mt-8">
          <BackBtn onClick={() => setStep(0)} />
          <button onClick={() => setStep(2)} disabled={strCount === 0}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
            {strCount > 0 ? `Continue — ${strCount} strings` : "Continue"} <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );

    if (method === "web" && step === 2) return (
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold text-zinc-50 mb-2">Which languages?</h2>
        <p className="text-zinc-400 text-sm mb-6">All translated in a single run.</p>
        <LangPicker langs={langs} setLangs={setLangs} />
        {langs.length > 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-4 mt-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-300 font-medium">{langs.length} language{langs.length > 1 ? "s" : ""} · ~{words * langs.length} words</p>
              <p className="text-xs text-zinc-600 mt-0.5">Estimated at $0.79 / 1K words</p>
            </div>
            <p className="text-2xl font-bold text-zinc-100">${cost}</p>
          </div>
        )}
        {err && <p className="text-red-400 text-sm mt-4">{err}</p>}
        <div className="flex gap-3 mt-6">
          <BackBtn onClick={() => setStep(1)} />
          <button onClick={runWebTranslate} disabled={langs.length === 0 || busy}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors min-w-[140px] justify-center">
            {busy ? <><Loader2 size={14} className="animate-spin" /> Translating…</> : <>Translate now <ArrowRight size={14} /></>}
          </button>
        </div>
      </div>
    );

    if (method === "web" && step === 3) return (
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
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{meta?.flag}</span>
                    <span className="text-sm font-medium text-zinc-200">{meta?.name}</span>
                    <span className="text-xs text-zinc-600 font-mono">{lang}.json</span>
                  </div>
                  <button onClick={() => downloadFile(lang, results[lang])}
                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-md transition-colors">
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
            <button onClick={() => downloadAllZip(results)}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
              <Download size={14} /> Download all (.zip)
            </button>
          )}
          <button onClick={reset}
            className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
            Translate another
          </button>
        </div>
      </div>
    );

    // ══════════════════════════════════════════════════════════════════════
    // CLI PATH
    // ══════════════════════════════════════════════════════════════════════

    if (method === "cli" && step === 1) return (
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold text-zinc-50 mb-2">What platform are you on?</h2>
        <p className="text-zinc-400 text-sm mb-6">We'll show the right commands for your stack.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {CLI_PLATFORMS.map(p => (
            <button key={p.id} onClick={() => { setPlatform(p.id); setStep(2); }}
              className="text-left rounded-xl border border-zinc-800 bg-zinc-900/30 hover:border-indigo-500/50 p-4 transition-all">
              <span className="text-xl mb-2 block">{p.emoji}</span>
              <p className="text-sm font-medium text-zinc-200">{p.label}</p>
            </button>
          ))}
        </div>
        <BackBtn onClick={() => setStep(0)} />
      </div>
    );

    if (method === "cli" && step === 2) {
      const pLabel = CLI_PLATFORMS.find(p => p.id === _platform)?.label ?? "your project";
      return (
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold text-zinc-50 mb-2">Set up the CLI</h2>
          <p className="text-zinc-400 text-sm mb-8">Run these in your <span className="text-zinc-200">{pLabel}</span> project root.</p>
          <div className="rounded-xl border border-zinc-800 bg-[#0e0e10] overflow-hidden mb-8">
            {[
              { cmd: "npm install -g pronto-cli", comment: "Install once" },
              { cmd: "pronto login",              comment: "Authenticate" },
              { cmd: "pronto init",               comment: `Scan ${pLabel} strings` },
              { cmd: "pronto translate --target es,ja", comment: "Translate changed strings" },
            ].map(({ cmd, comment }, i, arr) => (
              <div key={i} className={`px-5 py-4 font-mono text-xs ${i < arr.length - 1 ? "border-b border-zinc-800/60" : ""}`}>
                <p className="text-zinc-600 mb-1"># {comment}</p>
                <p className="text-zinc-200"><span className="text-emerald-400">$ </span>{cmd}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <BackBtn onClick={() => setStep(1)} />
            <button onClick={() => setStep(3)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
              Done <Check size={14} />
            </button>
          </div>
        </div>
      );
    }

    if (method === "cli" && step === 3) return (
      <div className="max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
          <Check size={28} className="text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-zinc-50 mb-3">You&apos;re set up!</h2>
        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">Locale files are in your project — commit and deploy. Next time just run <code className="text-zinc-300">pronto translate</code>.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/api-keys" className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2 rounded-lg transition-colors">Manage API keys</Link>
          <Link href="/dashboard/usage"    className="text-sm border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-medium px-5 py-2 rounded-lg transition-colors">View usage</Link>
        </div>
      </div>
    );

    return null;
  }

  function setPlatform(p: string) { setMethod(method); _setPlatform(p); }
  const [_platform, _setPlatform] = useState("other");

  function layout(content: React.ReactNode) {
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
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50">
                <Icon size={15} />{label}
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
          <main className="flex-1 px-8 py-10">{content}</main>
        </div>
      </div>
    );
  }
}
