"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Search, ArrowUpDown } from "lucide-react";
import AppSidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";
import ProtectedRoute from "@/components/ProtectedRoute";
import { fetchReportRows, type InventoryRow } from "./reportData";

/**
 * Compact report view, served below 1024px (covers phone portrait, phone
 * landscape and small tablets). Deliberately reduced: view, search, sort and
 * paginate. No column picker, tags, export or drill-down panels — those remain
 * desktop-only.
 *
 * All financial values come from reportData.ts, the same module the desktop
 * view uses, so the two can never disagree on a number.
 */

type SortKey =
  | "drugName"
  | "totalOrdered"
  | "totalBilled"
  | "totalShortage"
  | "highestShortage"
  | "cost"
  | "amount";

/** Column order mirrors the desktop table. */
const COLUMNS: { key: SortKey; label: string; align: "left" | "right" }[] = [
  { key: "totalOrdered", label: "Ordered", align: "right" },
  { key: "totalBilled", label: "Billed", align: "right" },
  { key: "totalShortage", label: "Total Shortage", align: "right" },
  { key: "highestShortage", label: "Highest Short", align: "right" },
  { key: "cost", label: "$ Cost", align: "right" },
  { key: "amount", label: "$ Amount", align: "right" },
];

/** Dollar-valued columns render as currency; the rest as plain counts. */
const MONEY_KEYS: SortKey[] = ["cost", "amount"];
/** Shortage columns go red when negative. */
const SHORTAGE_KEYS: SortKey[] = ["totalShortage", "highestShortage"];

const ROWS_PER_PAGE = 50;

const money = (v: number) =>
  `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function MobileReport() {
  const params = useParams();
  const auditId = params.id as string;

  const [rows, setRows] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [dates, setDates] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("amount");
  const [sortDesc, setSortDesc] = useState(true);
  const [page, setPage] = useState(1);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);

  useEffect(() => {
    if (!auditId) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        const [reportRows, auditRes] = await Promise.all([
          fetchReportRows(auditId),
          fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/${auditId}`,
          ).then((r) => r.json()),
        ]);
        if (cancelled) return;
        setRows(reportRows);
        setDates(auditRes);
      } catch (e) {
        console.error(e);
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [auditId]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = q
      ? rows.filter(
          (r) =>
            r.drugName.toLowerCase().includes(q) ||
            r.ndc.toLowerCase().includes(q),
        )
      : rows;

    return [...base].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp =
        typeof av === "string" && typeof bv === "string"
          ? av.localeCompare(bv)
          : Number(av) - Number(bv);
      return sortDesc ? -cmp : cmp;
    });
  }, [rows, search, sortKey, sortDesc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pageRows = filtered.slice(
    (safePage - 1) * ROWS_PER_PAGE,
    safePage * ROWS_PER_PAGE,
  );

  useEffect(() => {
    setPage(1);
  }, [search, sortKey, sortDesc]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDesc((d) => !d);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  };

  const totalAmount = filtered.reduce((s, r) => s + r.amount, 0);
  const shortRows = filtered.filter((r) => r.totalShortage < 0).length;

  const fmtDate = (d?: string) =>
    d ? new Date(d).toLocaleDateString("en-US") : "—";

  return (
    <ProtectedRoute>
      <div className="h-[100dvh] w-full flex bg-white overflow-hidden">
        {/* Icon rail — navigation stays reachable */}
        <div className="w-[72px] shrink-0 z-40">
          <AppSidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={() => setSidebarOpen((v) => !v)}
            activePanel={activePanel}
            setActivePanel={setActivePanel}
          />
        </div>

        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <Loader
            show={loading}
            done={!loading}
            fixed={false}
            progress={loading ? 60 : 100}
            progressLabel="Loading report"
            subtitle="Please wait a moment"
          />

          {/* Header */}
          <div className="border-b border-slate-200 bg-white px-3 py-2 shrink-0">
            <h1 className="text-base font-bold uppercase tracking-wide text-slate-800">
              Inventory Report
            </h1>

            {/*
              Every chip is shrink-0 + whitespace-nowrap. globals.css sets
              `overflow-wrap: anywhere` on span/p, which makes a flex item's
              min-content width ONE CHARACTER — without these, flexbox crushes
              each chip into a vertical column of letters.
            */}
            <div className="mt-1.5 flex items-center gap-2 overflow-x-auto pb-1">
              <div className="shrink-0 whitespace-nowrap rounded-lg border border-red-200 bg-red-50 px-2.5 py-1">
                <p className="text-[9px] font-bold uppercase tracking-wider text-red-700 whitespace-nowrap">
                  Inventory
                </p>
                <p className="text-[11px] font-semibold text-slate-800 whitespace-nowrap">
                  {fmtDate(dates?.inventory_start_date)} –{" "}
                  {fmtDate(dates?.inventory_end_date)}
                </p>
              </div>

              <div className="shrink-0 whitespace-nowrap rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1">
                <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-700 whitespace-nowrap">
                  Wholesaler
                </p>
                <p className="text-[11px] font-semibold text-slate-800 whitespace-nowrap">
                  {fmtDate(dates?.wholesaler_start_date)} –{" "}
                  {fmtDate(dates?.wholesaler_end_date)}
                </p>
              </div>

              <div className="shrink-0 whitespace-nowrap rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                  Total Amount
                </p>
                <p className="text-[11px] font-bold text-slate-800 tabular-nums whitespace-nowrap">
                  {money(totalAmount)}
                </p>
              </div>

              <div className="shrink-0 whitespace-nowrap rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1">
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">
                  Short Rows
                </p>
                <p className="text-[11px] font-bold text-slate-800 tabular-nums whitespace-nowrap">
                  {shortRows.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="border-b border-slate-200 bg-white px-3 py-2 shrink-0">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search drug name or NDC…"
                className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-400"
              />
            </div>
          </div>

          {/* Table */}
          <div className="mrt flex-1 overflow-auto">
            <table
              style={{
                borderCollapse: "separate",
                borderSpacing: 0,
                minWidth: "max-content",
              }}
            >
              <thead>
                <tr>
                  <th
                    className="mr-drug sticky top-0 z-30 cursor-pointer bg-slate-50 text-left"
                    style={{ left: 0 }}
                    onClick={() => toggleSort("drugName")}
                  >
                    <div className="flex items-center gap-1 px-3 py-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 whitespace-nowrap">
                        Drug Name
                      </span>
                      <ArrowUpDown className="h-3 w-3 shrink-0 text-slate-400" />
                    </div>
                  </th>

                  {COLUMNS.map((c) => (
                    <th
                      key={c.key}
                      className="sticky top-0 z-20 cursor-pointer bg-slate-50"
                      onClick={() => toggleSort(c.key)}
                    >
                      <div className="flex items-center justify-end gap-1 px-3 py-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 whitespace-nowrap">
                          {c.label}
                        </span>
                        <ArrowUpDown className="h-3 w-3 shrink-0 text-slate-400" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {pageRows.map((row, i) => {
                  const bg = i % 2 === 1 ? "#f8fafc" : "#ffffff";
                  return (
                    <tr key={row.id}>
                      <td
                        className="mr-drug sticky z-10"
                        style={{ left: 0, background: bg }}
                      >
                        <div className="px-3 py-2">
                          <p
                            title={row.drugName}
                            className="truncate text-xs font-semibold text-slate-800"
                          >
                            {row.drugName}
                          </p>
                          <p className="truncate text-[10px] tabular-nums text-slate-400">
                            {row.ndc}
                          </p>
                        </div>
                      </td>

                      {COLUMNS.map((c) => {
                        const v = row[c.key] as number;
                        const isMoney = MONEY_KEYS.includes(c.key);
                        const negative = SHORTAGE_KEYS.includes(c.key) && v < 0;
                        return (
                          <td
                            key={c.key}
                            className="px-3 py-2 text-right"
                            style={{ background: bg }}
                          >
                            <span
                              className={`text-xs tabular-nums whitespace-nowrap ${
                                negative
                                  ? "font-semibold text-red-600"
                                  : isMoney
                                    ? "font-semibold text-slate-800"
                                    : "text-slate-600"
                              }`}
                            >
                              {isMoney ? money(v) : v.toLocaleString()}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

                {!loading && pageRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={COLUMNS.length + 1}
                      className="px-4 py-10 text-center text-sm text-slate-400"
                    >
                      No drugs match “{search}”.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex shrink-0 items-center justify-between gap-2 border-t border-slate-200 bg-white px-3 py-2">
            <span className="whitespace-nowrap text-[11px] text-slate-500">
              <b className="text-slate-700">{filtered.length.toLocaleString()}</b>{" "}
              rows
            </span>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="h-7 whitespace-nowrap rounded-lg border border-slate-200 px-2.5 text-xs text-slate-600 disabled:opacity-40"
              >
                ← Prev
              </button>
              <span className="whitespace-nowrap px-1 text-xs font-semibold tabular-nums text-slate-600">
                {safePage} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="h-7 whitespace-nowrap rounded-lg border border-slate-200 px-2.5 text-xs text-slate-600 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Drug Name is the only frozen column. Width is generous in landscape,
           tight in portrait — it truncates either way (title= carries the full
           name). */
        .mr-drug {
          position: sticky;
          width: 150px;
          min-width: 150px;
          max-width: 150px;
          box-shadow:
            inset -1px 0 0 0 #e2e8f0,
            4px 0 8px -2px rgba(0, 0, 0, 0.08);
        }
        @media (min-width: 640px) {
          .mr-drug {
            width: 200px;
            min-width: 200px;
            max-width: 200px;
          }
        }
        .mrt thead th {
          border-bottom: 1px solid #cbd5e1;
        }
        .mrt tbody td {
          border-bottom: 1px solid #e2e8f0;
        }
        .mrt {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
        .mrt::-webkit-scrollbar {
          height: 8px;
          width: 8px;
        }
        .mrt::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 8px;
        }
      `}</style>
    </ProtectedRoute>
  );
}
