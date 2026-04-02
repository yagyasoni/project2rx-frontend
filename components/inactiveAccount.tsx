"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Mail, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InactiveAccount() {
  const pathname = usePathname();
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const updateStatus = () => {
      const s = localStorage.getItem("status");
      setStatus(s);
    };

    updateStatus(); // initial read

    window.addEventListener("storage", updateStatus);

    return () => {
      window.removeEventListener("storage", updateStatus);
    };
  }, []);

  // ✅ Allow auth + admin routes ALWAYS
  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/admin-dashboard") ||
    pathname.startsWith("/supplier-mappings") ||
    pathname.startsWith("/master-sheet") ||
    pathname.startsWith("/master-sheet-queue") ||
    pathname.startsWith("/feedback")
  ) {
    return null;
  }

  // ✅ Only block if inactive
  if (status !== "inactive") return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-sm border border-border bg-card py-8 px-12 shadow-xl text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-6 w-6 text-destructive" />
        </div>

        <h2 className="text-lg font-bold text-foreground">Account Inactive</h2>

        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          Your account is currently inactive. <br />
          Please contact support to activate your account. <br />
          Once activated, you will be able to use the portal.
        </p>

        <div className="mt-5">
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
