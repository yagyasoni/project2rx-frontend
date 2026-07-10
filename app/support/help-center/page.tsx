import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import {
  SITE_URL,
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  BOOKING_URL,
  Block,
  JsonLd,
  PageHeader,
  PageShell,
  Prose,
  breadcrumbJsonLd,
  emailLink,
  primaryButton,
  secondaryButton,
  whatsappLink,
} from "@/components/marketing/marketing-ui";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

const PATH = "/support/help-center";

export const metadata: Metadata = {
  title: "Help Center — AuditProRx Pharmacy Audit Support & FAQ",
  description:
    "AuditProRx Help Center: answers about pharmacy audit reports, wholesaler reconciliation, PBM lookups, pricing, HIPAA compliance, and how to reach support.",
  keywords: [
    "AuditProRx help center",
    "pharmacy audit software FAQ",
    "pharmacy audit support",
    "PBM audit questions",
    "AuditProRx pricing",
  ],
  alternates: { canonical: SITE_URL + PATH },
  openGraph: {
    type: "website",
    url: SITE_URL + PATH,
    siteName: "AuditProRx",
    title: "Help Center | AuditProRx",
    description:
      "Answers about pharmacy audit reports, wholesaler reconciliation, PBM lookups, pricing, and HIPAA compliance.",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AuditProRx Help Center",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Help Center | AuditProRx",
    description:
      "Answers about pharmacy audit reports, wholesaler reconciliation, pricing, and HIPAA compliance.",
  },
  robots: { index: true, follow: true },
};

/** Every answer below is rendered on the page — a requirement for FAQPage
 *  rich results. Keep this array as the single source for both. */
const faqs = [
  {
    q: "What is AuditProRx?",
    a: "AuditProRx is a pharmacy audit compliance platform for independent pharmacies. It reconciles your inventory against wholesaler purchase invoices by NDC, identifies the PBM behind each claim, and generates audit-ready reports that show exactly where revenue is at risk.",
  },
  {
    q: "How fast can my pharmacy get started?",
    a: "Most pharmacies are onboarded in minutes. Upload your inventory CSV, set the audit date range, add your wholesaler files, and AuditProRx generates a compliance-ready audit report.",
  },
  {
    q: "Which pharmacy systems and wholesalers are supported?",
    a: "AuditProRx works with PrimeRx pharmacy management system exports and ingests standard invoice CSVs from McKesson, AXIA, Kinray, and Anda. Header formats differ between wholesalers, so AuditProRx normalizes them automatically — upload the file exactly as you downloaded it.",
  },
  {
    q: "Is AuditProRx HIPAA compliant?",
    a: "Yes. AuditProRx is built with enterprise-grade security and HIPAA-aligned practices. Patient data is encrypted in transit and at rest, and access is controlled with role-based permissions across your team.",
  },
  {
    q: "How does pricing work?",
    a: "AuditProRx is a month-to-month subscription with no long-term contract. Base is $99 per month, Professional is $249 per month, and Full Access is $499 per month. You can cancel at any time.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. Every plan includes a 14-day free trial, activated with a coupon code. Contact our team at support@auditprorx.com and we will set you up.",
  },
  {
    q: "How does the PBM lookup work?",
    a: "Each claim carries a BIN, PCN, and Group code. AuditProRx resolves those codes against a maintained master reference sheet to name the PBM behind the claim, which lets your report group financial impact by payer instead of by raw code. Where a match resolves on BIN alone, confirm the PCN and Group before acting on it.",
  },
  {
    q: "How do I reach support?",
    a: "Email support@auditprorx.com, message us on WhatsApp at +1 (551) 229-6466, or book a consultation. We typically respond within a few business hours.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const HELP_SUBJECT = "AuditProRx Support Request";
const HELP_BODY = `Hi AuditProRx team,

I need help with the following:

Pharmacy name:
Question:

Thank you.`;

export default function HelpCenter() {
  return (
    <>
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd("Support", "Help Center", PATH)} />
      <Navbar />
      <PageShell>
        <PageHeader
          eyebrow="Help Center"
          title="AuditProRx Help Center"
          lead="Answers to the questions pharmacies ask most — about audit reports, wholesaler reconciliation, PBM lookups, pricing, and security. If you don't find what you need, our team is a message away."
        />

        <Prose>
          <Block title="Frequently Asked Questions">
            <div className="space-y-4">
              {faqs.map(({ q, a }, i) => (
                <div
                  key={q}
                  className="rounded-2xl border border-border bg-surface p-6 animate-fadeInUp"
                  style={{ animationDelay: `${0.3 + i * 0.06}s` }}
                >
                  <h3 className="text-base font-semibold text-white">{q}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {a}
                  </p>
                </div>
              ))}
            </div>
          </Block>

          <Block title="Dig Deeper" delay={2}>
            <p>
              The{" "}
              <a
                href="/support/documentation"
                className="text-white underline underline-offset-4 hover:text-muted-foreground"
              >
                Documentation
              </a>{" "}
              walks through the full audit workflow step by step, and{" "}
              <a
                href="/support/remote-assistance"
                className="text-white underline underline-offset-4 hover:text-muted-foreground"
              >
                Remote Assistance
              </a>{" "}
              lets you book a guided session where we work through your data
              together.
            </p>
          </Block>

          <Block title="Still Need Help?" delay={3}>
            <p className="mb-6">
              Reach the team directly. We typically respond within a few
              business hours.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={emailLink(HELP_SUBJECT, HELP_BODY)}
                target="_blank"
                rel="noopener noreferrer"
                className={primaryButton}
              >
                Email {SUPPORT_EMAIL} <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={whatsappLink(
                  "Hi AuditProRx team,\n\nI have a question about AuditProRx.\n\nThank you.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className={secondaryButton}
              >
                WhatsApp {SUPPORT_PHONE}
              </a>
            </div>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex text-white underline underline-offset-4 hover:text-muted-foreground"
            >
              Or schedule a consultation
            </a>
          </Block>
        </Prose>
      </PageShell>
      <Footer />
    </>
  );
}
