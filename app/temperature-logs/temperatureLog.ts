import { format, getDaysInMonth } from "date-fns";

/* ────────────────────────────────────────────────────────────────────────── */
/*  CONSTANTS                                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

// Expected reading ranges in °F. Values outside these are flagged, never blocked.
export const AMBIENT_RANGE = { min: 70, max: 76 } as const;
export const FRIDGE_RANGE = { min: 38, max: 44 } as const;

export const MAX_FRIDGES = 2;

export const DEFAULT_COMMENT = "Within range; alarms normal; no action.";
export const DEFAULT_AM_TIME = "09:30";
export const DEFAULT_PM_TIME = "17:30";
export const RETENTION_NOTE = "Retain logs for 2 years per N.J.A.C. 13:39-5.11";

// Shown on the page; the short form goes on every exported sheet.
export const DISCLAIMER =
  "Readings must be taken from the pharmacy's calibrated thermometer at the times shown. The Pharmacist-in-Charge is responsible for their accuracy, for acting on any excursion, and for retaining logs for 2 years under N.J.A.C. 13:39-5.11. Random Generate inserts sample values only; they are not measurements and must be replaced before a sheet is kept as a record. AuditProRx provides the template and exports and does not verify readings.";

export const PDF_DISCLAIMER =
  "Readings must be taken from the calibrated thermometer listed above. The Pharmacist-in-Charge is responsible for accuracy, excursion follow-up and retention. Sample values produced by Random Generate are not measurements and must be replaced before this sheet is kept as a record.";

const pad2 = (n: number) => String(n).padStart(2, "0");

const halfHourSlots = (fromHour: number, toHour: number): string[] => {
  const out: string[] = [];
  for (let h = fromHour; h <= toHour; h++) {
    out.push(`${pad2(h)}:00`, `${pad2(h)}:30`);
  }
  return out;
};

// Morning covers 00:00–11:59 and evening covers 12:00–23:59, in 30-minute steps.
export const MORNING_SLOTS = halfHourSlots(0, 11);
export const EVENING_SLOTS = halfHourSlots(12, 23);

// A log records readings already taken, so no future years are offered. The two
// previous years match the 2-year retention rule printed on the sheet. The one
// exception: in December, next year is listed so January's blank sheet can be
// prepared ahead. A saved draft's year is always kept selectable.
export const yearOptions = (selected?: number, now = new Date()): number[] => {
  const current = now.getFullYear();
  const years = [current - 2, current - 1, current];
  if (now.getMonth() === 11) years.push(current + 1);
  if (selected !== undefined && !years.includes(selected)) years.push(selected);
  return years.sort((a, b) => a - b);
};

/* ────────────────────────────────────────────────────────────────────────── */
/*  TYPES                                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

export type Period = "am" | "pm";
export const PERIODS: Period[] = ["am", "pm"];

export type TempKey = "ambient" | "fridge1" | "fridge2";
export type FridgeCount = 1 | 2;

export type PeriodEntry = {
  time: string;
  ambient: string;
  fridge1: string;
  fridge2: string;
  initials: string;
  comment: string;
};

export type LogRow = {
  date: string; // yyyy-MM-dd
  weekday: string; // Mon … Sun
  am: PeriodEntry;
  pm: PeriodEntry;
};

export type LogSetup = {
  location: string;
  month: number; // 0–11
  year: number;
  fridges: FridgeCount;
  amTime: string;
  pmTime: string;
  amInitials: string;
  pmInitials: string;
  amComment: string;
  pmComment: string;
};

export type Calibration = {
  thermometerSn: string;
  performedBy: string;
  calibrationDate: string;
  nextDue: string;
  certificateNumber: string;
  picName: string;
  picDate: string;
};

/* ────────────────────────────────────────────────────────────────────────── */
/*  DEFAULTS & HELPERS                                                        */
/* ────────────────────────────────────────────────────────────────────────── */

export const EMPTY_CALIBRATION: Calibration = {
  thermometerSn: "",
  performedBy: "",
  calibrationDate: "",
  nextDue: "",
  certificateNumber: "",
  picName: "",
  picDate: "",
};

export const currentPeriod = (now = new Date()) => ({
  month: now.getMonth(),
  year: now.getFullYear(),
});

export const defaultSetup = (): LogSetup => {
  return {
    location: "",
    ...currentPeriod(),
    fridges: 1,
    amTime: DEFAULT_AM_TIME,
    pmTime: DEFAULT_PM_TIME,
    amInitials: "",
    pmInitials: "",
    amComment: DEFAULT_COMMENT,
    pmComment: DEFAULT_COMMENT,
  };
};

// Initials are letters only, always upper case, at most four characters.
export const sanitizeInitials = (value: string) =>
  value.replace(/[^a-zA-Z]/g, "").toUpperCase().slice(0, 4);

export const daysInSetupMonth = (setup: LogSetup) =>
  getDaysInMonth(new Date(setup.year, setup.month, 1));

export const buildRows = (setup: LogSetup): LogRow[] =>
  Array.from({ length: daysInSetupMonth(setup) }, (_, i) => {
    const day = new Date(setup.year, setup.month, i + 1);
    return {
      date: format(day, "yyyy-MM-dd"),
      weekday: format(day, "EEE"),
      am: {
        time: setup.amTime,
        ambient: "",
        fridge1: "",
        fridge2: "",
        initials: setup.amInitials,
        comment: setup.amComment,
      },
      pm: {
        time: setup.pmTime,
        ambient: "",
        fridge1: "",
        fridge2: "",
        initials: setup.pmInitials,
        comment: setup.pmComment,
      },
    };
  });

// The reading columns a sheet shows, in order.
export const tempKeys = (fridges: FridgeCount): TempKey[] =>
  fridges === 2 ? ["ambient", "fridge1", "fridge2"] : ["ambient", "fridge1"];

export const rangeFor = (key: TempKey) =>
  key === "ambient" ? AMBIENT_RANGE : FRIDGE_RANGE;

export type TempStatus = "empty" | "ok" | "out";

export const tempStatus = (key: TempKey, value: string): TempStatus => {
  if (value.trim() === "") return "empty";
  const n = Number(value);
  if (!Number.isFinite(n)) return "out";
  const range = rangeFor(key);
  return n >= range.min && n <= range.max ? "ok" : "out";
};

export const hasReadingFor = (rows: LogRow[] | null, key: TempKey) =>
  !!rows?.some((r) => PERIODS.some((p) => r[p][key].trim() !== ""));

export const hasAnyReading = (rows: LogRow[] | null) =>
  (["ambient", "fridge1", "fridge2"] as TempKey[]).some((k) =>
    hasReadingFor(rows, k),
  );

export const clearReadings = (rows: LogRow[], key: TempKey): LogRow[] =>
  rows.map((r) => ({
    ...r,
    am: { ...r.am, [key]: "" },
    pm: { ...r.pm, [key]: "" },
  }));

// One decimal place, anywhere in the expected range, both ends included.
export const randomReading = (key: TempKey): string => {
  const { min, max } = rangeFor(key);
  const steps = Math.round((max - min) * 10);
  const tenths = Math.round(min * 10) + Math.floor(Math.random() * (steps + 1));
  return String(tenths / 10);
};

// Fills ambient and the visible fridge columns for every row and period.
// Times, initials and comments are left exactly as they are.
export const fillRandom = (rows: LogRow[], fridges: FridgeCount): LogRow[] => {
  const keys = tempKeys(fridges);
  const fill = (entry: PeriodEntry): PeriodEntry => {
    const next = { ...entry };
    for (const key of keys) next[key] = randomReading(key);
    return next;
  };
  return rows.map((r) => ({ ...r, am: fill(r.am), pm: fill(r.pm) }));
};

// Matches the paper template: "43 °F" for whole numbers, "43.9 °F" otherwise.
export const formatTemp = (value: string) => {
  const trimmed = value.trim();
  if (trimmed === "") return "";
  const n = Number(trimmed);
  return Number.isFinite(n) ? `${n} °F` : trimmed;
};

export const sheetTitle = (setup: LogSetup) =>
  `${setup.location.trim() || "Pharmacy"} Temperature logs - ${MONTHS[setup.month].toUpperCase()} ${setup.year}`;

// Download names: month and year only.
export const fileName = (setup: LogSetup) =>
  `Temperature Log - ${MONTHS[setup.month]} ${setup.year}`;
