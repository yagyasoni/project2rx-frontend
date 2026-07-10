"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Copy,
  Check,
  Loader2,
  CalendarDays,
  CreditCard,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";

import axios from "axios";

import api from "@/lib/api";

import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

// =========================================
// THREE FIXED TIERS — must match backend
//   base         → $99  → Inventory Reports
//   professional → $249 → Reports + Inventory View
//   full_access  → $499 → Everything
// =========================================

const PLAN_LABELS: Record<string, string> = {
  base: "Base — Inventory Reports",
  professional: "Professional",
  full_access: "Full Access",
};

const AVAILABLE_PLANS = [
  {
    key: "base",
    label: "Base",
    description: "Core inventory reporting & analytics access",
    price: "$99/mo",
  },
  {
    key: "professional",
    label: "Professional",
    description: "Reports plus live inventory visibility & insights",
    price: "$249/mo",
  },
  {
    key: "full_access",
    label: "Full Access",
    description: "Everything included — all premium modules",
    price: "$499/mo",
  },
];

// =========================================
// PHARMACY TYPE (merged in from pharmacy page)
// =========================================

interface Pharmacy {
  pharmacy_name: string;
  address: string;
  phone: string;
  fax: string;
}

const UsersPage = () => {
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([
    {
      id: "",
      name: "",
      email: "",
      phone: "",
      role: "",
      tags: ["User"],
      status: "Active" as const,
    },
  ]);

  // =========================================
  // PHARMACY STATE (merged in)
  // =========================================

  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);

  const [pharmacyLoading, setPharmacyLoading] = useState(true);

  const [subscription, setSubscription] = useState<any>(null);

  const [subLoading, setSubLoading] = useState(false);

  // Single-select now (one tier at a time)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const [updatingSubscription, setUpdatingSubscription] = useState(false);

  const [showCancelModal, setShowCancelModal] = useState(false);

  // =========================================
  // FETCH USER
  // =========================================

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await api.get("/auth/user-info", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers([
          {
            id: res?.data?.user?.id || "",
            name: res?.data?.user?.name || "",
            email: res?.data?.user?.email || "",
            phone: res?.data?.user?.phone || "",
            role: res?.data?.user?.role || "",
            tags: ["User"],
            status: "Active" as const,
          },
        ]);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // =========================================
  // FETCH PHARMACY (merged in)
  // =========================================

  useEffect(() => {
    const fetchPharmacy = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await api.get("/auth/pharmacy-details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPharmacy(res?.data?.pharmacy);
      } catch (err) {
        console.log("Error fetching pharmacy details");
      } finally {
        setPharmacyLoading(false);
      }
    };

    fetchPharmacy();
  }, []);

  // =========================================
  // FETCH SUBSCRIPTION
  // =========================================

  const fetchSubscription = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      setSubLoading(true);

      const res = await api.get(`/pay/stripe-subscription/${userId}`);

      const sub = res?.data?.subscription;
      console.log("SUB DATA:", sub);

      setSubscription(sub);

      // active_plans is a single-element array now: ["base"] | ["professional"] | ["full_access"]
      setSelectedPlan(
        Array.isArray(sub?.active_plans) && sub.active_plans.length
          ? sub.active_plans[0]
          : null,
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load subscription");
    } finally {
      setSubLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  // =========================================
  // COPY
  // =========================================

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  };

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date: string | null) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // =========================================
  // FORMAT PRICE
  // =========================================

  const formattedPrice = useMemo(() => {
    if (
      !subscription?.currency ||
      subscription?.amount === undefined ||
      subscription?.amount === null
    ) {
      return "N/A";
    }

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: subscription.currency.toUpperCase(),
    }).format(subscription.amount / 100);
  }, [subscription]);

  // =========================================
  // PLAN SELECT (single-select)
  // =========================================

  const selectPlan = (plan: string) => {
    if (subscription?.cancel_at_period_end) return;
    setSelectedPlan(plan);
  };

  const currentPlan: string | null = Array.isArray(subscription?.active_plans)
    ? subscription.active_plans[0] || null
    : null;

  // =========================================
  // UPDATE SUBSCRIPTION
  // =========================================

  const handleUpdateSubscription = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return toast.error("User not found");

      if (subscription?.cancel_at_period_end) {
        return toast.error("Canceled subscriptions cannot be updated");
      }

      if (!selectedPlan) {
        return toast.error("Please select a plan");
      }

      if (selectedPlan === currentPlan) {
        return toast.error("You are already on this plan");
      }

      setUpdatingSubscription(true);

      const res = await api.post(`/pay/update-subscription-plans`, {
        userId,
        plan: selectedPlan, // single string — matches new backend
      });

      // Backend returns a message describing upgrade (immediate) vs
      // downgrade (scheduled at period end).
      toast.success(res?.data?.message || "Subscription updated successfully");

      // Refetch after a short delay so the Stripe webhook has time to sync.
      // (No optimistic active_plans change — a downgrade only takes effect
      // at period end, so the current plan should stay until then.)
      setTimeout(() => {
        fetchSubscription();
      }, 2500);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.error || "Failed to update subscription",
      );
    } finally {
      setUpdatingSubscription(false);
    }
  };

  // =========================================
  // CANCEL SUBSCRIPTION
  // =========================================

  const handleCancelSubscription = async () => {
    try {
      const userId = localStorage.getItem("userId");

      await api.post(`/pay/cancel-subscription`, { userId });

      toast.success(
        "Subscription will remain active until the current billing period ends",
      );

      setShowCancelModal(false);
      await fetchSubscription();
    } catch (error) {
      console.error(error);
      toast.error("Failed to cancel subscription");
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center text-muted-foreground">
        Loading User Details...
      </div>
    );
  }

  // Renewal / trial / valid-until label + date used in the summary card
  const renewalLabel = subscription?.cancel_at_period_end
    ? "Valid until"
    : subscription?.status === "trialing"
      ? "Trial ends"
      : "Renews";

  const renewalDate = subscription
    ? formatDate(
        subscription.status === "trialing"
          ? subscription.trial_end
          : subscription.grace_period_end || subscription.current_period_end,
      )
    : "N/A";

  return (
    <>
      {/* ===================================== */}
      {/* CANCEL MODAL */}
      {/* ===================================== */}

      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-semibold mb-3">Cancel Subscription</h2>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              Your subscription will remain active until the current billing
              cycle ends. Auto-renewal will be disabled immediately.
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowCancelModal(false)}
              >
                Keep Subscription
              </Button>

              <Button variant="destructive" onClick={handleCancelSubscription}>
                Confirm Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto p-6">
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-foreground mb-8">
            User Details
          </h2>

          {users.map((user) => (
            <div key={user.id} className="space-y-8">
              {/* NAME */}

              <div className="flex justify-between border-b border-border pb-4">
                <span className="text-muted-foreground">Name</span>

                <div className="flex items-center gap-2">
                  <span className="font-medium">{user.name}</span>

                  <button onClick={() => copyToClipboard(user.name, "Name")}>
                    <Copy size={14} />
                  </button>
                </div>
              </div>

              {/* EMAIL */}

              <div className="flex justify-between border-b border-border pb-4">
                <span className="text-muted-foreground">Email</span>

                <div className="flex items-center gap-2">
                  <span className="font-medium">{user.email}</span>

                  <button onClick={() => copyToClipboard(user.email, "Email")}>
                    <Copy size={14} />
                  </button>
                </div>
              </div>

              {/* PHONE */}

              <div className="flex justify-between border-b border-border pb-4">
                <span className="text-muted-foreground">Phone</span>

                <div className="flex items-center gap-2">
                  <span className="font-medium">{user.phone}</span>

                  <button onClick={() => copyToClipboard(user.phone, "Phone")}>
                    <Copy size={14} />
                  </button>
                </div>
              </div>

              {/* ===================================== */}
              {/* PHARMACY DETAILS (merged in) */}
              {/* ===================================== */}

              <div className="">
                <h3 className="text-2xl font-semibold text-foreground mb-6">
                  Pharmacy Details
                </h3>

                {pharmacyLoading ? (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 size={18} className="animate-spin" />
                    Loading pharmacy details...
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* PHARMACY NAME */}
                    <div className="flex justify-between border-b border-border pb-3">
                      <span className="text-muted-foreground">
                        Pharmacy Name
                      </span>

                      <div className="flex items-center gap-2 max-w-[60%]">
                        <span className="font-medium text-right">
                          {pharmacy?.pharmacy_name || "-"}
                        </span>

                        <button
                          onClick={() =>
                            copyToClipboard(
                              pharmacy?.pharmacy_name || "",
                              "Name",
                            )
                          }
                          className="text-muted-foreground hover:text-foreground shrink-0"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>

                    {/* ADDRESS */}
                    <div className="flex justify-between border-b border-border pb-3">
                      <span className="text-muted-foreground">Address</span>

                      <div className="flex items-center gap-2 max-w-[60%]">
                        <span className="font-medium text-right">
                          {pharmacy?.address || "-"}
                        </span>

                        <button
                          onClick={() =>
                            copyToClipboard(pharmacy?.address || "", "Address")
                          }
                          className="text-muted-foreground hover:text-foreground shrink-0"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>

                    {/* PHONE */}
                    <div className="flex justify-between border-b border-border pb-3">
                      <span className="text-muted-foreground">Phone</span>

                      <div className="flex items-center gap-2 max-w-[60%]">
                        <span className="font-medium text-right">
                          {pharmacy?.phone || "-"}
                        </span>

                        <button
                          onClick={() =>
                            copyToClipboard(pharmacy?.phone || "", "Phone")
                          }
                          className="text-muted-foreground hover:text-foreground shrink-0"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>

                    {/* FAX */}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fax</span>

                      <div className="flex items-center gap-2 max-w-[60%]">
                        <span className="font-medium text-right">
                          {pharmacy?.fax || "-"}
                        </span>

                        <button
                          onClick={() =>
                            copyToClipboard(pharmacy?.fax || "", "Fax")
                          }
                          className="text-muted-foreground hover:text-foreground shrink-0"
                        >
                          <Copy size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ===================================== */}
              {/* SUBSCRIPTION */}
              {/* ===================================== */}

              <div className="border-t border-border pt-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold">Subscription</h2>

                    <p className="text-muted-foreground mt-1">
                      Manage your billing & plan
                    </p>
                  </div>

                  <ShieldCheck className="text-green-500" size={28} />
                </div>

                {subLoading ? (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 size={18} className="animate-spin" />
                    Loading subscription...
                  </div>
                ) : subscription ? (
                  <div className="space-y-6">
                    {/* ============================================= */}
                    {/* CONSOLIDATED SUMMARY CARD                     */}
                    {/* One card replaces the old 5 stacked boxes:    */}
                    {/* plan • status • auto-renew • price • date     */}
                    {/* ============================================= */}

                    <div className="border border-border rounded-2xl p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        {/* LEFT — plan + status + auto-renew */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="text-xl font-semibold leading-none">
                              {currentPlan
                                ? PLAN_LABELS[currentPlan] || currentPlan
                                : "No active plan"}
                            </h3>

                            <span
                              className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                                subscription.status === "active"
                                  ? "bg-green-500/10 text-green-600"
                                  : subscription.status === "trialing"
                                    ? "bg-blue-500/10 text-blue-600"
                                    : "bg-yellow-500/10 text-yellow-600"
                              }`}
                            >
                              {subscription.status}
                            </span>

                            {subscription.admin_override && (
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600">
                                Admin granted
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <span
                              className={
                                subscription.auto_renew
                                  ? "text-green-500"
                                  : "text-yellow-500"
                              }
                            >
                              ●
                            </span>
                            Auto-renewal{" "}
                            {subscription.auto_renew ? "enabled" : "disabled"}
                          </p>
                        </div>

                        {/* RIGHT — price + renewal date */}
                        <div className="text-right">
                          <p className="text-2xl font-bold leading-none flex items-center justify-end gap-1.5">
                            <CreditCard
                              size={18}
                              className="text-muted-foreground"
                            />
                            {formattedPrice}
                          </p>

                          <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1.5 justify-end">
                            <CalendarDays size={14} />
                            {renewalLabel} {renewalDate}
                          </p>
                        </div>
                      </div>

                      {/* Scheduled downgrade (pending_plan) */}
                      {subscription.pending_plan &&
                        subscription.pending_plan !== currentPlan && (
                          <p className="text-xs text-yellow-600 mt-4 pt-4 border-t border-border">
                            Scheduled change to{" "}
                            <strong>
                              {PLAN_LABELS[subscription.pending_plan] ||
                                subscription.pending_plan}
                            </strong>{" "}
                            at the end of the current billing period.
                          </p>
                        )}
                    </div>

                    {/* ================================= */}
                    {/* PLAN MANAGEMENT */}
                    {/* Hidden for admin-granted clients — they have no */}
                    {/* Stripe subscription, so plan changes don't apply. */}
                    {/* ================================= */}

                    {!subscription.cancel_at_period_end &&
                      !subscription.admin_override && (
                        <div className="pt-2">
                          <div className="flex items-center justify-between mb-5">
                            <div>
                              <h3 className="text-lg font-semibold">
                                Change Plan
                              </h3>

                              <p className="text-sm text-muted-foreground">
                                Upgrades apply immediately (prorated).
                                Downgrades take effect at the end of your
                                billing period.
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {AVAILABLE_PLANS.map((plan) => {
                              const checked = selectedPlan === plan.key;
                              const isCurrent = currentPlan === plan.key;

                              return (
                                <button
                                  key={plan.key}
                                  onClick={() => selectPlan(plan.key)}
                                  className={`rounded-2xl border p-5 text-left transition-all duration-200 ${
                                    checked
                                      ? "border-primary bg-primary/5 ring-2 ring-primary/10"
                                      : "border-border hover:border-primary/40"
                                  }`}
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    <div>
                                      <h4 className="font-semibold">
                                        {plan.label}
                                      </h4>

                                      <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                        {plan.description}
                                      </p>

                                      <p className="text-sm font-semibold mt-3 text-foreground">
                                        {plan.price}
                                      </p>
                                    </div>

                                    {isCurrent ? (
                                      <span className="text-xs font-medium text-muted-foreground shrink-0">
                                        Current
                                      </span>
                                    ) : (
                                      checked && (
                                        <div className="flex items-center gap-1 text-green-500 shrink-0">
                                          <Check size={18} />
                                          <span className="text-xs font-medium">
                                            Selected
                                          </span>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    {/* ================================= */}
                    {/* ACTIONS */}
                    {/* Hidden for admin-granted clients. */}
                    {/* ================================= */}

                    <div
                      className={`flex flex-wrap gap-3 pt-4 ${
                        subscription.admin_override ? "hidden" : ""
                      }`}
                    >
                      <Button
                        onClick={handleUpdateSubscription}
                        disabled={
                          updatingSubscription ||
                          subscription.cancel_at_period_end ||
                          !selectedPlan ||
                          selectedPlan === currentPlan
                        }
                      >
                        {updatingSubscription ? (
                          <div className="flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin" />
                            Updating...
                          </div>
                        ) : (
                          "Update Subscription"
                        )}
                      </Button>

                      {!subscription.cancel_at_period_end && (
                        <Button
                          variant="destructive"
                          onClick={() => setShowCancelModal(true)}
                        >
                          Cancel Subscription
                        </Button>
                      )}
                    </div>

                    {/* ================================= */}
                    {/* CANCELED INFO */}
                    {/* ================================= */}

                    {subscription.cancel_at_period_end && (
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5">
                        <p className="text-sm text-yellow-600 leading-relaxed">
                          Your subscription has been canceled and will remain
                          active until{" "}
                          <strong>
                            {formatDate(
                              subscription.grace_period_end ||
                                subscription.current_period_end,
                            )}
                          </strong>
                          .
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No active subscription found.
                  </p>
                )}
              </div>

              {/* FOOTER */}

              <div className="flex items-center gap-2 pt-2">
                {user.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}

                <Badge className="ml-auto">{user.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default UsersPage;
