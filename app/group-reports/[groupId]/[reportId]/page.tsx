"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MoveLeftIcon,
  Search,
  Download,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Users,
  FileText,
  CalendarDays,
  X,
} from "lucide-react";
import AppSidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface GroupReport {
  id: string;
  pharmacy_name: string;
  label: string | null;
  source_audit_id: string | null;
  created_at: string;
}

interface GroupReportRow {
  ndc: string;
  drug_name: string;
  package_size: number | string | null;
  rank: number | null;
  values: Record<string, number | null>;
}

interface ReportDetail {
  report: GroupReport;
  pharmacies: string[];
  rows: GroupReportRow[];
}

const PAGE_SIZE = 25;

// Key the sidebar uses to mark the Group Reports nav item active.
// If your Sidebar.tsx expects a different string, change this one value.
const SIDEBAR_PANEL_KEY = "group-reports";

export default function GroupReportPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(
    SIDEBAR_PANEL_KEY,
  );

  return (
    <ProtectedRoute role="user">
      <div className="relative h-screen w-full overflow-hidden bg-[#fafafa]">
        <div className="relative flex h-full w-full">
          <div
            className={`z-[130] flex-shrink-0 transition-all duration-300 ${
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

          <div className="min-w-0 flex-1 overflow-y-auto">
            <GroupReportContent setActivePanel={setActivePanel} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function GroupReportContent({
  setActivePanel,
}: {
  setActivePanel: (v: string | null) => void;
}) {
  const router = useRouter();
  const params = useParams();
  const groupId = params.groupId as string;
  const reportId = params.reportId as string;

  const [data, setData] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(
    null,
  );
  const [page, setPage] = useState(1);

  // Keep the Group Reports item selected in the sidebar on this route.
  useEffect(() => {
    setActivePanel(SIDEBAR_PANEL_KEY);
  }, [setActivePanel]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.get(
          `/api/inventory-view/groups/${groupId}/reports/${reportId}`,
        );
        if (active) setData(res.data);
      } catch {
        if (active) setData(null);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [groupId, reportId]);

  const pharmacies = data?.pharmacies ?? [];

  const isPharmacyKey = (key: string) => pharmacies.includes(key);

  const sortValue = (row: GroupReportRow, key: string) =>
    key === "rank" ||
    key === "ndc" ||
    key === "drug_name" ||
    key === "package_size"
      ? (row as any)[key]
      : row.values[key];

  const getRows = (): GroupReportRow[] => {
    let base: GroupReportRow[] = data
      ? data.rows.map((r, idx) => ({ ...r, rank: r.rank ?? idx + 1 }))
      : [];
    const q = search.trim().toLowerCase();
    if (q) {
      base = base.filter(
        (r) =>
          (r.ndc || "").toLowerCase().includes(q) ||
          (r.drug_name || "").toLowerCase().includes(q),
      );
    }
    if (!sort) return base;
    const { key, dir } = sort;
    const numeric = key !== "ndc" && key !== "drug_name";
    return [...base].sort((a, b) => {
      const av = sortValue(a, key);
      const bv = sortValue(b, key);
      const cmp = numeric
        ? Number(av ?? 0) - Number(bv ?? 0)
        : String(av ?? "").localeCompare(String(bv ?? ""));
      return dir === "asc" ? cmp : -cmp;
    });
  };

  const toggleSort = (key: string) =>
    setSort((prev) =>
      prev && prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );

  const handleDownloadCsv = () => {
    if (!data) return;
    const header = ["Rank", "NDC", "Drug Name", "Pkg Size", ...pharmacies];
    const csv = [
      header.join(","),
      ...getRows().map((r) =>
        [
          r.rank,
          r.ndc,
          r.drug_name,
          r.package_size,
          ...pharmacies.map((ph) => r.values[ph]),
        ]
          .map((v) => JSON.stringify(v ?? ""))
          .join(","),
      ),
    ].join("\n");
    const safeName = (data.report.label || "report")
      .replace(/[^a-z0-9]+/gi, "_")
      .toLowerCase();
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })),
      download: `${safeName}.csv`,
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const baseColumns: { key: string; label: string; mono?: boolean }[] = [
    { key: "rank", label: "Rank" },
    { key: "ndc", label: "NDC", mono: true },
    { key: "drug_name", label: "Drug Name" },
    { key: "package_size", label: "Pkg Size" },
  ];
  const allColumns = [
    ...baseColumns,
    ...pharmacies.map((ph) => ({ key: ph, label: ph })),
  ];

  const rows = getRows();
  const title = data?.report.label || data?.report.pharmacy_name || "Report";

  // -- Pagination (client-side, over the filtered + sorted rows) --------------
  const totalRows = rows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [search, sort, data]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const startIdx = (page - 1) * PAGE_SIZE;
  const pageRows = rows.slice(startIdx, startIdx + PAGE_SIZE);
  const rangeStart = totalRows === 0 ? 0 : startIdx + 1;
  const rangeEnd = Math.min(startIdx + PAGE_SIZE, totalRows);

  // Analytics color scale for shortage values: the one place color earns its
  // place. Negative = red, zero = amber, positive = green. Theme stays neutral.
  const shortageTone = (n: number) =>
    n < 0 ? "text-red-600" : n > 0 ? "text-emerald-600" : "text-amber-500";

  return (
    <div className="px-6 py-6 md:px-10 md:py-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <button
            onClick={() => router.back()}
            className="mt-1 flex flex-shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <MoveLeftIcon className="h-4 w-4" /> Back
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gray-700 to-black text-white shadow-sm">
                <FileText className="h-4 w-4" />
              </span>
              <h1 className="truncate text-2xl font-bold tracking-tight text-slate-900">
                {title}
              </h1>
            </div>

            {/* Analytics chips — each stat in its own color */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                <Users className="h-3.5 w-3.5" />
                {pharmacies.length}{" "}
                {pharmacies.length === 1 ? "pharmacy" : "pharmacies"}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <FileText className="h-3.5 w-3.5" />
                {totalRows} {totalRows === 1 ? "drug" : "drugs"}
              </span>
              {data?.report.created_at && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {new Date(data.report.created_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {data && (
          <Button
            variant="outline"
            size="sm"
            className="flex-shrink-0 gap-1.5 border-slate-900 bg-slate-900 text-white shadow-sm transition-colors hover:bg-black hover:text-white"
            onClick={handleDownloadCsv}
          >
            <Download className="h-4 w-4" /> Download CSV
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-slate-800" />
          <p className="text-sm text-slate-500">Loading report…</p>
        </div>
      ) : !data ? (
        <div className="flex flex-col items-center gap-3 py-24 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
            <FileText className="h-5 w-5 text-slate-400" />
          </div>
          <p className="text-sm text-slate-500">Could not load this report.</p>
        </div>
      ) : (
        <>
          {/* Search — full-width, framed, with clear button */}
          <div className="group relative mb-3 w-full max-w-md">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-slate-700" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search drug name or NDC…"
              className="h-11 rounded-xl border-slate-200 bg-white pl-10 pr-10 text-sm shadow-sm transition-all placeholder:text-slate-400 focus-visible:border-slate-400 focus-visible:ring-2 focus-visible:ring-slate-900/10"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Table — horizontally scrollable; vertical + horizontal grid lines */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto overflow-y-auto">
              <table className="w-full min-w-max border-separate border-spacing-0 text-left text-xs">
                <thead className="sticky top-0 z-10 bg-slate-50 text-slate-600">
                  <tr>
                    {allColumns.map((col, ci) => {
                      const active = sort?.key === col.key;
                      const right = isPharmacyKey(col.key);
                      return (
                        <th
                          key={col.key}
                          className={`whitespace-nowrap border-b border-slate-200 px-3.5 py-3 text-[11px] font-semibold uppercase tracking-wider ${
                            ci > 0 ? "border-l border-slate-200" : ""
                          } ${right ? "text-right" : ""} ${
                            ci === 0
                              ? "sticky left-0 z-20 bg-slate-50 shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]"
                              : ""
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => toggleSort(col.key)}
                            className={`inline-flex items-center gap-1 transition-colors hover:text-slate-900 ${
                              right ? "flex-row-reverse" : ""
                            } ${active ? "text-slate-900" : ""}`}
                          >
                            {col.label}
                            {active ? (
                              <ChevronDown
                                className={`h-3 w-3 transition-transform ${
                                  sort?.dir === "asc" ? "rotate-180" : ""
                                }`}
                              />
                            ) : (
                              <ArrowUpDown className="h-3 w-3 text-slate-300" />
                            )}
                          </button>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {pageRows.map((row, i) => (
                    <tr
                      key={startIdx + i}
                      className="transition-colors odd:bg-white even:bg-slate-50/40 hover:bg-slate-100/70"
                    >
                      {allColumns.map((col, ci) => {
                        const pharmacy = isPharmacyKey(col.key);
                        const val = pharmacy
                          ? row.values[col.key]
                          : (row as any)[col.key];
                        const num = Number(val ?? 0);
                        const has = val !== null && val !== undefined;
                        return (
                          <td
                            key={col.key}
                            className={`whitespace-nowrap border-b border-slate-100 px-3.5 py-2.5 ${
                              ci > 0 ? "border-l border-slate-100" : ""
                            } ${
                              (col as any).mono
                                ? "font-mono text-slate-600"
                                : ""
                            } ${pharmacy ? "text-right tabular-nums" : ""} ${
                              col.key === "rank"
                                ? "font-semibold text-slate-400"
                                : ""
                            } ${
                              col.key === "drug_name"
                                ? "font-medium text-slate-800"
                                : ""
                            } ${
                              pharmacy && has
                                ? `font-semibold ${shortageTone(num)}`
                                : pharmacy
                                  ? "text-slate-300"
                                  : ""
                            } ${
                              ci === 0
                                ? "sticky left-0 z-10 bg-inherit shadow-[2px_0_4px_-2px_rgba(0,0,0,0.08)]"
                                : ""
                            }`}
                          >
                            {pharmacy ? (has ? num : "—") : (val ?? "")}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalRows === 0 && (
              <div className="flex flex-col items-center gap-2 py-14 text-center">
                <Search className="h-5 w-5 text-slate-300" />
                <p className="text-sm text-slate-500">No matching drugs.</p>
              </div>
            )}

            {/* Pagination footer */}
            {totalRows > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/60 px-3.5 py-2.5">
                <p className="text-xs text-slate-500">
                  Showing{" "}
                  <span className="font-semibold text-slate-700">
                    {rangeStart}–{rangeEnd}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-700">
                    {totalRows}
                  </span>
                </p>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 px-2.5 text-xs"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    <ChevronLeft className="h-3.5 w-3.5" /> Prev
                  </Button>
                  <span className="px-1 text-xs font-medium text-slate-600">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 px-2.5 text-xs"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
