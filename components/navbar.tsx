"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import "../app/landing.css";

const navLinks = [
  { label: "Capabilities", href: "#features" },
  { label: "Drug Intelligence", href: "#drug-lookup" },
  { label: "Audit Reports", href: "#audit-reports" },
  { label: "Inventory Exchange", href: "#inventory-view" },
  { label: "Reimbursement Leads", href: "#leads" },
  { label: "Pricing", href: "#pricing" },
  { label: "Support", href: "#support" },
];

const Logo = () => (
  <div className="flex items-center">
    <div className="relative h-30 w-40 shrink-0">
      <a href="/">
        <Image
          src="/l1.png"
          alt="AuditProRx"
          fill
          priority
          sizes="160px"
          className="object-contain object-left"
        />
      </a>
    </div>
  </div>
);

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scheduleConsultation = () => {
    window.open("https://calendar.app.google/ekTAPx65xrwq2Qiv6", "_blank");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-9xl items-center justify-between px-4 sm:pl-0 sm:px-7">
        <Logo />
        <nav className="hidden items-center gap-2 text-sm font-medium text-foreground md:flex lg:gap-3">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="group relative cursor-pointer rounded-md px-3 py-1.5 text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white hover:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
            >
              {l.label}
              <span className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-px origin-left scale-x-0 bg-gradient-to-r from-white/60 to-white/0 transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-4 md:flex lg:gap-8.5">
          <a
            href="/auth"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer text-sm font-medium text-white/90 hover:text-white"
          >
            Log In
          </a>
          <button
            onClick={scheduleConsultation}
            className="cursor-pointer rounded-lg bg-gradient-to-b from-zinc-100 to-zinc-300 px-4 py-2 text-sm font-medium text-background shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:from-white animate-fadeInUp stagger-0"
          >
            <span className="cursor-pointer"> Schedule a Consultation</span>
          </button>
        </div>
        {/* Mobile menu toggle */}
        <button
          onClick={() => setIsMobileMenuOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface text-foreground md:hidden"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>
      {/* Mobile menu panel */}
      {isMobileMenuOpen && (
        <div className="border-t border-border/60 bg-background/95 backdrop-blur md:hidden">
          <nav className="mx-auto flex max-w-9xl flex-col gap-1 px-4 py-4 text-sm font-medium text-white/90">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="cursor-pointer rounded-md px-2 py-2 text-white/90 transition hover:bg-surface hover:text-white"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex flex-col gap-3 border-t border-border/60 pt-4">
              <a
                href="/auth"
                className="cursor-pointer px-2 text-sm font-medium text-white/90 hover:text-white"
              >
                Log In
              </a>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  scheduleConsultation();
                }}
                className="rounded-lg bg-gradient-to-b from-zinc-100 to-zinc-300 px-4 py-2.5 text-sm font-medium text-background shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:from-white"
              >
                Schedule a Consultation
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
