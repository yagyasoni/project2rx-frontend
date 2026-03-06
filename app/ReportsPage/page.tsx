'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { ChevronLeft, ChevronRight, Layers, RotateCw, MoreVertical, LifeBuoy, User, RefreshCw, Settings, HelpCircle, Ticket, Search, FileText } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Loading from './loading'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'


interface Report {
  id: string
  auditName: string
  status: 'Ready' | 'Started' | 'Completed'
  inventoryDates: string
  wholesalerDates: string
  type: 'INVENTORY' | 'PBM' | 'ABERRANT'  
  createdDate: string
}



type FilterType = 'all' | 'inventory' | 'aberrant' | 'optum'

export default function ReportsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [reportsData, setReportsData] = useState<Report[]>([])
const [loadingReports, setLoadingReports] = useState(true)
  const [activePanel, setActivePanel] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [activeMenu, setActiveMenu] = useState<number | null>(null)
  const [editModal, setEditModal] = useState(false)
const [editingReport, setEditingReport] = useState<any>(null)
const [editForm, setEditForm] = useState({
  inventory_start_date: '',
  inventory_end_date: '',
  wholesaler_start_date: '',
  wholesaler_end_date: '',
})
  const searchParams = useSearchParams()

  const getFilteredReports = () => {
    switch (activeFilter) {
      case 'inventory':
        return reportsData.filter(r => r.type === 'INVENTORY')
      case 'aberrant':
        return reportsData.filter(r => r.type === 'ABERRANT')
      case 'optum':
        return reportsData.filter(r => r.type === 'PBM')
      default:
        return reportsData
    }
  }

  const handleDelete = async (auditId: string) => {
  const ok = window.confirm("Are you sure you want to delete this report?");
  if (!ok) return;

  try {
    await axios.delete(`http://localhost:5000/api/audits/${auditId}`);

    // Option 1: remove from current state instantly (fast UX)
    setReportsData((prev) => prev.filter((r) => r.id !== auditId));

    // close menu if open
    setActiveMenu(null);
  } catch (e) {
    console.error("Delete failed:", e);
    alert("Delete failed. Check backend logs.");
  }
};

const handleEdit = (report: Report) => {
  setEditingReport(report)
  // fetch raw dates from backend
  axios.get(`http://localhost:5000/api/audits/${report.id}`).then((res) => {
    const a = res.data
    setEditForm({
      inventory_start_date: a.inventory_start_date?.slice(0, 10) ?? '',
      inventory_end_date: a.inventory_end_date?.slice(0, 10) ?? '',
      wholesaler_start_date: a.wholesaler_start_date?.slice(0, 10) ?? '',
      wholesaler_end_date: a.wholesaler_end_date?.slice(0, 10) ?? '',
    })
  })
  setEditModal(true)
  setActiveMenu(null)
}

const handleEditSave = async () => {
  if (!editingReport) return
  try {
    await axios.patch(
  `http://localhost:5000/api/audits/${editingReport.id}/dates`,
  editForm
)
    // Update local state so table reflects changes immediately
    setReportsData((prev) =>
      prev.map((r) =>
        r.id === editingReport.id
          ? {
              ...r,
              inventoryDates: formatRange(
                editForm.inventory_start_date,
                editForm.inventory_end_date
              ),
              wholesalerDates: formatRange(
                editForm.wholesaler_start_date,
                editForm.wholesaler_end_date
              ),
            }
          : r
      )
    )
    setEditModal(false)
    setEditingReport(null)
  } catch (e) {
    console.error('Edit failed:', e)
    alert('Failed to save. Check backend logs.')
  }
}

  const formatDate = (d?: string | null) => {
  if (!d) return '-'
  const dt = new Date(d)
  return dt.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })
}

const formatRange = (start?: string | null, end?: string | null) => {
  if (!start || !end) return '-'
  return `${formatDate(start)} - ${formatDate(end)}`
}

const mapStatus = (s?: string | null): Report['status'] => {
  const v = (s || '').toLowerCase()
  if (v === 'completed') return 'Completed'
  if (v === 'started') return 'Started'
  return 'Ready'
}

useEffect(() => {
  const load = async () => {
    try {
      setLoadingReports(true)

      const res = await axios.get('http://localhost:5000/api/audits')

      const rows = res.data as any[]

      const mapped: Report[] = rows.map((a) => ({
        id: a.id,
        auditName: a.name,
        status: mapStatus(a.status),
        inventoryDates: formatRange(
          a.inventory_start_date,
          a.inventory_end_date
        ),
        wholesalerDates: formatRange(
          a.wholesaler_start_date,
          a.wholesaler_end_date
        ),
        type: 'INVENTORY',
        createdDate: formatDate(a.created_at),
      }))

      setReportsData(mapped)
    } catch (e) {
      console.error('Failed to load reports', e)
      setReportsData([])
    } finally {
      setLoadingReports(false)
    }
  }

  load()
}, [])

  const filteredReports = getFilteredReports()

  const filterCounts = {
    all: reportsData.length,
    inventory: reportsData.filter(r => r.type === 'INVENTORY').length,
    aberrant: reportsData.filter(r => r.type === 'ABERRANT').length,
    optum: reportsData.filter(r => r.type === 'PBM').length,
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex h-screen bg-white">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
        />

        <main className="flex-1 overflow-auto bg-white">
          <div className="p-8">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
                  <Layers className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    REPORTS
                    <RotateCw className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
                  </h1>
                  <p className="text-sm text-gray-500">United Drugs Pharmacy | 507 Central Ave</p>
                </div>
              </div>
            </div>

            {/* Tabs - Right Aligned */}
            <div className="flex justify-end gap-6 -mb-9 -translate-y-13 border-b border-gray-200">
              {[
                { key: 'all', label: 'ALL', count: filterCounts.all },
                { key: 'inventory', label: 'INVENTORY', count: filterCounts.inventory },
                { key: 'aberrant', label: 'ABERRANT', count: filterCounts.aberrant },
                { key: 'optum', label: 'OPTUM', count: filterCounts.optum },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key as FilterType)}
                  className={`pb-3 px-2 font-semibold text-sm transition-colors relative ${
                    activeFilter === tab.key
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-white text-gray-700 border-2 border-gray-500 rounded-full flex items-center justify-center text-xs font-bold">
                      {tab.count}
                    </span>
                    {tab.label}
                  </div>
                  {activeFilter === tab.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
                  )}
                </button>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-16"></th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Audit Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Inventory Dates</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Wholesaler Dates</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Created Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {filteredReports.map((report, index) => (
                    <tr 
                      key={report.id} 
                      className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-4 text-sm text-gray-600 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                        <Link 
                          href={`/reports/${report.id}`}
                          className="hover:text-blue-600 hover:underline cursor-pointer transition-colors"
                        >
                          {report.auditName}
                        </Link>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-sm font-medium ${
                          report.status === 'Started' ? 'text-blue-600' : 'text-green-700'
                        }`}>
                          {report.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{report.inventoryDates}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{report.wholesalerDates}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded-md text-xs font-semibold inline-block ${
                            report.type === 'PBM'
                              ? 'bg-blue-100 text-blue-700 border border-blue-300'
                              : 'bg-pink-100 text-pink-700 border border-pink-300'
                          }`}
                        >
                          {report.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">{report.createdDate}</td>
                      <td className="px-4 py-4">
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenu(activeMenu === report.id ? null : report.id)}
                            className="p-1.5 hover:bg-gray-200 rounded transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                          </button>
                          {activeMenu === report.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              <button
  onClick={() => handleEdit(report)}
  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-t-lg"
>
  Edit
</button>
                              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                InventoryFiles
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                SupplierFiles
                              </button>
                              <button
  onClick={() => handleDelete(report.id)}
  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-200 rounded-b-lg"
>
  Delete
</button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      {/* Edit Modal */}
{editModal && (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-1">Edit Report Dates</h2>
      <p className="text-sm text-gray-500 mb-5">{editingReport?.auditName}</p>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
            Inventory Dates
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
              <input
                type="date"
                value={editForm.inventory_start_date}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, inventory_start_date: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">End Date</label>
              <input
                type="date"
                value={editForm.inventory_end_date}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, inventory_end_date: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
            Wholesaler Dates
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
              <input
                type="date"
                value={editForm.wholesaler_start_date}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, wholesaler_start_date: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">End Date</label>
              <input
                type="date"
                value={editForm.wholesaler_end_date}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, wholesaler_end_date: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => { setEditModal(false); setEditingReport(null) }}
          className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleEditSave}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
)}
    </Suspense>
  )
}

// 'use client'

// import React, { useState } from 'react'
// import { ChevronLeft, ChevronRight, Layers, RotateCw, MoreVertical, LifeBuoy, User, RefreshCw, Settings, HelpCircle, Ticket, Search, FileText } from 'lucide-react'
// import { useSearchParams } from 'next/navigation'
// import { Suspense } from 'react'
// import Loading from './loading'
// import Link from 'next/link'
// import Sidebar from '@/components/Sidebar'


// interface Report {
//   id: number
//   auditName: string
//   status: 'Ready' | 'Started' | 'Completed'
//   inventoryDates: string
//   wholesalerDates: string
//   type: 'INVENTORY' | 'PBM' | 'ABERRANT'  
//   createdDate: string
// }

// const reportsData: Report[] = [
//   {
//     id: 1,
//     auditName: 'test1',
//     status: 'Started',
//     inventoryDates: '02/03/2026 - 02/14/2026',
//     wholesalerDates: '02/03/2026 - 02/14/2026',
//     type: 'INVENTORY',
//     createdDate: '02/02/2026',
//   },
//   {
//     id: 2,
//     auditName: 'SEP 1, 2025 - JAN 26, 2026',
//     status: 'Ready',
//     inventoryDates: '09/01/2025 - 01/26/2026',
//     wholesalerDates: '09/01/2025 - 01/26/2026',
//     type: 'INVENTORY',
//     createdDate: '01/30/2026',
//   },
//   {
//     id: 3,
//     auditName: 'test1',
//     status: 'Started',
//     inventoryDates: '01/01/2026 - 01/24/2026',
//     wholesalerDates: '01/01/2026 - 01/24/2026',
//     type: 'INVENTORY',
//     createdDate: '01/25/2026',
//   },
//   {
//     id: 4,
//     auditName: 'test1',
//     status: 'Started',
//     inventoryDates: '01/01/2026 - 01/31/2026',
//     wholesalerDates: '01/01/2026 - 01/31/2026',
//     type: 'INVENTORY',
//     createdDate: '01/23/2026',
//   },
//   {
//     id: 5,
//     auditName: 'SEPTEMBER 1, 2025 - DEC 31, 2025',
//     status: 'Ready',
//     inventoryDates: '09/01/2025 - 12/31/2025',
//     wholesalerDates: '09/01/2025 - 12/31/2025',
//     type: 'INVENTORY',
//     createdDate: '12/31/2025',
//   },
//   {
//     id: 6,
//     auditName: 'NOVEMBER 2025',
//     status: 'Ready',
//     inventoryDates: '11/01/2024 - 11/24/2025',
//     wholesalerDates: '11/01/2024 - 11/24/2025',
//     type: 'INVENTORY',
//     createdDate: '11/26/2025',
//   },
//   {
//     id: 7,
//     auditName: 'OCT 1, 2024 - OCT 27, 2025',
//     status: 'Ready',
//     inventoryDates: '11/01/2024 - 10/27/2025',
//     wholesalerDates: '11/01/2024 - 10/27/2025',
//     type: 'INVENTORY',
//     createdDate: '10/29/2025',
//   },
//   {
//     id: 8,
//     auditName: 'SEP 1, 2024 - SEP 24 2025',
//     status: 'Ready',
//     inventoryDates: '11/01/2024 - 09/24/2025',
//     wholesalerDates: '11/01/2024 - 09/24/2025',
//     type: 'INVENTORY',
//     createdDate: '09/26/2025',
//   },
//   {
//     id: 9,
//     auditName: 'NOV 1, 2024 - AUG 25, 2025',
//     status: 'Ready',
//     inventoryDates: '11/01/2024 - 08/25/2025',
//     wholesalerDates: '11/01/2024 - 08/25/2025',
//     type: 'INVENTORY',
//     createdDate: '08/29/2025',
//   },
//   {
//     id: 10,
//     auditName: 'April Report',
//     status: 'Ready',
//     inventoryDates: '04/01/2025 - 04/30/2025',
//     wholesalerDates: '04/01/2025 - 04/30/2025',
//     type: 'INVENTORY',
//     createdDate: '05/02/2025',
//   },
//   {
//     id: 11,
//     auditName: 'Nov - March Check',
//     status: 'Ready',
//     inventoryDates: '11/01/2024 - 03/31/2025',
//     wholesalerDates: '11/01/2024 - 03/31/2025',
//     type: 'INVENTORY',
//     createdDate: '04/16/2025',
//   },
//   {
//     id: 12,
//     auditName: '11/1 - 1/31',
//     status: 'Ready',
//     inventoryDates: '11/01/2024 - 01/31/2025',
//     wholesalerDates: '11/01/2024 - 01/31/2025',
//     type: 'INVENTORY',
//     createdDate: '03/31/2025',
//   },
//   {
//     id: 13,
//     auditName: 'Caremark',
//     status: 'Ready',
//     inventoryDates: '11/01/2024 - 01/31/2025',
//     wholesalerDates: '-',
//     type: 'PBM',
//     createdDate: '03/31/2025',
//   },
//   {
//     id: 14,
//     auditName: 'CHECK BIKTARVY',
//     status: 'Ready',
//     inventoryDates: '03/01/2025 - 03/28/2025',
//     wholesalerDates: '03/01/2025 - 03/28/2025',
//     type: 'INVENTORY',
//     createdDate: '03/29/2025',
//   },
// ]

// type FilterType = 'all' | 'inventory' | 'aberrant' | 'optum'

// export default function ReportsPage() {
//   const [sidebarOpen, setSidebarOpen] = useState(true)
//   const [activePanel, setActivePanel] = useState<string | null>(null)
//   const [activeFilter, setActiveFilter] = useState<FilterType>('all')
//   const [activeMenu, setActiveMenu] = useState<number | null>(null)
//   const searchParams = useSearchParams()

//   const getFilteredReports = () => {
//     switch (activeFilter) {
//       case 'inventory':
//         return reportsData.filter(r => r.type === 'INVENTORY')
//       case 'aberrant':
//         return reportsData.filter(r => r.type === 'ABERRANT')
//       case 'optum':
//         return reportsData.filter(r => r.type === 'PBM')
//       default:
//         return reportsData
//     }
//   }

//   const filteredReports = getFilteredReports()

//   const filterCounts = {
//     all: reportsData.length,
//     inventory: reportsData.filter(r => r.type === 'INVENTORY').length,
//     aberrant: reportsData.filter(r => r.type === 'ABERRANT').length,
//     optum: reportsData.filter(r => r.type === 'PBM').length,
//   }

//   return (
//     <Suspense fallback={<Loading />}>
//       <div className="flex h-screen bg-white">
//         <Sidebar
//           sidebarOpen={sidebarOpen}
//           setSidebarOpen={setSidebarOpen}
//           activePanel={activePanel}
//           setActivePanel={setActivePanel}
//         />

//         <main className="flex-1 overflow-auto bg-white">
//           <div className="p-8">
//             {/* Header */}
//             <div className="mb-6">
//               <div className="flex items-center gap-3 mb-1">
//                 <div className="w-12 h-12 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
//                   <Layers className="w-6 h-6 text-gray-700" />
//                 </div>
//                 <div>
//                   <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//                     REPORTS
//                     <RotateCw className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
//                   </h1>
//                   <p className="text-sm text-gray-500">United Drugs Pharmacy | 507 Central Ave</p>
//                 </div>
//               </div>
//             </div>

//             {/* Tabs - Right Aligned */}
//             <div className="flex justify-end gap-6 -mb-9 -translate-y-13 border-b border-gray-200">
//               {[
//                 { key: 'all', label: 'ALL', count: filterCounts.all },
//                 { key: 'inventory', label: 'INVENTORY', count: filterCounts.inventory },
//                 { key: 'aberrant', label: 'ABERRANT', count: filterCounts.aberrant },
//                 { key: 'optum', label: 'OPTUM', count: filterCounts.optum },
//               ].map(tab => (
//                 <button
//                   key={tab.key}
//                   onClick={() => setActiveFilter(tab.key as FilterType)}
//                   className={`pb-3 px-2 font-semibold text-sm transition-colors relative ${
//                     activeFilter === tab.key
//                       ? 'text-gray-900'
//                       : 'text-gray-500 hover:text-gray-700'
//                   }`}
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="w-6 h-6 bg-white text-gray-700 border-2 border-gray-500 rounded-full flex items-center justify-center text-xs font-bold">
//                       {tab.count}
//                     </span>
//                     {tab.label}
//                   </div>
//                   {activeFilter === tab.key && (
//                     <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900" />
//                   )}
//                 </button>
//               ))}
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr className="border-b border-gray-200">
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-16"></th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Audit Name</th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Inventory Dates</th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Wholesaler Dates</th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Created Date</th>
//                     <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white">
//                   {filteredReports.map((report, index) => (
//                     <tr 
//                       key={report.id} 
//                       className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
//                         index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
//                       }`}
//                     >
//                       <td className="px-4 py-4 text-sm text-gray-600 font-medium">
//                         {index + 1}
//                       </td>
//                       <td className="px-4 py-4 text-sm text-gray-900 font-medium">
//                         <Link 
//                           href={`/reports/${report.id}`}
//                           className="hover:text-blue-600 hover:underline cursor-pointer transition-colors"
//                         >
//                           {report.auditName}
//                         </Link>
//                       </td>
//                       <td className="px-4 py-4">
//                         <span className={`text-sm font-medium ${
//                           report.status === 'Started' ? 'text-blue-600' : 'text-green-700'
//                         }`}>
//                           {report.status}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4 text-sm text-gray-600">{report.inventoryDates}</td>
//                       <td className="px-4 py-4 text-sm text-gray-600">{report.wholesalerDates}</td>
//                       <td className="px-4 py-4">
//                         <span
//                           className={`px-3 py-1 rounded-md text-xs font-semibold inline-block ${
//                             report.type === 'PBM'
//                               ? 'bg-blue-100 text-blue-700 border border-blue-300'
//                               : 'bg-pink-100 text-pink-700 border border-pink-300'
//                           }`}
//                         >
//                           {report.type}
//                         </span>
//                       </td>
//                       <td className="px-4 py-4 text-sm text-gray-600">{report.createdDate}</td>
//                       <td className="px-4 py-4">
//                         <div className="relative">
//                           <button
//                             onClick={() => setActiveMenu(activeMenu === report.id ? null : report.id)}
//                             className="p-1.5 hover:bg-gray-200 rounded transition-colors"
//                           >
//                             <MoreVertical className="w-5 h-5 text-gray-600" />
//                           </button>
//                           {activeMenu === report.id && (
//                             <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
//                               <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors rounded-t-lg">
//                                 Edit
//                               </button>
//                               <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
//                                 InventoryFiles
//                               </button>
//                               <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
//                                 SupplierFiles
//                               </button>
//                               <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-200 rounded-b-lg">
//                                 Delete
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </main>
//       </div>
//     </Suspense>
//   )
// }

