// "use client";

// import { useState, useMemo, useEffect } from "react";
// import { ArrowUpDown, ChevronRight } from "lucide-react";
// import axios from "axios";
// import { Toggle } from "@radix-ui/react-toggle";

// type CommunityRow = {
//   bin: string;
//   pcn: string;
//   grp?: string;
//   avg_ins_paid: number;
//   avg_ins_paid_per_unit: number;
//   estimated_rxs: number;
//   rx_numbers?: string[];
// };

// export default function CommunityLinkPageCopy({
//   ndcNumber,
//   drugName,
// }: {
//   ndcNumber: string;
//   drugName?: string;
// }) {
//   const [communityData, setCommunityData] = useState<CommunityRow[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
//   const [groupDataMap, setGroupDataMap] = useState<
//     Record<string, CommunityRow[]>
//   >({});
//   const [active, setActive] = useState("state");
//   const [expandedRxCells, setExpandedRxCells] = useState<Set<string>>(
//     new Set(),
//   );

//   const [sortConfig, setSortConfig] = useState<{
//     key?: keyof CommunityRow;
//     direction?: "asc" | "desc";
//   }>({
//     key: "estimated_rxs",
//     direction: "desc",
//   });

//   const getRowKey = (row: CommunityRow) => `${row.bin}-${row.pcn}`;

//   const formatCurrency = (val: number) =>
//     `$${Number(val || 0).toLocaleString()}`;

//   const fetchCommunityData = async () => {
//     try {
//       setLoading(true);

//       const userId = localStorage.getItem("userId");

//       const res = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/community/${ndcNumber}`,
//         {
//           params: {
//             includeGroups: false,
//             mode: active, // state | opportunities
//             userId: active === "opportunities" ? userId : undefined, // 👈 ONLY send when needed
//           },
//         },
//       );

//       setCommunityData(res.data || []);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCommunityData();
//   }, [active]);

//   const fetchGroupsForRow = async (row: CommunityRow) => {
//     const userId = localStorage.getItem("userId");

//     const res = await axios.get(
//       `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/community/${ndcNumber}`,
//       {
//         params: {
//           includeGroups: true,
//           bin: row.bin,
//           pcn: row.pcn,
//           mode: active,
//           userId: active === "opportunities" ? userId : undefined,
//         },
//       },
//     );

//     return res.data || [];
//   };

//   const toggleRow = async (row: CommunityRow) => {
//     const key = getRowKey(row);

//     setExpandedRows((prev) => {
//       const next = new Set(prev);
//       next.has(key) ? next.delete(key) : next.add(key);
//       return next;
//     });

//     if (!groupDataMap[key]) {
//       const groups = await fetchGroupsForRow(row);
//       setGroupDataMap((prev) => ({ ...prev, [key]: groups }));
//     }
//   };

//   // ================= SORT =================
//   const handleSort = (key: keyof CommunityRow) => {
//     setSortConfig((prev) => {
//       if (prev.key === key) {
//         return {
//           key,
//           direction: prev.direction === "asc" ? "desc" : "asc",
//         };
//       }
//       return { key, direction: "asc" };
//     });
//   };

//   const sortDir = (key: keyof CommunityRow): "asc" | "desc" | undefined =>
//     sortConfig.key === key ? sortConfig.direction : undefined;

//   const sortedData = useMemo(() => {
//     if (!sortConfig.key) return communityData;

//     const key = sortConfig.key;
//     const direction = sortConfig.direction ?? "asc";

//     return [...communityData].sort((a, b) => {
//       const valA = a[key];
//       const valB = b[key];

//       if (typeof valA === "string" && typeof valB === "string") {
//         return direction === "asc"
//           ? valA.localeCompare(valB)
//           : valB.localeCompare(valA);
//       }

//       return direction === "asc"
//         ? Number(valA) - Number(valB)
//         : Number(valB) - Number(valA);
//     });
//   }, [communityData, sortConfig]);

//   // ================= UI =================
//   return (
//     <div className="p-4">
//       <div className="flex items-start justify-between mb-4 gap-4">
//         <div className="min-w-0 flex-1">
//           <h1 className="text-2xl font-bold text-slate-900">Community</h1>
//           {(drugName || ndcNumber) && (
//             <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1">
//               {drugName && (
//                 <div>
//                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
//                     Drug Name
//                   </p>
//                   <p
//                     className="text-sm font-bold text-slate-800 truncate max-w-[360px]"
//                     title={drugName}
//                   >
//                     {drugName}
//                   </p>
//                 </div>
//               )}
//               <div>
//                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
//                   NDC
//                 </p>
//                 <p className="text-sm font-mono font-semibold text-slate-700 tabular-nums">
//                   {ndcNumber}
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Toggle Group */}
//         <div className="flex bg-gray-100 rounded-lg p-1 shrink-0">
//           <button
//             className={`cursor-pointer px-4 py-1.5 text-sm rounded-md transition ${
//               active === "state"
//                 ? "bg-white shadow text-black"
//                 : "text-gray-500"
//             }`}
//             onClick={() => setActive("state")}
//           >
//             All States
//           </button>

//           <button
//             className={`cursor-pointer px-4 py-1.5 text-sm rounded-md transition ${
//               active === "opportunities"
//                 ? "bg-white shadow text-black"
//                 : "text-gray-500"
//             }`}
//             onClick={() => setActive("opportunities")}
//           >
//             Opportunities
//           </button>
//         </div>
//       </div>
//       <div className="h-[calc(106vh)] overflow-y-auto flex flex-col bg-white">
//         {" "}
//         <table className="min-w-full text-sm border border-slate-200 border-collapse">
//           <thead>
//             <tr className="bg-slate-50">
//               <th
//                 className="border px-2 py-2 text-center w-[120px]"
//                 onClick={() => handleSort("bin")}
//               >
//                 <Header label="BIN" active={sortDir("bin")} />
//               </th>

//               <th
//                 className="border px-2 py-2 text-center w-[120px]"
//                 onClick={() => handleSort("pcn")}
//               >
//                 <Header label="PCN" active={sortDir("pcn")} />
//               </th>

//               {/* ✅ NEW See GROUP COLUMN */}
//               <th className="border px-2 py-2 text-center w-[110px]">Group</th>

//               <th
//                 className="border px-2 py-2 text-center w-[130px]"
//                 onClick={() => handleSort("avg_ins_paid")}
//               >
//                 <Header label="Avg Ins Paid" active={sortDir("avg_ins_paid")} />
//               </th>

//               <th
//                 className="border px-2 py-2 text-center w-[140px]"
//                 onClick={() => handleSort("avg_ins_paid_per_unit")}
//               >
//                 <Header
//                   label="Avg Ins Paid / Unit"
//                   active={sortDir("avg_ins_paid_per_unit")}
//                 />
//               </th>

//               <th
//                 className="border px-2 py-2 text-center w-[120px]"
//                 onClick={() => handleSort("estimated_rxs")}
//               >
//                 <Header label="Rx's" active={sortDir("estimated_rxs")} />
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {loading ? (
//               <tr>
//                 <td colSpan={6} className="text-center py-6 border">
//                   Loading...
//                 </td>
//               </tr>
//             ) : (
//               sortedData.flatMap((row) => {
//                 const key = getRowKey(row);
//                 const isExpanded = expandedRows.has(key);
//                 const groupRows = groupDataMap[key] || [];

//                 return [
//                   <tr key={key} className="hover:bg-slate-50">
//                     <td className="border px-2 py-2 text-center">{row.bin}</td>

//                     <td className="border px-2 py-2 text-center">{row.pcn}</td>

//                     {/* ✅ TOGGLE BUTTON COLUMN */}
//                     <td className="border px-2 py-2 text-center">
//                       <button
//                         onClick={() => toggleRow(row)}
//                         className="flex items-center justify-center w-full"
//                       >
//                         <div
//                           className={`cursor-pointer rounded-full flex px-2 py-1 text-xs font-medium items-center gap-1 ${
//                             isExpanded
//                               ? "bg-white border border-black text-black"
//                               : "bg-black text-white"
//                           }`}
//                         >
//                           See Group
//                         </div>
//                       </button>
//                     </td>

//                     <td className="border px-2 py-2 text-right">
//                       {formatCurrency(row.avg_ins_paid)}
//                     </td>

//                     <td className="border px-2 py-2 text-right">
//                       {formatCurrency(row.avg_ins_paid_per_unit)}
//                     </td>

//                     <td className="border px-2 py-2 text-center">
//                       {row.estimated_rxs}
//                     </td>
//                   </tr>,

//                   isExpanded && (
//                     <tr key={`${key}-expanded`}>
//                       <td colSpan={6} className="p-0 border">
//                         <div className="bg-slate-50 px-6 py-3">
//                           <table className="w-full border border-slate-200 text-sm">
//                             <thead className="bg-slate-100">
//                               <tr>
//                                 <th className="border px-2 py-1 text-left">
//                                   Group
//                                 </th>
//                                 <th className="border px-2 py-1 text-right">
//                                   Avg Ins Paid
//                                 </th>
//                                 <th className="border px-2 py-1 text-right">
//                                   Avg Ins Paid / Unit
//                                 </th>
//                                 <th className="border px-2 py-1 text-center">
//                                   Rx's
//                                 </th>
//                                 <th className="border px-2 py-1 text-left">
//                                   Rx Numbers
//                                 </th>
//                               </tr>
//                             </thead>

//                             <tbody>
//                               {groupRows.map((g, i) => {
//                                 const cellKey = `${key}-${i}`;
//                                 const isRxExpanded =
//                                   expandedRxCells.has(cellKey);
//                                 const rxList = g.rx_numbers || [];
//                                 const visibleRxs = isRxExpanded
//                                   ? rxList
//                                   : rxList.slice(0, 5);
//                                 const hiddenCount = rxList.length - 5;

//                                 return (
//                                   <tr key={i}>
//                                     <td className="border px-2 py-1">
//                                       {g.grp}
//                                     </td>
//                                     <td className="border px-2 py-1 text-right">
//                                       {formatCurrency(g.avg_ins_paid)}
//                                     </td>
//                                     <td className="border px-2 py-1 text-right">
//                                       {formatCurrency(g.avg_ins_paid_per_unit)}
//                                     </td>
//                                     <td className="border px-2 py-1 text-center">
//                                       {g.estimated_rxs}
//                                     </td>
//                                     <td className="border px-2 py-1 text-left align-top">
//                                       {rxList.length > 0 ? (
//                                         <div className="flex flex-wrap gap-1 max-w-[400px] items-center">
//                                           {visibleRxs.map((rx) => (
//                                             <span
//                                               key={rx}
//                                               className="px-1.5 py-0.5 bg-slate-200 rounded text-[10px] font-mono text-slate-700"
//                                             >
//                                               {rx}
//                                             </span>
//                                           ))}
//                                           {rxList.length > 5 && (
//                                             <button
//                                               onClick={() => {
//                                                 setExpandedRxCells((prev) => {
//                                                   const next = new Set(prev);
//                                                   if (next.has(cellKey)) {
//                                                     next.delete(cellKey);
//                                                   } else {
//                                                     next.add(cellKey);
//                                                   }
//                                                   return next;
//                                                 });
//                                               }}
//                                               className="text-[10px] text-emerald-600 hover:text-emerald-800 font-semibold self-center cursor-pointer underline"
//                                             >
//                                               {isRxExpanded
//                                                 ? "Show less"
//                                                 : `+${hiddenCount} more`}
//                                             </button>
//                                           )}
//                                         </div>
//                                       ) : (
//                                         <span className="text-slate-300">
//                                           —
//                                         </span>
//                                       )}
//                                     </td>
//                                   </tr>
//                                 );
//                               })}
//                             </tbody>
//                           </table>
//                         </div>
//                       </td>
//                     </tr>
//                   ),
//                 ];
//               })
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

// function Header({ label, active }: { label: string; active?: "asc" | "desc" }) {
//   return (
//     <div className="flex items-center justify-center gap-1">
//       <span className="text-[10px] font-bold uppercase text-slate-500">
//         {label}
//       </span>
//       <SortIcon active={active} />
//     </div>
//   );
// }

// function SortIcon({ active }: { active?: "asc" | "desc" }) {
//   if (!active) {
//     return <ArrowUpDown className="w-3 h-3 text-slate-400" />;
//   }

//   return (
//     <span className="text-xs font-bold text-emerald-600">
//       {active === "asc" ? "↑" : "↓"}
//     </span>
//   );
// }

"use client";

import { useState, useMemo, useEffect } from "react";
import { ArrowUpDown } from "lucide-react";
import axios from "axios";

type CommunityRow = {
  bin: string;
  pcn: string;
  grp?: string;
  avg_ins_paid: number;
  avg_ins_paid_per_unit: number;
  estimated_rxs: number;
  rx_numbers?: string[]; // 👈 add this
};

type Props = {
  ndcNumber: string;
  drugName?: string;
  // ✅ optional filters from outside as props only
  filterBin?: string;
  filterPcn?: string;
  filterGrp?: string;
};

export default function CommunityLinkPageCopy({
  ndcNumber,
  drugName,
  filterBin,
  filterPcn,
  filterGrp,
}: Props) {
  const [communityData, setCommunityData] = useState<CommunityRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [groupDataMap, setGroupDataMap] = useState<
    Record<string, CommunityRow[]>
  >({});
  const [loadingGroups, setLoadingGroups] = useState<Set<string>>(new Set());
  const [active, setActive] = useState("state");

  // ✅ range is internal state only — user controls it inside this component
  const [range, setRange] = useState("all_time");

  const [sortConfig, setSortConfig] = useState<{
    key?: keyof CommunityRow;
    direction?: "asc" | "desc";
  }>({
    key: "estimated_rxs",
    direction: "desc",
  });

  const getRowKey = (row: CommunityRow) => `${row.bin}-${row.pcn}`;
  const formatCurrency = (val: number) =>
    "$" +
    Number(val || 0).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // ================= FETCH MAIN =================
  const fetchCommunityData = async () => {
    try {
      setLoading(true);
      setExpandedRows(new Set());
      setGroupDataMap({});

      const userId = localStorage.getItem("userId");

      const params: Record<string, string> = {
        includeGroups: "false",
        mode: active,
        range,
      };

      // ✅ only add if passed as prop
      if (filterBin) params.bin = filterBin;
      if (filterPcn) params.pcn = filterPcn;
      if (filterGrp) params.grp = filterGrp;
      if (active === "opportunities" && userId) params.userId = userId;

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/community/${ndcNumber}`,
        { params },
      );

      setCommunityData(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!ndcNumber) return;
    fetchCommunityData();
  }, [ndcNumber, active, range, filterBin, filterPcn, filterGrp]);

  // ================= FETCH GROUPS =================
  const fetchGroupsForRow = async (row: CommunityRow) => {
    const userId = localStorage.getItem("userId");

    const params: Record<string, string> = {
      includeGroups: "true",
      bin: row.bin,
      pcn: row.pcn,
      mode: active,
      range,
    };

    if (active === "opportunities" && userId) params.userId = userId;

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/community/${ndcNumber}`,
      { params },
    );

    return res.data || [];
  };

  // ================= TOGGLE ROW =================
  const toggleRow = async (row: CommunityRow) => {
    const key = getRowKey(row);
    const isCurrentlyExpanded = expandedRows.has(key);

    setExpandedRows((prev) => {
      const next = new Set(prev);
      isCurrentlyExpanded ? next.delete(key) : next.add(key);
      return next;
    });

    if (!isCurrentlyExpanded && !groupDataMap[key]) {
      setLoadingGroups((prev) => new Set(prev).add(key));
      try {
        const groups = await fetchGroupsForRow(row);
        setGroupDataMap((prev) => ({ ...prev, [key]: groups }));
      } catch {
        setGroupDataMap((prev) => ({ ...prev, [key]: [] }));
      } finally {
        setLoadingGroups((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }
    }
  };

  // ================= SORT =================
  const handleSort = (key: keyof CommunityRow) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const sortDir = (key: keyof CommunityRow): "asc" | "desc" | undefined =>
    sortConfig.key === key ? sortConfig.direction : undefined;

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return communityData;
    const key = sortConfig.key;
    const direction = sortConfig.direction ?? "asc";
    return [...communityData].sort((a, b) => {
      const valA = a[key];
      const valB = b[key];
      if (typeof valA === "string" && typeof valB === "string") {
        return direction === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return direction === "asc"
        ? Number(valA) - Number(valB)
        : Number(valB) - Number(valA);
    });
  }, [communityData, sortConfig]);

  // ================= UI =================
  return (
    <div className="p-4 flex flex-col h-full">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        {/* Drug name + NDC */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
          {drugName && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                Drug Name
              </p>
              <p
                className="text-sm font-bold text-slate-800 truncate max-w-[260px]"
                title={drugName}
              >
                {drugName}
              </p>
            </div>
          )}
          {ndcNumber && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                NDC
              </p>
              <p className="text-sm font-mono font-semibold text-slate-700 tabular-nums">
                {ndcNumber}
              </p>
            </div>
          )}
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* ✅ Range — only date filter inside component */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
              Range
            </p>
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="border border-slate-300 rounded-md px-2 py-1 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="all_time">All Time</option>
              <option value="this_year">This Year</option>
              <option value="last_90_days">Last 90 Days</option>
            </select>
          </div>

          {/* Mode toggle */}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
              Mode
            </p>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                className={`cursor-pointer px-4 py-1 text-xs rounded-md transition ${
                  active === "state"
                    ? "bg-white shadow text-black"
                    : "text-gray-500"
                }`}
                onClick={() => setActive("state")}
              >
                Market
              </button>
              <button
                className={`cursor-pointer px-4 py-1 text-xs rounded-md transition ${
                  active === "opportunities"
                    ? "bg-white shadow text-black"
                    : "text-gray-500"
                }`}
                onClick={() => setActive("opportunities")}
              >
                Opportunities
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 max-h-[calc(106vh-2px)] overflow-y-auto">
        <table className="min-w-full text-sm border border-slate-200 border-collapse bg-white">
          <thead>
            <tr className="bg-slate-50">
              <th
                className="border px-2 py-2 text-center w-[120px] cursor-pointer"
                onClick={() => handleSort("bin")}
              >
                <Header label="BIN" active={sortDir("bin")} />
              </th>
              <th
                className="border px-2 py-2 text-center w-[120px] cursor-pointer"
                onClick={() => handleSort("pcn")}
              >
                <Header label="PCN" active={sortDir("pcn")} />
              </th>
              <th className="border px-2 py-2 text-center w-[110px]">
                <span className="text-[10px] font-bold uppercase text-slate-500">
                  Group
                </span>
              </th>
              <th
                className="border px-2 py-2 text-center w-[130px] cursor-pointer"
                onClick={() => handleSort("avg_ins_paid")}
              >
                <Header label="Avg Ins Paid" active={sortDir("avg_ins_paid")} />
              </th>
              <th
                className="border px-2 py-2 text-center w-[140px] cursor-pointer"
                onClick={() => handleSort("avg_ins_paid_per_unit")}
              >
                <Header
                  label="Avg Ins Paid / Unit"
                  active={sortDir("avg_ins_paid_per_unit")}
                />
              </th>
              <th
                className="border px-2 py-2 text-center w-[120px] cursor-pointer"
                onClick={() => handleSort("estimated_rxs")}
              >
                <Header label="Rx's" active={sortDir("estimated_rxs")} />
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-10 border text-slate-400"
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Loading…
                  </div>
                </td>
              </tr>
            ) : sortedData.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-10 border text-slate-400 text-sm"
                >
                  No results found
                </td>
              </tr>
            ) : (
              sortedData.flatMap((row) => {
                const key = getRowKey(row);
                const isExpanded = expandedRows.has(key);
                const isLoadingGroup = loadingGroups.has(key);
                const groupRows = groupDataMap[key] || [];

                return [
                  <tr key={key} className="hover:bg-slate-50 transition-colors">
                    <td className="border px-2 py-2 text-center font-mono text-xs">
                      {row.bin}
                    </td>
                    <td className="border px-2 py-2 text-center font-mono text-xs">
                      {row.pcn || "—"}
                    </td>
                    <td className="border px-2 py-2 text-center">
                      <button
                        onClick={() => toggleRow(row)}
                        disabled={isLoadingGroup}
                        className={`cursor-pointer rounded-full px-2 py-1 text-xs font-medium transition-all disabled:opacity-50 ${
                          isExpanded
                            ? "bg-white border border-black text-black"
                            : "bg-black text-white hover:bg-slate-800"
                        }`}
                      >
                        {isLoadingGroup ? "Loading…" : "See Group"}
                      </button>
                    </td>
                    <td className="border px-2 py-2 text-right tabular-nums">
                      {formatCurrency(row.avg_ins_paid)}
                    </td>
                    <td className="border px-2 py-2 text-right tabular-nums">
                      {formatCurrency(row.avg_ins_paid_per_unit)}
                    </td>
                    <td className="border px-2 py-2 text-center tabular-nums">
                      {Number(row.estimated_rxs).toLocaleString()}
                    </td>
                  </tr>,

                  isExpanded && (
                    <tr key={`${key}-expanded`}>
                      <td colSpan={6} className="p-0 border">
                        <div className="bg-slate-50 px-6 py-3">
                          <table className="w-full border border-slate-200 text-sm border-collapse">
                            <thead className="bg-slate-100">
                              <tr>
                                <th className="border px-2 py-1.5 text-left text-[10px] font-bold uppercase text-slate-500">
                                  Group
                                </th>
                                <th className="border px-2 py-1.5 text-right text-[10px] font-bold uppercase text-slate-500">
                                  Avg Ins Paid
                                </th>
                                <th className="border px-2 py-1.5 text-right text-[10px] font-bold uppercase text-slate-500">
                                  Avg Ins Paid / Unit
                                </th>
                                <th className="border px-2 py-1.5 text-center text-[10px] font-bold uppercase text-slate-500">
                                  Rx's
                                </th>
                                {active === "opportunities" && (
                                  <th className="border px-2 py-1.5 text-left text-[10px] font-bold uppercase text-slate-500">
                                    Rx Numbers
                                  </th>
                                )}
                              </tr>
                            </thead>
                            <tbody>
                              {groupRows.length === 0 ? (
                                <tr>
                                  <td
                                    colSpan={active === "opportunities" ? 5 : 4}
                                    className="border px-2 py-3 text-center text-slate-400 text-xs"
                                  >
                                    No groups found
                                  </td>
                                </tr>
                              ) : (
                                groupRows.map((g, i) => (
                                  <tr key={i} className="hover:bg-slate-50">
                                    <td className="border px-2 py-1.5 text-slate-700">
                                      {g.grp ?? "—"}
                                    </td>
                                    <td className="border px-2 py-1.5 text-right tabular-nums">
                                      {formatCurrency(g.avg_ins_paid)}
                                    </td>
                                    <td className="border px-2 py-1.5 text-right tabular-nums">
                                      {formatCurrency(g.avg_ins_paid_per_unit)}
                                    </td>
                                    <td className="border px-2 py-1.5 text-center tabular-nums">
                                      {Number(g.estimated_rxs).toLocaleString()}
                                    </td>
                                    {active === "opportunities" && (
                                      <td className="border px-2 py-1.5 align-top">
                                        <div className="flex flex-wrap gap-1 max-w-[300px]">
                                          {(g.rx_numbers || []).map((rx) => (
                                            <span
                                              key={rx}
                                              className="px-1.5 py-0.5 bg-slate-200 rounded text-[10px] font-mono text-slate-700"
                                            >
                                              {rx}
                                            </span>
                                          ))}
                                          {(g.rx_numbers || []).length ===
                                            0 && (
                                            <span className="text-slate-300 text-xs">
                                              —
                                            </span>
                                          )}
                                        </div>
                                      </td>
                                    )}
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  ),
                ];
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Header({ label, active }: { label: string; active?: "asc" | "desc" }) {
  return (
    <div className="flex items-center justify-center gap-1">
      <span className="text-[10px] font-bold uppercase text-slate-500">
        {label}
      </span>
      <SortIcon active={active} />
    </div>
  );
}

function SortIcon({ active }: { active?: "asc" | "desc" }) {
  if (!active) return <ArrowUpDown className="w-3 h-3 text-slate-400" />;
  return (
    <span className="text-xs font-bold text-emerald-600">
      {active === "asc" ? "↑" : "↓"}
    </span>
  );
}
