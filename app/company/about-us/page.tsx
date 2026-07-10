import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import {
  SITE_URL,
  BOOKING_URL,
  Block,
  Card,
  JsonLd,
  PageHeader,
  PageShell,
  Prose,
  breadcrumbJsonLd,
  primaryButton,
  secondaryButton,
} from "@/components/marketing/marketing-ui";
import type { Metadata } from "next";
import {
  ArrowRight,
  FileText,
  LifeBuoy,
  Network,
  SearchCode,
  Settings2,
  ShieldCheck,
  Users,
} from "lucide-react";

const PATH = "/company/about-us";

export const metadata: Metadata = {
  title: "About AuditProRx — Pharmacy Audit & PBM Compliance Software",
  description:
    "Learn about AuditProRx, the HIPAA-compliant pharmacy audit software helping independent pharmacies win PBM audits, reconcile wholesaler invoices, and recover lost reimbursement.",
  keywords: [
    "about AuditProRx",
    "pharmacy audit software company",
    "PBM audit defense",
    "independent pharmacy software",
    "pharmacy compliance platform",
  ],
  alternates: { canonical: SITE_URL + PATH },
  openGraph: {
    type: "website",
    url: SITE_URL + PATH,
    siteName: "AuditProRx",
    title: "About AuditProRx | Pharmacy Audit Software",
    description:
      "The HIPAA-compliant pharmacy audit platform built by pharmacists to protect independent pharmacy revenue from PBM recoupments.",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "About AuditProRx",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "About AuditProRx | Pharmacy Audit Software",
    description:
      "Built by pharmacists to protect independent pharmacy revenue from PBM recoupments.",
  },
  robots: { index: true, follow: true },
};

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "About AuditProRx",
  url: SITE_URL + PATH,
  description:
    "AuditProRx is a HIPAA-compliant pharmacy audit compliance platform for independent pharmacies.",
  mainEntity: {
    "@type": "Organization",
    name: "AuditProRx",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.png`,
    foundingDate: "2026",
    description:
      "Pharmacy audit software that automates PBM audit defense, wholesaler reconciliation, and NDC inventory audits for independent pharmacies.",
    sameAs: [
      "https://www.linkedin.com/company/auditprorx/",
      "https://x.com/auditprorx",
    ],
  },
};

const pillars = [
  [
    FileText,
    "Inventory Audit Reports",
    "Generate pharmacy audit reports with wholesaler, NDC, and billing reconciliation in minutes instead of days.",
  ],
  [
    SearchCode,
    "Digital Drug Lookup",
    "Search 60,000+ drugs by NDC, brand, or generic name with real-time PBM reference data.",
  ],
  [
    Users,
    "Reimbursement Leads",
    "Access curated reimbursement opportunities, profitable drug leads, and payer insights.",
  ],
  [
    Network,
    "Pharmacy Inventory Network",
    "Connect with other pharmacies to buy, sell, and manage short-dated or excess inventory.",
  ],
  [
    Settings2,
    "Admin Automation",
    "Simplify operations with automated workflows, reminders, and document management.",
  ],
  [
    LifeBuoy,
    "Product Support Hub",
    "Direct access to onboarding help, documentation, and pharmacy-focused assistance.",
  ],
] as const;

export default function AboutUs() {
  return (
    <>
      <JsonLd data={aboutJsonLd} />
      <JsonLd data={breadcrumbJsonLd("Company", "About Us", PATH)} />
      <Navbar />
      <PageShell>
        <PageHeader
          eyebrow="About Us"
          title="About AuditProRx"
          lead="AuditProRx is the pharmacy audit compliance platform independent pharmacies use to defend against PBM audits, reconcile wholesaler invoices against dispensed claims, and recover reimbursement they would otherwise lose."
        />

        <Prose>
          <Block title="Our Mission">
            <p>
              Independent pharmacies lose real revenue to PBM recoupments,
              billing discrepancies, and inventory that never reconciles against
              what was actually dispensed. Most of it is recoverable — but only
              if you can prove it, and proving it by hand across spreadsheets
              takes days a pharmacy team does not have.
            </p>
            <p className="mt-4">
              We built AuditProRx to close that gap. Our mission is to give
              every independent pharmacy the same audit defense capability that
              large chains take for granted, in software that a pharmacist can
              run without a data analyst.
            </p>
          </Block>

          <Block title="What We Do" delay={1}>
            <p className="mb-6">
              AuditProRx brings the full pharmacy audit workflow into one
              platform:
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {pillars.map(([Icon, title, copy]) => (
                <Card key={title}>
                  <div className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {copy}
                  </p>
                </Card>
              ))}
            </div>
            <p className="mt-6 text-muted-foreground">
              Aberrant Reports and Analytics are in active development and will
              join the platform soon.
            </p>
          </Block>

          <Block title="How We're Different" delay={2}>
            <ul className="space-y-3">
              <li>
                <span className="font-medium text-white">
                  Built by pharmacists.
                </span>{" "}
                The workflows mirror how audits actually arrive and how
                pharmacies actually respond — not how a generic reporting tool
                imagines they do.
              </li>
              <li>
                <span className="font-medium text-white">
                  HIPAA-compliant from day one.
                </span>{" "}
                Patient data is encrypted in transit and at rest, with
                role-based access control across your team.
              </li>
              <li>
                <span className="font-medium text-white">
                  Works with the systems you already run.
                </span>{" "}
                We ingest PrimeRx pharmacy management system exports and
                standard wholesaler CSVs from McKesson, AXIA, Kinray, and Anda,
                then resolve PBM identity from BIN, PCN, and Group codes
                automatically.
              </li>
              <li>
                <span className="font-medium text-white">
                  Month-to-month, no long-term contract.
                </span>{" "}
                Onboarding takes minutes, and you are never locked in.
              </li>
            </ul>
          </Block>

          <Block title="Security & Compliance" delay={3}>
            <div className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-6">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-success" />
              <p className="text-muted-foreground">
                AuditProRx is engineered around HIPAA-aligned practices.
                Protected health information is encrypted in transit and at
                rest, access is tightly scoped by role, and pharmacy data is
                never sold or shared for marketing purposes.
              </p>
            </div>
          </Block>

          <Block title="Company Facts" delay={4}>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                ["Founded", "2026"],
                ["Focus", "Independent U.S. pharmacies"],
                ["Compliance", "HIPAA-aligned"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-border bg-surface p-5"
                >
                  <dt className="text-xs uppercase tracking-wider text-muted-foreground">
                    {label}
                  </dt>
                  <dd className="mt-2 text-base font-semibold text-white">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-6">
              Follow our work on{" "}
              <a
                href="https://www.linkedin.com/company/auditprorx/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline underline-offset-4 hover:text-muted-foreground"
              >
                LinkedIn
              </a>{" "}
              and{" "}
              <a
                href="https://x.com/auditprorx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white underline underline-offset-4 hover:text-muted-foreground"
              >
                X
              </a>
              .
            </p>
          </Block>

          <Block title="Talk To Us" delay={5}>
            <p className="mb-6">
              See how AuditProRx would handle your pharmacy&apos;s next audit.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={primaryButton}
              >
                Schedule a Consultation <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/company/contact" className={secondaryButton}>
                Contact Us
              </a>
            </div>
          </Block>
        </Prose>
      </PageShell>
      <Footer />
    </>
  );
}
