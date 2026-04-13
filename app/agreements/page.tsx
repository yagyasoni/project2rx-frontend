"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  ChevronRight,
  FileText,
  PenLine,
  Shield,
  Search,
  X,
  Building2,
  Monitor,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import axios from "axios";

// ─── Step Config ──────────────────────────────────────────────────────────────
interface StepConfig {
  id: number;
  label: string;
  title: string;
  icon: React.ReactNode;
}

const STEPS: StepConfig[] = [
  {
    id: 1,
    label: "NDA",
    title: "Non-Disclosure Agreement",
    icon: <Shield size={14} />,
  },
  {
    id: 2,
    label: "Wholesale",
    title: "Wholesaler File Collection",
    icon: <FileText size={14} />,
  },
  {
    id: 3,
    label: "Release",
    title: "Release Agreement",
    icon: <FileText size={14} />,
  },
  {
    id: 4,
    label: "Suppliers",
    title: "Add Supplier",
    icon: <Building2 size={14} />,
  },
  { id: 5, label: "PMS", title: "Add PMS", icon: <Monitor size={14} /> },
];

// ─── Data ─────────────────────────────────────────────────────────────────────
const ALL_SUPPLIERS = [
  "340B",
  "ABC",
  "AKRON GENERICS",
  "ALPINE HEALTH",
  "ANDA",
  "APD",
  "API",
  "ASTOR DRUGS",
  "AXIA",
  "BIORIDGE",
  "BLUPAX",
  "BONITA",
  "CITYMED",
  "DRUGZONE",
  "EZRIRX",
  "GENETCO",
  "ICS DIRECT",
  "IPC",
  "IPD",
  "KEYSOURCE",
  "KINRAY",
  "LEGACY HEALTH",
  "MAKS PHARMA",
  "MASTERS",
  "MATRIX",
  "MCKESSON",
  "NDC DISTRIBUTORS",
  "NETCOSTRX",
  "OAK DRUGS",
  "PARMED",
  "PAYLESS",
  "PBA HEALTH",
  "PHARMSAVER",
  "PRODIGY",
  "QUALITY CARE",
  "QUEST PHARMACEUTICAL",
  "REAL VALUE RX",
  "RXEED",
  "SAVEBIGRX",
  "SMART SOURCE",
  "SMITH DRUGS",
  "SPECTRUM",
  "STERLING DISTRIBUTOR",
  "TOPRX",
  "TRXADE",
  "TRUMARKER",
  "WELLGISTICS",
];

const ALL_PMS = [
  "PIONEERRX",
  "BESTRX",
  "DIGITALRX",
  "SRS",
  "LIBERTY",
  "DATASCAN",
  "RX30",
  "PRIMERX",
];

// ─── Navbar ───────────────────────────────────────────────────────────────────
const Navbar = ({
  completed,
  total,
  progress,
  pharmacyEmail,
}: {
  completed: number;
  total: number;
  progress: number;
  pharmacyEmail: string;
}) => (
  <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
    <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm overflow-hidden">
          <img
            src="/l.png"
            alt="AuditProRx"
            className="h-9 w-9 object-contain scale-125"
          />
        </div>
        <div className="flex flex-col leading-none">
          <span
            className="font-black text-slate-900 tracking-tight"
            style={{ fontSize: 16, letterSpacing: "-0.04em" }}
          >
            AuditProRx
          </span>
          <span className="text-[9px] text-slate-400 font-semibold tracking-[0.12em] uppercase">
            Agreements Portal
          </span>
        </div>
      </div>

      <div className="hidden md:flex flex-col items-center gap-1.5 flex-1 max-w-xs">
        <div className="flex items-center justify-between w-full">
          <span className="text-[11px] text-slate-400 font-medium">
            Agreement Progress
          </span>
          <span className="text-[11px] font-bold text-slate-700">
            {completed}/{total} Completed
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
          <span className="text-xs font-bold text-slate-600">
            {pharmacyEmail?.[0]?.toUpperCase() || "P"}
          </span>
        </div>
        <div className="hidden sm:flex flex-col leading-none">
          <span className="text-[11px] font-semibold text-slate-700 max-w-[140px] truncate">
            {pharmacyEmail || "pharmacy@email.com"}
          </span>
          <span className="text-[10px] text-slate-400">Pharmacy Owner</span>
        </div>
      </div>
    </div>
  </header>
);

// ─── Shared Doc Atoms ─────────────────────────────────────────────────────────
const DocSection = ({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center gap-2 mb-2.5">
      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-slate-800 text-white text-[10px] font-bold shrink-0">
        {number}
      </span>
      <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
    </div>
    <div className="pl-7">{children}</div>
  </div>
);

const DocSubSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-3">
    <p className="text-xs font-semibold text-slate-700 mb-1.5">• {title}:</p>
    <div className="pl-3">{children}</div>
  </div>
);

const FieldGrid = ({ fields }: { fields: string[] }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
    {fields.map((f) => (
      <div key={f} className="flex items-center gap-1.5 text-xs text-slate-600">
        <span className="h-1 w-1 rounded-full bg-slate-400 shrink-0" />
        {f}
      </div>
    ))}
  </div>
);

const SigRow = ({
  label,
  value,
  isSignature,
  isPending,
}: {
  label: string;
  value: string;
  isSignature?: boolean;
  isPending?: boolean;
}) => (
  <div className="flex items-baseline gap-2 mb-2 text-xs">
    <span className="text-slate-400 w-16 shrink-0">{label}:</span>
    <span
      className={cn(
        "font-medium",
        isSignature && "text-slate-800 text-xl",
        isPending && "text-slate-400 italic",
        !isSignature && !isPending && "text-slate-800",
      )}
      style={
        isSignature
          ? {
              fontFamily: "'Brush Script MT','Dancing Script',cursive",
              letterSpacing: 1,
            }
          : {}
      }
    >
      {value}
    </span>
  </div>
);

const Spinner = () => (
  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

// ─── STEP 1: NDA ──────────────────────────────────────────────────────────────
// const NDAContent = ({
//   pharmacyName,
//   ownerName,
//   signatureName,
// }: {
//   pharmacyName: string;
//   ownerName: string;
//   signatureName: string;
// }) => (
//   <div className="space-y-5 text-sm leading-relaxed text-slate-700">
//     <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-4">
//       <p className="font-bold text-slate-900 text-xs uppercase tracking-widest mb-1.5">
//         AuditProRx Non-Disclosure Agreement
//       </p>
//       <p className="text-slate-600 text-xs leading-relaxed">
//         This Agreement is made between{" "}
//         <span className="font-semibold text-slate-800">Drug Drop Rx LLC</span>{" "}
//         ("we," "us," or "our") and{" "}
//         <span className="font-semibold text-slate-800">{pharmacyName}</span>{" "}
//         ("you" or "your"). By signing, both parties agree to keep the
//         information listed below strictly confidential.
//       </p>
//     </div>
//     <DocSection number="1" title="Confidential Information">
//       <p className="mb-3 text-slate-600">
//         The following information is considered confidential and is protected
//         under this Agreement:
//       </p>
//       <DocSubSection title="Billed Inventory (16 Fields)">
//         <FieldGrid
//           fields={[
//             "NDC Number",
//             "Rx Number",
//             "Status",
//             "Date Filled",
//             "Drug Name",
//             "Quantity",
//             "Package Size",
//             "Primary Insurance Bin Number",
//             "Primary Insurance Paid",
//             "Secondary Insurance BinNumber",
//             "Secondary Insurance Paid",
//             "Primary Insurance PCN",
//             "Primary Insurance Group",
//             "Secondary Insurance PCN ",
//             "Secondary Insurance Group",
//             "Brand",
//           ]}
//         />
//       </DocSubSection>
//       <DocSubSection title="Purchased Invoices (6 Fields)">
//         <FieldGrid
//           fields={[
//             "NDC Number",
//             "Invoice Date",
//             "Item Description",
//             "Quantity",
//             "Unit Price",
//             "Total Price",
//           ]}
//         />
//       </DocSubSection>
//       <DocSubSection title="All Business Communication">
//         <p className="text-slate-600 text-xs">
//           Any communication between you (the pharmacy) and us (AuditProRx).
//         </p>
//       </DocSubSection>
//     </DocSection>
//     <DocSection number="2" title="Scope of Confidentiality">
//       <p className="text-slate-600">
//         Information that is already public, independently developed without
//         reference to this data, or received from another source without breach
//         is not covered under this Agreement.
//       </p>
//     </DocSection>
//     <DocSection number="3" title="Purpose and Use of the Information">
//       <p className="text-slate-600">
//         We will use these fields only to perform the agreed-upon services. We
//         will not disclose this information to anyone else without your approval.
//       </p>
//     </DocSection>
//     <DocSection number="4" title="Security and Confidentiality Obligations">
//       <ul className="space-y-2">
//         {[
//           "All data is stored within your secure pharmacy login account, and only individuals with proper credentials may access it.",
//           "You may delete any generated reports and uploaded data from your account at any time; if you do so, we will remove this data from our systems (unless required by law).",
//           "Each party agrees to use at least the same level of care in protecting the other's confidential information as it uses for its own similar information.",
//         ].map((item, i) => (
//           <li key={i} className="flex gap-2.5 text-slate-600">
//             <span className="mt-0.5 h-4 w-4 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center shrink-0">
//               {i + 1}
//             </span>
//             {item}
//           </li>
//         ))}
//       </ul>
//     </DocSection>
//     <DocSection number="5" title="Consideration">
//       <p className="text-slate-600">
//         In exchange for receiving and using the confidential information, both
//         parties agree to these terms. This mutual exchange of benefits is the
//         consideration that makes this Agreement binding.
//       </p>
//     </DocSection>
//     <DocSection number="6" title="Term and Termination">
//       <p className="text-slate-600">
//         This Agreement starts on the date both parties sign and remains in
//         effect as long as we work together—and for a reasonable period
//         afterward. Either party may request that their confidential information
//         be returned or destroyed, and we will comply unless otherwise required
//         by law.
//       </p>
//     </DocSection>
//     <DocSection number="7" title="Remedies for Breach">
//       <p className="text-slate-600">
//         If either party breaches this Agreement, the non-breaching party may
//         seek injunctive relief (an order to stop the breach) and may recover any
//         damages incurred as a result of the breach.
//       </p>
//     </DocSection>
//     <DocSection number="8" title="Governing Law and Dispute Resolution">
//       <p className="text-slate-600">
//         This Agreement shall be governed by and construed in accordance with the
//         laws of the State of New York. Any disputes arising from this Agreement
//         shall be resolved in the state or federal courts located in New York, or
//         through agreed arbitration in New York, ensuring both parties have a
//         clear forum for resolution.
//       </p>
//     </DocSection>
//     <DocSection number="9" title="Additional Provisions">
//       <div className="space-y-3">
//         {[
//           {
//             term: "Entire Agreement",
//             desc: "This document contains the entire agreement between the parties regarding the confidential information and supersedes all prior understandings or agreements.",
//           },
//           {
//             term: "Severability",
//             desc: "If any part of this Agreement is found to be unenforceable, the remainder will continue in full force.",
//           },
//           {
//             term: "Amendments",
//             desc: "This Agreement can only be modified in writing and signed by both parties.",
//           },
//         ].map(({ term, desc }) => (
//           <div key={term} className="flex gap-2 text-slate-600">
//             <span className="font-semibold text-slate-800 shrink-0">
//               {term}:
//             </span>
//             <span>{desc}</span>
//           </div>
//         ))}
//       </div>
//     </DocSection>
//     <DocSection number="10" title="Signatures">
//       <p className="text-slate-600 mb-4">
//         By signing below, both parties agree to abide by the terms of this
//         Agreement.
//       </p>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
//           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
//             Drug Drop Rx LLC
//           </p>
//           <SigRow label="Name" value="Mr. Fahad Mulla" />
//           <SigRow label="Title" value="CEO" />
//           <SigRow label="Signature" value="Fahad Mulla" isSignature />
//           <SigRow
//             label="Date"
//             value={new Date().toLocaleDateString("en-US", {
//               month: "2-digit",
//               day: "2-digit",
//               year: "numeric",
//             })}
//           />
//         </div>
//         <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 shadow-sm">
//           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
//             {pharmacyName}
//           </p>
//           <SigRow label="Name" value={ownerName || "—"} />
//           <SigRow label="Title" value="OWNER" />
//           <SigRow
//             label="Signature"
//             value={signatureName || "Pending..."}
//             isPending={!signatureName}
//             isSignature={!!signatureName}
//           />
//           <SigRow
//             label="Date"
//             value={new Date().toLocaleDateString("en-US", {
//               month: "2-digit",
//               day: "2-digit",
//               year: "numeric",
//             })}
//           />
//         </div>
//       </div>
//     </DocSection>
//   </div>
// );

const NDAContent = ({
  pharmacyName,
  ownerName,
  signatureName,
}: {
  pharmacyName: string;
  ownerName: string;
  signatureName: string;
}) => (
  <div className="space-y-5 text-sm leading-relaxed text-slate-700">
    <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-4">
      <p className="font-bold text-slate-900 text-xs uppercase tracking-widest mb-1.5">
        AuditProRx Non-Disclosure & Data Usage Agreement
      </p>
      <p className="text-slate-600 text-xs leading-relaxed">
        This Non-Disclosure and Data Usage Agreement ("Agreement") is entered
        into between{" "}
        <span className="font-semibold text-slate-800">Drug Drop Rx LLC</span>{" "}
        ("Company," "we," "us," or "our") and{" "}
        <span className="font-semibold text-slate-800">{pharmacyName}</span>{" "}
        ("Pharmacy," "you," or "your").
      </p>
      <p className="text-slate-600 text-xs leading-relaxed mt-2">
        AuditProRx provides a technology platform designed to assist pharmacies
        in uploading, processing, and analyzing inventory records, supplier
        invoices, and related operational data to generate insights, reports,
        and analytical outputs. By accessing or using the platform, you confirm
        that you have read, understood, and agreed to be legally bound by the
        terms of this Agreement, including the AuditProRx{" "}
        <a
          href="/terms-of-service"
          className="text-emerald-600 underline underline-offset-2 hover:text-emerald-700"
          target="_blank"
          rel="noopener noreferrer"
        >
          Terms of Service
        </a>
        , which are incorporated herein by reference.
      </p>
    </div>

    <DocSection number="1" title="Confidential Information">
      <p className="text-slate-600">
        For purposes of this Agreement, "Confidential Information" includes all
        non-public data disclosed through the platform, including but not
        limited to inventory records, prescription-related data, supplier
        invoices, pricing information, reimbursement data, analytical reports,
        system-generated outputs, and all communications between the Pharmacy
        and AuditProRx. Such information shall be treated as confidential and
        shall not be disclosed to third parties except as permitted under this
        Agreement.
      </p>
    </DocSection>

    <DocSection number="2" title="Data Ownership and License">
      <p className="text-slate-600">
        The Pharmacy retains ownership of the raw data it uploads to the
        platform. However, by submitting such data, the Pharmacy grants
        AuditProRx a perpetual, irrevocable, worldwide, royalty-free, and
        transferable license to use, process, analyze, reproduce, adapt, modify,
        and create derivative works from such data. This license is granted for
        purposes including, but not limited to, providing services, improving
        platform functionality, developing new features, conducting research,
        and supporting analytical or commercial initiatives.
      </p>
      <p className="text-slate-600 mt-3">
        AuditProRx may utilize aggregated or de-identified data derived from
        such submissions for broader analytical, benchmarking, or commercial
        purposes, provided that such use does not directly identify the
        Pharmacy.
      </p>
    </DocSection>

    <DocSection number="3" title="Platform Use and Data Processing">
      <p className="text-slate-600">
        The Pharmacy acknowledges that AuditProRx operates as a data processing
        and analytics platform and that submitted data may be processed,
        transformed, and integrated with internal systems or datasets to
        generate outputs. Such processing may include normalization,
        aggregation, statistical analysis, and automated computation necessary
        for delivering platform functionality and improving system performance.
      </p>
    </DocSection>

    <DocSection number="4" title="Regulatory Compliance">
      <p className="text-slate-600">
        The Pharmacy is solely responsible for ensuring that all data submitted
        to the platform complies with applicable federal, state, and industry
        regulations, including healthcare and data privacy laws. AuditProRx is
        not intended to function as a HIPAA Business Associate unless expressly
        agreed to in a separate written agreement. Accordingly, the Company
        disclaims responsibility for any regulatory obligations associated with
        the Pharmacy’s data.
      </p>
    </DocSection>

    <DocSection number="5" title="Platform Nature and No Warranty">
      <p className="text-slate-600">
        The platform and all associated services are provided on an "as is" and
        "as available" basis. While AuditProRx endeavors to provide accurate and
        reliable outputs, no representations or warranties are made regarding
        the accuracy, completeness, or reliability of any data, reports, or
        analyses generated through the platform.
      </p>
    </DocSection>

    <DocSection number="6" title="Use of Outputs and Independent Judgment">
      <p className="text-slate-600">
        The Pharmacy acknowledges that all outputs, reports, and insights
        generated by the platform are intended solely for informational and
        analytical purposes. The Pharmacy agrees to exercise independent
        professional judgment in interpreting such outputs and shall not rely
        exclusively on them for medical, financial, compliance, or operational
        decisions.
      </p>
    </DocSection>

    <DocSection number="7" title="Security and Data Handling">
      <p className="text-slate-600">
        AuditProRx implements commercially reasonable safeguards designed to
        protect data integrity and confidentiality. However, the Pharmacy
        acknowledges that no system is entirely secure and accepts the inherent
        risks associated with electronic data transmission and storage. The
        Company may retain data, including backups and system logs, as necessary
        for operational continuity, compliance, and service improvement.
      </p>
    </DocSection>

    <DocSection number="8" title="Subscription and Pricing">
      <p className="text-slate-600">
        The current subscription fee for AuditProRx is $99 per month, which
        provides access to core platform features. The Company may introduce
        additional features, services, or pricing structures in the future.
        Continued use of the platform following such changes constitutes
        acceptance of updated pricing.
      </p>
    </DocSection>

    <DocSection number="9" title="Limitation of Liability">
      <p className="text-slate-600">
        To the maximum extent permitted by law, AuditProRx shall not be liable
        for any indirect, incidental, or consequential damages arising from the
        use of the platform, including but not limited to data inaccuracies,
        business interruptions, or regulatory implications. In any event, total
        liability shall not exceed the amount paid by the Pharmacy for one month
        of service immediately preceding the claim.
      </p>
    </DocSection>

    <DocSection number="10" title="Indemnification">
      <p className="text-slate-600">
        The Pharmacy agrees to indemnify and hold harmless AuditProRx and its
        affiliates from any claims, liabilities, or damages arising from the
        Pharmacy’s use of the platform, including data submitted, regulatory
        compliance matters, or third-party claims.
      </p>
    </DocSection>

    <DocSection number="11" title="Dispute Resolution">
      <p className="text-slate-600">
        Any disputes arising out of or relating to this Agreement shall be
        resolved through binding arbitration conducted in the State of New York,
        in accordance with applicable arbitration rules. Each party agrees to
        resolve disputes on an individual basis and waives the right to
        participate in class or collective actions.
      </p>
    </DocSection>

    <DocSection number="12" title="Term and Survival">
      <p className="text-slate-600">
        This Agreement shall remain in effect for the duration of the Pharmacy’s
        use of the platform. Provisions relating to data rights, limitations of
        liability, indemnification, and dispute resolution shall survive
        termination.
      </p>
    </DocSection>

    <DocSection number="13" title="General Provisions">
      <div className="space-y-3">
        {[
          {
            term: "Entire Agreement",
            desc: "This Agreement, together with the Terms of Service, constitutes the complete understanding between the parties.",
          },
          {
            term: "Amendments",
            desc: "AuditProRx may update this Agreement from time to time. Continued use implies acceptance.",
          },
          {
            term: "Severability",
            desc: "If any provision is invalid, the remainder remains in effect.",
          },
          {
            term: "Governing Law",
            desc: "This Agreement is governed by the laws of the State of New York.",
          },
        ].map(({ term, desc }) => (
          <div key={term} className="flex gap-2 text-slate-600">
            <span className="font-semibold text-slate-800 shrink-0">
              {term}:
            </span>
            <span>{desc}</span>
          </div>
        ))}
      </div>
    </DocSection>

    <DocSection number="14" title="Signatures">
      <p className="text-slate-600 mb-4">
        By signing below, both parties agree to the terms of this Agreement.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            Drug Drop Rx LLC
          </p>
          <SigRow label="Name" value="Mr. Fahad Mulla" />
          <SigRow label="Title" value="CEO" />
          <SigRow label="Signature" value="Fahad Mulla" isSignature />
          <SigRow
            label="Date"
            value={new Date().toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            })}
          />
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
            {pharmacyName}
          </p>
          <SigRow label="Name" value={ownerName || "—"} />
          <SigRow label="Title" value="OWNER" />
          <SigRow
            label="Signature"
            value={signatureName || "Pending..."}
            isPending={!signatureName}
            isSignature={!!signatureName}
          />
          <SigRow
            label="Date"
            value={new Date().toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "numeric",
            })}
          />
        </div>
      </div>
    </DocSection>
  </div>
);

// ─── STEP 2: Wholesaler ───────────────────────────────────────────────────────
const DOWNLOAD_ONLINE = [
  "KINRAY",
  "MCKESSON",
  "ABC",
  "SMART SOURCE",
  "TRXADE",
  "EZRIRX",
  "ANDA",
];
const ON_REQUEST_EMAIL = [
  "AKRON GENERICS",
  "ALPINE HEALTH",
  "AXIA",
  "BIORIDGE",
  "BLUPAX",
  "BONITA",
  "CITYMED",
  "DRUGZONE",
  "GENETCO",
  "ICS DIRECT",
  "IPC",
  "IPD",
  "KEYSOURCE",
  "LEGACY HEALTH",
  "MAKS PHARMA",
  "MASTERS",
  "MATRIX",
  "NDC DISTRIBUTORS",
  "NETCOSTRX",
  "OAK DRUGS",
  "PARMED",
  "PAYLESS",
  "PBA HEALTH",
  "PHARMSAVER",
  "PRODIGY",
  "QUALITY CARE",
  "QUEST PHARMACEUTICAL",
  "REAL VALUE RX",
  "RXEED",
  "SAVEBIGRX",
  "SMITH DRUGS",
  "SPECTRUM",
  "STERLING DISTRIBUTOR",
  "TOPRX",
  "TRUMARKER",
  "WELLGISTICS",
];

const WholesalerContent = () => (
  <div className="space-y-5 text-sm">
    <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-4">
      <p className="font-bold text-slate-900 text-xs uppercase tracking-widest mb-1.5">
        Before proceeding with the Release Agreement
      </p>
      <p className="font-semibold text-slate-800 text-sm">
        Would you like us to help collect your secondary wholesaler files?
      </p>
    </div>
    <div className="rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3.5 text-xs text-slate-600 leading-relaxed">
      We currently do this for over{" "}
      <span className="font-semibold text-slate-800">
        80% of the pharmacies
      </span>{" "}
      we work with. We do this by creating a dedicated pharmacy AuditProRx email
      like{" "}
      <span className="font-bold text-slate-800 uppercase">
        EXAMPLEPHARMACY@AUDITPRORX.COM
      </span>{" "}
      and we use that to collect your secondary wholesalers every month.
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Download Online
          </p>
        </div>
        <ul className="space-y-1.5">
          {DOWNLOAD_ONLINE.map((name) => (
            <li
              key={name}
              className="flex items-center gap-2 text-xs text-slate-700 font-medium"
            >
              <span className="h-1 w-1 rounded-full bg-emerald-400 shrink-0" />
              {name}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            On Request via Email
          </p>
        </div>
        <ul className="columns-2 space-y-1.5">
          {ON_REQUEST_EMAIL.map((name) => (
            <li
              key={name}
              className="flex items-center gap-1.5 text-xs text-slate-700 font-medium break-inside-avoid mb-1.5"
            >
              <span className="h-1 w-1 rounded-full bg-blue-400 shrink-0" />
              {name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

// ─── STEP 3: Release Agreement ────────────────────────────────────────────────
// const ReleaseAgreementContent = ({
//   pharmacyName,
//   ownerName,
//   wholesalerAccepted,
//   signatureName,
// }: {
//   pharmacyName: string;
//   ownerName: string;
//   wholesalerAccepted: boolean;
//   signatureName: string;
// }) => {
//   const today = new Date().toLocaleDateString("en-US", {
//     month: "2-digit",
//     day: "2-digit",
//     year: "numeric",
//   });
//   return (
//     <div className="space-y-5 text-sm leading-relaxed text-slate-700">
//       {wholesalerAccepted && (
//         <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
//           <CheckCircle2
//             size={15}
//             className="text-emerald-600 mt-0.5 shrink-0"
//           />
//           <p className="text-xs text-emerald-800 font-medium leading-relaxed">
//             You've chosen to have AuditProRx help collect your secondary
//             wholesaler files. This will be included in the terms of this
//             agreement.
//           </p>
//         </div>
//       )}
//       <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-4">
//         <p className="font-bold text-slate-900 text-xs uppercase tracking-widest mb-1.5">
//           Release and Authorization Agreement
//         </p>
//         <p className="text-slate-600 text-xs leading-relaxed">
//           This Release and Authorization Agreement ("Agreement") is entered into
//           by and between:
//         </p>
//         <div className="mt-2 space-y-1 text-xs text-slate-600">
//           <p>
//             1.{" "}
//             <span className="font-semibold text-slate-800">{pharmacyName}</span>{" "}
//             (hereinafter referred to as "Pharmacy"), and
//           </p>
//           <p>
//             2.{" "}
//             <span className="font-semibold text-slate-800">
//               Drug Drop Rx LLC
//             </span>
//             , a New York limited liability company (hereinafter referred to as
//             "AuditProRx").
//           </p>
//         </div>
//         <p className="text-xs text-slate-600 mt-2">
//           <span className="font-semibold text-slate-800">Effective Date:</span>{" "}
//           {today}
//         </p>
//       </div>
//       <DocSection number="1" title="Purpose">
//         <p className="text-slate-600">
//           Pharmacy desires to authorize AuditProRx to act on its behalf to
//           communicate with and obtain specific records from its pharmacy
//           wholesaler(s). By signing this Agreement, Pharmacy grants AuditProRx
//           the limited authority to request, receive, and review the documents
//           outlined in Section 2, subject to the terms and conditions stated
//           below. These records will be used to run monthly internal audits for
//           the Pharmacy using AuditProRx's internal audit platform.
//         </p>
//       </DocSection>
//       <DocSection number="2" title="Scope of Authorization">
//         <div className="space-y-3 text-slate-600 text-xs">
//           {[
//             {
//               t: "Contact Pharmacy Wholesaler(s):",
//               d: "AuditProRx is authorized to communicate with one or more of Pharmacy's designated wholesalers on behalf of Pharmacy.",
//             },
//             {
//               t: "Request Documentation:",
//               d: "AuditProRx is authorized to request, on a monthly, quarterly, and annual basis, the necessary statements and invoices from such wholesalers for the purpose of performing internal audits for Pharmacy.",
//             },
//           ].map(({ t, d }, i) => (
//             <div key={i}>
//               <p className="font-semibold text-slate-800 mb-1">
//                 {i + 1}. {t}
//               </p>
//               <p className="pl-3">{d}</p>
//             </div>
//           ))}
//           <div>
//             <p className="font-semibold text-slate-800 mb-1">
//               3. Format & Required Fields:
//             </p>
//             <p className="pl-3 mb-1.5">
//               Pharmacy authorizes AuditProRx to request purchase invoices in{" "}
//               <span className="font-semibold">CSV or Excel format</span>{" "}
//               including: NDC Number, Invoice Date, Item Description, Quantity,
//               Unit Price, Total Price.
//             </p>
//           </div>
//           <div>
//             <p className="font-semibold text-slate-800 mb-1">
//               4. Obtain and Review Records:
//             </p>
//             <p className="pl-3">
//               AuditProRx may receive and review these statements, invoices, and
//               related records to assist Pharmacy with its internal audit
//               processes.
//             </p>
//           </div>
//         </div>
//       </DocSection>
//       <DocSection number="3" title="Limitations of Authority">
//         <div className="space-y-3 text-slate-600 text-xs">
//           {[
//             {
//               t: "No Broader Authority:",
//               d: "AuditProRx's authority is strictly limited to requesting and receiving the specified documents. AuditProRx shall not enter into any agreements or financial obligations on behalf of Pharmacy beyond what is necessary to obtain and review the authorized documentation.",
//             },
//             {
//               t: "Third Parties' Reliance:",
//               d: "Pharmacy acknowledges that wholesalers and other relevant third parties may rely on this signed Agreement as evidence of AuditProRx's authority to act on Pharmacy's behalf regarding the aforementioned documents and information.",
//             },
//             {
//               t: "Compliance with Law:",
//               d: "AuditProRx shall comply with all applicable laws, regulations, and industry standards governing the handling of Pharmacy's confidential information.",
//             },
//           ].map(({ t, d }, i) => (
//             <div key={i}>
//               <p className="font-semibold text-slate-800 mb-1">
//                 {i + 1}. {t}
//               </p>
//               <p className="pl-3">{d}</p>
//             </div>
//           ))}
//         </div>
//       </DocSection>
//       <DocSection number="4" title="Confidentiality">
//         <div className="space-y-3 text-slate-600 text-xs">
//           {[
//             {
//               t: "Protected Information:",
//               d: "All statements, invoices, and other records obtained under this Agreement may include confidential or proprietary information about Pharmacy.",
//             },
//             {
//               t: "Obligations:",
//               d: "AuditProRx shall treat any information received in the course of performing services under this Agreement as confidential and shall use this information only for the limited purpose authorized by Pharmacy.",
//             },
//             {
//               t: "Data Security:",
//               d: "AuditProRx shall maintain administrative, technical, and physical safeguards to protect confidential information from accidental or unlawful destruction, loss, or unauthorized access.",
//             },
//           ].map(({ t, d }, i) => (
//             <div key={i}>
//               <p className="font-semibold text-slate-800 mb-1">
//                 {i + 1}. {t}
//               </p>
//               <p className="pl-3">{d}</p>
//             </div>
//           ))}
//         </div>
//       </DocSection>
//       <DocSection number="5" title="Indemnification">
//         <div className="space-y-3 text-slate-600 text-xs">
//           <div>
//             <p className="font-semibold text-slate-800 mb-1">
//               1. Indemnification by Pharmacy:
//             </p>
//             <p className="pl-3">
//               Pharmacy agrees to indemnify, defend, and hold harmless
//               AuditProRx, its officers, directors, employees, and agents from
//               and against any and all claims, damages, liabilities, costs, and
//               expenses arising out of or related to any misleading information
//               provided by Pharmacy or Pharmacy's failure to obtain necessary
//               consents to release information.
//             </p>
//           </div>
//           <div>
//             <p className="font-semibold text-slate-800 mb-1">
//               2. Indemnification by AuditProRx:
//             </p>
//             <p className="pl-3">
//               AuditProRx agrees to indemnify, defend, and hold harmless
//               Pharmacy, its officers, directors, employees, and agents from and
//               against any and all claims, damages, liabilities, costs, and
//               expenses arising out of or related to AuditProRx's wrongful use or
//               disclosure of Pharmacy's confidential information or breach of
//               this Agreement.
//             </p>
//           </div>
//         </div>
//       </DocSection>
//       <DocSection number="6" title="Term and Termination">
//         <div className="space-y-3 text-slate-600 text-xs">
//           <div>
//             <p className="font-semibold text-slate-800 mb-1">1. Term:</p>
//             <p className="pl-3">
//               This Agreement shall commence on {today} and shall continue until
//               terminated as provided herein.
//             </p>
//           </div>
//           <div>
//             <p className="font-semibold text-slate-800 mb-1">2. Termination:</p>
//             <p className="pl-3">
//               Either party may terminate this Agreement at any time by providing
//               30 days' written notice to the other party.
//             </p>
//           </div>
//           <div>
//             <p className="font-semibold text-slate-800 mb-1">3. Survival:</p>
//             <p className="pl-3">
//               Notwithstanding any termination of this Agreement, the obligations
//               of confidentiality and indemnification herein shall survive the
//               termination of this Agreement.
//             </p>
//           </div>
//         </div>
//       </DocSection>
//       <DocSection number="7" title="Governing Law and Dispute Resolution">
//         <p className="text-slate-600">
//           This Agreement shall be governed by and construed in accordance with
//           the laws of the State of New York. Any dispute arising from or
//           relating to this Agreement shall be resolved through mediation or
//           arbitration in accordance with the rules of AAA then in effect.
//         </p>
//       </DocSection>
//       <DocSection number="8" title="Entire Agreement and Amendments">
//         <p className="text-slate-600">
//           This Agreement constitutes the entire understanding and agreement
//           between the parties regarding the subject matter herein and supersedes
//           all prior or contemporaneous understandings. No amendment to this
//           Agreement shall be valid unless made in writing and signed by both
//           parties.
//         </p>
//       </DocSection>
//       <DocSection number="9" title="Severability">
//         <p className="text-slate-600">
//           If any provision of this Agreement is found to be invalid, illegal, or
//           unenforceable by a court of competent jurisdiction, the remaining
//           provisions shall remain in full force and effect.
//         </p>
//       </DocSection>
//       <DocSection number="10" title="Counterparts and Electronic Signatures">
//         <p className="text-slate-600 mb-3">
//           This Agreement may be executed in one or more counterparts. A signed
//           copy delivered by email or electronic signature shall have the same
//           legal effect as delivery of an original signed copy.
//         </p>
//         <p className="text-xs font-semibold text-slate-700 mb-4">
//           IN WITNESS WHEREOF, the parties have executed this Agreement as of the
//           Effective Date first written above.
//         </p>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
//               Drug Drop Rx LLC
//             </p>
//             <SigRow label="Name" value="Mr. Fahad Mulla" />
//             <SigRow label="Title" value="CEO" />
//             <SigRow label="Signature" value="Fahad Mulla" isSignature />
//             <SigRow label="Date" value={today} />
//           </div>
//           <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 shadow-sm">
//             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
//               {pharmacyName}
//             </p>
//             <SigRow label="Name" value={ownerName || "—"} />
//             <SigRow label="Title" value="OWNER" />
//             <SigRow
//               label="Signature"
//               value={signatureName || "Pending..."}
//               isPending={!signatureName}
//               isSignature={!!signatureName}
//             />
//             <SigRow label="Date" value={today} />
//           </div>
//         </div>
//       </DocSection>
//     </div>
//   );
// };

const ReleaseAgreementContent = ({
  pharmacyName,
  ownerName,
  wholesalerAccepted,
  signatureName,
}: {
  pharmacyName: string;
  ownerName: string;
  wholesalerAccepted: boolean;
  signatureName: string;
}) => {
  const today = new Date().toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  return (
    <div className="space-y-5 text-sm leading-relaxed text-slate-700">
      {wholesalerAccepted && (
        <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
          <CheckCircle2
            size={15}
            className="text-emerald-600 mt-0.5 shrink-0"
          />
          <p className="text-xs text-emerald-800 font-medium leading-relaxed">
            You've chosen to have AuditProRx assist in collecting wholesaler
            records on your behalf. This authorization is incorporated into this
            Agreement.
          </p>
        </div>
      )}

      <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-4">
        <p className="font-bold text-slate-900 text-xs uppercase tracking-widest mb-1.5">
          Release and Authorization Agreement
        </p>
        <p className="text-slate-600 text-xs leading-relaxed">
          This Agreement is entered into between{" "}
          <span className="font-semibold text-slate-800">{pharmacyName}</span>{" "}
          ("Pharmacy") and{" "}
          <span className="font-semibold text-slate-800">Drug Drop Rx LLC</span>{" "}
          ("AuditProRx").
        </p>
        <p className="text-xs text-slate-600 mt-2">
          <span className="font-semibold text-slate-800">Effective Date:</span>{" "}
          {today}
        </p>
      </div>

      <DocSection number="1" title="Purpose and Authorization">
        <p className="text-slate-600">
          Pharmacy authorizes AuditProRx to act as its authorized representative
          for the limited purpose of communicating with designated pharmacy
          wholesalers and obtaining relevant transactional records, including
          invoices, purchase histories, and related documentation. This
          authorization is granted to facilitate data collection,
          reconciliation, analytics, and audit-related services provided through
          the AuditProRx platform.
        </p>
      </DocSection>

      <DocSection number="2" title="Scope of Authority and Data Handling">
        <p className="text-slate-600">
          Pharmacy authorizes AuditProRx to request, receive, store, process,
          and analyze wholesaler records in electronic formats, including but
          not limited to CSV and Excel files containing standard invoice data
          fields such as NDC number, invoice date, item description, quantity,
          unit price, and total price. AuditProRx may utilize such data within
          its systems for purposes including audit generation, reconciliation,
          reporting, analytics, and continuous platform improvement.
        </p>
        <p className="text-slate-600 mt-3">
          Pharmacy acknowledges that such data may be normalized, aggregated, or
          integrated with internal systems to enable automated workflows and
          enhanced analytical outputs.
        </p>
      </DocSection>

      <DocSection number="3" title="Limitations and Third-Party Reliance">
        <p className="text-slate-600">
          AuditProRx shall not enter into financial agreements or obligations on
          behalf of Pharmacy. However, Pharmacy acknowledges that wholesalers
          and third parties may rely on this Agreement as sufficient
          authorization for AuditProRx to request and obtain the specified
          records.
        </p>
      </DocSection>

      <DocSection number="4" title="Use of Data and Platform Outputs">
        <p className="text-slate-600">
          Pharmacy acknowledges that data collected under this Agreement will be
          used within the AuditProRx platform to generate reports, analytics,
          and insights. Such outputs are intended for informational purposes and
          should be interpreted using independent professional judgment. The
          Pharmacy remains solely responsible for decisions made based on such
          outputs.
        </p>
      </DocSection>

      <DocSection number="5" title="Confidentiality and Security">
        <p className="text-slate-600">
          AuditProRx will apply commercially reasonable safeguards to protect
          the confidentiality of records obtained under this Agreement. However,
          Pharmacy acknowledges that no system is entirely secure and accepts
          the inherent risks associated with electronic data handling.
        </p>
      </DocSection>

      <DocSection number="6" title="No Warranty and Service Nature">
        <p className="text-slate-600">
          All services are provided on an "as is" and "as available" basis.
          AuditProRx does not guarantee the completeness, accuracy, or
          availability of any records obtained or outputs generated through its
          platform.
        </p>
      </DocSection>

      <DocSection number="7" title="Limitation of Liability">
        <p className="text-slate-600">
          To the fullest extent permitted by law, AuditProRx shall not be liable
          for any indirect or consequential damages arising from the use of this
          authorization, including issues related to data accuracy, delays in
          retrieval, or third-party actions. Any liability shall be limited to
          the fees paid for the most recent month of service.
        </p>
      </DocSection>

      <DocSection number="8" title="Indemnification">
        <p className="text-slate-600">
          Pharmacy agrees to indemnify and hold harmless AuditProRx from any
          claims or liabilities arising out of the authorization granted herein,
          including claims related to data access permissions, third-party
          disclosures, or regulatory obligations.
        </p>
      </DocSection>

      <DocSection number="9" title="Term and Termination">
        <p className="text-slate-600">
          This Agreement shall remain effective until revoked in writing by the
          Pharmacy. Notwithstanding termination, provisions relating to
          liability, indemnification, and data handling shall survive.
        </p>
      </DocSection>

      <DocSection number="10" title="Dispute Resolution">
        <p className="text-slate-600">
          Any disputes arising from this Agreement shall be resolved through
          binding arbitration in the State of New York. The parties agree to
          resolve disputes on an individual basis and waive participation in
          class or collective actions.
        </p>
      </DocSection>

      <DocSection number="11" title="General Provisions">
        <p className="text-slate-600">
          This Agreement constitutes the entire understanding between the
          parties regarding its subject matter and may be updated by AuditProRx
          from time to time. Continued use of the platform constitutes
          acceptance of such updates. If any provision is held unenforceable,
          the remaining provisions shall remain in effect.
        </p>
      </DocSection>

      <DocSection number="12" title="Execution">
        <p className="text-slate-600 mb-3">
          This Agreement may be executed electronically and shall be legally
          binding upon execution.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Drug Drop Rx LLC
            </p>
            <SigRow label="Name" value="Mr. Fahad Mulla" />
            <SigRow label="Title" value="CEO" />
            <SigRow label="Signature" value="Fahad Mulla" isSignature />
            <SigRow label="Date" value={today} />
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              {pharmacyName}
            </p>
            <SigRow label="Name" value={ownerName || "—"} />
            <SigRow label="Title" value="OWNER" />
            <SigRow
              label="Signature"
              value={signatureName || "Pending..."}
              isPending={!signatureName}
              isSignature={!!signatureName}
            />
            <SigRow label="Date" value={today} />
          </div>
        </div>
      </DocSection>
    </div>
  );
};

// ─── STEP 4: Add Supplier ─────────────────────────────────────────────────────
const SupplierStep = ({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (name: string) => void;
}) => {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      ALL_SUPPLIERS.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-4">
        <p className="font-bold text-slate-900 text-sm mb-0.5">Suppliers</p>
        <p className="text-xs text-slate-500">
          Please add at least one supplier to continue
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Left — searchable list */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Search */}
          <div className="px-3 py-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
              <Search size={13} className="text-slate-400 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search suppliers..."
                className="flex-1 bg-transparent text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none"
              />
              {query && (
                <button onClick={() => setQuery("")}>
                  <X size={12} className="text-slate-400" />
                </button>
              )}
            </div>
          </div>
          {/* Table header */}
          <div className="grid grid-cols-[32px_1fr_48px] px-3 py-2 border-b border-slate-100 bg-slate-50">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              #
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Supplier Name
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Select
            </span>
          </div>
          {/* Rows */}
          <div
            className="max-h-64 overflow-y-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#e2e8f0 transparent",
            }}
          >
            {filtered.map((name, i) => {
              const isChecked = selected.includes(name);
              return (
                <div
                  key={name}
                  onClick={() => onToggle(name)}
                  className={cn(
                    "grid grid-cols-[32px_1fr_48px] px-3 py-2.5 cursor-pointer transition-colors border-b border-slate-50 last:border-0",
                    isChecked ? "bg-emerald-50/60" : "hover:bg-slate-50",
                  )}
                >
                  <span className="text-[11px] text-slate-400">{i + 1}</span>
                  <span className="text-xs font-medium text-slate-700">
                    {name}
                  </span>
                  <div className="flex justify-center items-center">
                    <div
                      className={cn(
                        "h-4 w-4 rounded border-2 flex items-center justify-center transition-all",
                        isChecked
                          ? "bg-emerald-500 border-emerald-500"
                          : "border-slate-300",
                      )}
                    >
                      {isChecked && (
                        <svg
                          viewBox="0 0 10 8"
                          fill="none"
                          className="w-2.5 h-2"
                        >
                          <path
                            d="M1 4l3 3 5-6"
                            stroke="white"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400">
                No suppliers found
              </div>
            )}
          </div>
        </div>

        {/* Right — selected panel */}
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Suppliers Selected{" "}
              {selected.length > 0 && (
                <span className="ml-1.5 bg-emerald-100 text-emerald-700 rounded-full px-1.5 py-0.5 text-[9px]">
                  {selected.length}
                </span>
              )}
            </p>
          </div>
          <div
            className="max-h-72 overflow-y-auto p-2"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#e2e8f0 transparent",
            }}
          >
            {selected.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-xs text-slate-400">
                  No suppliers selected yet
                </p>
                <p className="text-[11px] text-slate-300 mt-1">
                  Select from the list on the left
                </p>
              </div>
            ) : (
              <ul className="space-y-1">
                {selected.map((name) => (
                  <li
                    key={name}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-100"
                  >
                    <span className="text-xs font-semibold text-emerald-800">
                      {name}
                    </span>
                    <button
                      onClick={() => onToggle(name)}
                      className="text-emerald-400 hover:text-emerald-600 transition-colors shrink-0"
                    >
                      <X size={13} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── STEP 5: Add PMS ──────────────────────────────────────────────────────────
const PMSStep = ({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (name: string) => void;
}) => {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => ALL_PMS.filter((p) => p.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 border border-slate-200 rounded-lg px-5 py-4">
        <p className="font-bold text-slate-900 text-sm mb-0.5">PMS List</p>
        <p className="text-xs text-slate-500">
          Please add at least one PMS to continue
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden max-w-md mx-auto">
        {/* Search */}
        <div className="px-3 py-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
            <Search size={13} className="text-slate-400 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search PMS..."
              className="flex-1 bg-transparent text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")}>
                <X size={12} className="text-slate-400" />
              </button>
            )}
          </div>
        </div>
        {/* Table header */}
        <div className="grid grid-cols-[32px_1fr_48px] px-3 py-2 border-b border-slate-100 bg-slate-50">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            #
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            PMS
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
            Select
          </span>
        </div>
        {/* Rows */}
        <div
          className="max-h-72 overflow-y-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#e2e8f0 transparent",
          }}
        >
          {filtered.map((name, i) => {
            const isChecked = selected.includes(name);
            return (
              <div
                key={name}
                onClick={() => onToggle(name)}
                className={cn(
                  "grid grid-cols-[32px_1fr_48px] px-3 py-2.5 cursor-pointer transition-colors border-b border-slate-50 last:border-0",
                  isChecked ? "bg-emerald-50/60" : "hover:bg-slate-50",
                )}
              >
                <span className="text-[11px] text-slate-400">{i + 1}</span>
                <span className="text-xs font-medium text-slate-700">
                  {name}
                </span>
                <div className="flex justify-center items-center">
                  <div
                    className={cn(
                      "h-4 w-4 rounded border-2 flex items-center justify-center transition-all",
                      isChecked
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-slate-300",
                    )}
                  >
                    {isChecked && (
                      <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2">
                        <path
                          d="M1 4l3 3 5-6"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map((name) => (
            <span
              key={name}
              className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full"
            >
              {name}
              <button
                onClick={() => onToggle(name)}
                className="text-emerald-400 hover:text-emerald-600"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const AgreementsPage = () => {
  const router = useRouter();

  const [pharmacyName, setPharmacyName] = useState("Your Pharmacy");
  const [pharmacyEmail, setPharmacyEmail] = useState("");
  const [ownerName, setOwnerName] = useState("");

  useEffect(() => {
    setPharmacyName(localStorage.getItem("pharmacyName") || "Your Pharmacy");
    setPharmacyEmail(localStorage.getItem("userEmail") || "");
    setOwnerName(
      localStorage.getItem("ownerName") ||
        localStorage.getItem("signupName") || // ← ADD THIS
        "",
    );
  }, []);

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [agreed, setAgreed] = useState(false);
  const [signatureName, setSignatureName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wholesalerAccepted, setWholesalerAccepted] = useState(false);
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [selectedPMS, setSelectedPMS] = useState<string[]>([]);
  const documentRef = useRef<HTMLDivElement>(null);

  const totalSteps = STEPS.length;
  const progress = (completedSteps.length / totalSteps) * 100;
  const isNDAStep = currentStep === 1;
  const isWholesalerStep = currentStep === 2;
  const isSupplierStep = currentStep === 4;
  const isPMSStep = currentStep === 5;

  const canProceed = (() => {
    if (isNDAStep) return agreed && signatureName.trim().length > 2;
    if (isWholesalerStep) return true;
    if (isSupplierStep) return selectedSuppliers.length > 0;
    if (isPMSStep) return selectedPMS.length > 0;
    return true;
  })();

  const toggleSupplier = (name: string) =>
    setSelectedSuppliers((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name],
    );

  const togglePMS = (name: string) =>
    setSelectedPMS((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name],
    );

  // const advance = async (wholesalerChoice?: boolean) => {
  //   setIsSubmitting(true);
  const advance = async (wholesalerChoice?: boolean) => {
    setIsSubmitting(true);

    // ✅ Save selected suppliers to DB when completing Step 4
    if (isSupplierStep && selectedSuppliers.length > 0) {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          await axios.post(
            `https://api.auditprorx.com
/api/user-suppliers/${userId}`,
            {
              supplierNames: selectedSuppliers,
            },
          );
          console.log("✅ Suppliers saved to DB:", selectedSuppliers);
        }
      } catch (err) {
        console.error("Failed to save suppliers:", err);
      }
    }
    await new Promise((r) => setTimeout(r, 600));
    if (isWholesalerStep && wholesalerChoice !== undefined)
      setWholesalerAccepted(wholesalerChoice);
    setCompletedSteps((prev) => [...new Set([...prev, currentStep])]);

    if (currentStep < totalSteps) {
      setCurrentStep((s) => s + 1);
      setAgreed(false);
      documentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast.success("All steps completed! Redirecting to login...");
      await new Promise((r) => setTimeout(r, 1000));
      router.push("/auth");
    }
    setIsSubmitting(false);
  };

  const handleDownloadNDA = async () => {
    const { jsPDF } = await import("jspdf");
    const today = new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 50;
    const contentWidth = pageWidth - margin * 2;
    let y = 50;

    const checkPageBreak = (needed = 20) => {
      if (y + needed > pageHeight - 50) {
        doc.addPage();
        y = 50;
      }
    };

    const drawLine = () => {
      checkPageBreak(10);
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y, pageWidth - margin, y);
      y += 12;
    };

    const addText = (
      text: string,
      size: number,
      bold = false,
      color: [number, number, number] = [30, 30, 30],
      indent = 0,
    ) => {
      doc.setFontSize(size);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setTextColor(...color);
      const lines = doc.splitTextToSize(text, contentWidth - indent);
      lines.forEach((line: string) => {
        checkPageBreak(size + 6);
        doc.text(line, margin + indent, y);
        y += size + 6;
      });
    };

    const addSection = (num: string, title: string, body: string) => {
      checkPageBreak(40);
      y += 6;
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 15, 15);
      doc.text(`${num}. ${title.toUpperCase()}`, margin, y);
      y += 16;
      addText(body, 9, false, [80, 80, 80], 10);
      y += 4;
    };

    // ── Header ──────────────────────────────────────────────────────────────────
    // Dark header bar
    doc.setFillColor(15, 15, 15);
    doc.roundedRect(margin, y - 10, contentWidth, 52, 6, 6, "F");
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("NON-DISCLOSURE AGREEMENT", margin + 16, y + 14);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 180, 180);
    doc.text(
      "Drug Drop Rx LLC  ·  Confidential & Legally Binding",
      margin + 16,
      y + 30,
    );
    y += 62;

    // Meta info row
    doc.setFillColor(248, 249, 251);
    doc.roundedRect(margin, y, contentWidth, 36, 4, 4, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(120, 120, 120);
    const cols = [
      { label: "PHARMACY", value: pharmacyName },
      { label: "OWNER", value: ownerName || "—" },
      { label: "DATE", value: today },
    ];
    cols.forEach((col, i) => {
      const x = margin + 12 + i * (contentWidth / 3);
      doc.text(col.label, x, y + 13);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(30, 30, 30);
      doc.text(col.value, x, y + 26);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(120, 120, 120);
    });
    y += 48;

    // Intro
    addText(
      `This Agreement is made between Drug Drop Rx LLC ("we," "us," or "our") and ${pharmacyName} ("you" or "your"). By signing, both parties agree to keep the information listed below strictly confidential.`,
      9,
      false,
      [80, 80, 80],
    );
    y += 4;
    drawLine();

    // ── Sections ────────────────────────────────────────────────────────────────
    addSection(
      "1",
      "Confidential Information",
      "The following information is considered confidential and is protected under this Agreement:\n\n• Billed Inventory (16 Fields): NDC Number, Rx Number, Status, Date Filled, Drug Name, Quantity, Package Size, Primary Insurance Bin Number, Primary Insurance Paid, Secondary Insurance BinNumber, Secondary Insurance Paid, Primary Insurance PCN, Primary Insurance Group, Secondary Insurance PCN, Secondary Insurance Group, Brand.\n\n• Purchased Invoices (6 Fields): NDC Number, Invoice Date, Item Description, Quantity, Unit Price, Total Price.\n\n• All Business Communication between you (the pharmacy) and us (AuditProRx).",
    );

    addSection(
      "2",
      "Scope of Confidentiality",
      "Information that is already public, independently developed without reference to this data, or received from another source without breach is not covered under this Agreement.",
    );

    addSection(
      "3",
      "Purpose and Use of the Information",
      "We will use these fields only to perform the agreed-upon services. We will not disclose this information to anyone else without your approval.",
    );

    addSection(
      "4",
      "Security and Confidentiality Obligations",
      "1. All data is stored within your secure pharmacy login account, and only individuals with proper credentials may access it.\n2. You may delete any generated reports and uploaded data from your account at any time; if you do so, we will remove this data from our systems (unless required by law).\n3. Each party agrees to use at least the same level of care in protecting the other's confidential information as it uses for its own similar information.",
    );

    addSection(
      "5",
      "Consideration",
      "In exchange for receiving and using the confidential information, both parties agree to these terms. This mutual exchange of benefits is the consideration that makes this Agreement binding.",
    );

    addSection(
      "6",
      "Term and Termination",
      "This Agreement starts on the date both parties sign and remains in effect as long as we work together—and for a reasonable period afterward. Either party may request that their confidential information be returned or destroyed, and we will comply unless otherwise required by law.",
    );

    addSection(
      "7",
      "Remedies for Breach",
      "If either party breaches this Agreement, the non-breaching party may seek injunctive relief (an order to stop the breach) and may recover any damages incurred as a result of the breach.",
    );

    addSection(
      "8",
      "Governing Law and Dispute Resolution",
      "This Agreement shall be governed by and construed in accordance with the laws of the State of New York. Any disputes arising from this Agreement shall be resolved in the state or federal courts located in New York, or through agreed arbitration in New York.",
    );

    addSection(
      "9",
      "Additional Provisions",
      "Entire Agreement: This document contains the entire agreement between the parties regarding the confidential information and supersedes all prior understandings or agreements.\n\nSeverability: If any part of this Agreement is found to be unenforceable, the remainder will continue in full force.\n\nAmendments: This Agreement can only be modified in writing and signed by both parties.",
    );

    // ── Signatures ──────────────────────────────────────────────────────────────
    checkPageBreak(180);
    y += 8;
    drawLine();
    addText("10. SIGNATURES", 10, true, [15, 15, 15]);
    addText(
      "By signing below, both parties agree to abide by the terms of this Agreement.",
      9,
      false,
      [80, 80, 80],
    );
    y += 10;

    const sigBoxW = (contentWidth - 16) / 2;
    const sigBoxH = 110;

    // AuditProRx box
    doc.setFillColor(248, 249, 251);
    doc.setDrawColor(220, 220, 220);
    doc.roundedRect(margin, y, sigBoxW, sigBoxH, 4, 4, "FD");

    // Pharmacy box
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(167, 243, 208);
    doc.roundedRect(margin + sigBoxW + 16, y, sigBoxW, sigBoxH, 4, 4, "FD");

    // AuditProRx sig content
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(120, 120, 120);
    doc.text("Drug Drop Rx LLC", margin + 12, y + 16);

    const sigRows = [
      { label: "Name", value: "Mr. Fahad Mulla" },
      { label: "Title", value: "CEO" },
      { label: "Date", value: today },
    ];
    sigRows.forEach((row, i) => {
      const rowY = y + 30 + i * 18;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(150, 150, 150);
      doc.text(row.label + ":", margin + 12, rowY);
      doc.setTextColor(30, 30, 30);
      doc.text(row.value, margin + 44, rowY);
    });

    // Fahad signature (cursive-style)
    doc.setFontSize(18);
    doc.setFont("helvetica", "bolditalic");
    doc.setTextColor(30, 30, 30);
    doc.text("Fahad Mulla", margin + 12, y + 88);

    // Pharmacy sig content
    const px = margin + sigBoxW + 28;
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(120, 120, 120);
    doc.text(pharmacyName.toUpperCase().slice(0, 30), px, y + 16);

    const pharmRows = [
      { label: "Name", value: ownerName || "—" },
      { label: "Title", value: "OWNER" },
      { label: "Date", value: today },
    ];
    pharmRows.forEach((row, i) => {
      const rowY = y + 30 + i * 18;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(150, 150, 150);
      doc.text(row.label + ":", px, rowY);
      doc.setTextColor(30, 30, 30);
      doc.text(row.value, px + 32, rowY);
    });

    // Pharmacy signature
    doc.setFontSize(18);
    doc.setFont("helvetica", "bolditalic");
    doc.setTextColor(15, 100, 60);
    doc.text(signatureName, px, y + 88);

    y += sigBoxH + 16;

    // ── Footer ──────────────────────────────────────────────────────────────────
    const totalPages = (doc.internal as any).getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(7.5);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(180, 180, 180);
      doc.text(
        `Secured by AuditProRx  ·  Legally binding e-signature  ·  Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 24,
        { align: "center" },
      );
    }

    doc.save(
      `NDA_${pharmacyName.replace(/\s+/g, "_")}_${today.replace(/\//g, "-")}.pdf`,
    );
  };

  const handleNext = async () => {
    if (!canProceed) {
      if (isSupplierStep)
        toast.error("Please select at least one supplier to continue.");
      else if (isPMSStep)
        toast.error("Please select at least one PMS to continue.");
      else
        toast.error(
          "Please check the agreement and provide your signature to continue.",
        );
      return;
    }
    await advance();
  };

  const currentStepConfig = STEPS[currentStep - 1];

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <Navbar
        completed={completedSteps.length}
        total={totalSteps}
        progress={progress}
        pharmacyEmail={pharmacyEmail}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Step Pills */}
        <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
          {STEPS.map((step, idx) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === step.id;
            const isLocked = step.id > currentStep && !isCompleted;
            return (
              <div key={step.id} className="flex items-center shrink-0">
                <button
                  onClick={() => isCompleted && setCurrentStep(step.id)}
                  disabled={isLocked}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium transition-all duration-200",
                    isCurrent &&
                      "bg-slate-900 text-white shadow-md shadow-slate-900/20",
                    isCompleted &&
                      !isCurrent &&
                      "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer border border-emerald-200",
                    isLocked && "text-slate-300 cursor-not-allowed",
                    !isCurrent &&
                      !isCompleted &&
                      !isLocked &&
                      "text-slate-500 hover:bg-slate-100",
                  )}
                >
                  {isCompleted && !isCurrent ? (
                    <CheckCircle2 size={13} className="text-emerald-500" />
                  ) : (
                    step.icon
                  )}
                  <span className="hidden sm:inline">{step.label}</span>
                  <span className="sm:hidden">{step.id}</span>
                </button>
                {idx < STEPS.length - 1 && (
                  <ChevronRight
                    size={13}
                    className="mx-0.5 text-slate-300 shrink-0"
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between">
            <div>
              <span className="inline-block text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full mb-2">
                Step {currentStep} of {totalSteps}
              </span>
              <h1 className="text-lg font-bold text-slate-900">
                {currentStepConfig.title}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                {isSupplierStep || isPMSStep
                  ? "Please make your selections to continue"
                  : "Please review this agreement carefully before signing"}
              </p>
            </div>
            {completedSteps.includes(currentStep) && (
              <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full text-xs font-semibold">
                <CheckCircle2 size={13} /> Signed
              </div>
            )}
          </div>

          {/* Document / Content Area */}
          <div
            ref={documentRef}
            className="px-6 py-6 max-h-[55vh] overflow-y-auto"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#e2e8f0 transparent",
            }}
          >
            {currentStep === 1 && (
              <NDAContent
                pharmacyName={pharmacyName}
                ownerName={ownerName}
                signatureName={signatureName}
              />
            )}
            {currentStep === 2 && <WholesalerContent />}
            {currentStep === 3 && (
              <ReleaseAgreementContent
                pharmacyName={pharmacyName}
                ownerName={ownerName}
                wholesalerAccepted={wholesalerAccepted}
                signatureName={signatureName}
              />
            )}
            {currentStep === 4 && (
              <SupplierStep
                selected={selectedSuppliers}
                onToggle={toggleSupplier}
              />
            )}
            {currentStep === 5 && (
              <PMSStep selected={selectedPMS} onToggle={togglePMS} />
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-5 border-t border-slate-100 bg-slate-50/60 space-y-4">
            {/* Step 2 — Yes/No */}
            {isWholesalerStep && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 text-center">
                  Choose how you'd like to proceed with wholesaler file
                  collection
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => advance(false)}
                    disabled={isSubmitting}
                    variant="outline"
                    className="h-11 font-semibold text-sm rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
                  >
                    {isSubmitting ? <Spinner /> : "No, thank you"}
                  </Button>
                  <Button
                    onClick={() => advance(true)}
                    disabled={isSubmitting}
                    className="h-11 font-semibold text-sm rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/20"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Spinner /> Processing...
                      </span>
                    ) : (
                      "Yes, please"
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 1 — Full signature flow */}
            {isNDAStep && (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    {
                      label: "Date",
                      value: new Date().toLocaleDateString("en-US"),
                    },
                    { label: "Pharmacy", value: pharmacyName },
                    { label: "Name", value: ownerName || "—" },
                    { label: "Title", value: "OWNER" },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="bg-white rounded-lg border border-slate-200 px-3 py-2.5"
                    >
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">
                        {label}
                      </p>
                      <p className="text-xs font-semibold text-slate-700 truncate">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
                <div
                  className="flex items-start gap-3 cursor-pointer group select-none"
                  onClick={() => setAgreed((v) => !v)}
                >
                  <div
                    className={cn(
                      "mt-0.5 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-150",
                      agreed
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-slate-300 bg-white group-hover:border-slate-400",
                    )}
                    style={{ height: 18, width: 18 }}
                  >
                    {agreed && (
                      <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2">
                        <path
                          d="M1 4l3 3 5-6"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-slate-600 leading-relaxed">
                    I have read and understood the{" "}
                    <span className="font-semibold text-slate-800">
                      Non-Disclosure Agreement
                    </span>
                    , and agree to the terms and conditions outlined above.
                  </span>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-600">
                    Type your full name below to create your e-signature:
                  </p>
                  <div className="relative">
                    <input
                      type="text"
                      value={signatureName}
                      onChange={(e) => setSignatureName(e.target.value)}
                      placeholder="Type your full name here..."
                      className="w-full h-11 px-4 rounded-lg border border-slate-200 bg-white text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 transition"
                    />
                    {signatureName && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSignatureName("");
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] text-slate-400 hover:text-slate-600 font-medium"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                  <div className="rounded-lg border border-dashed border-slate-200 bg-white h-14 px-4 flex items-center justify-between">
                    {signatureName ? (
                      <span
                        style={{
                          fontFamily:
                            "'Brush Script MT','Dancing Script',cursive",
                          fontSize: 26,
                          color: "#1e293b",
                          letterSpacing: 1,
                        }}
                      >
                        {signatureName}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300">
                        Signature preview will appear here
                      </span>
                    )}
                    {signatureName && (
                      <span className="text-[10px] text-slate-400 border border-slate-200 rounded px-1.5 py-0.5 ml-2 shrink-0 font-medium">
                        e-Signature
                      </span>
                    )}
                  </div>
                </div>

                {/* ADD THIS — download button shown only after signing */}
                {signatureName.trim().length > 2 && agreed && (
                  <button
                    onClick={handleDownloadNDA}
                    className="w-full h-10 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download NDA
                  </button>
                )}

                <Button
                  onClick={handleNext}
                  disabled={!canProceed || isSubmitting}
                  className={cn(
                    "w-full h-11 font-semibold text-sm rounded-xl transition-all duration-200",
                    canProceed
                      ? "bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/20"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none",
                  )}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Spinner /> Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Proceed to Step 2 <ChevronRight size={15} />
                    </span>
                  )}
                </Button>
              </>
            )}

            {/* Steps 3, 4, 5 — Proceed / Continue button */}
            {!isNDAStep && !isWholesalerStep && (
              <Button
                onClick={handleNext}
                disabled={!canProceed || isSubmitting}
                className={cn(
                  "w-full h-11 font-semibold text-sm rounded-xl transition-all duration-200",
                  canProceed
                    ? "bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-slate-900/20"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none",
                )}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Spinner /> Processing...
                  </span>
                ) : currentStep === totalSteps ? (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={15} /> Complete & Continue
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Continue <ChevronRight size={15} />
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-400 mt-6">
          Secured by{" "}
          <span className="font-bold text-slate-600">AuditProRx</span> · All
          agreements are legally binding e-signatures
        </p>
      </div>
    </div>
  );
};

export default AgreementsPage;
