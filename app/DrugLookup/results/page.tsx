// "use client";

// import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import AppSidebar from "@/components/Sidebar";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import {
//   Search,
//   X,
//   ChevronDown,
//   ArrowLeft,
//   Sparkles,
//   TrendingUp,
//   Pill,
//   BarChart3,
//   DollarSign,
//   Hash,
//   Flame,
//   ArrowDownCircle,
//   ArrowUpCircle,
//   Globe,
// } from "lucide-react";

// // ─── Types (match backend response shape) ───────────────────────────────────
// interface DrugLookupNdc {
//   drug_name: string;
//   ndc: string;
//   brand: string | null;
//   rx_count: number;
//   avg_qty_per_rx: number;
//   avg_copay_per_rx: number | null;
//   avg_ins_paid_per_rx: number;
//   avg_ins_paid_per_unit: number;
// }

// interface DrugLookupDrug {
//   drug_name: string;
//   brand: string | null;
//   rx_count: number;
//   avg_qty_per_rx: number;
//   avg_copay_per_rx: number | null;
//   avg_ins_paid_per_rx: number;
//   avg_ins_paid_per_unit: number;
//   ndcs: DrugLookupNdc[];
// }

// interface DrugLookupResponse {
//   ingredient: string;
//   drugs: DrugLookupDrug[];
// }

// // ─── Helpers ────────────────────────────────────────────────────────────────
// const extractIngredient = (term: string) =>
//   term.trim().split(/\s+/)[0].toUpperCase();

// const brandPill = (brand: string | null | undefined) => {
//   if (!brand) return null;
//   const raw = String(brand).trim().toUpperCase();
//   const isBrand = raw === "Y" || raw === "B" || raw === "BRAND";
//   const label = isBrand ? "B" : "G";
//   return (
//     <span
//       className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase"
//       style={{
//         background: isBrand ? "#cffafe" : "#fef3c7",
//         color: isBrand ? "#155e75" : "#92400e",
//         border: `1px solid ${isBrand ? "#67e8f9" : "#fcd34d"}`,
//       }}
//       title={isBrand ? "Brand" : "Generic"}
//     >
//       {label}
//     </span>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════
// // PAGE
// // ═══════════════════════════════════════════════════════════════════════════
// function DrugLookupResultsInner() {
//   const router = useRouter();
//   const params = useSearchParams();
//   const initialQ = params.get("q") ?? "";

//   const [query, setQuery] = useState(initialQ);
//   const [focused, setFocused] = useState(false);
//   const [suggestions, setSuggestions] = useState<string[]>([]);
//   const [data, setData] = useState<DrugLookupResponse | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [expandedDrug, setExpandedDrug] = useState<string | null>(null);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
//   const [activePanel, setActivePanel] = useState<string | null>(null);

//   const searchRef = useRef<HTMLDivElement | null>(null);
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   // ── Fetch drug lookup whenever ?q changes ─────────────────────────────
//   useEffect(() => {
//     const ingredient = extractIngredient(initialQ);
//     if (!ingredient) {
//       setData(null);
//       setLoading(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setExpandedDrug(null);

//     (async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/drug-lookup-global?ingredient=${encodeURIComponent(ingredient)}`,
//         );
//         if (!res.ok) throw new Error(`Request failed: ${res.status}`);
//         const json = await res.json();
//         setData(json);
//       } catch (e: any) {
//         console.error(e);
//         setError(e?.message ?? "Failed to load");
//         setData(null);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, [initialQ]);

//   // ── Autocomplete (same as landing page) ───────────────────────────────
//   useEffect(() => {
//     const q = query.trim();
//     if (q.length < 2 || q === initialQ) {
//       setSuggestions([]);
//       return;
//     }
//     const timer = setTimeout(async () => {
//       try {
//         const res = await fetch(
//           `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/drug-search?q=${encodeURIComponent(q)}`,
//         );
//         if (!res.ok) throw new Error("Search failed");
//         const out: { name: string; rx_count: number }[] = await res.json();
//         setSuggestions(out.map((d) => d.name));
//       } catch {
//         setSuggestions([]);
//       }
//     }, 250);
//     return () => clearTimeout(timer);
//   }, [query, initialQ]);

//   // ── Click outside closes dropdown ──────────────────────────────────────
//   useEffect(() => {
//     const h = (e: MouseEvent) => {
//       if (searchRef.current && !searchRef.current.contains(e.target as Node))
//         setFocused(false);
//     };
//     document.addEventListener("mousedown", h);
//     return () => document.removeEventListener("mousedown", h);
//   }, []);

//   const fillSearch = (t: string) => {
//     setQuery(t);
//     setFocused(false);
//     inputRef.current?.focus();
//     setTimeout(() => {
//       const el = inputRef.current;
//       if (el) el.setSelectionRange(t.length, t.length);
//     }, 0);
//   };

//   const submit = (t: string) => {
//     const v = t.trim();
//     if (!v) return;
//     router.push(`/DrugLookup/results?q=${encodeURIComponent(v)}`);
//   };

//   // ── Aggregation (same math as sidebar) ──────────────────────────────────
//   const agg = useMemo(() => {
//     if (!data || !data.drugs || data.drugs.length === 0) return null;
//     const drugs = data.drugs;
//     const num = (v: any) => Number(v ?? 0) || 0;

//     const totalRxs = drugs.reduce((s, d) => s + num(d.rx_count), 0);
//     const totalQty = drugs.reduce(
//       (s, d) => s + num(d.avg_qty_per_rx) * num(d.rx_count),
//       0,
//     );
//     const totalInsPaid = drugs.reduce(
//       (s, d) => s + num(d.avg_ins_paid_per_rx) * num(d.rx_count),
//       0,
//     );
//     const weightedAvgPerUnit = totalQty > 0 ? totalInsPaid / totalQty : 0;
//     const weightedAvgQty = totalRxs > 0 ? totalQty / totalRxs : 0;
//     const weightedAvgInsPerRx = totalRxs > 0 ? totalInsPaid / totalRxs : 0;

//     const byRx = [...drugs].sort((a, b) => num(b.rx_count) - num(a.rx_count));
//     const byUnit = [...drugs].sort(
//       (a, b) => num(b.avg_ins_paid_per_unit) - num(a.avg_ins_paid_per_unit),
//     );

//     return {
//       totalRxs,
//       totalQty,
//       totalInsPaid,
//       weightedAvgPerUnit,
//       weightedAvgQty,
//       weightedAvgInsPerRx,
//       mostPrescribed: byRx[0],
//       highestUnit: byUnit[0],
//       lowestUnit: byUnit[byUnit.length - 1],
//     };
//   }, [data]);

//   const displayIngredient = data?.ingredient ?? extractIngredient(initialQ);

//   return (
//     <ProtectedRoute>
//       <div className="relative w-full bg-slate-50 min-h-screen">
//         <div className="relative h-full w-full flex">
//           {/* Sidebar */}
//           <div
//             className={`flex-shrink-0 transition-all duration-300 z-[130] ${
//               sidebarCollapsed ? "w-[72px]" : "w-[260px]"
//             }`}
//           >
//             <AppSidebar
//               sidebarOpen={!sidebarCollapsed}
//               setSidebarOpen={() => setSidebarCollapsed((v) => !v)}
//               activePanel={activePanel}
//               setActivePanel={setActivePanel}
//             />
//           </div>

//           {/* Main */}
//           <div className="flex-1 min-w-0 flex flex-col overflow-auto">
//             {/* ╔═══ Top Bar: back + inline search ═══════════════════════ */}
//             <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
//               <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-4">
//                 <button
//                   onClick={() => router.push("/DrugLookup")}
//                   className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
//                 >
//                   <ArrowLeft className="w-3.5 h-3.5" />
//                   Back
//                 </button>

//                 {/* Inline search */}
//                 <div className="relative flex-1 max-w-2xl" ref={searchRef}>
//                   <div
//                     className={`relative flex items-center bg-white border rounded-full transition-all ${
//                       focused
//                         ? "border-teal-400 ring-4 ring-teal-100"
//                         : "border-slate-200"
//                     }`}
//                   >
//                     <Search className="absolute left-4 h-4 w-4 text-slate-400 pointer-events-none" />
//                     <input
//                       ref={inputRef}
//                       type="text"
//                       value={query}
//                       onChange={(e) => setQuery(e.target.value)}
//                       onFocus={() => setFocused(true)}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") submit(query);
//                       }}
//                       placeholder="Search another drug..."
//                       className="flex-1 h-11 pl-11 pr-4 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
//                     />
//                     {query && (
//                       <button
//                         onClick={() => {
//                           setQuery("");
//                           inputRef.current?.focus();
//                         }}
//                         className="mr-1 h-8 w-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100"
//                       >
//                         <X className="w-3.5 h-3.5" />
//                       </button>
//                     )}
//                     <button
//                       onClick={() => submit(query)}
//                       disabled={!query.trim()}
//                       className="mr-1.5 h-8 px-4 rounded-full bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white text-xs font-bold transition-colors"
//                     >
//                       Search
//                     </button>
//                   </div>

//                   {focused && suggestions.length > 0 && (
//                     <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 py-1">
//                       {suggestions.map((s) => (
//                         <button
//                           key={s}
//                           onClick={() => fillSearch(s)}
//                           className="w-full flex items-center gap-3 px-4 py-2 hover:bg-teal-50/70 text-left text-sm text-slate-700 font-medium"
//                         >
//                           <Search className="w-3.5 h-3.5 text-slate-400" />
//                           {s}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
//                   <Globe className="w-3 h-3" />
//                   Community Data
//                 </div>
//               </div>
//             </div>

//             {/* ╔═══ Content ═════════════════════════════════════════════ */}
//             <div className="max-w-7xl mx-auto w-full px-6 py-8 space-y-6">
//               {/* Page heading */}
//               <div className="flex items-start justify-between gap-4 flex-wrap">
//                 <div className="min-w-0">
//                   <p className="text-[11px] font-bold text-teal-600 uppercase tracking-widest mb-1 flex items-center gap-1.5">
//                     <Pill className="w-3 h-3" />
//                     Drug Lookup
//                   </p>
//                   <h1 className="text-3xl font-bold text-slate-900 tracking-tight truncate">
//                     {displayIngredient || "—"}
//                   </h1>
//                   <p className="text-sm text-slate-500 mt-1">
//                     {loading
//                       ? "Analyzing data across the network..."
//                       : data && data.drugs.length > 0
//                         ? `Found ${data.drugs.length} variant${data.drugs.length === 1 ? "" : "s"} across the AuditProRx community`
//                         : "No data found for this ingredient"}
//                   </p>
//                 </div>
//               </div>

//               {/* Loading */}
//               {loading && (
//                 <div className="bg-white border border-slate-200 rounded-2xl p-16 flex flex-col items-center justify-center gap-4 shadow-sm">
//                   <div className="relative">
//                     <div className="h-12 w-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center">
//                       <Pill className="w-5 h-5 text-teal-600" />
//                     </div>
//                     <div className="absolute -inset-1 rounded-[18px] border-2 border-transparent border-t-teal-500 border-r-teal-300 animate-spin" />
//                   </div>
//                   <p className="text-sm font-semibold text-slate-600">
//                     Aggregating data across every audit...
//                   </p>
//                 </div>
//               )}

//               {/* Error */}
//               {!loading && error && (
//                 <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
//                   <p className="text-sm font-semibold text-red-700">
//                     Something went wrong
//                   </p>
//                   <p className="text-xs text-red-500 mt-1">{error}</p>
//                 </div>
//               )}

//               {/* Empty */}
//               {!loading && !error && data && data.drugs.length === 0 && (
//                 <div className="bg-white border border-slate-200 rounded-2xl p-16 flex flex-col items-center gap-3 shadow-sm">
//                   <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
//                     <Search className="w-5 h-5 text-slate-400" />
//                   </div>
//                   <p className="text-sm font-semibold text-slate-600">
//                     No drugs found for "{displayIngredient}"
//                   </p>
//                   <p className="text-xs text-slate-400">
//                     Try a different spelling or search term
//                   </p>
//                 </div>
//               )}

//               {/* ╔═══ KPI tiles ══════════════════════════════════════ */}
//               {!loading && !error && data && data.drugs.length > 0 && agg && (
//                 <>
//                   <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
//                     <KpiTile
//                       icon={Pill}
//                       label="Ingredient"
//                       value={displayIngredient}
//                       color="teal"
//                       isText
//                     />
//                     <KpiTile
//                       icon={Hash}
//                       label="Variants"
//                       value={String(data.drugs.length)}
//                       color="slate"
//                     />
//                     <KpiTile
//                       icon={BarChart3}
//                       label="Total Rx"
//                       value={Number(agg.totalRxs).toLocaleString()}
//                       color="cyan"
//                     />
//                     <KpiTile
//                       icon={DollarSign}
//                       label="Total Ins Paid"
//                       value={`$${Number(agg.totalInsPaid).toLocaleString("en-US", { maximumFractionDigits: 0 })}`}
//                       color="emerald"
//                     />
//                     <KpiTile
//                       icon={TrendingUp}
//                       label="Avg / Unit"
//                       value={`$${Number(agg.weightedAvgPerUnit).toFixed(2)}`}
//                       color="indigo"
//                     />
//                   </div>

//                   {/* ╔═══ Medications Table ═══════════════════════════ */}
//                   <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
//                     <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
//                       <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
//                         <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
//                         Medications
//                       </h3>
//                       <span className="text-[11px] text-slate-400 font-medium">
//                         Click a row to expand NDC breakdown
//                       </span>
//                     </div>

//                     <div className="overflow-x-auto">
//                       <table
//                         style={{
//                           borderCollapse: "collapse",
//                           width: "100%",
//                           tableLayout: "fixed",
//                           minWidth: 900,
//                         }}
//                       >
//                         <colgroup>
//                           <col style={{ width: "32%" }} />
//                           <col style={{ width: "11%" }} />
//                           <col style={{ width: "12%" }} />
//                           <col style={{ width: "15%" }} />
//                           <col style={{ width: "15%" }} />
//                           <col style={{ width: "15%" }} />
//                         </colgroup>
//                         <thead>
//                           <tr style={{ background: "#1e293b" }}>
//                             {[
//                               { l1: "Medications", l2: "", a: "left" as const },
//                               { l1: "Avg Qty", l2: "per Rx", a: "right" as const },
//                               { l1: "Avg CoPay", l2: "per Rx", a: "right" as const },
//                               { l1: "Avg Ins Paid", l2: "per Rx", a: "right" as const },
//                               { l1: "Avg Ins Paid", l2: "per Unit", a: "right" as const },
//                               { l1: "Rx Count", l2: "", a: "right" as const },
//                             ].map((h, i) => (
//                               <th
//                                 key={i}
//                                 style={{
//                                   padding: "10px 12px",
//                                   textAlign: h.a,
//                                   fontSize: 10,
//                                   fontWeight: 700,
//                                   color: "#fff",
//                                   letterSpacing: "0.06em",
//                                   textTransform: "uppercase",
//                                   lineHeight: 1.3,
//                                 }}
//                               >
//                                 <div>{h.l1}</div>
//                                 {h.l2 && (
//                                   <div style={{ color: "#94a3b8", fontWeight: 500, fontSize: 9 }}>
//                                     {h.l2}
//                                   </div>
//                                 )}
//                               </th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {data.drugs.map((drug, di) => {
//                             const isExp = expandedDrug === drug.drug_name;
//                             return (
//                               <React.Fragment key={drug.drug_name}>
//                                 <tr
//                                   style={{
//                                     borderBottom: "1px solid #e2e8f0",
//                                     background: isExp
//                                       ? "#eef2ff"
//                                       : di % 2 === 1
//                                         ? "#f8fafc"
//                                         : "#fff",
//                                     cursor: "pointer",
//                                   }}
//                                   onClick={() =>
//                                     setExpandedDrug(isExp ? null : drug.drug_name)
//                                   }
//                                   className="hover:bg-teal-50/50 transition-colors"
//                                 >
//                                   <td style={{ padding: "11px 12px", fontSize: 13 }}>
//                                     <div className="flex items-center gap-2">
//                                       <ChevronDown
//                                         className={`w-3.5 h-3.5 text-slate-400 transition-transform shrink-0 ${isExp ? "" : "-rotate-90"}`}
//                                       />
//                                       <span className="text-slate-400 tabular-nums text-[11px] shrink-0">
//                                         {di + 1}.
//                                       </span>
//                                       <span className="font-semibold text-slate-800 truncate">
//                                         {drug.drug_name}
//                                       </span>
//                                       {brandPill(drug.brand)}
//                                     </div>
//                                   </td>
//                                   <td style={{ padding: "11px 12px", fontSize: 13, textAlign: "right" }}>
//                                     <span className="tabular-nums text-slate-700">
//                                       {Number(drug.avg_qty_per_rx ?? 0).toFixed(0)}
//                                     </span>
//                                   </td>
//                                   <td style={{ padding: "11px 12px", fontSize: 13, textAlign: "right", background: "rgba(240,253,250,0.5)" }}>
//                                     <span className="tabular-nums text-slate-700">
//                                       {drug.avg_copay_per_rx != null
//                                         ? `$${Number(drug.avg_copay_per_rx).toFixed(2)}`
//                                         : "—"}
//                                     </span>
//                                   </td>
//                                   <td style={{ padding: "11px 12px", fontSize: 13, textAlign: "right", background: "rgba(240,253,250,0.5)" }}>
//                                     <span className="tabular-nums font-semibold text-slate-800">
//                                       ${Number(drug.avg_ins_paid_per_rx ?? 0).toFixed(2)}
//                                     </span>
//                                   </td>
//                                   <td style={{ padding: "11px 12px", fontSize: 13, textAlign: "right", background: "rgba(240,253,250,0.5)" }}>
//                                     <span className="tabular-nums text-slate-700">
//                                       ${Number(drug.avg_ins_paid_per_unit ?? 0).toFixed(2)}
//                                     </span>
//                                   </td>
//                                   <td style={{ padding: "11px 12px", fontSize: 13, textAlign: "right", background: "rgba(236,254,255,0.5)" }}>
//                                     <span className="tabular-nums font-bold text-cyan-800">
//                                       {Number(drug.rx_count ?? 0).toLocaleString()}
//                                     </span>
//                                   </td>
//                                 </tr>

//                                 {isExp &&
//                                   drug.ndcs &&
//                                   drug.ndcs.map((ndc, ni) => (
//                                     <tr
//                                       key={ndc.ndc}
//                                       style={{
//                                         borderBottom: "1px solid #f1f5f9",
//                                         background: ni % 2 === 1 ? "#f8fafc" : "#fff",
//                                       }}
//                                     >
//                                       <td style={{ padding: "8px 12px 8px 42px", fontSize: 12 }}>
//                                         <div className="flex items-center gap-2">
//                                           <span className="text-teal-400 text-sm leading-none shrink-0">◦</span>
//                                           <span className="font-mono text-[11px] text-slate-600 tabular-nums">
//                                             {ndc.ndc}
//                                           </span>
//                                           {brandPill(ndc.brand)}
//                                         </div>
//                                       </td>
//                                       <td style={{ padding: "8px 12px", fontSize: 12, textAlign: "right" }}>
//                                         <span className="tabular-nums text-slate-600">
//                                           {Number(ndc.avg_qty_per_rx ?? 0).toFixed(0)}
//                                         </span>
//                                       </td>
//                                       <td style={{ padding: "8px 12px", fontSize: 12, textAlign: "right", background: "rgba(240,253,250,0.3)" }}>
//                                         <span className="tabular-nums text-slate-600">
//                                           {ndc.avg_copay_per_rx != null
//                                             ? `$${Number(ndc.avg_copay_per_rx).toFixed(2)}`
//                                             : "—"}
//                                         </span>
//                                       </td>
//                                       <td style={{ padding: "8px 12px", fontSize: 12, textAlign: "right", background: "rgba(240,253,250,0.3)" }}>
//                                         <span className="tabular-nums text-slate-700">
//                                           ${Number(ndc.avg_ins_paid_per_rx ?? 0).toFixed(2)}
//                                         </span>
//                                       </td>
//                                       <td style={{ padding: "8px 12px", fontSize: 12, textAlign: "right", background: "rgba(240,253,250,0.3)" }}>
//                                         <span className="tabular-nums text-slate-600">
//                                           ${Number(ndc.avg_ins_paid_per_unit ?? 0).toFixed(2)}
//                                         </span>
//                                       </td>
//                                       <td style={{ padding: "8px 12px", fontSize: 12, textAlign: "right", background: "rgba(236,254,255,0.3)" }}>
//                                         <span className="tabular-nums font-semibold text-cyan-700">
//                                           {Number(ndc.rx_count ?? 0).toLocaleString()}
//                                         </span>
//                                       </td>
//                                     </tr>
//                                   ))}
//                               </React.Fragment>
//                             );
//                           })}
//                         </tbody>
//                         <tfoot>
//                           <tr style={{ background: "#f1f5f9", borderTop: "2px solid #cbd5e1" }}>
//                             <td style={{ padding: "12px", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>
//                               Totals / Weighted Avg
//                             </td>
//                             <td style={{ padding: "12px", fontSize: 13, textAlign: "right" }}>
//                               <span className="tabular-nums font-bold text-slate-800">
//                                 {Number(agg.weightedAvgQty).toFixed(0)}
//                               </span>
//                             </td>
//                             <td style={{ padding: "12px", fontSize: 13, textAlign: "right" }}>
//                               <span className="tabular-nums text-slate-400">—</span>
//                             </td>
//                             <td style={{ padding: "12px", fontSize: 13, textAlign: "right" }}>
//                               <span className="tabular-nums font-bold text-slate-800">
//                                 ${Number(agg.weightedAvgInsPerRx).toFixed(2)}
//                               </span>
//                             </td>
//                             <td style={{ padding: "12px", fontSize: 13, textAlign: "right" }}>
//                               <span className="tabular-nums font-bold text-emerald-700">
//                                 ${Number(agg.weightedAvgPerUnit).toFixed(2)}
//                               </span>
//                             </td>
//                             <td style={{ padding: "12px", fontSize: 13, textAlign: "right" }}>
//                               <span className="tabular-nums font-extrabold text-cyan-800">
//                                 {Number(agg.totalRxs).toLocaleString()}
//                               </span>
//                             </td>
//                           </tr>
//                         </tfoot>
//                       </table>
//                     </div>
//                   </div>

//                   {/* ╔═══ Insights ═══════════════════════════════════ */}
//                   {data.drugs.length > 1 && (
//                     <div>
//                       <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-1 flex items-center gap-1.5">
//                         <Sparkles className="w-3 h-3" />
//                         Insights
//                       </h3>
//                       <div className="grid md:grid-cols-3 gap-3">
//                         <InsightCard
//                           icon={Flame}
//                           label="Most Prescribed"
//                           drugName={agg.mostPrescribed?.drug_name ?? "—"}
//                           subValue={`${Number(agg.mostPrescribed?.rx_count ?? 0).toLocaleString()} prescriptions`}
//                           accent="cyan"
//                         />
//                         <InsightCard
//                           icon={ArrowUpCircle}
//                           label="Highest $/Unit"
//                           drugName={agg.highestUnit?.drug_name ?? "—"}
//                           subValue={`$${Number(agg.highestUnit?.avg_ins_paid_per_unit ?? 0).toFixed(2)} / unit`}
//                           accent="red"
//                         />
//                         <InsightCard
//                           icon={ArrowDownCircle}
//                           label="Lowest $/Unit"
//                           drugName={agg.lowestUnit?.drug_name ?? "—"}
//                           subValue={`$${Number(agg.lowestUnit?.avg_ins_paid_per_unit ?? 0).toFixed(2)} / unit`}
//                           accent="emerald"
//                         />
//                       </div>
//                     </div>
//                   )}

//                   {/* ╔═══ Community Coverage teaser ═══════════════════ */}
//                   <div className="border-2 border-dashed border-slate-200 rounded-2xl p-5 bg-white/40">
//                     <div className="flex items-start gap-4">
//                       <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-100 to-cyan-100 flex items-center justify-center shrink-0">
//                         <Globe className="w-5 h-5 text-indigo-600" />
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center gap-2 mb-1">
//                           <h4 className="text-sm font-bold text-slate-800">Community Coverage</h4>
//                           <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase tracking-wider">
//                             Coming Soon
//                           </span>
//                         </div>
//                         <p className="text-xs text-slate-500 leading-relaxed">
//                           Compare individual NDCs against community benchmarks by BIN/PCN/Group, filtered by state and time range.
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// }

// // ─── Sub-components ────────────────────────────────────────────────────────

// const COLOR_MAP: Record<string, { bg: string; text: string; iconBg: string; iconBorder: string }> = {
//   teal: { bg: "linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)", text: "#0f766e", iconBg: "#5eead4", iconBorder: "#14b8a6" },
//   cyan: { bg: "#ecfeff", text: "#0891b2", iconBg: "#cffafe", iconBorder: "#67e8f9" },
//   emerald: { bg: "#ecfdf5", text: "#059669", iconBg: "#d1fae5", iconBorder: "#6ee7b7" },
//   indigo: { bg: "#eef2ff", text: "#4338ca", iconBg: "#e0e7ff", iconBorder: "#a5b4fc" },
//   slate: { bg: "#ffffff", text: "#0f172a", iconBg: "#f1f5f9", iconBorder: "#e2e8f0" },
//   red: { bg: "#fef2f2", text: "#dc2626", iconBg: "#fee2e2", iconBorder: "#fca5a5" },
// };

// function KpiTile({
//   icon: Icon,
//   label,
//   value,
//   color,
//   isText,
// }: {
//   icon: any;
//   label: string;
//   value: string;
//   color: string;
//   isText?: boolean;
// }) {
//   const c = COLOR_MAP[color] ?? COLOR_MAP.slate;
//   return (
//     <div
//       className="rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
//       style={{ background: c.bg }}
//     >
//       <div className="flex items-center gap-2 mb-2">
//         <div
//           className="h-7 w-7 rounded-lg flex items-center justify-center"
//           style={{ background: c.iconBg, border: `1px solid ${c.iconBorder}` }}
//         >
//           <Icon className="w-3.5 h-3.5" style={{ color: c.text }} />
//         </div>
//         <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: c.text }}>
//           {label}
//         </p>
//       </div>
//       <p
//         className={`${isText ? "text-[15px]" : "text-xl"} font-extrabold tabular-nums leading-tight truncate`}
//         style={{ color: c.text }}
//         title={value}
//       >
//         {value}
//       </p>
//     </div>
//   );
// }

// function InsightCard({
//   icon: Icon,
//   label,
//   drugName,
//   subValue,
//   accent,
// }: {
//   icon: any;
//   label: string;
//   drugName: string;
//   subValue: string;
//   accent: string;
// }) {
//   const c = COLOR_MAP[accent] ?? COLOR_MAP.slate;
//   return (
//     <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-slate-300 transition-all">
//       <div className="flex items-center gap-2 mb-2">
//         <div
//           className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
//           style={{ background: c.iconBg, border: `1px solid ${c.iconBorder}` }}
//         >
//           <Icon className="w-3.5 h-3.5" style={{ color: c.text }} />
//         </div>
//         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
//       </div>
//       <p className="text-sm font-bold text-slate-900 truncate mb-1" title={drugName}>
//         {drugName}
//       </p>
//       <p className="text-[11px] tabular-nums font-semibold" style={{ color: c.text }}>
//         {subValue}
//       </p>
//     </div>
//   );
// }

// // ─── Wrapped in Suspense because useSearchParams requires it ─────────────
// export default function DrugLookupResultsPage() {
//   return (
//     <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
//       <DrugLookupResultsInner />
//     </Suspense>
//   );
// }
"use client";

import React, { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AppSidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Search, X, ChevronDown, ArrowLeft, Sparkles, TrendingUp, Pill,
  BarChart3, DollarSign, Hash, Flame, ArrowDownCircle, ArrowUpCircle,
  Globe, Filter, RotateCcw, ExternalLink,
} from "lucide-react";

interface DrugLookupNdc {
  drug_name: string; ndc: string; brand: string | null;
  rx_count: number; avg_qty_per_rx: number;
  avg_copay_per_rx: number | null; avg_ins_paid_per_rx: number;
  avg_ins_paid_per_unit: number;
}
interface DrugLookupDrug {
  drug_name: string; brand: string | null; rx_count: number;
  avg_qty_per_rx: number; avg_copay_per_rx: number | null;
  avg_ins_paid_per_rx: number; avg_ins_paid_per_unit: number;
  ndcs: DrugLookupNdc[];
}
interface DrugLookupResponse {
  ingredient: string;
  filters?: { bin: string | null; pcn: string | null; grp: string | null };
  drugs: DrugLookupDrug[];
}

const extractIngredient = (term: string) =>
  term.trim().split(/\s+/)[0].toUpperCase();

const brandPill = (brand: string | null | undefined) => {
  if (!brand) return null;
  const raw = String(brand).trim().toUpperCase();
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

// ═══════════════════════════════════════════════════════════════════════════
function DrugLookupResultsInner() {
  const router = useRouter();
  const params = useSearchParams();

  // ── URL params are the source of truth ──
  const urlQ = params.get("q") ?? "";
  const urlBin = params.get("bin") ?? "";
  const urlPcn = params.get("pcn") ?? "";
  const urlGrp = params.get("grp") ?? "";

  // ── Local form state (mirrors URL on load/change) ──
  const [drugName, setDrugName] = useState(urlQ);
  const [bin, setBin] = useState(urlBin);
  const [pcn, setPcn] = useState(urlPcn);
  const [grp, setGrp] = useState(urlGrp);

  // ── Autocomplete for Drug Name in filter bar ──
  const [drugNameFocused, setDrugNameFocused] = useState(false);
  const [drugSuggestions, setDrugSuggestions] = useState<string[]>([]);
  const drugNameRef = useRef<HTMLDivElement | null>(null);
  const drugNameInputRef = useRef<HTMLInputElement | null>(null);

  // ── Data state ──
  const [data, setData] = useState<DrugLookupResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDrug, setExpandedDrug] = useState<string | null>(null);
  const [communityNdc, setCommunityNdc] = useState<string | null>(null);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activePanel, setActivePanel] = useState<string | null>(null);

  // ── Sync form state with URL when URL changes (back/forward navigation) ──
  useEffect(() => {
    setDrugName(urlQ);
    setBin(urlBin);
    setPcn(urlPcn);
    setGrp(urlGrp);
  }, [urlQ, urlBin, urlPcn, urlGrp]);

  // ── Fetch drug lookup whenever URL params change ──
  useEffect(() => {
    const ingredient = extractIngredient(urlQ);
    if (!ingredient) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    setExpandedDrug(null);

    (async () => {
      try {
        const p = new URLSearchParams();
        p.set("ingredient", ingredient);
        if (urlBin) p.set("bin", urlBin);
        if (urlPcn) p.set("pcn", urlPcn);
        if (urlGrp) p.set("grp", urlGrp);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/drug-lookup-global?${p.toString()}`,
        );
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const json = await res.json();
        setData(json);
      } catch (e: any) {
        console.error(e);
        setError(e?.message ?? "Failed to load");
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [urlQ, urlBin, urlPcn, urlGrp]);

  // ── Autocomplete fetch for Drug Name filter input ──
  useEffect(() => {
    const q = drugName.trim();
    if (q.length < 2) {
      setDrugSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/drug-search?q=${encodeURIComponent(q)}`,
        );
        if (!res.ok) return;
        const out: { name: string; rx_count: number }[] = await res.json();
        setDrugSuggestions(out.map((d) => d.name).slice(0, 6));
      } catch {
        setDrugSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [drugName]);

  // ── Click-outside for autocomplete ──
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (drugNameRef.current && !drugNameRef.current.contains(e.target as Node)) {
        setDrugNameFocused(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // ── Close community modal on Escape ──
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCommunityNdc(null);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // ── Apply / clear filters ──
  const applyFilters = () => {
    const name = drugName.trim();
    if (!name) return;
    const p = new URLSearchParams();
    p.set("q", name);
    if (bin.trim()) p.set("bin", bin.trim());
    if (pcn.trim()) p.set("pcn", pcn.trim());
    if (grp.trim()) p.set("grp", grp.trim());
    router.push(`/DrugLookup/results?${p.toString()}`);
  };

  const clearAllFilters = () => {
    setBin("");
    setPcn("");
    setGrp("");
    const p = new URLSearchParams();
    p.set("q", drugName.trim() || urlQ);
    router.push(`/DrugLookup/results?${p.toString()}`);
  };

  const removeOneFilter = (kind: "bin" | "pcn" | "grp") => {
    const p = new URLSearchParams();
    p.set("q", urlQ);
    if (kind !== "bin" && urlBin) p.set("bin", urlBin);
    if (kind !== "pcn" && urlPcn) p.set("pcn", urlPcn);
    if (kind !== "grp" && urlGrp) p.set("grp", urlGrp);
    router.push(`/DrugLookup/results?${p.toString()}`);
  };

  const hasActiveFilters = Boolean(urlBin || urlPcn || urlGrp);

  // ── Aggregation for KPIs + insights ──
  const agg = useMemo(() => {
    if (!data || !data.drugs || data.drugs.length === 0) return null;
    const drugs = data.drugs;
    const num = (v: any) => Number(v ?? 0) || 0;
    const totalRxs = drugs.reduce((s, d) => s + num(d.rx_count), 0);
    const totalQty = drugs.reduce((s, d) => s + num(d.avg_qty_per_rx) * num(d.rx_count), 0);
    const totalInsPaid = drugs.reduce((s, d) => s + num(d.avg_ins_paid_per_rx) * num(d.rx_count), 0);
    const weightedAvgPerUnit = totalQty > 0 ? totalInsPaid / totalQty : 0;
    const weightedAvgQty = totalRxs > 0 ? totalQty / totalRxs : 0;
    const weightedAvgInsPerRx = totalRxs > 0 ? totalInsPaid / totalRxs : 0;
    const byRx = [...drugs].sort((a, b) => num(b.rx_count) - num(a.rx_count));
    const byUnit = [...drugs].sort((a, b) => num(b.avg_ins_paid_per_unit) - num(a.avg_ins_paid_per_unit));
    return {
      totalRxs, totalQty, totalInsPaid, weightedAvgPerUnit, weightedAvgQty, weightedAvgInsPerRx,
      mostPrescribed: byRx[0], highestUnit: byUnit[0], lowestUnit: byUnit[byUnit.length - 1],
    };
  }, [data]);

  const displayIngredient = data?.ingredient ?? extractIngredient(urlQ);

  return (
    <ProtectedRoute>
      <div className="relative w-full bg-slate-50 min-h-screen">
        <div className="relative h-full w-full flex">
          <div
            className={`flex-shrink-0 transition-all duration-300 z-[130] ${
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

          <div className="flex-1 min-w-0 flex flex-col overflow-auto">
            {/* ╔═══ SIMPLE TOP BAR ═════════════════════════════════════ */}
            <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                <button
                  onClick={() => router.push("/DrugLookup")}
                  className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Globe className="w-3 h-3" />
                  Community Data
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto w-full px-6 py-6 space-y-6">
              {/* ╔═══ FILTER CARD ═══════════════════════════════════════ */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                    <Filter className="w-3.5 h-3.5 text-teal-600" />
                    Drug Search & Filters
                  </h3>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="text-[11px] font-semibold text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                  {/* Drug Name w/ autocomplete */}
                  <div className="md:col-span-4" ref={drugNameRef}>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Drug Name
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                      <input
                        ref={drugNameInputRef}
                        value={drugName}
                        onChange={(e) => setDrugName(e.target.value)}
                        onFocus={() => setDrugNameFocused(true)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            setDrugNameFocused(false);
                            applyFilters();
                          }
                        }}
                        placeholder="e.g. ELIQUIS"
                        className="w-full pl-9 pr-3 h-10 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                      />
                      {drugNameFocused && drugSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
                          {drugSuggestions.map((s) => (
                            <button
                              key={s}
                              onClick={() => {
                                setDrugName(s);
                                setDrugNameFocused(false);
                                drugNameInputRef.current?.focus();
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-teal-50/70 hover:text-teal-800 font-medium flex items-center gap-2 transition-colors"
                            >
                              <Search className="w-3 h-3 text-slate-400" />
                              {s}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* BIN */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      BIN
                    </label>
                    <input
                      value={bin}
                      onChange={(e) => setBin(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                      placeholder="e.g. 004336"
                      className="w-full px-3 h-10 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all tabular-nums"
                    />
                  </div>

                  {/* PCN */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      PCN
                    </label>
                    <input
                      value={pcn}
                      onChange={(e) => setPcn(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                      placeholder="e.g. MCAIDADV"
                      className="w-full px-3 h-10 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                    />
                  </div>

                  {/* Group */}
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                      Group
                    </label>
                    <input
                      value={grp}
                      onChange={(e) => setGrp(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && applyFilters()}
                      placeholder="e.g. RX8826"
                      className="w-full px-3 h-10 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-teal-400 focus:ring-2 focus:ring-teal-100 outline-none transition-all"
                    />
                  </div>

                  {/* Search button */}
                  <div className="md:col-span-2">
                    <button
                      onClick={applyFilters}
                      disabled={!drugName.trim()}
                      className="w-full h-10 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold transition-all shadow-md shadow-teal-500/20 flex items-center justify-center gap-1.5"
                    >
                      <Search className="w-3.5 h-3.5" />
                      Search
                    </button>
                  </div>
                </div>

                {/* Active filter chips */}
                {hasActiveFilters && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Filtering by:
                    </span>
                    {urlBin && (
                      <FilterChip label="BIN" value={urlBin} onRemove={() => removeOneFilter("bin")} />
                    )}
                    {urlPcn && (
                      <FilterChip label="PCN" value={urlPcn} onRemove={() => removeOneFilter("pcn")} />
                    )}
                    {urlGrp && (
                      <FilterChip label="Group" value={urlGrp} onRemove={() => removeOneFilter("grp")} />
                    )}
                  </div>
                )}
              </div>

              {/* ╔═══ Page heading ═════════════════════════════════════ */}
              <div>
                <p className="text-[11px] font-bold text-teal-600 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                  <Pill className="w-3 h-3" />
                  Drug Lookup
                </p>
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  {displayIngredient || "—"}
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  {loading
                    ? "Analyzing data across the network..."
                    : data && data.drugs.length > 0
                      ? `Found ${data.drugs.length} variant${data.drugs.length === 1 ? "" : "s"} across the AuditProRx community${hasActiveFilters ? " (filtered)" : ""}`
                      : "No data found"}
                </p>
              </div>

              {/* Loading */}
              {loading && (
                <div className="bg-white border border-slate-200 rounded-2xl p-16 flex flex-col items-center justify-center gap-4 shadow-sm">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center">
                      <Pill className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="absolute -inset-1 rounded-[18px] border-2 border-transparent border-t-teal-500 border-r-teal-300 animate-spin" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600">
                    Aggregating data across every audit...
                  </p>
                </div>
              )}

              {!loading && error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                  <p className="text-sm font-semibold text-red-700">Something went wrong</p>
                  <p className="text-xs text-red-500 mt-1">{error}</p>
                </div>
              )}

              {!loading && !error && data && data.drugs.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-16 flex flex-col items-center gap-3 shadow-sm">
                  <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <Search className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-sm font-semibold text-slate-600">
                    No results for "{displayIngredient}"{hasActiveFilters ? " with those filters" : ""}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="px-3 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Clear filters
                    </button>
                  )}
                </div>
              )}

              {/* ╔═══ KPIs ═════════════════════════════════════════════ */}
              {!loading && !error && data && data.drugs.length > 0 && agg && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <KpiTile icon={Pill} label="Ingredient" value={displayIngredient} color="teal" isText />
                    <KpiTile icon={Hash} label="Variants" value={String(data.drugs.length)} color="slate" />
                    <KpiTile icon={BarChart3} label="Total Rx" value={Number(agg.totalRxs).toLocaleString()} color="cyan" />
                    <KpiTile icon={DollarSign} label="Total Ins Paid" value={`$${Number(agg.totalInsPaid).toLocaleString("en-US", { maximumFractionDigits: 0 })}`} color="emerald" />
                    <KpiTile icon={TrendingUp} label="Avg / Unit" value={`$${Number(agg.weightedAvgPerUnit).toFixed(2)}`} color="indigo" />
                  </div>

                  {/* Medications Table */}
                  <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
                      <h3 className="text-[11px] font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
                        Medications
                      </h3>
                      <span className="text-[11px] text-slate-400 font-medium">
                        Click a row to expand NDC breakdown
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table style={{ borderCollapse: "collapse", width: "100%", tableLayout: "fixed", minWidth: 900 }}>
                        <colgroup>
                          <col style={{ width: "34%" }} />
                          <col style={{ width: "11%" }} />
                          <col style={{ width: "11%" }} />
                          <col style={{ width: "14%" }} />
                          <col style={{ width: "14%" }} />
                          <col style={{ width: "16%" }} />
                        </colgroup>
                        <thead>
                          <tr style={{ background: "#1e293b" }}>
                            {[
                              { l1: "Medications", l2: "", a: "left" as const },
                              { l1: "Avg Qty", l2: "per Rx", a: "right" as const },
                              { l1: "Avg CoPay", l2: "per Rx", a: "right" as const },
                              { l1: "Avg Ins Paid", l2: "per Rx", a: "right" as const },
                              { l1: "Avg Ins Paid", l2: "per Unit", a: "right" as const },
                              { l1: "Rx Count", l2: "", a: "right" as const },
                            ].map((h, i) => (
                              <th key={i} style={{ padding: "10px 12px", textAlign: h.a, fontSize: 10, fontWeight: 700, color: "#fff", letterSpacing: "0.06em", textTransform: "uppercase", lineHeight: 1.3 }}>
                                <div>{h.l1}</div>
                                {h.l2 && <div style={{ color: "#94a3b8", fontWeight: 500, fontSize: 9 }}>{h.l2}</div>}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {data.drugs.map((drug, di) => {
                            const isExp = expandedDrug === drug.drug_name;
                            return (
                              <React.Fragment key={drug.drug_name}>
                                <tr
                                  style={{ borderBottom: "1px solid #e2e8f0", background: isExp ? "#eef2ff" : di % 2 === 1 ? "#f8fafc" : "#fff", cursor: "pointer" }}
                                  onClick={() => setExpandedDrug(isExp ? null : drug.drug_name)}
                                  className="hover:bg-teal-50/50 transition-colors"
                                >
                                  <td style={{ padding: "11px 12px", fontSize: 13 }}>
                                    <div className="flex items-center gap-2">
                                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform shrink-0 ${isExp ? "" : "-rotate-90"}`} />
                                      <span className="text-slate-400 tabular-nums text-[11px] shrink-0">{di + 1}.</span>
                                      <span className="font-semibold text-slate-800 truncate">{drug.drug_name}</span>
                                      {brandPill(drug.brand)}
                                    </div>
                                  </td>
                                  <td style={{ padding: "11px 12px", fontSize: 13, textAlign: "right" }}>
                                    <span className="tabular-nums text-slate-700">{Number(drug.avg_qty_per_rx ?? 0).toFixed(0)}</span>
                                  </td>
                                  <td style={{ padding: "11px 12px", fontSize: 13, textAlign: "right", background: "rgba(240,253,250,0.5)" }}>
                                    <span className="tabular-nums text-slate-700">{drug.avg_copay_per_rx != null ? `$${Number(drug.avg_copay_per_rx).toFixed(2)}` : "—"}</span>
                                  </td>
                                  <td style={{ padding: "11px 12px", fontSize: 13, textAlign: "right", background: "rgba(240,253,250,0.5)" }}>
                                    <span className="tabular-nums font-semibold text-slate-800">${Number(drug.avg_ins_paid_per_rx ?? 0).toFixed(2)}</span>
                                  </td>
                                  <td style={{ padding: "11px 12px", fontSize: 13, textAlign: "right", background: "rgba(240,253,250,0.5)" }}>
                                    <span className="tabular-nums text-slate-700">${Number(drug.avg_ins_paid_per_unit ?? 0).toFixed(2)}</span>
                                  </td>
                                  <td style={{ padding: "11px 12px", fontSize: 13, textAlign: "right", background: "rgba(236,254,255,0.5)" }}>
                                    <span className="tabular-nums font-bold text-cyan-800">{Number(drug.rx_count ?? 0).toLocaleString()}</span>
                                  </td>
                                </tr>

                                {isExp && drug.ndcs && drug.ndcs.map((ndc, ni) => (
                                  <tr key={ndc.ndc} style={{ borderBottom: "1px solid #f1f5f9", background: ni % 2 === 1 ? "#f8fafc" : "#fff" }}>
                                    <td style={{ padding: "8px 12px 8px 42px", fontSize: 12 }}>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-teal-400 text-sm leading-none shrink-0">◦</span>
                                        <span className="font-mono text-[11px] text-slate-600 tabular-nums">{ndc.ndc}</span>
                                        {brandPill(ndc.brand)}
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setCommunityNdc(ndc.ndc);
                                          }}
                                          className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-[10px] font-semibold text-indigo-700 hover:text-indigo-900 transition-colors"
                                        >
                                          <Globe className="w-2.5 h-2.5" />
                                          Community
                                          <ExternalLink className="w-2.5 h-2.5" />
                                        </button>
                                      </div>
                                    </td>
                                    <td style={{ padding: "8px 12px", fontSize: 12, textAlign: "right" }}>
                                      <span className="tabular-nums text-slate-600">{Number(ndc.avg_qty_per_rx ?? 0).toFixed(0)}</span>
                                    </td>
                                    <td style={{ padding: "8px 12px", fontSize: 12, textAlign: "right", background: "rgba(240,253,250,0.3)" }}>
                                      <span className="tabular-nums text-slate-600">{ndc.avg_copay_per_rx != null ? `$${Number(ndc.avg_copay_per_rx).toFixed(2)}` : "—"}</span>
                                    </td>
                                    <td style={{ padding: "8px 12px", fontSize: 12, textAlign: "right", background: "rgba(240,253,250,0.3)" }}>
                                      <span className="tabular-nums text-slate-700">${Number(ndc.avg_ins_paid_per_rx ?? 0).toFixed(2)}</span>
                                    </td>
                                    <td style={{ padding: "8px 12px", fontSize: 12, textAlign: "right", background: "rgba(240,253,250,0.3)" }}>
                                      <span className="tabular-nums text-slate-600">${Number(ndc.avg_ins_paid_per_unit ?? 0).toFixed(2)}</span>
                                    </td>
                                    <td style={{ padding: "8px 12px", fontSize: 12, textAlign: "right", background: "rgba(236,254,255,0.3)" }}>
                                      <span className="tabular-nums font-semibold text-cyan-700">{Number(ndc.rx_count ?? 0).toLocaleString()}</span>
                                    </td>
                                  </tr>
                                ))}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr style={{ background: "#f1f5f9", borderTop: "2px solid #cbd5e1" }}>
                            <td style={{ padding: "12px", fontSize: 11, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                              Totals / Weighted Avg
                            </td>
                            <td style={{ padding: "12px", fontSize: 13, textAlign: "right" }}>
                              <span className="tabular-nums font-bold text-slate-800">{Number(agg.weightedAvgQty).toFixed(0)}</span>
                            </td>
                            <td style={{ padding: "12px", fontSize: 13, textAlign: "right" }}>
                              <span className="tabular-nums text-slate-400">—</span>
                            </td>
                            <td style={{ padding: "12px", fontSize: 13, textAlign: "right" }}>
                              <span className="tabular-nums font-bold text-slate-800">${Number(agg.weightedAvgInsPerRx).toFixed(2)}</span>
                            </td>
                            <td style={{ padding: "12px", fontSize: 13, textAlign: "right" }}>
                              <span className="tabular-nums font-bold text-emerald-700">${Number(agg.weightedAvgPerUnit).toFixed(2)}</span>
                            </td>
                            <td style={{ padding: "12px", fontSize: 13, textAlign: "right" }}>
                              <span className="tabular-nums font-extrabold text-cyan-800">{Number(agg.totalRxs).toLocaleString()}</span>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>

                  {/* Insights */}
                  {data.drugs.length > 1 && (
                    <div>
                      <h3 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-1 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3" />
                        Insights
                      </h3>
                      <div className="grid md:grid-cols-3 gap-3">
                        <InsightCard icon={Flame} label="Most Prescribed" drugName={agg.mostPrescribed?.drug_name ?? "—"} subValue={`${Number(agg.mostPrescribed?.rx_count ?? 0).toLocaleString()} prescriptions`} accent="cyan" />
                        <InsightCard icon={ArrowUpCircle} label="Highest $/Unit" drugName={agg.highestUnit?.drug_name ?? "—"} subValue={`$${Number(agg.highestUnit?.avg_ins_paid_per_unit ?? 0).toFixed(2)} / unit`} accent="red" />
                        <InsightCard icon={ArrowDownCircle} label="Lowest $/Unit" drugName={agg.lowestUnit?.drug_name ?? "—"} subValue={`$${Number(agg.lowestUnit?.avg_ins_paid_per_unit ?? 0).toFixed(2)} / unit`} accent="emerald" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* ╔═══ Community modal (placeholder) ══════════════════════════ */}
        {communityNdc && (
          <CommunityModal ndc={communityNdc} onClose={() => setCommunityNdc(null)} />
        )}
      </div>
    </ProtectedRoute>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Sub-components
// ═══════════════════════════════════════════════════════════════════════════

function FilterChip({ label, value, onRemove }: { label: string; value: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-[11px] font-semibold text-teal-800">
      <span className="text-teal-500">{label}:</span>
      <span className="tabular-nums">{value}</span>
      <button
        onClick={onRemove}
        className="h-4 w-4 rounded-full flex items-center justify-center hover:bg-teal-200 transition-colors"
        title="Remove filter"
      >
        <X className="w-2.5 h-2.5" />
      </button>
    </span>
  );
}

const COLOR_MAP: Record<string, { bg: string; text: string; iconBg: string; iconBorder: string }> = {
  teal: { bg: "linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)", text: "#0f766e", iconBg: "#5eead4", iconBorder: "#14b8a6" },
  cyan: { bg: "#ecfeff", text: "#0891b2", iconBg: "#cffafe", iconBorder: "#67e8f9" },
  emerald: { bg: "#ecfdf5", text: "#059669", iconBg: "#d1fae5", iconBorder: "#6ee7b7" },
  indigo: { bg: "#eef2ff", text: "#4338ca", iconBg: "#e0e7ff", iconBorder: "#a5b4fc" },
  slate: { bg: "#ffffff", text: "#0f172a", iconBg: "#f1f5f9", iconBorder: "#e2e8f0" },
  red: { bg: "#fef2f2", text: "#dc2626", iconBg: "#fee2e2", iconBorder: "#fca5a5" },
};

function KpiTile({ icon: Icon, label, value, color, isText }: { icon: any; label: string; value: string; color: string; isText?: boolean }) {
  const c = COLOR_MAP[color] ?? COLOR_MAP.slate;
  return (
    <div className="rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow" style={{ background: c.bg }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: c.iconBg, border: `1px solid ${c.iconBorder}` }}>
          <Icon className="w-3.5 h-3.5" style={{ color: c.text }} />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: c.text }}>{label}</p>
      </div>
      <p className={`${isText ? "text-[15px]" : "text-xl"} font-extrabold tabular-nums leading-tight truncate`} style={{ color: c.text }} title={value}>
        {value}
      </p>
    </div>
  );
}

function InsightCard({ icon: Icon, label, drugName, subValue, accent }: { icon: any; label: string; drugName: string; subValue: string; accent: string }) {
  const c = COLOR_MAP[accent] ?? COLOR_MAP.slate;
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-slate-300 transition-all">
      <div className="flex items-center gap-2 mb-2">
        <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: c.iconBg, border: `1px solid ${c.iconBorder}` }}>
          <Icon className="w-3.5 h-3.5" style={{ color: c.text }} />
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      </div>
      <p className="text-sm font-bold text-slate-900 truncate mb-1" title={drugName}>{drugName}</p>
      <p className="text-[11px] tabular-nums font-semibold" style={{ color: c.text }}>{subValue}</p>
    </div>
  );
}

function CommunityModal({ ndc, onClose }: { ndc: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden"
      >
        {/* Header */}
        <div className="relative px-6 py-5 bg-gradient-to-br from-indigo-500 via-cyan-500 to-teal-500 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-4 h-4" />
            <p className="text-[11px] font-bold uppercase tracking-widest">Community Coverage</p>
          </div>
          <h2 className="text-xl font-bold tabular-nums">NDC {ndc}</h2>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[9px] font-bold uppercase tracking-wider">
              Coming Soon
            </span>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed mb-5">
            Community Coverage will show how this NDC is billed across the network — BIN / PCN / Group
            breakdown, average insurance paid per plan, and benchmark pricing compared to your own data.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">What you'll get</p>
            <ul className="space-y-1.5 text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-0.5">•</span>
                Per-plan billing frequency and average paid amounts
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-0.5">•</span>
                State-level and time-range filters
              </li>
              <li className="flex items-start gap-2">
                <span className="text-teal-500 mt-0.5">•</span>
                Reimbursement outliers vs. community median
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 h-9 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DrugLookupResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <DrugLookupResultsInner />
    </Suspense>
  );
}