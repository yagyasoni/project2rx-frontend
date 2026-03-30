"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Users,
  RefreshCw,
  Search,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  LogIn,
  Building2,
  Loader2,
  AlertTriangle,
  Activity,
  TrendingUp,
  Clock,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import AdminLayout from "@/components/adminLayout";

// ─────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────
const API_BASE = "https://api.auditprorx.com";

// ─────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────
interface PharmacyUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role?: string;
  status?: "active" | "inactive";
  createdAt?: string;
  pharmacyName?: string; // ✅ NEW — fetched from registration
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
const avatarChar = (name: string) => name?.charAt(0)?.toUpperCase() || "P";
const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

// ─────────────────────────────────────────────────────────────
// STAT CARD (inline, matching theme)
// ─────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 flex items-center gap-3">
      <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-xl font-bold text-foreground leading-none">
          {value}
        </div>
        <div className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider font-semibold">
          {label}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<PharmacyUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [impersonating, setImpersonating] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PharmacyUser | null>(null);
  const [fetchError, setFetchError] = useState("");
  const [now, setNow] = useState<Date | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);

  useEffect(() => {
    setNow(new Date());
    fetchUsers();
    const tick = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(tick);
  }, []);

  const handleToggleStatus = async (user: PharmacyUser) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    setStatusLoading(true);
    try {
      await axios.put(`${API_BASE}/auth/user-status/${user.id}`, {
        status: newStatus,
      });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)),
      );
      setSelected((prev) =>
        prev?.id === user.id ? { ...prev, status: newStatus } : prev,
      );
      toast.success(`User marked as ${newStatus}`);
    } catch {
      toast.error("Failed to update status.");
    } finally {
      setStatusLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setFetchError("");
    try {
      const res = await axios.get(`${API_BASE}/auth/users`);
      const data = res.data?.users || res.data || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      setFetchError("Could not reach the API server.");
      setUsers([
        {
          id: "1",
          name: "Apollo Pharmacy",
          email: "apollo@pharmsys.com",
          phone: "9876543210",
          createdAt: "2024-03-01T00:00:00Z",
          status: "active",
        },
        {
          id: "2",
          name: "MedPlus Health",
          email: "medplus@pharmsys.com",
          phone: "9812345678",
          createdAt: "2024-05-12T00:00:00Z",
          status: "active",
        },
        {
          id: "3",
          name: "Netmeds Store",
          email: "netmeds@pharmsys.com",
          phone: "9700011122",
          createdAt: "2024-07-20T00:00:00Z",
          status: "inactive",
        },
        {
          id: "4",
          name: "Wellness Forever",
          email: "wellness@pharmsys.com",
          phone: "9988776655",
          createdAt: "2024-08-30T00:00:00Z",
          status: "active",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPharmacy = async (user: PharmacyUser) => {
    setImpersonating(user.id);
    try {
      const res = await axios.post(`${API_BASE}/auth/impersonate`, {
        userId: user.id,
      });
      const { accessToken, refreshToken } = res.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userEmail", user.email);
      router.push("/Mainpage");
    } catch {
      toast.error("Impersonation failed. Please try again.");
    } finally {
      setImpersonating(null);
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q)
    );
  });

  const activeCount = users.filter((u) => u.status === "active").length;
  const thisMonthCount = users.filter((u) => {
    const d = u.createdAt ? new Date(u.createdAt) : null;
    return d && d.getMonth() === new Date().getMonth();
  }).length;

  return (
    <AdminLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-[1400px] mx-auto px-6 py-0">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  PHARMACY USERS
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage pharmacy accounts, view details, and access portals
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchUsers}
                  className="cursor-pointer gap-1.5 text-xs font-semibold"
                >
                  <RefreshCw size={13} />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Error Banner */}
            {fetchError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20 text-sm">
                <AlertTriangle
                  size={14}
                  className="text-destructive shrink-0"
                />
                <span className="text-foreground">{fetchError}</span>
                <span className="text-muted-foreground">
                  — showing demo data.
                </span>
              </div>
            )}

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<Users size={16} className="text-muted-foreground" />}
                label="Total Users"
                value={users.length}
              />
              <StatCard
                icon={<Activity size={16} className="text-muted-foreground" />}
                label="Active Users"
                value={activeCount}
              />
              <StatCard
                icon={
                  <TrendingUp size={16} className="text-muted-foreground" />
                }
                label="This Month"
                value={thisMonthCount}
              />
              <StatCard
                icon={<Clock size={16} className="text-muted-foreground" />}
                label="Pending Review"
                value={0}
              />
            </div>

            {/* Search */}
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  type="text"
                  placeholder="Search name, email, phone…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 text-xs"
                />
              </div>
              <span className="text-[11px] text-muted-foreground">
                {filtered.length} / {users.length} shown
              </span>
            </div>

            {/* Two-column layout: Table + Detail */}
            <div
              className="flex flex-col lg:flex-row gap-5"
              style={{ minHeight: 460 }}
            >
              {/* LEFT — Users Table */}
              <div className="w-full lg:w-[55%] rounded-lg border border-border overflow-hidden">
                <div
                  className="overflow-auto"
                  style={{ maxHeight: "calc(100vh - 180px)" }}
                >
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted sticky top-0 z-10">
                      <tr>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-12">
                          #
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Pharmacy
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Contact
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                          Registered
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="text-center py-16">
                            <div className="flex flex-col items-center gap-3">
                              <Loader2
                                size={20}
                                className="animate-spin text-muted-foreground"
                              />
                              <p className="text-xs text-muted-foreground">
                                Loading pharmacies…
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : filtered.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-16">
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                                <Building2
                                  size={20}
                                  className="text-muted-foreground"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  No pharmacies found
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  Try adjusting your search query.
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filtered.map((user, index) => {
                          const isSelected = selected?.id === user.id;
                          return (
                            <tr
                              key={user.id || index}
                              onClick={() => setSelected(user)}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? "bg-muted/60" : "hover:bg-muted/30"
                              }`}
                            >
                              <td className="px-4 py-3 text-xs text-muted-foreground font-medium">
                                {index + 1}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className={`w-8 h-8 rounded-md shrink-0 flex items-center justify-center text-xs font-semibold ${
                                      isSelected
                                        ? "bg-foreground text-background"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {avatarChar(user.name)}
                                  </div>
                                  <div>
                                    <span className="text-xs font-semibold text-foreground">
                                      {user.name}
                                    </span>
                                    <div className="flex items-center gap-1 mt-0.5">
                                      <Mail
                                        size={10}
                                        className="text-muted-foreground"
                                      />
                                      <span className="text-[10px] text-muted-foreground truncate max-w-[160px]">
                                        {user.email}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-2 py-3">
                                <div className="flex items-center gap-1">
                                  <Phone
                                    size={10}
                                    className="text-muted-foreground"
                                  />
                                  <span className="text-xs text-muted-foreground">
                                    {user.phone}
                                  </span>
                                </div>
                              </td>
                              <td className="px-2 py-3">
                                <span
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                    user.status === "active"
                                      ? "bg-emerald/15 text-emerald"
                                      : "bg-destructive/10 text-destructive"
                                  }`}
                                >
                                  {/* {user.status === "active" ? (
                                    <Check size={9} />
                                  ) : (
                                    <X size={9} />
                                  )} */}
                                  {user.status === "active"
                                    ? "Active"
                                    : "Inactive"}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-xs text-muted-foreground">
                                {formatDate(user.createdAt)}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* RIGHT — Detail Panel */}
              <div className="flex-1 rounded-lg border border-border bg-card flex flex-col overflow-hidden">
                {selected ? (
                  <>
                    {/* Detail Header */}
                    <div className="px-5 py-5 border-b border-border bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-md bg-foreground flex items-center justify-center font-bold text-lg text-background">
                          {avatarChar(selected.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-base text-foreground tracking-tight">
                            {selected.name}
                          </div>
                          <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                            <Mail size={10} /> {selected.email}
                          </div>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                              selected.status === "active"
                                ? "bg-accent/15 text-accent"
                                : "bg-destructive/10 text-destructive"
                            }`}
                          >
                            {selected.status === "active"
                              ? "Active"
                              : "Inactive"}
                          </span>
                          <Switch
                            checked={selected.status === "active"}
                            onCheckedChange={() => handleToggleStatus(selected)}
                            disabled={statusLoading}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Detail Body */}
                    <div className="flex-1 overflow-auto p-5 space-y-5">
                      {/* User Information */}
                      <div>
                        <h3 className="text-xs font-semibold text-foreground mb-3">
                          User Information
                        </h3>
                        <div className="grid grid-cols-2 gap-2.5">
                          {[
                            {
                              label: "Full Name",
                              value: selected.name,
                              icon: (
                                <Users
                                  size={12}
                                  className="text-muted-foreground"
                                />
                              ),
                            },
                            {
                              label: "Phone Number",
                              value: selected.phone,
                              icon: (
                                <Phone
                                  size={12}
                                  className="text-muted-foreground"
                                />
                              ),
                            },
                            {
                              label: "Email Address",
                              value: selected.email,
                              icon: (
                                <Mail
                                  size={12}
                                  className="text-muted-foreground"
                                />
                              ),
                            },
                            {
                              label: "Registered On",
                              value: formatDate(selected.createdAt),
                              icon: (
                                <Calendar
                                  size={12}
                                  className="text-muted-foreground"
                                />
                              ),
                            },
                          ].map((item) => (
                            <div
                              key={item.label}
                              className="rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors"
                            >
                              <div className="flex items-center gap-1.5 mb-1.5">
                                {item.icon}
                                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                                  {item.label}
                                </span>
                              </div>
                              <div className="text-xs text-foreground font-semibold truncate">
                                {item.value}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Portal Access */}
                      <div>
                        <h3 className="text-xs font-semibold text-foreground mb-3">
                          Portal Access
                        </h3>
                        <div className="rounded-lg border border-border p-4 bg-muted/20">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-md bg-foreground flex items-center justify-center shrink-0">
                              <LogIn size={14} className="text-background" />
                            </div>
                            <div>
                              <div className="font-semibold text-xs text-foreground mb-1">
                                Secure Impersonation Session
                              </div>
                              <div className="text-[11px] text-muted-foreground leading-relaxed">
                                Generates a signed token for{" "}
                                <strong className="text-foreground">
                                  {selected.name}
                                </strong>{" "}
                                and opens their management portal directly — no
                                password required.
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-border flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <ShieldCheck size={11} />
                            Token valid for 15 min · Stored in localStorage ·
                            Audited
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Button */}
                    <div className="px-5 py-4 border-t border-border">
                      <Button
                        onClick={() => handleViewPharmacy(selected)}
                        disabled={!!impersonating}
                        className="w-full h-10 bg-foreground text-background hover:bg-foreground/90 font-semibold text-xs gap-2"
                        size="sm"
                      >
                        {impersonating === selected.id ? (
                          <>
                            <Loader2 size={14} className="animate-spin" />{" "}
                            Opening portal…
                          </>
                        ) : (
                          <>
                            <LogIn size={14} /> Open as {selected.name}
                          </>
                        )}
                      </Button>
                      <p className="text-center text-[10px] text-muted-foreground mt-2">
                        Redirects directly to /Mainpage with a fresh session
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-10 gap-4">
                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
                      <Building2 size={22} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-base text-foreground">
                        Select a Pharmacy
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed max-w-xs">
                        Click any pharmacy from the table to view their profile
                        and manage portal access
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
