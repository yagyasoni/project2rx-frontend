import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Upload,
  MoreVertical,
  Plus,
  Eye,
  Check,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  FileText,
  X,
  Sparkles,
  Building2,
} from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";

interface Wholesaler {
  id: string;
  name: string;
  file: File | null;
}

interface UploadWholesalersStepProps {
  wholesalers: Wholesaler[];
  setWholesalers: (wholesalers: Wholesaler[]) => void;
  onSkip: () => void;
  onAddSupplier: () => void;
  onViewAudit: () => void;
}

const defaultWholesalers: Wholesaler[] = [
  { id: "1", name: "AXIA", file: null },
  { id: "2", name: "CITYMED", file: null },
  { id: "3", name: "DRUGZONE", file: null },
  { id: "4", name: "EZRIRX", file: null },
];

// ── Disclaimer Banner (UI only) ────────────────────────────────────────────────

const WHOLESALER_REQUIRED_LABELS = [
  "Ndc Number",
  "Invoice Date",
  "Item Description",
  "Quantity",
];
const WHOLESALER_OPTIONAL_LABELS = ["Unit Price", "Total Price"];

const DisclaimerBanner = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 overflow-hidden mb-5 shadow-sm">
      <div className="flex items-start gap-3 px-5 py-4">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-amber-900">
            File requirements — read before uploading
          </p>
          <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
            Each wholesaler CSV must include all required columns. Missing
            columns will block processing.
          </p>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-900 transition-all bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg border border-amber-200"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" /> Hide
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" /> View columns
            </>
          )}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-amber-200/60 bg-white/80 px-5 py-5 space-y-5">
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1.5">
                File Format Requirements
              </p>
              <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li>
                  File must be in{" "}
                  <span className="font-semibold text-gray-800">
                    .CSV format
                  </span>{" "}
                  only
                </li>
                <li>
                  <span className="font-semibold text-gray-800">First row</span>{" "}
                  must be the header row
                </li>
                <li>
                  Column names are{" "}
                  <span className="font-semibold text-gray-800">
                    case-insensitive
                  </span>{" "}
                  — auto-mapping will detect them
                </li>
                <li>
                  Dates:{" "}
                  <span className="font-semibold text-gray-800">
                    MM/DD/YYYY
                  </span>{" "}
                  or{" "}
                  <span className="font-semibold text-gray-800">
                    YYYY-MM-DD
                  </span>
                </li>
                <li>
                  Upload{" "}
                  <span className="font-semibold text-gray-800">
                    one CSV per wholesaler
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-red-600">
                    {WHOLESALER_REQUIRED_LABELS.length}
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-700">
                  Required Columns
                </p>
              </div>
              <div className="space-y-1.5">
                {WHOLESALER_REQUIRED_LABELS.map((col) => (
                  <div
                    key={col}
                    className="flex items-center gap-2 bg-red-50/80 border border-red-100 rounded-lg px-2.5 py-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                    <span className="text-[11px] font-medium text-red-700 flex-1">
                      {col}
                    </span>
                    <span className="text-[9px] font-bold text-red-500 bg-white border border-red-200 px-1.5 py-0.5 rounded">
                      REQ
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-slate-500">
                    {WHOLESALER_OPTIONAL_LABELS.length}
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-700">
                  Optional Columns
                </p>
              </div>
              <div className="space-y-1.5">
                {WHOLESALER_OPTIONAL_LABELS.map((col) => (
                  <div
                    key={col}
                    className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                    <span className="text-[11px] font-medium text-slate-600 flex-1">
                      {col}
                    </span>
                    <span className="text-[9px] font-medium text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                      OPT
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-start gap-2.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-700 leading-relaxed">
              <span className="font-semibold">Important:</span> After uploading
              each file, verify all required columns are correctly mapped before
              clicking <span className="font-semibold">View Audit</span>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────

const UploadWholesalersStep = ({
  wholesalers,
  setWholesalers,
  onSkip,
  onAddSupplier,
  onViewAudit,
}: UploadWholesalersStepProps) => {
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedInDrawer, setSelectedInDrawer] = useState<string[]>([]);
  const [drawerSearch, setDrawerSearch] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // ── ORIGINAL state — untouched ─────────────────────────────────────────────
  const [wholesalerFieldMappings, setWholesalerFieldMappings] = useState<
    Record<string, Record<string, string>>
  >({});
  const [wholesalerHeaders, setWholesalerHeaders] = useState<
    Record<string, string[]>
  >({});
  const [showMappingFor, setShowMappingFor] = useState<string | null>(null);
  const [showMappingWarning, setShowMappingWarning] = useState(false);
  const [missingMappingFields, setMissingMappingFields] = useState<string[]>(
    [],
  );

  const availableSuppliers = [
    "340B",
    "ABC",
    "AKRON GENERICS",
    "ALPINE HEALTH",
    "ANDA",
    "APD",
    "API",
    "ASTOR DRUGS",
    "ATLAND",
    "AUBURN",
    "AXIA",
    "NDC DISTRIBUTORS",
    "LEGACY HEALTH",
    "REAL VALUE RX",
    "AYTU BIOPHARMA",
    "BESSE",
    "BIORIDGE",
    "BLUPAX",
    "BONITA",
    "CARDINAL",
    "COCHRAN WHOLESALE PHARMACEUTICAL",
    "DB DIAGNOSTICS",
    "DOCKSIDE PARTNERS",
    "EXELTIS",
    "FFF ENTERPRISES",
    "EZRI",
    "GALT DIRECT",
    "GEMCO MEDICAL",
    "GENETCO",
    "GLENVIEW PHARMA",
    "GREEN HILL TRADING",
    "GSK",
    "HEALTHSOURCE",
    "HYGEN PHARMACEUTICALS",
    "ICS DIRECT",
    "INDEPENDENT PHARMACEUTICAL",
    "INTEGRAL RX",
    "IPC",
    "IPD",
    "IXTHUS",
    "JAMRX",
    "JG",
    "JOURNEY",
    "KARES",
    "KEYSOURCE",
    "LANDMARK",
    "MAKS PHARMA",
    "MASTERS",
    "MATCHRX",
    "MATRIX",
    "MCKESSON",
    "MODERNA DIRECT",
    "NETCOSTRX",
    "NEW SUPPLIER 1",
    "NEW SUPPLIER 2",
    "NEW SUPPLIER 3",
    "NEW SUPPLIER 4",
    "NORTHEAST MEDICAL",
    "NUMED",
    "OAK DRUGS",
    "PAYLESS",
    "PBA HEALTH",
    "PFIZER DIRECT",
    "PHARMSAVER",
    "PHARMSOURCE",
    "PILL R HEALTH (340B)",
    "PRESCRIPTION SUPPLY",
    "PRIMED",
    "PRODIGY",
    "PRX WHOLESALE",
    "QUALITY CARE",
    "QUEST PHARMACEUTICAL",
    "REPUBLIC",
    "RX MART",
    "RX ONE SHOP",
    "RXPOST",
    "SAVEBIGRX",
    "SECOND SOURCE RX",
    "SEQIRUS",
    "SMART SOURCE",
    "SMITH DRUGS",
    "SOUTH POINTE",
    "SPECTRUM",
    "STARTING INVENTORY 1",
    "STARTING INVENTORY 2",
    "STARTING INVENTORY 3",
    "STERLING DISTRIBUTOR",
    "SURECOST",
    "TOPRX",
    "TRXADE",
    "VALUE DRUG",
    "VAXSERVE",
    "WELLGISTICS",
    "WESTERN WELLNES SOLUTION",
  ];

  // ── ORIGINAL mapping logic — untouched ────────────────────────────────────

  const WHOLESALER_REQUIRED_FIELDS = [
    { key: "ndcNumber", label: "Ndc Number" },
    { key: "invoiceDate", label: "Invoice Date" },
    { key: "itemDescription", label: "Item Description" },
    { key: "quantity", label: "Quantity" },
  ] as const;

  const WHOLESALER_OPTIONAL_FIELDS = [
    { key: "unitPrice", label: "Unit Price" },
    { key: "totalPrice", label: "Total Price" },
  ] as const;

  const WHOLESALER_ALL_FIELDS = [
    ...WHOLESALER_REQUIRED_FIELDS,
    ...WHOLESALER_OPTIONAL_FIELDS,
  ];

  const WHOLESALER_HEADER_ALIASES: Record<string, string[]> = {
    ndcNumber: ["ndc", "ndcnumber", "ndc_number", "ndc number"],
    invoiceDate: ["invoicedate", "invoice_date", "invoice date", "date"],
    itemDescription: [
      "itemdescription",
      "item_description",
      "item description",
      "description",
      "drug",
      "drugname",
    ],
    quantity: ["quantity", "qty"],
    unitPrice: ["unitprice", "unit_price", "unit price", "price"],
    totalPrice: ["totalprice", "total_price", "total price", "total"],
  };

  const normalizeHeader = (value: string) =>
    value.toLowerCase().replace(/[\s_]/g, "");

  const parseCsvHeaderLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else current += char;
    }
    if (current.length > 0) result.push(current.trim());
    return result.filter((h) => h.length > 0);
  };

  const buildWholesalerAutoMapping = (parsedHeaders: string[]) => {
    const autoMapping: Record<string, string> = {};
    WHOLESALER_ALL_FIELDS.forEach((field) => {
      const aliases = WHOLESALER_HEADER_ALIASES[field.key] || [];
      const found = parsedHeaders.find((header) =>
        aliases.some(
          (alias) => normalizeHeader(alias) === normalizeHeader(header),
        ),
      );
      if (found) autoMapping[field.key] = found;
    });
    return autoMapping;
  };

  const handleFileChange = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] || null;
    setWholesalers(wholesalers.map((w) => (w.id === id ? { ...w, file } : w)));
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = (e.target?.result as string) || "";
        const firstNonEmptyLine =
          text.split(/\r?\n/).find((line) => line.trim().length > 0) || "";
        const parsedHeaders = parseCsvHeaderLine(firstNonEmptyLine);
        setWholesalerHeaders((prev) => ({ ...prev, [id]: parsedHeaders }));
        const auto = buildWholesalerAutoMapping(parsedHeaders);
        setWholesalerFieldMappings((prev) => ({ ...prev, [id]: auto }));
        setShowMappingFor(id);
      };
      reader.readAsText(file);
    }
  };

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const handleSubmit = async () => {
    const id = localStorage.getItem("auditId");
    if (!id) {
      toast("Audit not found");
      return;
    }

    for (const w of wholesalers) {
      if (!w.file) continue;
      const mapping = wholesalerFieldMappings[w.id] || {};
      const missing = WHOLESALER_REQUIRED_FIELDS.filter(
        (f) => !mapping[f.key],
      ).map((f) => f.label);
      if (missing.length > 0) {
        setMissingMappingFields(missing);
        setShowMappingFor(w.id);
        setShowMappingWarning(true);
        return;
      }
    }

    const formData = new FormData();
    const metadata: {
      field: string;
      wholesaler_name: string;
      headerMapping: Record<string, string>;
    }[] = [];

    wholesalers.forEach((w) => {
      if (w.file) {
        const fieldName = w.name.toLowerCase().replace(/\s+/g, "");
        metadata.push({
          field: fieldName,
          wholesaler_name: w.name,
          headerMapping: wholesalerFieldMappings[w.id] || {},
        });
        formData.append(fieldName, w.file);
      }
    });

    formData.append("metadata", JSON.stringify(metadata));

    // Start fake smooth progress
    setUploadProgress(0);
    setIsUploading(true);
    let current = 0;
    intervalRef.current = setInterval(() => {
      current += Math.random() * 5 + 2;
      if (current >= 85) {
        current = 85;
        clearInterval(intervalRef.current!);
      }
      setUploadProgress(Math.round(current));
    }, 350);

    try {
      const res = await axios.post(
        `https://api.auditprorx.com/api/audits/${id}/wholesalers`,
        formData,
      );

      clearInterval(intervalRef.current!);
      setUploadProgress(100);
      setTimeout(() => {
        setIsUploading(false);
        setUploadSuccess(true); // show success modal instead of navigating
      }, 500);

      console.log(res.data);
    } catch (err: any) {
      clearInterval(intervalRef.current!);
      setIsUploading(false);
      setUploadProgress(0);
      // Safely extract string message from any error shape
      const data = err?.response?.data;
      const message =
        typeof data === "string"
          ? data
          : typeof data?.message === "string"
            ? data.message
            : typeof data?.error === "string"
              ? data.error
              : err?.message || "Please try again.";
      toast("Upload failed: " + message);
    }
  };

  const handleDelete = (id: string) => {
    setWholesalers(wholesalers.filter((w) => w.id !== id));
    setEdit(false);
    setEditId(null);
  };

  const handleConfirmAddFromDrawer = () => {
    const newItems = selectedInDrawer.map((name) => ({
      id: Math.random().toString(36).substr(2, 9),
      name,
      file: null,
    }));
    setWholesalers([...wholesalers, ...newItems]);
    setSelectedInDrawer([]);
    setIsDrawerOpen(false);
  };

  const uploadedCount = wholesalers.filter((w) => w.file).length;
  const filteredSuppliers = availableSuppliers.filter((s) =>
    s.toLowerCase().includes(drawerSearch.toLowerCase()),
  );

  return (
    <div className="w-full max-w-3xl mx-auto px-2 relative">
      <DisclaimerBanner />

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Card Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Upload Wholesaler Files
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {uploadedCount} of {wholesalers.length} files uploaded
                </p>
              </div>
            </div>
            {/* <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg transition-colors">
              Email Template
            </a> */}
          </div>

          {/* Progress bar */}
          {wholesalers.length > 0 && (
            <div className="mt-4">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-900 rounded-full transition-all duration-500"
                  style={{
                    width: `${(uploadedCount / wholesalers.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Wholesaler List */}
        <div className="divide-y divide-gray-100 max-h-[420px] overflow-y-auto">
          {wholesalers.map((wholesaler, idx) => {
            const isMapped =
              showMappingFor !== wholesaler.id && !!wholesaler.file;
            const mappingCount = Object.keys(
              wholesalerFieldMappings[wholesaler.id] || {},
            ).length;

            return (
              <div key={wholesaler.id}>
                {/* Row */}
                <div
                  className={`flex items-center gap-4 px-5 py-3.5 transition-colors ${wholesaler.file ? "bg-emerald-50/20" : "bg-white hover:bg-gray-50/50"}`}
                >
                  {/* Index */}
                  <span className="w-5 text-[11px] font-bold text-gray-300 flex-shrink-0">
                    {idx + 1}
                  </span>

                  {/* Status dot */}
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${wholesaler.file ? "bg-emerald-400" : "bg-gray-300"}`}
                  />

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-gray-800">
                      {wholesaler.name}
                    </span>
                    {wholesaler.file && (
                      <p className="text-[11px] text-emerald-600 mt-0.5 truncate">
                        {wholesaler.file.name}
                        {mappingCount > 0 &&
                          ` · ${mappingCount} columns mapped`}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {wholesaler.file && showMappingFor !== wholesaler.id && (
                      <button
                        onClick={() => setShowMappingFor(wholesaler.id)}
                        className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-2.5 py-1 rounded-lg transition-colors"
                      >
                        Edit Mapping
                      </button>
                    )}

                    <label
                      htmlFor={`wholesaler-${wholesaler.id}`}
                      className="cursor-pointer"
                    >
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          wholesaler.file
                            ? "bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                            : "bg-gray-900 text-white hover:bg-gray-800"
                        }`}
                      >
                        <Upload className="w-3 h-3" />
                        {wholesaler.file ? "Replace" : "Upload"}
                      </span>
                      <input
                        id={`wholesaler-${wholesaler.id}`}
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(wholesaler.id, e)}
                        accept=".csv"
                      />
                    </label>

                    {/* 3-dot menu */}
                    <div className="relative">
                      <button
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        onClick={() => {
                          setEdit(!edit || editId !== wholesaler.id);
                          setEditId(wholesaler.id);
                        }}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      {edit && editId === wholesaler.id && (
                        <div className="absolute right-0 top-8 w-32 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                          <button
                            onClick={() => handleDelete(wholesaler.id)}
                            className="w-full px-3 py-2 text-left text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── Column Mapping Panel — ORIGINAL logic untouched ── */}
                {wholesaler.file &&
                  wholesalerHeaders[wholesaler.id]?.length > 0 &&
                  showMappingFor === wholesaler.id && (
                    <div className="mx-4 mb-3 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                      {/* Mapping header */}
                      <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-xs font-semibold text-gray-700">
                            {wholesaler.name} — Column Mapping
                          </span>
                          <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                            Auto-detected ✓
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-500">
                          File: {wholesaler.file.name}
                        </span>
                      </div>

                      {/* Mapping rows */}
                      <div className="divide-y divide-gray-100">
                        {WHOLESALER_ALL_FIELDS.map((field, i) => {
                          const isRequired = WHOLESALER_REQUIRED_FIELDS.some(
                            (r) => r.key === field.key,
                          );
                          const currentMapping =
                            wholesalerFieldMappings[wholesaler.id]?.[
                              field.key
                            ] || "";
                          const isMappedField = !!currentMapping;
                          return (
                            <div
                              key={field.key}
                              className={`flex items-center gap-4 px-4 py-2.5 transition-colors ${isMappedField ? "bg-white" : isRequired ? "bg-red-50/20" : "bg-white"}`}
                            >
                              <span className="w-4 text-[10px] font-bold text-gray-300 flex-shrink-0">
                                {i + 1}
                              </span>
                              <div
                                className={`w-2 h-2 rounded-full flex-shrink-0 ${isMappedField ? "bg-emerald-400" : isRequired ? "bg-red-300" : "bg-gray-200"}`}
                              />
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="text-xs font-medium text-gray-800">
                                  {field.label}
                                </span>
                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                                    isRequired
                                      ? "text-red-500 bg-red-50 border-red-100"
                                      : "text-slate-400 bg-slate-50 border-slate-100"
                                  }`}
                                >
                                  {isRequired ? "REQ" : "OPT"}
                                </span>
                              </div>
                              <div className="relative w-48 flex-shrink-0">
                                <select
                                  className={`w-full border rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 transition-all ${
                                    isMappedField
                                      ? "border-emerald-300 text-emerald-800 focus:ring-emerald-200"
                                      : isRequired
                                        ? "border-red-300 text-gray-500 focus:ring-red-200"
                                        : "border-gray-200 text-gray-500 focus:ring-gray-200"
                                  }`}
                                  value={currentMapping}
                                  onChange={(e) =>
                                    setWholesalerFieldMappings((prev) => ({
                                      ...prev,
                                      [wholesaler.id]: {
                                        ...(prev[wholesaler.id] || {}),
                                        [field.key]: e.target.value,
                                      },
                                    }))
                                  }
                                >
                                  <option value="">— Select column —</option>
                                  {wholesalerHeaders[wholesaler.id]?.map(
                                    (header) => (
                                      <option key={header} value={header}>
                                        {header}
                                      </option>
                                    ),
                                  )}
                                </select>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Confirm button */}
                      <div className="flex justify-end px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <button
                          onClick={() => setShowMappingFor(null)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-lg transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Confirm Mapping
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Supplier
          </button>

          <div className="flex items-center gap-2">
            <Link href="/ReportsPage">
              <button className="px-4 py-2 text-xs font-semibold text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition-colors">
                Skip
              </button>
            </Link>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              View Audit
            </button>
          </div>
        </div>
      </div>

      {/* ── Add Supplier Drawer ── */}
      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Add Suppliers
                </h3>
                {selectedInDrawer.length > 0 && (
                  <p className="text-xs text-blue-600 mt-0.5">
                    {selectedInDrawer.length} selected
                  </p>
                )}
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-gray-100">
              <input
                type="text"
                placeholder="Search suppliers..."
                value={drawerSearch}
                onChange={(e) => setDrawerSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-gray-300 bg-gray-50"
              />
            </div>

            {/* Supplier list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {filteredSuppliers.map((name) => {
                const isSelected = selectedInDrawer.includes(name);
                return (
                  <div
                    key={name}
                    onClick={() =>
                      setSelectedInDrawer((prev) =>
                        prev.includes(name)
                          ? prev.filter((i) => i !== name)
                          : [...prev, name],
                      )
                    }
                    className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-gray-900 text-white"
                        : "hover:bg-gray-50 border border-transparent hover:border-gray-200"
                    }`}
                  >
                    <span
                      className={`text-xs font-medium ${isSelected ? "text-white" : "text-gray-700"}`}
                    >
                      {name}
                    </span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-white flex-shrink-0" />
                    )}
                  </div>
                );
              })}
              {filteredSuppliers.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-8">
                  No suppliers found
                </p>
              )}
            </div>

            {/* Drawer footer */}
            <div className="px-4 py-4 border-t border-gray-200 bg-gray-50 flex gap-2">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1 px-3 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAddFromDrawer}
                disabled={selectedInDrawer.length === 0}
                className="flex-1 px-3 py-2 text-xs font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Add{" "}
                {selectedInDrawer.length > 0
                  ? `(${selectedInDrawer.length})`
                  : "Selected"}
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Warning Modal — ORIGINAL logic untouched ── */}
      {showMappingWarning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  Missing Required Columns
                </h3>
              </div>
              <button
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={() => setShowMappingWarning(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              The following columns are required but not yet mapped:
            </p>
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
              <div className="flex flex-wrap gap-1.5">
                {missingMappingFields.map((h) => (
                  <span
                    key={h}
                    className="text-[11px] font-semibold text-red-700 bg-white border border-red-200 rounded-md px-2 py-1"
                  >
                    {h}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              Please map all required columns before proceeding.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowMappingWarning(false)}
                className="px-5 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {uploadSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-5">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Files Uploaded Successfully
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {wholesalers.filter((w) => w.file).length} wholesaler file
              {wholesalers.filter((w) => w.file).length !== 1 ? "s" : ""} have
              been uploaded and processed.
            </p>
            <button
              onClick={() => {
                setUploadSuccess(false);
                onViewAudit();
              }}
              className="px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {isUploading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-5 relative">
              <Upload className="w-7 h-7 text-blue-600" />
              <div className="absolute -inset-1 rounded-[18px] border-2 border-transparent border-t-blue-500 border-r-blue-300 animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Uploading Wholesalers...
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              {wholesalers.filter((w) => w.file).length} file
              {wholesalers.filter((w) => w.file).length !== 1 ? "s" : ""}{" "}
              uploading
            </p>
            <div className="w-full space-y-2">
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {uploadProgress < 90
                    ? "Uploading files..."
                    : uploadProgress < 100
                      ? "Processing on server..."
                      : "Finalizing..."}
                </span>
                <span className="text-xs font-bold text-blue-600 tabular-nums">
                  {uploadProgress}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { defaultWholesalers };
export default UploadWholesalersStep;
