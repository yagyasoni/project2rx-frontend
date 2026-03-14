// "use client";

// import React, { useState, useRef, useEffect, useMemo } from "react";
// import AppSidebar from "@/components/Sidebar";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Search,
//   X,
//   ChevronDown,
//   RotateCw,
//   Filter,
//   Download,
//   SlidersHorizontal,
// } from "lucide-react";
// import { ArrowUpDown } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Label } from "@/components/ui/label";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Badge } from "@/components/ui/badge";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
// } from "@/components/ui/sheet";
// import { useParams } from "next/navigation";

// interface SortRule {
//   key: keyof InventoryRow;
//   dir: "asc" | "desc";
// }

// function SortIcon({ dir }: { dir?: "asc" | "desc" }) {
//   if (!dir)
//     return (
//       <ArrowUpDown className="w-3.5 h-3.5 ml-1.5 text-gray-400 transition-colors" />
//     );
//   if (dir === "asc")
//     return (
//       <span className="text-[11px] ml-1.5 text-emerald-600 font-bold">↑</span>
//     );
//   return (
//     <span className="text-[11px] ml-1.5 text-emerald-600 font-bold">↓</span>
//   );
// }

// function HeaderCell({
//   children,
//   sortKey,
//   sortRules,
//   onSort,
// }: {
//   children: React.ReactNode;
//   sortKey: keyof InventoryRow;
//   sortRules: SortRule[];
//   onSort: (key: keyof InventoryRow, e: React.MouseEvent) => void;
// }) {
//   const active = sortRules.find((r) => r.key === sortKey)?.dir;

//   return (
//     <div
//       onClick={(e) => onSort(sortKey, e)}
//       className="h-full px-3 py-1.5 flex items-center justify-center gap-1 cursor-pointer select-none whitespace-nowrap transition-colors hover:bg-emerald-50/50"
//     >
//       <span className="text-[11px] font-bold uppercase tracking-wide text-slate-700">
//         {children}
//       </span>
//       <SortIcon dir={active} />
//     </div>
//   );
// }

// interface InventoryRow {
//   id: number;
//   ndc: string;
//   drugName: string;
//   rank: number;
//   pkgSize: number;
//   unit: number;
//   totalOrdered: number;
//   totalBilled: number;
//   totalShortage: number;
//   highestShortage: number;
//   cost: number;
//   amount: number;
//   horizon: number;
//   shortageHorizon: number;
//   express: number;
//   shortageExpress: number;
//   cvsCaremark: number;
//   shortageCvsCaremark: number;
//   ssc: number;
//   shortageSsc: number;
//   njMedicaid: number;
//   shortageNjMedicaid: number;
//   pdmi: number;
//   shortagePdmi: number;
//   optumrx: number;
//   shortageOptumrx: number;
//   humana: number;
//   shortageHumana: number;
// }

// interface FilterChip {
//   id: string;
//   label: string;
//   value: string;
// }

// export default function InventoryReportPage() {
//   const [loadingProgress, setLoadingProgress] = useState(0);
// const [loadingDone, setLoadingDone] = useState(false);
//   const [inventoryData, setInventoryData] = useState<InventoryRow[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [openExportModal, setOpenExportModal] = useState(false);
//   const [exportFormat, setExportFormat] = useState<"csv" | "excel" | "pdf">("excel");
//   const [exportScope, setExportScope] = useState<"visible" | "all">("visible");
//   const [amountValue, setAmountValue] = useState<number | "">("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedRows, setSelectedRows] = useState<number[]>([]);
//   const [activeFilters, setActiveFilters] = useState<FilterChip[]>([]);
//   const [qtyType, setQtyType] = useState<"UNIT" | "PKG SIZE" | null>("PKG SIZE");
//   const [openQtyDropdown, setOpenQtyDropdown] = useState(false);
//   const [openFilter, setOpenFilter] = useState(false);
//   const [openFlagDropdown, setOpenFlagDropdown] = useState(false);
//   const [flagFilters, setFlagFilters] = useState<string[]>([]);
//   const [openTagsDropdown, setOpenTagsDropdown] = useState(false);
//   const [openTagMenuId, setOpenTagMenuId] = useState<string | null>(null);
//   const [openCreateTagModal, setOpenCreateTagModal] = useState(false);
//   const [newTagName, setNewTagName] = useState("");
//   const [newTagColor, setNewTagColor] = useState("yellow");
//   const [openDrugTypeDropdown, setOpenDrugTypeDropdown] = useState(false);
//   const [drugTypes, setDrugTypes] = useState<string[]>(["ALL DRUGS"]);
//   const [costValue, setCostValue] = useState<number | "">("");
//   const [openDrugSidebar, setOpenDrugSidebar] = useState(false);
//   const [activeDrug, setActiveDrug] = useState<InventoryRow | null>(null);
//   const [selectedTags, setSelectedTags] = useState<string[]>([]);
//   const [controlledSchedules, setControlledSchedules] = useState<string[]>([]);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
//   const [activePanel, setActivePanel] = useState<string | null>(null);
//   const [auditDates, setAuditDates] = useState<any>(null);
//   const [rowsPerPage, setRowsPerPage] = useState(100);
//   const [currentPage, setCurrentPage] = useState(1);

//   const headerScrollRef = useRef<HTMLDivElement | null>(null);
//   const bodyScrollRef = useRef<HTMLDivElement | null>(null);
//   const filterDropdownRef = useRef<HTMLDivElement | null>(null);

//   const availableTags = [
//     { id: "high-priority", label: "High Priority", color: "red" },
//     { id: "shortage-alert", label: "Shortage Alert", color: "orange" },
//     { id: "reorder-soon", label: "Reorder Soon", color: "yellow" },
//     { id: "cost-effective", label: "Cost Effective", color: "green" },
//     { id: "generic", label: "Generic", color: "blue" },
//     { id: "brand-name", label: "Brand Name", color: "purple" },
//   ];

//   const availablePBMs = [
//     "Horizon",
//     "Express",
//     "CVS Caremark",
//     "SSC",
//     "NJ Medicaid",
//     "PDMI",
//     "OptumRx",
//   ];

//   const params = useParams();
//   const auditId = params.id as string;

//   useEffect(() => {
//     const loadReport = async () => {
//       let progressInterval: ReturnType<typeof setInterval> | null = null;
//       try {
//         setLoading(true);
//         setLoadingProgress(0);
//         setLoadingDone(false);
//         progressInterval = setInterval(() => {
//   setLoadingProgress((prev) => {
//     if (prev >= 90) { clearInterval(progressInterval); return 90; }
//     return prev + Math.random() * 8 + 2;
//   });
// }, 200);

//         const res = await fetch(`http://localhost:5000/api/audits/${auditId}/report`);
//         const json = await res.json();

//         const data = Array.isArray(json)
//           ? json
//           : Array.isArray(json.inventory)
//           ? json.inventory
//           : [];

//         const normalized = data.map((row: any, index: number) => ({
//           id: row.id ?? index + 1,
//           ndc: row.ndc ?? "",
//           drugName: (row.drug_name ?? row.drugName ?? "").replace(/\s*\(\d{5}-\d{4}-\d{2}\).*$/, "").trim(),
//           rank: 0,
//           pkgSize: row.package_size ?? 0,
//           unit: row.package_size > 0
//             ? Number((Number(row.total_billed ?? 0) / Number(row.package_size)).toFixed(2))
//             : 0,
//           totalOrdered: Number(row.total_ordered ?? 0),
//           totalBilled: Number(row.total_billed ?? 0),
//           totalShortage: row.total_shortage !== undefined && row.total_shortage !== null
//             ? Number(row.total_shortage)
//             : Number(row.total_ordered ?? 0) - Number(row.total_billed ?? 0),
//           highestShortage: 0,
//           cost: Number(row.cost ?? 0),
//           amount: Number(row.total_amount ?? row.amount ?? 0),
//           horizon: Number(row.horizon ?? 0),
//           shortageHorizon: Number(row.total_ordered ?? 0) - Number(row.horizon ?? 0),
//           express: Number(row.express ?? 0),
//           shortageExpress: Number(row.total_ordered ?? 0) - Number(row.express ?? 0),
//           cvsCaremark: Number(row.cvs_caremark ?? row.cvsCaremark ?? 0),
//           shortageCvsCaremark: Number(row.total_ordered ?? 0) - Number(row.cvs_caremark ?? row.cvsCaremark ?? 0),
//           optumrx: Number(row.optumrx ?? 0),
//           shortageOptumrx: Number(row.total_ordered ?? 0) - Number(row.optumrx ?? 0),
//           humana: Number(row.humana ?? 0),
//           shortageHumana: Number(row.total_ordered ?? 0) - Number(row.humana ?? 0),
//           njMedicaid: Number(row.nj_medicaid ?? row.njMedicaid ?? 0),
//           shortageNjMedicaid: Number(row.total_ordered ?? 0) - Number(row.nj_medicaid ?? row.njMedicaid ?? 0),
//           ssc: Number(row.ssc ?? 0),
//           shortageSsc: Number(row.total_ordered ?? 0) - Number(row.ssc ?? 0),
//           pdmi: Number(row.pdmi ?? 0),
//           shortagePdmi: Number(row.total_ordered ?? 0) - Number(row.pdmi ?? 0),
//         }));

//         const sortedByBilled = [...normalized].sort((a, b) => b.amount - a.amount);
//         sortedByBilled.forEach((row, index) => {
//           row.rank = index + 1;
//         });

//         normalized.forEach((row: any) => {
//           const shortageValues = [
//             row.shortageHorizon,
//             row.shortageExpress,
//             row.shortageCvsCaremark,
//             row.shortageOptumrx,
//             row.shortageHumana,
//             row.shortageNjMedicaid,
//             row.shortageSsc,
//             row.shortagePdmi,
//           ];
//           const mostNegative = Math.min(...shortageValues);
//           row.highestShortage = mostNegative < 0 ? mostNegative : 0;
//         });

//         setInventoryData(normalized);

//         const auditRes = await fetch(`http://localhost:5000/api/audits/${auditId}`);
//         const auditData = await auditRes.json();
//         setAuditDates(auditData);
//       } catch (err) {
//         console.error("Failed to load report", err);
//         setInventoryData([]);
//       } finally {
//         if (progressInterval) clearInterval(progressInterval);
// setLoadingProgress(100);
// // Small delay so user sees 100% before table appears
// setTimeout(() => {
//   setLoadingDone(true);
//   setTimeout(() => setLoading(false), 400); // fade out
// }, 500);
//       }
//     };

//     if (auditId) loadReport();
//   }, [auditId]);

//   const supplierToColumnKey: Record<string, keyof typeof columnFilters> = {
//     Horizon: "horizon",
//     Express: "express",
//     "CVS Caremark": "cvsCaremark",
//     SSC: "ssc",
//     "NJ Medicaid": "njMedicaid",
//     PDMI: "pdmi",
//     OptumRx: "optumrx",
//   };

//   const [pbmFilters, setPbmFilters] = useState(availablePBMs);

//   const [sortRules, setSortRules] = useState<SortRule[]>([
//     { key: "totalShortage", dir: "asc" },
//   ]);

//   const [columnFilters, setColumnFilters] = useState({
//     rank: true,
//     ndc: true,
//     drugName: true,
//     pkgSize: true,
//     unit: false,
//     totalOrdered: true,
//     totalBilled: true,
//     totalShortage: true,
//     highestShortage: true,
//     cost: true,
//     amount: true,
//     horizon: true,
//     shortageHorizon: true,
//     express: true,
//     shortageExpress: true,
//     cvsCaremark: true,
//     shortageCvsCaremark: true,
//     ssc: true,
//     shortageSsc: true,
//     njMedicaid: true,
//     shortageNjMedicaid: true,
//     pdmi: true,
//     shortagePdmi: true,
//     optumrx: true,
//     shortageOptumrx: true,
//     humana: true,           // ← ADDED
//     shortageHumana: true,
//   });

//   // ─── applyQtyMode MUST be defined before paginatedData ───────────────────────
//  const applyQtyMode = (row: InventoryRow): InventoryRow => {
//     const pkg = row.pkgSize || 1;

//     if (qtyType === "PKG SIZE") {
//       const newTotalOrdered = row.totalOrdered * pkg;
//      const sH    = Number((newTotalOrdered - row.horizon).toFixed(2));
// const sEx   = Number((newTotalOrdered - row.express).toFixed(2));
// const sCvs  = Number((newTotalOrdered - row.cvsCaremark).toFixed(2));
// const sOpt  = Number((newTotalOrdered - row.optumrx).toFixed(2));
// const sHum  = Number((newTotalOrdered - row.humana).toFixed(2));
// const sNj   = Number((newTotalOrdered - row.njMedicaid).toFixed(2));
// const sSsc  = Number((newTotalOrdered - row.ssc).toFixed(2));
// const sPdmi = Number((newTotalOrdered - row.pdmi).toFixed(2));
//       const minShortage = Math.min(sH, sEx, sCvs, sOpt, sHum, sNj, sSsc, sPdmi);
//       return {
//   ...row,
//   totalOrdered:        Number(newTotalOrdered.toFixed(2)),
//   totalShortage:       Number((newTotalOrdered - row.totalBilled).toFixed(2)),
//   highestShortage:     Number((minShortage < 0 ? minShortage : 0).toFixed(2)),
//   shortageHorizon:     sH,
//   shortageExpress:     sEx,
//   shortageCvsCaremark: sCvs,
//   shortageOptumrx:     sOpt,
//   shortageHumana:      sHum,
//   shortageNjMedicaid:  sNj,
//   shortageSsc:         sSsc,
//   shortagePdmi:        sPdmi,
// };
//     }

//     if (qtyType === "UNIT") {
//       const newTotalBilled  = Number((row.totalBilled  / pkg).toFixed(2));
//       const newHorizon      = Number((row.horizon      / pkg).toFixed(2));
//       const newExpress      = Number((row.express      / pkg).toFixed(2));
//       const newCvsCaremark  = Number((row.cvsCaremark  / pkg).toFixed(2));
//       const newOptumrx      = Number((row.optumrx      / pkg).toFixed(2));
//       const newHumana       = Number((row.humana       / pkg).toFixed(2));
//       const newNjMedicaid   = Number((row.njMedicaid   / pkg).toFixed(2));
//       const newSsc          = Number((row.ssc          / pkg).toFixed(2));
//       const newPdmi         = Number((row.pdmi         / pkg).toFixed(2));
//       const sH    = Number((row.totalOrdered - newHorizon).toFixed(2));
// const sEx   = Number((row.totalOrdered - newExpress).toFixed(2));
// const sCvs  = Number((row.totalOrdered - newCvsCaremark).toFixed(2));
// const sOpt  = Number((row.totalOrdered - newOptumrx).toFixed(2));
// const sHum  = Number((row.totalOrdered - newHumana).toFixed(2));
// const sNj   = Number((row.totalOrdered - newNjMedicaid).toFixed(2));
// const sSsc  = Number((row.totalOrdered - newSsc).toFixed(2));
// const sPdmi = Number((row.totalOrdered - newPdmi).toFixed(2));
//       const minShortage = Math.min(sH, sEx, sCvs, sOpt, sHum, sNj, sSsc, sPdmi);
//       return {
//   ...row,
//   totalBilled:         newTotalBilled,
//   totalShortage:       Number((row.totalOrdered - newTotalBilled).toFixed(2)),
//   highestShortage:     Number((minShortage < 0 ? minShortage : 0).toFixed(2)),
//   horizon:             newHorizon,
//   shortageHorizon:     sH,
//   express:             newExpress,
//   shortageExpress:     sEx,
//   cvsCaremark:         newCvsCaremark,
//   shortageCvsCaremark: sCvs,
//   optumrx:             newOptumrx,
//   shortageOptumrx:     sOpt,
//   humana:              newHumana,
//   shortageHumana:      sHum,
//   njMedicaid:          newNjMedicaid,
//   shortageNjMedicaid:  sNj,
//   ssc:                 newSsc,
//   shortageSsc:         sSsc,
//   pdmi:                newPdmi,
//   shortagePdmi:        sPdmi,
// };
//     }

//     return row;
//   };
//   // ─────────────────────────────────────────────────────────────────────────────

//   const removeFilter = (chipId: string) => {
//     setActiveFilters((prev) => prev.filter((c) => c.id !== chipId));
//   };

//   const toggleFlagFilter = (flag: string) => {
//     setFlagFilters((prev) =>
//       prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]
//     );
//   };

//   const togglePBMFilter = (pbm: string) => {
//     setPbmFilters((prev) => {
//       const isOn = prev.includes(pbm);
//       const next = isOn ? prev.filter((p) => p !== pbm) : [...prev, pbm];
//       const baseKey = supplierToColumnKey[pbm];
//       if (baseKey) {
//         setColumnFilters((cols) => ({
//           ...cols,
//           [baseKey]: !isOn,
//           [`shortage${baseKey.charAt(0).toUpperCase()}${baseKey.slice(1)}`]: !isOn,
//         }));
//       }
//       return next;
//     });
//   };

//   const handleSort = (key: keyof InventoryRow, e: React.MouseEvent) => {
//     const index = sortRules.findIndex((r) => r.key === key);
//     let newRules = [...sortRules];
//     if (index === -1) {
//       if (e.shiftKey) {
//         newRules.push({ key, dir: "asc" });
//       } else {
//         newRules = [{ key, dir: "asc" }];
//       }
//     } else {
//       const current = newRules[index];
//       if (current.dir === "asc") {
//         newRules[index] = { key, dir: "desc" };
//       } else {
//         newRules.splice(index, 1);
//       }
//     }
//     setSortRules(newRules);
//   };

//   const sortedData = useMemo(() => {
//     return [...inventoryData].sort((a, b) => {
//       for (const rule of sortRules) {
//         const aVal = a[rule.key];
//         const bVal = b[rule.key];
//         let cmp = 0;
//         if (typeof aVal === "number" && typeof bVal === "number") {
//           cmp = aVal - bVal;
//         } else {
//           cmp = String(aVal).localeCompare(String(bVal));
//         }
//         if (cmp !== 0) return rule.dir === "asc" ? cmp : -cmp;
//       }
//       return 0;
//     });
//   }, [inventoryData, sortRules]);

//   const filteredData = useMemo(() => {
//     const lowerQuery = searchQuery.toLowerCase();
//     return sortedData.filter((row) => {
//       const matchesSearch =
//         row.drugName.toLowerCase().includes(lowerQuery) ||
//         row.ndc.toLowerCase().includes(lowerQuery);
//       const matchesAmount = amountValue === "" || row.amount <= amountValue;
//       return matchesSearch && matchesAmount;
//     });
//   }, [sortedData, searchQuery, amountValue]);

//   const totalRows = filteredData.length;
//   const effectiveRowsPerPage = rowsPerPage > 0 ? rowsPerPage : filteredData.length || 50;
//   const totalPages = Math.max(1, Math.ceil(filteredData.length / effectiveRowsPerPage));
//   const rowOptions = [10, 20, 50, 100, totalRows].filter(
//     (v, i, arr) => v > 0 && arr.indexOf(v) === i
//   );

//   // applyQtyMode is now defined above — no initialization error
//   const paginatedData = filteredData
//     .slice(
//       (currentPage - 1) * effectiveRowsPerPage,
//       currentPage * effectiveRowsPerPage
//     )
//     .map(applyQtyMode);

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const toggleRowSelection = (id: number) => {
//     setSelectedRows((prev) =>
//       prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
//     );
//   };

//   const toggleSelectAll = () => {
//     if (selectedRows.length === paginatedData.length) {
//       setSelectedRows([]);
//     } else {
//       setSelectedRows(paginatedData.map((r) => r.id));
//     }
//   };

//   const renderShortageValue = (val: number) => {
//     if (val === 0) return <span className="text-slate-400 font-medium">—</span>;
//     return (
//       <span className={val < 0 ? "text-red-600 font-semibold" : "text-emerald-600 font-semibold"}>
//         {val}
//       </span>
//     );
//   };

//   const columnWidths: Record<keyof typeof columnFilters, string> = {
//     rank: "w-[70px]",
//     ndc: "w-[110px]",
//     drugName: "w-[180px]",
//     pkgSize: "w-[80px]",
//     unit: "w-[80px]",
//     totalOrdered: "w-[110px]",
//     totalBilled: "w-[100px]",
//     totalShortage: "w-[110px]",
//     highestShortage: "w-[130px]",
//     cost: "w-[80px]",
//     amount: "w-[100px]",
//     horizon: "w-[90px]",
//     shortageHorizon: "w-[130px]",
//     express: "w-[90px]",
//     shortageExpress: "w-[130px]",
//     cvsCaremark: "w-[110px]",
//     shortageCvsCaremark: "w-[150px]",
//     ssc: "w-[80px]",
//     shortageSsc: "w-[110px]",
//     njMedicaid: "w-[100px]",
//     shortageNjMedicaid: "w-[120px]",
//     pdmi: "w-[80px]",
//     shortagePdmi: "w-[120px]",
//     optumrx: "w-[90px]",
//     shortageOptumrx: "w-[130px]",
//   };

//   const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);

//   const supplierColumnMap: Record<string, { key: string; width: string }> = {
//     Kinray: { key: "supplier_Kinray", width: "min-w-[140px]" },
//     McKesson: { key: "supplier_McKesson", width: "min-w-[140px]" },
//     "Real Value Rx": { key: "supplier_RealValueRx", width: "min-w-[160px]" },
//     Parmed: { key: "supplier_Parmed", width: "min-w-[140px]" },
//     Axia: { key: "supplier_Axia", width: "min-w-[120px]" },
//     Citymed: { key: "supplier_Citymed", width: "min-w-[140px]" },
//     "Legacy Health": { key: "supplier_LegacyHealth", width: "min-w-[160px]" },
//     "NDC Distributors": { key: "supplier_NDCDistributors", width: "min-w-[180px]" },
//     TruMarker: { key: "supplier_TruMarker", width: "min-w-[140px]" },
//   };

//   const toggleColumn = (col: keyof typeof columnFilters) => {
//     setColumnFilters((prev) => ({ ...prev, [col]: !prev[col] }));
//   };

//   useEffect(() => {
//     if (openExportModal) {
//       setSidebarCollapsed(true);
//     }
//   }, [openExportModal]);

//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (
//         filterDropdownRef.current &&
//         !filterDropdownRef.current.contains(e.target as Node)
//       ) {
//         closeAllDropdowns();
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleExport = () => {
//     const rows = exportScope === "visible" ? paginatedData : filteredData;
//     if (!rows.length) return;
//     if (exportFormat === "csv") exportCSV(rows);
//     if (exportFormat === "excel") exportCSV(rows, "xlsx");
//     if (exportFormat === "pdf") exportPDF(rows);
//     setOpenExportModal(false);
//   };

//   const exportCSV = (rows: any[], ext: "csv" | "xlsx" = "csv") => {
//     const headers = Object.keys(rows[0]);
//     const csv = [
//       headers.join(","),
//       ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(",")),
//     ].join("\n");
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `inventory-report.${ext}`;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//   };

//   const exportPDF = (rows: any[]) => {
//     const w = window.open("", "_blank");
//     if (!w) return;
//     w.document.write(`
//     <html>
//       <head>
//         <title>Inventory Report</title>
//         <style>
//           body { font-family: Arial; padding: 20px; }
//           table { border-collapse: collapse; width: 100%; }
//           th, td { border: 1px solid #ccc; padding: 6px; font-size: 12px; }
//           th { background: #f3f4f6; }
//         </style>
//       </head>
//       <body>
//         <h2>Inventory Report</h2>
//         <table>
//           <thead>
//             <tr>
//               ${Object.keys(rows[0]).map((h) => `<th>${h}</th>`).join("")}
//             </tr>
//           </thead>
//           <tbody>
//             ${rows.map((r) => `<tr>${Object.values(r).map((v) => `<td>${v ?? ""}</td>`).join("")}</tr>`).join("")}
//           </tbody>
//         </table>
//         <script>window.print();</script>
//       </body>
//     </html>
//   `);
//   };

//   const handleDrugTypeToggle = (dtype: string) => {
//     setDrugTypes((prev) =>
//       prev.includes(dtype) ? prev.filter((d) => d !== dtype) : [...prev, dtype]
//     );
//   };

//   const colorClasses: Record<string, string> = {
//     red: "bg-red-100 text-red-800",
//     orange: "bg-orange-100 text-orange-800",
//     yellow: "bg-yellow-100 text-yellow-800",
//     green: "bg-green-100 text-green-800",
//     blue: "bg-blue-100 text-blue-800",
//     purple: "bg-purple-100 text-purple-800",
//   };

//   const handleCreateTag = () => {
//     setOpenCreateTagModal(false);
//     setNewTagName("");
//     setNewTagColor("yellow");
//   };

//   const closeAllDropdowns = () => {
//     setOpenFilter(false);
//     setOpenFlagDropdown(false);
//     setOpenTagsDropdown(false);
//     setOpenQtyDropdown(false);
//     setOpenDrugTypeDropdown(false);
//   };

//   const formatDate = (date: Date) => {
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${month}/${day}/${year}`;
//   };

//   const fromDate = auditDates?.inventory_start_date
//     ? formatDate(new Date(auditDates.inventory_start_date))
//     : "—";
//   const toDate = auditDates?.inventory_end_date
//     ? formatDate(new Date(auditDates.inventory_end_date))
//     : "—";
//   const wholesalerFromDate = auditDates?.wholesaler_start_date
//     ? formatDate(new Date(auditDates.wholesaler_start_date))
//     : "—";
//   const wholesalerToDate = auditDates?.wholesaler_end_date
//     ? formatDate(new Date(auditDates.wholesaler_end_date))
//     : "—";

//   return (
//     <div className="relative h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-50">
//       <div className="relative h-full w-full flex overflow-hidden">
//         <div
//           className={`flex-shrink-0 transition-all duration-300 ease-in-out z-0 ${
//             openExportModal
//               ? "w-0 opacity-0 pointer-events-none"
//               : sidebarCollapsed
//               ? "w-[64px]"
//               : "w-[260px]"
//           }`}
//         >
//           {!openExportModal && (
//             <AppSidebar
//               sidebarOpen={!sidebarCollapsed}
//               setSidebarOpen={() => setSidebarCollapsed((v) => !v)}
//               activePanel={activePanel}
//               setActivePanel={setActivePanel}
//             />
//           )}
//         </div>

//         {loading && (
//   <div
//     className={`absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm transition-opacity duration-400 ${
//       loadingDone ? "opacity-0 pointer-events-none" : "opacity-100"
//     }`}
//   >
//     <div className="flex flex-col items-center gap-6 w-72">
//       {/* Icon */}
//       <div className="relative">
//         <div className="h-16 w-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm">
//           <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
//               d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//             />
//           </svg>
//         </div>
//         {/* Spinning ring */}
//         <div className="absolute -inset-1 rounded-[18px] border-2 border-transparent border-t-emerald-500 border-r-emerald-300 animate-spin" />
//       </div>

//       {/* Text */}
//       <div className="text-center space-y-1">
//         <p className="text-sm font-semibold text-slate-700 tracking-wide">
//           {loadingProgress < 30
//             ? "Fetching inventory data..."
//             : loadingProgress < 60
//             ? "Processing records..."
//             : loadingProgress < 90
//             ? "Calculating analytics..."
//             : "Finalizing report..."}
//         </p>
//         <p className="text-xs text-slate-400">Please wait a moment</p>
//       </div>

//       {/* Progress bar */}
//       <div className="w-full space-y-2">
//         <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
//           <div
//             className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300 ease-out"
//             style={{ width: `${Math.min(loadingProgress, 100)}%` }}
//           />
//         </div>
//         <div className="flex items-center justify-between">
//           <span className="text-xs text-slate-400">Loading report</span>
//           <span className="text-xs font-bold text-emerald-600 tabular-nums">
//             {Math.min(Math.round(loadingProgress), 100)}%
//           </span>
//         </div>
//       </div>
//     </div>
//   </div>
// )}

//         <div className="flex-1 min-w-0 flex flex-col overflow-hidden transition-all duration-300 ease-in-out z-10">
//           {/* Header */}
//           <div className="bg-white border-b border-slate-200 shadow-sm">
//             <div className="px-9 py-4 flex items-center justify-between">
//               <div>
//                 <h1 className="text-lg md:text-3xl font-bold text-slate-800 tracking-wide uppercase">
//                   Inventory Report
//                 </h1>
//                 <p className="text-sm text-slate-500 mt-0.5">
//                   Comprehensive pharmaceutical inventory analytics
//                 </p>
//               </div>
//               <div className="flex items-center gap-3">
//                 <div className="flex items-center gap-4">
//                   <div className="flex flex-col gap-1 translate-y-1">
//                     <div className="text-[11px] font-bold tracking-wide text-slate-700 uppercase ml-4 -mt-5">
//                       <div className="mt-1 h-2 w-2 rounded-full bg-blue-800 -translate-x-4 translate-y-3" />
//                       Periods
//                     </div>
//                     <div className="bg-white px-4 py-3 rounded-xl border mb-1.5 border-slate-200 shadow-sm min-w-[180px]">
//                       <div className="text-xs font-semibold text-slate-900">
//                         {fromDate} – {toDate}
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex flex-col gap-1">
//                     <div className="text-[11px] font-bold tracking-wide text-slate-700 uppercase ml-4 -mt-5">
//                       <div className="mt-1 h-2 w-2 rounded-full bg-red-500 -translate-x-4 translate-y-3" />
//                       Inventory Dates
//                     </div>
//                     <div className="flex items-start gap-3 bg-white px-4 py-1 rounded-xl border border-slate-200 shadow-sm">
//                       <div className="flex items-center py-2 gap-2">
//                         <div className="text-xs font-semibold text-slate-900">{fromDate}</div>
//                         <span className="text-xs text-slate-900">–</span>
//                         <div className="text-xs font-semibold text-slate-900">{toDate}</div>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="flex flex-col gap-1 -translate-y-3">
//                     <div className="text-[11px] font-bold tracking-wide text-slate-700 uppercase ml-1">
//                       <div className="mt-1 h-2 w-2 rounded-full bg-emerald-600 -translate-x-4 translate-y-3" />
//                       Wholesaler Dates
//                     </div>
//                     <div className="flex items-start gap-3 bg-white px-4 py-1 rounded-xl border border-slate-200 shadow-sm">
//                       <div className="flex items-center py-2 gap-2">
//                         <div className="text-xs font-semibold text-slate-900">{wholesalerFromDate}</div>
//                         <span className="text-xs text-slate-900">–</span>
//                         <div className="text-xs font-semibold text-slate-900">{wholesalerToDate}</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="gap-2"
//                   onClick={() => {
//                     setSidebarCollapsed(true);
//                     setOpenExportModal(true);
//                   }}
//                 >
//                   <Download className="h-4 w-4" />
//                   Export
//                 </Button>
//                 <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
//                   <RotateCw className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* Filter Bar */}
//           <div className="bg-white border-b border-slate-200">
//             <div className="px-6 py-3">
//               <div className="flex items-center gap-3 flex-wrap">
//                 {/* Search */}
//                 <div className="relative flex-1 min-w-[300px] max-w-md">
//                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//                   <Input
//                     type="text"
//                     placeholder="Search by drug name or NDC..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="pl-10 pr-10 h-10 border-slate-300 focus:border-emerald-500 focus:ring-emerald-500"
//                   />
//                   {searchQuery && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
//                       onClick={() => setSearchQuery("")}
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   )}
//                 </div>

//                 {/* Columns Filter */}
//                 <div className="relative" ref={filterDropdownRef}>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="gap-2 border-slate-300"
//                     onClick={() => setOpenFilter(!openFilter)}
//                   >
//                     <SlidersHorizontal className="h-3.5 w-3.5" />
//                     Filter
//                     <ChevronDown className="h-3.5 w-3.5" />
//                   </Button>

//                   {openFilter && (
//                     <div className="absolute -left-100 top-full mt-2 w-[900px] max-w-[95vw] bg-white border border-slate-200 rounded-xl shadow-2xl z-50">
//                       <div className="flex items-center justify-between px-5 py-3 border-b">
//                         <h3 className="text-sm font-bold tracking-wide">FILTERS</h3>
//                         <div className="flex items-center gap-2">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => {
//                               setPbmFilters(availablePBMs);
//                               setFlagFilters([]);
//                             }}
//                           >
//                             Reset Filters
//                           </Button>
//                           <Button
//                             variant="ghost"
//                             size="sm"
//                             className="h-8 w-8 p-0"
//                             onClick={() => setOpenFilter(false)}
//                           >
//                             <X className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </div>

//                       <div className="grid grid-cols-3 gap-0 max-h-[70vh] overflow-y-auto">
//                         <div className="p-4 border-r">
//                           <div className="text-xs font-bold text-slate-600 mb-2">COLUMNS</div>
//                           {(["ndc", "pkgSize", "rank", "totalOrdered", "totalBilled", "totalShortage", "highestShortage", "cost", "amount"] as const).map((col) => (
//                             <label key={col} className="flex items-center gap-2 py-1 text-sm">
//                               <Checkbox
//                                 checked={columnFilters[col]}
//                                 onCheckedChange={() => toggleColumn(col)}
//                               />
//                               {col.replace(/([A-Z])/g, " $1").toUpperCase()}
//                             </label>
//                           ))}
//                         </div>

//                         <div className="p-4 border-r">
//                           <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-2">
//                             <span className="h-2 w-2 rounded-full bg-red-500" /> BILLED
//                           </div>
//                           {availablePBMs.map((pbm) => (
//                             <label key={pbm} className="flex items-center gap-2 py-1 text-sm">
//                               <Checkbox
//                                 checked={pbmFilters.includes(pbm)}
//                                 onCheckedChange={() => togglePBMFilter(pbm)}
//                               />
//                               {pbm}
//                             </label>
//                           ))}
//                         </div>

//                         <div className="p-4">
//                           <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-2">
//                             <span className="h-2 w-2 rounded-full bg-emerald-600" /> SUPPLIERS
//                           </div>
//                           {Object.keys(supplierColumnMap).map((s) => (
//                             <label key={s} className="flex items-center gap-2 py-1 text-sm">
//                               <Checkbox
//                                 checked={selectedSuppliers.includes(s)}
//                                 onCheckedChange={() =>
//                                   setSelectedSuppliers((prev) =>
//                                     prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
//                                   )
//                                 }
//                               />
//                               {s}
//                             </label>
//                           ))}
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* QTY Type */}
//                 <DropdownMenu open={openQtyDropdown} onOpenChange={setOpenQtyDropdown}>
//                   <DropdownMenuTrigger asChild>
//                     <Button variant="outline" size="sm" className="gap-2 border-slate-300 translate-x-2">
//                       QTY
//                       <ChevronDown className="h-3.5 w-3.5" />
//                     </Button>
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="w-48">
//                     <DropdownMenuCheckboxItem
//                       checked={qtyType === "UNIT"}
//                       onCheckedChange={() => {
//                         setQtyType("UNIT");
//                         setColumnFilters((prev) => ({ ...prev, unit: false, pkgSize: true }));
//                       }}
//                     >
//                       UNIT
//                     </DropdownMenuCheckboxItem>
//                     <DropdownMenuCheckboxItem
//                       checked={qtyType === "PKG SIZE"}
//                       onCheckedChange={() => {
//                         setQtyType("PKG SIZE");
//                         setColumnFilters((prev) => ({ ...prev, unit: false, pkgSize: true }));
//                       }}
//                     >
//                       PKG SIZE
//                     </DropdownMenuCheckboxItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>

//                 {/* Drug Type (hidden) */}
//                 <DropdownMenu open={openDrugTypeDropdown} onOpenChange={setOpenDrugTypeDropdown}>
//                   <DropdownMenuTrigger asChild>
//                     <span />
//                   </DropdownMenuTrigger>
//                   <DropdownMenuContent align="end" className="w-48">
//                     <DropdownMenuCheckboxItem
//                       checked={drugTypes.includes("ALL DRUGS")}
//                       onCheckedChange={() => handleDrugTypeToggle("ALL DRUGS")}
//                     >
//                       ALL DRUGS
//                     </DropdownMenuCheckboxItem>
//                     <DropdownMenuCheckboxItem
//                       checked={drugTypes.includes("BRAND")}
//                       onCheckedChange={() => handleDrugTypeToggle("BRAND")}
//                     >
//                       BRAND
//                     </DropdownMenuCheckboxItem>
//                     <DropdownMenuCheckboxItem
//                       checked={drugTypes.includes("GENERIC")}
//                       onCheckedChange={() => handleDrugTypeToggle("GENERIC")}
//                     >
//                       GENERIC
//                     </DropdownMenuCheckboxItem>
//                   </DropdownMenuContent>
//                 </DropdownMenu>

//                 {/* Max Cost */}
//                 <div className="flex items-center gap-2">
//                   <Input
//                     type="number"
//                     placeholder="Max Cost"
//                     value={costValue}
//                     onChange={(e) => setCostValue(Number(e.target.value) || "")}
//                     className="w-[110px] h-8 border-slate-300"
//                   />
//                 </div>

//                 {/* Max Amount */}
//                 <div className="flex items-center gap-2">
//                   <Input
//                     type="number"
//                     placeholder="Max Amount"
//                     value={amountValue}
//                     onChange={(e) => setAmountValue(Number(e.target.value) || "")}
//                     className="w-[120px] h-8 border-slate-300"
//                   />
//                 </div>

//                 {/* Rows per page */}
//                 <Select
//                   value={String(rowsPerPage)}
//                   onValueChange={(v) => setRowsPerPage(Number(v))}
//                 >
//                   <SelectTrigger className="w-[120px] h-8 border-slate-300">
//                     <SelectValue placeholder={`Rows: ${rowsPerPage}/${totalRows}`} />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {rowOptions.map((n) => (
//                       <SelectItem key={n} value={String(n)}>
//                         {n === totalRows ? `All (${totalRows})` : n}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             {(activeFilters.length > 0 || costValue !== "") && (
//               <div className="px-6 pb-4 flex items-center gap-2 flex-wrap">
//                 <span className="text-xs font-medium text-slate-600">Active filters:</span>
//                 {activeFilters.map((chip) => (
//                   <Badge
//                     key={chip.id}
//                     variant="secondary"
//                     className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
//                   >
//                     <span className="text-xs font-medium">{chip.label}</span>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="h-3.5 w-3.5 p-0 hover:bg-transparent"
//                       onClick={() => removeFilter(chip.id)}
//                     >
//                       <X className="h-3 w-3" />
//                     </Button>
//                   </Badge>
//                 ))}
//                 {costValue !== "" && (
//                   <Badge
//                     variant="secondary"
//                     className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
//                   >
//                     <span className="text-xs font-medium">Cost: ${costValue}</span>
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       className="h-3.5 w-3.5 p-0 hover:bg-transparent"
//                       onClick={() => setCostValue("")}
//                     >
//                       <X className="h-3 w-3" />
//                     </Button>
//                   </Badge>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Table */}
//           <div className="flex-1 bg-white relative overflow-hidden flex flex-col min-w-0 z-20 w-full border border-slate-200 rounded-md">
//             <div
//               ref={bodyScrollRef}
//               className="flex-1 overflow-auto min-w-0 relative z-0 scrollbar-hide"
//               style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//             >
//               <style jsx>{`
//                 .scrollbar-hide::-webkit-scrollbar { display: none; }
//               `}</style>

//               <Table className="w-full border-separate border-spacing-0">
//                 <TableHeader className="relative z-[60]">
//                   <TableRow className="hover:bg-transparent">
//                     <TableHead className="sticky top-0 left-0 z-[100] bg-white w-14 min-w-[56px] border-r border-b border-slate-200 h-[52px] px-3">
//                       <div className="flex items-center justify-center">
//                         <Checkbox
//                           checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
//                           onCheckedChange={toggleSelectAll}
//                         />
//                       </div>
//                     </TableHead>

//                     {columnFilters.rank && (
//                       <TableHead
//                         className="sticky top-0 z-[100] bg-white w-20 min-w-[80px] border-r border-b border-slate-200 h-[52px] px-3"
//                         style={{ left: "56px" }}
//                       >
//                         <HeaderCell sortKey="rank" sortRules={sortRules} onSort={handleSort}>
//                           <span className="truncate whitespace-nowrap">Rank</span>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.ndc && (
//                       <TableHead
//                         className="sticky top-0 z-[100] bg-white w-[140px] min-w-[140px] border-r border-b border-slate-200 h-[52px] px-3"
//                         style={{ left: `${56 + (columnFilters.rank ? 80 : 0)}px` }}
//                       >
//                         <HeaderCell sortKey="ndc" sortRules={sortRules} onSort={handleSort}>
//                           <span className="truncate whitespace-nowrap">NDC</span>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.drugName && (
//                       <TableHead
//                         className="sticky top-0 z-[100] bg-white w-60 min-w-[240px] border-r border-b border-slate-200 h-[52px] px-3"
//                         style={{ left: `${56 + (columnFilters.rank ? 80 : 0) + (columnFilters.ndc ? 140 : 0)}px` }}
//                       >
//                         <HeaderCell sortKey="drugName" sortRules={sortRules} onSort={handleSort}>
//                           <span className="truncate whitespace-nowrap">Drug Name</span>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.pkgSize && (
//                       <TableHead
//                         className="sticky top-0 z-[100] bg-white w-[100px] min-w-[100px] border-r border-b border-slate-200 h-[52px] px-3"
//                         style={{ left: `${56 + (columnFilters.rank ? 80 : 0) + (columnFilters.ndc ? 140 : 0) + (columnFilters.drugName ? 240 : 0)}px` }}
//                       >
//                         <HeaderCell sortKey="pkgSize" sortRules={sortRules} onSort={handleSort}>
//                           <span className="truncate whitespace-nowrap">PKG Size</span>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.unit && (
//                       <TableHead
//                         className="sticky top-0 z-[100] bg-white w-[100px] min-w-[100px] border-r border-b border-slate-200 h-[52px] px-3"
//                         style={{ left: `${56 + (columnFilters.rank ? 80 : 0) + (columnFilters.ndc ? 140 : 0) + (columnFilters.drugName ? 240 : 0) + (columnFilters.pkgSize ? 100 : 0)}px` }}
//                       >
//                         <HeaderCell sortKey="unit" sortRules={sortRules} onSort={handleSort}>
//                           <span className="truncate whitespace-nowrap">Unit</span>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.totalOrdered && (
//                       <TableHead
//                         className="sticky top-0 z-[100] bg-white w-[140px] min-w-[140px] border-r border-b border-slate-200 h-[52px] px-3 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.15)]"
//                         style={{ left: `${56 + (columnFilters.rank ? 80 : 0) + (columnFilters.ndc ? 140 : 0) + (columnFilters.drugName ? 240 : 0) + (columnFilters.pkgSize ? 100 : 0) + (columnFilters.unit ? 100 : 0)}px` }}
//                       >
//                         <HeaderCell sortKey="totalOrdered" sortRules={sortRules} onSort={handleSort}>
//                           <div className="flex items-center gap-2 overflow-hidden justify-center">
//                             <div className="h-2 w-2 rounded-full bg-emerald-600 shrink-0" />
//                             <span className="truncate whitespace-nowrap">Total Ordered</span>
//                           </div>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.totalBilled && (
//                       <TableHead className="sticky top-0 z-50 bg-white w-[140px] min-w-[140px] border-r border-b border-slate-200 h-[52px] px-3">
//                         <HeaderCell sortKey="totalBilled" sortRules={sortRules} onSort={handleSort}>
//                           <div className="flex items-center gap-2 overflow-hidden justify-center">
//                             <div className="h-2 w-2 rounded-full bg-red-500 shrink-0" />
//                             <span className="truncate whitespace-nowrap">Total Billed</span>
//                           </div>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.totalShortage && (
//                       <TableHead className="sticky top-0 z-50 bg-white w-[140px] min-w-[140px] border-r border-b border-slate-200 h-[52px] px-3">
//                         <HeaderCell sortKey="totalShortage" sortRules={sortRules} onSort={handleSort}>
//                           <div className="flex items-center gap-2 overflow-hidden justify-center">
//                             <div className="h-2 w-2 rounded-full bg-yellow-500 shrink-0" />
//                             <span className="truncate whitespace-nowrap">Total Shortage</span>
//                           </div>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.highestShortage && (
//                       <TableHead className="sticky top-0 z-50 bg-white w-[150px] min-w-[150px] border-r border-b border-slate-200 h-[52px] px-3">
//                         <HeaderCell sortKey="highestShortage" sortRules={sortRules} onSort={handleSort}>
//                           <span className="truncate whitespace-nowrap">
//                             <div className="h-2 w-2 rounded-full bg-yellow-500 shrink-0 -translate-x-4 translate-y-3" />
//                             Highest Shortage
//                           </span>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.cost && (
//                       <TableHead className="sticky top-0 z-50 bg-white w-[120px] min-w-[120px] border-r border-b border-slate-200 h-[52px] px-3">
//                         <HeaderCell sortKey="cost" sortRules={sortRules} onSort={handleSort}>
//                           <div className="h-2 w-2 rounded-full bg-red-500 shrink-0 -translate-x-4 translate-y-3" />
//                           <span className="truncate whitespace-nowrap">$ Cost</span>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.amount && (
//                       <TableHead className="sticky top-0 z-50 bg-white w-[120px] min-w-[120px] border-r border-b border-slate-200 h-[52px] px-3">
//                         <HeaderCell sortKey="amount" sortRules={sortRules} onSort={handleSort}>
//                           <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0 -translate-x-4 translate-y-3" />
//                           <span className="truncate whitespace-nowrap">$ Amount</span>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.horizon && (
//                       <TableHead className="sticky top-0 z-50 bg-white w-[140px] min-w-[140px] border-r border-b border-slate-200 h-[52px] px-3">
//                         <HeaderCell sortKey="horizon" sortRules={sortRules} onSort={handleSort}>
//                           <div className="h-2 w-2 rounded-full bg-yellow-500 shrink-0 -translate-x-4 translate-y-3" />
//                           <span className="truncate whitespace-nowrap">Horizon Health</span>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.shortageHorizon && (
//                       <TableHead className="sticky top-0 z-50 bg-white w-[150px] min-w-[150px] border-r border-b border-slate-200 h-[52px] px-3">
//                         <HeaderCell sortKey="shortageHorizon" sortRules={sortRules} onSort={handleSort}>
//                           <div className="h-2 w-2 rounded-full bg-red-500 shrink-0 -translate-x-4 translate-y-3" />
//                           <span className="truncate whitespace-nowrap">Shortage Horizon</span>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.express && (
//                       <TableHead className="sticky top-0 z-50 bg-white w-[140px] min-w-[140px] border-r border-b border-slate-200 h-[52px] px-3">
//                         <HeaderCell sortKey="express" sortRules={sortRules} onSort={handleSort}>
//                           <div className="h-2 w-2 rounded-full bg-yellow-500 shrink-0 -translate-x-4 translate-y-3" />
//                           <span className="truncate whitespace-nowrap">Express Scripts</span>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.shortageExpress && (
//                       <TableHead className="sticky top-0 z-50 bg-white w-[150px] min-w-[150px] border-r border-b border-slate-200 h-[52px] px-3">
//                         <HeaderCell sortKey="shortageExpress" sortRules={sortRules} onSort={handleSort}>
//                           <div className="h-2 w-2 rounded-full bg-red-500 shrink-0 -translate-x-4 translate-y-3" />
//                           <span className="truncate whitespace-nowrap">Shortage Express</span>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.pdmi && (
//                       <TableHead className="sticky top-0 z-50 bg-white w-[180px] min-w-[180px] border-r border-b border-slate-200 h-[52px] px-3">
//                         <HeaderCell sortKey="pdmi" sortRules={sortRules} onSort={handleSort}>
//                           <div className="h-2 w-2 rounded-full bg-yellow-500 shrink-0 -translate-x-4 translate-y-3" />
//                           <span className="truncate whitespace-nowrap">PDMI (CO-PAY CARD)</span>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.shortagePdmi && (
//                       <TableHead className="sticky top-0 z-50 bg-white w-[150px] min-w-[150px] border-r border-b border-slate-200 h-[52px] px-3">
//                         <HeaderCell sortKey="shortagePdmi" sortRules={sortRules} onSort={handleSort}>
//                           <div className="h-2 w-2 rounded-full bg-red-500 shrink-0 -translate-x-4 translate-y-3" />
//                           <span className="truncate whitespace-nowrap">Shortage PDMI</span>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.optumrx && (
//                       <TableHead className="sticky top-0 z-50 bg-white w-[120px] min-w-[120px] border-r border-b border-slate-200 h-[52px] px-3">
//                         <HeaderCell sortKey="optumrx" sortRules={sortRules} onSort={handleSort}>
//                           <div className="h-2 w-2 rounded-full bg-yellow-500 shrink-0 -translate-x-4 translate-y-3" />
//                           <span className="truncate whitespace-nowrap">Optumrx</span>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.shortageOptumrx && (
//                       <TableHead className="sticky top-0 z-50 bg-white w-[150px] min-w-[150px] border-r border-b border-slate-200 h-[52px] px-3">
//                         <HeaderCell sortKey="shortageOptumrx" sortRules={sortRules} onSort={handleSort}>
//                           <div className="h-2 w-2 rounded-full bg-red-500 shrink-0 -translate-x-4 translate-y-3" />
//                           <span className="truncate whitespace-nowrap">Shortage Optumrx</span>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.cvsCaremark && (
//                       <TableHead className="sticky top-0 z-50 bg-white w-[140px] min-w-[140px] border-r border-b border-slate-200 h-[52px] px-3">
//                         <HeaderCell sortKey="cvsCaremark" sortRules={sortRules} onSort={handleSort}>
//                           <div className="h-2 w-2 rounded-full bg-yellow-500 shrink-0 -translate-x-4 translate-y-3" />
//                           <span className="truncate whitespace-nowrap">CVS Caremark</span>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.shortageCvsCaremark && (
//                       <TableHead className="sticky top-0 z-50 bg-white w-[180px] min-w-[180px] border-r border-b border-slate-200 h-[52px] px-3">
//                         <HeaderCell sortKey="shortageCvsCaremark" sortRules={sortRules} onSort={handleSort}>
//                           <div className="h-2 w-2 rounded-full bg-red-500 shrink-0 -translate-x-4 translate-y-3" />
//                           <span className="truncate whitespace-nowrap">Shortage CVS Caremark</span>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.ssc && (
//                       <TableHead className="sticky top-0 z-50 bg-white w-[120px] min-w-[120px] border-r border-b border-slate-200 h-[52px] px-3">
//                         <HeaderCell sortKey="ssc" sortRules={sortRules} onSort={handleSort}>
//                           <div className="h-2 w-2 rounded-full bg-yellow-500 shrink-0 -translate-x-4 translate-y-3" />
//                           <span className="truncate whitespace-nowrap">Billed SSC</span>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.shortageSsc && (
//                       <TableHead className="sticky top-0 z-50 bg-white w-[140px] min-w-[140px] border-r border-b border-slate-200 h-[52px] px-3">
//                         <HeaderCell sortKey="shortageSsc" sortRules={sortRules} onSort={handleSort}>
//                           <div className="h-2 w-2 rounded-full bg-red-500 shrink-0 -translate-x-4 translate-y-3" />
//                           <span className="truncate whitespace-nowrap">Shortage SSC</span>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.njMedicaid && (
//                       <TableHead className="sticky top-0 z-50 bg-white w-[130px] min-w-[130px] border-r border-b border-slate-200 h-[52px] px-3">
//                         <HeaderCell sortKey="njMedicaid" sortRules={sortRules} onSort={handleSort}>
//                           <div className="h-2 w-2 rounded-full bg-yellow-500 shrink-0 -translate-x-4 translate-y-3" />
//                           <span className="truncate whitespace-nowrap">NJ Medicaid</span>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.shortageNjMedicaid && (
//                       <TableHead className="sticky top-0 z-50 bg-white w-[170px] min-w-[170px] border-r border-b border-slate-200 h-[52px] px-3">
//                         <HeaderCell sortKey="shortageNjMedicaid" sortRules={sortRules} onSort={handleSort}>
//                           <div className="h-2 w-2 rounded-full bg-red-500 shrink-0 -translate-x-4 translate-y-3" />
//                           <span className="truncate whitespace-nowrap">Shortage NJ Medicaid</span>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.humana && (
//                       <TableHead className="sticky top-0 z-50 bg-white w-[130px] min-w-[130px] border-r border-b border-slate-200 h-[52px] px-3">
//                         <HeaderCell sortKey="humana" sortRules={sortRules} onSort={handleSort}>
//                           <div className="h-2 w-2 rounded-full bg-yellow-500 shrink-0 -translate-x-4 translate-y-3" />
//                           <span className="truncate whitespace-nowrap">Humana</span>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                     {columnFilters.shortageHumana && (
//                       <TableHead className="sticky top-0 z-50 bg-white w-[160px] min-w-[160px] border-r border-b border-slate-200 h-[52px] px-3">
//                         <HeaderCell sortKey="shortageHumana" sortRules={sortRules} onSort={handleSort}>
//                           <div className="h-2 w-2 rounded-full bg-red-500 shrink-0 -translate-x-4 translate-y-3" />
//                           <span className="truncate whitespace-nowrap">Shortage Humana</span>
//                         </HeaderCell>
//                       </TableHead>
//                     )}

//                   </TableRow>
//                 </TableHeader>

//                 <TableBody>
//                   {paginatedData.map((row) => (
//                     <TableRow
//                       key={row.id}
//                       className="group bg-white cursor-pointer transition-colors hover:bg-slate-50 border-b border-slate-100 h-[36px]"
//                       onClick={() => {
//                         setActiveDrug(row);
//                         setOpenDrugSidebar(true);
//                       }}
//                     >
//                       <TableCell
//                         className="sticky left-0 z-20 bg-white group-hover:bg-slate-50 w-14 min-w-[56px] border-r border-slate-100 h-[36px] px-3"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <div className="flex items-center justify-center">
//                           <Checkbox
//                             checked={selectedRows.includes(row.id)}
//                             onCheckedChange={() => toggleRowSelection(row.id)}
//                           />
//                         </div>
//                       </TableCell>

//                       {columnFilters.rank && (
//                         <TableCell
//                           className="sticky z-20 bg-white group-hover:bg-slate-50 w-20 min-w-[80px] text-right border-r border-slate-100 h-[36px] px-3"
//                           style={{ left: "56px" }}
//                         >
//                           {row.rank}
//                         </TableCell>
//                       )}

//                       {columnFilters.ndc && (
//                         <TableCell
//                           className="sticky z-20 bg-white group-hover:bg-slate-50 w-[140px] min-w-[140px] text-right border-r border-slate-100 h-[36px] px-3"
//                           style={{ left: `${56 + (columnFilters.rank ? 80 : 0)}px` }}
//                         >
//                           {row.ndc}
//                         </TableCell>
//                       )}

//                       {columnFilters.drugName && (
//                         <TableCell
//                           className="sticky z-20 bg-white group-hover:bg-slate-50 w-60 min-w-[240px] text-left border-r border-slate-100 h-[36px] px-3"
//                           style={{ left: `${56 + (columnFilters.rank ? 80 : 0) + (columnFilters.ndc ? 140 : 0)}px` }}
//                         >
//                           <span className="font-bold text-slate-900 truncate block">{row.drugName}</span>
//                         </TableCell>
//                       )}

//                       {columnFilters.pkgSize && (
//                         <TableCell
//                           className="sticky z-20 bg-white group-hover:bg-slate-50 w-[100px] min-w-[100px] text-right border-r border-slate-100 h-[36px] px-3"
//                           style={{ left: `${56 + (columnFilters.rank ? 80 : 0) + (columnFilters.ndc ? 140 : 0) + (columnFilters.drugName ? 240 : 0)}px` }}
//                         >
//                           {row.pkgSize}
//                         </TableCell>
//                       )}

//                       {columnFilters.unit && (
//                         <TableCell
//                           className="sticky z-20 bg-white group-hover:bg-slate-50 w-[100px] min-w-[100px] text-right border-r border-slate-100 h-[36px] px-3"
//                           style={{ left: `${56 + (columnFilters.rank ? 80 : 0) + (columnFilters.ndc ? 140 : 0) + (columnFilters.drugName ? 240 : 0) + (columnFilters.pkgSize ? 100 : 0)}px` }}
//                         >
//                           {row.unit}
//                         </TableCell>
//                       )}

//                       {columnFilters.totalOrdered && (
//                         <TableCell
//                           className="sticky z-20 bg-white group-hover:bg-slate-50 w-[140px] min-w-[140px] text-right border-r border-slate-100 h-[36px] px-3 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.15)]"
//                           style={{ left: `${56 + (columnFilters.rank ? 80 : 0) + (columnFilters.ndc ? 140 : 0) + (columnFilters.drugName ? 240 : 0) + (columnFilters.pkgSize ? 100 : 0) + (columnFilters.unit ? 100 : 0)}px` }}
//                         >
//                           {row.totalOrdered.toLocaleString()}
//                         </TableCell>
//                       )}

//                       {columnFilters.totalBilled && (
//                         <TableCell className="bg-white group-hover:bg-slate-50 w-[140px] min-w-[140px] text-right border-r border-slate-100 h-[36px] px-3">
//                           {row.totalBilled.toLocaleString()}
//                         </TableCell>
//                       )}

//                       {columnFilters.totalShortage && (
//                         <TableCell className="bg-white group-hover:bg-slate-50 w-[140px] min-w-[140px] text-right border-r border-slate-100 h-[36px] px-3">
//                           {renderShortageValue(row.totalShortage)}
//                         </TableCell>
//                       )}

//                       {columnFilters.highestShortage && (
//                         <TableCell className="bg-white group-hover:bg-slate-50 w-[150px] min-w-[150px] text-right border-r border-slate-100 h-[36px] px-3">
//                           {renderShortageValue(row.highestShortage)}
//                         </TableCell>
//                       )}

//                       {columnFilters.cost && (
//                         <TableCell className="bg-white group-hover:bg-slate-50 w-[120px] min-w-[120px] text-right border-r border-slate-100 h-[36px] px-3">
//                           ${row.cost.toFixed(2)}
//                         </TableCell>
//                       )}

//                       {columnFilters.amount && (
//                         <TableCell className="bg-white group-hover:bg-slate-50 w-[120px] min-w-[120px] text-right border-r border-slate-100 h-[36px] px-3">
//                           ${row.amount.toFixed(2)}
//                         </TableCell>
//                       )}

//                       {columnFilters.horizon && (
//                         <TableCell className="bg-white group-hover:bg-slate-50 w-[140px] min-w-[140px] text-right border-r border-slate-100 h-[36px] px-3">
//                           {row.horizon}
//                         </TableCell>
//                       )}

//                       {columnFilters.shortageHorizon && (
//                         <TableCell className="bg-white group-hover:bg-slate-50 w-[150px] min-w-[150px] text-right border-r border-slate-100 h-[36px] px-3">
//                           {renderShortageValue(row.shortageHorizon)}
//                         </TableCell>
//                       )}

//                       {columnFilters.express && (
//                         <TableCell className="bg-white group-hover:bg-slate-50 w-[140px] min-w-[140px] text-right border-r border-slate-100 h-[36px] px-3">
//                           {row.express}
//                         </TableCell>
//                       )}

//                       {columnFilters.shortageExpress && (
//                         <TableCell className="bg-white group-hover:bg-slate-50 w-[150px] min-w-[150px] text-right border-r border-slate-100 h-[36px] px-3">
//                           {renderShortageValue(row.shortageExpress)}
//                         </TableCell>
//                       )}

//                       {columnFilters.pdmi && (
//                         <TableCell className="bg-white group-hover:bg-slate-50 w-[180px] min-w-[180px] text-right border-r border-slate-100 h-[36px] px-3">
//                           {row.pdmi}
//                         </TableCell>
//                       )}

//                       {columnFilters.shortagePdmi && (
//                         <TableCell className="bg-white group-hover:bg-slate-50 w-[150px] min-w-[150px] text-right border-r border-slate-100 h-[36px] px-3">
//                           {renderShortageValue(row.shortagePdmi)}
//                         </TableCell>
//                       )}

//                       {columnFilters.optumrx && (
//                         <TableCell className="bg-white group-hover:bg-slate-50 w-[120px] min-w-[120px] text-right border-r border-slate-100 h-[36px] px-3">
//                           {row.optumrx}
//                         </TableCell>
//                       )}

//                       {columnFilters.shortageOptumrx && (
//                         <TableCell className="bg-white group-hover:bg-slate-50 w-[150px] min-w-[150px] text-right border-r border-slate-100 h-[36px] px-3">
//                           {renderShortageValue(row.shortageOptumrx)}
//                         </TableCell>
//                       )}

//                       {columnFilters.cvsCaremark && (
//                         <TableCell className="bg-white group-hover:bg-slate-50 w-[140px] min-w-[140px] text-right border-r border-slate-100 h-[36px] px-3">
//                           {row.cvsCaremark}
//                         </TableCell>
//                       )}

//                       {columnFilters.shortageCvsCaremark && (
//                         <TableCell className="bg-white group-hover:bg-slate-50 w-[180px] min-w-[180px] text-right border-r border-slate-100 h-[36px] px-3">
//                           {renderShortageValue(row.shortageCvsCaremark)}
//                         </TableCell>
//                       )}

//                       {columnFilters.ssc && (
//                         <TableCell className="bg-white group-hover:bg-slate-50 w-[120px] min-w-[120px] text-right border-r border-slate-100 h-[36px] px-3">
//                           {row.ssc}
//                         </TableCell>
//                       )}

//                       {columnFilters.shortageSsc && (
//                         <TableCell className="bg-white group-hover:bg-slate-50 w-[140px] min-w-[140px] text-right border-r border-slate-100 h-[36px] px-3">
//                           {renderShortageValue(row.shortageSsc)}
//                         </TableCell>
//                       )}

//                       {columnFilters.njMedicaid && (
//                         <TableCell className="bg-white group-hover:bg-slate-50 w-[130px] min-w-[130px] text-right border-r border-slate-100 h-[36px] px-3">
//                           {row.njMedicaid}
//                         </TableCell>
//                       )}

//                       {columnFilters.shortageNjMedicaid && (
//                         <TableCell className="bg-white group-hover:bg-slate-50 w-[170px] min-w-[170px] text-right border-r border-slate-100 h-[36px] px-3">
//                           {renderShortageValue(row.shortageNjMedicaid)}
//                         </TableCell>
//                       )}

//                        {columnFilters.humana && (
//                         <TableCell className="bg-white group-hover:bg-slate-50 w-[130px] min-w-[130px] text-right border-r border-slate-100 h-[36px] px-3">
//                           {row.humana}
//                         </TableCell>
//                       )}

//                       {columnFilters.shortageHumana && (
//                         <TableCell className="bg-white group-hover:bg-slate-50 w-[160px] min-w-[160px] text-right border-r border-slate-100 h-[36px] px-3">
//                           {renderShortageValue(row.shortageHumana)}
//                         </TableCell>
//                       )}
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>

//             {/* Pagination */}
//             <div className="border-t border-slate-200 bg-white px-4 py-3 flex items-center justify-between z-30">
//               <div className="text-sm text-slate-500">
//                 Showing{" "}
//                 <span className="font-medium">
//                   {filteredData.length === 0 ? 0 : (currentPage - 1) * effectiveRowsPerPage + 1}
//                 </span>{" "}
//                 to{" "}
//                 <span className="font-medium">
//                   {Math.min(currentPage * effectiveRowsPerPage, filteredData.length)}
//                 </span>{" "}
//                 of <span className="font-medium">{filteredData.length}</span> results
//               </div>
//               <div className="flex items-center gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                 >
//                   Previous
//                 </Button>
//                 <div className="flex items-center gap-1">
//                   {(() => {
//                     const pages = [];
//                     const delta = 2;
//                     const left = Math.max(2, currentPage - delta);
//                     const right = Math.min(totalPages - 1, currentPage + delta);
//                     pages.push(1);
//                     if (left > 2) pages.push(-1);
//                     for (let i = left; i <= right; i++) pages.push(i);
//                     if (right < totalPages - 1) pages.push(-2);
//                     if (totalPages > 1) pages.push(totalPages);
//                     return pages.map((page, idx) =>
//                       page < 0 ? (
//                         <span key={`ellipsis-${idx}`} className="px-1 text-slate-400">…</span>
//                       ) : (
//                         <Button
//                           key={page}
//                           variant={currentPage === page ? "default" : "outline"}
//                           size="sm"
//                           className="w-8 h-8 p-0"
//                           onClick={() => setCurrentPage(page)}
//                         >
//                           {page}
//                         </Button>
//                       )
//                     );
//                   })()}
//                 </div>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                 >
//                   Next
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* Export Modal */}
//           <Dialog open={openExportModal} onOpenChange={setOpenExportModal}>
//             <DialogContent className="sm:max-w-md">
//               <DialogHeader>
//                 <DialogTitle className="text-xl font-bold">Export Report</DialogTitle>
//                 <DialogDescription>
//                   Choose your preferred format and scope for the export
//                 </DialogDescription>
//               </DialogHeader>
//               <div className="space-y-6 py-4">
//                 <div className="space-y-3">
//                   <Label className="text-sm font-semibold text-slate-900">Export Format</Label>
//                   <RadioGroup value={exportFormat} onValueChange={(v) => setExportFormat(v as any)}>
//                     {["csv", "excel", "pdf"].map((fmt) => (
//                       <div key={fmt} className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
//                         <RadioGroupItem value={fmt} id={fmt} />
//                         <Label htmlFor={fmt} className="flex-1 cursor-pointer font-medium capitalize">{fmt}</Label>
//                       </div>
//                     ))}
//                   </RadioGroup>
//                 </div>
//                 <div className="space-y-3">
//                   <Label className="text-sm font-semibold text-slate-900">Export Scope</Label>
//                   <RadioGroup value={exportScope} onValueChange={(v) => setExportScope(v as any)}>
//                     <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
//                       <RadioGroupItem value="visible" id="visible" />
//                       <Label htmlFor="visible" className="flex-1 cursor-pointer font-medium">Visible Rows Only</Label>
//                     </div>
//                     <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
//                       <RadioGroupItem value="all" id="all" />
//                       <Label htmlFor="all" className="flex-1 cursor-pointer font-medium">All Data</Label>
//                     </div>
//                   </RadioGroup>
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button variant="outline" onClick={() => setOpenExportModal(false)}>Cancel</Button>
//                 <Button onClick={handleExport} className="bg-emerald-600 hover:bg-emerald-700">Export</Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>

//           {/* Drug Details Sidebar */}
//           <Sheet open={openDrugSidebar} onOpenChange={setOpenDrugSidebar}>
//             <SheetContent className="w-[450px] sm:w-[540px] bg-gradient-to-br from-white to-slate-50">
//               <SheetHeader>
//                 <SheetTitle className="text-xl font-bold text-slate-900">Drug Details</SheetTitle>
//                 <SheetDescription className="text-sm text-slate-600">
//                   {activeDrug ? activeDrug.drugName : "No drug selected"}
//                 </SheetDescription>
//               </SheetHeader>
//               {activeDrug && (
//                 <div className="mt-8 space-y-5">
//                   <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
//                     <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">NDC</Label>
//                     <p className="text-base font-mono font-semibold text-slate-900 mt-1">{activeDrug.ndc}</p>
//                   </div>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
//                       <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Package Size</Label>
//                       <p className="text-lg font-bold text-slate-900 mt-1">{activeDrug.pkgSize}</p>
//                     </div>
//                     <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
//                       <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cost</Label>
//                       <p className="text-lg font-bold text-emerald-700 mt-1">${activeDrug.cost.toFixed(2)}</p>
//                     </div>
//                   </div>
//                   <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
//                     <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Ordered</Label>
//                     <p className="text-lg font-bold text-slate-900 mt-1">{activeDrug.totalOrdered.toLocaleString()}</p>
//                   </div>
//                   <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
//                     <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Billed</Label>
//                     <p className="text-lg font-bold text-slate-900 mt-1">{activeDrug.totalBilled.toLocaleString()}</p>
//                   </div>
//                   <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
//                     <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Shortage</Label>
//                     <p className="text-lg font-bold mt-1">{renderShortageValue(activeDrug.totalShortage)}</p>
//                   </div>
//                 </div>
//               )}
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import AppSidebar from "@/components/Sidebar";
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
import { useParams } from "next/navigation";

interface SortRule {
  key: keyof InventoryRow;
  dir: "asc" | "desc";
}

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
  sortKey: keyof InventoryRow;
  sortRules: SortRule[];
  onSort: (key: keyof InventoryRow, e: React.MouseEvent) => void;
}) {
  const active = sortRules.find((r) => r.key === sortKey)?.dir;

  return (
    <div
      onClick={(e) => onSort(sortKey, e)}
      className="h-full px-3 py-1.5 flex items-center justify-center gap-1 cursor-pointer select-none whitespace-nowrap transition-colors hover:bg-emerald-50/50"
    >
      <span className="text-[11px] font-bold uppercase tracking-wide text-slate-700">
        {children}
      </span>
      <SortIcon dir={active} />
    </div>
  );
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
  horizon: number;
  shortageHorizon: number;
  express: number;
  shortageExpress: number;
  cvsCaremark: number;
  shortageCvsCaremark: number;
  ssc: number;
  shortageSsc: number;
  njMedicaid: number;
  shortageNjMedicaid: number;
  pdmi: number;
  shortagePdmi: number;
  optumrx: number;
  shortageOptumrx: number;
  humana: number;
  shortageHumana: number;
}

interface FilterChip {
  id: string;
  label: string;
  value: string;
}

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
  const [activeFilters, setActiveFilters] = useState<FilterChip[]>([]);
  const [qtyType, setQtyType] = useState<"UNIT" | "PKG SIZE" | null>("PKG SIZE");
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
  const [activeDrug, setActiveDrug] = useState<InventoryRow | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [controlledSchedules, setControlledSchedules] = useState<string[]>([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [auditDates, setAuditDates] = useState<any>(null);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);

  const headerScrollRef = useRef<HTMLDivElement | null>(null);
  const bodyScrollRef = useRef<HTMLDivElement | null>(null);
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

  const params = useParams();
  const auditId = params.id as string;

  useEffect(() => {
    const loadReport = async () => {
      let progressInterval: ReturnType<typeof setInterval> | null = null;
      try {
        setLoading(true);
        setLoadingProgress(0);
        setLoadingDone(false);
        progressInterval = setInterval(() => {
          setLoadingProgress((prev) => {
            if (prev >= 90) { clearInterval(progressInterval!); return 90; }
            return prev + Math.random() * 8 + 2;
          });
        }, 200);

        const res = await fetch(`http://localhost:5000/api/audits/${auditId}/report`);
        const json = await res.json();

        const data = Array.isArray(json)
          ? json
          : Array.isArray(json.inventory)
          ? json.inventory
          : [];

        const normalized = data.map((row: any, index: number) => ({
          id: row.id ?? index + 1,
          ndc: row.ndc ?? "",
          drugName: (row.drug_name ?? row.drugName ?? "").replace(/\s*\(\d{5}-\d{4}-\d{2}\).*$/, "").trim(),
          rank: 0,
          pkgSize: row.package_size ?? 0,
          unit: row.package_size > 0
            ? Number((Number(row.total_billed ?? 0) / Number(row.package_size)).toFixed(2))
            : 0,
          totalOrdered: Number(row.total_ordered ?? 0),
          totalBilled: Number(row.total_billed ?? 0),
          totalShortage: row.total_shortage !== undefined && row.total_shortage !== null
            ? Number(row.total_shortage)
            : Number(row.total_ordered ?? 0) - Number(row.total_billed ?? 0),
          highestShortage: 0,
          cost: Number(row.cost ?? 0),
          amount: Number(row.total_amount ?? row.amount ?? 0),
          horizon: Number(row.horizon ?? 0),
          shortageHorizon: Number(row.total_ordered ?? 0) - Number(row.horizon ?? 0),
          express: Number(row.express ?? 0),
          shortageExpress: Number(row.total_ordered ?? 0) - Number(row.express ?? 0),
          cvsCaremark: Number(row.cvs_caremark ?? row.cvsCaremark ?? 0),
          shortageCvsCaremark: Number(row.total_ordered ?? 0) - Number(row.cvs_caremark ?? row.cvsCaremark ?? 0),
          optumrx: Number(row.optumrx ?? 0),
          shortageOptumrx: Number(row.total_ordered ?? 0) - Number(row.optumrx ?? 0),
          humana: Number(row.humana ?? 0),
          shortageHumana: Number(row.total_ordered ?? 0) - Number(row.humana ?? 0),
          njMedicaid: Number(row.nj_medicaid ?? row.njMedicaid ?? 0),
          shortageNjMedicaid: Number(row.total_ordered ?? 0) - Number(row.nj_medicaid ?? row.njMedicaid ?? 0),
          ssc: Number(row.ssc ?? 0),
          shortageSsc: Number(row.total_ordered ?? 0) - Number(row.ssc ?? 0),
          pdmi: Number(row.pdmi ?? 0),
          shortagePdmi: Number(row.total_ordered ?? 0) - Number(row.pdmi ?? 0),
        }));

        const sortedByBilled = [...normalized].sort((a, b) => b.amount - a.amount);
        sortedByBilled.forEach((row, index) => {
          row.rank = index + 1;
        });

        normalized.forEach((row: any) => {
          const shortageValues = [
            row.shortageHorizon,
            row.shortageExpress,
            row.shortageCvsCaremark,
            row.shortageOptumrx,
            row.shortageHumana,
            row.shortageNjMedicaid,
            row.shortageSsc,
            row.shortagePdmi,
          ];
          const mostNegative = Math.min(...shortageValues);
          row.highestShortage = mostNegative < 0 ? mostNegative : 0;
        });

        setInventoryData(normalized);

        const auditRes = await fetch(`http://localhost:5000/api/audits/${auditId}`);
        const auditData = await auditRes.json();
        setAuditDates(auditData);
      } catch (err) {
        console.error("Failed to load report", err);
        setInventoryData([]);
      } finally {
        if (progressInterval) clearInterval(progressInterval);
        setLoadingProgress(100);
        setTimeout(() => {
          setLoadingDone(true);
          setTimeout(() => setLoading(false), 400);
        }, 500);
      }
    };

    if (auditId) loadReport();
  }, [auditId]);

  const supplierToColumnKey: Record<string, keyof typeof columnFilters> = {
    Horizon: "horizon",
    Express: "express",
    "CVS Caremark": "cvsCaremark",
    SSC: "ssc",
    "NJ Medicaid": "njMedicaid",
    PDMI: "pdmi",
    OptumRx: "optumrx",
  };

  const [pbmFilters, setPbmFilters] = useState(availablePBMs);

  const [sortRules, setSortRules] = useState<SortRule[]>([
    { key: "totalShortage", dir: "asc" },
  ]);

  const [columnFilters, setColumnFilters] = useState({
    rank: true,
    ndc: true,
    drugName: true,
    pkgSize: true,
    unit: false,
    totalOrdered: true,
    totalBilled: true,
    totalShortage: true,
    highestShortage: true,
    cost: true,
    amount: true,
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
    humana: true,
    shortageHumana: true,
  });

  // ─── applyQtyMode MUST be defined before paginatedData ───────────────────────
  const applyQtyMode = (row: InventoryRow): InventoryRow => {
    const pkg = row.pkgSize || 1;

    if (qtyType === "PKG SIZE") {
      const newTotalOrdered = row.totalOrdered * pkg;
      const sH    = Number((newTotalOrdered - row.horizon).toFixed(2));
      const sEx   = Number((newTotalOrdered - row.express).toFixed(2));
      const sCvs  = Number((newTotalOrdered - row.cvsCaremark).toFixed(2));
      const sOpt  = Number((newTotalOrdered - row.optumrx).toFixed(2));
      const sHum  = Number((newTotalOrdered - row.humana).toFixed(2));
      const sNj   = Number((newTotalOrdered - row.njMedicaid).toFixed(2));
      const sSsc  = Number((newTotalOrdered - row.ssc).toFixed(2));
      const sPdmi = Number((newTotalOrdered - row.pdmi).toFixed(2));
      const minShortage = Math.min(sH, sEx, sCvs, sOpt, sHum, sNj, sSsc, sPdmi);
      return {
        ...row,
        totalOrdered:        Number(newTotalOrdered.toFixed(2)),
        totalShortage:       Number((newTotalOrdered - row.totalBilled).toFixed(2)),
        highestShortage:     Number((minShortage < 0 ? minShortage : 0).toFixed(2)),
        shortageHorizon:     sH,
        shortageExpress:     sEx,
        shortageCvsCaremark: sCvs,
        shortageOptumrx:     sOpt,
        shortageHumana:      sHum,
        shortageNjMedicaid:  sNj,
        shortageSsc:         sSsc,
        shortagePdmi:        sPdmi,
      };
    }

    if (qtyType === "UNIT") {
      const newTotalBilled  = Number((row.totalBilled  / pkg).toFixed(2));
      const newHorizon      = Number((row.horizon      / pkg).toFixed(2));
      const newExpress      = Number((row.express      / pkg).toFixed(2));
      const newCvsCaremark  = Number((row.cvsCaremark  / pkg).toFixed(2));
      const newOptumrx      = Number((row.optumrx      / pkg).toFixed(2));
      const newHumana       = Number((row.humana       / pkg).toFixed(2));
      const newNjMedicaid   = Number((row.njMedicaid   / pkg).toFixed(2));
      const newSsc          = Number((row.ssc          / pkg).toFixed(2));
      const newPdmi         = Number((row.pdmi         / pkg).toFixed(2));
      const sH    = Number((row.totalOrdered - newHorizon).toFixed(2));
      const sEx   = Number((row.totalOrdered - newExpress).toFixed(2));
      const sCvs  = Number((row.totalOrdered - newCvsCaremark).toFixed(2));
      const sOpt  = Number((row.totalOrdered - newOptumrx).toFixed(2));
      const sHum  = Number((row.totalOrdered - newHumana).toFixed(2));
      const sNj   = Number((row.totalOrdered - newNjMedicaid).toFixed(2));
      const sSsc  = Number((row.totalOrdered - newSsc).toFixed(2));
      const sPdmi = Number((row.totalOrdered - newPdmi).toFixed(2));
      const minShortage = Math.min(sH, sEx, sCvs, sOpt, sHum, sNj, sSsc, sPdmi);
      return {
        ...row,
        totalBilled:         newTotalBilled,
        totalShortage:       Number((row.totalOrdered - newTotalBilled).toFixed(2)),
        highestShortage:     Number((minShortage < 0 ? minShortage : 0).toFixed(2)),
        horizon:             newHorizon,
        shortageHorizon:     sH,
        express:             newExpress,
        shortageExpress:     sEx,
        cvsCaremark:         newCvsCaremark,
        shortageCvsCaremark: sCvs,
        optumrx:             newOptumrx,
        shortageOptumrx:     sOpt,
        humana:              newHumana,
        shortageHumana:      sHum,
        njMedicaid:          newNjMedicaid,
        shortageNjMedicaid:  sNj,
        ssc:                 newSsc,
        shortageSsc:         sSsc,
        pdmi:                newPdmi,
        shortagePdmi:        sPdmi,
      };
    }

    return row;
  };
  // ─────────────────────────────────────────────────────────────────────────────

  const removeFilter = (chipId: string) => {
    setActiveFilters((prev) => prev.filter((c) => c.id !== chipId));
  };

  const toggleFlagFilter = (flag: string) => {
    setFlagFilters((prev) =>
      prev.includes(flag) ? prev.filter((f) => f !== flag) : [...prev, flag]
    );
  };

  const togglePBMFilter = (pbm: string) => {
    setPbmFilters((prev) => {
      const isOn = prev.includes(pbm);
      const next = isOn ? prev.filter((p) => p !== pbm) : [...prev, pbm];
      const baseKey = supplierToColumnKey[pbm];
      if (baseKey) {
        setColumnFilters((cols) => ({
          ...cols,
          [baseKey]: !isOn,
          [`shortage${baseKey.charAt(0).toUpperCase()}${baseKey.slice(1)}`]: !isOn,
        }));
      }
      return next;
    });
  };

  const handleSort = (key: keyof InventoryRow, e: React.MouseEvent) => {
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

  const sortedData = useMemo(() => {
    return [...inventoryData].sort((a, b) => {
      for (const rule of sortRules) {
        const aVal = a[rule.key];
        const bVal = b[rule.key];
        let cmp = 0;
        if (typeof aVal === "number" && typeof bVal === "number") {
          cmp = aVal - bVal;
        } else {
          cmp = String(aVal).localeCompare(String(bVal));
        }
        if (cmp !== 0) return rule.dir === "asc" ? cmp : -cmp;
      }
      return 0;
    });
  }, [inventoryData, sortRules]);

  const filteredData = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return sortedData.filter((row) => {
      const matchesSearch =
        row.drugName.toLowerCase().includes(lowerQuery) ||
        row.ndc.toLowerCase().includes(lowerQuery);
      const matchesAmount = amountValue === "" || row.amount <= amountValue;
      return matchesSearch && matchesAmount;
    });
  }, [sortedData, searchQuery, amountValue]);

  const totalRows = filteredData.length;
  const effectiveRowsPerPage = rowsPerPage > 0 ? rowsPerPage : filteredData.length || 50;
  const totalPages = Math.max(1, Math.ceil(filteredData.length / effectiveRowsPerPage));
  const rowOptions = [10, 20, 50, 100, totalRows].filter(
    (v, i, arr) => v > 0 && arr.indexOf(v) === i
  );

  const paginatedData = filteredData
    .slice(
      (currentPage - 1) * effectiveRowsPerPage,
      currentPage * effectiveRowsPerPage
    )
    .map(applyQtyMode);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleRowSelection = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rid) => rid !== id) : [...prev, id]
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
      <span className={val < 0 ? "text-red-600 font-semibold" : "text-emerald-600 font-semibold"}>
        {val}
      </span>
    );
  };

  const columnWidths: Record<keyof typeof columnFilters, string> = {
    rank: "w-[70px]",
    ndc: "w-[110px]",
    drugName: "w-[180px]",
    pkgSize: "w-[80px]",
    unit: "w-[80px]",
    totalOrdered: "w-[110px]",
    totalBilled: "w-[100px]",
    totalShortage: "w-[110px]",
    highestShortage: "w-[130px]",
    cost: "w-[80px]",
    amount: "w-[100px]",
    horizon: "w-[90px]",
    shortageHorizon: "w-[130px]",
    express: "w-[90px]",
    shortageExpress: "w-[130px]",
    cvsCaremark: "w-[110px]",
    shortageCvsCaremark: "w-[150px]",
    ssc: "w-[80px]",
    shortageSsc: "w-[110px]",
    njMedicaid: "w-[100px]",
    shortageNjMedicaid: "w-[120px]",
    pdmi: "w-[80px]",
    shortagePdmi: "w-[120px]",
    optumrx: "w-[90px]",
    shortageOptumrx: "w-[130px]",
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
    if (openExportModal) {
      setSidebarCollapsed(true);
    }
  }, [openExportModal]);

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
    const rows = exportScope === "visible" ? paginatedData : filteredData;
    if (!rows.length) return;
    if (exportFormat === "csv") exportCSV(rows);
    if (exportFormat === "excel") exportCSV(rows, "xlsx");
    if (exportFormat === "pdf") exportPDF(rows);
    setOpenExportModal(false);
  };

  const exportCSV = (rows: any[], ext: "csv" | "xlsx" = "csv") => {
    const headers = Object.keys(rows[0]);
    const csv = [
      headers.join(","),
      ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(",")),
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
              ${Object.keys(rows[0]).map((h) => `<th>${h}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${rows.map((r) => `<tr>${Object.values(r).map((v) => `<td>${v ?? ""}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
        <script>window.print();</script>
      </body>
    </html>
  `);
  };

  const handleDrugTypeToggle = (dtype: string) => {
    setDrugTypes((prev) =>
      prev.includes(dtype) ? prev.filter((d) => d !== dtype) : [...prev, dtype]
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

  const fromDate = auditDates?.inventory_start_date
    ? formatDate(new Date(auditDates.inventory_start_date))
    : "—";
  const toDate = auditDates?.inventory_end_date
    ? formatDate(new Date(auditDates.inventory_end_date))
    : "—";
  const wholesalerFromDate = auditDates?.wholesaler_start_date
    ? formatDate(new Date(auditDates.wholesaler_start_date))
    : "—";
  const wholesalerToDate = auditDates?.wholesaler_end_date
    ? formatDate(new Date(auditDates.wholesaler_end_date))
    : "—";

  // ─── Sticky left offsets (must match actual rendered widths below) ────────────
  const COL_W = {
    checkbox: 44,
    rank:     72,
    ndc:      140,
    drugName: 240,
    pkgSize:  100,
    unit:     100,
  } as const;

  const left = {
    checkbox: 0,
    rank:     COL_W.checkbox,
    ndc:      COL_W.checkbox + (columnFilters.rank     ? COL_W.rank     : 0),
    drugName: COL_W.checkbox + (columnFilters.rank     ? COL_W.rank     : 0)
                             + (columnFilters.ndc      ? COL_W.ndc      : 0),
    pkgSize:  COL_W.checkbox + (columnFilters.rank     ? COL_W.rank     : 0)
                             + (columnFilters.ndc      ? COL_W.ndc      : 0)
                             + (columnFilters.drugName ? COL_W.drugName : 0),
    unit:     COL_W.checkbox + (columnFilters.rank     ? COL_W.rank     : 0)
                             + (columnFilters.ndc      ? COL_W.ndc      : 0)
                             + (columnFilters.drugName ? COL_W.drugName : 0)
                             + (columnFilters.pkgSize  ? COL_W.pkgSize  : 0),
    totalOrdered:
              COL_W.checkbox + (columnFilters.rank     ? COL_W.rank     : 0)
                             + (columnFilters.ndc      ? COL_W.ndc      : 0)
                             + (columnFilters.drugName ? COL_W.drugName : 0)
                             + (columnFilters.pkgSize  ? COL_W.pkgSize  : 0)
                             + (columnFilters.unit     ? COL_W.unit     : 0),
  };
  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="relative h-screen w-full bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="relative h-full w-full flex overflow-hidden">
        <div
          className={`flex-shrink-0 relative transition-all duration-300 ease-in-out z-[130] ${
            openExportModal || loading
              ? "w-0 opacity-0 pointer-events-none"
              : sidebarCollapsed
              ? "w-[72px]"
              : "w-[260px]"
          }`}
        >
          {!openExportModal && !loading && (
            <AppSidebar
              sidebarOpen={!sidebarCollapsed}
              setSidebarOpen={() => setSidebarCollapsed((v) => !v)}
              activePanel={activePanel}
              setActivePanel={setActivePanel}
            />
          )}
        </div>

        {loading && (
          <div
            className={`absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm transition-opacity duration-400 ${
              loadingDone ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <div className="flex flex-col items-center gap-6 w-72">
              <div className="relative">
                <div className="h-16 w-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm">
                  <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
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
                  <span className="text-xs text-slate-400">Loading report</span>
                  <span className="text-xs font-bold text-emerald-600 tabular-nums">
                    {Math.min(Math.round(loadingProgress), 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0 relative isolate flex flex-col overflow-hidden transition-all duration-300 ease-in-out z-0">
          {/* Header */}
          <div className="bg-white border-b border-slate-200 shadow-sm">
            <div className="px-9 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-lg md:text-3xl font-bold text-slate-800 tracking-wide uppercase">
                  Inventory Report
                </h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Comprehensive pharmaceutical inventory analytics
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1 translate-y-1">
                    <div className="text-[11px] font-bold tracking-wide text-blue-700 uppercase ml-4 -mt-5">
                      <div className="mt-1 h-2 w-2 rounded-full bg-blue-800 -translate-x-4 translate-y-3" />
                      Periods
                    </div>
                    <div className="bg-blue-50 px-4 py-3 rounded-xl border mb-1.5 border-blue-200 shadow-sm min-w-[180px]">
                      <div className="text-xs font-semibold text-slate-900">
                        {fromDate} – {toDate}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <div className="text-[11px] font-bold tracking-wide text-red-700 uppercase ml-4 -mt-5">
                      <div className="mt-1 h-2 w-2 rounded-full bg-red-500 -translate-x-4 translate-y-3" />
                      Inventory Dates
                    </div>
                    <div className="flex items-start gap-3 bg-red-50 px-4 py-1 rounded-xl border border-red-200 shadow-sm">
                      <div className="flex items-center py-2 gap-2">
                        <div className="text-xs font-semibold text-slate-900">{fromDate}</div>
                        <span className="text-xs text-slate-900">–</span>
                        <div className="text-xs font-semibold text-slate-900">{toDate}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 -translate-y-3">
                    <div className="text-[11px] font-bold tracking-wide text-emerald-600 uppercase ml-1">
                      <div className="mt-1 h-2 w-2 rounded-full bg-emerald-600 -translate-x-4 translate-y-3" />
                      Wholesaler Dates
                    </div>
                    <div className="flex items-start gap-3 bg-emerald-50 px-4 py-1 rounded-xl border border-emerald-200 shadow-sm">
                      <div className="flex items-center py-2 gap-2">
                        <div className="text-xs font-semibold text-slate-900">{wholesalerFromDate}</div>
                        <span className="text-xs text-slate-900">–</span>
                        <div className="text-xs font-semibold text-slate-900">{wholesalerToDate}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    setSidebarCollapsed(true);
                    setOpenExportModal(true);
                  }}
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

          {/* Filter Bar */}
          <div className="bg-white border-b border-slate-200">
            <div className="px-6 py-3">
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

                {/* Columns Filter */}
                <div className="relative" ref={filterDropdownRef}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 border-slate-300"
                    onClick={() => setOpenFilter(!openFilter)}
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Filter
                    <ChevronDown className="h-3.5 w-3.5" />
                  </Button>

                  {openFilter && (
                    <div className="absolute -left-100 top-full mt-2 w-[900px] max-w-[95vw] bg-white border border-slate-200 rounded-xl shadow-2xl z-50">
                      <div className="flex items-center justify-between px-5 py-3 border-b">
                        <h3 className="text-sm font-bold tracking-wide">FILTERS</h3>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setPbmFilters(availablePBMs);
                              setFlagFilters([]);
                            }}
                          >
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

                      <div className="grid grid-cols-3 gap-0 max-h-[70vh] overflow-y-auto">
                        <div className="p-4 border-r">
                          <div className="text-xs font-bold text-slate-600 mb-2">COLUMNS</div>
                          {(["ndc", "pkgSize", "rank", "totalOrdered", "totalBilled", "totalShortage", "highestShortage", "cost", "amount"] as const).map((col) => (
                            <label key={col} className="flex items-center gap-2 py-1 text-sm">
                              <Checkbox
                                checked={columnFilters[col]}
                                onCheckedChange={() => toggleColumn(col)}
                              />
                              {col.replace(/([A-Z])/g, " $1").toUpperCase()}
                            </label>
                          ))}
                        </div>

                        <div className="p-4 border-r">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mb-2">
                            <span className="h-2 w-2 rounded-full bg-red-500" /> BILLED
                          </div>
                          {availablePBMs.map((pbm) => (
                            <label key={pbm} className="flex items-center gap-2 py-1 text-sm">
                              <Checkbox
                                checked={pbmFilters.includes(pbm)}
                                onCheckedChange={() => togglePBMFilter(pbm)}
                              />
                              {pbm}
                            </label>
                          ))}
                        </div>

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
                                    prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
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

                {/* QTY Type */}
                <DropdownMenu open={openQtyDropdown} onOpenChange={setOpenQtyDropdown}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 border-slate-300 translate-x-2">
                      QTY
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuCheckboxItem
                      checked={qtyType === "UNIT"}
                      onCheckedChange={() => {
                        setQtyType("UNIT");
                        setColumnFilters((prev) => ({ ...prev, unit: false, pkgSize: true }));
                      }}
                    >
                      UNIT
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={qtyType === "PKG SIZE"}
                      onCheckedChange={() => {
                        setQtyType("PKG SIZE");
                        setColumnFilters((prev) => ({ ...prev, unit: false, pkgSize: true }));
                      }}
                    >
                      PKG SIZE
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Drug Type (hidden) */}
                <DropdownMenu open={openDrugTypeDropdown} onOpenChange={setOpenDrugTypeDropdown}>
                  <DropdownMenuTrigger asChild>
                    <span />
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

                {/* Max Cost */}
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Max Cost"
                    value={costValue}
                    onChange={(e) => setCostValue(Number(e.target.value) || "")}
                    className="w-[110px] h-8 border-slate-300"
                  />
                </div>

                {/* Max Amount */}
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Max Amount"
                    value={amountValue}
                    onChange={(e) => setAmountValue(Number(e.target.value) || "")}
                    className="w-[120px] h-8 border-slate-300"
                  />
                </div>

                {/* Rows per page */}
                <Select
                  value={String(rowsPerPage)}
                  onValueChange={(v) => setRowsPerPage(Number(v))}
                >
                  <SelectTrigger className="w-[120px] h-8 border-slate-300">
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

            {(activeFilters.length > 0 || costValue !== "") && (
              <div className="px-6 pb-4 flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-slate-600">Active filters:</span>
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

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              TABLE SECTION
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <style jsx global>{`
  /* ── thin, styled scrollbar ── */
  .inv-scroll::-webkit-scrollbar          { height: 5px; width: 5px; }
  .inv-scroll::-webkit-scrollbar-track    { background: transparent; }
  .inv-scroll::-webkit-scrollbar-thumb    { background: #cbd5e1; border-radius: 99px; }
  .inv-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

  /* ── header borders ── */
  thead th { border-bottom: 2px solid #cbd5e1; }

  /* NON-sticky header right borders */
  thead th:not(.sticky-col):not(.sticky-last) { border-right: 1px solid #cbd5e1; }
  thead th:last-child { border-right: none; }

  /* ── body cell borders ── */
  tbody td { border-bottom: 1px solid #e2e8f0; }

  /* NON-sticky body right borders */
  tbody td:not(.sticky-col):not(.sticky-last) { border-right: 1px solid #e2e8f0; }
  tbody td:last-child { border-right: none; }

  /* ── STICKY col right border — uses inset shadow, survives scroll ── */
  thead th.sticky-col { box-shadow: inset -1px 0 0 0 #cbd5e1; }
  tbody td.sticky-col { box-shadow: inset -1px 0 0 0 #e2e8f0; }

  /* ── last sticky col: border + drop shadow divider ── */
  thead th.sticky-last { box-shadow: inset -1px 0 0 0 #cbd5e1, 4px 0 10px -3px rgba(0,0,0,0.10); }
  tbody td.sticky-last { box-shadow: inset -1px 0 0 0 #e2e8f0, 4px 0 10px -3px rgba(0,0,0,0.10); }

  /* ── row hover ── */
  .inv-row td                   { transition: background-color 80ms ease; }
  .inv-row:hover td             { background-color: #f0fdf8 !important; }
  .inv-row.is-selected td       { background-color: #eff6ff !important; }
  .inv-row.is-selected:hover td { background-color: #dbeafe !important; }
  .inv-row.has-shortage:hover td{ background-color: #fff5f5 !important; }
  /* zebra */
  .inv-row.even-row td          { background-color: #f8fafc; }
  .inv-row.even-row:hover td    { background-color: #f0fdf8 !important; }

  /* ── Force table layout to respect exact widths ── */
  .inv-table { table-layout: fixed; }
`}</style>

          <div className="flex-1 bg-white relative overflow-hidden flex flex-col min-w-0 z-20 w-full">

            <div
              ref={bodyScrollRef}
              className="flex-1 overflow-auto min-w-0 relative z-0 inv-scroll"
            >
              <table className="w-full border-separate border-spacing-0 text-sm inv-table" style={{ minWidth: "max-content" }}>

                {/* ═══════════ HEADER ═══════════ */}
                <thead>
                  <tr className="bg-slate-50">

                    {/* ── Checkbox ── */}
                    <th
                      className="sticky top-0 z-[110] bg-slate-50 h-11 px-3 text-center sticky-col"
                      style={{ left: left.checkbox, width: COL_W.checkbox, minWidth: COL_W.checkbox, maxWidth: COL_W.checkbox }}
                    >
                      <Checkbox
                        checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                        onCheckedChange={toggleSelectAll}
                        className="h-3.5 w-3.5"
                      />
                    </th>

                    {/* ── Rank ── */}
                    {columnFilters.rank && (
                      <th
                        className="sticky top-0 z-[110] bg-slate-50 h-11 cursor-pointer select-none sticky-col"
                        style={{ left: left.rank, width: COL_W.rank, minWidth: COL_W.rank, maxWidth: COL_W.rank }}
                        onClick={(e) => handleSort("rank", e)}
                      >
                        <div className="flex items-center justify-center gap-1 h-full px-2 hover:bg-emerald-50/60 transition-colors">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Rank</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "rank")?.dir} />
                        </div>
                      </th>
                    )}

                    {/* ── NDC ── */}
                    {columnFilters.ndc && (
                      <th
                        className="sticky top-0 z-[110] bg-slate-50 h-11 cursor-pointer select-none sticky-col"
                        style={{ left: left.ndc, width: COL_W.ndc, minWidth: COL_W.ndc, maxWidth: COL_W.ndc }}
                        onClick={(e) => handleSort("ndc", e)}
                      >
                        <div className="flex items-center justify-center gap-1 h-full px-2 hover:bg-emerald-50/60 transition-colors">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">NDC</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "ndc")?.dir} />
                        </div>
                      </th>
                    )}

                    {/* ── Drug Name ── */}
                    {columnFilters.drugName && (
                      <th
                        className="sticky top-0 z-[110] bg-slate-50 h-11 cursor-pointer select-none text-left sticky-col"
                        style={{ left: left.drugName, width: COL_W.drugName, minWidth: COL_W.drugName, maxWidth: COL_W.drugName }}
                        onClick={(e) => handleSort("drugName", e)}
                      >
                        <div className="flex items-center gap-1 h-full px-3 hover:bg-emerald-50/60 transition-colors">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Drug Name</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "drugName")?.dir} />
                        </div>
                      </th>
                    )}

                    {/* ── Pkg Size ── */}
                    {columnFilters.pkgSize && (
                      <th
                        className="sticky top-0 z-[110] bg-slate-50 h-11 cursor-pointer select-none sticky-col"
                        style={{ left: left.pkgSize, width: COL_W.pkgSize, minWidth: COL_W.pkgSize, maxWidth: COL_W.pkgSize }}
                        onClick={(e) => handleSort("pkgSize", e)}
                      >
                        <div className="flex items-center justify-center gap-1 h-full px-2 hover:bg-emerald-50/60 transition-colors">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Pkg</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "pkgSize")?.dir} />
                        </div>
                      </th>
                    )}

                    {/* ── Unit ── */}
                    {columnFilters.unit && (
                      <th
                        className="sticky top-0 z-[110] bg-slate-50 h-11 cursor-pointer select-none sticky-col"
                        style={{ left: left.unit, width: COL_W.unit, minWidth: COL_W.unit, maxWidth: COL_W.unit }}
                        onClick={(e) => handleSort("unit", e)}
                      >
                        <div className="flex items-center justify-center gap-1 h-full px-2 hover:bg-emerald-50/60 transition-colors">
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Unit</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "unit")?.dir} />
                        </div>
                      </th>
                    )}

                    {/* ── Total Ordered — last sticky col ── */}
                    {columnFilters.totalOrdered && (
                      <th
                        className="sticky top-0 z-[110] bg-slate-50 h-11 cursor-pointer select-none sticky-last"
                        style={{ left: left.totalOrdered, width: 140, minWidth: 140, maxWidth: 140 }}
                        onClick={(e) => handleSort("totalOrdered", e)}
                      >
                        <div className="flex items-center justify-center gap-1.5 h-full px-3 hover:bg-emerald-50/60 transition-colors">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Total Ordered</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "totalOrdered")?.dir} />
                        </div>
                      </th>
                    )}

                    {/* ── Scrollable column headers ── */}
                    {columnFilters.totalBilled && (
                      <th className="sticky top-0 z-50 bg-slate-50 h-11 cursor-pointer select-none whitespace-nowrap" style={{ minWidth: 140 }} onClick={(e) => handleSort("totalBilled", e)}>
                        <div className="flex items-center justify-center gap-1.5 h-full px-3 hover:bg-emerald-50/60 transition-colors">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Total Billed</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "totalBilled")?.dir} />
                        </div>
                      </th>
                    )}
                    {columnFilters.totalShortage && (
                      <th className="sticky top-0 z-50 bg-slate-50 h-11 cursor-pointer select-none whitespace-nowrap" style={{ minWidth: 140 }} onClick={(e) => handleSort("totalShortage", e)}>
                        <div className="flex items-center justify-center gap-1.5 h-full px-3 hover:bg-emerald-50/60 transition-colors">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Total Shortage</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "totalShortage")?.dir} />
                        </div>
                      </th>
                    )}
                    {columnFilters.highestShortage && (
                      <th className="sticky top-0 z-50 bg-slate-50 h-11 cursor-pointer select-none whitespace-nowrap" style={{ minWidth: 150 }} onClick={(e) => handleSort("highestShortage", e)}>
                        <div className="flex items-center justify-center gap-1.5 h-full px-3 hover:bg-emerald-50/60 transition-colors">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Highest Shortage</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "highestShortage")?.dir} />
                        </div>
                      </th>
                    )}
                    {columnFilters.cost && (
                      <th className="sticky top-0 z-50 bg-slate-50 h-11 cursor-pointer select-none whitespace-nowrap" style={{ minWidth: 110 }} onClick={(e) => handleSort("cost", e)}>
                        <div className="flex items-center justify-center gap-1.5 h-full px-3 hover:bg-emerald-50/60 transition-colors">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">$ Cost</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "cost")?.dir} />
                        </div>
                      </th>
                    )}
                    {columnFilters.amount && (
                      <th className="sticky top-0 z-50 bg-slate-50 h-11 cursor-pointer select-none whitespace-nowrap" style={{ minWidth: 120 }} onClick={(e) => handleSort("amount", e)}>
                        <div className="flex items-center justify-center gap-1.5 h-full px-3 hover:bg-emerald-50/60 transition-colors">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">$ Amount</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "amount")?.dir} />
                        </div>
                      </th>
                    )}
                    {columnFilters.horizon && (
                      <th className="sticky top-0 z-50 bg-slate-50 h-11 cursor-pointer select-none whitespace-nowrap" style={{ minWidth: 140 }} onClick={(e) => handleSort("horizon", e)}>
                        <div className="flex items-center justify-center gap-1.5 h-full px-3 hover:bg-emerald-50/60 transition-colors">
                          <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 shrink-0" />
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Horizon Health</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "horizon")?.dir} />
                        </div>
                      </th>
                    )}
                    {columnFilters.shortageHorizon && (
                      <th className="sticky top-0 z-50 bg-slate-50 h-11 cursor-pointer select-none whitespace-nowrap" style={{ minWidth: 150 }} onClick={(e) => handleSort("shortageHorizon", e)}>
                        <div className="flex items-center justify-center gap-1.5 h-full px-3 hover:bg-emerald-50/60 transition-colors">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Shrt Horizon</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "shortageHorizon")?.dir} />
                        </div>
                      </th>
                    )}
                    {columnFilters.express && (
                      <th className="sticky top-0 z-50 bg-slate-50 h-11 cursor-pointer select-none whitespace-nowrap" style={{ minWidth: 140 }} onClick={(e) => handleSort("express", e)}>
                        <div className="flex items-center justify-center gap-1.5 h-full px-3 hover:bg-emerald-50/60 transition-colors">
                          <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 shrink-0" />
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Express Scripts</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "express")?.dir} />
                        </div>
                      </th>
                    )}
                    {columnFilters.shortageExpress && (
                      <th className="sticky top-0 z-50 bg-slate-50 h-11 cursor-pointer select-none whitespace-nowrap" style={{ minWidth: 150 }} onClick={(e) => handleSort("shortageExpress", e)}>
                        <div className="flex items-center justify-center gap-1.5 h-full px-3 hover:bg-emerald-50/60 transition-colors">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Shrt Express</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "shortageExpress")?.dir} />
                        </div>
                      </th>
                    )}
                    {columnFilters.pdmi && (
                      <th className="sticky top-0 z-50 bg-slate-50 h-11 cursor-pointer select-none whitespace-nowrap" style={{ minWidth: 180 }} onClick={(e) => handleSort("pdmi", e)}>
                        <div className="flex items-center justify-center gap-1.5 h-full px-3 hover:bg-emerald-50/60 transition-colors">
                          <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 shrink-0" />
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">PDMI (CO-PAY)</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "pdmi")?.dir} />
                        </div>
                      </th>
                    )}
                    {columnFilters.shortagePdmi && (
                      <th className="sticky top-0 z-50 bg-slate-50 h-11 cursor-pointer select-none whitespace-nowrap" style={{ minWidth: 150 }} onClick={(e) => handleSort("shortagePdmi", e)}>
                        <div className="flex items-center justify-center gap-1.5 h-full px-3 hover:bg-emerald-50/60 transition-colors">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Shrt PDMI</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "shortagePdmi")?.dir} />
                        </div>
                      </th>
                    )}
                    {columnFilters.optumrx && (
                      <th className="sticky top-0 z-50 bg-slate-50 h-11 cursor-pointer select-none whitespace-nowrap" style={{ minWidth: 120 }} onClick={(e) => handleSort("optumrx", e)}>
                        <div className="flex items-center justify-center gap-1.5 h-full px-3 hover:bg-emerald-50/60 transition-colors">
                          <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 shrink-0" />
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">OptumRx</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "optumrx")?.dir} />
                        </div>
                      </th>
                    )}
                    {columnFilters.shortageOptumrx && (
                      <th className="sticky top-0 z-50 bg-slate-50 h-11 cursor-pointer select-none whitespace-nowrap" style={{ minWidth: 150 }} onClick={(e) => handleSort("shortageOptumrx", e)}>
                        <div className="flex items-center justify-center gap-1.5 h-full px-3 hover:bg-emerald-50/60 transition-colors">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Shrt OptumRx</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "shortageOptumrx")?.dir} />
                        </div>
                      </th>
                    )}
                    {columnFilters.cvsCaremark && (
                      <th className="sticky top-0 z-50 bg-slate-50 h-11 cursor-pointer select-none whitespace-nowrap" style={{ minWidth: 140 }} onClick={(e) => handleSort("cvsCaremark", e)}>
                        <div className="flex items-center justify-center gap-1.5 h-full px-3 hover:bg-emerald-50/60 transition-colors">
                          <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 shrink-0" />
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">CVS Caremark</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "cvsCaremark")?.dir} />
                        </div>
                      </th>
                    )}
                    {columnFilters.shortageCvsCaremark && (
                      <th className="sticky top-0 z-50 bg-slate-50 h-11 cursor-pointer select-none whitespace-nowrap" style={{ minWidth: 180 }} onClick={(e) => handleSort("shortageCvsCaremark", e)}>
                        <div className="flex items-center justify-center gap-1.5 h-full px-3 hover:bg-emerald-50/60 transition-colors">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Shrt CVS Caremark</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "shortageCvsCaremark")?.dir} />
                        </div>
                      </th>
                    )}
                    {columnFilters.ssc && (
                      <th className="sticky top-0 z-50 bg-slate-50 h-11 cursor-pointer select-none whitespace-nowrap" style={{ minWidth: 120 }} onClick={(e) => handleSort("ssc", e)}>
                        <div className="flex items-center justify-center gap-1.5 h-full px-3 hover:bg-emerald-50/60 transition-colors">
                          <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 shrink-0" />
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Billed SSC</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "ssc")?.dir} />
                        </div>
                      </th>
                    )}
                    {columnFilters.shortageSsc && (
                      <th className="sticky top-0 z-50 bg-slate-50 h-11 cursor-pointer select-none whitespace-nowrap" style={{ minWidth: 140 }} onClick={(e) => handleSort("shortageSsc", e)}>
                        <div className="flex items-center justify-center gap-1.5 h-full px-3 hover:bg-emerald-50/60 transition-colors">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Shrt SSC</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "shortageSsc")?.dir} />
                        </div>
                      </th>
                    )}
                    {columnFilters.njMedicaid && (
                      <th className="sticky top-0 z-50 bg-slate-50 h-11 cursor-pointer select-none whitespace-nowrap" style={{ minWidth: 130 }} onClick={(e) => handleSort("njMedicaid", e)}>
                        <div className="flex items-center justify-center gap-1.5 h-full px-3 hover:bg-emerald-50/60 transition-colors">
                          <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 shrink-0" />
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">NJ Medicaid</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "njMedicaid")?.dir} />
                        </div>
                      </th>
                    )}
                    {columnFilters.shortageNjMedicaid && (
                      <th className="sticky top-0 z-50 bg-slate-50 h-11 cursor-pointer select-none whitespace-nowrap" style={{ minWidth: 170 }} onClick={(e) => handleSort("shortageNjMedicaid", e)}>
                        <div className="flex items-center justify-center gap-1.5 h-full px-3 hover:bg-emerald-50/60 transition-colors">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Shrt NJ Medicaid</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "shortageNjMedicaid")?.dir} />
                        </div>
                      </th>
                    )}
                    {columnFilters.humana && (
                      <th className="sticky top-0 z-50 bg-slate-50 h-11 cursor-pointer select-none whitespace-nowrap" style={{ minWidth: 130 }} onClick={(e) => handleSort("humana", e)}>
                        <div className="flex items-center justify-center gap-1.5 h-full px-3 hover:bg-emerald-50/60 transition-colors">
                          <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 shrink-0" />
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Humana</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "humana")?.dir} />
                        </div>
                      </th>
                    )}
                    {columnFilters.shortageHumana && (
                      <th className="sticky top-0 z-50 bg-slate-50 h-11 cursor-pointer select-none whitespace-nowrap" style={{ minWidth: 160 }} onClick={(e) => handleSort("shortageHumana", e)}>
                        <div className="flex items-center justify-center gap-1.5 h-full px-3 hover:bg-emerald-50/60 transition-colors">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">Shrt Humana</span>
                          <SortIcon dir={sortRules.find((r) => r.key === "shortageHumana")?.dir} />
                        </div>
                      </th>
                    )}
                  </tr>
                </thead>

                {/* ═══════════ BODY ═══════════ */}
                <tbody>
                  {paginatedData.map((row, rowIndex) => {
                    const isSelected  = selectedRows.includes(row.id);
                    const hasShortage = row.totalShortage < 0;
                    const isEven      = rowIndex % 2 === 1;
                    const baseBg = isSelected ? "#eff6ff" : isEven ? "#f8fafc" : "#ffffff";

                    return (
                      <tr
                        key={row.id}
                        className={[
                          "inv-row cursor-pointer",
                          isSelected  ? "is-selected"  : "",
                          hasShortage ? "has-shortage" : "",
                          isEven      ? "even-row"     : "",
                        ].join(" ")}
                        style={{ height: 38 }}
                        onClick={() => { setActiveDrug(row); setOpenDrugSidebar(true); }}
                      >
                        {/* Checkbox */}
                        <td
                          className="sticky z-20 px-3 text-center sticky-col"
                          style={{ left: left.checkbox, width: COL_W.checkbox, minWidth: COL_W.checkbox, maxWidth: COL_W.checkbox, backgroundColor: baseBg }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={() => toggleRowSelection(row.id)}
                            className="h-3.5 w-3.5"
                          />
                        </td>

                        {/* Rank */}
                        {columnFilters.rank && (
                          <td
                            className="sticky z-20 px-2 text-center sticky-col"
                            style={{ left: left.rank, width: COL_W.rank, minWidth: COL_W.rank, maxWidth: COL_W.rank, backgroundColor: baseBg }}
                          >
                            <span className="text-[12px] text-slate-600 tabular-nums font-medium">{row.rank}</span>
                          </td>
                        )}

                        {/* NDC */}
                        {columnFilters.ndc && (
                          <td
                            className="sticky z-20 px-3 text-center sticky-col"
                            style={{ left: left.ndc, width: COL_W.ndc, minWidth: COL_W.ndc, maxWidth: COL_W.ndc, backgroundColor: baseBg }}
                          >
                            <span className="text-[11px] font-mono text-slate-500 tabular-nums tracking-tight">{row.ndc}</span>
                          </td>
                        )}

                        {/* Drug Name */}
                        {columnFilters.drugName && (
                          <td
                            className="sticky z-20 px-3 text-left sticky-col"
                            style={{ left: left.drugName, width: COL_W.drugName, minWidth: COL_W.drugName, maxWidth: COL_W.drugName, backgroundColor: baseBg }}
                          >
                            <span className="text-[12px] font-semibold text-slate-800 truncate block max-w-[220px]" title={row.drugName}>
                              {row.drugName}
                            </span>
                          </td>
                        )}

                        {/* Pkg Size */}
                        {columnFilters.pkgSize && (
                          <td
                            className="sticky z-20 px-3 text-right sticky-col"
                            style={{ left: left.pkgSize, width: COL_W.pkgSize, minWidth: COL_W.pkgSize, maxWidth: COL_W.pkgSize, backgroundColor: baseBg }}
                          >
                            <span className="text-[12px] text-slate-600 tabular-nums">{row.pkgSize}</span>
                          </td>
                        )}

                        {/* Unit */}
                        {columnFilters.unit && (
                          <td
                            className="sticky z-20 px-3 text-right sticky-col"
                            style={{ left: left.unit, width: COL_W.unit, minWidth: COL_W.unit, maxWidth: COL_W.unit, backgroundColor: baseBg }}
                          >
                            <span className="text-[12px] text-slate-600 tabular-nums">{row.unit}</span>
                          </td>
                        )}

                        {/* Total Ordered — last sticky */}
                        {columnFilters.totalOrdered && (
                          <td
                            className="sticky z-20 px-3 text-right sticky-last"
                            style={{ left: left.totalOrdered, width: 140, minWidth: 140, maxWidth: 140, backgroundColor: baseBg }}
                          >
                            <span className="text-[12px] font-semibold text-slate-800 tabular-nums">{row.totalOrdered.toLocaleString()}</span>
                          </td>
                        )}

                        {/* ── Scrollable data cells ── */}
                        {columnFilters.totalBilled && (
                          <td className="border-r border-slate-100 px-3 text-right" style={{ minWidth: 140 }}>
                            <span className="text-[12px] text-slate-700 tabular-nums">{row.totalBilled.toLocaleString()}</span>
                          </td>
                        )}
                        {columnFilters.totalShortage && (
                          <td className="border-r border-slate-100 px-3 text-right" style={{ minWidth: 140 }}>
                            <span className="text-[12px] tabular-nums">{renderShortageValue(row.totalShortage)}</span>
                          </td>
                        )}
                        {columnFilters.highestShortage && (
                          <td className="border-r border-slate-100 px-3 text-right" style={{ minWidth: 150 }}>
                            <span className="text-[12px] tabular-nums">{renderShortageValue(row.highestShortage)}</span>
                          </td>
                        )}
                        {columnFilters.cost && (
                          <td className="border-r border-slate-100 px-3 text-right" style={{ minWidth: 110 }}>
                            <span className="text-[12px] text-slate-700 tabular-nums">${row.cost.toFixed(2)}</span>
                          </td>
                        )}
                        {columnFilters.amount && (
                          <td className="border-r border-slate-100 px-3 text-right" style={{ minWidth: 120 }}>
                            <span className="text-[12px] font-semibold text-slate-800 tabular-nums">${row.amount.toFixed(2)}</span>
                          </td>
                        )}
                        {columnFilters.horizon && (
                          <td className="border-r border-slate-100 px-3 text-right" style={{ minWidth: 140 }}>
                            <span className="text-[12px] text-slate-600 tabular-nums">{row.horizon}</span>
                          </td>
                        )}
                        {columnFilters.shortageHorizon && (
                          <td className="border-r border-slate-100 px-3 text-right" style={{ minWidth: 150 }}>
                            <span className="text-[12px] tabular-nums">{renderShortageValue(row.shortageHorizon)}</span>
                          </td>
                        )}
                        {columnFilters.express && (
                          <td className="border-r border-slate-100 px-3 text-right" style={{ minWidth: 140 }}>
                            <span className="text-[12px] text-slate-600 tabular-nums">{row.express}</span>
                          </td>
                        )}
                        {columnFilters.shortageExpress && (
                          <td className="border-r border-slate-100 px-3 text-right" style={{ minWidth: 150 }}>
                            <span className="text-[12px] tabular-nums">{renderShortageValue(row.shortageExpress)}</span>
                          </td>
                        )}
                        {columnFilters.pdmi && (
                          <td className="border-r border-slate-100 px-3 text-right" style={{ minWidth: 180 }}>
                            <span className="text-[12px] text-slate-600 tabular-nums">{row.pdmi}</span>
                          </td>
                        )}
                        {columnFilters.shortagePdmi && (
                          <td className="border-r border-slate-100 px-3 text-right" style={{ minWidth: 150 }}>
                            <span className="text-[12px] tabular-nums">{renderShortageValue(row.shortagePdmi)}</span>
                          </td>
                        )}
                        {columnFilters.optumrx && (
                          <td className="border-r border-slate-100 px-3 text-right" style={{ minWidth: 120 }}>
                            <span className="text-[12px] text-slate-600 tabular-nums">{row.optumrx}</span>
                          </td>
                        )}
                        {columnFilters.shortageOptumrx && (
                          <td className="border-r border-slate-100 px-3 text-right" style={{ minWidth: 150 }}>
                            <span className="text-[12px] tabular-nums">{renderShortageValue(row.shortageOptumrx)}</span>
                          </td>
                        )}
                        {columnFilters.cvsCaremark && (
                          <td className="border-r border-slate-100 px-3 text-right" style={{ minWidth: 140 }}>
                            <span className="text-[12px] text-slate-600 tabular-nums">{row.cvsCaremark}</span>
                          </td>
                        )}
                        {columnFilters.shortageCvsCaremark && (
                          <td className="border-r border-slate-100 px-3 text-right" style={{ minWidth: 180 }}>
                            <span className="text-[12px] tabular-nums">{renderShortageValue(row.shortageCvsCaremark)}</span>
                          </td>
                        )}
                        {columnFilters.ssc && (
                          <td className="border-r border-slate-100 px-3 text-right" style={{ minWidth: 120 }}>
                            <span className="text-[12px] text-slate-600 tabular-nums">{row.ssc}</span>
                          </td>
                        )}
                        {columnFilters.shortageSsc && (
                          <td className="border-r border-slate-100 px-3 text-right" style={{ minWidth: 140 }}>
                            <span className="text-[12px] tabular-nums">{renderShortageValue(row.shortageSsc)}</span>
                          </td>
                        )}
                        {columnFilters.njMedicaid && (
                          <td className="border-r border-slate-100 px-3 text-right" style={{ minWidth: 130 }}>
                            <span className="text-[12px] text-slate-600 tabular-nums">{row.njMedicaid}</span>
                          </td>
                        )}
                        {columnFilters.shortageNjMedicaid && (
                          <td className="border-r border-slate-100 px-3 text-right" style={{ minWidth: 170 }}>
                            <span className="text-[12px] tabular-nums">{renderShortageValue(row.shortageNjMedicaid)}</span>
                          </td>
                        )}
                        {columnFilters.humana && (
                          <td className="border-r border-slate-100 px-3 text-right" style={{ minWidth: 130 }}>
                            <span className="text-[12px] text-slate-600 tabular-nums">{row.humana}</span>
                          </td>
                        )}
                        {columnFilters.shortageHumana && (
                          <td className="border-r border-slate-100 px-3 text-right" style={{ minWidth: 160 }}>
                            <span className="text-[12px] tabular-nums">{renderShortageValue(row.shortageHumana)}</span>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ── Pagination ── */}
            <div className="border-t border-slate-200 bg-white px-5 py-3 flex items-center justify-between z-30 shrink-0">
              <div className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {filteredData.length === 0 ? 0 : (currentPage - 1) * effectiveRowsPerPage + 1}
                </span>
                {" – "}
                <span className="font-semibold text-slate-700">
                  {Math.min(currentPage * effectiveRowsPerPage, filteredData.length)}
                </span>
                {" of "}
                <span className="font-semibold text-slate-700">{filteredData.length}</span> results
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="h-8 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>
                <div className="flex items-center gap-1">
                  {(() => {
                    const pages: number[] = [];
                    const delta = 2;
                    const lp = Math.max(2, currentPage - delta);
                    const rp = Math.min(totalPages - 1, currentPage + delta);
                    pages.push(1);
                    if (lp > 2) pages.push(-1);
                    for (let i = lp; i <= rp; i++) pages.push(i);
                    if (rp < totalPages - 1) pages.push(-2);
                    if (totalPages > 1) pages.push(totalPages);
                    return pages.map((page, idx) =>
                      page < 0 ? (
                        <span key={`e${idx}`} className="px-1 text-slate-400 text-xs">…</span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`h-8 w-8 text-xs font-semibold rounded-lg transition-colors ${
                            currentPage === page
                              ? "bg-emerald-600 text-white shadow-sm"
                              : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    );
                  })()}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="h-8 px-3 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              END TABLE SECTION
          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}

          {/* Export Modal */}
          <Dialog open={openExportModal} onOpenChange={setOpenExportModal}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Export Report</DialogTitle>
                <DialogDescription>
                  Choose your preferred format and scope for the export
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-900">Export Format</Label>
                  <RadioGroup value={exportFormat} onValueChange={(v) => setExportFormat(v as any)}>
                    {["csv", "excel", "pdf"].map((fmt) => (
                      <div key={fmt} className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                        <RadioGroupItem value={fmt} id={fmt} />
                        <Label htmlFor={fmt} className="flex-1 cursor-pointer font-medium capitalize">{fmt}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-slate-900">Export Scope</Label>
                  <RadioGroup value={exportScope} onValueChange={(v) => setExportScope(v as any)}>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                      <RadioGroupItem value="visible" id="visible" />
                      <Label htmlFor="visible" className="flex-1 cursor-pointer font-medium">Visible Rows Only</Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all" className="flex-1 cursor-pointer font-medium">All Data</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenExportModal(false)}>Cancel</Button>
                <Button onClick={handleExport} className="bg-emerald-600 hover:bg-emerald-700">Export</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Drug Details Sidebar */}
          <Sheet open={openDrugSidebar} onOpenChange={setOpenDrugSidebar}>
            <SheetContent className="w-[450px] sm:w-[540px] bg-gradient-to-br from-white to-slate-50">
              <SheetHeader>
                <SheetTitle className="text-xl font-bold text-slate-900">Drug Details</SheetTitle>
                <SheetDescription className="text-sm text-slate-600">
                  {activeDrug ? activeDrug.drugName : "No drug selected"}
                </SheetDescription>
              </SheetHeader>
              {activeDrug && (
                <div className="mt-8 space-y-5">
                  <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">NDC</Label>
                    <p className="text-base font-mono font-semibold text-slate-900 mt-1">{activeDrug.ndc}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Package Size</Label>
                      <p className="text-lg font-bold text-slate-900 mt-1">{activeDrug.pkgSize}</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                      <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cost</Label>
                      <p className="text-lg font-bold text-emerald-700 mt-1">${activeDrug.cost.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Ordered</Label>
                    <p className="text-lg font-bold text-slate-900 mt-1">{activeDrug.totalOrdered.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Billed</Label>
                    <p className="text-lg font-bold text-slate-900 mt-1">{activeDrug.totalBilled.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm">
                    <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Shortage</Label>
                    <p className="text-lg font-bold mt-1">{renderShortageValue(activeDrug.totalShortage)}</p>
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