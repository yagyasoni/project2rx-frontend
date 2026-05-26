// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname, useRouter } from "next/navigation";
// import {
//   ChevronLeft,
//   ChevronRight,
//   FileText,
//   Layers,
//   Search,
//   HelpCircle,
//   LifeBuoy,
//   User,
//   RefreshCw,
//   Settings,
//   Phone,
//   X,
//   GitBranch,
//   Pill,
//   MessageCircle,
//   Boxes,
//   LogOut,
//   Bell,
// } from "lucide-react";
// import api from "@/lib/api";
// import l from "@/public/l.png";

// interface SidebarProps {
//   sidebarOpen: boolean;
//   setSidebarOpen: (value: boolean) => void;
//   activePanel: string | null;
//   setActivePanel: (value: string | null) => void;
// }

// type Popup = "support" | "account" | "settings" | null;

// // Key must match the one used in page.tsx
// const READ_IDS_KEY = "notif_read_ids";

// function getReadIds(): Set<string> {
//   try {
//     const raw = localStorage.getItem(READ_IDS_KEY);
//     return raw ? new Set(JSON.parse(raw)) : new Set();
//   } catch {
//     return new Set();
//   }
// }

// export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [accountName, setAccountName] = useState("...");
//   const [openPopup, setOpenPopup] = useState<Popup>(null);
//   const [unreadCount, setUnreadCount] = useState<number>(0);
//   const bottomRef = useRef<HTMLDivElement>(null);
//   const [subscription, setSubscription] = useState<any>(null);

//   const toggle = (name: Popup) =>
//     setOpenPopup((prev) => (prev === name ? null : name));

//   useEffect(() => {
//     const fetchSubscription = async () => {
//       try {
//         const userId = localStorage.getItem("userId");

//         if (!userId) return;

//         const res = await api.get(`/pay/subscription/${userId}`);

//         setSubscription(res.data.subscription);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     // INITIAL FETCH
//     fetchSubscription();

//     // AUTO REFRESH EVERY 5 SECONDS
//     const interval = setInterval(() => {
//       fetchSubscription();
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const pharmacy = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");
//         const res = await api.get("/auth/pharmacy-details", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const name = res?.data?.pharmacy?.pharmacy_name || "Account Name";
//         setAccountName(name);
//       } catch {
//         setAccountName(localStorage.getItem("pharmacyName") || "Account Name");
//       }
//     };
//     pharmacy();
//   }, []);

//   // Compute unread count by comparing total posts against persisted read IDs
//   // This stays in sync with the notification page via localStorage + custom event
//   useEffect(() => {
//     const fetchUnread = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");
//         const res = await api.get("/post/client/posts", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const posts = Array.isArray(res?.data) ? res.data : [];
//         const readIds = getReadIds();
//         // A post is "unread" if its id is NOT in the persisted read set
//         const count = posts.filter((p: any) => !readIds.has(p.id)).length;
//         setUnreadCount(count);
//       } catch {
//         setUnreadCount(0);
//       }
//     };

//     fetchUnread();

//     // Poll every 60 seconds for new posts
//     const interval = setInterval(fetchUnread, 60000);

//     // Listen for instant badge clear when notification page marks posts as read
//     const handleUpdate = () => fetchUnread();
//     window.addEventListener("notifications-updated", handleUpdate);

//     return () => {
//       clearInterval(interval);
//       window.removeEventListener("notifications-updated", handleUpdate);
//     };
//   }, []);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         bottomRef.current &&
//         !bottomRef.current.contains(event.target as Node)
//       ) {
//         setOpenPopup(null);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const isActive = (path: string) => pathname === path;

//   const navClass = (path: string) =>
//     `group w-full flex items-center gap-3 py-2.5 rounded-lg font-medium text-[14px] transition-all duration-200
//      ${sidebarOpen ? "px-3" : "px-0 justify-center"}
//      ${
//        isActive(path)
//          ? "bg-gray-100 text-gray-900"
//          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//      }`;

//   const iconClass = (path: string) =>
//     `h-[18px] w-[18px] shrink-0 transition-colors ${
//       isActive(path)
//         ? "text-gray-900"
//         : "text-gray-400 group-hover:text-gray-700"
//     }`;

//   const handleLogout = async () => {
//     try {
//       const refreshToken = localStorage.getItem("refreshToken");
//       await api.post("/auth/logout", { refreshToken });
//     } catch {
//     } finally {
//       localStorage.clear();
//       router.push("/auth");
//     }
//   };

//   const navItems = [
//     subscription?.inventory_reports_access && {
//       path: "/Mainpage",
//       label: "Start Audit",
//       icon: FileText,
//     },

//     subscription?.inventory_reports_access && {
//       path: "/ReportsPage",
//       label: "Reports",
//       icon: Layers,
//     },

//     subscription?.inventory_reports_access && {
//       path: "/bin-search",
//       label: "Bin Search",
//       icon: Search,
//     },

//     subscription?.drug_lookup_access && {
//       path: "/DrugLookup",
//       label: "Drug Lookup",
//       icon: Pill,
//     },

//     subscription?.inventory_view_access && {
//       path: "/InventoryView",
//       label: "Inventory View",
//       icon: Boxes,
//     },

//     {
//       path: "/how-to",
//       label: "How To",
//       icon: HelpCircle,
//     },
//   ].filter(Boolean);

//   return (
//     <aside
//       className={`relative flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
//         sidebarOpen ? "w-64" : "w-[72px]"
//       }`}
//     >
//       {/* HEADER */}
//       <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
//         {sidebarOpen ? (
//           <Link href="/Mainpage" className="flex items-center gap-3">
//             <div className="flex h-8.5 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white overflow-hidden">
//               <Image
//                 src={l}
//                 alt="AuditProRx"
//                 className="object-cover h-full align-middle w-full"
//                 priority
//               />
//             </div>
//             <span className="text-[15px] font-semibold text-gray-900 tracking-tight">
//               AuditProRx
//             </span>
//           </Link>
//         ) : (
//           <div className="mx-auto flex h-8.5 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white overflow-hidden">
//             <Image
//               src={l}
//               alt="AuditProRx"
//               width={22}
//               height={22}
//               className="object-cover h-full align-middle w-full"
//               priority
//             />
//           </div>
//         )}

//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 transition"
//         >
//           {sidebarOpen ? (
//             <ChevronLeft className="h-3.5 w-3.5" />
//           ) : (
//             <ChevronRight className="h-3.5 w-3.5" />
//           )}
//         </button>
//       </div>

//       {/* NAVIGATION */}
//       <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
//         {sidebarOpen && (
//           <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
//             Workspace
//           </p>
//         )}

//         {navItems.map(({ path, label, icon: Icon }) => (
//           <Link key={path} href={path} className={navClass(path)}>
//             <Icon className={iconClass(path)} />
//             {sidebarOpen && <span className="truncate">{label}</span>}
//           </Link>
//         ))}

//         {/* UPDATES SECTION */}
//         {sidebarOpen && subscription?.leads_access && (
//           <p className="px-3 pt-5 pb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
//             Updates
//           </p>
//         )}
//         {!sidebarOpen && <div className="my-3 mx-2 border-t border-gray-100" />}

//         {subscription?.leads_access && (
//           <Link href="/Notification" className={navClass("/Notification")}>
//             <div className="relative shrink-0">
//               <Bell className={iconClass("/Notification")} />
//               {unreadCount > 0 && (
//                 <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
//               )}
//             </div>
//             {sidebarOpen && (
//               <div className="flex-1 flex items-center justify-between min-w-0">
//                 <span className="truncate">Leads</span>
//                 {unreadCount > 0 && (
//                   <span className="ml-2 rounded-full bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 min-w-[18px] text-center leading-tight">
//                     {unreadCount > 99 ? "99+" : unreadCount}
//                   </span>
//                 )}
//               </div>
//             )}
//           </Link>
//         )}
//       </nav>

//       {/* BOTTOM */}
//       <div
//         ref={bottomRef}
//         className="border-t border-gray-100 px-3 py-3 space-y-1"
//       >
//         {/* SUPPORT */}
//         <div className="relative">
//           <button
//             onClick={() => toggle("support")}
//             className={`group w-full flex items-center gap-3 py-2.5 rounded-lg font-medium text-[14px] transition ${
//               sidebarOpen ? "px-3" : "justify-center"
//             } ${
//               openPopup === "support"
//                 ? "bg-gray-100 text-gray-900"
//                 : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//             }`}
//           >
//             <LifeBuoy className="h-[18px] w-[18px] text-gray-400 group-hover:text-gray-700" />
//             {sidebarOpen && <span>Customer Support</span>}
//           </button>

//           {openPopup === "support" && sidebarOpen && (
//             <div className="absolute left-full bottom-0 ml-3 w-72 rounded-lg border border-gray-200 bg-white p-4 shadow-lg z-50">
//               <div className="flex items-center justify-between mb-3">
//                 <h4 className="text-sm font-semibold text-gray-900">
//                   Contact Support
//                 </h4>
//                 <X
//                   className="h-4 w-4 text-gray-400 hover:text-gray-700 cursor-pointer"
//                   onClick={() => setOpenPopup(null)}
//                 />
//               </div>

//               <div className="flex items-center gap-3 rounded-md border p-3">
//                 <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
//                   <User className="h-4 w-4 text-gray-700" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-medium text-gray-900">
//                     Fahad Mulla
//                   </p>
//                   <p className="text-xs text-gray-500 flex items-center gap-1">
//                     <Phone className="h-3 w-3" /> +1 (551) 229-6466
//                   </p>
//                 </div>
//                 <a
//                   href="https://wa.me/15512296466?text=Hi%20Fahad%2C%20I%20need%20help%20with%20AuditProRx"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   title="Chat on WhatsApp"
//                   className="p-2 hover:bg-white rounded-full transition-colors"
//                 >
//                   <MessageCircle className="h-5 w-5 text-gray-700 cursor-pointer" />
//                 </a>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ACCOUNT */}
//         <div className="relative">
//           <button
//             onClick={() => toggle("account")}
//             className={`w-full flex items-center gap-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition ${
//               sidebarOpen ? "px-3" : "justify-center"
//             }`}
//           >
//             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-semibold shrink-0">
//               {accountName?.charAt(0)?.toUpperCase() || "A"}
//             </div>

//             {sidebarOpen && (
//               <div className="flex-1 min-w-0 text-left">
//                 <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
//                   Account
//                 </p>
//                 <p className="text-sm font-semibold text-gray-900 truncate">
//                   {accountName}
//                 </p>
//               </div>
//             )}
//           </button>

//           {openPopup === "account" && sidebarOpen && (
//             <div className="absolute left-full bottom-0 ml-3 w-56 rounded-lg border border-gray-200 bg-white p-3 shadow-lg z-50">
//               <p className="text-sm font-medium text-gray-900">{accountName}</p>
//             </div>
//           )}
//         </div>

//         {/* SETTINGS */}
//         <div className="relative">
//           <button
//             onClick={() => toggle("settings")}
//             className={`group w-full flex items-center gap-3 py-2.5 rounded-lg font-medium text-[14px] text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition ${
//               sidebarOpen ? "px-3" : "justify-center"
//             }`}
//           >
//             <Settings className="h-[18px] w-[18px] text-gray-400 group-hover:text-gray-700" />
//             {sidebarOpen && <span>Settings</span>}
//           </button>

//           {openPopup === "settings" && sidebarOpen && (
//             <div className="absolute left-full bottom-0 ml-3 w-52 rounded-lg border border-gray-200 bg-white p-2 shadow-lg z-50">
//               <button
//                 className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
//                 onClick={() => router.push("/settings")}
//               >
//                 <Settings className="h-4 w-4" /> Settings
//               </button>

//               <button
//                 onClick={handleLogout}
//                 className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50"
//               >
//                 <LogOut className="h-4 w-4" /> Logout
//               </button>
//             </div>
//           )}
//         </div>

//         {/* REFRESH */}
//         <button
//           onClick={() => window.location.reload()}
//           className={`group w-full flex items-center gap-3 py-2.5 rounded-lg font-medium text-[14px] text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition ${
//             sidebarOpen ? "px-3" : "justify-center"
//           }`}
//         >
//           <RefreshCw className="h-[18px] w-[18px] text-gray-400 group-hover:text-gray-700" />
//           {sidebarOpen && <span>Hard Refresh</span>}
//         </button>

//         {/* VERSION */}
//         <div
//           className={`flex items-center gap-2 pt-2 ${
//             sidebarOpen ? "px-3" : "justify-center"
//           }`}
//         >
//           <GitBranch className="h-3.5 w-3.5 text-gray-400" />
//           {sidebarOpen && (
//             <span className="text-[11px] text-gray-400 font-medium">v1.4</span>
//           )}
//         </div>
//       </div>
//     </aside>
//   );
// }

// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { usePathname, useRouter } from "next/navigation";
// import {
//   ChevronLeft,
//   ChevronRight,
//   FileText,
//   Layers,
//   Search,
//   HelpCircle,
//   LifeBuoy,
//   User,
//   RefreshCw,
//   Settings,
//   Phone,
//   X,
//   GitBranch,
//   Pill,
//   MessageCircle,
//   Boxes,
//   LogOut,
//   Bell,
//   Lock,
// } from "lucide-react";

// import api from "@/lib/api";
// import l from "@/public/l.png";

// interface SidebarProps {
//   sidebarOpen: boolean;
//   setSidebarOpen: (value: boolean) => void;
//   activePanel: string | null;
//   setActivePanel: (value: string | null) => void;
// }

// type Popup = "support" | "account" | "settings" | null;

// const READ_IDS_KEY = "notif_read_ids";

// function getReadIds(): Set<string> {
//   try {
//     const raw = localStorage.getItem(READ_IDS_KEY);
//     return raw ? new Set(JSON.parse(raw)) : new Set();
//   } catch {
//     return new Set();
//   }
// }

// const ALL_NAV_ITEMS = [
//   {
//     path: "/Mainpage",
//     label: "Start Audit",
//     icon: FileText,
//     accessKey: "inventory_reports_access",
//   },
//   {
//     path: "/ReportsPage",
//     label: "Reports",
//     icon: Layers,
//     accessKey: "inventory_reports_access",
//   },
//   {
//     path: "/bin-search",
//     label: "Bin Search",
//     icon: Search,
//     accessKey: "inventory_reports_access",
//   },
//   {
//     path: "/DrugLookup",
//     label: "Drug Lookup",
//     icon: Pill,
//     accessKey: "drug_lookup_access",
//   },
//   {
//     path: "/InventoryView",
//     label: "Inventory View",
//     icon: Boxes,
//     accessKey: "inventory_view_access",
//   },
//   {
//     path: "/how-to",
//     label: "How To",
//     icon: HelpCircle,
//     accessKey: null,
//   },
// ];

// export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [accountName, setAccountName] = useState("...");
//   const [openPopup, setOpenPopup] = useState<Popup>(null);
//   const [unreadCount, setUnreadCount] = useState<number>(0);
//   const [subscription, setSubscription] = useState<any>(null);
//   const [subscriptionLoaded, setSubscriptionLoaded] = useState(false);

//   const bottomRef = useRef<HTMLDivElement>(null);

//   const toggle = (name: Popup) =>
//     setOpenPopup((prev) => (prev === name ? null : name));

//   /* ─────────────────────────────────────────
//      SUBSCRIPTION POLLING
//   ───────────────────────────────────────── */
//   useEffect(() => {
//     const fetchSubscription = async () => {
//       try {
//         const userId = localStorage.getItem("userId");

//         if (!userId) {
//           setSubscriptionLoaded(true);
//           return;
//         }

//         const res = await api.get(`/pay/subscription/${userId}`);

//         setSubscription(res.data.subscription);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setSubscriptionLoaded(true);
//       }
//     };

//     fetchSubscription();

//     const interval = setInterval(async () => {
//       try {
//         const userId = localStorage.getItem("userId");

//         if (!userId) return;

//         const res = await api.get(`/pay/subscription/${userId}`);

//         setSubscription(res.data.subscription);
//       } catch {}
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   /* ─────────────────────────────────────────
//      PHARMACY NAME
//   ───────────────────────────────────────── */
//   useEffect(() => {
//     const pharmacy = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");

//         const res = await api.get("/auth/pharmacy-details", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setAccountName(res?.data?.pharmacy?.pharmacy_name || "Account Name");
//       } catch {
//         setAccountName(localStorage.getItem("pharmacyName") || "Account Name");
//       }
//     };

//     pharmacy();
//   }, []);

//   /* ─────────────────────────────────────────
//      UNREAD NOTIFICATIONS
//   ───────────────────────────────────────── */
//   useEffect(() => {
//     const fetchUnread = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");

//         const res = await api.get("/post/client/posts", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const posts = Array.isArray(res?.data) ? res.data : [];

//         const readIds = getReadIds();

//         setUnreadCount(posts.filter((p: any) => !readIds.has(p.id)).length);
//       } catch {
//         setUnreadCount(0);
//       }
//     };

//     fetchUnread();

//     const interval = setInterval(fetchUnread, 60000);

//     const handleUpdate = () => fetchUnread();

//     window.addEventListener("notifications-updated", handleUpdate);

//     return () => {
//       clearInterval(interval);
//       window.removeEventListener("notifications-updated", handleUpdate);
//     };
//   }, []);

//   /* ─────────────────────────────────────────
//      CLOSE POPUPS ON OUTSIDE CLICK
//   ───────────────────────────────────────── */
//   useEffect(() => {
//     const handleClickOutside = (e: MouseEvent) => {
//       if (bottomRef.current && !bottomRef.current.contains(e.target as Node)) {
//         setOpenPopup(null);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);

//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   /* ─────────────────────────────────────────
//      HELPERS
//   ───────────────────────────────────────── */
//   const isActive = (path: string) => pathname === path;

//   const hasAccess = (accessKey: string | null) =>
//     !accessKey || !!subscription?.[accessKey];

//   const navLinkClass = (path: string) =>
//     `group w-full flex items-center gap-3 py-[11px] rounded-xl font-medium text-[15px] transition-all duration-150
//      ${sidebarOpen ? "px-3.5" : "px-0 justify-center"}
//      ${
//        isActive(path)
//          ? "bg-gray-900 text-white shadow-sm"
//          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//      }`;

//   const navIconClass = (path: string) =>
//     `h-[18px] w-[18px] shrink-0 transition-colors ${
//       isActive(path) ? "text-white" : "text-gray-400 group-hover:text-gray-700"
//     }`;

//   const handleLogout = async () => {
//     try {
//       const refreshToken = localStorage.getItem("refreshToken");

//       await api.post("/auth/logout", { refreshToken });
//     } catch {
//     } finally {
//       localStorage.clear();
//       router.push("/auth");
//     }
//   };

//   /* ─────────────────────────────────────────
//      LOCKED ROW
//   ───────────────────────────────────────── */
//   const LockedRow = ({
//     icon: Icon,
//     label,
//   }: {
//     icon: React.ElementType;
//     label: string;
//   }) => (
//     <div className="relative rounded-xl overflow-hidden select-none">
//       <div className="flex items-center gap-3 py-[11px] px-3.5 text-[15px] font-medium text-gray-200">
//         <Icon className="h-[18px] w-[18px] shrink-0" />
//         <span className="truncate">{label}</span>
//       </div>

//       {/* UPDATED */}
//       <div className="absolute inset-0 flex items-center justify-between px-3.5 rounded-xl bg-white/88 backdrop-blur-[1.5px] border border-dashed border-amber-300/90">
//         <div className="flex items-center gap-2 min-w-0">
//           <Lock className="h-[13px] w-[13px] text-amber-500 shrink-0" />

//           <span className="truncate text-[12.5px] font-semibold text-amber-600 leading-none">
//             {label} — Subscribe to unlock
//           </span>
//         </div>

//         <span className="ml-2 shrink-0 text-[10px] font-bold text-amber-500 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 uppercase tracking-wide">
//           Pro
//         </span>
//       </div>
//     </div>
//   );

//   /* ─────────────────────────────────────────
//      LOCKED ICON
//   ───────────────────────────────────────── */
//   const LockedIcon = ({
//     icon: Icon,
//     label,
//   }: {
//     icon: React.ElementType;
//     label: string;
//   }) => (
//     <div className="group relative flex justify-center">
//       <div className="flex h-10 w-10 items-center justify-center rounded-xl cursor-not-allowed opacity-40">
//         <Icon className="h-[18px] w-[18px] text-gray-500" />
//       </div>

//       <span className="pointer-events-none absolute bottom-0.5 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400 ring-1 ring-white">
//         <Lock className="h-[8px] w-[8px] text-white" />
//       </span>

//       <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-[13px] font-medium text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150">
//         {label} — Subscribe to unlock
//         <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
//       </div>
//     </div>
//   );

//   /* ─────────────────────────────────────────
//      COLLAPSED NAV ITEM
//   ───────────────────────────────────────── */
//   const CollapsedNavItem = ({
//     path,
//     label,
//     icon: Icon,
//     badge,
//   }: {
//     path: string;
//     label: string;
//     icon: React.ElementType;
//     badge?: React.ReactNode;
//   }) => (
//     <div className="group relative flex justify-center">
//       <Link
//         href={path}
//         className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150 ${
//           isActive(path)
//             ? "bg-gray-900 text-white shadow-sm"
//             : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
//         }`}
//       >
//         <Icon className="h-[18px] w-[18px] shrink-0" />
//         {badge}
//       </Link>

//       <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-[13px] font-medium text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-150">
//         {label}
//         <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
//       </div>
//     </div>
//   );

//   const leadsAccess = !!subscription?.leads_access;

//   return (
//     <aside
//       className={`relative flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
//         sidebarOpen ? "w-[17rem]" : "w-[76px]"
//       }`}
//       style={{ overflow: "hidden" }}
//     >
//       {/* HEADER */}
//       <div className="flex shrink-0 items-center justify-between px-4 py-[18px] border-b border-gray-100">
//         {sidebarOpen ? (
//           <Link href="/Mainpage" className="flex items-center gap-3">
//             <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
//               <Image
//                 src={l}
//                 alt="AuditProRx"
//                 className="object-cover h-full w-full"
//                 priority
//               />
//             </div>

//             <span className="text-[16px] font-bold text-gray-900 tracking-tight">
//               AuditProRx
//             </span>
//           </Link>
//         ) : (
//           <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
//             <Image
//               src={l}
//               alt="AuditProRx"
//               width={36}
//               height={36}
//               className="object-cover h-full w-full"
//               priority
//             />
//           </div>
//         )}

//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="absolute -right-3.5 top-6 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-md hover:bg-gray-50 transition z-10"
//         >
//           {sidebarOpen ? (
//             <ChevronLeft className="h-3.5 w-3.5" />
//           ) : (
//             <ChevronRight className="h-3.5 w-3.5" />
//           )}
//         </button>
//       </div>

//       {/* NAVIGATION */}
//       <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-1 scrollbar-hide">
//         {sidebarOpen && (
//           <p className="px-3.5 pb-2.5 text-[11px] font-bold uppercase tracking-widest text-gray-400">
//             Workspace
//           </p>
//         )}

//         {ALL_NAV_ITEMS.map(({ path, label, icon: Icon, accessKey }) => {
//           const locked = subscriptionLoaded && !hasAccess(accessKey);

//           if (!sidebarOpen) {
//             return locked ? (
//               <LockedIcon key={path} icon={Icon} label={label} />
//             ) : (
//               <CollapsedNavItem
//                 key={path}
//                 path={path}
//                 label={label}
//                 icon={Icon}
//               />
//             );
//           }

//           return locked ? (
//             <LockedRow key={path} icon={Icon} label={label} />
//           ) : (
//             <Link key={path} href={path} className={navLinkClass(path)}>
//               <Icon className={navIconClass(path)} />
//               <span className="truncate">{label}</span>
//             </Link>
//           );
//         })}

//         {/* UPDATES */}
//         {sidebarOpen ? (
//           <>
//             <p className="px-3.5 pt-5 pb-2.5 text-[11px] font-bold uppercase tracking-widest text-gray-400">
//               Updates
//             </p>

//             {leadsAccess ? (
//               <Link
//                 href="/Notification"
//                 className={navLinkClass("/Notification")}
//               >
//                 <div className="relative shrink-0">
//                   <Bell className={navIconClass("/Notification")} />

//                   {unreadCount > 0 && (
//                     <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
//                   )}
//                 </div>

//                 <div className="flex-1 flex items-center justify-between min-w-0">
//                   <span className="truncate">Leads</span>

//                   {unreadCount > 0 && (
//                     <span className="ml-2 rounded-full bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 min-w-[20px] text-center leading-tight">
//                       {unreadCount > 99 ? "99+" : unreadCount}
//                     </span>
//                   )}
//                 </div>
//               </Link>
//             ) : subscriptionLoaded ? (
//               <LockedRow icon={Bell} label="Leads" />
//             ) : (
//               <div className="flex items-center gap-3 py-[11px] px-3.5 text-[15px] font-medium text-gray-200 rounded-xl">
//                 <Bell className="h-[18px] w-[18px] shrink-0" />
//                 <span className="truncate">Leads</span>
//               </div>
//             )}
//           </>
//         ) : (
//           <>
//             <div className="my-2 mx-1 border-t border-gray-100" />

//             {leadsAccess ? (
//               <CollapsedNavItem
//                 path="/Notification"
//                 label="Leads"
//                 icon={Bell}
//                 badge={
//                   unreadCount > 0 ? (
//                     <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500 ring-1 ring-white" />
//                   ) : undefined
//                 }
//               />
//             ) : subscriptionLoaded ? (
//               <LockedIcon icon={Bell} label="Leads" />
//             ) : (
//               <div className="flex h-10 w-10 items-center justify-center rounded-xl mx-auto opacity-30">
//                 <Bell className="h-[18px] w-[18px] text-gray-500" />
//               </div>
//             )}
//           </>
//         )}
//       </nav>

//       {/* BOTTOM */}
//       <div
//         ref={bottomRef}
//         className="shrink-0 border-t border-gray-100 px-3 py-3 space-y-1"
//       >
//         {/* SUPPORT */}
//         <div className="relative">
//           <button
//             onClick={() => toggle("support")}
//             className={`group w-full flex items-center gap-3 py-2.5 rounded-xl font-medium text-[15px] transition ${
//               sidebarOpen ? "px-3.5" : "justify-center"
//             } ${
//               openPopup === "support"
//                 ? "bg-gray-100 text-gray-900"
//                 : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//             }`}
//           >
//             <LifeBuoy className="h-[18px] w-[18px] text-gray-400 group-hover:text-gray-700 shrink-0" />

//             {sidebarOpen && <span>Customer Support</span>}
//           </button>

//           {openPopup === "support" && sidebarOpen && (
//             <div className="absolute left-full bottom-0 ml-3 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-xl z-50">
//               <div className="flex items-center justify-between mb-3">
//                 <h4 className="text-[15px] font-semibold text-gray-900">
//                   Contact Support
//                 </h4>

//                 <X
//                   className="h-4 w-4 text-gray-400 hover:text-gray-700 cursor-pointer"
//                   onClick={() => setOpenPopup(null)}
//                 />
//               </div>

//               <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
//                 <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
//                   <User className="h-4 w-4 text-gray-700" />
//                 </div>

//                 <div className="flex-1 min-w-0">
//                   <p className="text-[14px] font-semibold text-gray-900">
//                     Fahad Mulla
//                   </p>

//                   <p className="text-[12px] text-gray-500 flex items-center gap-1">
//                     <Phone className="h-3 w-3" /> +1 (551) 229-6466
//                   </p>
//                 </div>

//                 <a
//                   href="https://wa.me/15512296466?text=Hi%20Fahad%2C%20I%20need%20help%20with%20AuditProRx"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   title="Chat on WhatsApp"
//                   className="p-2 hover:bg-gray-200 rounded-full transition-colors"
//                 >
//                   <MessageCircle className="h-5 w-5 text-gray-700 cursor-pointer" />
//                 </a>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ACCOUNT */}
//         <div className="relative">
//           <button
//             onClick={() => toggle("account")}
//             className={`w-full flex items-center gap-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition ${
//               sidebarOpen ? "px-3.5" : "justify-center"
//             }`}
//           >
//             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-[14px] font-bold shrink-0">
//               {accountName?.charAt(0)?.toUpperCase() || "A"}
//             </div>

//             {sidebarOpen && (
//               <div className="flex-1 min-w-0 text-left">
//                 <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
//                   Account
//                 </p>

//                 <p className="text-[14px] font-semibold text-gray-900 truncate">
//                   {accountName}
//                 </p>
//               </div>
//             )}
//           </button>

//           {openPopup === "account" && sidebarOpen && (
//             <div className="absolute left-full bottom-0 ml-3 w-56 rounded-xl border border-gray-200 bg-white p-3 shadow-xl z-50">
//               <p className="text-[14px] font-medium text-gray-900">
//                 {accountName}
//               </p>
//             </div>
//           )}
//         </div>

//         {/* SETTINGS */}
//         <div className="relative">
//           <button
//             onClick={() => toggle("settings")}
//             className={`group w-full flex items-center gap-3 py-2.5 rounded-xl font-medium text-[15px] text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition ${
//               sidebarOpen ? "px-3.5" : "justify-center"
//             } ${openPopup === "settings" ? "bg-gray-100 text-gray-900" : ""}`}
//           >
//             <Settings className="h-[18px] w-[18px] text-gray-400 group-hover:text-gray-700 shrink-0" />

//             {sidebarOpen && <span>Settings</span>}
//           </button>

//           {openPopup === "settings" && sidebarOpen && (
//             <div className="absolute left-full bottom-0 ml-3 w-52 rounded-xl border border-gray-200 bg-white p-2 shadow-xl z-50">
//               <button
//                 className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[14px] text-gray-700 hover:bg-gray-100"
//                 onClick={() => router.push("/settings")}
//               >
//                 <Settings className="h-4 w-4" />
//                 Settings
//               </button>

//               <button
//                 onClick={handleLogout}
//                 className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[14px] text-red-600 hover:bg-red-50"
//               >
//                 <LogOut className="h-4 w-4" />
//                 Logout
//               </button>
//             </div>
//           )}
//         </div>

//         {/* HARD REFRESH */}
//         <button
//           onClick={() => window.location.reload()}
//           className={`group w-full flex items-center gap-3 py-2.5 rounded-xl font-medium text-[15px] text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition ${
//             sidebarOpen ? "px-3.5" : "justify-center"
//           }`}
//         >
//           <RefreshCw className="h-[18px] w-[18px] text-gray-400 group-hover:text-gray-700 shrink-0" />

//           {sidebarOpen && <span>Hard Refresh</span>}
//         </button>

//         {/* VERSION */}
//         <div
//           className={`flex items-center gap-2 pt-2 ${
//             sidebarOpen ? "px-3.5" : "justify-center"
//           }`}
//         >
//           <GitBranch className="h-3.5 w-3.5 text-gray-400" />

//           {sidebarOpen && (
//             <span className="text-[12px] text-gray-400 font-semibold">
//               v1.4
//             </span>
//           )}
//         </div>
//       </div>
//     </aside>
//   );
// }

"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Layers,
  Search,
  HelpCircle,
  LifeBuoy,
  User,
  RefreshCw,
  Settings,
  Phone,
  X,
  GitBranch,
  Pill,
  MessageCircle,
  Boxes,
  LogOut,
  Bell,
  Lock,
} from "lucide-react";

import api from "@/lib/api";
import l from "@/public/l.png";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
  activePanel: string | null;
  setActivePanel: (value: string | null) => void;
}

type Popup = "support" | "account" | "settings" | null;

const READ_IDS_KEY = "notif_read_ids";

function getReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_IDS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

const ALL_NAV_ITEMS = [
  {
    path: "/Mainpage",
    label: "Start Audit",
    icon: FileText,
    accessKey: "inventory_reports_access",
  },
  {
    path: "/ReportsPage",
    label: "Reports",
    icon: Layers,
    accessKey: "inventory_reports_access",
  },
  {
    path: "/bin-search",
    label: "Bin Search",
    icon: Search,
    accessKey: "inventory_reports_access",
  },
  {
    path: "/DrugLookup",
    label: "Drug Lookup",
    icon: Pill,
    accessKey: "drug_lookup_access",
  },
  {
    path: "/InventoryView",
    label: "Inventory View",
    icon: Boxes,
    accessKey: "inventory_view_access",
  },
  {
    path: "/how-to",
    label: "How To",
    icon: HelpCircle,
    accessKey: null,
  },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [accountName, setAccountName] = useState("...");
  const [openPopup, setOpenPopup] = useState<Popup>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [subscription, setSubscription] = useState<any>(null);
  const [subscriptionLoaded, setSubscriptionLoaded] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const toggle = (name: Popup) =>
    setOpenPopup((prev) => (prev === name ? null : name));

  /* ─────────────────────────────────────────
     SUBSCRIPTION POLLING
  ───────────────────────────────────────── */
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          setSubscriptionLoaded(true);
          return;
        }

        const res = await api.get(`/pay/subscription/${userId}`);

        setSubscription(res.data.subscription);
      } catch (err) {
        console.error(err);
      } finally {
        setSubscriptionLoaded(true);
      }
    };

    fetchSubscription();

    const interval = setInterval(async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) return;

        const res = await api.get(`/pay/subscription/${userId}`);

        setSubscription(res.data.subscription);
      } catch {}
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /* ─────────────────────────────────────────
     PHARMACY NAME
  ───────────────────────────────────────── */
  useEffect(() => {
    const pharmacy = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await api.get("/auth/pharmacy-details", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAccountName(res?.data?.pharmacy?.pharmacy_name || "Account Name");
      } catch {
        setAccountName(localStorage.getItem("pharmacyName") || "Account Name");
      }
    };

    pharmacy();
  }, []);

  /* ─────────────────────────────────────────
     UNREAD NOTIFICATIONS
  ───────────────────────────────────────── */
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await api.get("/post/client/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const posts = Array.isArray(res?.data) ? res.data : [];

        const readIds = getReadIds();

        setUnreadCount(posts.filter((p: any) => !readIds.has(p.id)).length);
      } catch {
        setUnreadCount(0);
      }
    };

    fetchUnread();

    const interval = setInterval(fetchUnread, 60000);

    const handleUpdate = () => fetchUnread();

    window.addEventListener("notifications-updated", handleUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener("notifications-updated", handleUpdate);
    };
  }, []);

  /* ─────────────────────────────────────────
     CLOSE POPUPS ON OUTSIDE CLICK
  ───────────────────────────────────────── */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bottomRef.current && !bottomRef.current.contains(e.target as Node)) {
        setOpenPopup(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ─────────────────────────────────────────
     HELPERS
  ───────────────────────────────────────── */
  const isActive = (path: string) => pathname === path;

  const hasAccess = (accessKey: string | null) =>
    !accessKey || !!subscription?.[accessKey];

  const navLinkClass = (path: string) =>
    `group w-full flex items-center gap-3 py-[11px] rounded-xl font-medium text-[15px] transition-all duration-150
     ${sidebarOpen ? "px-3.5" : "px-0 justify-center"}
     ${
       isActive(path)
         ? "bg-gray-900 text-white shadow-sm"
         : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
     }`;

  const navIconClass = (path: string) =>
    `h-[18px] w-[18px] shrink-0 transition-colors ${
      isActive(path) ? "text-white" : "text-gray-400 group-hover:text-gray-700"
    }`;

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      await api.post("/auth/logout", { refreshToken });
    } catch {
    } finally {
      localStorage.clear();
      router.push("/auth");
    }
  };

  /* ─────────────────────────────────────────
     LOCKED ROW
  ───────────────────────────────────────── */
  const LockedRow = ({
    icon: Icon,
    label,
  }: {
    icon: React.ElementType;
    label: string;
  }) => (
    <div className="relative overflow-visible rounded-xl z-[9999]">
      <div className="flex items-center gap-3 py-[11px] px-3.5 text-[15px] font-medium text-gray-200">
        <Icon className="h-[18px] w-[18px] shrink-0" />

        <span className="truncate">{label}</span>
      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 z-[9999] flex items-center justify-between px-3.5 rounded-xl bg-white/92 backdrop-blur-sm border border-dashed border-amber-300 shadow-md">
        <div className="flex items-center gap-2 min-w-0">
          <Lock className="h-[13px] w-[13px] text-amber-500 shrink-0" />

          <span className="truncate text-[12.5px] font-semibold text-amber-600 leading-none">
            {label} — Subscribe to unlock
          </span>
        </div>

        <span className="ml-2 shrink-0 text-[10px] font-bold text-amber-500 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 uppercase tracking-wide">
          Pro
        </span>
      </div>
    </div>
  );

  /* ─────────────────────────────────────────
     LOCKED ICON
  ───────────────────────────────────────── */
  const LockedIcon = ({
    icon: Icon,
    label,
  }: {
    icon: React.ElementType;
    label: string;
  }) => (
    <div className="group relative flex justify-center z-[9999]">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl cursor-not-allowed opacity-40">
        <Icon className="h-[18px] w-[18px] text-gray-500" />
      </div>

      <span className="pointer-events-none absolute bottom-0.5 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400 ring-1 ring-white">
        <Lock className="h-[8px] w-[8px] text-white" />
      </span>

      <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-[13px] font-medium text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-[9999]">
        {label} — Subscribe to unlock
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
      </div>
    </div>
  );

  /* ─────────────────────────────────────────
     COLLAPSED NAV ITEM
  ───────────────────────────────────────── */
  const CollapsedNavItem = ({
    path,
    label,
    icon: Icon,
    badge,
  }: {
    path: string;
    label: string;
    icon: React.ElementType;
    badge?: React.ReactNode;
  }) => (
    <div className="group relative flex justify-center">
      <Link
        href={path}
        className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150 ${
          isActive(path)
            ? "bg-gray-900 text-white shadow-sm"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        <Icon className="h-[18px] w-[18px] shrink-0" />
        {badge}
      </Link>

      <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 z-[9999] whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-[13px] font-medium text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        {label}

        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
      </div>
    </div>
  );

  const leadsAccess = !!subscription?.leads_access;

  return (
    <aside
      className={`relative z-[9999] flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
        sidebarOpen ? "w-[17rem]" : "w-[76px]"
      }`}
      style={{
        overflow: "visible",
      }}
    >
      {/* HEADER */}
      <div className="flex shrink-0 items-center justify-between px-4 py-[18px] border-b border-gray-100">
        {sidebarOpen ? (
          <Link href="/Mainpage" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
              <Image
                src={l}
                alt="AuditProRx"
                className="object-cover h-full w-full"
                priority
              />
            </div>

            <span className="text-[16px] font-bold text-gray-900 tracking-tight">
              AuditProRx
            </span>
          </Link>
        ) : (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <Image
              src={l}
              alt="AuditProRx"
              width={36}
              height={36}
              className="object-cover h-full w-full"
              priority
            />
          </div>
        )}

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3.5 top-6 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-md hover:bg-gray-50 transition z-[9999]"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-1 scrollbar-hide">
        {sidebarOpen && (
          <p className="px-3.5 pb-2.5 text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Workspace
          </p>
        )}

        {ALL_NAV_ITEMS.map(({ path, label, icon: Icon, accessKey }) => {
          const locked = subscriptionLoaded && !hasAccess(accessKey);

          if (!sidebarOpen) {
            return locked ? (
              <LockedIcon key={path} icon={Icon} label={label} />
            ) : (
              <CollapsedNavItem
                key={path}
                path={path}
                label={label}
                icon={Icon}
              />
            );
          }

          return locked ? (
            <LockedRow key={path} icon={Icon} label={label} />
          ) : (
            <Link key={path} href={path} className={navLinkClass(path)}>
              <Icon className={navIconClass(path)} />

              <span className="truncate">{label}</span>
            </Link>
          );
        })}

        {/* UPDATES */}
        {sidebarOpen ? (
          <>
            <p className="px-3.5 pt-5 pb-2.5 text-[11px] font-bold uppercase tracking-widest text-gray-400">
              Updates
            </p>

            {leadsAccess ? (
              <Link
                href="/Notification"
                className={navLinkClass("/Notification")}
              >
                <div className="relative shrink-0">
                  <Bell className={navIconClass("/Notification")} />

                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                  )}
                </div>

                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="truncate">Leads</span>

                  {unreadCount > 0 && (
                    <span className="ml-2 rounded-full bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 min-w-[20px] text-center leading-tight">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </div>
              </Link>
            ) : subscriptionLoaded ? (
              <LockedRow icon={Bell} label="Leads" />
            ) : (
              <div className="flex items-center gap-3 py-[11px] px-3.5 text-[15px] font-medium text-gray-200 rounded-xl">
                <Bell className="h-[18px] w-[18px] shrink-0" />

                <span className="truncate">Leads</span>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="my-2 mx-1 border-t border-gray-100" />

            {leadsAccess ? (
              <CollapsedNavItem
                path="/Notification"
                label="Leads"
                icon={Bell}
                badge={
                  unreadCount > 0 ? (
                    <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500 ring-1 ring-white" />
                  ) : undefined
                }
              />
            ) : subscriptionLoaded ? (
              <LockedIcon icon={Bell} label="Leads" />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl mx-auto opacity-30">
                <Bell className="h-[18px] w-[18px] text-gray-500" />
              </div>
            )}
          </>
        )}
      </nav>

      {/* BOTTOM */}
      <div
        ref={bottomRef}
        className="relative shrink-0 border-t border-gray-100 px-3 py-3 space-y-1 overflow-visible"
      >
        {/* SUPPORT */}
        <div className="relative">
          <button
            onClick={() => toggle("support")}
            className={`group w-full flex items-center gap-3 py-2.5 rounded-xl font-medium text-[15px] transition ${
              sidebarOpen ? "px-3.5" : "justify-center"
            } ${
              openPopup === "support"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <LifeBuoy className="h-[18px] w-[18px] text-gray-400 group-hover:text-gray-700 shrink-0" />

            {sidebarOpen && <span>Customer Support</span>}
          </button>

          {/* POPUP */}
          {openPopup === "support" && (
            <div className="absolute left-full bottom-0 ml-3 w-72 rounded-xl border border-gray-200 bg-white p-4 shadow-2xl z-[99999]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[15px] font-semibold text-gray-900">
                  Contact Support
                </h4>

                <X
                  className="h-4 w-4 text-gray-400 hover:text-gray-700 cursor-pointer"
                  onClick={() => setOpenPopup(null)}
                />
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200">
                  <User className="h-4 w-4 text-gray-700" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-gray-900">
                    Fahad Mulla
                  </p>

                  <p className="text-[12px] text-gray-500 flex items-center gap-1">
                    <Phone className="h-3 w-3" /> +1 (551) 229-6466
                  </p>
                </div>

                <a
                  href="https://wa.me/15512296466?text=Hi%20Fahad%2C%20I%20need%20help%20with%20AuditProRx"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Chat on WhatsApp"
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-gray-700 cursor-pointer" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* ACCOUNT */}
        <div className="relative">
          <button
            onClick={() => toggle("account")}
            className={`w-full flex items-center gap-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition ${
              sidebarOpen ? "px-3.5" : "justify-center"
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-[14px] font-bold shrink-0">
              {accountName?.charAt(0)?.toUpperCase() || "A"}
            </div>

            {sidebarOpen && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Account
                </p>

                <p className="text-[14px] font-semibold text-gray-900 truncate">
                  {accountName}
                </p>
              </div>
            )}
          </button>

          {openPopup === "account" && (
            <div className="absolute left-full bottom-0 ml-3 w-56 rounded-xl border border-gray-200 bg-white p-3 shadow-2xl z-[99999]">
              <p className="text-[14px] font-medium text-gray-900">
                {accountName}
              </p>
            </div>
          )}
        </div>

        {/* SETTINGS */}
        <div className="relative">
          <button
            onClick={() => toggle("settings")}
            className={`group w-full flex items-center gap-3 py-2.5 rounded-xl font-medium text-[15px] transition ${
              sidebarOpen ? "px-3.5" : "justify-center"
            } ${
              openPopup === "settings"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Settings className="h-[18px] w-[18px] text-gray-400 group-hover:text-gray-700 shrink-0" />

            {sidebarOpen && <span>Settings</span>}
          </button>

          {/* SETTINGS POPUP */}
          {openPopup === "settings" && (
            <div className="absolute left-full bottom-0 ml-3 w-52 rounded-xl border border-gray-200 bg-white p-2 shadow-2xl z-[99999]">
              <button
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[14px] text-gray-700 hover:bg-gray-100"
                onClick={() => router.push("/settings")}
              >
                <Settings className="h-4 w-4" />
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[14px] text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* HARD REFRESH */}
        <button
          onClick={() => window.location.reload()}
          className={`group w-full flex items-center gap-3 py-2.5 rounded-xl font-medium text-[15px] text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition ${
            sidebarOpen ? "px-3.5" : "justify-center"
          }`}
        >
          <RefreshCw className="h-[18px] w-[18px] text-gray-400 group-hover:text-gray-700 shrink-0" />

          {sidebarOpen && <span>Hard Refresh</span>}
        </button>

        {/* VERSION */}
        <div
          className={`flex items-center gap-2 pt-2 ${
            sidebarOpen ? "px-3.5" : "justify-center"
          }`}
        >
          <GitBranch className="h-3.5 w-3.5 text-gray-400" />

          {sidebarOpen && (
            <span className="text-[12px] text-gray-400 font-semibold">
              v1.4
            </span>
          )}
        </div>
      </div>
    </aside>
  );
}
