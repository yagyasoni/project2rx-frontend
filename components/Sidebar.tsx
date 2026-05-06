// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import Link from "next/link";
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
// } from "lucide-react";
// import api from "@/lib/api";

// interface SidebarProps {
//   sidebarOpen: boolean;
//   setSidebarOpen: (value: boolean) => void;
//   activePanel: string | null;
//   setActivePanel: (value: string | null) => void;
// }

// type Popup = "support" | "account" | "settings" | null;

// export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [accountName, setAccountName] = useState("...");
//   const [openPopup, setOpenPopup] = useState<Popup>(null);
//   const bottomRef = useRef<HTMLDivElement>(null);

//   const toggle = (name: Popup) =>
//     setOpenPopup((prev) => (prev === name ? null : name));

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
//     `w-full flex items-center gap-3 py-3 rounded-lg font-semibold transition-all duration-200 leading-5
//      ${sidebarOpen ? "px-4" : "px-0 justify-center"}
//      ${
//        isActive(path)
//          ? "bg-gray-200/60 text-gray-800"
//          : "text-gray-700 hover:bg-gray-100"
//      }`;

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

//   return (
//     <aside
//       className={`${
//         sidebarOpen ? "w-65" : "w-[72px]"
//       } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col relative`}
//     >
//       {/* HEADER */}
//       <div className="p-4 border-b border-gray-200">
//         <div className="flex items-center justify-between">
//           {sidebarOpen && (
//             <div className="flex items-center gap-3">
//               {/* <button className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-100 transition-colors">
//                 <UserLock size={16} className="text-gray-700" />
//               </button> */}

//               <div className="flex flex-col items-center ml-12 leading-tight">
//                 <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
//                   AuditProRx
//                 </span>
//                 {/* <span className="ml-12 italic text-[12px] font-semibold text-gray-900 tracking-tight">
//                   AuditProRx
//                 </span> */}
//               </div>
//             </div>
//           )}
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="p-1 hover:bg-gray-100 rounded translate-x-2"
//           >
//             {sidebarOpen ? (
//               <ChevronLeft className="w-5 h-5 text-gray-600" />
//             ) : (
//               <ChevronRight className="w-5 h-5 text-gray-600" />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* NAVIGATION */}
//       <nav className="flex-1 p-4 space-y-2">
//         <Link href="/Mainpage" className={navClass("/Mainpage")}>
//           <Layers className="w-5 h-5" />
//           {sidebarOpen && <span className="ml-2 text-[14px]">Start Audit</span>}
//         </Link>

//         <Link href="/ReportsPage" className={navClass("/ReportsPage")}>
//           <FileText className="w-5 h-5" />
//           {sidebarOpen && <span className="ml-2 text-[14px]">Reports</span>}
//         </Link>

//         <Link href="/bin-search" className={navClass("/bin-search")}>
//           <Search className="w-5 h-5" />
//           {sidebarOpen && <span className="ml-2 text-[14px]">Bin Search</span>}
//         </Link>

//         {/* Was: Tickets — now Drug Lookup */}
//         <Link href="/DrugLookup" className={navClass("/DrugLookup")}>
//           <Pill className="w-5 h-5" />
//           {sidebarOpen && <span className="ml-3">Drug Lookup</span>}
//         </Link>

//         <Link href="/InventoryView" className={navClass("/InventoryView")}>
//           <Boxes className="w-5 h-5" />
//           {sidebarOpen && <span className="ml-3">Inventory View</span>}
//         </Link>

//         {/* <Link href="/marketplace" className={navClass("/marketplace")}>
//           <Store className="w-5 h-5" />
//           {sidebarOpen && (
//             <span className="ml-2 text-[14px]">Inventory View</span>
//           )}
//         </Link> */}
//         <Link href="/how-to" className={navClass("/how-to")}>
//           <HelpCircle className="w-5 h-5" />
//           {sidebarOpen && <span className="ml-2 text-[14px]">How To</span>}
//         </Link>
//       </nav>

//       {/* BOTTOM */}
//       <div className="border-t border-gray-200 p-4 space-y-2" ref={bottomRef}>
//         {/* SUPPORT */}
//         <div className="relative">
//           <button
//             onClick={() => toggle("support")}
//             className={`w-full flex items-center gap-3 py-3 rounded-lg font-semibold transition-all duration-200 ${
//               sidebarOpen ? "px-4" : "px-0 justify-center"
//             } ${
//               openPopup === "support"
//                 ? "bg-gray-200/60 text-gray-800"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`}
//           >
//             <LifeBuoy className="w-5 h-5" />
//             {sidebarOpen && (
//               <span className="flex-1 text-left ml-2 text-[14px]">
//                 Customer Support
//               </span>
//             )}
//           </button>

//           {openPopup === "support" && sidebarOpen && (
//             <div className="absolute left-full ml-2 bottom-0 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
//               <div className="p-4 space-y-3">
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-sm font-semibold text-gray-900">
//                     Contact Support
//                   </h3>
//                   <X
//                     className="w-4 h-4 cursor-pointer text-gray-500"
//                     onClick={() => setOpenPopup(null)}
//                   />
//                 </div>
//                 <div className="space-y-3">
//                   {/* <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                         <LifeBuoy className="w-5 h-5 text-green-700" />
//                       </div>
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           Fahad Mulla
//                         </div>
//                         <div className="text-sm text-gray-600">
//                           +1 (551) 229-6466
//                         </div>
//                       </div>
//                     </div>
//                     <a
//                       href="tel:+15512296466"
//                       className="p-2 hover:bg-white rounded-full transition-colors"
//                     >
//                       <Phone className="w-5 h-5 text-green-700" />
//                     </a>
//                   </div> */}
//                   <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                         <User className="w-5 h-5 text-green-700" />
//                       </div>
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           Fahad Mulla
//                         </div>
//                         <div className="text-sm text-gray-600">
//                           +1 (551) 229-6466
//                         </div>
//                       </div>
//                     </div>
//                     <a
//                       href="https://wa.me/15512296466?text=Hi%20Fahad%2C%20I%20need%20help%20with%20AuditProRx"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       title="Chat on WhatsApp"
//                       className="p-2 hover:bg-white rounded-full transition-colors"
//                     >
//                       <MessageCircle className="w-5 h-5 text-green-600" />
//                     </a>
//                   </div>
//                   <Phone className="w-5 h-5 text-gray-600" />
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ACCOUNT */}
//         <div className="relative">
//           <button
//             onClick={() => toggle("account")}
//             className={`w-full flex items-center gap-3 py-3 rounded-lg border-2 border-gray-200 hover:bg-gray-50 ${
//               sidebarOpen ? "px-3" : "justify-center"
//             }`}
//           >
//             <User className="w-5 h-5 text-gray-700" />
//             {sidebarOpen && (
//               <div className="ml-2">
//                 <p className="text-xs text-gray-500">Account Name</p>
//                 <p className="text-sm font-semibold text-gray-900">
//                   {accountName}
//                 </p>
//               </div>
//             )}
//           </button>

//           {openPopup === "account" && sidebarOpen && (
//             <div className="absolute left-full ml-2 bottom-0 w-64 bg-white border border-gray-200 rounded-lg shadow-xl p-3">
//               <p className="text-sm font-semibold">{accountName}</p>
//             </div>
//           )}
//         </div>

//         {/* SETTINGS */}
//         <div className="relative">
//           <button
//             onClick={() => toggle("settings")}
//             className={`w-full flex items-center gap-3 py-3 rounded-lg font-semibold ${
//               sidebarOpen ? "px-4" : "justify-center"
//             } hover:bg-gray-100`}
//           >
//             <Settings className="w-5 h-5" />
//             {sidebarOpen && <span className="ml-2 text-[14px]">Settings</span>}
//           </button>

//           {openPopup === "settings" && sidebarOpen && (
//             <div className="absolute left-full ml-2 bottom-0 w-52 bg-white border border-gray-200 rounded-lg shadow-xl">
//               <Link
//                 href="/settings"
//                 className="block px-4 gap-3 flex flex-col-2 py-3 text-sm hover:bg-gray-50"
//               >
//                 <Settings className="w-4 h-4" />
//                 <span>Settings</span>
//               </Link>
//               <button
//                 onClick={handleLogout}
//                 className="w-full text-left flex flex-col-2 gap-3 px-4 py-3 text-sm border-t hover:bg-gray-50"
//               >
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//                   />
//                 </svg>
//                 <span>Logout</span>
//               </button>
//             </div>
//           )}
//         </div>

//         {/* REFRESH */}
//         <button
//           onClick={() => window.location.reload()}
//           className={`w-full flex items-center gap-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold ${
//             sidebarOpen ? "px-4" : "justify-center"
//           }`}
//         >
//           <RefreshCw className="w-5 h-5" />
//           {sidebarOpen && (
//             <span className="ml-2 text-[14px]">Hard Refresh</span>
//           )}
//         </button>

//         {/* VERSION */}
//         <div
//           className={`flex items-center gap-3 py-2 ${
//             sidebarOpen ? "px-4" : "justify-center"
//           }`}
//         >
//           <GitBranch className="w-5 h-5 text-gray-900" />
//           {sidebarOpen && (
//             <span className="text-sm text-gray-700 ml-2">Version 1.4</span>
//           )}
//         </div>
//       </div>
//     </aside>
//   );
// }

// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import Link from "next/link";
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

// export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [accountName, setAccountName] = useState("...");
//   const [openPopup, setOpenPopup] = useState<Popup>(null);
//   const bottomRef = useRef<HTMLDivElement>(null);

//   const toggle = (name: Popup) =>
//     setOpenPopup((prev) => (prev === name ? null : name));

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
//     `w-full flex items-center gap-3 py-3 rounded-lg font-semibold text-[14px] transition-all duration-200 leading-5
//      ${sidebarOpen ? "px-4" : "px-0 justify-center"}
//      ${
//        isActive(path)
//          ? "bg-gray-200/60 text-gray-800"
//          : "text-gray-700 hover:bg-gray-100"
//      }`;

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

//   return (
//     <aside
//       className={`${
//         sidebarOpen ? "w-65" : "w-[72px]"
//       } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col relative`}
//     >
//       {/* HEADER */}
//       <div className="p-4 border-b border-gray-200">
//         <div className="flex items-center justify-between">
//           {sidebarOpen && (
//             <div className="flex px-4 items-center gap-3">
//               {/* LOGO PLACEHOLDER */}
//               <img
//                 className="w-8 h-7 rounded-[10px] bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600"
//                 src={l.src}
//                 alt="Logo"
//               />

//               <div className="flex flex-col leading-tight">
//                 <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
//                   AuditProRx
//                 </span>
//               </div>
//             </div>
//           )}

//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="p-1 hover:bg-gray-100 rounded translate-x-2"
//           >
//             {sidebarOpen ? (
//               <ChevronLeft className="w-5 h-5 text-gray-600" />
//             ) : (
//               <ChevronRight className="w-5 h-5 text-gray-600" />
//             )}
//           </button>
//         </div>
//       </div>

//       {/* NAVIGATION */}
//       <nav className="flex-1 p-4 space-y-2">
//         <Link href="/Mainpage" className={navClass("/Mainpage")}>
//           <Layers className="w-5 h-5" />
//           {sidebarOpen && <span className="ml-2">Start Audit</span>}
//         </Link>

//         <Link href="/ReportsPage" className={navClass("/ReportsPage")}>
//           <FileText className="w-5 h-5" />
//           {sidebarOpen && <span className="ml-2">Reports</span>}
//         </Link>

//         <Link href="/bin-search" className={navClass("/bin-search")}>
//           <Search className="w-5 h-5" />
//           {sidebarOpen && <span className="ml-2">Bin Search</span>}
//         </Link>

//         <Link href="/DrugLookup" className={navClass("/DrugLookup")}>
//           <Pill className="w-5 h-5" />
//           {sidebarOpen && <span className="ml-2">Drug Lookup</span>}
//         </Link>

//         <Link href="/InventoryView" className={navClass("/InventoryView")}>
//           <Boxes className="w-5 h-5" />
//           {sidebarOpen && <span className="ml-2">Inventory View</span>}
//         </Link>

//         <Link href="/how-to" className={navClass("/how-to")}>
//           <HelpCircle className="w-5 h-5" />
//           {sidebarOpen && <span className="ml-2">How To</span>}
//         </Link>
//       </nav>

//       {/* BOTTOM */}
//       <div className="border-t border-gray-200 p-4 space-y-2" ref={bottomRef}>
//         {/* SUPPORT */}
//         <div className="relative">
//           <button
//             onClick={() => toggle("support")}
//             className={`w-full flex items-center gap-3 py-3 rounded-lg font-semibold text-[14px] transition-all duration-200 ${
//               sidebarOpen ? "px-4" : "px-0 justify-center"
//             } ${
//               openPopup === "support"
//                 ? "bg-gray-200/60 text-gray-800"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`}
//           >
//             <LifeBuoy className="w-5 h-5" />
//             {sidebarOpen && (
//               <span className="flex-1 text-left ml-2">Customer Support</span>
//             )}
//           </button>

//           {openPopup === "support" && sidebarOpen && (
//             <div className="absolute left-full ml-2 bottom-0 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
//               <div className="p-4 space-y-3">
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-sm font-semibold text-gray-900">
//                     Contact Support
//                   </h3>
//                   <X
//                     className="w-4 h-4 cursor-pointer text-gray-500"
//                     onClick={() => setOpenPopup(null)}
//                   />
//                 </div>
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                     <div className="flex items-center gap-3">
//                       <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                         <User className="w-5 h-5 text-green-700" />
//                       </div>
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           Fahad Mulla
//                         </div>
//                         <div className="text-sm text-gray-600">
//                           +1 (551) 229-6466
//                         </div>
//                       </div>
//                     </div>
//                     <a
//                       href="https://wa.me/15512296466?text=Hi%20Fahad%2C%20I%20need%20help%20with%20AuditProRx"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="p-2 hover:bg-white rounded-full transition-colors"
//                     >
//                       <MessageCircle className="w-5 h-5 text-green-600" />
//                     </a>
//                   </div>
//                   {/* <Phone className="w-5 h-5 text-gray-600" /> */}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ACCOUNT */}
//         <div className="relative">
//           <button
//             onClick={() => toggle("account")}
//             className={`w-full flex items-center gap-3 py-3 rounded-lg border-2 border-gray-200 hover:bg-gray-50 ${
//               sidebarOpen ? "px-3" : "justify-center"
//             }`}
//           >
//             <User className="w-5 h-5 text-gray-700" />
//             {sidebarOpen && (
//               <div className="ml-2">
//                 <p className="text-xs text-gray-500">Account Name</p>
//                 <p className="text-sm font-semibold text-gray-900">
//                   {accountName}
//                 </p>
//               </div>
//             )}
//           </button>

//           {openPopup === "account" && sidebarOpen && (
//             <div className="absolute left-full ml-2 bottom-0 w-64 bg-white border border-gray-200 rounded-lg shadow-xl p-3">
//               <p className="text-sm font-semibold">{accountName}</p>
//             </div>
//           )}
//         </div>

//         {/* SETTINGS */}
//         <div className="relative">
//           <button
//             onClick={() => toggle("settings")}
//             className={`w-full flex items-center gap-3 py-3 rounded-lg font-semibold text-[14px] ${
//               sidebarOpen ? "px-4" : "justify-center"
//             } hover:bg-gray-100`}
//           >
//             <Settings className="w-5 h-5" />
//             {sidebarOpen && <span className="ml-2">Settings</span>}
//           </button>

//           {openPopup === "settings" && sidebarOpen && (
//             <div className="absolute left-full ml-2 bottom-0 w-52 bg-white border border-gray-200 rounded-lg shadow-xl">
//               <Link
//                 href="/settings"
//                 className="block px-4 gap-3 flex flex-col-2 py-3 text-sm hover:bg-gray-50"
//               >
//                 <Settings className="w-4 h-4" />
//                 <span>Settings</span>
//               </Link>
//               <button
//                 onClick={handleLogout}
//                 className="w-full text-left flex flex-col-2 gap-3 px-4 py-3 text-sm border-t hover:bg-gray-50"
//               >
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//                   />
//                 </svg>
//                 <span>Logout</span>
//               </button>
//             </div>
//           )}
//         </div>

//         {/* REFRESH */}
//         <button
//           onClick={() => window.location.reload()}
//           className={`w-full flex items-center gap-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold text-[14px] ${
//             sidebarOpen ? "px-4" : "justify-center"
//           }`}
//         >
//           <RefreshCw className="w-5 h-5" />
//           {sidebarOpen && <span className="ml-2">Hard Refresh</span>}
//         </button>

//         {/* VERSION */}
//         <div
//           className={`flex items-center gap-3 py-2 ${
//             sidebarOpen ? "px-4" : "justify-center"
//           }`}
//         >
//           <GitBranch className="w-5 h-5 text-gray-900" />
//           {sidebarOpen && (
//             <span className="text-sm font-semibold text-gray-700 ml-2">
//               Version 1.4
//             </span>
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

// export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const [accountName, setAccountName] = useState("...");
//   const [openPopup, setOpenPopup] = useState<Popup>(null);
//   const bottomRef = useRef<HTMLDivElement>(null);

//   const toggle = (name: Popup) =>
//     setOpenPopup((prev) => (prev === name ? null : name));

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
//     `group w-full flex items-center gap-3 py-2.5 rounded-xl font-medium text-[15px] transition-all duration-200
//      ${sidebarOpen ? "px-3.5" : "px-0 justify-center"}
//      ${
//        isActive(path)
//          ? " ring-2 ring-gray-200"
//          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//      }`;

//   const iconClass = (path: string) =>
//     `h-5 w-5 shrink-0 transition-colors ${
//       isActive(path) ? "text-black" : "text-gray-500 group-hover:text-gray-800"
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
//     { path: "/Mainpage", label: "Start Audit", icon: FileText },
//     { path: "/ReportsPage", label: "Reports", icon: Layers },
//     { path: "/bin-search", label: "Bin Search", icon: Search },
//     { path: "/DrugLookup", label: "Drug Lookup", icon: Pill },
//     { path: "/InventoryView", label: "Inventory View", icon: Boxes },
//     { path: "/how-to", label: "How To", icon: HelpCircle },
//   ];

//   return (
//     <aside
//       className={`relative flex h-screen flex-col border-r border-gray-200 bg-white transition-[width] duration-300 ease-in-out ${
//         sidebarOpen ? "w-64" : "w-[76px]"
//       }`}
//     >
//       {/* HEADER */}
//       <div className="flex items-center justify-between px-4 pt-5 pb-4 border-b border-gray-100">
//         {sidebarOpen ? (
//           <Link href="/" className="flex items-center gap-2.5">
//             <div className="flex h-8.5 w-9 items-center justify-center rounded-xl shadow-md overflow-hidden bg-white">
//               <Image
//                 src={l}
//                 alt="AuditProRx"
//                 className="object-cover h-full align-middle w-full"
//                 priority
//               />
//             </div>
//             <span className="text-[17px] font-bold tracking-tight text-gray-900">
//               AuditProRx
//             </span>
//           </Link>
//         ) : (
//           <div className="mx-auto flex h-8.5 w-9 items-center justify-center rounded-xl shadow-md overflow-hidden bg-white">
//             <Image
//               src={l}
//               alt="AuditProRx"
//               className="object-cover h-full align-middle w-full"
//               priority
//             />
//           </div>
//         )}

//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="absolute -right-3 top-7 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 hover:text-gray-900 transition"
//         >
//           {sidebarOpen ? (
//             <ChevronLeft className="h-3.5 w-3.5" />
//           ) : (
//             <ChevronRight className="h-3.5 w-3.5" />
//           )}
//         </button>
//       </div>

//       {/* NAVIGATION */}
//       <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
//         {sidebarOpen && (
//           <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
//             Workspace
//           </p>
//         )}
//         {navItems.map(({ path, label, icon: Icon }) => (
//           <Link key={path} href={path} className={navClass(path)}>
//             <Icon className={iconClass(path)} />
//             {sidebarOpen && <span className="truncate">{label}</span>}
//           </Link>
//         ))}
//       </nav>

//       {/* BOTTOM */}
//       <div
//         ref={bottomRef}
//         className="border-t border-gray-100 px-3 py-3 space-y-1.5"
//       >
//         {/* SUPPORT */}
//         <div className="relative">
//           <button
//             onClick={() => toggle("support")}
//             className={`group w-full flex items-center gap-3 py-2.5 rounded-xl font-medium text-[15px] transition-all duration-200 ${
//               sidebarOpen ? "px-3.5" : "px-0 justify-center"
//             } ${
//               openPopup === "support"
//                 ? "bg-gray-100 text-gray-900"
//                 : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//             }`}
//           >
//             <LifeBuoy className="h-5 w-5 shrink-0 text-gray-500 group-hover:text-gray-800" />
//             {sidebarOpen && <span>Customer Support</span>}
//           </button>

//           {openPopup === "support" && sidebarOpen && (
//             <div className="absolute left-full bottom-0 ml-3 w-72 rounded-2xl border border-gray-200 bg-white p-4 shadow-xl z-50">
//               <div className="flex items-center justify-between mb-3">
//                 <h4 className="text-sm font-semibold text-gray-900">
//                   Contact Support
//                 </h4>
//                 <X
//                   className="h-4 w-4 text-gray-400 hover:text-gray-700 cursor-pointer"
//                   onClick={() => setOpenPopup(null)}
//                 />
//               </div>
//               <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
//                   <User className="h-5 w-5" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-semibold text-gray-900">
//                     Fahad Mulla
//                   </p>
//                   <p className="text-xs text-gray-500 flex items-center gap-1">
//                     <Phone className="h-3 w-3" /> +1 (551) 229-6466
//                   </p>
//                 </div>
//                 <MessageCircle className="h-5 w-5 text-indigo-600 cursor-pointer" />
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ACCOUNT */}
//         <div className="relative">
//           <button
//             onClick={() => toggle("account")}
//             className={`w-full flex items-center gap-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-100 transition ${
//               sidebarOpen ? "px-3" : "justify-center"
//             }`}
//           >
//             <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gray-500 to-black text-white text-sm font-semibold shrink-0">
//               {accountName?.charAt(0)?.toUpperCase() || "A"}
//             </div>
//             {sidebarOpen && (
//               <div className="flex-1 min-w-0 text-left">
//                 <p className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
//                   Account
//                 </p>
//                 <p className="text-sm font-semibold text-gray-900 truncate">
//                   {accountName}
//                 </p>
//               </div>
//             )}
//           </button>

//           {openPopup === "account" && sidebarOpen && (
//             <div className="absolute left-full bottom-0 ml-3 w-60 rounded-2xl border border-gray-200 bg-white p-3 shadow-xl z-50">
//               <p className="text-sm font-semibold text-gray-900">
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
//             }`}
//           >
//             <Settings className="h-5 w-5 shrink-0 text-gray-500 group-hover:text-gray-800" />
//             {sidebarOpen && <span>Settings</span>}
//           </button>

//           {openPopup === "settings" && sidebarOpen && (
//             <div className="absolute left-full bottom-0 ml-3 w-52 rounded-2xl border border-gray-200 bg-white p-2 shadow-xl z-50">
//               <button
//                 className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
//                 onClick={() => router.push("/settings")}
//               >
//                 <Settings className="h-4 w-4" /> Settings
//               </button>
//               <button
//                 onClick={handleLogout}
//                 className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50"
//               >
//                 <LogOut className="h-4 w-4" /> Logout
//               </button>
//             </div>
//           )}
//         </div>

//         {/* REFRESH */}
//         <button
//           onClick={() => window.location.reload()}
//           className={`group w-full flex items-center gap-3 py-2.5 rounded-xl font-medium text-[15px] text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition ${
//             sidebarOpen ? "px-3.5" : "justify-center"
//           }`}
//         >
//           <RefreshCw className="h-5 w-5 shrink-0 text-gray-500 group-hover:text-gray-800" />
//           {sidebarOpen && <span>Hard Refresh</span>}
//         </button>

//         {/* VERSION */}
//         <div
//           className={`flex items-center gap-2 pt-2 ${sidebarOpen ? "px-3.5" : "justify-center"}`}
//         >
//           <GitBranch className="h-3.5 w-3.5 text-gray-400" />
//           {sidebarOpen && (
//             <span className="text-xs font-medium text-gray-400">
//               Version 1.4
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

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [accountName, setAccountName] = useState("...");
  const [openPopup, setOpenPopup] = useState<Popup>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const toggle = (name: Popup) =>
    setOpenPopup((prev) => (prev === name ? null : name));

  useEffect(() => {
    const pharmacy = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await api.get("/auth/pharmacy-details", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const name = res?.data?.pharmacy?.pharmacy_name || "Account Name";
        setAccountName(name);
      } catch {
        setAccountName(localStorage.getItem("pharmacyName") || "Account Name");
      }
    };
    pharmacy();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        bottomRef.current &&
        !bottomRef.current.contains(event.target as Node)
      ) {
        setOpenPopup(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => pathname === path;

  const navClass = (path: string) =>
    `group w-full flex items-center gap-3 py-2.5 rounded-lg font-medium text-[14px] transition-all duration-200
     ${sidebarOpen ? "px-3" : "px-0 justify-center"}
     ${
       isActive(path)
         ? "bg-gray-100 text-gray-900"
         : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
     }`;

  const iconClass = (path: string) =>
    `h-[18px] w-[18px] shrink-0 transition-colors ${
      isActive(path)
        ? "text-gray-900"
        : "text-gray-400 group-hover:text-gray-700"
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

  const navItems = [
    { path: "/Mainpage", label: "Start Audit", icon: FileText },
    { path: "/ReportsPage", label: "Reports", icon: Layers },
    { path: "/bin-search", label: "Bin Search", icon: Search },
    { path: "/DrugLookup", label: "Drug Lookup", icon: Pill },
    { path: "/InventoryView", label: "Inventory View", icon: Boxes },
    { path: "/how-to", label: "How To", icon: HelpCircle },
  ];

  return (
    <aside
      className={`relative flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-[72px]"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        {sidebarOpen ? (
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8.5 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white overflow-hidden">
              <Image
                src={l}
                alt="AuditProRx"
                className="object-cover h-full align-middle w-full"
                priority
              />
            </div>
            <span className="text-[15px] font-semibold text-gray-900 tracking-tight">
              AuditProRx
            </span>
          </Link>
        ) : (
          <div className="mx-auto flex h-8.5 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white overflow-hidden">
            <Image
              src={l}
              alt="AuditProRx"
              width={22}
              height={22}
              className="object-cover h-full align-middle w-full"
              priority
            />
          </div>
        )}

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 transition"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {sidebarOpen && (
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Workspace
          </p>
        )}

        {navItems.map(({ path, label, icon: Icon }) => (
          <Link key={path} href={path} className={navClass(path)}>
            <Icon className={iconClass(path)} />
            {sidebarOpen && <span className="truncate">{label}</span>}
          </Link>
        ))}
      </nav>

      {/* BOTTOM */}
      <div
        ref={bottomRef}
        className="border-t border-gray-100 px-3 py-3 space-y-1"
      >
        {/* SUPPORT */}
        <div className="relative">
          <button
            onClick={() => toggle("support")}
            className={`group w-full flex items-center gap-3 py-2.5 rounded-lg font-medium text-[14px] transition ${
              sidebarOpen ? "px-3" : "justify-center"
            } ${
              openPopup === "support"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <LifeBuoy className="h-[18px] w-[18px] text-gray-400 group-hover:text-gray-700" />
            {sidebarOpen && <span>Customer Support</span>}
          </button>

          {openPopup === "support" && sidebarOpen && (
            <div className="absolute left-full bottom-0 ml-3 w-72 rounded-lg border border-gray-200 bg-white p-4 shadow-lg z-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900">
                  Contact Support
                </h4>
                <X
                  className="h-4 w-4 text-gray-400 hover:text-gray-700 cursor-pointer"
                  onClick={() => setOpenPopup(null)}
                />
              </div>

              <div className="flex items-center gap-3 rounded-md border p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                  <User className="h-4 w-4 text-gray-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Fahad Mulla
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Phone className="h-3 w-3" /> +1 (551) 229-6466
                  </p>
                </div>
                <a
                  href="https://wa.me/15512296466?text=Hi%20Fahad%2C%20I%20need%20help%20with%20AuditProRx"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Chat on WhatsApp"
                  className="p-2 hover:bg-white rounded-full transition-colors"
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
            className={`w-full flex items-center gap-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition ${
              sidebarOpen ? "px-3" : "justify-center"
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-semibold shrink-0">
              {accountName?.charAt(0)?.toUpperCase() || "A"}
            </div>

            {sidebarOpen && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                  Account
                </p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {accountName}
                </p>
              </div>
            )}
          </button>

          {openPopup === "account" && sidebarOpen && (
            <div className="absolute left-full bottom-0 ml-3 w-56 rounded-lg border border-gray-200 bg-white p-3 shadow-lg z-50">
              <p className="text-sm font-medium text-gray-900">{accountName}</p>
            </div>
          )}
        </div>

        {/* SETTINGS */}
        <div className="relative">
          <button
            onClick={() => toggle("settings")}
            className={`group w-full flex items-center gap-3 py-2.5 rounded-lg font-medium text-[14px] text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition ${
              sidebarOpen ? "px-3" : "justify-center"
            }`}
          >
            <Settings className="h-[18px] w-[18px] text-gray-400 group-hover:text-gray-700" />
            {sidebarOpen && <span>Settings</span>}
          </button>

          {openPopup === "settings" && sidebarOpen && (
            <div className="absolute left-full bottom-0 ml-3 w-52 rounded-lg border border-gray-200 bg-white p-2 shadow-lg z-50">
              <button
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => router.push("/settings")}
              >
                <Settings className="h-4 w-4" /> Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          )}
        </div>

        {/* REFRESH */}
        <button
          onClick={() => window.location.reload()}
          className={`group w-full flex items-center gap-3 py-2.5 rounded-lg font-medium text-[14px] text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition ${
            sidebarOpen ? "px-3" : "justify-center"
          }`}
        >
          <RefreshCw className="h-[18px] w-[18px] text-gray-400 group-hover:text-gray-700" />
          {sidebarOpen && <span>Hard Refresh</span>}
        </button>

        {/* VERSION */}
        <div
          className={`flex items-center gap-2 pt-2 ${
            sidebarOpen ? "px-3" : "justify-center"
          }`}
        >
          <GitBranch className="h-3.5 w-3.5 text-gray-400" />
          {sidebarOpen && (
            <span className="text-[11px] text-gray-400 font-medium">v1.4</span>
          )}
        </div>
      </div>
    </aside>
  );
}
