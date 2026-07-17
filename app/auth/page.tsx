import type { Metadata } from "next";
import AuthClient from "./AuthClient";

const SITE_URL = "https://www.auditprorx.com";
const TITLE = "Sign In or Create an Account";
const DESCRIPTION =
  "Sign in or start a 14-day free trial of AuditProRx — pharmacy audit software trusted by independent pharmacies to automate PBM audits & reconciliation.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: SITE_URL + "/auth" },
  openGraph: {
    type: "website",
    url: SITE_URL + "/auth",
    siteName: "AuditProRx",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Sign in to AuditProRx — Pharmacy Audit Software",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/opengraph-image"],
  },
  keywords: [
    "AuditProRx login",
    "AuditProRx sign up",
    "pharmacy audit software free trial",
    "PBM audit software login",
    "pharmacy compliance software signup",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
};

export default function Page() {
  return (
    <>
      {/* Server-rendered so crawlers get real content: AuthClient calls
          useSearchParams, which bails its whole tree out to client-side
          rendering, leaving only a "Loading..." shell in the initial HTML. */}
      <header className="sr-only">
        <h1>Sign in to AuditProRx — Pharmacy Audit Software</h1>
        <p>
          Log in to your AuditProRx account or create one to automate PBM audit
          defense, reconcile McKesson, AXIA, Kinray and Anda wholesaler
          invoices, and protect your independent pharmacy&apos;s revenue.
        </p>
      </header>
      <AuthClient />
    </>
  );
}
