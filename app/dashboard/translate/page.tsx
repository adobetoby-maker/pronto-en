"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Languages, Key, CreditCard, Settings,
  Upload, Download, Loader2, Check, ChevronDown, X, FileJson,
} from "lucide-react";

const SIDEBAR = [
  { icon: LayoutDashboard, label: "Projects", href: "/dashboard" },
  { icon: Languages, label: "Translate", href: "/dashboard/translate", active: true },
  { icon: Key, label: "API Keys", href: "/dashboard/api-keys" },
  { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
  { icon: Settings, label: "Settings", href: "/dashboard#settings" },
];

const LANGUAGES = [
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ja", name: "Japanese" },
  { code: "zh", name: "Chinese (Simplified)" },
  { code: "ko", name: "Korean" },
  { code: "ar", name: "Arabic" },
  { code: "ru", name: "Russian" },
  { code: "nl", name: "Dutch" },
  { code: "pl", name: "Polish" },
  { code: "tr", name: "Turkish" },
  { code: "sv", name: "Swedish" },
  { code: "hi", name: "Hindi" },
];

type TranslationResult = {
  lang: string;
  name: string;
  strings: Record<string, string>;
  wordsProcessed: number;
};

export default function TranslatePage() {
  const [sourceJson, setSourceJson] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [selectedLangs, setSelectedLangs] = useState<string[]>(["es", "fr"]);
  const [langDropOpen, setLangDropOpen] = useState(false);
  const [tone, setTone] = useState<"auto" | "formal" | "informal">("auto");
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TranslationResult[]>([]);
  const [totalWords, setTotalWords] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      setSourceJson(text);
      validateJson(text);
    };
    reader.readAsText(file);
  }

  function validateJson(text: string): Record<string, string> | null {
    setJsonError("");
    if (!text.trim()) return null;
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed !== "object" || Array.isArray(parsed)) {
        setJsonError("Must be a JSON object, not an array.");
        return null;
      }
      return parsed as Record<string, string>;
    } catch {
      setJsonError("Invalid JSON — check your syntax.");
      return null;
    }
  }

  function flattenStrings(obj: unknown, prefix = ""): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      const key = prefix ? `${prefix}.${k}` : k;
      if (typeof v === "string") out[key] = v;
      else if (typeof v === "object" && v !== null) Object.assign(out, flattenStrings(v, key));
    }
    return out;
  }

  async function handleTranslate() {
    const parsed = validateJson(sourceJson);
    if (!parsed || !selectedLangs.length) return;

    const strings = flattenStrings(parsed);
    if (!Object.keys(strings).length) {
      setJsonError("No translatable strings found.");
      return;
    }

    setLoading(true);
    setResults([]);

    const newResults: TranslationResult[] = [];
    let words = 0;

    for (const langCode of selectedLangs) {
      const langName = LANGUAGES.find(l => l.code === langCode)?.name ?? langCode;
      try {
        const res = await fetch("/api/web-translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            strings,
            targetLanguage: langCode,
            tone: tone === "auto" ? undefined : tone,
            domain: domain.trim() || undefined,
          }),
        });
        const data = await res.json() as { strings: Record<string, string>; wordsProcessed: number; error?: string };
        if (!res.ok) throw new Error(data.error ?? "Translation failed");
        newResults.push({ lang: langCode, name: langName, strings: data.strings, wordsProcessed: data.wordsProcessed });
        words = data.wordsProcessed;
      } catch (err) {
        newResults.push({ lang: langCode, name: langName, strings: {}, wordsProcessed: 0 });
      }
    }

    setResults(newResults);
    setTotalWords(words);
    setLoading(false);
  }

  function downloadJson(result: TranslationResult) {
    const blob = new Blob([JSON.stringify(result.strings, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `translation.${result.lang}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function downloadAll() {
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    for (const r of results) {
      if (Object.keys(r.strings).length) {
        zip.file(`${r.lang}/translation.json`, JSON.stringify(r.strings, null, 2));
      }
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pronto-translations.zip";
    a.click();
    URL.revokeObjectURL(url);
  }

  function toggleLang(code: string) {
    setSelectedLangs(prev =>
      prev.includes(code) ? prev.filter(l => l !== code) : [...prev, code]
    );
  }

  const stringCount = (() => {
    try { return Object.keys(flattenStrings(JSON.parse(sourceJson))).length; } catch { return 0; }
  })();

  const estimatedCost = ((totalWords || stringCount * 3) / 1000 * 0.79 * selectedLangs.length).toFixed(2);

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
          {SIDEBAR.map(({ icon: Icon, label, href, active }) => (
            <Link key={label} href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                active ? "bg-indigo-600/20 text-indigo-300 font-medium" : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/50"
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-14 border-b border-zinc-800 flex items-center px-6 gap-3">
          <Languages size={16} className="text-indigo-400" />
          <h1 className="text-sm font-semibold text-zinc-200">Web Translate</h1>
          <span className="text-xs text-zinc-600 ml-auto">No CLI required</span>
        </header>

        <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 divide-x divide-zinc-800">
          {/* Left — input */}
          <div className="p-6 flex flex-col gap-5">
            {/* JSON input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                  Source JSON
                </label>
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <Upload size={12} />
                  Upload file
                </button>
                <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
              </div>
              <div className="relative">
                <textarea
                  value={sourceJson}
                  onChange={e => { setSourceJson(e.target.value); validateJson(e.target.value); }}
                  placeholder={'{\n  "greeting": "Hello",\n  "nav": {\n    "home": "Home"\n  }\n}'}
                  className="w-full h-60 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-mono text-zinc-300 placeholder-zinc-700 resize-none focus:outline-none focus:border-indigo-500/60 transition-colors"
                />
                {stringCount > 0 && !jsonError && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-[10px] text-zinc-600">
                    <FileJson size={11} />
                    {stringCount} strings
                  </div>
                )}
              </div>
              {jsonError && (
                <p className="mt-1.5 text-xs text-red-400">{jsonError}</p>
              )}
            </div>

            {/* Target languages */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">
                Target Languages
              </label>
              <div className="relative">
                <button
                  onClick={() => setLangDropOpen(v => !v)}
                  className="w-full flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-300 hover:border-zinc-700 transition-colors"
                >
                  <span>
                    {selectedLangs.length === 0
                      ? "Select languages…"
                      : selectedLangs.map(c => LANGUAGES.find(l => l.code === c)?.name).join(", ")}
                  </span>
                  <ChevronDown size={14} className="text-zinc-500 shrink-0 ml-2" />
                </button>
                {langDropOpen && (
                  <div className="absolute z-10 top-full mt-1 w-full bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden">
                    <div className="max-h-56 overflow-y-auto divide-y divide-zinc-800/50">
                      {LANGUAGES.map(l => (
                        <button
                          key={l.code}
                          onClick={() => toggleLang(l.code)}
                          className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-left hover:bg-zinc-800/60 transition-colors"
                        >
                          <span className={selectedLangs.includes(l.code) ? "text-zinc-100" : "text-zinc-400"}>
                            {l.name}
                          </span>
                          {selectedLangs.includes(l.code) && (
                            <Check size={13} className="text-indigo-400 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-zinc-800 flex justify-end">
                      <button onClick={() => setLangDropOpen(false)} className="text-xs text-zinc-500 hover:text-zinc-300">
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {selectedLangs.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedLangs.map(code => (
                    <span key={code} className="flex items-center gap-1 bg-indigo-600/20 text-indigo-300 text-xs px-2 py-0.5 rounded-full">
                      {LANGUAGES.find(l => l.code === code)?.name}
                      <button onClick={() => toggleLang(code)}>
                        <X size={10} className="hover:text-indigo-100" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Tone</label>
                <select
                  value={tone}
                  onChange={e => setTone(e.target.value as typeof tone)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500/60"
                >
                  <option value="auto">Auto (match source)</option>
                  <option value="formal">Formal</option>
                  <option value="informal">Casual</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-2">Domain</label>
                <input
                  type="text"
                  value={domain}
                  onChange={e => setDomain(e.target.value)}
                  placeholder="medical, legal, ecommerce…"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/60 transition-colors"
                />
              </div>
            </div>

            {/* Translate button + cost estimate */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleTranslate}
                disabled={loading || !sourceJson.trim() || !!jsonError || !selectedLangs.length}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors disabled:opacity-40"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : <Languages size={15} />}
                {loading ? "Translating…" : "Translate"}
              </button>
              {stringCount > 0 && selectedLangs.length > 0 && (
                <p className="text-xs text-zinc-600">
                  ~{stringCount * 3 * selectedLangs.length} words · est. <span className="text-zinc-400">${estimatedCost}</span>
                </p>
              )}
            </div>
          </div>

          {/* Right — results */}
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                Translations
              </label>
              {results.length > 1 && results.some(r => Object.keys(r.strings).length > 0) && (
                <button
                  onClick={downloadAll}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  <Download size={12} />
                  Download all (.zip)
                </button>
              )}
            </div>

            {results.length === 0 && !loading && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Languages size={32} className="text-zinc-800 mx-auto mb-3" />
                  <p className="text-sm text-zinc-600">Translations will appear here</p>
                  <p className="text-xs text-zinc-700 mt-1">Paste JSON on the left and hit Translate</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Loader2 size={28} className="text-indigo-400 mx-auto mb-3 animate-spin" />
                  <p className="text-sm text-zinc-500">Translating {selectedLangs.length} {selectedLangs.length === 1 ? "language" : "languages"}…</p>
                </div>
              </div>
            )}

            <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-180px)]">
              {results.map(result => (
                <div key={result.lang} className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                    <div className="flex items-center gap-2">
                      {Object.keys(result.strings).length > 0
                        ? <Check size={13} className="text-emerald-400" />
                        : <X size={13} className="text-red-400" />
                      }
                      <span className="text-sm font-semibold text-zinc-200">{result.name}</span>
                      <span className="text-[10px] text-zinc-600 uppercase font-mono">{result.lang}</span>
                    </div>
                    {Object.keys(result.strings).length > 0 && (
                      <button
                        onClick={() => downloadJson(result)}
                        className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        <Download size={12} />
                        JSON
                      </button>
                    )}
                  </div>
                  {Object.keys(result.strings).length > 0 ? (
                    <pre className="px-4 py-3 text-xs text-zinc-400 font-mono overflow-x-auto max-h-48 overflow-y-auto">
                      {JSON.stringify(result.strings, null, 2)}
                    </pre>
                  ) : (
                    <p className="px-4 py-3 text-xs text-red-400">Translation failed for this language.</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
