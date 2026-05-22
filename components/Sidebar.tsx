"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Layers,
  Search,
  HelpCircle,
  LifeBuoy,
  User,
  RefreshCw,
  Settings,
  Phone,
  X,
  GitBranch,
  Pill,
  MessageCircle,
  Boxes,
  LogOut,
  Bell,
} from "lucide-react";
import api from "@/lib/api";
import l from "@/public/l.png";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (value: boolean) => void;
  activePanel: string | null;
  setActivePanel: (value: string | null) => void;
}

type Popup = "support" | "account" | "settings" | null;

// Key must match the one used in page.tsx
const READ_IDS_KEY = "notif_read_ids";

function getReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_IDS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [accountName, setAccountName] = useState("...");
  const [openPopup, setOpenPopup] = useState<Popup>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [subscription, setSubscription] = useState<any>(null);

  const toggle = (name: Popup) =>
    setOpenPopup((prev) => (prev === name ? null : name));

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) return;

        const res = await api.get(`/pay/subscription/${userId}`);

        setSubscription(res.data.subscription);
      } catch (err) {
        console.error(err);
      }
    };

    const pharmacy = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await api.get("/auth/pharmacy-details", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const name = res?.data?.pharmacy?.pharmacy_name || "Account Name";
        setAccountName(name);
      } catch {
        setAccountName(localStorage.getItem("pharmacyName") || "Account Name");
      }
    };
    fetchSubscription();
    pharmacy();
  }, []);

  // Compute unread count by comparing total posts against persisted read IDs
  // This stays in sync with the notification page via localStorage + custom event
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await api.get("/post/client/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const posts = Array.isArray(res?.data) ? res.data : [];
        const readIds = getReadIds();
        // A post is "unread" if its id is NOT in the persisted read set
        const count = posts.filter((p: any) => !readIds.has(p.id)).length;
        setUnreadCount(count);
      } catch {
        setUnreadCount(0);
      }
    };

    fetchUnread();

    // Poll every 60 seconds for new posts
    const interval = setInterval(fetchUnread, 60000);

    // Listen for instant badge clear when notification page marks posts as read
    const handleUpdate = () => fetchUnread();
    window.addEventListener("notifications-updated", handleUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener("notifications-updated", handleUpdate);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        bottomRef.current &&
        !bottomRef.current.contains(event.target as Node)
      ) {
        setOpenPopup(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => pathname === path;

  const navClass = (path: string) =>
    `group w-full flex items-center gap-3 py-2.5 rounded-lg font-medium text-[14px] transition-all duration-200
     ${sidebarOpen ? "px-3" : "px-0 justify-center"}
     ${
       isActive(path)
         ? "bg-gray-100 text-gray-900"
         : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
     }`;

  const iconClass = (path: string) =>
    `h-[18px] w-[18px] shrink-0 transition-colors ${
      isActive(path)
        ? "text-gray-900"
        : "text-gray-400 group-hover:text-gray-700"
    }`;

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await api.post("/auth/logout", { refreshToken });
    } catch {
    } finally {
      localStorage.clear();
      router.push("/auth");
    }
  };

  // const navItems = [
  //   { path: "/Mainpage", label: "Start Audit", icon: FileText },
  //   { path: "/ReportsPage", label: "Reports", icon: Layers },
  //   { path: "/bin-search", label: "Bin Search", icon: Search },
  //   { path: "/DrugLookup", label: "Drug Lookup", icon: Pill },
  //   { path: "/InventoryView", label: "Inventory View", icon: Boxes },
  //   { path: "/how-to", label: "How To", icon: HelpCircle },
  // ];

  const navItems = [
    subscription?.inventory_reports_access && {
      path: "/Mainpage",
      label: "Start Audit",
      icon: FileText,
    },

    subscription?.inventory_reports_access && {
      path: "/ReportsPage",
      label: "Reports",
      icon: Layers,
    },

    subscription?.inventory_reports_access && {
      path: "/bin-search",
      label: "Bin Search",
      icon: Search,
    },

    subscription?.drug_lookup_access && {
      path: "/DrugLookup",
      label: "Drug Lookup",
      icon: Pill,
    },

    subscription?.inventory_view_access && {
      path: "/InventoryView",
      label: "Inventory View",
      icon: Boxes,
    },

    {
      path: "/how-to",
      label: "How To",
      icon: HelpCircle,
    },
  ].filter(Boolean);

  return (
    <aside
      className={`relative flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-[72px]"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        {sidebarOpen ? (
          <Link href="/Mainpage" className="flex items-center gap-3">
            <div className="flex h-8.5 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white overflow-hidden">
              <Image
                src={l}
                alt="AuditProRx"
                className="object-cover h-full align-middle w-full"
                priority
              />
            </div>
            <span className="text-[15px] font-semibold text-gray-900 tracking-tight">
              AuditProRx
            </span>
          </Link>
        ) : (
          <div className="mx-auto flex h-8.5 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white overflow-hidden">
            <Image
              src={l}
              alt="AuditProRx"
              width={22}
              height={22}
              className="object-cover h-full align-middle w-full"
              priority
            />
          </div>
        )}

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 transition"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {sidebarOpen && (
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Workspace
          </p>
        )}

        {navItems.map(({ path, label, icon: Icon }) => (
          <Link key={path} href={path} className={navClass(path)}>
            <Icon className={iconClass(path)} />
            {sidebarOpen && <span className="truncate">{label}</span>}
          </Link>
        ))}

        {/* UPDATES SECTION */}
        {sidebarOpen && subscription?.leads_access && (
          <p className="px-3 pt-5 pb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            Updates
          </p>
        )}
        {!sidebarOpen && <div className="my-3 mx-2 border-t border-gray-100" />}

        {subscription?.leads_access && (
          <Link href="/Notification" className={navClass("/Notification")}>
            <div className="relative shrink-0">
              <Bell className={iconClass("/Notification")} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </div>
            {sidebarOpen && (
              <div className="flex-1 flex items-center justify-between min-w-0">
                <span className="truncate">Leads</span>
                {unreadCount > 0 && (
                  <span className="ml-2 rounded-full bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 min-w-[18px] text-center leading-tight">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>
            )}
          </Link>
        )}
      </nav>

      {/* BOTTOM */}
      <div
        ref={bottomRef}
        className="border-t border-gray-100 px-3 py-3 space-y-1"
      >
        {/* SUPPORT */}
        <div className="relative">
          <button
            onClick={() => toggle("support")}
            className={`group w-full flex items-center gap-3 py-2.5 rounded-lg font-medium text-[14px] transition ${
              sidebarOpen ? "px-3" : "justify-center"
            } ${
              openPopup === "support"
                ? "bg-gray-100 text-gray-900"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <LifeBuoy className="h-[18px] w-[18px] text-gray-400 group-hover:text-gray-700" />
            {sidebarOpen && <span>Customer Support</span>}
          </button>

          {openPopup === "support" && sidebarOpen && (
            <div className="absolute left-full bottom-0 ml-3 w-72 rounded-lg border border-gray-200 bg-white p-4 shadow-lg z-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900">
                  Contact Support
                </h4>
                <X
                  className="h-4 w-4 text-gray-400 hover:text-gray-700 cursor-pointer"
                  onClick={() => setOpenPopup(null)}
                />
              </div>

              <div className="flex items-center gap-3 rounded-md border p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100">
                  <User className="h-4 w-4 text-gray-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    Fahad Mulla
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Phone className="h-3 w-3" /> +1 (551) 229-6466
                  </p>
                </div>
                <a
                  href="https://wa.me/15512296466?text=Hi%20Fahad%2C%20I%20need%20help%20with%20AuditProRx"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Chat on WhatsApp"
                  className="p-2 hover:bg-white rounded-full transition-colors"
                >
                  <MessageCircle className="h-5 w-5 text-gray-700 cursor-pointer" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* ACCOUNT */}
        <div className="relative">
          <button
            onClick={() => toggle("account")}
            className={`w-full flex items-center gap-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition ${
              sidebarOpen ? "px-3" : "justify-center"
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-sm font-semibold shrink-0">
              {accountName?.charAt(0)?.toUpperCase() || "A"}
            </div>

            {sidebarOpen && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                  Account
                </p>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {accountName}
                </p>
              </div>
            )}
          </button>

          {openPopup === "account" && sidebarOpen && (
            <div className="absolute left-full bottom-0 ml-3 w-56 rounded-lg border border-gray-200 bg-white p-3 shadow-lg z-50">
              <p className="text-sm font-medium text-gray-900">{accountName}</p>
            </div>
          )}
        </div>

        {/* SETTINGS */}
        <div className="relative">
          <button
            onClick={() => toggle("settings")}
            className={`group w-full flex items-center gap-3 py-2.5 rounded-lg font-medium text-[14px] text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition ${
              sidebarOpen ? "px-3" : "justify-center"
            }`}
          >
            <Settings className="h-[18px] w-[18px] text-gray-400 group-hover:text-gray-700" />
            {sidebarOpen && <span>Settings</span>}
          </button>

          {openPopup === "settings" && sidebarOpen && (
            <div className="absolute left-full bottom-0 ml-3 w-52 rounded-lg border border-gray-200 bg-white p-2 shadow-lg z-50">
              <button
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => router.push("/settings")}
              >
                <Settings className="h-4 w-4" /> Settings
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          )}
        </div>

        {/* REFRESH */}
        <button
          onClick={() => window.location.reload()}
          className={`group w-full flex items-center gap-3 py-2.5 rounded-lg font-medium text-[14px] text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition ${
            sidebarOpen ? "px-3" : "justify-center"
          }`}
        >
          <RefreshCw className="h-[18px] w-[18px] text-gray-400 group-hover:text-gray-700" />
          {sidebarOpen && <span>Hard Refresh</span>}
        </button>

        {/* VERSION */}
        <div
          className={`flex items-center gap-2 pt-2 ${
            sidebarOpen ? "px-3" : "justify-center"
          }`}
        >
          <GitBranch className="h-3.5 w-3.5 text-gray-400" />
          {sidebarOpen && (
            <span className="text-[11px] text-gray-400 font-medium">v1.4</span>
          )}
        </div>
      </div>
    </aside>
  );
}
