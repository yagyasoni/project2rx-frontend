import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AuditProRx — Pharmacy Audit Software",
    short_name: "AuditProRx",
    description:
      "Pharmacy audit software for independent pharmacies. Automate PBM audit responses, reconcile wholesaler invoices, and protect revenue.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a0a0a",
    orientation: "portrait-primary",
    categories: ["business", "medical", "productivity", "healthcare"],
    lang: "en-US",
    icons: [
      {
        src: "/icon.png",
        sizes: "500x500",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon.png",
        sizes: "500x500",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
