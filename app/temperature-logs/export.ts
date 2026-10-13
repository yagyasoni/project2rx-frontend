import {
  AMBIENT_RANGE,
  FRIDGE_RANGE,
  MONTHS,
  PDF_DISCLAIMER,
  RETENTION_NOTE,
  fileName,
  formatTemp,
  sheetTitle,
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
/*  COLUMN LAYOUT — shared by CSV, Excel and PDF                              */
/* ────────────────────────────────────────────────────────────────────────── */

export type SheetLayout = {
  fridges: FridgeCount;
  perPeriod: number; // time, ambient, fridge(s), initials, comment
  total: number; // date + two periods
  amComment: number; // zero-based column indexes
  pmComment: number;
  temps: Record<number, { period: Period; key: TempKey }>;
};

export const sheetLayout = (fridges: FridgeCount): SheetLayout => {
  const keys = tempKeys(fridges);
  const perPeriod = 3 + keys.length;
  const total = 1 + perPeriod * 2;
  const temps: SheetLayout["temps"] = {};
  keys.forEach((key, i) => {
    temps[2 + i] = { period: "am", key };
    temps[2 + perPeriod + i] = { period: "pm", key };
  });
  return {
    fridges,
    perPeriod,
    total,
    amComment: perPeriod,
    pmComment: total - 1,
    temps,
  };
};

const fridgeHeaders = (fridges: FridgeCount, make: (n: number) => string) =>
  Array.from({ length: fridges }, (_, i) => make(i + 1));

// Same wording as the paper template, so CSV and Excel match it exactly.
export const csvHeaders = (fridges: FridgeCount): string[] => [
  "Date",
  "Time (Morning)",
  "Ambient Temp (°C/°F)",
  ...fridgeHeaders(fridges, (n) => `Fridge ${n} Temp (°C/°F)`),
  "Staff Initials",
  "Comments / Excursion Action",
  "Time (Evening)",
  "Ambient Temp (°C/°F) (PM)",
  ...fridgeHeaders(fridges, (n) => `Fridge ${n} Temp (°C/°F) (PM)`),
  "Staff Initials (PM)",
  "Comments / Excursion Action (PM)",
];

// Short labels for print; the Morning / Evening band already names the period.
const pdfHeaders = (fridges: FridgeCount): string[] => {
  const period = [
    "Time",
    "Ambient °F",
    ...fridgeHeaders(fridges, (n) => `Fridge ${n} °F`),
    "Initials",
    "Comments / Excursion Action",
  ];
  return ["Date", ...period, ...period];
};

const BLANK_LINE = "__________________________";

// The paper template writes 9:30 rather than 09:30.
const exportTime = (time: string) => time.replace(/^0/, "");

// A filled-in value gets a space after the label; a blank one keeps the
// template's underscore line to fill by hand.
const labelled = (label: string, value: string) =>
  value.trim() ? `${label} ${value.trim()}` : `${label}${BLANK_LINE}`;

const periodCells = (e: PeriodEntry, fridges: FridgeCount): string[] => [
  exportTime(e.time),
  formatTemp(e.ambient),
  formatTemp(e.fridge1),
  ...(fridges === 2 ? [formatTemp(e.fridge2)] : []),
  e.initials,
  e.comment,
];

export const rowToCells = (r: LogRow, fridges: FridgeCount): string[] => [
  r.date,
  ...periodCells(r.am, fridges),
  ...periodCells(r.pm, fridges),
];

// Mirrors the template footer: calibration block on the left, PIC sign-off on the right.
export const footerRows = (c: Calibration, layout: SheetLayout): string[][] => {
  const row = (first: string, middle: string, last: string) => {
    const cells = Array<string>(layout.total).fill("");
    cells[0] = first;
    cells[layout.amComment] = middle;
    cells[layout.pmComment] = last;
    return cells;
  };
  return [
    row(
      labelled("Thermometer SN:", c.thermometerSn),
      labelled("Next Calibration Due:", c.nextDue),
      "Pharmacist-in-Charge (PIC)",
    ),
    row(
      labelled("Calibration Performed By:", c.performedBy),
      labelled("Certificate Number:", c.certificateNumber),
      "Signature: ______________________",
    ),
    row(
      labelled("Calibration Date:", c.calibrationDate),
      "",
      labelled("Full Name:", c.picName),
    ),
    row("", "", labelled("Date:", c.picDate)),
  ];
};

/* ────────────────────────────────────────────────────────────────────────── */
/*  CSV                                                                       */
/* ────────────────────────────────────────────────────────────────────────── */

const csvEscape = (value: string) =>
  /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

export const buildCsv = (
  rows: LogRow[],
  calibration: Calibration,
  fridges: FridgeCount,
) => {
  const layout = sheetLayout(fridges);
  return [
    csvHeaders(fridges),
    ...rows.map((r) => rowToCells(r, fridges)),
    Array<string>(layout.total).fill(""),
    ...footerRows(calibration, layout),
  ]
    .map((cells) => cells.map(csvEscape).join(","))
    .join("\n");
};

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const downloadCsv = (
  setup: LogSetup,
  rows: LogRow[],
  calibration: Calibration,
) => {
  // The BOM keeps the degree sign intact when Excel opens the file.
  const blob = new Blob(["﻿" + buildCsv(rows, calibration, setup.fridges)], {
    type: "text/csv;charset=utf-8;",
  });
  triggerDownload(blob, `${fileName(setup)}.csv`);
};

/* ────────────────────────────────────────────────────────────────────────── */
/*  EXCEL                                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

type ExcelModule = typeof import("exceljs");

// exceljs is a CommonJS/UMD package: bundlers expose its classes as named
// exports, Node exposes them under `default`. Accept both shapes.
const loadExcelJS = async (): Promise<ExcelModule> => {
  const mod = (await import("exceljs")) as ExcelModule & { default?: ExcelModule };
  return mod.default?.Workbook ? mod.default : mod;
};

const excelWidths = (fridges: FridgeCount): number[] => {
  const period = [10, 12, ...Array<number>(fridges).fill(12), 9, 40];
  return [12, ...period, ...period];
};

export const buildWorkbook = async (
  setup: LogSetup,
  rows: LogRow[],
  calibration: Calibration,
) => {
  // Loaded on demand so the page bundle stays small until someone exports.
  const { Workbook } = await loadExcelJS();
  const { fridges } = setup;
  const layout = sheetLayout(fridges);
  const commentCols = new Set([layout.amComment + 1, layout.pmComment + 1]); // 1-based

  const wb = new Workbook();
  wb.creator = "AuditProRx";

  const ws = wb.addWorksheet(`${MONTHS[setup.month]} ${setup.year}`, {
    views: [{ state: "frozen", xSplit: 1, ySplit: 3 }],
    pageSetup: {
      paperSize: 9, // A4
      orientation: "landscape",
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    },
  });
  ws.columns = excelWidths(fridges).map((width) => ({ width }));

  const thin = { style: "thin" as const, color: { argb: "FFD1D5DB" } };
  const border = { top: thin, left: thin, bottom: thin, right: thin };
  const fill = (argb: string) => ({
    type: "pattern" as const,
    pattern: "solid" as const,
    fgColor: { argb },
  });

  // Row 1 — title
  ws.mergeCells(1, 1, 1, layout.total);
  const title = ws.getCell(1, 1);
  title.value = sheetTitle(setup);
  title.font = { bold: true, size: 14, color: { argb: "FF0F172A" } };
  title.alignment = { vertical: "middle" };
  ws.getRow(1).height = 28;

  // Row 2 — morning / evening group headers
  const eveningStart = 2 + layout.perPeriod;
  ws.mergeCells(2, 2, 2, 1 + layout.perPeriod);
  ws.mergeCells(2, eveningStart, 2, layout.total);
  ws.getCell(2, 2).value = "Morning (00:00–11:59)";
  ws.getCell(2, eveningStart).value = "Evening (12:00–23:59)";
  for (const col of [2, eveningStart]) {
    const cell = ws.getCell(2, col);
    cell.font = { bold: true, size: 10, color: { argb: "FF334155" } };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.fill = fill("FFF1F5F9");
    cell.border = border;
  }

  // Row 3 — column headers
  const header = ws.getRow(3);
  header.values = csvHeaders(fridges);
  header.height = 44;
  header.eachCell((cell) => {
    cell.font = { bold: true, size: 9, color: { argb: "FF0F172A" } };
    cell.alignment = {
      horizontal: "center",
      vertical: "middle",
      wrapText: true,
    };
    cell.fill = fill("FFE2E8F0");
    cell.border = border;
  });

  // Data rows
  rows.forEach((r, i) => {
    const row = ws.addRow(rowToCells(r, fridges));
    row.height = 18;
    row.eachCell({ includeEmpty: true }, (cell, col) => {
      cell.font = { size: 10 };
      cell.border = border;
      cell.alignment = {
        horizontal: commentCols.has(col) ? "left" : "center",
        vertical: "middle",
      };
      if (i % 2 === 1) cell.fill = fill("FFF8FAFC");
    });
  });

  // Footer block
  ws.addRow([]);
  for (const cells of footerRows(calibration, layout)) {
    const row = ws.addRow(cells);
    row.font = { size: 10, bold: true };
  }
  ws.addRow([]);
  for (const text of [RETENTION_NOTE, PDF_DISCLAIMER]) {
    const row = ws.addRow([text]);
    ws.mergeCells(row.number, 1, row.number, layout.total);
    row.getCell(1).alignment = { horizontal: "center", wrapText: true };
    row.getCell(1).font = { italic: true, size: 9, color: { argb: "FF64748B" } };
  }

  return wb;
};

export const downloadExcel = async (
  setup: LogSetup,
  rows: LogRow[],
  calibration: Calibration,
) => {
  const wb = await buildWorkbook(setup, rows, calibration);
  const buffer = await wb.xlsx.writeBuffer();
  triggerDownload(
    new Blob([new Uint8Array(buffer)], { type: XLSX_MIME }),
    `${fileName(setup)}.xlsx`,
  );
};

/* ────────────────────────────────────────────────────────────────────────── */
/*  PDF — A4 landscape, laid out like the paper template                      */
/* ────────────────────────────────────────────────────────────────────────── */

type Rgb = [number, number, number];
const INK: Rgb = [15, 23, 42]; // slate-900
const MUTED: Rgb = [100, 116, 139]; // slate-500
const RULE: Rgb = [203, 213, 225]; // slate-300
const RULE_SOFT: Rgb = [226, 232, 240]; // slate-200
const HEAD_FILL: Rgb = [226, 232, 240]; // slate-200
const GROUP_FILL: Rgb = [241, 245, 249]; // slate-100
const ZEBRA_FILL: Rgb = [248, 250, 252]; // slate-50
const ALERT: Rgb = [190, 18, 60]; // rose-700

// Fixed widths in points; the two comment columns share whatever is left.
const pdfBaseWidths = (fridges: FridgeCount): number[] => {
  const period = [38, 40, ...Array<number>(fridges).fill(40), 34, 0];
  return [56, ...period, ...period];
};

export const buildPdf = async (
  setup: LogSetup,
  rows: LogRow[],
  calibration: Calibration,
) => {
  const { jsPDF } = await import("jspdf");
  const { fridges } = setup;
  const layout = sheetLayout(fridges);
  const headers = pdfHeaders(fridges);
  const commentCols = [layout.amComment, layout.pmComment];

  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 24;
  const tableW = pageW - margin * 2;

  // Footnotes repeat on every page: the disclaimer above the retention note.
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  const disclaimerLines = doc.splitTextToSize(PDF_DISCLAIMER, tableW) as string[];
  const footnoteH = 22 + disclaimerLines.length * 8;
  const bottomLimit = pageH - margin - footnoteH;

  const base = pdfBaseWidths(fridges);
  const fixedW = base.reduce((a, b) => a + b, 0);
  const commentW = (tableW - fixedW) / 2;
  const widths = base.map((w) => (w === 0 ? commentW : w));
  const xs = widths.map((_, i) =>
    widths.slice(0, i).reduce((a, b) => a + b, margin),
  );
  const spanWidth = (from: number, to: number) =>
    widths.slice(from, to + 1).reduce((a, b) => a + b, 0);

  const setFill = ([r, g, b]: Rgb) => doc.setFillColor(r, g, b);
  const setStroke = ([r, g, b]: Rgb) => doc.setDrawColor(r, g, b);
  const setInk = ([r, g, b]: Rgb) => doc.setTextColor(r, g, b);

  let y = margin;

  const drawTitle = () => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    setInk(INK);
    doc.text(`${setup.location.trim() || "Pharmacy"} Temperature logs`, margin, y + 10);
    doc.text(
      `${MONTHS[setup.month].toUpperCase()} ${setup.year}`,
      pageW - margin,
      y + 10,
      { align: "right" },
    );
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    setInk(MUTED);
    doc.text(
      `Expected range: Ambient ${AMBIENT_RANGE.min}–${AMBIENT_RANGE.max} °F  ·  Fridge ${FRIDGE_RANGE.min}–${FRIDGE_RANGE.max} °F.  Readings outside the range are printed in red.`,
      margin,
      y + 22,
    );
    y += 32;
  };

  const drawHeader = () => {
    // Group band
    const groupH = 14;
    const amFrom = 1;
    const amTo = layout.perPeriod;
    const pmFrom = layout.perPeriod + 1;
    const pmTo = layout.total - 1;
    setFill(GROUP_FILL);
    setStroke(RULE);
    doc.setLineWidth(0.5);
    doc.rect(xs[amFrom], y, spanWidth(amFrom, amTo), groupH, "FD");
    doc.rect(xs[pmFrom], y, spanWidth(pmFrom, pmTo), groupH, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    setInk(INK);
    doc.text("Morning (00:00 – 11:59)", xs[amFrom] + spanWidth(amFrom, amTo) / 2, y + 9.5, {
      align: "center",
    });
    doc.text("Evening (12:00 – 23:59)", xs[pmFrom] + spanWidth(pmFrom, pmTo) / 2, y + 9.5, {
      align: "center",
    });
    y += groupH;

    // Column headers, wrapped to fit each column
    doc.setFontSize(6.5);
    const lineH = 7.5;
    const wrapped = headers.map(
      (label, i) => doc.splitTextToSize(label, widths[i] - 4) as string[],
    );
    const headH = Math.max(...wrapped.map((l) => l.length)) * lineH + 8;
    setFill(HEAD_FILL);
    doc.rect(margin, y, tableW, headH, "F");
    wrapped.forEach((lines, i) => {
      doc.rect(xs[i], y, widths[i], headH, "S");
      const startY = y + headH / 2 - ((lines.length - 1) * lineH) / 2 + 2.3;
      lines.forEach((line, k) =>
        doc.text(line, xs[i] + widths[i] / 2, startY + k * lineH, { align: "center" }),
      );
    });
    y += headH;
  };

  const startPage = () => {
    y = margin;
    drawTitle();
    drawHeader();
  };

  startPage();

  // Data rows — comments may wrap, so each row sizes itself.
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  const bodyLineH = 7.5;
  rows.forEach((r, idx) => {
    const cells = rowToCells(r, fridges);
    const commentLines = commentCols.map((i) =>
      (doc.splitTextToSize(cells[i], widths[i] - 6) as string[]).slice(0, 3),
    );
    const lineCount = Math.max(1, ...commentLines.map((l) => l.length));
    const rowH = lineCount * bodyLineH + 3.5;

    if (y + rowH > bottomLimit) {
      doc.addPage();
      startPage();
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
    }

    if (idx % 2 === 1) {
      setFill(ZEBRA_FILL);
      doc.rect(margin, y, tableW, rowH, "F");
    }
    setStroke(RULE_SOFT);
    doc.line(margin, y + rowH, margin + tableW, y + rowH);
    setInk(INK);

    cells.forEach((value, i) => {
      const commentIdx = commentCols.indexOf(i);
      if (commentIdx !== -1) {
        commentLines[commentIdx].forEach((line, k) =>
          doc.text(line, xs[i] + 3, y + 8 + k * bodyLineH),
        );
        return;
      }
      const temp = layout.temps[i];
      const outOfRange =
        temp !== undefined &&
        tempStatus(temp.key, r[temp.period][temp.key]) === "out";
      if (outOfRange) {
        doc.setFont("helvetica", "bold");
        setInk(ALERT);
      }
      doc.text(value, xs[i] + widths[i] / 2, y + 8, { align: "center" });
      if (outOfRange) {
        doc.setFont("helvetica", "normal");
        setInk(INK);
      }
    });
    y += rowH;
  });

  /* ── Calibration & sign-off: three equal columns, equal row pitch ── */
  const gutter = 28;
  const colW = (tableW - gutter * 2) / 3;
  const colX = [margin, margin + colW + gutter, margin + (colW + gutter) * 2];
  const blockTop = 16;
  // Rows share the space left on the page evenly, within handwriting-friendly
  // bounds; if even the tightest pitch will not fit, the block moves to a new page.
  const minPitch = 14;
  const maxPitch = 24;
  const fitPitch = (top: number) =>
    Math.floor((bottomLimit - top - blockTop - 6) / 4);
  let pitch = Math.min(maxPitch, fitPitch(y));
  if (pitch < minPitch) {
    doc.addPage();
    y = margin;
    drawTitle();
    pitch = Math.min(maxPitch, fitPitch(y));
  }
  const baseY = y + blockTop + 6;

  // Bold label, then a ruled line to the column edge. A saved value sits on the line.
  const field = (col: number, rowIdx: number, label: string, value: string) => {
    const x = colX[col];
    const yy = baseY + rowIdx * pitch;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    setInk(INK);
    doc.text(label, x, yy);
    const lineStart = x + doc.getTextWidth(label) + 4;
    const lineEnd = x + colW;
    const trimmed = value.trim();
    if (trimmed) {
      doc.setFont("helvetica", "normal");
      const [firstLine] = doc.splitTextToSize(trimmed, lineEnd - lineStart - 4) as string[];
      doc.text(firstLine, lineStart + 2, yy);
    }
    setStroke(RULE);
    doc.setLineWidth(0.5);
    doc.line(lineStart, yy + 2.5, lineEnd, yy + 2.5);
  };

  field(0, 0, "Thermometer SN:", calibration.thermometerSn);
  field(0, 1, "Calibration Performed By:", calibration.performedBy);
  field(0, 2, "Calibration Date:", calibration.calibrationDate);

  field(1, 0, "Next Calibration Due:", calibration.nextDue);
  field(1, 1, "Certificate Number:", calibration.certificateNumber);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  setInk(INK);
  doc.text("Pharmacist-in-Charge (PIC)", colX[2], baseY);
  field(2, 1, "Signature:", "");
  field(2, 2, "Full Name:", calibration.picName);
  field(2, 3, "Date:", calibration.picDate);

  /* ── Footnotes and page numbers on every page ── */
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    setInk(MUTED);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    disclaimerLines.forEach((line, k) =>
      doc.text(line, pageW / 2, pageH - 22 - (disclaimerLines.length - 1 - k) * 8, {
        align: "center",
      }),
    );
    doc.setFontSize(7.5);
    doc.text(RETENTION_NOTE, pageW / 2, pageH - 10, { align: "center" });
    if (pages > 1) {
      doc.text(`Page ${p} of ${pages}`, pageW - margin, pageH - 10, { align: "right" });
    }
  }

  return doc;
};

export const downloadPdf = async (
  setup: LogSetup,
  rows: LogRow[],
  calibration: Calibration,
) => {
  const doc = await buildPdf(setup, rows, calibration);
  doc.save(`${fileName(setup)}.pdf`);
};
