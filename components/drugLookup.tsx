"use client";

import { useState, useMemo, useEffect } from "react";
import { ArrowUpDown, ChevronRight, Search } from "lucide-react";
import axios from "axios";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type CommunityRow = {
  bin: string;
  pcn: string;
  grp?: string;
  avg_ins_paid: number;
  avg_ins_paid_per_unit: number;
  estimated_rxs: number;
  rx_numbers?: string[];
};

type SortConfig = {
  key: keyof CommunityRow;
  direction: "asc" | "desc";
};

export type DrugLookupFilters = {
  bin?: string;
  pcn?: string;
  grp?: string;
  range?: string; // "" | "last_90_days" | "this_year"
};

export type DrugLookupProps = {
  ndcNumber: string;
  drugName?: string;
  filters?: DrugLookupFilters;
  mode?: "state" | "opportunities";
};

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const fmt = (val: number) =>
  "$" +
  Number(val || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const rowKey = (row: CommunityRow) => `${row.bin}-${row.pcn}`;

// ─────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────
function SortIcon({ active }: { active?: "asc" | "desc" }) {
  if (!active)
    return <ArrowUpDown className="w-3 h-3 text-slate-400 inline-block ml-1" />;
  return (
    <span className="text-xs font-bold text-emerald-600 ml-1">
      {active === "asc" ? "↑" : "↓"}
    </span>
  );
}

function ColHeader({
  label,
  colKey,
  sortConfig,
  onSort,
  className = "",
}: {
  label: string;
  colKey: keyof CommunityRow;
  sortConfig: SortConfig;
  onSort: (k: keyof CommunityRow) => void;
  className?: string;
}) {
  const dir = sortConfig.key === colKey ? sortConfig.direction : undefined;
  return (
    <th
      className={`border border-slate-200 px-3 py-2 cursor-pointer select-none whitespace-nowrap ${className}`}
      onClick={() => onSort(colKey)}
    >
      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-slate-500">
        {label}
        <SortIcon active={dir} />
      </span>
    </th>
  );
}

// ─────────────────────────────────────────────
// Expanded Group Sub-Table
// ─────────────────────────────────────────────
function GroupSubTable({
  groups,
  parentKey,
  expandedRxCells,
  onToggleRx,
}: {
  groups: CommunityRow[];
  parentKey: string;
  expandedRxCells: Set<string>;
  onToggleRx: (cellKey: string) => void;
}) {
  return (
    <tr>
      <td colSpan={6} className="p-0 border border-slate-200">
        <div className="bg-slate-50 px-6 py-3">
          <table className="w-full border border-slate-200 text-sm border-collapse">
            <thead className="bg-slate-100">
              <tr>
                <th className="border border-slate-200 px-2 py-1.5 text-left text-[10px] font-bold uppercase text-slate-500">
                  Group
                </th>
                <th className="border border-slate-200 px-2 py-1.5 text-right text-[10px] font-bold uppercase text-slate-500">
                  Avg Ins Paid
                </th>
                <th className="border border-slate-200 px-2 py-1.5 text-right text-[10px] font-bold uppercase text-slate-500">
                  Avg Ins Paid / Unit
                </th>
                <th className="border border-slate-200 px-2 py-1.5 text-center text-[10px] font-bold uppercase text-slate-500">
                  Rx's
                </th>
                {/* <th className="border border-slate-200 px-2 py-1.5 text-left text-[10px] font-bold uppercase text-slate-500">
                  Rx Numbers
                </th> */}
              </tr>
            </thead>
            <tbody>
              {groups.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-4 text-slate-400 text-xs border border-slate-200"
                  >
                    No groups found
                  </td>
                </tr>
              ) : (
                groups.map((g, i) => {
                  const cellKey = `${parentKey}-${i}`;
                  const isRxExp = expandedRxCells.has(cellKey);
                  const rxList = g.rx_numbers || [];
                  const visible = isRxExp ? rxList : rxList.slice(0, 5);
                  const hiddenCount = rxList.length - 5;

                  return (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="border border-slate-200 px-2 py-1.5 text-slate-700">
                        {g.grp || "—"}
                      </td>
                      <td className="border border-slate-200 px-2 py-1.5 text-right text-slate-700">
                        {fmt(g.avg_ins_paid)}
                      </td>
                      <td className="border border-slate-200 px-2 py-1.5 text-right text-slate-700">
                        {fmt(g.avg_ins_paid_per_unit)}
                      </td>
                      <td className="border border-slate-200 px-2 py-1.5 text-center text-slate-700">
                        {Number(g.estimated_rxs).toLocaleString()}
                      </td>
                      {/* <td className="border border-slate-200 px-2 py-1.5 align-top">
                        {rxList.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-[400px] items-center">
                            {visible.map((rx) => (
                              <span
                                key={rx}
                                className="px-1.5 py-0.5 bg-slate-200 rounded text-[10px] font-mono text-slate-700"
                              >
                                {rx}
                              </span>
                            ))}
                            {rxList.length > 5 && (
                              <button
                                onClick={() => onToggleRx(cellKey)}
                                className="text-[10px] text-emerald-600 hover:text-emerald-800 font-semibold cursor-pointer underline"
                              >
                                {isRxExp ? "Show less" : `+${hiddenCount} more`}
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td> */}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </td>
    </tr>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function DrugLookupComponent({
  ndcNumber,
  drugName,
  filters = {},
  mode = "state",
}: DrugLookupProps) {
  const [communityData, setCommunityData] = useState<CommunityRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [groupDataMap, setGroupDataMap] = useState<
    Record<string, CommunityRow[]>
  >({});
  const [loadingGroups, setLoadingGroups] = useState<Set<string>>(new Set());
  const [expandedRxCells, setExpandedRxCells] = useState<Set<string>>(
    new Set(),
  );

  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "estimated_rxs",
    direction: "desc",
  });
  const [selectedRange, setSelectedRange] = useState<string>(
    filters.range || "this_year",
  );

  // ─── Fetch main data whenever ndcNumber, filters, or mode changes ───
  useEffect(() => {
    if (!ndcNumber) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setCommunityData([]);
      setExpandedRows(new Set());
      setGroupDataMap({});
      setExpandedRxCells(new Set());

      try {
        const params: Record<string, string> = {
          includeGroups: "false",
          mode,
        };

        if (filters.bin) params.bin = filters.bin;
        if (filters.pcn) params.pcn = filters.pcn;
        if (filters.grp) params.grp = filters.grp;
        if (selectedRange) params.range = selectedRange;

        if (mode === "opportunities") {
          const userId = localStorage.getItem("userId") || "";
          if (userId) params.userId = userId;
        }

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/community/${ndcNumber}`,
          { params },
        );

        setCommunityData(res.data || []);
      } catch (err: any) {
        setError(
          err?.response?.data?.message || err.message || "Failed to fetch data",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ndcNumber, mode, filters.bin, filters.pcn, filters.grp, selectedRange]);

  useEffect(() => {
    if (filters.range) {
      setSelectedRange(filters.range);
    }
  }, [filters.range]);

  // ─── Fetch group rows on expand ─────────────
  const handleToggleRow = async (row: CommunityRow) => {
    const key = rowKey(row);

    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

    if (!groupDataMap[key]) {
      setLoadingGroups((prev) => new Set(prev).add(key));

      try {
        const params: Record<string, string> = {
          includeGroups: "true",
          bin: row.bin,
          pcn: row.pcn,
          mode,
        };

        if (selectedRange) params.range = selectedRange;
        if (mode === "opportunities") {
          const userId = localStorage.getItem("userId") || "";
          if (userId) params.userId = userId;
        }

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/community/${ndcNumber}`,
          { params },
        );

        setGroupDataMap((prev) => ({ ...prev, [key]: res.data || [] }));
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

  // ─── Sort ────────────────────────────────────
  const handleSort = (key: keyof CommunityRow) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" },
    );
  };

  const handleToggleRx = (cellKey: string) => {
    setExpandedRxCells((prev) => {
      const next = new Set(prev);
      next.has(cellKey) ? next.delete(cellKey) : next.add(cellKey);
      return next;
    });
  };

  const sortedData = useMemo(() => {
    const k = sortConfig.key;
    const dir = sortConfig.direction;
    return [...communityData].sort((a, b) => {
      const va = a[k];
      const vb = b[k];
      if (typeof va === "string" && typeof vb === "string")
        return dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      return dir === "asc" ? Number(va) - Number(vb) : Number(vb) - Number(va);
    });
  }, [communityData, sortConfig]);

  // ─── Render ───────────────────────────────────
  return (
    <div className="flex flex-col h-full">
      {/* Meta bar */}
      {(drugName || ndcNumber) && (
        <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mb-4">
          {drugName && (
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                Drug Name
              </p>
              <p
                className="text-sm font-bold text-slate-800 truncate max-w-[360px]"
                title={drugName}
              >
                {drugName}
              </p>
            </div>
          )}
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
              NDC
            </p>
            <p className="text-sm font-mono font-semibold text-slate-700 tabular-nums">
              {ndcNumber}
            </p>
          </div>
          <div className="items-center gap-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Range
            </p>

            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="border border-slate-300 rounded-md px-2 py-0 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-black"
            >
              <option value="this_year">This Year</option>
              <option value="last_90_days">Last 90 Days</option>
            </select>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <ColHeader
                  label="BIN"
                  colKey="bin"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="text-center"
                />
                <ColHeader
                  label="PCN"
                  colKey="pcn"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="text-center"
                />
                <th className="border border-slate-200 px-3 py-2 text-center w-[120px]">
                  <span className="text-[10px] font-bold uppercase text-slate-500">
                    Group
                  </span>
                </th>
                <ColHeader
                  label="Avg Ins Paid"
                  colKey="avg_ins_paid"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="text-right"
                />
                <ColHeader
                  label="Avg Ins Paid / Unit"
                  colKey="avg_ins_paid_per_unit"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="text-right"
                />
                <ColHeader
                  label="Rx's"
                  colKey="estimated_rxs"
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  className="text-center"
                />
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-slate-400 border border-slate-200"
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
              ) : error ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-red-500 text-sm border border-slate-200"
                  >
                    {error}
                  </td>
                </tr>
              ) : !ndcNumber ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-14 text-slate-400 text-sm border border-slate-200"
                  >
                    <Search className="w-6 h-6 mx-auto mb-2 opacity-40" />
                    No NDC number provided
                  </td>
                </tr>
              ) : sortedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-slate-400 text-sm border border-slate-200"
                  >
                    No results found
                  </td>
                </tr>
              ) : (
                sortedData.flatMap((row) => {
                  const key = rowKey(row);
                  const isExpanded = expandedRows.has(key);
                  const isLoadingGroup = loadingGroups.has(key);
                  const groupRows = groupDataMap[key] || [];

                  return [
                    <tr
                      key={key}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="border border-slate-200 px-3 py-2 text-center font-mono text-xs text-slate-700">
                        {row.bin}
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-center font-mono text-xs text-slate-700">
                        {row.pcn || "—"}
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-center">
                        <button
                          onClick={() => handleToggleRow(row)}
                          disabled={isLoadingGroup}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full border transition-all cursor-pointer ${
                            isExpanded
                              ? "bg-white border-black text-black"
                              : "bg-black border-black text-white hover:bg-slate-800"
                          } disabled:opacity-50`}
                        >
                          {isLoadingGroup ? "Loading…" : "See Group"}
                        </button>
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-right tabular-nums">
                        {fmt(row.avg_ins_paid)}
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-right tabular-nums">
                        {fmt(row.avg_ins_paid_per_unit)}
                      </td>
                      <td className="border border-slate-200 px-3 py-2 text-center tabular-nums">
                        {Number(row.estimated_rxs).toLocaleString()}
                      </td>
                    </tr>,

                    isExpanded && (
                      <GroupSubTable
                        key={`${key}-expanded`}
                        groups={groupRows}
                        parentKey={key}
                        expandedRxCells={expandedRxCells}
                        onToggleRx={handleToggleRx}
                      />
                    ),
                  ];
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// {/* <DrugLookupComponent
//   ndcNumber="00093005301"
//   drugName="Lisinopril"         // optional
//   mode="state"                  // "state" | "opportunities", default "state"
//   filters={{
//     bin: "610502",              // optional
//     pcn: "RXBIN",               // optional
//     grp: "GRP001",              // optional
//     range: "last_90_days",      // "" | "last_90_days" | "this_year"
//   }}
// /> */}
