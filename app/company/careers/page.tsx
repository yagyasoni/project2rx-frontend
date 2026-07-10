import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import {
  SITE_URL,
  SUPPORT_EMAIL,
  Block,
  Card,
  JsonLd,
  PageHeader,
  PageShell,
  Prose,
  breadcrumbJsonLd,
  secondaryButton,
} from "@/components/marketing/marketing-ui";
import type { Metadata } from "next";
import { Compass, Gauge, HeartHandshake, ShieldCheck } from "lucide-react";

const PATH = "/company/careers";

export const metadata: Metadata = {
  title: "Careers at AuditProRx — Join a Pharmacy Software Startup",
  description:
    "Explore careers at AuditProRx. We build HIPAA-compliant pharmacy audit software for independent pharmacies. No open roles right now — send us your resume for future openings.",
  keywords: [
    "AuditProRx careers",
    "pharmacy software jobs",
    "healthcare SaaS careers",
    "pharmacy technology startup jobs",
  ],
  alternates: { canonical: SITE_URL + PATH },
  openGraph: {
    type: "website",
    url: SITE_URL + PATH,
    siteName: "AuditProRx",
    title: "Careers at AuditProRx",
    description:
      "Help build the pharmacy audit platform that protects independent pharmacy revenue.",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Careers at AuditProRx",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Careers at AuditProRx",
    description:
      "Help build the pharmacy audit platform that protects independent pharmacy revenue.",
  },
  robots: { index: true, follow: true },
};

const values = [
  [
    HeartHandshake,
    "Customer Oriented",
    "We talk to pharmacists before we write code. Every feature traces back to a real audit someone had to fight.",
  ],
  [
    ShieldCheck,
    "Compliance First",
    "We handle protected health information. Security and HIPAA alignment are design constraints, never an afterthought.",
  ],
  [
    Compass,
    "Ownership",
    "Small team, wide scope. You own problems end to end rather than a narrow slice of a ticket.",
  ],
  [
    Gauge,
    "Speed With Care",
    "We ship quickly, but never at the expense of the pharmacy data our customers trust us with.",
  ],
] as const;

export default function Careers() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd("Company", "Careers", PATH)} />
      <Navbar />
      <PageShell>
        <PageHeader
          eyebrow="Careers"
          title="Careers at AuditProRx"
          lead="We're a small, early-stage team building HIPAA-compliant pharmacy audit software for independent pharmacies. If protecting neighborhood pharmacies from PBM recoupments sounds like work worth doing, we'd like to hear from you."
        />

        <Prose>
          <Block title="Why This Work Matters">
            <p>
              Independent pharmacies operate on thin margins and face audits
              designed by organizations with far more resources than they have.
              A single recoupment can erase a month of profit. The tooling to
              fight back has historically been built for chains.
            </p>
            <p className="mt-4">
              We are building that tooling for everyone else. The work is
              concrete, the customers are reachable, and the impact of shipping
              something correct shows up on a real pharmacy&apos;s balance
              sheet.
            </p>
          </Block>

          <Block title="Our Values" delay={1}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {values.map(([Icon, title, copy]) => (
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
          </Block>

          <Block title="What It's Like Here" delay={2}>
            <ul className="space-y-3">
              <li>
                <span className="font-medium text-white">Remote-friendly.</span>{" "}
                We care about what you ship, not which chair you sit in.
              </li>
              <li>
                <span className="font-medium text-white">Direct impact.</span>{" "}
                On a team this size, your work reaches customers in days, not
                quarters.
              </li>
              <li>
                <span className="font-medium text-white">
                  Real domain depth.
                </span>{" "}
                You will learn how pharmacy reimbursement, PBM contracts, and
                wholesaler reconciliation actually work — knowledge that
                compounds.
              </li>
              <li>
                <span className="font-medium text-white">
                  Close to the customer.
                </span>{" "}
                Engineers join pharmacist calls. Nobody builds in a vacuum.
              </li>
            </ul>
          </Block>

          <Block title="Open Positions" delay={3}>
            <Card className="hover:bg-surface">
              <h3 className="text-base font-semibold text-white">
                No open roles at the moment
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                We aren&apos;t actively hiring for a specific position right
                now. That said, we review every resume that reaches us and
                reach out when a role opens that matches your background —
                engineering, pharmacy operations, or customer success.
              </p>
              <div className="mt-6">
                <a href="/company/about-us" className={secondaryButton}>
                  Learn About Us
                </a>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Applications go to {SUPPORT_EMAIL}. Please attach your resume
                and tell us what you&apos;d want to work on.
              </p>
            </Card>
          </Block>
        </Prose>
      </PageShell>
      <Footer />
    </>
  );
}
