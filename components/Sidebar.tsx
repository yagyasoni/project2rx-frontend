"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Settings,
  Phone,
  X,
  ChevronDown,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
  activePanel: string | null;
  setActivePanel: (value: string | null) => void;
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activePanel,
  setActivePanel,
}: SidebarProps) {
  const pathname = usePathname();
  const [showSupportPopup, setShowSupportPopup] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const supportRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        supportRef.current &&
        !supportRef.current.contains(event.target as Node)
      ) {
        setShowSupportPopup(false);
      }
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setShowAccountDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => pathname === path;

  const navClass = (path: string) =>
    `w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200
     ${
       isActive(path)
         ? "bg-gray-200/60 text-gray-700"
         : "text-gray-700 hover:bg-gray-100"
     }`;

  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logging out...");
    // Example: router.push('/login')
  };

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col relative`}
    >
      {/* HEADER */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900">AuditProRx</span>
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
        <Link href="/Mainpage" className={navClass("/Mainpage")}>
          <Layers className="w-5 h-5" />
          {sidebarOpen && <span>Start Audit</span>}
        </Link>

        <Link href="/ReportsPage" className={navClass("/ReportsPage")}>
          <FileText className="w-5 h-5" />
          {sidebarOpen && <span>Reports</span>}
        </Link>

        <Link href="/bin-search" className={navClass("/bin-search")}>
          <Search className="w-5 h-5" />
          {sidebarOpen && <span>Bin Search</span>}
        </Link>

        <Link href="/tickets" className={navClass("/tickets")}>
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

        <Link href="/how-to" className={navClass("/how-to")}>
          <HelpCircle className="w-5 h-5" />
          {sidebarOpen && <span>How To</span>}
        </Link>
      </nav>

      {/* BOTTOM */}
      <div className="border-t border-gray-200 p-4 space-y-2">
        {/* Customer Support with Popup */}
        <div className="relative" ref={supportRef}>
          <button
            onClick={() => setShowSupportPopup(!showSupportPopup)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
              showSupportPopup
                ? "bg-gray-200/60 text-gray-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <LifeBuoy className="w-5 h-5" />
            {sidebarOpen && (
              <>
                <span className="flex-1 text-left">Customer Support</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Support Popup */}
          {showSupportPopup && sidebarOpen && (
            <div className="absolute left-full ml-2 bottom-0 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    Contact Support
                  </h3>
                  <button
                    onClick={() => setShowSupportPopup(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Customer Support */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
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
                      href="tel:+1 (551) 229-6466"
                      className="p-2 hover:bg-white rounded-full transition-colors"
                    >
                      <Phone className="w-5 h-5 text-green-700" />
                    </a>
                  </div>

                  {/* Zee Rabushaj */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
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
                      href="tel:6466179881"
                      className="p-2 hover:bg-white rounded-full transition-colors"
                    >
                      <Phone className="w-5 h-5 text-gray-600" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        

        {/* Account Name - just display, no dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAccountDropdown(!showAccountDropdown)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
          >
            <User className="w-5 h-5 text-gray-700 shrink-0" />
            {sidebarOpen && (
              <>
                <div className="flex-1 min-w-0 text-left">
                  <div className="text-sm font-semibold text-gray-900">Account Name</div>
                  <div className="text-xs text-gray-500 truncate">United Drugs Pharma...</div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </>
            )}
          </button>

          {showAccountDropdown && (
            <div className="absolute left-full ml-2 bottom-0 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-3">
              <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-100">
                <span className="text-sm font-semibold text-gray-900">United Drugs Pharmacy</span>
                <div className="w-6 h-6 rounded-full border-2 border-green-600 flex items-center justify-center shrink-0 ml-2">
                  <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Settings with dropdown */}
        {/* Settings with dropdown */}
        <div className="relative" ref={accountRef}>
          <button
            onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
              showSettingsDropdown
                ? "bg-gray-100 text-gray-900"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {sidebarOpen && (
              <>
                <span className="flex-1 text-left">Settings</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </>
            )}
          </button>

          {showSettingsDropdown && (
            <div className="absolute left-full ml-2 bottom-0 w-52 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
              <Link
                href="/settings"
                className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowSettingsDropdown(false)}
              >
                <Settings className="w-4 h-4" />
                <span className="font-medium">Settings</span>
              </Link>
              <button
                onClick={() => { setShowSettingsDropdown(false); handleLogout(); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Hard Refresh */}
        <button
          onClick={() => window.location.reload()}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-semibold transition-all duration-200"
        >
          <RefreshCw className="w-5 h-5" />
          {sidebarOpen && <span>Hard Refresh</span>}
        </button>
      </div>
    </aside>
  );
}
