import type { Metadata } from "next";
import AuthClient from "./AuthClient";

const SITE_URL = "https://www.auditprorx.com";
const TITLE = "Sign In or Create a Free AuditProRx Account";
const DESCRIPTION =
  "Log in to AuditProRx or register your independent pharmacy in minutes. Start a 7-day free trial of the pharmacy audit software trusted to automate PBM responses, wholesaler reconciliation, and NDC inventory audits.";

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
  return <AuthClient />;
}
