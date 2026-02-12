  'use client'

  import React, { useState, useRef, useEffect } from 'react'
  import { ChevronLeft, ChevronRight, Search, X, ChevronDown, RotateCw } from 'lucide-react'
  import { ArrowUpDown } from 'lucide-react'

  function SortIcon({ dir }: { dir?: 'asc' | 'desc' }) {
    if (!dir) return <ArrowUpDown className="w-3 h-3 ml-1 text-gray-400" />
    if (dir === 'asc') return <span className="text-[10px] ml-1">▲</span>
    return <span className="text-[10px] ml-1">▼</span>
  }


  function HeaderCell({
    children,
    sortKey,
    sortRules,
    onSort,
  }: {
    children: React.ReactNode
    sortKey: keyof typeof inventoryData[number]
    sortRules: SortRule[]
    onSort: (key: keyof typeof inventoryData[number], e: React.MouseEvent) => void
  }) {
    const active = sortRules.find(r => r.key === sortKey)?.dir

    return (
      <div
        onClick={(e) => onSort(sortKey, e)}
        className="px-2 h-[40px] flex items-center justify-center gap-1 cursor-pointer select-none whitespace-nowrap leading-none hover:text-emerald-700"
      >
        <span className="text-[11px] font-semibold uppercase text-gray-700">
          {children}
        </span>
        <SortIcon dir={active} />
      </div>
    )
  }



  const inventoryData = [
    { id: 1, ndc: '61958-2501-01', drugName: 'BIKTARVY 50-200-25MG TAB', rank: 1, pkgSize: 30, totalOrdered: 2070, totalBilled: 3510, totalShortage: -1440, highestShortage: -500, cost: 1.69, horizon: 420, shortageHorizon: -40, express: 380, shortageExpress: -25, cvsCaremark: 300, shortageCvsCaremark: -15, ssc: 220, shortageSsc: -30, njMedicaid: 1320, shortageNjMedicaid: -44, pdmi: 750, shortagePdmi: -12, optumrx: 67, shortageOptumrx: -5 },
    { id: 2, ndc: '49702-0246-13', drugName: 'DOVATO 50-300MG TAB', rank: 2, pkgSize: 30, totalOrdered: 360, totalBilled: 600, totalShortage: -240, highestShortage: -120, cost: 1.66, horizon: 90, shortageHorizon: -9, express: 110, shortageExpress: -5, cvsCaremark: 60, shortageCvsCaremark: -4, ssc: 30, shortageSsc: -2, njMedicaid: 150, shortageNjMedicaid: -9, pdmi: 210, shortagePdmi: -10, optumrx: 30, shortageOptumrx: -1 },
    { id: 3, ndc: '00093-7424-56', drugName: 'ELIQUIS 5MG TAB', rank: 3, pkgSize: 60, totalOrdered: 1240, totalBilled: 1890, totalShortage: -650, highestShortage: -220, cost: 2.45, horizon: 310, shortageHorizon: -18, express: 420, shortageExpress: -30, cvsCaremark: 390, shortageCvsCaremark: -21, ssc: 140, shortageSsc: -12, njMedicaid: 600, shortageNjMedicaid: -25, pdmi: 180, shortagePdmi: -8, optumrx: 160, shortageOptumrx: -10 },
    { id: 4, ndc: '00071-0155-23', drugName: 'LANTUS SOLOSTAR PEN', rank: 4, pkgSize: 5, totalOrdered: 780, totalBilled: 1120, totalShortage: -340, highestShortage: -150, cost: 3.25, horizon: 210, shortageHorizon: -15, express: 260, shortageExpress: -18, cvsCaremark: 190, shortageCvsCaremark: -10, ssc: 90, shortageSsc: -6, njMedicaid: 320, shortageNjMedicaid: -14, pdmi: 60, shortagePdmi: -4, optumrx: 80, shortageOptumrx: -5 },
    { id: 5, ndc: '65862-0520-01', drugName: 'TRULICITY 1.5MG PEN', rank: 5, pkgSize: 4, totalOrdered: 920, totalBilled: 1340, totalShortage: -420, highestShortage: -180, cost: 4.10, horizon: 260, shortageHorizon: -22, express: 300, shortageExpress: -20, cvsCaremark: 240, shortageCvsCaremark: -16, ssc: 110, shortageSsc: -9, njMedicaid: 410, shortageNjMedicaid: -19, pdmi: 70, shortagePdmi: -6, optumrx: 90, shortageOptumrx: -7 },
    { id: 6, ndc: '00169-4130-68', drugName: 'ATORVASTATIN 20MG TAB', rank: 6, pkgSize: 90, totalOrdered: 2100, totalBilled: 2400, totalShortage: -300, highestShortage: -120, cost: 0.42, horizon: 520, shortageHorizon: -35, express: 680, shortageExpress: -28, cvsCaremark: 510, shortageCvsCaremark: -20, ssc: 300, shortageSsc: -15, njMedicaid: 900, shortageNjMedicaid: -33, pdmi: 0, shortagePdmi: 0, optumrx: 260, shortageOptumrx: -12 },
    { id: 7, ndc: '00006-0582-61', drugName: 'HUMALOG KWIKPEN', rank: 7, pkgSize: 5, totalOrdered: 640, totalBilled: 980, totalShortage: -340, highestShortage: -140, cost: 3.75, horizon: 180, shortageHorizon: -12, express: 220, shortageExpress: -16, cvsCaremark: 170, shortageCvsCaremark: -9, ssc: 85, shortageSsc: -5, njMedicaid: 300, shortageNjMedicaid: -13, pdmi: 40, shortagePdmi: -3, optumrx: 65, shortageOptumrx: -4 },
    { id: 8, ndc: '00002-8215-01', drugName: 'XARELTO 20MG TAB', rank: 8, pkgSize: 30, totalOrdered: 980, totalBilled: 1450, totalShortage: -470, highestShortage: -200, cost: 2.95, horizon: 260, shortageHorizon: -19, express: 310, shortageExpress: -21, cvsCaremark: 280, shortageCvsCaremark: -18, ssc: 120, shortageSsc: -10, njMedicaid: 430, shortageNjMedicaid: -20, pdmi: 55, shortagePdmi: -4, optumrx: 95, shortageOptumrx: -6 },
    { id: 9, ndc: '00054-4713-25', drugName: 'METFORMIN ER 500MG TAB', rank: 9, pkgSize: 120, totalOrdered: 2600, totalBilled: 2950, totalShortage: -350, highestShortage: -140, cost: 0.22, horizon: 610, shortageHorizon: -42, express: 780, shortageExpress: -34, cvsCaremark: 640, shortageCvsCaremark: -28, ssc: 350, shortageSsc: -19, njMedicaid: 980, shortageNjMedicaid: -41, pdmi: 0, shortagePdmi: 0, optumrx: 310, shortageOptumrx: -15 },
    { id: 10, ndc: '00093-5174-56', drugName: 'OZEMPIC 1MG PEN', rank: 10, pkgSize: 1, totalOrdered: 540, totalBilled: 920, totalShortage: -380, highestShortage: -170, cost: 5.85, horizon: 150, shortageHorizon: -14, express: 210, shortageExpress: -17, cvsCaremark: 160, shortageCvsCaremark: -11, ssc: 75, shortageSsc: -6, njMedicaid: 260, shortageNjMedicaid: -12, pdmi: 30, shortagePdmi: -2, optumrx: 55, shortageOptumrx: -4 },

    { id: 11, ndc: '51672-1234-01', drugName: 'FARXIGA 10MG TAB', rank: 11, pkgSize: 30, totalOrdered: 410, totalBilled: 620, totalShortage: -210, highestShortage: -90, cost: 2.88, horizon: 130, shortageHorizon: -12, express: 140, shortageExpress: -10, cvsCaremark: 110, shortageCvsCaremark: -8, ssc: 55, shortageSsc: -4, njMedicaid: 160, shortageNjMedicaid: -9, pdmi: 20, shortagePdmi: -2, optumrx: 45, shortageOptumrx: -3 },

    { id: 12, ndc: '00078-0450-89', drugName: 'JARDIANCE 25MG TAB', rank: 12, pkgSize: 30, totalOrdered: 760, totalBilled: 980, totalShortage: -220, highestShortage: -110, cost: 3.40, horizon: 200, shortageHorizon: -16, express: 260, shortageExpress: -18, cvsCaremark: 190, shortageCvsCaremark: -13, ssc: 85, shortageSsc: -7, njMedicaid: 290, shortageNjMedicaid: -14, pdmi: 45, shortagePdmi: -3, optumrx: 90, shortageOptumrx: -6 },

    { id: 13, ndc: '00173-0456-02', drugName: 'LISINOPRIL 10MG TAB', rank: 13, pkgSize: 90, totalOrdered: 3400, totalBilled: 3700, totalShortage: -300, highestShortage: -140, cost: 0.19, horizon: 800, shortageHorizon: -45, express: 920, shortageExpress: -38, cvsCaremark: 770, shortageCvsCaremark: -31, ssc: 410, shortageSsc: -22, njMedicaid: 1200, shortageNjMedicaid: -49, pdmi: 0, shortagePdmi: 0, optumrx: 360, shortageOptumrx: -18 },

    { id: 14, ndc: '00406-1239-02', drugName: 'LEVOTHYROXINE 75MCG TAB', rank: 14, pkgSize: 90, totalOrdered: 2900, totalBilled: 3250, totalShortage: -350, highestShortage: -160, cost: 0.25, horizon: 720, shortageHorizon: -39, express: 880, shortageExpress: -36, cvsCaremark: 710, shortageCvsCaremark: -29, ssc: 380, shortageSsc: -21, njMedicaid: 1020, shortageNjMedicaid: -44, pdmi: 0, shortagePdmi: 0, optumrx: 330, shortageOptumrx: -17 },

    { id: 15, ndc: '00378-1112-05', drugName: 'AMLODIPINE 5MG TAB', rank: 15, pkgSize: 90, totalOrdered: 3100, totalBilled: 3450, totalShortage: -350, highestShortage: -155, cost: 0.18, horizon: 760, shortageHorizon: -41, express: 910, shortageExpress: -37, cvsCaremark: 730, shortageCvsCaremark: -30, ssc: 390, shortageSsc: -23, njMedicaid: 1100, shortageNjMedicaid: -46, pdmi: 0, shortagePdmi: 0, optumrx: 350, shortageOptumrx: -19 },

    { id: 16, ndc: '00234-7741-11', drugName: 'LOSARTAN 50MG TAB', rank: 16, pkgSize: 90, totalOrdered: 2800, totalBilled: 3100, totalShortage: -300, highestShortage: -135, cost: 0.21, horizon: 700, shortageHorizon: -37, express: 860, shortageExpress: -34, cvsCaremark: 690, shortageCvsCaremark: -27, ssc: 360, shortageSsc: -20, njMedicaid: 980, shortageNjMedicaid: -42, pdmi: 0, shortagePdmi: 0, optumrx: 310, shortageOptumrx: -16 },

    { id: 17, ndc: '00143-7741-09', drugName: 'SERTRALINE 50MG TAB', rank: 17, pkgSize: 90, totalOrdered: 2500, totalBilled: 2900, totalShortage: -400, highestShortage: -180, cost: 0.33, horizon: 650, shortageHorizon: -33, express: 820, shortageExpress: -31, cvsCaremark: 660, shortageCvsCaremark: -26, ssc: 340, shortageSsc: -19, njMedicaid: 930, shortageNjMedicaid: -39, pdmi: 0, shortagePdmi: 0, optumrx: 290, shortageOptumrx: -14 },

    { id: 18, ndc: '00045-1452-03', drugName: 'GABAPENTIN 300MG CAP', rank: 18, pkgSize: 180, totalOrdered: 3600, totalBilled: 3900, totalShortage: -300, highestShortage: -150, cost: 0.12, horizon: 880, shortageHorizon: -48, express: 1020, shortageExpress: -44, cvsCaremark: 820, shortageCvsCaremark: -36, ssc: 430, shortageSsc: -25, njMedicaid: 1300, shortageNjMedicaid: -52, pdmi: 0, shortagePdmi: 0, optumrx: 420, shortageOptumrx: -21 },

    { id: 19, ndc: '00182-3341-07', drugName: 'PANTOPRAZOLE 40MG TAB', rank: 19, pkgSize: 90, totalOrdered: 2300, totalBilled: 2600, totalShortage: -300, highestShortage: -140, cost: 0.29, horizon: 600, shortageHorizon: -31, express: 780, shortageExpress: -29, cvsCaremark: 620, shortageCvsCaremark: -24, ssc: 320, shortageSsc: -18, njMedicaid: 880, shortageNjMedicaid: -37, pdmi: 0, shortagePdmi: 0, optumrx: 270, shortageOptumrx: -13 },

    { id: 20, ndc: '00031-4587-22', drugName: 'OMEPRAZOLE 20MG CAP', rank: 20, pkgSize: 180, totalOrdered: 4100, totalBilled: 4500, totalShortage: -400, highestShortage: -190, cost: 0.14, horizon: 980, shortageHorizon: -52, express: 1150, shortageExpress: -48, cvsCaremark: 930, shortageCvsCaremark: -39, ssc: 480, shortageSsc: -28, njMedicaid: 1450, shortageNjMedicaid: -58, pdmi: 0, shortagePdmi: 0, optumrx: 470, shortageOptumrx: -24 },
  ]





  interface FilterChip {
    id: string
    label: string
    value: string
  }

  export default function InventoryReportPage() {
    const [openExportModal, setOpenExportModal] = useState(false)
const [exportFormat, setExportFormat] = useState<'csv' | 'excel' | 'pdf'>('excel')
const [exportScope, setExportScope] = useState<'visible' | 'all'>('visible')

    const [searchQuery, setSearchQuery] = useState('')
    const [selectedRows, setSelectedRows] = useState<number[]>([])
    const [activeFilters, setActiveFilters] = useState<FilterChip[]>([
      { id: 'pkgSize', label: 'PKG SIZE', value: 'PKG SIZE' },
      { id: 'cost', label: '$ COST', value: '$ COST' },
    ])
    const [qtyType, setQtyType] = useState<'UNIT' | 'PKG SIZE' | null>('UNIT')
    const [openQtyDropdown, setOpenQtyDropdown] = useState(false)
    const [openFilter, setOpenFilter] = useState(false)
    const [openFlagDropdown, setOpenFlagDropdown] = useState(false)
    const [flagFilters, setFlagFilters] = useState<string[]>([])
    const [openTagsDropdown, setOpenTagsDropdown] = useState(false)
    const [openTagMenuId, setOpenTagMenuId] = useState<string | null>(null)
    const [openCreateTagModal, setOpenCreateTagModal] = useState(false)
    const [newTagName, setNewTagName] = useState('')
    const [newTagColor, setNewTagColor] = useState('yellow')
    const [openDrugTypeDropdown, setOpenDrugTypeDropdown] = useState(false)
    const [drugTypes, setDrugTypes] = useState<string[]>(['ALL DRUGS'])
    const [costValue, setCostValue] = useState<number | ''>('')
    const [openDrugSidebar, setOpenDrugSidebar] = useState(false)
  const [activeDrug, setActiveDrug] = useState<typeof inventoryData[number] | null>(null)
  const [dateStart, setDateStart] = useState(0)
  const [dateEnd, setDateEnd] = useState(100)
  const sliderRef = useRef<HTMLDivElement | null>(null)

  type SortDir = 'asc' | 'desc'

  interface SortRule {
    key: keyof typeof inventoryData[number]
    dir: SortDir
  }

  const [sortRules, setSortRules] = useState<SortRule[]>([])


  const [columnWidths, setColumnWidths] = useState({
    checkbox: 40,
    ndc: 190,
    drugName: 300,
    rank: 80,
    pkgSize: 100,
    totalOrdered: 140,
    totalBilled: 130,
    totalShortage: 150,
    highestShortage: 155,
    cost: 90,

    horizon: 150,
    shortageHorizon: 155,

    express: 150,
    shortageExpress: 155,

    cvsCaremark: 150,
    shortageCvsCaremark: 150,

    ssc: 170,
    shortageSsc: 170,

    njMedicaid: 150,
    shortageNjMedicaid: 150,

    pdmi: 150,
    shortagePdmi: 150,

    optumrx: 150,
    shortageOptumrx: 150,

  kinray: 150,
  realValueRx: 150,
  parmed: 150,
  axia: 150,
  citymed: 150,
  legacyHealth: 150,
  ndcDistributors: 150,
  trumarker: 150,

  })

  const [columnFilters, setColumnFilters] = useState({
    ndc: true,
    drugName: true,

    rank: true,
    pkgSize: true,
    totalOrdered: true,
    totalBilled: true,
    totalShortage: true,
    highestShortage: true,
    cost: true,

    horizon: true,
    shortageHorizon: true,

    express: true,
    shortageExpress: true,

    cvsCaremark: true,
    shortageCvsCaremark: true,

    ssc: true,
    shortageSsc: true,

    njMedicaid: true,
    shortageNjMedicaid: true,

    pdmi: true,
    shortagePdmi: true,

    optumrx: true,
    shortageOptumrx: true,

  kinray: false,
  realValueRx: false,
  parmed: false,
  axia: false,
  citymed: false,
  legacyHealth: false,
  ndcDistributors: false,
  trumarker: false,

  })




  const [billedFilters, setBilledFilters] = useState<string[]>([
    'HORIZON HEALTH',
    'EXPRESS SCRIPTS',
    'CVS CAREMARK',
    'SS&C',
    'NJ MEDICAID',
    'PDMI',
    'OPTUMRX',
  ])

 const [supplierFilters, setSupplierFilters] = useState<string[]>([])


  const supplierToColumnKey = {
  'KINRAY': 'kinray',
  'REAL VALUE RX': 'realValueRx',
  'PARMED': 'parmed',
  'AXIA': 'axia',
  'CITYMED': 'citymed',
  'LEGACY HEALTH': 'legacyHealth',
  'NDC DISTRIBUTORS': 'ndcDistributors',
  'TRUMARKER': 'trumarker',
} as const


  const [showAberrant, setShowAberrant] = useState(false)
  const [showControlled, setShowControlled] = useState(false)


    const [resizing, setResizing] = useState<string | null>(null)
    const resizeStartX = useRef(0)
    const resizeStartWidth = useRef(0)

    const handleSliderMouseDown = (handle: 'start' | 'end') => (e: React.MouseEvent) => {
    e.preventDefault()

    const onMove = (ev: MouseEvent) => {
      if (!sliderRef.current) return
      const rect = sliderRef.current.getBoundingClientRect()
      const percent = Math.min(100, Math.max(0, ((ev.clientX - rect.left) / rect.width) * 100))

      if (handle === 'start') {
        setDateStart(prev => Math.min(percent, dateEnd - 2))
      } else {
        setDateEnd(prev => Math.max(percent, dateStart + 2))
      }
    }

    const onUp = () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
  }



    const handleResizeStart = (e: React.MouseEvent, column: string) => {
      e.preventDefault()
      setResizing(column)
      resizeStartX.current = e.clientX
      resizeStartWidth.current = columnWidths[column as keyof typeof columnWidths]
    }

    useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
        if (resizing) {
          const diff = e.clientX - resizeStartX.current
          const newWidth = Math.max(60, resizeStartWidth.current + diff)
          setColumnWidths(prev => ({
            ...prev,
            [resizing]: newWidth
          }))
        }
      }

      const handleMouseUp = () => {
        setResizing(null)
      }

      if (resizing) {
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
        return () => {
          document.removeEventListener('mousemove', handleMouseMove)
          document.removeEventListener('mouseup', handleMouseUp)
        }
      }
    }, [resizing])

  const filteredData = inventoryData.filter(row => {
    const q = searchQuery.trim().toLowerCase()
    if (q && !row.drugName.toLowerCase().includes(q) && !row.ndc.toLowerCase().includes(q)) {
      return false
    }

    if (costValue !== '') {
      const unitCost = row.totalOrdered ? row.totalBilled / row.totalOrdered : 0
      if (unitCost < costValue) return false
    }

    // PBM billed filters
    const pbmMap = {
      'HORIZON HEALTH': row.horizon,
      'EXPRESS SCRIPTS': row.express,
      'CVS CAREMARK': row.cvsCaremark,
      'SS&C': row.ssc,
      'NJ MEDICAID': row.njMedicaid,
      'PDMI': row.pdmi,
      'OPTUMRX': row.optumrx,
    }

 // Do NOT filter rows by billedFilters (billedFilters only control column visibility)
const anyBilledMatch = true


    return true
  })

  const handleExport = (format: 'csv' | 'excel' | 'pdf', scope: 'visible' | 'all') => {
  const rows = scope === 'visible' ? sortedData : inventoryData

  const visibleCols = Object.entries(columnFilters)
    .filter(([, v]) => v)
    .map(([k]) => k)

  const headers = visibleCols.join(',')
  const body = rows.map(r =>
    visibleCols.map(col => JSON.stringify((r as any)[col] ?? '')).join(',')
  ).join('\n')

  const csv = `${headers}\n${body}`

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `inventory-export.${format === 'excel' ? 'xlsx' : 'csv'}`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}



  const sortedData = [...filteredData].sort((a, b) => {
    for (const rule of sortRules) {
      const av = a[rule.key]
      const bv = b[rule.key]

      if (av == null && bv == null) continue
      if (av == null) return 1
      if (bv == null) return -1

      if (typeof av === 'number' && typeof bv === 'number') {
        if (av !== bv) return rule.dir === 'asc' ? av - bv : bv - av
      } else {
        const sa = String(av)
        const sb = String(bv)
        if (sa !== sb) return rule.dir === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa)
      }
    }
    return 0
  })

  const toggleSort = (key: keyof typeof inventoryData[number], e: React.MouseEvent) => {
    setSortRules(prev => {
      const existing = prev.find(r => r.key === key)

      if (existing) {
        if (existing.dir === 'asc') {
          return prev.map(r => r.key === key ? { ...r, dir: 'desc' } : r)
        } else {
          return prev.filter(r => r.key !== key)
        }
      } else {
        if (e.shiftKey) {
          return [...prev, { key, dir: 'asc' }]
        }
        return [{ key, dir: 'asc' }]
      }
    })
  }

  const pbmToColumns = {
  'HORIZON HEALTH': ['horizon', 'shortageHorizon'],
  'EXPRESS SCRIPTS': ['express', 'shortageExpress'],
  'CVS CAREMARK': ['cvsCaremark', 'shortageCvsCaremark'],
  'SS&C': ['ssc', 'shortageSsc'],
  'NJ MEDICAID': ['njMedicaid', 'shortageNjMedicaid'],
  'PDMI': ['pdmi', 'shortagePdmi'],
  'OPTUMRX': ['optumrx', 'shortageOptumrx'],
} as const


    const tags = [
      { id: 'caremark', label: 'Caremark', color: 'emerald', count: 0 },
      { id: 'oxy', label: 'OXY OPTUM', color: 'cyan', count: 0 },
      { id: 'skip', label: 'taken care, skip', color: 'zinc', count: 0 },
      { id: 'need', label: 'need to buy', color: 'rose', count: 0 },
      { id: 'parmed', label: 'parmed', color: 'zinc', count: 0 },
      { id: 'ordered', label: 'ORDERED', color: 'lime', count: 0 },
    ]

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
      <div className="min-h-screen bg-gray-50">
        {openFilter && (
  <>
    <div className="fixed inset-0 z-[999] bg-black/20 " onClick={() => setOpenFilter(false)} />

    <div className="fixed top-[70px] bottom-4 right-100 z-[1000] w-[760px] max-w-[95vw] rounded-xl border border-gray-200 bg-white shadow-2xl flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <span className="text-sm font-semibold tracking-wide">FILTERS</span>
        <div className="flex items-center gap-2">
          <button
  onClick={() => {
    setSearchQuery('')
    setCostValue('')
    setDrugTypes(['ALL DRUGS'])
    setFlagFilters([])
    setSupplierFilters([])
    setBilledFilters([
      'HORIZON HEALTH',
      'EXPRESS SCRIPTS',
      'CVS CAREMARK',
      'SS&C',
      'NJ MEDICAID',
      'PDMI',
      'OPTUMRX',
    ])

    // reset all columns to default ON (except supplier dynamic cols)
    setColumnFilters(prev => ({
      ...prev,
      ndc: true,
      drugName: true,
      rank: true,
      pkgSize: true,
      totalOrdered: true,
      totalBilled: true,
      totalShortage: true,
      highestShortage: true,
      cost: true,
      horizon: true,
      shortageHorizon: true,
      express: true,
      shortageExpress: true,
      cvsCaremark: true,
      shortageCvsCaremark: true,
      ssc: true,
      shortageSsc: true,
      njMedicaid: true,
      shortageNjMedicaid: true,
      pdmi: true,
      shortagePdmi: true,
      optumrx: true,
      shortageOptumrx: true,

      // suppliers OFF
      kinray: false,
      realValueRx: false,
      parmed: false,
      axia: false,
      citymed: false,
      legacyHealth: false,
      ndcDistributors: false,
      trumarker: false,
    }))

    setSortRules([])
  }}
  className="rounded-md border px-3 py-1 text-xs hover:bg-gray-50"
>
  Reset Filters
</button>

          <button
  onClick={() => setOpenExportModal(true)}
  className="rounded-md border px-3 py-1 text-xs hover:bg-gray-50 flex items-center gap-1"
>
  Export
</button>

          <button onClick={() => setOpenFilter(false)}>
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 p-4 text-sm">
        {/* ================= COLUMNS ================= */}
        <div>
          <h4 className="mb-1 font-semibold uppercase text-xs">Columns</h4>

          {[
            ['ndc','NDC'],
            ['pkgSize','PKG SIZE'],
            ['rank','RANK'],
            ['totalOrdered','TOTAL ORDERED'],
            ['totalBilled','TOTAL BILLED'],
            ['totalShortage','TOTAL SHORTAGE'],
            ['highestShortage','HIGHEST SHORTAGE'],
            ['cost','COST'],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={columnFilters[key as keyof typeof columnFilters]}
                onChange={(e) =>
                  setColumnFilters(prev => ({ ...prev, [key]: e.target.checked }))
                }
                className="h-4 w-4 accent-emerald-700"
              />
              {label}
            </label>
          ))}

          <h4 className="mt- mb-2 font-semibold uppercase text-xs">Show Label</h4>

          {['SHOW ABERRANT', 'CONTROLLED', 'FILTER NDC PERIOD'].map(item => (
            <label key={item} className="flex items-center gap-2 py-1">
              <input type="checkbox" className="h-4 w-4 accent-emerald-700" />
              {item}
            </label>
          ))}

          <div className="mt-1 space-y-1">
            {[
              'VERTICAL HEADER',
              'REMOVE NDC DASH',
              "SHORT NDC'S ONLY",
              'INCLUDE SHORTAGE',
              'HIGHEST SHORTAGE NAME',
              'INCLUDE AMOUNT',
              'INCLUDE PBM RANK',
              'FILTER BY NOTE',
              'CASH DISABLED'
            ].map(item => (
              <div key={item} className="flex items-center justify-between">
                <span className="text-sm">{item}</span>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="peer sr-only" />
                  <div className="h-5 w-9 rounded-full bg-gray-300 peer-checked:bg-emerald-700 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-4" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* ================= BILLED ================= */}
        <div>
          <h4 className="mb-2 font-semibold uppercase text-xs flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500" />
            Billed
          </h4>

          {[
            'HORIZON HEALTH',
            'EXPRESS SCRIPTS',
            'CVS CAREMARK',
            'SS&C',
            'NJ MEDICAID',
            'PDMI',
            'OPTUMRX',
          ].map(item => (
            <label key={item} className="flex items-center gap-2 py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={billedFilters.includes(item)}
                onChange={(e) => {
  const checked = e.target.checked

  setBilledFilters(prev =>
    checked ? [...prev, item] : prev.filter(v => v !== item)
  )

  const cols = pbmToColumns[item as keyof typeof pbmToColumns]

  setColumnFilters(prev => ({
    ...prev,
    [cols[0]]: checked,
    [cols[1]]: checked,
  }))
}}

                className="h-4 w-4 accent-emerald-700"
              />
              {item}
            </label>
          ))}
        </div>

        {/* ================= SUPPLIERS ================= */}
          <div>
            <h4 className="mb-2 font-semibold uppercase text-xs flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-700" />
              Suppliers
            </h4>

            {[
              'KINRAY',
              'REAL VALUE RX',
              'PARMED',
              'AXIA',
              'CITYMED',
              'LEGACY HEALTH',
              'NDC DISTRIBUTORS',
              'TRUMARKER',
            ].map(item => (
              <label key={item} className="flex items-center gap-2 py-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={supplierFilters.includes(item)}
                  onChange={(e) => {
  const checked = e.target.checked

  setSupplierFilters(prev =>
    checked ? [...prev, item] : prev.filter(v => v !== item)
  )

  const colKey = supplierToColumnKey[item as keyof typeof supplierToColumnKey]

  setColumnFilters(prev => ({
    ...prev,
    [colKey]: checked,
  }))
}}

                  className="h-4 w-4 accent-emerald-700"
                />
                {item}
              </label>
            ))}
          </div>
      </div>
    </div>
  </>
)}

  {openExportModal && (
  <>
    <div className="fixed inset-0 z-[1200] bg-black/30" onClick={() => setOpenExportModal(false)} />

    <div
      className="fixed z-[1300] left-1/2 top-1/2 w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-5 shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b pb-2 mb-3">
        <h3 className="text-sm font-semibold uppercase">Export</h3>
        <button onClick={() => setOpenExportModal(false)}>
          <X className="h-4 w-4 text-gray-400 hover:text-gray-700" />
        </button>
      </div>

      <div className="space-y-4 text-sm">
        {/* Format */}
        <div>
          <div className="mb-1 font-semibold text-xs uppercase">Format</div>
          <div className="flex gap-3">
            {['excel', 'csv', 'pdf'].map(f => (
              <label key={f} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={exportFormat === f}
                  onChange={() => setExportFormat(f as any)}
                  className="accent-emerald-700"
                />
                {f.toUpperCase()}
              </label>
            ))}
          </div>
        </div>

        {/* Scope */}
        <div>
          <div className="mb-1 font-semibold text-xs uppercase">Rows</div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={exportScope === 'visible'}
              onChange={() => setExportScope('visible')}
              className="accent-emerald-700"
            />
            Visible rows only
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              checked={exportScope === 'all'}
              onChange={() => setExportScope('all')}
              className="accent-emerald-700"
            />
            All rows
          </label>
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <button onClick={() => setOpenExportModal(false)} className="rounded-md border px-4 py-1.5 text-xs">
          Cancel
        </button>
        <button
          onClick={() => {
            handleExport(exportFormat, exportScope)
            setOpenExportModal(false)
          }}
          className="rounded-md bg-emerald-800 px-5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
        >
          Download
        </button>
      </div>
    </div>
  </>
)}


        {openDrugTypeDropdown && (
          <>
            <div className="fixed inset-0 z-[999] bg-black/20" onClick={() => setOpenDrugTypeDropdown(false)} />
            <div className="fixed z-[1100] w-64 rounded-xl border border-gray-200 bg-white shadow-2xl" style={{ top: '78px', right: '220px' }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b px-3 py-2 text-xs font-semibold uppercase text-gray-700">
                DRUG TYPE
                <button onClick={() => setOpenDrugTypeDropdown(false)}><X className="h-3 w-3 text-gray-400 hover:text-gray-600" /></button>
              </div>
              <div className="p-3 space-y-2 text-sm">
                {[{ label: 'ALL DRUGS', count: null }, { label: 'BRANDS', count: 138 }, { label: 'GENERIC', count: 769 }].map(item => {
                  const checked = drugTypes.includes(item.label)
                  return (
                    <label key={item.label} className="flex items-center gap-2 py-1 cursor-pointer">
                      <input type="checkbox" checked={checked} onChange={() => {
                        setDrugTypes(prev => {
                          if (item.label === 'ALL DRUGS') return ['ALL DRUGS']
                          const next = prev.includes(item.label) ? prev.filter(v => v !== item.label) : [...prev.filter(v => v !== 'ALL DRUGS'), item.label]
                          return next.length ? next : ['ALL DRUGS']
                        })
                      }} className="h-4 w-4 accent-emerald-600" />
                      {item.label}
                      {item.count !== null && ` (${item.count})`}
                    </label>
                  )
                })}
              </div>
            </div>
          </>
        )}

        {openCreateTagModal && (
          <>
            <div className="fixed inset-0 z-[1200] bg-black/30" onClick={() => setOpenCreateTagModal(false)} />
            <div className="fixed z-[1300] left-1/2 top-1/2 w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Add New Tag</h3>
                <button onClick={() => setOpenCreateTagModal(false)}><X className="h-5 w-5 text-gray-400 hover:text-gray-600" /></button>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Tag Name</label>
                <input value={newTagName} onChange={(e) => setNewTagName(e.target.value)} placeholder="Write..." className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600" />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select color</label>
                <div className="flex flex-wrap gap-2">
                  {['yellow', 'lime', 'emerald', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose', 'red', 'orange', 'amber', 'gray', 'slate', 'zinc', 'neutral', 'black'].map(color => (
                    <button key={color} onClick={() => setNewTagColor(color)} className={`h-7 w-7 rounded-full border-2 ${newTagColor === color ? 'border-emerald-600' : 'border-transparent'}`} style={{
                      backgroundColor: color === 'yellow' ? '#facc15' : color === 'lime' ? '#a3e635' : color === 'emerald' ? '#10b981' : color === 'cyan' ? '#22d3ee' : color === 'sky' ? '#38bdf8' : color === 'blue' ? '#3b82f6' : color === 'indigo' ? '#6366f1' : color === 'violet' ? '#8b5cf6' : color === 'purple' ? '#a855f7' : color === 'fuchsia' ? '#d946ef' : color === 'pink' ? '#ec4899' : color === 'rose' ? '#f43f5e' : color === 'red' ? '#ef4444' : color === 'orange' ? '#fb923c' : color === 'amber' ? '#f59e0b' : color === 'gray' ? '#9ca3af' : color === 'slate' ? '#64748b' : color === 'zinc' ? '#a1a1aa' : color === 'neutral' ? '#a3a3a3' : '#000000',
                    }} />
                  ))}
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => {
                  if (!newTagName.trim()) return
                  setOpenCreateTagModal(false)
                  setNewTagName('')
                }} className="rounded-lg bg-emerald-800 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Save</button>
              </div>
            </div>
          </>
        )}

        {openFlagDropdown && (
          <>
            <div className="fixed inset-0 z-[999] bg-black/20" onClick={() => setOpenFlagDropdown(false)} />
            <div className="fixed z-[1000] w-64 rounded-xl border border-gray-200 bg-white shadow-2xl" style={{ top: '78px', left: '50%', transform: 'translateX(35%)' }}>
              <div className="flex items-center justify-between border-b px-3 py-2 text-xs font-semibold uppercase text-gray-700">
                FLAGS
                <button onClick={() => setOpenFlagDropdown(false)}><X className="h-3 w-3 text-gray-400 hover:text-gray-600" /></button>
              </div>
              <div className="p-3 space-y-2 text-sm">
                {[{ label: 'ABERRANT', count: 8 }, { label: 'CONTROLLED SUBSTANCE', count: 34 }].map(item => (
                  <label key={item.label} className="flex items-center gap-2 py-1">
                    <input type="checkbox" className="h-4 w-4 accent-emerald-600" />
                    {item.label} ({item.count})
                  </label>
                ))}
                <div className="ml-5 mt-1 space-y-1">
                  {[{ label: 'CI', count: 0 }, { label: 'CII', count: 15 }, { label: 'CIII', count: 3 }, { label: 'CIV', count: 11 }, { label: 'CV', count: 5 }].map(item => (
                    <label key={item.label} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="h-4 w-4 accent-emerald-600" />
                      {item.label} ({item.count})
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {openTagsDropdown && (
          <>
            <div className="fixed inset-0 z-[999] bg-black/20" onClick={() => { setOpenTagsDropdown(false); setOpenTagMenuId(null) }} />
            <div className="fixed z-[1000] w-72 rounded-xl border border-gray-200 bg-white shadow-2xl" style={{ top: '78px', left: '50%', transform: 'translateX(80%)' }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between border-b px-3 py-2 text-xs font-semibold uppercase text-gray-700">
                TAGS
                <button className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:underline" onClick={(e) => { e.stopPropagation(); setOpenCreateTagModal(true) }}>+ Create Tag</button>
              </div>
              <div className="max-h-80 overflow-y-auto p-3 space-y-2">
                {[{ id: 'caremark', label: 'Caremark', color: 'emerald', count: 0 }, { id: 'oxy', label: 'OXY OPTUM', color: 'cyan', count: 0 }, { id: 'skip', label: 'taken care, skip', color: 'zinc', count: 0 }, { id: 'need', label: 'need to buy', color: 'rose', count: 0 }, { id: 'parmed', label: 'parmed', color: 'zinc', count: 0 }, { id: 'ordered', label: 'ORDERED', color: 'lime', count: 0 }].map(tag => (
                  <div key={tag.id} className="flex items-center justify-between gap-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 accent-emerald-600" />
                      <span className={`inline-flex items-center gap-2 rounded-full border px-2 py-0.5 text-xs font-semibold ${
                        tag.color === 'emerald' ? 'border-emerald-400 bg-emerald-50 text-emerald-700' : tag.color === 'cyan' ? 'border-cyan-400 bg-cyan-50 text-cyan-700' : tag.color === 'rose' ? 'border-rose-400 bg-rose-50 text-rose-700' : tag.color === 'lime' ? 'border-lime-400 bg-lime-50 text-lime-700' : 'border-gray-300 bg-gray-100 text-gray-700'
                      }`}>
                        {tag.label}
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-gray-700">{tag.count}</span>
                      </span>
                    </label>
                    <div className="relative">
                      <button onClick={(e) => { e.stopPropagation(); setOpenTagMenuId(prev => prev === tag.id ? null : tag.id) }} className="p-1 text-gray-400 hover:text-gray-700">⋮</button>
                      {openTagMenuId === tag.id && (
                        <div className="absolute right-0 top-6 z-[1100] w-28 rounded-md border bg-white shadow-md">
                          <button className="block w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50">Edit</button>
                          <button className="block w-full px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50">Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {openQtyDropdown && (
          <>
            <div className="fixed inset-0 z-[999] bg-black/20" onClick={() => setOpenQtyDropdown(false)} />
            <div className="fixed z-[1000] w-48 rounded-lg border border-gray-200 bg-white shadow-2xl" style={{ top: '78px', left: '50%', transform: 'translateX(250%)' }}>
              <div className="flex items-center justify-between border-b px-3 py-2 text-xs font-semibold uppercase text-gray-700">
                Quantity Type
                <button onClick={() => setOpenQtyDropdown(false)}><X className="h-3 w-3 text-gray-400 hover:text-gray-600" /></button>
              </div>
              <button onClick={() => { setQtyType('UNIT'); setOpenQtyDropdown(false) }} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50">
                <span className={`h-4 w-4 rounded border flex items-center justify-center ${qtyType === 'UNIT' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300'}`}>
                  {qtyType === 'UNIT' && '✓'}
                </span>
                UNIT
              </button>
              <button onClick={() => { setQtyType('PKG SIZE'); setOpenQtyDropdown(false) }} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50">
                <span className={`h-4 w-4 rounded border flex items-center justify-center ${qtyType === 'PKG SIZE' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300'}`}>
                  {qtyType === 'PKG SIZE' && '✓'}
                </span>
                PKG SIZE
              </button>
            </div>
          </>
        )}

        {/* Drug Details Sidebar */}
  {openDrugSidebar && (
    <>
      <div
        className="fixed inset-0 z-[1500] bg-black/20"
        onClick={() => setOpenDrugSidebar(false)}
      />

      <div className="fixed right-0 top-0 z-[1600] h-full w-[520px] bg-white shadow-2xl border-l border-gray-200 animate-slideIn overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 border-b">
          <button onClick={() => setOpenDrugSidebar(false)}>
            <X className="w-5 h-5 text-gray-600 hover:text-black" />
          </button>
          <span className="text-sm font-semibold uppercase">
            {activeDrug?.drugName}
          </span>
        </div>

        <div className="p-5 space-y-5 text-sm">
          {/* Top Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs uppercase text-gray-500">NDC</div>
              <div className="font-semibold">{activeDrug?.ndc}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-emerald-800">Drug Name</div>
              <div className="font-semibold">{activeDrug?.drugName}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-gray-500">Total Qty</div>
              <div className="font-semibold">
                {formatNumber(activeDrug?.totalOrdered || 0)}
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-[80px_1fr_80px] items-center gap-3">
            <div>
              <div className="text-xs uppercase text-emerald-800">Start</div>
              <div className="font-semibold">{`09/${String(Math.round((dateStart / 100) * 30) + 1).padStart(2, '0')}/2025`}</div>
            </div>

            <div ref={sliderRef} className="relative h-2 bg-gray-200 rounded-full">
    {/* Active range bar */}
    <div
      className="absolute top-0 h-2 rounded-full bg-emerald-600"
      style={{ left: `${dateStart}%`, width: `${dateEnd - dateStart}%` }}
    />

    {/* Start handle */}
    <div
      onMouseDown={handleSliderMouseDown('start')}
      className="absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-2 border-emerald-700 bg-white cursor-ew-resize"
      style={{ left: `${dateStart}%` }}
    />

    {/* End handle */}
    <div
      onMouseDown={handleSliderMouseDown('end')}
      className="absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-2 border-emerald-700 bg-white cursor-ew-resize"
      style={{ left: `${dateEnd}%` }}
    />
  </div>


            <div className="text-right">
              <div className="text-xs uppercase text-emerald-800">End</div>
              <div className="font-semibold">{`12/${String(Math.round((dateEnd / 100) * 30) + 1).padStart(2, '0')}/2025`}</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b">
            <button className="pb-2 border-b-2 border-emerald-800 font-semibold">
              Current Date Range
              <span className="ml-2 rounded-full bg-emerald-800 text-white px-2 py-0.5 text-xs">10</span>
            </button>
            <button className="pb-2 text-gray-500">
              Outside Date Range
              <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs">0</span>
            </button>
          </div>

          {/* Include billed */}
          <label className="flex items-center gap-2">
            <input type="checkbox" className="h-4 w-4 accent-emerald-700" />
            INCLUDE BILLED
          </label>

          {/* Transactions Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-[40px_1.2fr_1fr_0.6fr_0.4fr] bg-gray-50 text-xs font-semibold uppercase px-3 py-2 border-b">
              <div>#</div>
              <div className="flex items-center gap-1">Type ↕</div>
              <div className="flex items-center gap-1">Date ↕</div>
              <div className="flex items-center justify-end gap-1">Qty ↕</div>
              <div className="flex items-center justify-end gap-1">RT ↕</div>
            </div>

            {[1,2,3,4,5,6,7,8,9,10].map(i => (
              <div key={i} className="grid grid-cols-[40px_1.2fr_1fr_0.6fr_0.4fr] px-3 py-2 border-b last:border-b-0">
                <div>{i}</div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                  {i === 10 ? 'MCKESSON' : 'KINRAY'}
                </div>
                <div>{i < 9 ? `09/${String(i + 2).padStart(2,'0')}/2025` : '12/19/2025'}</div>
                <div className="text-right">{i % 2 === 0 ? 2 : 1}</div>
                <div className="text-right text-emerald-700 font-semibold">{i + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )}



        <div className="border-b border-gray-200 bg-gray-100 overflow-x-auto scrollbar-hide">
          <div className="flex items-center px-3 py-2 gap-3 min-w-max">
            <div className="flex items-center gap-0.5">
              <button className="p-1 hover:bg-gray-100 rounded transition-colors"><ChevronLeft className="w-5 h-5 text-gray-500" /></button>
              <button className="p-1 hover:bg-gray-100 rounded transition-colors"><RotateCw className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="flex flex-col min-w-fit">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[#18634a]">Inventory Report</span>
              <div className="mt-1 inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-2.5">
                <span className="text-xs font-bold text-gray-800">SEP 1, 2025 - JAN 26, 2026</span>
              </div>
            </div>
            <div className="flex flex-col min-w-fit">
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                <span className="text-[11px] font-semibold uppercase text-[#18634a]">Inventory Dates</span>
              </div>
              <div className="mt-1 flex items-center gap-1">
                <div className="rounded-md border border-gray-200 bg-white px-2 -py-1 text-center">
                  <span className="block text-[9.5px] font-semibold uppercase text-red-500 translate-y-0.5">Start</span>
                  <span className="text-[11px] font-semibold text-gray-800">09/01/2025</span>
                </div>
                <div className="rounded-md border border-gray-200 bg-white px-2 -py-1 text-center">
                  <span className="block text-[9.5px] font-semibold uppercase text-red-500">End</span>
                  <span className="text-[11px] font-semibold text-gray-800">01/26/2026</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col min-w-fit">
              <div className="flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-semibold uppercase text-[#18634a]">Wholesaler Dates</span>
              </div>
              <div className="mt-1 flex items-center gap-1">
                <div className="rounded-md border border-gray-200 bg-white px-2 -py-1 text-center">
                  <span className="block text-[9.5px] font-semibold uppercase text-emerald-600">Start</span>
                  <span className="text-[11px] font-semibold text-gray-800">09/01/2025</span>
                </div>
                <div className="rounded-md border border-gray-200 bg-white px-2 -py-1 text-center">
                  <span className="block text-[9.5px] font-semibold uppercase text-emerald-600">End</span>
                  <span className="text-[11px] font-semibold text-gray-800">01/26/2026</span>
                </div>
              </div>
            </div>
            <div className="flex items-center translate-y-2 translate-x-5 shadow-sm rounded-xl">
              <div className="flex items-center border border-gray-300 rounded-l-xl bg-white">
                <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-60 h-10 px-4 py-1.5 text-semibold text-gray-700 placeholder-gray-400 focus:outline-none" />
                <button onClick={() => setSearchQuery('')} className="px-2 text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
              </div>
              <button className="h-10 px-3 bg-emerald-800 text-white rounded-r-xl hover:bg-emerald-700 transition-colors border border-emerald-600"><Search className="w-5 h-5" /></button>
            </div>
            <div className="flex items-center gap-3 translate-x-10">
              <div className="relative flex flex-col">
                <span className="text-[11px] font-semibold uppercase text-[#0F3D2E]">Filter</span>
                <button onClick={() => setOpenFilter(v => !v)} className="mt-1 inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-2 text-xs text-[#0F3D2E]/50 hover:text-[#0F3D2E] hover:border-gray-300">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="uppercase text-[11px] font-medium tracking-wide text-[#0F3D2E]/40">CHOOSE</span>
                  <ChevronDown className="w-3 h-3 text-[#0F3D2E]/40" />
                </button>
              </div>
              <div className="relative flex flex-col">
                <span className="text-[11px] font-semibold uppercase text-[#0F3D2E]">Flag</span>
                <button onClick={() => setOpenFlagDropdown(v => !v)} className="mt-1 inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-2 text-xs text-[#0F3D2E]/50 hover:text-[#0F3D2E] hover:border-gray-300">
                  <span className="uppercase text-[11px] font-medium tracking-wide text-[#0F3D2E]/40">CHOOSE</span>
                  <ChevronDown className="w-3 h-3 text-[#0F3D2E]/40" />
                </button>
              </div>
              <div className="relative flex flex-col">
                <span className="text-[11px] font-semibold uppercase text-[#0F3D2E]">Tags</span>
                <button type="button" onClick={(e) => { e.stopPropagation(); setOpenTagsDropdown(prev => !prev) }} className="mt-1 inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-2 text-xs text-[#0F3D2E]/50 hover:text-[#0F3D2E] hover:border-gray-300">
                  <span className="uppercase text-[11px] font-medium tracking-wide text-[#0F3D2E]/40">CHOOSE</span>
                  <ChevronDown className="w-3 h-3 text-[#0F3D2E]/40" />
                </button>
              </div>
              <div className="relative flex flex-col">
                <span className="text-[11px] font-semibold uppercase text-[#0F3D2E]">Qty Type</span>
                {qtyType ? (
                  <div className="mt-1 inline-flex items-center gap-1 rounded-md border border-emerald-600 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 min-w-max">
                    <span className="whitespace-nowrap">{qtyType}</span>
                    <button onClick={() => setQtyType(null)} className="rounded hover:bg-emerald-50"><X className="h-3 w-3" /></button>
                  </div>
                ) : (
                  <button onClick={() => setOpenQtyDropdown(v => !v)} className="mt-1 inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-2 text-xs text-gray-500 hover:text-gray-800 hover:border-gray-300">
                    CHOOSE
                    <ChevronDown className="h-3 w-3" />
                  </button>
                )}
              </div>
              <div className="relative flex flex-col">
                <span className="text-[10px] font-semibold uppercase text-[#0F3D2E]">Drug Type</span>
                <button type="button" onClick={(e) => { e.stopPropagation(); setOpenDrugTypeDropdown(v => !v); setOpenFilter(false); setOpenFlagDropdown(false); setOpenTagsDropdown(false); setOpenQtyDropdown(false) }} className="mt-1 inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-2 text-xs text-gray-500 hover:text-gray-800 hover:border-gray-300">
                  <span>{drugTypes.length ? drugTypes.join(', ') : 'ALL DRUGS'}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold uppercase text-[#0F3D2E]">Drug Cost</span>
                <input type="number" placeholder="$ COST" value={costValue} onChange={(e) => setCostValue(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 h-[34px] w-[110px] rounded-md border border-emerald-600 bg-white px-2 py-1.5 text-xs font-semibold text-emerald-700 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-600" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-semibold uppercase text-[#0F3D2E]">Rows</span>
                <div className="mt-1 inline-flex items-center justify-center rounded-md border border-emerald-600 bg-white px-3 py-2 text-xs font-bold text-emerald-700">{inventoryData.length}</div>
              </div>
            </div>
          </div>
        </div>

      <div className="overflow-x-auto w-full">
           <div className="inline-block w-fit">
            {/* Table Header */}
            <div className="border-t border-b border-gray-400 bg-gray-50">
              <div className="flex text-[11px] font-semibold text-gray-700 uppercase h-[40px] items-center border-r border-gray-400">
                <div style={{ width: columnWidths.checkbox, minWidth: columnWidths.checkbox }} className="flex-shrink-0 flex items-center justify-center border-r border-gray-400 py-3">
                  <input type="checkbox" checked={selectedRows.length === inventoryData.length} onChange={toggleAllRows} className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                </div>
                {columnFilters.ndc && (
                <div style={{ width: columnWidths.ndc, minWidth: columnWidths.ndc }} className="flex-shrink-0 border-r border-gray-400 relative group">
                  <div className="px-3 py-3 flex items-center justify-center gap-1">
                    <HeaderCell
    sortKey="ndc"
    sortRules={sortRules}
    onSort={toggleSort}
  >
    NDC
  </HeaderCell>


                    <ChevronDown className="w-3 h-3" />
                  </div>
                  <div onMouseDown={(e) => handleResizeStart(e, 'ndc')} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300" />
                </div>
                )}


                {columnFilters.drugName && (
                <div style={{ width: columnWidths.drugName, minWidth: columnWidths.drugName }} className="flex-shrink-0 border-r border-gray-400 relative group">
                  <div className="px-3 py-3 flex items-center gap-1">
                    <HeaderCell
    sortKey="drugName"
    sortRules={sortRules}
    onSort={toggleSort}
  >
    DRUG NAME
  </HeaderCell>

                    <ChevronDown className="w-3 h-3" />
                  </div>
                  <div onMouseDown={(e) => handleResizeStart(e, 'drugName')} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300" />
                </div>
                )}

  {[
    ['rank','RANK', null],
    ['pkgSize','PKG SIZE', null],
    ['totalOrdered','TOTAL ORDERED', 'green'],
    ['totalBilled','TOTAL BILLED', 'yellow'],
    ['totalShortage','TOTAL SHORTAGE', 'red'],
    ['highestShortage','HIGHEST SHORTAGE', 'yellow'],
    ['cost','COST', null],
    ['horizon','BILLED HORIZON', 'red'],
    ['shortageHorizon','SHORTAGE HORIZON', 'yellow'],
    ['express','BILLED EXPRESS', 'red'],
    ['shortageExpress','SHORTAGE EXPRESS', 'yellow'],
  ].map(([key, label, dotColor]) => (
    columnFilters[key as keyof typeof columnFilters] && (
      <div
        key={key}
        style={{ width: columnWidths[key as keyof typeof columnWidths], minWidth: columnWidths[key as keyof typeof columnWidths] }}
        className="flex-shrink-0 border-r border-gray-400 relative group"
      >
        <HeaderCell
          sortKey={key as keyof typeof inventoryData[number]}
          sortRules={sortRules}
          onSort={toggleSort}
        >
          <div className="flex items-center gap-1">
            {dotColor && (
              <div className={`w-2 h-2 rounded-full ${
                dotColor === 'red' ? 'bg-red-500' :
                dotColor === 'yellow' ? 'bg-yellow-400' :
                dotColor === 'green' ? 'bg-emerald-500' : ''
              }`} />
            )}
            {label}
          </div>
        </HeaderCell>

        <div
          onMouseDown={(e) => handleResizeStart(e, key)}
          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300"
        />
      </div>
    )
  ))}

  {Object.entries(supplierToColumnKey).map(([label, key]) =>
  columnFilters[key] && (
    <div
      key={key}
      style={{ width: columnWidths[key], minWidth: columnWidths[key] }}
      className="flex-shrink-0 border-r border-gray-400 relative group"
    >
      <HeaderCell
        sortKey={key as keyof typeof inventoryData[number]}
        sortRules={sortRules}
        onSort={toggleSort}
      >
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          {label}
        </div>
      </HeaderCell>

      <div
        onMouseDown={(e) => handleResizeStart(e, key)}
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300"
      />
    </div>
  )
)}




              {columnFilters.pdmi && (
                <div style={{ width: columnWidths.pdmi, minWidth: columnWidths.pdmi }} className="flex-shrink-0 border-r border-gray-400 relative group">
                  <div className="h-[40px] flex flex-col items-center justify-center text-center whitespace-nowrap leading-tight select-none">
    <div
      onClick={(e) => toggleSort('shortagePdmi', e)}
      className="flex items-center gap-1 mb-0.5 cursor-pointer hover:text-emerald-700"
    >
      <div className="w-2 h-2 rounded-full bg-orange-400" />
      <span className="text-[11px] font-semibold uppercase text-gray-700">
        SHORTAGE
      </span>
      <SortIcon dir={sortRules.find(r => r.key === 'shortagePdmi')?.dir} />
    </div>
    <span className="text-[10px] uppercase text-gray-600">
      PDMI (CO-PAY CARD)
    </span>
  </div>


                  <div onMouseDown={(e) => handleResizeStart(e, 'pdmi')} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300" />
                </div>
              )}

              {columnFilters.shortagePdmi && (
                <div style={{ width: columnWidths.shortagePdmi, minWidth: columnWidths.shortagePdmi }} className="flex-shrink-0 border-r border-gray-400 relative group">
                  <div className="px-2 h-[40px] flex flex-col items-center justify-center text-center whitespace-nowrap leading-none">
    <div className="flex items-center gap-1 mb-0.5">
      <div className="w-2 h-2 rounded-full bg-orange-400" />
      <span className="text-[11px] font-semibold uppercase text-gray-700">SHORTAGE</span>
      <SortIcon />
    </div>
    <span className="text-[10px] uppercase text-gray-600">
      PDMI (CO-PAY CARD)
    </span>
  </div>

                  <div onMouseDown={(e) => handleResizeStart(e, 'shortagePdmi')} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300" />
                </div>
              )}

              {columnFilters.optumrx && (
                <div style={{ width: columnWidths.optumrx, minWidth: columnWidths.optumrx }} className="flex-shrink-0 border-r border-gray-400 relative group">
                  <div className="h-[40px] flex flex-col items-center justify-center text-center whitespace-nowrap leading-tight select-none">
    <div
      onClick={(e) => toggleSort('optumrx', e)}
      className="flex items-center gap-1 mb-0.5 cursor-pointer hover:text-emerald-700"
    >
      <div className="w-2 h-2 rounded-full bg-red-500" />
      <span className="text-[11px] font-semibold uppercase text-gray-700">
        BILLED
      </span>
      <SortIcon dir={sortRules.find(r => r.key === 'optumrx')?.dir} />
    </div>
    <span className="text-[10px] uppercase text-gray-600">
      OPTUMRX
    </span>
  </div>


                  <div onMouseDown={(e) => handleResizeStart(e, 'optumrx')} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300" />
                </div>
              )}

              {columnFilters.shortageOptumrx && (
                <div style={{ width: columnWidths.shortageOptumrx, minWidth: columnWidths.shortageOptumrx }} className="flex-shrink-0 border-r border-gray-400 relative group">
                <div className="h-[40px] flex flex-col items-center justify-center text-center whitespace-nowrap leading-tight select-none">
    <div
      onClick={(e) => toggleSort('shortageOptumrx', e)}
      className="flex items-center gap-1 mb-0.5 cursor-pointer hover:text-emerald-700"
    >
      <div className="w-2 h-2 rounded-full bg-orange-400" />
      <span className="text-[11px] font-semibold uppercase text-gray-700">
        SHORTAGE
      </span>
      <SortIcon dir={sortRules.find(r => r.key === 'shortageOptumrx')?.dir} />
    </div>
    <span className="text-[10px] uppercase text-gray-600">
      OPTUMRX
    </span>
  </div>


                  <div onMouseDown={(e) => handleResizeStart(e, 'shortageOptumrx')} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300" />
                </div>
              )}

              {columnFilters.cvsCaremark && (
                <div style={{ width: columnWidths.cvsCaremark, minWidth: columnWidths.cvsCaremark }} className="flex-shrink-0 border-r border-gray-400 relative group">
                  <div className="h-[40px] flex flex-col items-center justify-center text-center whitespace-nowrap leading-tight select-none">
    <div
      onClick={(e) => toggleSort('cvsCaremark', e)}
      className="flex items-center gap-1 mb-0.5 cursor-pointer hover:text-emerald-700"
    >
      <div className="w-2 h-2 rounded-full bg-red-500" />
      <span className="text-[11px] font-semibold uppercase text-gray-700">
        BILLED
      </span>
      <SortIcon dir={sortRules.find(r => r.key === 'cvsCaremark')?.dir} />
    </div>
    <span className="text-[10px] uppercase text-gray-600">
      CVS CAREMARK
    </span>
  </div>


                  <div onMouseDown={(e) => handleResizeStart(e, 'cvsCaremark')} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300" />
                </div>
              )}

              {columnFilters.shortageCvsCaremark && (
                <div style={{ width: columnWidths.shortageCvsCaremark, minWidth: columnWidths.shortageCvsCaremark }} className="flex-shrink-0 border-r border-gray-400 relative group">
                  <div className="h-[40px] flex flex-col items-center justify-center text-center whitespace-nowrap leading-tight select-none">
    <div
      onClick={(e) => toggleSort('shortageCvsCaremark', e)}
      className="flex items-center gap-1 mb-0.5 cursor-pointer hover:text-emerald-700"
    >
      <div className="w-2 h-2 rounded-full bg-orange-400" />
      <span className="text-[11px] font-semibold uppercase text-gray-700">
        SHORTAGE
      </span>
      <SortIcon dir={sortRules.find(r => r.key === 'shortageCvsCaremark')?.dir} />
    </div>
    <span className="text-[10px] uppercase text-gray-600">
      CVS CAREMARK
    </span>
  </div>


                  <div onMouseDown={(e) => handleResizeStart(e, 'shortageCvsCaremark')} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300" />
                </div>
              )}

              {columnFilters.ssc && (
                <div style={{ width: columnWidths.ssc, minWidth: columnWidths.ssc }} className="flex-shrink-0 border-r border-gray-400 relative group">
                  <div className="h-[40px] flex flex-col items-center justify-center text-center whitespace-nowrap leading-tight select-none">
    <div
      onClick={(e) => toggleSort('ssc', e)}
      className="flex items-center gap-1 mb-0.5 cursor-pointer hover:text-emerald-700"
    >
      <div className="w-2 h-2 rounded-full bg-red-500" />
      <span className="text-[11px] font-semibold uppercase text-gray-700">
        BILLED
      </span>
      <SortIcon dir={sortRules.find(r => r.key === 'ssc')?.dir} />
    </div>
    <span className="text-[10px] uppercase text-gray-600">
      SS&C (HUMANA, ARGUS, DST)
    </span>
  </div>


                  <div onMouseDown={(e) => handleResizeStart(e, 'ssc')} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300" />
                </div>
              )}

              {columnFilters.shortageSsc && (
                <div style={{ width: columnWidths.shortageSsc, minWidth: columnWidths.shortageSsc }} className="flex-shrink-0 border-r border-gray-400 relative group">
                  <div className="h-[40px] flex flex-col items-center justify-center text-center whitespace-nowrap leading-tight select-none">
    <div
      onClick={(e) => toggleSort('shortageSsc', e)}
      className="flex items-center gap-1 mb-0.5 cursor-pointer hover:text-emerald-700"
    >
      <div className="w-2 h-2 rounded-full bg-orange-400" />
      <span className="text-[11px] font-semibold uppercase text-gray-700">
        SHORTAGE
      </span>
      <SortIcon dir={sortRules.find(r => r.key === 'shortageSsc')?.dir} />
    </div>
    <span className="text-[10px] uppercase text-gray-600">
      SS&C (HUMANA, ARGUS, DST)
    </span>
  </div>


                  <div onMouseDown={(e) => handleResizeStart(e, 'shortageSsc')} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300" />
                </div>
              )}

              {columnFilters.njMedicaid && (
                <div style={{ width: columnWidths.njMedicaid, minWidth: columnWidths.njMedicaid }} className="flex-shrink-0 border-r border-gray-400 relative group">
                  <div className="h-[40px] flex flex-col items-center justify-center text-center whitespace-nowrap leading-tight select-none">
    <div
      onClick={(e) => toggleSort('njMedicaid', e)}
      className="flex items-center gap-1 mb-0.5 cursor-pointer hover:text-emerald-700"
    >
      <div className="w-2 h-2 rounded-full bg-red-500" />
      <span className="text-[11px] font-semibold uppercase text-gray-700">
        BILLED
      </span>
      <SortIcon dir={sortRules.find(r => r.key === 'njMedicaid')?.dir} />
    </div>
    <span className="text-[10px] uppercase text-gray-600">
      NJ MEDICAID
    </span>
  </div>


                  <div onMouseDown={(e) => handleResizeStart(e, 'njMedicaid')} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300" />
                </div>
              )}

              {columnFilters.shortageNjMedicaid && (
                <div style={{ width: columnWidths.shortageNjMedicaid, minWidth: columnWidths.shortageNjMedicaid }} className="flex-shrink-0 relative group">
                  <div className="h-[40px] flex flex-col items-center justify-center text-center whitespace-nowrap leading-tight select-none">
    <div
      onClick={(e) => toggleSort('shortageNjMedicaid', e)}
      className="flex items-center gap-1 mb-0.5 cursor-pointer hover:text-emerald-700"
    >
      <div className="w-2 h-2 rounded-full bg-orange-400" />
      <span className="text-[11px] font-semibold uppercase text-gray-700">
        SHORTAGE
      </span>
      <SortIcon dir={sortRules.find(r => r.key === 'shortageNjMedicaid')?.dir} />
    </div>
    <span className="text-[10px] uppercase text-gray-600">
      NJ MEDICAID
    </span>
  </div>


                  <div onMouseDown={(e) => handleResizeStart(e, 'shortageNjMedicaid')} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300" />
                </div>
              )}
              </div>
            </div>

            {/* Table Body */}
            <div>
              {sortedData.map((row, index) => (
                <div
  key={row.id}
  className={`flex text-sm border-b border-r border-gray-300 ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors text-[12px] leading-[1.05] h-[30px]`}
>

                  <div style={{ width: columnWidths.checkbox, minWidth: columnWidths.checkbox }} className="flex-shrink-0 flex items-center justify-center border border-gray-400 py-2">
                    <input type="checkbox" checked={selectedRows.includes(row.id)} onChange={() => toggleRowSelection(row.id)} className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                  </div>

                {columnFilters.ndc && (
                  <div style={{ width: columnWidths.ndc, minWidth: columnWidths.ndc }} className="flex-shrink-0 border-r border-gray-400 px-1 py-2 overflow-hidden whitespace-nowrap ">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <div className="flex items-center -gap-1">
                        <button className="p-0.5 hover:bg-gray-200 rounded text-gray-400">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" /></svg>
                        </button>
                        <button className="p-0.5 hover:bg-gray-200 rounded text-gray-400"><Search className="w-3 h-3" /></button>
                        <button className="p-0.5 hover:bg-gray-200 rounded text-gray-400">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" /></svg>
                        </button>
                      </div>
                      <span className="text-gray-600 whitespace-nowrap truncate">{row.ndc}</span>
                    </div>
                  </div>
                )}

                  <div style={{ width: columnWidths.drugName, minWidth: columnWidths.drugName }} className="flex-shrink-0 border-r border-gray-400 px-3 py-2 last:border-r-0">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        <button className="p-0.5 hover:bg-gray-200 rounded text-gray-400">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" /></svg>
                        </button>
                        <button className="p-0.5 hover:bg-gray-200 rounded text-gray-400"><Search className="w-3 h-3" /></button>
                        <button className="p-0.5 hover:bg-gray-200 rounded text-gray-400">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                        </button>
                        <button className="p-0.5 hover:bg-gray-200 rounded text-gray-400">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" /></svg>
                        </button>
                      </div>
                      <button
    onClick={() => {
      setActiveDrug(row)
      setOpenDrugSidebar(true)
    }}
    className="text-gray-900 hover:underline text-left"
  >
    {row.drugName}
  </button>

                    </div>
                  </div>

                {columnFilters.rank && (
    <div style={{ width: columnWidths.rank, minWidth: columnWidths.rank }} className="flex-shrink-0 border-r border-gray-400 px-2 h-[30px] flex items-center justify-center text-center last:border-r-0"
>
      {row.rank}
    </div>
  )}

  {columnFilters.pkgSize && (
    <div style={{ width: columnWidths.pkgSize, minWidth: columnWidths.pkgSize }} className="flex-shrink-0 border-r border-gray-400 px-2 h-[30px] flex items-center justify-center text-center last:border-r-0"
>
      {row.pkgSize}
    </div>
  )}

  {columnFilters.totalOrdered && (
    <div style={{ width: columnWidths.totalOrdered, minWidth: columnWidths.totalOrdered }} className="flex-shrink-0 border-r border-gray-400 px-2 h-[30px] flex items-center justify-center text-center last:border-r-0"
>
      {formatNumber(row.totalOrdered)}
    </div>
  )}

  {columnFilters.totalBilled && (
    <div style={{ width: columnWidths.totalBilled, minWidth: columnWidths.totalBilled }} className="flex-shrink-0 border-r border-gray-400 px-2 h-[30px] flex items-center justify-center text-center last:border-r-0"
>
      {formatNumber(row.totalBilled)}
    </div>
  )}

  {columnFilters.totalShortage && (
    <div style={{ width: columnWidths.totalShortage, minWidth: columnWidths.totalShortage }} className="flex-shrink-0 border-r border-gray-400 px-2 h-[30px] flex items-center justify-center text-center last:border-r-0"
>
      {renderShortageValue(row.totalShortage)}
    </div>
  )}

  {columnFilters.highestShortage && (
    <div style={{ width: columnWidths.highestShortage, minWidth: columnWidths.highestShortage }} className="flex-shrink-0 border-r border-gray-400 px-2 h-[30px] flex items-center justify-center text-center last:border-r-0"
>
      {renderShortageValue(row.highestShortage)}
    </div>
  )}

  {columnFilters.cost && (
    <div style={{ width: columnWidths.cost, minWidth: columnWidths.cost }} className="flex-shrink-0 border-r border-gray-400 px-2 h-[30px] flex items-center justify-center text-center last:border-r-0"
>
      ${row.cost}
    </div>
  )}

  {columnFilters.horizon && (
    <div style={{ width: columnWidths.horizon, minWidth: columnWidths.horizon }} className="flex-shrink-0 border-r border-gray-400 px-2 h-[30px] flex items-center justify-center text-center last:border-r-0"
>
      {row.horizon}
    </div>
  )}

  {columnFilters.shortageHorizon && (
    <div style={{ width: columnWidths.shortageHorizon, minWidth: columnWidths.shortageHorizon }} className="flex-shrink-0 border-r border-gray-400 px-2 h-[30px] flex items-center justify-center text-center last:border-r-0"
>
      {renderShortageValue(row.shortageHorizon)}
    </div>
  )}

  {columnFilters.express && (
    <div style={{ width: columnWidths.express, minWidth: columnWidths.express }} className="flex-shrink-0 border-r border-gray-400 px-2 h-[30px] flex items-center justify-center text-center last:border-r-0"
>
      {row.express}
    </div>
  )}

  {columnFilters.shortageExpress && (
    <div style={{ width: columnWidths.shortageExpress, minWidth: columnWidths.shortageExpress }} className="flex-shrink-0 border-r border-gray-400 px-2 h-[30px] flex items-center justify-center text-center last:border-r-0"
>
      {renderShortageValue(row.shortageExpress)}
    </div>
  )}

  {columnFilters.pdmi && (
    <div style={{ width: columnWidths.pdmi, minWidth: columnWidths.pdmi }} className="flex-shrink-0 border-r border-gray-400 px-2 h-[30px] flex items-center justify-center text-center last:border-r-0"
>
      {row.pdmi}
    </div>
  )}

  {columnFilters.shortagePdmi && (
    <div style={{ width: columnWidths.shortagePdmi, minWidth: columnWidths.shortagePdmi }} className="flex-shrink-0 border-r border-gray-400 px-2 h-[30px] flex items-center justify-center text-center last:border-r-0"
>
      {renderShortageValue(row.shortagePdmi)}
    </div>
  )}

  {columnFilters.optumrx && (
    <div style={{ width: columnWidths.optumrx, minWidth: columnWidths.optumrx }} className="flex-shrink-0 border-r border-gray-400 px-2 h-[30px] flex items-center justify-center text-center last:border-r-0"
>
      {row.optumrx}
    </div>
  )}

  {columnFilters.shortageOptumrx && (
    <div style={{ width: columnWidths.shortageOptumrx, minWidth: columnWidths.shortageOptumrx }} className="flex-shrink-0 border-r border-gray-400 px-2 h-[30px] flex items-center justify-center text-center last:border-r-0"
>
      {renderShortageValue(row.shortageOptumrx)}
    </div>
  )}

  {columnFilters.cvsCaremark && (
    <div style={{ width: columnWidths.cvsCaremark, minWidth: columnWidths.cvsCaremark }} className="flex-shrink-0 border-r border-gray-400 px-2 h-[30px] flex items-center justify-center text-center last:border-r-0"
>
      {row.cvsCaremark}
    </div>
  )}

  {columnFilters.shortageCvsCaremark && (
    <div style={{ width: columnWidths.shortageCvsCaremark, minWidth: columnWidths.shortageCvsCaremark }} className="flex-shrink-0 border-r border-gray-400 px-2 h-[30px] flex items-center justify-center text-center last:border-r-0"
>
      {renderShortageValue(row.shortageCvsCaremark)}
    </div>
  )}

  {columnFilters.ssc && (
    <div style={{ width: columnWidths.ssc, minWidth: columnWidths.ssc }} className="flex-shrink-0 border-r border-gray-400 px-2 h-[30px] flex items-center justify-center text-center last:border-r-0"
>
      {row.ssc}
    </div>
  )}

  {columnFilters.shortageSsc && (
    <div style={{ width: columnWidths.shortageSsc, minWidth: columnWidths.shortageSsc }} className="flex-shrink-0 border-r border-gray-400 px-2 h-[30px] flex items-center justify-center text-center last:border-r-0"
>
      {renderShortageValue(row.shortageSsc)}
    </div>
  )}

  {columnFilters.njMedicaid && (
    <div style={{ width: columnWidths.njMedicaid, minWidth: columnWidths.njMedicaid }} className="flex-shrink-0 border-r border-gray-400 px-2 h-[30px] flex items-center justify-center text-center last:border-r-0"
>
      {row.njMedicaid}
    </div>
  )}

  {columnFilters.shortageNjMedicaid && (
    <div style={{ width: columnWidths.shortageNjMedicaid, minWidth: columnWidths.shortageNjMedicaid }} className="flex-shrink-0 px-3 py-2 text-center flex items-center justify-center">
      {renderShortageValue(row.shortageNjMedicaid)}
    </div>
  )}

  {Object.entries(supplierToColumnKey).map(([label, key]) =>
  columnFilters[key] && (
    <div
      key={key}
      style={{ width: columnWidths[key], minWidth: columnWidths[key] }}
      className="flex-shrink-0 border-r border-gray-400 px-2 h-[30px] flex items-center justify-center text-center"
    >
      —
    </div>
  )
)}


                </div> 
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
