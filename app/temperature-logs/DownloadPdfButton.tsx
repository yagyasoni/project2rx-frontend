"use client";

import { useState } from "react";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onDownload: () => Promise<void> | void;
  variant?: "default" | "outline";
};

// The only export is the print-ready PDF, so this is a plain button.
export default function DownloadPdfButton({ onDownload, variant = "outline" }: Props) {
  const [busy, setBusy] = useState(false);

  const run = async () => {
    setBusy(true);
    try {
      await onDownload();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button
      size="sm"
      variant={variant}
      disabled={busy}
      onClick={run}
      className={`cursor-pointer ${
        variant === "default" ? "bg-slate-900 text-white hover:bg-slate-800" : ""
      }`}
    >
      <Printer className="h-3.5 w-3.5" />
      {busy ? "Preparing…" : "Download PDF"}
    </Button>
  );
}
