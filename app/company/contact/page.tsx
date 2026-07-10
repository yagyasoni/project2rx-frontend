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
  whatsappLink,
} from "@/components/marketing/marketing-ui";
import type { Metadata } from "next";
import { ArrowRight, CalendarClock, Mail, MessageCircle } from "lucide-react";

const PATH = "/company/contact";

export const metadata: Metadata = {
  title: "Contact AuditProRx — Pharmacy Audit Software Support",
  description:
    "Get in touch with AuditProRx. Reach our pharmacy audit support team by email or WhatsApp, or book a consultation. We typically respond within a few business hours.",
  keywords: [
    "contact AuditProRx",
    "pharmacy audit software support",
    "AuditProRx support email",
    "pharmacy software demo",
  ],
  alternates: { canonical: SITE_URL + PATH },
  openGraph: {
    type: "website",
    url: SITE_URL + PATH,
    siteName: "AuditProRx",
    title: "Contact AuditProRx",
    description:
      "Reach the AuditProRx pharmacy audit support team by email or WhatsApp, or book a consultation.",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Contact AuditProRx",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Contact AuditProRx",
    description:
      "Reach our pharmacy audit support team by email or WhatsApp, or book a consultation.",
  },
  robots: { index: true, follow: true },
};

const contactJsonLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact AuditProRx",
  url: SITE_URL + PATH,
  description:
    "Contact the AuditProRx pharmacy audit support team by email, WhatsApp, or scheduled consultation.",
  mainEntity: {
    "@type": "Organization",
    name: "AuditProRx",
    url: SITE_URL,
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "Customer Support",
        email: SUPPORT_EMAIL,
        telephone: SUPPORT_PHONE,
        areaServed: "US",
        availableLanguage: ["English"],
      },
    ],
  },
};

const GREETING = "Hi AuditProRx team,";

const WHATSAPP_MESSAGE = `${GREETING}

I would like to get in touch regarding AuditProRx.

Please let me know a convenient time to connect.

Thank you.`;

const EMAIL_SUBJECT = "AuditProRx Inquiry";
const EMAIL_BODY = `${GREETING}

I would like to learn more about AuditProRx.

Pharmacy name:
What I'm looking for:

Thank you.`;

const channels = [
  {
    Icon: MessageCircle,
    eyebrow: "WhatsApp",
    value: SUPPORT_PHONE,
    copy: "Instant support & quick responses",
    href: whatsappLink(WHATSAPP_MESSAGE),
  },
  {
    Icon: Mail,
    eyebrow: "Email",
    value: SUPPORT_EMAIL,
    copy: "Best for detailed discussions",
    href: emailLink(EMAIL_SUBJECT, EMAIL_BODY),
  },
  {
    Icon: CalendarClock,
    eyebrow: "Book a call",
    value: "Schedule a consultation",
    copy: "Walk through your audit workflow with our team",
    href: BOOKING_URL,
  },
];

export default function Contact() {
  return (
    <>
      <JsonLd data={contactJsonLd} />
      <JsonLd data={breadcrumbJsonLd("Company", "Contact", PATH)} />
      <Navbar />
      <PageShell>
        <PageHeader
          eyebrow="Contact"
          title="Contact AuditProRx"
          lead="Questions about pharmacy audit reports, wholesaler reconciliation, or pricing? Reach the team directly — we typically respond within a few business hours."
        />

        <Prose>
          <Block title="Ways To Reach Us">
            <div className="space-y-4">
              {channels.map(({ Icon, eyebrow, value, copy, href }) => (
                <a
                  key={eyebrow}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors hover:bg-surface-2"
                >
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-border bg-surface-2">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
                      {eyebrow}
                    </span>
                    <p className="mt-1 truncate text-sm font-semibold text-white">
                      {value}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{copy}</p>
                  </div>

                  <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-white" />
                </a>
              ))}
            </div>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Typically responds within a few business hours.
            </p>
          </Block>

          <Block title="What To Include" delay={1}>
            <p>
              To get you a useful answer on the first reply, it helps to tell us
              your pharmacy name, which pharmacy management system you run
              (for example PrimeRx), which wholesalers you purchase from
              (McKesson, AXIA, Kinray, Anda), and what you&apos;re trying to
              accomplish — defending an active audit, reconciling inventory, or
              evaluating the platform.
            </p>
          </Block>

          <Block title="Support & Documentation" delay={2}>
            <p>
              Already a customer? The{" "}
              <a
                href="/support/help-center"
                className="text-white underline underline-offset-4 hover:text-muted-foreground"
              >
                Help Center
              </a>{" "}
              answers the most common questions, the{" "}
              <a
                href="/support/documentation"
                className="text-white underline underline-offset-4 hover:text-muted-foreground"
              >
                Documentation
              </a>{" "}
              covers the full audit workflow, and{" "}
              <a
                href="/support/remote-assistance"
                className="text-white underline underline-offset-4 hover:text-muted-foreground"
              >
                Remote Assistance
              </a>{" "}
              lets you book a guided session with our team.
            </p>
          </Block>

          <Block title="See It On Your Own Data" delay={3}>
            <p className="mb-6">
              Book a walkthrough and we&apos;ll show you how AuditProRx would
              handle your pharmacy&apos;s next audit.
            </p>
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={primaryButton}
            >
              Schedule a Consultation <ArrowRight className="h-4 w-4" />
            </a>
          </Block>
        </Prose>
      </PageShell>
      <Footer />
    </>
  );
}
