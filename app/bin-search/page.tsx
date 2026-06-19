"use client";

import { useEffect, useState } from "react";
import {
  Search,
  CheckCircle,
  XCircle,
  Mail,
  Copy,
  Check,
  History,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import axios from "axios";

const API_BASE = "https://api.auditprorx.com";
const RECENT_KEY = "binSearchRecent";
const RECENT_MAX = 8;

type BinEntry = {
  pbm_name: string;
  payer_type: string;
};

type RecentSearch = {
  bin: string;
  pcn: string;
  group: string;
};

// Map a payer type to a badge style by keyword so the result list reads at a glance.
const payerTypeBadgeClass = (payerType: string) => {
  const t = (payerType || "").toLowerCase();
  if (t.includes("pbm"))
    return "bg-cyan-50 text-cyan-700 border border-cyan-200";
  if (t.includes("commercial"))
    return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  if (t.includes("medicaid") || t.includes("medicare"))
    return "bg-purple-50 text-purple-700 border border-purple-200";
  return "bg-slate-100 text-slate-600 border border-slate-200";
};

// Derive up to two initials from a PBM name for the result card avatar.
const payerInitials = (name: string) => {
  const words = (name || "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

export default function BinSearch() {
  const [binNumber, setBinNumber] = useState("");
  const [pcnNumber, setPcnNumber] = useState("");
  const [groupNumber, setGroupNumber] = useState("");
  const [results, setResults] = useState<BinEntry[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  // The query that produced the current results, echoed in the results header.
  const [lastQuery, setLastQuery] = useState<RecentSearch | null>(null);

  // ── Recent searches (localStorage) ──
  useEffect(() => {
    try {
      const raw = localStorage.getItem(RECENT_KEY);
      if (raw) setRecentSearches(JSON.parse(raw));
    } catch {
      setRecentSearches([]);
    }
  }, []);

  const pushRecent = (entry: RecentSearch) => {
    setRecentSearches((prev) => {
      const key = (e: RecentSearch) => `${e.bin}|${e.pcn}|${e.group}`;
      const next = [
        entry,
        ...prev.filter((e) => key(e) !== key(entry)),
      ].slice(0, RECENT_MAX);
      try {
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {
        /* ignore storage failures */
      }
      return next;
    });
  };

  const clearRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {
      /* ignore */
    }
  };

  const handleBinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setBinNumber(value);
    setSearched(false);
    setResults([]);
  };

  const runSearch = async (bin: string, pcn: string, group: string) => {
    if (bin.length < 1) return;
    setLoading(true);
    try {
      const params = new URLSearchParams({ bin });
      if (pcn.trim()) params.append("pcn", pcn.trim());
      if (group.trim()) params.append("group", group.trim());

      const res = await axios.get(
        `${API_BASE}/api/bin-search?${params.toString()}`,
      );
      setResults(res.data || []);
    } catch (err) {
      console.error("BIN search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
      setSearched(true);
      setLastQuery({ bin, pcn: pcn.trim(), group: group.trim() });
      pushRecent({ bin, pcn: pcn.trim(), group: group.trim() });
    }
  };

  const handleSearch = () => runSearch(binNumber, pcnNumber, groupNumber);

  const runRecent = (entry: RecentSearch) => {
    setBinNumber(entry.bin);
    setPcnNumber(entry.pcn);
    setGroupNumber(entry.group);
    runSearch(entry.bin, entry.pcn, entry.group);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && binNumber.length >= 1) handleSearch();
  };

  const handleClear = () => {
    setBinNumber("");
    setPcnNumber("");
    setGroupNumber("");
    setResults([]);
    setSearched(false);
    setLastQuery(null);
  };

  const handleCopy = (entry: BinEntry, index: number) => {
    const text = `${lastQuery?.bin ?? binNumber} — ${entry.pbm_name} (${entry.payer_type})`;
    navigator.clipboard?.writeText(text).then(
      () => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 1200);
      },
      () => {},
    );
  };

  const isReady = binNumber.length >= 4;
  const canSearch = binNumber.length >= 1 && !loading;

  const recentLabel = (e: RecentSearch) =>
    [e.bin, e.pcn, e.group].filter(Boolean).join(" · ");

  return (
    <ProtectedRoute role="user">
      <div className="flex h-screen bg-slate-50">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
        />

        <main className="flex-1 overflow-auto">
          {/* ── Header ── */}
          <div className="bg-white border-b border-slate-200">
            <div className="px-8 py-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
                <Search className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Bin Search
                </h1>
                <p className="text-sm font-medium text-slate-500 mt-0.5">
                  Identify the PBM and payer type for an insurance BIN.
                </p>
              </div>
            </div>
          </div>

          {/* ── Content ── */}
          <div className="px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
              {/* ── LEFT: Search panel ── */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 h-fit">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-5">
                  Search
                </h2>

                <div className="space-y-4">
                  {/* BIN */}
                  <div>
                    <label
                      htmlFor="bin-number"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      BIN Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        id="bin-number"
                        type="text"
                        inputMode="numeric"
                        value={binNumber}
                        onChange={handleBinChange}
                        onKeyDown={handleKeyDown}
                        placeholder="Enter BIN number"
                        maxLength={6}
                        className={`pr-11 h-12 text-base transition-colors ${
                          isReady
                            ? "border-emerald-400 focus:border-emerald-500 focus-visible:ring-emerald-400"
                            : "border-slate-300 focus:border-slate-500 focus-visible:ring-slate-300"
                        }`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isReady ? (
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <Search className="h-5 w-5 text-slate-400" />
                        )}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {binNumber.length}/6 digits
                    </p>
                  </div>

                  {/* PCN */}
                  <div>
                    <label
                      htmlFor="pcn-number"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      PCN Number{" "}
                      <span className="text-slate-400 font-normal">
                        (optional)
                      </span>
                    </label>
                    <Input
                      id="pcn-number"
                      type="text"
                      value={pcnNumber}
                      onChange={(e) => {
                        setPcnNumber(e.target.value);
                        setSearched(false);
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter PCN number"
                      className="h-12 text-base border-slate-300 focus:border-slate-500 focus-visible:ring-slate-300"
                    />
                  </div>

                  {/* Group */}
                  <div>
                    <label
                      htmlFor="group-number"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Group Number{" "}
                      <span className="text-slate-400 font-normal">
                        (optional)
                      </span>
                    </label>
                    <Input
                      id="group-number"
                      type="text"
                      value={groupNumber}
                      onChange={(e) => {
                        setGroupNumber(e.target.value);
                        setSearched(false);
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Enter Group number"
                      className="h-12 text-base border-slate-300 focus:border-slate-500 focus-visible:ring-slate-300"
                    />
                  </div>

                  {/* Search button */}
                  <button
                    onClick={handleSearch}
                    disabled={!canSearch}
                    className="w-full h-12 bg-slate-900 text-white rounded-lg font-semibold text-base hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Search className="h-5 w-5" />
                    )}
                    {loading ? "Searching..." : "Search"}
                  </button>

                  {(binNumber || pcnNumber || groupNumber || searched) && (
                    <button
                      onClick={handleClear}
                      className="w-full text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Recent searches */}
                {recentSearches.length > 0 && (
                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        <History className="w-3.5 h-3.5" />
                        Recent
                      </span>
                      <button
                        onClick={clearRecent}
                        className="text-[11px] font-semibold text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((entry, i) => (
                        <button
                          key={`${entry.bin}-${entry.pcn}-${entry.group}-${i}`}
                          onClick={() => runRecent(entry)}
                          title="Run this search again"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 text-xs font-semibold text-slate-600 tabular-nums transition-colors"
                        >
                          {recentLabel(entry)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── RIGHT: Results panel ── */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col min-h-[60vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                      Results
                    </h2>
                    {searched && !loading && (
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 rounded-full px-2.5 py-0.5">
                        {results.length}
                      </span>
                    )}
                  </div>
                  {searched && lastQuery && (
                    <span className="text-xs text-slate-400 tabular-nums truncate">
                      BIN {lastQuery.bin}
                      {lastQuery.pcn ? ` · PCN ${lastQuery.pcn}` : ""}
                      {lastQuery.group ? ` · GRP ${lastQuery.group}` : ""}
                    </span>
                  )}
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                  {loading ? (
                    /* Loading skeletons */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="border border-slate-100 rounded-xl p-5"
                        >
                          <div className="flex items-start gap-3">
                            <Skeleton className="h-11 w-11 rounded-xl shrink-0" />
                            <div className="flex-1 space-y-2">
                              <Skeleton className="h-4 w-32" />
                              <Skeleton className="h-5 w-20 rounded-full" />
                            </div>
                          </div>
                          <Skeleton className="h-9 w-full rounded-lg mt-4" />
                        </div>
                      ))}
                    </div>
                  ) : !searched ? (
                    /* Idle empty state */
                    <div className="flex flex-col items-center justify-center text-center py-20">
                      <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                        <Search className="w-7 h-7 text-slate-300" />
                      </div>
                      <p className="text-sm font-semibold text-slate-600">
                        Search a BIN to see matches
                      </p>
                      <p className="text-xs text-slate-400 mt-1 max-w-xs">
                        Enter a BIN number (and optionally PCN / Group) on the
                        left to identify the PBM and payer type.
                      </p>
                    </div>
                  ) : results.length > 0 ? (
                    /* Results */
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {results.map((r, i) => (
                        <div
                          key={i}
                          className="group flex flex-col border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-md transition-all"
                        >
                          {/* Top: avatar + name + payer badge */}
                          <div className="flex items-start gap-3">
                            <div
                              className={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold ${payerTypeBadgeClass(
                                r.payer_type,
                              )}`}
                            >
                              {payerInitials(r.pbm_name)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p
                                className="text-base font-bold text-slate-900 leading-snug break-words"
                                title={r.pbm_name}
                              >
                                {r.pbm_name}
                              </p>
                              <span
                                className={`mt-1.5 inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${payerTypeBadgeClass(
                                  r.payer_type,
                                )}`}
                              >
                                {r.payer_type}
                              </span>
                            </div>
                          </div>

                          {/* Footer: full-width copy action */}
                          <button
                            onClick={() => handleCopy(r, i)}
                            title="Copy result"
                            className="mt-4 w-full h-9 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 transition-colors"
                          >
                            {copiedIndex === i ? (
                              <>
                                <Check className="w-4 h-4 text-emerald-500" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* No results */
                    <div className="flex flex-col items-center justify-center text-center py-16">
                      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                        <XCircle className="w-7 h-7 text-red-400" />
                      </div>
                      <p className="text-sm font-semibold text-slate-700">
                        No results found for this BIN number.
                      </p>
                      <p className="text-xs text-slate-400 mt-1 mb-5">
                        For more queries, please contact us.
                      </p>
                      <a
                        href="mailto:Rx.drugdrop@gmail.com"
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        Contact Support
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
