// "use client";

// import {
//   Shield,
//   Zap,
//   BarChart3,
//   FileText,
//   Clock,
//   Lock,
//   Check,
//   Search,
//   DollarSign,
//   FileSpreadsheet,
//   ArrowRight,
//   Home,
//   Phone,
//   CircleDollarSign,
//   ShieldCheck,
//   Monitor,
//   ClipboardList,
//   Download,
//   Play,
//   Star,
//   Asterisk,
//   TimerReset,
//   User as UserIcon,
//   Twitter,
//   Linkedin,
//   Github,
//   ChevronDown,
//   X,
//   Mail,
//   HelpCircle,
//   Boxes,
//   SearchCode,
//   AlertTriangle,
//   Network,
//   Settings2,
//   LifeBuoy,
//   Users,
// } from "lucide-react";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import Link from "next/link";
// import Image from "next/image";
// import "./landing.css";

// const plans = [
//   {
//     id: "base",
//     name: "Inventory Reports",
//     price: "$99",
//     period: "/month",
//     description:
//       "Core inventory audit and reporting access for pharmacy operations.",
//     features: [
//       "Inventory report access",
//       "Unlimited inventory audits",
//       "Export reports",
//       "Secure dashboard access",
//     ],
//     highlighted: false,
//     addOns: [
//       { name: "Inventory View", price: "$199" },
//       { name: "Drug Lookup", price: "$199" },
//       { name: "Leads", price: "$199" },
//     ],
//   },
//   {
//     id: "full_access",
//     name: "Full Access",
//     price: "$499",
//     period: "/month",
//     description: "Complete platform access including all premium modules.",
//     features: [
//       "Inventory reports",
//       "Inventory View",
//       "Drug lookup",
//       "Leads system",
//       "All premium modules",
//       "Priority support",
//     ],
//     highlighted: true,
//   },
// ];

// const testimonials = [
//   {
//     quote:
//       "AuditProRx has really streamlined how we handle audits. It saves us time and helps us stay more organized.",
//     initials: "UC",
//     name: "Dr. Uzair Chachar",
//     role: "Owner, Life Care Pharmacy",
//     gradient: "from-blue-400 to-cyan-300",
//   },
//   {
//     quote:
//       "Managing documentation and claims has become much easier. The system is simple and very efficient.",
//     initials: "IA",
//     name: "Dr. Irfan Ali",
//     role: "Owner, Bergen Road Pharmacy",
//     gradient: "from-amber-300 to-yellow-500",
//   },
//   {
//     quote:
//       "The workflow is smooth and easy to follow. It's a helpful tool for improving our overall audit process.",
//     initials: "KA",
//     name: "Dr. Khilat Abbas",
//     role: "Owner, United Drugs",
//     gradient: "from-pink-300 to-rose-400",
//   },
// ];

// // Global animations styles
// const animationStyles = `
//   @keyframes fadeInUp {
//     from {
//       opacity: 0;
//       transform: translateY(20px);
//     }
//     to {
//       opacity: 1;
//       transform: translateY(0);
//     }
//   }

//   @keyframes slideInLeft {
//     from {
//       opacity: 0;
//       transform: translateX(-20px);
//     }
//     to {
//       opacity: 1;
//       transform: translateX(0);
//     }
//   }

//   @keyframes slideInRight {
//     from {
//       opacity: 0;
//       transform: translateX(20px);
//     }
//     to {
//       opacity: 1;
//       transform: translateX(0);
//     }
//   }

//   @keyframes scaleIn {
//     from {
//       opacity: 0;
//       transform: scale(0.95);
//     }
//     to {
//       opacity: 1;
//       transform: scale(1);
//     }
//   }

//   @keyframes horizontalScroll {
//     0% {
//       transform: translateX(0);
//     }
//     100% {
//       transform: translateX(-50%);
//     }
//   }

//   @keyframes pulseGlow {
//     0%, 100% {
//       box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
//     }
//     50% {
//       box-shadow: 0 0 40px rgba(34, 197, 94, 0.6);
//     }
//   }

//   .animate-fadeInUp {
//     animation: fadeInUp 0.6s ease-out forwards;
//   }

//   .animate-slideInLeft {
//     animation: slideInLeft 0.6s ease-out forwards;
//   }

//   .animate-slideInRight {
//     animation: slideInRight 0.6s ease-out forwards;
//   }

//   .animate-scaleIn {
//     animation: scaleIn 0.6s ease-out forwards;
//   }

//   .animate-horizontalScroll {
//     animation: horizontalScroll 20s linear infinite;
//   }

//   .animate-pulseGlow {
//     animation: pulseGlow 2s ease-in-out infinite;
//   }

//   .stagger-0 { animation-delay: 0s; }
//   .stagger-1 { animation-delay: 0.1s; }
//   .stagger-2 { animation-delay: 0.2s; }
//   .stagger-3 { animation-delay: 0.3s; }
//   .stagger-4 { animation-delay: 0.4s; }
//   .stagger-5 { animation-delay: 0.5s; }
//   .stagger-6 { animation-delay: 0.6s; }
//   .stagger-7 { animation-delay: 0.7s; }
//   .stagger-8 { animation-delay: 0.8s; }
//   .stagger-9 { animation-delay: 0.9s; }
//   .stagger-10 { animation-delay: 1s; }

//   .marquee-wrapper {
//     overflow: hidden;
//   }

//   .marquee-content {
//     display: flex;
//     gap: 1.5rem;
//     width: max-content;
//   }

//   .marquee-content.animate {
//     animation: horizontalScroll 20s linear infinite;
//   }

//   .expandable-content {
//     max-height: 0;
//     overflow: hidden;
//     transition: max-height 0.3s ease-out;
//   }

//   .expandable-content.expanded {
//     max-height: 500px;
//   }

//   /* Scroll-reveal: lines/components appear one after another as the section enters the viewport */
//   .reveal-on-scroll {
//     opacity: 0;
//     transform: translateY(24px);
//     transition: opacity 0.7s ease-out, transform 0.7s ease-out;
//     will-change: opacity, transform;
//   }
//   .reveal-on-scroll.in-view {
//     opacity: 1;
//     transform: translateY(0);
//   }
// `;

// const Pill = ({ children }: { children: React.ReactNode }) => (
//   <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs tracking-wider text-muted-foreground uppercase animate-fadeInUp stagger-0">
//     <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70" />
//     {children}
//   </span>
// );

// const Logo = () => (
//   <div className="flex items-center">
//     <div className="relative h-30 w-40 shrink-0">
//       <Image
//         src="/l1.png"
//         alt="AuditProRx"
//         fill
//         priority
//         sizes="160px"
//         className="object-contain object-left"
//       />
//     </div>
//   </div>
// );

// // Counter Component
// const Counter = ({
//   target,
//   suffix = "",
// }: {
//   target: number;
//   suffix?: string;
// }) => {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     let start = 0;
//     const end = target;
//     const duration = 2000;
//     const increment = end / (duration / 16);

//     const timer = setInterval(() => {
//       start += increment;
//       if (start >= end) {
//         setCount(end);
//         clearInterval(timer);
//       } else {
//         setCount(Math.floor(start));
//       }
//     }, 16);

//     return () => clearInterval(timer);
//   }, [target]);

//   return (
//     <span>
//       {count}
//       {suffix}
//     </span>
//   );
// };

// // Contact Modal Component
// const ContactModal = ({
//   isOpen,
//   onClose,
//   email,
//   phone,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   email: string;
//   phone: string;
// }) => {
//   if (!isOpen) return null;

//   const copyToClipboard = (text: string, type: string) => {
//     navigator.clipboard.writeText(text);
//   };

//   return (
//     <div className="fixed inset-0 z-50 mt-12 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md">
//       <div className="relative w-full max-w-md overflow-hidden rounded-lg border border-white/10 bg-[#0B0B0F]/95 shadow-[0_20px_80px_rgba(0,0,0,0.65)] animate-scaleIn">
//         {/* Ambient Glow */}
//         <div className="pointer-events-none absolute inset-0 overflow-hidden">
//           <div className="absolute -top-24 right-[-60px] h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
//           <div className="absolute bottom-[-100px] left-[-80px] h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />
//         </div>

//         {/* Header */}
//         <div className="relative flex items-start justify-between border-b border-white/10 px-6 py-5">
//           <div>
//             <h3 className="text-xl font-semibold tracking-tight">
//               Contact Support
//             </h3>

//             <p className="text-xs text-muted-foreground">
//               Fastest way to reach our team
//             </p>
//           </div>

//           <button
//             onClick={onClose}
//             className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition-all duration-200 hover:bg-white/[0.06] hover:text-white"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="relative space-y-4 p-6">
//           {/* WhatsApp */}
//           <a
//             href={`https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(
//               `Hi Fahad,

// I would like to get in touch regarding AuditProRx.

// Please let me know a convenient time to connect.

// Thank you.`,
//             )}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="group relative flex items-center gap-4 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:border-emerald-500/30 hover:bg-emerald-500/[0.08]"
//           >
//             <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
//               <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />
//             </div>

//             {/* <div className="relative grid h-14 w-14 place-items-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
//               <Phone className="h-6 w-6 text-emerald-400" />
//             </div> */}

//             <div className="relative flex-1">
//               <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
//                 WhatsApp &bull;
//               </span>{" "}
//               <span className="mt-1 text-sm font-semibold text-white">
//                 {phone}
//               </span>
//               <p className="mt-1 text-xs text-zinc-400">
//                 Instant support & quick responses
//               </p>
//             </div>

//             <div className="relative opacity-60 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
//               <svg
//                 className="h-5 w-5 text-white"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M13 7l5 5m0 0l-5 5m5-5H6"
//                 />
//               </svg>
//             </div>
//           </a>

//           {/* Gmail */}
//           <a
//             href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(
//               "AuditProRx Inquiry",
//             )}&body=${encodeURIComponent(
//               `Hi Fahad,

// I wanted to get in touch regarding AuditProRx and had a few questions.

// Looking forward to your response.

// Best regards,`,
//             )}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="group relative flex items-center gap-4 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:border-blue-500/30 hover:bg-blue-500/[0.08]"
//           >
//             <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
//               <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />
//             </div>
//             {/*
//             <div className="relative grid h-14 w-14 place-items-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
//               <FileText className="h-6 w-6 text-blue-400" />
//             </div> */}

//             <div className="relative flex-1">
//               <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
//                 Gmail &bull;
//               </span>{" "}
//               <span className="mt-1 text-sm font-semibold text-white">
//                 {email}
//               </span>
//               <p className="mt-1 text-xs text-zinc-400">
//                 Best for detailed discussions
//               </p>
//             </div>

//             <div className="relative opacity-60 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
//               <svg
//                 className="h-5 w-5 text-white"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M13 7l5 5m0 0l-5 5m5-5H6"
//                 />
//               </svg>
//             </div>
//           </a>

//           {/* Footer Note */}
//           {/* <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"> */}
//           <p className="text-center text-xs leading-relaxed text-zinc-400">
//             Typically responds within a few business hours.
//           </p>
//           {/* </div> */}
//         </div>

//         {/* Footer */}
//         <div className="relative border-t border-white/10 p-6">
//           <button
//             onClick={onClose}
//             className="w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.01] hover:bg-zinc-200 active:scale-[0.99]"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function Index() {
//   const [stats, setStats] = useState([
//     ["0", "+", "Verified BIN-PCN-GROUP Intelligence"],
//     ["0", "+", "Audits Generated"],
//     ["0", "+", "Active Pharmacy Groups"],
//     ["100", "%", "HIPAA Compliant"],
//   ]);
//   const currentYear = new Date().getFullYear();
//   const [expandedAddOns, setExpandedAddOns] = useState<{
//     [key: string]: boolean;
//   }>({
//     base: false,
//   });
//   const [isContactModalOpen, setIsContactModalOpen] = useState(false);
//   const [isFaqOpen, setIsFaqOpen] = useState(false);
//   const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
//   const faqs = [
//     {
//       q: "How quickly can we get started?",
//       a: "Most pharmacies are onboarded within 48 hours. Our team manages the setup and ensures a smooth integration with your existing systems.",
//     },
//     {
//       q: "Is my data secure?",
//       a: "Yes. We follow HIPAA-compliant practices with end-to-end encryption and industry-standard security protocols to ensure your data remains protected.",
//     },
//     {
//       q: "Do you integrate with my PMS?",
//       a: "We support integration with leading pharmacy management systems, ensuring seamless data flow and minimal disruption to your workflow.",
//     },
//     {
//       q: "What kind of support do you offer?",
//       a: "All plans include email support, with priority assistance available for higher-tier plans to ensure timely issue resolution.",
//     },
//     {
//       q: "Are there any long-term contracts or commitments?",
//       a: "No. Our plans are flexible with no long-term commitments, allowing you to scale or cancel based on your operational needs.",
//     },
//   ];
//   const contactEmail = "auditprorx@gmail.com";
//   const contactPhone = "+1 (551) 229-6466"; // Replace with actual phone number

//   const fetchStats = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/landing/stats`,
//       );

//       const data = response.data.stats;

//       setStats([
//         [data.master_sheet_entries, "+", "Verified BIN-PCN-GROUP Intelligence"],

//         [data.audits_generated, "+", "Audits Generated"],

//         [data.active_pharmacies - 1, "+", "Active Pharmacy Groups"],

//         ["100", "%", "HIPAA Compliant"],
//       ]);
//     } catch (err) {
//       console.error("Stats error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   // Scroll-reveal: animate every direct child of each section/header/footer
//   // as it enters the viewport, with a small per-child stagger so text and
//   // components appear one after another (line by line).
//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const containers = Array.from(
//       document.querySelectorAll("section, header, footer, main"),
//     );
//     const targets: HTMLElement[] = [];

//     containers.forEach((container) => {
//       const children = Array.from(container.children) as HTMLElement[];
//       children.forEach((child, idx) => {
//         child.classList.add("reveal-on-scroll");
//         child.style.transitionDelay = `${Math.min(idx * 100, 700)}ms`;
//         targets.push(child);
//       });
//     });

//     const io = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add("in-view");
//             io.unobserve(entry.target);
//           }
//         });
//       },
//       { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
//     );

//     targets.forEach((el) => io.observe(el));

//     return () => io.disconnect();
//   }, []);

//   const scheduleConsultation = () => {
//     window.open("https://calendar.app.google/ekTAPx65xrwq2Qiv6", "_blank");
//   };

//   const handleRequestInfo = () => {
//     setIsContactModalOpen(true);
//   };

//   const downloadScreenConnect = () => {
//     const link = document.createElement("a");
//     link.href = "https://www.screenconnect.com/Download";
//     link.download = "screenconnect-installer.exe";
//     link.target = "_blank";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="min-h-screen bg-background text-foreground antialiased">
//       <style>{animationStyles}</style>

//       <ContactModal
//         isOpen={isContactModalOpen}
//         onClose={() => setIsContactModalOpen(false)}
//         email={contactEmail}
//         phone={contactPhone}
//       />

//       {/* NAV */}
//       <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
//         <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-7">
//           <Logo />
//           <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
//             {[
//               "Features",
//               "Drug Lookup",
//               "Audit Reports",
//               "Leads",
//               "Pricing",
//               "Support",
//             ].map((l) => (
//               <a
//                 key={l}
//                 href={`#${l.toLowerCase().replace(/ /g, "-")}`}
//                 className="hover:text-foreground transition"
//               >
//                 {l}
//               </a>
//             ))}
//           </nav>
//           <div className="flex items-center gap-8.5">
//             <a
//               href="/auth"
//               className="text-sm text-muted-foreground hover:text-foreground"
//             >
//               Log In
//             </a>
//             <button
//               onClick={scheduleConsultation}
//               className="rounded-lg bg-gradient-to-b from-zinc-100 to-zinc-300 px-4 py-2 text-sm font-medium text-background shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:from-white animate-fadeInUp stagger-0"
//             >
//               Schedule a Consultation
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* HERO */}
//       <section className="relative overflow-hidden border-b border-border/60">
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]" />
//         <div className="relative mx-auto max-w-[1440px] px-7 pt-20 pb-16 text-center">
//           <div className="absolute inset-0 pointer-events-none overflow-hidden">
//             <div
//               className="absolute top-[20%] left-0 w-[1600px] h-[1600px] rounded-full blur-[220px]"
//               style={{
//                 background:
//                   "radial-gradient(circle, hsl(210 15% 50% / 0.05), transparent 70%)",
//               }}
//             />

//             <div
//               className="absolute bottom-[-300px] right-0 w-[1000px] h-[1000px] rounded-full blur-[200px]"
//               style={{
//                 background:
//                   "radial-gradient(circle, hsl(0 0% 30% / 0.1), transparent 70%)",
//               }}
//             />

//             {/* Outer Circle - moved more downward */}
//             <div
//               className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1500px] h-[1500px] rounded-full border"
//               style={{ borderColor: "hsl(0 0% 15%)" }}
//             />

//             {/* Inner Circle - moved more downward */}
//             <div
//               className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full border"
//               style={{ borderColor: "hsl(0 0% 10%)" }}
//             />

//             {/* Grid pattern */}
//             <div
//               className="absolute inset-0 opacity-[0.03]"
//               style={{
//                 backgroundImage:
//                   "linear-gradient(hsl(0 0% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 50%) 1px, transparent 1px)",
//                 backgroundSize: "200px 200px",
//               }}
//             />
//           </div>
//           <Pill>Enterprise Pharmacy Operations Platform</Pill>
//           <h1 className="mx-auto mt-8 max-w-5xl text-6xl font-semibold leading-[1.05] tracking-tight md:text-7xl animate-fadeInUp stagger-1">
//             Precision Audit Intelligence
//             <br />
//             <span className="text-muted-foreground/70 animate-fadeInUp stagger-2">
//               for Modern Pharmacies
//             </span>
//           </h1>
//           <p className="mx-auto mt-7 max-w-3xl text-[15px] leading-relaxed text-muted-foreground animate-fadeInUp stagger-3">
//             Automate audit workflows, protect revenue, access drug intelligence,
//             and collaborate across pharmacy networks — all in one platform built
//             for pharmacy teams.
//           </p>
//           <div className="mt-9 flex items-center justify-center gap-3 animate-fadeInUp stagger-4">
//             <button
//               onClick={scheduleConsultation}
//               className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-zinc-100 to-zinc-300 px-5 py-3 text-sm font-medium text-background shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
//             >
//               Schedule a Consultation <ArrowRight className="h-4 w-4" />
//             </button>
//             <a
//               href="#"
//               className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 text-sm text-foreground hover:bg-surface-2"
//             >
//               <Play className="h-4 w-4" /> Watch Overview
//             </a>
//           </div>
//           <div className="mt-9 flex items-center justify-center gap-4 text-sm text-muted-foreground animate-fadeInUp stagger-5">
//             <div className="flex -space-x-2">
//               {[
//                 { initial: "UC", gradients: "from-blue-400 to-cyan-300" },
//                 { initial: "IA", gradients: "from-amber-300 to-yellow-500" },
//                 { initial: "KA", gradients: "from-pink-300 to-rose-400" },
//               ].map((item, i) => (
//                 <div
//                   key={item.initial}
//                   className={`h-7 w-7 rounded-full border-2 border-background bg-gradient-to-br ${item.gradients} flex items-center justify-center text-xs font-bold text-white`}
//                 >
//                   {item.initial}
//                 </div>
//               ))}
//             </div>
//             <div className="flex gap-0.5 text-foreground">
//               {[...Array(5)].map((_, i) => (
//                 <Star key={i} className="h-3.5 w-3.5 fill-foreground" />
//               ))}
//             </div>
//             <span>Trusted by {stats[2][0]}+ pharmacy groups</span>
//           </div>

//           {/* Dashboard Mock */}
//           <div className="mx-auto mt-16 max-w-5xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl animate-scaleIn stagger-6">
//             <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-4 py-3">
//               <div className="flex gap-1.5">
//                 <span className="h-3 w-3 rounded-full bg-zinc-700" />
//                 <span className="h-3 w-3 rounded-full bg-zinc-700" />
//                 <span className="h-3 w-3 rounded-full bg-zinc-700" />
//               </div>
//               <div className="mx-auto rounded-md bg-background px-4 py-1 text-xs text-muted-foreground">
//                 app.auditprorx.com/dashboard
//               </div>
//             </div>
//             <div className="grid grid-cols-[200px_1fr] gap-0">
//               <aside className="border-r border-border p-4 text-left text-sm">
//                 {[
//                   ["Dashboard"],
//                   ["Inventory"],
//                   ["Audits", true],
//                   ["Drug Lookup"],
//                   ["Reports"],
//                   ["Settings"],
//                 ].map(([n, active]) => (
//                   <div
//                     key={n as string}
//                     className={`mb-1 flex items-center gap-2 rounded-md px-3 py-2 ${active ? "bg-surface-2 text-foreground" : "text-muted-foreground"}`}
//                   >
//                     <span
//                       className={`h-1.5 w-1.5 rounded-full ${active ? "bg-success" : "bg-muted-foreground/50"}`}
//                     />
//                     {n}
//                   </div>
//                 ))}
//               </aside>
//               <div className="p-6 text-left">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h3 className="font-semibold">Audit Management</h3>
//                     <p className="text-xs text-muted-foreground">
//                       Q4 2024 · 47 active audits
//                     </p>
//                   </div>
//                   <div className="flex gap-2">
//                     <button className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground">
//                       Export
//                     </button>
//                     <button className="rounded-md bg-gradient-to-b from-zinc-200 to-zinc-400 px-3 py-1.5 text-xs font-medium text-background">
//                       + New Audit
//                     </button>
//                   </div>
//                 </div>
//                 <div className="mt-4 grid grid-cols-4 gap-3">
//                   {[
//                     ["Revenue Saved", "$847K", "+12%", "success"],
//                     ["Audits Resolved", "94.2%", "+3.1%", "success"],
//                     ["Active Claims", "47", "", ""],
//                     ["Avg Response", "2.4 days", "", ""],
//                   ].map(([l, v, d, c]) => (
//                     <div
//                       key={l}
//                       className="rounded-lg border border-border bg-surface-2 p-3"
//                     >
//                       <div className="text-[11px] text-muted-foreground">
//                         {l}
//                       </div>
//                       <div className="mt-1 text-lg font-semibold">{v}</div>
//                       {d && (
//                         <div
//                           className={`text-[11px] ${c === "success" ? "text-success" : "text-muted-foreground"}`}
//                         >
//                           {d}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//                 <div className="mt-4 overflow-hidden rounded-lg border border-border">
//                   <table className="w-full text-xs">
//                     <thead className="bg-surface-2 text-left text-[10px] uppercase tracking-wider text-muted-foreground">
//                       <tr>
//                         {[
//                           "NDC",
//                           "Drug Name",
//                           "Rank",
//                           "Ordered",
//                           "Billed",
//                           "Status",
//                         ].map((h) => (
//                           <th key={h} className="px-4 py-2.5">
//                             {h}
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-border">
//                       {[
//                         [
//                           "00093-0150",
//                           "Amoxicillin 500mg",
//                           "A",
//                           "240",
//                           "$480",
//                           "Active",
//                           "success",
//                         ],
//                         [
//                           "00071-0155",
//                           "Lisinopril 10mg",
//                           "B",
//                           "180",
//                           "$310",
//                           "Review",
//                           "warning",
//                         ],
//                         [
//                           "00093-1040",
//                           "Metformin 500mg",
//                           "A",
//                           "320",
//                           "$620",
//                           "OK",
//                           "",
//                         ],
//                         [
//                           "00071-0215",
//                           "Atorvastatin 20mg",
//                           "A",
//                           "155",
//                           "$780",
//                           "Urgent",
//                           "danger",
//                         ],
//                         [
//                           "00093-0032",
//                           "Omeprazole 20mg",
//                           "B",
//                           "200",
//                           "$340",
//                           "OK",
//                           "",
//                         ],
//                       ].map((r) => (
//                         <tr key={r[0]} className="text-muted-foreground">
//                           <td className="px-4 py-3 font-mono">{r[0]}</td>
//                           <td className="px-4 py-3 text-foreground">{r[1]}</td>
//                           <td className="px-4 py-3">{r[2]}</td>
//                           <td className="px-4 py-3">{r[3]}</td>
//                           <td className="px-4 py-3 text-foreground">{r[4]}</td>
//                           <td className="px-4 py-3">
//                             <span
//                               className={`rounded-full px-2 py-0.5 text-[10px] ${
//                                 r[6] === "success"
//                                   ? "bg-success/15 text-success"
//                                   : r[6] === "warning"
//                                     ? "bg-warning/15 text-warning"
//                                     : r[6] === "danger"
//                                       ? "bg-danger/15 text-danger"
//                                       : "bg-muted text-muted-foreground"
//                               }`}
//                             >
//                               {r[5]}
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* STATS */}
//       <div
//         className="absolute inset-0 opacity-[0.03]"
//         style={{
//           backgroundImage:
//             "linear-gradient(hsl(0 0% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 50%) 1px, transparent 1px)",
//           backgroundSize: "60px 60px",
//         }}
//       />
//       <section className="border-b border-border/60">
//         <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-border md:grid-cols-4">
//           {stats.map(([v, s, l], idx) => (
//             <div
//               key={l}
//               className="px-7 py-12 text-center animate-fadeInUp"
//               style={{ animationDelay: `${idx * 0.15}s` }}
//             >
//               <div className="text-4xl font-semibold">
//                 <Counter target={parseInt(v)} suffix={s} />
//               </div>
//               <div className="mt-2 text-sm text-muted-foreground">{l}</div>
//             </div>
//           ))}
//         </div>
//         {/* <div
//           className="absolute inset-0 opacity-[0.03]"
//           style={{
//             backgroundImage:
//               "linear-gradient(hsl(0 0% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 50%) 1px, transparent 1px)",
//             backgroundSize: "60px 60px",
//           }}
//         /> */}
//       </section>

//       {/* MARQUEE TAGS */}
//       <section className="border-b border-border/60 py-10">
//         <p className="text-center text-xs tracking-[0.3em] text-muted-foreground/70 animate-fadeInUp stagger-0">
//           BUILT FOR MODERN PHARMACY WORKFLOWS
//         </p>
//         <div className="mt-6 overflow-hidden">
//           <div className="marquee-wrapper">
//             <div className="marquee-content animate">
//               {[
//                 "Audit Defense",
//                 "Drug Lookup",
//                 "Audit Reports",
//                 "Claims Recovery",
//                 "Compliance Reporting",
//                 "Pharmacy Networks",
//                 "Revenue Protection",
//                 "HIPAA Security",
//               ].map((t, idx) => (
//                 <span
//                   key={`${t}-1`}
//                   className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs text-muted-foreground animate-fadeInUp"
//                   style={{ animationDelay: `${idx * 0.05}s` }}
//                 >
//                   <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
//                   {t}
//                 </span>
//               ))}
//               {[
//                 "Audit Defense",
//                 "Drug Lookup",
//                 "Audit Reports",
//                 "Claims Recovery",
//                 "Compliance Reporting",
//                 "Pharmacy Networks",
//                 "Revenue Protection",
//                 "HIPAA Security",
//               ].map((t) => (
//                 <span
//                   key={`${t}-2`}
//                   className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs text-muted-foreground"
//                 >
//                   <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
//                   {t}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* FEATURES GRID */}
//       <section id="features" className="border-b border-border/60 py-24">
//         <div className="mx-auto max-w-[1200px] px-7">
//           <div className="text-center">
//             <Pill>Platform Capabilities</Pill>
//             <h2 className="mt-6 text-5xl font-semibold tracking-tight animate-fadeInUp stagger-1">
//               Everything Your Pharmacy Team Needs
//             </h2>
//             <p className="mx-auto mt-4 max-w-xl text-muted-foreground animate-fadeInUp stagger-2">
//               Built by pharmacists, for pharmacists. Every capability engineered
//               to protect revenue and simplify operations.
//             </p>
//           </div>
//           {/* <div className="mt-14 grid gap-5 md:grid-cols-3">
//             {[
//               [
//                 FileText,
//                 "Inventory Audit Reports",
//                 "Generate detailed pharmacy audit reports across multiple wholesalers. Track every NDC, drug, and unit billed vs. ordered — pre-built templates and one-click exports ready for any PBM audit.",
//               ],
//               [
//                 SearchCode,
//                 "Digital Drug Lookup",
//                 "Search any drug by brand name, generic name, or NDC against a 60K+ database. Instantly access pricing, GPI group, and reference data sourced directly from the industry's most trusted catalogs.",
//               ],
//               [
//                 AlertTriangle,
//                 "Aberrant Risk Detection",
//                 "Surface high-risk billing patterns before PBMs do. Automated flagging on quantity outliers, refill anomalies, and NDC-level discrepancies — so you can fix exposure before it becomes a chargeback.",
//               ],
//               [
//                 Network,
//                 "Pharmacy Inventory Network",
//                 "Connect with fellow pharmacies to source short-dated or excess inventory in a private, trusted marketplace. Post once, move stock, and recover capital that would otherwise sit on your shelves.",
//               ],
//               [
//                 Settings2,
//                 "Admin Automation",
//                 "Streamline day-to-day pharmacy admin — credentialing reminders, document organization, and operational workflows handled in the background so your team stays focused on patient care.",
//               ],
//               [
//                 LifeBuoy,
//                 "Product Support Hub",
//                 "Direct access to pharmacy-savvy support, onboarding guides, and a growing knowledge base. Real humans who understand independent pharmacy operations — not generic ticket queues.",
//               ],
//             ].map(([Icon, t, d]: any, idx) => (
//               <div
//                 key={t}
//                 className="rounded-2xl border border-border bg-surface p-6 animate-fadeInUp transition-all hover:shadow-lg hover:border-border/80 flex flex-col"
//                 style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
//               >
//                 <div className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface-2 animate-fadeInUp">
//                   <Icon className="h-5 w-5 text-muted-foreground" />
//                 </div>
//                 <h3
//                   className="mt-4 font-semibold animate-fadeInUp"
//                   style={{ animationDelay: `${0.15 + idx * 0.1}s` }}
//                 >
//                   {t}
//                 </h3>
//                 <p
//                   className="mt-2 text-sm leading-relaxed text-muted-foreground flex-grow animate-fadeInUp"
//                   style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
//                 >
//                   {d}
//                 </p>
//               </div>
//             ))}
//           </div> */}
//           <div className="mt-16 divide-y divide-border/70 border-y border-border/70">
//             <div className="grid grid-cols-1 md:grid-cols-2">
//               {[
//                 [
//                   FileText,
//                   "Inventory Audit Reports",
//                   "Generate pharmacy audit reports with wholesaler, NDC, and billing reconciliation in minutes.",
//                 ],

//                 [
//                   SearchCode,
//                   "Digital Drug Lookup",
//                   "Search 60K+ drugs by NDC, brand, or generic name with real-time PBM reference data.",
//                 ],

//                 [
//                   Users,
//                   "Pharmacy Leads",
//                   "Access admin-curated reimbursement opportunities, profitable drug leads, and payer insights.",
//                 ],

//                 [
//                   Network,
//                   "Pharmacy Inventory Network",
//                   "Connect with pharmacies to buy, sell, and manage short-dated or excess inventory efficiently.",
//                 ],

//                 [
//                   Settings2,
//                   "Admin Automation",
//                   "Simplify pharmacy operations with automated workflows, reminders, and document management.",
//                 ],

//                 [
//                   LifeBuoy,
//                   "Product Support Hub",
//                   "Get direct access to onboarding help, support resources, and pharmacy-focused assistance.",
//                 ],
//               ].map(([Icon, t, d]: any, idx) => (
//                 <div
//                   key={t}
//                   className="group border-b border-border/70 p-6 animate-fadeInUp transition-colors hover:bg-surface/40"
//                   style={{ animationDelay: `${0.1 + idx * 0.08}s` }}
//                 >
//                   <div className="grid grid-cols-12 gap-6">
//                     {/* Index number */}
//                     <div className="col-span-12 md:col-span-1">
//                       <span className="font-mono text-sm tracking-widest text-muted-foreground">
//                         {String(idx + 1).padStart(2, "0")}
//                       </span>
//                     </div>

//                     {/* Icon */}
//                     <div className="col-span-12 md:col-span-2">
//                       <div className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface-2 transition-transform group-hover:-translate-y-0.5">
//                         <Icon className="h-5 w-5 text-muted-foreground" />
//                       </div>
//                     </div>

//                     {/* Content */}
//                     <div className="col-span-12 md:col-span-9">
//                       <h3 className="text-xl font-semibold tracking-tight">
//                         {t}
//                       </h3>

//                       <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
//                         {d}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* INVENTORY REPORTS */}
//       <section id="audit-reports" className="border-b border-border/60 py-24">
//         <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-7 lg:grid-cols-2">
//           <div className="animate-slideInLeft">
//             <Pill>Inventory Reports</Pill>
//             <h2 className="mt-6 text-4xl font-semibold tracking-tight animate-fadeInUp stagger-1">
//               Comprehensive Inventory Reporting
//             </h2>
//             <p className="mt-4 text-muted-foreground animate-fadeInUp stagger-2">
//               Generate detailed inventory audit reports that track medication
//               inventory, identify discrepancies, and provide actionable
//               insights. Our intelligent reporting system delivers comprehensive
//               analysis across all pharmacy locations.
//             </p>
//             <ul className="mt-6 space-y-3 text-sm">
//               {[
//                 "Real-time inventory tracking and shortage alerts",
//                 "Detailed NDC and medication analysis",
//                 "Automated report generation and export",
//                 "Multi-location inventory consolidation",
//               ].map((f, idx) => (
//                 <li
//                   key={f}
//                   className="flex items-center gap-3 animate-fadeInUp"
//                   style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
//                 >
//                   <span className="grid h-5 w-5 place-items-center rounded-full bg-surface-2">
//                     <Check className="h-3 w-3 text-success" />
//                   </span>
//                   {f}
//                 </li>
//               ))}
//             </ul>
//           </div>
//           <div className="rounded-2xl border border-border bg-surface p-6 animate-slideInRight overflow-x-auto">
//             <div className="flex items-start justify-between animate-fadeInUp">
//               <div>
//                 <h4 className="font-semibold">Inventory Reports</h4>
//                 <p className="text-xs text-muted-foreground">
//                   Updated 3 minutes ago
//                 </p>
//               </div>
//               <span className="inline-flex items-center gap-1.5 text-xs text-success">
//                 <span className="h-1.5 w-1.5 rounded-full bg-success" />
//                 Live
//               </span>
//             </div>
//             <div className="mt-5 grid grid-cols-[1fr_1fr_0.8fr_0.8fr_0.8fr_1fr_1fr] gap-3 text-[9px] uppercase tracking-wider text-muted-foreground animate-fadeInUp stagger-1 whitespace-nowrap">
//               <div>NDC</div>
//               <div>Drug Name</div>
//               <div>Total Ordered</div>
//               <div>Total Billed</div>
//               <div>Total Shortage</div>
//               <div>Highest Cost</div>
//               <div>PBM/Payer</div>
//             </div>
//             <div className="mt-2 divide-y divide-border">
//               {[
//                 [
//                   "00093-0150",
//                   "Amoxicillin 500mg",
//                   "1,240",
//                   "1,180",
//                   "60",
//                   "$2,840.00",
//                   "Medicaid/Commercial",
//                   "success",
//                 ],
//                 [
//                   "00071-0155",
//                   "Lisinopril 10mg",
//                   "850",
//                   "792",
//                   "58",
//                   "$1,950.00",
//                   "Medicare/Medicaid",
//                   "warning",
//                 ],
//                 [
//                   "00093-1040",
//                   "Metformin 500mg",
//                   "2,100",
//                   "2,040",
//                   "60",
//                   "$3,240.00",
//                   "Commercial",
//                   "success",
//                 ],
//                 [
//                   "00071-0215",
//                   "Atorvastatin 20mg",
//                   "640",
//                   "580",
//                   "60",
//                   "$2,320.00",
//                   "Medicare/Commercial",
//                   "danger",
//                 ],
//                 [
//                   "00093-0032",
//                   "Omeprazole 20mg",
//                   "1,120",
//                   "1,050",
//                   "70",
//                   "$1,680.00",
//                   "Medicaid",
//                   "success",
//                 ],
//               ].map((r, idx) => (
//                 <div
//                   key={r[0]}
//                   className="grid grid-cols-[1fr_1fr_0.8fr_0.8fr_0.8fr_1fr_1fr] gap-3 items-center py-3 text-xs animate-fadeInUp whitespace-nowrap"
//                   style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
//                 >
//                   <div className="font-mono text-foreground">{r[0]}</div>
//                   <div className="text-foreground">{r[1]}</div>
//                   <div className="text-muted-foreground">{r[2]}</div>
//                   <div className="text-muted-foreground">{r[3]}</div>
//                   <div className="text-muted-foreground">{r[4]}</div>
//                   <div className="text-foreground font-semibold">{r[5]}</div>
//                   <div>
//                     <span
//                       className={`rounded-full px-2 py-0.5 text-[9px] inline-block ${
//                         r[7] === "success"
//                           ? "bg-success/15 text-success"
//                           : r[7] === "warning"
//                             ? "bg-warning/15 text-warning"
//                             : "bg-danger/15 text-danger"
//                       }`}
//                     >
//                       {r[6]}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs animate-fadeInUp stagger-9">
//               <span className="text-muted-foreground">
//                 Showing 5 of 240 inventory reports
//               </span>
//               <button className="rounded-md border border-border px-3 py-1.5">
//                 View All Reports
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ANALYTICS */}
//       <section className="border-b border-border/60 py-24">
//         <div className="mx-auto grid max-w-[800px] grid-cols-1 items-center gap-12 px-7 lg:grid-cols-1">
//           {/* <div className="rounded-2xl border border-border bg-surface p-6 animate-slideInLeft">
//             <div className="animate-fadeInUp stagger-0">
//               <h4 className="font-semibold">Audit Savings — Last 6 Months</h4>
//               <p className="text-xs text-muted-foreground">
//                 Revenue protected through successful audit defense
//               </p>
//             </div>
//             <div className="mt-6 flex h-40 items-end gap-4">
//               {[
//                 ["Jul", 30],
//                 ["Aug", 50],
//                 ["Sep", 65],
//                 ["Oct", 80],
//                 ["Nov", 90],
//                 ["Dec", 100],
//               ].map(([m, h]: any, idx) => (
//                 <div
//                   key={m}
//                   className="flex flex-1 flex-col items-center gap-2 animate-fadeInUp"
//                   style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
//                 >
//                   <div
//                     className="w-full rounded-md bg-gradient-to-t from-zinc-700 to-zinc-400 transition-all hover:opacity-80"
//                     style={{ height: `${h}%` }}
//                   />
//                   <span className="text-[10px] text-muted-foreground">{m}</span>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-6 grid grid-cols-2 gap-4">
//               <div className="rounded-lg border border-border bg-surface-2 p-4 animate-fadeInUp stagger-7">
//                 <div className="text-xs text-muted-foreground">
//                   Total Revenue Saved
//                 </div>
//                 <div className="mt-1 text-2xl font-semibold">$847K</div>
//                 <div className="mt-1 text-[11px] text-success">
//                   ▲ +12.4%{" "}
//                   <span className="text-muted-foreground">vs last period</span>
//                 </div>
//               </div>
//               <div className="rounded-lg border border-border bg-surface-2 p-4 animate-fadeInUp stagger-8">
//                 <div className="text-xs text-muted-foreground">
//                   Audit Success Rate
//                 </div>
//                 <div className="mt-1 text-2xl font-semibold">94.2%</div>
//                 <div className="mt-1 text-[11px] text-success">
//                   ▲ +3.1%{" "}
//                   <span className="text-muted-foreground">improvement</span>
//                 </div>
//               </div>
//             </div>
//           </div> */}
//           <div className="animate-slideInRight">
//             <Pill>Demonstration Walkthrough</Pill>
//             {/* <h2 className="mt-6 text-4xl font-semibold tracking-tight animate-fadeInUp stagger-1">
//               Data-Driven Audit Intelligence
//             </h2>
//             <p className="mt-4 text-muted-foreground animate-fadeInUp stagger-2">
//               Visualize audit performance with powerful analytics. Understand
//               trends, identify vulnerabilities, and make informed decisions to
//               protect your pharmacy's bottom line.
//             </p> */}
//             <div className="mt-6 relative rounded-2xl border border-border bg-surface-2 overflow-hidden animate-fadeInUp stagger-3">
//               {/* Video Container */}
//               <div className="relative w-full aspect-video bg-black flex items-center justify-center">
//                 {/* Coming Soon Overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 flex flex-col items-center justify-center backdrop-blur-sm">
//                   <div className="text-center animate-fadeInUp stagger-4">
//                     <Play className="h-16 w-16 text-zinc-400 mx-auto mb-4" />
//                     <h3 className="text-2xl font-semibold text-white mb-2 animate-fadeInUp stagger-5">
//                       Coming Soon
//                     </h3>
//                     <p className="text-sm text-zinc-300 animate-fadeInUp stagger-6">
//                       Platform demonstration video
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* <ul className="mt-6 space-y-3 text-sm">
//               {[
//                 "Real-time revenue protection dashboards",
//                 "Audit trend analysis and forecasting",
//                 "Risk scoring and vulnerability detection",
//                 "Exportable compliance and board reports",
//               ].map((f, idx) => (
//                 <li
//                   key={f}
//                   className="flex items-center gap-3 animate-fadeInUp"
//                   style={{ animationDelay: `${0.4 + idx * 0.1}s` }}
//                 >
//                   <span className="grid h-5 w-5 place-items-center rounded-full bg-surface-2">
//                     <Check className="h-3 w-3 text-success" />
//                   </span>
//                   {f}
//                 </li>
//               ))}
//             </ul> */}
//           </div>
//         </div>
//       </section>

//       {/* DRUG LOOKUP */}
//       <section id="drug-lookup" className="border-b border-border/60 py-24">
//         <div className="mx-auto max-w-[1200px] px-7">
//           <div className="text-center">
//             <Pill>Drug Intelligence</Pill>
//             <h2 className="mt-6 text-5xl font-semibold tracking-tight animate-fadeInUp stagger-1">
//               Advanced Drug Lookup & Intelligence
//             </h2>
//             <p className="mx-auto mt-4 max-w-2xl text-muted-foreground animate-fadeInUp stagger-2">
//               Access comprehensive medication intelligence — pricing, NDC data,
//               formulary ranks, and competitive comparisons — directly within
//               your audit workflow.
//             </p>
//           </div>
//           <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.5fr]">
//             <div className="space-y-3">
//               {[
//                 [
//                   Search,
//                   "NDC-Based Search",
//                   "Instant lookup by NDC code, drug name, or manufacturer across 500K+ medications.",
//                 ],
//                 [
//                   DollarSign,
//                   "Real-Time Drug Pricing",
//                   "Access current MAC pricing, AWP data, and cost benchmarks for informed purchasing decisions.",
//                 ],
//                 [
//                   FileSpreadsheet,
//                   "Formulary Intelligence",
//                   "Understand payer tier placement, prior auth requirements, and formulary positioning.",
//                 ],
//                 [
//                   ArrowRight,
//                   "Workflow Integration",
//                   "Drug data surfaces automatically within audit responses — zero manual lookup required.",
//                 ],
//               ].map(([Icon, t, d]: any, idx) => (
//                 <div
//                   key={t}
//                   className="rounded-2xl border border-border bg-surface p-5 animate-fadeInUp transition-all hover:shadow-lg hover:border-border/80"
//                   style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
//                 >
//                   <div className="flex items-start gap-4">
//                     <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-surface-2">
//                       <Icon className="h-4 w-4 text-muted-foreground" />
//                     </div>
//                     <div>
//                       <h4 className="font-semibold">{t}</h4>
//                       <p className="mt-1 text-sm text-muted-foreground">{d}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="rounded-2xl border border-border bg-surface p-6 animate-slideInRight">
//               <div className="flex items-center justify-between animate-fadeInUp stagger-0">
//                 <div className="flex items-center gap-2 font-semibold">
//                   <Search className="h-4 w-4" /> Drug Lookup Console
//                 </div>
//                 <span className="inline-flex items-center gap-1.5 text-xs text-success">
//                   <span className="h-1.5 w-1.5 rounded-full bg-success" />
//                   Live database
//                 </span>
//               </div>
//               <div className="mt-5 flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm text-muted-foreground animate-fadeInUp stagger-1">
//                 <Search className="h-4 w-4" /> Search by drug name, NDC, or
//                 manufacturer...
//                 <span className="ml-auto rounded border border-border px-2 py-0.5 text-[10px]">
//                   ⌘K
//                 </span>
//               </div>
//               <div className="mt-4 flex flex-wrap gap-2">
//                 {[
//                   ["NDC Search", true],
//                   ["Drug Name"],
//                   ["Manufacturer"],
//                   ["Formulary"],
//                   ["Pricing"],
//                 ].map(([n, a]: any, idx) => (
//                   <span
//                     key={n}
//                     className={`rounded-full border border-border px-3 py-1 text-xs transition-all animate-fadeInUp ${a ? "bg-surface-2 text-foreground" : "text-muted-foreground"}`}
//                     style={{ animationDelay: `${0.2 + idx * 0.05}s` }}
//                   >
//                     {n}
//                   </span>
//                 ))}
//               </div>
//               <p className="mt-5 text-xs text-muted-foreground animate-fadeInUp stagger-3">
//                 Showing 3 results for "Amoxicillin 500mg"
//               </p>
//               <div className="mt-3 divide-y divide-border">
//                 {[
//                   [
//                     "Amoxicillin 500mg Capsule",
//                     "00093-0150-01",
//                     "Teva Pharmaceuticals",
//                     "Generic",
//                     "Tier 1",
//                     "$0.18/unit",
//                   ],
//                   [
//                     "Amoxicillin 500mg — Brand",
//                     "00029-6008-21",
//                     "GlaxoSmithKline",
//                     "Brand",
//                     "Tier 3",
//                     "$1.24/unit",
//                     "brand",
//                   ],
//                   [
//                     "Amoxicillin 875mg Tablet",
//                     "00093-2267-01",
//                     "Teva Pharmaceuticals",
//                     "Generic",
//                     "Tier 1",
//                     "$0.22/unit",
//                   ],
//                 ].map((r, idx) => (
//                   <div
//                     key={r[0]}
//                     className="flex items-center justify-between py-4 animate-fadeInUp"
//                     style={{ animationDelay: `${0.4 + idx * 0.1}s` }}
//                   >
//                     <div>
//                       <div className="font-medium">{r[0]}</div>
//                       <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
//                         <span className="font-mono">{r[1]}</span>
//                         <span>·</span>
//                         <span>{r[2]}</span>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <span
//                         className={`rounded-full px-2 py-0.5 text-[10px] ${r[6] === "brand" ? "bg-warning/15 text-warning" : "bg-success/15 text-success"}`}
//                       >
//                         {r[3]}
//                       </span>
//                       <span className="rounded-full border border-border px-2 py-0.5 text-[10px]">
//                         {r[4]}
//                       </span>
//                       <span className="text-sm font-semibold">{r[5]}</span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground animate-fadeInUp stagger-7">
//                 <span>Database: 500K+ medications · Updated daily</span>
//                 <button className="rounded-md border border-border px-3 py-1.5">
//                   Export Results
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* NETWORK */}
//       <section className="border-b border-border/60 py-24">
//         <div className="mx-auto max-w-[1200px] px-7">
//           <div className="text-center">
//             <Pill>Inventory Network</Pill>
//             <h2 className="mt-6 text-5xl font-semibold tracking-tight animate-fadeInUp stagger-1">
//               Collaborate Across Pharmacy Networks
//             </h2>
//             <p className="mx-auto mt-4 max-w-2xl text-muted-foreground animate-fadeInUp stagger-2">
//               Create private pharmacy groups, share inventory across trusted
//               networks, and post listings globally — giving your pharmacy group
//               a competitive operational advantage.
//             </p>
//           </div>
//           <div className="mt-14 grid gap-4 md:grid-cols-4">
//             {[
//               [
//                 Home,
//                 "Create Pharmacy Groups",
//                 "Form private networks with trusted pharmacy partners and control visibility.",
//               ],
//               [
//                 Phone,
//                 "Invite Partners",
//                 "Send secure invitations to pharmacies you want in your collaboration network.",
//               ],
//               [
//                 CircleDollarSign,
//                 "Global or Private Listings",
//                 "Post inventory to your private group or the broader platform marketplace.",
//               ],
//               [
//                 ShieldCheck,
//                 "Controlled Access",
//                 "Granular permissions determine who sees what — fully under your control.",
//               ],
//             ].map(([Icon, t, d]: any, idx) => (
//               <div
//                 key={t}
//                 className="rounded-2xl border border-border bg-surface p-6 animate-fadeInUp transition-all hover:shadow-lg hover:border-border/80"
//                 style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
//               >
//                 <div className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface-2">
//                   <Icon className="h-5 w-5 text-muted-foreground" />
//                 </div>
//                 <h4 className="mt-5 font-semibold">{t}</h4>
//                 <p className="mt-2 text-sm text-muted-foreground">{d}</p>
//               </div>
//             ))}
//           </div>
//           <div className="mt-8 grid gap-5 lg:grid-cols-2">
//             <div className="rounded-2xl border border-border bg-surface p-6 animate-slideInLeft">
//               <div className="flex items-start justify-between animate-fadeInUp stagger-0">
//                 <div>
//                   <h4 className="font-semibold">Your Pharmacy Group</h4>
//                   <p className="text-xs text-muted-foreground">
//                     Midwest Care Network · 4 pharmacies
//                   </p>
//                 </div>
//                 <button className="rounded-md border border-border px-3 py-1.5 text-xs">
//                   + Invite
//                 </button>
//               </div>
//               <div className="mt-5 divide-y divide-border">
//                 {[
//                   [
//                     "R",
//                     "Riverside Pharmacy",
//                     "Chicago, IL",
//                     "48 listings",
//                     "Owner",
//                     "owner",
//                   ],
//                   [
//                     "C",
//                     "Central Care Rx",
//                     "Naperville, IL",
//                     "32 listings",
//                     "Member",
//                     "success",
//                   ],
//                   [
//                     "M",
//                     "MediQuick Pharmacy",
//                     "Evanston, IL",
//                     "",
//                     "Invited",
//                     "warning",
//                   ],
//                   [
//                     "F",
//                     "Family Health Rx",
//                     "Schaumburg, IL",
//                     "19 listings",
//                     "Member",
//                     "success",
//                   ],
//                 ].map((r, idx) => (
//                   <div
//                     key={r[1]}
//                     className="flex items-center gap-3 py-3 animate-fadeInUp"
//                     style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
//                   >
//                     <div className="grid h-9 w-9 place-items-center rounded-lg bg-surface-2 text-sm font-semibold">
//                       {r[0]}
//                     </div>
//                     <div className="flex-1">
//                       <div className="text-sm font-medium">{r[1]}</div>
//                       <div className="text-xs text-muted-foreground">
//                         {r[2]}
//                       </div>
//                     </div>
//                     <div className="text-xs text-muted-foreground">{r[3]}</div>
//                     <span
//                       className={`rounded-full px-2 py-0.5 text-[10px] ${
//                         r[5] === "success"
//                           ? "bg-success/15 text-success"
//                           : r[5] === "warning"
//                             ? "bg-warning/15 text-warning"
//                             : "bg-muted text-muted-foreground"
//                       }`}
//                     >
//                       {r[4]}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="rounded-2xl border border-border bg-surface p-6 animate-slideInRight">
//               <div className="flex items-start justify-between animate-fadeInUp stagger-0">
//                 <div>
//                   <h4 className="font-semibold">Inventory Marketplace</h4>
//                   <p className="text-xs text-muted-foreground">
//                     Network & global listings · Live
//                   </p>
//                 </div>
//                 <div className="flex rounded-md border border-border p-0.5 text-xs">
//                   <button className="rounded bg-surface-2 px-3 py-1">
//                     Network
//                   </button>
//                   <button className="px-3 py-1 text-muted-foreground">
//                     Global
//                   </button>
//                 </div>
//               </div>
//               <div className="mt-5 flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm text-muted-foreground animate-fadeInUp stagger-1">
//                 <Search className="h-4 w-4" /> Search inventory listings...
//               </div>
//               <div className="mt-4 divide-y divide-border">
//                 {[
//                   [
//                     "Metformin 500mg",
//                     "Riverside Pharmacy · 500 units",
//                     "Network",
//                     "$0.14/unit",
//                   ],
//                   [
//                     "Lisinopril 10mg",
//                     "Central Care Rx · 200 units",
//                     "Global",
//                     "$0.38/unit",
//                   ],
//                   [
//                     "Atorvastatin 40mg",
//                     "Family Health Rx · 150 units",
//                     "Network",
//                     "$0.52/unit",
//                   ],
//                 ].map((r, idx) => (
//                   <div
//                     key={r[0]}
//                     className="flex items-center justify-between py-3 animate-fadeInUp"
//                     style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
//                   >
//                     <div>
//                       <div className="text-sm font-medium">{r[0]}</div>
//                       <div className="text-xs text-muted-foreground">
//                         {r[1]}
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-3">
//                       <span className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
//                         {r[2]}
//                       </span>
//                       <span className="text-sm font-semibold">{r[3]}</span>
//                       <button className="rounded border border-border px-2 py-1 text-[10px]">
//                         Claim
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <a
//                 href="#"
//                 className="mt-4 inline-flex text-xs text-muted-foreground hover:text-foreground animate-fadeInUp stagger-5"
//               >
//                 View all 240 listings →
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* LEADS */}
//       <section id="leads" className="border-b border-border/60 py-24">
//         <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-12 px-7 lg:grid-cols-2">
//           <div className="animate-slideInLeft">
//             <Pill>Pharmacy Leads</Pill>
//             <h2 className="mt-6 text-4xl font-semibold tracking-tight animate-fadeInUp stagger-1">
//               Discover High-Value Pharmacy Opportunities
//             </h2>
//             <p className="mt-4 text-muted-foreground animate-fadeInUp stagger-2">
//               Access curated pharmacy business leads, expansion opportunities,
//               and strategic acquisition targets. AuditProRx's leads engine
//               surfaces data-verified pharmacy connections you won't find
//               anywhere else.
//             </p>
//             <div className="mt-6 space-y-4 text-sm">
//               {[
//                 [
//                   Search,
//                   "Lead Discovery Engine",
//                   "AI-curated pharmacy opportunities matched to your acquisition and partnership criteria.",
//                 ],
//                 [
//                   UserIcon,
//                   "Pharmacy-to-Pharmacy Connections",
//                   "Build strategic relationships with verified pharmacy operators across the country.",
//                 ],
//                 [
//                   BarChart3,
//                   "Marketplace Intelligence",
//                   "Access listing data, revenue estimates, and operational metrics before making contact.",
//                 ],
//               ].map(([Icon, t, d]: any, idx) => (
//                 <div
//                   key={t}
//                   className="flex items-start gap-3 animate-fadeInUp"
//                   style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
//                 >
//                   <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-border bg-surface">
//                     <Icon className="h-4 w-4 text-muted-foreground" />
//                   </span>
//                   <div>
//                     <div className="font-medium">{t}</div>
//                     <p className="text-muted-foreground">{d}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <button className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-zinc-100 to-zinc-300 px-5 py-3 text-sm font-medium text-background animate-fadeInUp stagger-6">
//               Explore Pharmacy Leads <ArrowRight className="h-4 w-4" />
//             </button>
//           </div>
//           <div className="rounded-2xl border border-border bg-surface p-6 animate-slideInRight">
//             <div className="flex items-start justify-between animate-fadeInUp stagger-0">
//               <div>
//                 <h4 className="font-semibold">Pharmacy Lead Board</h4>
//                 <p className="text-xs text-muted-foreground">
//                   Curated · Verified · Updated daily
//                 </p>
//               </div>
//               <span className="inline-flex items-center gap-1.5 text-xs text-success">
//                 <span className="h-1.5 w-1.5 rounded-full bg-success" />
//                 247 active
//               </span>
//             </div>
//             <div className="mt-5 flex flex-wrap gap-2">
//               {[
//                 ["All", true],
//                 ["Independent"],
//                 ["Multi-Store"],
//                 ["Network"],
//               ].map(([n, a]: any, idx) => (
//                 <span
//                   key={n}
//                   className={`rounded-full border border-border px-3 py-1 text-xs animate-fadeInUp ${a ? "bg-surface-2 text-foreground" : "text-muted-foreground"}`}
//                   style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
//                 >
//                   {n}
//                 </span>
//               ))}
//             </div>
//             <div className="mt-4 divide-y divide-border">
//               {[
//                 [
//                   "S",
//                   "Sunrise Family Pharmacy",
//                   "Austin, TX · Independent",
//                   "New Listing",
//                   "$2.4M/yr",
//                   "92",
//                   "new",
//                 ],
//                 [
//                   "L",
//                   "Lakeview Rx Group",
//                   "Milwaukee, WI · Multi-Store",
//                   "High Intent",
//                   "$7.1M/yr",
//                   "87",
//                   "hot",
//                 ],
//                 [
//                   "D",
//                   "Downtown Drug & Health",
//                   "Denver, CO · Independent",
//                   "Verified",
//                   "$1.8M/yr",
//                   "74",
//                   "verified",
//                 ],
//                 [
//                   "A",
//                   "Alliance Pharmacy Partners",
//                   "Phoenix, AZ · Group Network",
//                   "Featured",
//                   "$12.5M/yr",
//                   "95",
//                   "featured",
//                 ],
//               ].map((r, idx) => (
//                 <div
//                   key={r[1]}
//                   className="flex items-center gap-3 py-4 animate-fadeInUp"
//                   style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
//                 >
//                   <div className="grid h-9 w-9 place-items-center rounded-lg bg-surface-2 text-sm font-semibold">
//                     {r[0]}
//                   </div>
//                   <div className="flex-1">
//                     <div className="text-sm font-medium">{r[1]}</div>
//                     <div className="text-xs text-muted-foreground">{r[2]}</div>
//                     <span
//                       className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] ${
//                         r[6] === "hot"
//                           ? "bg-success/15 text-success"
//                           : r[6] === "verified"
//                             ? "bg-muted text-muted-foreground"
//                             : r[6] === "featured"
//                               ? "bg-warning/15 text-warning"
//                               : "bg-muted text-muted-foreground"
//                       }`}
//                     >
//                       {r[3]}
//                     </span>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-sm font-semibold">{r[4]}</div>
//                     <div className="text-[11px] text-muted-foreground">
//                       Score <span className="text-foreground">{r[5]}</span>
//                     </div>
//                     <a
//                       href="#"
//                       className="text-[11px] text-muted-foreground hover:text-foreground"
//                     >
//                       View Profile →
//                     </a>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground animate-fadeInUp stagger-6">
//               <span>Showing 4 of 247 leads</span>
//               <a href="#">View All Leads →</a>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* HOW IT WORKS */}
//       <section className="border-b border-border/60 py-24">
//         <div className="mx-auto max-w-[1200px] px-7 text-center">
//           <Pill>How It Works</Pill>
//           <h2 className="mt-6 text-5xl font-semibold tracking-tight animate-fadeInUp stagger-1">
//             Operational in Three Steps
//           </h2>
//           <p className="mx-auto mt-4 max-w-xl text-muted-foreground animate-fadeInUp stagger-2">
//             From onboarding to full audit protection in minutes, not months.
//           </p>
//           <div className="relative mt-14 grid gap-6 md:grid-cols-3">
//             {[
//               [
//                 "01",
//                 "Connect Your PMS",
//                 "Securely integrate your pharmacy management system. We support all major PMS platforms with zero disruption to your existing workflows.",
//               ],
//               [
//                 "02",
//                 "Automate Audit Workflows",
//                 "Our intelligent engine analyzes your data, generates compliant responses, tracks deadlines, and surfaces risk proactively.",
//               ],
//               [
//                 "03",
//                 "Protect Your Revenue",
//                 "Reduce recoupments, win more appeals, and retain more of the revenue your pharmacy has rightfully earned.",
//               ],
//             ].map(([n, t, d], idx) => (
//               <div
//                 key={n}
//                 className="text-left animate-fadeInUp"
//                 style={{ animationDelay: `${0.1 + idx * 0.15}s` }}
//               >
//                 <div className="mb-4 flex items-center gap-3">
//                   <span className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-xs font-mono">
//                     {n}
//                   </span>
//                   <span className="h-px flex-1 border-t border-dashed border-border" />
//                 </div>
//                 <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col h-3/4 transition-all hover:shadow-lg hover:border-border/80">
//                   <h4
//                     className="font-semibold animate-fadeInUp"
//                     style={{ animationDelay: `${0.2 + idx * 0.15}s` }}
//                   >
//                     {t}
//                   </h4>
//                   <p
//                     className="mt-2 text-sm text-muted-foreground animate-fadeInUp"
//                     style={{ animationDelay: `${0.3 + idx * 0.15}s` }}
//                   >
//                     {d}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* TESTIMONIALS */}
//       <section className="border-b border-border/60 py-24">
//         <div className="mx-auto max-w-[1200px] px-7 text-center">
//           <Pill>Client Testimonials</Pill>
//           <h2 className="mt-6 text-5xl font-semibold tracking-tight animate-fadeInUp stagger-1">
//             Trusted by Pharmacy Leaders
//           </h2>
//           <p className="mt-4 text-muted-foreground animate-fadeInUp stagger-2">
//             Hear from the pharmacy operators who rely on AuditProRx every day.
//           </p>
//           <div className="mt-14 grid gap-5 md:grid-cols-3">
//             {testimonials.map((t, idx) => (
//               <div
//                 key={t.initials}
//                 className="rounded-2xl border border-border bg-surface p-6 text-left animate-fadeInUp transition-all hover:shadow-lg hover:border-border/80"
//                 style={{ animationDelay: `${0.1 + idx * 0.15}s` }}
//               >
//                 <div
//                   className="flex gap-0.5 animate-fadeInUp"
//                   style={{ animationDelay: `${0.15 + idx * 0.15}s` }}
//                 >
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className="h-3.5 w-3.5 fill-foreground text-foreground"
//                     />
//                   ))}
//                 </div>
//                 <p
//                   className="mt-4 text-sm leading-relaxed animate-fadeInUp"
//                   style={{ animationDelay: `${0.2 + idx * 0.15}s` }}
//                 >
//                   <span className="text-lg font-serif">"</span>
//                   {t.quote}
//                   <span className="text-lg font-serif">"</span>
//                 </p>
//                 <div
//                   className="mt-6 flex items-center gap-3 border-t border-border pt-4 animate-fadeInUp"
//                   style={{ animationDelay: `${0.25 + idx * 0.15}s` }}
//                 >
//                   <div
//                     className={`h-9 w-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-sm font-bold text-white`}
//                   >
//                     {t.initials}
//                   </div>
//                   <div>
//                     <div className="text-sm font-medium">{t.name}</div>
//                     <div className="text-xs text-muted-foreground">
//                       {t.role}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* SUPPORT */}
//       <section id="support" className="border-b border-border/60 py-24">
//         <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-12 px-7 lg:grid-cols-2">
//           <div className="animate-slideInLeft">
//             <Pill>Enterprise Support</Pill>
//             <h2 className="mt-6 text-4xl font-semibold tracking-tight animate-fadeInUp stagger-1">
//               Expert Pharmacy Support, When You Need It
//             </h2>
//             <p className="mt-4 text-muted-foreground animate-fadeInUp stagger-2">
//               Our dedicated pharmacy operations team is available Monday through
//               Friday, 9 AM to 5 PM, to provide remote assistance, guided
//               walkthroughs, and immediate issue resolution.
//             </p>
//             <ul className="mt-6 space-y-3 text-sm">
//               {[
//                 "Remote screen-share assistance with certified pharmacy specialists",
//                 "Step-by-step audit workflow guidance",
//                 "Priority issue escalation for urgent audit deadlines",
//                 "Dedicated account manager for enterprise accounts",
//               ].map((f, idx) => (
//                 <li
//                   key={f}
//                   className="flex items-center gap-3 animate-fadeInUp"
//                   style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
//                 >
//                   <span className="grid h-5 w-5 place-items-center rounded-full bg-surface-2">
//                     <Check className="h-3 w-3 text-success" />
//                   </span>
//                   {f}
//                 </li>
//               ))}
//             </ul>
//             <button
//               onClick={downloadScreenConnect}
//               className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-zinc-100 to-zinc-300 px-5 py-3 text-sm font-medium text-background hover:from-white animate-fadeInUp stagger-7 transition-all"
//             >
//               <Download className="h-4 w-4" /> Download Support Access File
//             </button>
//             <p className="mt-3 text-xs text-muted-foreground animate-fadeInUp stagger-8">
//               Initiates a secure remote assistance session with our team via
//               ScreenConnect.
//             </p>
//           </div>
//           <div className="rounded-2xl border border-border bg-surface p-6 animate-slideInRight">
//             <div className="flex items-start justify-between animate-fadeInUp stagger-0">
//               <div>
//                 <h4 className="font-semibold">AuditProRx Remote Assistance</h4>
//                 <p className="text-xs text-muted-foreground">
//                   Mon – Fri · 9:00 AM – 5:00 PM CST
//                 </p>
//               </div>
//               <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-1 text-xs text-success animate-pulseGlow">
//                 <span className="h-1.5 w-1.5 rounded-full bg-success" />
//                 Support Online
//               </span>
//             </div>
//             <div className="mt-6 space-y-3">
//               {[
//                 [
//                   Monitor,
//                   "Remote Screen Share",
//                   "A specialist connects directly to walk you through any workflow step-by-step.",
//                   "Most Popular",
//                 ],
//                 [
//                   Phone,
//                   "Phone Support",
//                   "Direct line to a certified pharmacy operations specialist.",
//                   "",
//                 ],
//                 [
//                   ClipboardList,
//                   "Priority Ticket",
//                   "Submit a detailed request for same-business-day resolution.",
//                   "",
//                 ],
//               ].map(([Icon, t, d, b]: any, idx) => (
//                 <div
//                   key={t}
//                   className="flex items-center gap-4 rounded-xl border border-border bg-surface-2 p-4 animate-fadeInUp transition-all hover:shadow-md"
//                   style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
//                 >
//                   <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface">
//                     <Icon className="h-4 w-4 text-muted-foreground" />
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 text-sm font-medium">
//                       {t}
//                       {b && (
//                         <span className="rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] text-muted-foreground">
//                           {b}
//                         </span>
//                       )}
//                     </div>
//                     <p className="text-xs text-muted-foreground">{d}</p>
//                   </div>
//                   <ArrowRight className="h-4 w-4 text-muted-foreground" />
//                 </div>
//               ))}
//             </div>
//             <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground animate-fadeInUp stagger-4">
//               <Shield className="h-3.5 w-3.5" /> All sessions are encrypted,
//               HIPAA-compliant, and session-logged.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* PRICING */}
//       <section id="pricing" className="border-b border-border/60 py-24">
//         <div className="mx-auto max-w-[1280px] px-7 text-center">
//           <Pill>Pricing</Pill>
//           <h2 className="mt-6 text-5xl font-semibold tracking-tight animate-fadeInUp stagger-1">
//             Transparent, Scalable Pricing
//           </h2>
//           <p className="mt-4 text-muted-foreground animate-fadeInUp stagger-2">
//             Start with what you need. Scale as your pharmacy group grows.
//           </p>
//           <div className="mt-14 grid gap-5 md:grid-cols-2 max-w-3xl mx-auto">
//             {plans.map((p, idx) => (
//               <div
//                 key={p.id}
//                 className={`${p.highlighted ? "h-[460px]" : ""} relative flex flex-col rounded-2xl border p-6 text-left animate-fadeInUp transition-all ${p.highlighted ? "border-foreground/30 bg-surface-2 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] hover:shadow-lg" : "border-border bg-surface hover:border-border/80 hover:shadow-md"}`}
//                 style={{ animationDelay: `${0.1 + idx * 0.15}s` }}
//               >
//                 {p.highlighted && (
//                   <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-b from-zinc-100 to-zinc-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-background">
//                     Most Popular
//                   </span>
//                 )}
//                 <div
//                   className="text-xs uppercase tracking-[0.18em] text-muted-foreground animate-fadeInUp"
//                   style={{ animationDelay: `${0.15 + idx * 0.15}s` }}
//                 >
//                   {p.name}
//                 </div>
//                 <div
//                   className="mt-5 flex items-baseline gap-1 animate-fadeInUp"
//                   style={{ animationDelay: `${0.2 + idx * 0.15}s` }}
//                 >
//                   <span className="text-4xl font-semibold">{p.price}</span>
//                   <span className="text-sm text-muted-foreground">
//                     {p.period}
//                   </span>
//                 </div>
//                 <p
//                   className="mt-3 text-sm leading-relaxed text-muted-foreground animate-fadeInUp"
//                   style={{ animationDelay: `${0.25 + idx * 0.15}s` }}
//                 >
//                   {p.description}
//                 </p>
//                 <ul className="mt-6 space-y-2.5 text-sm">
//                   {p.features.map((f, fIdx) => (
//                     <li
//                       key={f}
//                       className="flex items-start gap-2.5 animate-fadeInUp"
//                       style={{
//                         animationDelay: `${0.3 + fIdx * 0.05 + idx * 0.15}s`,
//                       }}
//                     >
//                       <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-surface-2">
//                         <Check className="h-3 w-3 text-success" />
//                       </span>
//                       <span className="text-foreground/90">{f}</span>
//                     </li>
//                   ))}
//                 </ul>

//                 {/* Add-ons for base plan ONLY */}
//                 {p.id === "base" && p.addOns && (
//                   <div className="mt-6">
//                     <button
//                       onClick={() =>
//                         setExpandedAddOns({
//                           ...expandedAddOns,
//                           base: !expandedAddOns.base,
//                         })
//                       }
//                       className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition animate-fadeInUp"
//                       style={{ animationDelay: `${0.5 + idx * 0.15}s` }}
//                     >
//                       Available Add-ons
//                       <ChevronDown
//                         className={`h-4 w-4 transition-transform ${
//                           expandedAddOns.base ? "rotate-180" : ""
//                         }`}
//                       />
//                     </button>
//                     <div
//                       className={`expandable-content ${
//                         expandedAddOns.base ? "expanded" : ""
//                       }`}
//                     >
//                       <div className="mt-3 space-y-2 border-t border-border pt-4">
//                         {p.addOns.map((addon, aIdx) => (
//                           <div
//                             key={addon.name}
//                             className="flex items-center justify-between rounded-lg bg-surface-2/50 p-3 text-xs animate-fadeInUp"
//                             style={{ animationDelay: `${0.55 + aIdx * 0.1}s` }}
//                           >
//                             <span>{addon.name}</span>
//                             <span className="font-semibold">{addon.price}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 <Link href="/auth" target="_blank" className="w-full block">
//                   <button
//                     className={`w-full ${
//                       p.highlighted ? "mt-7" : "mt-12"
//                     } rounded-lg px-4 py-3 text-sm font-medium transition-all animate-fadeInUp ${
//                       p.highlighted
//                         ? "bg-gradient-to-b from-zinc-100 to-zinc-300 text-background hover:from-white"
//                         : "border border-border text-foreground hover:bg-surface-2"
//                     }`}
//                     style={{ animationDelay: `${0.6 + idx * 0.15}s` }}
//                   >
//                     {p.highlighted ? "Get Full Access" : "Get Started"}
//                   </button>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* COMPLIANCE */}
//       <section className="border-b border-border/60 py-20">
//         <div className="mx-auto max-w-[1200px] px-7">
//           <p className="text-center text-xs tracking-[0.3em] text-muted-foreground/70 animate-fadeInUp stagger-0">
//             SECURITY & COMPLIANCE STANDARDS
//           </p>
//           <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-6">
//             {[
//               [Shield, "HIPAA Compliant", "Fully certified"],
//               [ShieldCheck, "SOC 2 Type II", "Audit verified"],
//               [Lock, "AES-256 Encryption", "All data at rest"],
//               [TimerReset, "99.9% Uptime SLA", "Enterprise grade"],
//               [UserIcon, "PHI Protected", "Zero-trust model"],
//               [ClipboardList, "DEA Compliant", "Drug data standards"],
//             ].map(([Icon, t, d]: any, idx) => (
//               <div
//                 key={t}
//                 className="rounded-2xl border border-border bg-surface p-5 text-center animate-fadeInUp transition-all hover:shadow-md hover:border-border/80"
//                 style={{ animationDelay: `${0.1 + idx * 0.08}s` }}
//               >
//                 <div className="mx-auto grid h-10 w-10 place-items-center rounded-lg bg-surface-2">
//                   <Icon className="h-5 w-5 text-muted-foreground" />
//                 </div>
//                 <div className="mt-4 text-sm font-medium">{t}</div>
//                 <div className="text-xs text-muted-foreground">{d}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="border-b border-border/60 py-24">
//         <div className="mx-auto max-w-6xl px-7 text-center">
//           <Pill>Get Started</Pill>
//           <h2 className="mt-6 text-5xl font-semibold tracking-tight animate-fadeInUp stagger-1 whitespace-nowrap">
//             Ready to Protect Your Pharmacy Revenue?
//           </h2>
//           <p className="mx-auto mt-5 max-w-4xl text-muted-foreground animate-fadeInUp stagger-2 text-lg leading-relaxed">
//             Join {stats[2][0]}+ pharmacy groups using AuditProRx to automate
//             audits, protect revenue, and gain competitive intelligence. Schedule
//             a personalized walkthrough with our team.
//           </p>
//           <div className="mt-9 flex items-center justify-center gap-3 animate-fadeInUp stagger-3 flex-wrap">
//             <button
//               onClick={scheduleConsultation}
//               className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-zinc-100 to-zinc-300 px-5 py-3 text-sm font-medium text-background"
//             >
//               Schedule an Operational Efficiency Review{" "}
//               <ArrowRight className="h-4 w-4" />
//             </button>
//             <button
//               onClick={handleRequestInfo}
//               className="rounded-lg border border-border bg-surface px-5 py-3 text-sm"
//             >
//               Request Info
//             </button>
//           </div>
//           <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
//             {[
//               "No long-term contracts",
//               "HIPAA-compliant from day one",
//               "Onboard in under 24 hours",
//             ].map((t, idx) => (
//               <span
//                 key={t}
//                 className="inline-flex items-center gap-2 animate-fadeInUp"
//                 style={{ animationDelay: `${0.4 + idx * 0.1}s` }}
//               >
//                 <Check className="h-3 w-3 text-success" />
//                 {t}
//               </span>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* FOOTER */}
//       <footer className="py-14">
//         <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-10 px-7 md:grid-cols-6">
//           <div className="col-span-2">
//             <Logo />
//             <p className="mt-4 max-w-xs text-sm text-muted-foreground">
//               The enterprise pharmacy operations platform trusted by pharmacy
//               groups nationwide.
//             </p>
//             <div className="mt-5 flex gap-2">
//               {[Twitter, Linkedin].map((I, i) => (
//                 <a
//                   key={i}
//                   href={
//                     i === 1
//                       ? "https://www.linkedin.com/company/auditprorx/"
//                       : "#"
//                   }
//                   className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface text-muted-foreground hover:text-foreground transition-colors animate-fadeInUp"
//                   style={{ animationDelay: `${i * 0.1}s` }}
//                 >
//                   <I className="h-4 w-4" />
//                 </a>
//               ))}
//             </div>
//           </div>
//           {[
//             [
//               "Platform",
//               [
//                 "Audit Management",
//                 "Drug Lookup",
//                 "Audit Reports",
//                 "Pharmacy Network",
//                 "Analytics",
//                 "Pricing",
//               ],
//             ],
//             ["Company", ["About Us", "Careers", "Blog", "Press", "Contact"]],
//             [
//               "Legal",
//               [
//                 "Privacy Policy",
//                 "Terms of Service",
//                 "Cancellation Policy",
//                 "HIPAA Policy",
//               ],
//             ],
//             [
//               "Support",
//               [
//                 "Documentation",
//                 "Help Center",
//                 "System Status",
//                 "Remote Assistance",
//               ],
//             ],
//           ].map(([t, items]: any) => (
//             <div key={t}>
//               <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
//                 {t}
//               </div>
//               <ul className="mt-4 space-y-2 text-sm">
//                 {items.map((i: string) => (
//                   <li key={i}>
//                     <a
//                       href={`/${i.toLowerCase().replace(/\s+/g, "-")}`}
//                       className="text-foreground/80 hover:text-foreground transition-colors animate-fadeInUp"
//                     >
//                       {i}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//         <div className="mx-auto mt-12 flex max-w-[1280px] items-center justify-between border-t border-border px-7 pt-6 text-xs text-muted-foreground">
//           <span>© {currentYear} AuditProRx. All rights reserved.</span>
//           <div className="flex items-center gap-5">
//             <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 animate-fadeInUp stagger-0">
//               <span className="h-1.5 w-1.5 rounded-full bg-success" />
//               All systems operational
//             </span>
//             <span>HIPAA Compliant Platform</span>
//           </div>
//         </div>
//       </footer>

//       {/* Floating circular FAQ button */}
//       <button
//         onClick={() => setIsFaqOpen(true)}
//         aria-label="Open FAQs"
//         className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-zinc-100 to-zinc-300 text-background shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5)] ring-1 ring-white/10 transition-transform hover:scale-110 active:scale-95 animate-fadeInUp"
//       >
//         <HelpCircle className="h-7 w-7" />
//         <span className="absolute inset-0 rounded-full ring-2 ring-white/20 animate-ping opacity-40" />
//       </button>

//       {/* FAQ Modal */}
//       {isFaqOpen && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeInUp"
//           onClick={() => setIsFaqOpen(false)}
//         >
//           <div
//             className="relative w-full max-w-2xl rounded-2xl border border-border bg-surface p-7 shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => setIsFaqOpen(false)}
//               aria-label="Close FAQs"
//               className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-border bg-surface-2 text-muted-foreground hover:text-foreground transition-colors"
//             >
//               <X className="h-4 w-4" />
//             </button>
//             <div className="flex items-center gap-3">
//               <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-zinc-100 to-zinc-300 text-background">
//                 <HelpCircle className="h-5 w-5" />
//               </div>
//               <div>
//                 <h3 className="text-xl font-semibold tracking-tight">
//                   Frequently Asked Questions
//                 </h3>
//                 <p className="text-xs text-muted-foreground">
//                   Quick answers about AuditProRx
//                 </p>
//               </div>
//             </div>

//             <div className="mt-6 max-h-[60vh] space-y-2 overflow-y-auto pr-1">
//               {faqs.map((f, idx) => {
//                 const open = openFaqIdx === idx;
//                 return (
//                   <div
//                     key={f.q}
//                     className="rounded-lg border border-border bg-surface-2/40"
//                   >
//                     <button
//                       onClick={() => setOpenFaqIdx(open ? null : idx)}
//                       className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium"
//                     >
//                       <span>{f.q}</span>
//                       <ChevronDown
//                         className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
//                       />
//                     </button>
//                     {open && (
//                       <div className="px-4 pb-4 text-sm text-muted-foreground animate-fadeInUp">
//                         {f.a}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// "use client";

// import {
//   Shield,
//   Zap,
//   BarChart3,
//   FileText,
//   Clock,
//   Lock,
//   Check,
//   Search,
//   DollarSign,
//   FileSpreadsheet,
//   ArrowRight,
//   Home,
//   Phone,
//   CircleDollarSign,
//   ShieldCheck,
//   Monitor,
//   ClipboardList,
//   Download,
//   Play,
//   Star,
//   Asterisk,
//   TimerReset,
//   User as UserIcon,
//   Twitter,
//   Linkedin,
//   Github,
//   ChevronDown,
//   X,
//   Mail,
//   HelpCircle,
//   Boxes,
//   SearchCode,
//   AlertTriangle,
//   Network,
//   Settings2,
//   LifeBuoy,
//   Users,
// } from "lucide-react";

// import { useEffect, useState } from "react";
// import axios from "axios";
// import Link from "next/link";
// import Image from "next/image";
// import "./landing.css";

// const plans = [
//   {
//     id: "base",
//     name: "Audit Reporting Suite",
//     price: "$99",
//     period: "/month",
//     description:
//       "Essential audit and inventory reporting for independent pharmacies getting started.",
//     features: [
//       "Unlimited inventory audit reports",
//       "NDC & wholesaler reconciliation",
//       "One-click report exports (PDF / CSV)",
//       "Secure dashboard access",
//       "Standard email support",
//     ],
//     highlighted: false,
//     addOns: [
//       { name: "Inventory Exchange Network", price: "$199" },
//       { name: "Drug Intelligence Hub", price: "$199" },
//       { name: "Reimbursement Intelligence", price: "$199" },
//     ],
//   },
//   {
//     id: "full_access",
//     name: "Full Access Platform",
//     price: "$499",
//     period: "/month",
//     description:
//       "The complete AuditProRx platform — every premium module, fully unlocked and integrated.",
//     badge: "Best Value",
//     savings: "Save $197/mo vs. buying modules individually",
//     features: [
//       "Everything in Audit Reporting Suite",
//       "Inventory Exchange Network",
//       "Drug Intelligence Hub",
//       "Reimbursement Intelligence",
//       // "Admin Automation & workflows",
//       "Priority product support",
//       "Dedicated onboarding specialist",
//     ],
//     highlighted: true,
//   },
// ];

// const testimonials = [
//   {
//     quote:
//       "AuditProRx has really streamlined how we handle audits. It saves us time and helps us stay more organized.",
//     initials: "UC",
//     name: "Dr. Uzair Chachar",
//     role: "Owner, Life Care Pharmacy",
//     gradient: "from-blue-400 to-cyan-300",
//   },
//   {
//     quote:
//       "Managing documentation and claims has become much easier. The system is simple and very efficient.",
//     initials: "IA",
//     name: "Dr. Irfan Ali",
//     role: "Owner, Bergen Road Pharmacy",
//     gradient: "from-amber-300 to-yellow-500",
//   },
//   {
//     quote:
//       "The workflow is smooth and easy to follow. It's a helpful tool for improving our overall audit process.",
//     initials: "KA",
//     name: "Dr. Khilat Abbas",
//     role: "Owner, United Drugs",
//     gradient: "from-pink-300 to-rose-400",
//   },
// ];

// // Global animations styles
// const animationStyles = `
//   @keyframes fadeInUp {
//     from {
//       opacity: 0;
//       transform: translateY(20px);
//     }
//     to {
//       opacity: 1;
//       transform: translateY(0);
//     }
//   }

//   @keyframes slideInLeft {
//     from {
//       opacity: 0;
//       transform: translateX(-20px);
//     }
//     to {
//       opacity: 1;
//       transform: translateX(0);
//     }
//   }

//   @keyframes slideInRight {
//     from {
//       opacity: 0;
//       transform: translateX(20px);
//     }
//     to {
//       opacity: 1;
//       transform: translateX(0);
//     }
//   }

//   @keyframes scaleIn {
//     from {
//       opacity: 0;
//       transform: scale(0.95);
//     }
//     to {
//       opacity: 1;
//       transform: scale(1);
//     }
//   }

//   @keyframes horizontalScroll {
//     0% {
//       transform: translateX(0);
//     }
//     100% {
//       transform: translateX(-50%);
//     }
//   }

//   @keyframes pulseGlow {
//     0%, 100% {
//       box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
//     }
//     50% {
//       box-shadow: 0 0 40px rgba(34, 197, 94, 0.6);
//     }
//   }

//   .animate-fadeInUp {
//     animation: fadeInUp 0.6s ease-out forwards;
//   }

//   .animate-slideInLeft {
//     animation: slideInLeft 0.6s ease-out forwards;
//   }

//   .animate-slideInRight {
//     animation: slideInRight 0.6s ease-out forwards;
//   }

//   .animate-scaleIn {
//     animation: scaleIn 0.6s ease-out forwards;
//   }

//   .animate-horizontalScroll {
//     animation: horizontalScroll 20s linear infinite;
//   }

//   .animate-pulseGlow {
//     animation: pulseGlow 2s ease-in-out infinite;
//   }

//   .stagger-0 { animation-delay: 0s; }
//   .stagger-1 { animation-delay: 0.1s; }
//   .stagger-2 { animation-delay: 0.2s; }
//   .stagger-3 { animation-delay: 0.3s; }
//   .stagger-4 { animation-delay: 0.4s; }
//   .stagger-5 { animation-delay: 0.5s; }
//   .stagger-6 { animation-delay: 0.6s; }
//   .stagger-7 { animation-delay: 0.7s; }
//   .stagger-8 { animation-delay: 0.8s; }
//   .stagger-9 { animation-delay: 0.9s; }
//   .stagger-10 { animation-delay: 1s; }

//   .marquee-wrapper {
//     overflow: hidden;
//   }

//   .marquee-content {
//     display: flex;
//     gap: 1.5rem;
//     width: max-content;
//   }

//   .marquee-content.animate {
//     animation: horizontalScroll 20s linear infinite;
//   }

//   .expandable-content {
//     max-height: 0;
//     overflow: hidden;
//     transition: max-height 0.3s ease-out;
//   }

//   .expandable-content.expanded {
//     max-height: 500px;
//   }

//   /* Scroll-reveal: lines/components appear one after another as the section enters the viewport */
//   .reveal-on-scroll {
//     opacity: 0;
//     transform: translateY(24px);
//     transition: opacity 0.7s ease-out, transform 0.7s ease-out;
//     will-change: opacity, transform;
//   }
//   .reveal-on-scroll.in-view {
//     opacity: 1;
//     transform: translateY(0);
//   }

//   /* Hide the scrollbar gutter inside the FAQ panel so no vertical scroller
//      hint flashes when the last question expands, while keeping it scrollable. */
//   .no-scrollbar {
//     scrollbar-width: none;        /* Firefox */
//     -ms-overflow-style: none;     /* IE/Edge */
//   }
//   .no-scrollbar::-webkit-scrollbar {
//     width: 0;
//     height: 0;
//     display: none;                /* Chrome/Safari */
//   }
// `;

// const Pill = ({ children }: { children: React.ReactNode }) => (
//   <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs tracking-wider text-muted-foreground uppercase animate-fadeInUp stagger-0">
//     <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70" />
//     {children}
//   </span>
// );

// const Logo = () => (
//   <div className="flex items-center">
//     <div className="relative h-30 w-40 shrink-0">
//       <Image
//         src="/l1.png"
//         alt="AuditProRx"
//         fill
//         priority
//         sizes="160px"
//         className="object-contain object-left"
//       />
//     </div>
//   </div>
// );

// // Counter Component
// const Counter = ({
//   target,
//   suffix = "",
// }: {
//   target: number;
//   suffix?: string;
// }) => {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     let start = 0;
//     const end = target;
//     const duration = 2000;
//     const increment = end / (duration / 16);

//     const timer = setInterval(() => {
//       start += increment;
//       if (start >= end) {
//         setCount(end);
//         clearInterval(timer);
//       } else {
//         setCount(Math.floor(start));
//       }
//     }, 16);

//     return () => clearInterval(timer);
//   }, [target]);

//   return (
//     <span>
//       {count}
//       {suffix}
//     </span>
//   );
// };

// // Contact Modal Component
// const ContactModal = ({
//   isOpen,
//   onClose,
//   email,
//   phone,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   email: string;
//   phone: string;
// }) => {
//   if (!isOpen) return null;

//   const copyToClipboard = (text: string, type: string) => {
//     navigator.clipboard.writeText(text);
//   };

//   return (
//     <div className="fixed inset-0 z-50 mt-12 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md">
//       <div className="relative w-full max-w-md overflow-hidden rounded-lg border border-white/10 bg-[#0B0B0F]/95 shadow-[0_20px_80px_rgba(0,0,0,0.65)] animate-scaleIn">
//         {/* Ambient Glow */}
//         <div className="pointer-events-none absolute inset-0 overflow-hidden">
//           <div className="absolute -top-24 right-[-60px] h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
//           <div className="absolute bottom-[-100px] left-[-80px] h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />
//         </div>

//         {/* Header */}
//         <div className="relative flex items-start justify-between border-b border-white/10 px-6 py-5">
//           <div>
//             <h3 className="text-xl font-semibold tracking-tight">
//               Contact Support
//             </h3>

//             <p className="text-xs text-muted-foreground">
//               Fastest way to reach our team
//             </p>
//           </div>

//           <button
//             onClick={onClose}
//             className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[0.03] text-zinc-400 transition-all duration-200 hover:bg-white/[0.06] hover:text-white"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>

//         {/* Content */}
//         <div className="relative space-y-4 p-6">
//           {/* WhatsApp */}
//           <a
//             href={`https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(
//               `Hi Fahad,

// I would like to get in touch regarding AuditProRx.

// Please let me know a convenient time to connect.

// Thank you.`,
//             )}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="group relative flex items-center gap-4 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:border-emerald-500/30 hover:bg-emerald-500/[0.08]"
//           >
//             <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
//               <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />
//             </div>

//             {/* <div className="relative grid h-14 w-14 place-items-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
//               <Phone className="h-6 w-6 text-emerald-400" />
//             </div> */}

//             <div className="relative flex-1">
//               <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
//                 WhatsApp &bull;
//               </span>{" "}
//               <span className="mt-1 text-sm font-semibold text-white">
//                 {phone}
//               </span>
//               <p className="mt-1 text-xs text-zinc-400">
//                 Instant support & quick responses
//               </p>
//             </div>

//             <div className="relative opacity-60 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
//               <svg
//                 className="h-5 w-5 text-white"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M13 7l5 5m0 0l-5 5m5-5H6"
//                 />
//               </svg>
//             </div>
//           </a>

//           {/* Gmail */}
//           <a
//             href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${encodeURIComponent(
//               "AuditProRx Inquiry",
//             )}&body=${encodeURIComponent(
//               `Hi Fahad,

// I wanted to get in touch regarding AuditProRx and had a few questions.

// Looking forward to your response.

// Best regards,`,
//             )}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="group relative flex items-center gap-4 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:border-blue-500/30 hover:bg-blue-500/[0.08]"
//           >
//             <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
//               <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />
//             </div>
//             {/*
//             <div className="relative grid h-14 w-14 place-items-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
//               <FileText className="h-6 w-6 text-blue-400" />
//             </div> */}

//             <div className="relative flex-1">
//               <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white">
//                 Gmail &bull;
//               </span>{" "}
//               <span className="mt-1 text-sm font-semibold text-white">
//                 {email}
//               </span>
//               <p className="mt-1 text-xs text-zinc-400">
//                 Best for detailed discussions
//               </p>
//             </div>

//             <div className="relative opacity-60 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
//               <svg
//                 className="h-5 w-5 text-white"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M13 7l5 5m0 0l-5 5m5-5H6"
//                 />
//               </svg>
//             </div>
//           </a>

//           {/* Footer Note */}
//           {/* <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3"> */}
//           <p className="text-center text-xs leading-relaxed text-zinc-400">
//             Typically responds within a few business hours.
//           </p>
//           {/* </div> */}
//         </div>

//         {/* Footer */}
//         <div className="relative border-t border-white/10 p-6">
//           <button
//             onClick={onClose}
//             className="w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.01] hover:bg-zinc-200 active:scale-[0.99]"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default function Index() {
//   const [stats, setStats] = useState([
//     ["0", "+", "Verified BIN-PCN-GROUP Intelligence"],
//     ["0", "+", "Audits Generated"],
//     ["0", "+", "Active Pharmacy Groups"],
//     ["100", "%", "HIPAA Compliant"],
//   ]);
//   const currentYear = new Date().getFullYear();
//   const [expandedAddOns, setExpandedAddOns] = useState<{
//     [key: string]: boolean;
//   }>({
//     base: false,
//   });
//   const [isContactModalOpen, setIsContactModalOpen] = useState(false);
//   const [isFaqOpen, setIsFaqOpen] = useState(false);
//   const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
//   const faqs = [
//     {
//       q: "How quickly can we get started?",
//       a: "Setup takes minutes. Register your pharmacy, complete payment, and your admin team activates access — most pharmacies are running their first audit report the same day.",
//     },
//     {
//       q: "Is my pharmacy data secure and compliant?",
//       a: "Yes. AuditProRx is built on HIPAA-compliant infrastructure with AES-256 encryption. All Inventory Exchange transfers are patient-specific Rx transfers under DSCSA — controlled substances are never listed.",
//     },
//     {
//       q: "What does the Drug Intelligence Hub show me?",
//       a: "Search any drug by name, NDC, BIN, PCN, or GROUP and instantly see community-sourced benchmarks — variants, total Rx volume, total insurance paid, and average reimbursement per unit across the AuditProRx network.",
//     },
//     {
//       q: "How does the Inventory Exchange Network work?",
//       a: "List verified surplus stock and discover available inventory at other pharmacies for patient-specific transfers. Every listing shows availability, expiry, shelf cost, and the holding pharmacy — fully compliant with DSCSA and state Board of Pharmacy rules.",
//     },
//     {
//       q: "What kind of support is included?",
//       a: "Every plan includes admin access and dedicated product support. Full Access adds priority support and a dedicated onboarding specialist. There are no long-term contracts — scale or cancel anytime.",
//     },
//   ];
//   const contactEmail = "auditprorx@gmail.com";
//   const contactPhone = "+1 (551) 229-6466"; // Replace with actual phone number

//   const fetchStats = async () => {
//     try {
//       const response = await axios.get(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/landing/stats`,
//       );

//       const data = response.data.stats;

//       setStats([
//         [data.master_sheet_entries, "+", "Verified BIN-PCN-GROUP Intelligence"],

//         [data.audits_generated, "+", "Audits Generated"],

//         [data.active_pharmacies - 1, "+", "Active Pharmacy Groups"],

//         ["100", "%", "HIPAA Compliant"],
//       ]);
//     } catch (err) {
//       console.error("Stats error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchStats();
//   }, []);

//   // Scroll-reveal: animate every direct child of each section/header/footer
//   // as it enters the viewport, with a small per-child stagger so text and
//   // components appear one after another (line by line).
//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const containers = Array.from(
//       document.querySelectorAll("section, header, footer, main"),
//     );
//     const targets: HTMLElement[] = [];

//     containers.forEach((container) => {
//       const children = Array.from(container.children) as HTMLElement[];
//       children.forEach((child, idx) => {
//         child.classList.add("reveal-on-scroll");
//         child.style.transitionDelay = `${Math.min(idx * 100, 700)}ms`;
//         targets.push(child);
//       });
//     });

//     const io = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add("in-view");
//             io.unobserve(entry.target);
//           }
//         });
//       },
//       { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
//     );

//     targets.forEach((el) => io.observe(el));

//     return () => io.disconnect();
//   }, []);

//   const scheduleConsultation = () => {
//     window.open("https://calendar.app.google/ekTAPx65xrwq2Qiv6", "_blank");
//   };

//   const handleRequestInfo = () => {
//     setIsContactModalOpen(true);
//   };

//   const downloadScreenConnect = () => {
//     const link = document.createElement("a");
//     link.href = "https://www.screenconnect.com/Download";
//     link.download = "screenconnect-installer.exe";
//     link.target = "_blank";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="min-h-screen bg-background text-foreground antialiased">
//       <style>{animationStyles}</style>

//       <ContactModal
//         isOpen={isContactModalOpen}
//         onClose={() => setIsContactModalOpen(false)}
//         email={contactEmail}
//         phone={contactPhone}
//       />

//       {/* NAV */}
//       <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
//         <div className="mx-auto flex h-16 max-w-9xl items-center justify-between px-7">
//           <Logo />
//           <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
//             {[
//               { label: "Capabilities", href: "#features" },
//               { label: "Drug Intelligence", href: "#drug-lookup" },
//               { label: "Audit Reports", href: "#audit-reports" },
//               { label: "Inventory Exchange", href: "#inventory-view" },
//               { label: "Reimbursement Leads", href: "#leads" },
//               { label: "Pricing", href: "#pricing" },
//               { label: "Support", href: "#support" },
//             ].map((l) => (
//               <a
//                 key={l.label}
//                 href={l.href}
//                 className="hover:text-foreground transition"
//               >
//                 {l.label}
//               </a>
//             ))}
//           </nav>
//           <div className="flex items-center gap-8.5">
//             <a
//               href="/auth"
//               className="text-sm text-muted-foreground hover:text-foreground"
//             >
//               Log In
//             </a>
//             <button
//               onClick={scheduleConsultation}
//               className="rounded-lg bg-gradient-to-b from-zinc-100 to-zinc-300 px-4 py-2 text-sm font-medium text-background shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] hover:from-white animate-fadeInUp stagger-0"
//             >
//               Schedule a Consultation
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* HERO */}
//       <section className="relative overflow-hidden border-b border-border/60">
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]" />
//         <div className="relative mx-auto max-w-[1440px] px-7 pt-20 pb-16 text-center">
//           <div className="absolute inset-0 pointer-events-none overflow-hidden">
//             <div
//               className="absolute top-[20%] left-0 w-[1600px] h-[1600px] rounded-full blur-[220px]"
//               style={{
//                 background:
//                   "radial-gradient(circle, hsl(210 15% 50% / 0.05), transparent 70%)",
//               }}
//             />

//             <div
//               className="absolute bottom-[-300px] right-0 w-[1000px] h-[1000px] rounded-full blur-[200px]"
//               style={{
//                 background:
//                   "radial-gradient(circle, hsl(0 0% 30% / 0.1), transparent 70%)",
//               }}
//             />

//             {/* Outer Circle - moved more downward */}
//             <div
//               className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1500px] h-[1500px] rounded-full border"
//               style={{ borderColor: "hsl(0 0% 15%)" }}
//             />

//             {/* Inner Circle - moved more downward */}
//             <div
//               className="absolute top-[75%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full border"
//               style={{ borderColor: "hsl(0 0% 10%)" }}
//             />

//             {/* Grid pattern */}
//             <div
//               className="absolute inset-0 opacity-[0.03]"
//               style={{
//                 backgroundImage:
//                   "linear-gradient(hsl(0 0% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 50%) 1px, transparent 1px)",
//                 backgroundSize: "200px 200px",
//               }}
//             />
//           </div>
//           <Pill>Enterprise Pharmacy Operations Platform</Pill>
//           <h1 className="mx-auto mt-8 max-w-5xl text-6xl font-semibold leading-[1.05] tracking-tight md:text-7xl animate-fadeInUp stagger-1">
//             Precision Audit Intelligence
//             <br />
//             <span className="text-muted-foreground/70 animate-fadeInUp stagger-2">
//               for Modern Pharmacies
//             </span>
//           </h1>
//           <p className="mx-auto mt-7 max-w-3xl text-[15px] leading-relaxed text-muted-foreground animate-fadeInUp stagger-3">
//             Automate audit workflows, protect revenue, access drug intelligence,
//             and collaborate across pharmacy networks — all in one platform built
//             for pharmacy teams.
//           </p>
//           <div className="mt-9 flex items-center justify-center gap-3 animate-fadeInUp stagger-4">
//             <button
//               onClick={scheduleConsultation}
//               className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-zinc-100 to-zinc-300 px-5 py-3 text-sm font-medium text-background shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
//             >
//               Schedule a Consultation <ArrowRight className="h-4 w-4" />
//             </button>
//             <a
//               href="#"
//               className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-3 text-sm text-foreground hover:bg-surface-2"
//             >
//               <Play className="h-4 w-4" /> Watch Overview
//             </a>
//           </div>
//           <div className="mt-9 flex items-center justify-center gap-4 text-sm text-muted-foreground animate-fadeInUp stagger-5">
//             <div className="flex -space-x-2">
//               {[
//                 { initial: "UC", gradients: "from-blue-400 to-cyan-300" },
//                 { initial: "IA", gradients: "from-amber-300 to-yellow-500" },
//                 { initial: "KA", gradients: "from-pink-300 to-rose-400" },
//               ].map((item, i) => (
//                 <div
//                   key={item.initial}
//                   className={`h-7 w-7 rounded-full border-2 border-background bg-gradient-to-br ${item.gradients} flex items-center justify-center text-xs font-bold text-white`}
//                 >
//                   {item.initial}
//                 </div>
//               ))}
//             </div>
//             <div className="flex gap-0.5 text-foreground">
//               {[...Array(5)].map((_, i) => (
//                 <Star key={i} className="h-3.5 w-3.5 fill-foreground" />
//               ))}
//             </div>
//             <span>Trusted by {stats[2][0]}+ pharmacy groups</span>
//           </div>

//           {/* Dashboard Mock */}
//           <div className="mx-auto mt-16 max-w-5xl overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl animate-scaleIn stagger-6">
//             <div className="flex items-center gap-2 border-b border-border bg-surface-2 px-4 py-3">
//               <div className="flex gap-1.5">
//                 <span className="h-3 w-3 rounded-full bg-zinc-700" />
//                 <span className="h-3 w-3 rounded-full bg-zinc-700" />
//                 <span className="h-3 w-3 rounded-full bg-zinc-700" />
//               </div>
//               <div className="mx-auto rounded-md bg-background px-4 py-1 text-xs text-muted-foreground">
//                 app.auditprorx.com/dashboard
//               </div>
//             </div>
//             <div className="grid grid-cols-[200px_1fr] gap-0">
//               <aside className="border-r border-border p-4 text-left text-sm">
//                 {[
//                   ["Dashboard"],
//                   ["Inventory"],
//                   ["Audits", true],
//                   ["Drug Lookup"],
//                   ["Reports"],
//                   ["Settings"],
//                 ].map(([n, active]) => (
//                   <div
//                     key={n as string}
//                     className={`mb-1 flex items-center gap-2 rounded-md px-3 py-2 ${active ? "bg-surface-2 text-foreground" : "text-muted-foreground"}`}
//                   >
//                     <span
//                       className={`h-1.5 w-1.5 rounded-full ${active ? "bg-success" : "bg-muted-foreground/50"}`}
//                     />
//                     {n}
//                   </div>
//                 ))}
//               </aside>
//               <div className="p-6 text-left">
//                 <div className="flex items-start justify-between">
//                   <div>
//                     <h3 className="font-semibold">Audit Management</h3>
//                     <p className="text-xs text-muted-foreground">
//                       Q4 2024 · 47 active audits
//                     </p>
//                   </div>
//                   <div className="flex gap-2">
//                     <button className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground">
//                       Export
//                     </button>
//                     <button className="rounded-md bg-gradient-to-b from-zinc-200 to-zinc-400 px-3 py-1.5 text-xs font-medium text-background">
//                       + New Audit
//                     </button>
//                   </div>
//                 </div>
//                 <div className="mt-4 grid grid-cols-4 gap-3">
//                   {[
//                     ["Revenue Saved", "$847K", "+12%", "success"],
//                     ["Audits Resolved", "94.2%", "+3.1%", "success"],
//                     ["Active Claims", "47", "", ""],
//                     ["Avg Response", "2.4 days", "", ""],
//                   ].map(([l, v, d, c]) => (
//                     <div
//                       key={l}
//                       className="rounded-lg border border-border bg-surface-2 p-3"
//                     >
//                       <div className="text-[11px] text-muted-foreground">
//                         {l}
//                       </div>
//                       <div className="mt-1 text-lg font-semibold">{v}</div>
//                       {d && (
//                         <div
//                           className={`text-[11px] ${c === "success" ? "text-success" : "text-muted-foreground"}`}
//                         >
//                           {d}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//                 <div className="mt-4 overflow-hidden rounded-lg border border-border">
//                   <table className="w-full text-xs">
//                     <thead className="bg-surface-2 text-left text-[10px] uppercase tracking-wider text-muted-foreground">
//                       <tr>
//                         {[
//                           "NDC",
//                           "Drug Name",
//                           "Rank",
//                           "Ordered",
//                           "Billed",
//                           "Status",
//                         ].map((h) => (
//                           <th key={h} className="px-4 py-2.5">
//                             {h}
//                           </th>
//                         ))}
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-border">
//                       {[
//                         [
//                           "00093-0150",
//                           "Amoxicillin 500mg",
//                           "A",
//                           "240",
//                           "$480",
//                           "Active",
//                           "success",
//                         ],
//                         [
//                           "00071-0155",
//                           "Lisinopril 10mg",
//                           "B",
//                           "180",
//                           "$310",
//                           "Review",
//                           "warning",
//                         ],
//                         [
//                           "00093-1040",
//                           "Metformin 500mg",
//                           "A",
//                           "320",
//                           "$620",
//                           "OK",
//                           "",
//                         ],
//                         [
//                           "00071-0215",
//                           "Atorvastatin 20mg",
//                           "A",
//                           "155",
//                           "$780",
//                           "Urgent",
//                           "danger",
//                         ],
//                         [
//                           "00093-0032",
//                           "Omeprazole 20mg",
//                           "B",
//                           "200",
//                           "$340",
//                           "OK",
//                           "",
//                         ],
//                       ].map((r) => (
//                         <tr key={r[0]} className="text-muted-foreground">
//                           <td className="px-4 py-3 font-mono">{r[0]}</td>
//                           <td className="px-4 py-3 text-foreground">{r[1]}</td>
//                           <td className="px-4 py-3">{r[2]}</td>
//                           <td className="px-4 py-3">{r[3]}</td>
//                           <td className="px-4 py-3 text-foreground">{r[4]}</td>
//                           <td className="px-4 py-3">
//                             <span
//                               className={`rounded-full px-2 py-0.5 text-[10px] ${
//                                 r[6] === "success"
//                                   ? "bg-success/15 text-success"
//                                   : r[6] === "warning"
//                                     ? "bg-warning/15 text-warning"
//                                     : r[6] === "danger"
//                                       ? "bg-danger/15 text-danger"
//                                       : "bg-muted text-muted-foreground"
//                               }`}
//                             >
//                               {r[5]}
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* STATS */}
//       <div
//         className="absolute inset-0 opacity-[0.03]"
//         style={{
//           backgroundImage:
//             "linear-gradient(hsl(0 0% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 50%) 1px, transparent 1px)",
//           backgroundSize: "60px 60px",
//         }}
//       />
//       <section className="border-b border-border/60">
//         <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-border md:grid-cols-4">
//           {stats.map(([v, s, l], idx) => (
//             <div
//               key={l}
//               className="px-7 py-12 text-center animate-fadeInUp"
//               style={{ animationDelay: `${idx * 0.15}s` }}
//             >
//               <div className="text-4xl font-semibold">
//                 <Counter target={parseInt(v)} suffix={s} />
//               </div>
//               <div className="mt-2 text-sm text-muted-foreground">{l}</div>
//             </div>
//           ))}
//         </div>
//         {/* <div
//           className="absolute inset-0 opacity-[0.03]"
//           style={{
//             backgroundImage:
//               "linear-gradient(hsl(0 0% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 50%) 1px, transparent 1px)",
//             backgroundSize: "60px 60px",
//           }}
//         /> */}
//       </section>

//       {/* MARQUEE TAGS */}
//       <section className="border-b border-border/60 py-10">
//         <p className="text-center text-xs tracking-[0.3em] text-muted-foreground/70 animate-fadeInUp stagger-0">
//           BUILT FOR MODERN PHARMACY WORKFLOWS
//         </p>
//         <div className="mt-6 overflow-hidden">
//           <div className="marquee-wrapper">
//             <div className="marquee-content animate">
//               {[
//                 "Audit Defense",
//                 "Drug Lookup",
//                 "Audit Reports",
//                 "Claims Recovery",
//                 "Compliance Reporting",
//                 "Pharmacy Networks",
//                 "Revenue Protection",
//                 "HIPAA Security",
//               ].map((t, idx) => (
//                 <span
//                   key={`${t}-1`}
//                   className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs text-muted-foreground animate-fadeInUp"
//                   style={{ animationDelay: `${idx * 0.05}s` }}
//                 >
//                   <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
//                   {t}
//                 </span>
//               ))}
//               {[
//                 "Audit Defense",
//                 "Drug Lookup",
//                 "Audit Reports",
//                 "Claims Recovery",
//                 "Compliance Reporting",
//                 "Pharmacy Networks",
//                 "Revenue Protection",
//                 "HIPAA Security",
//               ].map((t) => (
//                 <span
//                   key={`${t}-2`}
//                   className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs text-muted-foreground"
//                 >
//                   <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
//                   {t}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* FEATURES GRID */}
//       <section id="features" className="border-b border-border/60 py-24">
//         <div className="mx-auto max-w-[1200px] px-7">
//           <div className="text-center">
//             <Pill>Platform Capabilities</Pill>
//             <h2 className="mt-6 text-5xl font-semibold tracking-tight animate-fadeInUp stagger-1">
//               Everything Your Pharmacy Team Needs
//             </h2>
//             <p className="mx-auto mt-4 max-w-xl text-muted-foreground animate-fadeInUp stagger-2">
//               Built by pharmacists, for pharmacists. Every capability engineered
//               to protect revenue and simplify operations.
//             </p>
//           </div>
//           {/* <div className="mt-14 grid gap-5 md:grid-cols-3">
//             {[
//               [
//                 FileText,
//                 "Inventory Audit Reports",
//                 "Generate detailed pharmacy audit reports across multiple wholesalers. Track every NDC, drug, and unit billed vs. ordered — pre-built templates and one-click exports ready for any PBM audit.",
//               ],
//               [
//                 SearchCode,
//                 "Digital Drug Lookup",
//                 "Search any drug by brand name, generic name, or NDC against a 60K+ database. Instantly access pricing, GPI group, and reference data sourced directly from the industry's most trusted catalogs.",
//               ],
//               [
//                 AlertTriangle,
//                 "Aberrant Risk Detection",
//                 "Surface high-risk billing patterns before PBMs do. Automated flagging on quantity outliers, refill anomalies, and NDC-level discrepancies — so you can fix exposure before it becomes a chargeback.",
//               ],
//               [
//                 Network,
//                 "Pharmacy Inventory Network",
//                 "Connect with fellow pharmacies to source short-dated or excess inventory in a private, trusted marketplace. Post once, move stock, and recover capital that would otherwise sit on your shelves.",
//               ],
//               [
//                 Settings2,
//                 "Admin Automation",
//                 "Streamline day-to-day pharmacy admin — credentialing reminders, document organization, and operational workflows handled in the background so your team stays focused on patient care.",
//               ],
//               [
//                 LifeBuoy,
//                 "Product Support Hub",
//                 "Direct access to pharmacy-savvy support, onboarding guides, and a growing knowledge base. Real humans who understand independent pharmacy operations — not generic ticket queues.",
//               ],
//             ].map(([Icon, t, d]: any, idx) => (
//               <div
//                 key={t}
//                 className="rounded-2xl border border-border bg-surface p-6 animate-fadeInUp transition-all hover:shadow-lg hover:border-border/80 flex flex-col"
//                 style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
//               >
//                 <div className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface-2 animate-fadeInUp">
//                   <Icon className="h-5 w-5 text-muted-foreground" />
//                 </div>
//                 <h3
//                   className="mt-4 font-semibold animate-fadeInUp"
//                   style={{ animationDelay: `${0.15 + idx * 0.1}s` }}
//                 >
//                   {t}
//                 </h3>
//                 <p
//                   className="mt-2 text-sm leading-relaxed text-muted-foreground flex-grow animate-fadeInUp"
//                   style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
//                 >
//                   {d}
//                 </p>
//               </div>
//             ))}
//           </div> */}
//           <div className="mt-16 divide-y divide-border/70 border-y border-border/70">
//             <div className="grid grid-cols-1 md:grid-cols-2">
//               {[
//                 [
//                   FileText,
//                   "Inventory Audit Reports",
//                   "Generate pharmacy audit reports with wholesaler, NDC, and billing reconciliation in minutes.",
//                 ],

//                 [
//                   SearchCode,
//                   "Digital Drug Lookup",
//                   "Search 60K+ drugs by NDC, brand, or generic name with real-time PBM reference data.",
//                 ],

//                 [
//                   Users,
//                   "Pharmacy Leads",
//                   "Access admin-curated reimbursement opportunities, profitable drug leads, and payer insights.",
//                 ],

//                 [
//                   Network,
//                   "Pharmacy Inventory Network",
//                   "Connect with pharmacies to buy, sell, and manage short-dated or excess inventory efficiently.",
//                 ],

//                 [
//                   Settings2,
//                   "Admin Automation",
//                   "Simplify pharmacy operations with automated workflows, reminders, and document management.",
//                 ],

//                 [
//                   LifeBuoy,
//                   "Product Support Hub",
//                   "Get direct access to onboarding help, support resources, and pharmacy-focused assistance.",
//                 ],
//               ].map(([Icon, t, d]: any, idx) => (
//                 <div
//                   key={t}
//                   className="group border-b border-border/70 p-6 animate-fadeInUp transition-colors hover:bg-surface/40"
//                   style={{ animationDelay: `${0.1 + idx * 0.08}s` }}
//                 >
//                   <div className="grid grid-cols-12 gap-6">
//                     {/* Index number */}
//                     <div className="col-span-12 md:col-span-1">
//                       <span className="font-mono text-sm tracking-widest text-muted-foreground">
//                         {String(idx + 1).padStart(2, "0")}
//                       </span>
//                     </div>

//                     {/* Icon */}
//                     <div className="col-span-12 md:col-span-2">
//                       <div className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface-2 transition-transform group-hover:-translate-y-0.5">
//                         <Icon className="h-5 w-5 text-muted-foreground" />
//                       </div>
//                     </div>

//                     {/* Content */}
//                     <div className="col-span-12 md:col-span-9">
//                       <h3 className="text-xl font-semibold tracking-tight">
//                         {t}
//                       </h3>

//                       <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
//                         {d}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* INVENTORY REPORTS */}
//       <section id="audit-reports" className="border-b border-border/60 py-24">
//         <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 px-7 lg:grid-cols-2">
//           <div className="animate-slideInLeft">
//             <Pill>Inventory Reports</Pill>
//             <h2 className="mt-6 text-4xl font-semibold tracking-tight animate-fadeInUp stagger-1">
//               Audit Reporting Suite
//             </h2>
//             <p className="mt-4 text-muted-foreground animate-fadeInUp stagger-2">
//               Generate detailed inventory audit reports that track medication
//               inventory, identify discrepancies, and provide actionable
//               insights. Our intelligent reporting system delivers comprehensive
//               analysis across all pharmacy locations.
//             </p>
//             <ul className="mt-6 space-y-3 text-sm">
//               {[
//                 "Real-time inventory tracking and shortage alerts",
//                 "Detailed NDC and medication analysis",
//                 "Automated report generation and export",
//                 "Multi-location inventory consolidation",
//               ].map((f, idx) => (
//                 <li
//                   key={f}
//                   className="flex items-center gap-3 animate-fadeInUp"
//                   style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
//                 >
//                   <span className="grid h-5 w-5 place-items-center rounded-full bg-surface-2">
//                     <Check className="h-3 w-3 text-success" />
//                   </span>
//                   {f}
//                 </li>
//               ))}
//             </ul>
//           </div>
//           <div className="rounded-2xl border border-border bg-surface p-6 animate-slideInRight overflow-x-auto">
//             <div className="flex items-start justify-between animate-fadeInUp">
//               <div>
//                 <h4 className="font-semibold">Inventory Reports</h4>
//                 <p className="text-xs text-muted-foreground">
//                   Updated 3 minutes ago
//                 </p>
//               </div>
//               <span className="inline-flex items-center gap-1.5 text-xs text-success">
//                 <span className="h-1.5 w-1.5 rounded-full bg-success" />
//                 Live
//               </span>
//             </div>
//             <div className="mt-5 grid grid-cols-[1fr_1fr_0.8fr_0.8fr_0.8fr_1fr_1fr] gap-3 text-[9px] uppercase tracking-wider text-muted-foreground animate-fadeInUp stagger-1 whitespace-nowrap">
//               <div>NDC</div>
//               <div>Drug Name</div>
//               <div>Total Ordered</div>
//               <div>Total Billed</div>
//               <div>Total Shortage</div>
//               <div>Highest Cost</div>
//               <div>PBM/Payer</div>
//             </div>
//             <div className="mt-2 divide-y divide-border">
//               {[
//                 [
//                   "00093-0150",
//                   "Amoxicillin 500mg",
//                   "1,240",
//                   "1,180",
//                   "60",
//                   "$2,840.00",
//                   "Medicaid/Commercial",
//                   "success",
//                 ],
//                 [
//                   "00071-0155",
//                   "Lisinopril 10mg",
//                   "850",
//                   "792",
//                   "58",
//                   "$1,950.00",
//                   "Medicare/Medicaid",
//                   "warning",
//                 ],
//                 [
//                   "00093-1040",
//                   "Metformin 500mg",
//                   "2,100",
//                   "2,040",
//                   "60",
//                   "$3,240.00",
//                   "Commercial",
//                   "success",
//                 ],
//                 [
//                   "00071-0215",
//                   "Atorvastatin 20mg",
//                   "640",
//                   "580",
//                   "60",
//                   "$2,320.00",
//                   "Medicare/Commercial",
//                   "danger",
//                 ],
//                 [
//                   "00093-0032",
//                   "Omeprazole 20mg",
//                   "1,120",
//                   "1,050",
//                   "70",
//                   "$1,680.00",
//                   "Medicaid",
//                   "success",
//                 ],
//               ].map((r, idx) => (
//                 <div
//                   key={r[0]}
//                   className="grid grid-cols-[1fr_1fr_0.8fr_0.8fr_0.8fr_1fr_1fr] gap-3 items-center py-3 text-xs animate-fadeInUp whitespace-nowrap"
//                   style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
//                 >
//                   <div className="font-mono text-foreground">{r[0]}</div>
//                   <div className="text-foreground">{r[1]}</div>
//                   <div className="text-muted-foreground">{r[2]}</div>
//                   <div className="text-muted-foreground">{r[3]}</div>
//                   <div className="text-muted-foreground">{r[4]}</div>
//                   <div className="text-foreground font-semibold">{r[5]}</div>
//                   <div>
//                     <span
//                       className={`rounded-full px-2 py-0.5 text-[9px] inline-block ${
//                         r[7] === "success"
//                           ? "bg-success/15 text-success"
//                           : r[7] === "warning"
//                             ? "bg-warning/15 text-warning"
//                             : "bg-danger/15 text-danger"
//                       }`}
//                     >
//                       {r[6]}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs animate-fadeInUp stagger-9">
//               <span className="text-muted-foreground">
//                 Showing 5 of 240 inventory reports
//               </span>
//               <button className="rounded-md border border-border px-3 py-1.5">
//                 View All Reports
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ANALYTICS */}
//       <section className="border-b border-border/60 py-24">
//         <div className="mx-auto grid max-w-[800px] grid-cols-1 items-center gap-12 px-7 lg:grid-cols-1">
//           {/* <div className="rounded-2xl border border-border bg-surface p-6 animate-slideInLeft">
//             <div className="animate-fadeInUp stagger-0">
//               <h4 className="font-semibold">Audit Savings — Last 6 Months</h4>
//               <p className="text-xs text-muted-foreground">
//                 Revenue protected through successful audit defense
//               </p>
//             </div>
//             <div className="mt-6 flex h-40 items-end gap-4">
//               {[
//                 ["Jul", 30],
//                 ["Aug", 50],
//                 ["Sep", 65],
//                 ["Oct", 80],
//                 ["Nov", 90],
//                 ["Dec", 100],
//               ].map(([m, h]: any, idx) => (
//                 <div
//                   key={m}
//                   className="flex flex-1 flex-col items-center gap-2 animate-fadeInUp"
//                   style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
//                 >
//                   <div
//                     className="w-full rounded-md bg-gradient-to-t from-zinc-700 to-zinc-400 transition-all hover:opacity-80"
//                     style={{ height: `${h}%` }}
//                   />
//                   <span className="text-[10px] text-muted-foreground">{m}</span>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-6 grid grid-cols-2 gap-4">
//               <div className="rounded-lg border border-border bg-surface-2 p-4 animate-fadeInUp stagger-7">
//                 <div className="text-xs text-muted-foreground">
//                   Total Revenue Saved
//                 </div>
//                 <div className="mt-1 text-2xl font-semibold">$847K</div>
//                 <div className="mt-1 text-[11px] text-success">
//                   ▲ +12.4%{" "}
//                   <span className="text-muted-foreground">vs last period</span>
//                 </div>
//               </div>
//               <div className="rounded-lg border border-border bg-surface-2 p-4 animate-fadeInUp stagger-8">
//                 <div className="text-xs text-muted-foreground">
//                   Audit Success Rate
//                 </div>
//                 <div className="mt-1 text-2xl font-semibold">94.2%</div>
//                 <div className="mt-1 text-[11px] text-success">
//                   ▲ +3.1%{" "}
//                   <span className="text-muted-foreground">improvement</span>
//                 </div>
//               </div>
//             </div>
//           </div> */}
//           <div className="animate-slideInRight">
//             <Pill>Demonstration Walkthrough</Pill>
//             {/* <h2 className="mt-6 text-4xl font-semibold tracking-tight animate-fadeInUp stagger-1">
//               Data-Driven Audit Intelligence
//             </h2>
//             <p className="mt-4 text-muted-foreground animate-fadeInUp stagger-2">
//               Visualize audit performance with powerful analytics. Understand
//               trends, identify vulnerabilities, and make informed decisions to
//               protect your pharmacy's bottom line.
//             </p> */}
//             <div className="mt-6 relative rounded-2xl border border-border bg-surface-2 overflow-hidden animate-fadeInUp stagger-3">
//               {/* Video Container */}
//               <div className="relative w-full aspect-video bg-black flex items-center justify-center">
//                 {/* Coming Soon Overlay */}
//                 <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/80 to-zinc-800/80 flex flex-col items-center justify-center backdrop-blur-sm">
//                   <div className="text-center animate-fadeInUp stagger-4">
//                     <Play className="h-16 w-16 text-zinc-400 mx-auto mb-4" />
//                     <h3 className="text-2xl font-semibold text-white mb-2 animate-fadeInUp stagger-5">
//                       Coming Soon
//                     </h3>
//                     <p className="text-sm text-zinc-300 animate-fadeInUp stagger-6">
//                       Platform demonstration video
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* <ul className="mt-6 space-y-3 text-sm">
//               {[
//                 "Real-time revenue protection dashboards",
//                 "Audit trend analysis and forecasting",
//                 "Risk scoring and vulnerability detection",
//                 "Exportable compliance and board reports",
//               ].map((f, idx) => (
//                 <li
//                   key={f}
//                   className="flex items-center gap-3 animate-fadeInUp"
//                   style={{ animationDelay: `${0.4 + idx * 0.1}s` }}
//                 >
//                   <span className="grid h-5 w-5 place-items-center rounded-full bg-surface-2">
//                     <Check className="h-3 w-3 text-success" />
//                   </span>
//                   {f}
//                 </li>
//               ))}
//             </ul> */}
//           </div>
//         </div>
//       </section>

//       {/* DRUG LOOKUP */}
//       <section id="drug-lookup" className="border-b border-border/60 py-24">
//         <div className="mx-auto max-w-[1200px] px-7">
//           <div className="text-center">
//             <Pill>Drug Intelligence</Pill>
//             <h2 className="mt-6 text-5xl font-semibold tracking-tight animate-fadeInUp stagger-1">
//               Drug Intelligence Hub
//             </h2>
//             <p className="mx-auto mt-4 max-w-2xl text-muted-foreground animate-fadeInUp stagger-2">
//               Search any drug by name, NDC, BIN, PCN, or GROUP and instantly
//               surface community-sourced benchmarks — variants, total Rx volume,
//               insurance paid, and average reimbursement per unit.
//             </p>
//           </div>
//           <div className="mt-14 grid gap-6 lg:grid-cols-[1fr_1.5fr]">
//             <div className="space-y-3">
//               {[
//                 [
//                   Search,
//                   "NDC-Based Search",
//                   "Instant lookup by NDC code, drug name, or manufacturer across 500K+ medications.",
//                 ],
//                 [
//                   DollarSign,
//                   "Real-Time Drug Pricing",
//                   "Access current MAC pricing, AWP data, and cost benchmarks for informed purchasing decisions.",
//                 ],
//                 [
//                   FileSpreadsheet,
//                   "Formulary Intelligence",
//                   "Understand payer tier placement, prior auth requirements, and formulary positioning.",
//                 ],
//                 [
//                   ArrowRight,
//                   "Workflow Integration",
//                   "Drug data surfaces automatically within audit responses — zero manual lookup required.",
//                 ],
//               ].map(([Icon, t, d]: any, idx) => (
//                 <div
//                   key={t}
//                   className="rounded-2xl border border-border bg-surface p-5 animate-fadeInUp transition-all hover:shadow-lg hover:border-border/80"
//                   style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
//                 >
//                   <div className="flex items-start gap-4">
//                     <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-surface-2">
//                       <Icon className="h-4 w-4 text-muted-foreground" />
//                     </div>
//                     <div>
//                       <h4 className="font-semibold">{t}</h4>
//                       <p className="mt-1 text-sm text-muted-foreground">{d}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             <div className="rounded-2xl border border-border bg-surface p-6 animate-slideInRight">
//               <div className="flex items-center justify-between animate-fadeInUp stagger-0">
//                 <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
//                   <Search className="h-4 w-4" /> Drug Search &amp; Filters
//                 </div>
//                 <span className="inline-flex items-center gap-1.5 text-xs text-success">
//                   <span className="h-1.5 w-1.5 rounded-full bg-success" />
//                   Community data
//                 </span>
//               </div>

//               {/* Filter row: Drug Name / BIN / PCN / GROUP */}
//               <div className="mt-5 grid grid-cols-2 gap-2 animate-fadeInUp stagger-1 lg:grid-cols-4">
//                 {[
//                   ["Drug Name", "MOUNJARO"],
//                   ["BIN", "e.g. 004336"],
//                   ["PCN", "e.g. MCAIDADV"],
//                   ["GROUP", "e.g. RX8826"],
//                 ].map(([label, val], idx) => (
//                   <div key={label}>
//                     <div className="mb-1 text-[10px] uppercase tracking-wider text-muted-foreground">
//                       {label}
//                     </div>
//                     <div
//                       className={`truncate rounded-lg border border-border bg-background px-3 py-2 text-xs ${idx === 0 ? "font-semibold text-foreground" : "text-muted-foreground"}`}
//                     >
//                       {val}
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Result heading */}
//               <div className="mt-6 animate-fadeInUp stagger-2">
//                 <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
//                   Drug Lookup
//                 </div>
//                 <div className="mt-1 text-2xl font-semibold tracking-tight">
//                   MOUNJARO
//                 </div>
//                 <p className="text-xs text-muted-foreground">
//                   Found 15 variants across the AuditProRx community
//                 </p>
//               </div>

//               {/* Summary stat chips */}
//               <div className="mt-4 grid grid-cols-2 gap-2 animate-fadeInUp stagger-3 lg:grid-cols-4">
//                 {[
//                   ["Variants", "15"],
//                   ["Total Rx", "303"],
//                   ["Total Ins Paid", "$311,157"],
//                   ["Avg / Unit", "$469.32"],
//                 ].map(([label, val]) => (
//                   <div
//                     key={label}
//                     className="rounded-lg border border-border bg-surface-2/50 p-3"
//                   >
//                     <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
//                       {label}
//                     </div>
//                     <div className="mt-1 text-sm font-semibold">{val}</div>
//                   </div>
//                 ))}
//               </div>

//               {/* Medications table */}
//               <div className="mt-5 overflow-hidden rounded-lg border border-border animate-fadeInUp stagger-4">
//                 <div className="grid grid-cols-12 gap-2 bg-foreground px-3 py-2 text-[9px] font-semibold uppercase tracking-wider text-background">
//                   <div className="col-span-6">Medications</div>
//                   <div className="col-span-2 text-right">Avg Qty</div>
//                   <div className="col-span-2 text-right">Ins / Rx</div>
//                   <div className="col-span-2 text-right">Rx Count</div>
//                 </div>
//                 {[
//                   ["MOUNJARO 5MG/0.5ML INJ", "2", "$864.34", "56"],
//                   ["MOUNJARO 15MG/0.5ML INJ", "2", "$1071.51", "48"],
//                   ["MOUNJARO 2.5MG/0.5ML INJ", "2", "$882.20", "47"],
//                 ].map((r, idx) => (
//                   <div
//                     key={r[0]}
//                     className="grid grid-cols-12 items-center gap-2 border-t border-border px-3 py-2.5 text-xs"
//                   >
//                     <div className="col-span-6 flex items-center gap-1.5 font-medium">
//                       <span className="text-muted-foreground">{idx + 1}.</span>
//                       <span className="truncate">{r[0]}</span>
//                       <span className="rounded bg-success/15 px-1 text-[8px] font-semibold text-success">
//                         B
//                       </span>
//                     </div>
//                     <div className="col-span-2 text-right text-muted-foreground">
//                       {r[1]}
//                     </div>
//                     <div className="col-span-2 text-right font-semibold">
//                       {r[2]}
//                     </div>
//                     <div className="col-span-2 text-right font-semibold">
//                       {r[3]}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground animate-fadeInUp stagger-5">
//                 <span>Community-sourced · Updated daily</span>
//                 <span className="text-foreground">
//                   Click a row to expand NDC breakdown
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* NETWORK */}
//       <section id="inventory-view" className="border-b border-border/60 py-24">
//         <div className="mx-auto max-w-[1200px] px-7">
//           <div className="text-center">
//             <Pill>Inventory Exchange Network</Pill>
//             <h2 className="mt-6 text-5xl font-semibold tracking-tight animate-fadeInUp stagger-1">
//               Move Surplus Stock, Recover Capital
//             </h2>
//             <p className="mx-auto mt-4 max-w-2xl text-muted-foreground animate-fadeInUp stagger-2">
//               Find verified surplus inventory at other pharmacies for
//               patient-specific transfers — fully compliant with DSCSA and state
//               Board of Pharmacy rules. List once, connect, and turn shelved
//               stock back into capital.
//             </p>
//           </div>
//           <div className="mt-14 grid gap-4 md:grid-cols-4">
//             {[
//               [
//                 Home,
//                 "Create Pharmacy Groups",
//                 "Form private networks with trusted pharmacy partners and control visibility.",
//               ],
//               [
//                 Phone,
//                 "Invite Partners",
//                 "Send secure invitations to pharmacies you want in your collaboration network.",
//               ],
//               [
//                 CircleDollarSign,
//                 "Global or Private Listings",
//                 "Post inventory to your private group or the broader platform marketplace.",
//               ],
//               [
//                 ShieldCheck,
//                 "Controlled Access",
//                 "Granular permissions determine who sees what — fully under your control.",
//               ],
//             ].map(([Icon, t, d]: any, idx) => (
//               <div
//                 key={t}
//                 className="rounded-2xl border border-border bg-surface p-6 animate-fadeInUp transition-all hover:shadow-lg hover:border-border/80"
//                 style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
//               >
//                 <div className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface-2">
//                   <Icon className="h-5 w-5 text-muted-foreground" />
//                 </div>
//                 <h4 className="mt-5 font-semibold">{t}</h4>
//                 <p className="mt-2 text-sm text-muted-foreground">{d}</p>
//               </div>
//             ))}
//           </div>
//           <div className="mt-8 grid gap-5 lg:grid-cols-2">
//             <div className="rounded-2xl border border-border bg-surface p-6 animate-slideInLeft">
//               <div className="flex items-start justify-between animate-fadeInUp stagger-0">
//                 <div>
//                   <h4 className="font-semibold">Your Pharmacy Group</h4>
//                   <p className="text-xs text-muted-foreground">
//                     Midwest Care Network · 4 pharmacies
//                   </p>
//                 </div>
//                 <button className="rounded-md border border-border px-3 py-1.5 text-xs">
//                   + Invite
//                 </button>
//               </div>
//               <div className="mt-5 divide-y divide-border">
//                 {[
//                   [
//                     "R",
//                     "Riverside Pharmacy",
//                     "Chicago, IL",
//                     "48 listings",
//                     "Owner",
//                     "owner",
//                   ],
//                   [
//                     "C",
//                     "Central Care Rx",
//                     "Naperville, IL",
//                     "32 listings",
//                     "Member",
//                     "success",
//                   ],
//                   [
//                     "M",
//                     "MediQuick Pharmacy",
//                     "Evanston, IL",
//                     "",
//                     "Invited",
//                     "warning",
//                   ],
//                   [
//                     "F",
//                     "Family Health Rx",
//                     "Schaumburg, IL",
//                     "19 listings",
//                     "Member",
//                     "success",
//                   ],
//                 ].map((r, idx) => (
//                   <div
//                     key={r[1]}
//                     className="flex items-center gap-3 py-3 animate-fadeInUp"
//                     style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
//                   >
//                     <div className="grid h-9 w-9 place-items-center rounded-lg bg-surface-2 text-sm font-semibold">
//                       {r[0]}
//                     </div>
//                     <div className="flex-1">
//                       <div className="text-sm font-medium">{r[1]}</div>
//                       <div className="text-xs text-muted-foreground">
//                         {r[2]}
//                       </div>
//                     </div>
//                     <div className="text-xs text-muted-foreground">{r[3]}</div>
//                     <span
//                       className={`rounded-full px-2 py-0.5 text-[10px] ${
//                         r[5] === "success"
//                           ? "bg-success/15 text-success"
//                           : r[5] === "warning"
//                             ? "bg-warning/15 text-warning"
//                             : "bg-muted text-muted-foreground"
//                       }`}
//                     >
//                       {r[4]}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="rounded-2xl border border-border bg-surface p-6 animate-slideInRight">
//               <div className="flex items-start justify-between animate-fadeInUp stagger-0">
//                 <div>
//                   <h4 className="font-semibold">Inventory Exchange</h4>
//                   <p className="text-xs text-muted-foreground">
//                     Verified surplus listings · Live
//                   </p>
//                 </div>
//                 <div className="flex rounded-md border border-border p-0.5 text-xs">
//                   <button className="rounded bg-surface-2 px-3 py-1">
//                     Search Network
//                   </button>
//                   <button className="px-3 py-1 text-muted-foreground">
//                     My Listings
//                   </button>
//                 </div>
//               </div>
//               {/* DSCSA compliance banner */}
//               <div className="mt-5 flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 text-[11px] text-warning animate-fadeInUp stagger-1">
//                 <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
//                 <span>
//                   All transfers must be patient-specific Rx transfers under
//                   DSCSA. Controlled substances cannot be listed.
//                 </span>
//               </div>

//               {/* Listing card */}
//               <div className="mt-4 rounded-xl border border-border bg-surface-2/40 p-4 animate-fadeInUp stagger-2">
//                 <div className="flex items-start gap-3">
//                   <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface-2 text-sm font-semibold">
//                     M
//                   </div>
//                   <div className="min-w-0 flex-1">
//                     <div className="text-sm font-semibold">
//                       Mounjaro 5mg/0.5ml s 5mg/0.5ml inj
//                     </div>
//                     <div className="font-mono text-[11px] text-muted-foreground">
//                       NDC 00002-1495-80
//                     </div>
//                   </div>
//                 </div>
//                 <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
//                   {[
//                     ["Available", "21"],
//                     ["Expiry", "Jul 2026"],
//                     ["Shelf Cost", "$25.00"],
//                   ].map(([label, val]) => (
//                     <div key={label}>
//                       <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
//                         {label}
//                       </div>
//                       <div className="mt-1 font-semibold">{val}</div>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
//                   <div>
//                     <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
//                       Holding Pharmacy
//                     </div>
//                     <div className="mt-0.5 flex items-center gap-1 text-xs font-semibold">
//                       United Drugs Rx LLC
//                       <ShieldCheck className="h-3 w-3 text-success" />
//                     </div>
//                     <div className="text-[10px] text-muted-foreground">
//                       ★ 5.0 · 507 Central Ave
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button className="rounded-md border border-border px-2.5 py-1.5 text-[11px]">
//                       View Details
//                     </button>
//                     <button className="inline-flex items-center gap-1 rounded-md bg-foreground px-2.5 py-1.5 text-[11px] font-medium text-background">
//                       Send Connect Request <ArrowRight className="h-3 w-3" />
//                     </button>
//                   </div>
//                 </div>
//               </div>
//               <a
//                 href="#"
//                 className="mt-4 inline-flex text-xs text-muted-foreground hover:text-foreground animate-fadeInUp stagger-5"
//               >
//                 View all verified listings →
//               </a>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* LEADS */}
//       <section id="leads" className="border-b border-border/60 py-24">
//         <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-12 px-7 lg:grid-cols-2">
//           <div className="animate-slideInLeft">
//             <Pill>Reimbursement Intelligence</Pill>
//             <h2 className="mt-6 text-4xl font-semibold tracking-tight animate-fadeInUp stagger-1">
//               Capture High-Value Reimbursement Opportunities
//             </h2>
//             <p className="mt-4 text-muted-foreground animate-fadeInUp stagger-2">
//               Get admin-curated, region-specific reimbursement leads delivered
//               straight to your team — high-paying drugs, payer insights, and
//               profitable opportunities with the NDC, AWP, and WAC data you need
//               to act fast.
//             </p>
//             <div className="mt-6 space-y-4 text-sm">
//               {[
//                 [
//                   Search,
//                   "Curated Opportunity Feed",
//                   "Admin-published reimbursement leads with the exact drug, NDC, and payer notes you need.",
//                 ],
//                 [
//                   UserIcon,
//                   "Region-Specific Targeting",
//                   "Filter announcements by state — New Jersey, New York, and more — so every lead is relevant.",
//                 ],
//                 [
//                   BarChart3,
//                   "Pricing Intelligence",
//                   "Every lead includes AWP, WAC, and reimbursement context before you ever fill the script.",
//                 ],
//               ].map(([Icon, t, d]: any, idx) => (
//                 <div
//                   key={t}
//                   className="flex items-start gap-3 animate-fadeInUp"
//                   style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
//                 >
//                   <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-border bg-surface">
//                     <Icon className="h-4 w-4 text-muted-foreground" />
//                   </span>
//                   <div>
//                     <div className="font-medium">{t}</div>
//                     <p className="text-muted-foreground">{d}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//             {/* <button className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-zinc-100 to-zinc-300 px-5 py-3 text-sm font-medium text-background animate-fadeInUp stagger-6">
//               Explore Reimbursement Leads <ArrowRight className="h-4 w-4" />
//             </button> */}
//           </div>
//           <div className="rounded-2xl border border-border bg-surface p-6 animate-slideInRight">
//             <div className="flex items-start justify-between animate-fadeInUp stagger-0">
//               <div>
//                 <h4 className="font-semibold">Reimbursement Feed</h4>
//                 <p className="text-xs text-muted-foreground">
//                   Admin-curated · Verified · Updated daily
//                 </p>
//               </div>
//               <span className="inline-flex items-center gap-1.5 text-xs text-success">
//                 <span className="h-1.5 w-1.5 rounded-full bg-success" />
//                 Live
//               </span>
//             </div>
//             {/* Region filter tabs */}
//             <div className="mt-5 flex flex-wrap gap-2">
//               {[["All", true], ["New Jersey"], ["New York"]].map(
//                 ([n, a]: any, idx) => (
//                   <span
//                     key={n}
//                     className={`rounded-full border border-border px-3 py-1 text-xs animate-fadeInUp ${a ? "bg-surface-2 text-foreground" : "text-muted-foreground"}`}
//                     style={{ animationDelay: `${0.1 + idx * 0.05}s` }}
//                   >
//                     {n}
//                   </span>
//                 ),
//               )}
//             </div>

//             {/* Announcement cards */}
//             <div className="mt-4 space-y-3">
//               {[
//                 {
//                   when: "5d ago",
//                   region: "New Jersey",
//                   title: "High Reimbursement Opportunity",
//                   drug: "DESLORATADINE 0.5mg/ml",
//                   sub: "118ml (clarinex)",
//                   ndc: "74157-0011-01",
//                   awp: "$3,540",
//                   wac: "$2,950",
//                   notes: "Look into the Clover Health and Nationwide plans.",
//                 },
//                 {
//                   when: "May 16",
//                   region: "New York",
//                   title: "Profitable Drug Lead",
//                   drug: "TIRZEPATIDE 5mg/0.5ml",
//                   sub: "Mounjaro",
//                   ndc: "00002-1495-80",
//                   awp: "$1,069",
//                   wac: "$974",
//                   notes: "Strong margin across commercial GLP-1 formularies.",
//                 },
//               ].map((r, idx) => (
//                 <div
//                   key={r.title}
//                   className="rounded-xl border border-border bg-surface-2/40 p-4 animate-fadeInUp"
//                   style={{ animationDelay: `${0.2 + idx * 0.1}s` }}
//                 >
//                   <div className="flex items-center gap-2">
//                     <div className="grid h-7 w-7 place-items-center rounded-full bg-surface-2 text-[10px] font-semibold">
//                       LS
//                     </div>
//                     <span className="text-xs font-semibold">
//                       Lead Support Team
//                     </span>
//                     <span className="text-[10px] text-muted-foreground">
//                       · {r.when}
//                     </span>
//                   </div>
//                   <div className="mt-2 flex flex-wrap gap-1.5">
//                     <span className="rounded-full bg-muted px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
//                       Announcement
//                     </span>
//                     <span className="rounded-full bg-success/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-success">
//                       {r.region}
//                     </span>
//                   </div>
//                   <div className="mt-2 text-sm font-semibold">{r.title}</div>
//                   <div className="text-xs text-foreground/90">{r.drug}</div>
//                   <div className="text-[11px] text-muted-foreground">
//                     {r.sub}
//                   </div>
//                   <div className="mt-2 grid grid-cols-3 gap-2 text-[11px]">
//                     <div>
//                       <span className="text-muted-foreground">NDC: </span>
//                       <span className="font-mono">{r.ndc}</span>
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">AWP: </span>
//                       <span className="font-semibold">{r.awp}</span>
//                     </div>
//                     <div>
//                       <span className="text-muted-foreground">WAC: </span>
//                       <span className="font-semibold">{r.wac}</span>
//                     </div>
//                   </div>
//                   <p className="mt-2 text-[11px] text-muted-foreground">
//                     <span className="font-semibold text-foreground/90">
//                       Notes:{" "}
//                     </span>
//                     {r.notes}
//                   </p>
//                 </div>
//               ))}
//             </div>
//             {/* <div className="mt-4 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground animate-fadeInUp stagger-6">
//               <span>Showing 2 of 247 opportunities</span>
//               <a href="#">View All Leads →</a>
//             </div> */}
//           </div>
//         </div>
//       </section>

//       {/* HOW IT WORKS */}
//       <section className="border-b border-border/60 py-24">
//         <div className="mx-auto max-w-[1200px] px-7 text-center">
//           <Pill>How It Works</Pill>
//           <h2 className="mt-6 text-5xl font-semibold tracking-tight animate-fadeInUp stagger-1">
//             Operational in Three Steps
//           </h2>
//           <p className="mx-auto mt-4 max-w-xl text-muted-foreground animate-fadeInUp stagger-2">
//             From registration to full audit protection in minutes, not months —
//             with admin access and dedicated product support every step of the
//             way.
//           </p>
//           <div className="relative mt-14 grid gap-6 md:grid-cols-3">
//             {[
//               [
//                 "01",
//                 "Register Your Pharmacy",
//                 "Create your AuditProRx account in minutes. Verify your pharmacy and get instant admin access to your secure workspace.",
//               ],
//               [
//                 "02",
//                 "Activate Your Plan",
//                 "Choose a plan and complete payment securely. Your modules unlock immediately — no setup fees, no waiting, no long-term contracts.",
//               ],
//               [
//                 "03",
//                 "Run the Platform",
//                 "Generate audit reports, look up drug intelligence, exchange inventory, and track reimbursement leads — backed by dedicated product support.",
//               ],
//             ].map(([n, t, d], idx) => (
//               <div
//                 key={n}
//                 className="text-left animate-fadeInUp"
//                 style={{ animationDelay: `${0.1 + idx * 0.15}s` }}
//               >
//                 <div className="mb-4 flex items-center gap-3">
//                   <span className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-xs font-mono">
//                     {n}
//                   </span>
//                   <span className="h-px flex-1 border-t border-dashed border-border" />
//                 </div>
//                 <div className="rounded-2xl border border-border bg-surface p-6 flex flex-col h-3/4 transition-all hover:shadow-lg hover:border-border/80">
//                   <h4
//                     className="font-semibold animate-fadeInUp"
//                     style={{ animationDelay: `${0.2 + idx * 0.15}s` }}
//                   >
//                     {t}
//                   </h4>
//                   <p
//                     className="mt-2 text-sm text-muted-foreground animate-fadeInUp"
//                     style={{ animationDelay: `${0.3 + idx * 0.15}s` }}
//                   >
//                     {d}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* TESTIMONIALS */}
//       <section className="border-b border-border/60 py-24">
//         <div className="mx-auto max-w-[1200px] px-7 text-center">
//           <Pill>Client Testimonials</Pill>
//           <h2 className="mt-6 text-5xl font-semibold tracking-tight animate-fadeInUp stagger-1">
//             Trusted by Pharmacy Leaders
//           </h2>
//           <p className="mt-4 text-muted-foreground animate-fadeInUp stagger-2">
//             Hear from the pharmacy operators who rely on AuditProRx every day.
//           </p>
//           <div className="mt-14 grid gap-5 md:grid-cols-3">
//             {testimonials.map((t, idx) => (
//               <div
//                 key={t.initials}
//                 className="rounded-2xl border border-border bg-surface p-6 text-left animate-fadeInUp transition-all hover:shadow-lg hover:border-border/80"
//                 style={{ animationDelay: `${0.1 + idx * 0.15}s` }}
//               >
//                 <div
//                   className="flex gap-0.5 animate-fadeInUp"
//                   style={{ animationDelay: `${0.15 + idx * 0.15}s` }}
//                 >
//                   {[...Array(5)].map((_, i) => (
//                     <Star
//                       key={i}
//                       className="h-3.5 w-3.5 fill-foreground text-foreground"
//                     />
//                   ))}
//                 </div>
//                 <p
//                   className="mt-4 text-sm leading-relaxed animate-fadeInUp"
//                   style={{ animationDelay: `${0.2 + idx * 0.15}s` }}
//                 >
//                   <span className="text-lg font-serif">"</span>
//                   {t.quote}
//                   <span className="text-lg font-serif">"</span>
//                 </p>
//                 <div
//                   className="mt-6 flex items-center gap-3 border-t border-border pt-4 animate-fadeInUp"
//                   style={{ animationDelay: `${0.25 + idx * 0.15}s` }}
//                 >
//                   <div
//                     className={`h-9 w-9 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-sm font-bold text-white`}
//                   >
//                     {t.initials}
//                   </div>
//                   <div>
//                     <div className="text-sm font-medium">{t.name}</div>
//                     <div className="text-xs text-muted-foreground">
//                       {t.role}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* SUPPORT */}
//       <section id="support" className="border-b border-border/60 py-24">
//         <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-12 px-7 lg:grid-cols-2">
//           <div className="animate-slideInLeft">
//             <Pill>Enterprise Support</Pill>
//             <h2 className="mt-6 text-4xl font-semibold tracking-tight animate-fadeInUp stagger-1">
//               Expert Pharmacy Support, When You Need It
//             </h2>
//             <p className="mt-4 text-muted-foreground animate-fadeInUp stagger-2">
//               Our dedicated pharmacy operations team is available Monday through
//               Friday, 9 AM to 5 PM, to provide remote assistance, guided
//               walkthroughs, and immediate issue resolution.
//             </p>
//             <ul className="mt-6 space-y-3 text-sm">
//               {[
//                 "Remote screen-share assistance with certified pharmacy specialists",
//                 "Step-by-step audit workflow guidance",
//                 "Priority issue escalation for urgent audit deadlines",
//                 "Dedicated account manager for enterprise accounts",
//               ].map((f, idx) => (
//                 <li
//                   key={f}
//                   className="flex items-center gap-3 animate-fadeInUp"
//                   style={{ animationDelay: `${0.3 + idx * 0.1}s` }}
//                 >
//                   <span className="grid h-5 w-5 place-items-center rounded-full bg-surface-2">
//                     <Check className="h-3 w-3 text-success" />
//                   </span>
//                   {f}
//                 </li>
//               ))}
//             </ul>
//             <button
//               onClick={downloadScreenConnect}
//               className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-zinc-100 to-zinc-300 px-5 py-3 text-sm font-medium text-background hover:from-white animate-fadeInUp stagger-7 transition-all"
//             >
//               <Download className="h-4 w-4" /> Download Support Access File
//             </button>
//             <p className="mt-3 text-xs text-muted-foreground animate-fadeInUp stagger-8">
//               Initiates a secure remote assistance session with our team via
//               ScreenConnect.
//             </p>
//           </div>
//           <div className="rounded-2xl border border-border bg-surface p-6 animate-slideInRight">
//             <div className="flex items-start justify-between animate-fadeInUp stagger-0">
//               <div>
//                 <h4 className="font-semibold">AuditProRx Remote Assistance</h4>
//                 <p className="text-xs text-muted-foreground">
//                   Mon – Fri · 9:00 AM – 5:00 PM CST
//                 </p>
//               </div>
//               <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2 py-1 text-xs text-success animate-pulseGlow">
//                 <span className="h-1.5 w-1.5 rounded-full bg-success" />
//                 Support Online
//               </span>
//             </div>
//             <div className="mt-6 space-y-3">
//               {[
//                 [
//                   Monitor,
//                   "Remote Screen Share",
//                   "A specialist connects directly to walk you through any workflow step-by-step.",
//                   "Most Popular",
//                 ],
//                 [
//                   Phone,
//                   "Phone Support",
//                   "Direct line to a certified pharmacy operations specialist.",
//                   "",
//                 ],
//                 [
//                   ClipboardList,
//                   "Priority Ticket",
//                   "Submit a detailed request for same-business-day resolution.",
//                   "",
//                 ],
//               ].map(([Icon, t, d, b]: any, idx) => (
//                 <div
//                   key={t}
//                   className="flex items-center gap-4 rounded-xl border border-border bg-surface-2 p-4 animate-fadeInUp transition-all hover:shadow-md"
//                   style={{ animationDelay: `${0.1 + idx * 0.1}s` }}
//                 >
//                   <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-surface">
//                     <Icon className="h-4 w-4 text-muted-foreground" />
//                   </div>
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 text-sm font-medium">
//                       {t}
//                       {b && (
//                         <span className="rounded-full border border-border bg-surface px-2 py-0.5 text-[10px] text-muted-foreground">
//                           {b}
//                         </span>
//                       )}
//                     </div>
//                     <p className="text-xs text-muted-foreground">{d}</p>
//                   </div>
//                   <ArrowRight className="h-4 w-4 text-muted-foreground" />
//                 </div>
//               ))}
//             </div>
//             <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground animate-fadeInUp stagger-4">
//               <Shield className="h-3.5 w-3.5" /> All sessions are encrypted,
//               HIPAA-compliant, and session-logged.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* PRICING */}
//       <section id="pricing" className="border-b border-border/60 py-24">
//         <div className="mx-auto max-w-[1280px] px-7 text-center">
//           <Pill>Pricing</Pill>
//           <h2 className="mt-6 text-5xl font-semibold tracking-tight animate-fadeInUp stagger-1">
//             Transparent, Scalable Pricing
//           </h2>
//           <p className="mt-4 text-muted-foreground animate-fadeInUp stagger-2">
//             Start with what you need. Scale as your pharmacy group grows.
//           </p>
//           <div className="mt-14 grid items-stretch gap-6 md:grid-cols-2 max-w-3xl mx-auto">
//             {plans.map((p, idx) => (
//               <div
//                 key={p.id}
//                 className={`relative flex flex-col rounded-2xl border p-7 text-left animate-fadeInUp transition-all ${p.highlighted ? "h-[max-content] border-transparent bg-gradient-to-b from-surface-2 to-surface ring-2 ring-foreground/30 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.55)] md:scale-[1.04] md:-my-2 hover:shadow-[0_25px_70px_-20px_rgba(0,0,0,0.65)]" : "border-border bg-surface hover:border-border/80 hover:shadow-md"}`}
//                 style={{ animationDelay: `${0.1 + idx * 0.15}s` }}
//               >
//                 {p.highlighted && (
//                   <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-b from-zinc-100 to-zinc-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-background shadow-md">
//                     {(p as any).badge ?? "Most Popular"}
//                   </span>
//                 )}
//                 <div
//                   className="flex items-center gap-2 animate-fadeInUp"
//                   style={{ animationDelay: `${0.15 + idx * 0.15}s` }}
//                 >
//                   <span className="text-xs font-semibold uppercase tracking-[0.16em]">
//                     {p.name}
//                   </span>
//                 </div>
//                 <div
//                   className="mt-5 flex items-baseline gap-1 animate-fadeInUp"
//                   style={{ animationDelay: `${0.2 + idx * 0.15}s` }}
//                 >
//                   <span
//                     className={`font-semibold ${p.highlighted ? "text-5xl" : "text-4xl"}`}
//                   >
//                     {p.price}
//                   </span>
//                   <span className="text-sm text-muted-foreground">
//                     {p.period}
//                   </span>
//                 </div>
//                 {(p as any).savings && (
//                   <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-[11px] font-medium text-success">
//                     <Zap className="h-3 w-3" /> {(p as any).savings}
//                   </span>
//                 )}
//                 <p
//                   className="mt-3 text-sm leading-relaxed text-muted-foreground animate-fadeInUp"
//                   style={{ animationDelay: `${0.25 + idx * 0.15}s` }}
//                 >
//                   {p.description}
//                 </p>
//                 <ul className="mt-6 space-y-2.5 text-sm">
//                   {p.features.map((f, fIdx) => (
//                     <li
//                       key={f}
//                       className="flex items-start gap-2.5 animate-fadeInUp"
//                       style={{
//                         animationDelay: `${0.3 + fIdx * 0.05 + idx * 0.15}s`,
//                       }}
//                     >
//                       <span
//                         className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full ${p.highlighted ? "bg-success/20" : "bg-surface-2"}`}
//                       >
//                         <Check className="h-3 w-3 text-success" />
//                       </span>
//                       <span
//                         className={
//                           fIdx === 0 && p.highlighted
//                             ? "font-semibold text-foreground"
//                             : "text-foreground/90"
//                         }
//                       >
//                         {f}
//                       </span>
//                     </li>
//                   ))}
//                 </ul>

//                 {/* Add-ons for base plan ONLY */}
//                 {p.id === "base" && p.addOns && (
//                   <div className="mt-6">
//                     <button
//                       onClick={() =>
//                         setExpandedAddOns({
//                           ...expandedAddOns,
//                           base: !expandedAddOns.base,
//                         })
//                       }
//                       className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition animate-fadeInUp"
//                       style={{ animationDelay: `${0.5 + idx * 0.15}s` }}
//                     >
//                       Available Add-ons
//                       <ChevronDown
//                         className={`h-4 w-4 transition-transform ${
//                           expandedAddOns.base ? "rotate-180" : ""
//                         }`}
//                       />
//                     </button>
//                     <div
//                       className={`expandable-content ${
//                         expandedAddOns.base ? "expanded" : ""
//                       }`}
//                     >
//                       <div className="mt-3 space-y-2 border-t border-border pt-4">
//                         {p.addOns.map((addon, aIdx) => (
//                           <div
//                             key={addon.name}
//                             className="flex items-center justify-between rounded-lg bg-surface-2/50 p-3 text-xs animate-fadeInUp"
//                             style={{ animationDelay: `${0.55 + aIdx * 0.1}s` }}
//                           >
//                             <span>{addon.name}</span>
//                             <span className="font-semibold">{addon.price}</span>
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//                 <Link
//                   href="/auth"
//                   target="_blank"
//                   className="mt-auto w-full block"
//                 >
//                   <button
//                     className={`w-full ${
//                       p.highlighted ? "mt-7" : "mt-7"
//                     } rounded-lg px-4 py-3 text-sm font-medium transition-all animate-fadeInUp ${
//                       p.highlighted
//                         ? "bg-gradient-to-b from-zinc-100 to-zinc-300 text-background hover:from-white"
//                         : "border border-border text-foreground hover:bg-surface-2"
//                     }`}
//                     style={{ animationDelay: `${0.6 + idx * 0.15}s` }}
//                   >
//                     {p.highlighted ? "Get Full Access" : "Get Started"}
//                   </button>
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* COMPLIANCE */}
//       <section className="border-b border-border/60 py-20">
//         <div className="mx-auto max-w-[1200px] px-7">
//           <p className="text-center text-xs tracking-[0.3em] text-muted-foreground/70 animate-fadeInUp stagger-0">
//             SECURITY & COMPLIANCE STANDARDS
//           </p>
//           <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-6">
//             {[
//               [Shield, "HIPAA Compliant", "Fully certified"],
//               [ShieldCheck, "SOC 2 Type II", "Audit verified"],
//               [Lock, "AES-256 Encryption", "All data at rest"],
//               [TimerReset, "99.9% Uptime SLA", "Enterprise grade"],
//               [UserIcon, "PHI Protected", "Zero-trust model"],
//               [ClipboardList, "DEA Compliant", "Drug data standards"],
//             ].map(([Icon, t, d]: any, idx) => (
//               <div
//                 key={t}
//                 className="rounded-2xl border border-border bg-surface p-5 text-center animate-fadeInUp transition-all hover:shadow-md hover:border-border/80"
//                 style={{ animationDelay: `${0.1 + idx * 0.08}s` }}
//               >
//                 <div className="mx-auto grid h-10 w-10 place-items-center rounded-lg bg-surface-2">
//                   <Icon className="h-5 w-5 text-muted-foreground" />
//                 </div>
//                 <div className="mt-4 text-sm font-medium">{t}</div>
//                 <div className="text-xs text-muted-foreground">{d}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="border-b border-border/60 py-24">
//         <div className="mx-auto max-w-6xl px-7 text-center">
//           <Pill>Get Started</Pill>
//           <h2 className="mt-6 text-5xl font-semibold tracking-tight animate-fadeInUp stagger-1 whitespace-nowrap">
//             Ready to Protect Your Pharmacy Revenue?
//           </h2>
//           <p className="mx-auto mt-5 max-w-4xl text-muted-foreground animate-fadeInUp stagger-2 text-lg leading-relaxed">
//             Join {stats[2][0]}+ pharmacy groups using AuditProRx to automate
//             audits, protect revenue, and gain competitive intelligence. Schedule
//             a personalized walkthrough with our team.
//           </p>
//           <div className="mt-9 flex items-center justify-center gap-3 animate-fadeInUp stagger-3 flex-wrap">
//             <button
//               onClick={scheduleConsultation}
//               className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-b from-zinc-100 to-zinc-300 px-5 py-3 text-sm font-medium text-background"
//             >
//               Schedule an Operational Efficiency Review{" "}
//               <ArrowRight className="h-4 w-4" />
//             </button>
//             <button
//               onClick={handleRequestInfo}
//               className="rounded-lg border border-border bg-surface px-5 py-3 text-sm"
//             >
//               Request Info
//             </button>
//           </div>
//           <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
//             {[
//               "No long-term contracts",
//               "HIPAA-compliant from day one",
//               "Onboard in under 24 hours",
//             ].map((t, idx) => (
//               <span
//                 key={t}
//                 className="inline-flex items-center gap-2 animate-fadeInUp"
//                 style={{ animationDelay: `${0.4 + idx * 0.1}s` }}
//               >
//                 <Check className="h-3 w-3 text-success" />
//                 {t}
//               </span>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* FOOTER */}
//       <footer className="py-14">
//         <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-10 px-7 md:grid-cols-6">
//           <div className="col-span-2">
//             <Logo />
//             <p className="mt-4 max-w-xs text-sm text-muted-foreground">
//               The enterprise pharmacy operations platform trusted by pharmacy
//               groups nationwide.
//             </p>
//             <div className="mt-5 flex gap-2">
//               {[Twitter, Linkedin].map((I, i) => (
//                 <a
//                   key={i}
//                   href={
//                     i === 1
//                       ? "https://www.linkedin.com/company/auditprorx/"
//                       : "#"
//                   }
//                   className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface text-muted-foreground hover:text-foreground transition-colors animate-fadeInUp"
//                   style={{ animationDelay: `${i * 0.1}s` }}
//                 >
//                   <I className="h-4 w-4" />
//                 </a>
//               ))}
//             </div>
//           </div>
//           {[
//             [
//               "Platform",
//               [
//                 "Audit Management",
//                 "Drug Lookup",
//                 "Audit Reports",
//                 "Pharmacy Network",
//                 "Analytics",
//                 "Pricing",
//               ],
//             ],
//             ["Company", ["About Us", "Careers", "Blog", "Press", "Contact"]],
//             [
//               "Legal",
//               [
//                 "Privacy Policy",
//                 "Terms of Service",
//                 "Cancellation Policy",
//                 "HIPAA Policy",
//               ],
//             ],
//             [
//               "Support",
//               [
//                 "Documentation",
//                 "Help Center",
//                 "System Status",
//                 "Remote Assistance",
//               ],
//             ],
//           ].map(([t, items]: any) => (
//             <div key={t}>
//               <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
//                 {t}
//               </div>
//               <ul className="mt-4 space-y-2 text-sm">
//                 {items.map((i: string) => (
//                   <li key={i}>
//                     <a
//                       href={`/${i.toLowerCase().replace(/\s+/g, "-")}`}
//                       className="text-foreground/80 hover:text-foreground transition-colors animate-fadeInUp"
//                     >
//                       {i}
//                     </a>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ))}
//         </div>
//         <div className="mx-auto mt-12 flex max-w-[1280px] items-center justify-between border-t border-border px-7 pt-6 text-xs text-muted-foreground">
//           <span>© {currentYear} AuditProRx. All rights reserved.</span>
//           <div className="flex items-center gap-5">
//             <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 animate-fadeInUp stagger-0">
//               <span className="h-1.5 w-1.5 rounded-full bg-success" />
//               All systems operational
//             </span>
//             <span>HIPAA Compliant Platform</span>
//           </div>
//         </div>
//       </footer>

//       {/* Floating circular FAQ button */}
//       <button
//         onClick={() => setIsFaqOpen(true)}
//         aria-label="Open FAQs"
//         className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-zinc-100 to-zinc-300 text-background shadow-[0_10px_30px_-8px_rgba(0,0,0,0.5)] ring-1 ring-white/10 transition-transform hover:scale-110 active:scale-95 animate-fadeInUp"
//       >
//         <HelpCircle className="h-7 w-7" />
//         <span className="absolute inset-0 rounded-full ring-2 ring-white/20 animate-ping opacity-40" />
//       </button>

//       {/* FAQ Modal */}
//       {isFaqOpen && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeInUp"
//           onClick={() => setIsFaqOpen(false)}
//         >
//           <div
//             className="relative w-full max-w-2xl rounded-2xl border border-border bg-surface p-7 shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={() => setIsFaqOpen(false)}
//               aria-label="Close FAQs"
//               className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-border bg-surface-2 text-muted-foreground hover:text-foreground transition-colors"
//             >
//               <X className="h-4 w-4" />
//             </button>
//             <div className="flex items-center gap-3">
//               <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-zinc-100 to-zinc-300 text-background">
//                 <HelpCircle className="h-5 w-5" />
//               </div>
//               <div>
//                 <h3 className="text-xl font-semibold tracking-tight">
//                   Frequently Asked Questions
//                 </h3>
//                 <p className="text-xs text-muted-foreground">
//                   Quick answers about AuditProRx
//                 </p>
//               </div>
//             </div>

//             <div className="no-scrollbar mt-6 max-h-[70vh] space-y-2 overflow-y-auto">
//               {faqs.map((f, idx) => {
//                 const open = openFaqIdx === idx;
//                 return (
//                   <div
//                     key={f.q}
//                     className="rounded-lg border border-border bg-surface-2/40"
//                   >
//                     <button
//                       onClick={() => setOpenFaqIdx(open ? null : idx)}
//                       className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium"
//                     >
//                       <span>{f.q}</span>
//                       <ChevronDown
//                         className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
//                       />
//                     </button>
//                     {open && (
//                       <div className="px-4 pb-4 text-sm text-muted-foreground animate-fadeInUp">
//                         {f.a}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import type { Metadata } from "next";
import HomeClient from "./HomeClient";

const SITE_URL = "https://www.auditprorx.com";
const TITLE = "Pharmacy Audit Software for Independent Pharmacies | AuditProRx";
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
        text: "No. AuditProRx is a month-to-month subscription with no long-term contract. The Professional plan is $99 per month and includes a 14-day full-access free trial.",
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
