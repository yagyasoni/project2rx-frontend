"use client";

import { Fragment, useMemo, useRef, type KeyboardEvent } from "react";
import {
  Check,
  ChevronDown,
  ClipboardList,
  Moon,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  EVENING_SLOTS,
  MONTHS,
  MORNING_SLOTS,
  PERIODS,
  rangeFor,
  sanitizeInitials,
  tempKeys,
  tempStatus,
  type Calibration,
  type FridgeCount,
  type LogRow,
  type LogSetup,
  type Period,
  type PeriodEntry,
  type TempKey,
} from "./temperatureLog";

/* ────────────────────────────────────────────────────────────────────────── */
/*  TYPES & CONSTANTS                                                         */
/* ────────────────────────────────────────────────────────────────────────── */

type Props = {
  setup: LogSetup;
  rows: LogRow[];
  onRowsChange: (rows: LogRow[]) => void;
  onFridgesChange: (fridges: FridgeCount) => void;
  calibration: Calibration;
  onCalibrationChange: (next: Calibration) => void;
  onRandomGenerate: () => void;
  onReset: () => void;
  onSave: () => void;
  saved: boolean; // true from a Save click until the sheet changes again
};

type Field = keyof PeriodEntry;
type CellKey = `${Period}.${Field}`;

type CellHandlers = {
  onChange: (rowIndex: number, period: Period, field: Field, value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLElement>, rowIndex: number, cell: CellKey) => void;
};

const TEMP_LABELS: Record<TempKey, string> = {
  ambient: "Ambient",
  fridge1: "Fridge 1",
  fridge2: "Fridge 2",
};

// Up to three digits and one decimal place, optional minus sign.
const TEMP_PATTERN = /^-?\d{0,3}(\.\d?)?$/;

const CALIBRATION_FIELDS: {
  key: keyof Calibration;
  label: string;
  placeholder: string;
}[] = [
  { key: "thermometerSn", label: "Thermometer SN", placeholder: "Serial number" },
  { key: "performedBy", label: "Calibration performed by", placeholder: "Name or vendor" },
  { key: "calibrationDate", label: "Calibration date", placeholder: "YYYY-MM-DD" },
  { key: "nextDue", label: "Next calibration due", placeholder: "YYYY-MM-DD" },
  { key: "certificateNumber", label: "Certificate number", placeholder: "Certificate #" },
  { key: "picName", label: "Pharmacist-in-Charge (PIC)", placeholder: "Full name" },
  { key: "picDate", label: "Sign-off date", placeholder: "YYYY-MM-DD" },
];

// Explicit widths so the table never squeezes the time or reading cells.
const COL = {
  date: "w-[132px] min-w-[132px]",
  time: "w-[116px] min-w-[116px]",
  temp: "w-[116px] min-w-[116px]",
  initials: "w-[88px] min-w-[88px]",
  comment: "min-w-[300px]",
} as const;

const tdClass = "border-b border-slate-100 px-1 py-1 align-middle";
const thClass =
  "border-b border-slate-200 bg-slate-50 px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap align-bottom";
const thHint =
  "block text-[10px] font-semibold normal-case tracking-normal text-slate-400 tabular-nums";
const cellInput =
  "h-9 w-full min-w-0 rounded-md bg-transparent px-2 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-300 hover:bg-slate-100/70 focus:bg-white focus:ring-2 focus:ring-slate-900/15";
const fridgeToggle =
  "inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-500 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20";

/* ────────────────────────────────────────────────────────────────────────── */
/*  CELLS — module level so React keeps focus while the user types            */
/* ────────────────────────────────────────────────────────────────────────── */

function TempCell({
  rowIndex,
  period,
  field,
  value,
  handlers,
}: {
  rowIndex: number;
  period: Period;
  field: TempKey;
  value: string;
  handlers: CellHandlers;
}) {
  const status = tempStatus(field, value);
  const cell: CellKey = `${period}.${field}`;
  const tone =
    status === "out"
      ? "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200 focus:bg-rose-50 focus:ring-rose-300"
      : "";

  return (
    <td className={`${tdClass} ${COL.temp}`}>
      <div className="relative">
        <input
          type="text"
          inputMode="decimal"
          autoComplete="off"
          data-row={rowIndex}
          data-cell={cell}
          value={value}
          placeholder="—"
          title={status === "out" ? "Outside the expected range" : undefined}
          onChange={(e) => {
            if (TEMP_PATTERN.test(e.target.value)) {
              handlers.onChange(rowIndex, period, field, e.target.value);
            }
          }}
          onKeyDown={(e) => handlers.onKeyDown(e, rowIndex, cell)}
          className={`${cellInput} pr-7 text-right tabular-nums ${tone}`}
        />
        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[11px] text-slate-400">
          °F
        </span>
      </div>
    </td>
  );
}

function PeriodCells({
  row,
  rowIndex,
  period,
  fields,
  handlers,
}: {
  row: LogRow;
  rowIndex: number;
  period: Period;
  fields: TempKey[];
  handlers: CellHandlers;
}) {
  const entry = row[period];
  const slots = period === "am" ? MORNING_SLOTS : EVENING_SLOTS;
  const timeCell: CellKey = `${period}.time`;
  const initialsCell: CellKey = `${period}.initials`;
  const commentCell: CellKey = `${period}.comment`;

  return (
    <>
      <td className={`${tdClass} ${COL.time} border-l border-l-slate-200`}>
        <div className="relative">
          <select
            data-row={rowIndex}
            data-cell={timeCell}
            value={entry.time}
            onChange={(e) =>
              handlers.onChange(rowIndex, period, "time", e.target.value)
            }
            onKeyDown={(e) => handlers.onKeyDown(e, rowIndex, timeCell)}
            className={`${cellInput} cursor-pointer appearance-none pr-7 font-medium tabular-nums`}
          >
            {slots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        </div>
      </td>

      {fields.map((key) => (
        <TempCell
          key={key}
          rowIndex={rowIndex}
          period={period}
          field={key}
          value={entry[key]}
          handlers={handlers}
        />
      ))}

      <td className={`${tdClass} ${COL.initials}`}>
        <input
          type="text"
          autoComplete="off"
          spellCheck={false}
          maxLength={4}
          data-row={rowIndex}
          data-cell={initialsCell}
          value={entry.initials}
          placeholder="—"
          onChange={(e) =>
            handlers.onChange(
              rowIndex,
              period,
              "initials",
              sanitizeInitials(e.target.value),
            )
          }
          onKeyDown={(e) => handlers.onKeyDown(e, rowIndex, initialsCell)}
          className={`${cellInput} text-center font-semibold uppercase tracking-widest`}
        />
      </td>

      <td className={`${tdClass} ${COL.comment}`}>
        <input
          type="text"
          autoComplete="off"
          data-row={rowIndex}
          data-cell={commentCell}
          value={entry.comment}
          placeholder="Comments / excursion action"
          onChange={(e) =>
            handlers.onChange(rowIndex, period, "comment", e.target.value)
          }
          onKeyDown={(e) => handlers.onKeyDown(e, rowIndex, commentCell)}
          className={cellInput}
        />
      </td>
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  GRID                                                                      */
/* ────────────────────────────────────────────────────────────────────────── */

export default function LogGrid({
  setup,
  rows,
  onRowsChange,
  onFridgesChange,
  calibration,
  onCalibrationChange,
  onRandomGenerate,
  onReset,
  onSave,
  saved,
}: Props) {
  const tableRef = useRef<HTMLDivElement>(null);

  // Reading columns currently on the sheet: ambient plus one or two fridges.
  const fields = useMemo(() => tempKeys(setup.fridges), [setup.fridges]);
  const periodSpan = fields.length + 3; // time + readings + initials + comment

  const stats = useMemo(() => {
    let filled = 0;
    let out = 0;
    for (const row of rows) {
      for (const period of PERIODS) {
        for (const key of fields) {
          const status = tempStatus(key, row[period][key]);
          if (status !== "empty") filled++;
          if (status === "out") out++;
        }
      }
    }
    return { filled, out, total: rows.length * PERIODS.length * fields.length };
  }, [rows, fields]);

  const handlers = useMemo<CellHandlers>(
    () => ({
      onChange: (rowIndex, period, field, value) =>
        onRowsChange(
          rows.map((r, i) =>
            i === rowIndex
              ? { ...r, [period]: { ...r[period], [field]: value } }
              : r,
          ),
        ),
      // Enter moves to the same cell on the next row; Shift+Enter moves up.
      onKeyDown: (e, rowIndex, cell) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        const target = rowIndex + (e.shiftKey ? -1 : 1);
        const next = tableRef.current?.querySelector<HTMLElement>(
          `[data-row="${target}"][data-cell="${cell}"]`,
        );
        next?.focus();
        if (next instanceof HTMLInputElement) next.select();
      },
    }),
    [rows, onRowsChange],
  );

  const updateCalibration = (key: keyof Calibration, value: string) =>
    onCalibrationChange({ ...calibration, [key]: value });

  const title = `${MONTHS[setup.month]} ${setup.year}`;

  // "+" on Fridge 1 adds Fridge 2; "×" on Fridge 2 removes it. The setting is
  // sheet-wide, so the same control appears in both period groups.
  const fridgeControl = (key: TempKey) => {
    if (key === "fridge1" && setup.fridges === 1) {
      return (
        <button
          type="button"
          onClick={() => onFridgesChange(2)}
          title="Add Fridge 2"
          aria-label="Add Fridge 2"
          className={`${fridgeToggle} hover:border-slate-900 hover:bg-slate-900 hover:text-white`}
        >
          <Plus className="h-3 w-3" />
        </button>
      );
    }
    if (key === "fridge2") {
      return (
        <button
          type="button"
          onClick={() => onFridgesChange(1)}
          title="Remove Fridge 2"
          aria-label="Remove Fridge 2"
          className={`${fridgeToggle} hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600`}
        >
          <X className="h-3 w-3" />
        </button>
      );
    }
    return null;
  };

  return (
    <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* ── Toolbar ── */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center gap-3">
        <div className="mr-auto flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900">
            <ClipboardList className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900 truncate">{title}</h2>
            <p className="text-xs text-slate-500 tabular-nums">
              {rows.length} days · {setup.fridges === 2 ? "2 fridges" : "1 fridge"} ·{" "}
              {stats.filled}/{stats.total} readings
              {stats.out > 0 && (
                <span className="font-semibold text-rose-600">
                  {" "}· {stats.out} out of range
                </span>
              )}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onRandomGenerate}
          title="Fill every reading with a sample value inside the expected range"
        >
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          Random Generate
        </Button>

        <Button variant="ghost" size="sm" onClick={onReset}>
          <RotateCcw className="h-3.5 w-3.5" />
          Reset
        </Button>

        <Button
          size="sm"
          onClick={onSave}
          className={
            saved
              ? "bg-emerald-600 text-white hover:bg-emerald-600"
              : "bg-slate-900 text-white hover:bg-slate-800"
          }
        >
          {saved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
          {saved ? "Saved" : "Save log"}
        </Button>
      </div>

      {/* ── Table ── */}
      <div
        ref={tableRef}
        className="overflow-auto max-h-[calc(100vh-340px)] min-h-[320px]"
      >
        <table className="w-max min-w-full border-separate border-spacing-0 text-[13px]">
          <thead className="sticky top-0 z-20">
            <tr>
              <th
                className={`sticky left-0 z-30 border-b border-r border-slate-200 bg-white ${COL.date}`}
              />
              <th
                colSpan={periodSpan}
                className="border-b border-l border-slate-200 bg-amber-50 py-1.5 text-[11px] font-bold uppercase tracking-widest text-amber-800"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Sun className="h-3.5 w-3.5" />
                  Morning · 00:00 – 11:59
                </span>
              </th>
              <th
                colSpan={periodSpan}
                className="border-b border-l border-slate-200 bg-indigo-50 py-1.5 text-[11px] font-bold uppercase tracking-widest text-indigo-800"
              >
                <span className="inline-flex items-center gap-1.5">
                  <Moon className="h-3.5 w-3.5" />
                  Evening · 12:00 – 23:59
                </span>
              </th>
            </tr>
            <tr>
              <th className={`${thClass} ${COL.date} sticky left-0 z-30 border-r`}>
                Date
              </th>
              {PERIODS.map((p) => (
                <Fragment key={p}>
                  <th className={`${thClass} ${COL.time} border-l`}>
                    Time
                    <span className={thHint}>24-hour</span>
                  </th>
                  {fields.map((key) => {
                    const range = rangeFor(key);
                    return (
                      <th key={key} className={`${thClass} ${COL.temp} text-right`}>
                        <span className="inline-flex items-center justify-end gap-1.5">
                          {TEMP_LABELS[key]}
                          {fridgeControl(key)}
                        </span>
                        <span className={thHint}>
                          {range.min}–{range.max} °F
                        </span>
                      </th>
                    );
                  })}
                  <th className={`${thClass} ${COL.initials} text-center`}>
                    Initials
                  </th>
                  <th className={`${thClass} ${COL.comment}`}>
                    Comments / Excursion action
                  </th>
                </Fragment>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => {
              const weekend = row.weekday === "Sat" || row.weekday === "Sun";
              return (
                <tr key={row.date} className="group hover:bg-slate-50/70">
                  <td
                    className={`sticky left-0 z-10 border-b border-r border-slate-200 bg-white px-3 py-1.5 group-hover:bg-slate-50 ${COL.date}`}
                  >
                    <div className="font-semibold text-slate-900 tabular-nums leading-tight">
                      {row.date}
                    </div>
                    <div
                      className={`text-[11px] leading-tight ${
                        weekend ? "font-semibold text-amber-600" : "text-slate-400"
                      }`}
                    >
                      {row.weekday}
                    </div>
                  </td>
                  {PERIODS.map((p) => (
                    <PeriodCells
                      key={p}
                      row={row}
                      rowIndex={i}
                      period={p}
                      fields={fields}
                      handlers={handlers}
                    />
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Calibration & sign-off ── */}
      <div className="border-t border-slate-200 bg-slate-50/40 px-5 py-5">
        <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Calibration &amp; sign-off
          </h3>
          <span className="text-[11px] text-slate-400">
            Optional · printed in the export footer.
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {CALIBRATION_FIELDS.map((f) => (
            <div key={f.key} className="space-y-1.5">
              <Label
                htmlFor={`tl-cal-${f.key}`}
                className="text-xs font-semibold text-slate-700"
              >
                {f.label}
              </Label>
              <Input
                id={`tl-cal-${f.key}`}
                value={calibration[f.key]}
                onChange={(e) => updateCalibration(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="h-9 bg-white"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
