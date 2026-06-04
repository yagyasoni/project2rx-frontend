"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MoveLeftIcon,
  Search,
  Download,
  ArrowUpDown,
  ChevronDown,
  Users,
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

export default function GroupReportPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);

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
            <GroupReportContent />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

function GroupReportContent() {
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

  return (
    <div className="px-6 py-6 md:px-10 md:py-8">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <button
            onClick={() => router.back()}
            className="mt-0.5 flex flex-shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            <MoveLeftIcon className="h-4 w-4" /> Back
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold tracking-tight text-slate-900">
              {data?.report.label || data?.report.pharmacy_name || "Report"}
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <Users className="h-3.5 w-3.5" />
              {pharmacies.length}{" "}
              {pharmacies.length === 1 ? "pharmacy" : "pharmacies"}
              {data?.report.created_at && (
                <>
                  {" · "}
                  {new Date(data.report.created_at).toLocaleDateString()}
                </>
              )}
            </p>
          </div>
        </div>

        {data && (
          <Button
            variant="outline"
            size="sm"
            className="flex-shrink-0 gap-1.5"
            onClick={handleDownloadCsv}
          >
            <Download className="h-4 w-4" /> Download CSV
          </Button>
        )}
      </div>

      {loading ? (
        <div className="py-20 text-center text-sm text-slate-500">
          Loading report…
        </div>
      ) : !data ? (
        <div className="py-20 text-center text-sm text-slate-500">
          Could not load this report.
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="relative mb-3 w-72 max-w-full">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search drug name or NDC…"
              className="h-9 pl-9 text-sm"
            />
          </div>

          {/* Table */}
          <div className="overflow-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-50 text-slate-600">
                <tr>
                  {allColumns.map((col) => {
                    const active = sort?.key === col.key;
                    const right = isPharmacyKey(col.key);
                    return (
                      <th
                        key={col.key}
                        className={`whitespace-nowrap px-3 py-2.5 font-semibold ${right ? "text-right" : ""}`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleSort(col.key)}
                          className={`inline-flex items-center gap-1 hover:text-slate-900 ${right ? "flex-row-reverse" : ""}`}
                        >
                          {col.label}
                          {active ? (
                            <ChevronDown
                              className={`h-3 w-3 transition-transform ${sort?.dir === "asc" ? "rotate-180" : ""}`}
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
                {getRows().map((row, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    {allColumns.map((col) => {
                      const pharmacy = isPharmacyKey(col.key);
                      const val = pharmacy
                        ? row.values[col.key]
                        : (row as any)[col.key];
                      const num = Number(val ?? 0);
                      const has = val !== null && val !== undefined;
                      return (
                        <td
                          key={col.key}
                          className={`whitespace-nowrap px-3 py-2 ${(col as any).mono ? "font-mono" : ""} ${pharmacy ? "text-right" : ""} ${pharmacy && has ? `font-medium ${num < 0 ? "text-red-600" : "text-slate-700"}` : ""}`}
                        >
                          {pharmacy ? (has ? num : "—") : (val ?? "")}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
            {getRows().length === 0 && (
              <div className="py-10 text-center text-sm text-slate-500">
                No matching drugs.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
