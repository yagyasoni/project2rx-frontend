'use client'

import React, { useState } from 'react'
import { Suspense } from 'react'
import Loading from './loading'
import Sidebar from '@/components/Sidebar'
import { Layers, FileText } from 'lucide-react'

export default function BatchRxDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [activePanel, setActivePanel] = useState<string | null>(null)

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex h-screen bg-background">

        
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
        />

        
        <main className="flex-1 overflow-auto bg-gray-50 flex">

          {/* Center Content */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">

            <div className="max-w-2xl w-full space-y-8">

              {/* Title */}
              <div className="text-center space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Select a Report to Get Started
                </h1>
                <p className="text-lg text-teal-800">
                  Features that streamline your pharmacy audit compliance.
                </p>
              </div>

              {/* Report Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">

                {/* Inventory */}
                <button
                  onClick={() => setSelectedReport('inventory')}
                  className={`group relative p-8 rounded-2xl transition-all duration-300 ${
                    selectedReport === 'inventory'
                      ? 'bg-teal-700 text-white shadow-xl scale-105'
                      : 'bg-teal-700 text-white hover:shadow-lg'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center">
                      <Layers className="w-10 h-10 text-teal-700" />
                    </div>

                    <div className="text-center">
                      <h3 className="text-xl font-bold uppercase">Inventory</h3>
                      <p className="text-sm opacity-90">Report</p>
                    </div>
                  </div>
                </button>

                {/* Aberrant */}
                <button
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
                </button>

              </div>

              {/* Start Button */}
              <div className="flex justify-center pt-8">
                <button className="px-10 py-3 bg-teal-700 text-white font-semibold rounded-lg hover:bg-teal-800 transition shadow-md">
                  Start
                </button>
              </div>

            </div>
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
