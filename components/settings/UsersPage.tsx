"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Copy,
  Check,
  Loader2,
  CalendarDays,
  CreditCard,
  ShieldCheck,
} from "lucide-react";

import axios from "axios";

import api from "@/lib/api";

import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

const PLAN_LABELS: Record<string, string> = {
  base: "Inventory Reports",
  inventory_view: "Inventory View",
  drug_lookup: "Drug Lookup",
  leads: "Leads",
  full_access: "Complete Suite",
};

const AVAILABLE_PLANS = [
  {
    key: "base",
    label: "Inventory Reports",
    description: "Core reporting & analytics access",
    price: "$99/mo",
  },
  {
    key: "inventory_view",
    label: "Inventory View",
    description: "Advanced inventory visibility",
    price: "$199/mo",
  },
  {
    key: "drug_lookup",
    label: "Drug Lookup",
    description: "Drug search & lookup tools",
    price: "$199/mo",
  },
  {
    key: "leads",
    label: "Leads",
    description: "Lead generation tools",
    price: "$199/mo",
  },
  {
    key: "full_access",
    label: "Complete Suite",
    description: "Everything included",
    price: "$499/mo",
  },
];

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

  const [subscription, setSubscription] = useState<any>(null);

  const [subLoading, setSubLoading] = useState(false);

  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);

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
  // FETCH SUBSCRIPTION
  // =========================================

  const fetchSubscription = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        return;
      }

      setSubLoading(true);

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/stripe-subscription/${userId}`,
      );

      const sub = res?.data?.subscription;

      console.log("SUB DATA:", sub);

      setSubscription(sub);

      setSelectedPlans(
        Array.isArray(sub?.active_plans) ? sub.active_plans : [],
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
    if (!date) {
      return "N/A";
    }

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
  // PLAN TOGGLE
  // =========================================

  const togglePlan = (plan: string) => {
    if (subscription?.cancel_at_period_end) {
      return;
    }

    setSelectedPlans((prev) => {
      let updated = [...prev];

      // =====================================
      // FULL ACCESS
      // =====================================

      if (plan === "full_access") {
        if (updated.includes("full_access")) {
          return [];
        }

        return ["full_access"];
      }

      // REMOVE FULL ACCESS
      updated = updated.filter((p) => p !== "full_access");

      // =====================================
      // TOGGLE
      // =====================================

      if (updated.includes(plan)) {
        updated = updated.filter((p) => p !== plan);
      } else {
        updated.push(plan);
      }

      // =====================================
      // ADDONS REQUIRE BASE
      // =====================================

      const addonPlans = ["inventory_view", "drug_lookup", "leads"];

      const hasAddon = updated.some((p) => addonPlans.includes(p));

      // AUTO ADD BASE
      if (hasAddon && !updated.includes("base")) {
        updated.push("base");
      }

      // REMOVE ADDONS IF BASE REMOVED
      if (!updated.includes("base")) {
        updated = updated.filter((p) => !addonPlans.includes(p));
      }

      return updated;
    });
  };

  // =========================================
  // UPDATE SUBSCRIPTION
  // =========================================

  const handleUpdateSubscription = async () => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        return toast.error("User not found");
      }

      if (subscription?.cancel_at_period_end) {
        return toast.error("Canceled subscriptions cannot be updated");
      }

      if (selectedPlans.length === 0) {
        return toast.error("Please select at least one plan");
      }

      setUpdatingSubscription(true);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/update-subscription-plans`,
        {
          userId,
          plans: selectedPlans,
        },
      );

      toast.success("Subscription updated successfully");

      await fetchSubscription();
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

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/cancel-subscription`,
        {
          userId,
        },
      );

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
              {/* SUBSCRIPTION */}
              {/* ===================================== */}

              <div className="bg-background border border-border rounded-3xl p-6">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-semibold">Subscription</h2>

                    <p className="text-muted-foreground mt-1">
                      Manage your billing & plans
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
                    {/* ================================= */}
                    {/* TOP STATS */}
                    {/* ================================= */}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* STATUS */}

                      <div className="border border-border rounded-2xl p-5">
                        <p className="text-sm text-muted-foreground mb-2">
                          Status
                        </p>

                        <p
                          className={`text-lg font-semibold capitalize ${
                            subscription.status === "active"
                              ? "text-green-500"
                              : "text-yellow-500"
                          }`}
                        >
                          {subscription.status}
                        </p>
                      </div>

                      {/* BILLING */}

                      <div className="border border-border rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <CreditCard size={16} />

                          <p className="text-sm text-muted-foreground">
                            Next Payment
                          </p>
                        </div>

                        <p className="text-lg font-semibold">
                          {formattedPrice}
                        </p>
                      </div>

                      {/* DATE */}

                      <div className="border border-border rounded-2xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <CalendarDays size={16} />

                          <p className="text-sm text-muted-foreground">
                            {subscription.cancel_at_period_end
                              ? "Valid Until"
                              : "Renewal Date"}
                          </p>
                        </div>

                        <p className="text-lg font-semibold">
                          {formatDate(
                            subscription.grace_period_end ||
                              subscription.current_period_end,
                          )}
                        </p>
                      </div>
                    </div>

                    {/* CURRENT PLAN */}

                    <div className="border border-border rounded-2xl p-5">
                      <p className="text-sm text-muted-foreground mb-3">
                        Current Plan
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(subscription.active_plans) &&
                        subscription.active_plans.length > 0 ? (
                          subscription.active_plans.map((plan: string) => (
                            <Badge
                              key={plan}
                              className="rounded-full px-3 py-1"
                            >
                              {PLAN_LABELS[plan] || plan}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground">
                            No active plan
                          </span>
                        )}
                      </div>
                    </div>

                    {/* AUTO RENEW */}

                    <div className="flex justify-between border-b border-border pb-5">
                      <span className="text-muted-foreground">
                        Auto Renewal
                      </span>

                      <span
                        className={`font-semibold ${
                          subscription.auto_renew
                            ? "text-green-500"
                            : "text-yellow-500"
                        }`}
                      >
                        {subscription.auto_renew ? "Enabled" : "Disabled"}
                      </span>
                    </div>

                    {/* ================================= */}
                    {/* PLAN MANAGEMENT */}
                    {/* ================================= */}

                    {!subscription.cancel_at_period_end && (
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-5">
                          <div>
                            <h3 className="text-lg font-semibold">
                              Manage Plans
                            </h3>

                            <p className="text-sm text-muted-foreground">
                              Select the plans you want included in your
                              subscription
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {AVAILABLE_PLANS.map((plan) => {
                            const checked = selectedPlans.includes(plan.key);

                            return (
                              <button
                                key={plan.key}
                                onClick={() => togglePlan(plan.key)}
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

                                  {checked && (
                                    <div className="flex items-center gap-1 text-green-500">
                                      <Check size={18} />

                                      <span className="text-xs font-medium">
                                        Active
                                      </span>
                                    </div>
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
                    {/* ================================= */}

                    <div className="flex flex-wrap gap-3 pt-4">
                      <Button
                        onClick={handleUpdateSubscription}
                        disabled={
                          updatingSubscription ||
                          subscription.cancel_at_period_end
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
