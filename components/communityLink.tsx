"use client";

import { useState, useMemo, useEffect } from "react";
import { ArrowUpDown, ChevronRight } from "lucide-react";
import axios from "axios";
import { Toggle } from "@radix-ui/react-toggle";

type CommunityRow = {
  bin: string;
  pcn: string;
  grp?: string;
  avg_ins_paid: number;
  avg_ins_paid_per_unit: number;
  estimated_rxs: number;
};

// const ndcNumber = "64380-0737-06";

export default function CommunityLinkPageCopy({
  ndcNumber,
}: {
  ndcNumber: string;
}) {
  const [communityData, setCommunityData] = useState<CommunityRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [groupDataMap, setGroupDataMap] = useState<
    Record<string, CommunityRow[]>
  >({});
  const [active, setActive] = useState("state");

  const [sortConfig, setSortConfig] = useState<{
    key?: keyof CommunityRow;
    direction?: "asc" | "desc";
  }>({
    key: "estimated_rxs",
    direction: "desc",
  });

  const getRowKey = (row: CommunityRow) => `${row.bin}-${row.pcn}`;

  const formatCurrency = (val: number) =>
    `$${Number(val || 0).toLocaleString()}`;

  // ================= FETCH MAIN =================
  // const fetchCommunityData = async () => {
  //   try {
  //     setLoading(true);

  //     const res = await axios.get(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/community/${ndcNumber}?includeGroups=false`,
  //     );

  //     setCommunityData(res.data || []);
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchCommunityData = async () => {
    try {
      setLoading(true);

      const userId = localStorage.getItem("userId");

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/community/${ndcNumber}`,
        {
          params: {
            includeGroups: false,
            mode: active, // state | opportunities
            userId: active === "opportunities" ? userId : undefined, // 👈 ONLY send when needed
          },
        },
      );

      setCommunityData(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunityData();
  }, [active]);

  // ================= FETCH GROUPS =================
  // const fetchGroupsForRow = async (row: CommunityRow) => {
  //   const res = await axios.get(
  //     `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/community/${ndcNumber}?includeGroups=true&bin=${row.bin}&pcn=${row.pcn}`,
  //   );

  //   return res.data || [];
  // };

  const fetchGroupsForRow = async (row: CommunityRow) => {
    const userId = localStorage.getItem("userId");

    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/community/${ndcNumber}`,
      {
        params: {
          includeGroups: true,
          bin: row.bin,
          pcn: row.pcn,
          mode: active,
          userId: active === "opportunities" ? userId : undefined,
        },
      },
    );

    return res.data || [];
  };

  const toggleRow = async (row: CommunityRow) => {
    const key = getRowKey(row);

    setExpandedRows((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

    if (!groupDataMap[key]) {
      const groups = await fetchGroupsForRow(row);
      setGroupDataMap((prev) => ({ ...prev, [key]: groups }));
    }
  };

  // ================= SORT =================
  const handleSort = (key: keyof CommunityRow) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
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
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Community</h1>

        {/* Toggle Group */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            className={`cursor-pointer px-4 py-1.5 text-sm rounded-md transition ${
              active === "state"
                ? "bg-white shadow text-black"
                : "text-gray-500"
            }`}
            onClick={() => setActive("state")}
          >
            All States
          </button>

          <button
            className={`cursor-pointer px-4 py-1.5 text-sm rounded-md transition ${
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
      <div className="h-[calc(106vh)] overflow-y-auto flex flex-col bg-white">
        {" "}
        <table className="min-w-full text-sm border border-slate-200 border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th
                className="border px-2 py-2 text-center w-[120px]"
                onClick={() => handleSort("bin")}
              >
                <Header label="BIN" active={sortDir("bin")} />
              </th>

              <th
                className="border px-2 py-2 text-center w-[120px]"
                onClick={() => handleSort("pcn")}
              >
                <Header label="PCN" active={sortDir("pcn")} />
              </th>

              {/* ✅ NEW See GROUP COLUMN */}
              <th className="border px-2 py-2 text-center w-[110px]">Group</th>

              <th
                className="border px-2 py-2 text-center w-[130px]"
                onClick={() => handleSort("avg_ins_paid")}
              >
                <Header label="Avg Ins Paid" active={sortDir("avg_ins_paid")} />
              </th>

              <th
                className="border px-2 py-2 text-center w-[140px]"
                onClick={() => handleSort("avg_ins_paid_per_unit")}
              >
                <Header
                  label="Avg Ins Paid / Unit"
                  active={sortDir("avg_ins_paid_per_unit")}
                />
              </th>

              <th
                className="border px-2 py-2 text-center w-[120px]"
                onClick={() => handleSort("estimated_rxs")}
              >
                <Header label="Rx's" active={sortDir("estimated_rxs")} />
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-6 border">
                  Loading...
                </td>
              </tr>
            ) : (
              sortedData.flatMap((row) => {
                const key = getRowKey(row);
                const isExpanded = expandedRows.has(key);
                const groupRows = groupDataMap[key] || [];

                return [
                  <tr key={key} className="hover:bg-slate-50">
                    <td className="border px-2 py-2 text-center">{row.bin}</td>

                    <td className="border px-2 py-2 text-center">{row.pcn}</td>

                    {/* ✅ TOGGLE BUTTON COLUMN */}
                    <td className="border px-2 py-2 text-center">
                      <button
                        onClick={() => toggleRow(row)}
                        className="flex items-center justify-center w-full"
                      >
                        <div
                          className={`cursor-pointer rounded-full flex px-2 py-1 text-xs font-medium items-center gap-1 ${
                            isExpanded
                              ? "bg-white border border-black text-black"
                              : "bg-black text-white"
                          }`}
                        >
                          See Group
                        </div>
                      </button>
                    </td>

                    <td className="border px-2 py-2 text-right">
                      {formatCurrency(row.avg_ins_paid)}
                    </td>

                    <td className="border px-2 py-2 text-right">
                      {formatCurrency(row.avg_ins_paid_per_unit)}
                    </td>

                    <td className="border px-2 py-2 text-center">
                      {row.estimated_rxs}
                    </td>
                  </tr>,

                  isExpanded && (
                    <tr key={`${key}-expanded`}>
                      <td colSpan={6} className="p-0 border">
                        <div className="bg-slate-50 px-6 py-3">
                          <table className="w-full border border-slate-200 text-sm">
                            <thead className="bg-slate-100">
                              <tr>
                                <th className="border px-2 py-1 text-left">
                                  Group
                                </th>
                                <th className="border px-2 py-1 text-right">
                                  Avg Ins Paid
                                </th>
                                <th className="border px-2 py-1 text-right">
                                  Avg Ins Paid / Unit
                                </th>
                                <th className="border px-2 py-1 text-center">
                                  Rx's
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {groupRows.map((g, i) => (
                                <tr key={i}>
                                  <td className="border px-2 py-1">{g.grp}</td>
                                  <td className="border px-2 py-1 text-right">
                                    {formatCurrency(g.avg_ins_paid)}
                                  </td>
                                  <td className="border px-2 py-1 text-right">
                                    {formatCurrency(g.avg_ins_paid_per_unit)}
                                  </td>
                                  <td className="border px-2 py-1 text-center">
                                    {g.estimated_rxs}
                                  </td>
                                </tr>
                              ))}
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
  if (!active) {
    return <ArrowUpDown className="w-3 h-3 text-slate-400" />;
  }

  return (
    <span className="text-xs font-bold text-emerald-600">
      {active === "asc" ? "↑" : "↓"}
    </span>
  );
}
