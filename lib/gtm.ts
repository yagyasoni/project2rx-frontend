// Pushes events to the GTM dataLayer. GTM decides which tags fire.
// Never pass PHI (patient names, Rx numbers, DOB, emails, phones, NPI, file
// contents or search terms) — send counts and plan names only.
type DataLayerEvent = { event: string; [key: string]: unknown };

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackEvent(data: DataLayerEvent) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

// Shared id for the browser Pixel event and the server CAPI event, so Meta
// counts the conversion once.
export function newEventId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID)
    return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

// Meta Pixel cookies (_fbp browser id, _fbc ad-click id). Sent to the backend
// so CAPI events can be matched to the ad click.
export function getMetaCookies(): { fbp?: string; fbc?: string } {
  if (typeof document === "undefined") return {};
  const read = (name: string) =>
    document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${name}=`))
      ?.split("=")[1];
  return { fbp: read("_fbp"), fbc: read("_fbc") };
}

// GA4 client_id from the _ga cookie (e.g. "GA1.1.1234567890.1700000000").
// Sent to the backend so Measurement Protocol events are stitched to the
// same user session that was tracked in the browser.
export function getGA4ClientId(): string | undefined {
  if (typeof document === "undefined") return undefined;
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith("_ga="))
    ?.split("=")[1];
  if (!raw) return undefined;
  // Strip the "GA1.1." prefix — the client_id is the last two segments
  const parts = raw.split(".");
  if (parts.length >= 4) return `${parts[2]}.${parts[3]}`;
  return raw;
}
