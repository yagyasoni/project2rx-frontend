"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
import adminApi from "@/lib/adminApi";

// ─────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────
const API_BASE = "https://api.auditprorx.com";

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
  bin: { label: "BIN", width: 100, readOnly: true },
  pcn: { label: "PCN", width: 130, readOnly: true },
  grp: { label: "GRP", width: 130, readOnly: true },
  pbm_name: { label: "PBM Name", width: 200 },
  payer_type: { label: "Payer Type", width: 160 },
  // created_at: { label: "Created At", width: 180, readOnly: true },
  updated_at: { label: "Last Edited", width: 180, readOnly: true },
};

const PLACEHOLDERS: Record<string, string> = {
  bin: "Enter BIN",
  pcn: "Enter PCN",
  grp: "Enter GRP",
  pbm_name: "Select PBM",
  payer_type: "Select type",
};

// ─────────────────────────────────────────────────────────────
// EXCEL EDITOR MODAL
// ─────────────────────────────────────────────────────────────
export default function ExcelEditorModal({
  onClose,
  // onToast,
}: {
  onClose: () => void;
  // onToast: (msg: string, type: "success" | "error") => void;
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
  // const [sortConfig, setSortConfig] = useState<{
  //   key: string;
  //   direction: "asc" | "desc";
  // } | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "updated_at", direction: "desc" });
  const [pbmOptions, setPbmOptions] = useState<string[]>([]);
  const [payerTypeOptions, setPayerTypeOptions] = useState<string[]>([]);
  const [confirmDeleteRow, setConfirmDeleteRow] = useState<number | null>(null);
  const [newRowIndexes, setNewRowIndexes] = useState<number[]>([]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    fetchSheet();
    fetchDropdownOptions();
  }, []);

  const fetchSheet = async () => {
    setLoading(true);
    setFetchError("");
    setPage(0);
    setDirtyRows(new Set());
    setDeletedIds([]);
    setActiveCell(null);
    try {
      const res = await adminApi.get<ExcelState>(`/admin/excel`);
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

  const fetchDropdownOptions = async () => {
    try {
      const [pbmRes, payerRes] = await Promise.all([
        adminApi.get(`/admin/pbm-options`),
        adminApi.get(`/admin/payer-type-options`),
      ]);

      setPbmOptions(pbmRes.data.map((item: any) => item.name));
      setPayerTypeOptions(payerRes.data.map((item: any) => item.name));
    } catch (err) {
      console.error(err);
      toast("Failed to fetch dropdown options");
    }
  };

  const filteredRows = useMemo(() => {
    if (!data) return [];

    let rows = [...data.rows];

    // 🔍 FILTER
    if (searchQuery.trim()) {
      const colIdx = data.headers.indexOf(searchCol);

      rows = rows.filter((row) =>
        String(row[colIdx] ?? "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()),
      );
    }

    // 🔽 SORT
    if (sortConfig) {
      const colIdx = data.headers.indexOf(sortConfig.key);

      rows.sort((a, b) => {
        const idColIdx = data.headers.indexOf(ID_COL);
        const aNew = idColIdx !== -1 && !a[idColIdx];
        const bNew = idColIdx !== -1 && !b[idColIdx];
        if (aNew && !bNew) return -1;
        if (!aNew && bNew) return 1;

        const valA = a[colIdx] ?? "";
        const valB = b[colIdx] ?? "";

        if (sortConfig.key === "updated_at") {
          const tA = valA ? new Date(valA).getTime() : 0;
          const tB = valB ? new Date(valB).getTime() : 0;
          return sortConfig.direction === "asc" ? tA - tB : tB - tA;
        }

        const numA = Number(valA);
        const numB = Number(valB);

        // number sort
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortConfig.direction === "asc" ? numA - numB : numB - numA;
        }

        // string sort
        return sortConfig.direction === "asc"
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    return rows;
  }, [data, searchQuery, searchCol, sortConfig]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const pageRows = filteredRows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  useEffect(() => {
    setPage(0);
  }, [searchQuery, searchCol]);

  const activateCell = useCallback(
    (globalVisIdx: number, ci: number, val: CellValue) => {
      const header = data?.headers[ci] ?? "";
      // if (COL_CONFIG[header]?.readOnly) return;
      const targetRow = filteredRows[globalVisIdx];
      const realIdx = data?.rows.indexOf(targetRow) ?? -1;

      const isNewRow = newRowIndexes.includes(realIdx);

      if (COL_CONFIG[header]?.readOnly && !isNewRow) {
        return;
      }
      setActiveCell({ r: globalVisIdx, c: ci });
      setEditValue(val ?? "");
      setTimeout(() => activeCellInputRef.current?.focus(), 30);
    },
    [data],
  );

  // const commitEdit = useCallback(
  //   (val: string, visIdx: number, ci: number) => {
  //     if (!data) return;
  //     const targetRow = filteredRows[visIdx];
  //     const realIdx = data.rows.indexOf(targetRow);
  //     if (realIdx === -1) return;
  //     const newRows = data.rows.map((row, ri) =>
  //       ri === realIdx ? row.map((cell, i) => (i === ci ? val : cell)) : row,
  //     );
  //     setData({ ...data, rows: newRows });
  //     setDirtyRows((prev) => new Set(prev).add(realIdx));
  //   },
  //   [data, filteredRows],
  // );

  const commitEdit = useCallback(
    (val: string, visIdx: number, ci: number) => {
      if (!data) return;
      const globalVisIdx = page * PAGE_SIZE + visIdx;
      const targetRow = filteredRows[globalVisIdx];

      // ✅ Use ID-based lookup instead of reference equality
      // const idColIdx = data.headers.indexOf(ID_COL);
      // const rowId = targetRow[idColIdx];

      // const newRows = data.rows.map((row) =>
      //   row[idColIdx] === rowId
      //     ? row.map((cell, i) => (i === ci ? val : cell))
      //     : row,
      // );

      // const realIdx = data.rows.findIndex((row) => row[idColIdx] === rowId);
      const realIdx = data.rows.indexOf(targetRow);

      if (realIdx === -1) return;

      const newRows = data.rows.map((row, ri) =>
        ri === realIdx ? row.map((cell, i) => (i === ci ? val : cell)) : row,
      );
      setData({ ...data, rows: newRows });
      setDirtyRows((prev) => new Set(prev).add(realIdx));
    },
    [data, filteredRows, page],
  );

  // const deleteRow = (visibleIdx: number) => {
  //   if (!data) return;
  //   // const targetRow = filteredRows[visibleIdx];
  //   const targetRow = filteredRows[page * PAGE_SIZE + visibleIdx];
  //   const realIdx = data.rows.indexOf(targetRow);
  //   if (realIdx === -1) return;
  //   const idColIdx = data.headers.indexOf(ID_COL);
  //   if (idColIdx !== -1) {
  //     const rowId = Number(targetRow[idColIdx]);
  //     if (!isNaN(rowId) && rowId > 0) setDeletedIds((prev) => [...prev, rowId]);
  //   }
  //   setData({ ...data, rows: data.rows.filter((_, i) => i !== realIdx) });
  //   setDirtyRows((prev) => {
  //     const s = new Set(prev);
  //     s.delete(realIdx);
  //     return s;
  //   });
  // };

  const deleteRow = (globalVisIdx: number) => {
    if (!data) return;

    // ✅ globalVisIdx already contains page offset
    const targetRow = filteredRows[globalVisIdx];

    // ✅ prevent undefined crash
    if (!targetRow) return;

    const idColIdx = data.headers.indexOf(ID_COL);

    if (idColIdx === -1) return;

    const rowId = Number(targetRow[idColIdx]);

    // Track delete for backend
    if (!isNaN(rowId) && rowId > 0) {
      setDeletedIds((prev) => [...prev, rowId]);
    }

    // Remove instantly from UI
    // const updatedRows = data.rows.filter(
    //   (row) => Number(row[idColIdx]) !== rowId,
    // );

    // setData({
    //   ...data,
    //   rows: updatedRows,
    // });
    const realIdx = data.rows.indexOf(targetRow);
    const updatedRows = data.rows.filter((_, idx) => idx !== realIdx);

    setData({ ...data, rows: updatedRows });

    // keep newRowIndexes in sync so new rows don't break
    setNewRowIndexes((prev) =>
      prev.filter((i) => i !== realIdx).map((i) => (i > realIdx ? i - 1 : i)),
    );
  };

  // const addRow = () => {
  //   if (!data) return;
  //   const emptyRow: CellValue[] = data.headers.map(() => "");
  //   setData({ ...data, rows: [...data.rows, emptyRow] });
  //   setPage(Math.max(0, Math.ceil((data.rows.length + 1) / PAGE_SIZE) - 1));
  //   setSearchQuery("");
  // };

  // const addRow = () => {
  //   if (!data) return;

  //   const emptyRow: CellValue[] = data.headers.map(() => "");

  //   const updatedRows = [...data.rows, emptyRow];

  //   setData({
  //     ...data,
  //     rows: updatedRows,
  //   });

  //   // Track newly added row index
  //   setNewRowIndexes((prev) => [...prev, updatedRows.length - 1]);

  //   setPage(Math.max(0, Math.ceil(updatedRows.length / PAGE_SIZE) - 1));

  //   setSearchQuery("");
  // };

  const addRow = () => {
    if (!data) return;

    const emptyRow: CellValue[] = data.headers.map(() => "");

    // Insert new row at the top
    const updatedRows = [emptyRow, ...data.rows];

    setData({
      ...data,
      rows: updatedRows,
    });

    // Track all newly added rows correctly when inserting at the top
    setNewRowIndexes((prev) => [0, ...prev.map((i) => i + 1)]);

    // Show the first page since new rows are added at the beginning
    setPage(0);

    setSearchQuery("");
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      if (deletedIds.length > 0) {
        await Promise.allSettled(
          deletedIds.map((id) => adminApi.delete(`/admin/excel/row/${id}`)),
        );
      }
      const rowsToSend = data.rows.filter((_, i) => dirtyRows.has(i));
      const res = await adminApi.post<{
        message: string;
        updated: number;
        inserted: number;
      }>(`/admin/excel`, {
        sheetName: data.sheetName,
        headers: data.headers,
        rows: rowsToSend,
      });
      // toast.success(`✓ ${res.data.message}`);
      // onClose();
      await fetchSheet(); // refresh from DB
      onClose();
    } catch (err: any) {
      console.log(
        err?.response?.data?.error || "Save failed. Please try again.",
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
                  {/* <th className="bg-muted px-3.5 py-2.5 border-b border-r border-border text-left text-[11px] font-bold uppercase tracking-wider text-foreground w-14 text-center">
                    #
                  </th> */}
                  {data?.headers.map((h, ci) => {
                    const cfg = COL_CONFIG[h] ?? { label: h, width: 140 };
                    if (h === "id") return;

                    return (
                      <th
                        key={ci}
                        onClick={() => {
                          // if (COL_CONFIG[h]?.readOnly) return;
                          if (h === "id") return; // only block ID, allow updated_at sorting

                          setSortConfig((prev) => {
                            if (prev?.key === h) {
                              return {
                                key: h,
                                direction:
                                  prev.direction === "asc" ? "desc" : "asc",
                              };
                            }
                            return { key: h, direction: "asc" };
                          });
                        }}
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
                            {/* {cfg.label} */}
                            <div className="flex items-center gap-1">
                              {cfg.label}
                              {sortConfig?.key === h && (
                                <span className="text-xs">
                                  {sortConfig.direction === "asc" ? "↑" : "↓"}
                                </span>
                              )}
                            </div>
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
                        {/* <td
                          className={`px-3.5 py-2 border-b border-r border-border text-center text-[10px] font-semibold text-muted-foreground ${isDirty ? "bg-yellow-50" : "bg-muted/50"}`}
                        >
                          {isDirty && (
                            <span className="text-destructive mr-0.5">●</span>
                          )}
                          {page * PAGE_SIZE + visIdx + 1}
                        </td> */}
                        {row.map((cell, ci) => {
                          const header = data!.headers[ci];
                          const cfg = COL_CONFIG[header] ?? {
                            label: header,
                            width: 140,
                          };
                          const isActive =
                            activeCell?.r === globalVisIdx &&
                            activeCell?.c === ci;
                          // const isReadOnly = !!cfg.readOnly;
                          const realIdx = data!.rows.indexOf(row);

                          const isNewRow = newRowIndexes.includes(realIdx);

                          const isReadOnly =
                            isNewRow && ["bin", "pcn", "grp"].includes(header)
                              ? false
                              : !!cfg.readOnly;

                          if (header === "id") return;
                          return (
                            <td
                              key={ci}
                              onClick={() => {
                                if (isReadOnly) return;

                                // ✅ Prevent popup reopening while already editing
                                if (
                                  activeCell?.r === globalVisIdx &&
                                  activeCell?.c === ci
                                ) {
                                  return;
                                }

                                setConfirmEditCell({
                                  r: globalVisIdx,
                                  c: ci,
                                  value: cell,
                                });
                              }}
                              // onClick={() => {
                              //   if (isReadOnly) return;
                              //   setConfirmEditCell({
                              //     r: globalVisIdx,
                              //     c: ci,
                              //     value: cell,
                              //   });
                              // }}
                              style={{ width: cfg.width, minWidth: cfg.width }}
                              className={`relative px-3.5 py-2 border-b border-r border-border text-xs whitespace-nowrap transition-colors ${
                                isActive
                                  ? "outline outline-2 outline-foreground -outline-offset-1 bg-accent"
                                  : ""
                              } ${isReadOnly ? "cursor-default" : "cursor-cell"}`}
                            >
                              {isActive ? (
                                header === "pbm_name" ||
                                header === "payer_type" ? (
                                  <>
                                    <span className="text-foreground text-xs">
                                      {editValue || (
                                        <span className="text-muted-foreground/50 italic">
                                          {PLACEHOLDERS[header] ?? "Select"}
                                        </span>
                                      )}
                                    </span>
                                    <select
                                      size={5}
                                      ref={activeCellInputRef as any}
                                      autoFocus
                                      value={editValue}
                                      onChange={(e) => {
                                        setEditValue(e.target.value);
                                        commitEdit(e.target.value, visIdx, ci);
                                      }}
                                      onBlur={() => setActiveCell(null)}
                                      className="absolute left-0 top-full mt-1 z-50 w-full min-w-[180px] max-h-[200px] overflow-y-auto rounded-md border border-border bg-background shadow-lg p-1 text-xs outline-none"
                                    >
                                      <option value="">Select</option>

                                      {(header === "pbm_name"
                                        ? pbmOptions
                                        : payerTypeOptions
                                      ).map((option) => (
                                        <option key={option} value={option}>
                                          {option}
                                        </option>
                                      ))}
                                    </select>
                                  </>
                                ) : (
                                  // <select
                                  //   size={5}
                                  //   ref={activeCellInputRef as any}
                                  //   autoFocus
                                  //   value={editValue}
                                  //   onChange={(e) => {
                                  //     setEditValue(e.target.value);
                                  //     commitEdit(e.target.value, visIdx, ci);
                                  //   }}
                                  //   onBlur={() => setActiveCell(null)}
                                  //   className="absolute left-0 top-full mt-1 z-50 w-full min-w-[180px] max-h-[200px] overflow-y-auto rounded-md border border-border bg-background shadow-lg p-1 text-xs outline-none"
                                  // >
                                  //   <option value="">Select</option>

                                  //   {(header === "pbm_name"
                                  //     ? pbmOptions
                                  //     : payerTypeOptions
                                  //   ).map((option) => (
                                  //     <option key={option} value={option}>
                                  //       {option}
                                  //     </option>
                                  //   ))}
                                  // </select>
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

                                      if (e.key === "Escape") {
                                        setActiveCell(null);
                                      }
                                    }}
                                    className="w-full bg-transparent border-none outline-none text-foreground text-xs p-0"
                                  />
                                )
                              ) : isReadOnly ? (
                                <span className="text-muted-foreground font-semibold text-[11px]">
                                  {cell !== null && cell !== "" ? (
                                    header === "updated_at" ? (
                                      (() => {
                                        const d = new Date(cell);
                                        const timeStr = d.toLocaleTimeString(
                                          "en-IN",
                                          {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                          },
                                        );
                                        const diffDays = Math.floor(
                                          (Date.now() - d.getTime()) / 86400000,
                                        );
                                        const dateStr =
                                          diffDays === 0
                                            ? "Today"
                                            : diffDays === 1
                                              ? "Yesterday"
                                              : d.toLocaleDateString("en-IN", {
                                                  weekday: "short",
                                                  day: "2-digit",
                                                  month: "short",
                                                  year:
                                                    d.getFullYear() !==
                                                    new Date().getFullYear()
                                                      ? "numeric"
                                                      : undefined,
                                                });
                                        return (
                                          <span title={cell}>
                                            {dateStr} · {timeStr}
                                          </span>
                                        );
                                      })()
                                    ) : (
                                      cell
                                    )
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
                                      ? "text-muted-foreground/50 italic"
                                      : "text-foreground"
                                  }
                                >
                                  {cell === null || cell === ""
                                    ? (PLACEHOLDERS[header] ?? "—")
                                    : cell}
                                </span>
                              )}
                            </td>
                          );
                        })}
                        <td className="px-1.5 py-2 border-b border-r border-border text-center">
                          <button
                            onClick={() => setConfirmDeleteRow(globalVisIdx)}
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
      {confirmDeleteRow !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-xl shadow-xl p-5 w-[340px]">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="text-red-500" size={18} />
              <h3 className="text-sm font-semibold text-foreground">
                Delete Row?
              </h3>
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              Are you sure you want to delete this row? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmDeleteRow(null)}
              >
                Cancel
              </Button>

              <Button
                size="sm"
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  deleteRow(confirmDeleteRow);
                  setConfirmDeleteRow(null);
                }}
              >
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
