import { ReactNode, useState, useRef, useEffect } from "react";
import {
  ArrowLeft,
  Package,
  Users,
  Mail,
  ChevronLeft,
  ChevronRight,
  LifeBuoy,
  User,
  Settings,
  RefreshCw,
  GitBranch,
  Phone,
  X,
  ChevronDown,
  UserStar,
  LayoutDashboard,
  FileSpreadsheet,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/admin-dashboard" },
  { title: "Suppliers", icon: Package, path: "/supplier-mappings" },
  { title: "Master Sheet", icon: FileSpreadsheet, path: "/master-sheet" },
];

type Popup = "support" | "account" | "settings" | null;

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const [active, setActive] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [openPopup, setOpenPopup] = useState<Popup>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const toggle = (name: Popup) =>
    setOpenPopup((prev) => (prev === name ? null : name));

  const pathname = usePathname();

  useEffect(() => {
    const current = navItems.find((item) => item.path === pathname);
    if (current) {
      setActive(current.title);
    }
  }, [pathname]);
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

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Sidebar */}
      {/* <aside
        className={`${
          collapsed ? "w-16" : "w-64"
        } bg-card border-r border-border flex flex-col transition-all duration-200 relative`}
      > */}
      <aside
        className={`${
          collapsed ? "w-16" : "w-64"
        } h-full bg-card border-r border-border flex flex-col transition-all duration-200 relative`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <button
              // onClick={() => router.push("/")}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-muted transition-colors text-foreground"
            >
              <UserStar size={16} />
            </button>
            {!collapsed && (
              <span className="text-lg font-semibold tracking-tight text-foreground">
                Super Admin
              </span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 ml-1.5 hover:bg-muted rounded transition-colors text-gray-foreground bg-muted"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto scrollbar-hide py-4 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = active === item.title;
            return (
              <button
                key={item.title}
                onClick={() => {
                  // setActive(item.title);
                  router.push(item.path);
                }}
                className={`w-full flex items-center gap-3 ${
                  collapsed ? "px-2 justify-center" : "px-4"
                } py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-gray-foreground hover:bg-muted/60 hover:text-foreground cursor-pointer"
                }`}
              >
                <item.icon size={18} className="shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div
          ref={bottomRef}
          className="shrink-0 border-t border-border px-2 py-3 space-y-1"
        >
          {/* Customer Support */}
          <div className="relative">
            <button
              onClick={() => toggle("support")}
              className={`w-full flex items-center ${
                collapsed ? "px-2 justify-center" : "px-4"
              } py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                openPopup === "support"
                  ? "bg-muted text-foreground"
                  : "text-gray-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              <LifeBuoy size={18} className="shrink-0" />
              {!collapsed && (
                <>
                  <span className="ml-3 flex-1 text-left">
                    Customer Support
                  </span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${openPopup === "support" ? "rotate-180" : ""}`}
                  />
                </>
              )}
            </button>

            {openPopup === "support" && !collapsed && (
              <div className="mx-2 my-2 p-4 bg-muted/50 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-gray">
                    Contact Support
                  </span>
                  <button
                    onClick={() => setOpenPopup(null)}
                    className="text-gray-foreground hover:text-foreground"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">
                    <User size={14} className="text-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray">
                      Support Team
                    </p>
                    <p className="text-xs text-gray-foreground">
                      +1 (551) 229-6466
                    </p>
                  </div>
                  <Phone size={14} className="text-brand shrink-0" />
                </div>
              </div>
            )}
          </div>

          {/* Account */}
          {/* <div className="relative">
            <button
              onClick={() => toggle("account")}
              className={`w-full flex items-center ${
                collapsed ? "px-2 justify-center" : "px-4"
              } py-3 rounded-lg border border-border hover:border-muted-foreground/30 hover:bg-muted/40 transition-all duration-200`}
            >
              <User size={18} className="shrink-0 text-muted-foreground" />
              {!collapsed && (
                <>
                  <div className="ml-3 flex-1 text-left min-w-0">
                    <p className="text-[10px] text-muted-foreground font-medium">
                      Account Name
                    </p>
                    <p className="text-xs font-semibold text-foreground truncate">
                      Pharmacy Account
                    </p>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`text-muted-foreground transition-transform ${openPopup === "account" ? "rotate-180" : ""}`}
                  />
                </>
              )}
            </button>

            {openPopup === "account" && !collapsed && (
              <div className="mx-2 mb-2 p-3 bg-muted/50 rounded-lg border border-border">
                <p className="text-xs font-semibold text-foreground mb-2">
                  Pharmacy Account
                </p>
                <button
                  onClick={() => router.push("/pharmacy-details")}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:bg-muted rounded transition-colors"
                >
                  <Settings size={14} />
                  Pharmacy Details
                </button>
              </div>
            )}
          </div> */}

          {/* Settings */}
          {/* <div className="relative">
            <button
              onClick={() => toggle("settings")}
              className={`w-full flex items-center ${
                collapsed ? "px-2 justify-center" : "px-4"
              } py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                openPopup === "settings"
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              }`}
            >
              <Settings size={18} className="shrink-0" />
              {!collapsed && (
                <>
                  <span className="ml-3 flex-1 text-left">Settings</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${openPopup === "settings" ? "rotate-180" : ""}`}
                  />
                </>
              )}
            </button>

            {openPopup === "settings" && !collapsed && (
              <div className="mx-2 mb-2 bg-muted/50 rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => {
                    setOpenPopup(null);
                    router.push("/settings");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs text-muted-foreground hover:bg-muted transition-colors"
                >
                  <Settings size={14} />
                  Settings
                </button>
              </div>
            )}
          </div> */}

          {/* Hard Refresh */}
          <button
            onClick={() => window.location.reload()}
            className={`w-full flex items-center ${
              collapsed ? "px-2 justify-center" : "px-4"
            } py-3 text-gray-foreground hover:bg-muted/60 hover:text-foreground rounded-lg text-sm font-semibold transition-all duration-200`}
          >
            <RefreshCw size={18} className="shrink-0" />
            {!collapsed && <span className="ml-3">Hard Refresh</span>}
          </button>

          {/* Version */}
          <div
            className={`flex items-center ${
              collapsed ? "px-2 justify-center" : "px-4"
            } py-2 text-gray-foreground/50`}
          >
            <GitBranch size={14} className="shrink-0" />
            {!collapsed && (
              <span className="ml-3 text-[11px] font-medium">Version 1.0</span>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 h-full overflow-y-auto scrollbar-hide p-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
