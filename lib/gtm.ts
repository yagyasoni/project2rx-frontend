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
