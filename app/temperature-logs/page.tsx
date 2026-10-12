"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  History,
  Lock,
  Settings2,
  ShieldAlert,
  Table2,
  Thermometer,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import SetupPanel from "./SetupPanel";
import LogGrid from "./LogGrid";
import HistoryPanel from "./HistoryPanel";
import LogPreview, { panelDialogStyle } from "./LogPreview";
import type { ExportKind } from "./ExportMenu";
import { downloadCsv, downloadExcel, downloadPdf } from "./export";
import {
  loadHistory,
  logIdFor,
  logLabel,
  persistHistory,
  removeLog,
  seedHistory,
  upsertLog,
  type SavedLog,
} from "./history";
import {
  DISCLAIMER,
  EMPTY_CALIBRATION,
  MONTHS,
  buildRows,
  clearReadings,
  defaultSetup,
  fillRandom,
  hasAnyReading,
  hasReadingFor,
  type Calibration,
  type FridgeCount,
  type LogRow,
  type LogSetup,
} from "./temperatureLog";

type Tab = "setup" | "history";

// Every confirmation here guards against losing data; nothing else asks.
type ConfirmKind =
  | "rebuild"
  | "reset"
  | "random"
  | "removeFridge"
  | "openLog"
  | "deleteLog"
  | "overwriteLog";

const CONFIRM_COPY: Record<
  ConfirmKind,
  { title: string; action: string; destructive?: boolean }
> = {
  rebuild: { title: "Rebuild the log sheet?", action: "Rebuild" },
  reset: { title: "Clear this sheet?", action: "Clear sheet", destructive: true },
  random: { title: "Generate sample readings?", action: "Generate" },
  removeFridge: { title: "Remove Fridge 2?", action: "Remove", destructive: true },
  openLog: { title: "Replace the sheet in Setup?", action: "Open log" },
  deleteLog: { title: "Delete this log?", action: "Delete", destructive: true },
  overwriteLog: { title: "Replace the saved log?", action: "Replace", destructive: true },
};

const tabTrigger =
  "group gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-slate-500 data-[state=active]:bg-slate-900 data-[state=active]:text-white data-[state=active]:shadow-sm";

// The sheet in progress survives a browser refresh but not navigation away:
// it lives in sessionStorage while this page is mounted and is removed when
// the page unmounts. Leaving and coming back starts from the initial view.
const SESSION_KEY = "temperatureLogSession";

type SessionDraft = {
  setup: LogSetup;
  rows: LogRow[] | null;
  calibration: Calibration;
  logId: string | null;
  setupOpen: boolean;
  tab: Tab;
};

const readSession = (): SessionDraft | null => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as SessionDraft) : null;
  } catch {
    return null;
  }
};

// The workspace reads browser storage, so it only mounts after hydration.
const subscribeNoop = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );

/* ────────────────────────────────────────────────────────────────────────── */
/*  WORKSPACE — the editor (Setup tab) and the saved logs (History tab)       */
/* ────────────────────────────────────────────────────────────────────────── */

function TemperatureLogWorkspace({ sidebarWidth }: { sidebarWidth: number }) {
  // Present only after a refresh of this page; otherwise the initial view.
  const [restored] = useState(readSession);
  const [setup, setSetup] = useState<LogSetup>(() => restored?.setup ?? defaultSetup());
  const [rows, setRows] = useState<LogRow[] | null>(() => restored?.rows ?? null);
  const [calibration, setCalibration] = useState<Calibration>(
    () => restored?.calibration ?? EMPTY_CALIBRATION,
  );
  // The History entry the sheet in Setup came from, if any.
  const [logId, setLogId] = useState<string | null>(() => restored?.logId ?? null);
  const [setupOpen, setSetupOpen] = useState(() => restored?.setupOpen ?? true);
  const [confirm, setConfirm] = useState<ConfirmKind | null>(null);
  const [pendingBuild, setPendingBuild] = useState<LogSetup | null>(null);
  const [pendingLog, setPendingLog] = useState<SavedLog | null>(null);
  // What the sheet looked like at the last Save click; "Saved" shows while it
  // still matches, and clears the moment anything changes.
  const [savedSnapshot, setSavedSnapshot] = useState<string | null>(null);

  // Dummy data until the API exists: sample months seeded on the first visit.
  const [history, setHistory] = useState<SavedLog[]>(
    () => loadHistory() ?? seedHistory("Bergen Road"),
  );
  const [tab, setTab] = useState<Tab>(() => restored?.tab ?? "setup");
  const [preview, setPreview] = useState<SavedLog | null>(null);

  /* ── Seed the location from the pharmacy profile ── */
  useEffect(() => {
    // Left over from the earlier draft-persistence prototype.
    try {
      localStorage.removeItem("temperatureLogDraft");
    } catch {
      /* ignore */
    }

    const applyLocation = (name: string | null) => {
      if (!name) return;
      setSetup((prev) => (prev.location ? prev : { ...prev, location: name }));
    };

    const seedLocation = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await api.get("/auth/pharmacy-details", {
          headers: { Authorization: `Bearer ${token}` },
        });
        applyLocation(res?.data?.pharmacy?.pharmacy_name ?? null);
      } catch {
        applyLocation(localStorage.getItem("pharmacyName"));
      }
    };

    seedLocation();
  }, []);

  /* ── History persists for good; the sheet only across a refresh ── */
  useEffect(() => {
    persistHistory(history);
  }, [history]);

  useEffect(() => {
    try {
      sessionStorage.setItem(
        SESSION_KEY,
        JSON.stringify({ setup, rows, calibration, logId, setupOpen, tab }),
      );
    } catch {
      /* ignore storage failures */
    }
  }, [setup, rows, calibration, logId, setupOpen, tab]);

  // Navigating to another page unmounts the workspace; a browser refresh does
  // not run this cleanup, which is exactly the difference we want.
  useEffect(() => {
    return () => {
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch {
        /* ignore */
      }
    };
  }, []);

  const monthLabel = `${MONTHS[setup.month]} ${setup.year}`;
  const snapshot = () => JSON.stringify({ setup, rows, calibration });
  const saved = savedSnapshot !== null && savedSnapshot === snapshot();

  /* ── Sheet actions ── */
  const build = (target: LogSetup) => {
    const next = buildRows(target);
    setSetup(target);
    setRows(next);
    setLogId(null);
    setSavedSnapshot(null);
    setSetupOpen(false);
    toast.success("Log sheet ready", {
      description: `${next.length} days for ${MONTHS[target.month]} ${target.year}.`,
    });
  };

  // Asks first when the current sheet already holds readings.
  const handleBuild = (target: LogSetup = setup) => {
    if (rows && hasAnyReading(rows)) {
      setPendingBuild(target);
      setConfirm("rebuild");
    } else {
      build(target);
    }
  };

  const doReset = () => {
    setRows(null);
    setCalibration(EMPTY_CALIBRATION);
    setLogId(null);
    setSavedSnapshot(null);
    setSetupOpen(true);
  };

  // Sample values for the visible reading columns; times, initials and
  // comments are untouched. Asks first when readings already exist.
  const generate = () => {
    if (!rows) return;
    setRows(fillRandom(rows, setup.fridges));
    toast.success("Sample readings filled", {
      description: "Placeholders only. Replace them with actual readings.",
    });
  };

  // Always goes through the dialog: it carries the disclaimer for generated values.
  const handleRandomGenerate = () => {
    if (rows) setConfirm("random");
  };

  // Removing Fridge 2 clears its readings, so ask when there are any.
  const applyFridges = (fridges: FridgeCount) => {
    setSetup((prev) => ({ ...prev, fridges }));
    if (fridges === 1 && rows) setRows(clearReadings(rows, "fridge2"));
  };

  const handleFridgesChange = (fridges: FridgeCount) => {
    if (fridges === 1 && hasReadingFor(rows, "fridge2")) setConfirm("removeFridge");
    else applyFridges(fridges);
  };

  /* ── History actions ── */
  const doSave = (id: string) => {
    if (!rows) return;
    setHistory((h) => upsertLog(h, { id, setup, rows, calibration }));
    setLogId(id);
    setSavedSnapshot(snapshot());
    toast.success("Saved to History", {
      description: monthLabel,
      action: { label: "Open History", onClick: () => setTab("history") },
    });
  };

  // One log per month and location: saving a sheet that collides with a
  // different saved log asks before replacing it.
  const handleSave = () => {
    if (!rows) return;
    const id = logIdFor(setup);
    if (id !== logId && history.some((l) => l.id === id)) {
      setConfirm("overwriteLog");
      return;
    }
    doSave(id);
  };

  const doOpen = (log: SavedLog) => {
    setSetup(log.setup);
    setRows(log.rows);
    setCalibration(log.calibration);
    setLogId(log.id);
    setSavedSnapshot(null);
    setSetupOpen(false);
    setPreview(null);
    setTab("setup");
  };

  // Opening a different log replaces whatever is in Setup; ask when that
  // sheet holds readings that were never saved under its own month.
  const handleOpen = (log: SavedLog) => {
    setSavedSnapshot(null);
    if (log.id === logId) {
      setPreview(null);
      setTab("setup");
      return;
    }
    if (rows && hasAnyReading(rows) && logId === null) {
      setPendingLog(log);
      setConfirm("openLog");
    } else {
      doOpen(log);
    }
  };

  const handleDelete = (log: SavedLog) => {
    setPendingLog(log);
    setConfirm("deleteLog");
  };

  const doDelete = () => {
    if (!pendingLog) return;
    const id = pendingLog.id;
    setHistory((h) => removeLog(h, id));
    if (preview?.id === id) setPreview(null);
    if (logId === id) setLogId(null);
    toast("Log deleted", { description: logLabel(pendingLog) });
  };

  const exportLog = async (kind: ExportKind, log: SavedLog) => {
    try {
      if (kind === "csv") downloadCsv(log.setup, log.rows, log.calibration);
      else if (kind === "excel") await downloadExcel(log.setup, log.rows, log.calibration);
      else await downloadPdf(log.setup, log.rows, log.calibration);
      toast.success(
        { csv: "CSV downloaded", excel: "Excel downloaded", pdf: "PDF downloaded" }[kind],
        { description: logLabel(log) },
      );
    } catch (err) {
      console.error(err);
      toast.error("Couldn't build the file", { description: "Please try again." });
    }
  };

  /* ── Confirmations ── */
  const closeConfirm = () => {
    setPendingBuild(null);
    setPendingLog(null);
    setConfirm(null);
  };

  const confirmAction = () => {
    if (confirm === "rebuild") build(pendingBuild ?? setup);
    if (confirm === "reset") doReset();
    if (confirm === "random") generate();
    if (confirm === "removeFridge") applyFridges(1);
    if (confirm === "openLog" && pendingLog) doOpen(pendingLog);
    if (confirm === "deleteLog") doDelete();
    if (confirm === "overwriteLog") doSave(logIdFor(setup));
    closeConfirm();
  };

  const confirmDescription = (): string => {
    switch (confirm) {
      case "rebuild":
        return `Readings already entered for ${monthLabel} will be cleared and the sheet rebuilt from the setup.`;
      case "reset":
        return "The sheet and calibration details in Setup are cleared. Saved logs in History are not affected.";
      case "random":
        return `Random Generate fills every ambient and fridge cell on the ${monthLabel} sheet with sample values inside the expected range. They are not measurements. Using generated values in a record kept for inspection is solely the pharmacy's responsibility, and AuditProRx accepts no liability for logs completed this way.${
          rows && hasAnyReading(rows)
            ? " Readings already on this sheet will be replaced."
            : ""
        }`;
      case "removeFridge":
        return "Fridge 2 holds readings. Removing the column clears them.";
      case "openLog":
        return `The ${monthLabel} sheet in Setup has readings that were never saved. Opening ${pendingLog ? logLabel(pendingLog) : "this log"} discards them.`;
      case "deleteLog":
        return pendingLog
          ? `${logLabel(pendingLog)} will be removed from History. This can't be undone.`
          : "";
      case "overwriteLog":
        return `History already has a log for ${monthLabel}. Saving replaces it with the sheet in Setup.`;
      default:
        return "";
    }
  };

  const copy = confirm ? CONFIRM_COPY[confirm] : null;

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="space-y-5">
      <TabsList className="h-11 w-fit rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
        <TabsTrigger value="setup" className={tabTrigger}>
          <Settings2 className="h-4 w-4" />
          Setup
        </TabsTrigger>
        <TabsTrigger value="history" className={tabTrigger}>
          <History className="h-4 w-4" />
          History
          <span className="rounded-full bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white group-data-[state=active]:bg-white group-data-[state=active]:text-slate-900">
            {history.length}
          </span>
        </TabsTrigger>
      </TabsList>

      {/* ── Setup tab: build and edit the current sheet ── */}
      <TabsContent value="setup" className="mt-0 space-y-6">
        <SetupPanel
          setup={setup}
          onChange={setSetup}
          onBuild={() => handleBuild()}
          hasSheet={rows !== null}
          expanded={setupOpen}
          onToggle={setSetupOpen}
        />

        {rows ? (
          <LogGrid
            setup={setup}
            rows={rows}
            onRowsChange={setRows}
            onFridgesChange={handleFridgesChange}
            calibration={calibration}
            onCalibrationChange={setCalibration}
            onRandomGenerate={handleRandomGenerate}
            onReset={() => setConfirm("reset")}
            onSave={handleSave}
            saved={saved}
          />
        ) : (
          <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white/60 px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
              <Table2 className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">
              No log sheet yet
            </h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
              Choose the month and defaults above, then build the sheet.
            </p>
          </div>
        )}
      </TabsContent>

      {/* ── History tab: saved logs by month ── */}
      <TabsContent value="history" className="mt-0">
        <HistoryPanel
          logs={history}
          onOpen={handleOpen}
          onPreview={setPreview}
          onDelete={handleDelete}
          onExport={exportLog}
          onGoToSetup={() => setTab("setup")}
        />
      </TabsContent>

      <LogPreview
        log={preview}
        sidebarWidth={sidebarWidth}
        onClose={() => setPreview(null)}
        onEdit={handleOpen}
        onExport={exportLog}
      />

      {/* ── Confirmations ── */}
      <AlertDialog
        open={confirm !== null}
        onOpenChange={(open) => !open && closeConfirm()}
      >
        <AlertDialogContent style={panelDialogStyle(sidebarWidth, "32rem")}>
          <AlertDialogHeader>
            <AlertDialogTitle>{copy?.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDescription()}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={`cursor-pointer ${
                copy?.destructive
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-slate-900 text-white hover:bg-slate-800"
              }`}
            >
              {copy?.action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Tabs>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  PAGE                                                                      */
/* ────────────────────────────────────────────────────────────────────────── */

export default function TemperatureLogsPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const isClient = useIsClient();

  // Temperature Logs is part of the base plan, so it follows the reports flag,
  // the same way the sidebar does.
  const [subscription, setSubscription] = useState<{
    inventory_reports_access?: boolean;
  } | null>(null);
  const [subscriptionLoaded, setSubscriptionLoaded] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        const res = await api.get(`/pay/subscription/${userId}`);
        setSubscription(res?.data?.subscription ?? null);
      } catch {
        setSubscription(null);
      } finally {
        setSubscriptionLoaded(true);
      }
    };
    fetchSubscription();
  }, []);

  const locked = subscriptionLoaded && !subscription?.inventory_reports_access;
  // Matches the Sidebar's w-[17rem] / w-[76px]; dialogs center in what is left.
  const sidebarWidth = sidebarOpen ? 272 : 76;

  return (
    <ProtectedRoute role="user">
      <div className="flex h-screen bg-slate-50">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
        />

        <main className="flex-1 overflow-auto [&_button:not(:disabled)]:cursor-pointer">
          {/* ── Header ── */}
          <div className="bg-white border-b border-slate-200">
            <div className="px-8 py-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
                <Thermometer className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Temperature Logs
                </h1>
                <p className="text-sm font-medium text-slate-500 mt-0.5">
                  Build a month of fridge and ambient readings, save it, and
                  download it as PDF, Excel or CSV.
                </p>
              </div>
            </div>
          </div>

          {/* ── Locked: no base plan ── */}
          {locked && (
            <div className="flex min-h-[60vh] items-center justify-center px-8 py-12">
              <div className="relative min-w-[340px] overflow-hidden rounded-2xl border border-rose-200 bg-white/95 px-8 py-7 shadow-2xl">
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-rose-200/30 blur-3xl" />
                <div className="relative flex flex-col items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-200 bg-rose-100 shadow-sm">
                    <Lock className="h-8 w-8 text-rose-600" />
                  </div>
                  <h3 className="text-[22px] font-extrabold tracking-tight text-slate-900">
                    Temperature Logs Locked
                  </h3>
                  <p className="mt-2 max-w-[280px] text-[14px] leading-6 text-slate-500">
                    Subscribe to the Base plan or higher to build, save and
                    export monthly temperature logs.
                  </p>
                  <button
                    onClick={() => router.push("/settings")}
                    className="mt-5 inline-flex items-center justify-center rounded-xl bg-rose-500 px-5 py-3 text-[14px] font-bold text-white shadow-lg shadow-rose-500/20 transition-colors hover:bg-rose-600"
                  >
                    Subscribe to Unlock
                  </button>
                  <p className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-rose-600">
                    Base Plan Feature
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── Content ── */}
          {!locked && (
          <div className="px-8 py-6 space-y-6">
            <p className="flex gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-[12px] leading-relaxed text-slate-500 shadow-sm">
              <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
              <span>
                <span className="font-semibold text-slate-700">Disclaimer. </span>
                {DISCLAIMER}
              </span>
            </p>

            {isClient ? (
              <TemperatureLogWorkspace sidebarWidth={sidebarWidth} />
            ) : (
              <>
                <Skeleton className="h-11 w-56 rounded-xl" />
                <Skeleton className="h-[72px] w-full rounded-xl" />
                <Skeleton className="h-[420px] w-full rounded-xl" />
              </>
            )}
          </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
