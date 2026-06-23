// "use client";

// import { useEffect, useRef, useState } from "react";
// import { usePathname } from "next/navigation";

// import axios from "axios";

// import {
//   Mail,
//   AlertTriangle,
//   CheckCircle2,
//   Loader2,
//   ArrowLeft,
//   CreditCard,
//   Lock,
//   Tag,
//   Check,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";

// import { toast } from "sonner";
// import adminApi from "@/lib/adminApi";

// // =========================================
// // PLANS — 3 fixed tiers (single-select)
// // base         → $99  → inventory_reports_access
// // professional → $249 → inventory_reports_access + inventory_view_access
// // full_access  → $499 → all access (drug lookup + leads + everything)
// // =========================================

// const plans = [
//   {
//     id: "base",
//     name: "Base",
//     price: "$99",
//     period: "/month",
//     trial: "14-day free trial with coupon code",
//     description:
//       "Core audit reconciliation and reporting for independent pharmacies.",
//     features: [
//       "Automated audit reconciliation",
//       "Unlimited inventory audits",
//       "Audit-ready report exports",
//       "BIN / PCN / Group lookup",
//       "Step-by-step compliance guide",
//     ],
//     highlighted: false,
//   },
//   {
//     id: "professional",
//     name: "Professional",
//     price: "$249",
//     period: "/month",
//     trial: "14-day free trial with coupon code",
//     badge: "Most Popular",
//     description:
//       "Everything in Base, plus real-time inventory visibility and insights.",
//     features: [
//       "Everything in Base",
//       "Live inventory visibility",
//       "Advanced dispensing insights",
//       "Continuous data sync",
//     ],
//     highlighted: true,
//   },
//   {
//     id: "full_access",
//     name: "Full Access",
//     price: "$499",
//     period: "/month",
//     trial: "14-day free trial with coupon code",
//     badge: "Best Value",
//     savings: "Pays for itself with a single recovered chargeback",
//     valueNote: "All premium modules included — Drug Lookup, Leads",
//     description:
//       "The complete AuditProRx suite — every compliance, lookup, and growth module.",
//     features: [
//       "Everything in Professional",
//       "Full Drug Lookup system",
//       "Pharmacy growth leads",
//       "Priority support",
//     ],
//     highlighted: true,
//   },
// ];

// export default function InactiveAccount() {
//   const pathname = usePathname();

//   const [status, setStatus] = useState<string | null>(null);
//   const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   // Single-select now (no more add-ons)
//   const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

//   const [couponCode, setCouponCode] = useState("");
//   const [codeStatus, setCodeStatus] = useState<{
//     valid: boolean;
//     message: string;
//   } | null>(null);
//   const [checkingCode, setCheckingCode] = useState(false);

//   const [showPlans, setShowPlans] = useState(false);

//   const prevStatusRef = useRef<string | null>(null);
//   const prevPaymentRef = useRef<string | null>(null);

//   // =========================================
//   // FETCH USER + SUB STATUS
//   // =========================================

//   useEffect(() => {
//     const userId = localStorage.getItem("userId");
//     if (!userId) return;

//     const fetchAll = async () => {
//       try {
//         const [userRes, subRes] = await Promise.all([
//           adminApi.get(`/auth/users`),
//           axios.get(
//             `${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/subscription/${userId}`,
//           ),
//         ]);

//         const users = userRes.data?.users || userRes.data;
//         const currentUser = users.find((u: any) => u.id === userId);
//         const newStatus = currentUser?.status || null;

//         const subscription = subRes.data.subscription;

//         // Admin-granted (comped) clients bypass the paywall entirely.
//         // admin_override is an explicit bypass; the individual access flags
//         // cover both Stripe subscribers and partial admin grants.
//         const hasAccess =
//           subscription?.admin_override ||
//           subscription?.inventory_reports_access ||
//           subscription?.inventory_view_access ||
//           subscription?.drug_lookup_access ||
//           subscription?.leads_access ||
//           subscription?.full_access;

//         const newPaymentStatus = hasAccess ? "active" : "no_subscription";

//         if (prevStatusRef.current === null && prevPaymentRef.current === null) {
//           prevStatusRef.current = newStatus;
//           prevPaymentRef.current = newPaymentStatus;
//           setStatus(newStatus);
//           setPaymentStatus(newPaymentStatus);
//           setLoading(false);
//           return;
//         }

//         if (
//           prevStatusRef.current !== newStatus ||
//           prevPaymentRef.current !== newPaymentStatus
//         ) {
//           window.location.reload();
//         }

//         prevStatusRef.current = newStatus;
//         prevPaymentRef.current = newPaymentStatus;
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAll();
//     const interval = setInterval(fetchAll, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   // =========================================
//   // PLAN SELECT (single-select)
//   // =========================================

//   const selectPlan = (planId: string) => {
//     setSelectedPlan((prev) => (prev === planId ? null : planId));
//   };

//   // =========================================
//   // APPLY TRIAL CODE (live validation)
//   // =========================================

//   const applyCode = async () => {
//     if (!couponCode.trim()) {
//       setCodeStatus(null);
//       return;
//     }

//     try {
//       setCheckingCode(true);
//       const userId = localStorage.getItem("userId");

//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/validate-trial-code`,
//         { userId, code: couponCode },
//       );

//       if (res.data.valid) {
//         setCodeStatus({ valid: true, message: res.data.message });
//         toast.success(res.data.message);
//       } else {
//         setCodeStatus({ valid: false, message: res.data.reason });
//         toast.error(res.data.reason);
//       }
//     } catch (err: any) {
//       const msg = err?.response?.data?.error || "Could not validate code";
//       setCodeStatus({ valid: false, message: msg });
//       toast.error(msg);
//     } finally {
//       setCheckingCode(false);
//     }
//   };

//   // =========================================
//   // PAYMENT
//   // =========================================

//   const handleCheckout = async () => {
//     if (!selectedPlan) {
//       toast.error("Please select a subscription plan");
//       return;
//     }

//     try {
//       const userId = localStorage.getItem("userId");
//       const email = localStorage.getItem("userEmail");

//       const res = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/create-checkout-session`,
//         {
//           userId,
//           email,
//           plan: selectedPlan, // single string — matches new backend
//           trialCode: couponCode || null, // grants the trial if valid
//         },
//       );

//       toast.success("Redirecting to Stripe...");
//       window.location.href = res.data.url;
//     } catch (err: any) {
//       console.error(err);
//       toast.error(
//         err?.response?.data?.error || "Failed to create checkout session",
//       );
//     }
//   };

//   // =========================================
//   // RENEW
//   // =========================================

//   const renewSubscription = async () => {
//     try {
//       const userId = localStorage.getItem("userId");
//       await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/renew-subscription`,
//         { userId },
//       );
//       toast.success("Subscription renewed");
//       window.location.reload();
//     } catch (err) {
//       toast.error("Failed to renew subscription");
//     }
//   };

//   // =========================================
//   // ALLOW ROUTES
//   // =========================================

//   if (
//     pathname === "/" ||
//     pathname.startsWith("/privacy-policy") ||
//     pathname.startsWith("/terms-of-service") ||
//     pathname.startsWith("/cancellation-policy") ||
//     pathname.startsWith("/auth") ||
//     pathname.startsWith("/admin") ||
//     pathname.startsWith("/admin-dashboard") ||
//     pathname.startsWith("/info-page") ||
//     pathname.startsWith("/agreements") ||
//     pathname.startsWith("/feedbacks") ||
//     pathname.startsWith("/publishing") ||
//     pathname.startsWith("/supplier-mappings") ||
//     pathname.startsWith("/master-sheet") ||
//     pathname.startsWith("/master-sheet-queue") ||
//     pathname.startsWith("/ndc-sheet") ||
//     pathname.startsWith("/report-listings") ||
//     pathname.startsWith("/support") ||
//     pathname.startsWith("/company")
//   ) {
//     return null;
//   }

//   const hasPlatformAccess = paymentStatus === "active";

//   if (hasPlatformAccess) {
//     return null;
//   }

//   // =========================================
//   // MESSAGE
//   // =========================================

//   let title = "Subscription Required";
//   let message = "Select a subscription package to continue.";

//   if (status === "inactive") {
//     title = "Account Inactive";
//     message = "Your account is currently inactive. Please contact support.";
//   }

//   if (paymentStatus === "past_due") {
//     title = "Payment Required";
//     message = "Your payment is currently past due.";
//   }

//   if (paymentStatus === "canceled") {
//     title = "Subscription Canceled";
//     message = "Renew your subscription to continue.";
//   }

//   if (loading) {
//     return (
//       <div className="fixed inset-0 z-[13000] bg-black/70 flex items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-white" />
//       </div>
//     );
//   }

//   // =========================================
//   // FIRST POPUP
//   // =========================================

//   if (!showPlans) {
//     return (
//       <div className="fixed inset-0 z-[13000] bg-black/55 backdrop-blur-sm flex items-center justify-center px-4">
//         <div className="w-full max-w-md border border-zinc-200 bg-white rounded-lg shadow-2xl p-7">
//           <div className="flex items-start gap-4">
//             <div className="h-11 w-11 rounded-md bg-red-50 flex items-center justify-center shrink-0">
//               <AlertTriangle className="h-5 w-5 text-red-500" />
//             </div>

//             <div className="flex-1">
//               <h2 className="text-[20px] font-semibold text-zinc-900">
//                 {title}
//               </h2>
//               <p className="mt-1 text-sm text-zinc-500 leading-relaxed">
//                 {message}
//               </p>
//             </div>
//           </div>

//           <div className="mt-6 flex flex-col gap-2">
//             {(paymentStatus === "no_subscription" ||
//               paymentStatus === "inactive" ||
//               paymentStatus === "past_due") &&
//               status === "active" && (
//                 <Button
//                   onClick={() => setShowPlans(true)}
//                   className="h-11 rounded-md text-sm font-medium"
//                 >
//                   Proceed with Payment
//                 </Button>
//               )}

//             {paymentStatus === "canceled" && status === "active" && (
//               <Button
//                 onClick={renewSubscription}
//                 className="h-11 rounded-md text-sm font-medium"
//               >
//                 Renew Subscription
//               </Button>
//             )}

//             <Button
//               variant="outline"
//               className="h-11 rounded-md border-zinc-300"
//               onClick={() => {
//                 window.open(
//                   "https://mail.google.com/mail/?view=cm&fs=1&to=drugdroprx@gmail.com",
//                   "_blank",
//                 );
//               }}
//             >
//               <Mail className="h-4 w-4 mr-2" />
//               Contact Support
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // =========================================
//   // PLAN SELECTION SCREEN
//   // =========================================

//   const accentColor = "hsl(210 15% 60%)";
//   const accentLight = "hsl(210 15% 80%)";
//   const textLight = "hsl(0 0% 95%)";
//   const textDark = "hsl(0 0% 5%)";
//   const color262626 = "hsl(0 0% 15%)";
//   const color0D0D0D = "hsl(0 0% 5%)";

//   return (
//     <div
//       className="fixed inset-0 z-[13000] overflow-auto"
//       style={{
//         background: `linear-gradient(180deg, ${color0D0D0D} 0%, ${color262626} 50%, ${color0D0D0D} 100%)`,
//       }}
//     >
//       <div className="relative min-h-screen py-10 px-4">
//         <div className="max-w-7xl mx-auto">
//           {/* HEADER */}
//           <div className="text-center mb-8">
//             <span
//               className="text-[11px] uppercase tracking-[0.22em] font-semibold"
//               style={{ color: accentColor }}
//             >
//               Subscription Plans
//             </span>

//             <h2
//               className="text-3xl md:text-4xl font-bold mt-3"
//               style={{ color: textLight }}
//             >
//               Choose Your Subscription
//             </h2>

//             <p
//               className="mt-2 text-sm max-w-lg mx-auto"
//               style={{ color: "hsl(0 0% 72%)" }}
//             >
//               Unlock premium pharmacy audit workflows and platform access.
//             </p>
//           </div>

//           {/* THREE PLAN CARDS */}
//           <div className="mt-14 grid items-stretch gap-6 md:grid-cols-3 max-w-8xl mx-auto">
//             {plans.map((plan, idx) => {
//               const active = selectedPlan === plan.id;

//               return (
//                 <div
//                   key={plan.id}
//                   onClick={() => selectPlan(plan.id)}
//                   className={`relative flex cursor-pointer flex-col rounded-2xl border p-7 text-left animate-fadeInUp transition-all duration-300 ease-out ${
//                     active
//                       ? "border-zinc-600 bg-gradient-to-b from-zinc-900 to-black ring-1 ring-zinc-500/50 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.75)] hover:-translate-y-1 hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)]"
//                       : "border-zinc-800 bg-surface hover:-translate-y-1 hover:border-zinc-600 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.55)]"
//                   }`}
//                   style={{ animationDelay: `${0.1 + idx * 0.15}s` }}
//                 >
//                   {/* Premium Top Accent */}
//                   <div
//                     className={`absolute inset-x-0 top-0 h-px ${
//                       active
//                         ? "bg-gradient-to-r from-transparent via-zinc-300 to-transparent"
//                         : "bg-gradient-to-r from-transparent via-zinc-700 to-transparent"
//                     }`}
//                   />

//                   {/* Static "Most Popular" badge — absolute, so it never affects alignment */}
//                   {plan.highlighted && (
//                     <span className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 rounded-full border border-zinc-300/20 bg-gradient-to-b from-zinc-100 to-zinc-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-black shadow-lg">
//                       {(plan as any).badge ?? "Most Popular"}
//                     </span>
//                   )}

//                   {/* Name */}
//                   <div
//                     className="flex items-center gap-2 animate-fadeInUp"
//                     style={{ animationDelay: `${0.15 + idx * 0.15}s` }}
//                   >
//                     <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400 transition-colors duration-300">
//                       {plan.name}
//                     </span>
//                   </div>

//                   {/* Price — uniform text-4xl on every card so the row lines up */}
//                   <div
//                     className="mt-5 flex items-baseline gap-1 animate-fadeInUp"
//                     style={{ animationDelay: `${0.2 + idx * 0.15}s` }}
//                   >
//                     <span className="text-4xl font-semibold tracking-tight">
//                       {plan.price}
//                     </span>
//                     <span className="text-sm text-muted-foreground">
//                       {plan.period}
//                     </span>
//                   </div>

//                   {/* Optional trial badge — only renders if the plan defines it */}
//                   {(plan as any).trial && (
//                     <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold text-sky-300">
//                       {(plan as any).trial}
//                     </span>
//                   )}

//                   {/* Description — min-height reserves space so feature lists start at the same line */}
//                   <p
//                     className="mt-3 min-h-[40px] text-sm leading-relaxed text-muted-foreground animate-fadeInUp"
//                     style={{ animationDelay: `${0.25 + idx * 0.15}s` }}
//                   >
//                     {plan.description}
//                   </p>

//                   {/* Optional value note — only renders if the plan defines it */}
//                   {(plan as any).valueNote && (
//                     <p className="mt-2 text-xs leading-relaxed text-emerald-300/80 italic">
//                       {(plan as any).valueNote}
//                     </p>
//                   )}

//                   {/* Features */}
//                   <ul className="mt-6 space-y-3 text-sm">
//                     {plan.features.map((feature, fIdx) => (
//                       <li
//                         key={feature}
//                         className="flex items-start gap-2.5 animate-fadeInUp"
//                         style={{
//                           animationDelay: `${0.3 + fIdx * 0.05 + idx * 0.15}s`,
//                         }}
//                       >
//                         <span
//                           className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full transition-all duration-300 ${
//                             active ? "bg-emerald-500/15" : "bg-zinc-800"
//                           }`}
//                         >
//                           <Check className="h-3.5 w-3.5 text-success" />
//                         </span>
//                         <span
//                           className={
//                             fIdx === 0
//                               ? "font-semibold text-zinc-200 transition-colors duration-300"
//                               : "text-foreground/90"
//                           }
//                         >
//                           {feature}
//                         </span>
//                       </li>
//                     ))}
//                   </ul>

//                   {/* Button — mt-auto pins it to the bottom of every card, so all three align */}
//                   <Button
//                     type="button"
//                     className={`${plan.price === "$499" ? "mt-6" : "mt-4"} w-full rounded-lg px-4 py-6 text-sm font-medium transition-all duration-300 animate-fadeInUp ${
//                       active
//                         ? "bg-gradient-to-b from-zinc-100 to-zinc-300 text-black shadow-md hover:from-white hover:to-zinc-200 hover:shadow-xl"
//                         : "border border-zinc-700 bg-transparent text-foreground hover:border-zinc-500 hover:bg-zinc-900/50"
//                     }`}
//                     style={{ animationDelay: `${0.6 + idx * 0.15}s` }}
//                   >
//                     {active ? "Selected Plan" : "Choose Plan"}
//                   </Button>
//                 </div>
//               );
//             })}
//           </div>

//           {/* ACTION CARD */}
//           <div className="max-w-md mx-auto mt-10">
//             <div
//               className="border rounded-xl p-5 flex flex-col gap-5"
//               style={{
//                 background: `linear-gradient(180deg, ${color262626}, ${color0D0D0D})`,
//                 borderColor: "hsl(0 0% 18%)",
//               }}
//             >
//               <div className="flex items-center gap-3">
//                 <div
//                   className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
//                   style={{ background: "hsl(0 0% 14%)" }}
//                 >
//                   <Lock
//                     className="h-4 w-4"
//                     style={{ color: "hsl(0 0% 72%)" }}
//                   />
//                 </div>

//                 <div>
//                   <p
//                     className="text-[15px] font-semibold leading-none mb-1"
//                     style={{ color: textLight }}
//                   >
//                     Complete checkout
//                   </p>
//                   <p
//                     className="text-[12px] leading-none"
//                     style={{ color: "hsl(0 0% 52%)" }}
//                   >
//                     Review your plan and confirm
//                   </p>
//                 </div>
//               </div>

//               <div style={{ height: "0.5px", background: "hsl(0 0% 20%)" }} />

//               {/* TRIAL / PROMO CODE */}
//               <div className="flex flex-col gap-2">
//                 <label
//                   className="text-[12px] font-medium flex items-center gap-1.5"
//                   style={{ color: "hsl(0 0% 72%)" }}
//                 >
//                   <Tag className="h-3.5 w-3.5" />
//                   Have a code?
//                 </label>

//                 <div className="flex gap-2">
//                   <input
//                     value={couponCode}
//                     onChange={(e) => {
//                       setCouponCode(e.target.value.toUpperCase());
//                       setCodeStatus(null);
//                     }}
//                     placeholder="Enter code"
//                     className="flex-1 h-10 rounded-lg px-3 text-sm outline-none"
//                     style={{
//                       background: "hsl(0 0% 12%)",
//                       border: "1px solid hsl(0 0% 24%)",
//                       color: textLight,
//                     }}
//                   />
//                   <Button
//                     type="button"
//                     onClick={applyCode}
//                     disabled={checkingCode || !couponCode.trim()}
//                     className="h-10 rounded-lg text-sm font-semibold px-4"
//                     style={{
//                       background: "hsl(0 0% 18%)",
//                       border: "1px solid hsl(0 0% 28%)",
//                       color: textLight,
//                     }}
//                   >
//                     {checkingCode ? (
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                     ) : (
//                       "Apply"
//                     )}
//                   </Button>
//                 </div>

//                 {codeStatus && (
//                   <p
//                     className="text-[12px] flex items-center gap-1.5"
//                     style={{
//                       color: codeStatus.valid
//                         ? "hsl(142 60% 55%)"
//                         : "hsl(0 70% 60%)",
//                     }}
//                   >
//                     {codeStatus.valid && (
//                       <CheckCircle2 className="h-3.5 w-3.5" />
//                     )}
//                     {codeStatus.message}
//                   </p>
//                 )}
//               </div>

//               <div style={{ height: "0.5px", background: "hsl(0 0% 20%)" }} />

//               <div className="flex flex-col gap-2">
//                 {(paymentStatus === "no_subscription" ||
//                   paymentStatus === "inactive" ||
//                   paymentStatus === "past_due") &&
//                   status === "active" && (
//                     <Button
//                       onClick={handleCheckout}
//                       disabled={!selectedPlan}
//                       className="h-10 rounded-lg text-sm font-semibold flex items-center gap-2"
//                       style={{
//                         background: `linear-gradient(135deg, ${textLight}, ${accentLight})`,
//                         color: textDark,
//                       }}
//                     >
//                       <CreditCard className="h-4 w-4" />
//                       Continue payment
//                     </Button>
//                   )}

//                 <Button
//                   variant="outline"
//                   className="h-10 rounded-lg text-sm flex items-center gap-2"
//                   style={{
//                     borderColor: "hsl(0 0% 26%)",
//                     color: textLight,
//                     background: "transparent",
//                   }}
//                   onClick={() => setShowPlans(false)}
//                 >
//                   <ArrowLeft className="h-4 w-4" />
//                   Back
//                 </Button>

//                 <Button
//                   variant="ghost"
//                   className="h-10 rounded-lg text-sm flex items-center gap-2 hover:text-black/80 text-white"
//                   onClick={() => {
//                     window.open(
//                       "https://mail.google.com/mail/?view=cm&fs=1&to=drugdroprx@gmail.com",
//                       "_blank",
//                     );
//                   }}
//                 >
//                   <Mail className="h-4 w-4" />
//                   Contact support
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import axios from "axios";

import {
  Mail,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  CreditCard,
  Lock,
  Tag,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";
import adminApi from "@/lib/adminApi";

// =========================================
// PLANS — 3 fixed tiers (single-select)
// base         → $99  → inventory_reports_access
// professional → $249 → inventory_reports_access + inventory_view_access
// full_access  → $499 → all access (drug lookup + leads + everything)
// =========================================

const plans = [
  {
    id: "base",
    name: "Base",
    price: "$99",
    period: "/month",
    trial: "14-day free trial with coupon code",
    description:
      "Core audit reconciliation and reporting for independent pharmacies.",
    features: [
      "Automated audit reconciliation",
      "Unlimited inventory audits",
      "Audit-ready report exports",
      "BIN / PCN / Group lookup",
      "Step-by-step compliance guide",
    ],
    highlighted: false,
  },
  {
    id: "professional",
    name: "Professional",
    price: "$249",
    period: "/month",
    trial: "14-day free trial with coupon code",
    badge: "Most Popular",
    description:
      "Everything in Base, plus real-time inventory visibility and insights.",
    features: [
      "Everything in Base",
      "Live inventory visibility",
      "Multi-group pharmacy reporting",
      "Advanced dispensing insights",
      "Continuous data sync",
    ],
    highlighted: true,
  },
  {
    id: "full_access",
    name: "Full Access",
    price: "$499",
    period: "/month",
    trial: "14-day free trial with coupon code",
    badge: "Best Value",
    savings: "Pays for itself with a single recovered chargeback",
    valueNote: "All premium modules included — Drug Lookup, Leads",
    description:
      "The complete AuditProRx suite — every compliance, lookup, and growth module.",
    features: [
      "Everything in Professional",
      "Full Drug Lookup system",
      "Pharmacy growth leads",
      "Priority support",
    ],
    highlighted: true,
  },
];

export default function InactiveAccount() {
  const pathname = usePathname();

  const [status, setStatus] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Single-select now (no more add-ons)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const [couponCode, setCouponCode] = useState("");
  const [codeStatus, setCodeStatus] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);
  const [checkingCode, setCheckingCode] = useState(false);

  const [showPlans, setShowPlans] = useState(false);

  const prevStatusRef = useRef<string | null>(null);
  const prevPaymentRef = useRef<string | null>(null);

  // =========================================
  // FETCH USER + SUB STATUS
  // =========================================

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const fetchAll = async () => {
      try {
        const [userRes, subRes] = await Promise.all([
          adminApi.get(`/auth/users`),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/subscription/${userId}`,
          ),
        ]);

        const users = userRes.data?.users || userRes.data;
        const currentUser = users.find((u: any) => u.id === userId);
        const newStatus = currentUser?.status || null;

        const subscription = subRes.data.subscription;

        // Access is driven by the ACTUAL access flags only.
        // IMPORTANT: admin_override is intentionally NOT treated as access on
        // its own. The backend's grant-access always sets admin_override=true
        // (and status='active') on conflict — even when every access flag is
        // being set to false during a revoke. If we keyed off admin_override
        // here, a revoked grant would leave admin_override=true with all flags
        // false, and the paywall would stay hidden ("admin access granted" but
        // no popup). Keying off the flags means a revoked grant (all flags
        // false) correctly shows the paywall again.
        const hasAccess =
          subscription?.inventory_reports_access ||
          subscription?.inventory_view_access ||
          subscription?.drug_lookup_access ||
          subscription?.leads_access ||
          subscription?.full_access;

        const newPaymentStatus = hasAccess ? "active" : "no_subscription";

        if (prevStatusRef.current === null && prevPaymentRef.current === null) {
          prevStatusRef.current = newStatus;
          prevPaymentRef.current = newPaymentStatus;
          setStatus(newStatus);
          setPaymentStatus(newPaymentStatus);
          setLoading(false);
          return;
        }

        if (
          prevStatusRef.current !== newStatus ||
          prevPaymentRef.current !== newPaymentStatus
        ) {
          window.location.reload();
        }

        prevStatusRef.current = newStatus;
        prevPaymentRef.current = newPaymentStatus;
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
    const interval = setInterval(fetchAll, 5000);
    return () => clearInterval(interval);
  }, []);

  // =========================================
  // PLAN SELECT (single-select)
  // =========================================

  const selectPlan = (planId: string) => {
    setSelectedPlan((prev) => (prev === planId ? null : planId));
  };

  // =========================================
  // APPLY TRIAL CODE (live validation)
  // =========================================

  const applyCode = async () => {
    if (!couponCode.trim()) {
      setCodeStatus(null);
      return;
    }

    try {
      setCheckingCode(true);
      const userId = localStorage.getItem("userId");

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/validate-trial-code`,
        { userId, code: couponCode },
      );

      if (res.data.valid) {
        setCodeStatus({ valid: true, message: res.data.message });
        toast.success(res.data.message);
      } else {
        setCodeStatus({ valid: false, message: res.data.reason });
        toast.error(res.data.reason);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.error || "Could not validate code";
      setCodeStatus({ valid: false, message: msg });
      toast.error(msg);
    } finally {
      setCheckingCode(false);
    }
  };

  // =========================================
  // PAYMENT
  // =========================================

  const handleCheckout = async () => {
    if (!selectedPlan) {
      toast.error("Please select a subscription plan");
      return;
    }

    try {
      const userId = localStorage.getItem("userId");
      const email = localStorage.getItem("userEmail");

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/create-checkout-session`,
        {
          userId,
          email,
          plan: selectedPlan, // single string — matches new backend
          trialCode: couponCode || null, // grants the trial if valid
        },
      );

      toast.success("Redirecting to Stripe...");
      window.location.href = res.data.url;
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.response?.data?.error || "Failed to create checkout session",
      );
    }
  };

  // =========================================
  // RENEW
  // =========================================

  const renewSubscription = async () => {
    try {
      const userId = localStorage.getItem("userId");
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/renew-subscription`,
        { userId },
      );
      toast.success("Subscription renewed");
      window.location.reload();
    } catch (err) {
      toast.error("Failed to renew subscription");
    }
  };

  // =========================================
  // ALLOW ROUTES
  // =========================================

  if (
    pathname === "/" ||
    pathname.startsWith("/privacy-policy") ||
    pathname.startsWith("/terms-of-service") ||
    pathname.startsWith("/cancellation-policy") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/admin-dashboard") ||
    pathname.startsWith("/info-page") ||
    pathname.startsWith("/agreements") ||
    pathname.startsWith("/feedbacks") ||
    pathname.startsWith("/publishing") ||
    pathname.startsWith("/supplier-mappings") ||
    pathname.startsWith("/master-sheet") ||
    pathname.startsWith("/master-sheet-queue") ||
    pathname.startsWith("/ndc-sheet") ||
    pathname.startsWith("/report-listings") ||
    pathname.startsWith("/support") ||
    pathname.startsWith("/company")
  ) {
    return null;
  }

  // Profile verification is the FIRST priority. An unverified / inactive
  // profile is never allowed through, even when access was admin-granted —
  // the access check only matters once the profile itself is verified.
  const profileVerified = status === "active";
  const hasPlatformAccess = paymentStatus === "active";

  if (profileVerified && hasPlatformAccess) {
    return null;
  }

  // =========================================
  // MESSAGE
  // =========================================

  let title = "Subscription Required";
  let message = "Select a subscription package to continue.";

  if (status === "inactive") {
    title = "Account Inactive";
    message = "Your account is currently inactive. Please contact support.";
  }

  if (paymentStatus === "past_due") {
    title = "Payment Required";
    message = "Your payment is currently past due.";
  }

  if (paymentStatus === "canceled") {
    title = "Subscription Canceled";
    message = "Renew your subscription to continue.";
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-[13000] bg-black/70 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  // =========================================
  // FIRST POPUP
  // =========================================

  if (!showPlans) {
    return (
      <div className="fixed inset-0 z-[13000] bg-black/55 backdrop-blur-sm flex items-center justify-center px-4">
        <div className="w-full max-w-md border border-zinc-200 bg-white rounded-lg shadow-2xl p-7">
          <div className="flex items-start gap-4">
            <div className="h-11 w-11 rounded-md bg-red-50 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-500" />
            </div>

            <div className="flex-1">
              <h2 className="text-[20px] font-semibold text-zinc-900">
                {title}
              </h2>
              <p className="mt-1 text-sm text-zinc-500 leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            {(paymentStatus === "no_subscription" ||
              paymentStatus === "inactive" ||
              paymentStatus === "past_due") &&
              status === "active" && (
                <Button
                  onClick={() => setShowPlans(true)}
                  className="h-11 rounded-md text-sm font-medium"
                >
                  Proceed with Payment
                </Button>
              )}

            {paymentStatus === "canceled" && status === "active" && (
              <Button
                onClick={renewSubscription}
                className="h-11 rounded-md text-sm font-medium"
              >
                Renew Subscription
              </Button>
            )}

            <Button
              variant="outline"
              className="h-11 rounded-md border-zinc-300"
              onClick={() => {
                window.open(
                  "https://mail.google.com/mail/?view=cm&fs=1&to=drugdroprx@gmail.com",
                  "_blank",
                );
              }}
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================
  // PLAN SELECTION SCREEN
  // =========================================

  const accentColor = "hsl(210 15% 60%)";
  const accentLight = "hsl(210 15% 80%)";
  const textLight = "hsl(0 0% 95%)";
  const textDark = "hsl(0 0% 5%)";
  const color262626 = "hsl(0 0% 15%)";
  const color0D0D0D = "hsl(0 0% 5%)";

  return (
    <div
      className="fixed inset-0 z-[13000] overflow-auto"
      style={{
        background: `linear-gradient(180deg, ${color0D0D0D} 0%, ${color262626} 50%, ${color0D0D0D} 100%)`,
      }}
    >
      <div className="relative min-h-screen py-10 px-4">
        <div className="max-w-7xl mx-auto">
          {/* HEADER */}
          <div className="text-center mb-8">
            <span
              className="text-[11px] uppercase tracking-[0.22em] font-semibold"
              style={{ color: accentColor }}
            >
              Subscription Plans
            </span>

            <h2
              className="text-3xl md:text-4xl font-bold mt-3"
              style={{ color: textLight }}
            >
              Choose Your Subscription
            </h2>

            <p
              className="mt-2 text-sm max-w-lg mx-auto"
              style={{ color: "hsl(0 0% 72%)" }}
            >
              Unlock premium pharmacy audit workflows and platform access.
            </p>
          </div>

          {/* THREE PLAN CARDS */}
          <div className="mt-14 grid items-stretch gap-6 md:grid-cols-3 max-w-8xl mx-auto">
            {plans.map((plan, idx) => {
              const active = selectedPlan === plan.id;

              return (
                <div
                  key={plan.id}
                  onClick={() => selectPlan(plan.id)}
                  className={`relative flex cursor-pointer flex-col rounded-2xl border p-7 text-left animate-fadeInUp transition-all duration-300 ease-out ${
                    active
                      ? "border-zinc-600 bg-gradient-to-b from-zinc-900 to-black ring-1 ring-zinc-500/50 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.75)] hover:-translate-y-1 hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)]"
                      : "border-zinc-800 bg-zinc-900 hover:-translate-y-1 hover:border-zinc-600 hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.55)]"
                  }`}
                  style={{ animationDelay: `${0.1 + idx * 0.15}s` }}
                >
                  {/* Premium Top Accent */}
                  <div
                    className={`absolute inset-x-0 top-0 h-px ${
                      active
                        ? "bg-gradient-to-r from-transparent via-zinc-300 to-transparent"
                        : "bg-gradient-to-r from-transparent via-zinc-700 to-transparent"
                    }`}
                  />

                  {/* Static "Most Popular" badge — absolute, so it never affects alignment */}
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 z-20 -translate-x-1/2 rounded-full border border-zinc-300/20 bg-gradient-to-b from-zinc-100 to-zinc-300 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-black shadow-lg">
                      {(plan as any).badge ?? "Most Popular"}
                    </span>
                  )}

                  {/* Name */}
                  <div
                    className="flex items-center gap-2 animate-fadeInUp"
                    style={{ animationDelay: `${0.15 + idx * 0.15}s` }}
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400 transition-colors duration-300">
                      {plan.name}
                    </span>
                  </div>

                  {/* Price — explicit white so it stays readable on the dark card */}
                  <div
                    className="mt-5 flex items-baseline gap-1 animate-fadeInUp"
                    style={{ animationDelay: `${0.2 + idx * 0.15}s` }}
                  >
                    <span className="text-4xl font-semibold tracking-tight text-white">
                      {plan.price}
                    </span>
                    <span className="text-sm text-zinc-400">{plan.period}</span>
                  </div>

                  {/* Optional trial badge — only renders if the plan defines it */}
                  {(plan as any).trial && (
                    <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-sky-500/20 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold text-sky-300">
                      {(plan as any).trial}
                    </span>
                  )}

                  {/* Description — min-height reserves space so feature lists start at the same line */}
                  <p
                    className="mt-3 min-h-[40px] text-sm leading-relaxed text-zinc-400 animate-fadeInUp"
                    style={{ animationDelay: `${0.25 + idx * 0.15}s` }}
                  >
                    {plan.description}
                  </p>

                  {/* Optional value note — only renders if the plan defines it */}
                  {(plan as any).valueNote && (
                    <p className="mt-2 text-xs leading-relaxed text-emerald-300/80 italic">
                      {(plan as any).valueNote}
                    </p>
                  )}

                  {/* Features */}
                  <ul className="mt-6 space-y-3 text-sm">
                    {plan.features.map((feature, fIdx) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 animate-fadeInUp"
                        style={{
                          animationDelay: `${0.3 + fIdx * 0.05 + idx * 0.15}s`,
                        }}
                      >
                        <span
                          className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                            active ? "bg-emerald-500/15" : "bg-zinc-800"
                          }`}
                        >
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                        </span>
                        <span
                          className={
                            fIdx === 0
                              ? "font-semibold text-zinc-200 transition-colors duration-300"
                              : "text-zinc-300"
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Button — mt-auto pins it to the bottom of every card, so all three align */}
                  <Button
                    type="button"
                    className={`${plan.price === "$499" ? "mt-6" : "mt-4"} w-full rounded-lg px-4 py-6 text-sm font-medium transition-all duration-300 animate-fadeInUp ${
                      active
                        ? "bg-gradient-to-b from-zinc-100 to-zinc-300 text-black shadow-md hover:from-white hover:to-zinc-200 hover:shadow-xl"
                        : "border border-zinc-700 bg-transparent text-zinc-100 hover:border-zinc-500 hover:bg-zinc-900/50"
                    }`}
                    style={{ animationDelay: `${0.6 + idx * 0.15}s` }}
                  >
                    {active ? "Selected Plan" : "Choose Plan"}
                  </Button>
                </div>
              );
            })}
          </div>

          {/* ACTION CARD */}
          <div className="max-w-md mx-auto mt-10">
            <div
              className="border rounded-xl p-5 flex flex-col gap-5"
              style={{
                background: `linear-gradient(180deg, ${color262626}, ${color0D0D0D})`,
                borderColor: "hsl(0 0% 18%)",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "hsl(0 0% 14%)" }}
                >
                  <Lock
                    className="h-4 w-4"
                    style={{ color: "hsl(0 0% 72%)" }}
                  />
                </div>

                <div>
                  <p
                    className="text-[15px] font-semibold leading-none mb-1"
                    style={{ color: textLight }}
                  >
                    Complete checkout
                  </p>
                  <p
                    className="text-[12px] leading-none"
                    style={{ color: "hsl(0 0% 52%)" }}
                  >
                    Review your plan and confirm
                  </p>
                </div>
              </div>

              <div style={{ height: "0.5px", background: "hsl(0 0% 20%)" }} />

              {/* TRIAL / PROMO CODE */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-[12px] font-medium flex items-center gap-1.5"
                  style={{ color: "hsl(0 0% 72%)" }}
                >
                  <Tag className="h-3.5 w-3.5" />
                  Have a code?
                </label>

                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      setCodeStatus(null);
                    }}
                    placeholder="Enter code"
                    className="flex-1 h-10 rounded-lg px-3 text-sm outline-none"
                    style={{
                      background: "hsl(0 0% 12%)",
                      border: "1px solid hsl(0 0% 24%)",
                      color: textLight,
                    }}
                  />
                  <Button
                    type="button"
                    onClick={applyCode}
                    disabled={checkingCode || !couponCode.trim()}
                    className="h-10 rounded-lg text-sm font-semibold px-4"
                    style={{
                      background: "hsl(0 0% 18%)",
                      border: "1px solid hsl(0 0% 28%)",
                      color: textLight,
                    }}
                  >
                    {checkingCode ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>

                {codeStatus && (
                  <p
                    className="text-[12px] flex items-center gap-1.5"
                    style={{
                      color: codeStatus.valid
                        ? "hsl(142 60% 55%)"
                        : "hsl(0 70% 60%)",
                    }}
                  >
                    {codeStatus.valid && (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    )}
                    {codeStatus.message}
                  </p>
                )}
              </div>

              <div style={{ height: "0.5px", background: "hsl(0 0% 20%)" }} />

              <div className="flex flex-col gap-2">
                {(paymentStatus === "no_subscription" ||
                  paymentStatus === "inactive" ||
                  paymentStatus === "past_due") &&
                  status === "active" && (
                    <Button
                      onClick={handleCheckout}
                      disabled={!selectedPlan}
                      className="h-10 rounded-lg text-sm font-semibold flex items-center gap-2"
                      style={{
                        background: `linear-gradient(135deg, ${textLight}, ${accentLight})`,
                        color: textDark,
                      }}
                    >
                      <CreditCard className="h-4 w-4" />
                      Continue payment
                    </Button>
                  )}

                <Button
                  variant="outline"
                  className="h-10 rounded-lg text-sm flex items-center gap-2"
                  style={{
                    borderColor: "hsl(0 0% 26%)",
                    color: textLight,
                    background: "transparent",
                  }}
                  onClick={() => setShowPlans(false)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>

                <Button
                  variant="ghost"
                  className="h-10 rounded-lg text-sm flex items-center gap-2 hover:text-black/80 text-white"
                  onClick={() => {
                    window.open(
                      "https://mail.google.com/mail/?view=cm&fs=1&to=drugdroprx@gmail.com",
                      "_blank",
                    );
                  }}
                >
                  <Mail className="h-4 w-4" />
                  Contact support
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
