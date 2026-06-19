"use client";

import { useEffect, useMemo, useState } from "react";

import axios from "axios";

import {
  Loader2,
  Download,
  Trash2,
  Search,
  Pill,
  CheckCircle2,
  Clock3,
  ArrowUpDown,
  Pencil,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { toast } from "sonner";

import AdminLayout from "@/components/adminLayout";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import adminApi from "@/lib/adminApi";

const STATUS_OPTIONS = ["pending", "reviewed"];

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
    <div className="max-w-[200px] rounded-xl border border-border bg-card p-2 flex items-center gap-3 transition-colors hover:border-foreground/15">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </div>
        <div className="text-2xl font-bold text-foreground leading-tight">
          {value}
        </div>
      </div>
    </div>
  );
}

export default function NdcSheetPage() {
  const [loading, setLoading] = useState(true);

  const [rows, setRows] = useState<any[]>([]);

  const [searchNdc, setSearchNdc] = useState("");

  const [searchDrug, setSearchDrug] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [editingValue, setEditingValue] = useState("");

  const [sortField, setSortField] = useState("updated_at");

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [page, setPage] = useState(1);

  const PAGE_SIZE = 50;

  // =====================================
  // FETCH
  // =====================================

  const fetchNdcSheet = async () => {
    try {
      setLoading(true);

      const res = await adminApi.get(`/admin/ndc-sheet`);

      setRows(res.data || []);
    } catch (error) {
      console.error(error);

      toast.error("Failed to fetch NDC sheet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNdcSheet();
  }, []);

  // =====================================
  // UPDATE
  // =====================================

  const updateNdc = async (id: number, updates: any) => {
    try {
      await adminApi.put(`/admin/ndc-sheet/${id}`, updates);

      setRows((prev) =>
        prev.map((row) =>
          row.id === id
            ? {
                ...row,
                ...updates,
                updated_at: new Date().toISOString(),
              }
            : row,
        ),
      );

      toast.success("Updated successfully");
    } catch (error) {
      console.error(error);

      toast.error("Update failed");
    }
  };

  // =====================================
  // DELETE
  // =====================================

  const deleteNdc = async (id: number) => {
    try {
      await adminApi.delete(`/admin/ndc-sheet/${id}`);

      setRows((prev) => prev.filter((row) => row.id !== id));

      toast.success("Deleted successfully");
    } catch (error) {
      console.error(error);

      toast.error("Delete failed");
    }
  };

  // =====================================
  // SORT
  // =====================================

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // =====================================
  // FORMAT DATE
  // =====================================

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleString("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // =====================================
  // FILTER + SORT
  // =====================================

  const filteredRows = useMemo(() => {
    let filtered = rows.filter((row) => {
      const ndcMatch = row.ndc?.toLowerCase().includes(searchNdc.toLowerCase());

      const drugMatch = row.drug_name
        ?.toLowerCase()
        .includes(searchDrug.toLowerCase());

      const statusMatch = statusFilter === "all" || row.status === statusFilter;

      return ndcMatch && drugMatch && statusMatch;
    });

    filtered.sort((a, b) => {
      let valA = a[sortField] || "";
      let valB = b[sortField] || "";

      valA = typeof valA === "string" ? valA.toLowerCase() : valA;
      valB = typeof valB === "string" ? valB.toLowerCase() : valB;

      if (sortOrder === "asc") {
        return valA > valB ? 1 : -1;
      }

      return valA < valB ? 1 : -1;
    });

    return filtered;
  }, [rows, searchNdc, searchDrug, statusFilter, sortField, sortOrder]);

  // =====================================
  // PAGINATION
  // =====================================

  const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE);

  const paginatedRows = filteredRows.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  useEffect(() => {
    setPage(1);
  }, [searchNdc, searchDrug, statusFilter]);

  // =====================================
  // ANALYTICS
  // =====================================

  const totalRows = rows.length;

  const pendingCount = rows.filter((r) => r.status === "pending").length;

  const reviewedCount = rows.filter((r) => r.status === "reviewed").length;

  // =====================================
  // CSV DOWNLOAD
  // =====================================

  const downloadCSV = () => {
    const headers = ["NDC", "Drug Name", "Status"];

    const csvRows = filteredRows.map((row) => [
      row.ndc,
      row.drug_name,
      row.status,
    ]);

    const csvContent = [headers, ...csvRows].map((e) => e.join(",")).join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.setAttribute("download", "ndc-sheet.csv");

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-32 text-muted-foreground">
          <Loader2 className="animate-spin mr-2 h-5 w-5" />
          Loading NDC Sheet...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-[1500px] mx-auto px-6 py-0">
          <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  NDC MANAGEMENT
                </h1>

                <p className="text-sm text-muted-foreground mt-1">
                  Manage reviewed & pending NDC inventory records
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchNdcSheet}
                  className="gap-1.5 text-xs font-semibold"
                >
                  <RefreshCw size={13} />
                  Refresh
                </Button>

                <Button
                  size="sm"
                  onClick={downloadCSV}
                  className="gap-1.5 text-xs font-semibold"
                >
                  <Download size={13} />
                  Download CSV
                </Button>
              </div>
            </div>

            {/* ANALYTICS */}
            {/* <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
                <Pill size={15} className="text-blue-500" />

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Total NDC
                  </p>

                  <p className="text-sm font-semibold">{totalRows}</p>
                </div> */}
            {/* </div>

              <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
                <Clock3 size={15} className="text-yellow-500" />

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Pending
                  </p>

                  <p className="text-sm font-semibold">{pendingCount}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
                <CheckCircle2 size={15} className="text-emerald-500" />

                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Reviewed
                  </p>

                  <p className="text-sm font-semibold">{reviewedCount}</p>
                </div>
              </div> */}
            <div className="flex grid grid-cols-3 lg:grid-cols-3 gap-4 max-w-xl">
              <StatCard
                icon={<Pill size={20} className="text-blue-500" />}
                label="Total NDC"
                value={totalRows}
              />
              <StatCard
                icon={<Clock3 size={20} className="text-yellow-500" />}
                label="Pending"
                value={pendingCount}
              />
              <StatCard
                icon={<CheckCircle2 size={20} className="text-emerald-500" />}
                label="Reviewed"
                value={reviewedCount}
              />
            </div>

            {/* FILTERS */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* SEARCH NDC */}
              <div className="relative w-[260px]">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                  type="text"
                  placeholder="Search by NDC..."
                  value={searchNdc}
                  onChange={(e) => setSearchNdc(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>

              {/* SEARCH DRUG */}
              <div className="relative w-[320px]">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                  type="text"
                  placeholder="Search by Drug Name..."
                  value={searchDrug}
                  onChange={(e) => setSearchDrug(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>

              {/* STATUS */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px] h-9 text-xs">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>

                  <SelectItem value="pending">Pending</SelectItem>

                  <SelectItem value="reviewed">Reviewed</SelectItem>
                </SelectContent>
              </Select>

              <span className="text-[11px] text-muted-foreground ml-auto">
                {filteredRows.length} / {rows.length} shown
              </span>
            </div>

            {/* TABLE */}
            <div className="rounded-lg border border-border overflow-hidden bg-card">
              <div className="overflow-x-auto overflow-y-hidden">
                <table className="w-full table-fixed">
                  <thead className="border-b border-border bg-background">
                    <tr>
                      {/* NDC */}
                      <th className="w-[220px] px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <button
                          onClick={() => handleSort("ndc")}
                          className="flex items-center gap-1"
                        >
                          NDC
                          <ArrowUpDown size={12} />
                        </button>
                      </th>

                      {/* DRUG NAME */}
                      <th className="w-[420px] px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <button
                          onClick={() => handleSort("drug_name")}
                          className="flex items-center gap-1"
                        >
                          Drug Name
                          <ArrowUpDown size={12} />
                        </button>
                      </th>

                      {/* STATUS */}
                      <th className="w-[180px] px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <button
                          onClick={() => handleSort("status")}
                          className="flex items-center gap-1"
                        >
                          Status
                          <ArrowUpDown size={12} />
                        </button>
                      </th>

                      {/* UPDATED */}
                      <th className="w-[220px] px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <button
                          onClick={() => handleSort("updated_at")}
                          className="flex items-center gap-1"
                        >
                          Updated At
                          <ArrowUpDown size={12} />
                        </button>
                      </th>

                      {/* ACTIONS */}
                      {/* <th className="w-[100px] px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Actions
                      </th> */}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-border">
                    {paginatedRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-24 text-center text-sm text-muted-foreground"
                        >
                          No records found
                        </td>
                      </tr>
                    ) : (
                      paginatedRows.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          {/* NDC */}
                          <td className="px-4 py-4">
                            <div className="inline-flex max-w-full items-center rounded-full  px-3 py-1 text-xs font-semibold text-blue-600 truncate">
                              {row.ndc}
                            </div>
                          </td>

                          {/* DRUG */}
                          <td className="px-4 py-4">
                            {editingId === row.id ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={editingValue}
                                  onChange={(e) =>
                                    setEditingValue(e.target.value)
                                  }
                                  className="h-9 text-xs uppercase"
                                />

                                <Button
                                  size="sm"
                                  className="h-9 text-xs"
                                  onClick={async () => {
                                    await updateNdc(row.id, {
                                      drug_name: editingValue.toUpperCase(),
                                    });

                                    setEditingId(null);
                                  }}
                                >
                                  Save
                                </Button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <p
                                  title={row.drug_name}
                                  className="text-sm font-medium text-foreground truncate max-w-[340px]"
                                >
                                  {row.drug_name}
                                </p>

                                <button
                                  onClick={() => {
                                    setEditingId(row.id);

                                    setEditingValue(row.drug_name || "");
                                  }}
                                  className="shrink-0 text-muted-foreground hover:text-foreground"
                                >
                                  <Pencil size={14} />
                                </button>
                              </div>
                            )}
                          </td>

                          {/* STATUS */}
                          <td className="px-4 py-4">
                            <Select
                              value={row.status}
                              onValueChange={(value) =>
                                updateNdc(row.id, {
                                  status: value,
                                })
                              }
                            >
                              <SelectTrigger className="w-[130px] h-9 text-xs">
                                <SelectValue />
                              </SelectTrigger>

                              <SelectContent>
                                {STATUS_OPTIONS.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </td>

                          {/* UPDATED */}
                          <td className="px-4 py-4 text-xs text-muted-foreground whitespace-nowrap">
                            {formatDate(row.updated_at)}
                          </td>

                          {/* ACTIONS */}
                          {/* <td className="px-4 py-4">
                            <div className="flex justify-center">
                              <button
                                onClick={() => deleteNdc(row.id)}
                                className="rounded-md p-2 text-red-500 hover:bg-red-500/10 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td> */}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION */}
              <div className="flex items-center justify-between border-t border-border px-4 py-3">
                <p className="text-xs text-muted-foreground">
                  Page {page} of {totalPages || 1}
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => prev - 1)}
                    className="h-8 px-3 text-xs"
                  >
                    <ChevronLeft size={14} />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((prev) => prev + 1)}
                    className="h-8 px-3 text-xs"
                  >
                    <ChevronRight size={14} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
