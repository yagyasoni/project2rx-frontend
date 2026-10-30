"use client";

import { Toaster } from "@/components/ui/sonner";
import { SupplierProvider } from "@/context/SupplierContext";
import InactiveAccount, { type GateState } from "@/components/inactiveAccount";
import { lockGuardProps } from "@/lib/lockGuard";
import SupportBubble from "@/components/SupportBubble";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
// import { X } from "lucide-react"; // only used by the disabled BetaBanner below

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string | null>(null);
  const [gate, setGate] = useState<GateState>("open");
  const pathname = usePathname();

  // Public routes carry no logged-in session work. Not mounting InactiveAccount
  // here keeps its polling effect from firing authed calls that 401 and bounce
  // the user to /auth. UI behavior is unchanged — it already rendered null here.
  const isPublicRoute =
    pathname === "/" ||
    [
      "/privacy-policy",
      "/terms-of-service",
      "/cancellation-policy",
      "/auth",
      "/reset-password",
      "/admin",
      "/admin-dashboard",
      "/info-page",
      "/agreements",
      "/feedbacks",
      "/publishing",
      "/supplier-mappings",
      "/master-sheet",
      "/master-sheet-queue",
      "/ndc-sheet",
      "/report-listings",
      "/support",
      "/company",
      "/maintenance",
    ].some((p) => pathname.startsWith(p));

  // Beta banner disabled — uncomment this block, the BetaBanner component,
  // its render line in the JSX below, and the `X` import to restore it.
  /*
  // Allowlist, not a denylist: the banner must never reach a public page, since
  // crawlers read DOM order and were picking "Beta" as the page title.
  const appRoutes = [
    "/Mainpage",
    "/ReportsPage",
    "/reports",
    "/report-listings",
    "/group-reports",
    "/InventoryView",
    "/DrugLookup",
    "/ndc-sheet",
    "/master-sheet",
    "/master-sheet-queue",
    "/supplier-mappings",
    "/settings",
    "/Notification",
    "/agreements",
    "/publishing",
    "/feedbacks",
    "/admin-dashboard",
    "/dashboard",
  ];
  const shouldShowBanner = appRoutes.some((route) =>
    pathname.startsWith(route),
  );
  */

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  // Beta banner disabled — see note above appRoutes. Inner JSX comments were
  // changed to `//` so they don't terminate this block comment early.
  /*
  function BetaBanner() {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
      const dismissed = localStorage.getItem("betaBannerDismissed");
      if (dismissed) setVisible(false);
    }, []);

    const handleClose = () => {
      localStorage.setItem("betaBannerDismissed", "true");
      setVisible(false);
    };

    if (!visible) return null;

    const subject = encodeURIComponent("Beta Support Request");
    const body = encodeURIComponent(
      "Hello Support Team,\n\nI am experiencing an issue while using the beta version of the application.\n\nDetails:\n- Issue:\n- Steps to reproduce:\n\nThank you.",
    );

    return (
      <div
        className="fixed bottom-0 left-0 w-full z-50
    bg-black/40
    text-black text-sm
    py-2 px-4
    flex items-center justify-center
    border-t border-white/10"
      >
        // Content
        <div className="text-center">
          Beta — This application is currently in testing. Some features may not
          work as expected.{" "}
          <a
            href={`https://mail.google.com/mail/?view=cm&fs=1&to=drugdroprx@gmail.com&su=${subject}&body=${body}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-300"
          >
            Contact support
          </a>{" "}
          for any issues or feedback.
        </div>

        // Close button
        <button
          onClick={handleClose}
          aria-label="Dismiss beta notice"
          className="absolute right-4 p-1 rounded-md hover:bg-white/10"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    );
  }
  */

  return (
    <>
      {/* The paywall gets its own wrapper so a popup node deleted in DevTools
          can never be the reference node for React's sibling insertions (the
          "insertBefore … is not a child of this node" crash). */}
      {!isPublicRoute && (
        <div className="contents">
          <InactiveAccount onGateChange={setGate} />
        </div>
      )}
      <Toaster />
      {/* The app stays mounted and visible behind the paywall but is inert while
          it shows, so deleting the popup in DevTools leaves nothing clickable;
          the guards answer anything that still gets through with the
          subscription toast. */}
      <div
        className="contents"
        inert={gate !== "open" && !isPublicRoute}
        {...lockGuardProps(gate === "locked" && !isPublicRoute)}
      >
        <SupplierProvider>{children}</SupplierProvider>
      </div>
      {/* Floating live-support bubble, shown only on the home page. */}
      {pathname === "/" && <SupportBubble />}
      {/* Beta banner disabled. When re-enabled, keep it rendered last so it
          trails the page content in the DOM; it is position: fixed, so this
          is visually identical. */}
      {/* {shouldShowBanner && <BetaBanner />} */}
    </>
  );
}
