// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import {
//   Users,
//   RefreshCw,
//   Search,
//   ChevronRight,
//   ChevronLeft,
//   Phone,
//   Mail,
//   Calendar,
//   ShieldCheck,
//   LogIn,
//   Building2,
//   Loader2,
//   AlertTriangle,
//   Activity,
//   TrendingUp,
//   Clock,
//   Check,
//   X,
//   Trash2,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Switch } from "@/components/ui/switch";
// import { toast } from "sonner";
// import AdminLayout from "@/components/adminLayout";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import adminApi from "@/lib/adminApi";
// // ─────────────────────────────────────────────────────────────
// // CONFIG
// // ─────────────────────────────────────────────────────────────
// const API_BASE = "https://api.auditprorx.com";
// const PAGE_SIZE = 10; // rows per page

// // ─────────────────────────────────────────────────────────────
// // INTERFACES
// // ─────────────────────────────────────────────────────────────
// interface PharmacyUser {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   role?: string;
//   status?: "active" | "inactive";
//   createdAt?: string;
//   pharmacyName?: string; // ✅ NEW — fetched from registration
// }

// // ─────────────────────────────────────────────────────────────
// // HELPERS
// // ─────────────────────────────────────────────────────────────
// const avatarChar = (name: string) => name?.charAt(0)?.toUpperCase() || "P";
// const formatDate = (iso?: string) =>
//   iso
//     ? new Date(iso).toLocaleDateString("en-IN", {
//         day: "2-digit",
//         month: "short",
//         year: "numeric",
//       })
//     : "N/A";

// // ─────────────────────────────────────────────────────────────
// // STAT CARD  (compact — label above value, small color only on icon)
// // ─────────────────────────────────────────────────────────────
// function StatCard({
//   icon,
//   label,
//   value,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: string | number;
// }) {
//   return (
//     <div className="max-w-[200px] rounded-xl border border-border bg-card p-2 flex items-center gap-3 transition-colors hover:border-foreground/15">
//       <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0">
//         {icon}
//       </div>
//       <div className="min-w-0">
//         <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
//           {label}
//         </div>
//         <div className="text-2xl font-bold text-foreground leading-tight">
//           {value}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // SEGMENTED FILTER (reusable, dependency-free)
// // ─────────────────────────────────────────────────────────────
// function Segmented({
//   options,
//   value,
//   onChange,
// }: {
//   options: { value: string; label: string }[];
//   value: string;
//   onChange: (v: string) => void;
// }) {
//   return (
//     <div className="inline-flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
//       {options.map((opt) => {
//         const active = value === opt.value;
//         return (
//           <button
//             key={opt.value}
//             onClick={() => onChange(opt.value)}
//             className={`cursor-pointer px-3 h-7 rounded-md text-[11px] font-semibold transition-all ${
//               active
//                 ? "bg-card text-foreground shadow-sm"
//                 : "text-muted-foreground hover:text-foreground"
//             }`}
//           >
//             {opt.label}
//           </button>
//         );
//       })}
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // MAIN DASHBOARD
// // ─────────────────────────────────────────────────────────────
// export default function AdminDashboard() {
//   const router = useRouter();
//   const [users, setUsers] = useState<PharmacyUser[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [impersonating, setImpersonating] = useState<string | null>(null);
//   const [search, setSearch] = useState("");
//   const [selected, setSelected] = useState<PharmacyUser | null>(null);
//   const [fetchError, setFetchError] = useState("");
//   const [now, setNow] = useState<Date | null>(null);
//   const [statusLoading, setStatusLoading] = useState(false);
//   const [deleteUserDialog, setDeleteUserDialog] = useState<PharmacyUser | null>(
//     null,
//   );
//   const [deletingUser, setDeletingUser] = useState(false);
//   const [subscription, setSubscription] = useState<any>(null);
//   const [subLoading, setSubLoading] = useState(false);
//   const [subStatus, setSubStatus] = useState("inactive");
//   const [updatingSub, setUpdatingSub] = useState(false);
//   const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
//   const [page, setPage] = useState(1); // ✅ pagination page
//   const [statusFilter, setStatusFilter] = useState<
//     "all" | "active" | "inactive"
//   >("all"); // ✅ status filter
//   const [dateFilter, setDateFilter] = useState<"all" | "30d" | "90d" | "year">(
//     "all",
//   ); // ✅ registered-on filter
//   const [accessControls, setAccessControls] = useState({
//     inventory_reports_access: false,
//     inventory_view_access: false,
//     drug_lookup_access: false,
//     leads_access: false,
//     full_access: false,
//   });

//   useEffect(() => {
//     setNow(new Date());
//     fetchUsers();
//     const tick = setInterval(() => setNow(new Date()), 60000);
//     return () => clearInterval(tick);
//   }, []);

//   const handleToggleStatus = async (user: PharmacyUser) => {
//     const newStatus = user.status === "active" ? "inactive" : "active";
//     setStatusLoading(true);
//     try {
//       await adminApi.put(`/auth/user-status/${user.id}`, {
//         status: newStatus,
//       });

//       localStorage.setItem("status", newStatus);

//       // ✅ THEN notify listeners
//       // window.dispatchEvent(new Event("storage"));
//       setUsers((prev) =>
//         prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)),
//       );
//       setSelected((prev) =>
//         prev?.id === user.id ? { ...prev, status: newStatus } : prev,
//       );
//       toast.success(
//         `User marked as ${newStatus === "active" ? "Verified" : "Unverified"}`,
//       );
//     } catch {
//       toast.error("Failed to update status.");
//     } finally {
//       setStatusLoading(false);
//     }
//   };

//   const fetchUsers = async () => {
//     setLoading(true);
//     setFetchError("");
//     try {
//       const res = await adminApi.get(`/auth/users`);
//       const data = res.data?.users || res.data || [];
//       setUsers(Array.isArray(data) ? data : []);
//     } catch {
//       setFetchError("Could not reach the API server.");
//       setUsers([
//         {
//           id: "1",
//           name: "Apollo Pharmacy",
//           email: "apollo@pharmsys.com",
//           phone: "9876543210",
//           createdAt: "2024-03-01T00:00:00Z",
//           status: "active",
//         },
//         {
//           id: "2",
//           name: "MedPlus Health",
//           email: "medplus@pharmsys.com",
//           phone: "9812345678",
//           createdAt: "2024-05-12T00:00:00Z",
//           status: "active",
//         },
//         {
//           id: "3",
//           name: "Netmeds Store",
//           email: "netmeds@pharmsys.com",
//           phone: "9700011122",
//           createdAt: "2024-07-20T00:00:00Z",
//           status: "inactive",
//         },
//         {
//           id: "4",
//           name: "Wellness Forever",
//           email: "wellness@pharmsys.com",
//           phone: "9988776655",
//           createdAt: "2024-08-30T00:00:00Z",
//           status: "active",
//         },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewPharmacy = async (user: PharmacyUser) => {
//     setImpersonating(user.id);
//     try {
//       const res = await adminApi.post(`/auth/impersonate`, {
//         userId: user.id,
//       });
//       const { accessToken, refreshToken } = res.data;
//       localStorage.setItem("accessToken", accessToken);
//       localStorage.setItem("refreshToken", refreshToken);
//       localStorage.setItem("userId", user.id);
//       localStorage.setItem("userEmail", user.email);
//       localStorage.removeItem("pharmacyName");
//       window.open("/Mainpage", "_blank");
//       // localStorage.setItem("pharmacyName", user.pharmacyName || user.name);
//       // router.push("/Mainpage");
//     } catch {
//       toast.error("Impersonation failed. Please try again.");
//     } finally {
//       setImpersonating(null);
//     }
//   };

//   // ─────────────────────────────────────────────────────────────
//   // FILTER PIPELINE (search + status + registered-on)
//   // ─────────────────────────────────────────────────────────────
//   const filtered = users.filter((u) => {
//     const q = search.toLowerCase();
//     const matchesSearch =
//       u.name?.toLowerCase().includes(q) ||
//       u.email?.toLowerCase().includes(q) ||
//       u.phone?.includes(q);

//     const matchesStatus =
//       statusFilter === "all" ? true : u.status === statusFilter;

//     let matchesDate = true;
//     if (dateFilter !== "all") {
//       if (!u.createdAt) {
//         matchesDate = false;
//       } else {
//         const diff = new Date().getTime() - new Date(u.createdAt).getTime();
//         if (dateFilter === "30d") {
//           matchesDate = diff <= 30 * 86400000;
//         } else if (dateFilter === "90d") {
//           matchesDate = diff <= 90 * 86400000;
//         } else if (dateFilter === "year") {
//           matchesDate = diff <= 365 * 86400000;
//         }
//       }
//     }

//     return matchesSearch && matchesStatus && matchesDate;
//   });

//   const activeCount = users.filter((u) => u.status === "active").length;
//   const thisMonthCount = users.filter((u) => {
//     const d = u.createdAt ? new Date(u.createdAt) : null;
//     return d && d.getMonth() === new Date().getMonth();
//   }).length;

//   // ─────────────────────────────────────────────────────────────
//   // PAGINATION (same data set — auditprorx admin excluded)
//   // ─────────────────────────────────────────────────────────────
//   const visibleUsers = filtered.filter(
//     (user) => user.email !== "auditprorx@gmail.com",
//   );
//   const totalPages = Math.max(1, Math.ceil(visibleUsers.length / PAGE_SIZE));
//   const safePage = Math.min(page, totalPages);
//   const paginatedUsers = visibleUsers.slice(
//     (safePage - 1) * PAGE_SIZE,
//     safePage * PAGE_SIZE,
//   );

//   const pageWindow = (() => {
//     const pages: number[] = [];
//     const maxButtons = 5;
//     let start = Math.max(1, safePage - 2);
//     let end = Math.min(totalPages, start + maxButtons - 1);
//     start = Math.max(1, end - maxButtons + 1);
//     for (let i = start; i <= end; i++) pages.push(i);
//     return pages;
//   })();

//   const hasActiveFilters =
//     search !== "" || statusFilter !== "all" || dateFilter !== "all";

//   const clearFilters = () => {
//     setSearch("");
//     setStatusFilter("all");
//     setDateFilter("all");
//     setPage(1);
//   };

//   const handleConfirmDeleteUser = async () => {
//     if (!deleteUserDialog) return;

//     const userId = deleteUserDialog.id;

//     setDeletingUser(true);

//     try {
//       await adminApi.delete(`/admin/users/${userId}`);

//       // ✅ Remove from UI
//       setUsers((prev) => prev.filter((u) => u.id !== userId));

//       // ✅ Clear selection
//       setSelected(null);

//       toast.success("User deleted successfully");
//     } catch (err: any) {
//       toast.error(err?.response?.data?.message || "Failed to delete user");
//     } finally {
//       setDeletingUser(false);
//       setDeleteUserDialog(null);
//     }
//   };

//   const handleSelectUser = async (user: PharmacyUser) => {
//     setSelected(user);
//     setSubLoading(true);

//     try {
//       const res = await axios.get(`${API_BASE}/pay/subscription/${user.id}`);
//       const sub = res?.data?.subscription ?? null;

//       setSubscription(sub);

//       setAccessControls({
//         inventory_reports_access: sub?.inventory_reports_access || false,

//         inventory_view_access: sub?.inventory_view_access || false,

//         drug_lookup_access: sub?.drug_lookup_access || false,

//         leads_access: sub?.leads_access || false,

//         full_access: sub?.full_access || false,
//       });

//       // ✅ SET DROPDOWN VALUE
//       if (sub?.status) {
//         setSubStatus(sub.status);
//       } else {
//         setSubStatus("inactive"); // default
//       }
//       setCancelAtPeriodEnd(sub?.cancel_at_period_end ?? false); // ← add this
//     } catch (err) {
//       toast.error("Failed to fetch subscription");
//       setSubscription(null);
//     } finally {
//       setSubLoading(false);
//     }
//   };

//   const toggleAccess = (key: string) => {
//     setAccessControls((prev: any) => {
//       const updated = {
//         ...prev,
//         [key]: !prev[key],
//       };

//       // FULL ACCESS
//       if (key === "full_access") {
//         const enabled = !prev.full_access;

//         return {
//           inventory_reports_access: enabled,
//           inventory_view_access: enabled,
//           drug_lookup_access: enabled,
//           leads_access: enabled,
//           full_access: enabled,
//         };
//       }

//       // BASE REQUIRED
//       if (
//         !updated.inventory_reports_access &&
//         (updated.inventory_view_access ||
//           updated.drug_lookup_access ||
//           updated.leads_access)
//       ) {
//         updated.inventory_reports_access = true;
//       }

//       return updated;
//     });
//   };

//   const saveAccessControls = async () => {
//     try {
//       await axios.post(`${API_BASE}/pay/admin/grant-access`, {
//         userId: selected?.id,
//         ...accessControls,
//       });

//       toast.success("Access updated");

//       // handleSelectUser(selected!); // refresh details
//       setSubscription((prev: any) => ({
//         ...prev,
//         ...accessControls,
//       }));

//       setSelected((prev) => prev);
//     } catch {
//       toast.error("Failed to update access");
//     }
//   };

//   return (
//     <AdminLayout>
//       <div className="min-h-screen bg-background">
//         <div className="max-w-[1400px] mx-auto px-6 py-0">
//           <div className="space-y-6">
//             {/* Header */}
//             <div className="flex items-center justify-between pb-4 border-b border-border">
//               <div>
//                 <h1 className="text-2xl font-bold tracking-tight text-foreground">
//                   PHARMACY USERS
//                 </h1>
//                 <p className="text-sm text-muted-foreground mt-1">
//                   Manage pharmacy accounts, view details, and access portals
//                 </p>
//               </div>
//               <div className="flex items-center gap-2">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={fetchUsers}
//                   className="cursor-pointer gap-1.5 text-xs font-semibold"
//                 >
//                   <RefreshCw size={13} />
//                   Refresh
//                 </Button>
//               </div>
//             </div>

//             {/* Error Banner */}
//             {fetchError && (
//               <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20 text-sm">
//                 <AlertTriangle
//                   size={14}
//                   className="text-destructive shrink-0"
//                 />
//                 <span className="text-foreground">{fetchError}</span>
//                 <span className="text-muted-foreground">
//                   — showing demo data.
//                 </span>
//               </div>
//             )}

//             {/* Stat Cards (compact, color only on icons) */}
//             <div className="flex max-w-[max-content] gap-3 grid-cols-2 lg:grid-cols-4">
//               <StatCard
//                 icon={<Users size={18} className="text-blue-500" />}
//                 label="Total Users"
//                 value={users.length - 1}
//               />
//               <StatCard
//                 icon={<Activity size={18} className="text-emerald-500" />}
//                 label="Active Users"
//                 value={activeCount - 1}
//               />
//               <StatCard
//                 icon={<TrendingUp size={18} className="text-violet-500" />}
//                 label="This Month"
//                 value={thisMonthCount}
//               />
//               <StatCard
//                 icon={<Clock size={18} className="text-amber-500" />}
//                 label="Pending Review"
//                 value={0}
//               />
//             </div>

//             {/* Filter Toolbar */}
//             <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
//               <div className="flex flex-col lg:flex-row lg:items-center gap-3">
//                 {/* Search */}
//                 <div className="relative flex-1 max-w-sm">
//                   <Search
//                     size={14}
//                     className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
//                   />
//                   <Input
//                     type="text"
//                     placeholder="Search name, email, phone…"
//                     value={search}
//                     onChange={(e) => {
//                       setSearch(e.target.value);
//                       setPage(1); // reset to first page on search
//                     }}
//                     className="pl-9 h-9 text-xs"
//                   />
//                 </div>

//                 {/* Status Filter */}
//                 <div className="flex items-center gap-2">
//                   <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
//                     Status
//                   </span>
//                   <Segmented
//                     value={statusFilter}
//                     onChange={(v) => {
//                       setStatusFilter(v as typeof statusFilter);
//                       setPage(1);
//                     }}
//                     options={[
//                       { value: "all", label: "All" },
//                       { value: "active", label: "Verified" },
//                       { value: "inactive", label: "Unverified" },
//                     ]}
//                   />
//                 </div>

//                 {/* Registered-on Filter */}
//                 <div className="flex items-center gap-2">
//                   <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
//                     Registered
//                   </span>
//                   <Segmented
//                     value={dateFilter}
//                     onChange={(v) => {
//                       setDateFilter(v as typeof dateFilter);
//                       setPage(1);
//                     }}
//                     options={[
//                       { value: "all", label: "All" },
//                       { value: "30d", label: "30 Days" },
//                       { value: "90d", label: "90 Days" },
//                       { value: "year", label: "1 Year" },
//                     ]}
//                   />
//                 </div>

//                 {/* Right side: count + clear */}
//                 <div className="flex items-center gap-3 lg:ml-auto">
//                   <span className="text-[11px] text-muted-foreground whitespace-nowrap">
//                     {filtered.length} / {users.length} shown
//                   </span>
//                   {hasActiveFilters && (
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={clearFilters}
//                       className="cursor-pointer h-8 gap-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
//                     >
//                       <X size={12} />
//                       Clear
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Users Table (full width + pagination) */}
//             <div className="w-full rounded-xl border border-border overflow-hidden flex flex-col">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-border">
//                   <thead className="bg-muted/60">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-12">
//                         #
//                       </th>
//                       <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
//                         Pharmacy
//                       </th>
//                       <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
//                         Contact
//                       </th>
//                       <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th className="px-4 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
//                         Registered
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-card divide-y divide-border">
//                     {loading ? (
//                       <tr>
//                         <td colSpan={5} className="text-center py-16">
//                           <div className="flex flex-col items-center gap-3">
//                             <Loader2
//                               size={20}
//                               className="animate-spin text-muted-foreground"
//                             />
//                             <p className="text-xs text-muted-foreground">
//                               Loading pharmacies…
//                             </p>
//                           </div>
//                         </td>
//                       </tr>
//                     ) : paginatedUsers.length === 0 ? (
//                       <tr>
//                         <td colSpan={5} className="text-center py-16">
//                           <div className="flex flex-col items-center gap-3">
//                             <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
//                               <Building2
//                                 size={20}
//                                 className="text-muted-foreground"
//                               />
//                             </div>
//                             <div>
//                               <p className="text-sm font-medium text-foreground">
//                                 No pharmacies found
//                               </p>
//                               <p className="text-xs text-muted-foreground mt-0.5">
//                                 {hasActiveFilters
//                                   ? "Try adjusting your search or filters."
//                                   : "Try adjusting your search query."}
//                               </p>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     ) : (
//                       paginatedUsers.map((user, index) => {
//                         const isSelected = selected?.id === user.id;
//                         const rowNumber =
//                           (safePage - 1) * PAGE_SIZE + index + 1;
//                         return (
//                           <tr
//                             key={user.id || index}
//                             // onClick={() => setSelected(user)}
//                             onClick={() => handleSelectUser(user)}
//                             className={`cursor-pointer transition-colors ${
//                               isSelected ? "bg-muted/60" : "hover:bg-muted/30"
//                             }`}
//                           >
//                             <td className="px-4 py-3 text-xs text-muted-foreground font-medium">
//                               {rowNumber}
//                             </td>
//                             <td className="px-4 py-3">
//                               <div className="flex items-center gap-2.5">
//                                 <div
//                                   className={`w-8 h-8 rounded-md shrink-0 flex items-center justify-center text-xs font-semibold ${
//                                     isSelected
//                                       ? "bg-foreground text-background"
//                                       : "bg-muted text-muted-foreground"
//                                   }`}
//                                 >
//                                   {avatarChar(user.name)}
//                                 </div>
//                                 <div>
//                                   <span className="text-xs font-semibold text-foreground">
//                                     {user.name}
//                                   </span>
//                                   <div className="flex items-center gap-1 mt-0.5">
//                                     <Mail
//                                       size={10}
//                                       className="text-muted-foreground"
//                                     />
//                                     <span className="text-[10px] text-muted-foreground truncate max-w-[160px]">
//                                       {user.email}
//                                     </span>
//                                   </div>
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="px-2 py-3">
//                               <div className="flex items-center gap-1">
//                                 <Phone
//                                   size={10}
//                                   className="text-muted-foreground"
//                                 />
//                                 <span className="text-xs text-muted-foreground">
//                                   {user.phone}
//                                 </span>
//                               </div>
//                             </td>
//                             <td className="px-2 py-3">
//                               <span
//                                 className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
//                                   user.status === "active"
//                                     ? "bg-emerald/15 text-emerald"
//                                     : "bg-destructive/10 text-destructive"
//                                 }`}
//                               >
//                                 {/* {user.status === "active" ? (
//                                   <Check size={9} />
//                                 ) : (
//                                   <X size={9} />
//                                 )} */}
//                                 {user.status === "active"
//                                   ? "Verified"
//                                   : "Unverified"}
//                               </span>
//                             </td>
//                             <td className="px-4 py-3 text-xs text-muted-foreground">
//                               {formatDate(user.createdAt)}
//                             </td>
//                           </tr>
//                         );
//                       })
//                     )}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Pagination Bar */}
//               {!loading && visibleUsers.length > 0 && (
//                 <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-border bg-muted/20">
//                   <span className="text-[11px] text-muted-foreground">
//                     Showing{" "}
//                     <span className="font-semibold text-foreground">
//                       {(safePage - 1) * PAGE_SIZE + 1}
//                     </span>
//                     –
//                     <span className="font-semibold text-foreground">
//                       {Math.min(safePage * PAGE_SIZE, visibleUsers.length)}
//                     </span>{" "}
//                     of{" "}
//                     <span className="font-semibold text-foreground">
//                       {visibleUsers.length}
//                     </span>
//                   </span>

//                   <div className="flex items-center gap-1">
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="cursor-pointer h-8 w-8 p-0"
//                       onClick={() => setPage((p) => Math.max(1, p - 1))}
//                       disabled={safePage === 1}
//                     >
//                       <ChevronLeft size={14} />
//                     </Button>

//                     {pageWindow.map((p) => (
//                       <Button
//                         key={p}
//                         variant={p === safePage ? "default" : "outline"}
//                         size="sm"
//                         className="cursor-pointer h-8 w-8 p-0 text-xs font-semibold"
//                         onClick={() => setPage(p)}
//                       >
//                         {p}
//                       </Button>
//                     ))}

//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="cursor-pointer h-8 w-8 p-0"
//                       onClick={() =>
//                         setPage((p) => Math.min(totalPages, p + 1))
//                       }
//                       disabled={safePage === totalPages}
//                     >
//                       <ChevronRight size={14} />
//                     </Button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ───────────────────────────────────────────────────────── */}
//       {/* RIGHT-SIDE DETAIL DRAWER (wider + blurred backdrop)        */}
//       {/* ───────────────────────────────────────────────────────── */}
//       {selected && (
//         <div className="fixed inset-0 z-50">
//           {/* Backdrop — blurred + dimmed */}
//           <div
//             className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-200"
//             onClick={() => setSelected(null)}
//           />

//           {/* Panel */}
//           <div className="absolute right-0 top-0 h-full w-full sm:max-w-xl bg-card border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
//             {/* Detail Header */}
//             <div className="px-6 py-5 border-b border-border bg-muted/30">
//               <div className="flex items-start gap-3">
//                 <div className="w-12 h-12 rounded-xs bg-foreground flex items-center justify-center font-medium text-[40px] text-background shrink-0">
//                   {avatarChar(selected.name)}
//                 </div>
//                 <div className="flex-1 min-w-0 w-full">
//                   <div className="font-bold text-lg text-foreground tracking-tight truncate">
//                     {selected.name}
//                   </div>
//                   <div className="text-[12px] text-muted-foreground mt-0.5 flex items-center gap-1">
//                     <Mail size={10} /> {selected.email}
//                   </div>
//                 </div>
//                 <div className="mt-2 flex items-center gap-1">
//                   <span
//                     className={`text-[12px] font-semibold px-2.5 py-1 rounded-full ${
//                       selected.status === "active"
//                         ? "bg-teal-100 text-teal-800"
//                         : "bg-destructive/10 text-destructive"
//                     }`}
//                   >
//                     {selected.status === "active" ? "Verified" : "Unverified"}
//                   </span>
//                   <Switch
//                     checked={selected.status === "active"}
//                     onCheckedChange={() => handleToggleStatus(selected)}
//                     disabled={statusLoading}
//                   />
//                 </div>
//                 {/* Close drawer */}
//                 <button
//                   onClick={() => setSelected(null)}
//                   className="cursor-pointer w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
//                   aria-label="Close"
//                 >
//                   <X size={16} />
//                 </button>
//               </div>
//             </div>

//             {/* Detail Body */}
//             <div className="overflow-y-auto flex-1 p-6 space-y-6">
//               {/* User Information */}
//               <div>
//                 <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
//                   User Information
//                 </h3>
//                 <div className="grid grid-cols-2 gap-3">
//                   {[
//                     {
//                       label: "Full Name",
//                       value: selected.name,
//                       icon: (
//                         <Users size={12} className="text-muted-foreground" />
//                       ),
//                     },
//                     {
//                       label: "Phone Number",
//                       value: selected.phone,
//                       icon: (
//                         <Phone size={12} className="text-muted-foreground" />
//                       ),
//                     },
//                     {
//                       label: "Email Address",
//                       value: selected.email,
//                       icon: (
//                         <Mail size={12} className="text-muted-foreground" />
//                       ),
//                     },
//                     {
//                       label: "Registered On",
//                       value: formatDate(selected.createdAt),
//                       icon: (
//                         <Calendar size={12} className="text-muted-foreground" />
//                       ),
//                     },
//                   ].map((item) => (
//                     <div
//                       key={item.label}
//                       className="rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors"
//                     >
//                       <div className="flex items-center gap-1.5 mb-1.5">
//                         {item.icon}
//                         <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
//                           {item.label}
//                         </span>
//                       </div>
//                       <div className="text-xs text-foreground font-semibold truncate">
//                         {item.value}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Access Controls */}
//               <div>
//                 <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
//                   Access Controls
//                 </h3>
//                 <div className="rounded-lg border border-border divide-y divide-border">
//                   {[
//                     ["inventory_reports_access", "Inventory Reports"],
//                     ["inventory_view_access", "Inventory View"],
//                     ["drug_lookup_access", "Drug Lookup"],
//                     ["leads_access", "Leads"],
//                     ["full_access", "Full Access"],
//                   ].map(([key, label]) => (
//                     <div
//                       key={key}
//                       className="flex items-center justify-between px-4 py-3"
//                     >
//                       <span className="text-sm text-foreground">{label}</span>
//                       <Switch
//                         checked={(accessControls as any)[key]}
//                         onCheckedChange={() => toggleAccess(key)}
//                       />
//                     </div>
//                   ))}
//                 </div>
//                 <Button onClick={saveAccessControls} className="w-full mt-3">
//                   Save Access
//                 </Button>
//               </div>

//               {/* Portal Access */}
//               <div>
//                 <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
//                   Portal Access
//                 </h3>
//                 <div className="rounded-lg border border-border p-4 bg-muted/20">
//                   <div className="flex items-start gap-3">
//                     <div className="w-9 h-9 rounded-md bg-foreground flex items-center justify-center shrink-0">
//                       <LogIn size={14} className="text-background" />
//                     </div>
//                     <div>
//                       <div className="font-semibold text-xs text-foreground mb-1">
//                         Secure Impersonation Session
//                       </div>
//                       <div className="text-[11px] text-muted-foreground leading-relaxed">
//                         Generates a signed token for{" "}
//                         <strong className="text-foreground">
//                           {selected.name}
//                         </strong>{" "}
//                         - no password required
//                         {/* and opens their management portal directly — no
//                         password required. */}
//                       </div>
//                     </div>
//                   </div>
//                   <div className="mt-3 pt-3 border-t border-border flex items-center gap-1.5 text-[10px] text-muted-foreground">
//                     <ShieldCheck size={11} />
//                     Token valid for 15 min · Stored in localStorage · Audited
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Footer Button */}
//             <div className="px-6 py-4 border-t border-border space-y-2">
//               {/* Buttons Row */}
//               <div className="grid grid-cols-2 gap-2">
//                 {/* OPEN BUTTON */}
//                 <Button
//                   onClick={() => handleViewPharmacy(selected)}
//                   disabled={!!impersonating}
//                   className="cursor-pointer h-10 bg-foreground text-background hover:bg-foreground/90 font-semibold text-xs gap-2"
//                   size="sm"
//                 >
//                   {impersonating === selected.id ? (
//                     <>
//                       <Loader2 size={14} className="animate-spin" />
//                       Opening…
//                     </>
//                   ) : (
//                     <>
//                       <LogIn size={14} />
//                       Open
//                     </>
//                   )}
//                 </Button>

//                 {/* DELETE BUTTON */}
//                 <Button
//                   onClick={() => setDeleteUserDialog(selected)}
//                   variant="destructive"
//                   className="cursor-pointer h-10 text-xs font-semibold gap-2"
//                 >
//                   <Trash2 size={14} />
//                   Delete
//                 </Button>
//               </div>

//               {/* Footer Text */}
//               {/* <p className="text-center text-[10px] text-muted-foreground">
//                 Redirects directly to /Mainpage with a fresh session
//               </p> */}
//             </div>
//           </div>
//         </div>
//       )}

//       <AlertDialog
//         open={!!deleteUserDialog}
//         onOpenChange={() => !deletingUser && setDeleteUserDialog(null)}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="flex items-center gap-2 text-base">
//               <AlertTriangle size={16} className="text-destructive" />
//               Delete User Permanently
//             </AlertDialogTitle>

//             <AlertDialogDescription className="text-xs leading-relaxed">
//               Are you sure you want to delete{" "}
//               <span className="font-semibold text-foreground">
//                 {deleteUserDialog?.name}
//               </span>
//               ?
//               <br />
//               <br />
//               ⚠️ This action will permanently remove:
//               <ul className="list-disc pl-4 mt-2 space-y-1">
//                 <li>User account</li>
//                 <li>Pharmacy details</li>
//                 <li>Audit records</li>
//                 <li>Inventory & wholesaler data</li>
//                 <li>All linked system data</li>
//               </ul>
//               <br />
//               This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>

//           <AlertDialogFooter>
//             <AlertDialogCancel
//               disabled={deletingUser}
//               className="cursor-pointer text-xs h-9"
//             >
//               Cancel
//             </AlertDialogCancel>

//             <AlertDialogAction
//               onClick={handleConfirmDeleteUser}
//               disabled={deletingUser}
//               className="cursor-pointer text-xs h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90"
//             >
//               {deletingUser ? (
//                 <>
//                   <Loader2 size={13} className="animate-spin" />
//                   Deleting…
//                 </>
//               ) : (
//                 "Yes, Delete User"
//               )}
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </AdminLayout>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Users,
  RefreshCw,
  Search,
  ChevronRight,
  ChevronLeft,
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
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import AdminLayout from "@/components/adminLayout";
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
import adminApi from "@/lib/adminApi";
// ─────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────
const API_BASE = "https://api.auditprorx.com";
const PAGE_SIZE = 10; // rows per page

// ─────────────────────────────────────────────────────────────
// ACCESS TIERS — admin grants one of three subscription plans.
//   base         → inventory_reports
//   professional → inventory_reports + inventory_view
//   full_access  → all four flags
// `inherits` is the "everything in the lower tier" line, `extra` lists
// what that tier adds on top.
// ─────────────────────────────────────────────────────────────
const ACCESS_TIERS = [
  {
    id: "base",
    name: "Base",
    price: "$99",
    inherits: null,
    extra: ["Inventory Reports", "Bin Search"],
  },
  {
    id: "professional",
    name: "Professional",
    price: "$249",
    inherits: "Everything in Base",
    extra: ["Inventory View", "Group Reporting"],
  },
  {
    id: "full_access",
    name: "Full Access",
    price: "$499",
    inherits: "Everything in Professional",
    extra: ["Drug Lookup", "Leads"],
  },
];

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
// STAT CARD  (compact — label above value, small color only on icon)
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

// ─────────────────────────────────────────────────────────────
// SEGMENTED FILTER (reusable, dependency-free)
// ─────────────────────────────────────────────────────────────
function Segmented({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-muted/40 p-0.5">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`cursor-pointer px-3 h-7 rounded-md text-[11px] font-semibold transition-all ${
              active
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
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
  const [deleteUserDialog, setDeleteUserDialog] = useState<PharmacyUser | null>(
    null,
  );
  const [deletingUser, setDeletingUser] = useState(false);
  const [subscription, setSubscription] = useState<any>(null);
  const [subLoading, setSubLoading] = useState(false);
  const [subStatus, setSubStatus] = useState("inactive");
  const [updatingSub, setUpdatingSub] = useState(false);
  const [cancelAtPeriodEnd, setCancelAtPeriodEnd] = useState(false);
  const [savingAccess, setSavingAccess] = useState(false);
  const [page, setPage] = useState(1); // ✅ pagination page
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all"); // ✅ status filter
  const [dateFilter, setDateFilter] = useState<"all" | "30d" | "90d" | "year">(
    "all",
  ); // ✅ registered-on filter
  const [accessControls, setAccessControls] = useState({
    inventory_reports_access: false,
    inventory_view_access: false,
    drug_lookup_access: false,
    leads_access: false,
    full_access: false,
  });
  const [deletePassword, setDeletePassword] = useState("");

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
      await adminApi.put(`/auth/user-status/${user.id}`, {
        status: newStatus,
      });

      localStorage.setItem("status", newStatus);

      // ✅ THEN notify listeners
      // window.dispatchEvent(new Event("storage"));
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u)),
      );
      setSelected((prev) =>
        prev?.id === user.id ? { ...prev, status: newStatus } : prev,
      );
      toast.success(
        `User marked as ${newStatus === "active" ? "Verified" : "Unverified"}`,
      );
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
      const res = await adminApi.get(`/auth/users`);
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
      const res = await adminApi.post(`/auth/impersonate`, {
        userId: user.id,
      });
      const { accessToken, refreshToken } = res.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userEmail", user.email);
      localStorage.removeItem("pharmacyName");
      window.open("/Mainpage", "_blank");
      // localStorage.setItem("pharmacyName", user.pharmacyName || user.name);
      // router.push("/Mainpage");
    } catch {
      toast.error("Impersonation failed. Please try again.");
    } finally {
      setImpersonating(null);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // FILTER PIPELINE (search + status + registered-on)
  // ─────────────────────────────────────────────────────────────
  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchesSearch =
      u.name?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.phone?.includes(q);

    const matchesStatus =
      statusFilter === "all" ? true : u.status === statusFilter;

    let matchesDate = true;
    if (dateFilter !== "all") {
      if (!u.createdAt) {
        matchesDate = false;
      } else {
        const diff = new Date().getTime() - new Date(u.createdAt).getTime();
        if (dateFilter === "30d") {
          matchesDate = diff <= 30 * 86400000;
        } else if (dateFilter === "90d") {
          matchesDate = diff <= 90 * 86400000;
        } else if (dateFilter === "year") {
          matchesDate = diff <= 365 * 86400000;
        }
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const activeCount = users.filter((u) => u.status === "active").length;
  const thisMonthCount = users.filter((u) => {
    const d = u.createdAt ? new Date(u.createdAt) : null;
    return d && d.getMonth() === new Date().getMonth();
  }).length;

  // ─────────────────────────────────────────────────────────────
  // PAGINATION (same data set — auditprorx admin excluded)
  // ─────────────────────────────────────────────────────────────
  const visibleUsers = filtered.filter(
    (user) => user.email !== "auditprorx@gmail.com",
  );
  const totalPages = Math.max(1, Math.ceil(visibleUsers.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginatedUsers = visibleUsers.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const pageWindow = (() => {
    const pages: number[] = [];
    const maxButtons = 5;
    let start = Math.max(1, safePage - 2);
    let end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  })();

  const hasActiveFilters =
    search !== "" || statusFilter !== "all" || dateFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setDateFilter("all");
    setPage(1);
  };

  const handleConfirmDeleteUser = async () => {
    if (!deleteUserDialog) return;
    if (!deletePassword.trim()) {
      toast.error("Please enter your admin password");
      return;
    }

    const userId = deleteUserDialog.id;
    setDeletingUser(true);

    try {
      // axios sends a DELETE body via the `data` key
      const res = await adminApi.delete(`/admin/users/${userId}`, {
        data: {
          password: deletePassword,
        },
      });

      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setSelected(null);
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
    } finally {
      setDeletingUser(false);
      setDeleteUserDialog(null);
      setDeletePassword(""); // clear it
    }
  };

  // const handleConfirmDeleteUser = async () => {
  //   if (!deleteUserDialog) return;

  //   const userId = deleteUserDialog.id;

  //   setDeletingUser(true);

  //   try {
  //     await adminApi.delete(`/admin/users/${userId}`);

  //     // ✅ Remove from UI
  //     setUsers((prev) => prev.filter((u) => u.id !== userId));

  //     // ✅ Clear selection
  //     setSelected(null);

  //     toast.success("User deleted successfully");
  //   } catch (err: any) {
  //     toast.error(err?.response?.data?.message || "Failed to delete user");
  //   } finally {
  //     setDeletingUser(false);
  //     setDeleteUserDialog(null);
  //   }
  // };

  const handleSelectUser = async (user: PharmacyUser) => {
    setSelected(user);
    setSubLoading(true);

    try {
      const res = await axios.get(`${API_BASE}/pay/subscription/${user.id}`);
      const sub = res?.data?.subscription ?? null;

      setSubscription(sub);

      setAccessControls({
        inventory_reports_access: sub?.inventory_reports_access || false,

        inventory_view_access: sub?.inventory_view_access || false,

        drug_lookup_access: sub?.drug_lookup_access || false,

        leads_access: sub?.leads_access || false,

        full_access: sub?.full_access || false,
      });

      // ✅ SET DROPDOWN VALUE
      if (sub?.status) {
        setSubStatus(sub.status);
      } else {
        setSubStatus("inactive"); // default
      }
      setCancelAtPeriodEnd(sub?.cancel_at_period_end ?? false); // ← add this
    } catch (err) {
      toast.error("Failed to fetch subscription");
      setSubscription(null);
    } finally {
      setSubLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // ACCESS-CONTROL TIER SELECT (single-select, three plans)
  //   base         → inventory_reports
  //   professional → inventory_reports + inventory_view
  //   full_access  → all four flags
  // Tap the active tier again to remove access (sets everything off).
  // ─────────────────────────────────────────────────────────────
  const currentTier = accessControls.full_access
    ? "full_access"
    : accessControls.inventory_view_access
      ? "professional"
      : accessControls.inventory_reports_access
        ? "base"
        : "none";

  const selectTier = (tier: string) => {
    // Tapping the already-selected tier clears the grant
    if (tier === currentTier) {
      setAccessControls({
        inventory_reports_access: false,
        inventory_view_access: false,
        drug_lookup_access: false,
        leads_access: false,
        full_access: false,
      });
      return;
    }

    if (tier === "base") {
      setAccessControls({
        inventory_reports_access: true,
        inventory_view_access: false,
        drug_lookup_access: false,
        leads_access: false,
        full_access: false,
      });
    } else if (tier === "professional") {
      setAccessControls({
        inventory_reports_access: true,
        inventory_view_access: true,
        drug_lookup_access: false,
        leads_access: false,
        full_access: false,
      });
    } else if (tier === "full_access") {
      setAccessControls({
        inventory_reports_access: true,
        inventory_view_access: true,
        drug_lookup_access: true,
        leads_access: true,
        full_access: true,
      });
    }
  };

  const saveAccessControls = async () => {
    if (!selected?.id) return;
    setSavingAccess(true);
    try {
      await axios.post(`${API_BASE}/pay/admin/grant-access`, {
        userId: selected?.id,
        ...accessControls,
      });

      toast.success("Access updated");

      // handleSelectUser(selected!); // refresh details
      setSubscription((prev: any) => ({
        ...prev,
        ...accessControls,
        admin_override: true,
        status: "active",
      }));

      setSelected((prev) => prev);
    } catch {
      toast.error("Failed to update access");
    } finally {
      setSavingAccess(false);
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

            {/* Stat Cards (compact, color only on icons) */}
            <div className="flex max-w-[max-content] gap-3 grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={<Users size={18} className="text-blue-500" />}
                label="Total Users"
                value={users.length - 1}
              />
              <StatCard
                icon={<Activity size={18} className="text-emerald-500" />}
                label="Active Users"
                value={activeCount - 1}
              />
              <StatCard
                icon={<TrendingUp size={18} className="text-violet-500" />}
                label="This Month"
                value={thisMonthCount}
              />
              {/* <StatCard
                icon={<Clock size={18} className="text-amber-500" />}
                label="Pending Review"
                value={0}
              /> */}
            </div>

            {/* Filter Toolbar */}
            <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-sm">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    type="text"
                    placeholder="Search name, email, phone…"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1); // reset to first page on search
                    }}
                    className="pl-9 h-9 text-xs"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Status
                  </span>
                  <Segmented
                    value={statusFilter}
                    onChange={(v) => {
                      setStatusFilter(v as typeof statusFilter);
                      setPage(1);
                    }}
                    options={[
                      { value: "all", label: "All" },
                      { value: "active", label: "Verified" },
                      { value: "inactive", label: "Unverified" },
                    ]}
                  />
                </div>

                {/* Registered-on Filter */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Registered
                  </span>
                  <Segmented
                    value={dateFilter}
                    onChange={(v) => {
                      setDateFilter(v as typeof dateFilter);
                      setPage(1);
                    }}
                    options={[
                      { value: "all", label: "All" },
                      { value: "30d", label: "30 Days" },
                      { value: "90d", label: "90 Days" },
                      { value: "year", label: "1 Year" },
                    ]}
                  />
                </div>

                {/* Right side: count + clear */}
                <div className="flex items-center gap-3 lg:ml-auto">
                  <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                    {filtered.length} / {users.length} shown
                  </span>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="cursor-pointer h-8 gap-1.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
                    >
                      <X size={12} />
                      Clear
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Users Table (full width + pagination) */}
            <div className="w-full rounded-xl border border-border overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-border">
                  <thead className="bg-muted/60">
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
                    ) : paginatedUsers.length === 0 ? (
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
                                {hasActiveFilters
                                  ? "Try adjusting your search or filters."
                                  : "Try adjusting your search query."}
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedUsers.map((user, index) => {
                        const isSelected = selected?.id === user.id;
                        const rowNumber =
                          (safePage - 1) * PAGE_SIZE + index + 1;
                        return (
                          <tr
                            key={user.id || index}
                            // onClick={() => setSelected(user)}
                            onClick={() => handleSelectUser(user)}
                            className={`cursor-pointer transition-colors ${
                              isSelected ? "bg-muted/60" : "hover:bg-muted/30"
                            }`}
                          >
                            <td className="px-4 py-3 text-xs text-muted-foreground font-medium">
                              {rowNumber}
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
                                  ? "Verified"
                                  : "Unverified"}
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

              {/* Pagination Bar */}
              {!loading && visibleUsers.length > 0 && (
                <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-border bg-muted/20">
                  <span className="text-[11px] text-muted-foreground">
                    Showing{" "}
                    <span className="font-semibold text-foreground">
                      {(safePage - 1) * PAGE_SIZE + 1}
                    </span>
                    –
                    <span className="font-semibold text-foreground">
                      {Math.min(safePage * PAGE_SIZE, visibleUsers.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-foreground">
                      {visibleUsers.length}
                    </span>
                  </span>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer h-8 w-8 p-0"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={safePage === 1}
                    >
                      <ChevronLeft size={14} />
                    </Button>

                    {pageWindow.map((p) => (
                      <Button
                        key={p}
                        variant={p === safePage ? "default" : "outline"}
                        size="sm"
                        className="cursor-pointer h-8 w-8 p-0 text-xs font-semibold"
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      className="cursor-pointer h-8 w-8 p-0"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={safePage === totalPages}
                    >
                      <ChevronRight size={14} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* RIGHT-SIDE DETAIL DRAWER (wider + blurred backdrop)        */}
      {/* ───────────────────────────────────────────────────────── */}
      {selected && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop — blurred + dimmed */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setSelected(null)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-0 h-full w-full sm:max-w-xl bg-card border-l border-border shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Detail Header */}
            <div className="px-6 py-5 border-b border-border bg-muted/30">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xs bg-foreground flex items-center justify-center font-medium text-[40px] text-background shrink-0">
                  {avatarChar(selected.name)}
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <div className="font-bold text-lg text-foreground tracking-tight truncate">
                    {selected.name}
                  </div>
                  <div className="text-[12px] text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Mail size={10} /> {selected.email}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <span
                    className={`text-[12px] font-semibold px-2.5 py-1 rounded-full ${
                      selected.status === "active"
                        ? "bg-teal-100 text-teal-800"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {selected.status === "active" ? "Verified" : "Unverified"}
                  </span>
                  <Switch
                    checked={selected.status === "active"}
                    onCheckedChange={() => handleToggleStatus(selected)}
                    disabled={statusLoading}
                  />
                </div>
                {/* Close drawer */}
                <button
                  onClick={() => setSelected(null)}
                  className="cursor-pointer w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Detail Body */}
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {/* User Information */}
              <div>
                <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  User Information
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      label: "Full Name",
                      value: selected.name,
                      icon: (
                        <Users size={12} className="text-muted-foreground" />
                      ),
                    },
                    {
                      label: "Phone Number",
                      value: selected.phone,
                      icon: (
                        <Phone size={12} className="text-muted-foreground" />
                      ),
                    },
                    {
                      label: "Email Address",
                      value: selected.email,
                      icon: (
                        <Mail size={12} className="text-muted-foreground" />
                      ),
                    },
                    {
                      label: "Registered On",
                      value: formatDate(selected.createdAt),
                      icon: (
                        <Calendar size={12} className="text-muted-foreground" />
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

              {/* Access Controls — three subscription-tier buttons (single-select) */}
              <div>
                <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Access Controls
                </h3>
                <p className="text-[11px] text-muted-foreground mb-3">
                  Grant a subscription tier without payment. Tap a tier to
                  select, tap it again to remove access.
                </p>

                <div className="space-y-2.5">
                  {ACCESS_TIERS.map((tier) => {
                    const active = currentTier === tier.id;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => selectTier(tier.id)}
                        className={`w-full cursor-pointer text-left rounded-lg border p-4 transition-all ${
                          active
                            ? "border-foreground bg-muted/50 ring-1 ring-foreground/20"
                            : "border-border hover:border-foreground/30 hover:bg-muted/20"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                active
                                  ? "border-foreground bg-foreground"
                                  : "border-muted-foreground/40"
                              }`}
                            >
                              {active && (
                                <Check size={11} className="text-background" />
                              )}
                            </span>
                            <span className="text-sm font-semibold text-foreground">
                              {tier.name}
                            </span>
                          </div>
                          <span className="text-sm font-bold text-foreground">
                            {tier.price}
                            <span className="text-[10px] text-muted-foreground font-normal">
                              /mo
                            </span>
                          </span>
                        </div>

                        <div className="mt-2.5 pl-6 space-y-1">
                          {tier.inherits && (
                            <div className="text-[11px] text-muted-foreground/70">
                              {tier.inherits}
                            </div>
                          )}
                          {tier.extra.map((f) => (
                            <div
                              key={f}
                              className="text-[11px] text-foreground/90 flex items-center gap-1.5"
                            >
                              <span className="text-emerald-500 font-semibold">
                                +
                              </span>
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <Button
                  onClick={saveAccessControls}
                  disabled={savingAccess}
                  className="w-full mt-3"
                >
                  {savingAccess ? (
                    <>
                      <Loader2 size={14} className="animate-spin mr-1.5" />
                      Saving…
                    </>
                  ) : (
                    "Save Access"
                  )}
                </Button>
              </div>

              {/* Portal Access */}
              <div>
                <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-3">
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
                        - no password required
                        {/* and opens their management portal directly — no
                        password required. */}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <ShieldCheck size={11} />
                    Token valid for 15 min · Stored in localStorage · Audited
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Button */}
            <div className="px-6 py-4 border-t border-border space-y-2">
              {/* Buttons Row */}
              <div className="grid grid-cols-2 gap-2">
                {/* OPEN BUTTON */}
                <Button
                  onClick={() => handleViewPharmacy(selected)}
                  disabled={!!impersonating}
                  className="cursor-pointer h-10 bg-foreground text-background hover:bg-foreground/90 font-semibold text-xs gap-2"
                  size="sm"
                >
                  {impersonating === selected.id ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Opening…
                    </>
                  ) : (
                    <>
                      <LogIn size={14} />
                      Open
                    </>
                  )}
                </Button>

                {/* DELETE BUTTON */}
                <Button
                  onClick={() => setDeleteUserDialog(selected)}
                  // variant="destructive"
                  // className="cursor-pointer h-10 text-xs font-semibold gap-2 bg-red-800"
                  className="cursor-pointer h-10 text-xs font-semibold gap-2 bg-red-600 text-white hover:bg-red-700 transition-colors focus-visible:ring-2 focus-visible:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={14} />
                  Delete
                </Button>
              </div>

              {/* Footer Text */}
              {/* <p className="text-center text-[10px] text-muted-foreground">
                Redirects directly to /Mainpage with a fresh session
              </p> */}
            </div>
          </div>
        </div>
      )}
      <AlertDialog
        open={!!deleteUserDialog}
        onOpenChange={() => {
          if (!deletingUser) {
            setDeleteUserDialog(null);
            setDeletePassword("");
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-base">
              <AlertTriangle size={16} className="text-destructive" />
              Delete User Permanently
            </AlertDialogTitle>

            <AlertDialogDescription className="text-xs leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deleteUserDialog?.name}
              </span>
              ?
              <br />
              <br />
              ⚠️ This action will permanently remove:
            </AlertDialogDescription>
          </AlertDialogHeader>

          <ul className="list-disc pl-6 -mt-2 space-y-1 text-xs text-muted-foreground">
            <li>User account</li>
            <li>Pharmacy details</li>
            <li>Audit records</li>
            <li>Inventory & wholesaler data</li>
            <li>All linked system data</li>
          </ul>

          {/* 🔐 Admin password confirmation */}
          <div className="space-y-1.5 pt-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Confirm your admin password
            </label>
            <Input
              type="password"
              autoComplete="current-password"
              placeholder="Enter admin password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              disabled={deletingUser}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  deletePassword.trim() &&
                  !deletingUser
                ) {
                  handleConfirmDeleteUser();
                }
              }}
              className="h-9 text-xs"
            />
            <p className="text-[10px] text-muted-foreground">
              Required to authorize this permanent deletion.
            </p>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deletingUser}
              className="cursor-pointer text-xs h-9"
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleConfirmDeleteUser}
              disabled={deletingUser || !deletePassword.trim()}
              className="cursor-pointer text-xs h-9 bg-red-600 text-white hover:bg-red-700 transition-colors focus-visible:ring-2 focus-visible:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {deletingUser ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Deleting…
                </>
              ) : (
                "Yes, Delete User"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* <AlertDialog
        open={!!deleteUserDialog}
        onOpenChange={() => !deletingUser && setDeleteUserDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-base">
              <AlertTriangle size={16} className="text-destructive" />
              Delete User Permanently
            </AlertDialogTitle>

            <AlertDialogDescription className="text-xs leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deleteUserDialog?.name}
              </span>
              ?
              <br />
              <br />
              ⚠️ This action will permanently remove:
              <ul className="list-disc pl-4 mt-2 space-y-1">
                <li>User account</li>
                <li>Pharmacy details</li>
                <li>Audit records</li>
                <li>Inventory & wholesaler data</li>
                <li>All linked system data</li>
              </ul>
              <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deletingUser}
              className="cursor-pointer text-xs h-9"
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleConfirmDeleteUser}
              disabled={deletingUser}
              className="cursor-pointer text-xs h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingUser ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  Deleting…
                </>
              ) : (
                "Yes, Delete User"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </AdminLayout>
  );
}
