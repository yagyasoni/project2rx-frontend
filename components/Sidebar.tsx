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
  Lock,
  Users,
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

const READ_IDS_KEY = "notif_read_ids";

function getReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_IDS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

const ALL_NAV_ITEMS = [
  {
    path: "/Mainpage",
    label: "Start Audit",
    icon: FileText,
    accessKey: "inventory_reports_access",
  },
  {
    path: "/ReportsPage",
    label: "Reports",
    icon: Layers,
    accessKey: "inventory_reports_access",
  },
  {
    path: "/group-reports",
    label: "Group Reports",
    icon: Users,
    accessKey: "inventory_view_access",
  },
  {
    path: "/bin-search",
    label: "Bin Search",
    icon: Search,
    accessKey: "inventory_reports_access",
  },
  {
    path: "/DrugLookup",
    label: "Drug Lookup",
    icon: Pill,
    accessKey: "drug_lookup_access",
  },
  {
    path: "/InventoryView",
    label: "Inventory View",
    icon: Boxes,
    accessKey: "inventory_view_access",
  },
  {
    path: "/how-to",
    label: "How To",
    icon: HelpCircle,
    accessKey: null,
  },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [accountName, setAccountName] = useState("...");
  const [openPopup, setOpenPopup] = useState<Popup>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [subscription, setSubscription] = useState<any>(null);
  const [subscriptionLoaded, setSubscriptionLoaded] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const toggle = (name: Popup) =>
    setOpenPopup((prev) => (prev === name ? null : name));

  /* ─────────────────────────────────────────
     SUBSCRIPTION POLLING
  ───────────────────────────────────────── */
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          setSubscriptionLoaded(true);
          return;
        }

        const res = await api.get(`/pay/subscription/${userId}`);

        setSubscription(res.data.subscription);
      } catch (err) {
        console.error(err);
      } finally {
        setSubscriptionLoaded(true);
      }
    };

    fetchSubscription();

    const interval = setInterval(async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) return;

        const res = await api.get(`/pay/subscription/${userId}`);

        setSubscription(res.data.subscription);
      } catch {}
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  /* ─────────────────────────────────────────
     PHARMACY NAME
  ───────────────────────────────────────── */
  useEffect(() => {
    const pharmacy = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await api.get("/auth/pharmacy-details", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAccountName(res?.data?.pharmacy?.pharmacy_name || "Account Name");
      } catch {
        setAccountName(localStorage.getItem("pharmacyName") || "Account Name");
      }
    };

    pharmacy();
  }, []);

  /* ─────────────────────────────────────────
     UNREAD NOTIFICATIONS
  ───────────────────────────────────────── */
  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await api.get("/post/client/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const posts = Array.isArray(res?.data) ? res.data : [];

        const readIds = getReadIds();

        setUnreadCount(posts.filter((p: any) => !readIds.has(p.id)).length);
      } catch {
        setUnreadCount(0);
      }
    };

    fetchUnread();

    const interval = setInterval(fetchUnread, 60000);

    const handleUpdate = () => fetchUnread();

    window.addEventListener("notifications-updated", handleUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener("notifications-updated", handleUpdate);
    };
  }, []);

  /* ─────────────────────────────────────────
     CLOSE POPUPS ON OUTSIDE CLICK
  ───────────────────────────────────────── */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bottomRef.current && !bottomRef.current.contains(e.target as Node)) {
        setOpenPopup(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ─────────────────────────────────────────
     HELPERS
  ───────────────────────────────────────── */
  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + "/");

  const hasAccess = (accessKey: string | null) =>
    !accessKey || !!subscription?.[accessKey];

  // const hasAccess = (accessKey: string | null) => true; // TEMP localhost bypass — restore before deploy

  const navLinkClass = (path: string) =>
    `group w-full flex items-center gap-3 py-[11px] rounded-xl font-medium text-[15px] transition-all duration-150
     ${sidebarOpen ? "px-3.5" : "px-0 justify-center"}
     ${
       isActive(path)
         ? "bg-gray-900 text-white shadow-sm"
         : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
     }`;

  const navIconClass = (path: string) =>
    `h-[18px] w-[18px] shrink-0 transition-colors ${
      isActive(path) ? "text-white" : "text-gray-400 group-hover:text-gray-700"
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

  /* ─────────────────────────────────────────
     LOCKED ROW
  ───────────────────────────────────────── */
  const LockedRow = ({
    icon: Icon,
    label,
  }: {
    icon: React.ElementType;
    label: string;
  }) => (
    <div className="relative overflow-visible rounded-xl z-[9999] my-1">
      <div className="flex items-center gap-3 py-[11px] px-3.5 text-[15px] font-medium text-gray-200">
        <Icon className="h-[18px] w-[18px] shrink-0" />

        <span className="truncate">{label}</span>
      </div>

      {/* OVERLAY */}
      <div className="absolute inset-0 z-[9999] flex items-center justify-between px-3.5 rounded-xl bg-white/92 backdrop-blur-sm border border-dashed border-amber-300 shadow-md">
        <div className="flex items-center gap-2 min-w-0">
          <Lock className="h-[13px] w-[13px] text-amber-500 shrink-0" />

          <span className="text-[12.5px] font-semibold text-amber-600 leading-none">
            {label}
          </span>
        </div>

        <span className="ml-2 shrink-0 text-[10px] font-bold text-amber-500 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 uppercase tracking-wide">
          Pro
        </span>
      </div>
    </div>
  );

  /* ─────────────────────────────────────────
     LOCKED ICON
  ───────────────────────────────────────── */
  const LockedIcon = ({
    icon: Icon,
    label,
  }: {
    icon: React.ElementType;
    label: string;
  }) => (
    <div className="group relative flex justify-center z-[9999]">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl opacity-40">
        <Icon className="h-[18px] w-[18px] text-gray-500" />
      </div>

      <span className=" absolute bottom-0.5 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400 ring-1 ring-white">
        <Lock className="h-[8px] w-[8px] text-white" />
      </span>

      <div className=" absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-[13px] font-medium text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-[9999]">
        {label} — Subscribe to unlock
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
      </div>
    </div>
  );

  /* ─────────────────────────────────────────
     COLLAPSED NAV ITEM
  ───────────────────────────────────────── */
  const CollapsedNavItem = ({
    path,
    label,
    icon: Icon,
    badge,
  }: {
    path: string;
    label: string;
    icon: React.ElementType;
    badge?: React.ReactNode;
  }) => (
    <div className="group relative flex justify-center">
      <Link
        href={path}
        className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150 ${
          isActive(path)
            ? "bg-gray-900 text-white shadow-sm"
            : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
        }`}
      >
        <Icon className="h-[18px] w-[18px] shrink-0" />
        {badge}
      </Link>

      <div className="pointer-events-none absolute left-full ml-3 top-1/2 -translate-y-1/2 z-[9999] whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-[13px] font-medium text-white shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        {label}

        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
      </div>
    </div>
  );

  const leadsAccess = !!subscription?.leads_access;

  return (
    <aside
      className={`relative z-[9999] flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300 ${
        sidebarOpen ? "w-[17rem]" : "w-[76px]"
      }`}
      style={{
        overflow: "visible",
      }}
    >
      {/* HEADER */}
      <div className="flex shrink-0 items-center justify-between px-4 py-[18px] border-b border-gray-100">
        {sidebarOpen ? (
          <Link href="/Mainpage" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
              <Image
                src={l}
                alt="AuditProRx"
                className="object-cover h-full w-full"
                priority
              />
            </div>

            <span className="text-[16px] font-bold text-gray-900 tracking-tight">
              AuditProRx
            </span>
          </Link>
        ) : (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <Image
              src={l}
              alt="AuditProRx"
              width={36}
              height={36}
              className="object-cover h-full w-full"
              priority
            />
          </div>
        )}

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3.5 top-6 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-md hover:bg-gray-50 transition z-[9999]"
        >
          {sidebarOpen ? (
            <ChevronLeft className="h-3.5 w-3.5" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-1 scrollbar-hide">
        {sidebarOpen && (
          <p className="px-3.5 pb-2.5 text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Workspace
          </p>
        )}

        {ALL_NAV_ITEMS.map(({ path, label, icon: Icon, accessKey }) => {
          const locked = subscriptionLoaded && !hasAccess(accessKey);

          if (!sidebarOpen) {
            return locked ? (
              <Link key={path} href={path}>
                <LockedIcon key={path} icon={Icon} label={label} />
              </Link>
            ) : (
              <CollapsedNavItem
                key={path}
                path={path}
                label={label}
                icon={Icon}
              />
            );
          }

          return locked ? (
            <Link key={path} href={path}>
              <LockedRow key={path} icon={Icon} label={label} />
            </Link>
          ) : (
            <Link key={path} href={path} className={navLinkClass(path)}>
              <Icon className={navIconClass(path)} />

              <span className="truncate">{label}</span>
            </Link>
          );
        })}

        {/* UPDATES */}
        {sidebarOpen ? (
          <>
            <p className="px-3.5 pt-5 pb-2.5 text-[11px] font-bold uppercase tracking-widest text-gray-400">
              Updates
            </p>

            {leadsAccess ? (
              <Link
                href="/Notification"
                className={navLinkClass("/Notification")}
              >
                <div className="relative shrink-0">
                  <Bell className={navIconClass("/Notification")} />

                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                  )}
                </div>

                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="truncate">Leads</span>

                  {unreadCount > 0 && (
                    <span className="ml-2 rounded-full bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 min-w-[20px] text-center leading-tight">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </div>
              </Link>
            ) : subscriptionLoaded ? (
              <Link key="/Notification" href="/Notification">
                <LockedRow icon={Bell} label="Leads" />
              </Link>
            ) : (
              <div className="flex items-center gap-3 py-[11px] px-3.5 text-[15px] font-medium text-gray-200 rounded-xl">
                <Bell className="h-[18px] w-[18px] shrink-0" />

                <span className="truncate">Leads</span>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="my-2 mx-1 border-t border-gray-100" />

            {leadsAccess ? (
              <CollapsedNavItem
                path="/Notification"
                label="Leads"
                icon={Bell}
                badge={
                  unreadCount > 0 ? (
                    <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500 ring-1 ring-white" />
                  ) : undefined
                }
              />
            ) : subscriptionLoaded ? (
              <Link key="/Notification" href="/Notification">
                <LockedIcon icon={Bell} label="Leads" />
              </Link>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl mx-auto opacity-30">
                <Bell className="h-[18px] w-[18px] text-gray-500" />
              </div>
            )}
          </>
        )}
      </nav>

      {/* BOTTOM — single account row that opens one consolidated menu */}
      <div
        ref={bottomRef}
        className="relative shrink-0 border-t border-gray-100 px-3 py-3 overflow-visible"
      >
        <button
          onClick={() => toggle("account")}
          className={`w-full flex items-center gap-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition ${
            sidebarOpen ? "px-3" : "justify-center"
          } ${openPopup === "account" ? "ring-2 ring-gray-900/10" : ""}`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-white text-[14px] font-bold shrink-0">
            {accountName?.charAt(0)?.toUpperCase() || "A"}
          </div>

          {sidebarOpen && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Account
                </p>

                <p className="text-[14px] font-semibold text-gray-900 truncate">
                  {accountName}
                </p>
              </div>

              <ChevronRight
                className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-150 ${
                  openPopup === "account" ? "rotate-90" : ""
                }`}
              />
            </>
          )}
        </button>

        {/* CONSOLIDATED MENU — Support · Settings · Hard Refresh · Logout · Version */}
        {openPopup === "account" && (
          <div
            className={`absolute z-[99999] rounded-xl border border-gray-200 bg-white p-2 shadow-2xl ${
              sidebarOpen
                ? "bottom-full left-3 right-3 mb-2"
                : "bottom-0 left-full ml-3 w-64"
            }`}
          >
            {/* Account header */}
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-3 py-2.5 mb-1.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 text-white text-[14px] font-bold shrink-0">
                {accountName?.charAt(0)?.toUpperCase() || "A"}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  Account
                </p>

                <p className="text-[14px] font-semibold text-gray-900 truncate">
                  {accountName}
                </p>
              </div>
            </div>

            {/* Customer Support */}
            <div className="px-2 pt-1.5 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Support
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-2.5 mb-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 shrink-0">
                <User className="h-4 w-4 text-gray-700" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-gray-900 truncate">
                  Fahad Mulla
                </p>

                <p className="text-[11px] text-gray-500 flex items-center gap-1">
                  <Phone className="h-3 w-3" /> +1 (551) 229-6466
                </p>
              </div>

              <a
                href="https://wa.me/15512296466?text=Hi%20Fahad%2C%20I%20need%20help%20with%20AuditProRx"
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp"
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors shrink-0"
              >
                <MessageCircle className="h-5 w-5 text-gray-700 cursor-pointer" />
              </a>
            </div>

            <div className="my-1 border-t border-gray-100" />

            {/* Settings */}
            <button
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[14px] text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={() => {
                setOpenPopup(null);
                router.push("/settings");
              }}
            >
              <Settings className="h-[17px] w-[17px] text-gray-400 shrink-0" />
              Settings
            </button>

            {/* Hard Refresh */}
            <button
              onClick={() => window.location.reload()}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[14px] text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <RefreshCw className="h-[17px] w-[17px] text-gray-400 shrink-0" />
              Hard Refresh
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[14px] text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-[17px] w-[17px] shrink-0" />
              Logout
            </button>

            <div className="my-1 border-t border-gray-100" />

            {/* Version */}
            <div className="flex items-center gap-2 px-3 py-1.5">
              <GitBranch className="h-3.5 w-3.5 text-gray-400" />

              <span className="text-[12px] text-gray-400 font-semibold">
                v1.4
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
