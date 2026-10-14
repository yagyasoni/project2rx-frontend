import type { Metadata, Viewport } from "next";
import "./globals.css";
import LayoutClient from "./LayoutClient";
import { GoogleTagManager } from "@next/third-parties/google";

const SITE_URL = "https://www.auditprorx.com";
const SITE_NAME = "AuditProRx";
const DEFAULT_TITLE =
  "AuditProRx | Pharmacy Audit Software & PBM Compliance Platform";
const DEFAULT_DESCRIPTION =
  "Pharmacy audit software for independent pharmacies. Automate PBM audit defense, reconcile wholesaler invoices, and protect revenue — HIPAA compliant.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: "%s | AuditProRx",
  },
  description: DEFAULT_DESCRIPTION,
  applicationName: SITE_NAME,
  generator: "Next.js",
  keywords: [
    "pharmacy audit software",
    "pharmacy audit management",
    "PBM audit defense",
    "PBM audit response software",
    "pharmacy compliance software",
    "pharmacy inventory audit",
    "wholesaler reconciliation",
    "NDC inventory audit",
    "invoice to dispense reconciliation",
    "BIN PCN lookup",
    "BIN PCN Group lookup",
    "HIPAA pharmacy software",
    "independent pharmacy software",
    "PrimeRx audit reports",
    "McKesson reconciliation",
    "AXIA pharmacy reconciliation",
    "Kinray reconciliation",
    "Anda pharmacy reconciliation",
    "pharmacy recoupment recovery",
    "automated pharmacy audit",
    "aberrant dispensing report",
    "pharmacy audit defense platform",
    "AuditProRx",
  ],
  authors: [{ name: "AuditProRx", url: SITE_URL }],
  creator: "AuditProRx",
  publisher: "AuditProRx",
  category: "Healthcare Software",
  classification: "Pharmacy Audit & Compliance SaaS",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AuditProRx — Pharmacy Audit Software & PBM Compliance Platform",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ["/opengraph-image"],
    creator: "@auditprorx",
    site: "@auditprorx",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // icons are auto-detected from app/icon.tsx and app/apple-icon.tsx (Next.js convention)
  manifest: "/manifest.webmanifest",
  verification: {
    // Add the value from Google Search Console once verified.
    google: "SoCFhHj5dE1nCqezRhJhRTUMKTBvsuq199YSisXoVso",
    // yandex: "REPLACE_WITH_YANDEX_TOKEN",
    other: {
      // "msvalidate.01": "REPLACE_WITH_BING_VERIFICATION_TOKEN",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "light dark",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  legalName: "AuditProRx",
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  description: DEFAULT_DESCRIPTION,
  email: "drugdroprx@gmail.com",
  foundingDate: "2026",
  areaServed: "US",
  sameAs: [
    "https://www.linkedin.com/company/auditprorx/",
    "https://x.com/auditprorx",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "drugdroprx@gmail.com",
      availableLanguage: ["English"],
      areaServed: "US",
    },
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/bin-search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <GoogleTagManager gtmId="GTM-NZ8KRHJ4" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://js.stripe.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
