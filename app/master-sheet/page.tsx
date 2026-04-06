"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Users,
  RefreshCw,
  Search,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  LogIn,
  Building2,
  Loader2,
  FileSpreadsheet,
  X,
  Plus,
  Trash2,
  Save,
  AlertTriangle,
  CheckCircle2,
  Activity,
  TrendingUp,
  Clock,
  PlusSquare,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import AdminLayout from "@/components/adminLayout";

// ─────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:5000";

type CellValue = string | null;

interface ExcelState {
  sheetName: string;
  headers: string[];
  rows: CellValue[][];
  total?: number;
}

// ─────────────────────────────────────────────────────────────
// EXCEL MODAL
// ─────────────────────────────────────────────────────────────
const PAGE_SIZE = 150;
const ID_COL = "id";

const COL_CONFIG: Record<
  string,
  { label: string; width: number; readOnly?: boolean }
> = {
  id: { label: "ID", width: 70, readOnly: true },
  bin: { label: "BIN", width: 100 },
  pcn: { label: "PCN", width: 130 },
  grp: { label: "GRP", width: 130 },
  pbm_name: { label: "PBM Name", width: 200 },
  payer_type: { label: "Payer Type", width: 160 },
};

// ─────────────────────────────────────────────────────────────
// EXCEL EDITOR MODAL
// ─────────────────────────────────────────────────────────────
export default function ExcelEditorModal({
  onClose,
  onToast,
}: {
  onClose: () => void;
  onToast: (msg: string, type: "success" | "error") => void;
}) {
  const [data, setData] = useState<ExcelState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [activeCell, setActiveCell] = useState<{ r: number; c: number } | null>(
    null,
  );
  const [editValue, setEditValue] = useState("");
  const activeCellInputRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCol, setSearchCol] = useState<string>("pbm_name");
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [dirtyRows, setDirtyRows] = useState<Set<number>>(new Set());
  const [confirmEditCell, setConfirmEditCell] = useState<{
    r: number;
    c: number;
    value: CellValue;
  } | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    fetchSheet();
  }, []);

  const fetchSheet = async () => {
    setLoading(true);
    setFetchError("");
    setPage(0);
    setDirtyRows(new Set());
    setDeletedIds([]);
    setActiveCell(null);
    try {
      const res = await axios.get<ExcelState>(`${API_BASE}/admin/excel`);
      setData(res.data);
    } catch (err: any) {
      setFetchError(
        err?.response?.data?.error ||
          "Cannot reach API — make sure backend is running.",
      );
      setData({
        sheetName: "master_sheet",
        headers: ["id", "bin", "pcn", "grp", "pbm_name", "payer_type"],
        rows: [],
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredRows =
    data?.rows.filter((row) => {
      if (!searchQuery.trim()) return true;
      const colIdx = data.headers.indexOf(searchCol);
      if (colIdx === -1) return true;
      return String(row[colIdx] ?? "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    }) ?? [];

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const pageRows = filteredRows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  useEffect(() => {
    setPage(0);
  }, [searchQuery, searchCol]);

  const activateCell = useCallback(
    (globalVisIdx: number, ci: number, val: CellValue) => {
      const header = data?.headers[ci] ?? "";
      if (COL_CONFIG[header]?.readOnly) return;
      setActiveCell({ r: globalVisIdx, c: ci });
      setEditValue(val ?? "");
      setTimeout(() => activeCellInputRef.current?.focus(), 30);
    },
    [data],
  );

  const commitEdit = useCallback(
    (val: string, visIdx: number, ci: number) => {
      if (!data) return;
      const targetRow = filteredRows[visIdx];
      const realIdx = data.rows.indexOf(targetRow);
      if (realIdx === -1) return;
      const newRows = data.rows.map((row, ri) =>
        ri === realIdx ? row.map((cell, i) => (i === ci ? val : cell)) : row,
      );
      setData({ ...data, rows: newRows });
      setDirtyRows((prev) => new Set(prev).add(realIdx));
    },
    [data, filteredRows],
  );

  const deleteRow = (visibleIdx: number) => {
    if (!data) return;
    const targetRow = filteredRows[visibleIdx];
    const realIdx = data.rows.indexOf(targetRow);
    if (realIdx === -1) return;
    const idColIdx = data.headers.indexOf(ID_COL);
    if (idColIdx !== -1) {
      const rowId = Number(targetRow[idColIdx]);
      if (!isNaN(rowId) && rowId > 0) setDeletedIds((prev) => [...prev, rowId]);
    }
    setData({ ...data, rows: data.rows.filter((_, i) => i !== realIdx) });
    setDirtyRows((prev) => {
      const s = new Set(prev);
      s.delete(realIdx);
      return s;
    });
  };

  const addRow = () => {
    if (!data) return;
    const emptyRow: CellValue[] = data.headers.map(() => "");
    setData({ ...data, rows: [...data.rows, emptyRow] });
    setPage(Math.max(0, Math.ceil((data.rows.length + 1) / PAGE_SIZE) - 1));
    setSearchQuery("");
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      if (deletedIds.length > 0) {
        await Promise.allSettled(
          deletedIds.map((id) =>
            axios.delete(`${API_BASE}/admin/excel/row/${id}`),
          ),
        );
      }
      const res = await axios.post<{
        message: string;
        updated: number;
        inserted: number;
      }>(`${API_BASE}/admin/excel`, {
        sheetName: data.sheetName,
        headers: data.headers,
        rows: data.rows,
      });
      onToast(`✓ ${res.data.message}`, "success");
      onClose();
    } catch (err: any) {
      onToast(
        err?.response?.data?.error || "Save failed. Please try again.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const downloadCSV = () => {
    if (!data) return;

    const headers = data.headers;
    const rows = data.rows;

    const escapeCSV = (val: any) => {
      if (val === null || val === undefined) return "";
      const str = String(val);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    const csvContent = [
      headers.map(escapeCSV).join(","), // header row
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${data.sheetName || "data"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminLayout>
      <div
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            activeCell ? setActiveCell(null) : onClose();
          }
        }}
        className="w-full h-[min(94vh,820px)] flex flex-col overflow-hidden outline-none"
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-border bg-muted/50 flex items-center gap-3 shrink-0 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-foreground flex items-center justify-center shrink-0">
              <Database size={16} className="text-background" />
            </div>
            <div>
              <div className="font-bold text-sm text-foreground">
                master_sheet
              </div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                {loading ? (
                  <>
                    <Loader2
                      size={10}
                      className="animate-spin text-foreground"
                    />{" "}
                    Querying PostgreSQL…
                  </>
                ) : (
                  <>
                    <span className="text-foreground">●</span>{" "}
                    {data?.rows.length ?? 0} rows · {data?.headers.length ?? 0}{" "}
                    columns
                  </>
                )}
                {fetchError && (
                  <span className="text-destructive ml-1.5">{fetchError}</span>
                )}
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-1.5 flex-1 min-w-[260px] max-w-[480px]">
            <select
              value={searchCol}
              onChange={(e) => setSearchCol(e.target.value)}
              className="bg-card border border-border rounded-lg text-foreground text-[11px] px-2 py-[7px] outline-none cursor-pointer"
            >
              {(data?.headers ?? [])
                .filter((h) => h !== ID_COL)
                .map((h) => (
                  <option key={h} value={h}>
                    {COL_CONFIG[h]?.label ?? h}
                  </option>
                ))}
            </select>
            <div className="relative flex-1">
              <Search
                size={12}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                placeholder={`Filter ${COL_CONFIG[searchCol]?.label ?? searchCol}…`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card border border-border rounded-lg py-[7px] pl-7 pr-7 text-foreground text-xs outline-none focus:border-foreground"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            {searchQuery && (
              <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                {filteredRows.length} match
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {(dirtyRows.size > 0 || deletedIds.length > 0) && (
              <span className="text-[11px] text-destructive">
                {dirtyRows.size > 0 && `${dirtyRows.size} edited`}
                {dirtyRows.size > 0 && deletedIds.length > 0 && " · "}
                {deletedIds.length > 0 && `${deletedIds.length} deleted`}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={fetchSheet}
              className="h-8 px-2.5"
            >
              <RefreshCw size={13} />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={addRow}
              className="h-8 gap-1.5"
            >
              <PlusSquare size={13} /> Add Row
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadCSV}
              className="h-8 gap-1.5 cursor-pointer"
            >
              <FileSpreadsheet size={13} />
              Download CSV
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={saving}
              className="h-8 gap-1.5 bg-foreground text-background hover:bg-foreground/90"
            >
              {saving ? (
                <>
                  <Loader2 size={13} className="animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save size={13} /> Save to DB
                </>
              )}
            </Button>
            {/* <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8 px-2"
            >
              <X size={15} />
            </Button> */}
          </div>
        </div>

        {/* Sheet Grid */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3.5">
            <Loader2 size={30} className="animate-spin text-foreground" />
            <span className="text-sm text-muted-foreground">
              Fetching master_sheet rows from PostgreSQL…
            </span>
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <table className="border-collapse text-xs w-full">
              <thead className="sticky top-0 z-20">
                <tr>
                  <th className="bg-muted px-3.5 py-2.5 border-b border-r border-border text-left text-[11px] font-bold uppercase tracking-wider text-foreground w-14 text-center">
                    #
                  </th>
                  {data?.headers.map((h, ci) => {
                    const cfg = COL_CONFIG[h] ?? { label: h, width: 140 };
                    return (
                      <th
                        key={ci}
                        style={{ minWidth: cfg.width, width: cfg.width }}
                        className="bg-muted px-3.5 py-2.5 border-b border-r border-border text-left text-[11px] font-bold uppercase tracking-wider text-foreground select-none whitespace-nowrap"
                      >
                        <div className="flex items-center gap-1.5">
                          {cfg.readOnly && (
                            <span className="text-[8px] text-background bg-foreground/70 border border-border rounded px-1.5 py-px">
                              PK
                            </span>
                          )}
                          <span
                            className={
                              cfg.readOnly
                                ? "text-muted-foreground"
                                : "text-foreground"
                            }
                          >
                            {cfg.label}
                          </span>
                        </div>
                        <div className="text-[9px] text-muted-foreground mt-0.5 font-normal">
                          {String.fromCharCode(65 + ci)}
                        </div>
                      </th>
                    );
                  })}
                  <th className="bg-muted px-3.5 py-2.5 border-b border-r border-border text-center w-11">
                    <Trash2
                      size={11}
                      className="text-muted-foreground mx-auto"
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={(data?.headers.length ?? 0) + 2}
                      className="text-center py-16 text-muted-foreground text-sm"
                    >
                      {searchQuery
                        ? `No rows match "${searchQuery}"`
                        : "master_sheet is empty — add a row or check your backend."}
                    </td>
                  </tr>
                ) : (
                  pageRows.map((row, visIdx) => {
                    const globalVisIdx = page * PAGE_SIZE + visIdx;
                    const realIdx = data!.rows.indexOf(row);
                    const isDirty = dirtyRows.has(realIdx);
                    return (
                      <tr
                        key={visIdx}
                        className={`${visIdx % 2 === 0 ? "bg-card" : "bg-muted/30"} hover:bg-accent transition-colors`}
                      >
                        <td
                          className={`px-3.5 py-2 border-b border-r border-border text-center text-[10px] font-semibold text-muted-foreground ${isDirty ? "bg-yellow-50" : "bg-muted/50"}`}
                        >
                          {isDirty && (
                            <span className="text-destructive mr-0.5">●</span>
                          )}
                          {page * PAGE_SIZE + visIdx + 1}
                        </td>
                        {row.map((cell, ci) => {
                          const header = data!.headers[ci];
                          const cfg = COL_CONFIG[header] ?? {
                            label: header,
                            width: 140,
                          };
                          const isActive =
                            activeCell?.r === globalVisIdx &&
                            activeCell?.c === ci;
                          const isId = !!cfg.readOnly;
                          return (
                            <td
                              key={ci}
                              // onClick={() =>
                              //   !isId && activateCell(globalVisIdx, ci, cell)
                              // }
                              onClick={() => {
                                if (isId) return;
                                setConfirmEditCell({
                                  r: globalVisIdx,
                                  c: ci,
                                  value: cell,
                                });
                              }}
                              style={{ width: cfg.width, minWidth: cfg.width }}
                              className={`px-3.5 py-2 border-b border-r border-border text-xs whitespace-nowrap transition-colors ${
                                isActive
                                  ? "outline outline-2 outline-foreground -outline-offset-1 bg-accent"
                                  : ""
                              } ${isId ? "cursor-default" : "cursor-cell"}`}
                            >
                              {isActive ? (
                                <input
                                  ref={activeCellInputRef}
                                  autoFocus
                                  value={editValue}
                                  onChange={(e) => {
                                    setEditValue(e.target.value);
                                    commitEdit(e.target.value, visIdx, ci);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      setActiveCell(null);
                                    }
                                    if (e.key === "Escape") setActiveCell(null);
                                    if (e.key === "Tab") {
                                      e.preventDefault();
                                      const headers = data!.headers;
                                      let nextCi = ci + 1;
                                      while (
                                        nextCi < headers.length &&
                                        COL_CONFIG[headers[nextCi]]?.readOnly
                                      )
                                        nextCi++;
                                      if (nextCi < headers.length)
                                        activateCell(
                                          globalVisIdx,
                                          nextCi,
                                          pageRows[visIdx][nextCi],
                                        );
                                      else setActiveCell(null);
                                    }
                                  }}
                                  className="w-full bg-transparent border-none outline-none text-foreground text-xs p-0"
                                />
                              ) : isId ? (
                                <span className="text-muted-foreground font-semibold text-[11px]">
                                  {cell !== null && cell !== "" ? (
                                    cell
                                  ) : (
                                    <span className="text-muted-foreground/40">
                                      auto
                                    </span>
                                  )}
                                </span>
                              ) : (
                                <span
                                  className={
                                    cell === null || cell === ""
                                      ? "text-muted-foreground"
                                      : "text-foreground"
                                  }
                                >
                                  {cell === null || cell === "" ? "null" : cell}
                                </span>
                              )}
                            </td>
                          );
                        })}
                        <td className="px-1.5 py-2 border-b border-r border-border text-center">
                          <button
                            onClick={() => deleteRow(globalVisIdx)}
                            className="text-muted-foreground/40 hover:text-destructive transition-colors p-1 rounded mx-auto flex"
                            title="Delete row"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border bg-muted/30 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            {[
              ["Click", "select"],
              ["Tab", "next col"],
              ["Enter", "confirm"],
              ["Esc", "deselect"],
            ].map(([k, v]) => (
              <span key={k} className="flex items-center gap-1">
                <kbd className="bg-muted border border-border text-foreground/70 px-1.5 py-0.5 rounded text-[10px]">
                  {k}
                </kbd>{" "}
                {v}
              </span>
            ))}
            <span className="text-muted-foreground/60 ml-1">
              ID = read-only PK
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground">
              {searchQuery
                ? `${filteredRows.length} / ${data?.rows.length ?? 0}`
                : `${data?.rows.length ?? 0} rows`}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="h-7 px-2 text-xs"
            >
              ‹
            </Button>
            <span className="text-[11px] text-foreground min-w-[72px] text-center">
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="h-7 px-2 text-xs"
            >
              ›
            </Button>
          </div>
        </div>
      </div>
      {confirmEditCell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl shadow-xl p-5 w-[320px]">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-yellow-500" size={18} />
              <h3 className="text-sm font-semibold text-foreground">
                Enable Editing?
              </h3>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              Do you want to edit this cell value?
            </p>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmEditCell(null)}
              >
                Cancel
              </Button>

              <Button
                size="sm"
                className="bg-foreground text-background"
                onClick={() => {
                  activateCell(
                    confirmEditCell.r,
                    confirmEditCell.c,
                    confirmEditCell.value,
                  );
                  setConfirmEditCell(null);
                }}
              >
                Yes, Edit
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
