"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Upload,
  Trash2,
  ArrowRight,
  Check,
  AlertCircle,
  Package,
  MoreVertical,
  FileSpreadsheet,
  X,
  Copy,
  PencilLine,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminLayout from "@/components/adminLayout";
import { toast } from "sonner";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";

// ── Constants ──────────────────────────────────────────────
const STANDARD_FIELDS = [
  "ndc_number",
  "invoice_date",
  "item_description",
  "quantity",
  "unit_price",
  "total_price",
];

const REQUIRED_FIELDS = [
  "ndc_number",
  "invoice_date",
  "item_description",
  "quantity",
];

const AUDIT_TEMPLATE = `Hello,

We hope you're doing well. We are reaching out from [Pharmacy Name] to request a CSV or Excel file containing a purchase detail statement from [FROM DATE] through [TO DATE]. This is for a month end internal audit.

Please make sure to exclude any purchases made through 3 parties such as Trxade or EzriRx.

Requested For:

[PHARMACY NAME]
[PHARMACY ADDRESS]
[PHONE NUMBER]

Requested Fields:
- NDC Number
- Invoice Date
- Item Description
- Quantity
- Unit Price
- Total Price

We would appreciate it if you could email us the file at your earliest convenience.

Thank you for your prompt assistance, and we look forward to your response.

Best Regards,
[PHARMACY NAME]`;

// ── Types ──────────────────────────────────────────────────
interface Supplier {
  id: string;
  name: string;
  email?: string;
  created_at: string;
  mappings?: Record<string, string>; // 👈 ADD THIS
}

interface SupplierMapping {
  id: string;
  supplier_id: string;
  mappings: Record<string, string>;
  created_at: string;
}

// ── Helper ─────────────────────────────────────────────────
const formatDate = (d: string) => {
  const dt = new Date(d);
  return dt.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

const fieldLabel = (f: string) =>
  f
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

// ── Component ──────────────────────────────────────────────
const SupplierMappingPage = () => {
  // Suppliers
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [addModal, setAddModal] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState("");

  // Mapping
  const [mappingModal, setMappingModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [extractedColumns, setExtractedColumns] = useState<string[]>([]);
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>(
    {},
  );
  const [savedMappings, setSavedMappings] = useState<
    Record<string, SupplierMapping>
  >({});

  // Menu
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Upload state
  const [uploadStep, setUploadStep] = useState<"upload" | "map">("upload");
  const textLight = "hsl(0 0% 95%)"; // Near white
  const [loading, setLoading] = useState(false);
  const [newSupplierEmail, setNewSupplierEmail] = useState("");
  const [editEmailModal, setEditEmailModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/suppliers`,
        );

        setSuppliers(res.data);

        // 🔥 IMPORTANT: hydrate mappings
        const map: Record<string, SupplierMapping> = {};

        res.data.forEach((s: Supplier) => {
          if (s.mappings) {
            map[s.id] = {
              id: "", // optional
              supplier_id: s.id,
              mappings: s.mappings,
              created_at: s.created_at,
            };
          }
        });

        setSavedMappings(map);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSuppliers();
  }, []);

  const handleAddSupplier = async () => {
    if (!newSupplierName.trim()) return;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/suppliers`,
        {
          name: newSupplierName.trim(),
          email: newSupplierEmail.trim(),
        },
      );

      setSuppliers((prev) => [...prev, res.data]);
      setNewSupplierName("");
      setAddModal(false);
      window.location.reload();
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    // const ok = window.confirm("Are you sure you want to delete this supplier?");
    // if (!ok) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/suppliers/${id}`,
      );

      setSuppliers((prev) => prev.filter((s) => s.id !== id));

      setSavedMappings((prev) => {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      });

      setActiveMenu(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenMapping = async (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setUploadStep("upload");
    setExtractedColumns([]);
    setColumnMappings({});
    setMappingModal(true);
    setActiveMenu(null);

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/supplier-mapping/${supplier.id}`,
      );

      const data = res.data;

      if (data?.mappings) {
        setExtractedColumns(Object.keys(data.mappings));
        setColumnMappings(data.mappings);
        setUploadStep("map");

        setSavedMappings((prev) => ({
          ...prev,
          [supplier.id]: data,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate extracting columns from CSV/Excel
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const firstLine = text.split("\n")[0];
      const cols = firstLine.split(",").map((c) => c.trim().replace(/"/g, ""));
      setExtractedColumns(cols);
      // Initialize mappings
      const initial: Record<string, string> = {};
      cols.forEach((col) => {
        initial[col] = "";
      });
      setColumnMappings(initial);
      setUploadStep("map");
    };
    reader.readAsText(file);
  };

  const handleMappingChange = (supplierCol: string, systemField: string) => {
    setColumnMappings((prev) => ({ ...prev, [supplierCol]: systemField }));
  };

  const getMappedFields = () => Object.values(columnMappings).filter(Boolean);

  const getUnmappedRequired = () => {
    const mapped = getMappedFields();
    return REQUIRED_FIELDS.filter((f) => !mapped.includes(f));
  };

  const isFieldUsed = (field: string, currentCol: string) => {
    return Object.entries(columnMappings).some(
      ([col, val]) => val === field && col !== currentCol,
    );
  };

  const handleSaveMapping = async () => {
    const unmapped = getUnmappedRequired();
    if (unmapped.length > 0) {
      toast(
        `Required fields not mapped: ${unmapped.map(fieldLabel).join(", ")}`,
      );
      return;
    }

    if (!selectedSupplier) return;

    const cleanMappings: Record<string, string> = {};
    Object.entries(columnMappings).forEach(([k, v]) => {
      if (v) cleanMappings[k] = v;
    });

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/supplier-mapping`,
        {
          supplier_id: selectedSupplier.id,
          mappings: cleanMappings,
        },
      );

      const data = res.data;

      setSavedMappings((prev) => ({
        ...prev,
        [selectedSupplier.id]: data,
      }));

      setMappingModal(false);
      setSelectedSupplier(null);
    } catch (err) {
      console.error(err);
    }
  };

  const getSupplierMappingStatus = (supplierId: string) => {
    return savedMappings[supplierId] ? "Mapped" : "Unmapped";
  };

  const filteredSuppliers = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return suppliers;

    const scoreMatch = (text: string) => {
      if (!text) return 0;

      const t = text.toLowerCase();

      // 🥇 Best: starts with full string
      if (t.startsWith(query)) return 100;

      // 🥈 Word starts with (e.g. "health corp" → "hea")
      const words = t.split(/[\s@._-]+/);
      if (words.some((w) => w.startsWith(query))) return 80;

      // 🥉 Contains substring
      if (t.includes(query)) return 50;

      // 🔹 Fuzzy-lite: all chars in order (e.g. "mck" → "mckesson")
      let qi = 0;
      for (let i = 0; i < t.length && qi < query.length; i++) {
        if (t[i] === query[qi]) qi++;
      }
      if (qi === query.length) return 30;

      return 0;
    };

    return suppliers
      .map((s) => {
        const nameScore = scoreMatch(s.name || "");
        const emailScore = scoreMatch(s.email || "");

        const score = Math.max(nameScore, emailScore);

        return { ...s, __score: score };
      })
      .filter((s) => s.__score > 0)
      .sort((a, b) => b.__score - a.__score);
  }, [suppliers, searchQuery]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg  bg-black backdrop-blur-md shadow-lg">
          <Spinner className="size-6 text-white" />
          <span className="text-xs font-semibold text-white">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 px-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              SUPPLIER MAPPING
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage suppliers and map their file columns to standard fields
            </p>
          </div>
          <div className="flex flex-col-2 gap-3 ">
            {/* 🔍 Search Input */}
            <div className="relative flex-1 max-w-sm">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Search suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-8 h-8 w-[220px] text-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            <Button
              onClick={() => setAddModal(true)}
              className="cursor-pointer gap-2 bg-foreground text-background hover:bg-foreground/90 text-xs font-semibold"
              size="sm"
            >
              <Plus size={14} />
              Add Supplier
            </Button>
            <button
              onClick={() => {
                const template = `${AUDIT_TEMPLATE}`.trim();

                navigator.clipboard.writeText(template);
                toast("Template copied!");
              }}
              className="font-semibold cursor-pointer border border-gray-400 rounded-md w-full px-3 py-2 text-left text-xs hover:bg-muted flex items-center gap-2"
            >
              <Copy size={14} />
              Copy Template
            </button>
          </div>
        </div>

        {/* Suppliers Table */}
        <div className="rounded-lg border border-border">
          <div className="overflow-visible">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-12">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Supplier Name
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Mapping Status
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Mapped Fields
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Created Date
                  </th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {filteredSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <Package
                            size={20}
                            className="text-muted-foreground"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            No suppliers found
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Add a supplier to start mapping columns.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSuppliers.map((supplier, index) => {
                    const status = getSupplierMappingStatus(supplier.id);
                    const mapping = savedMappings[supplier.id];
                    const mappedCount = mapping
                      ? Object.keys(mapping.mappings).length
                      : 0;

                    return (
                      <tr
                        key={supplier.id}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="flex ml-4 py-3 text-xs text-muted-foreground font-medium">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-semibold text-foreground">
                            {supplier.name}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {supplier.email || "-"}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold 
                              
                            `}
                            style={{
                              background: `linear-gradient(135deg, hsl(${210 + 0 * 20} 25% 40%), hsl(${210 + 0 * 20} 20% 25%))`,
                              borderColor: "hsl(0 0% 5%)",
                              color: textLight,
                            }}
                          >
                            {status === "Mapped" ? (
                              <Check size={10} />
                            ) : (
                              <AlertCircle size={10} />
                            )}
                            {status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {mappedCount > 0
                            ? `${mappedCount} / ${STANDARD_FIELDS.length}`
                            : "-"}
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {formatDate(supplier.created_at)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="relative">
                            <button
                              onClick={() =>
                                setActiveMenu(
                                  activeMenu === supplier.id
                                    ? null
                                    : supplier.id,
                                )
                              }
                              className="p-1.5 hover:bg-muted rounded-md transition-colors"
                            >
                              <MoreVertical
                                size={14}
                                className="text-muted-foreground"
                              />
                            </button>
                            {activeMenu === supplier.id && (
                              <div className="absolute right-0 bottom-full mb-1 z-20 w-40 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
                                <button
                                  onClick={() => handleOpenMapping(supplier)}
                                  className="w-full px-3 py-2 text-left text-xs text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                                >
                                  <Upload size={12} />
                                  {savedMappings[supplier.id]
                                    ? "Update Mapping"
                                    : "Upload & Map"}
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingSupplier(supplier);
                                    setEmailInput(supplier.email || "");
                                    setEditEmailModal(true);
                                    setActiveMenu(null);
                                  }}
                                  className="w-full px-3 py-2 text-left text-xs hover:bg-muted flex items-center gap-2"
                                >
                                  <PencilLine size={12} />
                                  Edit Email
                                </button>
                                {savedMappings[supplier.id] && (
                                  <button
                                    onClick={() => {
                                      setSelectedSupplier(supplier);
                                      const m = savedMappings[supplier.id];
                                      setExtractedColumns(
                                        Object.keys(m.mappings),
                                      );
                                      setColumnMappings(m.mappings);
                                      setUploadStep("map");
                                      setMappingModal(true);
                                      setActiveMenu(null);
                                    }}
                                    className="w-full px-3 py-2 text-left text-xs text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                                  >
                                    <FileSpreadsheet size={12} />
                                    View Mapping
                                  </button>
                                )}

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <button
                                      // onClick={() =>
                                      //   handleDeleteSupplier(supplier.id)
                                      // }
                                      className="w-full px-3 py-2 text-left text-xs text-destructive hover:bg-destructive/10 transition-colors border-t border-border flex items-center gap-2"
                                    >
                                      <Trash2 size={12} />
                                      Delete
                                    </button>
                                  </AlertDialogTrigger>

                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Delete Supplier?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete the supplier and its
                                        mapping.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>

                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>

                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDeleteSupplier(supplier.id)
                                        }
                                        className="bg-destructive text-white hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Standard Fields Reference */}
        <div className="rounded-lg border border-border p-5 bg-card">
          <h3 className="text-xs font-semibold text-foreground mb-3">
            Standard System Fields
          </h3>
          <div className="flex flex-wrap gap-2">
            {STANDARD_FIELDS.map((field) => (
              <span
                key={field}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium border ${
                  REQUIRED_FIELDS.includes(field)
                    ? "border-[hsl(210_20%_30%)] bg-[hsl(210_25%_40%/0.12)] text-[hsl(210_20%_30%)]"
                    : "border-[hsl(260_20%_30%)] bg-[hsl(260_25%_40%/0.12)] text-[hsl(260_20%_30%)]"
                }`}
              >
                {REQUIRED_FIELDS.includes(field) && (
                  <span className="text-brand">*</span>
                )}
                {fieldLabel(field)}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-2">
            <span className="text-brand">*</span> Required fields must be mapped
            for each supplier.
          </p>
        </div>
      </div>

      {/* ── Add Supplier Modal ──────────────────────────────── */}
      <Dialog open={addModal} onOpenChange={setAddModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-base">Add Supplier</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Supplier Name</Label>
              <Input
                value={newSupplierName}
                onChange={(e) => setNewSupplierName(e.target.value)}
                placeholder="e.g. McKesson, AmerisourceBergen"
                className="text-xs"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddSupplier();
                    setLoading(true);
                  }
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Email</Label>
              <Input
                value={newSupplierEmail}
                onChange={(e) => setNewSupplierEmail(e.target.value)}
                placeholder="e.g. supplier@email.com"
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddModal(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                handleAddSupplier();
                setLoading(true);
              }}
              className="text-xs bg-foreground text-background hover:bg-foreground/90"
            >
              Add Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Email Modal */}
      <Dialog open={editEmailModal} onOpenChange={setEditEmailModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Edit Email</DialogTitle>
          </DialogHeader>

          <Input
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            placeholder="Enter email"
            className="text-xs"
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditEmailModal(false)}>
              Cancel
            </Button>

            <Button
              onClick={async () => {
                if (!editingSupplier) return;

                const res = await axios.put(
                  `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/suppliers/${editingSupplier.id}/email`,
                  { email: emailInput },
                );

                setSuppliers((prev) =>
                  prev.map((s) => (s.id === editingSupplier.id ? res.data : s)),
                );

                setEditEmailModal(false);
              }}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Mapping Modal ───────────────────────────────────── */}
      <Dialog
        open={mappingModal}
        onOpenChange={(open) => {
          if (!open) {
            setMappingModal(false);
            setSelectedSupplier(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-base flex items-center gap-2">
              <FileSpreadsheet size={16} className="text-muted-foreground" />
              Column Mapping
            </DialogTitle>
            {selectedSupplier && (
              <p className="text-sm text-muted-foreground">
                {selectedSupplier.name}
              </p>
            )}
          </DialogHeader>

          {uploadStep === "upload" ? (
            /* Upload Step */
            <div className="py-6">
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-muted-foreground/40 hover:bg-muted/30 transition-all">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Upload size={18} className="text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium text-foreground">
                      Upload supplier file
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      CSV or Excel file to extract column headers
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          ) : (
            /* Mapping Step */
            <div className="space-y-4 py-2">
              {/* Validation Status */}
              {getUnmappedRequired().length > 0 && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                  <AlertCircle
                    size={14}
                    className="text-destructive shrink-0 mt-0.5"
                  />
                  <div>
                    <p className="text-[11px] font-medium text-destructive">
                      Required fields not mapped:
                    </p>
                    <p className="text-[10px] text-destructive/80 mt-0.5">
                      {getUnmappedRequired().map(fieldLabel).join(", ")}
                    </p>
                  </div>
                </div>
              )}

              {/* Mapping Table */}
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Supplier Column
                      </th>
                      <th className="px-4 py-2.5 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-12">
                        →
                      </th>
                      <th className="px-4 py-2.5 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Map To (System Field)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {extractedColumns.map((col) => {
                      const currentValue = columnMappings[col] || "";
                      return (
                        <tr
                          key={col}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="px-4 py-2.5">
                            <span className="text-xs font-semibold text-foreground font-mono">
                              {col}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-center">
                            <ArrowRight
                              size={12}
                              className="text-muted-foreground mx-auto"
                            />
                          </td>
                          <td className="px-4 py-2.5">
                            <Select
                              value={currentValue}
                              onValueChange={(val) =>
                                handleMappingChange(
                                  col,
                                  val === "__none__" ? "" : val,
                                )
                              }
                            >
                              <SelectTrigger className="h-8 text-xs border-border">
                                <SelectValue placeholder="— Select field —" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="__none__">
                                  <span className="text-muted-foreground">
                                    — Skip —
                                  </span>
                                </SelectItem>
                                {STANDARD_FIELDS.map((field) => {
                                  const used = isFieldUsed(field, col);
                                  return (
                                    <SelectItem
                                      key={field}
                                      value={field}
                                      disabled={used}
                                    >
                                      <span className="flex items-center gap-2">
                                        {fieldLabel(field)}
                                        {REQUIRED_FIELDS.includes(field) && (
                                          <span className="text-brand text-[10px]">
                                            *
                                          </span>
                                        )}
                                        {used && (
                                          <span className="text-muted-foreground text-[10px]">
                                            (used)
                                          </span>
                                        )}
                                      </span>
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {uploadStep === "map" && (
            <DialogFooter>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setUploadStep("upload")}
                className="text-xs"
              >
                Re-upload
              </Button>
              <Button
                size="sm"
                onClick={handleSaveMapping}
                disabled={getUnmappedRequired().length > 0}
                className="text-xs bg-foreground text-background hover:bg-foreground/90 gap-1.5"
              >
                <Check size={12} />
                Save Mapping
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default SupplierMappingPage;
