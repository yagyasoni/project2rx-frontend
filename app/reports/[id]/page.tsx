"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import AppSidebar from "@/components/Sidebar";
import {
  Search,
  X,
  ChevronDown,
  RotateCw,
  Download,
  SlidersHorizontal,
  MoveLeftIcon,
} from "lucide-react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useParams, useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ProtectedRoute from "@/components/ProtectedRoute";
import CommunityLinkPageCopy from "@/components/communityLink";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SortRule {
  key: keyof InventoryRow;
  dir: "asc" | "desc";
}

interface InventoryRow {
  id: number;
  ndc: string;
  drugName: string;
  rank: number;
  pkgSize: number;
  unit: number;
  totalOrdered: number;
  totalBilled: number;
  totalShortage: number;
  highestShortage: number;
  cost: number;
  amount: number;
  // Commercial
  horizon: number;
  shortageHorizon: number;
  express: number;
  shortageExpress: number;
  cvsCaremark: number;
  shortageCvsCaremark: number;
  optumrx: number;
  shortageOptumrx: number;
  humana: number;
  shortageHumana: number;
  ssc: number;
  shortageSsc: number;
  pdmi: number;
  shortagePdmi: number;
  // Coupon
  coupon: number;
  shortageCoupon: number;
  // Others
  govMilitary: number;
  shortageGovMilitary: number;
  // Medicare
  medicare: number;
  shortageMedicare: number;
  // Medicaid
  njMedicaid: number;
  shortageNjMedicaid: number;
  // Medicare + Medicaid combined
  njBilled: number;
  shortageNjBilled: number;

  brand: string | null; // ← ADD THIS
}

interface RxLine {
  rx_number: string;
  date_filled: string;
  quantity: number;
  type: string;
  pri_bin: string;
  pri_pcn: string;
  pri_group: string;
  pri_insurance: string;
  pri_paid: number;
  sec_bin: string;
  sec_pcn: string;
  sec_group: string;
  sec_insurance: string;
  sec_paid: number;
  is_outside_date_range: boolean;
}

interface OrderLine {
  type: string;
  date_ordered: string;
  quantity: number;
  is_outside_date_range: boolean;
}

interface DrugLookupNdc {
  drug_name: string;
  ndc: string;
  brand: string | null;
  rx_count: number;
  avg_qty_per_rx: number;
  avg_copay_per_rx: number | null;
  avg_ins_paid_per_rx: number;
  avg_ins_paid_per_unit: number;
}

interface DrugLookupDrug {
  drug_name: string;
  brand: string | null;
  rx_count: number;
  avg_qty_per_rx: number;
  avg_copay_per_rx: number | null;
  avg_ins_paid_per_rx: number;
  avg_ins_paid_per_unit: number;
  ndcs: DrugLookupNdc[];
}

interface DrugLookupResponse {
  ingredient: string;
  drugs: DrugLookupDrug[];
}
interface DrugLookupNdc {
  drug_name: string;
  ndc: string;
  brand: string | null;
  rx_count: number;
  avg_qty_per_rx: number;
  avg_copay_per_rx: number | null;
  avg_ins_paid_per_rx: number;
  avg_ins_paid_per_unit: number;
}

interface DrugLookupDrug {
  drug_name: string;
  brand: string | null;
  rx_count: number;
  avg_qty_per_rx: number;
  avg_copay_per_rx: number | null;
  avg_ins_paid_per_rx: number;
  avg_ins_paid_per_unit: number;
  ndcs: DrugLookupNdc[];
}

interface DrugLookupResponse {
  ingredient: string;
  drugs: DrugLookupDrug[];
}
// ─── Column group types ───────────────────────────────────────────────────────

type ColGroup =
  | "base-scroll"
  | "commercial"
  | "coupon"
  | "others"
  | "medicare"
  | "medicaid"
  | "mAndM";

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
  {
    key: "totalBilled",
    label: "Total Billed",
    w: 120,
    group: "base-scroll",
    dot: "bg-red-400",
  },
  {
    key: "totalShortage",
    label: "Total Shortage",
    w: 120,
    group: "base-scroll",
    dot: "bg-amber-400",
    isShortage: true,
  },
  {
    key: "highestShortage",
    label: "Highest Short",
    w: 120,
    group: "base-scroll",
    dot: "bg-amber-400",
    isShortage: true,
  },
  {
    key: "cost",
    label: "$ Cost",
    w: 100,
    group: "base-scroll",
    dot: "bg-red-400",
  },
  {
    key: "amount",
    label: "$ Amount",
    w: 110,
    group: "base-scroll",
    dot: "bg-blue-400",
  },
  // Commercial (includes PDMI)
  { key: "horizon", label: "Horizon", w: 110, group: "commercial" },
  {
    key: "shortageHorizon",
    label: "Short Horizon",
    w: 110,
    group: "commercial",
    isShortage: true,
  },
  { key: "express", label: "Express", w: 110, group: "commercial" },
  {
    key: "shortageExpress",
    label: "Short Express",
    w: 110,
    group: "commercial",
    isShortage: true,
  },
  { key: "cvsCaremark", label: "Caremark", w: 110, group: "commercial" },
  {
    key: "shortageCvsCaremark",
    label: "Short Caremark",
    w: 120,
    group: "commercial",
    isShortage: true,
  },
  { key: "optumrx", label: "Optum", w: 100, group: "commercial" },
  {
    key: "shortageOptumrx",
    label: "Short Optum",
    w: 100,
    group: "commercial",
    isShortage: true,
  },
  { key: "humana", label: "Humana", w: 100, group: "commercial" },
  {
    key: "shortageHumana",
    label: "Short Humana",
    w: 100,
    group: "commercial",
    isShortage: true,
  },
  { key: "ssc", label: "SSC", w: 90, group: "commercial" },
  {
    key: "shortageSsc",
    label: "Short SSC",
    w: 90,
    group: "commercial",
    isShortage: true,
  },
  { key: "pdmi", label: "PDMI (Co-Pay)", w: 130, group: "commercial" },
  {
    key: "shortagePdmi",
    label: "Short PDMI",
    w: 110,
    group: "commercial",
    isShortage: true,
  },
  // Coupon
  { key: "coupon", label: "Coupon", w: 100, group: "coupon" },
  {
    key: "shortageCoupon",
    label: "Short Coupon",
    w: 110,
    group: "coupon",
    isShortage: true,
  },
  // Medicare
  // Medicare
  { key: "medicare", label: "Medicare", w: 120, group: "medicare" },
  {
    key: "shortageMedicare",
    label: "Short Medicare",
    w: 120,
    group: "medicare",
    isShortage: true,
  },
  // Medicaid
  { key: "njMedicaid", label: "NJ Medicaid", w: 120, group: "medicaid" },
  {
    key: "shortageNjMedicaid",
    label: "Short NJ Med",
    w: 120,
    group: "medicaid",
    isShortage: true,
  },
  // Medicare + Medicaid combined
  { key: "njBilled", label: "NJ Billed", w: 120, group: "mAndM" },
  {
    key: "shortageNjBilled",
    label: "Shortage",
    w: 120,
    group: "mAndM",
    isShortage: true,
  },
  // Others
  { key: "govMilitary", label: "Gov/Military", w: 120, group: "others" },
  {
    key: "shortageGovMilitary",
    label: "Short Gov/Mil",
    w: 120,
    group: "others",
    isShortage: true,
  },
];

type ColKey = keyof InventoryRow;
type VisMap = Partial<Record<ColKey, boolean>>;

// ─── Sort icon ────────────────────────────────────────────────────────────────

function SortIcon({ active }: { active?: "asc" | "desc" }) {
  if (!active)
    return <ArrowUpDown className="w-3 h-3 shrink-0 text-slate-400" />;
  return (
    <span className="text-[11px] shrink-0 font-bold text-emerald-600">
      {active === "asc" ? "↑" : "↓"}
    </span>
  );
}

// ─── Group colours ────────────────────────────────────────────────────────────

const GC = {
  commercial: {
    parentBg: "#dbeafe",
    parentColor: "#1e40af",
    parentBorder: "#3b82f6",
    subBg: "#eff6ff",
    subColor: "#1d4ed8",
    shrtBg: "#fef2f2",
    shrtColor: "#991b1b",
    cellBorderColor: "#bfdbfe",
  },
  coupon: {
    parentBg: "#fdf4ff",
    parentColor: "#7e22ce",
    parentBorder: "#a855f7",
    subBg: "#faf5ff",
    subColor: "#9333ea",
    shrtBg: "#fef2f2",
    shrtColor: "#991b1b",
    cellBorderColor: "#e9d5ff",
  },
  others: {
    parentBg: "#f1f5f9",
    parentColor: "#475569",
    parentBorder: "#94a3b8",
    subBg: "#f8fafc",
    subColor: "#64748b",
    shrtBg: "#fef2f2",
    shrtColor: "#991b1b",
    cellBorderColor: "#cbd5e1",
  },
  medicare: {
    parentBg: "#dcfce7",
    parentColor: "#166534",
    parentBorder: "#22c55e",
    subBg: "#f0fdf4",
    subColor: "#15803d",
    shrtBg: "#f0fdf4",
    shrtColor: "#166534",
    cellBorderColor: "#86efac",
  },
  medicaid: {
    parentBg: "#ede9fe",
    parentColor: "#4c1d95",
    parentBorder: "#8b5cf6",
    subBg: "#f5f3ff",
    subColor: "#6d28d9",
    shrtBg: "#f5f3ff",
    shrtColor: "#6d28d9",
    cellBorderColor: "#c4b5fd",
  },
  mAndM: {
    parentBg: "#fef9c3",
    parentColor: "#854d0e",
    parentBorder: "#eab308",
    subBg: "#fefce8",
    subColor: "#a16207",
    shrtBg: "#fef2f2",
    shrtColor: "#991b1b",
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
  const [exportFormat, setExportFormat] = useState<"csv" | "excel" | "pdf">(
    "excel",
  );
  const [exportScope, setExportScope] = useState<"visible" | "all">("visible");
  const [amountValue, setAmountValue] = useState<number | "">("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [qtyType, setQtyType] = useState<"UNIT" | "PKG SIZE" | null>(
    "PKG SIZE",
  );
  const [openQtyDropdown, setOpenQtyDropdown] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [openDrugSidebar, setOpenDrugSidebar] = useState(false);
  const [activeDrug, setActiveDrug] = useState<InventoryRow | null>(null);
  const [activeSidebar, setActiveSidebar] = useState<
    "ndc" | "drug" | "drug-lookup" | null
  >(null);
  const [drugDetail, setDrugDetail] = useState<any>(null);
  const [drugDetailLoading, setDrugDetailLoading] = useState(false);
  const [drugLookup, setDrugLookup] = useState<DrugLookupResponse | null>(null);
  const [drugLookupLoading, setDrugLookupLoading] = useState(false);
  const [expandedLookupDrug, setExpandedLookupDrug] = useState<string | null>(
    null,
  );
  const [outsideRange, setOutsideRange] = useState(false);
  const [includeBilled, setIncludeBilled] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [auditDates, setAuditDates] = useState<any>(null);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  const [openBilledSidebar, setOpenBilledSidebar] = useState(false);
  const [billedDrug, setBilledDrug] = useState<InventoryRow | null>(null);
  const [rxLines, setRxLines] = useState<RxLine[]>([]);
  const [rxLoading, setRxLoading] = useState(false);
  const [rxTab, setRxTab] = useState<"current" | "outside">("current");
  const [rxFilters, setRxFilters] = useState<string[]>([]);
  const [showRxFilters, setShowRxFilters] = useState(false);
  const [openOrderedSidebar, setOpenOrderedSidebar] = useState(false);
  const [orderedDrug, setOrderedDrug] = useState<InventoryRow | null>(null);
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderTab, setOrderTab] = useState<"current" | "outside">("current");
  const [orderFilters, setOrderFilters] = useState<string[]>([]);
  const [showOrderFilters, setShowOrderFilters] = useState(false);
  const [openShortageSidebar, setOpenShortageSidebar] = useState(false);
  const [shortageDrug, setShortageDrug] = useState<InventoryRow | null>(null);

  // Notes sidebar
  const [openNotesSidebar, setOpenNotesSidebar] = useState(false);
  const [notesDrug, setNotesDrug] = useState<InventoryRow | null>(null);
  const [noteText, setNoteText] = useState("");
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [notesSaved, setNotesSaved] = useState(false);

  // Drug name search filter
  const [drugNameFilter, setDrugNameFilter] = useState<string | null>(null);

  // Tags system
  interface Tag {
    id: string;
    name: string;
    color: string;
  }
  const [tags, setTags] = useState<Tag[]>([
    { id: "1", name: "Caremark", color: "#22c55e" },
    { id: "2", name: "OXY OPTUM", color: "#3b82f6" },
    { id: "3", name: "ORDERED", color: "#f97316" },
    { id: "4", name: "Review", color: "#8b5cf6" },
  ]);
  const [rowTags, setRowTags] = useState<Record<number, string[]>>({}); // rowId -> tagIds[]
  const [openTagsDropdown, setOpenTagsDropdown] = useState(false);
  const [activeTagFilters, setActiveTagFilters] = useState<string[]>([]);
  const [tagMenuOpen, setTagMenuOpen] = useState<string | null>(null); // tagId with open 3-dot menu
  const [tagModal, setTagModal] = useState<{
    mode: "create" | "edit";
    tag?: Tag;
  } | null>(null);
  const [tagModalName, setTagModalName] = useState("");
  const [tagModalColor, setTagModalColor] = useState("#22c55e");
  const tagsDropdownRef = useRef<HTMLDivElement | null>(null);
  const [tagMenuPos, setTagMenuPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [rowTagMenuOpen, setRowTagMenuOpen] = useState<number | null>(null); // rowId
  const [rowTagMenuPos, setRowTagMenuPos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const TAG_COLORS = [
    "#22c55e",
    "#eab308",
    "#f97316",
    "#ef4444",
    "#ec4899",
    "#a855f7",
    "#8b5cf6",
    "#3b82f6",
    "#06b6d4",
    "#14b8a6",
    "#84cc16",
    "#f59e0b",
    "#10b981",
    "#6366f1",
    "#e11d48",
    "#7c3aed",
    "#0ea5e9",
    "#64748b",
    "#1e293b",
    "#000000",
  ];

  const bodyScrollRef = useRef<HTMLDivElement | null>(null);
  const filterRef = useRef<HTMLDivElement | null>(null);
  const isLeavingConfirmed = useRef(false);

  const params = useParams();
  const router = useRouter();
  const auditId = params.id as string;

  // ── Visibility state ──────────────────────────────────────────────────────

  const initVis: VisMap = {};
  ALL_COLS.forEach((c) => {
    initVis[c.key] = true;
  });
  const [vis, setVis] = useState<VisMap>(initVis);
  const toggleVis = (k: ColKey) => setVis((p) => ({ ...p, [k]: !p[k] }));

  const [showRank, setShowRank] = useState(true);
  const [showNdc, setShowNdc] = useState(true);
  const [showDrug, setShowDrug] = useState(true);
  const [showPkg, setShowPkg] = useState(true);
  const [showUnit, setShowUnit] = useState(false);
  const [showOrdered, setShowOrdered] = useState(true);

  // ── Sort ──────────────────────────────────────────────────────────────────

  const [sortRules, setSortRules] = useState<SortRule[]>([
    { key: "amount", dir: "desc" },
  ]);

  const fetchDrugDetail = async (
    ndc: string,
    outside: boolean,
    billed: boolean,
  ) => {
    setDrugDetailLoading(true);
    setDrugDetail(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/${auditId}/drug-detail/${encodeURIComponent(ndc)}?outside_range=${outside}&include_billed=${billed}`,
      );
      const data = await res.json();
      setDrugDetail(data);
    } catch (e) {
      console.error("fetchDrugDetail error:", e);
    } finally {
      setDrugDetailLoading(false);
    }
  };

  const extractIngredient = (drugName: string) =>
    drugName.trim().split(/\s+/)[0].toUpperCase();

  const fetchDrugLookup = async (ingredient: string) => {
    setDrugLookupLoading(true);
    setDrugLookup(null);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/${auditId}/drug-lookup?ingredient=${encodeURIComponent(ingredient)}`,
      );
      const data = await res.json();
      setDrugLookup(data);
    } catch (e) {
      console.error("fetchDrugLookup error:", e);
    } finally {
      setDrugLookupLoading(false);
    }
  };

  const drugLookupAgg = useMemo(() => {
    if (!drugLookup || !drugLookup.drugs || drugLookup.drugs.length === 0) {
      return null;
    }
    const drugs = drugLookup.drugs;
    const num = (v: any) => Number(v ?? 0) || 0;

    const totalRxs = drugs.reduce((s, d) => s + num(d.rx_count), 0);
    const totalQty = drugs.reduce(
      (s, d) => s + num(d.avg_qty_per_rx) * num(d.rx_count),
      0,
    );
    const totalInsPaid = drugs.reduce(
      (s, d) => s + num(d.avg_ins_paid_per_rx) * num(d.rx_count),
      0,
    );
    const weightedAvgPerUnit = totalQty > 0 ? totalInsPaid / totalQty : 0;
    const weightedAvgQty = totalRxs > 0 ? totalQty / totalRxs : 0;
    const weightedAvgInsPerRx = totalRxs > 0 ? totalInsPaid / totalRxs : 0;

    const byRx = [...drugs].sort((a, b) => num(b.rx_count) - num(a.rx_count));
    const byUnit = [...drugs].sort(
      (a, b) => num(b.avg_ins_paid_per_unit) - num(a.avg_ins_paid_per_unit),
    );

    return {
      totalRxs,
      totalQty,
      totalInsPaid,
      weightedAvgPerUnit,
      weightedAvgQty,
      weightedAvgInsPerRx,
      mostPrescribed: byRx[0],
      highestUnit: byUnit[0],
      lowestUnit: byUnit[byUnit.length - 1],
    };
  }, [drugLookup]);

  const handleSort = (key: keyof InventoryRow, e: React.MouseEvent) => {
    const idx = sortRules.findIndex((r) => r.key === key);
    let next = [...sortRules];
    if (idx === -1)
      next = e.shiftKey
        ? [...next, { key, dir: "asc" as const }]
        : [{ key, dir: "asc" as const }];
    else if (next[idx].dir === "asc") next[idx] = { key, dir: "desc" };
    else next.splice(idx, 1);
    setSortRules(next);
  };

  const sortDir = (k: keyof InventoryRow) =>
    sortRules.find((r) => r.key === k)?.dir;

  // ── Leave protection ──────────────────────────────────────────────────────

  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
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
        setLoading(true);
        setLoadingProgress(0);
        setLoadingDone(false);
        pi = setInterval(
          () =>
            setLoadingProgress((p) =>
              p >= 90 ? (clearInterval(pi!), 90) : p + Math.random() * 8 + 2,
            ),
          200,
        );

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/${auditId}/report`,
        );
        const json = await res.json();
        const data = Array.isArray(json)
          ? json
          : Array.isArray(json.inventory)
            ? json.inventory
            : [];

        const norm = data.map((row: any, i: number) => {
          const to = Number(row.total_ordered ?? 0);
          const n = (x: any) => Number(x ?? 0);

          const medicareVal = n(row.medicare); // new medicare field from backend
          const njMedicaidVal = n(row.nj_medicaid ?? row.njMedicaid);
          const njBilledVal = medicareVal + njMedicaidVal;
          // Shortages calculated individually first so combined can sum them
          const shortageMedicareVal = to - medicareVal;
          const shortageNjMedicaidVal = to - njMedicaidVal;

          return {
            id: row.id ?? i + 1,
            ndc: row.ndc ?? "",
            drugName: (row.drug_name ?? row.drugName ?? "")
              .replace(/\s*\(\d{5}-\d{4}-\d{2}\).*$/, "")
              .trim(),
            brand: row.brand ?? null,
            rank: 0,
            pkgSize: row.package_size ?? 0,
            unit:
              row.package_size > 0
                ? Number(
                    (n(row.total_billed) / Number(row.package_size)).toFixed(2),
                  )
                : 0,
            totalOrdered: to,
            totalBilled: n(row.total_billed),
            totalShortage:
              row.total_shortage != null
                ? n(row.total_shortage)
                : to - n(row.total_billed),
            highestShortage: 0,
            cost: n(row.cost),
            amount: n(row.total_amount ?? row.amount),
            // Commercial
            horizon: n(row.horizon),
            shortageHorizon: to - n(row.horizon),
            express: n(row.express),
            shortageExpress: to - n(row.express),
            cvsCaremark: n(row.cvs_caremark ?? row.cvsCaremark),
            shortageCvsCaremark: to - n(row.cvs_caremark ?? row.cvsCaremark),
            optumrx: n(row.optumrx),
            shortageOptumrx: to - n(row.optumrx),
            humana: n(row.humana),
            shortageHumana: to - n(row.humana),
            ssc: n(row.ssc),
            shortageSsc: to - n(row.ssc),
            pdmi: n(row.pdmi),
            shortagePdmi: to - n(row.pdmi),
            // Coupon
            coupon: n(row.coupon),
            shortageCoupon: to - n(row.coupon),
            // Others
            govMilitary: n(row.gov_military),
            shortageGovMilitary: to - n(row.gov_military),
            // Medicare
            // Medicare
            medicare: medicareVal,
            shortageMedicare: shortageMedicareVal,
            // Medicaid
            njMedicaid: njMedicaidVal,
            shortageNjMedicaid: shortageNjMedicaidVal,
            // Medicare + Medicaid combined
            // NJ Billed  = njMedicaid + medicare
            // Shortage   = Shrt Medicare + Shrt NJ Medicaid  (sum of both shortages)
            njBilled: njBilledVal,
            shortageNjBilled: shortageMedicareVal + shortageNjMedicaidVal,
          };
        });

        [...norm]
          .sort((a, b) => b.amount - a.amount)
          .forEach((r, i) => {
            r.rank = i + 1;
          });
        norm.forEach((r: any) => {
          const min = Math.min(
            r.shortageHorizon,
            r.shortageExpress,
            r.shortageCvsCaremark,
            r.shortageOptumrx,
            r.shortageHumana,
            r.shortageSsc,
            r.shortagePdmi,
            r.shortageCoupon,
            r.shortageGovMilitary,
            r.shortageMedicare,
            r.shortageNjMedicaid,
          );
          r.highestShortage = min < 0 ? min : 0;
        });

        setInventoryData(norm);
        const ar = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/${auditId}`,
        );
        setAuditDates(await ar.json());
      } catch (e) {
        console.error(e);
        setInventoryData([]);
      } finally {
        if (pi) clearInterval(pi);
        setLoadingProgress(100);
        setTimeout(() => {
          setLoadingDone(true);
          setTimeout(() => setLoading(false), 400);
        }, 500);
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
      const sNj = +(nto - row.njMedicaid).toFixed(2);
      const sHorizon = +(nto - row.horizon).toFixed(2);
      const sExpress = +(nto - row.express).toFixed(2);
      const sCvs = +(nto - row.cvsCaremark).toFixed(2);
      const sOptum = +(nto - row.optumrx).toFixed(2);
      const sHumana = +(nto - row.humana).toFixed(2);
      const sSsc = +(nto - row.ssc).toFixed(2);
      const sPdmi = +(nto - row.pdmi).toFixed(2);
      const sCoupon = +(nto - row.coupon).toFixed(2);
      const sGovMil = +(nto - row.govMilitary).toFixed(2);
      const minPkg = Math.min(
        sHorizon,
        sExpress,
        sCvs,
        sOptum,
        sHumana,
        sSsc,
        sPdmi,
        sCoupon,
        sGovMil,
        sMed,
        sNj,
      );

      return {
        ...row,
        totalOrdered: +nto.toFixed(2),
        totalShortage: +(nto - row.totalBilled).toFixed(2),
        shortageHorizon: sHorizon,
        shortageExpress: sExpress,
        shortageCvsCaremark: sCvs,
        shortageOptumrx: sOptum,
        shortageHumana: sHumana,
        shortageSsc: sSsc,
        shortagePdmi: sPdmi,
        shortageCoupon: sCoupon,
        shortageGovMilitary: sGovMil,
        shortageMedicare: sMed,
        shortageNjMedicaid: sNj,
        njBilled: row.medicare + row.njMedicaid,
        shortageNjBilled: +(sMed + sNj).toFixed(2),
        highestShortage: minPkg < 0 ? minPkg : 0,
      };
    }
    if (qtyType === "UNIT") {
      const d = (v: number) => +(v / pkg).toFixed(2);
      const nh = d(row.horizon),
        ne = d(row.express),
        nc = d(row.cvsCaremark);
      const no = d(row.optumrx),
        nhu = d(row.humana),
        ns = d(row.ssc);
      const np = d(row.pdmi),
        nco = d(row.coupon),
        ngm = d(row.govMilitary),
        nm = d(row.medicare),
        nnj = d(row.njMedicaid);
      const ntb = d(row.totalBilled);
      const sMed = +(row.totalOrdered - nm).toFixed(2);
      const sNj = +(row.totalOrdered - nnj).toFixed(2);
      const uSH = +(row.totalOrdered - nh).toFixed(2);
      const uSE = +(row.totalOrdered - ne).toFixed(2);
      const uSC = +(row.totalOrdered - nc).toFixed(2);
      const uSO = +(row.totalOrdered - no).toFixed(2);
      const uSHu = +(row.totalOrdered - nhu).toFixed(2);
      const uSS = +(row.totalOrdered - ns).toFixed(2);
      const uSP = +(row.totalOrdered - np).toFixed(2);
      const uSCo = +(row.totalOrdered - nco).toFixed(2);
      const uSGm = +(row.totalOrdered - ngm).toFixed(2);
      const minUnit = Math.min(
        uSH,
        uSE,
        uSC,
        uSO,
        uSHu,
        uSS,
        uSP,
        uSCo,
        uSGm,
        sMed,
        sNj,
      );
      return {
        ...row,
        totalBilled: ntb,
        totalShortage: +(row.totalOrdered - ntb).toFixed(2),
        horizon: nh,
        shortageHorizon: uSH,
        express: ne,
        shortageExpress: uSE,
        cvsCaremark: nc,
        shortageCvsCaremark: uSC,
        optumrx: no,
        shortageOptumrx: uSO,
        humana: nhu,
        shortageHumana: uSHu,
        ssc: ns,
        shortageSsc: uSS,
        pdmi: np,
        shortagePdmi: uSP,
        coupon: nco,
        shortageCoupon: uSCo,
        govMilitary: ngm,
        shortageGovMilitary: uSGm,
        medicare: nm,
        shortageMedicare: sMed,
        njMedicaid: nnj,
        shortageNjMedicaid: sNj,
        njBilled: nm + nnj,
        shortageNjBilled: +(sMed + sNj).toFixed(2),
        highestShortage: minUnit < 0 ? minUnit : 0,
      };
    }
    return row;
  };

  // ── Data pipeline ─────────────────────────────────────────────────────────

  // Transform first so sorting operates on the same values that are displayed
  const transformedData = useMemo(
    () => inventoryData.map(applyQtyMode),
    [inventoryData, qtyType],
  );

  const sortedData = useMemo(
    () =>
      [...transformedData].sort((a, b) => {
        for (const r of sortRules) {
          const av = a[r.key],
            bv = b[r.key];
          const c =
            typeof av === "number" && typeof bv === "number"
              ? av - bv
              : String(av).localeCompare(String(bv));
          if (c !== 0) return r.dir === "asc" ? c : -c;
        }
        return 0;
      }),
    [transformedData, sortRules],
  );

  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return sortedData.filter((r) => {
      const matchesSearch =
        r.drugName.toLowerCase().includes(q) || r.ndc.toLowerCase().includes(q);
      const matchesAmount = amountValue === "" || r.amount <= amountValue;
      const matchesTags =
        activeTagFilters.length === 0 ||
        activeTagFilters.some((tid) => (rowTags[r.id] ?? []).includes(tid));
      return matchesSearch && matchesAmount && matchesTags;
    });
  }, [sortedData, searchQuery, amountValue, activeTagFilters, rowTags]);

  const totalRows = filteredData.length;
  const effRPP = rowsPerPage > 0 ? rowsPerPage : filteredData.length || 50;
  const totalPages = Math.max(1, Math.ceil(filteredData.length / effRPP));
  const rowOptions = [10, 20, 50, 100, totalRows].filter(
    (v, i, a) => v > 0 && a.indexOf(v) === i,
  );
  const paginatedData = filteredData.slice(
    (currentPage - 1) * effRPP,
    currentPage * effRPP,
  );

  // ── Sticky offsets ────────────────────────────────────────────────────────

  const L_CHECKBOX = 0;
  const L_RANK = 44;
  const L_NDC = L_RANK + (showRank ? 72 : 0);
  const L_DRUG = L_NDC + (showNdc ? 140 : 0);
  const L_PKG = L_DRUG + (showDrug ? 240 : 0);
  const L_UNIT = L_PKG + (showPkg ? 100 : 0);
  const L_ORDERED = L_UNIT + (showUnit ? 100 : 0);

  // ── Visible cols split by group ───────────────────────────────────────────

  const visCols = ALL_COLS.filter((c) => vis[c.key]);
  const baseScrollCols = visCols.filter((c) => c.group === "base-scroll");
  const commercialCols = visCols.filter((c) => c.group === "commercial");
  const couponCols = visCols.filter((c) => c.group === "coupon");
  const othersCols = visCols.filter((c) => c.group === "others");
  const medicareCols = visCols.filter((c) => c.group === "medicare");
  const medicaidCols = visCols.filter((c) => c.group === "medicaid");
  const mAndMCols = visCols.filter((c) => c.group === "mAndM");

  // group first key (for border-left on first cell in each group)
  const gfk = {
    commercial: commercialCols[0]?.key,
    coupon: couponCols[0]?.key,
    others: othersCols[0]?.key,
    medicare: medicareCols[0]?.key,
    medicaid: medicaidCols[0]?.key,
    mAndM: mAndMCols[0]?.key,
  };

  const cellBorderStyle = (col: ColDef): React.CSSProperties => {
    const borders: Record<string, string> = {
      [gfk.commercial ?? ""]: GC.commercial.cellBorderColor,
      [gfk.coupon ?? ""]: GC.coupon.cellBorderColor,
      [gfk.others ?? ""]: GC.others.cellBorderColor,
      [gfk.medicare ?? ""]: GC.medicare.cellBorderColor,
      [gfk.medicaid ?? ""]: GC.medicaid.cellBorderColor,
      [gfk.mAndM ?? ""]: GC.mAndM.cellBorderColor,
    };
    return col.key in borders && borders[col.key]
      ? { borderLeft: `2px solid ${borders[col.key]}` }
      : {};
  };

  // ── Misc helpers ──────────────────────────────────────────────────────────

  const fmt = (d: Date) =>
    `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;

  const fromDate = auditDates?.inventory_start_date
    ? fmt(new Date(auditDates.inventory_start_date))
    : "—";
  const toDate = auditDates?.inventory_end_date
    ? fmt(new Date(auditDates.inventory_end_date))
    : "—";
  const wsFrom = auditDates?.wholesaler_start_date
    ? fmt(new Date(auditDates.wholesaler_start_date))
    : "—";
  const wsTo = auditDates?.wholesaler_end_date
    ? fmt(new Date(auditDates.wholesaler_end_date))
    : "—";

  const shortage = (v: number) =>
    v === 0 ? (
      <span className="text-slate-400">—</span>
    ) : (
      <span
        className={`font-semibold tabular-nums ${v < 0 ? "text-red-600" : "text-emerald-600"}`}
      >
        {v.toLocaleString()}
      </span>
    );

  const cellVal = (col: ColDef, row: InventoryRow) => {
    const v = row[col.key] as number;
    if (col.isShortage) return shortage(v);
    if (col.key === "cost")
      return (
        <span className="tabular-nums text-slate-700">${v.toFixed(2)}</span>
      );
    if (col.key === "amount")
      return (
        <span className="tabular-nums font-semibold text-slate-800">
          ${v.toFixed(2)}
        </span>
      );
    if (col.group === "coupon")
      return (
        <span className="tabular-nums font-semibold text-purple-700">
          {v.toLocaleString()}
        </span>
      );
    if (col.group === "others")
      return (
        <span className="tabular-nums font-semibold text-slate-700">
          {v.toLocaleString()}
        </span>
      );
    if (col.group === "medicaid")
      return (
        <span className="tabular-nums font-semibold text-purple-700">
          {v.toLocaleString()}
        </span>
      );
    if (col.group === "mAndM")
      return (
        <span className="tabular-nums font-semibold text-amber-700">
          {v.toLocaleString()}
        </span>
      );
    return (
      <span className="tabular-nums text-slate-700">{v.toLocaleString()}</span>
    );
  };

  // Brand pill: Y → "B" (cyan, brand), N → "G" (amber, generic)
  const brandPill = (brand: string | null | undefined) => {
    if (!brand) return null;
    const raw = String(brand).trim().toUpperCase();
    // treat "Y", "B", or "BRAND" as brand; everything else as generic
    const isBrand = raw === "Y" || raw === "B" || raw === "BRAND";
    const label = isBrand ? "B" : "G";
    return (
      <span
        className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase"
        style={{
          background: isBrand ? "#cffafe" : "#fef3c7",
          color: isBrand ? "#155e75" : "#92400e",
          border: `1px solid ${isBrand ? "#67e8f9" : "#fcd34d"}`,
        }}
        title={isBrand ? "Brand" : "Generic"}
      >
        {label}
      </span>
    );
  };

  const toggleRow = (id: number) =>
    setSelectedRows((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );
  const toggleAll = () =>
    setSelectedRows(
      selectedRows.length === paginatedData.length
        ? []
        : paginatedData.map((r) => r.id),
    );

  const confirmLeave = () => {
    isLeavingConfirmed.current = true;
    setShowLeaveDialog(false);
    router.push(pendingHref ?? "/ReportsPage");
  };

  // ADD AFTER:
  const handleOpenBilledSidebar = async (
    row: InventoryRow,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setBilledDrug(row);
    setOpenBilledSidebar(true);
    setRxLines([]);
    setRxLoading(true);
    setRxTab("current");
    setRxFilters([]);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/${auditId}/inventory-detail/${encodeURIComponent(row.ndc)}`,
      );
      const json = await res.json();
      console.log("🔍 Drug detail API response:", json); // ← check this in browser console

      const lines = Array.isArray(json)
        ? json
        : Array.isArray(json.lines)
          ? json.lines
          : Array.isArray(json.data)
            ? json.data
            : Array.isArray(json.records)
              ? json.records
              : [];

      // Normalize field names — backend might use different casing
      const normalized: RxLine[] = lines.map((r: any) => ({
        rx_number: r.rx_number ?? r.rxNumber ?? r.rxno ?? r.RXNO ?? "",
        date_filled: r.date_filled ?? r.dateFilled ?? r.datef ?? r.DATEF ?? "",
        quantity: Number(r.quantity ?? r.qty ?? r.quant ?? r.QUANT ?? 0),
        type: r.type ?? r.source ?? "PRIMERX",
        pri_bin:
          r.pri_bin ?? r.primary_bin ?? r.prinsbinno ?? r.PRINSBINNO ?? "",
        pri_pcn: r.pri_pcn ?? r.primary_pcn ?? r.priinspcn ?? r.PRIINSPCN ?? "",
        pri_group:
          r.pri_group ??
          r.primary_group ??
          r.priinspatgroup ??
          r.PRIINSPATGROUP ??
          "",
        pri_insurance:
          r.pri_insurance ?? r.primary_insurance ?? r.pbm_name ?? r.pbm ?? "",
        pri_paid: Number(
          r.pri_paid ?? r.primary_paid ?? r.prinspaid ?? r.PRINSPAID ?? 0,
        ),
        sec_bin:
          r.sec_bin ?? r.secondary_bin ?? r.secinsbinno ?? r.SECINSBINNO ?? "",
        sec_pcn: r.sec_pcn ?? r.secondary_pcn ?? "",
        sec_group: r.sec_group ?? r.secondary_group ?? "",
        sec_insurance: r.sec_insurance ?? r.secondary_insurance ?? "",
        sec_paid: Number(
          r.sec_paid ?? r.secondary_paid ?? r.secinspaid ?? r.SECINSPAID ?? 0,
        ),
        is_outside_date_range:
          r.is_outside_date_range ?? r.outside_date_range ?? false,
      }));

      console.log("✅ Normalized lines:", normalized);
      setRxLines(normalized);
    } catch (err) {
      console.error("❌ Failed to fetch drug detail:", err);
      setRxLines([]);
    } finally {
      setRxLoading(false);
    }
  };

  const handleOpenOrderedSidebar = async (
    row: InventoryRow,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setOrderedDrug(row);
    setOpenOrderedSidebar(true);
    setOrderLines([]);
    setOrderLoading(true);
    setOrderTab("current");
    setOrderFilters([]);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/${auditId}/wholesaler-detail/${encodeURIComponent(row.ndc)}`,
      );
      const json = await res.json();
      const lines = Array.isArray(json) ? json : [];
      const normalized: OrderLine[] = lines.map((r: any) => ({
        type: r.type ?? r.wholesaler_name ?? "MCKESSON",
        date_ordered: r.date_ordered ?? r.date ?? "",
        quantity: Number(r.quantity ?? 0),
        is_outside_date_range: false,
      }));
      setOrderLines(normalized);
    } catch (err) {
      console.error("Failed to fetch wholesaler detail:", err);
      setOrderLines([]);
    } finally {
      setOrderLoading(false);
    }
  };

  const handleOpenShortageSidebar = (
    row: InventoryRow,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setShortageDrug(row);
    setOpenShortageSidebar(true);
  };

  const handleExport = () => {
    const rows = exportScope === "visible" ? paginatedData : filteredData;
    if (!rows.length) return;
    const h = Object.keys(rows[0]);
    const csv = [
      h.join(","),
      ...rows.map((r: any) =>
        h.map((k) => JSON.stringify(r[k] ?? "")).join(","),
      ),
    ].join("\n");
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })),
      download: "inventory-report.csv",
    });
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setOpenExportModal(false);
  };

  useEffect(() => {
    if (openExportModal || showLeaveDialog || openDrugSidebar)
      setSidebarCollapsed(true);
  }, [openExportModal, showLeaveDialog, openDrugSidebar]);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node))
        setOpenFilter(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (
        tagsDropdownRef.current &&
        !tagsDropdownRef.current.contains(e.target as Node)
      ) {
        setOpenTagsDropdown(false);
        setTagMenuOpen(null);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const rowTagMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (
        rowTagMenuRef.current &&
        !rowTagMenuRef.current.contains(e.target as Node)
      ) {
        setRowTagMenuOpen(null);
        setRowTagMenuPos(null);
      }
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
          position: "sticky",
          top: 20,
          zIndex: 1,
          background: bg,
          color,
          height: 20,
          padding: "0 8px",
          fontSize: 10,
          fontWeight: 600,
          textAlign: "center",
          whiteSpace: "nowrap",
          borderLeft: isFirst ? `2px solid ${gc.parentBorder}` : undefined,
        }}
        onClick={(e) => handleSort(c.key, e)}
      >
        <div className="flex items-center justify-center gap-0.5">
          {c.label}
          <SortIcon active={sortDir(c.key)} />
        </div>
      </th>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <ProtectedRoute>
      <div
        className="relative w-full bg-white"
        style={{ zoom: 0.8, height: "125vh" }}
      >
        <div className="relative h-full w-full flex overflow-hidden">
          {/* Sidebar */}
          <div
            className={`flex-shrink-0 transition-all duration-300 z-[130] ${
              openExportModal ||
              loading ||
              showLeaveDialog ||
              openDrugSidebar ||
              openBilledSidebar ||
              openOrderedSidebar ||
              openShortageSidebar ||
              !!tagModal
                ? "w-0 opacity-0 pointer-events-none"
                : sidebarCollapsed
                  ? "w-[72px]"
                  : "w-[260px]"
            }`}
          >
            {!openExportModal &&
              !loading &&
              !showLeaveDialog &&
              !openDrugSidebar &&
              !openBilledSidebar &&
              !openNotesSidebar && (
                <AppSidebar
                  sidebarOpen={!sidebarCollapsed}
                  setSidebarOpen={() => setSidebarCollapsed((v) => !v)}
                  activePanel={activePanel}
                  setActivePanel={setActivePanel}
                />
              )}
          </div>

          {/* Loading overlay */}
          {loading && (
            <div
              className={`absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm transition-opacity duration-400 ${loadingDone ? "opacity-0 pointer-events-none" : "opacity-100"}`}
            >
              <div className="flex flex-col items-center gap-6 w-72">
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm">
                    <svg
                      className="h-8 w-8 text-emerald-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
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
                    <span className="text-xs text-slate-400">
                      Loading report
                    </span>
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
                  <h1 className="text-2xl font-bold text-slate-800 tracking-wide uppercase">
                    Inventory Report
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Comprehensive pharmaceutical inventory analytics
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="bg-red-50 px-3 py-1.5 rounded-lg border border-red-200">
                    <p className="text-[10px] font-bold text-red-700 uppercase tracking-wider">
                      Inventory Dates
                    </p>
                    <p className="text-xs font-semibold text-slate-800">
                      {fromDate} – {toDate}
                    </p>
                  </div>
                  <div className="bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                      Wholesaler Dates
                    </p>
                    <p className="text-xs font-semibold text-slate-800">
                      {wsFrom} – {wsTo}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5"
                    onClick={() => {
                      setSidebarCollapsed(true);
                      setOpenExportModal(true);
                    }}
                  >
                    <Download className="h-3.5 w-3.5" /> Export
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <RotateCw className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* ── Filter Bar ── z-[200] so dropdown clears table headers ── */}
            <div
              className="bg-white border-b border-slate-200 flex-shrink-0"
              style={{ position: "relative", zIndex: 200 }}
            >
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
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => {
                        setSearchQuery("");
                        setDrugNameFilter(null);
                      }}
                    >
                      <X className="h-3.5 w-3.5 text-slate-400" />
                    </button>
                  )}
                </div>

                {/* Columns filter */}
                <div className="relative" ref={filterRef}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1.5 text-xs border-slate-300"
                    onClick={() => setOpenFilter(!openFilter)}
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" /> Columns{" "}
                    <ChevronDown className="h-3 w-3" />
                  </Button>

                  {openFilter && (
                    <div
                      className="absolute left-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl"
                      style={{ width: 860, maxWidth: "95vw", zIndex: 9999 }}
                    >
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
                        <span className="text-xs font-bold tracking-wide text-slate-600 uppercase">
                          Column Visibility
                        </span>
                        <button onClick={() => setOpenFilter(false)}>
                          <X className="h-4 w-4 text-slate-400" />
                        </button>
                      </div>

                      <div className="grid grid-cols-7 divide-x divide-slate-100 max-h-[70vh] overflow-y-auto">
                        {/* Base */}
                        <div className="p-3">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Base
                          </p>
                          {(
                            [
                              ["Rank", showRank, setShowRank],
                              ["NDC", showNdc, setShowNdc],
                              ["Drug Name", showDrug, setShowDrug],
                              ["Pkg Size", showPkg, setShowPkg],
                              ["Unit", showUnit, setShowUnit],
                              ["Total Ordered", showOrdered, setShowOrdered],
                            ] as [
                              string,
                              boolean,
                              React.Dispatch<React.SetStateAction<boolean>>,
                            ][]
                          ).map(([label, val, set]) => (
                            <label
                              key={label}
                              className="flex items-center gap-1.5 py-0.5 text-xs cursor-pointer"
                            >
                              <Checkbox
                                checked={val}
                                onCheckedChange={() => set((v) => !v)}
                                className="h-3 w-3"
                              />
                              {label}
                            </label>
                          ))}
                          <div className="border-t border-slate-100 mt-2 pt-2">
                            {ALL_COLS.filter(
                              (c) => c.group === "base-scroll",
                            ).map((c) => (
                              <label
                                key={c.key}
                                className="flex items-center gap-1.5 py-0.5 text-xs cursor-pointer"
                              >
                                <Checkbox
                                  checked={!!vis[c.key]}
                                  onCheckedChange={() => toggleVis(c.key)}
                                  className="h-3 w-3"
                                />
                                {c.label}
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Commercial */}
                        <div className="p-3">
                          <p
                            className="text-[10px] font-bold uppercase tracking-widest mb-2"
                            style={{ color: GC.commercial.parentColor }}
                          >
                            Commercial
                          </p>
                          {ALL_COLS.filter((c) => c.group === "commercial").map(
                            (c) => (
                              <label
                                key={c.key}
                                className="flex items-center gap-1.5 py-0.5 text-xs cursor-pointer"
                              >
                                <Checkbox
                                  checked={!!vis[c.key]}
                                  onCheckedChange={() => toggleVis(c.key)}
                                  className="h-3 w-3"
                                />
                                {c.label}
                              </label>
                            ),
                          )}
                        </div>

                        {/* Coupon */}
                        <div className="p-3">
                          <p
                            className="text-[10px] font-bold uppercase tracking-widest mb-2"
                            style={{ color: GC.coupon.parentColor }}
                          >
                            Coupon
                          </p>
                          {ALL_COLS.filter((c) => c.group === "coupon").map(
                            (c) => (
                              <label
                                key={c.key}
                                className="flex items-center gap-1.5 py-0.5 text-xs cursor-pointer"
                              >
                                <Checkbox
                                  checked={!!vis[c.key]}
                                  onCheckedChange={() => toggleVis(c.key)}
                                  className="h-3 w-3"
                                />
                                {c.label}
                              </label>
                            ),
                          )}
                        </div>

                        {/* Others */}
                        <div className="p-3">
                          <p
                            className="text-[10px] font-bold uppercase tracking-widest mb-2"
                            style={{ color: GC.others.parentColor }}
                          >
                            Others
                          </p>
                          {ALL_COLS.filter((c) => c.group === "others").map(
                            (c) => (
                              <label
                                key={c.key}
                                className="flex items-center gap-1.5 py-0.5 text-xs cursor-pointer"
                              >
                                <Checkbox
                                  checked={!!vis[c.key]}
                                  onCheckedChange={() => toggleVis(c.key)}
                                  className="h-3 w-3"
                                />
                                {c.label}
                              </label>
                            ),
                          )}
                        </div>

                        {/* Medicare */}
                        <div className="p-3">
                          <p
                            className="text-[10px] font-bold uppercase tracking-widest mb-2"
                            style={{ color: GC.medicare.parentColor }}
                          >
                            Medicare
                          </p>
                          {ALL_COLS.filter((c) => c.group === "medicare").map(
                            (c) => (
                              <label
                                key={c.key}
                                className="flex items-center gap-1.5 py-0.5 text-xs cursor-pointer"
                              >
                                <Checkbox
                                  checked={!!vis[c.key]}
                                  onCheckedChange={() => toggleVis(c.key)}
                                  className="h-3 w-3"
                                />
                                {c.label}
                              </label>
                            ),
                          )}
                        </div>

                        {/* Medicaid */}
                        <div className="p-3">
                          <p
                            className="text-[10px] font-bold uppercase tracking-widest mb-2"
                            style={{ color: GC.medicaid.parentColor }}
                          >
                            Medicaid
                          </p>
                          {ALL_COLS.filter((c) => c.group === "medicaid").map(
                            (c) => (
                              <label
                                key={c.key}
                                className="flex items-center gap-1.5 py-0.5 text-xs cursor-pointer"
                              >
                                <Checkbox
                                  checked={!!vis[c.key]}
                                  onCheckedChange={() => toggleVis(c.key)}
                                  className="h-3 w-3"
                                />
                                {c.label}
                              </label>
                            ),
                          )}
                        </div>

                        {/* Medicare + Medicaid */}
                        <div className="p-3">
                          <p
                            className="text-[10px] font-bold uppercase tracking-widest mb-2"
                            style={{ color: GC.mAndM.parentColor }}
                          >
                            Medicare + Medicaid
                          </p>
                          {ALL_COLS.filter((c) => c.group === "mAndM").map(
                            (c) => (
                              <label
                                key={c.key}
                                className="flex items-center gap-1.5 py-0.5 text-xs cursor-pointer"
                              >
                                <Checkbox
                                  checked={!!vis[c.key]}
                                  onCheckedChange={() => toggleVis(c.key)}
                                  className="h-3 w-3"
                                />
                                {c.label}
                              </label>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* QTY */}
                <DropdownMenu
                  open={openQtyDropdown}
                  onOpenChange={setOpenQtyDropdown}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 gap-1.5 text-xs border-slate-300"
                    >
                      QTY: {qtyType ?? "—"} <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-36">
                    <DropdownMenuCheckboxItem
                      checked={qtyType === "UNIT"}
                      onCheckedChange={() => {
                        setQtyType("UNIT");
                        setShowUnit(false);
                        setShowPkg(true);
                      }}
                    >
                      UNIT
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={qtyType === "PKG SIZE"}
                      onCheckedChange={() => {
                        setQtyType("PKG SIZE");
                        setShowUnit(false);
                        setShowPkg(true);
                      }}
                    >
                      PKG SIZE
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Tags filter */}
                <div className="relative" ref={tagsDropdownRef}>
                  <Button
                    variant="outline"
                    size="sm"
                    className={`h-8 gap-1.5 text-xs border-slate-300 ${activeTagFilters.length > 0 ? "border-emerald-400 text-emerald-700 bg-emerald-50" : ""}`}
                    onClick={() => {
                      setOpenTagsDropdown((v) => !v);
                      setTagMenuOpen(null);
                    }}
                  >
                    {/* Tag icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                      <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                    Tags
                    {activeTagFilters.length > 0 && (
                      <span className="ml-0.5 bg-emerald-600 text-white rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none">
                        {activeTagFilters.length}
                      </span>
                    )}
                    <ChevronDown className="h-3 w-3" />
                  </Button>

                  {openTagsDropdown && (
                    <div
                      className="absolute left-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-2xl"
                      style={{ width: 300, zIndex: 9999 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Tags
                        </span>
                        <div className="flex items-center gap-2">
                          {activeTagFilters.length > 0 && (
                            <button
                              onClick={() => setActiveTagFilters([])}
                              className="text-[11px] font-semibold text-slate-400 hover:text-red-500"
                            >
                              Clear
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setTagModalName("");
                              setTagModalColor("#22c55e");
                              setTagModal({ mode: "create" });
                              setOpenTagsDropdown(false);
                              setSidebarCollapsed(true);
                            }}
                            className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded-lg transition-colors"
                          >
                            <span className="text-base leading-none">+</span>{" "}
                            Create Tag
                          </button>
                          <button
                            onClick={() => setOpenTagsDropdown(false)}
                            className="h-5 w-5 rounded flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Tag list */}
                      <div className="py-2 max-h-[400px] overflow-y-auto">
                        {tags.length === 0 ? (
                          <div className="px-4 py-6 text-center text-xs text-slate-400">
                            No tags yet. Create one!
                          </div>
                        ) : (
                          tags.map((tag) => {
                            const count = Object.values(rowTags).filter((ids) =>
                              ids.includes(tag.id),
                            ).length;
                            const isFilterActive = activeTagFilters.includes(
                              tag.id,
                            );
                            return (
                              <div
                                key={tag.id}
                                className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 group relative"
                              >
                                {/* Checkbox */}
                                <input
                                  type="checkbox"
                                  checked={isFilterActive}
                                  onChange={() =>
                                    setActiveTagFilters((prev) =>
                                      prev.includes(tag.id)
                                        ? prev.filter((x) => x !== tag.id)
                                        : [...prev, tag.id],
                                    )
                                  }
                                  className="h-4 w-4 rounded border-slate-300 shrink-0 cursor-pointer"
                                  style={{ accentColor: tag.color }}
                                />
                                {/* Tag pill */}
                                <span
                                  className="flex-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold"
                                  style={{
                                    background: tag.color + "22",
                                    color: tag.color,
                                    border: `1px solid ${tag.color}55`,
                                  }}
                                >
                                  {tag.name}
                                  <span
                                    className="ml-auto inline-flex items-center justify-center h-4 w-4 rounded-full text-[10px] font-bold"
                                    style={{
                                      background: tag.color,
                                      color: "#fff",
                                    }}
                                  >
                                    {count}
                                  </span>
                                </span>
                                {/* 3-dot menu */}
                                <div className="relative">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setTagMenuOpen((prev) =>
                                        prev === tag.id ? null : tag.id,
                                      );
                                    }}
                                    className="h-6 w-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="14"
                                      height="14"
                                      viewBox="0 0 24 24"
                                      fill="currentColor"
                                    >
                                      <circle cx="12" cy="5" r="1.5" />
                                      <circle cx="12" cy="12" r="1.5" />
                                      <circle cx="12" cy="19" r="1.5" />
                                    </svg>
                                  </button>
                                  {tagMenuOpen === tag.id && (
                                    <div
                                      className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-[9999]"
                                      style={{ width: 130 }}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <button
                                        onClick={() => {
                                          setTagModalName(tag.name);
                                          setTagModalColor(tag.color);
                                          setTagModal({ mode: "edit", tag });
                                          setTagMenuOpen(null);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-t-xl transition-colors"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="13"
                                          height="13"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                        Edit
                                      </button>
                                      <div className="border-t border-slate-100" />
                                      <button
                                        onClick={() => {
                                          setTags((prev) =>
                                            prev.filter((t) => t.id !== tag.id),
                                          );
                                          setActiveTagFilters((prev) =>
                                            prev.filter((x) => x !== tag.id),
                                          );
                                          setRowTags((prev) => {
                                            const next = { ...prev };
                                            Object.keys(next).forEach((k) => {
                                              next[Number(k)] = next[
                                                Number(k)
                                              ].filter((x) => x !== tag.id);
                                            });
                                            return next;
                                          });
                                          setTagMenuOpen(null);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-b-xl transition-colors"
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="13"
                                          height="13"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        >
                                          <polyline points="3 6 5 6 21 6" />
                                          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                                          <path d="M10 11v6" />
                                          <path d="M14 11v6" />
                                          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                                        </svg>
                                        Delete
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Input
                  type="number"
                  placeholder="Max Amount"
                  value={amountValue}
                  onChange={(e) => setAmountValue(Number(e.target.value) || "")}
                  className="w-[110px] h-8 text-xs border-slate-300"
                />

                <Select
                  value={String(rowsPerPage)}
                  onValueChange={(v) => setRowsPerPage(Number(v))}
                >
                  <SelectTrigger className="w-[100px] h-8 text-xs border-slate-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {rowOptions.map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n === totalRows ? `All (${n})` : n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ══════════════════════════════════════════════════
                TABLE
            ══════════════════════════════════════════════════ */}

            <style jsx global>{`
              .isc::-webkit-scrollbar {
                height: 4px;
                width: 4px;
              }
              .isc::-webkit-scrollbar-track {
                background: transparent;
              }
              .isc::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 4px;
              }

              .srow td {
                transition: background 60ms ease;
              }
              .srow:hover td {
                background: #f0fdf8 !important;
              }
              .srow.sel td {
                background: #eff6ff !important;
              }
              .srow.even td {
                background: #f8fafc;
              }
              .srow.even:hover td {
                background: #f0fdf8 !important;
              }

              th.sc,
              td.sc {
                box-shadow: inset -1px 0 0 0 #e2e8f0;
              }
              th.sl,
              td.sl {
                box-shadow:
                  inset -1px 0 0 0 #e2e8f0,
                  4px 0 8px -2px rgba(0, 0, 0, 0.1);
              }

              tbody td {
                border-bottom: 1px solid #e2e8f0;
                border-right: 1px solid #f1f5f9;
              }
              tbody td:last-child {
                border-right: none;
              }
              thead th {
                border-right: 1px solid #e2e8f0;
              }
              thead th:last-child {
                border-right: none;
              }

              thead tr:nth-child(1) th {
                top: 0;
              }
              thead tr:nth-child(2) th {
                top: 20px;
                border-bottom: 2px solid #cbd5e1;
              }
              thead tr:nth-child(1) th {
                border-bottom: none;
              }
            `}</style>

            <div className="flex-1 overflow-hidden flex flex-col">
              <div ref={bodyScrollRef} className="flex-1 overflow-auto isc">
                <table
                  style={{
                    borderCollapse: "separate",
                    borderSpacing: 0,
                    minWidth: "max-content",
                    width: "100%",
                  }}
                >
                  {/* colgroup */}
                  <colgroup>
                    <col style={{ width: 44, minWidth: 44 }} />
                    {showRank && <col style={{ width: 72, minWidth: 72 }} />}
                    {showNdc && <col style={{ width: 140, minWidth: 140 }} />}
                    {showDrug && <col style={{ width: 240, minWidth: 240 }} />}
                    {showPkg && <col style={{ width: 100, minWidth: 100 }} />}
                    {showUnit && <col style={{ width: 100, minWidth: 100 }} />}
                    {showOrdered && (
                      <col style={{ width: 140, minWidth: 140 }} />
                    )}
                    {visCols.map((c) => (
                      <col key={c.key} style={{ width: c.w, minWidth: c.w }} />
                    ))}
                  </colgroup>

                  {/* ══ THEAD ══ */}
                  <thead>
                    {/* ROW 1 */}
                    <tr style={{ background: "#f8fafc" }}>
                      {/* Sticky base cols — all rowspan=2 */}
                      <th
                        rowSpan={2}
                        className="sticky z-[110] sc"
                        style={{
                          left: L_CHECKBOX,
                          width: 44,
                          background: "#f8fafc",
                          padding: "0 12px",
                          textAlign: "center",
                        }}
                      >
                        <Checkbox
                          checked={
                            selectedRows.length === paginatedData.length &&
                            paginatedData.length > 0
                          }
                          onCheckedChange={toggleAll}
                          className="h-3.5 w-3.5"
                        />
                      </th>

                      {showRank && (
                        <th
                          rowSpan={2}
                          className="sticky z-[110] sc"
                          style={{
                            left: L_RANK,
                            width: 72,
                            background: "#f8fafc",
                            cursor: "pointer",
                          }}
                          onClick={(e) => handleSort("rank", e)}
                        >
                          <div className="flex items-center justify-center gap-1 px-2 h-full hover:bg-emerald-50/60">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                              Rank
                            </span>
                            <SortIcon active={sortDir("rank")} />
                          </div>
                        </th>
                      )}

                      {showNdc && (
                        <th
                          rowSpan={2}
                          className="sticky z-[110] sc"
                          style={{
                            left: L_NDC,
                            width: 140,
                            background: "#f8fafc",
                            cursor: "pointer",
                          }}
                          onClick={(e) => {
                            handleSort("ndc", e);
                          }}
                        >
                          <div className="flex items-center justify-center gap-1 px-2 h-full hover:bg-emerald-50/60">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                              NDC
                            </span>
                            <SortIcon active={sortDir("ndc")} />
                          </div>
                        </th>
                      )}

                      {showDrug && (
                        <th
                          rowSpan={2}
                          className="sticky z-[110] sc"
                          style={{
                            left: L_DRUG,
                            width: 240,
                            background: "#f8fafc",
                            textAlign: "left",
                            cursor: "pointer",
                          }}
                          onClick={(e) => handleSort("drugName", e)}
                        >
                          <div className="flex items-center gap-1 px-3 h-full hover:bg-emerald-50/60">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                              Drug Name
                            </span>
                            <SortIcon active={sortDir("drugName")} />
                          </div>
                        </th>
                      )}

                      {showPkg && (
                        <th
                          rowSpan={2}
                          className="sticky z-[110] sc"
                          style={{
                            left: L_PKG,
                            width: 100,
                            background: "#f8fafc",
                            cursor: "pointer",
                          }}
                          onClick={(e) => handleSort("pkgSize", e)}
                        >
                          <div className="flex items-center justify-center gap-1 px-2 h-full hover:bg-emerald-50/60">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                              PKG
                            </span>
                            <SortIcon active={sortDir("pkgSize")} />
                          </div>
                        </th>
                      )}

                      {showUnit && (
                        <th
                          rowSpan={2}
                          className="sticky z-[110] sc"
                          style={{
                            left: L_UNIT,
                            width: 100,
                            background: "#f8fafc",
                            cursor: "pointer",
                          }}
                          onClick={(e) => handleSort("unit", e)}
                        >
                          <div className="flex items-center justify-center gap-1 px-2 h-full hover:bg-emerald-50/60">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                              Unit
                            </span>
                            <SortIcon active={sortDir("unit")} />
                          </div>
                        </th>
                      )}

                      {showOrdered && (
                        <th
                          rowSpan={2}
                          className="sticky z-[110] sl"
                          style={{
                            left: L_ORDERED,
                            width: 140,
                            background: "#f8fafc",
                            cursor: "pointer",
                          }}
                          onClick={(e) => handleSort("totalOrdered", e)}
                        >
                          <div className="flex items-center justify-center gap-1.5 px-2 h-full hover:bg-emerald-50/60">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                              Total Ordered
                            </span>
                            <SortIcon active={sortDir("totalOrdered")} />
                          </div>
                        </th>
                      )}

                      {/* Base scroll — rowspan 2 */}
                      {baseScrollCols.map((c) => (
                        <th
                          key={c.key}
                          rowSpan={2}
                          className="sticky z-50"
                          style={{ background: "#f8fafc", cursor: "pointer" }}
                          onClick={(e) => handleSort(c.key, e)}
                        >
                          <div className="flex items-center justify-center gap-1 px-3 h-full hover:bg-emerald-50/60 whitespace-nowrap">
                            {c.dot && (
                              <span
                                className={`h-1.5 w-1.5 rounded-full shrink-0 ${c.dot}`}
                              />
                            )}
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                              {c.label}
                            </span>
                            <SortIcon active={sortDir(c.key)} />
                          </div>
                        </th>
                      ))}

                      {/* Group parent headers — zIndex:1 stays behind sticky-left cols */}
                      {commercialCols.length > 0 && (
                        <th
                          colSpan={commercialCols.length}
                          className="text-center"
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            background: GC.commercial.parentBg,
                            color: GC.commercial.parentColor,
                            borderLeft: `2px solid ${GC.commercial.parentBorder}`,
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            height: 20,
                            padding: 0,
                          }}
                        >
                          Commercial
                        </th>
                      )}
                      {couponCols.length > 0 && (
                        <th
                          colSpan={couponCols.length}
                          className="text-center"
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            background: GC.coupon.parentBg,
                            color: GC.coupon.parentColor,
                            borderLeft: `2px solid ${GC.coupon.parentBorder}`,
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            height: 20,
                            padding: 0,
                          }}
                        >
                          Coupon
                        </th>
                      )}

                      {medicareCols.length > 0 && (
                        <th
                          colSpan={medicareCols.length}
                          className="text-center"
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            background: GC.medicare.parentBg,
                            color: GC.medicare.parentColor,
                            borderLeft: `2px solid ${GC.medicare.parentBorder}`,
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            height: 20,
                            padding: 0,
                          }}
                        >
                          Medicare
                        </th>
                      )}
                      {medicaidCols.length > 0 && (
                        <th
                          colSpan={medicaidCols.length}
                          className="text-center"
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            background: GC.medicaid.parentBg,
                            color: GC.medicaid.parentColor,
                            borderLeft: `2px solid ${GC.medicaid.parentBorder}`,
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            height: 20,
                            padding: 0,
                          }}
                        >
                          Medicaid
                        </th>
                      )}
                      {mAndMCols.length > 0 && (
                        <th
                          colSpan={mAndMCols.length}
                          className="text-center"
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            background: GC.mAndM.parentBg,
                            color: GC.mAndM.parentColor,
                            borderLeft: `2px solid ${GC.mAndM.parentBorder}`,
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            height: 20,
                            padding: 0,
                          }}
                        >
                          Medicare + Medicaid
                        </th>
                      )}
                      {othersCols.length > 0 && (
                        <th
                          colSpan={othersCols.length}
                          className="text-center"
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 1,
                            background: GC.others.parentBg,
                            color: GC.others.parentColor,
                            borderLeft: `2px solid ${GC.others.parentBorder}`,
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            height: 20,
                            padding: 0,
                          }}
                        >
                          Others
                        </th>
                      )}
                    </tr>

                    {/* ROW 2: sub-labels */}
                    <tr style={{ background: "#f8fafc" }}>
                      {[
                        ...commercialCols,
                        ...couponCols,
                        ...medicareCols,
                        ...medicaidCols,
                        ...mAndMCols,
                        ...othersCols,
                      ].map(renderSubTh)}
                    </tr>
                  </thead>

                  {/* ══ TBODY ══ */}
                  <tbody>
                    {paginatedData.map((row, ri) => {
                      const isSel = selectedRows.includes(row.id);
                      const isEven = ri % 2 === 1;
                      const bg = isSel
                        ? "#eff6ff"
                        : isEven
                          ? "#f8fafc"
                          : "#ffffff";

                      return (
                        <tr
                          key={row.id}
                          className={`srow cursor-pointer ${isSel ? "sel" : ""} ${isEven ? "even" : ""}`}
                          style={{ height: 36, minHeight: 36 }}
                          onClick={() => {
                            setActiveDrug(row);
                            setOpenDrugSidebar(true);
                          }}
                          // style={{ minHeight: 36 }}
                          // onClick={() => { setActiveDrug(row); setOpenDrugSidebar(true); }}
                        >
                          <td
                            className="sticky z-20 sc"
                            style={{
                              left: L_CHECKBOX,
                              width: 44,
                              background: bg,
                              textAlign: "center",
                              padding: "0 12px",
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Checkbox
                              checked={isSel}
                              onCheckedChange={() => toggleRow(row.id)}
                              className="h-3.5 w-3.5"
                            />
                          </td>
                          {showRank && (
                            <td
                              className="sticky z-20 sc"
                              style={{
                                left: L_RANK,
                                width: 72,
                                background: bg,
                                textAlign: "center",
                                padding: "0 8px",
                              }}
                            >
                              <span className="text-xs text-slate-500 tabular-nums font-medium">
                                {row.rank}
                              </span>
                            </td>
                          )}
                          {showNdc && (
                            <td
                              className="sticky z-20 sc"
                              style={{
                                left: L_NDC,
                                width: 140,
                                background: bg,
                                textAlign: "center",
                                padding: "2px 8px",
                                verticalAlign: "middle",
                              }}
                            >
                              <div className="flex items-center gap-1">
                                <button
                                  title="Copy NDC"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigator.clipboard.writeText(row.ndc);
                                    const btn = e.currentTarget;
                                    btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
                                    setTimeout(() => {
                                      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
                                    }, 1200);
                                  }}
                                  className="p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 shrink-0"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="11"
                                    height="11"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <rect
                                      x="9"
                                      y="9"
                                      width="13"
                                      height="13"
                                      rx="2"
                                      ry="2"
                                    />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                  </svg>
                                </button>
                                <span
                                  className="text-[11px] font-mono text-slate-500 tracking-tight truncate flex-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDrug(row);
                                    setActiveSidebar("ndc");
                                    setOpenDrugSidebar(true);
                                  }}
                                >
                                  {row.ndc}
                                </span>
                                {/* 3-dot tag button */}
                                <button
                                  title="Tag options"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (rowTagMenuOpen === row.id) {
                                      setRowTagMenuOpen(null);
                                      setRowTagMenuPos(null);
                                      return;
                                    }
                                    const rect = (
                                      e.currentTarget as HTMLElement
                                    ).getBoundingClientRect();
                                    setRowTagMenuPos({
                                      x: rect.left,
                                      y: rect.bottom,
                                    });
                                    setRowTagMenuOpen(row.id);
                                  }}
                                  className="p-0.5 rounded text-slate-600 hover:text-slate-800 hover:bg-slate-100 shrink-0 ml-auto"
                                  onMouseDown={(e) => e.stopPropagation()}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="13"
                                    height="13"
                                    viewBox="0 0 24 24"
                                    fill="#334155"
                                  >
                                    <circle cx="12" cy="5" r="1.8" />
                                    <circle cx="12" cy="12" r="1.8" />
                                    <circle cx="12" cy="19" r="1.8" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          )}
                          {showDrug && (
                            <td
                              className="sticky z-20 sc"
                              style={{
                                left: L_DRUG,
                                width: 240,
                                background: bg,
                                textAlign: "left",
                                padding: "0 8px 0 12px",
                              }}
                            >
                              <div className="flex items-center gap-1">
                                {/* Tag pills in drug name cell */}
                                {(rowTags[row.id] ?? []).map((tid) => {
                                  const t = tags.find((x) => x.id === tid);
                                  if (!t) return null;
                                  return (
                                    <span
                                      key={tid}
                                      className="shrink-0 inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold whitespace-nowrap"
                                      style={{
                                        background: t.color + "22",
                                        color: t.color,
                                        border: `1px solid ${t.color}55`,
                                      }}
                                    >
                                      {t.name}
                                    </span>
                                  );
                                })}
                                {/* Brand pill — NEW: on the left, matching reference UI */}
                                {brandPill(row.brand)}
                                <div className="flex items-center gap-0.5 shrink-0">
                                  {/* Search by drug name */}
                                  <button
                                    title="Search by drug name"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDrugNameFilter((prev) =>
                                        prev === row.drugName
                                          ? null
                                          : row.drugName,
                                      );
                                      setSearchQuery(row.drugName);
                                    }}
                                    className="p-0.5 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="11"
                                      height="11"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2.5"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <circle cx="11" cy="11" r="8" />
                                      <line
                                        x1="21"
                                        y1="21"
                                        x2="16.65"
                                        y2="16.65"
                                      />
                                    </svg>
                                  </button>
                                  {/* Copy drug name */}
                                  <button
                                    title="Copy drug name"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigator.clipboard.writeText(
                                        row.drugName,
                                      );
                                      const btn = e.currentTarget;
                                      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
                                      setTimeout(() => {
                                        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
                                      }, 1200);
                                    }}
                                    className="p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="11"
                                      height="11"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <rect
                                        x="9"
                                        y="9"
                                        width="13"
                                        height="13"
                                        rx="2"
                                        ry="2"
                                      />
                                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                    </svg>
                                  </button>
                                  {/* Add note */}
                                  <button
                                    title="Add note"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setNotesDrug(row);
                                      setNoteText(notesMap[row.ndc] ?? "");
                                      setNotesSaved(false);
                                      setOpenNotesSidebar(true);
                                    }}
                                    className={`p-0.5 rounded hover:bg-amber-50 ${notesMap[row.ndc] ? "text-amber-500" : "text-slate-400 hover:text-amber-500"}`}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="11"
                                      height="11"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth="2"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    >
                                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                  </button>
                                </div>
                                <span
                                  className="text-xs font-semibold text-slate-800 truncate cursor-pointer hover:text-indigo-700"
                                  title={row.drugName}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveDrug(row);
                                    setActiveSidebar("drug-lookup");
                                    setExpandedLookupDrug(null);
                                    setOpenDrugSidebar(true);
                                    fetchDrugLookup(
                                      extractIngredient(row.drugName),
                                    );
                                  }}
                                >
                                  {row.drugName}
                                </span>
                              </div>
                            </td>
                          )}
                          {showPkg && (
                            <td
                              className="sticky z-20 sc"
                              style={{
                                left: L_PKG,
                                width: 100,
                                background: bg,
                                textAlign: "right",
                                padding: "0 10px",
                              }}
                            >
                              <span className="text-xs text-slate-600 tabular-nums">
                                {row.pkgSize}
                              </span>
                            </td>
                          )}
                          {showUnit && (
                            <td
                              className="sticky z-20 sc"
                              style={{
                                left: L_UNIT,
                                width: 100,
                                background: bg,
                                textAlign: "right",
                                padding: "0 10px",
                              }}
                            >
                              <span className="text-xs text-slate-600 tabular-nums">
                                {row.unit}
                              </span>
                            </td>
                          )}
                          {showOrdered && (
                            <td
                              className="sticky z-20 sl"
                              style={{
                                left: L_ORDERED,
                                width: 140,
                                background: bg,
                                textAlign: "right",
                                padding: "0 12px",
                              }}
                              onClick={(e) => handleOpenOrderedSidebar(row, e)}
                            >
                              <span className="text-xs font-bold text-slate-800 tabular-nums cursor-pointer">
                                {row.totalOrdered.toLocaleString()}
                              </span>
                            </td>
                          )}

                          {visCols.map((c) => (
                            <td
                              key={c.key}
                              style={{
                                textAlign: "right",
                                padding: "0 10px",
                                ...cellBorderStyle(c),
                              }}
                              onClick={
                                c.key === "totalBilled"
                                  ? (e) => handleOpenBilledSidebar(row, e)
                                  : c.key === "totalShortage"
                                    ? (e) => handleOpenShortageSidebar(row, e)
                                    : c.key === "highestShortage"
                                      ? (e) => handleOpenShortageSidebar(row, e)
                                      : undefined
                              }
                            >
                              <span
                                className={`text-xs ${c.key === "totalBilled" || c.key === "totalShortage" || c.key === "highestShortage" ? "cursor-pointer" : ""}`}
                              >
                                {cellVal(c, row)}
                              </span>
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
                  Showing{" "}
                  <b className="text-slate-700">
                    {filteredData.length === 0
                      ? 0
                      : (currentPage - 1) * effRPP + 1}
                  </b>
                  –
                  <b className="text-slate-700">
                    {Math.min(currentPage * effRPP, filteredData.length)}
                  </b>{" "}
                  of <b className="text-slate-700">{filteredData.length}</b>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="h-7 px-2.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    ← Prev
                  </button>
                  {(() => {
                    const pages: number[] = [];
                    const d = 2;
                    const lp = Math.max(2, currentPage - d);
                    const rp = Math.min(totalPages - 1, currentPage + d);
                    pages.push(1);
                    if (lp > 2) pages.push(-1);
                    for (let i = lp; i <= rp; i++) pages.push(i);
                    if (rp < totalPages - 1) pages.push(-2);
                    if (totalPages > 1) pages.push(totalPages);
                    return pages.map((p, i) =>
                      p < 0 ? (
                        <span
                          key={`e${i}`}
                          className="px-1 text-slate-400 text-xs"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p)}
                          className={`h-7 w-7 text-xs font-semibold rounded-lg ${currentPage === p ? "bg-emerald-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                        >
                          {p}
                        </button>
                      ),
                    );
                  })()}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="h-7 px-2.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>

            {/* Export Modal */}
            <Dialog open={openExportModal} onOpenChange={setOpenExportModal}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold">
                    Export Report
                  </DialogTitle>
                  <DialogDescription>Choose format and scope</DialogDescription>
                </DialogHeader>
                <div className="space-y-5 py-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Format</Label>
                    <RadioGroup
                      value={exportFormat}
                      onValueChange={(v) => setExportFormat(v as any)}
                    >
                      {["csv", "excel", "pdf"].map((f) => (
                        <div
                          key={f}
                          className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50"
                        >
                          <RadioGroupItem value={f} id={f} />
                          <Label
                            htmlFor={f}
                            className="cursor-pointer capitalize font-medium"
                          >
                            {f}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold">Scope</Label>
                    <RadioGroup
                      value={exportScope}
                      onValueChange={(v) => setExportScope(v as any)}
                    >
                      <div className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50">
                        <RadioGroupItem value="visible" id="vis" />
                        <Label
                          htmlFor="vis"
                          className="cursor-pointer font-medium"
                        >
                          Visible Rows
                        </Label>
                      </div>
                      <div className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50">
                        <RadioGroupItem value="all" id="all" />
                        <Label
                          htmlFor="all"
                          className="cursor-pointer font-medium"
                        >
                          All Data
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setOpenExportModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleExport}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Export
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Drug Sidebar */}
            {openDrugSidebar && activeSidebar === "ndc" && activeDrug && (
              <>
                <div
                  className="fixed inset-0 bg-black/30 z-[200]"
                  onClick={() => {
                    setOpenDrugSidebar(false);
                    setActiveSidebar(null);
                  }}
                />
                <div
                  className="fixed top-0 right-0 h-full z-[210] flex flex-col bg-white"
                  style={{
                    width: "35%",
                    maxWidth: "100vw",
                    boxShadow: "-4px 0 24px rgba(0,0,0,0.15)",
                  }}
                >
                  {/* Top Bar */}
                  <div className="flex items-center gap-2.5 px-5 py-3 border-b border-slate-100 flex-shrink-0">
                    <button
                      onClick={() => {
                        setOpenDrugSidebar(false);
                        setActiveSidebar(null);
                      }}
                      className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                      NDC Lookup
                    </span>
                  </div>

                  {/* Info Bar */}
                  <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex-shrink-0">
                    <div className="flex items-start gap-8 flex-wrap">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          NDC Number
                        </p>
                        <p className="text-[14px] font-mono font-bold text-slate-900 tabular-nums">
                          {activeDrug.ndc}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Drug Name
                        </p>
                        <p className="text-[14px] font-bold text-slate-900 truncate">
                          {activeDrug.drugName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-auto px-5 py-5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                      Package Size Quantity
                    </p>
                    <table
                      style={{ borderCollapse: "collapse", width: "100%" }}
                    >
                      <thead>
                        <tr
                          style={{
                            background: "#f8fafc",
                            borderBottom: "2px solid #e2e8f0",
                          }}
                        >
                          <th
                            style={{
                              padding: "8px 12px",
                              textAlign: "left",
                              fontSize: 10,
                              fontWeight: 700,
                              color: "#64748b",
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                            }}
                          >
                            Source
                          </th>
                          <th
                            style={{
                              padding: "8px 12px",
                              textAlign: "right",
                              fontSize: 10,
                              fontWeight: 700,
                              color: "#64748b",
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                            }}
                          >
                            Package Size Qty
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { label: "Medispan", dot: "#94a3b8", val: null },
                          {
                            label: "FDB",
                            dot: "#f59e0b",
                            val:
                              activeDrug.pkgSize > 0
                                ? activeDrug.pkgSize.toLocaleString()
                                : null,
                          },
                          { label: "FDA", dot: "#10b981", val: null },
                        ].map(({ label, dot, val }) => (
                          <tr
                            key={label}
                            style={{ borderBottom: "1px solid #f1f5f9" }}
                            className="hover:bg-slate-50/60 transition-colors"
                          >
                            <td style={{ padding: "10px 12px", fontSize: 12 }}>
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <span
                                  style={{
                                    height: 8,
                                    width: 8,
                                    borderRadius: "50%",
                                    background: dot,
                                    flexShrink: 0,
                                  }}
                                />
                                <span
                                  style={{ fontWeight: 600, color: "#1e293b" }}
                                >
                                  {label}
                                </span>
                              </span>
                            </td>
                            <td
                              style={{
                                padding: "10px 12px",
                                fontSize: 12,
                                fontWeight: 700,
                                color: val ? "#1e293b" : "#94a3b8",
                                textAlign: "right",
                              }}
                            >
                              {val ?? "N/A"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Drug Sidebar — Drug Name / Wholesaler Detail */}
            {openDrugSidebar && activeSidebar === "drug" && activeDrug && (
              <>
                <div
                  className="fixed inset-0 bg-black/30 z-[200]"
                  onClick={() => {
                    setOpenDrugSidebar(false);
                    setActiveSidebar(null);
                    setDrugDetail(null);
                    setOutsideRange(false);
                    setIncludeBilled(false);
                  }}
                />
                <div
                  className="fixed top-0 right-0 h-full z-[210] flex flex-col bg-white"
                  style={{
                    width: "45%",
                    maxWidth: "100vw",
                    boxShadow: "-4px 0 24px rgba(0,0,0,0.15)",
                  }}
                >
                  <div className="flex items-center gap-2.5 px-5 py-3 border-b border-slate-100 flex-shrink-0">
                    <button
                      onClick={() => {
                        setOpenDrugSidebar(true);
                        setActiveSidebar("drug-lookup");
                      }}
                      className="cursor-pointer absolute top-3 left-3 h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <MoveLeftIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="pt-3">
                    <CommunityLinkPageCopy
                      ndcNumber={activeDrug.ndc}
                      drugName={activeDrug.drugName}
                    />
                  </div>
                </div>
              </>
            )}

            {/* ── Drug Lookup Sidebar (UGO-style) ── */}
            {openDrugSidebar &&
              activeSidebar === "drug-lookup" &&
              activeDrug && (
                <>
                  <div
                    className="fixed inset-0 bg-black/30 z-[200]"
                    onClick={() => {
                      setOpenDrugSidebar(false);
                      setActiveSidebar(null);
                      setDrugLookup(null);
                      setExpandedLookupDrug(null);
                    }}
                  />
                  <div
                    className="fixed top-0 right-0 h-full z-[210] flex flex-col bg-slate-50"
                    style={{
                      width: "55%",
                      maxWidth: "100vw",
                      boxShadow: "-4px 0 24px rgba(0,0,0,0.15)",
                    }}
                  >
                    {/* Top Bar */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-white flex-shrink-0">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => {
                            setOpenDrugSidebar(false);
                            setActiveSidebar(null);
                            setDrugLookup(null);
                            setExpandedLookupDrug(null);
                          }}
                          className="cursor-pointer h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shrink-0" />
                        <span className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                          Drug Lookup
                        </span>
                        <span className="text-xs text-slate-400 ml-1">
                          ·{" "}
                          {drugLookup?.ingredient ??
                            extractIngredient(activeDrug.drugName)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Clicked from
                        </span>
                        <span className="text-[11px] font-semibold text-slate-700 truncate max-w-[220px]">
                          {activeDrug.drugName}
                        </span>
                      </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="px-5 py-4 bg-white border-b border-slate-200 flex-shrink-0">
                      <div className="grid grid-cols-5 gap-2.5">
                        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/60 border border-indigo-200/60 rounded-xl p-3">
                          <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest mb-1">
                            Ingredient
                          </p>
                          <p className="text-[14px] font-extrabold text-slate-900 truncate">
                            {drugLookup?.ingredient ??
                              extractIngredient(activeDrug.drugName)}
                          </p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-3">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                            Variants
                          </p>
                          <p className="text-[15px] font-extrabold text-slate-900 tabular-nums">
                            {drugLookup?.drugs?.length ?? 0}
                          </p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-3">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                            Total Rx
                          </p>
                          <p className="text-[15px] font-extrabold text-cyan-700 tabular-nums">
                            {drugLookupAgg
                              ? Number(drugLookupAgg.totalRxs).toLocaleString()
                              : "—"}
                          </p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-3">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                            Total Ins Paid
                          </p>
                          <p className="text-[15px] font-extrabold text-emerald-700 tabular-nums">
                            {drugLookupAgg
                              ? `$${Number(
                                  drugLookupAgg.totalInsPaid,
                                ).toLocaleString("en-US", {
                                  minimumFractionDigits: 0,
                                  maximumFractionDigits: 0,
                                })}`
                              : "—"}
                          </p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-3">
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                            Avg / Unit
                          </p>
                          <p className="text-[15px] font-extrabold text-slate-900 tabular-nums">
                            {drugLookupAgg
                              ? `$${Number(drugLookupAgg.weightedAvgPerUnit).toFixed(2)}`
                              : "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Body: scrollable stack */}
                    <div className="flex-1 overflow-auto px-5 py-4 space-y-4">
                      {/* Table Card */}
                      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
                          <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
                            Medications
                          </h3>
                          <span className="text-[10px] text-slate-400">
                            Click a row to expand NDC breakdown
                          </span>
                        </div>

                        {drugLookupLoading ? (
                          <div className="flex items-center justify-center h-48 gap-3">
                            <div className="h-5 w-5 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                            <span className="text-sm text-slate-400 font-medium">
                              Loading drug data…
                            </span>
                          </div>
                        ) : !drugLookup ||
                          !drugLookup.drugs ||
                          drugLookup.drugs.length === 0 ? (
                          <div className="flex flex-col items-center justify-center h-48 gap-2">
                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mb-1">
                              <Search className="w-4 h-4 text-slate-400" />
                            </div>
                            <p className="text-sm font-semibold text-slate-500">
                              No drugs found for this ingredient
                            </p>
                          </div>
                        ) : (
                          <table
                            style={{
                              borderCollapse: "collapse",
                              width: "100%",
                              tableLayout: "fixed",
                            }}
                          >
                            <colgroup>
                              <col style={{ width: "30%" }} />
                              <col style={{ width: "12%" }} />
                              <col style={{ width: "13%" }} />
                              <col style={{ width: "15%" }} />
                              <col style={{ width: "15%" }} />
                              <col style={{ width: "15%" }} />
                            </colgroup>
                            <thead>
                              <tr style={{ background: "#1e293b" }}>
                                {[
                                  {
                                    line1: "Medications",
                                    line2: "",
                                    align: "left" as const,
                                  },
                                  {
                                    line1: "Avg Qty",
                                    line2: "per Rx",
                                    align: "right" as const,
                                  },
                                  {
                                    line1: "Avg CoPay",
                                    line2: "per Rx",
                                    align: "right" as const,
                                  },
                                  {
                                    line1: "Avg Ins Paid",
                                    line2: "per Rx",
                                    align: "right" as const,
                                  },
                                  {
                                    line1: "Avg Ins Paid",
                                    line2: "per Unit",
                                    align: "right" as const,
                                  },
                                  {
                                    line1: "Rx Count",
                                    line2: "",
                                    align: "right" as const,
                                  },
                                ].map((h, i) => (
                                  <th
                                    key={i}
                                    style={{
                                      padding: "8px 10px",
                                      textAlign: h.align,
                                      fontSize: 10,
                                      fontWeight: 700,
                                      color: "#fff",
                                      letterSpacing: "0.05em",
                                      textTransform: "uppercase",
                                      lineHeight: 1.3,
                                    }}
                                  >
                                    <div>{h.line1}</div>
                                    {h.line2 && (
                                      <div
                                        style={{
                                          color: "#94a3b8",
                                          fontWeight: 500,
                                          fontSize: 9,
                                        }}
                                      >
                                        {h.line2}
                                      </div>
                                    )}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {drugLookup.drugs.map((drug, di) => {
                                const isExpanded =
                                  expandedLookupDrug === drug.drug_name;
                                return (
                                  <React.Fragment key={drug.drug_name}>
                                    <tr
                                      style={{
                                        borderBottom: "1px solid #e2e8f0",
                                        background: isExpanded
                                          ? "#eef2ff"
                                          : di % 2 === 1
                                            ? "#f8fafc"
                                            : "#fff",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        setExpandedLookupDrug(
                                          isExpanded ? null : drug.drug_name,
                                        )
                                      }
                                      className="hover:bg-indigo-50/60 transition-colors"
                                    >
                                      <td
                                        style={{
                                          padding: "9px 10px",
                                          fontSize: 12,
                                        }}
                                      >
                                        <div className="flex items-center gap-2">
                                          <ChevronDown
                                            className={`w-3.5 h-3.5 text-slate-400 transition-transform shrink-0 ${isExpanded ? "" : "-rotate-90"}`}
                                          />
                                          <span className="text-slate-400 tabular-nums text-[11px] shrink-0">
                                            {di + 1}.
                                          </span>
                                          <span className="font-semibold text-slate-800 truncate">
                                            {drug.drug_name}
                                          </span>
                                          {brandPill(drug.brand)}
                                        </div>
                                      </td>
                                      <td
                                        style={{
                                          padding: "9px 10px",
                                          fontSize: 12,
                                          textAlign: "right",
                                        }}
                                      >
                                        <span className="tabular-nums text-slate-700">
                                          {Number(
                                            drug.avg_qty_per_rx ?? 0,
                                          ).toFixed(0)}
                                        </span>
                                      </td>
                                      <td
                                        style={{
                                          padding: "9px 10px",
                                          fontSize: 12,
                                          textAlign: "right",
                                          background: "rgba(240,253,250,0.6)",
                                        }}
                                      >
                                        <span className="tabular-nums text-slate-700">
                                          {drug.avg_copay_per_rx != null
                                            ? `$${Number(drug.avg_copay_per_rx).toFixed(2)}`
                                            : "—"}
                                        </span>
                                      </td>
                                      <td
                                        style={{
                                          padding: "9px 10px",
                                          fontSize: 12,
                                          textAlign: "right",
                                          background: "rgba(240,253,250,0.6)",
                                        }}
                                      >
                                        <span className="tabular-nums font-semibold text-slate-800">
                                          $
                                          {Number(
                                            drug.avg_ins_paid_per_rx ?? 0,
                                          ).toFixed(2)}
                                        </span>
                                      </td>
                                      <td
                                        style={{
                                          padding: "9px 10px",
                                          fontSize: 12,
                                          textAlign: "right",
                                          background: "rgba(240,253,250,0.6)",
                                        }}
                                      >
                                        <span className="tabular-nums text-slate-700">
                                          $
                                          {Number(
                                            drug.avg_ins_paid_per_unit ?? 0,
                                          ).toFixed(2)}
                                        </span>
                                      </td>
                                      <td
                                        style={{
                                          padding: "9px 10px",
                                          fontSize: 12,
                                          textAlign: "right",
                                          background: "rgba(236,254,255,0.6)",
                                        }}
                                      >
                                        <span className="tabular-nums font-bold text-cyan-800">
                                          {Number(
                                            drug.rx_count ?? 0,
                                          ).toLocaleString()}
                                        </span>
                                      </td>
                                    </tr>

                                    {isExpanded &&
                                      drug.ndcs &&
                                      drug.ndcs.map((ndc, ni) => (
                                        <tr
                                          key={ndc.ndc}
                                          style={{
                                            borderBottom: "1px solid #f1f5f9",
                                            background:
                                              ni % 2 === 1 ? "#f8fafc" : "#fff",
                                          }}
                                          className="hover:bg-indigo-50/40 transition-colors"
                                        >
                                          <td
                                            style={{
                                              padding: "7px 10px 7px 36px",
                                              fontSize: 12,
                                            }}
                                          >
                                            <div className="flex items-center gap-2">
                                              <span className="text-indigo-400 text-sm leading-none shrink-0">
                                                ◦
                                              </span>
                                              <span className="font-mono text-[11px] text-slate-600 tabular-nums">
                                                {ndc.ndc}
                                              </span>
                                              {brandPill(ndc.brand)}
                                              <button
                                                className="cursor-pointer text-[10px] text-indigo-600 hover:underline ml-auto"
                                                onClick={(e) => {
                                                  e.stopPropagation();

                                                  setActiveDrug(
                                                    (prev: any) => ({
                                                      ...prev,
                                                      ndc: ndc.ndc,
                                                    }),
                                                  );

                                                  setActiveSidebar("drug");
                                                  setOpenDrugSidebar(true);
                                                }}
                                              >
                                                Community ↗
                                              </button>
                                            </div>
                                          </td>
                                          <td
                                            style={{
                                              padding: "7px 10px",
                                              fontSize: 12,
                                              textAlign: "right",
                                            }}
                                          >
                                            <span className="tabular-nums text-slate-600">
                                              {Number(
                                                ndc.avg_qty_per_rx ?? 0,
                                              ).toFixed(0)}
                                            </span>
                                          </td>
                                          <td
                                            style={{
                                              padding: "7px 10px",
                                              fontSize: 12,
                                              textAlign: "right",
                                              background:
                                                "rgba(240,253,250,0.4)",
                                            }}
                                          >
                                            <span className="tabular-nums text-slate-600">
                                              {ndc.avg_copay_per_rx != null
                                                ? `$${Number(ndc.avg_copay_per_rx).toFixed(2)}`
                                                : "—"}
                                            </span>
                                          </td>
                                          <td
                                            style={{
                                              padding: "7px 10px",
                                              fontSize: 12,
                                              textAlign: "right",
                                              background:
                                                "rgba(240,253,250,0.4)",
                                            }}
                                          >
                                            <span className="tabular-nums text-slate-700">
                                              $
                                              {Number(
                                                ndc.avg_ins_paid_per_rx ?? 0,
                                              ).toFixed(2)}
                                            </span>
                                          </td>
                                          <td
                                            style={{
                                              padding: "7px 10px",
                                              fontSize: 12,
                                              textAlign: "right",
                                              background:
                                                "rgba(240,253,250,0.4)",
                                            }}
                                          >
                                            <span className="tabular-nums text-slate-600">
                                              $
                                              {Number(
                                                ndc.avg_ins_paid_per_unit ?? 0,
                                              ).toFixed(2)}
                                            </span>
                                          </td>
                                          <td
                                            style={{
                                              padding: "7px 10px",
                                              fontSize: 12,
                                              textAlign: "right",
                                              background:
                                                "rgba(236,254,255,0.4)",
                                            }}
                                          >
                                            <span className="tabular-nums font-semibold text-cyan-700">
                                              {Number(
                                                ndc.rx_count ?? 0,
                                              ).toLocaleString()}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                  </React.Fragment>
                                );
                              })}
                            </tbody>
                            {drugLookupAgg && (
                              <tfoot>
                                <tr
                                  style={{
                                    background: "#f1f5f9",
                                    borderTop: "2px solid #cbd5e1",
                                  }}
                                >
                                  <td
                                    style={{
                                      padding: "10px 10px",
                                      fontSize: 11,
                                      fontWeight: 700,
                                      color: "#475569",
                                      textTransform: "uppercase",
                                      letterSpacing: "0.05em",
                                    }}
                                  >
                                    Totals / Weighted Avg
                                  </td>
                                  <td
                                    style={{
                                      padding: "10px 10px",
                                      fontSize: 12,
                                      textAlign: "right",
                                    }}
                                  >
                                    <span className="tabular-nums font-bold text-slate-800">
                                      {Number(
                                        drugLookupAgg.weightedAvgQty,
                                      ).toFixed(0)}
                                    </span>
                                  </td>
                                  <td
                                    style={{
                                      padding: "10px 10px",
                                      fontSize: 12,
                                      textAlign: "right",
                                    }}
                                  >
                                    <span className="tabular-nums text-slate-400">
                                      —
                                    </span>
                                  </td>
                                  <td
                                    style={{
                                      padding: "10px 10px",
                                      fontSize: 12,
                                      textAlign: "right",
                                    }}
                                  >
                                    <span className="tabular-nums font-bold text-slate-800">
                                      $
                                      {Number(
                                        drugLookupAgg.weightedAvgInsPerRx,
                                      ).toFixed(2)}
                                    </span>
                                  </td>
                                  <td
                                    style={{
                                      padding: "10px 10px",
                                      fontSize: 12,
                                      textAlign: "right",
                                    }}
                                  >
                                    <span className="tabular-nums font-bold text-emerald-700">
                                      $
                                      {Number(
                                        drugLookupAgg.weightedAvgPerUnit,
                                      ).toFixed(2)}
                                    </span>
                                  </td>
                                  <td
                                    style={{
                                      padding: "10px 10px",
                                      fontSize: 12,
                                      textAlign: "right",
                                    }}
                                  >
                                    <span className="tabular-nums font-extrabold text-cyan-800">
                                      {Number(
                                        drugLookupAgg.totalRxs,
                                      ).toLocaleString()}
                                    </span>
                                  </td>
                                </tr>
                              </tfoot>
                            )}
                          </table>
                        )}
                      </div>

                      {/* Insights Cards */}
                      {drugLookupAgg &&
                        drugLookup &&
                        drugLookup.drugs &&
                        drugLookup.drugs.length > 1 && (
                          <div>
                            <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
                              Insights
                            </h3>
                            <div className="grid grid-cols-3 gap-2.5">
                              <div className="bg-white border border-slate-200 rounded-xl p-3.5">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    Most Prescribed
                                  </p>
                                </div>
                                <p
                                  className="text-[12px] font-bold text-slate-900 truncate mb-0.5"
                                  title={
                                    drugLookupAgg.mostPrescribed?.drug_name ??
                                    ""
                                  }
                                >
                                  {drugLookupAgg.mostPrescribed?.drug_name ??
                                    "—"}
                                </p>
                                <p className="text-[11px] text-slate-500 tabular-nums">
                                  {Number(
                                    drugLookupAgg.mostPrescribed?.rx_count ?? 0,
                                  ).toLocaleString()}{" "}
                                  prescriptions
                                </p>
                              </div>
                              <div className="bg-white border border-slate-200 rounded-xl p-3.5">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    Highest $/Unit
                                  </p>
                                </div>
                                <p
                                  className="text-[12px] font-bold text-slate-900 truncate mb-0.5"
                                  title={
                                    drugLookupAgg.highestUnit?.drug_name ?? ""
                                  }
                                >
                                  {drugLookupAgg.highestUnit?.drug_name ?? "—"}
                                </p>
                                <p className="text-[11px] text-red-600 tabular-nums font-semibold">
                                  $
                                  {Number(
                                    drugLookupAgg.highestUnit
                                      ?.avg_ins_paid_per_unit ?? 0,
                                  ).toFixed(2)}{" "}
                                  / unit
                                </p>
                              </div>
                              <div className="bg-white border border-slate-200 rounded-xl p-3.5">
                                <div className="flex items-center gap-1.5 mb-1.5">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                    Lowest $/Unit
                                  </p>
                                </div>
                                <p
                                  className="text-[12px] font-bold text-slate-900 truncate mb-0.5"
                                  title={
                                    drugLookupAgg.lowestUnit?.drug_name ?? ""
                                  }
                                >
                                  {drugLookupAgg.lowestUnit?.drug_name ?? "—"}
                                </p>
                                <p className="text-[11px] text-emerald-600 tabular-nums font-semibold">
                                  $
                                  {Number(
                                    drugLookupAgg.lowestUnit
                                      ?.avg_ins_paid_per_unit ?? 0,
                                  ).toFixed(2)}{" "}
                                  / unit
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                      {/* Community Coverage Teaser */}
                      <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 bg-white/40">
                        <div className="flex items-start gap-3">
                          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-indigo-100 to-cyan-100 flex items-center justify-center shrink-0">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#6366f1"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <circle cx="12" cy="12" r="10" />
                              <path d="M2 12h20" />
                              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <h4 className="text-[13px] font-bold text-slate-800">
                                Community Coverage
                              </h4>
                              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase tracking-wider">
                                Coming Soon
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              Compare your pharmacy's pricing against community
                              benchmarks by BIN/PCN/Group, filtered by state and
                              time range — coming in a future release.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

            {/* ── Total Billed Sidebar ── */}
            {/* {openBilledSidebar && billedDrug && ( */}
            {/* // <> */}
            {/* Backdrop */}
            {/* <div
                  className="fixed inset-0 bg-black/30 z-[200]"
                  onClick={() => {
                    setOpenBilledSidebar(false);
                    setShowRxFilters(false);
                  }}
                /> */}

            {/* ── Total Billed Sidebar ── */}
            {openBilledSidebar && billedDrug && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 bg-black/30 z-[200]"
                  onClick={() => {
                    setOpenBilledSidebar(false);
                    setShowRxFilters(false);
                  }}
                />

                {/* Right Panel */}
                <div
                  className="fixed top-0 right-0 h-full z-[210] flex flex-col bg-white"
                  style={{
                    width: "50%",
                    maxWidth: "100vw",
                    boxShadow: "-4px 0 24px rgba(0,0,0,0.15)",
                  }}
                >
                  {/* ── Top Bar ── */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 flex-shrink-0">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => {
                          setOpenBilledSidebar(false);
                          setShowRxFilters(false);
                        }}
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-red-500 shrink-0" />
                        <span className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                          Total Billed
                        </span>
                      </div>
                    </div>

                    {/* Filter button + dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowRxFilters((v) => !v)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                          showRxFilters
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Filter
                      </button>

                      {showRxFilters && (
                        <div
                          className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-[220]"
                          style={{ width: 280 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                              Filters
                            </span>
                            <div className="flex items-center gap-2">
                              {rxFilters.length > 0 && (
                                <button
                                  onClick={() => setRxFilters([])}
                                  className="text-[11px] font-semibold text-slate-500 hover:text-red-500"
                                >
                                  Clear
                                </button>
                              )}
                              <button
                                onClick={() => setShowRxFilters(false)}
                                className="h-5 w-5 rounded flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <div className="px-4 pt-3 pb-1 flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
                            <span className="text-[11px] font-bold text-slate-700">
                              Billed
                            </span>
                          </div>
                          <div className="px-4 pb-4 max-h-[400px] overflow-y-auto">
                            {[
                              "EXPRESS SCRIPTS",
                              "OPTUMRX",
                              "CVS CAREMARK",
                              "CASH",
                              "SS&C (FORMERLY HUMANA, ARGUS, AND DST)",
                              "HORIZON HEALTH",
                              "NJ MEDICAID",
                              "CAPITALRX",
                              "CHANGE HEALTHCARE",
                              "PDMI (CO-PAY CARD)",
                              "MCKESSON HDS (CO-PAY CARD)",
                              "SAVRX",
                              "ELIXIR",
                              "MEDIMPACT",
                              "NAVITUS",
                              "VIATRIS (CO-PAY CARD)",
                              "ABARCA",
                              "RXSENSE",
                              "PREVI",
                            ].map((name) => (
                              <label
                                key={name}
                                className="flex items-center gap-2.5 py-2 cursor-pointer hover:bg-slate-50 rounded px-1 -mx-1 border-b border-slate-50 last:border-0"
                              >
                                <input
                                  type="checkbox"
                                  checked={rxFilters.includes(name)}
                                  onChange={() =>
                                    setRxFilters((prev) =>
                                      prev.includes(name)
                                        ? prev.filter((x) => x !== name)
                                        : [...prev, name],
                                    )
                                  }
                                  className="h-4 w-4 shrink-0 rounded border-slate-300"
                                  style={{ accentColor: "#1e293b" }}
                                />
                                <span className="text-[12px] text-slate-700 font-medium leading-tight">
                                  {name}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Info Bar ── */}
                  <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex-shrink-0">
                    {(() => {
                      const current = rxLines.filter(
                        (r) => !r.is_outside_date_range,
                      );
                      const priTotal = current.reduce(
                        (s, r) => s + (r.pri_paid ?? 0),
                        0,
                      );
                      const secTotal = current.reduce(
                        (s, r) => s + (r.sec_paid ?? 0),
                        0,
                      );

                      const items = [
                        { label: "NDC", value: billedDrug.ndc, mono: true },
                        {
                          label: "Drug Name",
                          value: billedDrug.drugName,
                          bold: true,
                        },
                        {
                          label: "Total QTY",
                          // value: billedDrug.totalBilled.toLocaleString(),
                          value: billedDrug.totalBilled.toLocaleString(),
                          bold: true,
                        },
                        ...(rxLines.length > 0
                          ? [
                              {
                                label: "Total Primary Amount",
                                value: `$${priTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                                bold: true,
                              },
                              {
                                label: "Total Secondary Amount",
                                value: `$${secTotal.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                                bold: true,
                              },
                            ]
                          : []),
                      ];

                      return (
                        <div className="flex items-start gap-8 flex-wrap">
                          {items.map((item) => (
                            <div key={item.label} className="min-w-0">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                                {item.label}
                              </p>
                              <p
                                className={`text-[14px] tabular-nums truncate ${
                                  item.mono ? "font-mono text-slate-600" : ""
                                } ${item.bold ? "font-bold text-slate-900" : "text-slate-700"}`}
                              >
                                {item.value}
                              </p>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* ── Tabs ── */}
                  <div className="flex items-center gap-2 px-5 py-2.5 border-b border-slate-200 bg-white flex-shrink-0">
                    {(["current", "outside"] as const).map((tab) => {
                      const count =
                        tab === "current"
                          ? rxLines.filter((r) => !r.is_outside_date_range)
                              .length
                          : rxLines.filter((r) => r.is_outside_date_range)
                              .length;
                      const isActive = rxTab === tab;
                      return (
                        <button
                          key={tab}
                          onClick={() => setRxTab(tab)}
                          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                            isActive
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700"
                          }`}
                        >
                          {tab === "current"
                            ? "Current Date Range"
                            : "Outside Date Range"}
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isActive
                                ? "bg-white text-slate-900"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* ── Table ── */}
                  <div className="flex-1 overflow-auto">
                    {rxLoading ? (
                      <div className="flex items-center justify-center h-48 gap-3">
                        <div className="h-5 w-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                        <span className="text-sm text-slate-400 font-medium">
                          Loading prescriptions...
                        </span>
                      </div>
                    ) : (
                      (() => {
                        const activeLines = rxLines.filter((r) =>
                          rxTab === "current"
                            ? !r.is_outside_date_range
                            : r.is_outside_date_range,
                        );
                        const filtered = (
                          rxFilters.length > 0
                            ? activeLines.filter((r) =>
                                rxFilters.includes(r.pri_insurance),
                              )
                            : activeLines
                        ).sort((a, b) => {
                          const da = a.date_filled
                            ? new Date(a.date_filled).getTime()
                            : 0;
                          const db = b.date_filled
                            ? new Date(b.date_filled).getTime()
                            : 0;
                          return db - da;
                        });

                        if (filtered.length === 0) {
                          return (
                            <div className="flex flex-col items-center justify-center h-48 gap-2">
                              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mb-1">
                                <Search className="w-4 h-4 text-slate-400" />
                              </div>
                              <p className="text-sm font-semibold text-slate-500">
                                No records found
                              </p>
                              <p className="text-xs text-slate-400">
                                {rxLines.length === 0
                                  ? "No prescription data available"
                                  : "Try adjusting filters"}
                              </p>
                            </div>
                          );
                        }

                        const cols = [
                          { key: "#", w: 30, align: "center" as const },
                          { key: "TYPE", w: 70, align: "left" as const },
                          { key: "RX NUMBER", w: 85, align: "left" as const },
                          { key: "DATE", w: 85, align: "left" as const },
                          { key: "QTY", w: 45, align: "right" as const },
                          { key: "PRI BIN", w: 65, align: "left" as const },
                          { key: "PRI PCN", w: 65, align: "left" as const },
                          { key: "PRI GROUP", w: 75, align: "left" as const },
                          {
                            key: "PRI INSURANCE",
                            w: 180,
                            align: "left" as const,
                          },
                          { key: "SEC BIN", w: 65, align: "left" as const },
                        ];

                        return (
                          <table
                            style={{
                              borderCollapse: "collapse",
                              width: "100%",
                              minWidth: "max-content",
                            }}
                          >
                            <thead>
                              <tr
                                style={{
                                  position: "sticky",
                                  top: 0,
                                  zIndex: 10,
                                  background: "#fff",
                                }}
                              >
                                {cols.map((col) => (
                                  <th
                                    key={col.key}
                                    style={{
                                      padding: "7px 6px",
                                      textAlign:
                                        col.key === "#" ? "center" : "left",
                                      fontSize: 10,
                                      fontWeight: 700,
                                      color: "#64748b",
                                      letterSpacing: "0.06em",
                                      textTransform: "uppercase",
                                      whiteSpace: "nowrap",
                                      background: "#fff",
                                      borderBottom: "2px solid #e2e8f0",
                                    }}
                                  >
                                    {col.key === "SHORTAGE" ? (
                                      <span
                                        style={{
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: 4,
                                        }}
                                      >
                                        <span
                                          style={{
                                            height: 6,
                                            width: 6,
                                            borderRadius: "50%",
                                            background: "#f59e0b",
                                          }}
                                        />
                                        {col.key}
                                      </span>
                                    ) : col.key === "TOTAL ORDERED" ? (
                                      <span
                                        style={{
                                          display: "inline-flex",
                                          alignItems: "center",
                                          gap: 4,
                                        }}
                                      >
                                        <span
                                          style={{
                                            height: 6,
                                            width: 6,
                                            borderRadius: "50%",
                                            background: "#10b981",
                                          }}
                                        />
                                        {col.key}
                                      </span>
                                    ) : (
                                      col.key
                                    )}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {filtered.map((rx, i) => (
                                <tr
                                  key={i}
                                  style={{ borderBottom: "1px solid #f1f5f9" }}
                                  className="hover:bg-slate-50/60 transition-colors"
                                >
                                  <td
                                    style={{
                                      padding: "8px 10px",
                                      fontSize: 12,
                                      color: "#94a3b8",
                                      fontWeight: 500,
                                      textAlign: "center",
                                    }}
                                  >
                                    {i + 1}
                                  </td>
                                  <td style={{ padding: "8px 10px" }}>
                                    <span
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 5,
                                      }}
                                    >
                                      <span
                                        style={{
                                          height: 7,
                                          width: 7,
                                          borderRadius: "50%",
                                          background: "#ef4444",
                                          flexShrink: 0,
                                        }}
                                      />
                                      <span
                                        style={{
                                          fontSize: 12,
                                          fontWeight: 600,
                                          color: "#1e293b",
                                        }}
                                      >
                                        {rx.type || "PRIMERX"}
                                      </span>
                                    </span>
                                  </td>
                                  <td
                                    style={{
                                      padding: "8px 10px",
                                      fontSize: 12,
                                      fontFamily: "ui-monospace, monospace",
                                      color: "#334155",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {rx.rx_number || "—"}
                                  </td>
                                  <td
                                    style={{
                                      padding: "8px 10px",
                                      fontSize: 12,
                                      color: "#334155",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {rx.date_filled
                                      ? new Date(
                                          rx.date_filled + "T00:00:00",
                                        ).toLocaleDateString("en-US", {
                                          month: "2-digit",
                                          day: "2-digit",
                                          year: "numeric",
                                        })
                                      : "—"}
                                  </td>
                                  <td
                                    style={{
                                      padding: "8px 10px",
                                      fontSize: 12,
                                      fontWeight: 600,
                                      color: "#1e293b",
                                      textAlign: "right",
                                    }}
                                  >
                                    {/* {rx.quantity} */}
                                    {qtyType === "UNIT" &&
                                    billedDrug.pkgSize > 0
                                      ? +(
                                          rx.quantity / billedDrug.pkgSize
                                        ).toFixed(2)
                                      : rx.quantity}
                                  </td>
                                  <td
                                    style={{
                                      padding: "8px 10px",
                                      fontSize: 12,
                                      fontFamily: "ui-monospace, monospace",
                                      color: "#475569",
                                    }}
                                  >
                                    {rx.pri_bin || "—"}
                                  </td>
                                  <td
                                    style={{
                                      padding: "8px 10px",
                                      fontSize: 12,
                                      fontFamily: "ui-monospace, monospace",
                                      color: "#475569",
                                    }}
                                  >
                                    {rx.pri_pcn || "—"}
                                  </td>
                                  <td
                                    style={{
                                      padding: "8px 10px",
                                      fontSize: 12,
                                      fontFamily: "ui-monospace, monospace",
                                      color: "#475569",
                                    }}
                                  >
                                    {rx.pri_group || "—"}
                                  </td>
                                  <td
                                    style={{
                                      padding: "8px 10px",
                                      fontSize: 12,
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {rx.pri_insurance ? (
                                      <span>
                                        <span
                                          style={{
                                            fontWeight: 600,
                                            color: "#1e293b",
                                          }}
                                        >
                                          {rx.pri_insurance}
                                        </span>
                                        {rx.pri_paid > 0 && (
                                          <span
                                            style={{
                                              color: "#059669",
                                              fontWeight: 700,
                                              marginLeft: 6,
                                            }}
                                          >
                                            ${rx.pri_paid.toFixed(2)}
                                          </span>
                                        )}
                                      </span>
                                    ) : (
                                      "—"
                                    )}
                                  </td>
                                  <td
                                    style={{
                                      padding: "8px 10px",
                                      fontSize: 12,
                                      fontFamily: "ui-monospace, monospace",
                                      color: "#475569",
                                    }}
                                  >
                                    {rx.sec_bin || "—"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        );
                      })()
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ── Total Ordered Sidebar ── */}
            {openOrderedSidebar && orderedDrug && (
              <>
                <div
                  className="fixed inset-0 bg-black/30 z-[200]"
                  onClick={() => {
                    setOpenOrderedSidebar(false);
                    setShowOrderFilters(false);
                  }}
                />

                <div
                  className="fixed top-0 right-0 h-full z-[210] flex flex-col bg-white"
                  style={{
                    width: "40%",
                    maxWidth: "100vw",
                    boxShadow: "-4px 0 24px rgba(0,0,0,0.15)",
                  }}
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 flex-shrink-0">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => {
                          setOpenOrderedSidebar(false);
                          setShowOrderFilters(false);
                        }}
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                          Total Ordered
                        </span>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setShowOrderFilters((v) => !v)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                          showOrderFilters
                            ? "bg-slate-900 text-white border-slate-900"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        Filter
                      </button>

                      {showOrderFilters && (
                        <div
                          className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-[220]"
                          style={{ width: 260 }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                              Filters
                            </span>
                            <div className="flex items-center gap-2">
                              {orderFilters.length > 0 && (
                                <button
                                  onClick={() => setOrderFilters([])}
                                  className="text-[11px] font-semibold text-slate-500 hover:text-red-500"
                                >
                                  Clear
                                </button>
                              )}
                              <button
                                onClick={() => setShowOrderFilters(false)}
                                className="h-5 w-5 rounded flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <div className="px-4 pt-3 pb-1 flex items-center gap-1.5">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                            <span className="text-[11px] font-bold text-slate-700">
                              Ordered
                            </span>
                          </div>
                          <div className="px-4 pb-4 max-h-[400px] overflow-y-auto">
                            {[
                              "MCKESSON",
                              "CARDINAL HEALTH",
                              "AMERISOURCEBERGEN",
                              "HD SMITH",
                              "MORRIS & DICKSON",
                              "ANDA",
                              "OTHER",
                            ].map((name) => (
                              <label
                                key={name}
                                className="flex items-center gap-2.5 py-2 cursor-pointer hover:bg-slate-50 rounded px-1 -mx-1 border-b border-slate-50 last:border-0"
                              >
                                <input
                                  type="checkbox"
                                  checked={orderFilters.includes(name)}
                                  onChange={() =>
                                    setOrderFilters((prev) =>
                                      prev.includes(name)
                                        ? prev.filter((x) => x !== name)
                                        : [...prev, name],
                                    )
                                  }
                                  className="h-4 w-4 shrink-0 rounded border-slate-300"
                                  style={{ accentColor: "#1e293b" }}
                                />
                                <span className="text-[12px] text-slate-700 font-medium leading-tight">
                                  {name}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Info Bar */}
                  <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex-shrink-0">
                    <div className="flex items-start gap-8 flex-wrap">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          NDC
                        </p>
                        <p className="text-[14px] tabular-nums font-mono text-slate-600">
                          {orderedDrug.ndc}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Drug Name
                        </p>
                        <p className="text-[14px] font-bold text-slate-900 truncate">
                          {orderedDrug.drugName}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Total QTY
                        </p>
                        <p className="text-[14px] font-bold text-slate-900 tabular-nums">
                          {orderedDrug.totalOrdered.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center gap-2 px-5 py-2.5 border-b border-slate-200 bg-white flex-shrink-0">
                    {(["current", "outside"] as const).map((tab) => {
                      const count =
                        tab === "current"
                          ? orderLines.filter((r) => !r.is_outside_date_range)
                              .length
                          : orderLines.filter((r) => r.is_outside_date_range)
                              .length;
                      const isActive = orderTab === tab;
                      return (
                        <button
                          key={tab}
                          onClick={() => setOrderTab(tab)}
                          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                            isActive
                              ? "bg-slate-900 text-white border-slate-900"
                              : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700"
                          }`}
                        >
                          {tab === "current"
                            ? "Current Date Range"
                            : "Outside Date Range"}
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isActive
                                ? "bg-white text-slate-900"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Table */}
                  <div className="flex-1 overflow-auto">
                    {orderLoading ? (
                      <div className="flex items-center justify-center h-48 gap-3">
                        <div className="h-5 w-5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                        <span className="text-sm text-slate-400 font-medium">
                          Loading orders...
                        </span>
                      </div>
                    ) : (
                      (() => {
                        const activeLines = orderLines.filter((r) =>
                          orderTab === "current"
                            ? !r.is_outside_date_range
                            : r.is_outside_date_range,
                        );
                        const filtered =
                          orderFilters.length > 0
                            ? activeLines.filter((r) =>
                                orderFilters.includes(r.type?.toUpperCase()),
                              )
                            : activeLines;

                        if (filtered.length === 0) {
                          return (
                            <div className="flex flex-col items-center justify-center h-48 gap-2">
                              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mb-1">
                                <Search className="w-4 h-4 text-slate-400" />
                              </div>
                              <p className="text-sm font-semibold text-slate-500">
                                No records found
                              </p>
                              <p className="text-xs text-slate-400">
                                {orderLines.length === 0
                                  ? "No order data available"
                                  : "Try adjusting filters"}
                              </p>
                            </div>
                          );
                        }

                        return (
                          <table
                            style={{
                              borderCollapse: "collapse",
                              width: "100%",
                              tableLayout: "fixed",
                            }}
                          >
                            <colgroup>
                              <col style={{ width: "6%" }} />
                              <col style={{ width: "30%" }} />
                              <col style={{ width: "32%" }} />
                              <col style={{ width: "32%" }} />
                            </colgroup>
                            <thead>
                              <tr
                                style={{
                                  position: "sticky",
                                  top: 0,
                                  zIndex: 10,
                                  background: "#fff",
                                }}
                              >
                                <th
                                  style={{
                                    padding: "7px 6px",
                                    textAlign: "center",
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: "#64748b",
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                    background: "#fff",
                                    borderBottom: "2px solid #e2e8f0",
                                    borderRight: "1px solid #e2e8f0",
                                  }}
                                >
                                  #
                                </th>
                                <th
                                  style={{
                                    padding: "7px 6px",
                                    textAlign: "left",
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: "#64748b",
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                    background: "#fff",
                                    borderBottom: "2px solid #e2e8f0",
                                    borderRight: "1px solid #e2e8f0",
                                  }}
                                >
                                  TYPE
                                </th>
                                <th
                                  style={{
                                    padding: "7px 6px",
                                    textAlign: "left",
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: "#64748b",
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                    background: "#fff",
                                    borderBottom: "2px solid #e2e8f0",
                                    borderRight: "1px solid #e2e8f0",
                                  }}
                                >
                                  DATE
                                </th>
                                <th
                                  style={{
                                    padding: "7px 6px",
                                    textAlign: "left",
                                    fontSize: 10,
                                    fontWeight: 700,
                                    color: "#64748b",
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                    background: "#fff",
                                    borderBottom: "2px solid #e2e8f0",
                                  }}
                                >
                                  QTY
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {filtered.map((order, i) => (
                                <tr
                                  key={i}
                                  style={{ borderBottom: "1px solid #f1f5f9" }}
                                  className="hover:bg-slate-50/60 transition-colors"
                                >
                                  <td
                                    style={{
                                      padding: "6px 6px",
                                      fontSize: 12,
                                      color: "#94a3b8",
                                      fontWeight: 500,
                                      textAlign: "center",
                                      borderRight: "1px solid #f1f5f9",
                                    }}
                                  >
                                    {i + 1}
                                  </td>
                                  <td
                                    style={{
                                      padding: "6px 6px",
                                      fontSize: 12,
                                      fontWeight: 600,
                                      color: "#1e293b",
                                      textAlign: "left",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      borderRight: "1px solid #f1f5f9",
                                    }}
                                  >
                                    <span
                                      style={{
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: 5,
                                      }}
                                    >
                                      <span
                                        style={{
                                          height: 7,
                                          width: 7,
                                          borderRadius: "50%",
                                          background: "#10b981",
                                          flexShrink: 0,
                                        }}
                                      />
                                      {order.type || "MCKESSON"}
                                    </span>
                                  </td>
                                  <td
                                    style={{
                                      padding: "6px 6px",
                                      fontSize: 12,
                                      color: "#334155",
                                      textAlign: "left",
                                      borderRight: "1px solid #f1f5f9",
                                    }}
                                  >
                                    {order.date_ordered
                                      ? new Date(
                                          order.date_ordered + "T00:00:00",
                                        ).toLocaleDateString("en-US", {
                                          month: "2-digit",
                                          day: "2-digit",
                                          year: "numeric",
                                        })
                                      : "—"}
                                  </td>
                                  <td
                                    style={{
                                      padding: "6px 6px",
                                      fontSize: 12,
                                      fontWeight: 600,
                                      color: "#1e293b",
                                      textAlign: "left",
                                    }}
                                  >
                                    {/* {Number(order.quantity).toFixed(2)} */}
                                    {qtyType === "PKG SIZE"
                                      ? +(
                                          Number(order.quantity) *
                                          (orderedDrug.pkgSize || 1)
                                        ).toFixed(2)
                                      : Number(order.quantity).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        );
                      })()
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ── Total Shortage Sidebar ── */}
            {openShortageSidebar && shortageDrug && (
              <>
                <div
                  className="fixed inset-0 bg-black/30 z-[200]"
                  onClick={() => setOpenShortageSidebar(false)}
                />

                <div
                  className="fixed top-0 right-0 h-full z-[210] flex flex-col bg-white"
                  style={{
                    width: "40%",
                    maxWidth: "100vw",
                    boxShadow: "-4px 0 24px rgba(0,0,0,0.15)",
                  }}
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 flex-shrink-0">
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => setOpenShortageSidebar(false)}
                        className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shrink-0" />
                        <span className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                          Total Shortage
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Info Bar */}
                  <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex-shrink-0">
                    <div className="flex items-start gap-8 flex-wrap">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          NDC
                        </p>
                        <p className="text-[14px] tabular-nums font-mono text-slate-600">
                          {shortageDrug.ndc}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Drug Name
                        </p>
                        <p className="text-[14px] font-bold text-slate-900 truncate">
                          {shortageDrug.drugName}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Billed QTY
                        </p>
                        <p className="text-[14px] font-bold text-slate-900 tabular-nums">
                          {shortageDrug.totalBilled.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="flex-1 overflow-auto">
                    {(() => {
                      const pbmRows = [
                        {
                          name: "OPTUMRX",
                          billed: shortageDrug.optumrx,
                          shortage: shortageDrug.shortageOptumrx,
                        },
                        {
                          name: "EXPRESS SCRIPTS",
                          billed: shortageDrug.express,
                          shortage: shortageDrug.shortageExpress,
                        },
                        {
                          name: "CVS CAREMARK",
                          billed: shortageDrug.cvsCaremark,
                          shortage: shortageDrug.shortageCvsCaremark,
                        },
                        {
                          name: "SS&C (FORMERLY HUMANA, ARGUS, AND DST)",
                          billed: shortageDrug.humana,
                          shortage: shortageDrug.shortageHumana,
                        },
                        {
                          name: "NJ MEDICAID",
                          billed: shortageDrug.njMedicaid,
                          shortage: shortageDrug.shortageNjMedicaid,
                        },
                        {
                          name: "MCKESSON HDS (CO-PAY CARD)",
                          billed: shortageDrug.pdmi,
                          shortage: shortageDrug.shortagePdmi,
                        },
                        {
                          name: "HORIZON",
                          billed: shortageDrug.horizon,
                          shortage: shortageDrug.shortageHorizon,
                        },
                        {
                          name: "SSC",
                          billed: shortageDrug.ssc,
                          shortage: shortageDrug.shortageSsc,
                        },
                        {
                          name: "MEDICARE",
                          billed: shortageDrug.medicare,
                          shortage: shortageDrug.shortageMedicare,
                        },
                      ].filter((r) => r.billed > 0 || r.shortage < 0);

                      if (pbmRows.length === 0) {
                        return (
                          <div className="flex flex-col items-center justify-center h-48 gap-2">
                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mb-1">
                              <Search className="w-4 h-4 text-slate-400" />
                            </div>
                            <p className="text-sm font-semibold text-slate-500">
                              No shortage data
                            </p>
                          </div>
                        );
                      }

                      return (
                        <table
                          style={{
                            borderCollapse: "collapse",
                            width: "100%",
                            tableLayout: "fixed",
                          }}
                        >
                          <colgroup>
                            <col style={{ width: "3%" }} />
                            <col style={{ width: "22%" }} />
                            <col style={{ width: "15%" }} />
                            <col style={{ width: "15%" }} />
                            <col style={{ width: "15%" }} />
                          </colgroup>
                          <thead>
                            <tr
                              style={{
                                position: "sticky",
                                top: 0,
                                zIndex: 10,
                                background: "#fff",
                              }}
                            >
                              <th
                                style={{
                                  padding: "7px 6px",
                                  textAlign: "center",
                                  fontSize: 10,
                                  fontWeight: 700,
                                  color: "#64748b",
                                  letterSpacing: "0.06em",
                                  textTransform: "uppercase",
                                  background: "#fff",
                                  borderBottom: "2px solid #e2e8f0",
                                }}
                              >
                                #
                              </th>
                              <th
                                style={{
                                  padding: "7px 6px",
                                  textAlign: "left",
                                  fontSize: 10,
                                  fontWeight: 700,
                                  color: "#64748b",
                                  letterSpacing: "0.06em",
                                  textTransform: "uppercase",
                                  background: "#fff",
                                  borderBottom: "2px solid #e2e8f0",
                                }}
                              >
                                INSURANCE
                              </th>
                              <th
                                style={{
                                  padding: "7px 6px",
                                  textAlign: "left",
                                  fontSize: 10,
                                  fontWeight: 700,
                                  color: "#64748b",
                                  letterSpacing: "0.06em",
                                  textTransform: "uppercase",
                                  background: "#fff",
                                  borderBottom: "2px solid #e2e8f0",
                                }}
                              >
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 4,
                                  }}
                                >
                                  <span
                                    style={{
                                      height: 6,
                                      width: 6,
                                      borderRadius: "50%",
                                      background: "#10b981",
                                    }}
                                  />
                                  TOTAL ORDERED
                                </span>
                              </th>
                              <th
                                style={{
                                  padding: "7px 6px",
                                  textAlign: "left",
                                  fontSize: 10,
                                  fontWeight: 700,
                                  color: "#64748b",
                                  letterSpacing: "0.06em",
                                  textTransform: "uppercase",
                                  background: "#fff",
                                  borderBottom: "2px solid #e2e8f0",
                                }}
                              >
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 4,
                                  }}
                                >
                                  <span
                                    style={{
                                      height: 6,
                                      width: 6,
                                      borderRadius: "50%",
                                      background: "#ef4444",
                                    }}
                                  />
                                  BILLED
                                </span>
                              </th>
                              <th
                                style={{
                                  padding: "7px 6px",
                                  textAlign: "left",
                                  fontSize: 10,
                                  fontWeight: 700,
                                  color: "#64748b",
                                  letterSpacing: "0.06em",
                                  textTransform: "uppercase",
                                  background: "#fff",
                                  borderBottom: "2px solid #e2e8f0",
                                }}
                              >
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 4,
                                  }}
                                >
                                  <span
                                    style={{
                                      height: 6,
                                      width: 6,
                                      borderRadius: "50%",
                                      background: "#f59e0b",
                                    }}
                                  />
                                  SHORTAGE
                                </span>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {pbmRows.map((row, i) => (
                              <tr
                                key={i}
                                style={{ borderBottom: "1px solid #f1f5f9" }}
                                className="hover:bg-slate-50/60 transition-colors"
                              >
                                <td
                                  style={{
                                    padding: "7px 6px",
                                    fontSize: 12,
                                    color: "#94a3b8",
                                    fontWeight: 500,
                                    textAlign: "center",
                                  }}
                                >
                                  {i + 1}
                                </td>
                                <td
                                  style={{
                                    padding: "7px 6px",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: "#1e293b",
                                    textAlign: "left",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {row.name}
                                </td>
                                <td
                                  style={{
                                    padding: "7px 6px",
                                    fontSize: 12,
                                    fontWeight: 500,
                                    color: "#475569",
                                    textAlign: "left",
                                  }}
                                >
                                  {shortageDrug.totalOrdered.toLocaleString()}
                                </td>
                                <td
                                  style={{
                                    padding: "7px 6px",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    color: "#1e293b",
                                    textAlign: "left",
                                  }}
                                >
                                  {row.billed.toLocaleString()}
                                </td>
                                <td
                                  style={{
                                    padding: "7px 6px",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    textAlign: "left",
                                    color:
                                      row.shortage < 0
                                        ? "#dc2626"
                                        : row.shortage === 0
                                          ? "#94a3b8"
                                          : "#059669",
                                  }}
                                >
                                  {row.shortage === 0
                                    ? "—"
                                    : row.shortage.toLocaleString()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      );
                    })()}
                  </div>
                </div>
              </>
            )}

            {/* ── Notes Sidebar ── */}
            {openNotesSidebar && notesDrug && (
              <>
                <div
                  className="fixed inset-0 bg-black/30 z-[200]"
                  onClick={() => setOpenNotesSidebar(false)}
                />
                <div
                  className="fixed top-0 right-0 h-full z-[210] flex flex-col bg-white"
                  style={{
                    width: "35%",
                    maxWidth: "100vw",
                    boxShadow: "-4px 0 24px rgba(0,0,0,0.15)",
                  }}
                >
                  {/* Top Bar */}
                  <div className="flex items-center gap-2.5 px-5 py-3 border-b border-slate-100 flex-shrink-0">
                    <button
                      onClick={() => setOpenNotesSidebar(false)}
                      className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shrink-0" />
                    <span className="text-sm font-bold text-slate-800 uppercase tracking-widest">
                      Add Note
                    </span>
                  </div>

                  {/* Info Bar */}
                  <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/50 flex-shrink-0">
                    <div className="flex items-start gap-8 flex-wrap">
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          NDC
                        </p>
                        <p className="text-[13px] font-mono font-bold text-slate-700 tabular-nums">
                          {notesDrug.ndc}
                        </p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Drug Name
                        </p>
                        <p className="text-[13px] font-bold text-slate-900 truncate">
                          {notesDrug.drugName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Note Input */}
                  <div className="flex-1 flex flex-col px-5 py-5 gap-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        Note
                      </p>
                      {notesMap[notesDrug.ndc] && (
                        <button
                          onClick={() => {
                            const next = { ...notesMap };
                            delete next[notesDrug.ndc];
                            setNotesMap(next);
                            setNoteText("");
                            setNotesSaved(false);
                          }}
                          className="text-[11px] font-semibold text-red-400 hover:text-red-600"
                        >
                          Clear note
                        </button>
                      )}
                    </div>
                    <textarea
                      value={noteText}
                      onChange={(e) => {
                        setNoteText(e.target.value);
                        setNotesSaved(false);
                      }}
                      placeholder="Type your note here..."
                      className="flex-1 w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent placeholder:text-slate-300"
                      style={{ minHeight: 200 }}
                    />

                    {/* Saved notes list */}
                    {notesMap[notesDrug.ndc] &&
                      noteText !== notesMap[notesDrug.ndc] && (
                        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
                          <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-1">
                            Saved Note
                          </p>
                          <p className="text-sm text-slate-700 whitespace-pre-wrap">
                            {notesMap[notesDrug.ndc]}
                          </p>
                        </div>
                      )}

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          if (!noteText.trim()) return;
                          setNotesMap((prev) => ({
                            ...prev,
                            [notesDrug.ndc]: noteText.trim(),
                          }));
                          setNotesSaved(true);
                        }}
                        disabled={!noteText.trim()}
                        className="flex-1 h-9 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        {notesSaved ? "✓ Saved" : "Save Note"}
                      </button>
                      <button
                        onClick={() => setOpenNotesSidebar(false)}
                        className="h-9 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
                      >
                        Close
                      </button>
                    </div>

                    {/* All notes for this session */}
                    {Object.keys(notesMap).length > 0 && (
                      <div className="mt-2">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                          All Notes This Session
                        </p>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {Object.entries(notesMap).map(([ndc, note]) => {
                            const drug = inventoryData.find(
                              (r) => r.ndc === ndc,
                            );
                            return (
                              <div
                                key={ndc}
                                className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2"
                              >
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="text-[11px] font-mono font-bold text-slate-500">
                                    {ndc}
                                  </span>
                                  <button
                                    onClick={() => {
                                      const next = { ...notesMap };
                                      delete next[ndc];
                                      setNotesMap(next);
                                      if (notesDrug.ndc === ndc) {
                                        setNoteText("");
                                        setNotesSaved(false);
                                      }
                                    }}
                                    className="text-[10px] text-red-400 hover:text-red-600 font-semibold"
                                  >
                                    ✕
                                  </button>
                                </div>
                                {drug && (
                                  <p className="text-[10px] text-slate-400 truncate mb-1">
                                    {drug.drugName}
                                  </p>
                                )}
                                <p className="text-xs text-slate-600 line-clamp-2">
                                  {note}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* ── Row tag context menu (portal) ── */}
            {rowTagMenuOpen !== null &&
              rowTagMenuPos &&
              (() => {
                const row = paginatedData.find((r) => r.id === rowTagMenuOpen);
                if (!row) return null;
                const assigned = rowTags[row.id] ?? [];
                const hasTag = assigned.length > 0;
                return (
                  <>
                    <div
                      ref={rowTagMenuRef}
                      className="fixed bg-white border border-slate-200 rounded-xl shadow-2xl z-[9999]"
                      style={{
                        top: rowTagMenuPos.y + 4,
                        left: rowTagMenuPos.x,
                        width: 200,
                        maxHeight: 320,
                        overflowY: "auto",
                      }}
                    >
                      {hasTag ? (
                        /* Remove Tag option */
                        <div className="p-2">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1">
                            Assigned Tags
                          </p>
                          {assigned.map((tid) => {
                            const t = tags.find((x) => x.id === tid);
                            if (!t) return null;
                            return (
                              <div
                                key={tid}
                                className="flex items-center justify-between gap-2 px-2 py-1.5 hover:bg-red-50 rounded-lg group"
                              >
                                <span
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
                                  style={{
                                    background: t.color + "22",
                                    color: t.color,
                                    border: `1px solid ${t.color}55`,
                                  }}
                                >
                                  {t.name}
                                </span>
                                <button
                                  onClick={() => {
                                    setRowTags((prev) => ({
                                      ...prev,
                                      [row.id]: (prev[row.id] ?? []).filter(
                                        (x) => x !== tid,
                                      ),
                                    }));
                                  }}
                                  className="text-[10px] font-bold text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100"
                                >
                                  Remove
                                </button>
                              </div>
                            );
                          })}
                          <div className="border-t border-slate-100 mt-2 pt-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 py-1">
                              Add More
                            </p>
                            {tags
                              .filter((t) => !assigned.includes(t.id))
                              .map((t) => (
                                <button
                                  key={t.id}
                                  onClick={() => {
                                    setRowTags((prev) => ({
                                      ...prev,
                                      [row.id]: [...(prev[row.id] ?? []), t.id],
                                    }));
                                  }}
                                  className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg text-left"
                                >
                                  <span
                                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
                                    style={{
                                      background: t.color + "22",
                                      color: t.color,
                                      border: `1px solid ${t.color}55`,
                                    }}
                                  >
                                    {t.name}
                                  </span>
                                </button>
                              ))}
                          </div>
                        </div>
                      ) : (
                        /* Add Tag options */
                        <div className="p-2">
                          <div className="flex items-center justify-between px-2 py-1.5 mb-1">
                            <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">
                              Add Tag
                            </p>
                            <button
                              onClick={() => {
                                setRowTagMenuOpen(null);
                                setRowTagMenuPos(null);
                              }}
                            >
                              <X className="w-3 h-3 text-slate-400" />
                            </button>
                          </div>
                          {tags.length === 0 ? (
                            <p className="text-xs text-slate-400 px-2 py-2">
                              No tags yet. Create one from the Tags filter.
                            </p>
                          ) : (
                            tags.map((t) => (
                              <button
                                key={t.id}
                                onClick={() => {
                                  setRowTags((prev) => ({
                                    ...prev,
                                    [row.id]: [...(prev[row.id] ?? []), t.id],
                                  }));
                                  setRowTagMenuOpen(null);
                                  setRowTagMenuPos(null);
                                }}
                                className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded-lg text-left"
                              >
                                <span
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold"
                                  style={{
                                    background: t.color + "22",
                                    color: t.color,
                                    border: `1px solid ${t.color}55`,
                                  }}
                                >
                                  {t.name}
                                </span>
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}

            {/* ── Tag Create/Edit Modal ── */}
            {tagModal && (
              <>
                <div
                  className="fixed inset-0 bg-black/40 z-[300]"
                  onClick={() => {
                    setTagModal(null);
                    setTagMenuOpen(null);
                    setTagMenuPos(null);
                  }}
                />
                <div
                  className="fixed z-[310] bg-white rounded-2xl shadow-2xl"
                  style={{
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    width: 440,
                    maxWidth: "95vw",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-6 pt-6 pb-4">
                    <h2 className="text-lg font-bold text-slate-800">
                      {tagModal.mode === "create" ? "Add New Tag" : "Edit Tag"}
                    </h2>
                    <button
                      onClick={() => {
                        setTagModal(null);
                        setTagMenuPos(null);
                      }}
                      className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="px-6 pb-6 space-y-5">
                    {/* Tag Name */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Tag Name
                      </label>
                      <input
                        type="text"
                        value={tagModalName}
                        onChange={(e) => setTagModalName(e.target.value)}
                        placeholder="Write..."
                        className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent placeholder:text-slate-300 bg-slate-50"
                        autoFocus
                      />
                    </div>

                    {/* Color Picker */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">
                        Select color
                      </label>
                      <div className="flex items-center gap-2 flex-wrap">
                        {TAG_COLORS.map((color) => (
                          <button
                            key={color}
                            onClick={() => setTagModalColor(color)}
                            className="rounded-full transition-transform hover:scale-110"
                            style={{
                              width: 22,
                              height: 22,
                              background: color,
                              outline:
                                tagModalColor === color
                                  ? `3px solid ${color}`
                                  : "none",
                              outlineOffset: 2,
                              boxShadow:
                                tagModalColor === color
                                  ? `0 0 0 2px white, 0 0 0 4px ${color}`
                                  : "none",
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Preview */}
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 font-medium">
                        Preview:
                      </span>
                      <span
                        className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold"
                        style={{
                          background: tagModalColor + "22",
                          color: tagModalColor,
                          border: `1px solid ${tagModalColor}55`,
                        }}
                      >
                        {tagModalName || "Tag name"}
                      </span>
                    </div>

                    {/* Save button */}
                    <button
                      disabled={!tagModalName.trim()}
                      onClick={() => {
                        if (!tagModalName.trim()) return;
                        if (tagModal.mode === "create") {
                          const newTag: Tag = {
                            id: Date.now().toString(),
                            name: tagModalName.trim(),
                            color: tagModalColor,
                          };
                          setTags((prev) => [...prev, newTag]);
                        } else if (tagModal.tag) {
                          setTags((prev) =>
                            prev.map((t) =>
                              t.id === tagModal.tag!.id
                                ? {
                                    ...t,
                                    name: tagModalName.trim(),
                                    color: tagModalColor,
                                  }
                                : t,
                            ),
                          );
                        }
                        setTagModal(null);
                      }}
                      className="w-full h-11 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Leave Dialog */}
            <AlertDialog
              open={showLeaveDialog}
              onOpenChange={setShowLeaveDialog}
            >
              <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>Leave this page?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Unsaved filters and selections will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setShowLeaveDialog(false)}>
                    Stay
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={confirmLeave}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Yes, leave
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
