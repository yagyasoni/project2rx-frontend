"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  RefreshCw,
  Trash2,
  Eye,
  Inbox,
  Loader2,
  Pill,
  Package,
  Store,
  AlertTriangle,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import AdminLayout from "@/components/adminLayout";
import axios from "axios";

// ─────────────────────────────────────────────────────────────
// API  (plain axios — these are user endpoints, NOT admin)
//   GET    /api/inventory-view/listings
//   DELETE /api/inventory-view/listings/:id          → soft-delete own listing
//   POST   /api/inventory-view/listings/:id/report   → { reason_code, details }
// If your axios baseURL already includes "/api", drop the "/api" below.
// ─────────────────────────────────────────────────────────────
const BASE = "https://api.auditprorx.com/api/inventory-view";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface ListingRow {
  id: string;
  ndc: string;
  drug_name: string;
  strength: string;
  dosage_form: string;
  manufacturer: string;
  package_size: string;
  quantity: string;
  lot_number: string;
  expiry: string;
  acquisition_cost: string;
  visibility: string;
  listed_at: string;
  owner_user_id: string;
  pharmacy_name: string;
  pharmacy_email: string;
  phone: string;
  isMine: boolean;
}

// ─────────────────────────────────────────────────────────────
// REPORT REASONS
// ─────────────────────────────────────────────────────────────
const REPORT_REASONS = [
  { value: "counterfeit", label: "Counterfeit / Suspicious" },
  { value: "expired", label: "Expired / Recalled" },
  { value: "pricing", label: "Pricing Issue" },
  { value: "misleading", label: "Misleading / Inaccurate" },
  { value: "inappropriate", label: "Inappropriate" },
  { value: "duplicate", label: "Duplicate Listing" },
  { value: "other", label: "Other" },
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const formatDateTime = (iso: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    ", " +
    d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  );
};

const formatDate = (iso: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const formatCost = (v: any) => {
  const n = Number(v);
  if (v === null || v === undefined || v === "" || isNaN(n)) return "—";
  return "$" + n.toFixed(2);
};

const visibilityLabel = (v: string) => {
  switch ((v || "").toLowerCase()) {
    case "public":
      return "Public";
    case "groups_only":
      return "Groups";
    case "private":
      return "Private";
    default:
      return v || "—";
  }
};

const visibilityStyle = (v: string) => {
  switch ((v || "").toLowerCase()) {
    case "public":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
    case "groups_only":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    case "private":
      return "bg-muted text-muted-foreground border-border";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
};

// ─────────────────────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="max-w-[190px] flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
      <div className="flex items-center justify-center h-8 w-8 rounded-md">
        {icon}
      </div>
      <div>
        <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium">
          {label}
        </p>
        <p className="text-lg font-bold text-foreground leading-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Reports() {
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("all"); // all | mine | available

  // modals
  const [viewRow, setViewRow] = useState<ListingRow | null>(null);

  // report
  const [reportRow, setReportRow] = useState<ListingRow | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [reporting, setReporting] = useState(false);

  // delete
  const [deleteRow, setDeleteRow] = useState<ListingRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchListings(true); // silent → no skeletons
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const mapRow = (r: any, isMine: boolean): ListingRow => ({
    id: String(r.id),
    ndc: r.ndc || "—",
    drug_name: r.drug_name || "—",
    strength: r.strength || "",
    dosage_form: r.dosage_form || "",
    manufacturer: r.manufacturer || "—",
    package_size: r.package_size || "—",
    quantity: r.quantity ?? "—",
    lot_number: r.lot_number || "—",
    expiry: r.expiry || "",
    acquisition_cost: r.acquisition_cost ?? "",
    visibility: r.visibility || "—",
    listed_at: r.listed_at || r.created_at,
    owner_user_id: r.owner_user_id ? String(r.owner_user_id) : "",
    pharmacy_name: r.pharmacy_name || "—",
    pharmacy_email: r.pharmacy_email || "—",
    phone: r.phone || "—",
    isMine,
  });

  const fetchListings = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const res = await axios.get(`${BASE}/listings`);

      const others = res?.data?.listings ?? [];
      const mine = res?.data?.my_listings ?? [];

      // ✅ Defensive mapping + ownership flag
      const merged: ListingRow[] = [
        ...mine.map((r: any) => mapRow(r, true)),
        ...others.map((r: any) => mapRow(r, false)),
      ];

      // de-dupe by id
      const uniqueMap = new Map<string, ListingRow>();
      merged.forEach((item) => uniqueMap.set(item.id, item));

      setListings(Array.from(uniqueMap.values()));
    } catch (err: any) {
      console.error("Fetch listings error:", err);
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch listings";
      toast.error(msg);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter + search
  const filtered = useMemo(() => {
    let rows = listings;

    if (ownerFilter === "mine") rows = rows.filter((r) => r.isMine);
    else if (ownerFilter === "available") rows = rows.filter((r) => !r.isMine);

    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.drug_name.toLowerCase().includes(q) ||
          r.ndc.toLowerCase().includes(q) ||
          r.pharmacy_name.toLowerCase().includes(q),
      );
    }
    return rows;
  }, [listings, search, ownerFilter]);

  const mineCount = listings.filter((l) => l.isMine).length;
  const availableCount = listings.filter((l) => !l.isMine).length;

  // ── Report a listing ─────────────────────────────────────────
  const openReport = (row: ListingRow) => {
    setReportReason("");
    setReportDetails("");
    setReportRow(row);
  };

  const submitReport = async () => {
    if (!reportRow) return;
    if (!reportReason) {
      toast.error("Please select a reason");
      return;
    }
    setReporting(true);
    try {
      await axios.post(`${BASE}/listings/${reportRow.id}/report`, {
        reason_code: reportReason,
        details: reportDetails.trim() || null,
      });
      toast.success("Listing reported. Thank you.");
      setReportRow(null);
    } catch (err: any) {
      console.error("Report error:", err);
      const msg =
        err?.response?.data?.error || err?.message || "Failed to submit report";
      toast.error(msg);
    } finally {
      setReporting(false);
    }
  };

  // ── Delete own listing ───────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteRow) return;
    const id = deleteRow.id;

    // ✅ Optimistic removal
    const previous = [...listings];
    setListings((prev) => prev.filter((l) => l.id !== id));
    setDeleting(true);

    try {
      await axios.delete(`${BASE}/listings/${id}`);
      toast.success("Listing deleted successfully");
    } catch (err: any) {
      console.error("Delete error:", err);
      setListings(previous); // ❌ rollback
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "Failed to delete listing";
      toast.error(msg);
    } finally {
      setDeleting(false);
      setDeleteRow(null);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-[1400px] mx-auto px-6 py-0">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  INVENTORY LISTINGS
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Browse listings, report problems, or remove your own
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setListings([]); // clear stale data
                  fetchListings();
                }}
                className="cursor-pointer gap-1.5 text-xs font-semibold"
              >
                <RefreshCw size={13} />
                Refresh
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-[max-content]">
              <StatCard
                icon={<Pill size={20} className="text-teal-500" />}
                label="Total Listings"
                value={listings.length}
              />
              <StatCard
                icon={<Package size={20} className="text-blue-500" />}
                label="Available"
                value={availableCount}
              />
              <StatCard
                icon={<Store size={20} className="text-emerald-500" />}
                label="My Listings"
                value={mineCount}
              />
            </div>

            {/* Search & Filter */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 max-w-sm">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="text"
                  placeholder="Search drug, NDC, pharmacy…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>
              <Select value={ownerFilter} onValueChange={setOwnerFilter}>
                <SelectTrigger className="w-[150px] h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Listings</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="mine">My Listings</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-[11px] text-muted-foreground ml-auto">
                {filtered.length} / {listings.length} shown
              </span>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-border overflow-hidden">
              <div
                className="overflow-auto"
                style={{ maxHeight: "calc(100vh - 380px)" }}
              >
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/50 sticky top-0 z-10">
                    <tr>
                      <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-10">
                        #
                      </th>
                      <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Drug
                      </th>
                      <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        NDC
                      </th>
                      <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Pharmacy
                      </th>
                      <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Qty
                      </th>
                      <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Expiry
                      </th>
                      <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Cost
                      </th>
                      <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Visibility
                      </th>
                      <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Listed At
                      </th>
                      <th className="px-3 py-3 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-24">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          {Array.from({ length: 10 }).map((_, j) => (
                            <td key={j} className="px-3 py-3">
                              <Skeleton className="h-4 w-full" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-20">
                          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                            <Inbox size={36} strokeWidth={1.5} />
                            <p className="text-sm font-medium">
                              No listings available
                            </p>
                            <p className="text-xs">Listings will appear here</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filtered.map((row, idx) => (
                        <tr
                          key={row.id}
                          className="transition-colors hover:bg-muted/40"
                        >
                          <td className="px-3 py-2.5 text-xs text-muted-foreground">
                            {idx + 1}
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap max-w-[200px]">
                            <p className="text-xs font-medium text-foreground truncate">
                              {row.drug_name}
                            </p>
                            <p className="text-[11px] text-muted-foreground truncate">
                              {[row.strength, row.dosage_form]
                                .filter(Boolean)
                                .join(" · ")}
                            </p>
                          </td>
                          <td className="px-3 py-2.5 text-xs font-mono text-muted-foreground whitespace-nowrap">
                            {row.ndc}
                          </td>
                          <td className="px-3 py-2.5 text-xs text-foreground whitespace-nowrap max-w-[160px] truncate">
                            <span className="inline-flex items-center gap-1.5">
                              {row.pharmacy_name}
                              {row.isMine && (
                                <span className="rounded bg-emerald-500/10 text-emerald-600 text-[9px] font-semibold px-1 py-0.5 uppercase tracking-wider">
                                  You
                                </span>
                              )}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-xs text-foreground whitespace-nowrap">
                            {row.quantity}
                          </td>
                          <td className="px-3 py-2.5 text-[11px] text-muted-foreground whitespace-nowrap">
                            {formatDate(row.expiry)}
                          </td>
                          <td className="px-3 py-2.5 text-xs font-mono text-foreground whitespace-nowrap">
                            {formatCost(row.acquisition_cost)}
                          </td>
                          <td className="px-3 py-2.5">
                            <span
                              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${visibilityStyle(
                                row.visibility,
                              )}`}
                            >
                              {visibilityLabel(row.visibility)}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-[11px] text-muted-foreground whitespace-nowrap">
                            {formatDateTime(row.listed_at)}
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center justify-center gap-0.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                title="View details"
                                className="cursor-pointer h-7 w-7"
                                onClick={() => setViewRow(row)}
                              >
                                <Eye size={14} />
                              </Button>
                              {row.isMine ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Delete listing"
                                  className="cursor-pointer h-7 w-7 text-destructive hover:text-destructive"
                                  onClick={() => setDeleteRow(row)}
                                >
                                  <Trash2 size={14} />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  title="Report listing"
                                  className="cursor-pointer h-7 w-7 text-amber-600 hover:text-amber-600"
                                  onClick={() => openReport(row)}
                                >
                                  <Flag size={14} />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* View Modal */}
        <Dialog open={!!viewRow} onOpenChange={() => setViewRow(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-base">
                {viewRow?.drug_name}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Full listing details
              </DialogDescription>
            </DialogHeader>
            {viewRow && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase tracking-wider mb-1">
                      NDC
                    </p>
                    <p className="font-mono text-muted-foreground">
                      {viewRow.ndc}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase tracking-wider mb-1">
                      Strength / Form
                    </p>
                    <p className="font-medium text-foreground">
                      {[viewRow.strength, viewRow.dosage_form]
                        .filter(Boolean)
                        .join(" · ") || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase tracking-wider mb-1">
                      Manufacturer
                    </p>
                    <p className="font-medium text-foreground">
                      {viewRow.manufacturer}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase tracking-wider mb-1">
                      Package Size
                    </p>
                    <p className="font-medium text-foreground">
                      {viewRow.package_size}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase tracking-wider mb-1">
                      Quantity
                    </p>
                    <p className="font-medium text-foreground">
                      {viewRow.quantity}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase tracking-wider mb-1">
                      Lot #
                    </p>
                    <p className="font-mono text-muted-foreground">
                      {viewRow.lot_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase tracking-wider mb-1">
                      Expiry
                    </p>
                    <p className="font-medium text-foreground">
                      {formatDate(viewRow.expiry)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase tracking-wider mb-1">
                      Acquisition Cost
                    </p>
                    <p className="font-mono text-foreground">
                      {formatCost(viewRow.acquisition_cost)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground text-[11px] uppercase tracking-wider mb-1">
                      Pharmacy
                    </p>
                    <p className="font-medium text-foreground">
                      {viewRow.pharmacy_name}
                    </p>
                    <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
                      {viewRow.pharmacy_email} · {viewRow.phone}
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Listed: {formatDateTime(viewRow.listed_at)}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Report Modal */}
        <Dialog
          open={!!reportRow}
          onOpenChange={() => !reporting && setReportRow(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base flex items-center gap-2">
                <Flag size={16} className="text-amber-600" />
                Report Listing
              </DialogTitle>
              <DialogDescription className="text-xs">
                {reportRow
                  ? `Reporting "${reportRow.drug_name}" from ${reportRow.pharmacy_name}.`
                  : ""}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-1">
              <div>
                <p className="text-muted-foreground text-[11px] uppercase tracking-wider mb-1.5">
                  Reason
                </p>
                <Select value={reportReason} onValueChange={setReportReason}>
                  <SelectTrigger className="h-9 text-xs">
                    <SelectValue placeholder="Select a reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {REPORT_REASONS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <p className="text-muted-foreground text-[11px] uppercase tracking-wider mb-1.5">
                  Details{" "}
                  <span className="normal-case text-muted-foreground/70">
                    (optional)
                  </span>
                </p>
                <Textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Add any extra context…"
                  rows={4}
                  className="text-xs resize-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={reporting}
                  onClick={() => setReportRow(null)}
                  className="cursor-pointer text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  disabled={reporting || !reportReason}
                  onClick={submitReport}
                  className="cursor-pointer text-xs h-9 bg-amber-600 text-white hover:bg-amber-600/90"
                >
                  {reporting ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Submitting…
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation */}
        <AlertDialog
          open={!!deleteRow}
          onOpenChange={() => !deleting && setDeleteRow(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-base">
                <AlertTriangle size={16} className="text-destructive" />
                Delete Listing
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs">
                Are you sure you want to delete{" "}
                {deleteRow ? `"${deleteRow.drug_name}"` : "this listing"}? This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                disabled={deleting}
                className="cursor-pointer text-xs h-9"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                disabled={deleting}
                className="cursor-pointer text-xs h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleting ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Deleting…
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
