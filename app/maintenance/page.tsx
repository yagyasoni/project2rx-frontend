// app/maintenance/page.tsx — static, dependency-free maintenance notice.
//
// Server component: no client hooks, no ProtectedRoute, no API calls, so it
// renders even while api.auditprorx.com is down. Visitors only reach it via
// the 307 redirect in proxy.ts when MAINTENANCE_MODE=true on Vercel.

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  SUPPORT_EMAIL,
  SUPPORT_PHONE,
  whatsappLink,
} from "@/components/marketing/marketing-ui";

// Edit this one line to change the ETA visitors see.
const ETA_TEXT = "We expect to be back within 24–48 hours.";

const WHATSAPP_MESSAGE =
  "Hi AuditProRx team, I tried to sign in during the maintenance window and have a question.";

export const metadata: Metadata = {
  title: "Under Maintenance",
  description:
    "AuditProRx is temporarily unavailable for scheduled maintenance. We'll be back shortly.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function MaintenancePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-6 py-16 text-white">
      <div className="w-full max-w-lg text-center">
        <div className="relative mx-auto h-40 w-72">
          <Image
            src="/l1.png"
            alt="AuditProRx"
            fill
            priority
            sizes="288px"
            className="object-contain"
          />
        </div>

        <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-wider text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          Scheduled maintenance
        </span>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
          We&apos;ll be back shortly
        </h1>

        <p className="mt-5 text-base leading-relaxed text-zinc-400">
          AuditProRx is under maintenance while we upgrade our systems. Sign-in
          and the application are temporarily unavailable. Your data and
          reports are safe.
        </p>

        <p className="mt-3 text-sm font-medium text-zinc-300">{ETA_TEXT}</p>

        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-flex items-center justify-center rounded-lg bg-gradient-to-b from-zinc-100 to-zinc-300 px-5 py-3 text-sm font-medium text-black transition hover:from-white"
          >
            Email {SUPPORT_EMAIL}
          </a>
          <a
            href={whatsappLink(WHATSAPP_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm text-white transition hover:bg-white/10"
          >
            WhatsApp {SUPPORT_PHONE}
          </a>
        </div>

        <Link
          href="/"
          className="mt-8 inline-block text-sm text-zinc-400 underline underline-offset-4 transition hover:text-white"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
