'use client'

import React, { useState } from 'react'
import { Suspense } from 'react'
import Loading from './loading'
import Sidebar from '@/components/Sidebar'
import { Layers, FileText } from 'lucide-react'
import AuditWizard from './AuditWizard'

export default function BatchRxDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [activePanel, setActivePanel] = useState<string | null>(null)
  const [view, setView] = useState(false)

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex h-screen bg-background">

        
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
        />

        
        <main className="flex-1 overflow-auto bg-gray-100 flex">

          {/* Center Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-4">

           { (!view) ? (  <div className="max-w-2xl w-full space-y-8">

              {/* Title */}
              <div className="text-center space-y-3">
                <h1 className="text-4xl md:text-4xl font-bold text-gray-900">
                  Select a Report to Get Started
                </h1>
                <p className="text-lg text-gray-600">
                  Features that streamline your pharmacy audit compliance.
                </p>
              </div>

              {/* Report Cards */}
              <div className="flex justify-center items-center w-full gap-6 pt-8">

                {/* Inventory */}
                <button
                  onClick={() => setSelectedReport('inventory')}
                  className={`w-[30%] bg-white rounded-md border border-gray-200 group relative p-6 pb-0 transition-all duration-300 ${
                    selectedReport === 'inventory'
                      ? 'bg-white text-gray-600scale-105'
                      : 'bg-white text-gray-600'
                  }`}
                >
                  <div className="flex flex-col items-start space-y-4">
                    <div className="w-20 h-20 bg-blue-300 rounded-lg flex items-center justify-center">
                      <Layers className="size-8 text-black" />
                    </div>

                    <div className="text-start">
                      <h3 className="text-xl text-gray-700 font-semibold">INVENTORY</h3>
                      <p className="text-lg opacity-90 text-gray-700 font-semibold">Report</p>
                    </div>
                  </div>
                   <div className="flex justify-center pt-8">
                {/* <button onClick={() => setView(true)} className="px-10 py-3 bg-gradient-to-r from-[#0D0D0D] to-[#404040] text-white font-semibold rounded-sm transition">
                  Start
                </button> */}
              </div>
                </button>

                {/* Aberrant */}
                {/* <button
                  onClick={() => setSelectedReport('aberrant')}
                  className={`group relative p-8 rounded-2xl transition-all duration-300 border-2 ${
                    selectedReport === 'aberrant'
                      ? 'border-purple-400 bg-white shadow-xl scale-105'
                      : 'border-gray-200 bg-white hover:shadow-lg'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-20 h-20 bg-purple-200 rounded-2xl flex items-center justify-center">
                      <FileText className="w-10 h-10 text-purple-500" />
                    </div>

                    <div className="text-center">
                      <h3 className="text-xl font-bold uppercase text-gray-900">
                        Aberrant
                      </h3>
                      <p className="text-sm text-gray-600">Report</p>
                    </div>
                  </div>
                </button> */}

              </div>

              {/* Start Button */}
              <div className="flex justify-center pt-8">
               <button onClick={() => setView(true)} className="px-10 py-2 bg-gradient-to-r from-[#0D0D0D] to-[#404040] text-white font-semibold rounded-sm transition">
                  Start
                </button>
              </div>
               

            </div> ) : (<AuditWizard />) }
          </div>

          {/* RIGHT PANEL (kept exactly same logic) */}
          {activePanel && (
            <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto">
              {activePanel === 'support' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Customer Support
                  </h2>
                  <p className="text-sm text-gray-600">
                    Call: 777-777-7777
                  </p>
                </div>
              )}

              {activePanel === 'account' && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Account Information
                  </h2>
                  <p className="text-sm text-gray-600">
                    United Drugs Pharmacy
                  </p>
                </div>
              )}
            </div>
          )}

        </main>
      </div>
    </Suspense>
  )
}
