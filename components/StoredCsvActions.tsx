"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  AlertTriangle,
  Download,
  Eye,
  FileText,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { formatBytes, prettyUploadName } from "@/lib/storedCsv";

/**
 * "Preview" + "Download" buttons for a CSV the backend keeps on disk, plus the
 * preview dialog. Talks to the existing endpoints:
 *   GET <contentUrl>?mode=preview → { fileName, headers, rows, truncated, sizeBytes }
 *   GET <contentUrl>              → the original CSV (Content-Disposition: attachment)
 * One instance per stored file; each owns its own dialog state.
 */
export interface StoredCsvActionsProps {
  /** Full `/content` URL for the stored file. May already carry a query string (e.g. `?name=`). */
  contentUrl: string;
  /** Raw stored basename from the DB, e.g. "1717000000000-My_File.csv". */
  fileName: string;
  /** "sm" matches the inventory card's Replace button; "xs" matches the supplier row buttons. */
  size?: "sm" | "xs";
  className?: string;
}

type PreviewData = {
  fileName: string;
  headers: string[];
  rows: string[][];
  truncated: boolean;
  sizeBytes: number;
};

type PreviewState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string; missing: boolean }
  | { status: "ready"; data: PreviewData };

const MISSING_MESSAGE =
  "This file is no longer on the server. Please re-upload it.";

/** Normalises axios errors from both JSON and blob responses into a user-facing message. */
async function describeError(
  err: unknown,
): Promise<{ message: string; missing: boolean }> {
  let code: string | undefined;
  let message: string | undefined;
  let status: number | undefined;

  if (axios.isAxiosError(err)) {
    if (!err.response) {
      return {
        message:
          "Could not reach the server. Check your connection and try again.",
        missing: false,
      };
    }
    status = err.response.status;
    let data: unknown = err.response.data;
    // With responseType: "blob" even JSON error bodies arrive as a Blob.
    if (typeof Blob !== "undefined" && data instanceof Blob) {
      try {
        data = JSON.parse(await data.text());
      } catch {
        data = undefined;
      }
    }
    if (data && typeof data === "object") {
      const d = data as { code?: unknown; message?: unknown; error?: unknown };
      if (typeof d.code === "string") code = d.code;
      if (typeof d.message === "string") message = d.message;
      else if (typeof d.error === "string") message = d.error;
    }
  }

  if (code === "FILE_MISSING" || code === "NOT_FOUND") {
    return { message: MISSING_MESSAGE, missing: true };
  }
  // A 404 without our JSON `code` is Express's own "Cannot GET" page: the
  // backend build we are talking to predates the file preview/download routes.
  if (status === 404) {
    return {
      message:
        "The connected backend does not have the file preview/download feature yet. Deploy the latest backend and try again.",
      missing: true,
    };
  }
  return {
    message: message || "Something went wrong while loading this file.",
    missing: false,
  };
}

export default function StoredCsvActions({
  contentUrl,
  fileName,
  size = "xs",
  className,
}: StoredCsvActionsProps) {
  const [open, setOpen] = useState(false);
  const [preview, setPreview] = useState<PreviewState>({ status: "idle" });
  const [downloading, setDownloading] = useState(false);

  const displayName = prettyUploadName(fileName) || "Uploaded file";

  const fetchPreview = useCallback(
    async (isCancelled?: () => boolean) => {
      setPreview({ status: "loading" });
      try {
        // axios joins with "?" or "&" as needed, so contentUrl may already have a query.
        const res = await axios.get<PreviewData>(contentUrl, {
          params: { mode: "preview" },
        });
        if (isCancelled?.()) return;
        setPreview({ status: "ready", data: res.data });
      } catch (err) {
        const described = await describeError(err);
        if (isCancelled?.()) return;
        setPreview({ status: "error", ...described });
      }
    },
    [contentUrl],
  );

  // Refetch on every open so a replaced file is never shown stale.
  useEffect(() => {
    if (!open) {
      setPreview({ status: "idle" });
      return;
    }
    let cancelled = false;
    void fetchPreview(() => cancelled);
    return () => {
      cancelled = true;
    };
  }, [open, fetchPreview]);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      const res = await axios.get(contentUrl, { responseType: "blob" });
      const blob =
        res.data instanceof Blob
          ? res.data
          : new Blob([res.data], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = Object.assign(document.createElement("a"), {
        href: url,
        download: prettyUploadName(fileName) || "download.csv",
      });
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Revoking synchronously can abort the download in some browsers.
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      toast.error((await describeError(err)).message);
    } finally {
      setDownloading(false);
    }
  };

  const btn = cn(
    "inline-flex items-center rounded-lg text-xs font-semibold transition-all",
    "bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50",
    "disabled:opacity-60 disabled:cursor-not-allowed",
    size === "sm" ? "gap-2 px-4 py-2" : "gap-1.5 px-3 py-1.5",
  );
  const icon = size === "sm" ? "w-3.5 h-3.5" : "w-3 h-3";

  // Derived table shape. Rows can be ragged (server parses with relax_column_count).
  const data = preview.status === "ready" ? preview.data : null;
  const colCount = data
    ? Math.max(data.headers.length, ...data.rows.map((r) => r.length), 0)
    : 0;
  const cols = data
    ? Array.from(
        { length: colCount },
        (_, i) => data.headers[i] ?? `(column ${i + 1})`,
      )
    : [];

  const rowsLabel = data
    ? data.truncated
      ? "Showing first 100 rows of a larger file"
      : `${data.rows.length} row${data.rows.length === 1 ? "" : "s"}`
    : "";

  const description =
    data
      ? [
          formatBytes(data.sizeBytes),
          rowsLabel.toLowerCase(),
          `${colCount} column${colCount === 1 ? "" : "s"}`,
        ]
          .filter(Boolean)
          .join(" · ")
      : preview.status === "error"
        ? "Preview unavailable"
        : "Loading preview…";

  return (
    <>
      <div className={cn("flex items-center gap-2", className)}>
        <button
          type="button"
          title="Preview file"
          className={btn}
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          <Eye className={icon} />
          Preview
        </button>
        <button
          type="button"
          title="Download original file"
          className={btn}
          disabled={downloading}
          onClick={(e) => {
            e.stopPropagation();
            void handleDownload();
          }}
        >
          {downloading ? (
            <Loader2 className={cn(icon, "animate-spin")} />
          ) : (
            <Download className={icon} />
          )}
          Download
        </button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        {/* z-[10000] on both layers: the app Sidebar is fixed at z-[9999], and
            the default z-50 would leave it un-dimmed and clickable (matches the
            wizard's own modals). */}
        <DialogContent
          overlayClassName="z-[10000]"
          className="z-[10000] max-w-5xl w-[95vw] max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden rounded-2xl"
        >
          {/* pr-12 keeps the title clear of the built-in close X. */}
          <DialogHeader className="px-6 pt-6 pb-3 pr-12 text-left">
            <DialogTitle className="text-base font-bold text-gray-900 flex items-center gap-2 min-w-0">
              <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="truncate">{data?.fileName || displayName}</span>
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 min-h-0 flex-1">
            {preview.status === "loading" && (
              <div className="h-48 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                Loading preview…
              </div>
            )}

            {preview.status === "error" && (
              <div className="h-48 flex flex-col items-center justify-center gap-3 text-center">
                <AlertTriangle className="w-8 h-8 text-amber-500" />
                <p className="text-sm text-gray-700 max-w-md">
                  {preview.message}
                </p>
                {!preview.missing && (
                  <button
                    type="button"
                    className={btn}
                    onClick={() => void fetchPreview()}
                  >
                    <RefreshCw className="w-3 h-3" />
                    Retry
                  </button>
                )}
              </div>
            )}

            {data && (
              <div className="max-h-[60vh] overflow-auto rounded-xl border border-gray-200">
                <table className="min-w-full border-separate border-spacing-0 text-[11px] font-mono">
                  <thead>
                    <tr>
                      <th className="sticky top-0 left-0 z-20 bg-gray-50 border-b border-r border-gray-200 px-2 py-1.5 text-left font-semibold text-gray-400 w-10">
                        #
                      </th>
                      {cols.map((h, i) => (
                        <th
                          key={i}
                          title={h}
                          className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200 px-3 py-1.5 text-left font-semibold text-gray-600 whitespace-nowrap"
                        >
                          {h || (
                            <span className="italic text-gray-300">(blank)</span>
                          )}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.rows.length === 0 && (
                      <tr>
                        <td
                          colSpan={colCount + 1}
                          className="px-3 py-6 text-center text-gray-400 font-sans text-xs"
                        >
                          This file has a header row but no data rows.
                        </td>
                      </tr>
                    )}
                    {data.rows.map((row, r) => (
                      // Opaque row backgrounds so the sticky "#" cell hides scrolled content.
                      <tr key={r} className={r % 2 ? "bg-gray-50" : "bg-white"}>
                        <td className="sticky left-0 z-[1] bg-inherit border-b border-r border-gray-100 px-2 py-1 text-gray-400 tabular-nums">
                          {r + 1}
                        </td>
                        {cols.map((_, c) => {
                          const v = row[c] ?? "";
                          return (
                            <td
                              key={c}
                              className="border-b border-gray-100 px-3 py-1 whitespace-nowrap text-gray-800"
                            >
                              <div className="max-w-[16rem] truncate" title={v}>
                                {v}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <DialogFooter className="px-6 py-4 mt-4 border-t border-gray-100 sm:justify-between items-center gap-2">
            <span className="text-[11px] text-gray-400">{rowsLabel}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={btn}
                disabled={downloading}
                onClick={() => void handleDownload()}
              >
                {downloading ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Download className="w-3 h-3" />
                )}
                Download
              </button>
              <DialogClose asChild>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 rounded-lg text-xs font-semibold bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
              </DialogClose>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
