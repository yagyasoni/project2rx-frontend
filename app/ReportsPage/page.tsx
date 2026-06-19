"use client";

import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import api from "@/lib/api";
import {
  Layers,
  RotateCw,
  MoreVertical,
  FileText,
  Plus,
  Search,
  ChevronDown,
  Calendar,
  X,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
} from "lucide-react";
import Loading from "./loading";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loader from "@/components/Loader";

interface Report {
  id: string;
  auditName: string;
  status: "Ready" | "Started" | "Completed";
  inventoryDates: string;
  wholesalerDates: string;
  // Raw ISO (YYYY-MM-DD) values kept for date-range filtering.
  inventoryStart: string;
  inventoryEnd: string;
  wholesalerStart: string;
  wholesalerEnd: string;
  type: "INVENTORY" | "PBM" | "ABERRANT";
  createdDate: string;
}

type FilterType = "all" | "inventory" | "aberrant" | "optum";

// Number of report rows shown per page — chosen to fit a standard laptop
// viewport without the table needing to scroll.
const REPORTS_PER_PAGE = 10;

export default function ReportsPage() {
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null);
  const [deletingReportName, setDeletingReportName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reportsData, setReportsData] = useState<Report[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [editingReport, setEditingReport] = useState<any>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  // Sort reports by audit name: cycles none → asc → desc on header click.
  const [nameSort, setNameSort] = useState<"none" | "asc" | "desc">("none");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<"all" | "Ready" | "Started">(
    "all",
  );
  const [statusFilterOpen, setStatusFilterOpen] = useState(false);
  const [dateFilterOpen, setDateFilterOpen] = useState(false);
  const [dateFilterMode, setDateFilterMode] = useState<
    "inventory" | "wholesaler"
  >("inventory");
  const [dateFilterValue, setDateFilterValue] = useState("");
  const [editForm, setEditForm] = useState({
    inventory_start_date: "",
    inventory_end_date: "",
    wholesaler_start_date: "",
    wholesaler_end_date: "",
  });

  const [pharmacyName, setPharmacyName] = useState("Loading...");
  const [pharmacyEmail, setPharmacyEmail] = useState("");

  useEffect(() => {
    const loadPharmacy = async () => {
      try {
        const res = await api.get("/auth/pharmacy-details");
        const name =
          res?.data?.pharmacy?.pharmacy_name ||
          localStorage.getItem("pharmacyName") ||
          "Your Pharmacy";
        const email =
          res?.data?.user?.email || localStorage.getItem("userEmail") || "";
        setPharmacyName(name);
        setPharmacyEmail(email);
      } catch {
        setPharmacyName(
          localStorage.getItem("pharmacyName") || "Your Pharmacy",
        );
        setPharmacyEmail(localStorage.getItem("userEmail") || "");
      }
    };
    loadPharmacy();
  }, []);

  const getFilteredReports = () => {
    let reports = reportsData;
    switch (activeFilter) {
      case "inventory":
        reports = reportsData.filter((r) => r.type === "INVENTORY");
        break;
      case "aberrant":
        reports = reportsData.filter((r) => r.type === "ABERRANT");
        break;
      case "optum":
        reports = reportsData.filter((r) => r.type === "PBM");
        break;
    }
    if (statusFilter !== "all") {
      reports = reports.filter((r) => r.status === statusFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      reports = reports.filter((r) => r.auditName.toLowerCase().includes(q));
    }
    if (dateFilterValue) {
      // Keep reports whose chosen date range contains the selected date.
      reports = reports.filter((r) => {
        let start =
          dateFilterMode === "inventory" ? r.inventoryStart : r.wholesalerStart;
        let end =
          dateFilterMode === "inventory" ? r.inventoryEnd : r.wholesalerEnd;
        // Fallback: derive ISO range from the formatted "MM/DD/YYYY - MM/DD/YYYY"
        // string when raw fields are absent (e.g. rows cached before this field existed).
        if (!start || !end) {
          const label =
            dateFilterMode === "inventory"
              ? r.inventoryDates
              : r.wholesalerDates;
          const m = String(label).match(
            /(\d{2})\/(\d{2})\/(\d{4})\s*-\s*(\d{2})\/(\d{2})\/(\d{4})/,
          );
          if (m) {
            start = `${m[3]}-${m[1]}-${m[2]}`;
            end = `${m[6]}-${m[4]}-${m[5]}`;
          }
        }
        if (!start || !end) return false;
        return start <= dateFilterValue && dateFilterValue <= end;
      });
    }
    if (nameSort !== "none") {
      // Spread to avoid mutating reportsData when no filter narrowed the list.
      reports = [...reports].sort((a, b) => {
        const cmp = a.auditName.localeCompare(b.auditName, undefined, {
          sensitivity: "base",
          numeric: true,
        });
        return nameSort === "asc" ? cmp : -cmp;
      });
    }
    return reports;
  };

  const toggleNameSort = () =>
    setNameSort((s) => (s === "none" ? "asc" : s === "asc" ? "desc" : "none"));

  const handleDelete = async () => {
    if (!deletingReportId) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/${deletingReportId}`,
      );
      setReportsData((prev) => prev.filter((r) => r.id !== deletingReportId));
    } catch (e) {
      console.error("Delete failed:", e);
      alert("Delete failed. Check backend logs.");
    } finally {
      setDeleteModal(false);
      setDeletingReportId(null);
      setDeletingReportName("");
      setActiveMenu(null);
    }
  };

  const handleEdit = (report: Report) => {
    setEditingReport(report);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/${report.id}`)
      .then((res) => {
        const a = res.data;
        setEditForm({
          inventory_start_date: a.inventory_start_date?.slice(0, 10) ?? "",
          inventory_end_date: a.inventory_end_date?.slice(0, 10) ?? "",
          wholesaler_start_date: a.wholesaler_start_date?.slice(0, 10) ?? "",
          wholesaler_end_date: a.wholesaler_end_date?.slice(0, 10) ?? "",
        });
        setEditModal(true);
        setActiveMenu(null);
      });
  };

  const handleEditSave = async () => {
    if (!editingReport) return;
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/${editingReport.id}/dates`,
        editForm,
      );
      setReportsData((prev) =>
        prev.map((r) =>
          r.id === editingReport.id
            ? {
                ...r,
                inventoryDates: formatRange(
                  editForm.inventory_start_date,
                  editForm.inventory_end_date,
                ),
                wholesalerDates: formatRange(
                  editForm.wholesaler_start_date,
                  editForm.wholesaler_end_date,
                ),
              }
            : r,
        ),
      );
      setEditModal(false);
      setEditingReport(null);
    } catch (e) {
      console.error("Edit failed:", e);
      alert("Failed to save. Check backend logs.");
    }
  };

  // Format a date-only value as MM/DD/YYYY without timezone shifting.
  // Backend returns DATE columns as UTC-midnight ISO strings; new Date() +
  // local getters would roll the day back in negative-offset timezones.
  const formatDate = (d?: string | null) => {
    const m = String(d ?? "")
      .slice(0, 10)
      .match(/^(\d{4})-(\d{2})-(\d{2})$/);
    return m ? `${m[2]}/${m[3]}/${m[1]}` : "-";
  };

  const formatRange = (start?: string | null, end?: string | null) => {
    if (!start || !end) return "-";
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  // Raw ISO date (YYYY-MM-DD) for range comparisons; "" if missing/invalid.
  const isoDate = (d?: string | null) => {
    const s = String(d ?? "").slice(0, 10);
    return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : "";
  };

  const mapStatus = (s?: string | null): Report["status"] => {
    const v = (s || "").toLowerCase();
    if (v === "ready") return "Ready";
    if (v === "started") return "Started";
    return "Started";
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingReports(true);
        const res = await api.get("/api/audits");

        const rows = res.data as any[];
        const mapped: Report[] = rows.map((a) => ({
          id: a.id,
          auditName: a.name,
          status: mapStatus(a.status),
          inventoryDates: formatRange(
            a.inventory_start_date,
            a.inventory_end_date,
          ),
          wholesalerDates: formatRange(
            a.wholesaler_start_date,
            a.wholesaler_end_date,
          ),
          inventoryStart: isoDate(a.inventory_start_date),
          inventoryEnd: isoDate(a.inventory_end_date),
          wholesalerStart: isoDate(a.wholesaler_start_date),
          wholesalerEnd: isoDate(a.wholesaler_end_date),
          type: "INVENTORY",
          createdDate: formatDate(a.created_at),
        }));
        setReportsData(mapped);
      } catch (e) {
        console.error("Failed to load reports", e);
        setReportsData([]);
      } finally {
        setLoadingReports(false);
      }
    };
    load();
  }, []);

  const filteredReports = getFilteredReports();

  // ── Pagination ──
  const totalPages = Math.max(
    1,
    Math.ceil(filteredReports.length / REPORTS_PER_PAGE),
  );
  // Reset to the first page whenever the filtered result set changes so we
  // never end up stranded on a now-empty page.
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter, dateFilterValue, statusFilter, nameSort]);
  // Clamp the current page if the list shrinks (e.g. after a delete).
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);
  const pageStart = (currentPage - 1) * REPORTS_PER_PAGE;
  const pageReports = filteredReports.slice(
    pageStart,
    pageStart + REPORTS_PER_PAGE,
  );

  const filterCounts = {
    all: reportsData.length,
    inventory: reportsData.filter((r) => r.type === "INVENTORY").length,
    aberrant: reportsData.filter((r) => r.type === "ABERRANT").length,
    optum: reportsData.filter((r) => r.type === "PBM").length,
  };

  const readyCount = reportsData.filter((r) => r.status === "Ready").length;
  const startedCount = reportsData.filter((r) => r.status === "Started").length;

  return (
    <ProtectedRoute role="user">
      <Suspense fallback={<Loading />}>
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
              <div className="px-8 py-6">
                <div className="flex items-center justify-between">
                  {/* Left: Logo + Title */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                          Reports
                        </h1>
                        <button
                          onClick={() => window.location.reload()}
                          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Refresh"
                        >
                          <RotateCw className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                      <p className="text-sm font-medium text-slate-600 mt-0.5">
                        {pharmacyName}
                      </p>
                      {pharmacyEmail && (
                        <p className="text-xs text-slate-400">
                          {pharmacyEmail}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Stats + New Audit */}
                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3 mr-2">
                      <div className="flex items-center gap-1.5 bg-emerald-700 border border-emerald-700 rounded-lg px-3 py-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-300" />
                        <span className="text-xs font-semibold text-white">
                          {readyCount} Ready
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-disclaimer-100 border border-disclaimer-300 rounded-lg px-3 py-1.5">
                        <span className="w-2 h-2 rounded-full bg-disclaimer-600" />
                        <span className="text-xs font-semibold text-disclaimer-700">
                          {startedCount} In Progress
                        </span>
                      </div>
                    </div>
                    <Link href="/Mainpage">
                      <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
                        <Plus className="w-4 h-4" />
                        New Audit
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* ── Search + Filter Bar ── */}
              <div className="px-8 pb-4 flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:bg-white transition-all"
                  />
                </div>
                <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                  {[
                    {
                      key: "all" as FilterType,
                      label: "All",
                      count: filterCounts.all,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveFilter(tab.key)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        activeFilter === tab.key
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {tab.label}
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          activeFilter === tab.key
                            ? "bg-slate-900 text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* ── Status filter (Ready / Started) ── */}
                <div className="relative">
                  <button
                    onClick={() => setStatusFilterOpen((v) => !v)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                      statusFilter !== "all"
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        statusFilter === "Ready"
                          ? "bg-emerald-400"
                          : statusFilter === "Started"
                            ? "bg-disclaimer-500"
                            : "bg-slate-400"
                      }`}
                    />
                    {statusFilter === "all" ? "Status" : statusFilter}
                    {statusFilter !== "all" ? (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setStatusFilter("all");
                          setStatusFilterOpen(false);
                        }}
                        className="ml-0.5 rounded p-0.5 hover:bg-white/20"
                        title="Clear status filter"
                      >
                        <X className="w-3 h-3" />
                      </span>
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {statusFilterOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setStatusFilterOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 z-50 w-44 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5">
                        {[
                          { key: "all" as const, label: "All Statuses", dot: "bg-slate-400" },
                          { key: "Ready" as const, label: "Ready", dot: "bg-emerald-400" },
                          { key: "Started" as const, label: "Started", dot: "bg-disclaimer-500" },
                        ].map((opt) => (
                          <button
                            key={opt.key}
                            onClick={() => {
                              setStatusFilter(opt.key);
                              setStatusFilterOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                              statusFilter === opt.key
                                ? "bg-slate-900 text-white"
                                : "text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* ── Date filter (by inventory or wholesaler date) ── */}
                <div className="relative">
                  <button
                    onClick={() => setDateFilterOpen((v) => !v)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
                      dateFilterValue
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    {dateFilterValue
                      ? `${
                          dateFilterMode === "inventory"
                            ? "Inventory"
                            : "Wholesaler"
                        }: ${formatDate(dateFilterValue)}`
                      : "Date"}
                    {dateFilterValue ? (
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.stopPropagation();
                          setDateFilterValue("");
                          setDateFilterOpen(false);
                        }}
                        className="ml-0.5 rounded p-0.5 hover:bg-white/20"
                        title="Clear date filter"
                      >
                        <X className="w-3 h-3" />
                      </span>
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {dateFilterOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setDateFilterOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 z-50 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                          Search by
                        </p>
                        <div className="flex items-center bg-slate-100 rounded-lg p-0.5 mb-3">
                          {[
                            { key: "inventory", label: "Inventory Date" },
                            { key: "wholesaler", label: "Wholesaler Date" },
                          ].map((m) => (
                            <button
                              key={m.key}
                              onClick={() =>
                                setDateFilterMode(
                                  m.key as "inventory" | "wholesaler",
                                )
                              }
                              className={`flex-1 px-2 py-1.5 rounded-md text-[11px] font-semibold transition-all ${
                                dateFilterMode === m.key
                                  ? "bg-white text-slate-900 shadow-sm"
                                  : "text-slate-500 hover:text-slate-700"
                              }`}
                            >
                              {m.label}
                            </button>
                          ))}
                        </div>
                        <input
                          type="date"
                          value={dateFilterValue}
                          onChange={(e) => setDateFilterValue(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:bg-white"
                        />
                        <p className="mt-2 text-[11px] text-slate-400 leading-snug">
                          Shows audits whose{" "}
                          {dateFilterMode === "inventory"
                            ? "inventory"
                            : "wholesaler"}{" "}
                          date range includes the selected date.
                        </p>
                        <div className="flex items-center justify-between mt-3">
                          <button
                            onClick={() => setDateFilterValue("")}
                            className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                          >
                            Clear
                          </button>
                          <button
                            onClick={() => setDateFilterOpen(false)}
                            className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                          >
                            Done
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ── Table ── */}
            <div className="px-8 py-6">
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-3 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-12 whitespace-nowrap">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        <button
                          type="button"
                          onClick={toggleNameSort}
                          title="Sort by audit name"
                          className={`group inline-flex items-center gap-1 uppercase tracking-wider transition-colors hover:text-slate-700 ${
                            nameSort !== "none" ? "text-slate-900" : ""
                          }`}
                        >
                          Audit Name
                          {nameSort === "asc" ? (
                            <ArrowUp className="w-3 h-3" />
                          ) : nameSort === "desc" ? (
                            <ArrowDown className="w-3 h-3" />
                          ) : (
                            <ArrowUpDown className="w-3 h-3 text-slate-300 group-hover:text-slate-400" />
                          )}
                        </button>
                      </th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Inventory Dates
                      </th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Wholesaler Dates
                      </th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider w-20 whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingReports ? (
                      <tr>
                        <td colSpan={8} className="py-16 text-center">
                          <Loader variant="inline" title="Loading reports..." />
                        </td>
                      </tr>
                    ) : filteredReports.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-16 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-1">
                              <FileText className="w-5 h-5 text-slate-300" />
                            </div>
                            <p className="text-sm font-semibold text-slate-500">
                              No reports found
                            </p>
                            <p className="text-xs text-slate-400">
                              {searchQuery ||
                              dateFilterValue ||
                              statusFilter !== "all"
                                ? "Try a different search term or filter"
                                : "Create a new audit to get started"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      pageReports.map((report, index) => (
                        <tr
                          key={report.id}
                          className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors group"
                        >
                          <td className="px-3 py-3 text-xs text-slate-400 font-medium whitespace-nowrap tabular-nums">
                            {pageStart + index + 1}
                          </td>
                          <td className="px-4 py-3">
                            <Link
                              href={`/reports/${report.id}`}
                              className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors"
                            >
                              {report.auditName}
                            </Link>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                                report.status === "Ready"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-disclaimer-100 text-disclaimer-700 border border-disclaimer-300"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  report.status === "Ready"
                                    ? "bg-emerald-500"
                                    : "bg-disclaimer-600"
                                }`}
                              />
                              {report.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-600 font-medium">
                            {report.inventoryDates}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-600 font-medium">
                            {report.wholesalerDates}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] font-bold text-white bg-slate-900 border border-slate-900 px-2 py-0.5 rounded">
                              {report.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">
                            {report.createdDate}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={(e) => {
                                if (activeMenu === report.id) {
                                  setActiveMenu(null);
                                  setMenuPosition(null);
                                } else {
                                  const rect = (
                                    e.currentTarget as HTMLElement
                                  ).getBoundingClientRect();
                                  setMenuPosition({
                                    top: rect.bottom + 4,
                                    left: rect.right - 176,
                                  });
                                  setActiveMenu(report.id);
                                }
                              }}
                              className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-4 h-4 text-slate-500" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* Footer */}
                {filteredReports.length > 0 && (
                  <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
                    <span className="text-xs text-slate-500">
                      Showing{" "}
                      <b className="text-slate-700">{pageStart + 1}</b>–
                      <b className="text-slate-700">
                        {pageStart + pageReports.length}
                      </b>{" "}
                      of{" "}
                      <b className="text-slate-700">{filteredReports.length}</b>{" "}
                      reports
                    </span>

                    {totalPages > 1 && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            setCurrentPage((p) => Math.max(1, p - 1))
                          }
                          disabled={currentPage === 1}
                          className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          Prev
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                          (page) => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`min-w-[28px] px-2 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                                page === currentPage
                                  ? "bg-slate-900 text-white border-slate-900"
                                  : "text-slate-600 border-slate-200 bg-white hover:bg-slate-50"
                              }`}
                            >
                              {page}
                            </button>
                          ),
                        )}
                        <button
                          onClick={() =>
                            setCurrentPage((p) => Math.min(totalPages, p + 1))
                          }
                          disabled={currentPage === totalPages}
                          className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Context Menu */}
            {activeMenu && menuPosition && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => {
                    setActiveMenu(null);
                    setMenuPosition(null);
                  }}
                />
                <div
                  className="fixed w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden"
                  style={{
                    top:
                      menuPosition.top + 176 > window.innerHeight
                        ? menuPosition.top - 176 - 8
                        : menuPosition.top,
                    left: menuPosition.left,
                  }}
                >
                  <button
                    onClick={() => {
                      const report = reportsData.find(
                        (r) => r.id === activeMenu,
                      );
                      if (report) handleEdit(report);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Edit Dates
                  </button>
                  <button
                    onClick={() => {
                      const id = activeMenu;
                      setActiveMenu(null);
                      setMenuPosition(null);
                      window.location.href = `/Mainpage?auditId=${id}&step=inventory`;
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Inventory Files
                  </button>
                  <button
                    onClick={() => {
                      const id = activeMenu;
                      setActiveMenu(null);
                      setMenuPosition(null);
                      window.location.href = `/Mainpage?auditId=${id}&step=wholesaler`;
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Supplier Files
                  </button>
                  <div className="border-t border-slate-100" />
                  <button
                    onClick={() => {
                      const report = reportsData.find(
                        (r) => r.id === activeMenu,
                      );
                      if (report) {
                        setDeletingReportId(report.id);
                        setDeletingReportName(report.auditName);
                        setDeleteModal(true);
                      }
                      setActiveMenu(null);
                      setMenuPosition(null);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </main>
        </div>

        {/* Edit Modal */}
        {editModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
              <h2 className="text-base font-bold text-slate-900 mb-1">
                Edit Report Dates
              </h2>
              <p className="text-xs text-slate-500 mb-5">
                {editingReport?.auditName}
              </p>

              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Inventory Dates
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">
                        Start
                      </label>
                      <input
                        type="date"
                        value={editForm.inventory_start_date}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            inventory_start_date: e.target.value,
                          }))
                        }
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">
                        End
                      </label>
                      <input
                        type="date"
                        value={editForm.inventory_end_date}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            inventory_end_date: e.target.value,
                          }))
                        }
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-300"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Wholesaler Dates
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">
                        Start
                      </label>
                      <input
                        type="date"
                        value={editForm.wholesaler_start_date}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            wholesaler_start_date: e.target.value,
                          }))
                        }
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">
                        End
                      </label>
                      <input
                        type="date"
                        value={editForm.wholesaler_end_date}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            wholesaler_end_date: e.target.value,
                          }))
                        }
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setEditModal(false);
                    setEditingReport(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Delete Report
              </h3>
              <p className="text-sm text-slate-500 mb-1">
                Are you sure you want to delete this report?
              </p>
              <p className="text-xs text-slate-400 bg-slate-100 rounded-lg px-3 py-1.5 mb-1 font-semibold truncate max-w-full">
                {deletingReportName}
              </p>
              <p className="text-[11px] text-red-400 mb-5">
                This will permanently remove all data, files, and records.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    setDeleteModal(false);
                    setDeletingReportId(null);
                    setDeletingReportName("");
                  }}
                  className="flex-1 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </Suspense>
    </ProtectedRoute>
  );
}
