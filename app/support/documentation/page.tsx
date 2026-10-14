import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import {
  SITE_URL,
  Block,
  JsonLd,
  PageHeader,
  PageShell,
  Prose,
  breadcrumbJsonLd,
  primaryButton,
  secondaryButton,
} from "@/components/marketing/marketing-ui";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

const PATH = "/support/documentation";

export const metadata: Metadata = {
  title: "Documentation — AuditProRx Pharmacy Audit Software Guides",
  description:
    "AuditProRx documentation: generate inventory audit reports, reconcile McKesson, AXIA, Kinray, and Anda wholesaler CSVs, use the NDC drug lookup, and run BIN/PCN/Group PBM lookups.",
  keywords: [
    "AuditProRx documentation",
    "pharmacy audit report guide",
    "wholesaler CSV reconciliation",
    "NDC inventory audit",
    "BIN PCN group PBM lookup",
    "PrimeRx integration",
  ],
  alternates: { canonical: SITE_URL + PATH },
  openGraph: {
    type: "article",
    url: SITE_URL + PATH,
    siteName: "AuditProRx",
    title: "Documentation | AuditProRx",
    description:
      "Guides for generating pharmacy audit reports, reconciling wholesaler invoices, and running PBM lookups in AuditProRx.",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AuditProRx Documentation",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Documentation | AuditProRx",
    description:
      "Guides for pharmacy audit reports, wholesaler reconciliation, and PBM lookups.",
  },
  robots: { index: true, follow: true },
};

const docJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "AuditProRx Documentation",
  description:
    "How to generate pharmacy inventory audit reports, reconcile wholesaler CSVs, use the NDC drug lookup, and resolve PBMs by BIN, PCN, and Group code.",
  url: SITE_URL + PATH,
  inLanguage: "en-US",
  about: "Pharmacy audit compliance software",
  author: { "@type": "Organization", name: "AuditProRx", url: SITE_URL },
  publisher: {
    "@type": "Organization",
    name: "AuditProRx",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/icon.png`,
    },
  },
};

const steps = [
  [
    "Create the audit",
    "Start a new audit and give it a name that identifies the payer or period you are defending.",
  ],
  [
    "Upload your inventory",
    "Export your inventory from your pharmacy management system and upload the CSV. AuditProRx normalizes the header row, so PrimeRx exports work as-is.",
  ],
  [
    "Set the date range",
    "Choose the purchase and dispense window the audit covers. Everything downstream is scoped to this range.",
  ],
  [
    "Upload wholesaler files",
    "Add the invoice CSVs from each wholesaler you purchased from — McKesson, AXIA, Kinray, and Anda are all supported. Header formats differ between wholesalers; AuditProRx maps them for you.",
  ],
  [
    "Generate the report",
    "AuditProRx joins inventory against wholesaler purchases by NDC, resolves the PBM behind each claim, and aggregates the financial metrics per drug.",
  ],
];

export default function Documentation() {
  return (
    <>
      <JsonLd data={docJsonLd} />
      <JsonLd data={breadcrumbJsonLd("Support", "Documentation", PATH)} />
      <Navbar />
      <PageShell>
        <PageHeader
          eyebrow="Documentation"
          title="AuditProRx Documentation"
          lead="Everything you need to run a pharmacy audit end to end — connecting your pharmacy management system, reconciling wholesaler invoices against dispensed claims, and reading the report AuditProRx produces."
        />

        <Prose>
          <Block title="Getting Started">
            <p>
              AuditProRx needs two inputs to reconcile an audit: what your
              pharmacy had on hand and dispensed, and what you actually
              purchased from your wholesalers. Most pharmacies are generating
              their first report within minutes of signing in.
            </p>
            <p className="mt-4">
              You will need a recent inventory export from your pharmacy
              management system (PrimeRx is supported directly) and the invoice
              CSVs from each wholesaler covering the audit period.
            </p>
          </Block>

          <Block title="Generating an Inventory Audit Report" delay={1}>
            <p className="mb-6">
              The audit wizard walks through five steps:
            </p>
            <ol className="space-y-4">
              {steps.map(([title, copy], i) => (
                <li key={title} className="flex gap-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-border bg-surface-2 text-xs font-semibold text-white">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      {title}
                    </h3>
                    <p className="mt-1 text-muted-foreground">{copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Block>

          <Block title="Digital Drug Lookup" delay={2}>
            <p>
              Search more than 60,000 drugs by NDC, brand name, or generic name.
              Each result carries the reference data you need while working an
              audit line, so you do not have to leave the platform to confirm a
              product.
            </p>
          </Block>

          <Block title="BIN, PCN, and Group PBM Lookup" delay={3}>
            <p>
              Claims identify their payer through three codes: the BIN (bank
              identification number), the PCN (processor control number), and
              the Group. AuditProRx resolves those codes against a maintained
              master reference sheet to name the PBM behind each claim, which is
              what lets a report group financial impact by payer rather than by
              raw code.
            </p>
            <p className="mt-4 text-muted-foreground">
              A note on precision: some PBMs share a BIN across very different
              plans. When a match resolves on BIN alone, confirm the PCN and
              Group before acting on it.
            </p>
          </Block>

          <Block title="Wholesaler File Formats" delay={4}>
            <p>
              Every wholesaler exports a slightly different header row.
              AuditProRx normalizes these automatically, so you can upload the
              file exactly as it was downloaded — no renaming columns, no
              reformatting.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {["McKesson", "AXIA", "Kinray", "Anda"].map((w) => (
                <span
                  key={w}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground"
                >
                  {w}
                </span>
              ))}
            </div>
          </Block>

          <Block title="Downloading Your Wholesaler Files" delay={5}>
            <p>
              Each wholesaler portal buries its invoice export in a different
              place. We maintain step-by-step guides with screenshots for every
              supported wholesaler inside the app — sign in and open the
              How-To section to follow along.
            </p>
            <a
              href="/auth"
              className="mt-5 inline-flex text-white underline underline-offset-4 hover:text-muted-foreground"
            >
              Sign in to view the guides
            </a>
          </Block>

          <Block title="Need a Hand?" delay={6}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a href="/support/help-center" className={primaryButton}>
                Visit the Help Center <ArrowRight className="h-4 w-4" />
              </a>
              <a href="/support/remote-assistance" className={secondaryButton}>
                Book Remote Assistance
              </a>
            </div>
          </Block>
        </Prose>
      </PageShell>
      <Footer />
    </>
  );
}
