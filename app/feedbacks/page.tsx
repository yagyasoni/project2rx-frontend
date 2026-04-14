"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Search,
  RefreshCw,
  Trash2,
  Eye,
  Inbox,
  Loader2,
  MessageSquare,
  Clock,
  AlertTriangle,
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
import axios from "axios";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface FeedbackRow {
  id: string;
  pharmacy_name: string;
  user_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const formatDateTime = (iso: string) => {
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

const isWithinLast24h = (iso: string) =>
  Date.now() - new Date(iso).getTime() < 86_400_000;

const isThisWeek = (iso: string) => {
  const now = new Date();
  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay());
  start.setHours(0, 0, 0, 0);
  return new Date(iso) >= start;
};

const isToday = (iso: string) => {
  const d = new Date(iso);
  const n = new Date();
  return d.toDateString() === n.toDateString();
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
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3">
      <div className="flex items-center justify-center h-8 w-8 rounded-md bg-muted">
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
export default function Feedback() {
  const [feedbacks, setFeedbacks] = useState<FeedbackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [deletedCount, setDeletedCount] = useState(0);

  // modals
  const [viewRow, setViewRow] = useState<FeedbackRow | null>(null);
  const [deleteRow, setDeleteRow] = useState<FeedbackRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchFeedbacks();
  //   }, 10000); // every 10 sec

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchFeedbacks(true); // won't show skeletons
    }, 30000); // also increase to 30s — 10s is too aggressive
    return () => clearInterval(interval);
  }, []);

  const fetchFeedbacks = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/feedbacks`,
      );

      const rows = res?.data?.feedbacks ?? [];

      // ✅ Defensive mapping (prevents UI crashes if backend changes)
      const formatted = rows.map((r: any) => ({
        id: String(r.id),
        pharmacy_name: r.pharmacy_name || "—",
        user_name: r.user_name || "—",
        email: r.email || "—",
        phone: r.phone || "—",
        subject: r.subject || "No subject",
        message: r.message || "",
        created_at: r.created_at,
      }));

      const uniqueMap = new Map();

      formatted.forEach((item: FeedbackRow) => {
        uniqueMap.set(item.id, item);
      });

      setFeedbacks(Array.from(uniqueMap.values()));
    } catch (err: any) {
      console.error("Fetch feedback error:", err);

      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch feedback";

      toast.error(msg);

      setFeedbacks([]); // ✅ no demo fallback
    } finally {
      setLoading(false);
    }
  };

  // Filter + search
  const filtered = useMemo(() => {
    let rows = feedbacks;

    // date filter
    if (dateFilter === "today")
      rows = rows.filter((r) => isToday(r.created_at));
    else if (dateFilter === "week")
      rows = rows.filter((r) => isThisWeek(r.created_at));

    // search
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(
        (r) =>
          r.pharmacy_name.toLowerCase().includes(q) ||
          r.user_name.toLowerCase().includes(q) ||
          r.email.toLowerCase().includes(q),
      );
    }
    return rows;
  }, [feedbacks, search, dateFilter]);

  const recentCount = feedbacks.filter((f) =>
    isWithinLast24h(f.created_at),
  ).length;

  // Delete
  const confirmDelete = async () => {
    if (!deleteRow) return;

    const id = deleteRow.id;

    // ✅ Optimistic UI update (instant removal)
    const previous = [...feedbacks];
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    setDeleting(true);

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/feedbacks/${id}`,
      );
      await fetchFeedbacks();

      setDeletedCount((c) => c + 1);
      toast.success("Feedback deleted successfully");
    } catch (err: any) {
      console.error("Delete error:", err);

      // ❌ rollback if failed
      setFeedbacks(previous);

      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to delete feedback";

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
                  FEEDBACK MANAGEMENT
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  View and manage feedback submitted by users
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFeedbacks([]); // clear stale data
                  fetchFeedbacks();
                }}
                className="cursor-pointer gap-1.5 text-xs font-semibold"
              >
                <RefreshCw size={13} />
                Refresh
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                icon={
                  <MessageSquare size={16} className="text-muted-foreground" />
                }
                label="Total Feedbacks"
                value={feedbacks.length}
              />
              <StatCard
                icon={<Clock size={16} className="text-muted-foreground" />}
                label="Recent (24h)"
                value={recentCount}
              />
              {/* <StatCard
                icon={<Trash2 size={16} className="text-muted-foreground" />}
                label="Deleted"
                value={deletedCount}
              /> */}
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
                  placeholder="Search name, email, pharmacy…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[140px] h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-[11px] text-muted-foreground ml-auto">
                {filtered.length} / {feedbacks.length} shown
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
                        Pharmacy
                      </th>
                      <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider min-w-[200px]">
                        Message
                      </th>
                      <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Created At
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
                          {Array.from({ length: 9 }).map((_, j) => (
                            <td key={j} className="px-3 py-3">
                              <Skeleton className="h-4 w-full" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-20">
                          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                            <Inbox size={36} strokeWidth={1.5} />
                            <p className="text-sm font-medium">
                              No feedback available
                            </p>
                            <p className="text-xs">
                              New feedback will appear here
                            </p>
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
                          <td className="px-3 py-2.5 text-xs font-medium text-foreground whitespace-nowrap">
                            {row.pharmacy_name}
                          </td>
                          <td className="px-3 py-2.5 text-xs text-foreground whitespace-nowrap">
                            {row.user_name}
                          </td>
                          <td className="px-3 py-2.5 text-xs font-mono text-muted-foreground whitespace-nowrap">
                            {row.email}
                          </td>
                          <td className="px-3 py-2.5 text-xs font-mono text-muted-foreground whitespace-nowrap">
                            {row.phone}
                          </td>
                          <td className="px-3 py-2.5 text-xs text-foreground whitespace-nowrap max-w-[160px] truncate">
                            {row.subject}
                          </td>
                          <td className="px-3 py-2.5 text-xs text-muted-foreground max-w-[200px]">
                            <p className="line-clamp-2 leading-relaxed">
                              {row.message}
                            </p>
                          </td>
                          <td className="px-3 py-2.5 text-[11px] text-muted-foreground whitespace-nowrap">
                            {formatDateTime(row.created_at)}
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer h-7 w-7"
                                onClick={() => setViewRow(row)}
                              >
                                <Eye size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
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
                {viewRow?.subject}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Full feedback details
              </DialogDescription>
            </DialogHeader>
            {viewRow && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase tracking-wider mb-1">
                      Pharmacy
                    </p>
                    <p className="font-medium text-foreground">
                      {viewRow.pharmacy_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase tracking-wider mb-1">
                      User
                    </p>
                    <p className="font-medium text-foreground">
                      {viewRow.user_name}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase tracking-wider mb-1">
                      Email
                    </p>
                    <p className="font-mono text-muted-foreground">
                      {viewRow.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase tracking-wider mb-1">
                      Phone
                    </p>
                    <p className="font-mono text-muted-foreground">
                      {viewRow.phone}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px] uppercase tracking-wider mb-1.5">
                    Message
                  </p>
                  <div className="rounded-md border border-border bg-muted/30 p-3 text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                    {viewRow.message}
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Submitted: {formatDateTime(viewRow.created_at)}
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
                Delete Feedback
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs">
                Are you sure you want to delete this feedback? This action
                cannot be undone.
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
