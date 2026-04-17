"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Mail, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { createCheckoutSession } from "@/components/checkoutSession";
import { toast } from "sonner";

export default function InactiveAccount() {
  const pathname = usePathname();
  const [status, setStatus] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const fetchStatus = async () => {
      try {
        const res = await axios.get(`https://api.auditprorx.com/auth/users`);
        const users = res.data;

        const currentUser = users.find((u: any) => u.id === userId);
        console.log("Fetched user status:", currentUser);
        if (currentUser) setStatus(currentUser.status);
      } catch (err) {
        console.error("Failed to fetch user status:", err);
      }
    };

    fetchStatus(); // on mount
  }, []);

  // ✅ FETCH SUBSCRIPTION STATUS
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          setLoading(false);
          return;
        }

        const res = await axios.get(
          `https://api.auditprorx.com/pay/subscription/${userId}`,
        );
        const data = res.data;
        console.log("Fetched subscription status:", data);

        if (!data.subscription) {
          // ❌ No subscription → force payment flow
          setPaymentStatus("no_subscription");
        } else {
          setPaymentStatus(data.subscription.status);
        }
      } catch (err) {
        console.error("Subscription fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const paymentPath = async () => {
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("userEmail") || "";

    try {
      console.log("Creating Stripe checkout session for email:", email);
      const checkout = await createCheckoutSession(userId, email);

      // Optional UX
      toast("Redirecting to secure payment...");

      // 🔥 Redirect to Stripe (ONLY THIS)
      window.location.href = checkout.url;
    } catch (err) {
      console.error("Stripe checkout failed:", err);
      toast("Something went wrong while redirecting to payment");
    } //
  };

  // ✅ Allow auth + admin routes ALWAYS
  if (
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/info-page") ||
    pathname.startsWith("/agreements") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/admin-dashboard") ||
    pathname.startsWith("/supplier-mappings") ||
    pathname.startsWith("/master-sheet") ||
    pathname.startsWith("/master-sheet-queue") ||
    pathname.startsWith("/feedback")
  ) {
    return null;
  }

  if (
    (paymentStatus === "active" ||
      paymentStatus === "trialing" ||
      !paymentStatus) &&
    (status === "active" || !status)
  ) {
    return null;
  }

  // =========================================
  // ❌ BLOCK CASES
  // =========================================

  let message = "";

  if (paymentStatus === "no_subscription") {
    message = "You do not have an active subscription.";
  } else if (paymentStatus === "past_due") {
    message = "Your payment is past due.";
  } else if (paymentStatus === "canceled") {
    message = "Your subscription has been canceled.";
  } else if (paymentStatus === "inactive") {
    message = "Your subscription is inactive.";
  } else if (status === "inactive") {
    message = "Your account is currently inactive.";
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-sm border border-border bg-card py-8 px-12 shadow-xl text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>

        <h2 className="text-lg font-bold text-foreground">Access Restricted</h2>

        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {message}
        </p>

        <div className="mt-5 flex flex-col gap-2">
          {/* ✅ SHOW PAYMENT BUTTON ONLY IF NO SUB */}
          {(paymentStatus === "no_subscription" ||
            paymentStatus === "inactive" ||
            paymentStatus === "canceled") && (
            <Button className="w-full" onClick={paymentPath}>
              Proceed with Payment
            </Button>
          )}

          <Button
            variant="outline"
            className="cursor-pointer w-full gap-2"
            onClick={() => {
              window.location.href = "mailto:drugdroprx@gmail.com";
            }}
          >
            <Mail className="h-4 w-4" />
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
}
