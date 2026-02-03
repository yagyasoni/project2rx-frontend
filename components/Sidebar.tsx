'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Layers,
  Search,
  Ticket,
  HelpCircle,
  LifeBuoy,
  User,
  RefreshCw,
  Settings
} from 'lucide-react'

interface SidebarProps {
  sidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void
  activePanel: string | null
  setActivePanel: (value: string | null) => void
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activePanel,
  setActivePanel
}: SidebarProps) {

  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const navClass = (path: string) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200
     ${
       isActive(path)
         ? 'bg-gray-200/60 text-gray-700'
         : 'text-gray-700 hover:bg-gray-100'
     }`

  return (
    <aside
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
    >
      {/* HEADER */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              {/* <div className="w-6 h-6 bg-[#A6A6A6] rounded flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-primary" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
              </div> */}
              
              <span className="font-bold text-gray-900">MedRx.co</span>
            </div>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-100 rounded"
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

        <Link href="/Mainpage" className={navClass('/Mainpage')}>
          <Layers className="w-5 h-5" />
          {sidebarOpen && <span>Start Audit</span>}
        </Link>

        <Link href="/ReportsPage" className={navClass('/ReportsPage')}>
          <FileText className="w-5 h-5" />
          {sidebarOpen && <span>Reports</span>}
        </Link>

        <Link href="/bin-search" className={navClass('/bin-search')}>
          <Search className="w-5 h-5" />
          {sidebarOpen && <span>Bin Search</span>}
        </Link>

        <Link href="/tickets" className={navClass('/tickets')}>
          <Ticket className="w-5 h-5" />
          {sidebarOpen && (
            <div className="flex justify-between w-full">
              <span>Tickets</span>
              <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded">
                NEW
              </span>
            </div>
          )}
        </Link>

        <Link href="/how-to" className={navClass('/how-to')}>
          <HelpCircle className="w-5 h-5" />
          {sidebarOpen && <span>How To</span>}
        </Link>

      </nav>

      {/* BOTTOM */}
      <div className="border-t border-gray-200 p-4 space-y-2">

        <Link href="/support" className={navClass('/support')}>
          <LifeBuoy className="w-5 h-5" />
          {sidebarOpen && <span>Customer Support</span>}
        </Link>

        <Link href="/account" className={navClass('/account')}>
          <User className="w-5 h-5" />
          {sidebarOpen && <span>Account</span>}
        </Link>

        <Link href="/settings" className={navClass('/settings')}>
          <Settings className="w-5 h-5" />
          {sidebarOpen && <span>Settings</span>}
        </Link>

        <button
          onClick={() => window.location.reload()}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <RefreshCw className="w-5 h-5" />
          {sidebarOpen && <span>Hard Refresh</span>}
        </button>

      </div>
    </aside>
  )
}
