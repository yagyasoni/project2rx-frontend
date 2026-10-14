"use client";

import { Fragment, type CSSProperties } from "react";
import { Moon, Pencil, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DownloadPdfButton from "./DownloadPdfButton";
import { logLabel, logStats, savedOn, type SavedLog } from "./history";
import {
  PERIODS,
  formatTemp,
  tempKeys,
  tempStatus,
  type Period,
  type TempKey,
} from "./temperatureLog";

type Props = {
  log: SavedLog | null;
  sidebarWidth: number;
  onClose: () => void;
  onEdit: (log: SavedLog) => void;
  onDownload: (log: SavedLog) => Promise<void>;
};

// Dialogs are position: fixed, so by default they center on the viewport and
// can slide under the sidebar. This centers them in the content panel instead
// and keeps them narrower than the panel at every screen size.
export const panelDialogStyle = (sidebarWidth: number, maxWidth: string): CSSProperties => ({
  left: `calc(${sidebarWidth}px + (100vw - ${sidebarWidth}px) / 2)`,
  maxWidth: `max(18rem, min(${maxWidth}, calc(100vw - ${sidebarWidth}px - 2rem)))`,
});

const TEMP_LABELS: Record<TempKey, string> = {
  ambient: "Ambient",
  fridge1: "Fridge 1",
  fridge2: "Fridge 2",
};

const PERIOD_META: Record<Period, { label: string; Icon: typeof Sun; className: string }> = {
  am: { label: "Morning", Icon: Sun, className: "bg-amber-50 text-amber-800" },
  pm: { label: "Evening", Icon: Moon, className: "bg-indigo-50 text-indigo-800" },
};

const th =
  "border-b border-slate-200 bg-slate-50 px-2.5 py-1.5 text-left text-[10.5px] font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap";
const td = "border-b border-slate-100 px-2.5 py-1.5 whitespace-nowrap";

export default function LogPreview({ log, sidebarWidth, onClose, onEdit, onDownload }: Props) {
  return (
    <Dialog open={log !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        style={panelDialogStyle(sidebarWidth, "72rem")}
        className="flex max-h-[90vh] w-full flex-col gap-0 overflow-hidden p-0"
      >
        {log && <PreviewBody log={log} onEdit={onEdit} onDownload={onDownload} />}
      </DialogContent>
    </Dialog>
  );
}

function PreviewBody({
  log,
  onEdit,
  onDownload,
}: Omit<Props, "onClose" | "sidebarWidth"> & { log: SavedLog }) {
  const keys = tempKeys(log.setup.fridges);
  const stats = logStats(log.rows, log.setup.fridges);
  const span = keys.length + 3; // time + readings + initials + comment

  return (
    <>
      <DialogHeader className="space-y-1 border-b border-slate-100 px-6 py-5 text-left">
        <DialogTitle className="text-lg font-bold text-slate-900">
          {logLabel(log)}
        </DialogTitle>
        <DialogDescription className="text-xs text-slate-500 tabular-nums">
          {log.rows.length} days · {log.setup.fridges === 2 ? "2 fridges" : "1 fridge"} ·{" "}
          {stats.filled}/{stats.total} readings
          {stats.out > 0 && (
            <span className="font-semibold text-rose-600"> · {stats.out} out of range</span>
          )}{" "}
          · Saved {savedOn(log.updatedAt)}
        </DialogDescription>
      </DialogHeader>

      <div className="min-h-0 flex-1 overflow-auto">
        <table className="w-max min-w-full border-separate border-spacing-0 text-[12.5px]">
          <thead className="sticky top-0 z-10">
            <tr>
              <th className="border-b border-slate-200 bg-white" />
              {PERIODS.map((p) => {
                const meta = PERIOD_META[p];
                return (
                  <th
                    key={p}
                    colSpan={span}
                    className={`border-b border-l border-slate-200 py-1 text-[10.5px] font-bold uppercase tracking-widest ${meta.className}`}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      <meta.Icon className="h-3 w-3" />
                      {meta.label}
                    </span>
                  </th>
                );
              })}
            </tr>
            <tr>
              <th className={th}>Date</th>
              {PERIODS.map((p) => (
                <Fragment key={p}>
                  <th className={`${th} border-l`}>Time</th>
                  {keys.map((key) => (
                    <th key={key} className={`${th} text-right`}>
                      {TEMP_LABELS[key]}
                    </th>
                  ))}
                  <th className={`${th} text-center`}>Initials</th>
                  <th className={th}>Comments</th>
                </Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {log.rows.map((row) => (
              <tr key={row.date} className="hover:bg-slate-50/70">
                <td className={`${td} font-semibold text-slate-900 tabular-nums`}>
                  {row.date}
                  <span className="ml-1.5 text-[10.5px] font-normal text-slate-400">
                    {row.weekday}
                  </span>
                </td>
                {PERIODS.map((p) => {
                  const entry = row[p];
                  return (
                    <Fragment key={p}>
                      <td className={`${td} border-l tabular-nums text-slate-700`}>
                        {entry.time}
                      </td>
                      {keys.map((key) => {
                        const out = tempStatus(key, entry[key]) === "out";
                        return (
                          <td
                            key={key}
                            className={`${td} text-right tabular-nums ${
                              out ? "font-semibold text-rose-700" : "text-slate-800"
                            }`}
                          >
                            {formatTemp(entry[key]) || <span className="text-slate-300">—</span>}
                          </td>
                        );
                      })}
                      <td className={`${td} text-center font-semibold tracking-widest text-slate-700`}>
                        {entry.initials || <span className="text-slate-300">—</span>}
                      </td>
                      <td
                        className={`${td} max-w-[240px] truncate text-slate-600`}
                        title={entry.comment}
                      >
                        {entry.comment}
                      </td>
                    </Fragment>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DialogFooter className="flex-row items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-6 py-4 sm:justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(log)}
          className="cursor-pointer"
        >
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
        <DownloadPdfButton variant="default" onDownload={() => onDownload(log)} />
      </DialogFooter>
    </>
  );
}
