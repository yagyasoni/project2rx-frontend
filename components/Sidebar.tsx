// // "use client";

// // import React, { useState, useRef, useEffect } from "react";
// // import Link from "next/link";
// // import { usePathname } from "next/navigation";
// // import {
// //   ChevronLeft,
// //   ChevronRight,
// //   FileText,
// //   Layers,
// //   Search,
// //   HelpCircle,
// //   LifeBuoy,
// //   User,
// //   RefreshCw,
// //   Settings,
// //   Phone,
// //   X,
// //   GitBranch,
// //   Pill,
// // } from "lucide-react";
// // import axios from "axios";
// // import api from "@/lib/api";
// // import { useRouter } from "next/navigation";

// // interface SidebarProps {
// //   sidebarOpen: boolean;
// //   setSidebarOpen: (value: boolean) => void;
// //   activePanel: string | null;
// //   setActivePanel: (value: string | null) => void;
// // }

// // type Popup = "support" | "account" | "settings" | null;

// // export default function Sidebar({
// //   sidebarOpen,
// //   setSidebarOpen,
// //   activePanel,
// //   setActivePanel,
// // }: SidebarProps) {
// //   const router = useRouter();

// //   const pathname = usePathname();
// //   const [showSupportPopup, setShowSupportPopup] = useState(false);
// //   const [showAccountDropdown, setShowAccountDropdown] = useState(false);
// //   const [accountName, setAccountName] = useState("...");
// //   const supportRef = useRef<HTMLDivElement>(null);
// //   const accountRef = useRef<HTMLDivElement>(null);

// //   useEffect(() => {
// //     const pharmacy = async () => {
// //       try {
// //         const token = localStorage.getItem("accessToken");

// //         const res = await api.get("/auth/pharmacy-details", {
// //           headers: {
// //             Authorization: `Bearer ${token}`,
// //           },
// //         });
// //         console.log(res.data);
// //         localStorage.setItem(
// //           "pharmacyName",
// //           res?.data?.pharmacy?.pharmacy_name,
// //         );
// //         localStorage.setItem(
// //           "pharmacyNameFor",
// //           localStorage.getItem("userEmail") || "",
// //         );
// //         setAccountName(res?.data?.pharmacy?.pharmacy_name || "Account Name");
// //       } catch (err) {
// //         console.log("error");
// //         setAccountName(localStorage.getItem("pharmacyName") || "Account Name");
// //       }
// //     };
// //     const cachedEmail = localStorage.getItem("userEmail");
// //     const cachedPharmacyFor = localStorage.getItem("pharmacyNameFor");
// //     const cached = localStorage.getItem("pharmacyName");

// //     if (cached && cachedPharmacyFor === cachedEmail) {
// //       setAccountName(cached);
// //     } else {
// //       localStorage.removeItem("pharmacyName");
// //       localStorage.removeItem("pharmacyNameFor");
// //     }
// //     pharmacy();
// //   }, []);

// //   const [openPopup, setOpenPopup] = useState<Popup>(null);
// //   const bottomRef = useRef<HTMLDivElement>(null);

// //   const toggle = (name: Popup) =>
// //     setOpenPopup((prev) => (prev === name ? null : name));

// //   useEffect(() => {
// //     function handleClickOutside(event: MouseEvent) {
// //       if (
// //         bottomRef.current &&
// //         !bottomRef.current.contains(event.target as Node)
// //       ) {
// //         setOpenPopup(null);
// //       }
// //     }
// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => document.removeEventListener("mousedown", handleClickOutside);
// //   }, []);

// //   const isActive = (path: string) => pathname === path;

// //   const navClass = (path: string) =>
// //     `w-full flex items-center gap-3 py-3 rounded-lg font-semibold transition-all duration-200
// //      ${sidebarOpen ? "px-4" : "px-0 justify-center"}
// //      ${
// //        isActive(path)
// //          ? "bg-gray-200/60 text-gray-700"
// //          : "text-gray-700 hover:bg-gray-100"
// //      }`;

// //   const handleLogout = async () => {
// //     try {
// //       const refreshToken = localStorage.getItem("refreshToken");

// //       // Revoke refresh token on server
// //       await api.post("/auth/logout", { refreshToken });
// //     } catch {
// //       // Even if API fails, still clear local storage and redirect
// //     } finally {
// //       localStorage.clear();
// //       router.push("/auth");
// //     }
// //   };

// //   return (
// //     <aside
// //       className={`${
// //         sidebarOpen ? "w-65" : "w-[72px]"
// //       } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col relative`}
// //     >
// //       {/* HEADER */}
// //       <div className="p-4 border-b border-gray-200">
// //         <div className="flex items-center justify-between">
// //           {sidebarOpen && (
// //             <div className="flex items-center gap-2">
// //               <span className="font-bold text-gray-900">AuditProRx</span>
// //             </div>
// //           )}
// //           <button
// //             onClick={() => setSidebarOpen(!sidebarOpen)}
// //             className="p-1 hover:bg-gray-100 rounded translate-x-2"
// //           >
// //             {sidebarOpen ? (
// //               <ChevronLeft className="w-5 h-5 text-gray-600" />
// //             ) : (
// //               <ChevronRight className="w-5 h-5 text-gray-600" />
// //             )}
// //           </button>
// //         </div>
// //       </div>

// //       {/* NAVIGATION */}
// //       <nav className="flex-1 p-4 space-y-2">
// //         <Link href="/Mainpage" className={navClass("/Mainpage")}>
// //           <Layers className="w-5 h-5" />
// //           {sidebarOpen && <span className="ml-3">Start Audit</span>}
// //         </Link>

// //         <Link href="/ReportsPage" className={navClass("/ReportsPage")}>
// //           <FileText className="w-5 h-5" />
// //           {sidebarOpen && <span className="ml-3">Reports</span>}
// //         </Link>

// //         <Link href="/bin-search" className={navClass("/bin-search")}>
// //           <Search className="w-5 h-5" />
// //           {sidebarOpen && <span className="ml-3">Bin Search</span>}
// //         </Link>

// //         {/* Was: Tickets — now Drug Lookup */}
// // <Link href="/DrugLookup" className={navClass("/DrugLookup")}>
// //   <Pill className="w-5 h-5" />
// //   {sidebarOpen && <span className="ml-3">Drug Lookup</span>}
// // </Link>

        

// //         <Link href="/how-to" className={navClass("/how-to")}>
// //           <HelpCircle className="w-5 h-5" />
// //           {sidebarOpen && <span className="ml-3">How To</span>}
// //         </Link>
// //       </nav>

// //       {/* BOTTOM */}
// //       <div className="border-t border-gray-200 p-4 space-y-2 " ref={bottomRef}>
// //         {/* ── Customer Support ───────────────────────────────────────── */}
// //         <div className="relative">
// //           <button
// //             onClick={() => toggle("support")}
// //             className={`w-full flex items-center gap-3 py-3 rounded-lg font-semibold transition-all duration-200 ${
// //               sidebarOpen ? "px-4" : "px-0 justify-center"
// //             } ${
// //               openPopup === "support"
// //                 ? "bg-gray-200/60 text-gray-700"
// //                 : "text-gray-700 hover:bg-gray-100"
// //             }`}
// //           >
// //             <LifeBuoy className="w-5 h-5 shrink-0" />
// //             {sidebarOpen && (
// //               <>
// //                 <span className="flex-1 text-left ml-3">Customer Support</span>
// //                 <ChevronRight className="w-4 h-4" />
// //               </>
// //             )}
// //           </button>

// //           {openPopup === "support" && sidebarOpen && (
// //             <div className="absolute left-full ml-2 bottom-0 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
// //               <div className="p-4">
// //                 <div className="flex items-center justify-between mb-4">
// //                   <h3 className="font-semibold text-gray-900">
// //                     Contact Support
// //                   </h3>
// //                   <button
// //                     onClick={() => setOpenPopup(null)}
// //                     className="text-gray-400 hover:text-gray-600"
// //                   >
// //                     <X className="w-4 h-4" />
// //                   </button>
// //                 </div>
// //                 <div className="space-y-3">
// //                   {/* <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
// //                     <div className="flex items-center gap-3">
// //                       <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
// //                         <LifeBuoy className="w-5 h-5 text-green-700" />
// //                       </div>
// //                       <div>
// //                         <div className="text-sm font-medium text-gray-900">
// //                           Fahad Mulla
// //                         </div>
// //                         <div className="text-sm text-gray-600">
// //                           +1 (551) 229-6466
// //                         </div>
// //                       </div>
// //                     </div>
// //                     <a
// //                       href="tel:+15512296466"
// //                       className="p-2 hover:bg-white rounded-full transition-colors"
// //                     >
// //                       <Phone className="w-5 h-5 text-green-700" />
// //                     </a>
// //                   </div> */}
// //                   <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
// //                     <div className="flex items-center gap-3">
// //                       <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
// //                         <User className="w-5 h-5 text-gray-600" />
// //                       </div>
// //                       <div>
// //                         <div className="text-sm font-medium text-gray-900">
// //                           Fahad Mulla
// //                         </div>
// //                         <div className="text-sm text-gray-600">
// //                           +1 (551) 229-6466
// //                         </div>
// //                       </div>
// //                     </div>
// //                     <a
// //                       href="tel:+15512296466"
// //                       className="p-2 hover:bg-white rounded-full transition-colors"
// //                     >
// //                       <Phone className="w-5 h-5 text-gray-600" />
// //                     </a>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           )}
// //         </div>

// //         {/* ── Account Name ───────────────────────────────────────────── */}
// //         <div className="relative">
// //           <button
// //             onClick={() => toggle("account")}
// //             className={`w-full flex items-center gap-3 py-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 ${
// //               sidebarOpen ? "px-3" : "px-0 justify-center"
// //             }`}
// //           >
// //             <User className="w-5 h-5 text-gray-700 shrink-0" />
// //             {sidebarOpen && (
// //               <>
// //                 <div className="flex-1 text-left ml-3">
// //                   <div className="text-sm font-semibold text-gray-900">
// //                     Account Name
// //                   </div>
// //                   <div className="text-xs text-gray-500 truncate">
// //                     {accountName}
// //                   </div>
// //                 </div>
// //                 <ChevronRight className="w-4 h-4 text-gray-400" />
// //               </>
// //             )}
// //           </button>

// //           {openPopup === "account" && sidebarOpen && (
// //             <div className="absolute left-full ml-2 bottom-0 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-3">
// //               <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100">
// //                 <span className="text-sm font-semibold text-gray-900">
// //                   {accountName}
// //                 </span>
// //                 <div className="w-6 h-6 rounded-full border-2 border-green-600 flex items-center justify-center shrink-0 ml-2">
// //                   <svg
// //                     className="w-3.5 h-3.5 text-green-600"
// //                     fill="none"
// //                     viewBox="0 0 24 24"
// //                     stroke="currentColor"
// //                     strokeWidth={3}
// //                   >
// //                     <path
// //                       strokeLinecap="round"
// //                       strokeLinejoin="round"
// //                       d="M5 13l4 4L19 7"
// //                     />
// //                   </svg>
// //                 </div>
// //               </div>
// //             </div>
// //           )}
// //         </div>

// //         {/* ── Settings ───────────────────────────────────────────────── */}
// //         <div className="relative">
// //           <button
// //             onClick={() => toggle("settings")}
// //             className={`w-full flex items-center gap-3 py-3 rounded-lg font-semibold transition-all duration-200 ${
// //               sidebarOpen ? "px-4" : "px-0 justify-center"
// //             } ${
// //               openPopup === "settings"
// //                 ? "bg-gray-100 text-gray-900"
// //                 : "text-gray-700 hover:bg-gray-100"
// //             }`}
// //           >
// //             <Settings className="w-5 h-5 shrink-0" />
// //             {sidebarOpen && (
// //               <>
// //                 <span className="flex-1 text-left ml-3">Settings</span>
// //                 <ChevronRight className="w-4 h-4 text-gray-400" />
// //               </>
// //             )}
// //           </button>

// //           {openPopup === "settings" && sidebarOpen && (
// //             <div className="absolute left-full ml-2 bottom-0 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
// //               <Link
// //                 href="/settings"
// //                 className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
// //                 onClick={() => setOpenPopup(null)}
// //               >
// //                 <Settings className="w-4 h-4" />
// //                 <span className="font-medium">Settings</span>
// //               </Link>
// //               <button
// //                 onClick={() => {
// //                   setOpenPopup(null);
// //                   handleLogout();
// //                 }}
// //                 className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
// //               >
// //                 <svg
// //                   className="w-4 h-4"
// //                   fill="none"
// //                   viewBox="0 0 24 24"
// //                   stroke="currentColor"
// //                 >
// //                   <path
// //                     strokeLinecap="round"
// //                     strokeLinejoin="round"
// //                     strokeWidth={2}
// //                     d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
// //                   />
// //                 </svg>
// //                 <span className="font-medium">Logout</span>
// //               </button>
// //             </div>
// //           )}
// //         </div>

// //         {/* ── Hard Refresh ───────────────────────────────────────────── */}
// //         <button
// //           onClick={() => window.location.reload()}
// //           className={`w-full flex items-center gap-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold transition-all duration-200 ${
// //             sidebarOpen ? "px-4" : "px-0 justify-center"
// //           }`}
// //         >
// //           <RefreshCw className="w-5 h-5 shrink-0" />
// //           {sidebarOpen && <span className="ml-3">Hard Refresh</span>}
// //         </button>

// //         {/* ── Version ───────────────────────────────────────────── */}
// //         <div
// //           className={`flex items-center gap-3 py-2 ${sidebarOpen ? "px-4" : "px-0 justify-center"}`}
// //         >
// //           <GitBranch className="w-5 h-5 text-gray-900 shrink-0" />
// //           {sidebarOpen && (
// //             <span className="text-sm font-semibold text-gray-900 ml-3">
// //               Version 1.2
// //             </span>
// //           )}
// //         </div>
// //       </div>
// //     </aside>
// //   );
// // }


// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import Link from "next/link";
// import { usePathname } from "next/navigation";
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
// } from "lucide-react";
// import axios from "axios";
// import api from "@/lib/api";
// import { useRouter } from "next/navigation";

// interface SidebarProps {
//   sidebarOpen: boolean;
//   setSidebarOpen: (value: boolean) => void;
//   activePanel: string | null;
//   setActivePanel: (value: string | null) => void;
// }

// type Popup = "support" | "account" | "settings" | null;

// export default function Sidebar({
//   sidebarOpen,
//   setSidebarOpen,
//   activePanel,
//   setActivePanel,
// }: SidebarProps) {
//   const router = useRouter();

//   const pathname = usePathname();
//   const [showSupportPopup, setShowSupportPopup] = useState(false);
//   const [showAccountDropdown, setShowAccountDropdown] = useState(false);
//   const [accountName, setAccountName] = useState("...");
//   const supportRef = useRef<HTMLDivElement>(null);
//   const accountRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const pharmacy = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");

//         const res = await api.get("/auth/pharmacy-details", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         console.log(res.data);
//         localStorage.setItem(
//           "pharmacyName",
//           res?.data?.pharmacy?.pharmacy_name,
//         );
//         localStorage.setItem(
//           "pharmacyNameFor",
//           localStorage.getItem("userEmail") || "",
//         );
//         setAccountName(res?.data?.pharmacy?.pharmacy_name || "Account Name");
//       } catch (err) {
//         console.log("error");
//         setAccountName(localStorage.getItem("pharmacyName") || "Account Name");
//       }
//     };
//     const cachedEmail = localStorage.getItem("userEmail");
//     const cachedPharmacyFor = localStorage.getItem("pharmacyNameFor");
//     const cached = localStorage.getItem("pharmacyName");

//     if (cached && cachedPharmacyFor === cachedEmail) {
//       setAccountName(cached);
//     } else {
//       localStorage.removeItem("pharmacyName");
//       localStorage.removeItem("pharmacyNameFor");
//     }
//     pharmacy();
//   }, []);

//   const [openPopup, setOpenPopup] = useState<Popup>(null);
//   const bottomRef = useRef<HTMLDivElement>(null);

//   const toggle = (name: Popup) =>
//     setOpenPopup((prev) => (prev === name ? null : name));

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
//     `w-full flex items-center gap-3 py-3 rounded-lg font-semibold transition-all duration-200
//      ${sidebarOpen ? "px-4" : "px-0 justify-center"}
//      ${
//        isActive(path)
//          ? "bg-gray-200/60 text-gray-700"
//          : "text-gray-700 hover:bg-gray-100"
//      }`;

//   const handleLogout = async () => {
//     try {
//       const refreshToken = localStorage.getItem("refreshToken");

//       // Revoke refresh token on server
//       await api.post("/auth/logout", { refreshToken });
//     } catch {
//       // Even if API fails, still clear local storage and redirect
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
//             <div className="flex items-center gap-2">
//               <span className="font-bold text-gray-900">AuditProRx</span>
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
//           {sidebarOpen && <span className="ml-3">Start Audit</span>}
//         </Link>

//         <Link href="/ReportsPage" className={navClass("/ReportsPage")}>
//           <FileText className="w-5 h-5" />
//           {sidebarOpen && <span className="ml-3">Reports</span>}
//         </Link>

//         <Link href="/bin-search" className={navClass("/bin-search")}>
//           <Search className="w-5 h-5" />
//           {sidebarOpen && <span className="ml-3">Bin Search</span>}
//         </Link>

//         {/* Was: Tickets — now Drug Lookup */}
// <Link href="/DrugLookup" className={navClass("/DrugLookup")}>
//   <Pill className="w-5 h-5" />
//   {sidebarOpen && <span className="ml-3">Drug Lookup</span>}
// </Link>

        

//         <Link href="/how-to" className={navClass("/how-to")}>
//           <HelpCircle className="w-5 h-5" />
//           {sidebarOpen && <span className="ml-3">How To</span>}
//         </Link>
//       </nav>

//       {/* BOTTOM */}
//       <div className="border-t border-gray-200 p-4 space-y-2 " ref={bottomRef}>
//         {/* ── Customer Support ───────────────────────────────────────── */}
//         <div className="relative">
//           <button
//             onClick={() => toggle("support")}
//             className={`w-full flex items-center gap-3 py-3 rounded-lg font-semibold transition-all duration-200 ${
//               sidebarOpen ? "px-4" : "px-0 justify-center"
//             } ${
//               openPopup === "support"
//                 ? "bg-gray-200/60 text-gray-700"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`}
//           >
//             <LifeBuoy className="w-5 h-5 shrink-0" />
//             {sidebarOpen && (
//               <>
//                 <span className="flex-1 text-left ml-3">Customer Support</span>
//                 <ChevronRight className="w-4 h-4" />
//               </>
//             )}
//           </button>

//           {openPopup === "support" && sidebarOpen && (
//             <div className="absolute left-full ml-2 bottom-0 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
//               <div className="p-4">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold text-gray-900">
//                     Contact Support
//                   </h3>
//                   <button
//                     onClick={() => setOpenPopup(null)}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
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
//   <div className="flex items-center gap-3">
//     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//       <User className="w-5 h-5 text-green-700" />
//     </div>
//     <div>
//       <div className="text-sm font-medium text-gray-900">
//         Fahad Mulla
//       </div>
//       <div className="text-sm text-gray-600">
//         +1 (551) 229-6466
//       </div>
//     </div>
//   </div>
//                     <a
//                       href="https://wa.me/15512296466?text=Hi%20Fahad%2C%20I%20need%20help%20with%20AuditProRx"
//     target="_blank"
//     rel="noopener noreferrer"
//     title="Chat on WhatsApp"
//     className="p-2 hover:bg-white rounded-full transition-colors"
//                     >
//                       <MessageCircle className="w-5 h-5 text-green-600" />
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ── Account Name ───────────────────────────────────────────── */}
//         <div className="relative">
//           <button
//             onClick={() => toggle("account")}
//             className={`w-full flex items-center gap-3 py-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 ${
//               sidebarOpen ? "px-3" : "px-0 justify-center"
//             }`}
//           >
//             <User className="w-5 h-5 text-gray-700 shrink-0" />
//             {sidebarOpen && (
//               <>
//                 <div className="flex-1 text-left ml-3">
//                   <div className="text-sm font-semibold text-gray-900">
//                     Account Name
//                   </div>
//                   <div className="text-xs text-gray-500 truncate">
//                     {accountName}
//                   </div>
//                 </div>
//                 <ChevronRight className="w-4 h-4 text-gray-400" />
//               </>
//             )}
//           </button>

//           {openPopup === "account" && sidebarOpen && (
//             <div className="absolute left-full ml-2 bottom-0 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-3">
//               <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100">
//                 <span className="text-sm font-semibold text-gray-900">
//                   {accountName}
//                 </span>
//                 <div className="w-6 h-6 rounded-full border-2 border-green-600 flex items-center justify-center shrink-0 ml-2">
//                   <svg
//                     className="w-3.5 h-3.5 text-green-600"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth={3}
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ── Settings ───────────────────────────────────────────────── */}
//         <div className="relative">
//           <button
//             onClick={() => toggle("settings")}
//             className={`w-full flex items-center gap-3 py-3 rounded-lg font-semibold transition-all duration-200 ${
//               sidebarOpen ? "px-4" : "px-0 justify-center"
//             } ${
//               openPopup === "settings"
//                 ? "bg-gray-100 text-gray-900"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`}
//           >
//             <Settings className="w-5 h-5 shrink-0" />
//             {sidebarOpen && (
//               <>
//                 <span className="flex-1 text-left ml-3">Settings</span>
//                 <ChevronRight className="w-4 h-4 text-gray-400" />
//               </>
//             )}
//           </button>

//           {openPopup === "settings" && sidebarOpen && (
//             <div className="absolute left-full ml-2 bottom-0 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
//               <Link
//                 href="/settings"
//                 className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                 onClick={() => setOpenPopup(null)}
//               >
//                 <Settings className="w-4 h-4" />
//                 <span className="font-medium">Settings</span>
//               </Link>
//               <button
//                 onClick={() => {
//                   setOpenPopup(null);
//                   handleLogout();
//                 }}
//                 className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
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
//                 <span className="font-medium">Logout</span>
//               </button>
//             </div>
//           )}
//         </div>

//         {/* ── Hard Refresh ───────────────────────────────────────────── */}
//         <button
//           onClick={() => window.location.reload()}
//           className={`w-full flex items-center gap-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold transition-all duration-200 ${
//             sidebarOpen ? "px-4" : "px-0 justify-center"
//           }`}
//         >
//           <RefreshCw className="w-5 h-5 shrink-0" />
//           {sidebarOpen && <span className="ml-3">Hard Refresh</span>}
//         </button>

//         {/* ── Version ───────────────────────────────────────────── */}
//         <div
//           className={`flex items-center gap-3 py-2 ${sidebarOpen ? "px-4" : "px-0 justify-center"}`}
//         >
//           <GitBranch className="w-5 h-5 text-gray-900 shrink-0" />
//           {sidebarOpen && (
//             <span className="text-sm font-semibold text-gray-900 ml-3">
//               Version 1.2
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
// import { usePathname } from "next/navigation";
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
// } from "lucide-react";
// import axios from "axios";
// import api from "@/lib/api";
// import { useRouter } from "next/navigation";

// interface SidebarProps {
//   sidebarOpen: boolean;
//   setSidebarOpen: (value: boolean) => void;
//   activePanel: string | null;
//   setActivePanel: (value: string | null) => void;
// }

// type Popup = "support" | "account" | "settings" | null;

// export default function Sidebar({
//   sidebarOpen,
//   setSidebarOpen,
//   activePanel,
//   setActivePanel,
// }: SidebarProps) {
//   const router = useRouter();

//   const pathname = usePathname();
//   const [showSupportPopup, setShowSupportPopup] = useState(false);
//   const [showAccountDropdown, setShowAccountDropdown] = useState(false);
//   const [accountName, setAccountName] = useState("...");
//   const supportRef = useRef<HTMLDivElement>(null);
//   const accountRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const pharmacy = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");

//         const res = await api.get("/auth/pharmacy-details", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         console.log(res.data);
//         localStorage.setItem(
//           "pharmacyName",
//           res?.data?.pharmacy?.pharmacy_name,
//         );
//         localStorage.setItem(
//           "pharmacyNameFor",
//           localStorage.getItem("userEmail") || "",
//         );
//         setAccountName(res?.data?.pharmacy?.pharmacy_name || "Account Name");
//       } catch (err) {
//         console.log("error");
//         setAccountName(localStorage.getItem("pharmacyName") || "Account Name");
//       }
//     };
//     const cachedEmail = localStorage.getItem("userEmail");
//     const cachedPharmacyFor = localStorage.getItem("pharmacyNameFor");
//     const cached = localStorage.getItem("pharmacyName");

//     if (cached && cachedPharmacyFor === cachedEmail) {
//       setAccountName(cached);
//     } else {
//       localStorage.removeItem("pharmacyName");
//       localStorage.removeItem("pharmacyNameFor");
//     }
//     pharmacy();
//   }, []);

//   const [openPopup, setOpenPopup] = useState<Popup>(null);
//   const bottomRef = useRef<HTMLDivElement>(null);

//   const toggle = (name: Popup) =>
//     setOpenPopup((prev) => (prev === name ? null : name));

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
//     `w-full flex items-center gap-3 py-3 rounded-lg font-semibold transition-all duration-200
//      ${sidebarOpen ? "px-4" : "px-0 justify-center"}
//      ${
//        isActive(path)
//          ? "bg-gray-200/60 text-gray-700"
//          : "text-gray-700 hover:bg-gray-100"
//      }`;

//   const handleLogout = async () => {
//     try {
//       const refreshToken = localStorage.getItem("refreshToken");

//       // Revoke refresh token on server
//       await api.post("/auth/logout", { refreshToken });
//     } catch {
//       // Even if API fails, still clear local storage and redirect
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
//             <div className="flex items-center gap-2">
//               <span className="font-bold text-gray-900">AuditProRx</span>
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
//           {sidebarOpen && <span className="ml-3">Start Audit</span>}
//         </Link>

//         <Link href="/ReportsPage" className={navClass("/ReportsPage")}>
//           <FileText className="w-5 h-5" />
//           {sidebarOpen && <span className="ml-3">Reports</span>}
//         </Link>

//         <Link href="/bin-search" className={navClass("/bin-search")}>
//           <Search className="w-5 h-5" />
//           {sidebarOpen && <span className="ml-3">Bin Search</span>}
//         </Link>

//         {/* Was: Tickets — now Drug Lookup */}
// <Link href="/DrugLookup" className={navClass("/DrugLookup")}>
//   <Pill className="w-5 h-5" />
//   {sidebarOpen && <span className="ml-3">Drug Lookup</span>}
// </Link>

        

//         <Link href="/how-to" className={navClass("/how-to")}>
//           <HelpCircle className="w-5 h-5" />
//           {sidebarOpen && <span className="ml-3">How To</span>}
//         </Link>
//       </nav>

//       {/* BOTTOM */}
//       <div className="border-t border-gray-200 p-4 space-y-2 " ref={bottomRef}>
//         {/* ── Customer Support ───────────────────────────────────────── */}
//         <div className="relative">
//           <button
//             onClick={() => toggle("support")}
//             className={`w-full flex items-center gap-3 py-3 rounded-lg font-semibold transition-all duration-200 ${
//               sidebarOpen ? "px-4" : "px-0 justify-center"
//             } ${
//               openPopup === "support"
//                 ? "bg-gray-200/60 text-gray-700"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`}
//           >
//             <LifeBuoy className="w-5 h-5 shrink-0" />
//             {sidebarOpen && (
//               <>
//                 <span className="flex-1 text-left ml-3">Customer Support</span>
//                 <ChevronRight className="w-4 h-4" />
//               </>
//             )}
//           </button>

//           {openPopup === "support" && sidebarOpen && (
//             <div className="absolute left-full ml-2 bottom-0 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
//               <div className="p-4">
//                 <div className="flex items-center justify-between mb-4">
//                   <h3 className="font-semibold text-gray-900">
//                     Contact Support
//                   </h3>
//                   <button
//                     onClick={() => setOpenPopup(null)}
//                     className="text-gray-400 hover:text-gray-600"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
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
//                       <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
//                         <User className="w-5 h-5 text-gray-600" />
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
//                       <Phone className="w-5 h-5 text-gray-600" />
//                     </a>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ── Account Name ───────────────────────────────────────────── */}
//         <div className="relative">
//           <button
//             onClick={() => toggle("account")}
//             className={`w-full flex items-center gap-3 py-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 ${
//               sidebarOpen ? "px-3" : "px-0 justify-center"
//             }`}
//           >
//             <User className="w-5 h-5 text-gray-700 shrink-0" />
//             {sidebarOpen && (
//               <>
//                 <div className="flex-1 text-left ml-3">
//                   <div className="text-sm font-semibold text-gray-900">
//                     Account Name
//                   </div>
//                   <div className="text-xs text-gray-500 truncate">
//                     {accountName}
//                   </div>
//                 </div>
//                 <ChevronRight className="w-4 h-4 text-gray-400" />
//               </>
//             )}
//           </button>

//           {openPopup === "account" && sidebarOpen && (
//             <div className="absolute left-full ml-2 bottom-0 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-3">
//               <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100">
//                 <span className="text-sm font-semibold text-gray-900">
//                   {accountName}
//                 </span>
//                 <div className="w-6 h-6 rounded-full border-2 border-green-600 flex items-center justify-center shrink-0 ml-2">
//                   <svg
//                     className="w-3.5 h-3.5 text-green-600"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     stroke="currentColor"
//                     strokeWidth={3}
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M5 13l4 4L19 7"
//                     />
//                   </svg>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* ── Settings ───────────────────────────────────────────────── */}
//         <div className="relative">
//           <button
//             onClick={() => toggle("settings")}
//             className={`w-full flex items-center gap-3 py-3 rounded-lg font-semibold transition-all duration-200 ${
//               sidebarOpen ? "px-4" : "px-0 justify-center"
//             } ${
//               openPopup === "settings"
//                 ? "bg-gray-100 text-gray-900"
//                 : "text-gray-700 hover:bg-gray-100"
//             }`}
//           >
//             <Settings className="w-5 h-5 shrink-0" />
//             {sidebarOpen && (
//               <>
//                 <span className="flex-1 text-left ml-3">Settings</span>
//                 <ChevronRight className="w-4 h-4 text-gray-400" />
//               </>
//             )}
//           </button>

//           {openPopup === "settings" && sidebarOpen && (
//             <div className="absolute left-full ml-2 bottom-0 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
//               <Link
//                 href="/settings"
//                 className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
//                 onClick={() => setOpenPopup(null)}
//               >
//                 <Settings className="w-4 h-4" />
//                 <span className="font-medium">Settings</span>
//               </Link>
//               <button
//                 onClick={() => {
//                   setOpenPopup(null);
//                   handleLogout();
//                 }}
//                 className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
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
//                 <span className="font-medium">Logout</span>
//               </button>
//             </div>
//           )}
//         </div>

//         {/* ── Hard Refresh ───────────────────────────────────────────── */}
//         <button
//           onClick={() => window.location.reload()}
//           className={`w-full flex items-center gap-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold transition-all duration-200 ${
//             sidebarOpen ? "px-4" : "px-0 justify-center"
//           }`}
//         >
//           <RefreshCw className="w-5 h-5 shrink-0" />
//           {sidebarOpen && <span className="ml-3">Hard Refresh</span>}
//         </button>

//         {/* ── Version ───────────────────────────────────────────── */}
//         <div
//           className={`flex items-center gap-3 py-2 ${sidebarOpen ? "px-4" : "px-0 justify-center"}`}
//         >
//           <GitBranch className="w-5 h-5 text-gray-900 shrink-0" />
//           {sidebarOpen && (
//             <span className="text-sm font-semibold text-gray-900 ml-3">
//               Version 1.2
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
  Boxes
} from "lucide-react";
import api from "@/lib/api";

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
    `w-full flex items-center gap-3 py-3 rounded-lg font-semibold transition-all duration-200 leading-5
     ${sidebarOpen ? "px-4" : "px-0 justify-center"}
     ${
       isActive(path)
         ? "bg-gray-200/60 text-gray-800"
         : "text-gray-700 hover:bg-gray-100"
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

  return (
    <aside
      className={`${
        sidebarOpen ? "w-65" : "w-[72px]"
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col relative`}
    >
      {/* HEADER */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-3">
              {/* <button className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center bg-white hover:bg-gray-100 transition-colors">
                <UserLock size={16} className="text-gray-700" />
              </button> */}

              <div className="flex flex-col items-center ml-12 leading-tight">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                  AuditProRx
                </span>
                {/* <span className="ml-12 italic text-[12px] font-semibold text-gray-900 tracking-tight">
                  AuditProRx
                </span> */}
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-100 rounded translate-x-2"
          >
            {sidebarOpen ? (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 p-4 space-y-2">
        <Link href="/Mainpage" className={navClass("/Mainpage")}>
          <Layers className="w-5 h-5" />
          {sidebarOpen && <span className="ml-2 text-[14px]">Start Audit</span>}
        </Link>

        <Link href="/ReportsPage" className={navClass("/ReportsPage")}>
          <FileText className="w-5 h-5" />
          {sidebarOpen && <span className="ml-2 text-[14px]">Reports</span>}
        </Link>

        <Link href="/bin-search" className={navClass("/bin-search")}>
          <Search className="w-5 h-5" />
          {sidebarOpen && <span className="ml-2 text-[14px]">Bin Search</span>}
        </Link>

        {/* Was: Tickets — now Drug Lookup */}
<Link href="/DrugLookup" className={navClass("/DrugLookup")}>
  <Pill className="w-5 h-5" />
  {sidebarOpen && <span className="ml-3">Drug Lookup</span>}
</Link>

<Link href="/InventoryView" className={navClass("/InventoryView")}>
  <Boxes className="w-5 h-5" />
  {sidebarOpen && <span className="ml-3">Inventory View</span>}
</Link>

        {/* <Link href="/marketplace" className={navClass("/marketplace")}>
          <Store className="w-5 h-5" />
          {sidebarOpen && (
            <span className="ml-2 text-[14px]">Inventory View</span>
          )}
        </Link> */}
        <Link href="/how-to" className={navClass("/how-to")}>
          <HelpCircle className="w-5 h-5" />
          {sidebarOpen && <span className="ml-2 text-[14px]">How To</span>}
        </Link>
      </nav>

      {/* BOTTOM */}
      <div className="border-t border-gray-200 p-4 space-y-2" ref={bottomRef}>
        {/* SUPPORT */}
        <div className="relative">
          <button
            onClick={() => toggle("support")}
            className={`w-full flex items-center gap-3 py-3 rounded-lg font-semibold transition-all duration-200 ${
              sidebarOpen ? "px-4" : "px-0 justify-center"
            } ${
              openPopup === "support"
                ? "bg-gray-200/60 text-gray-800"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <LifeBuoy className="w-5 h-5" />
            {sidebarOpen && (
              <span className="flex-1 text-left ml-2 text-[14px]">
                Customer Support
              </span>
            )}
          </button>

          {openPopup === "support" && sidebarOpen && (
            <div className="absolute left-full ml-2 bottom-0 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Contact Support
                  </h3>
                  <X
                    className="w-4 h-4 cursor-pointer text-gray-500"
                    onClick={() => setOpenPopup(null)}
                  />
                </div>
                <div className="space-y-3">
                  {/* <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <LifeBuoy className="w-5 h-5 text-green-700" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          Fahad Mulla
                        </div>
                        <div className="text-sm text-gray-600">
                          +1 (551) 229-6466
                        </div>
                      </div>
                    </div>
                    <a
                      href="tel:+15512296466"
                      className="p-2 hover:bg-white rounded-full transition-colors"
                    >
                      <Phone className="w-5 h-5 text-green-700" />
                    </a>
                  </div> */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
      <User className="w-5 h-5 text-green-700" />
    </div>
    <div>
      <div className="text-sm font-medium text-gray-900">
        Fahad Mulla
      </div>
      <div className="text-sm text-gray-600">
        +1 (551) 229-6466
      </div>
    </div>
  </div>
                    <a
                      href="https://wa.me/15512296466?text=Hi%20Fahad%2C%20I%20need%20help%20with%20AuditProRx"
    target="_blank"
    rel="noopener noreferrer"
    title="Chat on WhatsApp"
    className="p-2 hover:bg-white rounded-full transition-colors"
                    >
                      <MessageCircle className="w-5 h-5 text-green-600" />
                    </a>
                  </div>
                  <Phone className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ACCOUNT */}
        <div className="relative">
          <button
            onClick={() => toggle("account")}
            className={`w-full flex items-center gap-3 py-3 rounded-lg border-2 border-gray-200 hover:bg-gray-50 ${
              sidebarOpen ? "px-3" : "justify-center"
            }`}
          >
            <User className="w-5 h-5 text-gray-700" />
            {sidebarOpen && (
              <div className="ml-2">
                <p className="text-xs text-gray-500">Account Name</p>
                <p className="text-sm font-semibold text-gray-900">
                  {accountName}
                </p>
              </div>
            )}
          </button>

          {openPopup === "account" && sidebarOpen && (
            <div className="absolute left-full ml-2 bottom-0 w-64 bg-white border border-gray-200 rounded-lg shadow-xl p-3">
              <p className="text-sm font-semibold">{accountName}</p>
            </div>
          )}
        </div>

        {/* SETTINGS */}
        <div className="relative">
          <button
            onClick={() => toggle("settings")}
            className={`w-full flex items-center gap-3 py-3 rounded-lg font-semibold ${
              sidebarOpen ? "px-4" : "justify-center"
            } hover:bg-gray-100`}
          >
            <Settings className="w-5 h-5" />
            {sidebarOpen && <span className="ml-2 text-[14px]">Settings</span>}
          </button>

          {openPopup === "settings" && sidebarOpen && (
            <div className="absolute left-full ml-2 bottom-0 w-52 bg-white border border-gray-200 rounded-lg shadow-xl">
              <Link
                href="/settings"
                className="block px-4 gap-3 flex flex-col-2 py-3 text-sm hover:bg-gray-50"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left flex flex-col-2 gap-3 px-4 py-3 text-sm border-t hover:bg-gray-50"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* REFRESH */}
        <button
          onClick={() => window.location.reload()}
          className={`w-full flex items-center gap-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold ${
            sidebarOpen ? "px-4" : "justify-center"
          }`}
        >
          <RefreshCw className="w-5 h-5" />
          {sidebarOpen && (
            <span className="ml-2 text-[14px]">Hard Refresh</span>
          )}
        </button>

        {/* VERSION */}
        <div
          className={`flex items-center gap-3 py-2 ${
            sidebarOpen ? "px-4" : "justify-center"
          }`}
        >
          <GitBranch className="w-5 h-5 text-gray-900" />
          {sidebarOpen && (
            <span className="text-sm text-gray-700 ml-2">Version 1.4</span>
          )}
        </div>
      </div>
    </aside>
  );
}
