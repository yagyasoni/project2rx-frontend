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
import { ArrowRight, Eye, Lock, ShieldCheck, UserCheck } from "lucide-react";

const PATH = "/support/remote-assistance";

export const metadata: Metadata = {
  title: "Remote Assistance — AuditProRx Guided Pharmacy Support",
  description:
    "Book guided remote assistance from the AuditProRx team. Learn how a secure remote support session works, what to prepare, and how we protect your pharmacy data.",
  keywords: [
    "AuditProRx remote assistance",
    "pharmacy software remote support",
    "guided pharmacy audit session",
    "HIPAA remote support",
  ],
  alternates: { canonical: SITE_URL + PATH },
  openGraph: {
    type: "website",
    url: SITE_URL + PATH,
    siteName: "AuditProRx",
    title: "Remote Assistance | AuditProRx",
    description:
      "Book a secure, guided remote support session with the AuditProRx pharmacy team.",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AuditProRx Remote Assistance",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Remote Assistance | AuditProRx",
    description:
      "Book a secure, guided remote support session with the AuditProRx pharmacy team.",
  },
  robots: { index: true, follow: true },
};

const howItWorks = [
  [
    "Book a time",
    "Pick a slot that works around your dispensing hours. Sessions are scheduled, never unannounced.",
  ],
  [
    "We confirm by email",
    "You receive a confirmation with the session link and a short list of what to have open.",
  ],
  [
    "We work through it together",
    "You share your screen and stay in control the entire time. We guide you through the workflow, answer questions, and hand the wheel back.",
  ],
];

const privacy = [
  [
    UserCheck,
    "You stay in control",
    "You initiate the screen share and can end the session at any moment. Nothing runs unattended.",
  ],
  [
    Eye,
    "We look at only what's needed",
    "Sessions stay scoped to the workflow you asked about. If patient data is on screen, we ask you to close it first.",
  ],
  [
    Lock,
    "No PHI is retained",
    "We do not record sessions or retain protected health information from what appears on your screen.",
  ],
  [
    ShieldCheck,
    "HIPAA-aligned practices",
    "Remote support follows the same HIPAA-aligned handling standards as the rest of the platform.",
  ],
] as const;

const SESSION_SUBJECT = "Remote Assistance Request";
const SESSION_BODY = `Hi AuditProRx team,

I'd like to book a remote assistance session.

Pharmacy name:
What I need help with:
Preferred times:

Thank you.`;

export default function RemoteAssistance() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Support", "Remote Assistance", PATH)} />
      <Navbar />
      <PageShell>
        <PageHeader
          eyebrow="Remote Assistance"
          title="Remote Assistance"
          lead="Some problems are faster to solve together than over email. Book a scheduled session and a member of our team will walk through AuditProRx with you, on your screen, at your pace."
        />

        <Prose>
          <Block title="What Remote Assistance Is">
            <p>
              A remote assistance session is a scheduled, guided screen-share
              with someone on the AuditProRx team. We use it to help you
              generate your first audit report, track down a wholesaler file
              that will not reconcile, interpret a PBM lookup result, or get a
              new team member comfortable with the platform.
            </p>
            <p className="mt-4">
              It is a walkthrough, not remote control of your machine. You drive;
              we guide.
            </p>
          </Block>

          <Block title="How It Works" delay={1}>
            <ol className="space-y-4">
              {howItWorks.map(([title, copy], i) => (
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

          <Block title="What To Prepare" delay={2}>
            <p className="mb-4">
              A few minutes of setup makes the session far more productive:
            </p>
            <ul className="space-y-3">
              <li>
                <span className="font-medium text-white">
                  Access to your pharmacy management system
                </span>{" "}
                — signed in and ready, so we can export inventory if needed.
              </li>
              <li>
                <span className="font-medium text-white">
                  Recent wholesaler invoice files
                </span>{" "}
                — the CSVs covering the audit period you are working on.
              </li>
              <li>
                <span className="font-medium text-white">
                  The specific question
                </span>{" "}
                — the report, drug, or claim that prompted the session.
              </li>
              <li>
                <span className="font-medium text-white">
                  A stable connection
                </span>{" "}
                — and, if possible, a quiet moment away from the counter.
              </li>
            </ul>
          </Block>

          <Block title="Privacy & HIPAA" delay={3}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {privacy.map(([Icon, title, copy]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-border bg-surface p-6"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface-2">
                    <Icon className="h-5 w-5 text-success" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {copy}
                  </p>
                </div>
              ))}
            </div>
          </Block>

          <Block title="Book a Session" delay={4}>
            <p className="mb-6">
              Pick a time that suits your pharmacy, or reach out and we will
              find one together. We typically respond within a few business
              hours.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={primaryButton}
              >
                Schedule a Session <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={emailLink(SESSION_SUBJECT, SESSION_BODY)}
                target="_blank"
                rel="noopener noreferrer"
                className={secondaryButton}
              >
                Email {SUPPORT_EMAIL}
              </a>
            </div>
            <a
              href={whatsappLink(
                "Hi AuditProRx team,\n\nI'd like to book a remote assistance session.\n\nThank you.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex text-white underline underline-offset-4 hover:text-muted-foreground"
            >
              Or message us on WhatsApp at {SUPPORT_PHONE}
            </a>
          </Block>

          <Block title="Prefer To Self-Serve?" delay={5}>
            <p>
              The{" "}
              <a
                href="/support/documentation"
                className="text-white underline underline-offset-4 hover:text-muted-foreground"
              >
                Documentation
              </a>{" "}
              covers the full audit workflow, and the{" "}
              <a
                href="/support/help-center"
                className="text-white underline underline-offset-4 hover:text-muted-foreground"
              >
                Help Center
              </a>{" "}
              answers the most common questions.
            </p>
          </Block>
        </Prose>
      </PageShell>
      <Footer />
    </>
  );
}
