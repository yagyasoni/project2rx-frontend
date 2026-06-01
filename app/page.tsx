import type { Metadata } from "next";
import HomeClient from "./HomeClient";

const SITE_URL = "https://www.auditprorx.com";
const TITLE =
  "Pharmacy Audit Software for Independent Pharmacies | AuditProRx";
const DESCRIPTION =
  "Cut PBM recoupments with pharmacy audit software built for independent pharmacies. Reconcile McKesson, AXIA, Kinray & Anda invoices. Free 7-day trial.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: SITE_URL + "/" },
  openGraph: {
    type: "website",
    url: SITE_URL + "/",
    siteName: "AuditProRx",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AuditProRx — Pharmacy Audit Software & PBM Compliance Platform",
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
    "pharmacy audit software",
    "PBM audit defense",
    "pharmacy compliance platform",
    "wholesaler reconciliation software",
    "NDC inventory audit",
    "McKesson reconciliation",
    "AXIA reconciliation",
    "Kinray reconciliation",
    "Anda reconciliation",
    "PrimeRx audit reports",
    "independent pharmacy software",
    "HIPAA pharmacy software",
    "automated pharmacy audit",
    "pharmacy recoupment recovery",
    "AuditProRx",
  ],
};

const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AuditProRx",
  applicationCategory: "BusinessApplication",
  applicationSubCategory: "Pharmacy Audit & Compliance Software",
  operatingSystem: "Web",
  url: SITE_URL,
  description: DESCRIPTION,
  brand: { "@type": "Brand", name: "AuditProRx" },
  publisher: { "@type": "Organization", name: "AuditProRx", url: SITE_URL },
  offers: {
    "@type": "Offer",
    name: "Professional Plan",
    price: "99",
    priceCurrency: "USD",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: "99",
      priceCurrency: "USD",
      referenceQuantity: {
        "@type": "QuantitativeValue",
        value: 1,
        unitCode: "MON",
      },
    },
    availability: "https://schema.org/InStock",
    url: SITE_URL + "/auth",
    eligibleRegion: { "@type": "Country", name: "US" },
  },
  featureList: [
    "Automated PBM audit response",
    "Wholesaler invoice reconciliation (McKesson, AXIA, Kinray, Anda)",
    "NDC inventory audit reports",
    "BIN / PCN / Group code lookup",
    "Real-time discrepancy alerts",
    "HIPAA-compliant data handling",
    "Multi-store support",
    "Compliance-ready exportable reports",
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "5",
    bestRating: "5",
    worstRating: "1",
    ratingCount: "3",
    reviewCount: "3",
  },
  review: [
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Dr. Uzair Chachar" },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody:
        "AuditProRx has really streamlined how we handle audits. It saves us time and helps us stay more organized.",
      publisher: { "@type": "Organization", name: "Life Care Pharmacy" },
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Dr. Irfan Ali" },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody:
        "Managing documentation and claims has become much easier. The system is simple and very efficient.",
      publisher: { "@type": "Organization", name: "Bergen Road Pharmacy" },
    },
    {
      "@type": "Review",
      author: { "@type": "Person", name: "Dr. Khilat Abbas" },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody:
        "The workflow is smooth and easy to follow. It's a helpful tool for improving our overall audit process.",
      publisher: { "@type": "Organization", name: "United Drugs" },
    },
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How fast can my pharmacy get started with AuditProRx?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most pharmacies are fully onboarded in minutes. Connect your pharmacy management system (PMS), upload your inventory CSV, add your wholesaler files (McKesson, AXIA, Kinray, Anda), and AuditProRx automatically generates compliance-ready audit reports.",
      },
    },
    {
      "@type": "Question",
      name: "Is AuditProRx HIPAA compliant?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. AuditProRx is built with enterprise-grade security and is fully HIPAA compliant. Patient data is encrypted in transit and at rest, and access is tightly controlled with role-based permissions.",
      },
    },
    {
      "@type": "Question",
      name: "Which pharmacy management systems does AuditProRx integrate with?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AuditProRx supports all major pharmacy management systems including PrimeRx, and ingests standard CSV exports from wholesalers like McKesson, AXIA, Kinray, and Anda for invoice-to-dispense reconciliation.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need a long-term contract to use AuditProRx?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. AuditProRx is a month-to-month subscription with no long-term contract. The Professional plan is $99 per month and includes a 7-day full-access free trial.",
      },
    },
    {
      "@type": "Question",
      name: "What kind of support does AuditProRx provide?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every subscription includes priority email support from the AuditProRx team. We help with onboarding, integration questions, and audit workflow guidance so your pharmacy is protected from day one.",
      },
    },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL + "/",
    },
  ],
};

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <HomeClient />
    </>
  );
}
