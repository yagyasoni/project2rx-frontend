// Helpers for the Preview / Download actions on CSVs the backend keeps on disk
// (audit-backend uploads/inventory and uploads/wholesalers).
// Used by components/StoredCsvActions.tsx and the two upload wizard steps.

/**
 * Multer stores uploads as `${Date.now()}-${original_with_underscores}`.
 * Strip that epoch prefix for display and for the download filename.
 */
export const prettyUploadName = (name?: string | null): string =>
  (name ?? "").replace(/^\d+-/, "");

export const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1_048_576).toFixed(2)} MB`;
};

/** Stable identity for a local File object across re-renders and remounts. */
export const fileKey = (file: File): string =>
  `${file.name}|${file.size}|${file.lastModified}`;

// The wizard keeps the picked File in its own state, so it survives leaving and
// re-entering a step, while each step's "already uploaded" state resets on
// remount. This marker records which local File was successfully uploaded for
// an audit + scope, so a step can tell "already on the server" apart from
// "new, unsaved pick". sessionStorage survives HMR and remounts and dies with
// the tab. Only call these from effects/handlers, never during render (SSR).
const markerKey = (auditId: string, scope: string) =>
  `auditprorx:uploadedCsv:${auditId}:${scope}`;

export const writeUploadedMarker = (
  auditId: string,
  scope: string,
  file: File,
): void => {
  try {
    sessionStorage.setItem(markerKey(auditId, scope), fileKey(file));
  } catch {
    /* storage unavailable (private mode, quota) — feature degrades gracefully */
  }
};

export const readUploadedMarker = (
  auditId: string,
  scope: string,
): string | null => {
  try {
    return sessionStorage.getItem(markerKey(auditId, scope));
  } catch {
    return null;
  }
};

export const clearUploadedMarker = (auditId: string, scope: string): void => {
  try {
    sessionStorage.removeItem(markerKey(auditId, scope));
  } catch {
    /* ignore */
  }
};
