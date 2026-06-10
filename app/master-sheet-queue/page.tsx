"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Check, Loader2, RefreshCw } from "lucide-react";
import AdminLayout from "@/components/adminLayout";
import axios from "axios";

/* ── Static options ──────────────────────────────── */
// const PBM_OPTIONS = [
//   "Horizon",
//   "CVS Caremark",
//   "Express Scripts",
//   "Humana Pharmacy",
//   "OptumRx",
//   "Drexi",
//   "EmpiRx",
//   "Liviniti (Southern Scripts)",
//   "Coupon",
//   "Benecard",
// ];

// const PAYER_TYPE_OPTIONS = ["Commercial", "Medicaid", "Medicare", "Coupon"];

/* ── Dynamic options ──────────────────────────────── */

interface OptionItem {
  id: string;
  name: string;
}

/* ── Types ───────────────────────────────────────── */
interface FetchedRow {
  id: string;
  bin: string;
  pcn: string;
  group: string;
}

interface RowSelection {
  pbmName: string;
  payerType: string;
}

/* ── Component ───────────────────────────────────── */
const MasterSheetQueue = () => {
  const [fetchedRows, setFetchedRows] = useState<FetchedRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selections, setSelections] = useState<Record<string, RowSelection>>(
    {},
  );
  const [addingId, setAddingId] = useState<string | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    added: 0,
  });
  const [pbmOptions, setPbmOptions] = useState<OptionItem[]>([]);
  const [payerTypeOptions, setPayerTypeOptions] = useState<OptionItem[]>([]);

  const [newPbm, setNewPbm] = useState("");
  const [newPayerType, setNewPayerType] = useState("");

  const [addingPbm, setAddingPbm] = useState(false);
  const [addingPayerType, setAddingPayerType] = useState(false);

  const fetchRows = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/master-sheet-queue`,
      );

      const formatted = res.data.rows.map((r: any) => ({
        id: String(r.id),
        bin: r.bin,
        pcn: r.pcn,
        group: r.grp, // backend → frontend mapping
      }));

      // setFetchedRows(formatted);
      const uniqueMap = new Map();

      formatted.forEach((row: any) => {
        const key = `${row.bin}-${row.pcn}-${row.group}`;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, row);
        }
      });

      setFetchedRows(Array.from(uniqueMap.values()));
      // 🔹 Fetch stats
      const statsRes = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/master-sheet-queue/stats`,
      );

      setStats({
        total: Number(statsRes.data.total || 0),
        pending: Number(statsRes.data.pending || 0),
        added: Number(statsRes.data.added || 0),
      });
    } catch {
      toast("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [pbmRes, payerTypeRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/pbm-options`),
        axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/payer-type-options`,
        ),
      ]);

      setPbmOptions(pbmRes.data);
      setPayerTypeOptions(payerTypeRes.data);
    } catch (err) {
      console.error(err);
      toast("Failed to fetch options");
    }
  };

  useEffect(() => {
    fetchRows();
    fetchOptions();
  }, []);

  const updateSelection = (
    id: string,
    field: keyof RowSelection,
    value: string,
  ) => {
    setSelections((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value } as RowSelection,
    }));
  };

  const isRowReady = (id: string) => {
    const sel = selections[id];
    return sel?.pbmName && sel?.payerType;
  };

  const handleAdd = async (row: FetchedRow) => {
    if (!isRowReady(row.id)) return;

    setAddingId(row.id);

    try {
      const selection = selections[row.id];

      // 🔹 Step 1: Update PBM + payer_type
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/master-sheet-queue/${row.id}`,
        {
          pbm_name: selection.pbmName,
          payer_type: selection.payerType,
        },
      );

      // 🔹 Step 2: Add to master_sheet
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/master-sheet-queue/${row.id}/add`,
      );

      setAddedIds((prev) => new Set(prev).add(row.id));
      await axios
        .get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/master-sheet-queue/stats`,
        )
        .then((statsRes) => {
          setStats({
            total: Number(statsRes.data.total || 0),
            pending: Number(statsRes.data.pending || 0),
            added: Number(statsRes.data.added || 0),
          });
        });
      toast(`Added to master sheet, BIN ${row.bin} mapped successfully.`);
    } catch {
      toast("Failed to add");
    } finally {
      setAddingId(null);
    }
  };

  const handleAddPbmOption = async () => {
    if (!newPbm.trim()) return;

    try {
      setAddingPbm(true);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/pbm-options`,
        {
          name: newPbm,
        },
      );

      setNewPbm("");

      await fetchOptions();

      toast("PBM option added");
    } catch {
      toast("Failed to add PBM option");
    } finally {
      setAddingPbm(false);
    }
  };

  const handleAddPayerTypeOption = async () => {
    if (!newPayerType.trim()) return;

    try {
      setAddingPayerType(true);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/payer-type-options`,
        {
          name: newPayerType,
        },
      );

      setNewPayerType("");

      await fetchOptions();

      toast("Payer type option added");
    } catch {
      toast("Failed to add payer type option");
    } finally {
      setAddingPayerType(false);
    }
  };

  const pendingRows = fetchedRows.filter((r) => !addedIds.has(r.id));
  const addedCount = addedIds.size;

  return (
    <AdminLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-0 sm:px-0 py-0 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                MASTER SHEET QUEUE
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Map fetched BIN / PCN / Group entries to PBM and payer type
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRows}
              disabled={loading}
              className="gap-1.5 text-xs font-semibold"
            >
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
              Refresh
            </Button>
          </div>

          {/* Summary */}
          {!loading && fetchedRows.length > 0 && (
            <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
              <span>{stats.total} total fetched</span>
              <span className="w-px h-3 bg-border" />
              <span>{stats.pending} pending</span>
              <span className="w-px h-3 bg-border" />
              <span>{stats.added} added</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PBM OPTION */}
            <div className="border border-border rounded-lg p-4 space-y-3">
              <h2 className="text-sm font-semibold">Add PBM Name</h2>

              <div className="flex gap-2">
                <input
                  value={newPbm}
                  onChange={(e) => setNewPbm(e.target.value)}
                  placeholder="Enter PBM name"
                  className="flex-1 h-9 rounded-md border border-border bg-background px-3 text-sm"
                />

                <Button
                  onClick={handleAddPbmOption}
                  disabled={addingPbm}
                  className="h-9 text-xs"
                >
                  {addingPbm ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    "Add"
                  )}
                </Button>
              </div>
            </div>

            {/* PAYER TYPE OPTION */}
            <div className="border border-border rounded-lg p-4 space-y-3">
              <h2 className="text-sm font-semibold">Add Payer Type</h2>

              <div className="flex gap-2">
                <input
                  value={newPayerType}
                  onChange={(e) => setNewPayerType(e.target.value)}
                  placeholder="Enter payer type"
                  className="flex-1 h-9 rounded-md border border-border bg-background px-3 text-sm"
                />

                <Button
                  onClick={handleAddPayerTypeOption}
                  disabled={addingPayerType}
                  className="h-9 text-xs"
                >
                  {addingPayerType ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    "Add"
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-lg border border-border">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-12">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Bin
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      PCN
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Group
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      PBM Name <span className="text-destructive">*</span>
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Payer Type <span className="text-destructive">*</span>
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-44">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16">
                        <Loader2
                          size={20}
                          className="animate-spin text-muted-foreground mx-auto"
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                          Fetching data…
                        </p>
                      </td>
                    </tr>
                  ) : pendingRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                            <Check
                              size={16}
                              className="text-muted-foreground"
                            />
                          </div>
                          <p className="text-xs font-medium text-foreground">
                            {addedCount > 0
                              ? "All entries mapped"
                              : "No entries found"}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {addedCount > 0
                              ? `${addedCount} entries added to master sheet.`
                              : "Try refreshing to fetch new data."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    pendingRows.map((row, i) => {
                      const sel = selections[row.id];
                      const ready = isRowReady(row.id);
                      const isAdding = addingId === row.id;

                      return (
                        <tr
                          key={row.id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-4 py-3 text-xs text-muted-foreground font-medium">
                            {i + 1}
                          </td>
                          <td className="px-4 py-3 text-xs font-semibold text-foreground font-mono">
                            {row.bin}
                          </td>
                          <td className="px-4 py-3 text-xs font-semibold text-foreground font-mono">
                            {row.pcn}
                          </td>
                          <td className="px-4 py-3 text-xs font-semibold text-foreground font-mono">
                            {row.group}
                          </td>
                          <td className="px-4 py-3">
                            <Select
                              value={sel?.pbmName || ""}
                              onValueChange={(v) =>
                                updateSelection(row.id, "pbmName", v)
                              }
                            >
                              <SelectTrigger className="h-8 text-xs w-40">
                                <SelectValue placeholder="Select PBM" />
                              </SelectTrigger>
                              <SelectContent>
                                {pbmOptions.map((p) => (
                                  <SelectItem
                                    key={p.id}
                                    value={p.name}
                                    className="text-xs"
                                  >
                                    {p.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-4 py-3">
                            <Select
                              value={sel?.payerType || ""}
                              onValueChange={(v) =>
                                updateSelection(row.id, "payerType", v)
                              }
                            >
                              <SelectTrigger className="h-8 text-xs w-36">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                {payerTypeOptions.map((t) => (
                                  <SelectItem
                                    key={t.id}
                                    value={t.name}
                                    className="text-xs"
                                  >
                                    {t.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              size="sm"
                              disabled={!ready || isAdding}
                              onClick={() => handleAdd(row)}
                              className="gap-1.5 text-xs font-semibold bg-foreground text-background hover:bg-foreground/90 disabled:opacity-40 disabled:cursor-not-allowed h-8"
                            >
                              {isAdding ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <Check size={12} />
                              )}
                              Add to Master Sheet
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default MasterSheetQueue;
