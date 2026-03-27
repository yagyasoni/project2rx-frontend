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

// ─────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────
const ADMIN_EMAIL = "admin@pharmsys.com";
const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "https://api.auditprorx.com";
// ── FIX #2: chunk size for saving — 200 rows per request (~30KB each)
const SAVE_CHUNK_SIZE = 200;

// ─────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────
interface PharmacyUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt?: string;
  pharmacyName?: string;  // ✅ NEW — fetched from registration
}

type CellValue = string | null;

interface ExcelState {
  sheetName: string;
  headers: string[];
  rows: CellValue[][];
  total?: number;
}

// ─────────────────────────────────────────────────────────────
// EXCEL MODAL — style constants
// ─────────────────────────────────────────────────────────────
const PAGE_SIZE = 150;
const ID_COL = "id";

const toolbarBtn: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  background: "#f1f5f9",
  border: "1px solid #e2e8f0",
  color: "#374151",
  padding: "7px 12px",
  borderRadius: 8,
  fontSize: 12,
  cursor: "pointer",
  fontWeight: 500,
  fontFamily: "'Poppins', sans-serif",
  transition: "all 0.15s",
  whiteSpace: "nowrap",
};

const thBase: React.CSSProperties = {
  background: "#f1f5f9",
  padding: "9px 14px",
  borderBottom: "1px solid #000000",
  borderRight: "1px solid #000000",
  textAlign: "left",
  color: "#111111",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  userSelect: "none",
  whiteSpace: "nowrap",
  fontFamily: "'Poppins', sans-serif",
};

const tdBase: React.CSSProperties = {
  padding: "8px 14px",
  borderBottom: "1px solid #000000",
  borderRight: "1px solid #000000",
  fontSize: 12,
  transition: "background 0.08s",
  whiteSpace: "nowrap",
  fontFamily: "'Poppins', sans-serif",
};

const kbdStyle: React.CSSProperties = {
  background: "#f1f5f9",
  border: "1px solid #e2e8f0",
  color: "#374151",
  padding: "2px 7px",
  borderRadius: 4,
  fontSize: 10,
  fontFamily: "'Poppins', sans-serif",
};

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
// TOAST
// ─────────────────────────────────────────────────────────────
function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: type === "success" ? "#0f172a" : "#7f1d1d",
        border: `1px solid ${type === "success" ? "#334155" : "#991b1b"}`,
        color: "#f8fafc",
        padding: "12px 18px",
        borderRadius: 12,
        fontSize: 13,
        fontWeight: 500,
        fontFamily: "'Poppins', sans-serif",
        boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
        animation: "slideInRight 0.25s ease",
      }}
    >
      {type === "success" ? (
        <CheckCircle2 size={16} color="#4ade80" />
      ) : (
        <AlertTriangle size={16} color="#f87171" />
      )}
      {message}
      <button
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          color: "#64748b",
          cursor: "pointer",
          marginLeft: 4,
          display: "flex",
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// EXCEL EDITOR MODAL
// ─────────────────────────────────────────────────────────────
function ExcelEditorModal({
  onClose,
  onToast,
}: {
  onClose: () => void;
  onToast: (msg: string, type: "success" | "error") => void;
}) {
  const [data, setData] = useState<ExcelState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [fetchError, setFetchError] = useState("");
  const [activeCell, setActiveCell] = useState<{
    r: number;
    c: number;
  } | null>(null);
  const [editValue, setEditValue] = useState("");
  const activeCellInputRef = useRef<HTMLInputElement>(null);

  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCol, setSearchCol] = useState<string>("pbm_name");
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [dirtyRows, setDirtyRows] = useState<Set<number>>(new Set());

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
  const pageRows = filteredRows.slice(
    page * PAGE_SIZE,
    (page + 1) * PAGE_SIZE,
  );

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

  // ── FIX #1: commitEdit parameter is now globalVisIdx ──────
  // Previously this function received `visIdx` (0-149 local page index)
  // but looked up filteredRows[visIdx]. On page 17, visIdx=5 pointed
  // to row 5 of page 1 instead of row 5 of page 17.
  // Now it correctly receives globalVisIdx (absolute position in
  // filteredRows) and maps back to data.rows properly.
  const commitEdit = useCallback(
    (val: string, globalVisIdx: number, ci: number) => {
      if (!data) return;
      const targetRow = filteredRows[globalVisIdx];
      if (!targetRow) return;
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

  const deleteRow = (globalVisIdx: number) => {
    if (!data) return;
    const targetRow = filteredRows[globalVisIdx];
    if (!targetRow) return;
    const realIdx = data.rows.indexOf(targetRow);
    if (realIdx === -1) return;
    const idColIdx = data.headers.indexOf(ID_COL);
    if (idColIdx !== -1) {
      const rowId = Number(targetRow[idColIdx]);
      if (!isNaN(rowId) && rowId > 0)
        setDeletedIds((prev) => [...prev, rowId]);
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
    setPage(
      Math.max(0, Math.ceil((data.rows.length + 1) / PAGE_SIZE) - 1),
    );
    setSearchQuery("");
  };

  // ── FIX #2: Chunked save — sends 200 rows per request ────
  // Previously sent ALL 2462 rows in one POST (~147KB).
  // Nginx on AWS blocks this with 413 Payload Too Large.
  // Now sends SAVE_CHUNK_SIZE rows per request (~30KB each).
  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    setSaveProgress(0);
    try {
      // Step 1: delete removed rows
      if (deletedIds.length > 0) {
        await Promise.allSettled(
          deletedIds.map((id) =>
            axios.delete(`${API_BASE}/admin/excel/row/${id}`),
          ),
        );
      }

      // Step 2: send rows in chunks
      const allRows = data.rows;
      const totalChunks = Math.ceil(allRows.length / SAVE_CHUNK_SIZE);
      let totalUpdated = 0;
      let totalInserted = 0;

      for (let i = 0; i < totalChunks; i++) {
        const chunk = allRows.slice(
          i * SAVE_CHUNK_SIZE,
          (i + 1) * SAVE_CHUNK_SIZE,
        );

        const res = await axios.post<{
          message: string;
          updated: number;
          inserted: number;
        }>(`${API_BASE}/admin/excel`, {
          sheetName: data.sheetName,
          headers: data.headers,
          rows: chunk,
        });

        totalUpdated += res.data.updated;
        totalInserted += res.data.inserted;
        setSaveProgress(Math.round(((i + 1) / totalChunks) * 100));
      }

      onToast(
        `✓ ${totalUpdated} rows updated, ${totalInserted} rows inserted.`,
        "success",
      );
      setDirtyRows(new Set());
      setDeletedIds([]);
      // Reload to get correct IDs for newly inserted rows
      await fetchSheet();
    } catch (err: any) {
      onToast(
        err?.response?.data?.error || "Save failed. Please try again.",
        "error",
      );
    } finally {
      setSaving(false);
      setSaveProgress(0);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            activeCell ? setActiveCell(null) : onClose();
          }
        }}
        style={{
          width: "min(98vw, 1240px)",
          height: "min(94vh, 820px)",
          background: "#ffffff",
          border: "1.5px solid #000000",
          borderRadius: 16,
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 24px 80px rgba(0,0,0,0.18)",
          overflow: "hidden",
          outline: "none",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        {/* ── Modal Header ── */}
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1.5px solid #000000",
            background: "#f8fafc",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: "#111111",
                border: "1px solid #000000",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Database size={16} color="#ffffff" />
            </div>
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  color: "#111111",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                master_sheet
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  marginTop: 2,
                }}
              >
                {loading ? (
                  <>
                    <Loader2
                      size={10}
                      style={{ animation: "spin 1s linear infinite" }}
                      color="#111111"
                    />{" "}
                    Querying PostgreSQL…
                  </>
                ) : (
                  <>
                    <span style={{ color: "#111111" }}>●</span>{" "}
                    {data?.rows.length ?? 0} rows ·{" "}
                    {data?.headers.length ?? 0} columns
                  </>
                )}
                {fetchError && (
                  <span style={{ color: "#dc2626", marginLeft: 6 }}>
                    {fetchError}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flex: 1,
              minWidth: 260,
              maxWidth: 480,
            }}
          >
            <select
              value={searchCol}
              onChange={(e) => setSearchCol(e.target.value)}
              style={{
                background: "#ffffff",
                border: "1px solid #000000",
                borderRadius: 8,
                color: "#374151",
                fontSize: 11,
                padding: "7px 8px",
                fontFamily: "'Poppins', sans-serif",
                outline: "none",
                cursor: "pointer",
              }}
            >
              {(data?.headers ?? [])
                .filter((h) => h !== ID_COL)
                .map((h) => (
                  <option key={h} value={h}>
                    {COL_CONFIG[h]?.label ?? h}
                  </option>
                ))}
            </select>
            <div style={{ position: "relative", flex: 1 }}>
              <Search
                size={12}
                color="#9ca3af"
                style={{
                  position: "absolute",
                  left: 9,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              />
              <input
                placeholder={`Filter ${COL_CONFIG[searchCol]?.label ?? searchCol}…`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  background: "#ffffff",
                  border: "1px solid #000000",
                  borderRadius: 8,
                  padding: "7px 28px 7px 28px",
                  color: "#111111",
                  fontSize: 12,
                  outline: "none",
                  fontFamily: "'Poppins', sans-serif",
                  boxSizing: "border-box",
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: 7,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#9ca3af",
                    display: "flex",
                  }}
                >
                  <X size={12} />
                </button>
              )}
            </div>
            {searchQuery && (
              <span
                style={{
                  fontSize: 11,
                  color: "#6b7280",
                  fontFamily: "'Poppins', sans-serif",
                  whiteSpace: "nowrap",
                }}
              >
                {filteredRows.length} match
              </span>
            )}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginLeft: "auto",
            }}
          >
            {(dirtyRows.size > 0 || deletedIds.length > 0) && (
              <span
                style={{
                  fontSize: 11,
                  color: "#d97706",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {dirtyRows.size > 0 && `${dirtyRows.size} edited`}
                {dirtyRows.size > 0 && deletedIds.length > 0 && " · "}
                {deletedIds.length > 0 && `${deletedIds.length} deleted`}
              </span>
            )}
            <button
              onClick={fetchSheet}
              style={toolbarBtn}
              title="Reload from DB"
            >
              <RefreshCw size={13} />
            </button>
            <button onClick={addRow} style={toolbarBtn}>
              <PlusSquare size={13} /> Add Row
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                ...toolbarBtn,
                background: saving ? "#1a2a1a" : "#111111",
                border: `1px solid ${saving ? "#166534" : "#16a34a"}`,
                color: saving ? "#4ade80" : "#ffffff",
                padding: "7px 18px",
                position: "relative",
                overflow: "hidden",
                minWidth: 145,
              }}
            >
              {saving ? (
                <>
                  <Loader2
                    size={13}
                    style={{ animation: "spin 1s linear infinite" }}
                  />{" "}
                  Saving {saveProgress}%
                </>
              ) : (
                <>
                  <Save size={13} /> Save to DB
                </>
              )}
              {saving && (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    height: 3,
                    width: `${saveProgress}%`,
                    background: "#4ade80",
                    transition: "width 0.3s ease",
                    borderRadius: "0 0 8px 8px",
                  }}
                />
              )}
            </button>
            <button
              onClick={onClose}
              style={{ ...toolbarBtn, padding: "7px 10px" }}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* ── Grid ── */}
        {loading ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 14,
            }}
          >
            <Loader2
              size={30}
              color="#111111"
              style={{ animation: "spin 1s linear infinite" }}
            />
            <span
              style={{
                fontSize: 13,
                color: "#6b7280",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Fetching master_sheet rows from PostgreSQL…
            </span>
          </div>
        ) : (
          <div style={{ flex: 1, overflow: "auto" }}>
            <table
              style={{
                borderCollapse: "collapse",
                fontSize: 12,
                fontFamily: "'Poppins', sans-serif",
                width: "100%",
              }}
            >
              <thead style={{ position: "sticky", top: 0, zIndex: 20 }}>
                <tr>
                  <th
                    style={{
                      ...thBase,
                      width: 54,
                      textAlign: "center",
                      background: "#e5e7eb",
                      borderRight: "1px solid #000000",
                    }}
                  >
                    #
                  </th>
                  {data?.headers.map((h, ci) => {
                    const cfg = COL_CONFIG[h] ?? { label: h, width: 140 };
                    return (
                      <th
                        key={ci}
                        style={{
                          ...thBase,
                          minWidth: cfg.width,
                          width: cfg.width,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          {cfg.readOnly && (
                            <span
                              style={{
                                fontSize: 8,
                                color: "#ffffff",
                                background: "#374151",
                                border: "1px solid #000000",
                                borderRadius: 3,
                                padding: "1px 5px",
                              }}
                            >
                              PK
                            </span>
                          )}
                          <span
                            style={{
                              color: cfg.readOnly ? "#6b7280" : "#111111",
                            }}
                          >
                            {cfg.label}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: 9,
                            color: "#9ca3af",
                            marginTop: 2,
                            fontWeight: 400,
                          }}
                        >
                          {String.fromCharCode(65 + ci)}
                        </div>
                      </th>
                    );
                  })}
                  <th
                    style={{ ...thBase, width: 44, textAlign: "center" }}
                  >
                    <Trash2 size={11} color="#374151" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {pageRows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={(data?.headers.length ?? 0) + 2}
                      style={{
                        textAlign: "center",
                        padding: "64px 0",
                        color: "#9ca3af",
                        fontSize: 13,
                        fontFamily: "'Poppins', sans-serif",
                      }}
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
                        style={{
                          background:
                            visIdx % 2 === 0 ? "#ffffff" : "#f9fafb",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#f0f4ff")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background =
                            visIdx % 2 === 0 ? "#ffffff" : "#f9fafb")
                        }
                      >
                        <td
                          style={{
                            ...tdBase,
                            textAlign: "center",
                            color: "#6b7280",
                            fontSize: 10,
                            fontWeight: 600,
                            background: isDirty ? "#fef9c3" : "#f1f5f9",
                            borderRight: "1px solid #000000",
                          }}
                        >
                          {isDirty && (
                            <span
                              style={{ color: "#d97706", marginRight: 2 }}
                            >
                              ●
                            </span>
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
                              onClick={() =>
                                !isId &&
                                activateCell(globalVisIdx, ci, cell)
                              }
                              style={{
                                ...tdBase,
                                width: cfg.width,
                                minWidth: cfg.width,
                                outline: isActive
                                  ? "2px solid #111111"
                                  : "none",
                                outlineOffset: -1,
                                background: isActive
                                  ? "#f0f9ff"
                                  : "transparent",
                                cursor: isId ? "default" : "cell",
                              }}
                            >
                              {isActive ? (
                                <input
                                  ref={activeCellInputRef}
                                  autoFocus
                                  value={editValue}
                                  onChange={(e) => {
                                    setEditValue(e.target.value);
                                    // ─── FIX #1: pass globalVisIdx, NOT visIdx ───
                                    commitEdit(
                                      e.target.value,
                                      globalVisIdx,
                                      ci,
                                    );
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      setActiveCell(null);
                                    }
                                    if (e.key === "Escape")
                                      setActiveCell(null);
                                    if (e.key === "Tab") {
                                      e.preventDefault();
                                      const headers = data!.headers;
                                      let nextCi = ci + 1;
                                      while (
                                        nextCi < headers.length &&
                                        COL_CONFIG[headers[nextCi]]
                                          ?.readOnly
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
                                  style={{
                                    width: "100%",
                                    background: "transparent",
                                    border: "none",
                                    outline: "none",
                                    color: "#111111",
                                    fontSize: 12,
                                    fontFamily: "'Poppins', sans-serif",
                                    padding: 0,
                                  }}
                                />
                              ) : isId ? (
                                <span
                                  style={{
                                    color: "#9ca3af",
                                    fontWeight: 600,
                                    fontSize: 11,
                                  }}
                                >
                                  {cell !== null && cell !== "" ? (
                                    cell
                                  ) : (
                                    <span style={{ color: "#d1d5db" }}>
                                      auto
                                    </span>
                                  )}
                                </span>
                              ) : (
                                <span
                                  style={{
                                    color:
                                      cell === null || cell === ""
                                        ? "#9ca3af"
                                        : "#111111",
                                  }}
                                >
                                  {cell === null || cell === ""
                                    ? "null"
                                    : cell}
                                </span>
                              )}
                            </td>
                          );
                        })}

                        <td
                          style={{
                            ...tdBase,
                            textAlign: "center",
                            padding: "8px 6px",
                          }}
                        >
                          <button
                            onClick={() => deleteRow(globalVisIdx)}
                            style={{
                              background: "none",
                              border: "none",
                              color: "#d1d5db",
                              cursor: "pointer",
                              display: "flex",
                              margin: "0 auto",
                              padding: 4,
                              borderRadius: 4,
                              transition: "color 0.1s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.color = "#dc2626")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.color = "#d1d5db")
                            }
                            title="Delete row"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}

                {!searchQuery && (
                  <tr>
                    <td
                      colSpan={(data?.headers.length ?? 0) + 2}
                      style={{
                        padding: 0,
                        borderTop: "1px solid #000000",
                      }}
                    >
                      <button
                        onClick={addRow}
                        style={{
                          width: "100%",
                          padding: "10px",
                          background: "transparent",
                          border: "none",
                          color: "#9ca3af",
                          cursor: "pointer",
                          fontSize: 12,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                          fontFamily: "'Poppins', sans-serif",
                          transition: "all 0.12s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#f9fafb";
                          e.currentTarget.style.color = "#111111";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "#9ca3af";
                        }}
                      >
                        <Plus size={13} /> Insert new row
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Modal Footer ── */}
        <div
          style={{
            padding: "10px 20px",
            borderTop: "1.5px solid #000000",
            background: "#f8fafc",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 11,
              color: "#6b7280",
            }}
          >
            {[
              ["Click", "select"],
              ["Tab", "next col"],
              ["Enter", "confirm"],
              ["Esc", "deselect"],
            ].map(([k, v]) => (
              <span
                key={k}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <kbd style={kbdStyle}>{k}</kbd> {v}
              </span>
            ))}
            <span style={{ color: "#9ca3af", marginLeft: 4 }}>
              ID = read-only PK
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 11,
                color: "#6b7280",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              {searchQuery
                ? `${filteredRows.length} / ${data?.rows.length ?? 0}`
                : `${data?.rows.length ?? 0} rows`}
            </span>
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              style={{
                ...toolbarBtn,
                padding: "5px 8px",
                opacity: page === 0 ? 0.25 : 1,
              }}
            >
              ‹
            </button>
            <span
              style={{
                fontSize: 11,
                color: "#374151",
                fontFamily: "'Poppins', sans-serif",
                minWidth: 72,
                textAlign: "center",
              }}
            >
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() =>
                setPage((p) => Math.min(totalPages - 1, p + 1))
              }
              disabled={page >= totalPages - 1}
              style={{
                ...toolbarBtn,
                padding: "5px 8px",
                opacity: page >= totalPages - 1 ? 0.25 : 1,
              }}
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #f0f0f0",
        borderRadius: 14,
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 11,
          background: accent + "12",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#0f172a",
            lineHeight: 1,
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {value}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "#94a3b8",
            marginTop: 3,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontWeight: 600,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const router = useRouter();
  const [users, setUsers] = useState<PharmacyUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [impersonating, setImpersonating] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PharmacyUser | null>(null);
  const [fetchError, setFetchError] = useState("");
  const [showExcel, setShowExcel] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    fetchUsers();
    const tick = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
      @keyframes spin { to { transform: rotate(360deg); } }
      @keyframes slideInRight { from { opacity:0; transform:translateX(24px); } to { opacity:1; transform:translateX(0); } }
      @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      * { box-sizing: border-box; }
      ::-webkit-scrollbar { width: 5px; height: 5px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 99px; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await axios.get(`${API_BASE}/auth/users`);
      const data = res.data?.users || res.data || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setFetchError("Could not reach the API server.");
      setUsers([
        { id: "1", name: "Apollo Pharmacy", email: "apollo@pharmsys.com", phone: "9876543210", createdAt: "2024-03-01T00:00:00Z" },
        { id: "2", name: "MedPlus Health", email: "medplus@pharmsys.com", phone: "9812345678", createdAt: "2024-05-12T00:00:00Z" },
        { id: "3", name: "Netmeds Store", email: "netmeds@pharmsys.com", phone: "9700011122", createdAt: "2024-07-20T00:00:00Z" },
        { id: "4", name: "Wellness Forever", email: "wellness@pharmsys.com", phone: "9988776655", createdAt: "2024-08-30T00:00:00Z" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPharmacy = async (user: PharmacyUser) => {
    setImpersonating(user.id);
    try {
      const res = await axios.post(`${API_BASE}/auth/impersonate`, { userId: user.id });
      const { accessToken, refreshToken } = res.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userEmail", user.email);
      router.push("/Mainpage");
    } catch {
      setToast({ msg: "Impersonation failed. Please try again.", type: "error" });
    } finally {
      setImpersonating(null);
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.phone?.includes(q);
  });

  const avatarChar = (name: string) => name?.charAt(0)?.toUpperCase() || "P";
  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "N/A";

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fb", fontFamily: "'Poppins', sans-serif", color: "#0f172a" }}>
      {/* ── NAVBAR ── */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "#0c0c0c", borderBottom: "1px solid #1a1a1a", padding: "0 32px", height: 58, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontWeight: 800, fontSize: 13, color: "#0c0c0c", fontFamily: "'Poppins', sans-serif" }}>Rx</span>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#f8fafc", lineHeight: 1.1, fontFamily: "'Poppins', sans-serif" }}>SuperAdmin</div>
            <div style={{ fontSize: 10, color: "#334155", lineHeight: 1.1, fontFamily: "'Poppins', sans-serif" }}>AuditProRx</div>
          </div>
          <div style={{ marginLeft: 4, fontSize: 10, color: "#64748b", background: "rgba(255,255,255,0.05)", border: "1px solid #1e293b", padding: "3px 10px", borderRadius: 20, fontWeight: 700, letterSpacing: "0.1em", fontFamily: "'Poppins', sans-serif" }}>
            SUPER ADMIN
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => setShowExcel(true)} style={{ display: "flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg, #166534 0%, #15803d 100%)", border: "1px solid #16a34a", color: "#dcfce7", padding: "7px 16px", borderRadius: 9, fontSize: 12, cursor: "pointer", fontWeight: 600, boxShadow: "0 2px 12px rgba(22,163,74,0.25)", transition: "all 0.15s", letterSpacing: "0.02em", fontFamily: "'Poppins', sans-serif" }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(22,163,74,0.4)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(22,163,74,0.25)")}>
            <FileSpreadsheet size={14} /> Manage Data Sheet
          </button>
          <div style={{ width: 1, height: 26, background: "#1e293b" }} />
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "#334155", fontFamily: "'Poppins', sans-serif" }}>Signed in as</div>
            <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500, fontFamily: "'Poppins', sans-serif" }}>{ADMIN_EMAIL}</div>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShieldCheck size={15} color="#64748b" />
          </div>
          <button onClick={fetchUsers} style={{ display: "flex", alignItems: "center", gap: 6, background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#64748b", padding: "7px 13px", borderRadius: 9, fontSize: 12, cursor: "pointer", fontWeight: 500, transition: "all 0.15s", fontFamily: "'Poppins', sans-serif" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#334155")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a2a2a")}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </nav>

      {/* ── BODY ── */}
      <div style={{ maxWidth: 1380, margin: "0 auto", padding: "24px 28px" }}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <h1 style={{ fontSize: 21, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.5px", fontFamily: "'Poppins', sans-serif" }}>Pharmacy Users</h1>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0 0", fontFamily: "'Poppins', sans-serif" }}>
                {now ? now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "\u00a0"}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94a3b8", fontFamily: "'Poppins', sans-serif" }}>
              <span style={{ color: "#64748b", fontWeight: 500 }}>Dashboard</span>
              <ChevronRight size={13} />
              <span style={{ color: "#0f172a", fontWeight: 600 }}>Pharmacy Users</span>
            </div>
          </div>

          {fetchError && (
            <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, padding: "10px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#92400e", fontFamily: "'Poppins', sans-serif" }}>
              <AlertTriangle size={14} /> {fetchError} — showing demo data.
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            <StatCard icon={<Users size={18} color="#6366f1" />} label="Total Users" value={users.length} accent="#6366f1" />
            <StatCard icon={<Activity size={18} color="#0ea5e9" />} label="Active Users" value={users.length} accent="#0ea5e9" />
            <StatCard icon={<TrendingUp size={18} color="#10b981" />} label="This Month" value={users.filter((u) => { const d = u.createdAt ? new Date(u.createdAt) : null; return d && d.getMonth() === new Date().getMonth(); }).length} accent="#10b981" />
            <StatCard icon={<Clock size={18} color="#f59e0b" />} label="Pending Review" value={0} accent="#f59e0b" />
          </div>
        </div>

        {/* ── TWO PANELS ── */}
        <div style={{ display: "flex", gap: 14, height: "calc(100vh - 320px)", minHeight: 500 }}>
          {/* LEFT — User List */}
          <div style={{ width: "42%", display: "flex", flexDirection: "column", background: "#ffffff", border: "1px solid #f1f5f9", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
            <div style={{ padding: "16px 18px", borderBottom: "1px solid #f8fafc", background: "#ffffff" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Building2 size={15} color="#0f172a" />
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", fontFamily: "'Poppins', sans-serif" }}>Registered Pharmacies</span>
                </div>
                <span style={{ background: "#0f172a", color: "#f8fafc", fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 20, fontFamily: "'Poppins', sans-serif" }}>{filtered.length}</span>
              </div>
              <div style={{ position: "relative" }}>
                <Search size={13} color="#94a3b8" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input type="text" placeholder="Search name, email, phone…" value={search} onChange={(e) => setSearch(e.target.value)}
                  style={{ width: "100%", padding: "9px 14px 9px 34px", borderRadius: 10, border: "1.5px solid #e2e8f0", fontSize: 13, color: "#0f172a", background: "#f8fafc", outline: "none", transition: "border-color 0.15s", boxSizing: "border-box", fontFamily: "'Poppins', sans-serif" }}
                  onFocus={(e) => (e.target.style.borderColor = "#0f172a")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")} />
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto" }}>
              {loading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 10, color: "#94a3b8" }}>
                  <Loader2 size={22} style={{ animation: "spin 1s linear infinite" }} color="#6366f1" />
                  <span style={{ fontSize: 13, fontFamily: "'Poppins', sans-serif" }}>Loading pharmacies…</span>
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 8, color: "#94a3b8" }}>
                  <Search size={28} color="#e2e8f0" />
                  <span style={{ fontSize: 13, fontFamily: "'Poppins', sans-serif" }}>No pharmacies found</span>
                </div>
              ) : (
                filtered.map((user, i) => {
                  const isSelected = selected?.id === user.id;
                  return (
                    <div key={user.id || i} onClick={() => setSelected(user)}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderBottom: "1px solid #f8fafc", borderLeft: isSelected ? "3px solid #0f172a" : "3px solid transparent", background: isSelected ? "#f8fafc" : "transparent", cursor: "pointer", transition: "all 0.1s" }}
                      onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = "#f8fafc"; }}
                      onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}>
                      <div style={{ width: 40, height: 40, borderRadius: 11, flexShrink: 0, background: isSelected ? "#0f172a" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: isSelected ? "#ffffff" : "#475569", transition: "all 0.1s", border: "1.5px solid " + (isSelected ? "#0f172a" : "#e2e8f0"), fontFamily: "'Poppins', sans-serif" }}>
                        {avatarChar(user.name)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>{user.name}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 3 }}>
                          <Mail size={10} color="#94a3b8" />
                          <span style={{ fontSize: 11, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>{user.email}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                          <Phone size={10} color="#cbd5e1" />
                          <span style={{ fontSize: 11, color: "#cbd5e1", fontFamily: "'Poppins', sans-serif" }}>{user.phone}</span>
                        </div>
                      </div>
                      <ChevronRight size={15} color={isSelected ? "#0f172a" : "#e2e8f0"} />
                    </div>
                  );
                })
              )}
            </div>

            <div style={{ padding: "10px 18px", borderTop: "1px solid #f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "#cbd5e1", fontFamily: "'Poppins', sans-serif" }}>{filtered.length} / {users.length} shown</span>
              <span style={{ fontSize: 11, color: "#e2e8f0", fontFamily: "'Poppins', sans-serif" }}>
                {now ? now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : ""}
              </span>
            </div>
          </div>

          {/* RIGHT — Detail */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "#ffffff", border: "1px solid #f1f5f9", borderRadius: 18, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
            {selected ? (
              <>
                <div style={{ padding: "22px 26px", background: "#0c0c0c", display: "flex", alignItems: "center", gap: 16 }}>
  <div style={{ width: 52, height: 52, borderRadius: 14, background: "#1e293b", border: "2px solid #334155", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 22, color: "#f8fafc", fontFamily: "'Poppins', sans-serif" }}>
    {avatarChar(selected.pharmacyName || selected.name)}
  </div>
  <div style={{ flex: 1 }}>
    {/* ✅ Pharmacy name as main heading */}
    {selected.pharmacyName && (
      <div style={{ fontWeight: 800, fontSize: 17, color: "#f8fafc", letterSpacing: "-0.3px", fontFamily: "'Poppins', sans-serif", marginBottom: 4 }}>
        {selected.pharmacyName}
      </div>
    )}
    {/* ✅ User name — smaller if pharmacy name exists, otherwise main heading */}
    <div style={{ fontWeight: selected.pharmacyName ? 600 : 800, fontSize: selected.pharmacyName ? 13 : 17, color: selected.pharmacyName ? "#94a3b8" : "#f8fafc", letterSpacing: "-0.3px", fontFamily: "'Poppins', sans-serif", display: "flex", alignItems: "center", gap: 6 }}>
      <Users size={11} color={selected.pharmacyName ? "#475569" : "#334155"} /> {selected.name}
    </div>
    <div style={{ fontSize: 12, color: "#475569", marginTop: 3, display: "flex", alignItems: "center", gap: 6, fontFamily: "'Poppins', sans-serif" }}>
      <Mail size={11} color="#334155" /> {selected.email}
    </div>
  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(74,222,128,0.08)", border: "1px solid rgba(74,222,128,0.15)", padding: "5px 12px", borderRadius: 20, fontSize: 11, color: "#4ade80", fontWeight: 600, fontFamily: "'Poppins', sans-serif" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} /> Active
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: "auto", padding: "22px 26px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "'Poppins', sans-serif" }}>User Information</span>
                    <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 22 }}>
                    {[
                      { label: "Pharmacy Name", value: selected.pharmacyName || "—", icon: <Building2 size={13} color="#8b5cf6" /> },
                      { label: "Full Name", value: selected.name, icon: <Users size={13} color="#6366f1" /> },
                      { label: "Phone Number", value: selected.phone, icon: <Phone size={13} color="#0ea5e9" /> },
                      { label: "Email Address", value: selected.email, icon: <Mail size={13} color="#10b981" /> },
                      { label: "Registered On", value: formatDate(selected.createdAt), icon: <Calendar size={13} color="#f59e0b" /> },
                    ].map((item) => (
                      <div key={item.label} style={{ background: "#f8fafc", borderRadius: 12, padding: "13px 15px", border: "1px solid #f1f5f9" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 7 }}>
                          {item.icon}
                          <span style={{ fontSize: 10, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}>{item.label}</span>
                        </div>
                        <div style={{ fontSize: 13, color: "#0f172a", fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontFamily: "'Poppins', sans-serif" }}>{item.value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.12em", fontFamily: "'Poppins', sans-serif" }}>Portal Access</span>
                    <div style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
                  </div>

                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 14, padding: "16px 18px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 10, background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <LogIn size={16} color="#f8fafc" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 13, color: "#0f172a", marginBottom: 5, fontFamily: "'Poppins', sans-serif" }}>Secure Impersonation Session</div>
                        <div style={{ fontSize: 12, color: "#64748b", lineHeight: 1.7, fontFamily: "'Poppins', sans-serif" }}>
                          Generates a signed token for <strong style={{ color: "#0f172a" }}>{selected.name}</strong> and opens their management portal directly — no password required.
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#94a3b8", fontFamily: "'Poppins', sans-serif" }}>
                      <ShieldCheck size={12} color="#94a3b8" />
                      Token valid for 15 min · Stored in localStorage · Audited
                    </div>
                  </div>
                </div>

                <div style={{ padding: "16px 26px", borderTop: "1px solid #f1f5f9", background: "#fafafa" }}>
                  <button onClick={() => handleViewPharmacy(selected)} disabled={!!impersonating}
                    style={{ width: "100%", padding: "14px", borderRadius: 12, border: "none", background: impersonating ? "#e2e8f0" : "#0f172a", color: impersonating ? "#94a3b8" : "#f8fafc", fontSize: 13, fontWeight: 700, cursor: impersonating ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, boxShadow: impersonating ? "none" : "0 4px 20px rgba(15,23,42,0.2)", transition: "all 0.15s", letterSpacing: "0.01em", fontFamily: "'Poppins', sans-serif" }}
                    onMouseEnter={(e) => { if (!impersonating) e.currentTarget.style.background = "#1e293b"; }}
                    onMouseLeave={(e) => { if (!impersonating) e.currentTarget.style.background = "#0f172a"; }}>
                    {impersonating === selected.id ? <><Loader2 size={15} style={{ animation: "spin 1s linear infinite" }} /> Opening portal…</> : <><LogIn size={15} /> Open as {selected.name}</>}
                  </button>
                  <p style={{ textAlign: "center", fontSize: 11, color: "#94a3b8", margin: "8px 0 0", fontFamily: "'Poppins', sans-serif" }}>Redirects directly to /Mainpage with a fresh session</p>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 40, gap: 14 }}>
                <div style={{ width: 64, height: 64, borderRadius: 18, background: "#f8fafc", border: "2px dashed #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Building2 size={26} color="#cbd5e1" />
                </div>
                <div style={{ fontWeight: 800, fontSize: 16, color: "#0f172a", fontFamily: "'Poppins', sans-serif" }}>Select a Pharmacy</div>
                <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.8, maxWidth: 240, fontFamily: "'Poppins', sans-serif" }}>
                  Click any pharmacy from the list to view their profile and manage portal access
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showExcel && (
        <ExcelEditorModal
          onClose={() => setShowExcel(false)}
          onToast={(msg, type) => setToast({ msg, type })}
        />
      )}

      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}