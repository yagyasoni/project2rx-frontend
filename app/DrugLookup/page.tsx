"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Search,
  X,
  Pill,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  Database,
  Users,
  Receipt,
} from "lucide-react";

// ─── Trending chips ──────────────────────────────────────────────────────
// ─── Fallback trending if DB has no searches yet ─────────────────────────
const FALLBACK_TRENDING = [
  "Eliquis",
  "Ozempic",
  "Mounjaro",
  "Jardiance",
  "Trelegy",
  "Xarelto",
  "Farxiga",
  "Rybelsus",
  "Creon",
  "Wegovy",
];

// ─── Stat tile metadata ──────────────────────────────────────────────────
const STAT_META: Record<string, { label: string; icon: any }> = {
  drugs_indexed: { label: "Drugs Indexed", icon: Pill },
  ndc_codes: { label: "NDC Codes", icon: Database },
  total_prescriptions: { label: "Prescriptions", icon: Receipt },
  pharmacies: { label: "Pharmacies", icon: Users },
};

// ─── Smart number formatter (847 / 45.9K+ / 1.2M+) ───────────────────────
const formatStat = (n: number | undefined) => {
  if (typeof n !== "number") return "—";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M+`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K+`;
  return n.toLocaleString();
};

// ─── Shape of /drug-lookup-landing response ──────────────────────────────
type LandingData = {
  stats: {
    drugs_indexed: number;
    ndc_codes: number;
    total_prescriptions: number;
    pharmacies: number;
  };
  trending: { query: string; hits: number }[];
};

// ═════════════════════════════════════════════════════════════════════════
// PAGE
// ═════════════════════════════════════════════════════════════════════════

export default function DrugLookupLandingPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [landingData, setLandingData] = useState<LandingData | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const searchRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Load recent searches
  useEffect(() => {
    try {
      const raw = localStorage.getItem("drugLookup_recentSearches");
      if (raw) setRecentSearches(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, []);


  // ── Fetch landing stats + trending ──
useEffect(() => {
  (async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/drug-lookup-landing`,
      );
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setLandingData(data);
    } catch (err) {
      console.error("Landing data error:", err);
      setLandingData(null);
    }
  })();
}, []);

  // Autocomplete API with debounce
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/drug-search?q=${encodeURIComponent(q)}`,
        );
        if (!res.ok) throw new Error("Search failed");
        const data: { name: string; rx_count: number }[] = await res.json();
        setSuggestions(data.map((d) => d.name));
      } catch (err) {
        console.error("Drug search error:", err);
        setSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const fillSearch = (term: string) => {
    setQuery(term);
    setFocused(false);
    inputRef.current?.focus();
    setTimeout(() => {
      const input = inputRef.current;
      if (input) {
        const len = term.length;
        input.setSelectionRange(len, len);
      }
    }, 0);
  };

  const submit = (term: string) => {
    const t = term.trim();
    if (!t) return;
    try {
      const next = [t, ...recentSearches.filter((x) => x !== t)].slice(0, 5);
      setRecentSearches(next);
      localStorage.setItem("drugLookup_recentSearches", JSON.stringify(next));
    } catch {
      /* ignore */
    }
    router.push(`/DrugLookup/results?q=${encodeURIComponent(t)}`);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("drugLookup_recentSearches");
  };

  return (
    <ProtectedRoute>
      <div className="relative w-full bg-white h-screen overflow-hidden">
        <div className="relative h-full w-full flex">
          {/* ── Sidebar ── */}
          <div
            className={`flex-shrink-0 transition-all duration-300 z-[130] ${
              sidebarCollapsed ? "w-[72px]" : "w-[260px]"
            }`}
          >
            <AppSidebar
              sidebarOpen={!sidebarCollapsed}
              setSidebarOpen={() => setSidebarCollapsed((v) => !v)}
              activePanel={activePanel}
              setActivePanel={setActivePanel}
            />
          </div>

          {/* ── Main (single screen) ── */}
          <div className="flex-1 min-w-0 flex flex-col">
            <section
              className="relative flex-1 flex flex-col overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, #0f766e 0%, #134e4a 45%, #0f172a 100%)",
              }}
            >
              {/* Decorative layers */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 30%, rgba(94, 234, 212, 0.35) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(129, 140, 248, 0.25) 0%, transparent 45%)",
                }}
              />
              <div
                className="absolute inset-0 opacity-[0.07] pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)",
                  backgroundSize: "48px 48px",
                }}
              />

              {/* Centered content */}
              <div className="relative flex-1 flex items-center justify-center px-8">
                <div className="w-full max-w-6xl">
                  {/* Breadcrumb / label */}
                  <div className="flex items-center justify-center gap-2 mb-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-[11px] font-semibold text-teal-100 uppercase tracking-widest">
                      <Pill className="w-3 h-3" />
                      Drug Lookup
                    </span>
                  </div>

                  {/* Headline */}
                  <h1 className="text-center text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight mb-3">
                    What do you want to search today?
                  </h1>
                  <p className="text-center text-teal-100/80 text-sm md:text-base max-w-2xl mx-auto mb-10 leading-relaxed">
                   AuditProRx Community-powered drug intelligence. Search the AuditProRx network for drug variants, NDC codes, payer performance, and unit pricing all in one place.
                  </p>

                  {/* Search bar */}
                  <div className="relative max-w-3xl mx-auto" ref={searchRef}>
                    <div
                      className={`relative flex items-center bg-white rounded-full shadow-2xl transition-all duration-200 ${
                        focused
                          ? "ring-4 ring-teal-300/40 shadow-teal-500/20"
                          : ""
                      }`}
                    >
                      <Search className="absolute left-6 h-5 w-5 text-slate-400 pointer-events-none" />
                      <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") submit(query);
                          if (e.key === "Escape") {
                            setFocused(false);
                            inputRef.current?.blur();
                          }
                        }}
                        placeholder="Type drug name or NDC..."
                        className="flex-1 h-16 pl-16 pr-4 bg-transparent text-[15px] text-slate-800 placeholder:text-slate-400 focus:outline-none"
                      />

                      {query && (
                        <button
                          onClick={() => {
                            setQuery("");
                            inputRef.current?.focus();
                          }}
                          className="mr-2 h-9 w-9 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Clear"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => submit(query)}
                        disabled={!query.trim()}
                        className="mr-2 h-12 px-6 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold transition-all shadow-lg shadow-teal-500/30 flex items-center gap-2"
                      >
                        Search
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Autocomplete dropdown */}
                    {focused && (suggestions.length > 0 || recentSearches.length > 0) && (
                      <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50">
                        {suggestions.length > 0 && (
                          <div className="py-2">
                            <p className="px-4 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                              <Sparkles className="w-3 h-3" />
                              Suggestions
                            </p>
                            {suggestions.map((s) => (
                              <button
                                key={s}
                                onClick={() => fillSearch(s)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-teal-50/70 text-left group transition-colors"
                              >
                                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600" />
                                <span className="text-sm text-slate-700 group-hover:text-teal-800 font-medium">
                                  {s}
                                </span>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-300 ml-auto group-hover:text-teal-500 group-hover:translate-x-0.5 transition-transform" />
                              </button>
                            ))}
                          </div>
                        )}

                        {suggestions.length === 0 && recentSearches.length > 0 && (
                          <div className="py-2">
                            <div className="px-4 py-1.5 flex items-center justify-between">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Clock className="w-3 h-3" />
                                Recent Searches
                              </p>
                              <button
                                onClick={clearRecent}
                                className="text-[10px] font-semibold text-slate-400 hover:text-red-500"
                              >
                                Clear
                              </button>
                            </div>
                            {recentSearches.map((s) => (
                              <button
                                key={s}
                                onClick={() => fillSearch(s)}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left group transition-colors"
                              >
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span className="text-sm text-slate-700 font-medium">
                                  {s}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Trending searches */}
                  {/* Trending searches (live from DB) */}
<div className="max-w-3xl mx-auto mt-8">
  <div className="flex items-start gap-3 flex-wrap justify-center">
    <span className="text-[11px] font-bold text-teal-100/70 uppercase tracking-widest flex items-center gap-1.5 pt-1.5">
      <TrendingUp className="w-3 h-3" />
      Trending
    </span>
    <div className="flex items-center gap-2 flex-wrap justify-center">
      {(landingData?.trending?.length
        ? landingData.trending.map((t) => t.query)
        : FALLBACK_TRENDING
      ).map((term) => (
        <button
          key={term}
          onClick={() => fillSearch(term)}
          className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40 text-[12px] font-semibold text-white transition-all hover:scale-105"
        >
          {term}
        </button>
      ))}
    </div>
  </div>
</div>
                </div>
              </div>

              {/* Stats strip pinned to bottom of hero */}
              {/* Stats strip (live from DB) */}
<div className="relative border-t border-white/10 bg-white/5 backdrop-blur-sm">
  <div className="max-w-6xl mx-auto px-8 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
    {(["drugs_indexed", "ndc_codes", "total_prescriptions", "pharmacies"] as const).map((key) => {
      const meta = STAT_META[key];
      const Icon = meta.icon;
      const value = landingData?.stats?.[key];

      return (
        <div key={key} className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-teal-500/20 border border-teal-400/30 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-teal-300" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-teal-200/70 uppercase tracking-widest">
              {meta.label}
            </p>
            <p className="text-sm font-extrabold text-white tabular-nums">
              {formatStat(value)}
            </p>
          </div>
        </div>
      );
    })}
  </div>
</div>
            </section>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}