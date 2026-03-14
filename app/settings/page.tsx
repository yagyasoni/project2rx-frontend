"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Package,
  Users,
  Mail,
  ChevronLeft,
  ChevronRight,
  SquareStack,
} from "lucide-react";
import UsersPage from "@/components/settings/UsersPage";
import MailingInfoPage from "@/components/settings/MailingInfoPage";
import SuppliersPage from "@/components/settings/Supplierspage";
import PMSPage from "@/components/settings/Pmspage";

const navItems = [
  { id: 1, title: "Suppliers", icon: Package },
  { id: 2, title: "PMS", icon: SquareStack },
  { id: 3, title: "Users", icon: Users },
  // { id: 4, title: "Mailing Info", icon: Mail },
];

const SettingsLayout = () => {
  const [active, setActive] = useState("Suppliers");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#f8f8f8]">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-16" : "w-[220px]"
        } bg-[#0f0f0f] text-white flex flex-col transition-all duration-200 relative shrink-0`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <a href="/Mainpage">
            <button className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors shrink-0">
              <ArrowLeft size={16} className="text-white" />
            </button>
          </a>
          {!collapsed && (
            <div>
              <span className="text-sm font-bold tracking-tight text-white">Settings</span>
              <p className="text-[10px] text-slate-500 mt-0.5">System configuration</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = active === item.title;
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.title)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? "bg-white text-slate-900 shadow-md"
                    : "text-slate-500 hover:bg-white/8 hover:text-white"
                }`}
              >
                <item.icon size={16} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.title}</span>}
                {!collapsed && isActive && (
                  <ChevronRight size={13} className="ml-auto text-slate-400 shrink-0" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="px-4 py-3 border-t border-white/10">
            <p className="text-[10px] text-slate-600 font-medium">MedRx · v1.0</p>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#0f0f0f] border border-white/20 flex items-center justify-center text-white hover:bg-slate-700 transition-colors z-10"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <div className="bg-white border-b border-slate-200 px-8 py-5 shrink-0">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{active}</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {active === "Suppliers" && "Manage wholesalers & distributors"}
            {active === "PMS" && "Pharmacy management system settings"}
            {active === "Users" && "Manage accounts & permissions"}
            {active === "Mailing Info" && "Email & address configuration"}
          </p>
        </div>

        <main className="flex-1 p-8 overflow-auto">
          {active === "Suppliers" && <SuppliersPage />}
          {active === "PMS" && <PMSPage />}
          {active === "Users" && <UsersPage />}
          {active === "Mailing Info" && <MailingInfoPage />}
        </main>
      </div>
    </div>
  );
};

export default SettingsLayout;