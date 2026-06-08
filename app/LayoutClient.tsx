"use client";

import { Toaster } from "@/components/ui/sonner";
import { SupplierProvider } from "@/context/SupplierContext";
import InactiveAccount from "@/components/inactiveAccount";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import Feedback from "@/components/Feedback";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string | null>(null);
  const pathname = usePathname();

  const hideBannerRoutes = [
    "/",
    "/admin",
    "/terms-of-service",
    "/privacy-policy",
    "/cancellation-policy",
  ];
  const showFeedbackRoutes = [
    "/Mainpage",
    "/bin-search",
    "/InventoryView",
    "/Notification",
    "/how-to",
    "/ReportsPage",
    "/DrugLookup",
  ];

  const shouldShowBanner = !hideBannerRoutes.includes(pathname);
  const showFeedback = showFeedbackRoutes.includes(pathname);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

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
        {/* Content */}
        <div className="text-center">
          <span className="font-semibold">Beta</span> — This application is
          currently in testing. Some features may not work as expected.{" "}
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

        {/* Close button */}
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

  return (
    <>
      {shouldShowBanner && <BetaBanner />}
      {showFeedback && <Feedback />}
      {/* {role !== null && role !== "admin" ? <InactiveAccount /> : null} */}
      <InactiveAccount />
      <Toaster />
      <SupplierProvider>{children}</SupplierProvider>
    </>
  );
}
