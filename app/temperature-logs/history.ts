import { format } from "date-fns";
import {
  MONTHS,
  PERIODS,
  buildRows,
  defaultSetup,
  rangeFor,
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
/*  TYPES                                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

export type SavedLog = {
  id: string;
  setup: LogSetup;
  rows: LogRow[];
  calibration: Calibration;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type LogStats = { total: number; filled: number; out: number };

/* ────────────────────────────────────────────────────────────────────────── */
/*  HELPERS                                                                   */
/* ────────────────────────────────────────────────────────────────────────── */

const pad2 = (n: number) => String(n).padStart(2, "0");

const slug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "pharmacy";

// One log per month per location: saving the same month again updates it.
export const logIdFor = (setup: LogSetup) =>
  `${setup.year}-${pad2(setup.month + 1)}-${slug(setup.location)}`;

export const logLabel = (log: Pick<SavedLog, "setup">) =>
  `${MONTHS[log.setup.month]} ${log.setup.year}`;

export const logStats = (rows: LogRow[], fridges: FridgeCount): LogStats => {
  const keys = tempKeys(fridges);
  let filled = 0;
  let out = 0;
  for (const row of rows) {
    for (const period of PERIODS) {
      for (const key of keys) {
        const status = tempStatus(key, row[period][key]);
        if (status !== "empty") filled++;
        if (status === "out") out++;
      }
    }
  }
  return { total: rows.length * PERIODS.length * keys.length, filled, out };
};

export const savedOn = (iso: string) => format(new Date(iso), "d MMM yyyy");

// Newest month first; same month sorts by location.
export const sortLogs = (logs: SavedLog[]) =>
  [...logs].sort(
    (a, b) =>
      b.setup.year - a.setup.year ||
      b.setup.month - a.setup.month ||
      a.setup.location.localeCompare(b.setup.location),
  );

export const upsertLog = (
  logs: SavedLog[],
  entry: Pick<SavedLog, "id" | "setup" | "rows" | "calibration">,
): SavedLog[] => {
  const now = new Date().toISOString();
  const existing = logs.find((l) => l.id === entry.id);
  const saved: SavedLog = {
    ...entry,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  return sortLogs([...logs.filter((l) => l.id !== entry.id), saved]);
};

export const removeLog = (logs: SavedLog[], id: string) =>
  logs.filter((l) => l.id !== id);

/* ────────────────────────────────────────────────────────────────────────── */
/*  STORAGE — browser-only until the API exists                               */
/* ────────────────────────────────────────────────────────────────────────── */

const HISTORY_KEY = "temperatureLogHistory";

// null means nothing has ever been stored, which is the only time sample
// data is seeded; an emptied history stays empty.
export const loadHistory = (): SavedLog[] | null => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw === null) return null;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? sortLogs(parsed as SavedLog[]) : [];
  } catch {
    return [];
  }
};

export const persistHistory = (logs: SavedLog[]) => {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(logs));
  } catch {
    /* ignore storage failures */
  }
};

/* ────────────────────────────────────────────────────────────────────────── */
/*  DUMMY DATA — seeded so the prototype looks the same on every load         */
/* ────────────────────────────────────────────────────────────────────────── */

const mulberry32 = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const seededReading = (rand: () => number, key: TempKey) => {
  const { min, max } = rangeFor(key);
  const steps = Math.round((max - min) * 10);
  return String((Math.round(min * 10) + Math.floor(rand() * (steps + 1))) / 10);
};

type SampleSpec = {
  location: string;
  year: number;
  month: number;
  fridges: FridgeCount;
  filledDays: number | "all";
  savedDaysAgo: number;
  seed: number;
  excursion?: {
    day: number;
    period: Period;
    key: TempKey;
    value: string;
    comment: string;
  };
};

const sampleLog = (spec: SampleSpec): SavedLog => {
  const rand = mulberry32(spec.seed);
  const setup: LogSetup = {
    ...defaultSetup(),
    location: spec.location,
    year: spec.year,
    month: spec.month,
    fridges: spec.fridges,
    amInitials: "IA",
    pmInitials: "IA",
  };
  const keys = tempKeys(spec.fridges);
  const fill = (entry: PeriodEntry): PeriodEntry => {
    const next = { ...entry };
    for (const key of keys) next[key] = seededReading(rand, key);
    return next;
  };
  const limit = spec.filledDays === "all" ? Infinity : spec.filledDays;
  const rows = buildRows(setup).map((r, i) =>
    i < limit ? { ...r, am: fill(r.am), pm: fill(r.pm) } : r,
  );
  if (spec.excursion) {
    const e = spec.excursion;
    const row = rows[e.day - 1];
    row[e.period] = { ...row[e.period], [e.key]: e.value, comment: e.comment };
  }
  const savedAt = new Date(Date.now() - spec.savedDaysAgo * 86_400_000).toISOString();
  return {
    id: logIdFor(setup),
    setup,
    rows,
    calibration: {
      thermometerSn: "TH-20931",
      performedBy: "ThermoCal Services",
      calibrationDate: `${spec.year}-01-14`,
      nextDue: `${spec.year + 1}-01-14`,
      certificateNumber: "TC-88412",
      picName: "",
      picDate: "",
    },
    createdAt: savedAt,
    updatedAt: savedAt,
  };
};

// The three months before the current one: one complete, one with an
// excursion, one still being filled in.
export const seedHistory = (location: string, now = new Date()): SavedLog[] => {
  const monthsBack = (n: number) => new Date(now.getFullYear(), now.getMonth() - n, 1);
  const [m1, m2, m3] = [1, 2, 3].map(monthsBack);
  return sortLogs([
    sampleLog({
      location,
      year: m3.getFullYear(),
      month: m3.getMonth(),
      fridges: 2,
      filledDays: "all",
      savedDaysAgo: 70,
      seed: 11,
    }),
    sampleLog({
      location,
      year: m2.getFullYear(),
      month: m2.getMonth(),
      fridges: 2,
      filledDays: "all",
      savedDaysAgo: 40,
      seed: 23,
      excursion: {
        day: 12,
        period: "pm",
        key: "fridge1",
        value: "45.6",
        comment:
          "Excursion: 45.6 °F, door left ajar. Closed and rechecked after 30 min: 41.2 °F. PIC notified.",
      },
    }),
    sampleLog({
      location,
      year: m1.getFullYear(),
      month: m1.getMonth(),
      fridges: 1,
      filledDays: 19,
      savedDaysAgo: 9,
      seed: 37,
    }),
  ]);
};
