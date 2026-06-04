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
} from "lucide-react";

import { Button } from "@/components/ui/button";

import { toast } from "sonner";

const plans = [
  {
    id: "base",
    name: "Inventory Reports",
    price: "$99",
    period: "/month",
    description:
      "Core inventory audit and reporting access for pharmacy operations.",

    features: [
      "Inventory report access",
      "Unlimited inventory audits",
      "Export reports",
      "Secure dashboard access",
    ],

    highlighted: false,
  },

  {
    id: "inventory_view",
    name: "Inventory View",
    price: "$199",
    period: "/month",
    description:
      "Advanced inventory visibility and intelligent inventory insights.",

    features: [
      "Live inventory visibility",
      "Inventory trend analysis",
      "Advanced inventory insights",
      "Real-time updates",
    ],

    highlighted: false,
  },

  {
    id: "drug_lookup",
    name: "Drug Lookup",
    price: "$199",
    period: "/month",
    description:
      "Drug lookup tools with detailed pharmacy intelligence access.",

    features: [
      "Drug lookup system",
      "NDC search access",
      "Drug intelligence",
      "Advanced search filters",
    ],

    highlighted: false,
  },

  {
    id: "leads",
    name: "Leads",
    price: "$199",
    period: "/month",
    description:
      "Lead management and pharmacy business growth intelligence tools.",

    features: [
      "Lead generation tools",
      "Lead management dashboard",
      "Business insights",
      "Pharmacy targeting",
    ],

    highlighted: false,
  },

  {
    id: "full_access",
    name: "Full Access",
    price: "$499",
    period: "/month",
    description: "Complete platform access including all premium modules.",

    features: [
      "Inventory reports",
      "Inventory view",
      "Drug lookup",
      "Leads system",
      "All premium modules",
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

  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);

  const [couponCode, setCouponCode] = useState("");

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
          axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/users`),

          axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/subscription/${userId}`,
          ),
        ]);

        const users = userRes.data?.users || userRes.data;

        const currentUser = users.find((u: any) => u.id === userId);

        const newStatus = currentUser?.status || null;

        const subData = subRes.data;

        const subscription = subData.subscription;

        // const hasAccess =
        //   subscription?.inventory_reports_access ||
        //   subscription?.inventory_view_access ||
        //   subscription?.drug_lookup_access ||
        //   subscription?.leads_access ||
        //   subscription?.full_access;

        // const newPaymentStatus =
        //   subscription && hasAccess ? subscription.status : "no_subscription";

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
  // PLAN TOGGLE
  // =========================================

  const togglePlan = (planId: string) => {
    // FULL ACCESS
    if (planId === "full_access") {
      setSelectedPlans(["full_access"]);
      return;
    }

    // BASE
    if (planId === "base") {
      const hasBase = selectedPlans.includes("base");

      if (hasBase) {
        setSelectedPlans([]);
        return;
      }

      const withoutFull = selectedPlans.filter((p) => p !== "full_access");

      setSelectedPlans([...withoutFull, "base"]);

      return;
    }

    // ADDONS
    const hasBase = selectedPlans.includes("base");

    if (!hasBase) return;

    const exists = selectedPlans.includes(planId);

    if (exists) {
      setSelectedPlans(selectedPlans.filter((p) => p !== planId));
    } else {
      setSelectedPlans([...selectedPlans, planId]);
    }
  };

  // =========================================
  // PAYMENT
  // =========================================

  const handleCheckout = async () => {
    if (selectedPlans.length === 0) {
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
          plans: selectedPlans,
          referralCode: couponCode || null,
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
        {
          userId,
        },
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
    pathname.startsWith("/ndc-sheet")
  ) {
    return null;
  }

  // =========================================
  // ACCESS ALLOWED
  // =========================================

  // if (
  //   (paymentStatus === "active" || !paymentStatus) &&
  //   (status === "active" || !status)
  // ) {
  //    return null;
  // }

  const hasPlatformAccess = paymentStatus === "active";

  if (hasPlatformAccess && (status === "active" || !status)) {
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
      <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  // =========================================
  // FIRST POPUP
  // =========================================

  if (!showPlans) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black/55 backdrop-blur-sm flex items-center justify-center px-4">
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

  const hasBaseSelected = selectedPlans.includes("base");

  const accentColor = "hsl(210 15% 60%)";

  const accentLight = "hsl(210 15% 80%)";

  const accentDark = "hsl(210 15% 40%)";

  const textLight = "hsl(0 0% 95%)";

  const textDark = "hsl(0 0% 5%)";

  const color404040 = "hsl(0 0% 25%)";

  const color262626 = "hsl(0 0% 15%)";

  const color0D0D0D = "hsl(0 0% 5%)";

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-auto"
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

          {/* MAIN PLANS */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {plans
              .filter((p) => p.id === "base" || p.id === "full_access")
              .map((plan) => {
                const active = selectedPlans.includes(plan.id);

                return (
                  <div
                    key={plan.id}
                    onClick={() => togglePlan(plan.id)}
                    className={`relative cursor-pointer border transition-all duration-200 p-5 rounded-xl flex flex-col min-h-[320px]
                    ${active ? "scale-[1.015]" : "hover:-translate-y-[2px]"}`}
                    style={{
                      background: active
                        ? `linear-gradient(180deg, ${color404040}, ${color0D0D0D})`
                        : `linear-gradient(180deg, ${color262626}, ${color0D0D0D})`,
                      borderColor: active ? accentDark : "hsl(0 0% 18%)",
                      boxShadow: active ? "0 0 0 1px hsl(210 15% 35%)" : "none",
                    }}
                  >
                    {plan.highlighted && (
                      <div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-semibold"
                        style={{
                          background: accentColor,
                          color: textDark,
                        }}
                      >
                        Most Popular
                      </div>
                    )}

                    <div className="mb-5">
                      <h3
                        className="text-[17px] font-semibold"
                        style={{ color: textLight }}
                      >
                        {plan.name}
                      </h3>

                      <p
                        className="mt-1.5 text-xs leading-relaxed"
                        style={{
                          color: "hsl(0 0% 72%)",
                        }}
                      >
                        {plan.description}
                      </p>
                    </div>

                    <div className="mb-5">
                      <div className="flex items-end gap-1">
                        <span
                          className="text-4xl font-bold leading-none"
                          style={{ color: textLight }}
                        >
                          {plan.price}
                        </span>

                        <span
                          className="text-sm mb-1"
                          style={{
                            color: "hsl(0 0% 58%)",
                          }}
                        >
                          {plan.period}
                        </span>
                      </div>

                      <div className="mt-4 h-px bg-white/10" />
                    </div>

                    <ul className="space-y-2.5 flex-1">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm"
                          style={{ color: textLight }}
                        >
                          <CheckCircle2
                            className="w-4 h-4 mt-0.5 shrink-0"
                            style={{ color: accentColor }}
                          />

                          <span className="opacity-90 leading-relaxed">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      type="button"
                      className="mt-5 h-10 rounded-lg text-sm font-semibold transition-all"
                      style={
                        active
                          ? {
                              background: `linear-gradient(135deg, ${textLight}, ${accentLight})`,
                              color: textDark,
                            }
                          : {
                              background: "hsl(0 0% 14%)",
                              border: "1px solid hsl(0 0% 24%)",
                              color: textLight,
                            }
                      }
                    >
                      {active ? "Selected Plan" : "Choose Plan"}
                    </Button>
                  </div>
                );
              })}
          </div>

          {/* ADDONS */}

          {hasBaseSelected && (
            <div className="mt-10 max-w-6xl mx-auto">
              <div className="mb-5">
                <h3
                  className="text-2xl font-semibold"
                  style={{ color: textLight }}
                >
                  Optional Add-ons
                </h3>

                <p className="text-sm mt-1" style={{ color: "hsl(0 0% 65%)" }}>
                  Enhance your base subscription with additional modules.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {plans
                  .filter((p) =>
                    ["inventory_view", "drug_lookup", "leads"].includes(p.id),
                  )
                  .map((plan) => {
                    const active = selectedPlans.includes(plan.id);

                    return (
                      <div
                        key={plan.id}
                        onClick={() => togglePlan(plan.id)}
                        className={`relative cursor-pointer border transition-all duration-200 p-5 rounded-xl flex flex-col min-h-[300px]
                        ${
                          active ? "scale-[1.015]" : "hover:-translate-y-[2px]"
                        }`}
                        style={{
                          background: active
                            ? `linear-gradient(180deg, ${color404040}, ${color0D0D0D})`
                            : `linear-gradient(180deg, ${color262626}, ${color0D0D0D})`,
                          borderColor: active ? accentDark : "hsl(0 0% 18%)",
                          boxShadow: active
                            ? "0 0 0 1px hsl(210 15% 35%)"
                            : "none",
                        }}
                      >
                        <div className="mb-5">
                          <h3
                            className="text-[17px] font-semibold"
                            style={{ color: textLight }}
                          >
                            {plan.name}
                          </h3>

                          <p
                            className="mt-1.5 text-xs leading-relaxed"
                            style={{
                              color: "hsl(0 0% 72%)",
                            }}
                          >
                            {plan.description}
                          </p>
                        </div>

                        <div className="mb-5">
                          <div className="flex items-end gap-1">
                            <span
                              className="text-4xl font-bold leading-none"
                              style={{
                                color: textLight,
                              }}
                            >
                              {plan.price}
                            </span>

                            <span
                              className="text-sm mb-1"
                              style={{
                                color: "hsl(0 0% 58%)",
                              }}
                            >
                              {plan.period}
                            </span>
                          </div>

                          <div className="mt-4 h-px bg-white/10" />
                        </div>

                        <ul className="space-y-2.5 flex-1">
                          {plan.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-start gap-2 text-sm"
                              style={{
                                color: textLight,
                              }}
                            >
                              <CheckCircle2
                                className="w-4 h-4 mt-0.5 shrink-0"
                                style={{
                                  color: accentColor,
                                }}
                              />

                              <span className="opacity-90 leading-relaxed">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </ul>

                        <Button
                          type="button"
                          className="mt-5 h-10 rounded-lg text-sm font-semibold transition-all"
                          style={
                            active
                              ? {
                                  background: `linear-gradient(135deg, ${textLight}, ${accentLight})`,
                                  color: textDark,
                                }
                              : {
                                  background: "hsl(0 0% 14%)",
                                  border: "1px solid hsl(0 0% 24%)",
                                  color: textLight,
                                }
                          }
                        >
                          {active ? "Selected Add-on" : "Choose Add-on"}
                        </Button>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

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
                    style={{
                      color: "hsl(0 0% 52%)",
                    }}
                  >
                    Review your plan and confirm
                  </p>
                </div>
              </div>

              <div
                style={{
                  height: "0.5px",
                  background: "hsl(0 0% 20%)",
                }}
              />

              <div className="flex flex-col gap-2">
                {(paymentStatus === "no_subscription" ||
                  paymentStatus === "inactive" ||
                  paymentStatus === "past_due") &&
                  status === "active" && (
                    <Button
                      onClick={handleCheckout}
                      disabled={selectedPlans.length === 0}
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
