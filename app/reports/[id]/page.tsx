// 'use client'

// import React, { useState } from 'react'
// import { ChevronLeft, ChevronRight, Search, X, ChevronDown, RotateCw } from 'lucide-react'

// // Dummy data for the table
// const inventoryData = [
//   { id: 1, ndc: '61958-2501-01', drugName: 'BIKTARVY 50-200-25MG TAB', rank: 1, pkgSize: 30, totalOrdered: 2070, totalBilled: 3510, totalShortage: -1440, highestShortage: null, njMedicaid: 1320, shortageNjMedicaid: null, pdmi: 750 },
//   { id: 2, ndc: '49702-0246-13', drugName: 'DOVATO 50-300MG TAB', rank: 2, pkgSize: 30, totalOrdered: 360, totalBilled: 600, totalShortage: -240, highestShortage: null, njMedicaid: 150, shortageNjMedicaid: null, pdmi: 210 },
//   { id: 3, ndc: '69067-0010-15', drugName: 'LACTULOSE 10g PWD', rank: 3, pkgSize: 15, totalOrdered: 780, totalBilled: 900, totalShortage: -120, highestShortage: null, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
//   { id: 4, ndc: '74157-0016-60', drugName: 'DICLOFENAC POTASSIUM 25MG TAB', rank: 4, pkgSize: 60, totalOrdered: 120, totalBilled: 1560, totalShortage: -1440, highestShortage: null, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
//   { id: 5, ndc: '49702-0231-13', drugName: 'TRIUMEQ 600-50-300MG TAB', rank: 5, pkgSize: 30, totalOrdered: 150, totalBilled: 270, totalShortage: -120, highestShortage: null, njMedicaid: null, shortageNjMedicaid: -120, pdmi: null },
//   { id: 6, ndc: '61958-2101-01', drugName: 'ODEFSEY 200-25-25MG TAB', rank: 6, pkgSize: 30, totalOrdered: 90, totalBilled: 240, totalShortage: -150, highestShortage: -60, njMedicaid: 150, shortageNjMedicaid: null, pdmi: -60 },
//   { id: 7, ndc: '59676-0575-30', drugName: 'PREZCOBIX 800-150MG TAB', rank: 7, pkgSize: 30, totalOrdered: 150, totalBilled: 360, totalShortage: -210, highestShortage: -90, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
//   { id: 8, ndc: '00003-0894-21', drugName: 'ELIQUIS 5MG TAB', rank: 8, pkgSize: 60, totalOrdered: 1620, totalBilled: 2684, totalShortage: -1064, highestShortage: null, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
//   { id: 9, ndc: '45802-0578-84', drugName: 'NALOXONE HYDROCHLORI 4MG\\0.1M', rank: 9, pkgSize: 2, totalOrdered: 254, totalBilled: 786, totalShortage: -532, highestShortage: -492, njMedicaid: 746, shortageNjMedicaid: null, pdmi: -492 },
//   { id: 10, ndc: '00169-4772-12', drugName: 'OZEMPIC 8 MG\\3 ML INJ', rank: 10, pkgSize: 3, totalOrdered: 42, totalBilled: 54, totalShortage: -12, highestShortage: null, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
//   { id: 11, ndc: '00002-1471-80', drugName: 'MOUNJARO 10MG/0.5ML 10MG/0.5M', rank: 11, pkgSize: 2, totalOrdered: 24, totalBilled: 34, totalShortage: -10, highestShortage: -10, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
//   { id: 12, ndc: '49702-0228-13', drugName: 'TIVICAY 50MG TAB', rank: 12, pkgSize: 30, totalOrdered: 120, totalBilled: 240, totalShortage: -120, highestShortage: -120, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
//   { id: 13, ndc: '00169-4181-13', drugName: 'OZEMPIC 0.25 OR 0.50MG 2MG\\3ML', rank: 13, pkgSize: 3, totalOrdered: 33, totalBilled: 57, totalShortage: -24, highestShortage: null, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
//   { id: 14, ndc: '00002-1495-80', drugName: 'MOUNJARO 5MG\\0.5ML INJ', rank: 14, pkgSize: 2, totalOrdered: 8, totalBilled: 28, totalShortage: -20, highestShortage: -12, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
//   { id: 15, ndc: '00002-1484-80', drugName: 'MOUNJARO 7.5MG\\0.5ML INJ', rank: 15, pkgSize: 2, totalOrdered: 22, totalBilled: 28, totalShortage: -6, highestShortage: null, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
//   { id: 16, ndc: '85622-0102-30', drugName: 'MICROBALANCE PROBIOTICS', rank: 16, pkgSize: 30, totalOrdered: 270, totalBilled: 270, totalShortage: 0, highestShortage: null, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
//   { id: 17, ndc: '00002-2506-80', drugName: 'ZEPBOUND 2.5MG\\0.5ML INJ', rank: 17, pkgSize: 2, totalOrdered: 12, totalBilled: 28, totalShortage: -16, highestShortage: -4, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
//   { id: 18, ndc: '61958-2002-01', drugName: 'DESCOVY 200-25MG TAB', rank: 18, pkgSize: 30, totalOrdered: 90, totalBilled: 150, totalShortage: -60, highestShortage: -30, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
//   { id: 19, ndc: '00173-0887-10', drugName: 'TRELEGY ELLIPTA 100-62.5-25MCG\\ I', rank: 19, pkgSize: 60, totalOrdered: 660, totalBilled: 1020, totalShortage: -360, highestShortage: -240, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
//   { id: 20, ndc: '00169-4524-14', drugName: 'WEGOVY SY 2.4MG\\0.75ML INJ', rank: 20, pkgSize: 3, totalOrdered: 12, totalBilled: 18, totalShortage: -6, highestShortage: -3, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
//   { id: 21, ndc: '65649-0150-90', drugName: 'RELISTOR 150MG TAB', rank: 21, pkgSize: 90, totalOrdered: 270, totalBilled: 360, totalShortage: -90, highestShortage: null, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
//   { id: 22, ndc: '00173-0873-10', drugName: 'INCRUSE ELLIPTA 62.5MCG\\ACTUATI', rank: 22, pkgSize: 30, totalOrdered: 510, totalBilled: 812, totalShortage: -302, highestShortage: -302, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
//   { id: 23, ndc: '00310-6210-30', drugName: 'FARXIGA 10MG TAB', rank: 23, pkgSize: 30, totalOrdered: 420, totalBilled: 570, totalShortage: -150, highestShortage: null, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
//   { id: 24, ndc: '71741-0365-30', drugName: 'WELLFOLA TABLET 25-0.013-1-80-6', rank: 24, pkgSize: 30, totalOrdered: 180, totalBilled: 180, totalShortage: 0, highestShortage: null, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
//   { id: 25, ndc: '72511-0393-02', drugName: 'REPATHA SURECLICK 140MG\\ML INJ', rank: 25, pkgSize: 2, totalOrdered: 32, totalBilled: 32, totalShortage: 0, highestShortage: null, njMedicaid: null, shortageNjMedicaid: null, pdmi: null },
// ]

// interface FilterChip {
//   id: string
//   label: string
//   value: string
// }

// export default function InventoryReportPage() {
//   const [searchQuery, setSearchQuery] = useState('')
//   const [selectedRows, setSelectedRows] = useState<number[]>([])
//   const [activeFilters, setActiveFilters] = useState<FilterChip[]>([
//     { id: 'pkgSize', label: 'PKG SIZE', value: 'PKG SIZE' },
//     { id: 'cost', label: '$ COST', value: '$ COST' },
//   ])
//   const [qtyType, setQtyType] = useState<'UNIT' | 'PKG SIZE' | null>('UNIT')
// const [openQtyDropdown, setOpenQtyDropdown] = useState(false)
// const [openFilter, setOpenFilter] = useState(false)
// const [openFlagDropdown, setOpenFlagDropdown] = useState(false)
// const [flagFilters, setFlagFilters] = useState<string[]>([])

// const [openTagsDropdown, setOpenTagsDropdown] = useState(false)
// const [openTagMenuId, setOpenTagMenuId] = useState<string | null>(null)
// const [openCreateTagModal, setOpenCreateTagModal] = useState(false)
// const [newTagName, setNewTagName] = useState('')
// const [newTagColor, setNewTagColor] = useState('yellow')
// const [openDrugTypeDropdown, setOpenDrugTypeDropdown] = useState(false)
// const [drugTypes, setDrugTypes] = useState<string[]>(['ALL DRUGS'])
// const [costValue, setCostValue] = useState<number | ''>('')


// const filteredData = inventoryData.filter(row => {
//   if (costValue === '') return true

//   const cost =
//     row.totalOrdered && row.totalBilled
//       ? row.totalBilled / row.totalOrdered
//       : 0

//   return cost >= costValue
// })


// const tags = [
//   { id: 'caremark', label: 'Caremark', color: 'emerald', count: 0 },
//   { id: 'oxy', label: 'OXY OPTUM', color: 'cyan', count: 0 },
//   { id: 'skip', label: 'taken care, skip', color: 'zinc', count: 0 },
//   { id: 'need', label: 'need to buy', color: 'rose', count: 0 },
//   { id: 'parmed', label: 'parmed', color: 'zinc', count: 0 },
//   { id: 'ordered', label: 'ORDERED', color: 'lime', count: 0 },
// ]



//   const toggleRowSelection = (id: number) => {
//     setSelectedRows(prev => 
//       prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
//     )
//   }

//   const toggleAllRows = () => {
//     if (selectedRows.length === inventoryData.length) {
//       setSelectedRows([])
//     } else {
//       setSelectedRows(inventoryData.map(row => row.id))
//     }
//   }

//   const removeFilter = (filterId: string) => {
//     setActiveFilters(prev => prev.filter(f => f.id !== filterId))
//   }

//   const formatNumber = (num: number | null) => {
//     if (num === null) return ''
//     return num.toLocaleString()
//   }

//   const renderShortageValue = (value: number | null) => {
//     if (value === null) return ''
//     if (value === 0) return <span className="text-emerald-600 font-medium">0</span>
//     return <span className="text-red-500 font-medium">{value.toLocaleString()}</span>
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* DROPDOWNS PORTAL - RENDERED AT ROOT LEVEL WITH HIGHEST Z-INDEX */}
//       {openFilter && (
//   <>
//     {/* Overlay */}
//     <div
//       className="fixed inset-0 z-[999] "
//       onClick={() => setOpenFilter(false)}
//     />

//     {/* Modal */}
//     <div
//       className="fixed z-[1000] w-[720px] rounded-xl border border-gray-200 bg-white shadow-2xl -translate-y-10 -translate-x-150"
//       style={{ top: '120px', right: '20px' }}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between border-b px-4 py-3">
//         <span className="text-sm font-semibold">FILTERS</span>
//         <div className="flex items-center gap-2">
//           <button className="rounded-md border px-3 py-1 text-xs hover:bg-gray-50">
//             Reset Filters
//           </button>
//           <button className="rounded-md border px-3 py-1 text-xs hover:bg-gray-50">
//             Export
//           </button>
//           <button onClick={() => setOpenFilter(false)}>
//             <X className="h-4 w-4 text-gray-500" />
//           </button>
//         </div>
//       </div>

//       {/* Body */}
//       <div className="grid grid-cols-3 gap-4 p-4 text-sm">
//         {/* Columns */}
//         <div>
//           <h4 className="mb-2 font-semibold uppercase text-xs">Columns</h4>

//           {[
//             'NDC',
//             'PKG SIZE',
//             'RANK',
//             'TOTAL ORDERED',
//             'TOTAL BILLED',
//             'TOTAL SHORTAGE',
//             'HIGHEST SHORTAGE',
//             'AMOUNT',
//             'COST',
//           ].map(item => (
//             <label key={item} className="flex items-center gap-2 py-1">
//               <input type="checkbox" className="h-4 w-4 accent-emerald-600" />
//               {item}
//             </label>
//           ))}

//           {/* Show Label */}
//           <h4 className="mt-4 mb-2 font-semibold uppercase text-xs">
//             Show Label
//           </h4>

//           {['SHOW ABERRANT', 'CONTROLLED', 'FILTER NDC PERIOD'].map(item => (
//             <label key={item} className="flex items-center gap-2 py-1">
//               <input type="checkbox" className="h-4 w-4 accent-emerald-600" />
//               {item}
//             </label>
//           ))}

//           {/* Toggle Switches */}
//           <div className="mt-3 -space-y-1">
//             {[
//               'VERTICAL HEADER',
//               'REMOVE NDC DASH',
//               "SHORT NDC'S ONLY",
//               'INCLUDE SHORTAGE',
//               'HIGHEST SHORTAGE NAME',
//               'INCLUDE AMOUNT',
//               'INCLUDE PBM RANK',
//               'FILTER BY NOTE',
//               'CASH DISABLED',
//             ].map(item => (
//               <div key={item} className="flex items-center justify-between py-1">
//                 <span className="text-sm">{item}</span>

//                 <label className="relative inline-flex cursor-pointer items-center">
//                   <input type="checkbox" className="peer sr-only" />
//                   <div className="h-5 w-9 rounded-full bg-gray-300 peer-checked:bg-emerald-600 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-4" />
//                 </label>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Billed */}
//         <div>
//           <h4 className="mb-2 font-semibold uppercase text-xs flex items-center gap-2">
//             <span className="h-2 w-2 rounded-full bg-red-500" />
//             Billed
//           </h4>

//           {[
//             'HORIZON HEALTH (643)',
//             'EXPRESS SCRIPTS (399)',
//             'CVS CAREMARK (308)',
//             'SS&C (FORMERLY HUMANA, ARGUS, AND DST) (53)',
//             'NJ MEDICAID (51)',
//             'PDMI (CO-PAY CARD) (11)',
//             'OPTUMRX (10)',
//             'MCKESSON HDS (CO-PAY CARD) (5)',
//             'CHANGE HEALTHCARE (2)',
//             'EMPIRX (1)',
//           ].map(item => (
//             <label key={item} className="flex items-center gap-2 py-1">
//               <input
//                 type="checkbox"
//                 defaultChecked
//                 className="h-4 w-4 accent-emerald-600"
//               />
//               {item}
//             </label>
//           ))}
//         </div>

//         {/* Suppliers */}
//         <div>
//           <h4 className="mb-2 font-semibold uppercase text-xs flex items-center gap-2">
//             <span className="h-2 w-2 rounded-full bg-emerald-600" />
//             Suppliers
//           </h4>

//           {[
//             'KINRAY (447)',
//             'REAL VALUE RX (131)',
//             'PARMED (105)',
//             'AXIA (13)',
//             'CITYMED (12)',
//             'LEGACY HEALTH (5)',
//             'NDC DISTRIBUTORS (4)',
//             'TRUMARKER (2)',
//           ].map(item => (
//             <label key={item} className="flex items-center gap-2 py-1">
//               <input type="checkbox" className="h-4 w-4 accent-emerald-600" />
//               {item}
//             </label>
//           ))}
//         </div>
//       </div>
//     </div>
//   </>
// )}

// {/* drug type */}
// {openDrugTypeDropdown && (
//   <>
//     {/* Overlay */}
//     <div
//       className="fixed inset-0 z-[999]"
//       onClick={() => setOpenDrugTypeDropdown(false)}
//     />

//     {/* Dropdown */}
//     <div
//       className="fixed z-[1100] w-64 rounded-xl border border-gray-200 bg-white shadow-2xl"
//       style={{
//         top: '78px',
//         right: '220px',   // adjust to align under Drug Type
//       }}
//       onClick={(e) => e.stopPropagation()}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between border-b px-3 py-2 text-xs font-semibold uppercase text-gray-700">
//         DRUG TYPE
//         <button onClick={() => setOpenDrugTypeDropdown(false)}>
//           <X className="h-3 w-3 text-gray-400 hover:text-gray-600" />
//         </button>
//       </div>

//       {/* Options */}
//       <div className="p-3 space-y-2 text-sm">
//         {[
//           { label: 'ALL DRUGS', count: null },
//           { label: 'BRANDS', count: 138 },
//           { label: 'GENERIC', count: 769 },
//         ].map(item => {
//           const checked = drugTypes.includes(item.label)

//           return (
//             <label
//               key={item.label}
//               className="flex items-center gap-2 py-1 cursor-pointer"
//             >
//               <input
//                 type="checkbox"
//                 checked={checked}
//                 onChange={() => {
//                   setDrugTypes(prev => {
//                     if (item.label === 'ALL DRUGS') {
//                       return ['ALL DRUGS']
//                     }
//                     const next = prev.includes(item.label)
//                       ? prev.filter(v => v !== item.label)
//                       : [...prev.filter(v => v !== 'ALL DRUGS'), item.label]

//                     return next.length ? next : ['ALL DRUGS']
//                   })
//                 }}
//                 className="h-4 w-4 accent-emerald-600"
//               />
//               {item.label}
//               {item.count !== null && ` (${item.count})`}
//             </label>
//           )
//         })}
//       </div>
//     </div>
//   </>
// )}


// {openCreateTagModal && (
//   <>
//     {/* Overlay */}
//     <div
//       className="fixed inset-0 z-[1200] bg-black/30"
//       onClick={() => setOpenCreateTagModal(false)}
//     />

//     {/* Modal */}
//     <div
//       className="fixed z-[1300] left-1/2 top-1/2 w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-2xl"
//       onClick={(e) => e.stopPropagation()}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <h3 className="text-lg font-semibold">Add New Tag</h3>
//         <button onClick={() => setOpenCreateTagModal(false)}>
//           <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//         </button>
//       </div>

//       {/* Tag name */}
//       <div className="mt-4">
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Tag Name
//         </label>
//         <input
//           value={newTagName}
//           onChange={(e) => setNewTagName(e.target.value)}
//           placeholder="Write..."
//           className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-600"
//         />
//       </div>

//       {/* Color picker */}
//       <div className="mt-4">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Select color
//         </label>

//         <div className="flex flex-wrap gap-2">
//           {[
//             'yellow', 'lime', 'emerald', 'cyan', 'sky',
//             'blue', 'indigo', 'violet', 'purple', 'fuchsia',
//             'pink', 'rose', 'red', 'orange', 'amber',
//             'gray', 'slate', 'zinc', 'neutral', 'black',
//           ].map(color => (
//             <button
//               key={color}
//               onClick={() => setNewTagColor(color)}
//               className={`h-7 w-7 rounded-full border-2 ${
//                 newTagColor === color ? 'border-emerald-600' : 'border-transparent'
//               }`}
//               style={{
//                 backgroundColor:
//                   color === 'yellow' ? '#facc15' :
//                   color === 'lime' ? '#a3e635' :
//                   color === 'emerald' ? '#10b981' :
//                   color === 'cyan' ? '#22d3ee' :
//                   color === 'sky' ? '#38bdf8' :
//                   color === 'blue' ? '#3b82f6' :
//                   color === 'indigo' ? '#6366f1' :
//                   color === 'violet' ? '#8b5cf6' :
//                   color === 'purple' ? '#a855f7' :
//                   color === 'fuchsia' ? '#d946ef' :
//                   color === 'pink' ? '#ec4899' :
//                   color === 'rose' ? '#f43f5e' :
//                   color === 'red' ? '#ef4444' :
//                   color === 'orange' ? '#fb923c' :
//                   color === 'amber' ? '#f59e0b' :
//                   color === 'gray' ? '#9ca3af' :
//                   color === 'slate' ? '#64748b' :
//                   color === 'zinc' ? '#a1a1aa' :
//                   color === 'neutral' ? '#a3a3a3' :
//                   '#000000',
//               }}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Save */}
//       <div className="mt-6 flex justify-end">
//         <button
//           onClick={() => {
//             if (!newTagName.trim()) return
//             // TODO: push into tags state
//             setOpenCreateTagModal(false)
//             setNewTagName('')
//           }}
//           className="rounded-lg bg-emerald-800 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
//         >
//           Save
//         </button>
//       </div>
//     </div>
//   </>
// )}


// {/* flag */}

// {openFlagDropdown && (
//   <>
//     {/* Overlay */}
//     <div
//       className="fixed inset-0 z-[999]"
//       onClick={() => setOpenFlagDropdown(false)}
//     />

//     {/* Dropdown */}
//     <div
//       className="fixed z-[1000] w-64 rounded-xl border border-gray-200 bg-white shadow-2xl"
//       style={{
//         top: '78px',
//         left: '50%',
//         transform: 'translateX(35%)',
//       }}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between border-b px-3 py-2 text-xs font-semibold uppercase text-gray-700">
//         FLAGS
//         <button onClick={() => setOpenFlagDropdown(false)}>
//           <X className="h-3 w-3 text-gray-400 hover:text-gray-600" />
//         </button>
//       </div>

//       {/* Content */}
//       <div className="p-3 space-y-2 text-sm">
//         {[
//           { label: 'ABERRANT', count: 8 },
//           { label: 'CONTROLLED SUBSTANCE', count: 34 },
//         ].map(item => (
//           <label key={item.label} className="flex items-center gap-2 py-1">
//             <input
//               type="checkbox"
//               className="h-4 w-4 accent-emerald-600"
//             />
//             {item.label} ({item.count})
//           </label>
//         ))}

//         <div className="ml-5 mt-1 space-y-1">
//           {[
//             { label: 'CI', count: 0 },
//             { label: 'CII', count: 15 },
//             { label: 'CIII', count: 3 },
//             { label: 'CIV', count: 11 },
//             { label: 'CV', count: 5 },
//           ].map(item => (
//             <label key={item.label} className="flex items-center gap-2 text-sm">
//               <input
//                 type="checkbox"
//                 className="h-4 w-4 accent-emerald-600"
//               />
//               {item.label} ({item.count})
//             </label>
//           ))}
//         </div>
//       </div>
//     </div>
//   </>
// )}

// {openTagsDropdown && (
//   <>
//     {/* Overlay */}
//     <div
//       className="fixed inset-0 z-[999]"
//       onClick={() => {
//         setOpenTagsDropdown(false)
//         setOpenTagMenuId(null)
//       }}
//     />

//     {/* Dropdown */}
//     <div
//       className="fixed z-[1000] w-72 rounded-xl border border-gray-200 bg-white shadow-2xl"
//       style={{
//         top: '78px',
//         left: '50%',
//         transform: 'translateX(80%)',
//       }}
//       onClick={(e) => e.stopPropagation()}   // 🔥 prevents close on click inside
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between border-b px-3 py-2 text-xs font-semibold uppercase text-gray-700">
//         TAGS
//         <button
//   className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 hover:underline"
//   onClick={(e) => {
//     e.stopPropagation()
//     setOpenCreateTagModal(true)
//   }}
// >
//   + Create Tag
// </button>

//       </div>

//       {/* Content */}
//       <div className="max-h-80 overflow-y-auto p-3 space-y-2">
//         {/* Example static tags – replace with your real data */}
//         {[
//           { id: 'caremark', label: 'Caremark', color: 'emerald', count: 0 },
//           { id: 'oxy', label: 'OXY OPTUM', color: 'cyan', count: 0 },
//           { id: 'skip', label: 'taken care, skip', color: 'zinc', count: 0 },
//           { id: 'need', label: 'need to buy', color: 'rose', count: 0 },
//           { id: 'parmed', label: 'parmed', color: 'zinc', count: 0 },
//           { id: 'ordered', label: 'ORDERED', color: 'lime', count: 0 },
//         ].map(tag => (
//           <div key={tag.id} className="flex items-center justify-between gap-2">
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input type="checkbox" className="h-4 w-4 accent-emerald-600" />

//               <span
//                 className={`
//                   inline-flex items-center gap-2 rounded-full border px-2 py-0.5 text-xs font-semibold
//                   ${
//                     tag.color === 'emerald'
//                       ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
//                       : tag.color === 'cyan'
//                       ? 'border-cyan-400 bg-cyan-50 text-cyan-700'
//                       : tag.color === 'rose'
//                       ? 'border-rose-400 bg-rose-50 text-rose-700'
//                       : tag.color === 'lime'
//                       ? 'border-lime-400 bg-lime-50 text-lime-700'
//                       : 'border-gray-300 bg-gray-100 text-gray-700'
//                   }
//                 `}
//               >
//                 {tag.label}
//                 <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-gray-700">
//                   {tag.count}
//                 </span>
//               </span>
//             </label>

//             {/* 3-dot menu */}
//             <div className="relative">
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation()
//                   setOpenTagMenuId(prev =>
//                     prev === tag.id ? null : tag.id
//                   )
//                 }}
//                 className="p-1 text-gray-400 hover:text-gray-700"
//               >
//                 ⋮
//               </button>

//               {openTagMenuId === tag.id && (
//                 <div className="absolute right-0 top-6 z-[1100] w-28 rounded-md border bg-white shadow-md">
//                   <button className="block w-full px-3 py-1.5 text-left text-xs hover:bg-gray-50">
//                     Edit
//                   </button>
//                   <button className="block w-full px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50">
//                     Delete
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   </>
// )}



//       {openQtyDropdown && (
//         <>
//           <div 
//             className="fixed inset-0 z-[999]" 
//             onClick={() => setOpenQtyDropdown(false)}
//           />
//           <div 
//             className="fixed z-[1000] w-48 rounded-lg border border-gray-200 bg-white shadow-2xl"
//             style={{
//               top: '78px',
//               left: '50%',
//               transform: 'translateX(250%)',
              
//             }}
//           >
//             <div className="flex items-center justify-between border-b px-3 py-2 text-xs font-semibold uppercase text-gray-700 ">
//               Quantity Type
//               <button onClick={() => setOpenQtyDropdown(false)}>
//                 <X className="h-3 w-3 text-gray-400 hover:text-gray-600" />
//               </button>
//             </div>
//             <button
//               onClick={() => {
//                 setQtyType('UNIT')
//                 setOpenQtyDropdown(false)
//               }}
//               className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
//             >
//               <span className={`h-4 w-4 rounded border flex items-center justify-center ${qtyType === 'UNIT' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300'}`}>
//                 {qtyType === 'UNIT' && '✓'}
//               </span>
//               UNIT
//             </button>
//             <button
//               onClick={() => {
//                 setQtyType('PKG SIZE')
//                 setOpenQtyDropdown(false)
//               }}
//               className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50"
//             >
//               <span className={`h-4 w-4 rounded border flex items-center justify-center ${qtyType === 'PKG SIZE' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300'}`}>
//                 {qtyType === 'PKG SIZE' && '✓'}
//               </span>
//               PKG SIZE
//             </button>
//           </div>
//         </>
//       )}

//       {/* Taskbar */}
//      <div className="border-b border-gray-200 bg-gray-100 overflow-x-auto scrollbar-hide">
//   <div className="flex items-center px-3 py-2 gap-3 min-w-max">

//           {/* Navigation Arrows */}
//           <div className="flex items-center gap-0.5">
//             <button className="p-1 hover:bg-gray-100 rounded transition-colors">
//               <ChevronLeft className="w-5 h-5 text-gray-500" />
//             </button>
//             <button className="p-1 hover:bg-gray-100 rounded transition-colors">
//               <RotateCw className="w-4 h-4 text-gray-500" />
//             </button>
//           </div>

//           {/* Inventory Report Title */}
//           <div className="flex flex-col min-w-fit">
//   <span className="text-[11px] font-semibold uppercase tracking-wide text-[#18634a]">
//     Inventory Report
//   </span>

//   <div className="mt-1 inline-flex items-center rounded-md border border-gray-200 bg-white px-3 py-2.5">
//     <span className="text-xs font-bold text-gray-800">
//       SEP 1, 2025 - JAN 26, 2026
//     </span>
//   </div>
// </div>




//           {/* Inventory Dates */}
//           <div className="flex flex-col min-w-fit">
//   <div className="flex items-center gap-1">
//     <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
//     <span className="text-[11px] font-semibold uppercase text-[#18634a]">
//       Inventory Dates
//     </span>
//   </div>

//   <div className="mt-1 flex items-center gap-1">
//     <div className="rounded-md border border-gray-200 bg-white px-2 -py-1 text-center">
//       <span className="block text-[9.5px] font-semibold uppercase text-red-500 translate-y-0.5">
//         Start
//       </span>
//       <span className="text-[11px] font-semibold text-gray-800">
//         09/01/2025
//       </span>
//     </div>

//     <div className="rounded-md border border-gray-200 bg-white px-2 -py-1 text-center">
//       <span className="block text-[9.5px] font-semibold uppercase text-red-500">
//         End
//       </span>
//       <span className="text-[11px] font-semibold text-gray-800">
//         01/26/2026
//       </span>
//     </div>
//   </div>
// </div>


//           {/* Wholesaler Dates */}
//           <div className="flex flex-col min-w-fit">
//   <div className="flex items-center gap-1">
//     <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
//     <span className="text-[11px] font-semibold uppercase text-[#18634a]">
//       Wholesaler Dates
//     </span>
//   </div>

//   <div className="mt-1 flex items-center gap-1">
//     <div className="rounded-md border border-gray-200 bg-white px-2 -py-1 text-center">
//       <span className="block text-[9.5px] font-semibold uppercase text-emerald-600">
//         Start
//       </span>
//       <span className="text-[11px] font-semibold text-gray-800">
//         09/01/2025
//       </span>
//     </div>

//     <div className="rounded-md border border-gray-200 bg-white px-2 -py-1 text-center">
//       <span className="block text-[9.5px] font-semibold uppercase text-emerald-600">
//         End
//       </span>
//       <span className="text-[11px] font-semibold text-gray-800">
//         01/26/2026
//       </span>
//     </div>
//   </div>
// </div>


//           {/* Search Bar */}
//           <div className="flex items-center translate-y-2 translate-x-5 shadow-sm rounded-xl">
//   <div className="flex items-center border border-gray-300 rounded-l-xl bg-white">
//     <input
//       type="text"
//       placeholder="Search"
//       value={searchQuery}
//       onChange={(e) => setSearchQuery(e.target.value)}
//       className="w-60 h-10 px-4 py-1.5 text-semibold text-gray-700 placeholder-gray-400 focus:outline-none"
//     />
//     <button 
//       onClick={() => setSearchQuery('')}
//       className="px-2 text-gray-400 hover:text-gray-600"
//     >
//       <X className="w-4 h-4" />
//     </button>
//   </div>

//   <button className="h-10 px-3 bg-emerald-800 text-white rounded-r-xl hover:bg-emerald-700 transition-colors border border-emerald-600">
//     <Search className="w-5 h-5" />
//   </button>
// </div>


//           {/* Filter Dropdowns */}
//           <div className="flex items-center gap-3 translate-x-10">
//             {/* Filter */}
//            <div className="relative flex flex-col">
//   <span className="text-[11px] font-semibold uppercase text-[#0F3D2E]">
//     Filter
//   </span>

//   <button
//     onClick={() => setOpenFilter(v => !v)}
//     className="mt-1 inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-2 text-xs text-[#0F3D2E]/50 hover:text-[#0F3D2E] hover:border-gray-300"
//   >
//     <svg
//       className="w-3.5 h-3.5"
//       fill="none"
//       stroke="currentColor"
//       viewBox="0 0 24 24"
//     >
//       <path
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         strokeWidth={2}
//         d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
//       />
//     </svg>

//     <span className="uppercase text-[11px] font-medium tracking-wide text-[#0F3D2E]/40">
//       CHOOSE
//     </span>
//     <ChevronDown className="w-3 h-3 text-[#0F3D2E]/40" />
//   </button>
// </div>



//             {/* Flag */}
// <div className="relative flex flex-col">
//   <span className="text-[11px] font-semibold uppercase text-[#0F3D2E]">
//     Flag
//   </span>

//   <button
//     onClick={() => setOpenFlagDropdown(v => !v)}
//     className="mt-1 inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-2 text-xs text-[#0F3D2E]/50 hover:text-[#0F3D2E] hover:border-gray-300"
//   >
//     <span className="uppercase text-[11px] font-medium tracking-wide text-[#0F3D2E]/40">
//       CHOOSE
//     </span>
//     <ChevronDown className="w-3 h-3 text-[#0F3D2E]/40" />
//   </button>
// </div>



//   {/* Tags */}
// {/* Tags */}
// <div className="relative flex flex-col">
//   <span className="text-[11px] font-semibold uppercase text-[#0F3D2E]">
//     Tags
//   </span>

//   <button
//     type="button"
//     onClick={(e) => {
//       e.stopPropagation()
//       setOpenTagsDropdown(prev => !prev)
//     }}
//     className="mt-1 inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-2 text-xs text-[#0F3D2E]/50 hover:text-[#0F3D2E] hover:border-gray-300"
//   >
//     <span className="uppercase text-[11px] font-medium tracking-wide text-[#0F3D2E]/40">
//       CHOOSE
//     </span>
//     <ChevronDown className="w-3 h-3 text-[#0F3D2E]/40" />
//   </button>
// </div>



//             {/* Qty Type with chip */}
//             <div className="relative flex flex-col">
//   <span className="text-[11px] font-semibold uppercase text-[#0F3D2E]">
//     Qty Type
//   </span>

//   {/* Selected pill */}
//   {qtyType ? (
//     <div className="mt-1 inline-flex items-center gap-1 rounded-md border border-emerald-600 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 min-w-max">
//   <span className="whitespace-nowrap">{qtyType}</span>
//   <button
//     onClick={() => setQtyType(null)}
//     className="rounded hover:bg-emerald-50"
//   >
//     <X className="h-3 w-3" />
//   </button>
// </div>

//   ) : (
//     <button
//       onClick={() => setOpenQtyDropdown(v => !v)}
//       className="mt-1 inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-2 text-xs text-gray-500 hover:text-gray-800 hover:border-gray-300"
//     >
//       CHOOSE
//       <ChevronDown className="h-3 w-3" />
//     </button>
//   )}
// </div>


//             {/* Drug Type */}
//             {/* Drug Type */}
// <div className="relative flex flex-col">
//   <span className="text-[10px] font-semibold uppercase text-[#0F3D2E]">
//     Drug Type
//   </span>

//   <button
//     type="button"
//     onClick={(e) => {
//       e.stopPropagation()
//       setOpenDrugTypeDropdown(v => !v)
//       setOpenFilter(false)
//       setOpenFlagDropdown(false)
//       setOpenTagsDropdown(false)
//       setOpenQtyDropdown(false)
//     }}
//     className="mt-1 inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-2 text-xs text-gray-500 hover:text-gray-800 hover:border-gray-300"
//   >
//     <span>
//       {drugTypes.length ? drugTypes.join(', ') : 'ALL DRUGS'}
//     </span>
//     <ChevronDown className="w-3 h-3" />
//   </button>
// </div>



//             {/* Drug Cost with chip */}
//             <div className="flex flex-col">
//   <span className="text-[10px] font-semibold uppercase text-[#0F3D2E]">
//     Drug Cost
//   </span>

//   <input
//     type="number"
//     placeholder="$ COST"
//     value={costValue}
//     onChange={(e) =>
//       setCostValue(e.target.value === '' ? '' : Number(e.target.value))
//     }
//     className="mt-1 h-[34px] w-[110px] rounded-md border border-emerald-600 bg-white px-2 py-1.5 text-xs font-semibold text-emerald-700 placeholder-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-600"
//   />
// </div>



//             {/* Rows Count */}
//             <div className="flex flex-col">
//   <span className="text-[10px] font-semibold uppercase text-[#0F3D2E]">
//     Rows
//   </span>

//   <div className="mt-1 inline-flex items-center justify-center rounded-md border border-emerald-600 bg-white px-3 py-2 text-xs font-bold text-emerald-700">
//     {inventoryData.length}
//   </div>
// </div>

//           </div>
//         </div>
//       </div>

//       {/* Table Header Row */}
//       <div className="border-b border-gray-200 bg-gray-50">
//         <div className="flex items-center px-4 py-2 text-xs font-semibold text-gray-600 uppercase">
//           <div className="w-10 flex items-center justify-center">
//             <input
//               type="checkbox"
//               checked={selectedRows.length === inventoryData.length}
//               onChange={toggleAllRows}
//               className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
//             />
//           </div>
//           <div className="w-32 flex items-center gap-1">
//             NDC
//             <ChevronDown className="w-3 h-3" />
//           </div>
//           <div className="flex-1 min-w-[280px] flex items-center gap-1">
//             Drug Name
//             <ChevronDown className="w-3 h-3" />
//           </div>
//           <div className="w-16 text-center flex items-center justify-center gap-1">
//             Rank
//             <ChevronDown className="w-3 h-3" />
//           </div>
//           <div className="w-20 text-center flex items-center justify-center gap-1">
//             PKG Size
//             <ChevronDown className="w-3 h-3" />
//           </div>
//           <div className="w-24 text-center">
//             <div className="flex items-center justify-center gap-1">
//               <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
//               Total Ordered
//             </div>
//           </div>
//           <div className="w-24 text-center">
//             <div className="flex items-center justify-center gap-1">
//               <div className="w-2 h-2 rounded-full bg-amber-500"></div>
//               Total Billed
//             </div>
//           </div>
//           <div className="w-24 text-center">
//             <div className="flex items-center justify-center gap-1">
//               <div className="w-2 h-2 rounded-full bg-red-500"></div>
//               Total Shortage
//             </div>
//           </div>
//           <div className="w-24 text-center">
//             <div className="flex items-center justify-center gap-1">
//               <div className="w-2 h-2 rounded-full bg-amber-400"></div>
//               Highest Shortage
//             </div>
//           </div>
//           <div className="w-24 text-center">
//             <div className="flex items-center justify-center gap-1">
//               <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
//               NJ Medicaid
//               <ChevronDown className="w-3 h-3" />
//             </div>
//           </div>
//           <div className="w-28 text-center">
//             <div className="flex items-center justify-center gap-1">
//               <div className="w-2 h-2 rounded-full bg-amber-500"></div>
//               Shortage NJ Medicaid
//             </div>
//           </div>
//           <div className="w-24 text-center">
//             <div className="flex items-center justify-center gap-1">
//               <div className="w-2 h-2 rounded-full bg-amber-500"></div>
//               PDMI (CO
//               <ChevronDown className="w-3 h-3" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Table Body */}
//       <div className="divide-y divide-gray-100">
//         {filteredData.map((row, index) => (
//           <div 
//             key={row.id}
//             className={`flex items-center px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
//               index % 2 === 1 ? 'bg-gray-50/50' : 'bg-white'
//             }`}
//           >
//             <div className="w-10 flex items-center justify-center">
//               <input
//                 type="checkbox"
//                 checked={selectedRows.includes(row.id)}
//                 onChange={() => toggleRowSelection(row.id)}
//                 className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
//               />
//             </div>
//             <div className="w-32 text-gray-600 flex items-center gap-1">
//               <div className="flex items-center gap-0.5">
//                 <button className="p-0.5 hover:bg-gray-200 rounded text-gray-400">
//                   <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
//                     <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
//                   </svg>
//                 </button>
//                 <button className="p-0.5 hover:bg-gray-200 rounded text-gray-400">
//                   <Search className="w-3 h-3" />
//                 </button>
//                 <button className="p-0.5 hover:bg-gray-200 rounded text-gray-400">
//                   <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
//                     <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
//                   </svg>
//                 </button>
//               </div>
//               {row.ndc}
//             </div>
//             <div className="flex-1 min-w-[280px] text-gray-900 flex items-center gap-2">
//               <div className="flex items-center gap-0.5">
//                 <button className="p-0.5 hover:bg-gray-200 rounded text-gray-400">
//                   <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
//                     <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" />
//                   </svg>
//                 </button>
//                 <button className="p-0.5 hover:bg-gray-200 rounded text-gray-400">
//                   <Search className="w-3 h-3" />
//                 </button>
//                 <button className="p-0.5 hover:bg-gray-200 rounded text-gray-400">
//                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
//                   </svg>
//                 </button>
//               </div>
//               {row.drugName}
//             </div>
//             <div className="w-16 text-center text-gray-600">{row.rank}</div>
//             <div className="w-20 text-center text-gray-600">{row.pkgSize}</div>
//             <div className="w-24 text-center text-gray-600 flex items-center justify-center gap-1">
//               <Search className="w-3 h-3 text-gray-400" />
//               {formatNumber(row.totalOrdered)}
//             </div>
//             <div className="w-24 text-center text-gray-600">{formatNumber(row.totalBilled)}</div>
//             <div className="w-24 text-center">{renderShortageValue(row.totalShortage)}</div>
//             <div className="w-24 text-center">{renderShortageValue(row.highestShortage)}</div>
//             <div className="w-24 text-center text-gray-600">{formatNumber(row.njMedicaid)}</div>
//             <div className="w-28 text-center">{renderShortageValue(row.shortageNjMedicaid)}</div>
//             <div className="w-24 text-center">{renderShortageValue(row.pdmi)}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Search, X, ChevronDown, RotateCw } from 'lucide-react'

const inventoryData = [
  {
    id: 1,
    ndc: '61958-2501-01',
    drugName: 'BIKTARVY 50-200-25MG TAB',
    rank: 1,
    pkgSize: 30,
    totalOrdered: 2070,
    totalBilled: 3510,
    totalShortage: -1440,
    highestShortage: -500,
    cost: 1.69,

    horizon: 420,
    shortageHorizon: -40,

    express: 380,
    shortageExpress: -25,

    cvsCaremark: 300,
    shortageCvsCaremark: -15,

    ssc: 220,
    shortageSsc: -30,

    njMedicaid: 1320,
    shortageNjMedicaid: -44,

    pdmi: 750,
    shortagePdmi: -12,

    optumrx: 67,
    shortageOptumrx: -5,
  },
  {
    id: 2,
    ndc: '49702-0246-13',
    drugName: 'DOVATO 50-300MG TAB',
    rank: 2,
    pkgSize: 30,
    totalOrdered: 360,
    totalBilled: 600,
    totalShortage: -240,
    highestShortage: -120,
    cost: 1.66,

    horizon: 90,
    shortageHorizon: -9,

    express: 110,
    shortageExpress: -5,

    cvsCaremark: 60,
    shortageCvsCaremark: -4,

    ssc: 30,
    shortageSsc: -2,

    njMedicaid: 150,
    shortageNjMedicaid: -9,

    pdmi: 210,
    shortagePdmi: -10,

    optumrx: 30,
    shortageOptumrx: -1,
  },
  {
    id: 3,
    ndc: '00093-7424-56',
    drugName: 'ELIQUIS 5MG TAB',
    rank: 3,
    pkgSize: 60,
    totalOrdered: 1240,
    totalBilled: 1890,
    totalShortage: -650,
    highestShortage: -220,
    cost: 2.45,

    horizon: 310,
    shortageHorizon: -18,

    express: 420,
    shortageExpress: -30,

    cvsCaremark: 390,
    shortageCvsCaremark: -21,

    ssc: 140,
    shortageSsc: -12,

    njMedicaid: 600,
    shortageNjMedicaid: -25,

    pdmi: 180,
    shortagePdmi: -8,

    optumrx: 160,
    shortageOptumrx: -10,
  },
  {
    id: 4,
    ndc: '00071-0155-23',
    drugName: 'LANTUS SOLOSTAR PEN',
    rank: 4,
    pkgSize: 5,
    totalOrdered: 780,
    totalBilled: 1120,
    totalShortage: -340,
    highestShortage: -150,
    cost: 3.25,

    horizon: 210,
    shortageHorizon: -15,

    express: 260,
    shortageExpress: -18,

    cvsCaremark: 190,
    shortageCvsCaremark: -10,

    ssc: 90,
    shortageSsc: -6,

    njMedicaid: 320,
    shortageNjMedicaid: -14,

    pdmi: 60,
    shortagePdmi: -4,

    optumrx: 80,
    shortageOptumrx: -5,
  },
  {
    id: 5,
    ndc: '65862-0520-01',
    drugName: 'TRULICITY 1.5MG PEN',
    rank: 5,
    pkgSize: 4,
    totalOrdered: 920,
    totalBilled: 1340,
    totalShortage: -420,
    highestShortage: -180,
    cost: 4.10,

    horizon: 260,
    shortageHorizon: -22,

    express: 300,
    shortageExpress: -20,

    cvsCaremark: 240,
    shortageCvsCaremark: -16,

    ssc: 110,
    shortageSsc: -9,

    njMedicaid: 410,
    shortageNjMedicaid: -19,

    pdmi: 70,
    shortagePdmi: -6,

    optumrx: 90,
    shortageOptumrx: -7,
  },
  {
    id: 6,
    ndc: '00169-4130-68',
    drugName: 'ATORVASTATIN 20MG TAB',
    rank: 6,
    pkgSize: 90,
    totalOrdered: 2100,
    totalBilled: 2400,
    totalShortage: -300,
    highestShortage: -120,
    cost: 0.42,

    horizon: 520,
    shortageHorizon: -35,

    express: 680,
    shortageExpress: -28,

    cvsCaremark: 510,
    shortageCvsCaremark: -20,

    ssc: 300,
    shortageSsc: -15,

    njMedicaid: 900,
    shortageNjMedicaid: -33,

    pdmi: 0,
    shortagePdmi: 0,

    optumrx: 260,
    shortageOptumrx: -12,
  },
  {
    id: 7,
    ndc: '00006-0582-61',
    drugName: 'HUMALOG KWIKPEN',
    rank: 7,
    pkgSize: 5,
    totalOrdered: 640,
    totalBilled: 980,
    totalShortage: -340,
    highestShortage: -140,
    cost: 3.75,

    horizon: 180,
    shortageHorizon: -12,

    express: 220,
    shortageExpress: -16,

    cvsCaremark: 170,
    shortageCvsCaremark: -9,

    ssc: 85,
    shortageSsc: -5,

    njMedicaid: 300,
    shortageNjMedicaid: -13,

    pdmi: 40,
    shortagePdmi: -3,

    optumrx: 65,
    shortageOptumrx: -4,
  },
  {
    id: 8,
    ndc: '00002-8215-01',
    drugName: 'XARELTO 20MG TAB',
    rank: 8,
    pkgSize: 30,
    totalOrdered: 980,
    totalBilled: 1450,
    totalShortage: -470,
    highestShortage: -200,
    cost: 2.95,

    horizon: 260,
    shortageHorizon: -19,

    express: 310,
    shortageExpress: -21,

    cvsCaremark: 280,
    shortageCvsCaremark: -18,

    ssc: 120,
    shortageSsc: -10,

    njMedicaid: 430,
    shortageNjMedicaid: -20,

    pdmi: 55,
    shortagePdmi: -4,

    optumrx: 95,
    shortageOptumrx: -6,
  },
  {
    id: 9,
    ndc: '00054-4713-25',
    drugName: 'METFORMIN ER 500MG TAB',
    rank: 9,
    pkgSize: 120,
    totalOrdered: 2600,
    totalBilled: 2950,
    totalShortage: -350,
    highestShortage: -140,
    cost: 0.22,

    horizon: 610,
    shortageHorizon: -42,

    express: 780,
    shortageExpress: -34,

    cvsCaremark: 640,
    shortageCvsCaremark: -28,

    ssc: 350,
    shortageSsc: -19,

    njMedicaid: 980,
    shortageNjMedicaid: -41,

    pdmi: 0,
    shortagePdmi: 0,

    optumrx: 310,
    shortageOptumrx: -15,
  },
  {
    id: 10,
    ndc: '00093-5174-56',
    drugName: 'OZEMPIC 1MG PEN',
    rank: 10,
    pkgSize: 1,
    totalOrdered: 540,
    totalBilled: 920,
    totalShortage: -380,
    highestShortage: -170,
    cost: 5.85,

    horizon: 150,
    shortageHorizon: -14,

    express: 210,
    shortageExpress: -17,

    cvsCaremark: 160,
    shortageCvsCaremark: -11,

    ssc: 75,
    shortageSsc: -6,

    njMedicaid: 260,
    shortageNjMedicaid: -12,

    pdmi: 30,
    shortagePdmi: -2,

    optumrx: 55,
    shortageOptumrx: -4,
  },
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


const [columnWidths, setColumnWidths] = useState({
  checkbox: 40,
  ndc: 150,
  drugName: 300,
  rank: 80,
  pkgSize: 100,
  totalOrdered: 130,
  totalBilled: 130,
  totalShortage: 140,
  highestShortage: 150,
  cost: 90,

  horizon: 150,
  shortageHorizon: 150,

  express: 150,
  shortageExpress: 150,

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
})


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
    if (costValue === '') return true
    const cost = row.totalOrdered && row.totalBilled ? row.totalBilled / row.totalOrdered : 0
    return cost >= costValue
  })

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
          <div className="fixed inset-0 z-[999]" onClick={() => setOpenFilter(false)} />
          <div className="fixed z-[1000] w-[720px] rounded-xl border border-gray-200 bg-white shadow-2xl -translate-y-10 -translate-x-150" style={{ top: '120px', right: '20px' }}>
            <div className="flex items-center justify-between border-b px-4 py-3">
              <span className="text-sm font-semibold">FILTERS</span>
              <div className="flex items-center gap-2">
                <button className="rounded-md border px-3 py-1 text-xs hover:bg-gray-50">Reset Filters</button>
                <button className="rounded-md border px-3 py-1 text-xs hover:bg-gray-50">Export</button>
                <button onClick={() => setOpenFilter(false)}><X className="h-4 w-4 text-gray-500" /></button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 p-4 text-sm">
              <div>
                <h4 className="mb-2 font-semibold uppercase text-xs">Columns</h4>
                {['NDC', 'PKG SIZE', 'RANK', 'TOTAL ORDERED', 'TOTAL BILLED', 'TOTAL SHORTAGE', 'HIGHEST SHORTAGE', 'AMOUNT', 'COST'].map(item => (
                  <label key={item} className="flex items-center gap-2 py-1">
                    <input type="checkbox" className="h-4 w-4 accent-emerald-600" />
                    {item}
                  </label>
                ))}
                <h4 className="mt-4 mb-2 font-semibold uppercase text-xs">Show Label</h4>
                {['SHOW ABERRANT', 'CONTROLLED', 'FILTER NDC PERIOD'].map(item => (
                  <label key={item} className="flex items-center gap-2 py-1">
                    <input type="checkbox" className="h-4 w-4 accent-emerald-600" />
                    {item}
                  </label>
                ))}
                <div className="mt-3 -space-y-1">
                  {['VERTICAL HEADER', 'REMOVE NDC DASH', "SHORT NDC'S ONLY", 'INCLUDE SHORTAGE', 'HIGHEST SHORTAGE NAME', 'INCLUDE AMOUNT', 'INCLUDE PBM RANK', 'FILTER BY NOTE', 'CASH DISABLED'].map(item => (
                    <div key={item} className="flex items-center justify-between py-1">
                      <span className="text-sm">{item}</span>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" className="peer sr-only" />
                        <div className="h-5 w-9 rounded-full bg-gray-300 peer-checked:bg-emerald-600 after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-4" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-2 font-semibold uppercase text-xs flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  Billed
                </h4>
                {['HORIZON HEALTH (643)', 'EXPRESS SCRIPTS (399)', 'CVS CAREMARK (308)', 'SS&C (FORMERLY HUMANA, ARGUS, AND DST) (53)', 'NJ MEDICAID (51)', 'PDMI (CO-PAY CARD) (11)', 'OPTUMRX (10)', 'MCKESSON HDS (CO-PAY CARD) (5)', 'CHANGE HEALTHCARE (2)', 'EMPIRX (1)'].map(item => (
                  <label key={item} className="flex items-center gap-2 py-1">
                    <input type="checkbox" defaultChecked className="h-4 w-4 accent-emerald-600" />
                    {item}
                  </label>
                ))}
              </div>
              <div>
                <h4 className="mb-2 font-semibold uppercase text-xs flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-600" />
                  Suppliers
                </h4>
                {['KINRAY (447)', 'REAL VALUE RX (131)', 'PARMED (105)', 'AXIA (13)', 'CITYMED (12)', 'LEGACY HEALTH (5)', 'NDC DISTRIBUTORS (4)', 'TRUMARKER (2)'].map(item => (
                  <label key={item} className="flex items-center gap-2 py-1">
                    <input type="checkbox" className="h-4 w-4 accent-emerald-600" />
                    {item}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {openDrugTypeDropdown && (
        <>
          <div className="fixed inset-0 z-[999]" onClick={() => setOpenDrugTypeDropdown(false)} />
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
          <div className="fixed inset-0 z-[999]" onClick={() => setOpenFlagDropdown(false)} />
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
          <div className="fixed inset-0 z-[999]" onClick={() => { setOpenTagsDropdown(false); setOpenTagMenuId(null) }} />
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
          <div className="fixed inset-0 z-[999]" onClick={() => setOpenQtyDropdown(false)} />
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

     <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Table Header */}
          <div className="border-t border-b border-gray-400 bg-gray-50">
            <div className="flex text-xs font-semibold text-gray-700 uppercase">
              <div style={{ width: columnWidths.checkbox, minWidth: columnWidths.checkbox }} className="flex-shrink-0 flex items-center justify-center border-r border-gray-400 py-3">
                <input type="checkbox" checked={selectedRows.length === inventoryData.length} onChange={toggleAllRows} className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
              </div>

              <div style={{ width: columnWidths.ndc, minWidth: columnWidths.ndc }} className="flex-shrink-0 border-r border-gray-400 relative group">
                <div className="px-3 py-3 flex items-center justify-center gap-1">
                  NDC
                  <ChevronDown className="w-3 h-3" />
                </div>
                <div onMouseDown={(e) => handleResizeStart(e, 'ndc')} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300" />
              </div>

              <div style={{ width: columnWidths.drugName, minWidth: columnWidths.drugName }} className="flex-shrink-0 border-r border-gray-400 relative group">
                <div className="px-3 py-3 flex items-center gap-1">
                  DRUG NAME
                  <ChevronDown className="w-3 h-3" />
                </div>
                <div onMouseDown={(e) => handleResizeStart(e, 'drugName')} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300" />
              </div>

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
  <div
    key={key}
    style={{ width: columnWidths[key as keyof typeof columnWidths], minWidth: columnWidths[key as keyof typeof columnWidths] }}
    className="flex-shrink-0 border-r border-gray-400 relative group"
  >
    <div className="px-3 py-3 flex items-center justify-center gap-1">
      {dotColor && (
        <div className={`w-2 h-2 rounded-full ${
          dotColor === 'red' ? 'bg-red-500' :
          dotColor === 'yellow' ? 'bg-yellow-400' :
          dotColor === 'green' ? 'bg-emerald-500' : ''
        }`}></div>
      )}
      <span className="text-center">{label}</span>
    </div>
    <div
      onMouseDown={(e) => handleResizeStart(e, key)}
      className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300"
    />
  </div>
))}
              <div style={{ width: columnWidths.pdmi, minWidth: columnWidths.pdmi }} className="flex-shrink-0 border-r border-gray-400 relative group">
                <div className="px-3 py-3 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="whitespace-nowrap">BILLED</span>
                  </div>
                  <span className="whitespace-nowrap">PDMI (CO-PAY CARD)</span>
                </div>
                <div onMouseDown={(e) => handleResizeStart(e, 'pdmi')} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300" />
              </div>

              <div style={{ width: columnWidths.shortagePdmi, minWidth: columnWidths.shortagePdmi }} className="flex-shrink-0 border-r border-gray-400 relative group">
                <div className="px-3 py-3 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    <span className="whitespace-nowrap">SHORTAGE</span>
                  </div>
                  <span className="whitespace-nowrap">PDMI (CO-PAY CARD)</span>
                </div>
                <div onMouseDown={(e) => handleResizeStart(e, 'shortagePdmi')} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300" />
              </div>

              <div style={{ width: columnWidths.optumrx, minWidth: columnWidths.optumrx }} className="flex-shrink-0 border-r border-gray-400 relative group">
                <div className="px-3 py-3 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="whitespace-nowrap">BILLED</span>
                  </div>
                  <span className="whitespace-nowrap">OPTUMRX</span>
                </div>
                <div onMouseDown={(e) => handleResizeStart(e, 'optumrx')} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300" />
              </div>

              <div style={{ width: columnWidths.shortageOptumrx, minWidth: columnWidths.shortageOptumrx }} className="flex-shrink-0 border-r border-gray-400 relative group">
                <div className="px-3 py-3 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    <span className="whitespace-nowrap">SHORTAGE</span>
                  </div>
                  <span className="whitespace-nowrap">OPTUMRX</span>
                </div>
                <div onMouseDown={(e) => handleResizeStart(e, 'shortageOptumrx')} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300" />
              </div>

              <div style={{ width: columnWidths.cvsCaremark, minWidth: columnWidths.cvsCaremark }} className="flex-shrink-0 border-r border-gray-400 relative group">
                <div className="px-3 py-3 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="whitespace-nowrap">BILLED</span>
                  </div>
                  <span className="whitespace-nowrap">CVS CAREMARK</span>
                </div>
                <div onMouseDown={(e) => handleResizeStart(e, 'cvsCaremark')} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300" />
              </div>

              <div style={{ width: columnWidths.shortageCvsCaremark, minWidth: columnWidths.shortageCvsCaremark }} className="flex-shrink-0 border-r border-gray-400 relative group">
                <div className="px-3 py-3 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    <span className="whitespace-nowrap">SHORTAGE</span>
                  </div>
                  <span className="whitespace-nowrap">CVS CAREMARK</span>
                </div>
                <div onMouseDown={(e) => handleResizeStart(e, 'shortageCvsCaremark')} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300" />
              </div>

              <div style={{ width: columnWidths.ssc, minWidth: columnWidths.ssc }} className="flex-shrink-0 border-r border-gray-400 relative group">
                <div className="px-3 py-3 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="whitespace-nowrap text-[11px]">BILLED SS&C</span>
                  </div>
                  <span className="whitespace-nowrap text-[10px]">(HUMANA, ARGUS, DST)</span>
                </div>
                <div onMouseDown={(e) => handleResizeStart(e, 'ssc')} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300" />
              </div>

              <div style={{ width: columnWidths.shortageSsc, minWidth: columnWidths.shortageSsc }} className="flex-shrink-0 border-r border-gray-400 relative group">
                <div className="px-3 py-3 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    <span className="whitespace-nowrap text-[11px]">SHORTAGE SS&C</span>
                  </div>
                  <span className="whitespace-nowrap text-[10px]">(HUMANA, ARGUS, DST)</span>
                </div>
                <div onMouseDown={(e) => handleResizeStart(e, 'shortageSsc')} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300" />
              </div>

              <div style={{ width: columnWidths.njMedicaid, minWidth: columnWidths.njMedicaid }} className="flex-shrink-0 border-r border-gray-400 relative group">
                <div className="px-3 py-3 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="whitespace-nowrap">BILLED</span>
                  </div>
                  <span className="whitespace-nowrap">NJ MEDICAID</span>
                </div>
                <div onMouseDown={(e) => handleResizeStart(e, 'njMedicaid')} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300" />
              </div>

              <div style={{ width: columnWidths.shortageNjMedicaid, minWidth: columnWidths.shortageNjMedicaid }} className="flex-shrink-0 relative group">
                <div className="px-3 py-3 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                    <span className="whitespace-nowrap">SHORTAGE</span>
                  </div>
                  <span className="whitespace-nowrap">NJ MEDICAID</span>
                </div>
                <div onMouseDown={(e) => handleResizeStart(e, 'shortageNjMedicaid')} className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-emerald-500 group-hover:bg-emerald-300" />
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div>
            {filteredData.map((row, index) => (
              <div
                key={row.id}
                className={`flex text-sm border-b border-gray-300 ${index % 2 === 1 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-colors`}
              >
                <div style={{ width: columnWidths.checkbox, minWidth: columnWidths.checkbox }} className="flex-shrink-0 flex items-center justify-center border-r border-gray-400 py-2">
                  <input type="checkbox" checked={selectedRows.includes(row.id)} onChange={() => toggleRowSelection(row.id)} className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                </div>

                <div style={{ width: columnWidths.ndc, minWidth: columnWidths.ndc }} className="flex-shrink-0 border-r border-gray-400 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      <button className="p-0.5 hover:bg-gray-200 rounded text-gray-400">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" /></svg>
                      </button>
                      <button className="p-0.5 hover:bg-gray-200 rounded text-gray-400"><Search className="w-3 h-3" /></button>
                      <button className="p-0.5 hover:bg-gray-200 rounded text-gray-400">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 001-1V3a2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" clipRule="evenodd" /></svg>
                      </button>
                    </div>
                    <span className="text-gray-600">{row.ndc}</span>
                  </div>
                </div>

                <div style={{ width: columnWidths.drugName, minWidth: columnWidths.drugName }} className="flex-shrink-0 border-r border-gray-400 px-3 py-2">
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

                <div style={{ width: columnWidths.rank, minWidth: columnWidths.rank }} className="flex-shrink-0 border-r border-gray-400 px-3 py-2 text-center flex items-center justify-center">{row.rank}</div>
                <div style={{ width: columnWidths.pkgSize, minWidth: columnWidths.pkgSize }} className="flex-shrink-0 border-r border-gray-400 px-3 py-2 text-center flex items-center justify-center">{row.pkgSize}</div>
                <div style={{ width: columnWidths.totalOrdered, minWidth: columnWidths.totalOrdered }} className="flex-shrink-0 border-r border-gray-400 px-3 py-2 text-center flex items-center justify-center">{formatNumber(row.totalOrdered)}</div>
                <div style={{ width: columnWidths.totalBilled, minWidth: columnWidths.totalBilled }} className="flex-shrink-0 border-r border-gray-400 px-3 py-2 text-center flex items-center justify-center">{formatNumber(row.totalBilled)}</div>
                <div style={{ width: columnWidths.totalShortage, minWidth: columnWidths.totalShortage }} className="flex-shrink-0 border-r border-gray-400 px-3 py-2 text-center flex items-center justify-center">{renderShortageValue(row.totalShortage)}</div>
                <div style={{ width: columnWidths.highestShortage, minWidth: columnWidths.highestShortage }} className="flex-shrink-0 border-r border-gray-400 px-3 py-2 text-center flex items-center justify-center">{renderShortageValue(row.highestShortage)}</div>
                <div style={{ width: columnWidths.cost, minWidth: columnWidths.cost }} className="flex-shrink-0 border-r border-gray-400 px-3 py-2 text-center flex items-center justify-center">${row.cost}</div>
                <div style={{ width: columnWidths.horizon, minWidth: columnWidths.horizon }} className="flex-shrink-0 border-r border-gray-400 px-3 py-2 text-center flex items-center justify-center">{row.horizon}</div>
                <div style={{ width: columnWidths.shortageHorizon, minWidth: columnWidths.shortageHorizon }} className="flex-shrink-0 border-r border-gray-400 px-3 py-2 text-center flex items-center justify-center">{renderShortageValue(row.shortageHorizon)}</div>
                <div style={{ width: columnWidths.express, minWidth: columnWidths.express }} className="flex-shrink-0 border-r border-gray-400 px-3 py-2 text-center flex items-center justify-center">{row.express}</div>
                <div style={{ width: columnWidths.shortageExpress, minWidth: columnWidths.shortageExpress }} className="flex-shrink-0 border-r border-gray-400 px-3 py-2 text-center flex items-center justify-center">{renderShortageValue(row.shortageExpress)}</div>
                <div style={{ width: columnWidths.pdmi, minWidth: columnWidths.pdmi }} className="flex-shrink-0 border-r border-gray-400 px-3 py-2 text-center flex items-center justify-center">{row.pdmi}</div>
                <div style={{ width: columnWidths.shortagePdmi, minWidth: columnWidths.shortagePdmi }} className="flex-shrink-0 border-r border-gray-400 px-3 py-2 text-center flex items-center justify-center">{renderShortageValue(row.shortagePdmi)}</div>
                <div style={{ width: columnWidths.optumrx, minWidth: columnWidths.optumrx }} className="flex-shrink-0 border-r border-gray-400 px-3 py-2 text-center flex items-center justify-center">{row.optumrx}</div>
                <div style={{ width: columnWidths.shortageOptumrx, minWidth: columnWidths.shortageOptumrx }} className="flex-shrink-0 border-r border-gray-400 px-3 py-2 text-center flex items-center justify-center">{renderShortageValue(row.shortageOptumrx)}</div>
                <div style={{ width: columnWidths.cvsCaremark, minWidth: columnWidths.cvsCaremark }} className="flex-shrink-0 border-r border-gray-400 px-3 py-2 text-center flex items-center justify-center">{row.cvsCaremark}</div>
                <div style={{ width: columnWidths.shortageCvsCaremark, minWidth: columnWidths.shortageCvsCaremark }} className="flex-shrink-0 border-r border-gray-400 px-3 py-2 text-center flex items-center justify-center">{renderShortageValue(row.shortageCvsCaremark)}</div>
                <div style={{ width: columnWidths.ssc, minWidth: columnWidths.ssc }} className="flex-shrink-0 border-r border-gray-400 px-3 py-2 text-center flex items-center justify-center">{row.ssc}</div>
                <div style={{ width: columnWidths.shortageSsc, minWidth: columnWidths.shortageSsc }} className="flex-shrink-0 border-r border-gray-400 px-3 py-2 text-center flex items-center justify-center">{renderShortageValue(row.shortageSsc)}</div>
                <div style={{ width: columnWidths.njMedicaid, minWidth: columnWidths.njMedicaid }} className="flex-shrink-0 border-r border-gray-400 px-3 py-2 text-center flex items-center justify-center">{row.njMedicaid}</div>
                <div style={{ width: columnWidths.shortageNjMedicaid, minWidth: columnWidths.shortageNjMedicaid }} className="flex-shrink-0 px-3 py-2 text-center flex items-center justify-center">{renderShortageValue(row.shortageNjMedicaid)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

