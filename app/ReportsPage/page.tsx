// "use client";

// import React, { useEffect, useState, Suspense } from "react";
// import axios from "axios";
// import api from "@/lib/api";
// import { Layers, RotateCw, MoreVertical } from "lucide-react";
// import Loading from "./loading";
// import Link from "next/link";
// import Sidebar from "@/components/Sidebar";
// import ProtectedRoute from "@/components/ProtectedRoute";

// interface Report {
//   id: string;
//   auditName: string;
//   status: "Ready" | "Started" | "Completed";
//   inventoryDates: string;
//   wholesalerDates: string;
//   type: "INVENTORY" | "PBM" | "ABERRANT";
//   createdDate: string;
// }

// type FilterType = "all" | "inventory" | "aberrant" | "optum";

// export default function ReportsPage() {
//   const [deleteModal, setDeleteModal] = useState(false);
// const [deletingReportId, setDeletingReportId] = useState<string | null>(null);
// const [deletingReportName, setDeletingReportName] = useState("");
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [reportsData, setReportsData] = useState<Report[]>([]);
//   const [loadingReports, setLoadingReports] = useState(true);
//   const [activePanel, setActivePanel] = useState<string | null>(null);
//   const [activeFilter, setActiveFilter] = useState<FilterType>("all");
//   const [activeMenu, setActiveMenu] = useState<string | null>(null);
//   const [editModal, setEditModal] = useState(false);
//   const [editingReport, setEditingReport] = useState<any>(null);
//   const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
//   const [editForm, setEditForm] = useState({
//     inventory_start_date: "",
//     inventory_end_date: "",
//     wholesaler_start_date: "",
//     wholesaler_end_date: "",
//   });

//   const [pharmacyName, setPharmacyName] = useState("Loading...");

//   useEffect(() => {
//     const name = localStorage.getItem("pharmacyName") || "Loading...";
//     setPharmacyName(name);
//   }, []);

//   const getFilteredReports = () => {
//     switch (activeFilter) {
//       case "inventory":
//         return reportsData.filter((r) => r.type === "INVENTORY");
//       case "aberrant":
//         return reportsData.filter((r) => r.type === "ABERRANT");
//       case "optum":
//         return reportsData.filter((r) => r.type === "PBM");
//       default:
//         return reportsData;
//     }
//   };

//   const handleDelete = async () => {
//   if (!deletingReportId) return;
//   try {
//     await axios.delete(`${process.env.API_BASE_URL}/api/audits/${deletingReportId}`);
//     setReportsData((prev) => prev.filter((r) => r.id !== deletingReportId));
//   } catch (e) {
//     console.error("Delete failed:", e);
//     alert("Delete failed. Check backend logs.");
//   } finally {
//     setDeleteModal(false);
//     setDeletingReportId(null);
//     setDeletingReportName("");
//     setActiveMenu(null);
//   }
// };

//   const handleEdit = (report: Report) => {
//     setEditingReport(report);
//     axios.get(`${process.env.API_BASE_URL}/api/audits/${report.id}`).then((res) => {
//       const a = res.data;
//       setEditForm({
//         inventory_start_date: a.inventory_start_date?.slice(0, 10) ?? "",
//         inventory_end_date: a.inventory_end_date?.slice(0, 10) ?? "",
//         wholesaler_start_date: a.wholesaler_start_date?.slice(0, 10) ?? "",
//         wholesaler_end_date: a.wholesaler_end_date?.slice(0, 10) ?? "",
//       });
//     });
//     setEditModal(true);
//     setActiveMenu(null);
//   };

//   const handleEditSave = async () => {
//     if (!editingReport) return;
//     try {
//       await axios.patch(
//         `${process.env.API_BASE_URL}/api/audits/${editingReport.id}/dates`,
//         editForm,
//       );
//       setReportsData((prev) =>
//         prev.map((r) =>
//           r.id === editingReport.id
//             ? {
//                 ...r,
//                 inventoryDates: formatRange(
//                   editForm.inventory_start_date,
//                   editForm.inventory_end_date,
//                 ),
//                 wholesalerDates: formatRange(
//                   editForm.wholesaler_start_date,
//                   editForm.wholesaler_end_date,
//                 ),
//               }
//             : r,
//         ),
//       );
//       setEditModal(false);
//       setEditingReport(null);
//     } catch (e) {
//       console.error("Edit failed:", e);
//       alert("Failed to save. Check backend logs.");
//     }
//   };

//   const formatDate = (d?: string | null) => {
//     if (!d) return "-";
//     const dt = new Date(d);
//     return dt.toLocaleDateString("en-US", {
//       month: "2-digit",
//       day: "2-digit",
//       year: "numeric",
//     });
//   };

//   const formatRange = (start?: string | null, end?: string | null) => {
//     if (!start || !end) return "-";
//     return `${formatDate(start)} - ${formatDate(end)}`;
//   };

//   const mapStatus = (s?: string | null): Report["status"] => {
//   const v = (s || "").toLowerCase();
//   if (v === "ready") return "Ready";
//   if (v === "started") return "Started";
//   return "Started";
// };

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoadingReports(true);
//         const res = await api.get("/api/audits");

//         const rows = res.data as any[];
//         const mapped: Report[] = rows.map((a) => ({
//           id: a.id,
//           auditName: a.name,
//           status: mapStatus(a.status),
//           inventoryDates: formatRange(
//             a.inventory_start_date,
//             a.inventory_end_date,
//           ),
//           wholesalerDates: formatRange(
//             a.wholesaler_start_date,
//             a.wholesaler_end_date,
//           ),
//           type: "INVENTORY",
//           createdDate: formatDate(a.created_at),
//         }));
//         setReportsData(mapped);
//       } catch (e) {
//         console.error("Failed to load reports", e);
//         setReportsData([]);
//       } finally {
//         setLoadingReports(false);
//       }
//     };
//     load();
//   }, []);

//   const filteredReports = getFilteredReports();

//   const filterCounts = {
//     all: reportsData.length,
//     inventory: reportsData.filter((r) => r.type === "INVENTORY").length,
//     aberrant: reportsData.filter((r) => r.type === "ABERRANT").length,
//     optum: reportsData.filter((r) => r.type === "PBM").length,
//   };

//   return (
//     <ProtectedRoute>
//       <Suspense fallback={<Loading />}>
//         <div className="flex h-screen bg-white">
//           <Sidebar
//             sidebarOpen={sidebarOpen}
//             setSidebarOpen={setSidebarOpen}
//             activePanel={activePanel}
//             setActivePanel={setActivePanel}
//           />

//           <main className="flex-1 overflow-auto bg-white">
//             <div className="p-8">
//               {/* Header */}
//               <div className="mb-6">
//                 <div className="flex items-center gap-3 mb-1">
//                   <div className="w-14 h-14 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center">
//                     <Layers className="w-7 h-7 text-gray-700" />
//                   </div>
//                   <div></div>
//                 </div>
//                 <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
//                   REPORTS
//                   <RotateCw className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
//                 </h1>
//                 <p className="text-sm text-gray-500">
//                   {pharmacyName} Inventory Reports
//                 </p>
//               </div>

//               {/* Tabs */}
//               <div className="flex justify-end gap-6 -mb-9 -translate-y-13 border-b border-gray-200">
//                 {[
//                   { key: "all", label: "ALL", count: filterCounts.all },
//                   // { key: 'inventory', label: 'INVENTORY', count: filterCounts.inventory },
//                   // { key: 'aberrant', label: 'ABERRANT', count: filterCounts.aberrant },
//                   // { key: 'optum', label: 'OPTUM', count: filterCounts.optum },
//                 ].map((tab) => (
//                   <button
//                     key={tab.key}
//                     onClick={() => setActiveFilter(tab.key as FilterType)}
//                     className={`pb-3 px-2 font-semibold text-xs transition-colors relative ${
//                       activeFilter === tab.key
//                         ? "text-gray-900"
//                         : "text-gray-500 hover:text-gray-700"
//                     }`}
//                   >
//                     <div className="flex items-center gap-2">
//                       <span className="w-5 h-5 bg-white text-gray-700 border-2 border-gray-500 rounded-full flex items-center justify-center text-[10px] font-bold">
//                         {tab.count}
//                       </span>
//                       {tab.label}
//                     </div>
//                     {activeFilter === tab.key && (
//                       <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
//                     )}
//                   </button>
//                 ))}
//               </div>

//               {/* Table */}
//               <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
//                 <table className="w-full">
//                   <thead className="bg-gray-50">
//                     <tr className="border-b border-gray-200">
//                       <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700 w-10"></th>
//                       <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
//                         Audit Name
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
//                         Status
//                       </th>
//                       <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
//                         Inventory Dates
//                       </th>
//                       <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
//                         Wholesaler Dates
//                       </th>
//                       <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
//                         Type
//                       </th>
//                       <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
//                         Created Date
//                       </th>
//                       <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white">
//                     {filteredReports.map((report, index) => (
//                       <tr
//                         key={report.id}
//                         className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
//                           index % 2 === 0 ? "bg-white" : "bg-gray-50/50"
//                         }`}
//                       >
//                         <td className="px-4 py-1.5 text-sm text-gray-500 font-medium">
//                           {index + 1}
//                         </td>
//                         <td className="px-4 py-1.5 text-sm text-gray-900 font-medium">
//                           <Link
//                             href={`/reports/${report.id}`}
//                             className="hover:text-blue-600 hover:underline cursor-pointer transition-colors"
//                           >
//                             {report.auditName}
//                           </Link>
//                         </td>
//                         <td className="px-4 py-2">
//                           <span
//   className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
//     report.status === "Ready"
//       ? "bg-green-100 text-green-700"
//       : "bg-amber-100 text-amber-700"
//   }`}
// >
//   {report.status}
// </span>
//                         </td>
//                         <td className="px-4 py-1.5 text-sm text-gray-600">
//                           {report.inventoryDates}
//                         </td>
//                         <td className="px-4 py-1.5 text-sm text-gray-600">
//                           {report.wholesalerDates}
//                         </td>
//                         <td className="px-4 py-2">
//                           <span
//                             className={`px-2 py-0.5 rounded text-[10px] font-semibold inline-block ${
//                               report.type === "PBM"
//                                 ? "bg-blue-100 text-blue-700 border border-blue-300"
//                                 : "bg-pink-100 text-pink-700 border border-pink-300"
//                             }`}
//                           >
//                             {report.type}
//                           </span>
//                         </td>
//                         <td className="px-4 py-1.5 text-sm text-gray-600">
//                           {report.createdDate}
//                         </td>
//                         <td className="px-4 py-2">
//   <div className="relative">
//     <button
//       onClick={(e) => {
//         if (activeMenu === report.id) {
//           setActiveMenu(null);
//           setMenuPosition(null);
//         } else {
//           const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
//           setMenuPosition({
//             top: rect.bottom + 4,
//             left: rect.right - 176, // 176 = w-44 = 11rem
//           });
//           setActiveMenu(report.id);
//         }
//       }}
//       className="p-1 hover:bg-gray-200 rounded transition-colors"
//     >
//       <MoreVertical className="w-4 h-4 text-gray-600" />
//     </button>
//   </div>
// </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//             {activeMenu && menuPosition && (
//   <>
//     <div className="fixed inset-0 z-40" onClick={() => { setActiveMenu(null); setMenuPosition(null); }} />
//     <div
//       className="fixed w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
//       style={{
//         top: menuPosition.top + 176 > window.innerHeight
//           ? menuPosition.top - 176 - 8
//           : menuPosition.top,
//         left: menuPosition.left,
//       }}
//     >
//       <button
//         onClick={() => {
//           const report = reportsData.find((r) => r.id === activeMenu);
//           if (report) handleEdit(report);
//         }}
//         className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors rounded-t-lg"
//       >
//         Edit
//       </button>
//       <button
//         onClick={() => {
//           const id = activeMenu;
//           setActiveMenu(null);
//           setMenuPosition(null);
//           window.location.href = `/Mainpage?auditId=${id}&step=inventory`;
//         }}
//         className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors"
//       >
//         InventoryFiles
//       </button>
//       <button
//         onClick={() => {
//           const id = activeMenu;
//           setActiveMenu(null);
//           setMenuPosition(null);
//           window.location.href = `/Mainpage?auditId=${id}&step=wholesaler`;
//         }}
//         className="w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50 transition-colors"
//       >
//         SupplierFiles
//       </button>
//       <button
//         onClick={() => {
//           const report = reportsData.find((r) => r.id === activeMenu);
//           if (report) {
//             setDeletingReportId(report.id);
//             setDeletingReportName(report.auditName);
//             setDeleteModal(true);
//           }
//           setActiveMenu(null);
//           setMenuPosition(null);
//         }}
//         className="w-full px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 transition-colors border-t border-gray-200 rounded-b-lg"
//       >
//         Delete
//       </button>
//     </div>
//   </>
// )}
//           </main>
//         </div>

//         {/* Edit Modal */}
//         {editModal && (
//           <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
//               <h2 className="text-base font-bold text-gray-900 mb-1">
//                 Edit Report Dates
//               </h2>
//               <p className="text-xs text-gray-500 mb-4">
//                 {editingReport?.auditName}
//               </p>

//               <div className="space-y-4">
//                 <div>
//                   <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
//                     Inventory Dates
//                   </p>
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className="text-xs text-gray-500 mb-1 block">
//                         Start Date
//                       </label>
//                       <input
//                         type="date"
//                         value={editForm.inventory_start_date}
//                         onChange={(e) =>
//                           setEditForm((prev) => ({
//                             ...prev,
//                             inventory_start_date: e.target.value,
//                           }))
//                         }
//                         className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                     <div>
//                       <label className="text-xs text-gray-500 mb-1 block">
//                         End Date
//                       </label>
//                       <input
//                         type="date"
//                         value={editForm.inventory_end_date}
//                         onChange={(e) =>
//                           setEditForm((prev) => ({
//                             ...prev,
//                             inventory_end_date: e.target.value,
//                           }))
//                         }
//                         className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
//                     Wholesaler Dates
//                   </p>
//                   <div className="grid grid-cols-2 gap-3">
//                     <div>
//                       <label className="text-xs text-gray-500 mb-1 block">
//                         Start Date
//                       </label>
//                       <input
//                         type="date"
//                         value={editForm.wholesaler_start_date}
//                         onChange={(e) =>
//                           setEditForm((prev) => ({
//                             ...prev,
//                             wholesaler_start_date: e.target.value,
//                           }))
//                         }
//                         className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                     <div>
//                       <label className="text-xs text-gray-500 mb-1 block">
//                         End Date
//                       </label>
//                       <input
//                         type="date"
//                         value={editForm.wholesaler_end_date}
//                         onChange={(e) =>
//                           setEditForm((prev) => ({
//                             ...prev,
//                             wholesaler_end_date: e.target.value,
//                           }))
//                         }
//                         className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3 mt-5">
//                 <button
//                   onClick={() => {
//                     setEditModal(false);
//                     setEditingReport(null);
//                   }}
//                   className="px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleEditSave}
//                   className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {deleteModal && (
//   <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm">
//     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 flex flex-col items-center text-center">
//       <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
//         <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
//           <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
//         </svg>
//       </div>
//       <h3 className="text-lg font-bold text-gray-900 mb-1">Delete Report</h3>
//       <p className="text-sm text-gray-500 mb-1">
//         Are you sure you want to delete this report?
//       </p>
//       <p className="text-xs text-gray-400 bg-gray-100 rounded-lg px-3 py-1.5 mb-1 font-semibold truncate max-w-full">
//         {deletingReportName}
//       </p>
//       <p className="text-[11px] text-red-400 mb-5">
//         This will permanently remove all data, files, and records.
//       </p>
//       <div className="flex gap-3 w-full">
//         <button
//           onClick={() => {
//             setDeleteModal(false);
//             setDeletingReportId(null);
//             setDeletingReportName("");
//           }}
//           className="flex-1 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
//         >
//           Cancel
//         </button>
//         <button
//           onClick={handleDelete}
//           className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
//         >
//           Yes, Delete
//         </button>
//       </div>
//     </div>
//   </div>
// )}
//       </Suspense>
//     </ProtectedRoute>
//   );
// }

"use client";

import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import api from "@/lib/api";
import {
  Layers,
  RotateCw,
  MoreVertical,
  FileText,
  Plus,
  Search,
  ChevronDown,
} from "lucide-react";
import Loading from "./loading";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Report {
  id: string;
  auditName: string;
  status: "Ready" | "Started" | "Completed";
  inventoryDates: string;
  wholesalerDates: string;
  type: "INVENTORY" | "PBM" | "ABERRANT";
  createdDate: string;
}

type FilterType = "all" | "inventory" | "aberrant" | "optum";

export default function ReportsPage() {
  const [deleteModal, setDeleteModal] = useState(false);
  const [deletingReportId, setDeletingReportId] = useState<string | null>(null);
  const [deletingReportName, setDeletingReportName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [reportsData, setReportsData] = useState<Report[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [editModal, setEditModal] = useState(false);
  const [editingReport, setEditingReport] = useState<any>(null);
  const [menuPosition, setMenuPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editForm, setEditForm] = useState({
    inventory_start_date: "",
    inventory_end_date: "",
    wholesaler_start_date: "",
    wholesaler_end_date: "",
  });

  const [pharmacyName, setPharmacyName] = useState("Loading...");

  useEffect(() => {
    const name = localStorage.getItem("pharmacyName") || "Loading...";
    setPharmacyName(name);
  }, []);

  const getFilteredReports = () => {
    let reports = reportsData;
    switch (activeFilter) {
      case "inventory":
        reports = reportsData.filter((r) => r.type === "INVENTORY");
        break;
      case "aberrant":
        reports = reportsData.filter((r) => r.type === "ABERRANT");
        break;
      case "optum":
        reports = reportsData.filter((r) => r.type === "PBM");
        break;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      reports = reports.filter((r) => r.auditName.toLowerCase().includes(q));
    }
    return reports;
  };

  const handleDelete = async () => {
    if (!deletingReportId) return;
    try {
      await axios.delete(
        `${process.env.API_BASE_URL}/api/audits/${deletingReportId}`,
      );
      setReportsData((prev) => prev.filter((r) => r.id !== deletingReportId));
    } catch (e) {
      console.error("Delete failed:", e);
      alert("Delete failed. Check backend logs.");
    } finally {
      setDeleteModal(false);
      setDeletingReportId(null);
      setDeletingReportName("");
      setActiveMenu(null);
    }
  };

  const handleEdit = (report: Report) => {
    setEditingReport(report);
    axios
      .get(`${process.env.API_BASE_URL}/api/audits/${report.id}`)
      .then((res) => {
        const a = res.data;
        setEditForm({
          inventory_start_date: a.inventory_start_date?.slice(0, 10) ?? "",
          inventory_end_date: a.inventory_end_date?.slice(0, 10) ?? "",
          wholesaler_start_date: a.wholesaler_start_date?.slice(0, 10) ?? "",
          wholesaler_end_date: a.wholesaler_end_date?.slice(0, 10) ?? "",
        });
        setEditModal(true);
        setActiveMenu(null);
      });
  };

  const handleEditSave = async () => {
    if (!editingReport) return;
    try {
      await axios.patch(
        `${process.env.API_BASE_URL}/api/audits/${editingReport.id}/dates`,
        editForm,
      );
      setReportsData((prev) =>
        prev.map((r) =>
          r.id === editingReport.id
            ? {
                ...r,
                inventoryDates: formatRange(
                  editForm.inventory_start_date,
                  editForm.inventory_end_date,
                ),
                wholesalerDates: formatRange(
                  editForm.wholesaler_start_date,
                  editForm.wholesaler_end_date,
                ),
              }
            : r,
        ),
      );
      setEditModal(false);
      setEditingReport(null);
    } catch (e) {
      console.error("Edit failed:", e);
      alert("Failed to save. Check backend logs.");
    }
  };

  const formatDate = (d?: string | null) => {
    if (!d) return "-";
    const dt = new Date(d);
    return dt.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const formatRange = (start?: string | null, end?: string | null) => {
    if (!start || !end) return "-";
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  const mapStatus = (s?: string | null): Report["status"] => {
    const v = (s || "").toLowerCase();
    if (v === "ready") return "Ready";
    if (v === "started") return "Started";
    return "Started";
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingReports(true);
        const res = await api.get("/api/audits");

        const rows = res.data as any[];
        const mapped: Report[] = rows.map((a) => ({
          id: a.id,
          auditName: a.name,
          status: mapStatus(a.status),
          inventoryDates: formatRange(
            a.inventory_start_date,
            a.inventory_end_date,
          ),
          wholesalerDates: formatRange(
            a.wholesaler_start_date,
            a.wholesaler_end_date,
          ),
          type: "INVENTORY",
          createdDate: formatDate(a.created_at),
        }));
        setReportsData(mapped);
      } catch (e) {
        console.error("Failed to load reports", e);
        setReportsData([]);
      } finally {
        setLoadingReports(false);
      }
    };
    load();
  }, []);

  const filteredReports = getFilteredReports();

  const filterCounts = {
    all: reportsData.length,
    inventory: reportsData.filter((r) => r.type === "INVENTORY").length,
    aberrant: reportsData.filter((r) => r.type === "ABERRANT").length,
    optum: reportsData.filter((r) => r.type === "PBM").length,
  };

  const readyCount = reportsData.filter((r) => r.status === "Ready").length;
  const startedCount = reportsData.filter((r) => r.status === "Started").length;

  return (
    <ProtectedRoute role="user">
      <Suspense fallback={<Loading />}>
        <div className="flex h-screen bg-slate-50">
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            activePanel={activePanel}
            setActivePanel={setActivePanel}
          />

          <main className="flex-1 overflow-auto">
            {/* ── Header ── */}
            <div className="bg-white border-b border-slate-200">
              <div className="px-8 py-6">
                <div className="flex items-center justify-between">
                  {/* Left: Logo + Title */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center shadow-sm">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                          Reports
                        </h1>
                        <button
                          onClick={() => window.location.reload()}
                          className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Refresh"
                        >
                          <RotateCw className="w-4 h-4 text-slate-400" />
                        </button>
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {pharmacyName}
                      </p>
                    </div>
                  </div>

                  {/* Right: Stats + New Audit */}
                  <div className="flex items-center gap-4">
                    <div className="hidden md:flex items-center gap-3 mr-2">
                      <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-xs font-semibold text-emerald-700">
                          {readyCount} Ready
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-xs font-semibold text-amber-700">
                          {startedCount} In Progress
                        </span>
                      </div>
                    </div>
                    <Link href="/Mainpage">
                      <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
                        <Plus className="w-4 h-4" />
                        New Audit
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* ── Search + Filter Bar ── */}
              <div className="px-8 pb-4 flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search reports..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:bg-white transition-all"
                  />
                </div>
                <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                  {[
                    {
                      key: "all" as FilterType,
                      label: "All",
                      count: filterCounts.all,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveFilter(tab.key)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        activeFilter === tab.key
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {tab.label}
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                          activeFilter === tab.key
                            ? "bg-slate-900 text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Table ── */}
            <div className="px-8 py-6">
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider w-10">
                        #
                      </th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Audit Name
                      </th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Inventory Dates
                      </th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Wholesaler Dates
                      </th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-4 py-3 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider w-20 whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingReports ? (
                      <tr>
                        <td colSpan={8} className="py-16 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin" />
                            <span className="text-sm text-slate-400">
                              Loading reports...
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : filteredReports.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-16 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mb-1">
                              <FileText className="w-5 h-5 text-slate-300" />
                            </div>
                            <p className="text-sm font-semibold text-slate-500">
                              No reports found
                            </p>
                            <p className="text-xs text-slate-400">
                              {searchQuery
                                ? "Try a different search term"
                                : "Create a new audit to get started"}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredReports.map((report, index) => (
                        <tr
                          key={report.id}
                          className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors group"
                        >
                          <td className="px-4 py-3 text-xs text-slate-400 font-medium">
                            {index + 1}
                          </td>
                          <td className="px-4 py-3">
                            <Link
                              href={`/reports/${report.id}`}
                              className="text-sm font-semibold text-slate-800 hover:text-blue-600 transition-colors"
                            >
                              {report.auditName}
                            </Link>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
                                report.status === "Ready"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  report.status === "Ready"
                                    ? "bg-emerald-500"
                                    : "bg-amber-500"
                                }`}
                              />
                              {report.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-600 font-medium">
                            {report.inventoryDates}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-600 font-medium">
                            {report.wholesalerDates}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded">
                              {report.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">
                            {report.createdDate}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={(e) => {
                                if (activeMenu === report.id) {
                                  setActiveMenu(null);
                                  setMenuPosition(null);
                                } else {
                                  const rect = (
                                    e.currentTarget as HTMLElement
                                  ).getBoundingClientRect();
                                  setMenuPosition({
                                    top: rect.bottom + 4,
                                    left: rect.right - 176,
                                  });
                                  setActiveMenu(report.id);
                                }
                              }}
                              className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                              <MoreVertical className="w-4 h-4 text-slate-500" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>

                {/* Footer */}
                {filteredReports.length > 0 && (
                  <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Showing{" "}
                      <b className="text-slate-700">{filteredReports.length}</b>{" "}
                      of <b className="text-slate-700">{reportsData.length}</b>{" "}
                      reports
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Context Menu */}
            {activeMenu && menuPosition && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => {
                    setActiveMenu(null);
                    setMenuPosition(null);
                  }}
                />
                <div
                  className="fixed w-44 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden"
                  style={{
                    top:
                      menuPosition.top + 176 > window.innerHeight
                        ? menuPosition.top - 176 - 8
                        : menuPosition.top,
                    left: menuPosition.left,
                  }}
                >
                  <button
                    onClick={() => {
                      const report = reportsData.find(
                        (r) => r.id === activeMenu,
                      );
                      if (report) handleEdit(report);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Edit Dates
                  </button>
                  <button
                    onClick={() => {
                      const id = activeMenu;
                      setActiveMenu(null);
                      setMenuPosition(null);
                      window.location.href = `/Mainpage?auditId=${id}&step=inventory`;
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Inventory Files
                  </button>
                  <button
                    onClick={() => {
                      const id = activeMenu;
                      setActiveMenu(null);
                      setMenuPosition(null);
                      window.location.href = `/Mainpage?auditId=${id}&step=wholesaler`;
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Supplier Files
                  </button>
                  <div className="border-t border-slate-100" />
                  <button
                    onClick={() => {
                      const report = reportsData.find(
                        (r) => r.id === activeMenu,
                      );
                      if (report) {
                        setDeletingReportId(report.id);
                        setDeletingReportName(report.auditName);
                        setDeleteModal(true);
                      }
                      setActiveMenu(null);
                      setMenuPosition(null);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </main>
        </div>

        {/* Edit Modal */}
        {editModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
              <h2 className="text-base font-bold text-slate-900 mb-1">
                Edit Report Dates
              </h2>
              <p className="text-xs text-slate-500 mb-5">
                {editingReport?.auditName}
              </p>

              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Inventory Dates
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">
                        Start
                      </label>
                      <input
                        type="date"
                        value={editForm.inventory_start_date}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            inventory_start_date: e.target.value,
                          }))
                        }
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">
                        End
                      </label>
                      <input
                        type="date"
                        value={editForm.inventory_end_date}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            inventory_end_date: e.target.value,
                          }))
                        }
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-300"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Wholesaler Dates
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">
                        Start
                      </label>
                      <input
                        type="date"
                        value={editForm.wholesaler_start_date}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            wholesaler_start_date: e.target.value,
                          }))
                        }
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-300"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 mb-1 block">
                        End
                      </label>
                      <input
                        type="date"
                        value={editForm.wholesaler_end_date}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            wholesaler_end_date: e.target.value,
                          }))
                        }
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-slate-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => {
                    setEditModal(false);
                    setEditingReport(null);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                Delete Report
              </h3>
              <p className="text-sm text-slate-500 mb-1">
                Are you sure you want to delete this report?
              </p>
              <p className="text-xs text-slate-400 bg-slate-100 rounded-lg px-3 py-1.5 mb-1 font-semibold truncate max-w-full">
                {deletingReportName}
              </p>
              <p className="text-[11px] text-red-400 mb-5">
                This will permanently remove all data, files, and records.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    setDeleteModal(false);
                    setDeletingReportId(null);
                    setDeletingReportName("");
                  }}
                  className="flex-1 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </Suspense>
    </ProtectedRoute>
  );
}
