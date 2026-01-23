'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Layers, RotateCw, MoreVertical, LifeBuoy, User, RefreshCw, Settings, HelpCircle, Ticket, Search, FileText } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Loading from './loading'
import Link from 'next/link'
import Sidebar from '@/components/Sidebar'


interface Report {
  id: number
  auditName: string
  status: 'Ready' | 'Processing' | 'Completed'
  inventoryDates: string
  wholesalerDates: string
  type: 'INVENTORY' | 'PBM' | 'ABERRANT'
  createdDate: string
}

const reportsData: Report[] = [
  {
    id: 1,
    auditName: 'SEPTEMBER 1, 2025 - DEC 31, 2025',
    status: 'Ready',
    inventoryDates: '09/01/2025 - 12/31/2025',
    wholesalerDates: '09/01/2025 - 12/31/2025',
    type: 'INVENTORY',
    createdDate: '12/31/2025',
  },
  {
    id: 2,
    auditName: 'NOVEMBER 2025',
    status: 'Ready',
    inventoryDates: '11/01/2024 - 11/24/2025',
    wholesalerDates: '11/01/2024 - 11/24/2025',
    type: 'INVENTORY',
    createdDate: '11/26/2025',
  },
  {
    id: 3,
    auditName: 'OCT 1, 2024 - OCT 27, 2025',
    status: 'Ready',
    inventoryDates: '11/01/2024 - 10/27/2025',
    wholesalerDates: '11/01/2024 - 10/27/2025',
    type: 'INVENTORY',
    createdDate: '10/29/2025',
  },
  {
    id: 4,
    auditName: 'SEP 1, 2024 - SEP 24 2025',
    status: 'Ready',
    inventoryDates: '11/01/2024 - 09/24/2025',
    wholesalerDates: '11/01/2024 - 09/24/2025',
    type: 'INVENTORY',
    createdDate: '09/26/2025',
  },
  {
    id: 5,
    auditName: 'NOV 1, 2024 - AUG 25, 2025',
    status: 'Ready',
    inventoryDates: '11/01/2024 - 08/25/2025',
    wholesalerDates: '11/01/2024 - 08/25/2025',
    type: 'INVENTORY',
    createdDate: '08/29/2025',
  },
  {
    id: 6,
    auditName: 'April Report',
    status: 'Ready',
    inventoryDates: '04/01/2025 - 04/30/2025',
    wholesalerDates: '04/01/2025 - 04/30/2025',
    type: 'INVENTORY',
    createdDate: '05/02/2025',
  },
  {
    id: 7,
    auditName: 'Nov - March Check',
    status: 'Ready',
    inventoryDates: '11/01/2024 - 03/31/2025',
    wholesalerDates: '11/01/2024 - 03/31/2025',
    type: 'INVENTORY',
    createdDate: '04/16/2025',
  },
  {
    id: 8,
    auditName: '11/1 - 1/31',
    status: 'Ready',
    inventoryDates: '11/01/2024 - 01/31/2025',
    wholesalerDates: '11/01/2024 - 01/31/2025',
    type: 'INVENTORY',
    createdDate: '03/31/2025',
  },
  {
    id: 9,
    auditName: 'Caremark',
    status: 'Ready',
    inventoryDates: '11/01/2024 - 01/31/2025',
    wholesalerDates: '-',
    type: 'PBM',
    createdDate: '03/31/2025',
  },
  {
    id: 10,
    auditName: 'CHECK BIKTARVY',
    status: 'Ready',
    inventoryDates: '03/01/2025 - 03/28/2025',
    wholesalerDates: '03/01/2025 - 03/28/2025',
    type: 'INVENTORY',
    createdDate: '03/29/2025',
  },
]

type FilterType = 'all' | 'inventory' | 'aberrant' | 'optum'

export default function ReportsPage() {
const [sidebarOpen, setSidebarOpen] = useState(true)
const [activePanel, setActivePanel] = useState<string | null>(null)

  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [activeMenu, setActiveMenu] = useState<number | null>(null)
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

     
        <main className="flex-1 overflow-auto bg-gray-50">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Layers className="w-6 h-6 text-teal-700" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    REPORTS
                    <RotateCw className="w-5 h-5 text-gray-400" />
                  </h1>
                  <p className="text-sm text-gray-600">United Drugs Pharmacy | 507 Central Ave</p>
                </div>
              </div>
            </div>

            
            <div className="flex gap-8 mb-8 border-b border-gray-200">
              {[
                { key: 'all', label: 'ALL', count: filterCounts.all },
                { key: 'inventory', label: 'INVENTORY', count: filterCounts.inventory },
                { key: 'aberrant', label: 'ABERRANT', count: filterCounts.aberrant },
                { key: 'optum', label: 'OPTUM', count: filterCounts.optum },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveFilter(tab.key as FilterType)}
                  className={`pb-4 px-2 font-semibold transition-colors relative ${
                    activeFilter === tab.key
                      ? 'text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-teal-700 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {tab.count}
                    </span>
                    {tab.label}
                  </div>
                  {activeFilter === tab.key && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-700" />
                  )}
                </button>
              ))}
            </div>

          
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Audit Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Inventory Dates</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Wholesaler Dates</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Created Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((report, index) => (
                    <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-100 transition-colors">
                      <td className="px-4 py-4">
                        <input type="checkbox" className="w-4 h-4 rounded" />
                      </td>
                      <td className="px-4 py-4 text-sm font-medium text-gray-900 cursor-pointer hover:text-teal-700">
                        {report.auditName}
                      </td>
                      <td className="px-4 py-4 text-sm text-teal-700 font-medium">{report.status}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{report.inventoryDates}</td>
                      <td className="px-4 py-4 text-sm text-gray-600">{report.wholesalerDates}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            report.type === 'PBM'
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-teal-100 text-teal-700'
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
                            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                          >
                            <MoreVertical className="w-5 h-5 text-gray-600" />
                          </button>
                          {activeMenu === report.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                Edit
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                InventoryFiles
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                SupplierFiles
                              </button>
                              <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-200">
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
    </Suspense>
  )
}
