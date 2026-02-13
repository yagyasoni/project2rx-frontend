"use client";

import React, { useState, useRef, useEffect } from "react";
import AppSidebar from "@/components/Sidebar"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  ChevronDown,
  RotateCw,
  Filter,
  Download,
  SlidersHorizontal,
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function SortIcon({ dir }: { dir?: "asc" | "desc" }) {
  if (!dir)
    return (
      <ArrowUpDown className="w-3.5 h-3.5 ml-1.5 text-gray-400 transition-colors" />
    );
  if (dir === "asc")
    return (
      <span className="text-[11px] ml-1.5 text-emerald-600 font-bold">↑</span>
    );
  return (
    <span className="text-[11px] ml-1.5 text-emerald-600 font-bold">↓</span>
  );
}

function HeaderCell({
  children,
  sortKey,
  sortRules,
  onSort,
}: {
  children: React.ReactNode;
  sortKey: keyof (typeof inventoryData)[number];
  sortRules: SortRule[];
  onSort: (
    key: keyof (typeof inventoryData)[number],
    e: React.MouseEvent,
  ) => void;
}) {
  const active = sortRules.find((r) => r.key === sortKey)?.dir;

  return (
    <div
      onClick={(e) => onSort(sortKey, e)}
      className="h-full px-3 py-2.5 flex items-center justify-center gap-1 cursor-pointer select-none whitespace-nowrap transition-colors hover:bg-emerald-50/50"
    >
      <span className="text-[11px] font-bold uppercase tracking-wide text-slate-700">
        {children}
      </span>
      <SortIcon dir={active} />
    </div>
  );
}

const inventoryData = [
  {
    id: 1,
    ndc: "61958-2501-01",
    drugName: "BIKTARVY 50-200-25MG TAB",
    rank: 1,
    pkgSize: 30,
    totalOrdered: 2070,
    totalBilled: 3510,
    totalShortage: -1440,
    highestShortage: -500,
    cost: 1.69,
    horizon: 420,
    shortageHorizon: -40,
    express: 380,
    shortageExpress: -25,
    cvsCaremark: 300,
    shortageCvsCaremark: -15,
    ssc: 220,
    shortageSsc: -30,
    njMedicaid: 1320,
    shortageNjMedicaid: -44,
    pdmi: 750,
    shortagePdmi: -12,
    optumrx: 67,
    shortageOptumrx: -5,
  },
  {
    id: 2,
    ndc: "49702-0246-13",
    drugName: "DOVATO 50-300MG TAB",
    rank: 2,
    pkgSize: 30,
    totalOrdered: 360,
    totalBilled: 600,
    totalShortage: -240,
    highestShortage: -120,
    cost: 1.66,
    horizon: 90,
    shortageHorizon: -9,
    express: 110,
    shortageExpress: -5,
    cvsCaremark: 60,
    shortageCvsCaremark: -4,
    ssc: 30,
    shortageSsc: -2,
    njMedicaid: 150,
    shortageNjMedicaid: -9,
    pdmi: 210,
    shortagePdmi: -10,
    optumrx: 30,
    shortageOptumrx: -1,
  },
  {
    id: 3,
    ndc: "00093-7424-56",
    drugName: "ELIQUIS 5MG TAB",
    rank: 3,
    pkgSize: 60,
    totalOrdered: 1240,
    totalBilled: 1890,
    totalShortage: -650,
    highestShortage: -220,
    cost: 2.45,
    horizon: 310,
    shortageHorizon: -18,
    express: 420,
    shortageExpress: -30,
    cvsCaremark: 390,
    shortageCvsCaremark: -21,
    ssc: 140,
    shortageSsc: -12,
    njMedicaid: 600,
    shortageNjMedicaid: -25,
    pdmi: 180,
    shortagePdmi: -8,
    optumrx: 160,
    shortageOptumrx: -10,
  },
  {
    id: 4,
    ndc: "00071-0155-23",
    drugName: "LANTUS SOLOSTAR PEN",
    rank: 4,
    pkgSize: 5,
    totalOrdered: 780,
    totalBilled: 1120,
    totalShortage: -340,
    highestShortage: -150,
    cost: 3.25,
    horizon: 210,
    shortageHorizon: -15,
    express: 260,
    shortageExpress: -18,
    cvsCaremark: 190,
    shortageCvsCaremark: -10,
    ssc: 90,
    shortageSsc: -6,
    njMedicaid: 320,
    shortageNjMedicaid: -14,
    pdmi: 60,
    shortagePdmi: -4,
    optumrx: 80,
    shortageOptumrx: -5,
  },
  {
    id: 5,
    ndc: "65862-0520-01",
    drugName: "TRULICITY 1.5MG PEN",
    rank: 5,
    pkgSize: 4,
    totalOrdered: 920,
    totalBilled: 1340,
    totalShortage: -420,
    highestShortage: -180,
    cost: 4.1,
    horizon: 260,
    shortageHorizon: -22,
    express: 300,
    shortageExpress: -20,
    cvsCaremark: 240,
    shortageCvsCaremark: -16,
    ssc: 110,
    shortageSsc: -9,
    njMedicaid: 410,
    shortageNjMedicaid: -19,
    pdmi: 70,
    shortagePdmi: -6,
    optumrx: 90,
    shortageOptumrx: -7,
  },
  {
    id: 6,
    ndc: "00169-4130-68",
    drugName: "ATORVASTATIN 20MG TAB",
    rank: 6,
    pkgSize: 90,
    totalOrdered: 2100,
    totalBilled: 2400,
    totalShortage: -300,
    highestShortage: -120,
    cost: 0.42,
    horizon: 520,
    shortageHorizon: -35,
    express: 680,
    shortageExpress: -28,
    cvsCaremark: 510,
    shortageCvsCaremark: -20,
    ssc: 300,
    shortageSsc: -15,
    njMedicaid: 900,
    shortageNjMedicaid: -33,
    pdmi: 0,
    shortagePdmi: 0,
    optumrx: 260,
    shortageOptumrx: -12,
  },
  {
    id: 7,
    ndc: "00006-0582-61",
    drugName: "HUMALOG KWIKPEN",
    rank: 7,
    pkgSize: 5,
    totalOrdered: 640,
    totalBilled: 980,
    totalShortage: -340,
    highestShortage: -140,
    cost: 3.75,
    horizon: 180,
    shortageHorizon: -12,
    express: 220,
    shortageExpress: -16,
    cvsCaremark: 170,
    shortageCvsCaremark: -9,
    ssc: 85,
    shortageSsc: -5,
    njMedicaid: 300,
    shortageNjMedicaid: -13,
    pdmi: 40,
    shortagePdmi: -3,
    optumrx: 65,
    shortageOptumrx: -4,
  },
  {
    id: 8,
    ndc: "00002-8215-01",
    drugName: "XARELTO 20MG TAB",
    rank: 8,
    pkgSize: 30,
    totalOrdered: 980,
    totalBilled: 1450,
    totalShortage: -470,
    highestShortage: -200,
    cost: 2.95,
    horizon: 260,
    shortageHorizon: -19,
    express: 310,
    shortageExpress: -21,
    cvsCaremark: 280,
    shortageCvsCaremark: -18,
    ssc: 120,
    shortageSsc: -10,
    njMedicaid: 430,
    shortageNjMedicaid: -20,
    pdmi: 55,
    shortagePdmi: -4,
    optumrx: 95,
    shortageOptumrx: -6,
  },
  {
    id: 9,
    ndc: "00054-4713-25",
    drugName: "METFORMIN ER 500MG TAB",
    rank: 9,
    pkgSize: 120,
    totalOrdered: 2600,
    totalBilled: 2950,
    totalShortage: -350,
    highestShortage: -140,
    cost: 0.22,
    horizon: 610,
    shortageHorizon: -42,
    express: 780,
    shortageExpress: -34,
    cvsCaremark: 640,
    shortageCvsCaremark: -28,
    ssc: 350,
    shortageSsc: -19,
    njMedicaid: 980,
    shortageNjMedicaid: -41,
    pdmi: 0,
    shortagePdmi: 0,
    optumrx: 310,
    shortageOptumrx: -15,
  },
  {
    id: 10,
    ndc: "00093-5174-56",
    drugName: "OZEMPIC 1MG PEN",
    rank: 10,
    pkgSize: 1,
    totalOrdered: 540,
    totalBilled: 920,
    totalShortage: -380,
    highestShortage: -170,
    cost: 5.85,
    horizon: 150,
    shortageHorizon: -14,
    express: 210,
    shortageExpress: -17,
    cvsCaremark: 160,
    shortageCvsCaremark: -11,
    ssc: 75,
    shortageSsc: -6,
    njMedicaid: 260,
    shortageNjMedicaid: -12,
    pdmi: 30,
    shortagePdmi: -2,
    optumrx: 55,
    shortageOptumrx: -4,
  },

  {
    id: 11,
    ndc: "51672-1234-01",
    drugName: "FARXIGA 10MG TAB",
    rank: 11,
    pkgSize: 30,
    totalOrdered: 410,
    totalBilled: 620,
    totalShortage: -210,
    highestShortage: -90,
    cost: 2.88,
    horizon: 130,
    shortageHorizon: -12,
    express: 140,
    shortageExpress: -10,
    cvsCaremark: 110,
    shortageCvsCaremark: -8,
    ssc: 55,
    shortageSsc: -4,
    njMedicaid: 160,
    shortageNjMedicaid: -9,
    pdmi: 20,
    shortagePdmi: -2,
    optumrx: 45,
    shortageOptumrx: -3,
  },

  {
    id: 12,
    ndc: "00078-0450-89",
    drugName: "JARDIANCE 25MG TAB",
    rank: 12,
    pkgSize: 30,
    totalOrdered: 760,
    totalBilled: 980,
    totalShortage: -220,
    highestShortage: -110,
    cost: 3.4,
    horizon: 200,
    shortageHorizon: -16,
    express: 260,
    shortageExpress: -18,
    cvsCaremark: 190,
    shortageCvsCaremark: -13,
    ssc: 85,
    shortageSsc: -7,
    njMedicaid: 290,
    shortageNjMedicaid: -14,
    pdmi: 45,
    shortagePdmi: -3,
    optumrx: 90,
    shortageOptumrx: -6,
  },

  {
    id: 13,
    ndc: "00173-0456-02",
    drugName: "LISINOPRIL 10MG TAB",
    rank: 13,
    pkgSize: 90,
    totalOrdered: 3400,
    totalBilled: 3700,
    totalShortage: -300,
    highestShortage: -140,
    cost: 0.19,
    horizon: 800,
    shortageHorizon: -45,
    express: 920,
    shortageExpress: -38,
    cvsCaremark: 770,
    shortageCvsCaremark: -31,
    ssc: 410,
    shortageSsc: -22,
    njMedicaid: 1200,
    shortageNjMedicaid: -49,
    pdmi: 0,
    shortagePdmi: 0,
    optumrx: 360,
    shortageOptumrx: -18,
  },

  {
    id: 14,
    ndc: "00406-1239-02",
    drugName: "LEVOTHYROXINE 75MCG TAB",
    rank: 14,
    pkgSize: 90,
    totalOrdered: 2900,
    totalBilled: 3250,
    totalShortage: -350,
    highestShortage: -160,
    cost: 0.25,
    horizon: 720,
    shortageHorizon: -39,
    express: 880,
    shortageExpress: -36,
    cvsCaremark: 710,
    shortageCvsCaremark: -29,
    ssc: 380,
    shortageSsc: -21,
    njMedicaid: 1020,
    shortageNjMedicaid: -44,
    pdmi: 0,
    shortagePdmi: 0,
    optumrx: 330,
    shortageOptumrx: -17,
  },

  {
    id: 15,
    ndc: "00378-1112-05",
    drugName: "AMLODIPINE 5MG TAB",
    rank: 15,
    pkgSize: 90,
    totalOrdered: 3100,
    totalBilled: 3450,
    totalShortage: -350,
    highestShortage: -155,
    cost: 0.18,
    horizon: 760,
    shortageHorizon: -41,
    express: 910,
    shortageExpress: -37,
    cvsCaremark: 730,
    shortageCvsCaremark: -30,
    ssc: 390,
    shortageSsc: -23,
    njMedicaid: 1100,
    shortageNjMedicaid: -46,
    pdmi: 0,
    shortagePdmi: 0,
    optumrx: 350,
    shortageOptumrx: -19,
  },

  {
    id: 16,
    ndc: "00234-7741-11",
    drugName: "LOSARTAN 50MG TAB",
    rank: 16,
    pkgSize: 90,
    totalOrdered: 2800,
    totalBilled: 3100,
    totalShortage: -300,
    highestShortage: -135,
    cost: 0.21,
    horizon: 700,
    shortageHorizon: -37,
    express: 860,
    shortageExpress: -34,
    cvsCaremark: 690,
    shortageCvsCaremark: -27,
    ssc: 360,
    shortageSsc: -20,
    njMedicaid: 980,
    shortageNjMedicaid: -42,
    pdmi: 0,
    shortagePdmi: 0,
    optumrx: 310,
    shortageOptumrx: -16,
  },

  {
    id: 17,
    ndc: "00143-7741-09",
    drugName: "SERTRALINE 50MG TAB",
    rank: 17,
    pkgSize: 90,
    totalOrdered: 2500,
    totalBilled: 2900,
    totalShortage: -400,
    highestShortage: -180,
    cost: 0.33,
    horizon: 650,
    shortageHorizon: -33,
    express: 820,
    shortageExpress: -31,
    cvsCaremark: 660,
    shortageCvsCaremark: -26,
    ssc: 340,
    shortageSsc: -19,
    njMedicaid: 930,
    shortageNjMedicaid: -39,
    pdmi: 0,
    shortagePdmi: 0,
    optumrx: 290,
    shortageOptumrx: -14,
  },

  {
    id: 18,
    ndc: "00045-1452-03",
    drugName: "GABAPENTIN 300MG CAP",
    rank: 18,
    pkgSize: 180,
    totalOrdered: 3600,
    totalBilled: 3900,
    totalShortage: -300,
    highestShortage: -150,
    cost: 0.12,
    horizon: 880,
    shortageHorizon: -48,
    express: 1020,
    shortageExpress: -44,
    cvsCaremark: 820,
    shortageCvsCaremark: -36,
    ssc: 430,
    shortageSsc: -25,
    njMedicaid: 1300,
    shortageNjMedicaid: -52,
    pdmi: 0,
    shortagePdmi: 0,
    optumrx: 420,
    shortageOptumrx: -21,
  },

  {
    id: 19,
    ndc: "00182-3341-07",
    drugName: "PANTOPRAZOLE 40MG TAB",
    rank: 19,
    pkgSize: 90,
    totalOrdered: 2300,
    totalBilled: 2600,
    totalShortage: -300,
    highestShortage: -140,
    cost: 0.29,
    horizon: 600,
    shortageHorizon: -31,
    express: 780,
    shortageExpress: -29,
    cvsCaremark: 620,
    shortageCvsCaremark: -24,
    ssc: 320,
    shortageSsc: -18,
    njMedicaid: 880,
    shortageNjMedicaid: -37,
    pdmi: 0,
    shortagePdmi: 0,
    optumrx: 270,
    shortageOptumrx: -13,
  },

  {
    id: 20,
    ndc: "00031-4587-22",
    drugName: "OMEPRAZOLE 20MG CAP",
    rank: 20,
    pkgSize: 180,
    totalOrdered: 4100,
    totalBilled: 4500,
    totalShortage: -400,
    highestShortage: -190,
    cost: 0.14,
    horizon: 980,
    shortageHorizon: -52,
    express: 1150,
    shortageExpress: -48,
    cvsCaremark: 930,
    shortageCvsCaremark: -39,
    ssc: 480,
    shortageSsc: -28,
    njMedicaid: 1450,
    shortageNjMedicaid: -58,
    pdmi: 0,
    shortagePdmi: 0,
    optumrx: 470,
    shortageOptumrx: -24,
  },

  {
    id: 19,
    ndc: "00182-3341-07",
    drugName: "PANTOPRAZOLE 40MG TAB",
    rank: 19,
    pkgSize: 90,
    totalOrdered: 2300,
    totalBilled: 2600,
    totalShortage: -300,
    highestShortage: -140,
    cost: 0.29,
    horizon: 600,
    shortageHorizon: -31,
    express: 780,
    shortageExpress: -29,
    cvsCaremark: 620,
    shortageCvsCaremark: -24,
    ssc: 320,
    shortageSsc: -18,
    njMedicaid: 880,
    shortageNjMedicaid: -37,
    pdmi: 0,
    shortagePdmi: 0,
    optumrx: 270,
    shortageOptumrx: -13,
  },

  {
    id: 20,
    ndc: "00031-4587-22",
    drugName: "OMEPRAZOLE 20MG CAP",
    rank: 20,
    pkgSize: 180,
    totalOrdered: 4100,
    totalBilled: 4500,
    totalShortage: -400,
    highestShortage: -190,
    cost: 0.14,
    horizon: 980,
    shortageHorizon: -52,
    express: 1150,
    shortageExpress: -48,
    cvsCaremark: 930,
    shortageCvsCaremark: -39,
    ssc: 480,
    shortageSsc: -28,
    njMedicaid: 1450,
    shortageNjMedicaid: -58,
    pdmi: 0,
    shortagePdmi: 0,
    optumrx: 470,
    shortageOptumrx: -24,
  },
  {
    id: 19,
    ndc: "00182-3341-07",
    drugName: "PANTOPRAZOLE 40MG TAB",
    rank: 19,
    pkgSize: 90,
    totalOrdered: 2300,
    totalBilled: 2600,
    totalShortage: -300,
    highestShortage: -140,
    cost: 0.29,
    horizon: 600,
    shortageHorizon: -31,
    express: 780,
    shortageExpress: -29,
    cvsCaremark: 620,
    shortageCvsCaremark: -24,
    ssc: 320,
    shortageSsc: -18,
    njMedicaid: 880,
    shortageNjMedicaid: -37,
    pdmi: 0,
    shortagePdmi: 0,
    optumrx: 270,
    shortageOptumrx: -13,
  },

  {
    id: 20,
    ndc: "00031-4587-22",
    drugName: "OMEPRAZOLE 20MG CAP",
    rank: 20,
    pkgSize: 180,
    totalOrdered: 4100,
    totalBilled: 4500,
    totalShortage: -400,
    highestShortage: -190,
    cost: 0.14,
    horizon: 980,
    shortageHorizon: -52,
    express: 1150,
    shortageExpress: -48,
    cvsCaremark: 930,
    shortageCvsCaremark: -39,
    ssc: 480,
    shortageSsc: -28,
    njMedicaid: 1450,
    shortageNjMedicaid: -58,
    pdmi: 0,
    shortagePdmi: 0,
    optumrx: 470,
    shortageOptumrx: -24,
  },
  {
    id: 19,
    ndc: "00182-3341-07",
    drugName: "PANTOPRAZOLE 40MG TAB",
    rank: 19,
    pkgSize: 90,
    totalOrdered: 2300,
    totalBilled: 2600,
    totalShortage: -300,
    highestShortage: -140,
    cost: 0.29,
    horizon: 600,
    shortageHorizon: -31,
    express: 780,
    shortageExpress: -29,
    cvsCaremark: 620,
    shortageCvsCaremark: -24,
    ssc: 320,
    shortageSsc: -18,
    njMedicaid: 880,
    shortageNjMedicaid: -37,
    pdmi: 0,
    shortagePdmi: 0,
    optumrx: 270,
    shortageOptumrx: -13,
  },

  {
    id: 20,
    ndc: "00031-4587-22",
    drugName: "OMEPRAZOLE 20MG CAP",
    rank: 20,
    pkgSize: 180,
    totalOrdered: 4100,
    totalBilled: 4500,
    totalShortage: -400,
    highestShortage: -190,
    cost: 0.14,
    horizon: 980,
    shortageHorizon: -52,
    express: 1150,
    shortageExpress: -48,
    cvsCaremark: 930,
    shortageCvsCaremark: -39,
    ssc: 480,
    shortageSsc: -28,
    njMedicaid: 1450,
    shortageNjMedicaid: -58,
    pdmi: 0,
    shortagePdmi: 0,
    optumrx: 470,
    shortageOptumrx: -24,
  },
];

interface FilterChip {
  id: string;
  label: string;
  value: string;
}

export default function InventoryReportPage() {
  const [openExportModal, setOpenExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<"csv" | "excel" | "pdf">(
    "excel",
  );
  const [exportScope, setExportScope] = useState<"visible" | "all">("visible");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterChip[]>([
    { id: "pkgSize", label: "PKG SIZE", value: "PKG SIZE" },
    { id: "cost", label: "$ COST", value: "$ COST" },
  ]);
  const [qtyType, setQtyType] = useState<"UNIT" | "PKG SIZE" | null>("UNIT");
  const [openQtyDropdown, setOpenQtyDropdown] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [openFlagDropdown, setOpenFlagDropdown] = useState(false);
  const [flagFilters, setFlagFilters] = useState<string[]>([]);
  const [openTagsDropdown, setOpenTagsDropdown] = useState(false);
  const [openTagMenuId, setOpenTagMenuId] = useState<string | null>(null);
  const [openCreateTagModal, setOpenCreateTagModal] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("yellow");
  const [openDrugTypeDropdown, setOpenDrugTypeDropdown] = useState(false);
  const [drugTypes, setDrugTypes] = useState<string[]>(["ALL DRUGS"]);
  const [costValue, setCostValue] = useState<number | "">("");
  const [openDrugSidebar, setOpenDrugSidebar] = useState(false);
  const [activeDrug, setActiveDrug] = useState<
    (typeof inventoryData)[number] | null
  >(null);

const [selectedTags, setSelectedTags] = useState<string[]>([]);
const [controlledSchedules, setControlledSchedules] = useState<string[]>([]);
const headerScrollRef = useRef<HTMLDivElement>(null);
const bodyScrollRef = useRef<HTMLDivElement>(null);
const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // default shrinked

const frozenColumnsWidth =
  48 + 110 + 150 + 260 + 115 + 158; 
// checkbox + rank + ndc + drugName + pkgSize + totalOrdered

const scrollAreaMinWidth = 2600;
  
// ADD THIS useEffect TO SYNC SCROLLING
useEffect(() => {
  const headerEl = headerScrollRef.current;
  const bodyEl = bodyScrollRef.current;

  if (!headerEl || !bodyEl) return;

  const syncScroll = (e: Event) => {
    const target = e.target as HTMLElement;
    if (target === bodyEl && headerEl) {
      headerEl.scrollLeft = bodyEl.scrollLeft;
    }
  };

  bodyEl.addEventListener('scroll', syncScroll);
  return () => bodyEl.removeEventListener('scroll', syncScroll);
}, []);

  const filterDropdownRef = useRef<HTMLDivElement | null>(null);

  const availableTags = [
    { id: "high-priority", label: "High Priority", color: "red" },
    { id: "shortage-alert", label: "Shortage Alert", color: "orange" },
    { id: "reorder-soon", label: "Reorder Soon", color: "yellow" },
    { id: "cost-effective", label: "Cost Effective", color: "green" },
    { id: "generic", label: "Generic", color: "blue" },
    { id: "brand-name", label: "Brand Name", color: "purple" },
  ];

  const availablePBMs = [
    "Horizon",
    "Express",
    "CVS Caremark",
    "SSC",
    "NJ Medicaid",
    "PDMI",
    "OptumRx",
  ];

  const supplierToColumnKey: Record<string, keyof typeof columnWidths> = {
    Horizon: "horizon",
    Express: "express",
    "CVS Caremark": "cvsCaremark",
    SSC: "ssc",
    "NJ Medicaid": "njMedicaid",
    PDMI: "pdmi",
    OptumRx: "optumrx",
  };

  const [pbmFilters, setPbmFilters] = useState(availablePBMs);

  interface SortRule {
    key: keyof (typeof inventoryData)[number];
    dir: "asc" | "desc";
  }
  const [sortRules, setSortRules] = useState<SortRule[]>([
    { key: "totalShortage", dir: "asc" },
  ]);

  const removeFilter = (chipId: string) => {
    setActiveFilters((prev) => prev.filter((c) => c.id !== chipId));
  };

  const toggleFlagFilter = (flag: string) => {
    setFlagFilters((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag],
    );
  };

 const togglePBMFilter = (pbm: string) => {
  setPbmFilters((prev) => {
    const isOn = prev.includes(pbm);

    // Toggle PBM filter list
    const next = isOn ? prev.filter((p) => p !== pbm) : [...prev, pbm];

    // Map PBM -> column keys
    const baseKey = supplierToColumnKey[pbm];
    if (baseKey) {
      setColumnFilters((cols) => ({
        ...cols,
        [baseKey]: !isOn,
        [`shortage${baseKey.charAt(0).toUpperCase()}${baseKey.slice(1)}`]:
          !isOn,
      }));
    }

    return next;
  });
};

  const handleSort = (
    key: keyof (typeof inventoryData)[number],
    e: React.MouseEvent,
  ) => {
    const index = sortRules.findIndex((r) => r.key === key);
    let newRules = [...sortRules];

    if (index === -1) {
      if (e.shiftKey) {
        newRules.push({ key, dir: "asc" });
      } else {
        newRules = [{ key, dir: "asc" }];
      }
    } else {
      const current = newRules[index];
      if (current.dir === "asc") {
        newRules[index] = { key, dir: "desc" };
      } else {
        newRules.splice(index, 1);
      }
    }

    setSortRules(newRules);
  };

  const sortedData = [...inventoryData].sort((a, b) => {
    for (const rule of sortRules) {
      const aVal = a[rule.key];
      const bVal = b[rule.key];

      let cmp = 0;
      if (typeof aVal === "number" && typeof bVal === "number") {
        cmp = aVal - bVal;
      } else {
        cmp = String(aVal).localeCompare(String(bVal));
      }

      if (cmp !== 0) {
        return rule.dir === "asc" ? cmp : -cmp;
      }
    }
    return 0;
  });

  const filteredData = sortedData.filter((row) => {
    const lowerQuery = searchQuery.toLowerCase();
    const matchesSearch =
      row.drugName.toLowerCase().includes(lowerQuery) ||
      row.ndc.toLowerCase().includes(lowerQuery);
    return matchesSearch;
  });

  const totalRows = filteredData.length;

  const [rowsPerPage, setRowsPerPage] = useState(inventoryData.length);
  const [currentPage, setCurrentPage] = useState(1);

useEffect(() => {
  // If user hasn't manually chosen a smaller value, keep showing all rows
  setRowsPerPage((prev) => {
    if (prev >= totalRows) return totalRows; // stay in "All"
    return prev;
  });
}, [totalRows]);



  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const rowOptions = [10, 20, 50, 100, totalRows].filter(
  (v, i, arr) => v > 0 && arr.indexOf(v) === i,
);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleRowSelection = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === paginatedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(paginatedData.map((r) => r.id));
    }
  };

  const renderShortageValue = (val: number) => {
    if (val === 0) return <span className="text-slate-400 font-medium">—</span>;
    return (
      <span
        className={
          val < 0
            ? "text-red-600 font-semibold"
            : "text-emerald-600 font-semibold"
        }
      >
        {val}
      </span>
    );
  };

  const [columnFilters, setColumnFilters] = useState({
    rank: true,
    ndc: true,
    drugName: true,
    pkgSize: true,
    totalOrdered: true,
    totalBilled: true,
    totalShortage: true,
    highestShortage: true,
    cost: true,
    horizon: true,
    shortageHorizon: true,
    express: true,
    shortageExpress: true,
    cvsCaremark: true,
    shortageCvsCaremark: true,
    ssc: true,
    shortageSsc: true,
    njMedicaid: true,
    shortageNjMedicaid: true,
    pdmi: true,
    shortagePdmi: true,
    optumrx: true,
    shortageOptumrx: true,
  });

  const columnWidths: Record<keyof typeof columnFilters, string> = {
    rank: "min-w-[110px]",
    ndc: "min-w-[150px]",
    drugName: "min-w-[260px]",
    pkgSize: "min-w-[115px]",
    totalOrdered: "min-w-[158px]",
    totalBilled: "min-w-[141px]",
    totalShortage: "min-w-[160px]",
    highestShortage: "min-w-[180px]",
    cost: "min-w-[110px]",
    horizon: "min-w-[120px]",
    shortageHorizon: "min-w-[182px]",
    express: "min-w-[120px]",
    shortageExpress: "min-w-[180px]",
    cvsCaremark: "min-w-[160px]",
    shortageCvsCaremark: "min-w-[222px]",
    ssc: "min-w-[90px]",
    shortageSsc: "min-w-[152px]",
    njMedicaid: "min-w-[140px]",
    shortageNjMedicaid: "min-w-[160px]",
    pdmi: "min-w-[100px]",
    shortagePdmi: "min-w-[170px]",
    optumrx: "min-w-[121px]",
    shortageOptumrx: "min-w-[191px]",
  };

  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);

const supplierColumnMap: Record<string, { key: string; width: string }> = {
  Kinray: { key: "supplier_Kinray", width: "min-w-[140px]" },
  McKesson: { key: "supplier_McKesson", width: "min-w-[140px]" },
  "Real Value Rx": { key: "supplier_RealValueRx", width: "min-w-[160px]" },
  Parmed: { key: "supplier_Parmed", width: "min-w-[140px]" },
  Axia: { key: "supplier_Axia", width: "min-w-[120px]" },
  Citymed: { key: "supplier_Citymed", width: "min-w-[140px]" },
  "Legacy Health": { key: "supplier_LegacyHealth", width: "min-w-[160px]" },
  "NDC Distributors": { key: "supplier_NDCDistributors", width: "min-w-[180px]" },
  TruMarker: { key: "supplier_TruMarker", width: "min-w-[140px]" },
};

  const toggleColumn = (col: keyof typeof columnFilters) => {
    setColumnFilters((prev) => ({ ...prev, [col]: !prev[col] }));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(e.target as Node)
      ) {
        closeAllDropdowns();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleExport = () => {
  const rows =
    exportScope === "visible" ? paginatedData : filteredData;

  if (!rows.length) return;

  if (exportFormat === "csv") {
    exportCSV(rows);
  }

  if (exportFormat === "excel") {
    exportCSV(rows, "xlsx"); // Excel compatible CSV
  }

  if (exportFormat === "pdf") {
    exportPDF(rows);
  }

  setOpenExportModal(false);
};

const exportCSV = (rows: any[], ext: "csv" | "xlsx" = "csv") => {
  const headers = Object.keys(rows[0]);

  const csv = [
    headers.join(","),
    ...rows.map((r) =>
      headers.map((h) => JSON.stringify(r[h] ?? "")).join(","),
    ),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `inventory-report.${ext}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const exportPDF = (rows: any[]) => {
  const w = window.open("", "_blank");
  if (!w) return;

  w.document.write(`
    <html>
      <head>
        <title>Inventory Report</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          table { border-collapse: collapse; width: 100%; }
          th, td { border: 1px solid #ccc; padding: 6px; font-size: 12px; }
          th { background: #f3f4f6; }
        </style>
      </head>
      <body>
        <h2>Inventory Report</h2>
        <table>
          <thead>
            <tr>
              ${Object.keys(rows[0])
                .map((h) => `<th>${h}</th>`)
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (r) => `
              <tr>
                ${Object.values(r)
                  .map((v) => `<td>${v ?? ""}</td>`)
                  .join("")}
              </tr>`,
              )
              .join("")}
          </tbody>
        </table>
        <script>
          window.print();
        </script>
      </body>
    </html>
  `);
};

  const handleDrugTypeToggle = (dtype: string) => {
    setDrugTypes((prev) =>
      prev.includes(dtype) ? prev.filter((d) => d !== dtype) : [...prev, dtype],
    );
  };

  const colorClasses: Record<string, string> = {
    red: "bg-red-100 text-red-800",
    orange: "bg-orange-100 text-orange-800",
    yellow: "bg-yellow-100 text-yellow-800",
    green: "bg-green-100 text-green-800",
    blue: "bg-blue-100 text-blue-800",
    purple: "bg-purple-100 text-purple-800",
  };

  const handleCreateTag = () => {
    console.log("Creating tag:", { name: newTagName, color: newTagColor });
    setOpenCreateTagModal(false);
    setNewTagName("");
    setNewTagColor("yellow");
  };

  const closeAllDropdowns = () => {
  setOpenFilter(false);
  setOpenFlagDropdown(false);
  setOpenTagsDropdown(false);
  setOpenQtyDropdown(false);
  setOpenDrugTypeDropdown(false);
};

  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const fromDate = formatDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const toDate = formatDate(new Date());

  return (
  <div className="relative h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-50">
  <div className="relative h-full w-full flex overflow-hidden">

    
    {/* LEFT SIDEBAR (collapsed by default) */}
  <div className={`flex-shrink-0 transition-all ... ${sidebarCollapsed ? "w-[64px]" : "w-[260px]"}`}
          style={{ zIndex: 100 }}>
  <AppSidebar
    collapsed={sidebarCollapsed}
    onToggle={() => setSidebarCollapsed((v) => !v)}
  />
</div>


    {/* RIGHT PAGE CONTENT */}
    <div className="flex-1 min-w-0 flex flex-col overflow-hidden transition-all duration-300 ease-in-out">

      {/* Enhanced Header */}
      
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
              INENTORY REPORT
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Comprehensive pharmaceutical inventory analytics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4">
  {/* Inventory Dates */}
  <div className="flex items-start gap-3 bg-white px-4 -py-1 rounded-xl border border-slate-200 shadow-sm">
    <div className="mt-1 h-2 w-2 rounded-full bg-red-500" />
    <div>
      <div className="text-[11px] font-bold tracking-wide text-slate-700 uppercase">
        Inventory Dates
      </div>
      <div className="flex items-center gap-3 mt-1">
        <div>
          <div className="text-[10px] font-semibold text-red-600 uppercase">
            Start
          </div>
          <div className="text-sm font-semibold text-slate-900">
            {fromDate}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-semibold text-red-600 uppercase">
            End
          </div>
          <div className="text-sm font-semibold text-slate-900">
            {toDate}
          </div>
        </div>
      </div>
    </div>
  </div>

  {/* Wholesaler Dates */}
  <div className="flex items-start gap-3 bg-white px-4 -py-1 rounded-xl border border-slate-200 shadow-sm">
    <div className="mt-1 h-2 w-2 rounded-full bg-emerald-600" />
    <div>
      <div className="text-[11px] font-bold tracking-wide text-slate-700 uppercase">
        Wholesaler Dates
      </div>
      <div className="flex items-center gap-3 mt-1">
        <div>
          <div className="text-[10px] font-semibold text-emerald-700 uppercase">
            Start
          </div>
          <div className="text-sm font-semibold text-slate-900">
            {fromDate}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-semibold text-emerald-700 uppercase">
            End
          </div>
          <div className="text-sm font-semibold text-slate-900">
            {toDate}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => setOpenExportModal(true)}
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Filter Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[300px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by drug name or NDC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-10 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Filter Dropdowns */}
            {/* 1️⃣ Columns */}
<div className="relative" ref={filterDropdownRef}>
  <Button
    variant="outline"
    size="sm"
    className="gap-2 border-slate-300"
    onClick={() => {
  closeAllDropdowns();
  setOpenFilter((v) => !v);
}}
  >
    <SlidersHorizontal className="h-3.5 w-3.5" />
    Filter
    <ChevronDown className="h-3.5 w-3.5" />
  </Button>


  {openFilter && (
  <div className="absolute -left-100 top-full mt-2 w-[900px] max-w-[95vw] bg-white border border-slate-200 rounded-xl shadow-2xl z-50">
    {/* Header */}
    <div className="flex items-center justify-between px-5 py-3 border-b">
      <h3 className="text-sm font-bold tracking-wide">FILTERS</h3>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => {
          // optional reset
          setPbmFilters(availablePBMs)
          setFlagFilters([])
        }}>
          Reset Filters
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setOpenFilter(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>

    {/* Content */}
    <div className="grid grid-cols-3 gap-0 max-h-[70vh] overflow-y-auto">
      {/* LEFT */}
      <div className="p-4 border-r">
        <div className="text-xs font-bold text-slate-600 mb-2">COLUMNS</div>

        {(["ndc","pkgSize","rank","totalOrdered","totalBilled","totalShortage","highestShortage","cost"] as const).map(col => (
          <label key={col} className="flex items-center gap-2 py-1 text-sm">
            <Checkbox checked={columnFilters[col]} onCheckedChange={() => toggleColumn(col)} />
            {col.replace(/([A-Z])/g, " $1").toUpperCase()}
          </label>
        ))}

        <div className="text-xs font-bold text-slate-600 mt-5 mb-2">SHOW LABEL</div>
        <label className="flex items-center gap-2 text-sm py-1"><Checkbox /> SHOW ABERRANT</label>
        <label className="flex items-center gap-2 text-sm py-1"><Checkbox /> CONTROLLED</label>
        <label className="flex items-center gap-2 text-sm py-1"><Checkbox /> FILTER NDC PERIOD</label>

        <div className="text-xs font-bold text-slate-600 mt-5 mb-2">OPTIONS</div>
        {[
          "VERTICAL HEADER",
          "REMOVE NDC DASH",
          "SHORT NDC'S ONLY",
          "INCLUDE SHORTAGE",
          "HIGHEST SHORTAGE NAME",
          "INCLUDE AMOUNT",
          "INCLUDE PBM RANK",
          "FILTER BY NOTE",
          "CASH DISABLED",
        ].map(opt => (
          <div key={opt} className="flex items-center justify-between py-1 text-sm">
            <span>{opt}</span>
            <Checkbox />
          </div>
        ))}
      </div>

      {/* MIDDLE */}
      <div className="p-4 border-r">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-2">
          <span className="h-2 w-2 rounded-full bg-red-500" /> BILLED
        </div>

        {availablePBMs.map(pbm => (
          <label key={pbm} className="flex items-center gap-2 py-1 text-sm">
            <Checkbox checked={pbmFilters.includes(pbm)} onCheckedChange={() => togglePBMFilter(pbm)} />
            {pbm}
          </label>
        ))}
      </div>

      {/* RIGHT */}
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-2">
          <span className="h-2 w-2 rounded-full bg-emerald-600" /> SUPPLIERS
        </div>

        {Object.keys(supplierColumnMap).map((s) => (
  <label key={s} className="flex items-center gap-2 py-1 text-sm">
    <Checkbox
      checked={selectedSuppliers.includes(s)}
      onCheckedChange={() =>
        setSelectedSuppliers((prev) =>
          prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
        )
      }
    />
    {s}
  </label>
))}
      </div>
    </div>
  </div>
)}

</div>

{/* 2️⃣ Flags */}
<div className="relative">
  <Button
    variant="outline"
    size="sm"
    className="gap-2 border-slate-300"
    onClick={() => {
  closeAllDropdowns();
  setOpenFlagDropdown((v) => !v);
}}
  >
    <Filter className="h-3.5 w-3.5" />
    FLAGS
    <ChevronDown className="h-3.5 w-3.5" />
  </Button>

  {openFlagDropdown && (
    <div className="absolute right-0 top-full mt-2 w-[260px] bg-white border border-slate-200 rounded-xl shadow-xl z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <span className="text-sm font-bold">FLAGS</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0"
          onClick={() => setOpenFlagDropdown(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Aberrant */}
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={flagFilters.includes("aberrant")}
            onCheckedChange={() =>
              setFlagFilters((prev) =>
                prev.includes("aberrant")
                  ? prev.filter((f) => f !== "aberrant")
                  : [...prev, "aberrant"],
              )
            }
          />
          ABERRANT <span className="text-xs text-slate-400">(9)</span>
        </label>

        {/* Controlled */}
        <label className="flex items-center gap-2 text-sm font-medium">
          <Checkbox
            checked={flagFilters.includes("controlled")}
            onCheckedChange={() =>
              setFlagFilters((prev) =>
                prev.includes("controlled")
                  ? prev.filter((f) => f !== "controlled")
                  : [...prev, "controlled"],
              )
            }
          />
          CONTROLLED SUBSTANCE <span className="text-xs text-slate-400">(34)</span>
        </label>

        {/* Controlled Schedules */}
        <div className="pl-6 space-y-1">
          {(["CI", "CII", "CIII", "CIV", "CV"] as const).map((c) => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={controlledSchedules.includes(c)}
                onCheckedChange={() =>
                  setControlledSchedules((prev) =>
                    prev.includes(c)
                      ? prev.filter((x) => x !== c)
                      : [...prev, c],
                  )
                }
              />
              {c}
            </label>
          ))}
        </div>
      </div>
    </div>
  )}
</div>


{/* 3️⃣ Tags */}
<div className="relative">
  <Button
    variant="outline"
    size="sm"
    className="gap-2 border-slate-300"
   onClick={() => {
  closeAllDropdowns();
  setOpenTagsDropdown((v) => !v);
}}
  >
    TAGS
    <ChevronDown className="h-3.5 w-3.5" />
  </Button>

  {openTagsDropdown && (
    <div className="absolute right-0 top-full mt-2 w-[320px] bg-white border border-slate-200 rounded-xl shadow-xl z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <span className="text-sm font-bold">TAGS</span>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-emerald-600 hover:bg-emerald-50 h-7 px-2"
            onClick={() => setOpenCreateTagModal(true)}
          >
            + Create Tag
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => setOpenTagsDropdown(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tag List */}
      <div className="p-3 space-y-2 max-h-[300px] overflow-y-auto">
        {availableTags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center justify-between gap-2 group"
          >
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedTags.includes(tag.id)}
                onCheckedChange={() =>
                  setSelectedTags((prev) =>
                    prev.includes(tag.id)
                      ? prev.filter((t) => t !== tag.id)
                      : [...prev, tag.id],
                  )
                }
              />

              <span
                className={`px-2 py-0.5 rounded-md text-xs font-semibold border ${colorClasses[tag.color]}`}
              >
                {tag.label} <span className="ml-1 text-[10px]">0</span>
              </span>
            </label>

            {/* 3-dot menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100"
                onClick={() =>
                  setOpenTagMenuId((prev) =>
                    prev === tag.id ? null : tag.id,
                  )
                }
              >
                ⋮
              </Button>

              {openTagMenuId === tag.id && (
                <div className="absolute right-0 mt-1 w-28 bg-white border rounded-md shadow-lg z-50">
                  <button
                    className="w-full px-3 py-1.5 text-sm text-left hover:bg-slate-50"
                    onClick={() => {
                      console.log("Edit tag", tag.id);
                      setOpenTagMenuId(null);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="w-full px-3 py-1.5 text-sm text-left text-red-600 hover:bg-red-50"
                    onClick={() => {
                      console.log("Delete tag", tag.id);
                      setOpenTagMenuId(null);
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</div>


{/* 4️⃣ QTY Type */}
<DropdownMenu
  open={openQtyDropdown}
  onOpenChange={(v) => {
    if (v) closeAllDropdowns();
    setOpenQtyDropdown(v);
  }}
>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" size="sm" className="gap-2 border-slate-300">
      QTY
      <ChevronDown className="h-3.5 w-3.5" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-48">
    <DropdownMenuCheckboxItem
      checked={qtyType === "UNIT"}
      onCheckedChange={() => setQtyType("UNIT")}
    >
      UNIT
    </DropdownMenuCheckboxItem>
    <DropdownMenuCheckboxItem
      checked={qtyType === "PKG SIZE"}
      onCheckedChange={() => setQtyType("PKG SIZE")}
    >
      PKG SIZE
    </DropdownMenuCheckboxItem>
  </DropdownMenuContent>
</DropdownMenu>

{/* 5️⃣ Drug Type */}
<DropdownMenu
  open={openDrugTypeDropdown}
  onOpenChange={(v) => {
    if (v) closeAllDropdowns();
    setOpenDrugTypeDropdown(v);
  }}
>
  <DropdownMenuTrigger asChild>
    <Button variant="outline" size="sm" className="gap-2 border-slate-300">
      TYPE
      <ChevronDown className="h-3.5 w-3.5" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-48">
    <DropdownMenuCheckboxItem
      checked={drugTypes.includes("ALL DRUGS")}
      onCheckedChange={() => handleDrugTypeToggle("ALL DRUGS")}
    >
      ALL DRUGS
    </DropdownMenuCheckboxItem>
    <DropdownMenuCheckboxItem
      checked={drugTypes.includes("BRAND")}
      onCheckedChange={() => handleDrugTypeToggle("BRAND")}
    >
      BRAND
    </DropdownMenuCheckboxItem>
    <DropdownMenuCheckboxItem
      checked={drugTypes.includes("GENERIC")}
      onCheckedChange={() => handleDrugTypeToggle("GENERIC")}
    >
      GENERIC
    </DropdownMenuCheckboxItem>
  </DropdownMenuContent>
</DropdownMenu>

{/* 6️⃣ Drug Cost */}
<div className="flex items-center gap-2">
  <Input
    type="number"
    placeholder="Max Cost"
    value={costValue}
    onChange={(e) => setCostValue(Number(e.target.value) || "")}
    className="w-[110px] h-9 border-slate-300"
  />
</div>

{/* 7️⃣ Rows */}

<Select
  value={String(rowsPerPage)}
  onValueChange={(v) => setRowsPerPage(Number(v))}
>
  <SelectTrigger className="w-[120px] h-9 border-slate-300">
    <SelectValue placeholder={`Rows: ${rowsPerPage}/${totalRows}`} />
  </SelectTrigger>
  <SelectContent>
    {rowOptions.map((n) => (
      <SelectItem key={n} value={String(n)}>
        {n === totalRows ? `All (${totalRows})` : n}
      </SelectItem>
    ))}
  </SelectContent>
</Select>


          </div>
        </div>

        {/* Active Filters */}
        {(activeFilters.length > 0 || costValue !== "") && (
          <div className="px-6 pb-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium text-slate-600">
              Active filters:
            </span>
            {activeFilters.map((chip) => (
              <Badge
                key={chip.id}
                variant="secondary"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
              >
                <span className="text-xs font-medium">{chip.label}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-3.5 w-3.5 p-0 hover:bg-transparent"
                  onClick={() => removeFilter(chip.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
            {costValue !== "" && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
              >
                <span className="text-xs font-medium">Cost: ${costValue}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-3.5 w-3.5 p-0 hover:bg-transparent"
                  onClick={() => setCostValue("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}
      </div>




{/* Table Container - FIXED VERSION */}
<div className="flex-1 bg-white relative overflow-hidden flex flex-col min-w-0 z-0">

  {/* STATIC HEADER - Scrollbar hidden, syncs with body */}
  <div 
  ref={headerScrollRef}
  className="flex-shrink-0 border-b-2 border-slate-200 shadow-sm bg-white overflow-hidden"
>
    <div className="min-w-max">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12 border-r border-slate-200 bg-white h-[52px]">
              <div className="flex items-center justify-center">
                <Checkbox
                  checked={
                    selectedRows.length === paginatedData.length &&
                    paginatedData.length > 0
                  }
                  onCheckedChange={toggleSelectAll}
                />
              </div>
            </TableHead>

            {columnFilters.rank && (
              <TableHead className={`${columnWidths.rank} border-r border-slate-200 bg-white h-[52px] `}>
                <HeaderCell sortKey="rank" sortRules={sortRules} onSort={handleSort}>
                  Rank
                </HeaderCell>
              </TableHead>
            )}

            {columnFilters.ndc && (
              <TableHead className={`${columnWidths.ndc} border-r border-slate-200 bg-white h-[52px]`}>
                <HeaderCell sortKey="ndc" sortRules={sortRules} onSort={handleSort}>
                  NDC
                </HeaderCell>
              </TableHead>
            )}

            {columnFilters.drugName && (
              <TableHead className={`${columnWidths.drugName} border-r border-slate-200 bg-white h-[52px]`}>
                <HeaderCell sortKey="drugName" sortRules={sortRules} onSort={handleSort}>
                  Drug Name
                </HeaderCell>
              </TableHead>
            )}

            {columnFilters.pkgSize && (
              <TableHead className={`${columnWidths.pkgSize} border-r border-slate-200 bg-white h-[52px]`}>
                <HeaderCell sortKey="pkgSize" sortRules={sortRules} onSort={handleSort}>
                  PKG Size
                </HeaderCell>
              </TableHead>
            )}

            {columnFilters.totalOrdered && (
              <TableHead className={`${columnWidths.totalOrdered} border-r border-slate-200 bg-white h-[52px]`}>
                <HeaderCell sortKey="totalOrdered" sortRules={sortRules} onSort={handleSort}>
                  Total Ordered
                </HeaderCell>
              </TableHead>
            )}

            {columnFilters.totalBilled && (
              <TableHead className={`${columnWidths.totalBilled} border-r border-slate-200 bg-white h-[52px]`}>
                <HeaderCell sortKey="totalBilled" sortRules={sortRules} onSort={handleSort}>
                  Total Billed
                </HeaderCell>
              </TableHead>
            )}

            {columnFilters.totalShortage && (
              <TableHead className={`${columnWidths.totalShortage} border-r border-slate-200 bg-white h-[52px]`}>
                <HeaderCell sortKey="totalShortage" sortRules={sortRules} onSort={handleSort}>
                  Total Shortage
                </HeaderCell>
              </TableHead>
            )}

            {columnFilters.highestShortage && (
              <TableHead className={`${columnWidths.highestShortage} border-r border-slate-200 bg-white h-[52px]`}>
                <HeaderCell sortKey="highestShortage" sortRules={sortRules} onSort={handleSort}>
                  Highest Shortage
                </HeaderCell>
              </TableHead>
            )}

            {columnFilters.cost && (
              <TableHead className={`${columnWidths.cost} border-r border-slate-200 bg-white h-[52px]`}>
                <HeaderCell sortKey="cost" sortRules={sortRules} onSort={handleSort}>
                  $ Cost
                </HeaderCell>
              </TableHead>
            )}

            {columnFilters.horizon && (
              <TableHead className={`${columnWidths.horizon} border-r border-slate-200 bg-white h-[52px]`}>
                <HeaderCell sortKey="horizon" sortRules={sortRules} onSort={handleSort}>
                  Horizon
                </HeaderCell>
              </TableHead>
            )}

            {columnFilters.shortageHorizon && (
              <TableHead className={`${columnWidths.shortageHorizon} border-r border-slate-200 bg-white h-[52px]`}>
                <HeaderCell sortKey="shortageHorizon" sortRules={sortRules} onSort={handleSort}>
                  Horizon Shortage
                </HeaderCell>
              </TableHead>
            )}

            {columnFilters.express && (
              <TableHead className={`${columnWidths.express} border-r border-slate-200 bg-white h-[52px]`}>
                <HeaderCell sortKey="express" sortRules={sortRules} onSort={handleSort}>
                  Express
                </HeaderCell>
              </TableHead>
            )}

            {columnFilters.shortageExpress && (
              <TableHead className={`${columnWidths.shortageExpress} border-r border-slate-200 bg-white h-[52px]`}>
                <HeaderCell sortKey="shortageExpress" sortRules={sortRules} onSort={handleSort}>
                  Express Shortage
                </HeaderCell>
              </TableHead>
            )}

            {columnFilters.pdmi && (
              <TableHead className={`${columnWidths.pdmi} border-r border-slate-200 bg-white h-[52px]`}>
                <HeaderCell sortKey="pdmi" sortRules={sortRules} onSort={handleSort}>
                  PDMI
                </HeaderCell>
              </TableHead>
            )}

            {columnFilters.shortagePdmi && (
              <TableHead className={`${columnWidths.shortagePdmi} border-r border-slate-200 bg-white h-[52px]`}>
                <HeaderCell sortKey="shortagePdmi" sortRules={sortRules} onSort={handleSort}>
                  PDMI Shortage
                </HeaderCell>
              </TableHead>
            )}

            {columnFilters.optumrx && (
              <TableHead className={`${columnWidths.optumrx} border-r border-slate-200 bg-white h-[52px]`}>
                <HeaderCell sortKey="optumrx" sortRules={sortRules} onSort={handleSort}>
                  OptumRx
                </HeaderCell>
              </TableHead>
            )}

            {columnFilters.shortageOptumrx && (
              <TableHead className={`${columnWidths.shortageOptumrx} border-r border-slate-200 bg-white h-[52px]`}>
                <HeaderCell sortKey="shortageOptumrx" sortRules={sortRules} onSort={handleSort}>
                  OptumRx Shortage
                </HeaderCell>
              </TableHead>
            )}

            {columnFilters.cvsCaremark && (
              <TableHead className={`${columnWidths.cvsCaremark} border-r border-slate-200 bg-white h-[52px]`}>
                <HeaderCell sortKey="cvsCaremark" sortRules={sortRules} onSort={handleSort}>
                  CVS Caremark
                </HeaderCell>
              </TableHead>
            )}

            {columnFilters.shortageCvsCaremark && (
              <TableHead className={`${columnWidths.shortageCvsCaremark} border-r border-slate-200 bg-white h-[52px]`}>
                <HeaderCell sortKey="shortageCvsCaremark" sortRules={sortRules} onSort={handleSort}>
                  CVS Caremark Shortage
                </HeaderCell>
              </TableHead>
            )}

            {columnFilters.ssc && (
              <TableHead className={`${columnWidths.ssc} border-r border-slate-200 bg-white h-[52px]`}>
                <HeaderCell sortKey="ssc" sortRules={sortRules} onSort={handleSort}>
                  SSC
                </HeaderCell>
              </TableHead>
            )}

            {columnFilters.shortageSsc && (
              <TableHead className={`${columnWidths.shortageSsc} border-r border-slate-200 bg-white h-[52px]`}>
                <HeaderCell sortKey="shortageSsc" sortRules={sortRules} onSort={handleSort}>
                  SSC Shortage
                </HeaderCell>
              </TableHead>
            )}

            {columnFilters.njMedicaid && (
              <TableHead className={`${columnWidths.njMedicaid} border-r border-slate-200 bg-white h-[52px]`}>
                <HeaderCell sortKey="njMedicaid" sortRules={sortRules} onSort={handleSort}>
                  NJ Medicaid
                </HeaderCell>
              </TableHead>
            )}

            {selectedSuppliers.map((s) => {
              const meta = supplierColumnMap[s];
              return (
                <TableHead key={s} className={`${meta.width} border-r border-slate-200 bg-white h-[52px]`}>
                  <div className="h-full px-3 py-2.5 flex items-center justify-center">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-slate-700">
                      {s}
                    </span>
                  </div>
                </TableHead>
              );
            })}

            {columnFilters.shortageNjMedicaid && (
              <TableHead className={`${columnWidths.shortageNjMedicaid} bg-white h-[52px]`}>
                <HeaderCell sortKey="shortageNjMedicaid" sortRules={sortRules} onSort={handleSort}>
                  NJ Medicaid Shortage
                </HeaderCell>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
      </Table>
    </div>
  </div>

  {/* SCROLLABLE BODY - Controls both vertical and horizontal scroll */}
  <div ref={bodyScrollRef} className="flex-1 overflow-auto min-w-0 relative z-0">
    <div className="min-w-max">
      <Table>
        <TableBody>
          {paginatedData.map((row, idx) => (
            <TableRow
              key={row.id}
              className="cursor-pointer transition-colors hover:bg-emerald-50/30 border-b border-slate-100"
              onClick={() => {
                setActiveDrug(row);
                setOpenDrugSidebar(true);
              }}
            >
              <TableCell className="w-12 border-r border-slate-100 bg-white h-[52px]" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={selectedRows.includes(row.id)}
                    onCheckedChange={() => toggleRowSelection(row.id)}
                  />
                </div>
              </TableCell>

              {columnFilters.rank && (
                <TableCell className={`${columnWidths.rank} text-center border-r border-slate-100 font-medium text-slate-700 h-[52px] `}>
                  {row.rank}
                </TableCell>
              )}

              {columnFilters.ndc && (
                <TableCell className={`${columnWidths.ndc} text-center border-r border-slate-100 text-xs text-slate-600 h-[52px]`}>
                  {row.ndc}
                </TableCell>
              )}

              {columnFilters.drugName && (
                <TableCell className={`${columnWidths.drugName} border-r border-slate-100 font-semibold text-slate-900 h-[52px]`}>
                  {row.drugName}
                </TableCell>
              )}

              {columnFilters.pkgSize && (
                <TableCell className={`${columnWidths.pkgSize} text-center border-r border-slate-100 text-slate-700 h-[52px] translate-x-8`}>
                  {row.pkgSize}
                </TableCell>
              )}

              {columnFilters.totalOrdered && (
                <TableCell className={`${columnWidths.totalOrdered} text-center border-r border-slate-100 font-medium text-slate-700 h-[52px] translate-x-8`}>
                  {row.totalOrdered.toLocaleString()}
                </TableCell>
              )}

              {columnFilters.totalBilled && (
                <TableCell className={`${columnWidths.totalBilled} text-center border-r border-slate-100 font-medium text-slate-700 h-[52px] translate-x-8`}>
                  {row.totalBilled.toLocaleString()}
                </TableCell>
              )}

              {columnFilters.totalShortage && (
                <TableCell className={`${columnWidths.totalShortage} text-center border-r border-slate-100 h-[52px] translate-x-8`}>
                  {renderShortageValue(row.totalShortage)}
                </TableCell>
              )}

              {columnFilters.highestShortage && (
                <TableCell className={`${columnWidths.highestShortage} text-center border-r border-slate-100 h-[52px] translate-x-8`}>
                  {renderShortageValue(row.highestShortage)}
                </TableCell>
              )}

              {columnFilters.cost && (
                <TableCell className={`${columnWidths.cost} text-center border-r border-slate-100 font-semibold text-slate-900 h-[52px] translate-x-8`}>
                  ${row.cost.toFixed(2)}
                </TableCell>
              )}

              {columnFilters.horizon && (
                <TableCell className={`${columnWidths.horizon} text-center border-r border-slate-100 text-slate-700 h-[52px] translate-x-8`}>
                  {row.horizon}
                </TableCell>
              )}

              {columnFilters.shortageHorizon && (
                <TableCell className={`${columnWidths.shortageHorizon} text-center border-r border-slate-100 h-[52px] translate-x-8`}>
                  {renderShortageValue(row.shortageHorizon)}
                </TableCell>
              )}

              {columnFilters.express && (
                <TableCell className={`${columnWidths.express} text-center border-r border-slate-100 text-slate-700 h-[52px] translate-x-8`}>
                  {row.express}
                </TableCell>
              )}

              {columnFilters.shortageExpress && (
                <TableCell className={`${columnWidths.shortageExpress} text-center border-r border-slate-100 h-[52px] translate-x-8`}>
                  {renderShortageValue(row.shortageExpress)}
                </TableCell>
              )}

              {columnFilters.pdmi && (
                <TableCell className={`${columnWidths.pdmi} text-center border-r border-slate-100 text-slate-700 h-[52px]translate-x-8`}>
                  {row.pdmi}
                </TableCell>
              )}

              {columnFilters.shortagePdmi && (
                <TableCell className={`${columnWidths.shortagePdmi} text-center border-r border-slate-100 h-[52px] translate-x-8`}>
                  {renderShortageValue(row.shortagePdmi)}
                </TableCell>
              )}

              {columnFilters.optumrx && (
                <TableCell className={`${columnWidths.optumrx} text-center border-r border-slate-100 text-slate-700 h-[52px] translate-x-8`}>
                  {row.optumrx}
                </TableCell>
              )}

              {columnFilters.shortageOptumrx && (
                <TableCell className={`${columnWidths.shortageOptumrx} text-center border-r border-slate-100 h-[52px] translate-x-8`}>
                  {renderShortageValue(row.shortageOptumrx)}
                </TableCell>
              )}

              {columnFilters.cvsCaremark && (
                <TableCell className={`${columnWidths.cvsCaremark} text-center border-r border-slate-100 text-slate-700 h-[52px] translate-x-8`}>
                  {row.cvsCaremark}
                </TableCell>
              )}

              {columnFilters.shortageCvsCaremark && (
                <TableCell className={`${columnWidths.shortageCvsCaremark} text-center border-r border-slate-100 h-[52px] translate-x-8`}>
                  {renderShortageValue(row.shortageCvsCaremark)}
                </TableCell>
              )}

              {columnFilters.ssc && (
                <TableCell className={`${columnWidths.ssc} text-center border-r border-slate-100 text-slate-700 h-[52px] translate-x-8`}>
                  {row.ssc}
                </TableCell>
              )}

              {columnFilters.shortageSsc && (
                <TableCell className={`${columnWidths.shortageSsc} text-center border-r border-slate-100 h-[52px] translate-x-8`}>
                  {renderShortageValue(row.shortageSsc)}
                </TableCell>
              )}

              {columnFilters.njMedicaid && (
                <TableCell className={`${columnWidths.njMedicaid} text-center border-r border-slate-100 text-slate-700 h-[52px] translate-x-8`}>
                  {row.njMedicaid}
                </TableCell>
              )}

              {columnFilters.shortageNjMedicaid && (
                <TableCell className={`${columnWidths.shortageNjMedicaid} text-center h-[52px] translate-x-8`}>
                  {renderShortageValue(row.shortageNjMedicaid)}
                </TableCell>
              )}

              {selectedSuppliers.map((s) => {
                const meta = supplierColumnMap[s];
                return (
                  <TableCell key={s} className={`${meta.width} text-center border-r border-slate-100 text-slate-600 h-[52px]`}>
                    —
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
</div>
      {/* Enhanced Footer */}
      {/* <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600 font-medium">
            Rows per page:
          </span>
          <Select
            value={String(rowsPerPage)}
            onValueChange={(v) => setRowsPerPage(Number(v))}
          >
            <SelectTrigger className="w-20 h-9 border-slate-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-slate-500">
            Showing {(currentPage - 1) * rowsPerPage + 1}-
            {Math.min(currentPage * rowsPerPage, filteredData.length)} of{" "}
            {filteredData.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-600 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="h-9 w-9 p-0 border-slate-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="h-9 w-9 p-0 border-slate-300"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div> */}

      {/* Export Modal */}
      <Dialog open={openExportModal} onOpenChange={setOpenExportModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Export Report
            </DialogTitle>
            <DialogDescription>
              Choose your preferred format and scope for the export
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-900">
                Export Format
              </Label>
              <RadioGroup
                value={exportFormat}
                onValueChange={(v) => setExportFormat(v as any)}
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                  <RadioGroupItem value="csv" id="csv" />
                  <Label
                    htmlFor="csv"
                    className="flex-1 cursor-pointer font-medium"
                  >
                    CSV
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                  <RadioGroupItem value="excel" id="excel" />
                  <Label
                    htmlFor="excel"
                    className="flex-1 cursor-pointer font-medium"
                  >
                    Excel
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                  <RadioGroupItem value="pdf" id="pdf" />
                  <Label
                    htmlFor="pdf"
                    className="flex-1 cursor-pointer font-medium"
                  >
                    PDF
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-900">
                Export Scope
              </Label>
              <RadioGroup
                value={exportScope}
                onValueChange={(v) => setExportScope(v as any)}
              >
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                  <RadioGroupItem value="visible" id="visible" />
                  <Label
                    htmlFor="visible"
                    className="flex-1 cursor-pointer font-medium"
                  >
                    Visible Rows Only
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                  <RadioGroupItem value="all" id="all" />
                  <Label
                    htmlFor="all"
                    className="flex-1 cursor-pointer font-medium"
                  >
                    All Data
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenExportModal(false)}>
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

      {/* Create Tag Modal */}
      <Dialog open={openCreateTagModal} onOpenChange={setOpenCreateTagModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Create New Tag
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label
                htmlFor="tagName"
                className="text-sm font-semibold text-slate-900"
              >
                Tag Name
              </Label>
              <Input
                id="tagName"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Enter tag name"
                className="border-slate-300"
              />
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-slate-900">
                Tag Color
              </Label>
              <RadioGroup value={newTagColor} onValueChange={setNewTagColor}>
                {(
                  [
                    "red",
                    "orange",
                    "yellow",
                    "green",
                    "blue",
                    "purple",
                  ] as const
                ).map((color) => (
                  <div
                    key={color}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <RadioGroupItem value={color} id={color} />
                    <div
                      className={`h-4 w-4 rounded-full ${colorClasses[color]}`}
                    ></div>
                    <Label
                      htmlFor={color}
                      className="flex-1 cursor-pointer font-medium capitalize"
                    >
                      {color}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenCreateTagModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTag}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Drug Details Sidebar */}
      <Sheet open={openDrugSidebar} onOpenChange={setOpenDrugSidebar}>
        <SheetContent className="w-[450px] sm:w-[540px] bg-gradient-to-br from-white to-slate-50">
          <SheetHeader>
            <SheetTitle className="text-xl font-bold text-slate-900">
              Drug Details
            </SheetTitle>
            <SheetDescription className="text-sm text-slate-600">
              {activeDrug ? activeDrug.drugName : "No drug selected"}
            </SheetDescription>
          </SheetHeader>
          {activeDrug && (
            <div className="mt-8 space-y-5">
              <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  NDC
                </Label>
                <p className="text-base font-mono font-semibold text-slate-900 mt-1">
                  {activeDrug.ndc}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Package Size
                  </Label>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {activeDrug.pkgSize}
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Cost
                  </Label>
                  <p className="text-lg font-bold text-emerald-700 mt-1">
                    ${activeDrug.cost.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Ordered
                </Label>
                <p className="text-lg font-bold text-slate-900 mt-1">
                  {activeDrug.totalOrdered.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Billed
                </Label>
                <p className="text-lg font-bold text-slate-900 mt-1">
                  {activeDrug.totalBilled.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Shortage
                </Label>
                <p className="text-lg font-bold mt-1">
                  {renderShortageValue(activeDrug.totalShortage)}
                </p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  </div>
  </div>
  );
}


<style jsx global>{`
  /* Hide scrollbar for header only */
  div[style*="scrollbarWidth"]::-webkit-scrollbar {
    display: none;
  }
`}</style>