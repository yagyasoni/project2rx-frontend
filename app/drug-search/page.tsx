"use client";

import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, X, Loader2, Inbox, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/components/adminLayout";

/* ── Types ─────────────────────────────────────── */
interface DrugRecord {
  drug_name: string;
  ndc: string;
  primary_bin: string;
  primary_pcn: string;
  primary_group: string;
}

/* ── Mock data (replace with API) ──────────────── */
const MOCK_DATA: DrugRecord[] = [
  {
    drug_name: "Lisinopril 10mg",
    ndc: "00093-7339-01",
    primary_bin: "004336",
    primary_pcn: "ADV",
    primary_group: "RX1234",
  },
  {
    drug_name: "Metformin 500mg",
    ndc: "00093-7214-01",
    primary_bin: "610014",
    primary_pcn: "MCAIDNJ",
    primary_group: "NJRX01",
  },
  {
    drug_name: "Atorvastatin 20mg",
    ndc: "00093-5057-01",
    primary_bin: "003858",
    primary_pcn: "A4",
    primary_group: "MEDD01",
  },
  {
    drug_name: "Amoxicillin 500mg",
    ndc: "00093-3107-01",
    primary_bin: "004336",
    primary_pcn: "ADV",
    primary_group: "RX5678",
  },
  {
    drug_name: "Omeprazole 20mg",
    ndc: "00093-5280-01",
    primary_bin: "610014",
    primary_pcn: "MCAIDNJ",
    primary_group: "NJRX02",
  },
  {
    drug_name: "Amlodipine 5mg",
    ndc: "00093-3165-01",
    primary_bin: "003858",
    primary_pcn: "A4",
    primary_group: "MEDD02",
  },
  {
    drug_name: "Metoprolol 50mg",
    ndc: "00093-0733-01",
    primary_bin: "004336",
    primary_pcn: "ADV",
    primary_group: "RX9012",
  },
  {
    drug_name: "Losartan 50mg",
    ndc: "00093-7367-01",
    primary_bin: "610014",
    primary_pcn: "MCAIDNJ",
    primary_group: "NJRX03",
  },
  {
    drug_name: "Gabapentin 300mg",
    ndc: "00093-0637-01",
    primary_bin: "003858",
    primary_pcn: "A4",
    primary_group: "MEDD03",
  },
  {
    drug_name: "Sertraline 50mg",
    ndc: "00093-7193-01",
    primary_bin: "004336",
    primary_pcn: "ADV",
    primary_group: "RX3456",
  },
];

/* ── Highlight matched text ────────────────────── */
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span className="bg-foreground/10 font-semibold">
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  );
}

/* ── Main component ────────────────────────────── */
export default function DrugSearch() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setDebouncedQuery(query);
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const q = debouncedQuery.toLowerCase();
    return MOCK_DATA.filter((d) => d.drug_name.toLowerCase().includes(q));
  }, [debouncedQuery]);

  const handleClear = useCallback(() => {
    setQuery("");
    setDebouncedQuery("");
    inputRef.current?.focus();
  }, []);

  // Keyboard shortcut: focus on /
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const hasQuery = query.trim().length > 0;
  const showResults = hasQuery && !loading;

  return (
    <AdminLayout>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <header className="border-b bg-card px-0 pb-5">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              DRUG SEARCH
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Search inventory by drug name to view NDC &amp; primary payer
              details
            </p>
          </div>
        </header>

        <main className="mx-auto max-w-5xl py-8 space-y-6">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Search drug name…  (press "/" to focus)'
              className="h-11 pl-10 pr-10 text-sm font-mono border-border bg-card"
            />
            {hasQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={handleClear}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* States */}
          {!hasQuery && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Pill className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Start typing to search for a drug
              </p>
              <p className="text-xs text-muted-foreground/60">
                Results will include NDC, BIN, PCN and Group details
              </p>
            </div>
          )}

          {loading && hasQuery && (
            <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Searching…</span>
            </div>
          )}

          {showResults && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Inbox className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground">
                No results found
              </p>
              <p className="text-xs text-muted-foreground">
                Try a different drug name or check the spelling
              </p>
            </div>
          )}

          {showResults && results.length > 0 && (
            <>
              <p className="text-xs text-muted-foreground">
                {results.length} result{results.length !== 1 ? "s" : ""} found
              </p>

              {/* Desktop table */}
              <div className="hidden md:block overflow-hidden rounded-lg border bg-card">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b bg-muted/40">
                        <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          #
                        </th>
                        <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Drug Name
                        </th>
                        <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          NDC Number
                        </th>
                        <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Primary BIN
                        </th>
                        <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Primary PCN
                        </th>
                        <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Primary Group
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((r, i) => (
                        <tr
                          key={r.ndc}
                          className="border-b last:border-b-0 transition-colors hover:bg-muted/30"
                        >
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            {i + 1}
                          </td>
                          <td className="px-4 py-3 text-[13px] font-medium text-foreground">
                            <HighlightText
                              text={r.drug_name}
                              query={debouncedQuery}
                            />
                          </td>
                          <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                            {r.ndc}
                          </td>
                          <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                            {r.primary_bin}
                          </td>
                          <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                            {r.primary_pcn}
                          </td>
                          <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                            {r.primary_group}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-3">
                {results.map((r, i) => (
                  <div
                    key={r.ndc}
                    className="rounded-lg border bg-card p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">
                        <HighlightText
                          text={r.drug_name}
                          query={debouncedQuery}
                        />
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        #{i + 1}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">NDC: </span>
                        <span className="font-mono text-foreground">
                          {r.ndc}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">BIN: </span>
                        <span className="font-mono text-foreground">
                          {r.primary_bin}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">PCN: </span>
                        <span className="font-mono text-foreground">
                          {r.primary_pcn}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Group: </span>
                        <span className="font-mono text-foreground">
                          {r.primary_group}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </AdminLayout>
  );
}
