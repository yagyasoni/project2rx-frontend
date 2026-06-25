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
  Store,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import adminApi from "@/lib/adminApi";

// ─────────────────────────────────────────────────────────────
// API  (plain api — these are user endpoints, NOT admin)
//   GET    /api/inventory-view/listings
//   DELETE /api/inventory-view/listings/:id          → soft-delete listing
// If your api baseURL already includes "/api", drop the "/api" below.
// ─────────────────────────────────────────────────────────────
const BASE = "/api/inventory-view";

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
  reason_code: string;
  visibility: string;
  listed_at: string;
  owner_user_id: string;
  pharmacy_name: string;
  pharmacy_email: string;
  phone: string;
  isMine: boolean;
}

type SortDir = "asc" | "desc";
interface SortConfig {
  key: keyof ListingRow | null;
  dir: SortDir;
}

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

const formatReason = (v: string) => {
  if (!v || v === "—") return "—";
  return v.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const isExpired = (iso: string) =>
  !!iso && new Date(iso).getTime() < Date.now();

const isExpiringSoon = (iso: string) => {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  const now = Date.now();
  return t >= now && t - now <= 90 * 86_400_000; // within 90 days
};

const toNum = (v: any): number | null => {
  if (v === "" || v === null || v === undefined || v === "—") return null;
  const n = Number(v);
  return isNaN(n) ? null : n;
};

const visibilityLabel = (v: string) => {
  switch ((v || "").toLowerCase()) {
    case "public":
      return "Public";
    case "groups_only":
      return "Group";
    // case "private":
    //   return "Private";
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
    // case "private":
    //   return "bg-muted text-muted-foreground border-border";
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
// SORTABLE HEADER CELL
// ─────────────────────────────────────────────────────────────
function SortableTh({
  label,
  columnKey,
  sortConfig,
  onSort,
}: {
  label: string;
  columnKey: keyof ListingRow;
  sortConfig: SortConfig;
  onSort: (key: keyof ListingRow) => void;
}) {
  const active = sortConfig.key === columnKey;
  return (
    <th className="px-3 py-3 text-left">
      <button
        type="button"
        onClick={() => onSort(columnKey)}
        className={`group inline-flex items-center gap-1 cursor-pointer select-none text-[11px] font-semibold uppercase tracking-wider transition-colors ${
          active
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {label}
        {active ? (
          sortConfig.dir === "asc" ? (
            <ChevronUp size={12} />
          ) : (
            <ChevronDown size={12} />
          )
        ) : (
          <ChevronsUpDown
            size={12}
            className="opacity-40 group-hover:opacity-70"
          />
        )}
      </button>
    </th>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function Reports() {
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("all"); // all | public | groups_only | private
  const [expiryFilter, setExpiryFilter] = useState("all"); // all | soon | expired
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: "listed_at",
    dir: "desc",
  });

  // modals
  const [viewRow, setViewRow] = useState<ListingRow | null>(null);

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
    reason_code: r.reason_code || "—",
    visibility: r.visibility || "—",
    listed_at: r.listed_at || r.created_at,
    owner_user_id: r.owner_user_id ? String(r.owner_user_id) : "",
    // ✅ Pharmacy fields can arrive flat OR nested (mapListingRow shape).
    // Cover both so the pharmacy name always resolves.
    pharmacy_name:
      r.pharmacy_name || r.pharmacy?.pharmacy_name || r.pharmacy?.name || "—",
    pharmacy_email: r.pharmacy_email || r.pharmacy?.email || r.email || "—",
    phone: r.phone || r.pharmacy?.phone || "—",
    isMine,
  });

  const fetchListings = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const res = await adminApi.get(`${BASE}/listings`);

      const others = res?.data?.listings ?? [];
      console.log("listings", others);
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

  // ── Sort toggle ──────────────────────────────────────────────
  const handleSort = (key: keyof ListingRow) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
  };

  // Filter + search
  const filtered = useMemo(() => {
    let rows = listings;

    // visibility
    if (visibilityFilter !== "all")
      rows = rows.filter(
        (r) => (r.visibility || "").toLowerCase() === visibilityFilter,
      );

    // expiry
    if (expiryFilter === "expired")
      rows = rows.filter((r) => isExpired(r.expiry));
    else if (expiryFilter === "soon")
      rows = rows.filter((r) => isExpiringSoon(r.expiry));

    // search
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
  }, [listings, search, visibilityFilter, expiryFilter]);

  // Sort (missing values pushed to the bottom either direction)
  const sorted = useMemo(() => {
    const { key, dir } = sortConfig;
    if (!key) return filtered;

    const numericKeys: (keyof ListingRow)[] = ["quantity", "acquisition_cost"];
    const dateKeys: (keyof ListingRow)[] = ["expiry", "listed_at"];
    const factor = dir === "asc" ? 1 : -1;

    const arr = [...filtered];
    arr.sort((a, b) => {
      if (numericKeys.includes(key)) {
        const an = toNum((a as any)[key]);
        const bn = toNum((b as any)[key]);
        if (an === null && bn === null) return 0;
        if (an === null) return 1;
        if (bn === null) return -1;
        return (an - bn) * factor;
      }
      if (dateKeys.includes(key)) {
        const at = (a as any)[key] ? new Date((a as any)[key]).getTime() : null;
        const bt = (b as any)[key] ? new Date((b as any)[key]).getTime() : null;
        if (at === null && bt === null) return 0;
        if (at === null) return 1;
        if (bt === null) return -1;
        return (at - bt) * factor;
      }
      const av = ((a as any)[key] ?? "").toString().toLowerCase();
      const bv = ((b as any)[key] ?? "").toString().toLowerCase();
      return av.localeCompare(bv) * factor;
    });
    return arr;
  }, [filtered, sortConfig]);

  // Stats (aligned with the active filters)
  const publicCount = listings.filter(
    (l) => (l.visibility || "").toLowerCase() === "public",
  ).length;
  const expiredCount = listings.filter((l) => isExpired(l.expiry)).length;

  // ── Delete listing ───────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteRow) return;
    const id = deleteRow.id;

    // ✅ Optimistic removal
    const previous = [...listings];
    setListings((prev) => prev.filter((l) => l.id !== id));
    setDeleting(true);

    try {
      await adminApi.delete(`${BASE}/listings/${id}`);
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
                  Browse listings, view details, or remove a listing
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
                icon={<Store size={20} className="text-emerald-500" />}
                label="Public"
                value={publicCount}
              />
              <StatCard
                icon={<AlertTriangle size={20} className="text-red-500" />}
                label="Expired"
                value={expiredCount}
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

              {/* Visibility */}
              <Select
                value={visibilityFilter}
                onValueChange={setVisibilityFilter}
              >
                <SelectTrigger className="w-[150px] h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Visibility (All)</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="groups_only">Group</SelectItem>
                  {/* <SelectItem value="private">Private</SelectItem> */}
                </SelectContent>
              </Select>

              {/* Expiry */}
              <Select value={expiryFilter} onValueChange={setExpiryFilter}>
                <SelectTrigger className="w-[150px] h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Expiry Date (All)</SelectItem>
                  <SelectItem value="soon">Expiring Soon</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
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
                  {/* Opaque sticky header → rows no longer show through while scrolling */}
                  <thead className="sticky top-0 z-20 bg-muted [&_th]:bg-muted">
                    <tr>
                      <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-10">
                        #
                      </th>
                      <SortableTh
                        label="Drug"
                        columnKey="drug_name"
                        sortConfig={sortConfig}
                        onSort={handleSort}
                      />
                      <SortableTh
                        label="NDC"
                        columnKey="ndc"
                        sortConfig={sortConfig}
                        onSort={handleSort}
                      />
                      <SortableTh
                        label="Pharmacy"
                        columnKey="pharmacy_name"
                        sortConfig={sortConfig}
                        onSort={handleSort}
                      />
                      <SortableTh
                        label="Qty"
                        columnKey="quantity"
                        sortConfig={sortConfig}
                        onSort={handleSort}
                      />
                      <SortableTh
                        label="Expiry"
                        columnKey="expiry"
                        sortConfig={sortConfig}
                        onSort={handleSort}
                      />
                      <SortableTh
                        label="Cost"
                        columnKey="acquisition_cost"
                        sortConfig={sortConfig}
                        onSort={handleSort}
                      />
                      <SortableTh
                        label="Reason"
                        columnKey="reason_code"
                        sortConfig={sortConfig}
                        onSort={handleSort}
                      />
                      <SortableTh
                        label="Visibility"
                        columnKey="visibility"
                        sortConfig={sortConfig}
                        onSort={handleSort}
                      />
                      <SortableTh
                        label="Listed At"
                        columnKey="listed_at"
                        sortConfig={sortConfig}
                        onSort={handleSort}
                      />
                      <th className="px-3 py-3 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-24">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-card divide-y divide-border">
                    {loading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <tr key={i}>
                          {Array.from({ length: 11 }).map((_, j) => (
                            <td key={j} className="px-3 py-3">
                              <Skeleton className="h-4 w-full" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : sorted.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="py-20">
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
                      sorted.map((row, idx) => (
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
                          <td
                            className={`px-3 py-2.5 text-[11px] whitespace-nowrap ${
                              isExpired(row.expiry)
                                ? "text-destructive font-medium"
                                : "text-muted-foreground"
                            }`}
                          >
                            {formatDate(row.expiry)}
                          </td>
                          <td className="px-3 py-2.5 text-xs font-mono text-foreground whitespace-nowrap">
                            {formatCost(row.acquisition_cost)}
                          </td>
                          <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap max-w-[140px] truncate">
                            {formatReason(row.reason_code)}
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
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Delete listing"
                                className="cursor-pointer h-7 w-7 text-destructive hover:text-destructive"
                                onClick={() => setDeleteRow(row)}
                              >
                                <Trash2 size={14} />
                              </Button>
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
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase tracking-wider mb-1">
                      Reason
                    </p>
                    <p className="font-medium text-foreground">
                      {formatReason(viewRow.reason_code)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase tracking-wider mb-1">
                      Visibility
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${visibilityStyle(
                        viewRow.visibility,
                      )}`}
                    >
                      {visibilityLabel(viewRow.visibility)}
                    </span>
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
                className="bg-red-600 text-white hover:bg-red-700 transition-colors focus-visible:ring-2 focus-visible:ring-red-400 cursor-pointer"
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
