import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const SITE_URL = "https://www.auditprorx.com";
export const SUPPORT_EMAIL = "support@auditprorx.com";
export const SUPPORT_PHONE = "+1 (551) 229-6466";
export const BOOKING_URL = "https://calendar.app.google/ekTAPx65xrwq2Qiv6";

export const whatsappLink = (message: string) =>
  `https://wa.me/${SUPPORT_PHONE.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

export const emailLink = (subject: string, body: string) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${SUPPORT_EMAIL}` +
  `&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

/** Home > Company > About Us. The middle crumb points at the site root because
 *  no /company or /support index route exists. */
export const breadcrumbJsonLd = (
  group: string,
  name: string,
  path: string,
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: group, item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 3, name, item: `${SITE_URL}${path}` },
  ],
});

export const JsonLd = ({ data }: { data: object }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
  />
);

export const Pill = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <span
    className={cn(
      "inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs tracking-wider text-muted-foreground uppercase animate-fadeInUp stagger-0",
      className,
    )}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70" />
    {children}
  </span>
);

export const PageShell = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <section
    className="min-h-screen py-24"
    style={{
      background:
        "linear-gradient(180deg, hsl(0 0% 5%) 0%, hsl(0 0% 15%) 50%, hsl(0 0% 5%) 100%)",
    }}
  >
    <div className={cn("max-w-4xl mx-auto px-6", className)}>{children}</div>
  </section>
);

export const Section = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <section className="border-b border-border/60 py-16 sm:py-24">
    <div className={cn("mx-auto max-w-[1200px] px-7", className)}>
      {children}
    </div>
  </section>
);

/** Page title block: eyebrow pill + single h1 + lead paragraph. */
export const PageHeader = ({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) => (
  <header className="mb-14">
    <Pill>{eyebrow}</Pill>
    <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white sm:text-5xl animate-fadeInUp stagger-1">
      {title}
    </h1>
    <p className="mt-5 text-base leading-relaxed text-muted-foreground animate-fadeInUp stagger-2">
      {lead}
    </p>
  </header>
);

export const Prose = ({ children }: { children: ReactNode }) => (
  <div className="space-y-10 text-sm leading-relaxed text-gray-300">
    {children}
  </div>
);

export const Block = ({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: ReactNode;
  delay?: number;
}) => (
  <div
    className="animate-fadeInUp"
    style={{ animationDelay: `${0.25 + delay * 0.08}s` }}
  >
    <h2 className="mb-3 text-lg font-semibold text-white">{title}</h2>
    {children}
  </div>
);

export const Card = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "rounded-2xl border border-border bg-surface p-6 transition-colors hover:bg-surface-2",
      className,
    )}
  >
    {children}
  </div>
);

export const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-zinc-100 to-zinc-300 px-5 py-3 text-sm font-medium text-background shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] transition hover:from-white";

export const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 text-sm text-foreground transition hover:bg-surface-2";
