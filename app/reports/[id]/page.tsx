'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Search, X, ChevronDown, RotateCw } from 'lucide-react'

// Dummy data for the table
const inventoryData = [
  { id: 1, ndc: '61958-2501-01', drugName: 'BIKTARVY 50-200-25MG TAB', rank: 1, pkgSize: 30, totalOrdered: 2070, totalBilled: 3510, totalShortage: -1440, highestShortage: null, njMedicaid: 1320, shortageNjMedicaid: null, pdmi: 750 },
  { id: 2, ndc: '49702-0246-13', drugName: 'DOVATO 50-300MG TAB', rank: 2, pkgSize: 30, totalOrdered: 360, totalBilled: 600, totalShortage: -240, highestShortage: null, njMedicaid: 150, shortageNjMedicaid: null, pdmi: 210 },
  { id: 3, ndc: '69067-0010-15', drugName: 'LACTULOSE 10g PWD', rank: 3, pkgSize: 15, totalOrdered: 780, totalBilled: 900, totalShortage: -120, highestShortage: null, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
  { id: 4, ndc: '74157-0016-60', drugName: 'DICLOFENAC POTASSIUM 25MG TAB', rank: 4, pkgSize: 60, totalOrdered: 120, totalBilled: 1560, totalShortage: -1440, highestShortage: null, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
  { id: 5, ndc: '49702-0231-13', drugName: 'TRIUMEQ 600-50-300MG TAB', rank: 5, pkgSize: 30, totalOrdered: 150, totalBilled: 270, totalShortage: -120, highestShortage: null, njMedicaid: null, shortageNjMedicaid: -120, pdmi: null },
  { id: 6, ndc: '61958-2101-01', drugName: 'ODEFSEY 200-25-25MG TAB', rank: 6, pkgSize: 30, totalOrdered: 90, totalBilled: 240, totalShortage: -150, highestShortage: -60, njMedicaid: 150, shortageNjMedicaid: null, pdmi: -60 },
  { id: 7, ndc: '59676-0575-30', drugName: 'PREZCOBIX 800-150MG TAB', rank: 7, pkgSize: 30, totalOrdered: 150, totalBilled: 360, totalShortage: -210, highestShortage: -90, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
  { id: 8, ndc: '00003-0894-21', drugName: 'ELIQUIS 5MG TAB', rank: 8, pkgSize: 60, totalOrdered: 1620, totalBilled: 2684, totalShortage: -1064, highestShortage: null, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
  { id: 9, ndc: '45802-0578-84', drugName: 'NALOXONE HYDROCHLORI 4MG\\0.1M', rank: 9, pkgSize: 2, totalOrdered: 254, totalBilled: 786, totalShortage: -532, highestShortage: -492, njMedicaid: 746, shortageNjMedicaid: null, pdmi: -492 },
  { id: 10, ndc: '00169-4772-12', drugName: 'OZEMPIC 8 MG\\3 ML INJ', rank: 10, pkgSize: 3, totalOrdered: 42, totalBilled: 54, totalShortage: -12, highestShortage: null, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
  { id: 11, ndc: '00002-1471-80', drugName: 'MOUNJARO 10MG/0.5ML 10MG/0.5M', rank: 11, pkgSize: 2, totalOrdered: 24, totalBilled: 34, totalShortage: -10, highestShortage: -10, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
  { id: 12, ndc: '49702-0228-13', drugName: 'TIVICAY 50MG TAB', rank: 12, pkgSize: 30, totalOrdered: 120, totalBilled: 240, totalShortage: -120, highestShortage: -120, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
  { id: 13, ndc: '00169-4181-13', drugName: 'OZEMPIC 0.25 OR 0.50MG 2MG\\3ML', rank: 13, pkgSize: 3, totalOrdered: 33, totalBilled: 57, totalShortage: -24, highestShortage: null, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
  { id: 14, ndc: '00002-1495-80', drugName: 'MOUNJARO 5MG\\0.5ML INJ', rank: 14, pkgSize: 2, totalOrdered: 8, totalBilled: 28, totalShortage: -20, highestShortage: -12, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
  { id: 15, ndc: '00002-1484-80', drugName: 'MOUNJARO 7.5MG\\0.5ML INJ', rank: 15, pkgSize: 2, totalOrdered: 22, totalBilled: 28, totalShortage: -6, highestShortage: null, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
  { id: 16, ndc: '85622-0102-30', drugName: 'MICROBALANCE PROBIOTICS', rank: 16, pkgSize: 30, totalOrdered: 270, totalBilled: 270, totalShortage: 0, highestShortage: null, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
  { id: 17, ndc: '00002-2506-80', drugName: 'ZEPBOUND 2.5MG\\0.5ML INJ', rank: 17, pkgSize: 2, totalOrdered: 12, totalBilled: 28, totalShortage: -16, highestShortage: -4, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
  { id: 18, ndc: '61958-2002-01', drugName: 'DESCOVY 200-25MG TAB', rank: 18, pkgSize: 30, totalOrdered: 90, totalBilled: 150, totalShortage: -60, highestShortage: -30, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
  { id: 19, ndc: '00173-0887-10', drugName: 'TRELEGY ELLIPTA 100-62.5-25MCG\\ I', rank: 19, pkgSize: 60, totalOrdered: 660, totalBilled: 1020, totalShortage: -360, highestShortage: -240, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
  { id: 20, ndc: '00169-4524-14', drugName: 'WEGOVY SY 2.4MG\\0.75ML INJ', rank: 20, pkgSize: 3, totalOrdered: 12, totalBilled: 18, totalShortage: -6, highestShortage: -3, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
  { id: 21, ndc: '65649-0150-90', drugName: 'RELISTOR 150MG TAB', rank: 21, pkgSize: 90, totalOrdered: 270, totalBilled: 360, totalShortage: -90, highestShortage: null, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
  { id: 22, ndc: '00173-0873-10', drugName: 'INCRUSE ELLIPTA 62.5MCG\\ACTUATI', rank: 22, pkgSize: 30, totalOrdered: 510, totalBilled: 812, totalShortage: -302, highestShortage: -302, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
  { id: 23, ndc: '00310-6210-30', drugName: 'FARXIGA 10MG TAB', rank: 23, pkgSize: 30, totalOrdered: 420, totalBilled: 570, totalShortage: -150, highestShortage: null, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
  { id: 24, ndc: '71741-0365-30', drugName: 'WELLFOLA TABLET 25-0.013-1-80-6', rank: 24, pkgSize: 30, totalOrdered: 180, totalBilled: 180, totalShortage: 0, highestShortage: null, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
  { id: 25, ndc: '72511-0393-02', drugName: 'REPATHA SURECLICK 140MG\\ML INJ', rank: 25, pkgSize: 2, totalOrdered: 32, totalBilled: 32, totalShortage: 0, highestShortage: null, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
]

interface FilterChip {
  id: string
  label: string
  value: string
}

export default function InventoryReportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [activeFilters, setActiveFilters] = useState<FilterChip[]>([
    { id: 'pkgSize', label: 'PKG SIZE', value: 'PKG SIZE' },
    { id: 'cost', label: '$ COST', value: '$ COST' },
  ])

  const toggleRowSelection = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    )
  }

  const toggleAllRows = () => {
    if (selectedRows.length === inventoryData.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(inventoryData.map(row => row.id))
    }
  }

  const removeFilter = (filterId: string) => {
    setActiveFilters(prev => prev.filter(f => f.id !== filterId))
  }

  const formatNumber = (num: number | null) => {
    if (num === null) return ''
    return num.toLocaleString()
  }

  const renderShortageValue = (value: number | null) => {
    if (value === null) return ''
    if (value === 0) return <span className="text-emerald-600 font-medium">0</span>
    return <span className="text-red-500 font-medium">{value.toLocaleString()}</span>
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Taskbar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex items-center px-3 py-2 gap-3">
          {/* Navigation Arrows */}
          <div className="flex items-center gap-0.5">
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-500" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded transition-colors">
              <RotateCw className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Inventory Report Title */}
          <div className="flex flex-col min-w-fit">
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">Inventory Report</span>
            <span className="text-xs font-medium text-gray-800">SEP 1, 2025 - JAN 26, 2026</span>
          </div>

          {/* Inventory Dates */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1 mb-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              <span className="text-[10px] font-semibold text-red-500 uppercase">Inventory Dates</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="border border-gray-200 rounded px-1.5 py-0.5 text-center">
                <span className="text-[9px] font-semibold text-red-500 uppercase block">Start</span>
                <span className="text-[10px] font-medium text-gray-800">09/01/2025</span>
              </div>
              <div className="border border-gray-200 rounded px-1.5 py-0.5 text-center">
                <span className="text-[9px] font-semibold text-red-500 uppercase block">End</span>
                <span className="text-[10px] font-medium text-gray-800">01/26/2026</span>
              </div>
            </div>
          </div>

          {/* Wholesaler Dates */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1 mb-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-[10px] font-semibold text-emerald-600 uppercase">Wholesaler Dates</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="border border-gray-200 rounded px-1.5 py-0.5 text-center">
                <span className="text-[9px] font-semibold text-emerald-600 uppercase block">Start</span>
                <span className="text-[10px] font-medium text-gray-800">09/01/2025</span>
              </div>
              <div className="border border-gray-200 rounded px-1.5 py-0.5 text-center">
                <span className="text-[9px] font-semibold text-emerald-600 uppercase block">End</span>
                <span className="text-[10px] font-medium text-gray-800">01/26/2026</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center">
            <div className="flex items-center border border-gray-300 rounded-l bg-white">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 px-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
              />
              <button 
                onClick={() => setSearchQuery('')}
                className="px-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-r hover:bg-emerald-700 transition-colors border border-emerald-600">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex items-center gap-3">
            {/* Filter */}
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-gray-500 uppercase">Filter</span>
              <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>CHOOSE</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Flag */}
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-gray-500 uppercase">Flag</span>
              <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900">
                <span>CHOOSE</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-gray-500 uppercase">Tags</span>
              <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900">
                <span>CHOOSE</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Priority */}
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-gray-500 uppercase">Priority</span>
              <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={2} />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                </svg>
                <span>CHOOSE</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Qty Type with chip */}
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-gray-500 uppercase">Qty Type</span>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-600 text-white rounded text-xs font-medium">
                PKG SIZE
                <button 
                  onClick={() => removeFilter('pkgSize')}
                  className="hover:bg-emerald-700 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Drug Type */}
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-gray-500 uppercase">Drug Type</span>
              <button className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900">
                <span>ALL DRUGS</span>
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>

            {/* Drug Cost with chip */}
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-gray-500 uppercase">Drug Cost</span>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-600 text-white rounded text-xs font-medium">
                $ COST
                <button 
                  onClick={() => removeFilter('cost')}
                  className="hover:bg-emerald-700 rounded-full"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Rows Count */}
            <div className="flex flex-col">
              <span className="text-[10px] font-semibold text-gray-500 uppercase">Rows</span>
              <div className="px-3 py-0.5 bg-emerald-600 text-white rounded text-xs font-semibold text-center">
                997
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table Header Row */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="flex items-center px-4 py-2 text-xs font-semibold text-gray-600 uppercase">
          <div className="w-10 flex items-center justify-center">
            <input
              type="checkbox"
              checked={selectedRows.length === inventoryData.length}
              onChange={toggleAllRows}
              className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
          </div>
          <div className="w-32 flex items-center gap-1">
            NDC
            <ChevronDown className="w-3 h-3" />
          </div>
          <div className="flex-1 min-w-[280px] flex items-center gap-1">
            Drug Name
            <ChevronDown className="w-3 h-3" />
          </div>
          <div className="w-16 text-center flex items-center justify-center gap-1">
            Rank
            <ChevronDown className="w-3 h-3" />
          </div>
          <div className="w-20 text-center flex items-center justify-center gap-1">
            PKG Size
            <ChevronDown className="w-3 h-3" />
          </div>
          <div className="w-24 text-center">
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              Total Ordered
            </div>
          </div>
          <div className="w-24 text-center">
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              Total Billed
            </div>
          </div>
          <div className="w-24 text-center">
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              Total Shortage
            </div>
          </div>
          <div className="w-24 text-center">
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
              Highest Shortage
            </div>
          </div>
          <div className="w-24 text-center">
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              NJ Medicaid
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
          <div className="w-28 text-center">
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              Shortage NJ Medicaid
            </div>
          </div>
          <div className="w-24 text-center">
            <div className="flex items-center justify-center gap-1">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              PDMI (CO
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-100">
        {inventoryData.map((row, index) => (
          <div 
            key={row.id}
            className={`flex items-center px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
              index % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'
            }`}
          >
            <div className="w-10 flex items-center justify-center">
              <input
                type="checkbox"
                checked={selectedRows.includes(row.id)}
                onChange={() => toggleRowSelection(row.id)}
                className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
            </div>
            <div className="w-32 text-gray-600 flex items-center gap-1">
              <div className="flex items-center gap-0.5">
                <button className="p-0.5 hover:bg-gray-200 rounded text-gray-400">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="p-0.5 hover:bg-gray-200 rounded text-gray-400">
                  <Search className="w-3 h-3" />
                </button>
                <button className="p-0.5 hover:bg-gray-200 rounded text-gray-400">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              {row.ndc}
            </div>
            <div className="flex-1 min-w-[280px] text-gray-900 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                <button className="p-0.5 hover:bg-gray-200 rounded text-gray-400">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
                  </svg>
                </button>
                <button className="p-0.5 hover:bg-gray-200 rounded text-gray-400">
                  <Search className="w-3 h-3" />
                </button>
                <button className="p-0.5 hover:bg-gray-200 rounded text-gray-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </button>
              </div>
              {row.drugName}
            </div>
            <div className="w-16 text-center text-gray-600">{row.rank}</div>
            <div className="w-20 text-center text-gray-600">{row.pkgSize}</div>
            <div className="w-24 text-center text-gray-600 flex items-center justify-center gap-1">
              <Search className="w-3 h-3 text-gray-400" />
              {formatNumber(row.totalOrdered)}
            </div>
            <div className="w-24 text-center text-gray-600">{formatNumber(row.totalBilled)}</div>
            <div className="w-24 text-center">{renderShortageValue(row.totalShortage)}</div>
            <div className="w-24 text-center">{renderShortageValue(row.highestShortage)}</div>
            <div className="w-24 text-center text-gray-600">{formatNumber(row.njMedicaid)}</div>
            <div className="w-28 text-center">{renderShortageValue(row.shortageNjMedicaid)}</div>
            <div className="w-24 text-center">{renderShortageValue(row.pdmi)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
