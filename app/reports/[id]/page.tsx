"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import AppSidebar from "@/components/Sidebar";
import { Search, X, ChevronDown, RotateCw, Download, SlidersHorizontal } from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useParams, useRouter } from "next/navigation";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import ProtectedRoute from "@/components/ProtectedRoute";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SortRule { key: keyof InventoryRow; dir: "asc" | "desc"; }

interface InventoryRow {
  id: number; ndc: string; drugName: string; rank: number;
  pkgSize: number; unit: number; totalOrdered: number; totalBilled: number;
  totalShortage: number; highestShortage: number; cost: number; amount: number;
  // Commercial
  horizon: number; shortageHorizon: number;
  express: number; shortageExpress: number;
  cvsCaremark: number; shortageCvsCaremark: number;
  optumrx: number; shortageOptumrx: number;
  humana: number; shortageHumana: number;
  ssc: number; shortageSsc: number;
  pdmi: number; shortagePdmi: number;          // PDMI moved to Commercial
  // Medicare
  medicare: number; shortageMedicare: number;
  // Medicaid
  njMedicaid: number; shortageNjMedicaid: number;
  // Medicare + Medicaid combined
  njBilled: number; shortageNjBilled: number;
}

// ─── Column group types ───────────────────────────────────────────────────────

type ColGroup = "base-scroll" | "commercial" | "medicare" | "medicaid" | "mAndM";

interface ColDef {
  key: keyof InventoryRow;
  label: string;
  w: number;
  group: ColGroup;
  dot?: string;
  isShortage?: boolean;
}

const ALL_COLS: ColDef[] = [
  // Base scroll
  { key: "totalBilled",         label: "Total Billed",    w: 120, group: "base-scroll", dot: "bg-red-400" },
  { key: "totalShortage",       label: "Total Shortage",  w: 120, group: "base-scroll", dot: "bg-amber-400", isShortage: true },
  { key: "highestShortage",     label: "Highest Short",   w: 120, group: "base-scroll", dot: "bg-amber-400", isShortage: true },
  { key: "cost",                label: "$ Cost",          w: 100, group: "base-scroll", dot: "bg-red-400" },
  { key: "amount",              label: "$ Amount",        w: 110, group: "base-scroll", dot: "bg-blue-400" },
  // Commercial (includes PDMI)
  { key: "horizon",             label: "Horizon",         w: 110, group: "commercial" },
  { key: "shortageHorizon",     label: "Shrt Horizon",   w: 110, group: "commercial", isShortage: true },
  { key: "express",             label: "Express",         w: 110, group: "commercial" },
  { key: "shortageExpress",     label: "Shrt Express",   w: 110, group: "commercial", isShortage: true },
  { key: "cvsCaremark",         label: "Caremark",        w: 110, group: "commercial" },
  { key: "shortageCvsCaremark", label: "Shrt Caremark",  w: 120, group: "commercial", isShortage: true },
  { key: "optumrx",             label: "Optum",           w: 100, group: "commercial" },
  { key: "shortageOptumrx",     label: "Shrt Optum",     w: 100, group: "commercial", isShortage: true },
  { key: "humana",              label: "Humana",          w: 100, group: "commercial" },
  { key: "shortageHumana",      label: "Shrt Humana",    w: 100, group: "commercial", isShortage: true },
  { key: "ssc",                 label: "SSC",             w:  90, group: "commercial" },
  { key: "shortageSsc",         label: "Shrt SSC",       w:  90, group: "commercial", isShortage: true },
  { key: "pdmi",                label: "PDMI (Co-Pay)",  w: 130, group: "commercial" },
  { key: "shortagePdmi",        label: "Shrt PDMI",      w: 110, group: "commercial", isShortage: true },
  // Medicare
  { key: "medicare",            label: "Medicare",        w: 120, group: "medicare" },
  { key: "shortageMedicare",    label: "Shrt Medicare",  w: 120, group: "medicare", isShortage: true },
  // Medicaid
  { key: "njMedicaid",          label: "NJ Medicaid",    w: 120, group: "medicaid" },
  { key: "shortageNjMedicaid",  label: "Shrt NJ Med",   w: 120, group: "medicaid", isShortage: true },
  // Medicare + Medicaid combined
  { key: "njBilled",            label: "NJ Billed",      w: 120, group: "mAndM" },
  { key: "shortageNjBilled",    label: "Shortage",       w: 120, group: "mAndM", isShortage: true },
];

type ColKey = keyof InventoryRow;
type VisMap = Partial<Record<ColKey, boolean>>;

// ─── Sort icon ────────────────────────────────────────────────────────────────

function SortIcon({ active }: { active?: "asc" | "desc" }) {
  if (!active) return <ArrowUpDown className="w-3 h-3 shrink-0 text-slate-400" />;
  return <span className="text-[11px] shrink-0 font-bold text-emerald-600">{active === "asc" ? "↑" : "↓"}</span>;
}

// ─── Group colours ────────────────────────────────────────────────────────────

const GC = {
  commercial: {
    parentBg: "#dbeafe", parentColor: "#1e40af", parentBorder: "#3b82f6",
    subBg: "#eff6ff", subColor: "#1d4ed8",
    shrtBg: "#fef2f2", shrtColor: "#991b1b",
    cellBorderColor: "#bfdbfe",
  },
  medicare: {
    parentBg: "#dcfce7", parentColor: "#166534", parentBorder: "#22c55e",
    subBg: "#f0fdf4", subColor: "#15803d",
    shrtBg: "#f0fdf4", shrtColor: "#166534",
    cellBorderColor: "#86efac",
  },
  medicaid: {
    parentBg: "#ede9fe", parentColor: "#4c1d95", parentBorder: "#8b5cf6",
    subBg: "#f5f3ff", subColor: "#6d28d9",
    shrtBg: "#f5f3ff", shrtColor: "#6d28d9",
    cellBorderColor: "#c4b5fd",
  },
  mAndM: {
    parentBg: "#fef9c3", parentColor: "#854d0e", parentBorder: "#eab308",
    subBg: "#fefce8", subColor: "#a16207",
    shrtBg: "#fef2f2", shrtColor: "#991b1b",
    cellBorderColor: "#fde68a",
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE
// ═══════════════════════════════════════════════════════════════════════════════

export default function InventoryReportPage() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingDone, setLoadingDone] = useState(false);
  const [inventoryData, setInventoryData] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openExportModal, setOpenExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "excel" | "pdf">("excel");
  const [exportScope, setExportScope] = useState<"visible" | "all">("visible");
  const [amountValue, setAmountValue] = useState<number | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [qtyType, setQtyType] = useState<"UNIT" | "PKG SIZE" | null>("PKG SIZE");
  const [openQtyDropdown, setOpenQtyDropdown] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [openDrugSidebar, setOpenDrugSidebar] = useState(false);
  const [activeDrug, setActiveDrug] = useState<InventoryRow | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [auditDates, setAuditDates] = useState<any>(null);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const bodyScrollRef = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const isLeavingConfirmed = useRef(false);

  const params = useParams();
  const router = useRouter();
  const auditId = params.id as string;

  // ── Visibility state ──────────────────────────────────────────────────────

  const initVis: VisMap = {};
  ALL_COLS.forEach((c) => { initVis[c.key] = true; });
  const [vis, setVis] = useState<VisMap>(initVis);
  const toggleVis = (k: ColKey) => setVis((p) => ({ ...p, [k]: !p[k] }));

  const [showRank, setShowRank]       = useState(true);
  const [showNdc, setShowNdc]         = useState(true);
  const [showDrug, setShowDrug]       = useState(true);
  const [showPkg, setShowPkg]         = useState(true);
  const [showUnit, setShowUnit]       = useState(false);
  const [showOrdered, setShowOrdered] = useState(true);

  // ── Sort ──────────────────────────────────────────────────────────────────

  const [sortRules, setSortRules] = useState<SortRule[]>([{ key: "totalShortage", dir: "asc" }]);

  const handleSort = (key: keyof InventoryRow, e: React.MouseEvent) => {
    const idx = sortRules.findIndex((r) => r.key === key);
    let next = [...sortRules];
    if (idx === -1) next = e.shiftKey ? [...next, { key, dir: "asc" as const }] : [{ key, dir: "asc" as const }];
    else if (next[idx].dir === "asc") next[idx] = { key, dir: "desc" };
    else next.splice(idx, 1);
    setSortRules(next);
  };

  const sortDir = (k: keyof InventoryRow) => sortRules.find((r) => r.key === k)?.dir;

  // ── Leave protection ──────────────────────────────────────────────────────

  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, []);

  useEffect(() => {
    const h = () => {
      if (isLeavingConfirmed.current) return;
      window.history.pushState(null, "", window.location.href);
      setShowLeaveDialog(true);
    };
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", h);
    return () => window.removeEventListener("popstate", h);
  }, []);

  // ── Load data ─────────────────────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      let pi: ReturnType<typeof setInterval> | null = null;
      try {
        setLoading(true); setLoadingProgress(0); setLoadingDone(false);
        pi = setInterval(() => setLoadingProgress((p) => p >= 90 ? (clearInterval(pi!), 90) : p + Math.random() * 8 + 2), 200);

        const res = await fetch(`https://api.auditprorx.com/api/audits/${auditId}/report`);
        const json = await res.json();
        const data = Array.isArray(json) ? json : Array.isArray(json.inventory) ? json.inventory : [];

        const norm = data.map((row: any, i: number) => {
          const to = Number(row.total_ordered ?? 0);
          const n = (x: any) => Number(x ?? 0);

          const medicareVal    = n(row.medicare);   // new medicare field from backend
          const njMedicaidVal  = n(row.nj_medicaid ?? row.njMedicaid);
          const njBilledVal    = medicareVal + njMedicaidVal;
          // Shortages calculated individually first so combined can sum them
          const shortageMedicareVal    = to - medicareVal;
          const shortageNjMedicaidVal  = to - njMedicaidVal;

          return {
            id: row.id ?? i + 1,
            ndc: row.ndc ?? "",
            drugName: (row.drug_name ?? row.drugName ?? "").replace(/\s*\(\d{5}-\d{4}-\d{2}\).*$/, "").trim(),
            rank: 0,
            pkgSize: row.package_size ?? 0,
            unit: row.package_size > 0 ? Number((n(row.total_billed) / Number(row.package_size)).toFixed(2)) : 0,
            totalOrdered: to,
            totalBilled: n(row.total_billed),
            totalShortage: row.total_shortage != null ? n(row.total_shortage) : to - n(row.total_billed),
            highestShortage: 0,
            cost: n(row.cost),
            amount: n(row.total_amount ?? row.amount),
            // Commercial
            horizon: n(row.horizon),             shortageHorizon: to - n(row.horizon),
            express: n(row.express),             shortageExpress: to - n(row.express),
            cvsCaremark: n(row.cvs_caremark ?? row.cvsCaremark),
            shortageCvsCaremark: to - n(row.cvs_caremark ?? row.cvsCaremark),
            optumrx: n(row.optumrx),             shortageOptumrx: to - n(row.optumrx),
            humana: n(row.humana),               shortageHumana: to - n(row.humana),
            ssc: n(row.ssc),                     shortageSsc: to - n(row.ssc),
            pdmi: n(row.pdmi),                   shortagePdmi: to - n(row.pdmi),
            // Medicare
            medicare: medicareVal,               shortageMedicare: shortageMedicareVal,
            // Medicaid
            njMedicaid: njMedicaidVal,           shortageNjMedicaid: shortageNjMedicaidVal,
            // Medicare + Medicaid combined
            // NJ Billed  = njMedicaid + medicare
            // Shortage   = Shrt Medicare + Shrt NJ Medicaid  (sum of both shortages)
            njBilled: njBilledVal,
            shortageNjBilled: shortageMedicareVal + shortageNjMedicaidVal,
          };
        });

        [...norm].sort((a, b) => b.amount - a.amount).forEach((r, i) => { r.rank = i + 1; });
        norm.forEach((r: any) => {
          const min = Math.min(
            r.shortageHorizon, r.shortageExpress, r.shortageCvsCaremark,
            r.shortageOptumrx, r.shortageHumana, r.shortageSsc, r.shortagePdmi,
            r.shortageMedicare, r.shortageNjMedicaid,
          );
          r.highestShortage = min < 0 ? min : 0;
        });

        setInventoryData(norm);
        const ar = await fetch(`https://api.auditprorx.com/api/audits/${auditId}`);
        setAuditDates(await ar.json());
      } catch (e) {
        console.error(e); setInventoryData([]);
      } finally {
        if (pi) clearInterval(pi); setLoadingProgress(100);
        setTimeout(() => { setLoadingDone(true); setTimeout(() => setLoading(false), 400); }, 500);
      }
    };
    if (auditId) load();
  }, [auditId]);

  // ── applyQtyMode ──────────────────────────────────────────────────────────

  const applyQtyMode = (row: InventoryRow): InventoryRow => {
    const pkg = row.pkgSize || 1;
    if (qtyType === "PKG SIZE") {
      const nto = row.totalOrdered * pkg;
      const sMed = +(nto - row.medicare).toFixed(2);
      const sNj  = +(nto - row.njMedicaid).toFixed(2);
      return {
        ...row, totalOrdered: +nto.toFixed(2),
        totalShortage: +(nto - row.totalBilled).toFixed(2),
        shortageHorizon: +(nto - row.horizon).toFixed(2),
        shortageExpress: +(nto - row.express).toFixed(2),
        shortageCvsCaremark: +(nto - row.cvsCaremark).toFixed(2),
        shortageOptumrx: +(nto - row.optumrx).toFixed(2),
        shortageHumana: +(nto - row.humana).toFixed(2),
        shortageSsc: +(nto - row.ssc).toFixed(2),
        shortagePdmi: +(nto - row.pdmi).toFixed(2),
        shortageMedicare: sMed,
        shortageNjMedicaid: sNj,
        njBilled: row.medicare + row.njMedicaid,
        shortageNjBilled: +(sMed + sNj).toFixed(2),  // Shrt Medicare + Shrt NJ Medicaid
        highestShortage: 0,
      };
    }
    if (qtyType === "UNIT") {
      const d = (v: number) => +(v / pkg).toFixed(2);
      const nh = d(row.horizon), ne = d(row.express), nc = d(row.cvsCaremark);
      const no = d(row.optumrx), nhu = d(row.humana), ns = d(row.ssc);
      const np = d(row.pdmi), nm = d(row.medicare), nnj = d(row.njMedicaid);
      const ntb = d(row.totalBilled);
      const sMed = +(row.totalOrdered - nm).toFixed(2);
      const sNj  = +(row.totalOrdered - nnj).toFixed(2);
      return {
        ...row, totalBilled: ntb, totalShortage: +(row.totalOrdered - ntb).toFixed(2),
        horizon: nh,  shortageHorizon: +(row.totalOrdered - nh).toFixed(2),
        express: ne,  shortageExpress: +(row.totalOrdered - ne).toFixed(2),
        cvsCaremark: nc, shortageCvsCaremark: +(row.totalOrdered - nc).toFixed(2),
        optumrx: no,  shortageOptumrx: +(row.totalOrdered - no).toFixed(2),
        humana: nhu,  shortageHumana: +(row.totalOrdered - nhu).toFixed(2),
        ssc: ns,      shortageSsc: +(row.totalOrdered - ns).toFixed(2),
        pdmi: np,     shortagePdmi: +(row.totalOrdered - np).toFixed(2),
        medicare: nm, shortageMedicare: sMed,
        njMedicaid: nnj, shortageNjMedicaid: sNj,
        njBilled: nm + nnj,
        shortageNjBilled: +(sMed + sNj).toFixed(2),  // Shrt Medicare + Shrt NJ Medicaid
        highestShortage: 0,
      };
    }
    return row;
  };

  // ── Data pipeline ─────────────────────────────────────────────────────────

  const sortedData = useMemo(() => [...inventoryData].sort((a, b) => {
    for (const r of sortRules) {
      const av = a[r.key], bv = b[r.key];
      const c = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      if (c !== 0) return r.dir === "asc" ? c : -c;
    }
    return 0;
  }), [inventoryData, sortRules]);

  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return sortedData.filter((r) =>
      (r.drugName.toLowerCase().includes(q) || r.ndc.toLowerCase().includes(q)) &&
      (amountValue === "" || r.amount <= amountValue)
    );
  }, [sortedData, searchQuery, amountValue]);

  const totalRows = filteredData.length;
  const effRPP = rowsPerPage > 0 ? rowsPerPage : filteredData.length || 50;
  const totalPages = Math.max(1, Math.ceil(filteredData.length / effRPP));
  const rowOptions = [10, 20, 50, 100, totalRows].filter((v, i, a) => v > 0 && a.indexOf(v) === i);
  const paginatedData = filteredData.slice((currentPage - 1) * effRPP, currentPage * effRPP).map(applyQtyMode);

  // ── Sticky offsets ────────────────────────────────────────────────────────

  const L_CHECKBOX = 0;
  const L_RANK     = 44;
  const L_NDC      = L_RANK + (showRank ? 72 : 0);
  const L_DRUG     = L_NDC  + (showNdc  ? 140 : 0);
  const L_PKG      = L_DRUG + (showDrug ? 240 : 0);
  const L_UNIT     = L_PKG  + (showPkg  ? 100 : 0);
  const L_ORDERED  = L_UNIT + (showUnit ? 100 : 0);

  // ── Visible cols split by group ───────────────────────────────────────────

  const visCols        = ALL_COLS.filter((c) => vis[c.key]);
  const baseScrollCols = visCols.filter((c) => c.group === "base-scroll");
  const commercialCols = visCols.filter((c) => c.group === "commercial");
  const medicareCols   = visCols.filter((c) => c.group === "medicare");
  const medicaidCols   = visCols.filter((c) => c.group === "medicaid");
  const mAndMCols      = visCols.filter((c) => c.group === "mAndM");

  // group first key (for border-left on first cell in each group)
  const gfk = {
    commercial: commercialCols[0]?.key,
    medicare:   medicareCols[0]?.key,
    medicaid:   medicaidCols[0]?.key,
    mAndM:      mAndMCols[0]?.key,
  };

  const cellBorderStyle = (col: ColDef): React.CSSProperties => {
    const borders: Record<string, string> = {
      [gfk.commercial ?? ""]: GC.commercial.cellBorderColor,
      [gfk.medicare   ?? ""]: GC.medicare.cellBorderColor,
      [gfk.medicaid   ?? ""]: GC.medicaid.cellBorderColor,
      [gfk.mAndM      ?? ""]: GC.mAndM.cellBorderColor,
    };
    return col.key in borders && borders[col.key]
      ? { borderLeft: `2px solid ${borders[col.key]}` }
      : {};
  };

  // ── Misc helpers ──────────────────────────────────────────────────────────

  const fmt = (d: Date) =>
    `${String(d.getMonth()+1).padStart(2,"0")}/${String(d.getDate()).padStart(2,"0")}/${d.getFullYear()}`;

  const fromDate = auditDates?.inventory_start_date  ? fmt(new Date(auditDates.inventory_start_date))  : "—";
  const toDate   = auditDates?.inventory_end_date    ? fmt(new Date(auditDates.inventory_end_date))    : "—";
  const wsFrom   = auditDates?.wholesaler_start_date ? fmt(new Date(auditDates.wholesaler_start_date)) : "—";
  const wsTo     = auditDates?.wholesaler_end_date   ? fmt(new Date(auditDates.wholesaler_end_date))   : "—";

  const shortage = (v: number) =>
    v === 0
      ? <span className="text-slate-400">—</span>
      : <span className={`font-semibold tabular-nums ${v < 0 ? "text-red-600" : "text-emerald-600"}`}>{v.toLocaleString()}</span>;

  const cellVal = (col: ColDef, row: InventoryRow) => {
    const v = row[col.key] as number;
    if (col.isShortage) return shortage(v);
    if (col.key === "cost")   return <span className="tabular-nums text-slate-700">${v.toFixed(2)}</span>;
    if (col.key === "amount") return <span className="tabular-nums font-semibold text-slate-800">${v.toFixed(2)}</span>;
    if (col.group === "medicare") return <span className="tabular-nums font-semibold text-emerald-700">{v.toLocaleString()}</span>;
    if (col.group === "medicaid") return <span className="tabular-nums font-semibold text-purple-700">{v.toLocaleString()}</span>;
    if (col.group === "mAndM")    return <span className="tabular-nums font-semibold text-amber-700">{v.toLocaleString()}</span>;
    return <span className="tabular-nums text-slate-700">{v.toLocaleString()}</span>;
  };

  const toggleRow = (id: number) =>
    setSelectedRows((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const toggleAll = () =>
    setSelectedRows(selectedRows.length === paginatedData.length ? [] : paginatedData.map((r) => r.id));

  const confirmLeave = () => {
    isLeavingConfirmed.current = true;
    setShowLeaveDialog(false);
    router.push(pendingHref ?? "/ReportsPage");
  };

  const handleExport = () => {
    const rows = exportScope === "visible" ? paginatedData : filteredData;
    if (!rows.length) return;
    const h = Object.keys(rows[0]);
    const csv = [h.join(","), ...rows.map((r: any) => h.map((k) => JSON.stringify(r[k] ?? "")).join(","))].join("\n");
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })),
      download: "inventory-report.csv",
    });
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setOpenExportModal(false);
  };

  useEffect(() => {
    if (openExportModal || showLeaveDialog || openDrugSidebar) setSidebarCollapsed(true);
  }, [openExportModal, showLeaveDialog, openDrugSidebar]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setOpenFilter(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ── Sub-header renderer ───────────────────────────────────────────────────

  const renderSubTh = (c: ColDef) => {
    const gc = GC[c.group as keyof typeof GC] ?? GC.commercial;
    const bg = c.isShortage ? gc.shrtBg : gc.subBg;
    const color = c.isShortage ? gc.shrtColor : gc.subColor;
    const isFirst = c.key === gfk[c.group as keyof typeof gfk];
    return (
      <th
        key={c.key}
        className="cursor-pointer select-none"
        style={{
          position: "sticky", top: 20, zIndex: 1,
          background: bg, color, height: 20, padding: "0 8px",
          fontSize: 10, fontWeight: 600, textAlign: "center", whiteSpace: "nowrap",
          borderLeft: isFirst ? `2px solid ${gc.parentBorder}` : undefined,
        }}
        onClick={(e) => handleSort(c.key, e)}
      >
        <div className="flex items-center justify-center gap-0.5">
          {c.label}<SortIcon active={sortDir(c.key)} />
        </div>
      </th>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <ProtectedRoute>
      <div className="relative h-screen w-full bg-white">
        <div className="relative h-full w-full flex overflow-hidden">

          {/* Sidebar */}
          <div className={`flex-shrink-0 transition-all duration-300 z-[130] ${
            openExportModal || loading || showLeaveDialog || openDrugSidebar
              ? "w-0 opacity-0 pointer-events-none"
              : sidebarCollapsed ? "w-[72px]" : "w-[260px]"
          }`}>
            {!openExportModal && !loading && !showLeaveDialog && !openDrugSidebar && (
              <AppSidebar sidebarOpen={!sidebarCollapsed} setSidebarOpen={() => setSidebarCollapsed((v) => !v)} activePanel={activePanel} setActivePanel={setActivePanel} />
            )}
          </div>

          {/* Loading overlay */}
          {loading && (
            <div className={`absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm transition-opacity duration-400 ${loadingDone ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
              <div className="flex flex-col items-center gap-6 w-72">
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm">
                    <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="absolute -inset-1 rounded-[18px] border-2 border-transparent border-t-emerald-500 border-r-emerald-300 animate-spin" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-semibold text-slate-700 tracking-wide">
                    {loadingProgress < 30
                      ? "Fetching inventory data..."
                      : loadingProgress < 60
                        ? "Processing records..."
                        : loadingProgress < 90
                          ? "Calculating analytics..."
                          : "Finalizing report..."}
                  </p>
                  <p className="text-xs text-slate-400">Please wait a moment</p>
                </div>
                <div className="w-full space-y-2">
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300 ease-out"
                      style={{ width: `${Math.min(loadingProgress, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Loading report</span>
                    <span className="text-xs font-bold text-emerald-600 tabular-nums">
                      {Math.min(Math.round(loadingProgress), 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 min-w-0 flex flex-col overflow-hidden z-0">

            {/* ── Page Header ── */}
            <div className="bg-white border-b border-slate-200 shadow-sm flex-shrink-0">
              <div className="px-6 py-3 flex items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 tracking-wide uppercase">Inventory Report</h1>
                  <p className="text-xs text-slate-500 mt-0.5">Comprehensive pharmaceutical inventory analytics</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                    <p className="text-[10px] font-bold text-red-700 uppercase tracking-wider">Inventory Dates</p>
                    <p className="text-xs font-semibold text-slate-800">{fromDate} – {toDate}</p>
                  </div>
                  <div className="bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Wholesaler Dates</p>
                    <p className="text-xs font-semibold text-slate-800">{wsFrom} – {wsTo}</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-1.5" onClick={() => { setSidebarCollapsed(true); setOpenExportModal(true); }}>
                    <Download className="h-3.5 w-3.5" /> Export
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><RotateCw className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </div>

            {/* ── Filter Bar ── z-[200] so dropdown clears table headers ── */}
            <div className="bg-white border-b border-slate-200 flex-shrink-0" style={{ position: "relative", zIndex: 200 }}>
              <div className="px-6 py-2.5 flex items-center gap-2.5 flex-wrap">

                {/* Search */}
                <div className="relative flex-1 min-w-[240px] max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <Input
                    placeholder="Search drug name or NDC..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-8 text-sm border-slate-300"
                  />
                  {searchQuery && (
                    <button className="absolute right-2 top-1/2 -translate-y-1/2" onClick={() => setSearchQuery("")}>
                      <X className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  )}
                </div>

                {/* Columns filter */}
                <div className="relative" ref={filterRef}>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs border-slate-300" onClick={() => setOpenFilter(!openFilter)}>
                    <SlidersHorizontal className="h-3.5 w-3.5" /> Columns <ChevronDown className="h-3 w-3" />
                  </Button>

                  {openFilter && (
                    <div
                      className="absolute left-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl"
                      style={{ width: 860, maxWidth: "95vw", zIndex: 9999 }}
                    >
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
                        <span className="text-xs font-bold tracking-wide text-slate-600 uppercase">Column Visibility</span>
                        <button onClick={() => setOpenFilter(false)}><X className="h-4 w-4 text-slate-400" /></button>
                      </div>

                      <div className="grid grid-cols-5 divide-x divide-slate-100 max-h-[70vh] overflow-y-auto">

                        {/* Base */}
                        <div className="p-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Base</p>
                          {([
                            ["Rank", showRank, setShowRank],
                            ["NDC", showNdc, setShowNdc],
                            ["Drug Name", showDrug, setShowDrug],
                            ["Pkg Size", showPkg, setShowPkg],
                            ["Unit", showUnit, setShowUnit],
                            ["Total Ordered", showOrdered, setShowOrdered],
                          ] as [string, boolean, React.Dispatch<React.SetStateAction<boolean>>][]).map(([label, val, set]) => (
                            <label key={label} className="flex items-center gap-1.5 py-0.5 text-xs cursor-pointer">
                              <Checkbox checked={val} onCheckedChange={() => set((v) => !v)} className="h-3 w-3" />
                              {label}
                            </label>
                          ))}
                          <div className="border-t border-slate-100 mt-2 pt-2">
                            {ALL_COLS.filter((c) => c.group === "base-scroll").map((c) => (
                              <label key={c.key} className="flex items-center gap-1.5 py-0.5 text-xs cursor-pointer">
                                <Checkbox checked={!!vis[c.key]} onCheckedChange={() => toggleVis(c.key)} className="h-3 w-3" />
                                {c.label}
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Commercial */}
                        <div className="p-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: GC.commercial.parentColor }}>
                            Commercial
                          </p>
                          {ALL_COLS.filter((c) => c.group === "commercial").map((c) => (
                            <label key={c.key} className="flex items-center gap-1.5 py-0.5 text-xs cursor-pointer">
                              <Checkbox checked={!!vis[c.key]} onCheckedChange={() => toggleVis(c.key)} className="h-3 w-3" />
                              {c.label}
                            </label>
                          ))}
                        </div>

                        {/* Medicare */}
                        <div className="p-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: GC.medicare.parentColor }}>
                            Medicare
                          </p>
                          {ALL_COLS.filter((c) => c.group === "medicare").map((c) => (
                            <label key={c.key} className="flex items-center gap-1.5 py-0.5 text-xs cursor-pointer">
                              <Checkbox checked={!!vis[c.key]} onCheckedChange={() => toggleVis(c.key)} className="h-3 w-3" />
                              {c.label}
                            </label>
                          ))}
                        </div>

                        {/* Medicaid */}
                        <div className="p-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: GC.medicaid.parentColor }}>
                            Medicaid
                          </p>
                          {ALL_COLS.filter((c) => c.group === "medicaid").map((c) => (
                            <label key={c.key} className="flex items-center gap-1.5 py-0.5 text-xs cursor-pointer">
                              <Checkbox checked={!!vis[c.key]} onCheckedChange={() => toggleVis(c.key)} className="h-3 w-3" />
                              {c.label}
                            </label>
                          ))}
                        </div>

                        {/* Medicare + Medicaid */}
                        <div className="p-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: GC.mAndM.parentColor }}>
                            Medicare + Medicaid
                          </p>
                          {ALL_COLS.filter((c) => c.group === "mAndM").map((c) => (
                            <label key={c.key} className="flex items-center gap-1.5 py-0.5 text-xs cursor-pointer">
                              <Checkbox checked={!!vis[c.key]} onCheckedChange={() => toggleVis(c.key)} className="h-3 w-3" />
                              {c.label}
                            </label>
                          ))}
                        </div>

                      </div>
                    </div>
                  )}
                </div>

                {/* QTY */}
                <DropdownMenu open={openQtyDropdown} onOpenChange={setOpenQtyDropdown}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs border-slate-300">
                      QTY: {qtyType ?? "—"} <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuCheckboxItem checked={qtyType === "UNIT"} onCheckedChange={() => { setQtyType("UNIT"); setShowUnit(false); setShowPkg(true); }}>UNIT</DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem checked={qtyType === "PKG SIZE"} onCheckedChange={() => { setQtyType("PKG SIZE"); setShowUnit(false); setShowPkg(true); }}>PKG SIZE</DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Input type="number" placeholder="Max Amount" value={amountValue} onChange={(e) => setAmountValue(Number(e.target.value) || "")} className="w-[110px] h-8 text-xs border-slate-300" />

                <Select value={String(rowsPerPage)} onValueChange={(v) => setRowsPerPage(Number(v))}>
                  <SelectTrigger className="w-[100px] h-8 text-xs border-slate-300"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {rowOptions.map((n) => <SelectItem key={n} value={String(n)}>{n === totalRows ? `All (${n})` : n}</SelectItem>)}
                  </SelectContent>
                </Select>

              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                TABLE
            ══════════════════════════════════════════════════ */}

            <style jsx global>{`
              .isc::-webkit-scrollbar{height:4px;width:4px}
              .isc::-webkit-scrollbar-track{background:transparent}
              .isc::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}

              .srow td{transition:background 60ms ease}
              .srow:hover td{background:#f0fdf8!important}
              .srow.sel td{background:#eff6ff!important}
              .srow.even td{background:#f8fafc}
              .srow.even:hover td{background:#f0fdf8!important}

              th.sc,td.sc{box-shadow:inset -1px 0 0 0 #e2e8f0}
              th.sl,td.sl{box-shadow:inset -1px 0 0 0 #e2e8f0,4px 0 8px -2px rgba(0,0,0,0.1)}

              tbody td{border-bottom:1px solid #e2e8f0;border-right:1px solid #f1f5f9}
              tbody td:last-child{border-right:none}
              thead th{border-right:1px solid #e2e8f0}
              thead th:last-child{border-right:none}

              thead tr:nth-child(1) th{top:0}
              thead tr:nth-child(2) th{top:20px;border-bottom:2px solid #cbd5e1}
              thead tr:nth-child(1) th{border-bottom:none}
            `}</style>

            <div className="flex-1 overflow-hidden flex flex-col">
              <div ref={bodyScrollRef} className="flex-1 overflow-auto isc">
                <table style={{ borderCollapse: "separate", borderSpacing: 0, minWidth: "max-content", width: "100%" }}>

                  {/* colgroup */}
                  <colgroup>
                    <col style={{ width: 44, minWidth: 44 }} />
                    {showRank    && <col style={{ width: 72,  minWidth: 72  }} />}
                    {showNdc     && <col style={{ width: 140, minWidth: 140 }} />}
                    {showDrug    && <col style={{ width: 240, minWidth: 240 }} />}
                    {showPkg     && <col style={{ width: 100, minWidth: 100 }} />}
                    {showUnit    && <col style={{ width: 100, minWidth: 100 }} />}
                    {showOrdered && <col style={{ width: 140, minWidth: 140 }} />}
                    {visCols.map((c) => <col key={c.key} style={{ width: c.w, minWidth: c.w }} />)}
                  </colgroup>

                  {/* ══ THEAD ══ */}
                  <thead>

                    {/* ROW 1 */}
                    <tr style={{ background: "#f8fafc" }}>

                      {/* Sticky base cols — all rowspan=2 */}
                      <th rowSpan={2} className="sticky z-[110] sc" style={{ left: L_CHECKBOX, width: 44, background: "#f8fafc", padding: "0 12px", textAlign: "center" }}>
                        <Checkbox checked={selectedRows.length === paginatedData.length && paginatedData.length > 0} onCheckedChange={toggleAll} className="h-3.5 w-3.5" />
                      </th>

                      {showRank && (
                        <th rowSpan={2} className="sticky z-[110] sc" style={{ left: L_RANK, width: 72, background: "#f8fafc", cursor: "pointer" }} onClick={(e) => handleSort("rank", e)}>
                          <div className="flex items-center justify-center gap-1 px-2 h-full hover:bg-emerald-50/60">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Rank</span>
                            <SortIcon active={sortDir("rank")} />
                          </div>
                        </th>
                      )}

                      {showNdc && (
                        <th rowSpan={2} className="sticky z-[110] sc" style={{ left: L_NDC, width: 140, background: "#f8fafc", cursor: "pointer" }} onClick={(e) => handleSort("ndc", e)}>
                          <div className="flex items-center justify-center gap-1 px-2 h-full hover:bg-emerald-50/60">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">NDC</span>
                            <SortIcon active={sortDir("ndc")} />
                          </div>
                        </th>
                      )}

                      {showDrug && (
                        <th rowSpan={2} className="sticky z-[110] sc" style={{ left: L_DRUG, width: 240, background: "#f8fafc", textAlign: "left", cursor: "pointer" }} onClick={(e) => handleSort("drugName", e)}>
                          <div className="flex items-center gap-1 px-3 h-full hover:bg-emerald-50/60">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Drug Name</span>
                            <SortIcon active={sortDir("drugName")} />
                          </div>
                        </th>
                      )}

                      {showPkg && (
                        <th rowSpan={2} className="sticky z-[110] sc" style={{ left: L_PKG, width: 100, background: "#f8fafc", cursor: "pointer" }} onClick={(e) => handleSort("pkgSize", e)}>
                          <div className="flex items-center justify-center gap-1 px-2 h-full hover:bg-emerald-50/60">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">PKG</span>
                            <SortIcon active={sortDir("pkgSize")} />
                          </div>
                        </th>
                      )}

                      {showUnit && (
                        <th rowSpan={2} className="sticky z-[110] sc" style={{ left: L_UNIT, width: 100, background: "#f8fafc", cursor: "pointer" }} onClick={(e) => handleSort("unit", e)}>
                          <div className="flex items-center justify-center gap-1 px-2 h-full hover:bg-emerald-50/60">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Unit</span>
                            <SortIcon active={sortDir("unit")} />
                          </div>
                        </th>
                      )}

                      {showOrdered && (
                        <th rowSpan={2} className="sticky z-[110] sl" style={{ left: L_ORDERED, width: 140, background: "#f8fafc", cursor: "pointer" }} onClick={(e) => handleSort("totalOrdered", e)}>
                          <div className="flex items-center justify-center gap-1.5 px-2 h-full hover:bg-emerald-50/60">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Total Ordered</span>
                            <SortIcon active={sortDir("totalOrdered")} />
                          </div>
                        </th>
                      )}

                      {/* Base scroll — rowspan 2 */}
                      {baseScrollCols.map((c) => (
                        <th key={c.key} rowSpan={2} className="sticky z-50" style={{ background: "#f8fafc", cursor: "pointer" }} onClick={(e) => handleSort(c.key, e)}>
                          <div className="flex items-center justify-center gap-1 px-3 h-full hover:bg-emerald-50/60 whitespace-nowrap">
                            {c.dot && <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${c.dot}`} />}
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">{c.label}</span>
                            <SortIcon active={sortDir(c.key)} />
                          </div>
                        </th>
                      ))}

                      {/* Group parent headers — zIndex:1 stays behind sticky-left cols */}
                      {commercialCols.length > 0 && (
                        <th colSpan={commercialCols.length} className="text-center" style={{ position: "sticky", top: 0, zIndex: 1, background: GC.commercial.parentBg, color: GC.commercial.parentColor, borderLeft: `2px solid ${GC.commercial.parentBorder}`, fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", height: 20, padding: 0 }}>
                          Commercial
                        </th>
                      )}
                      {medicareCols.length > 0 && (
                        <th colSpan={medicareCols.length} className="text-center" style={{ position: "sticky", top: 0, zIndex: 1, background: GC.medicare.parentBg, color: GC.medicare.parentColor, borderLeft: `2px solid ${GC.medicare.parentBorder}`, fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", height: 20, padding: 0 }}>
                          Medicare
                        </th>
                      )}
                      {medicaidCols.length > 0 && (
                        <th colSpan={medicaidCols.length} className="text-center" style={{ position: "sticky", top: 0, zIndex: 1, background: GC.medicaid.parentBg, color: GC.medicaid.parentColor, borderLeft: `2px solid ${GC.medicaid.parentBorder}`, fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", height: 20, padding: 0 }}>
                          Medicaid
                        </th>
                      )}
                      {mAndMCols.length > 0 && (
                        <th colSpan={mAndMCols.length} className="text-center" style={{ position: "sticky", top: 0, zIndex: 1, background: GC.mAndM.parentBg, color: GC.mAndM.parentColor, borderLeft: `2px solid ${GC.mAndM.parentBorder}`, fontSize: 11, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", height: 20, padding: 0 }}>
                          Medicare + Medicaid
                        </th>
                      )}
                    </tr>

                    {/* ROW 2: sub-labels */}
                    <tr style={{ background: "#f8fafc" }}>
                      {[...commercialCols, ...medicareCols, ...medicaidCols, ...mAndMCols].map(renderSubTh)}
                    </tr>

                  </thead>

                  {/* ══ TBODY ══ */}
                  <tbody>
                    {paginatedData.map((row, ri) => {
                      const isSel  = selectedRows.includes(row.id);
                      const isEven = ri % 2 === 1;
                      const bg     = isSel ? "#eff6ff" : isEven ? "#f8fafc" : "#ffffff";

                      return (
                        <tr
                          key={row.id}
                          className={`srow cursor-pointer ${isSel ? "sel" : ""} ${isEven ? "even" : ""}`}
                          style={{ height: 36 }}
                          onClick={() => { setActiveDrug(row); setOpenDrugSidebar(true); }}
                        >
                          <td className="sticky z-20 sc" style={{ left: L_CHECKBOX, width: 44, background: bg, textAlign: "center", padding: "0 12px" }} onClick={(e) => e.stopPropagation()}>
                            <Checkbox checked={isSel} onCheckedChange={() => toggleRow(row.id)} className="h-3.5 w-3.5" />
                          </td>
                          {showRank    && <td className="sticky z-20 sc" style={{ left: L_RANK, width: 72, background: bg, textAlign: "center", padding: "0 8px" }}><span className="text-xs text-slate-500 tabular-nums font-medium">{row.rank}</span></td>}
                          {showNdc     && <td className="sticky z-20 sc" style={{ left: L_NDC,  width: 140, background: bg, textAlign: "center", padding: "0 8px" }}><span className="text-[11px] font-mono text-slate-500 tracking-tight">{row.ndc}</span></td>}
                          {showDrug    && (
                            <td className="sticky z-20 sc" style={{ left: L_DRUG, width: 240, background: bg, textAlign: "left", padding: "0 12px" }}>
                              <span className="text-xs font-semibold text-slate-800 truncate block max-w-[220px]" title={row.drugName}>{row.drugName}</span>
                            </td>
                          )}
                          {showPkg     && <td className="sticky z-20 sc" style={{ left: L_PKG,  width: 100, background: bg, textAlign: "right", padding: "0 10px" }}><span className="text-xs text-slate-600 tabular-nums">{row.pkgSize}</span></td>}
                          {showUnit    && <td className="sticky z-20 sc" style={{ left: L_UNIT, width: 100, background: bg, textAlign: "right", padding: "0 10px" }}><span className="text-xs text-slate-600 tabular-nums">{row.unit}</span></td>}
                          {showOrdered && <td className="sticky z-20 sl" style={{ left: L_ORDERED, width: 140, background: bg, textAlign: "right", padding: "0 12px" }}><span className="text-xs font-bold text-slate-800 tabular-nums">{row.totalOrdered.toLocaleString()}</span></td>}

                          {visCols.map((c) => (
                            <td key={c.key} style={{ textAlign: "right", padding: "0 10px", ...cellBorderStyle(c) }}>
                              <span className="text-xs">{cellVal(c, row)}</span>
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="border-t border-slate-200 bg-white px-5 py-2.5 flex items-center justify-between flex-shrink-0 z-30">
                <span className="text-xs text-slate-500">
                  Showing <b className="text-slate-700">{filteredData.length === 0 ? 0 : (currentPage - 1) * effRPP + 1}</b>
                  –<b className="text-slate-700">{Math.min(currentPage * effRPP, filteredData.length)}</b>
                  {" "}of <b className="text-slate-700">{filteredData.length}</b>
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="h-7 px-2.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40">← Prev</button>
                  {(() => {
                    const pages: number[] = []; const d = 2;
                    const lp = Math.max(2, currentPage - d); const rp = Math.min(totalPages - 1, currentPage + d);
                    pages.push(1); if (lp > 2) pages.push(-1);
                    for (let i = lp; i <= rp; i++) pages.push(i);
                    if (rp < totalPages - 1) pages.push(-2);
                    if (totalPages > 1) pages.push(totalPages);
                    return pages.map((p, i) => p < 0
                      ? <span key={`e${i}`} className="px-1 text-slate-400 text-xs">…</span>
                      : <button key={p} onClick={() => setCurrentPage(p)} className={`h-7 w-7 text-xs font-semibold rounded-lg ${currentPage === p ? "bg-emerald-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>{p}</button>
                    );
                  })()}
                  <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="h-7 px-2.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40">Next →</button>
                </div>
              </div>
            </div>

            {/* Export Modal */}
            <Dialog open={openExportModal} onOpenChange={setOpenExportModal}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader><DialogTitle className="text-xl font-bold">Export Report</DialogTitle><DialogDescription>Choose format and scope</DialogDescription></DialogHeader>
                <div className="space-y-5 py-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Format</Label>
                    <RadioGroup value={exportFormat} onValueChange={(v) => setExportFormat(v as any)}>
                      {["csv","excel","pdf"].map((f) => (
                        <div key={f} className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50">
                          <RadioGroupItem value={f} id={f} /><Label htmlFor={f} className="cursor-pointer capitalize font-medium">{f}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Scope</Label>
                    <RadioGroup value={exportScope} onValueChange={(v) => setExportScope(v as any)}>
                      <div className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50"><RadioGroupItem value="visible" id="vis" /><Label htmlFor="vis" className="cursor-pointer font-medium">Visible Rows</Label></div>
                      <div className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50"><RadioGroupItem value="all" id="all" /><Label htmlFor="all" className="cursor-pointer font-medium">All Data</Label></div>
                    </RadioGroup>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpenExportModal(false)}>Cancel</Button>
                  <Button onClick={handleExport} className="bg-emerald-600 hover:bg-emerald-700">Export</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Drug Sidebar */}
            <Sheet open={openDrugSidebar} onOpenChange={setOpenDrugSidebar}>
              <SheetContent className="w-[440px] sm:w-[520px]">
                <SheetHeader>
                  <SheetTitle className="text-lg font-bold">Drug Details</SheetTitle>
                  <SheetDescription>{activeDrug?.drugName}</SheetDescription>
                </SheetHeader>
                {activeDrug && (
                  <div className="mt-6 space-y-3">
                    {([
                      ["NDC", activeDrug.ndc],
                      ["Pkg Size", activeDrug.pkgSize],
                      ["Total Ordered", activeDrug.totalOrdered.toLocaleString()],
                      ["Total Billed", activeDrug.totalBilled.toLocaleString()],
                      ["Cost", `$${activeDrug.cost.toFixed(2)}`],
                      ["Amount", `$${activeDrug.amount.toFixed(2)}`],
                    ] as [string, string | number][]).map(([l, v]) => (
                      <div key={l} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{l}</p>
                        <p className="text-sm font-semibold text-slate-800 mt-0.5">{v}</p>
                      </div>
                    ))}
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Shortage</p>
                      <p className="text-sm font-semibold mt-0.5">{shortage(activeDrug.totalShortage)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                        <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Medicare</p>
                        <p className="text-sm font-semibold text-emerald-800 mt-0.5">{activeDrug.medicare.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">NJ Medicaid</p>
                        <p className="text-sm font-semibold text-purple-800 mt-0.5">{activeDrug.njMedicaid.toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 col-span-2">
                        <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">NJ Billed (Medicare + Medicaid)</p>
                        <p className="text-sm font-semibold text-amber-800 mt-0.5">{activeDrug.njBilled.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </SheetContent>
            </Sheet>

            {/* Leave Dialog */}
            <AlertDialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
              <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>Leave this page?</AlertDialogTitle>
                  <AlertDialogDescription>Unsaved filters and selections will be lost.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setShowLeaveDialog(false)}>Stay</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmLeave} className="bg-red-600 hover:bg-red-700 text-white">Yes, leave</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}