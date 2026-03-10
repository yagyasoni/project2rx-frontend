"use client";

import { ReactNode, useState } from "react";
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

const navItems = [
  { id: 1, title: "Suppliers", icon: Package },
  { id: 2, title: "PMS", icon: SquareStack },
  { id: 3, title: "Users", icon: Users },
  { id: 4, title: "Mailing Info", icon: Mail },
];

const SettingsLayout = () => {
  const [active, setActive] = useState("Users");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          collapsed ? "w-16" : "w-64"
        } bg-foreground text-background flex flex-col transition-all duration-200 relative`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-muted-foreground/20">
          <a href="/Mainpage">
            <button className="w-8 h-8 rounded-full border border-muted-foreground/40 flex items-center justify-center hover:bg-muted-foreground/20 transition-colors">
              <ArrowLeft size={16} />
            </button>
          </a>
          {!collapsed && (
            <span className="text-lg font-semibold tracking-tight">
              Settings
            </span>
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-background text-foreground"
                    : "text-muted-foreground hover:bg-muted-foreground/10 hover:text-background"
                }`}
              >
                <item.icon size={18} className="shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </button>
            );
          })}
        </nav>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-foreground border border-muted-foreground/30 flex items-center justify-center text-background hover:bg-muted-foreground/80 transition-colors"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {active === "Users" && <UsersPage />}
        {active === "Mailing Info" && <MailingInfoPage />}
      </main>
    </div>
  );
};

export default SettingsLayout;
