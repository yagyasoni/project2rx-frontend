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
// } from "lucide-react";

// import { useEffect, useState } from "react";
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
//       { name: "Audit Reports", price: "$199" },
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
//       "Audit reports",
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
// `;

// const Pill = ({ children }: { children: React.ReactNode }) => (
//   <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs tracking-wider text-muted-foreground uppercase animate-fadeInUp stagger-0">
//     <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70" />
//     {children}
//   </span>
// );

// const Logo = () => (
//   <div className="flex items-center gap-2">
//     {/* <div className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-zinc-100 to-zinc-400">
//       <Asterisk className="h-4 w-4 text-background" strokeWidth={2.5} />
//     </div> */}
//     <span className="text-lg font-semibold tracking-tight">AuditProRx</span>
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
//       <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0B0B0F]/95 shadow-[0_20px_80px_rgba(0,0,0,0.65)] animate-scaleIn">
//         {/* Ambient Glow */}
//         <div className="pointer-events-none absolute inset-0 overflow-hidden">
//           <div className="absolute -top-24 right-[-60px] h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />
//           <div className="absolute bottom-[-100px] left-[-80px] h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl" />
//         </div>

//         {/* Header */}
//         <div className="relative flex items-start justify-between border-b border-white/10 px-6 py-5">
//           <div>
//             <h3 className="text-[22px] font-semibold tracking-tight text-white">
//               Contact Support
//             </h3>

//             <p className="mt-1 text-sm text-zinc-400">
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
//               `Hi Fahaad,

// I would like to get in touch regarding AuditRx.

// Please let me know a convenient time to connect.

// Thank you.`,
//             )}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:border-emerald-500/30 hover:bg-emerald-500/[0.08]"
//           >
//             <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
//               <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-emerald-500/10 blur-2xl" />
//             </div>

//             <div className="relative grid h-14 w-14 place-items-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
//               <Phone className="h-6 w-6 text-emerald-400" />
//             </div>

//             <div className="relative flex-1">
//               <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
//                 WhatsApp
//               </p>

//               <p className="mt-1 text-sm font-semibold text-white">{phone}</p>

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
//               "AuditRx Inquiry",
//             )}&body=${encodeURIComponent(
//               `Hi Fahaad,

// I wanted to get in touch regarding AuditRx and had a few questions.

// Looking forward to your response.

// Best regards,`,
//             )}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:border-blue-500/30 hover:bg-blue-500/[0.08]"
//           >
//             <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
//               <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />
//             </div>

//             <div className="relative grid h-14 w-14 place-items-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
//               <FileText className="h-6 w-6 text-blue-400" />
//             </div>

//             <div className="relative flex-1">
//               <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
//                 Gmail
//               </p>

//               <p className="mt-1 text-sm font-semibold text-white">{email}</p>

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
//           <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
//             <p className="text-center text-xs leading-relaxed text-zinc-400">
//               Typically responds within a few business hours.
//             </p>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="relative border-t border-white/10 p-6">
//           <button
//             onClick={onClose}
//             className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.01] hover:bg-zinc-200 active:scale-[0.99]"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     </div>
//   );

//   // return (
//   //   <div className="mt-12 fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
//   //     <div className="bg-gradient-to-br from-surface to-surface-2 border border-border/50 rounded-3xl shadow-2xl max-w-md w-full animate-scaleIn overflow-hidden">
//   //       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none" />

//   //       <div className="relative flex items-center justify-between p-6 border-b border-border/30">
//   //         <div>
//   //           <h3 className="text-2xl font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
//   //             Get in Touch
//   //           </h3>
//   //           <p className="text-xs text-muted-foreground mt-1">
//   //             We are here to help
//   //           </p>
//   //         </div>
//   //         <button
//   //           onClick={onClose}
//   //           className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface transition-all duration-200 text-muted-foreground hover:text-foreground"
//   //         >
//   //           <X className="h-5 w-5" />
//   //         </button>
//   //       </div>

//   //       <div className="relative p-8 space-y-6">
//   //         <div className="group relative">
//   //           <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//   //           <div className="relative flex items-center gap-4 p-5 rounded-2xl border border-border/30 hover:border-border/60 transition-all duration-300 bg-surface/50 backdrop-blur-sm cursor-pointer group">
//   //             <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20 group-hover:border-blue-500/40 transition-all">
//   //               <Phone className="h-5 w-5 text-blue-400" />
//   //             </div>
//   //             <div className="flex-1">
//   //               <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
//   //                 Phone
//   //               </div>
//   //               <a
//   //                 href={`tel:${phone}`}
//   //                 onClick={() => copyToClipboard(phone, "phone")}
//   //                 className="text-sm font-semibold text-foreground mt-1 block group-hover:text-blue-400 transition-colors"
//   //               >
//   //                 {phone}
//   //               </a>
//   //             </div>
//   //             <div className="opacity-0 group-hover:opacity-100 transition-opacity">
//   //               <svg
//   //                 className="w-4 h-4 text-muted-foreground"
//   //                 fill="none"
//   //                 stroke="currentColor"
//   //                 viewBox="0 0 24 24"
//   //               >
//   //                 <path
//   //                   strokeLinecap="round"
//   //                   strokeLinejoin="round"
//   //                   strokeWidth={2}
//   //                   d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
//   //                 />
//   //               </svg>
//   //             </div>
//   //           </div>
//   //         </div>

//   //         <div className="group relative">
//   //           <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
//   //           <div className="relative flex items-center gap-4 p-5 rounded-2xl border border-border/30 hover:border-border/60 transition-all duration-300 bg-surface/50 backdrop-blur-sm cursor-pointer group">
//   //             <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 group-hover:border-amber-500/40 transition-all">
//   //               <FileText className="h-5 w-5 text-amber-400" />
//   //             </div>
//   //             <div className="flex-1">
//   //               <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
//   //                 Email
//   //               </div>
//   //               <a
//   //                 href={`mailto:${email}`}
//   //                 onClick={() => copyToClipboard(email, "email")}
//   //                 className="text-sm font-semibold text-foreground mt-1 block group-hover:text-amber-400 transition-colors"
//   //               >
//   //                 {email}
//   //               </a>
//   //             </div>
//   //             <div className="opacity-0 group-hover:opacity-100 transition-opacity">
//   //               <svg
//   //                 className="w-4 h-4 text-muted-foreground"
//   //                 fill="none"
//   //                 stroke="currentColor"
//   //                 viewBox="0 0 24 24"
//   //               >
//   //                 <path
//   //                   strokeLinecap="round"
//   //                   strokeLinejoin="round"
//   //                   strokeWidth={2}
//   //                   d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
//   //                 />
//   //               </svg>
//   //             </div>
//   //           </div>
//   //         </div>

//   //         <div className="pt-4 px-4 py-3 rounded-xl bg-muted/20 border border-border/20">
//   //           <p className="text-xs text-muted-foreground leading-relaxed">
//   //             Click on any contact method to copy or connect directly. Our team
//   //             responds within 2-4 hours on business days.
//   //           </p>
//   //         </div>
//   //       </div>

//   //       <div className="relative border-t border-border/30 p-6">
//   //         <button
//   //           onClick={onClose}
//   //           className="w-full rounded-xl bg-gradient-to-r from-zinc-100 to-zinc-200 hover:from-white hover:to-zinc-100 text-background px-4 py-3 text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
//   //         >
//   //           Done
//   //         </button>
//   //       </div>
//   //     </div>
//   //   </div>
//   // );
// };

// export default function Index() {
//   const currentYear = new Date().getFullYear();
//   const [expandedAddOns, setExpandedAddOns] = useState<{
//     [key: string]: boolean;
//   }>({
//     base: false,
//   });
//   const [isContactModalOpen, setIsContactModalOpen] = useState(false);
//   const contactEmail = "drugdroprx@gmail.com";
//   const contactPhone = "+1 (551) 229-6466"; // Replace with actual phone number

//   const scheduleConsultation = () => {
//     window.open(
//       "https://calendar.google.com/calendar/u/0/r?action=TEMPLATE&text=Pharmacy%20Consultation%20with%20AuditProRx&details=Schedule%20a%20consultation%20to%20learn%20how%20AuditProRx%20can%20protect%20your%20pharmacy%20revenue.",
//       "_blank",
//     );
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
//           <Pill>Enterprise Pharmacy Operations Platform</Pill>
//           <h1 className="mx-auto mt-8 max-w-5xl text-6xl font-semibold leading-[1.05] tracking-tight md:text-7xl animate-fadeInUp stagger-1">
//             Precision Audit Intelligence
//             <br />
//             <span className="text-muted-foreground/70 animate-fadeInUp stagger-2">
//               for Modern Pharmacies
//             </span>
//           </h1>
//           <p className="mx-auto mt-7 max-w-xl text-[15px] leading-relaxed text-muted-foreground animate-fadeInUp stagger-3">
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
//             <span>Trusted by 10+ pharmacy groups</span>
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
//       <section className="border-b border-border/60">
//         <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-border md:grid-cols-4">
//           {[
//             ["100000", "+", "Audit Recoupments Saved"],
//             ["100", "+", "Audits Generated"],
//             ["10", "+", "Active Pharmacy Groups"],
//             ["100", "%", "HIPAA Compliant"],
//           ].map(([v, s, l], idx) => (
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
//           <div className="mt-14 grid gap-5 md:grid-cols-3">
//             {[
//               [
//                 Shield,
//                 "Audit Protection",
//                 "Comprehensive audit defense with automated documentation, response generation, and real-time tracking built for pharmacy operations.",
//               ],
//               [
//                 Zap,
//                 "Accelerated Processing",
//                 "Process complex audits in minutes. Our intelligent engine handles documentation, cross-referencing, and deadline management automatically.",
//               ],
//               [
//                 BarChart3,
//                 "Smart Analytics",
//                 "Real-time dashboards exposing audit trends, risk exposure areas, and revenue savings opportunities across your entire portfolio.",
//               ],
//               [
//                 FileText,
//                 "Auto Documentation",
//                 "Generate fully compliant documentation for every audit response — standardized, audit-ready, and tailored to payer requirements.",
//               ],
//               [
//                 Clock,
//                 "Deadline Intelligence",
//                 "Never miss a critical deadline. Automated reminders, priority queuing, and intelligent progress tracking keep every audit on track.",
//               ],
//               [
//                 Lock,
//                 "HIPAA-Grade Security",
//                 "Enterprise security architecture ensuring all patient and pharmacy data remains encrypted, compliant, and fully protected.",
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

//                 <button
//                   className={`${p.highlighted ? "mt-7" : "mt-12"} rounded-lg px-4 py-3 text-sm font-medium transition-all animate-fadeInUp ${p.highlighted ? "bg-gradient-to-b from-zinc-100 to-zinc-300 text-background hover:from-white" : "border border-border text-foreground hover:bg-surface-2"}`}
//                   style={{ animationDelay: `${0.6 + idx * 0.15}s` }}
//                 >
//                   {p.highlighted ? "Get Full Access" : "Get Started"}
//                 </button>
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
//         <div className="mx-auto max-w-5xl px-7 text-center">
//           <Pill>Get Started</Pill>
//           <h2 className="mt-6 text-5xl font-semibold tracking-tight animate-fadeInUp stagger-1">
//             Ready to Protect Your Pharmacy Revenue?
//           </h2>
//           <p className="mx-auto mt-5 max-w-xl text-muted-foreground animate-fadeInUp stagger-2">
//             Join 10+ pharmacy groups using AuditProRx to automate audits,
//             protect revenue, and gain competitive intelligence. Schedule a
//             personalized walkthrough with our team.
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
//               {[Twitter, Linkedin, Github].map((I, i) => (
//                 <a
//                   key={i}
//                   href="#"
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
//     </div>
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
import { createCheckoutSession } from "@/components/checkoutSession";
import { Button } from "@/components/ui/button";

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

export default function Index() {
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

  // const handleSubscribe = async () => {
  //   const data = await createCheckoutSession(1, "test@example.com");
  //   window.location.href = data.url;
  // };

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
    <main
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
              Built for Modern Pharmacy Operations
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
            className="font-display text-5xl sm:text-5xl md:text-5xl lg:text-[4.47rem] font-bold leading-[0.95] tracking-tight mb-6 max-w-5xl mx-auto"
            style={{ color: textLight }}
          >
            Precision Audit Workflows for{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, hsl(0 0% 100%), hsl(210 15% 70%), hsl(0 0% 70%))",
              }}
            >
              High-Volume
            </span>{" "}
            Pharmacies
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "hsl(0 0% 75%)" }}
          >
            Automate audit workflows, eliminate manual errors, and protect
            revenue with a platform designed specifically for pharmacy teams.
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
            <span>Trusted by 10+ pharmacies</span>
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

          <div className="grid md:grid-cols-1 gap-6 max-w-5xl mx-auto">
            {[
              // {
              //   name: "Starter",
              //   price: "Free",
              //   period: "/mo",
              //   desc: "Start with core audit workflows",
              //   features: [
              //     "Up to 2 audits/mo",
              //     "Basic audit insights",
              //     "Email support",
              //     "14-day free trial",
              //   ],
              //   highlighted: false,
              // },
              {
                name: "Professional",
                price: "$99",
                period: "/month",
                desc: "Comprehensive audit and inventory intelligence for pharmacy operations",
                features: [
                  "7-day full access free trial",
                  "Unlimited inventory & supplier audits",
                  // "Advanced analytics and reporting dashboards",
                  "Real-time data validation and insights",
                  "Priority email support",
                  "Secure export and compliance-ready reports",
                  "Seamless subscription management via Stripe",
                ],
                highlighted: true,
              },
              // {
              //   name: "Enterprise",
              //   price: "Custom",
              //   period: "",
              //   desc: "Scalable for complex operations",
              //   features: [
              //     "Everything in Professional",
              //     "Dedicated support",
              //     "Custom workflows",
              //     "Advanced compliance controls",
              //   ],
              //   highlighted: false,
              // },
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
                  {/* Badge */}
                  {plan.highlighted && (
                    <div
                      className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-semibold"
                      style={{ background: accentColor, color: textDark }}
                    >
                      Most Popular
                    </div>
                  )}

                  {/* HEADER */}
                  <div className="mb-6 text-center">
                    <h3
                      className="font-display text-lg font-semibold"
                      style={{ color: textLight }}
                    >
                      {plan.name}
                    </h3>

                    <p
                      className="text-xs mt-1 max-w-xs mx-auto"
                      style={{ color: "hsl(0 0% 75%)" }}
                    >
                      {plan.desc}
                    </p>
                  </div>

                  {/* PRICE BLOCK */}
                  <div className="mb-6 text-center">
                    <div className="flex items-end justify-center gap-1">
                      <span
                        className="font-display text-4xl font-bold"
                        style={{ color: textLight }}
                      >
                        {plan.price}
                      </span>
                      <span
                        className="text-sm mb-1"
                        style={{ color: "hsl(0 0% 60%)" }}
                      >
                        {plan.period}
                      </span>
                    </div>

                    {/* subtle divider */}
                    <div className="mt-4 h-px w-12 mx-auto bg-white/10" />
                  </div>

                  {/* FEATURES (2-COLUMN GRID) */}
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-4 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm leading-snug"
                        style={{ color: textLight }}
                      >
                        <CheckCircle2
                          className="w-4 h-4 mt-[2px] flex-shrink-0"
                          style={{ color: accentColor }}
                        />
                        <span className="opacity-90">{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="mt-auto">
                    <Button
                      // onClick={handleSubscribe}
                      className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all"
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
                      Start Free Trial
                    </Button>

                    {/* Subtext */}
                    <p
                      className="text-[11px] text-center mt-2 opacity-60"
                      style={{ color: textLight }}
                    >
                      No charges during trial • Cancel anytime
                    </p>
                  </div>
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
                  Join 10+ pharmacies that trust AuditProRx to simplify audits
                  and protect their bottom line.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a
                    href="tel:+15512296466"
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
                Pharmacy audit management platform trusted by 10+ pharmacies
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
    </main>
  );
}
