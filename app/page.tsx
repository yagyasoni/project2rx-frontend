// "use client";

// import Navbar from "@/components/Navbar";
// import HeroSection from "@/components/HeroSection";
// import StatsSection from "@/components/StatsSection";
// import LogoMarquee from "@/components/LogoMarquee";
// import FeaturesSection from "@/components/FeaturesSection";
// import PMSSection from "@/components/PMSSection";
// import WholesalersSection from "@/components/WholesalersSection";
// import AuditAssistanceSection from "@/components/AuditAssistanceSection";
// import BenefitsSection from "@/components/BenefitsSection";
// import TestimonialSection from "@/components/Testimonialsection";
// import TrustSection from "@/components/trust-section";
// import Footer from "@/components/footer";
// import BookNowSection from "@/components/Booknowsection";

// export default function Home() {
//   return (
//     <main className="min-h-screen">
//       <Navbar />
//       <HeroSection />
//       <StatsSection />
//       <LogoMarquee />
//       <FeaturesSection />
//       <PMSSection />
//       <WholesalersSection />
//       <AuditAssistanceSection />
//       <BenefitsSection />
//       <TestimonialSection />
//       <BookNowSection />
//       <TrustSection />
//       <Footer />
//     </main>
//   );
// }

"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Shield,
  Zap,
  BarChart3,
  FileCheck,
  Clock,
  Lock,
  ArrowRight,
  Star,
  Menu,
  X,
  CheckCircle2,
  ChevronRight,
  Users,
  TrendingUp,
  Database,
  Eye,
  Bell,
  Layers,
  Award,
  Phone,
  Mail,
  MapPin,
  Play,
  ArrowUpRight,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react";
import Link from "next/link";

/* ─── Animated counter ─── */

const Counter = ({
  end,
  suffix = "",
  prefix = "",
}: {
  end: number;
  suffix?: string;
  prefix?: string;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(end / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else setCount(start);
    }, 20);
    return () => clearInterval(timer);
  }, [inView, end]);

  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString("en-US")}
      {suffix}
    </span>
  );
};

/* ─── Section wrapper with scroll animation ─── */
const AnimatedSection = ({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Index = () => {
  const [navOpen, setNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    "Features",
    "How It Works",
    "Pricing",
    "Testimonials",
    "Contact",
  ];

  // Color palette - Silver/Gray accent with black gradients
  const accentColor = "hsl(210 15% 60%)"; // Silver-gray
  const accentLight = "hsl(210 15% 80%)"; // Light silver
  const accentDark = "hsl(210 15% 40%)"; // Dark silver
  const textLight = "hsl(0 0% 95%)"; // Near white
  const textDark = "hsl(0 0% 5%)"; // Near black

  // Color palette colors (converted to HSL)
  const colorA6A6A6 = "hsl(0 0% 65%)"; // #A6A6A6
  const color737373 = "hsl(0 0% 45%)"; // #737373
  const color404040 = "hsl(0 0% 25%)"; // #404040
  const color262626 = "hsl(0 0% 15%)"; // #262626
  const color0D0D0D = "hsl(0 0% 5%)"; // #0D0D0D

  return (
    <div
      className="min-h-screen bg-black font-body text-white overflow-x-hidden"
      style={{ background: "hsl(0 0% 5%)" }}
    >
      {/* ════════════════ NAVBAR ════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-black/95 backdrop-blur-xl border-b" : "bg-transparent"}`}
        style={{ borderColor: scrolled ? "hsl(0 0% 20%)" : "transparent" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <a
            href="/"
            className="font-display text-xl font-bold tracking-tight flex items-center gap-2"
          >
            <span style={{ color: accentColor }}>
              {/* <img src={logo1} alt="AuditProRx" className="size-12" /> */}
            </span>{" "}
            <span style={{ color: textLight }}>AuditProRx</span>
          </a>
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm transition-colors"
                style={{ color: "hsl(0 0% 70%)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = textLight)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "hsl(0 0% 70%)")
                }
              >
                {l}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+15512296466"
              className="px-5 py-2.5 text-sm font-semibold rounded-lg transition-opacity"
              style={{ background: "hsl(0 0% 95%)", color: textDark }}
            >
              Request Demo
            </a>
            <a
              href="/auth"
              className="px-5 py-2.5 text-sm font-medium rounded-lg border transition-colors"
              style={{ borderColor: "hsl(0 0% 30%)", color: textLight }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "hsl(0 0% 12%)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              Login
            </a>
          </div>
          <button
            onClick={() => setNavOpen(!navOpen)}
            className="lg:hidden"
            style={{ color: textLight }}
          >
            <Menu size={22} />
          </button>
        </div>
        {navOpen && (
          <div
            className="lg:hidden border-t backdrop-blur-xl px-6 py-6 space-y-4"
            style={{ background: "hsl(0 0% 8%)", borderColor: "hsl(0 0% 20%)" }}
          >
            {navLinks.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
                className="block text-sm"
                style={{ color: "hsl(0 0% 70%)" }}
                onClick={() => setNavOpen(false)}
              >
                {l}
              </a>
            ))}
            <a
              href="tel:+15512296466"
              className="block text-center px-5 py-2.5 text-sm font-semibold rounded-lg"
              style={{ background: "hsl(0 0% 95%)", color: textDark }}
            >
              Request Demo
            </a>
            <a
              href="/auth"
              className="block text-center px-5 py-2.5 text-sm font-medium rounded-lg border transition-colors"
              style={{ borderColor: "hsl(0 0% 30%)", color: textLight }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "hsl(0 0% 12%)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              Login
            </a>
          </div>
        )}
      </nav>

      {/* ════════════════ HERO ════════════════ */}
      <section
        className="relative min-h-screen flex items-center justify-center pt-28 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, hsl(0 0% 3%) 0%, hsl(0 0% 7%) 40%, hsl(0 0% 4%) 100%)",
        }}
      >
        {/* Decorative */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-[160px]"
            style={{
              background:
                "radial-gradient(circle, hsl(210 15% 50% / 0.05), transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px]"
            style={{
              background:
                "radial-gradient(circle, hsl(0 0% 30% / 0.1), transparent 70%)",
            }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border"
            style={{ borderColor: "hsl(0 0% 15%)" }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] rounded-full border"
            style={{ borderColor: "hsl(0 0% 10%)" }}
          />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(0 0% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 50%) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border mb-8"
            style={{
              background:
                "linear-gradient(135deg, hsl(0 0% 10%), hsl(0 0% 7%))",
              borderColor: "hsl(0 0% 25%)",
            }}
          >
            {/* <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} /> */}
            <span
              className="text-xs font-medium"
              style={{ color: "hsl(0 0% 75%)" }}
            >
              Pharmacy Audits, Simplified
            </span>
            <ChevronRight
              className="w-3 h-3"
              style={{ color: "hsl(0 0% 75%)" }}
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-bold leading-[0.95] tracking-tight mb-6 max-w-5xl mx-auto"
            style={{ color: textLight }}
          >
            Where Pharmacies Turn for{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, hsl(0 0% 100%), hsl(210 15% 70%), hsl(0 0% 70%))",
              }}
            >
              Trusted Audit
            </span>{" "}
            Support
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "hsl(0 0% 75%)" }}
          >
            Streamline your audit process with our all-in-one tool designed
            specifically for pharmacies. Save time, reduce errors, protect
            revenue.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
          >
            <a
              href="tel:+15512296466"
              className="group px-8 py-4 rounded-xl font-semibold text-base flex items-center gap-2 transition-all duration-300"
              style={{
                background:
                  "linear-gradient(135deg, hsl(0 0% 95%), hsl(0 0% 85%))",
                color: textDark,
              }}
            >
              Request Demo{" "}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#"
              className="group px-8 py-4 rounded-xl font-medium text-base border transition-colors flex items-center gap-2"
              style={{ borderColor: "hsl(0 0% 25%)", color: textLight }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "hsl(0 0% 12%)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <Play className="w-4 h-4" /> Watch Video
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="flex items-center justify-center gap-3 text-sm mb-16"
            style={{ color: "hsl(0 0% 75%)" }}
          >
            <div className="flex -space-x-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold"
                  style={{
                    background: `linear-gradient(135deg, hsl(${210 + i * 20} 25% 40%), hsl(${210 + i * 20} 20% 25%))`,
                    borderColor: "hsl(0 0% 5%)",
                    color: textLight,
                  }}
                >
                  {["UC", "IA", "KA"][i]}
                </div>
              ))}
            </div>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-3.5 h-3.5 fill-current"
                  style={{ color: accentColor }}
                />
              ))}
            </div>
            <span>Trusted by 100+ pharmacies</span>
          </motion.div>

          {/* Product mockup */}
          <motion.div
            initial={{ opacity: 0, y: 80 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="max-w-5xl mx-auto"
          >
            <div
              className="rounded-xl p-[1px]"
              style={{
                background:
                  "linear-gradient(180deg, hsl(0 0% 25%), hsl(0 0% 10%))",
              }}
            >
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  background:
                    "linear-gradient(180deg, hsl(0 0% 10%), hsl(0 0% 6%))",
                }}
              >
                <div
                  className="flex items-center gap-2 px-4 py-3 border-b"
                  style={{ borderColor: "hsl(0 0% 20%)" }}
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: "hsl(0 60% 50%)" }}
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: "hsl(45 60% 50%)" }}
                  />
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: "hsl(210 50% 50%)" }}
                  />
                  <div className="ml-4 flex-1 h-6 rounded-md bg-stone-800 max-w-xs flex items-center px-3">
                    <span
                      className="text-[10px] font-mono"
                      style={{ color: "hsl(0 0% 60%)" }}
                    >
                      auditprorx.com/dashboard/inventory
                    </span>
                  </div>
                </div>
                <div className="flex">
                  {/* Sidebar mock */}
                  <div
                    className="hidden md:block w-48 border-r p-4 space-y-3"
                    style={{ borderColor: "hsl(0 0% 15%)" }}
                  >
                    {[
                      "Dashboard",
                      "Inventory",
                      "Audits",
                      "Reports",
                      "Settings",
                    ].map((item, i) => (
                      <div
                        key={item}
                        className="text-xs px-3 py-2 rounded-md"
                        style={{
                          background:
                            i === 1 ? `hsl(210 15% 20%)` : "transparent",
                          color: i === 1 ? accentColor : "hsl(0 0% 70%)",
                        }}
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                  {/* Content mock */}
                  <div className="flex-1 p-5 space-y-3">
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="h-4 w-32 rounded"
                        style={{ background: "hsl(0 0% 25%)" }}
                      />
                      <div className="flex gap-2">
                        <div
                          className="h-7 w-20 rounded-md"
                          style={{ background: "hsl(0 0% 20%)" }}
                        />
                        <div
                          className="h-7 w-7 rounded-md"
                          style={{ background: "hsl(210 15% 25%)" }}
                        />
                      </div>
                    </div>
                    {/* Table header */}
                    <div className="grid grid-cols-6 gap-3">
                      {[
                        "NDC",
                        "Drug Name",
                        "Rank",
                        "Ordered",
                        "Billed",
                        "Status",
                      ].map((h) => (
                        <div
                          key={h}
                          className="text-[9px] font-semibold uppercase tracking-wider pb-2 border-b"
                          style={{
                            color: "hsl(0 0% 60%)",
                            borderColor: "hsl(0 0% 15%)",
                          }}
                        >
                          {h}
                        </div>
                      ))}
                    </div>
                    {/* Table rows */}
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-6 gap-3 py-2 border-b"
                        style={{ borderColor: "hsl(0 0% 10%)" }}
                      >
                        <div
                          className="h-2.5 rounded"
                          style={{ background: "hsl(0 0% 25%)", width: "75%" }}
                        />
                        <div
                          className="h-2.5 rounded"
                          style={{
                            background: "hsl(0 0% 20%)",
                            width: `${60 + Math.random() * 40}%`,
                          }}
                        />
                        <div
                          className="h-2.5 rounded"
                          style={{ background: "hsl(0 0% 20%)", width: "50%" }}
                        />
                        <div
                          className="h-2.5 rounded"
                          style={{ background: "hsl(0 0% 20%)", width: "67%" }}
                        />
                        <div
                          className="h-2.5 rounded"
                          style={{ background: "hsl(0 0% 20%)", width: "50%" }}
                        />
                        <div className="flex items-center">
                          {i === 1 && (
                            <span
                              className="text-[8px] px-1.5 py-0.5 rounded"
                              style={{
                                background: "hsl(210 15% 25%)",
                                color: accentColor,
                              }}
                            >
                              Active
                            </span>
                          )}
                          {i === 3 && (
                            <span
                              className="text-[8px] px-1.5 py-0.5 rounded"
                              style={{
                                background: "hsl(45 60% 30%)",
                                color: "hsl(45 60% 70%)",
                              }}
                            >
                              Review
                            </span>
                          )}
                          {i === 5 && (
                            <span
                              className="text-[8px] px-1.5 py-0.5 rounded"
                              style={{
                                background: "hsl(0 60% 30%)",
                                color: "hsl(0 60% 70%)",
                              }}
                            >
                              Urgent
                            </span>
                          )}
                          {![1, 3, 5].includes(i) && (
                            <div
                              className="h-2.5 rounded"
                              style={{
                                background: "hsl(0 0% 20%)",
                                width: "67%",
                              }}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* Shadow/glow under mockup */}
            <div
              className="h-20 -mt-10 relative z-[-1]"
              style={{
                background:
                  "radial-gradient(ellipse at center, hsl(210 15% 40% / 0.08), transparent 70%)",
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* ════════════════ STATS BAR ════════════════ */}
      <section
        className="relative py-16 border-y"
        style={{
          background: `linear-gradient(135deg, ${color0D0D0D} 0%, ${color262626} 50%, ${color0D0D0D} 100%)`,
          borderColor: "hsl(0 0% 20%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              {
                label: "Audit Recoupments Saved",
                value: 1000000,
                prefix: "$",
                suffix: "+",
              },
              { label: "Audits Generated", value: 100, suffix: "+" },
              { label: "Active Pharmacies", value: 10, suffix: "+" },
              { label: "HIPAA Compliant", value: 100, suffix: "%" },
            ].map((s, i) => (
              <AnimatedSection
                key={s.label}
                delay={i * 0.1}
                className="text-center"
              >
                <p
                  className="text-xs uppercase tracking-widest font-semibold mb-2"
                  style={{ color: accentColor }}
                >
                  {s.label}
                </p>
                <p
                  className="font-display text-3xl md:text-4xl font-bold"
                  style={{ color: textLight }}
                >
                  <Counter end={s.value} prefix={s.prefix} suffix={s.suffix} />
                </p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ logo1S / TRUST BAR ════════════════ */}
      <section
        className="py-14 border-b overflow-hidden"
        style={{ background: "hsl(0 0% 5%)", borderColor: "hsl(0 0% 20%)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <p
            className="text-center text-xs uppercase tracking-[0.2em] mb-8"
            style={{ color: "hsl(0 0% 60%)" }}
          >
            Built for modern pharmacy workflows
          </p>
          {/* Auto-scrolling logo1s container */}
          <div className="relative overflow-hidden">
            <style>{`
              @keyframes scroll-left {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .scroll-container {
                display: flex;
                gap: 3rem;
                animation: scroll-left 30s linear infinite;
                width: fit-content;
              }
              .scroll-container:hover {
                animation-play-state: paused;
              }
              .scroll-item {
                flex-shrink: 0;
                min-width: 200px;
              }
            `}</style>
            <div className="scroll-container">
              {["Audits", "Recovery", "Claims", "Compliance", "Analytics"].map(
                (name) => (
                  <div
                    key={name}
                    className="scroll-item font-display text-lg font-bold tracking-wider"
                    style={{ color: `hsl(0 0% 40%)` }}
                  >
                    {name}
                  </div>
                ),
              )}
              {/* Duplicate for seamless loop */}
              {["Audits", "Recovery", "Claims", "Compliance", "Analytics"].map(
                (name) => (
                  <div
                    key={`${name}-2`}
                    className="scroll-item font-display text-lg font-bold tracking-wider"
                    style={{ color: `hsl(0 0% 40%)` }}
                  >
                    {name}
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ FEATURES GRID ════════════════ */}
      <section
        id="features"
        className="py-24"
        style={{
          background: `linear-gradient(180deg, ${color0D0D0D} 0%, ${color262626} 50%, ${color0D0D0D} 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span
              className="text-xs uppercase tracking-[0.2em] font-semibold"
              style={{ color: accentColor }}
            >
              Features
            </span>
            <h2
              className="font-display text-4xl md:text-5xl font-bold mt-3 mb-4"
              style={{ color: textLight }}
            >
              Everything You Need
            </h2>
            <p
              className="text-lg max-w-xl mx-auto"
              style={{ color: "hsl(0 0% 75%)" }}
            >
              Built by pharmacists, for pharmacists. Every feature designed to
              simplify your workflow.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Shield,
                title: "Audit Protection",
                desc: "Comprehensive audit defense with automated documentation and response generation.",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Process audits in minutes, not hours. Our AI-powered engine handles the heavy lifting.",
              },
              {
                icon: BarChart3,
                title: "Smart Analytics",
                desc: "Real-time dashboards showing audit trends, risk areas, and savings opportunities.",
              },
              {
                icon: FileCheck,
                title: "Auto Documentation",
                desc: "Automatically generate compliant documentation for every audit response.",
              },
              {
                icon: Clock,
                title: "Deadline Tracking",
                desc: "Never miss a deadline with automated reminders and intelligent progress tracking.",
              },
              {
                icon: Lock,
                title: "HIPAA Compliant",
                desc: "Enterprise-grade security ensuring all patient data remains fully protected.",
              },
            ].map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 0.06}>
                <div
                  className="group relative h-full p-7 rounded-xl border transition-all duration-500 overflow-hidden"
                  style={{
                    background: `linear-gradient(145deg, ${color262626} 0%, ${color0D0D0D} 100%)`,
                    borderColor: "hsl(0 0% 20%)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "hsl(0 0% 35%)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "hsl(0 0% 20%)")
                  }
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 0%, hsl(210 15% 50% / 0.04), transparent 60%)",
                    }}
                  />
                  <div className="relative z-10">
                    <div
                      className="w-11 h-11 rounded-lg flex items-center justify-center mb-5 border transition-colors"
                      style={{
                        background: `linear-gradient(135deg, ${color404040}, ${color0D0D0D})`,
                        borderColor: "hsl(0 0% 25%)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor = "hsl(210 15% 50%)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor = "hsl(0 0% 25%)")
                      }
                    >
                      <f.icon
                        className="w-5 h-5 transition-colors duration-300"
                        style={{ color: accentColor }}
                      />
                    </div>
                    <h3
                      className="font-display text-lg font-semibold mb-2"
                      style={{ color: textLight }}
                    >
                      {f.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "hsl(0 0% 75%)" }}
                    >
                      {f.desc}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ PRODUCT HIGHLIGHT — LEFT/RIGHT BLOCKS ════════════════ */}
      <section
        className="py-24 border-y"
        style={{
          background: `linear-gradient(180deg, ${color0D0D0D} 0%, ${color262626} 50%, ${color0D0D0D} 100%)`,
          borderColor: "hsl(0 0% 20%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          {/* Block 1 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <span
                className="text-xs uppercase tracking-[0.2em] font-semibold"
                style={{ color: accentColor }}
              >
                Inventory Management
              </span>
              <h3
                className="font-display text-3xl md:text-4xl font-bold mt-3 mb-4"
                style={{ color: textLight }}
              >
                Real-Time Inventory Tracking
              </h3>
              <p
                className="mb-6 leading-relaxed"
                style={{ color: "hsl(0 0% 75%)" }}
              >
                Monitor stock levels, track ordering patterns, and identify
                discrepancies before they become costly audit findings. Our
                intelligent system flags anomalies automatically.
              </p>
              <ul className="space-y-3">
                {[
                  "Automated stock-level alerts",
                  "Cross-reference ordering data",
                  "Shortage prediction engine",
                  "Multi-location support",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm"
                    style={{ color: textLight }}
                  >
                    <CheckCircle2
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: accentColor }}
                    />{" "}
                    {item}
                  </li>
                ))}
              </ul>
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <div
                className="rounded-xl p-[1px]"
                style={{
                  background: `linear-gradient(145deg, ${color404040}, ${color0D0D0D})`,
                }}
              >
                <div
                  className="rounded-xl p-6"
                  style={{
                    background: `linear-gradient(145deg, ${color262626}, ${color0D0D0D})`,
                  }}
                >
                  <div className="space-y-4">
                    <div
                      className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider pb-3 border-b"
                      style={{
                        color: "hsl(0 0% 60%)",
                        borderColor: "hsl(0 0% 15%)",
                      }}
                    >
                      <span>Drug</span>
                      <span>Stock</span>
                      <span>Status</span>
                    </div>
                    {[
                      {
                        name: "Amoxicillin 500mg",
                        stock: 85,
                        status: "In Stock",
                      },
                      { name: "Lisinopril 10mg", stock: 23, status: "Low" },
                      {
                        name: "Metformin 500mg",
                        stock: 142,
                        status: "In Stock",
                      },
                      {
                        name: "Atorvastatin 20mg",
                        stock: 8,
                        status: "Critical",
                      },
                      {
                        name: "Omeprazole 20mg",
                        stock: 67,
                        status: "In Stock",
                      },
                    ].map((drug) => (
                      <div
                        key={drug.name}
                        className="flex items-center justify-between py-2"
                      >
                        <span className="text-sm" style={{ color: textLight }}>
                          {drug.name}
                        </span>
                        <span
                          className="text-sm"
                          style={{ color: "hsl(0 0% 70%)" }}
                        >
                          {drug.stock}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-medium`}
                          style={{
                            background:
                              drug.status === "In Stock"
                                ? `hsl(210 15% 25%)`
                                : drug.status === "Low"
                                  ? `hsl(45 60% 30%)`
                                  : `hsl(0 60% 30%)`,
                            color:
                              drug.status === "In Stock"
                                ? accentColor
                                : drug.status === "Low"
                                  ? "hsl(45 60% 70%)"
                                  : "hsl(0 60% 70%)",
                          }}
                        >
                          {drug.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Block 2 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection delay={0.15} className="order-2 lg:order-1">
              <div
                className="rounded-xl p-[1px]"
                style={{
                  background: `linear-gradient(145deg, ${color404040}, ${color0D0D0D})`,
                }}
              >
                <div
                  className="rounded-xl p-6"
                  style={{
                    background: `linear-gradient(145deg, ${color262626}, ${color0D0D0D})`,
                  }}
                >
                  {/* Mini chart */}
                  <div className="mb-4">
                    <p
                      className="text-xs mb-2"
                      style={{ color: "hsl(0 0% 60%)" }}
                    >
                      Audit Savings — Last 6 Months
                    </p>
                    <div className="flex items-end gap-2 h-32">
                      {[45, 62, 38, 75, 88, 95].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-t-md transition-all duration-300"
                          style={{
                            height: `${h}%`,
                            background: `linear-gradient(180deg, hsl(210 15% ${45 + i * 3}%), hsl(210 15% 25%))`,
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2 mt-2">
                      {["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
                        <span
                          key={m}
                          className="flex-1 text-center text-[9px]"
                          style={{ color: "hsl(0 0% 60%)" }}
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div
                    className="grid grid-cols-2 gap-3 pt-4 border-t"
                    style={{ borderColor: "hsl(0 0% 15%)" }}
                  >
                    <div
                      className="p-3 rounded-lg"
                      style={{ background: "hsl(0 0% 12%)" }}
                    >
                      <p
                        className="text-[10px]"
                        style={{ color: "hsl(0 0% 60%)" }}
                      >
                        Total Saved
                      </p>
                      <p
                        className="font-display text-lg font-bold"
                        style={{ color: accentColor }}
                      >
                        $847K
                      </p>
                    </div>
                    <div
                      className="p-3 rounded-lg"
                      style={{ background: "hsl(0 0% 12%)" }}
                    >
                      <p
                        className="text-[10px]"
                        style={{ color: "hsl(0 0% 60%)" }}
                      >
                        Success Rate
                      </p>
                      <p
                        className="font-display text-lg font-bold"
                        style={{ color: textLight }}
                      >
                        94.2%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection className="order-1 lg:order-2">
              <span
                className="text-xs uppercase tracking-[0.2em] font-semibold"
                style={{ color: accentColor }}
              >
                Analytics & Reports
              </span>
              <h3
                className="font-display text-3xl md:text-4xl font-bold mt-3 mb-4"
                style={{ color: textLight }}
              >
                Data-Driven Audit Insights
              </h3>
              <p
                className="mb-6 leading-relaxed"
                style={{ color: "hsl(0 0% 75%)" }}
              >
                Visualize your audit performance with powerful analytics.
                Understand trends, identify vulnerabilities, and make informed
                decisions to protect your bottom line.
              </p>
              <ul className="space-y-3">
                {[
                  "Real-time savings dashboards",
                  "Trend analysis & forecasting",
                  "Risk scoring algorithms",
                  "Exportable compliance reports",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm"
                    style={{ color: textLight }}
                  >
                    <CheckCircle2
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: accentColor }}
                    />{" "}
                    {item}
                  </li>
                ))}
              </ul>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ════════════════ HOW IT WORKS ════════════════ */}
      <section
        id="how-it-works"
        className="py-24"
        style={{
          background: `linear-gradient(180deg, ${color0D0D0D} 0%, ${color262626} 50%, ${color0D0D0D} 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span
              className="text-xs uppercase tracking-[0.2em] font-semibold"
              style={{ color: accentColor }}
            >
              How It Works
            </span>
            <h2
              className="font-display text-4xl md:text-5xl font-bold mt-3 mb-4"
              style={{ color: textLight }}
            >
              Three Simple Steps
            </h2>
            <p
              className="text-lg max-w-xl mx-auto"
              style={{ color: "hsl(0 0% 75%)" }}
            >
              Get started in minutes, not months. Our streamlined onboarding
              gets you protected fast.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Database,
                title: "Connect Your Data",
                desc: "Securely integrate your pharmacy management system. We support all major PMS platforms.",
              },
              {
                step: "02",
                icon: Workflow,
                title: "Automate Audits",
                desc: "Our AI engine analyzes your data, generates responses, and tracks deadlines automatically.",
              },
              {
                step: "03",
                icon: TrendingUp,
                title: "Protect Revenue",
                desc: "Reduce recoupments, win more appeals, and keep more of the revenue you've earned.",
              },
            ].map((s, i) => (
              <AnimatedSection key={s.step} delay={i * 0.12}>
                <div className="relative group h-full">
                  {i < 2 && (
                    <div
                      className="hidden md:block absolute top-12 left-full w-full h-[1px] z-0"
                      style={{
                        background:
                          "linear-gradient(to right, hsl(0 0% 30%), transparent)",
                      }}
                    />
                  )}
                  <div
                    className="relative p-8 rounded-xl border transition-all duration-500 h-full flex flex-col"
                    style={{
                      background: `linear-gradient(180deg, ${color262626} 0%, ${color0D0D0D} 100%)`,
                      borderColor: "hsl(0 0% 20%)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = "hsl(0 0% 40%)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = "hsl(0 0% 20%)")
                    }
                  >
                    <span
                      className="font-display text-5xl font-bold"
                      style={{ color: color404040 }}
                    >
                      {s.step}
                    </span>
                    <div
                      className="w-11 h-11 rounded-lg flex items-center justify-center mt-4 mb-4 border transition-colors"
                      style={{
                        background: `linear-gradient(135deg, ${color404040}, ${color0D0D0D})`,
                        borderColor: "hsl(0 0% 25%)",
                      }}
                    >
                      <s.icon
                        className="w-5 h-5"
                        style={{ color: accentColor }}
                      />
                    </div>
                    <h3
                      className="font-display text-xl font-semibold mb-2"
                      style={{ color: textLight }}
                    >
                      {s.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed flex-1"
                      style={{ color: "hsl(0 0% 75%)" }}
                    >
                      {s.desc}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ ADDITIONAL CAPABILITIES ════════════════ */}
      <section
        className="py-24 border-y"
        style={{
          background: `linear-gradient(180deg, ${color0D0D0D} 0%, ${color262626} 50%, ${color0D0D0D} 100%)`,
          borderColor: "hsl(0 0% 20%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span
              className="text-xs uppercase tracking-[0.2em] font-semibold"
              style={{ color: accentColor }}
            >
              Platform
            </span>
            <h2
              className="font-display text-4xl md:text-5xl font-bold mt-3 mb-4"
              style={{ color: textLight }}
            >
              Built for Scale
            </h2>
            <p
              className="text-lg max-w-xl mx-auto"
              style={{ color: "hsl(0 0% 75%)" }}
            >
              Enterprise capabilities designed for pharmacy groups of any size.
            </p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: Eye,
                title: "Audit Trail",
                desc: "Complete visibility into every action.",
              },
              {
                icon: Bell,
                title: "Smart Alerts",
                desc: "Real-time notifications for critical items.",
              },
              {
                icon: Layers,
                title: "Multi-Store",
                desc: "Manage from one dashboard.",
              },
              {
                icon: Users,
                title: "Team Roles",
                desc: "Granular permissions for your staff.",
              },
            ].map((c, i) => (
              <AnimatedSection key={c.title} delay={i * 0.08}>
                <div
                  className="p-6 rounded-xl border text-center transition-all duration-300"
                  style={{
                    background: `linear-gradient(180deg, ${color262626} 0%, ${color0D0D0D} 100%)`,
                    borderColor: "hsl(0 0% 20%)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "hsl(0 0% 40%)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "hsl(0 0% 20%)")
                  }
                >
                  <c.icon
                    className="w-8 h-8 mx-auto mb-4"
                    style={{ color: accentColor }}
                  />
                  <h4
                    className="font-display font-semibold mb-1"
                    style={{ color: textLight }}
                  >
                    {c.title}
                  </h4>
                  <p className="text-xs" style={{ color: "hsl(0 0% 75%)" }}>
                    {c.desc}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ TESTIMONIALS ════════════════ */}
      <section
        id="testimonials"
        className="py-24"
        style={{
          background: `linear-gradient(180deg, ${color0D0D0D} 0%, ${color262626} 50%, ${color0D0D0D} 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span
              className="text-xs uppercase tracking-[0.2em] font-semibold"
              style={{ color: accentColor }}
            >
              Testimonials
            </span>
            <h2
              className="font-display text-4xl md:text-5xl font-bold mt-3 mb-4"
              style={{ color: textLight }}
            >
              What Pharmacists Say
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "AuditProRx has really streamlined how we handle audits. It saves us time and helps us stay more organized.",
                name: "Dr. Uzair Chachar",
                role: "Owner, Life Care Pharmacy",
                dname: "Uzair Chachar",
              },
              {
                quote:
                  "Managing documentation and claims has become much easier. The system is simple and very efficient.",
                name: "Dr. Irfan Ali",
                role: "Owner, Bergen Road Pharmacy",
                dname: "Irfan Ali",
              },
              {
                quote:
                  "The workflow is smooth and easy to follow. It’s a helpful tool for improving our overall audit process.",
                name: "Dr. Khilat Abbas",
                role: "Owner, United Drugs",
                dname: "Khilat Abbas",
              },
            ].map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.1}>
                <div
                  className="h-full p-7 rounded-xl border flex flex-col"
                  style={{
                    background: `linear-gradient(145deg, ${color262626}, ${color0D0D0D})`,
                    borderColor: "hsl(0 0% 20%)",
                  }}
                >
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className="w-3.5 h-3.5 fill-current"
                        style={{ color: accentColor }}
                      />
                    ))}
                  </div>
                  <p
                    className="text-sm leading-relaxed mb-6 flex-1"
                    style={{ color: textLight }}
                  >
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{
                        background: `linear-gradient(135deg, hsl(${210 + i * 40} 25% 40%), hsl(${210 + i * 40} 20% 25%))`,
                        color: textLight,
                      }}
                    >
                      {t.dname
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: textLight }}
                      >
                        {t.name}
                      </p>
                      <p
                        className="text-[11px]"
                        style={{ color: "hsl(0 0% 60%)" }}
                      >
                        {t.role}
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ PRICING ════════════════ */}
      <section
        id="pricing"
        className="py-24 border-y"
        style={{
          background: `linear-gradient(180deg, ${color0D0D0D} 0%, ${color262626} 50%, ${color0D0D0D} 100%)`,
          borderColor: "hsl(0 0% 20%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span
              className="text-xs uppercase tracking-[0.2em] font-semibold"
              style={{ color: accentColor }}
            >
              Pricing
            </span>
            <h2
              className="font-display text-4xl md:text-5xl font-bold mt-3 mb-4"
              style={{ color: textLight }}
            >
              Simple, Transparent Pricing
            </h2>
            <p
              className="text-lg max-w-xl mx-auto"
              style={{ color: "hsl(0 0% 75%)" }}
            >
              No hidden fees. No long-term contracts. Start protecting your
              pharmacy today.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: "Starter",
                price: "Free",
                period: "/mo",
                desc: "Start with core audit workflows",
                features: [
                  "Up to 2 audits/mo",
                  "Basic audit insights",
                  "Email support",
                  "14-day free trial",
                ],
                highlighted: false,
              },
              {
                name: "Professional",
                price: "$199",
                period: "/mo",
                desc: "Tools for efficient audit management",
                features: [
                  "Unlimited audits",
                  "Advanced analytics",
                  "Priority support",
                  "Export & reporting tools",
                ],
                highlighted: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                desc: "Scalable for complex operations",
                features: [
                  "Everything in Professional",
                  "Dedicated support",
                  "Custom workflows",
                  "Advanced compliance controls",
                ],
                highlighted: false,
              },
            ].map((plan, i) => (
              <AnimatedSection key={plan.name} delay={i * 0.1}>
                <div
                  className={`relative h-full p-8 rounded-xl border flex flex-col`}
                  style={{
                    background: plan.highlighted
                      ? `linear-gradient(180deg, ${color262626}, ${color0D0D0D})`
                      : `linear-gradient(180deg, ${color404040}, ${color0D0D0D})`,
                    borderColor: plan.highlighted
                      ? "hsl(0 0% 40%)"
                      : "hsl(0 0% 20%)",
                  }}
                >
                  {plan.highlighted && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-semibold"
                      style={{ background: accentColor, color: textDark }}
                    >
                      Most Popular
                    </div>
                  )}
                  <h3
                    className="font-display text-lg font-semibold mb-1"
                    style={{ color: textLight }}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className="text-xs mb-4"
                    style={{ color: "hsl(0 0% 75%)" }}
                  >
                    {plan.desc}
                  </p>
                  <div className="mb-6">
                    <span
                      className="font-display text-4xl font-bold"
                      style={{ color: textLight }}
                    >
                      {plan.price}
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: "hsl(0 0% 60%)" }}
                    >
                      {plan.period}
                    </span>
                  </div>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-center gap-2 text-sm"
                        style={{ color: textLight }}
                      >
                        <CheckCircle2
                          className="w-3.5 h-3.5 flex-shrink-0"
                          style={{ color: accentColor }}
                        />{" "}
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#demo"
                    className={`block text-center py-3 rounded-lg text-sm font-semibold transition-all`}
                    style={
                      plan.highlighted
                        ? {
                            background:
                              "linear-gradient(135deg, hsl(0 0% 95%), hsl(0 0% 85%))",
                            color: textDark,
                          }
                        : {
                            borderWidth: "1px",
                            borderColor: "hsl(0 0% 30%)",
                            color: textLight,
                          }
                    }
                  >
                    {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                  </a>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ FAQ ════════════════ */}
      <section
        className="py-24"
        style={{
          background: `linear-gradient(180deg, ${color0D0D0D} 0%, ${color262626} 50%, ${color0D0D0D} 100%)`,
        }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16">
            <span
              className="text-xs uppercase tracking-[0.2em] font-semibold"
              style={{ color: accentColor }}
            >
              FAQ
            </span>
            <h2
              className="font-display text-4xl md:text-5xl font-bold mt-3 mb-4"
              style={{ color: textLight }}
            >
              Common Questions
            </h2>
          </AnimatedSection>
          <div className="space-y-4">
            {[
              {
                q: "How quickly can we get started?",
                a: "Most pharmacies are onboarded within 48 hours. Our team manages the setup and ensures a smooth integration with your existing systems.",
              },
              {
                q: "Is my data secure?",
                a: "Yes. We follow HIPAA-compliant practices with end-to-end encryption and industry-standard security protocols to ensure your data remains protected.",
              },
              {
                q: "Do you integrate with my PMS?",
                a: "We support integration with leading pharmacy management systems, ensuring seamless data flow and minimal disruption to your workflow.",
              },
              {
                q: "What kind of support do you offer?",
                a: "All plans include email support, with priority assistance available for higher-tier plans to ensure timely issue resolution.",
              },
              {
                q: "Are there any long-term contracts or commitments?",
                a: "No. Our plans are flexible with no long-term commitments, allowing you to scale or cancel based on your operational needs.",
              },
            ].map((faq, i) => (
              <AnimatedSection key={i} delay={i * 0.06}>
                <details
                  className="group rounded-xl border overflow-hidden"
                  style={{
                    background: `linear-gradient(145deg, ${color262626}, ${color0D0D0D})`,
                    borderColor: "hsl(0 0% 20%)",
                  }}
                >
                  <summary
                    className="flex items-center justify-between cursor-pointer p-5 text-sm font-semibold list-none"
                    style={{ color: textLight }}
                  >
                    {faq.q}
                    <ChevronRight
                      className="w-4 h-4 transition-transform group-open:rotate-90"
                      style={{ color: "hsl(0 0% 60%)" }}
                    />
                  </summary>
                  <div
                    className="px-5 pb-5 text-sm leading-relaxed"
                    style={{ color: "hsl(0 0% 75%)" }}
                  >
                    {faq.a}
                  </div>
                </details>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ CTA ════════════════ */}
      <section className="py-24" style={{ background: "hsl(0 0% 5%)" }}>
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div
              className="relative rounded-2xl border p-12 md:p-20 text-center overflow-hidden"
              style={{
                background: `linear-gradient(145deg, ${color262626}, ${color0D0D0D})`,
                borderColor: "hsl(0 0% 20%)",
              }}
            >
              <div className="absolute inset-0 pointer-events-none">
                <div
                  className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-[100px]"
                  style={{ background: "hsl(210 15% 50% / 0.06)" }}
                />
                <div
                  className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full blur-[100px]"
                  style={{ background: "hsl(0 0% 30% / 0.08)" }}
                />
              </div>
              <div className="relative z-10">
                <Award
                  className="w-10 h-10 mx-auto mb-6"
                  style={{ color: accentColor }}
                />
                <h2
                  className="font-display text-4xl md:text-5xl font-bold mb-4"
                  style={{ color: textLight }}
                >
                  Ready to Grow Your Revenue?
                </h2>
                <p
                  className="text-lg max-w-xl mx-auto mb-8"
                  style={{ color: "hsl(0 0% 75%)" }}
                >
                  Join 100+ pharmacies that trust AuditProRx to simplify audits
                  and protect their bottom line.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="#demo"
                    className="group px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(0 0% 95%), hsl(0 0% 85%))",
                      color: textDark,
                    }}
                  >
                    Request a Demo{" "}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a
                    href="tel:+15512296466"
                    className="px-8 py-4 rounded-xl font-medium border transition-colors flex items-center gap-2"
                    style={{ borderColor: "hsl(0 0% 30%)", color: textLight }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "hsl(0 0% 12%)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <Phone className="w-4 h-4" /> Talk to Sales
                  </a>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ════════════════ FOOTER ════════════════ */}
      <footer
        className="py-16 border-t"
        style={{ background: "hsl(0 0% 3%)", borderColor: "hsl(0 0% 20%)" }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <p
                className="font-display text-lg font-bold mb-4"
                style={{ color: textLight }}
              >
                <span style={{ color: accentColor }}></span> AuditProRx
              </p>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "hsl(0 0% 70%)" }}
              >
                Pharmacy audit management platform trusted by 100+ pharmacies
                across the country.
              </p>
            </div>
            {[
              {
                title: "Product",
                links: [
                  { label: "Features", href: "#features" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "Integrations", href: "#" },
                  { label: "Changelog", href: "#" },
                ],
              },
              {
                title: "Company",
                links: [
                  { label: "About", href: "#" },
                  { label: "Blog", href: "#" },
                  { label: "Careers", href: "#" },
                  { label: "Contact", href: "#" },
                ],
              },
              {
                title: "Legal",
                links: [
                  { label: "Privacy Policy", href: "/privacy-policy" },
                  { label: "Terms of Service", href: "/terms-of-service" },
                  {
                    label: "Cancellation Policy",
                    href: "/cancellation-policy",
                  },
                  { label: "HIPAA Compliance", href: "#hipaa" },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <p
                  className="font-semibold text-sm mb-4"
                  style={{ color: textLight }}
                >
                  {col.title}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("#") ? (
                        <a
                          href={link.href}
                          className="text-sm transition-colors"
                          style={{ color: "hsl(0 0% 70%)" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = textLight)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "hsl(0 0% 70%)")
                          }
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm transition-colors"
                          style={{ color: "hsl(0 0% 70%)" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = textLight)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "hsl(0 0% 70%)")
                          }
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div
            className="flex flex-col md:flex-row items-center justify-between pt-8 border-t gap-4"
            style={{ borderColor: "hsl(0 0% 15%)" }}
          >
            <p className="text-xs" style={{ color: "hsl(0 0% 60%)" }}>
              © 2026 AuditProRx. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              {["Twitter", "LinkedIn", "GitHub"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="text-xs transition-colors px-2 py-1 rounded border"
                  style={{
                    color: "hsl(0 0% 70%)",
                    borderColor: "hsl(0 0% 25%)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "hsl(0 0% 45%)";
                    e.currentTarget.style.color = textLight;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "hsl(0 0% 25%)";
                    e.currentTarget.style.color = "hsl(0 0% 70%)";
                  }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
