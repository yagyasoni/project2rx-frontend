"use client";

import { useState } from "react";
import {
  ChevronDown,
  Download,
  FileSpreadsheet,
  FileText,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type ExportKind = "pdf" | "excel" | "csv";

type Props = {
  heading: string;
  onExport: (kind: ExportKind) => Promise<void> | void;
  variant?: "default" | "outline";
};

const OPTIONS: {
  kind: ExportKind;
  title: string;
  hint: string;
  Icon: typeof Printer;
  iconClass: string;
}[] = [
  {
    kind: "pdf",
    title: "PDF",
    hint: "A4 landscape, print-ready with sign-off lines",
    Icon: Printer,
    iconClass: "text-slate-700",
  },
  {
    kind: "excel",
    title: "Excel",
    hint: "Formatted workbook (.xlsx)",
    Icon: FileSpreadsheet,
    iconClass: "text-emerald-600",
  },
  {
    kind: "csv",
    title: "CSV",
    hint: "Raw data, opens anywhere",
    Icon: FileText,
    iconClass: "text-slate-500",
  },
];

export default function ExportMenu({ heading, onExport, variant = "outline" }: Props) {
  const [busy, setBusy] = useState(false);

  const run = async (kind: ExportKind) => {
    setBusy(true);
    try {
      await onExport(kind);
    } finally {
      setBusy(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant={variant}
          disabled={busy}
          className={`cursor-pointer ${
            variant === "default" ? "bg-slate-900 text-white hover:bg-slate-800" : ""
          }`}
        >
          <Download className="h-3.5 w-3.5" />
          {busy ? "Preparing…" : "Download"}
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
          {heading}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {OPTIONS.map(({ kind, title, hint, Icon, iconClass }) => (
          <DropdownMenuItem
            key={kind}
            onClick={() => run(kind)}
            className="cursor-pointer items-start gap-3 py-2"
          >
            <Icon className={`mt-0.5 h-4 w-4 ${iconClass}`} />
            <span className="flex flex-col">
              <span className="text-sm font-medium text-slate-900">{title}</span>
              <span className="text-[11px] text-slate-500">{hint}</span>
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
