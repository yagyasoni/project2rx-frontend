import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, MoreVertical, Plus, Eye, Check } from "lucide-react";
import axios from "axios";
import Link from "next/link"

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

  // Available options for the drawer
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
const [wholesalerFieldMappings, setWholesalerFieldMappings] = useState<Record<string, Record<string, string>>>({});
const [wholesalerHeaders, setWholesalerHeaders] = useState<Record<string, string[]>>({});
const [showMappingFor, setShowMappingFor] = useState<string | null>(null);
const [showMappingWarning, setShowMappingWarning] = useState(false);
const [missingMappingFields, setMissingMappingFields] = useState<string[]>([]);

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

const WHOLESALER_ALL_FIELDS = [...WHOLESALER_REQUIRED_FIELDS, ...WHOLESALER_OPTIONAL_FIELDS];

const WHOLESALER_HEADER_ALIASES: Record<string, string[]> = {
  ndcNumber: ["ndc", "ndcnumber", "ndc_number", "ndc number"],
  invoiceDate: ["invoicedate", "invoice_date", "invoice date", "date"],
  itemDescription: ["itemdescription", "item_description", "item description", "description", "drug", "drugname"],
  quantity: ["quantity", "qty"],
  unitPrice: ["unitprice", "unit_price", "unit price", "price"],
  totalPrice: ["totalprice", "total_price", "total price", "total"],
};

const WHOLESALER_STANDARD_OPTIONS = [
  "ndc", "invoice_date", "item_description", "quantity", "unit_price", "total_price"
];

const WHOLESALER_FIELD_TO_VALUE: Record<string, string> = {
  ndcNumber: "ndc",
  invoiceDate: "invoice_date",
  itemDescription: "item_description",
  quantity: "quantity",
  unitPrice: "unit_price",
  totalPrice: "total_price",
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
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim()); current = "";
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
      aliases.some((alias) => normalizeHeader(alias) === normalizeHeader(header))
    );
    if (found) autoMapping[field.key] = found; // 👈 store actual CSV header name, not standard value
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
      setShowMappingFor(id); // auto-open mapping UI
    };
    reader.readAsText(file);
  }
};

  const handleSubmit = async () => {
  try {
    const id = localStorage.getItem("auditId");
    if (!id) { alert("Audit not found"); return; }

    // Validate all uploaded wholesalers have required field mappings
    for (const w of wholesalers) {
      if (!w.file) continue;
      const mapping = wholesalerFieldMappings[w.id] || {};
      const missing = WHOLESALER_REQUIRED_FIELDS.filter((f) => !mapping[f.key]).map((f) => f.label);
      if (missing.length > 0) {
        setMissingMappingFields(missing);
        setShowMappingFor(w.id);
        setShowMappingWarning(true);
        return;
      }
    }

    const formData = new FormData();
    const metadata: { field: string; wholesaler_name: string; headerMapping: Record<string, string> }[] = [];

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

    const res = await axios.post(
      `http://localhost:5000/api/audits/${id}/wholesalers`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    console.log(res.data);
    alert("Files uploaded successfully");
  } catch (err) {
    console.error(err);
    alert("Upload failed");
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

  return (
    <div className="w-xl relative">
      <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Upload your wholesaler files
          </h2>
          <a href="#" className="text-sm text-primary hover:underline">
            Email Template
          </a>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {wholesalers.map((wholesaler) => (
  <div key={wholesaler.id}>
    <div className="relative flex items-center justify-between border border-border rounded-lg px-4 py-3">
      <span className="font-medium text-foreground text-sm">{wholesaler.name}</span>
      <div className="flex items-center gap-2">
        <label htmlFor={`wholesaler-${wholesaler.id}`}>
          <Button variant="ghost" size="sm" className="cursor-pointer" asChild>
            <span className="text-primary">
              <Upload className="w-4 h-4 mr-1" />
              Upload file
            </span>
          </Button>
          <input
            id={`wholesaler-${wholesaler.id}`}
            type="file"
            className="hidden"
            onChange={(e) => handleFileChange(wholesaler.id, e)}
            accept=".csv"
          />
        </label>
        {wholesaler.file && (
          <span className="text-xs text-muted-foreground truncate max-w-24">
            {wholesaler.file.name}
          </span>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            setEdit(!edit || editId !== wholesaler.id);
            setEditId(wholesaler.id);
          }}
        >
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>

      {edit && editId === wholesaler.id && (
        <div className="absolute right-2 top-10 w-[max-content] bg-white border border-gray-200 rounded-lg shadow-xl z-50">
          <button
            onClick={() => handleDelete(wholesaler.id)}
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg"
          >
            Delete
          </button>
        </div>
      )}
    </div>

    {/* Column Mapping UI - shown after file upload */}
    {wholesaler.file && wholesalerHeaders[wholesaler.id]?.length > 0 && showMappingFor === wholesaler.id && (
      <div className="mt-2 mb-2 bg-white rounded-xl border border-border/70 p-5 shadow-sm">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            {wholesaler.name} | File Upload
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Select the file headers below and click upload
          </p>
          <p className="text-sm text-primary font-medium mt-1">
            Please make sure to include all your columns below.
          </p>
          <p className="text-sm text-foreground mt-1">
            File - {wholesaler.file.name}
          </p>
        </div>

        <div className="space-y-3">
          {/* Header row indicator */}
          <div className="flex items-center justify-between rounded-lg border bg-slate-50 px-4 py-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">Header</span>
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                Row 1
              </span>
            </div>
            <span className="text-emerald-600 text-[11px] font-medium">
              Detected automatically ✓
            </span>
          </div>

          <hr />

          {WHOLESALER_ALL_FIELDS.map((field) => {
            const isRequired = WHOLESALER_REQUIRED_FIELDS.some((r) => r.key === field.key);
            const currentMapping = wholesalerFieldMappings[wholesaler.id]?.[field.key] || "";
            return (
              <div
                key={field.key}
                className="grid grid-cols-[1.7fr,2.3fr] gap-4 items-center rounded-md border border-transparent hover:border-primary/20 px-2 py-1.5 transition-colors"
              >
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <span>{field.label}</span>
                  {isRequired ? (
                    <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                      Required
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                      Optional
                    </span>
                  )}
                </div>
                <div className="relative">
                  <select
                    className={`w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/70 transition ${currentMapping ? "border-emerald-400" : "border-dashed border-border"}`}
                    value={currentMapping}
                    onChange={(e) =>
  setWholesalerFieldMappings((prev) => ({
    ...prev,
    [wholesaler.id]: {
      ...(prev[wholesaler.id] || {}),
      [field.key]: e.target.value, // this is already the actual header name from the select options
    },
  }))
}
                  >
                    <option value="">Select file header</option>
                    {wholesalerHeaders[wholesaler.id]?.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                  {currentMapping && (
                    <span className="absolute right-8 top-1/2 -translate-y-1/2 text-emerald-500">✓</span>
                  )}
                </div>
              </div>
            );
          })}

          <div className="flex justify-center pt-2">
            <Button
              size="sm"
              className="bg-gradient-to-r from-[#0D0D0D] to-[#404040] text-white px-6"
              onClick={() => setShowMappingFor(null)}
            >
              Confirm Mapping
            </Button>
          </div>
        </div>
      </div>
    )}
  </div>
))}
        </div>

        <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-border">
          <Link href="/ReportsPage">
  <Button
    className="bg-gradient-to-r from-[#0D0D0D] to-[#404040] text-white transition"
    variant="outline"
  >
    Skip
  </Button>
</Link>
          <Button
            className="cursor-pointer"
            variant="default"
            onClick={() => setIsDrawerOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Supplier
          </Button>
          <Button
            className="bg-gradient-to-r from-[#0D0D0D] to-[#404040] text-white transition"
            variant="outline"
            onClick={handleSubmit}
          >
            <Eye className="w-4 h-4 mr-1" />
            View Audit
          </Button>
        </div>
      </div>

      {/* RIGHT SIDE DRAWER - Background set to White */}
      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 p-6 flex flex-col">
            <h3 className="text-xl font-bold mb-4">Select Suppliers</h3>
            <div className="flex-1 space-y-2 overflow-y-auto">
              {availableSuppliers.map((name) => (
                <div
                  key={name}
                  onClick={() => {
                    setSelectedInDrawer((prev) =>
                      prev.includes(name)
                        ? prev.filter((i) => i !== name)
                        : [...prev, name],
                    );
                  }}
                  className={`flex items-center justify-between p-3 border rounded-md cursor-pointer ${selectedInDrawer.includes(name) ? "border-primary bg-primary/5" : "border-gray-100"}`}
                >
                  <span className="text-sm font-medium">{name}</span>
                  {selectedInDrawer.includes(name) && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              <Button
                className="flex-1 bg-gradient-to-r from-[#0D0D0D] to-[#404040] text-white transition"
                variant="outline"
                onClick={() => setIsDrawerOpen(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleConfirmAddFromDrawer}>
                Add Selected
              </Button>
            </div>
          </div>
        </>
      )}

      {showMappingWarning && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        onClick={() => setShowMappingWarning(false)}
      >
        ×
      </button>
      <h3 className="text-lg font-bold mb-3 text-foreground">Warning</h3>
      <p className="text-sm mb-2 text-red-600">
        Header{" "}
        <span className="font-semibold">{missingMappingFields.join(", ")}</span>{" "}
        is required.
      </p>
      <p className="text-sm text-foreground">
        Please match all required headers before proceeding.
      </p>
    </div>
  </div>
)}
    </div>
  );
};

export { defaultWholesalers };
export default UploadWholesalersStep;
