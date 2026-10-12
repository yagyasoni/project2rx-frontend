"use client";

import { Eye, FolderOpen, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ExportMenu, { type ExportKind } from "./ExportMenu";
import { logLabel, logStats, savedOn, type SavedLog } from "./history";
import { MONTHS } from "./temperatureLog";

type Props = {
  logs: SavedLog[];
  onOpen: (log: SavedLog) => void;
  onPreview: (log: SavedLog) => void;
  onDelete: (log: SavedLog) => void;
  onExport: (kind: ExportKind, log: SavedLog) => Promise<void>;
  onGoToSetup: () => void;
};

export default function HistoryPanel({
  logs,
  onOpen,
  onPreview,
  onDelete,
  onExport,
  onGoToSetup,
}: Props) {
  if (logs.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white/60 px-6 py-14 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">
          <FolderOpen className="h-6 w-6 text-slate-400" />
        </div>
        <h3 className="text-base font-semibold text-slate-900">No saved logs yet</h3>
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
          Build a month in Setup and click Save log. It will appear here.
        </p>
        <Button
          size="sm"
          onClick={onGoToSetup}
          className="mt-5 bg-slate-900 text-white hover:bg-slate-800"
        >
          Go to Setup
        </Button>
      </div>
    );
  }

  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">
          Saved logs
        </h2>
        <span className="text-xs text-slate-400 tabular-nums">
          {logs.length} {logs.length === 1 ? "log" : "logs"}
        </span>
      </div>

      <ul className="space-y-3">
        {logs.map((log) => {
          const stats = logStats(log.rows, log.setup.fridges);
          return (
            <li
              key={log.id}
              className="rounded-xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-4 px-5 py-4">
                <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-slate-900 text-white">
                  <span className="text-[11px] font-bold leading-none tracking-wide">
                    {MONTHS[log.setup.month].slice(0, 3).toUpperCase()}
                  </span>
                  <span className="mt-1 text-[10px] leading-none text-slate-300">
                    {log.setup.year}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900">
                    {logLabel(log)}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-500 tabular-nums">
                    {log.rows.length} days · {log.setup.fridges === 2 ? "2 fridges" : "1 fridge"} ·{" "}
                    {stats.filled}/{stats.total} readings
                    {stats.out > 0 && (
                      <span className="font-semibold text-rose-600">
                        {" "}· {stats.out} out of range
                      </span>
                    )}
                    {" "}· Saved {savedOn(log.updatedAt)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => onPreview(log)}>
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onOpen(log)}>
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <ExportMenu
                    heading={`Export ${logLabel(log)}`}
                    onExport={(kind) => onExport(kind, log)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(log)}
                    className="text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
