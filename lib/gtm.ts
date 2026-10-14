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
