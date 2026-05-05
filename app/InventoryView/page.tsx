"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import AppSidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import api from "@/lib/api";
import {
  Search,
  Plus,
  X,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Star,
  AlertTriangle,
  Pill,
  Boxes,
  Clock,
  Phone,
  Mail,
  MapPin,
  Building2,
  Bookmark,
  Flag,
  CheckCircle2,
  Loader2,
  Paperclip,
  Send,
  Pencil,
  Trash2,
  Users,
  UserPlus,
  Bell,
  Copy,
  Globe,
  Lock,
  Hash,
  LogOut,
  Compass,
  UserCheck,
  UserX,
} from "lucide-react";

type ReasonCode = "shortage_relief" | "near_expiry" | "overstock";

interface PharmacyMini {
  id: string;
  pharmacy_name: string;
  address: string;
  phone: string | null;
  fax: string | null;
  email: string | null;
  npi_number: string | null;
  ncpdp_number: string | null;
  license_expiry_date: string | null;
  pharmacist_name: string | null;
  member_since: string | null;
  rating: number;
  total_transfers: number;
  last_active: string | null;
}

interface InventoryListing {
  id: string;
  ndc: string;
  drug_name: string;
  strength: string | null;
  dosage_form: string | null;
  manufacturer: string | null;
  package_size: string | null;
  quantity: number;
  lot_number: string | null;
  expiry: string | null;
  acquisition_cost: number | null;
  reason_code: ReasonCode;
  pharmacy: PharmacyMini;
  distance_miles: number | null;
  listed_at: string;
  visibility: Visibility;
  group_ids: string[];
}

type NdcSuggestion = {
  ndc: string;
  drug_name: string;
  brand: string | null;
  package_size: string | null;
};

type Visibility = "public" | "groups_only";

interface InventoryGroup {
  id: string;
  name: string;
  description: string | null;
  member_count: number;
  is_admin: boolean;
  created_at: string;
  max_members: number;
  is_discoverable: boolean;
  pending_join_requests: number;
}

interface DiscoverableGroup {
  id: string;
  name: string;
  description: string | null;
  member_count: number;
  max_members: number;
  admin_pharmacy_name: string | null;
  created_at: string;
  has_pending_request: boolean;
}

interface GroupMember {
  id: string;
  pharmacy_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  pharmacy_name: string;
  address: string | null;
  npi_number: string | null;
  ncpdp_number: string | null;
  phone: string | null;
  user_name: string | null;
  user_email: string | null;
}

interface GroupInviteCode {
  id: string;
  code: string;
  max_uses: number;
  uses_count: number;
  expires_at: string;
  created_at: string;
  is_active: boolean;
}

interface PendingGroupInvitation {
  id: string;
  invited_email: string | null;
  invited_pharmacy_name: string | null;
  invited_user_email: string | null;
  status: string;
  created_at: string;
  expires_at: string;
  message: string | null;
}

interface PendingJoinRequest {
  id: string;
  requester_pharmacy_name: string | null;
  requester_address: string | null;
  requester_npi: string | null;
  requester_name: string | null;
  requester_email: string | null;
  message: string | null;
  created_at: string;
  expires_at: string;
}

interface MyInvitation {
  id: string;
  group_id: string;
  group_name: string;
  group_description: string | null;
  inviter_name: string | null;
  inviter_pharmacy: string | null;
  message: string | null;
  invited_email: string | null;
  created_at: string;
  expires_at: string;
}

interface JoinRequestForMe {
  id: string;
  group_id: string;
  group_name: string;
  requester_name: string | null;
  requester_pharmacy: string | null;
  requester_phone: string | null;
  requester_address: string | null;
  requester_npi: string | null;
  message: string | null;
  created_at: string;
  expires_at: string;
}

const EXPIRY_SOON_DAYS = 30;

function getExpiryTag(expiry: string | null): {
  label: string;
  bg: string;
  text: string;
  ring: string;
} | null {
  if (!expiry) return null;
  const days = Math.floor(
    (new Date(expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  if (days < 0) {
    return {
      label: "Expired",
      bg: "bg-rose-100",
      text: "text-rose-800",
      ring: "ring-rose-300",
    };
  }
  if (days <= EXPIRY_SOON_DAYS) {
    return {
      label: "Expiry Soon",
      bg: "bg-rose-50",
      text: "text-rose-700",
      ring: "ring-rose-200",
    };
  }
  return null;
}

// ============================================================================
// Page (with Sidebar shell — matches DrugLookup pattern)
// ============================================================================

export default function InventoryViewPage() {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);

  return (
    <ProtectedRoute role = "user">
      <div className="relative w-full bg-[#fafafa] h-screen overflow-hidden">
        <div className="relative h-full w-full flex">
          {/* ── Sidebar ── */}
          <div
            className={`flex-shrink-0 transition-all duration-300 z-[130] ${
              sidebarCollapsed ? "w-[72px]" : "w-[260px]"
            }`}
          >
            <AppSidebar
              sidebarOpen={!sidebarCollapsed}
              setSidebarOpen={() => setSidebarCollapsed((v) => !v)}
              activePanel={activePanel}
              setActivePanel={setActivePanel}
            />
          </div>

          {/* ── Main scrollable content ── */}
          <div className="flex-1 min-w-0 overflow-y-auto">
            <InventoryViewContent router={router} />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// ============================================================================
// Content (the actual page body — separated so sidebar shell stays clean)
// ============================================================================

function InventoryViewContent({ router }: { router: any }) {
  // ── My pharmacy (logged in user) ──
  const [myPharmacy, setMyPharmacy] = useState<PharmacyMini | null>(null);
  const [myUser, setMyUser] = useState<{ name: string; email: string } | null>(null);

  // ── Listings ──
  const [listings, setListings] = useState<InventoryListing[]>([]);
  const [myListings, setMyListings] = useState<InventoryListing[]>([]);
  const [loading, setLoading] = useState(true);

  // ── UI state ──
  const [searchQuery, setSearchQuery] = useState("");
  const [reasonFilter, setReasonFilter] = useState<ReasonCode | "all">("all");
  const [sortBy, setSortBy] = useState<"distance" | "expiry" | "cost">("distance");
  const [activeTab, setActiveTab] = useState<"search" | "my_listings" | "groups">("search");
  const [groupSubTab, setGroupSubTab] = useState<"my" | "discover">("my");
  const [listingGroupFilter, setListingGroupFilter] = useState<string>("all");

  // ── Groups state ──
  const [myGroups, setMyGroups] = useState<InventoryGroup[]>([]);
  const [discoverableGroups, setDiscoverableGroups] = useState<DiscoverableGroup[]>([]);
  const [invitations, setInvitations] = useState<MyInvitation[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequestForMe[]>([]);
  const [showInvitations, setShowInvitations] = useState(false);
  const [viewingGroupId, setViewingGroupId] = useState<string | null>(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  // ── Modal/panel state ──
  const [viewingListing, setViewingListing] = useState<InventoryListing | null>(null);
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [showEmailDraft, setShowEmailDraft] = useState(false);
  const [showAddListingModal, setShowAddListingModal] = useState(false);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());

  // ── Connect request data (carries through agreement → email) ──
  const [requestData, setRequestData] = useState({
    patientRx: "",
    quantity: 1,
    notes: "",
  });

  // ── Fetch user's pharmacy details on mount ──
  useEffect(() => {
    const fetchMyPharmacy = async () => {
      try {
        const res = await api.get("/auth/pharmacy-details");
        const p = res?.data?.pharmacy;
        const u = res?.data?.user;
        if (p) {
          setMyPharmacy({
            id: p.id || "",
            pharmacy_name: p.pharmacy_name || "Your Pharmacy",
            address: p.address || "",
            phone: p.phone || null,
            fax: p.fax || null,
            email: u?.email || localStorage.getItem("userEmail") || null,
            npi_number: p.npi_number || null,
            ncpdp_number: p.ncpdp_number || null,
            license_expiry_date: p.license_expiry_date || null,
            pharmacist_name: p.pharmacist_name || null,
            member_since: p.created_at || null,
            rating: 5,
            total_transfers: 0,
            last_active: new Date().toISOString(),
          });
          setMyUser({
            name: u?.name || p.pharmacist_name || "Pharmacist",
            email: u?.email || localStorage.getItem("userEmail") || "",
          });
        } else {
          setMyUser({
            name: "Pharmacist",
            email: localStorage.getItem("userEmail") || "",
          });
        }
      } catch (err: any) {
        console.warn(
          "Pharmacy details unavailable:",
          err?.response?.status || err?.message
        );
        setMyUser({
          name: "Pharmacist",
          email: localStorage.getItem("userEmail") || "",
        });
      }
    };
    fetchMyPharmacy();
  }, []);

  // ── Fetch listings (with optional group filter) ──
  const fetchListings = async () => {
    setLoading(true);
    try {
      const url =
        listingGroupFilter === "all"
          ? "/api/inventory-view/listings"
          : `/api/inventory-view/listings?group_id=${listingGroupFilter}`;
      const res = await api.get(url);
      setListings(res.data?.listings || []);
      setMyListings(res.data?.my_listings || []);
    } catch (err) {
      console.error("Failed to load listings:", err);
      setListings([]);
      setMyListings([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const res = await api.get("/api/inventory-view/groups");
      setMyGroups(res.data || []);
    } catch (err) {
      console.error("Failed to load groups:", err);
      setMyGroups([]);
    }
  };

  const fetchDiscoverable = async () => {
    try {
      const res = await api.get("/api/inventory-view/groups/discover");
      setDiscoverableGroups(res.data || []);
    } catch (err) {
      console.error("Failed to load discoverable groups:", err);
      setDiscoverableGroups([]);
    }
  };

  const fetchInvitations = async () => {
    try {
      const res = await api.get("/api/inventory-view/invitations");
      setInvitations(res.data?.invitations || []);
      setJoinRequests(res.data?.join_requests || []);
    } catch (err) {
      console.error("Failed to load invitations:", err);
      setInvitations([]);
      setJoinRequests([]);
    }
  };

  useEffect(() => {
    fetchListings();
    fetchGroups();
    fetchDiscoverable();
    fetchInvitations();
  }, []);

  // Re-fetch listings when group filter changes
  useEffect(() => {
    fetchListings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingGroupFilter]);

  // ── Check if agreement was previously accepted ──
  useEffect(() => {
    const checkAgreement = async () => {
      try {
        const res = await api.get("/api/inventory-view/agreement/status");
        setAgreementAccepted(!!res.data?.accepted);
      } catch {
        setAgreementAccepted(false);
      }
    };
    checkAgreement();
  }, []);

  // ── Filter + sort listings ──
  const filteredListings = useMemo(() => {
    let list = [...listings];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (l) =>
          (l.drug_name || "").toLowerCase().includes(q) ||
          (l.ndc || "").includes(q) ||
          (l.manufacturer || "").toLowerCase().includes(q)
      );
    }

    if (reasonFilter === "near_expiry") {
      list = list.filter((l) => {
        if (!l.expiry) return false;
        const days = Math.floor(
          (new Date(l.expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );
        return days <= EXPIRY_SOON_DAYS;
      });
    }

    list.sort((a, b) => {
      if (sortBy === "distance")
        return (a.distance_miles ?? 999) - (b.distance_miles ?? 999);
      if (sortBy === "expiry")
        return (
          new Date(a.expiry || "9999").getTime() -
          new Date(b.expiry || "9999").getTime()
        );
      if (sortBy === "cost")
        return (a.acquisition_cost ?? 0) - (b.acquisition_cost ?? 0);
      return 0;
    });

    return list;
  }, [listings, searchQuery, reasonFilter, sortBy]);

  // ── Handlers ──
  const handleSendConnect = (listing: InventoryListing) => {
    setViewingListing(listing);
    if (!agreementAccepted) {
      setShowAgreement(true);
    } else {
      setShowEmailDraft(true);
    }
  };

  const handleAgreementAccept = async () => {
    try {
      await api.post("/api/inventory-view/agreement/accept", { version: "1.0" });
      setAgreementAccepted(true);
      setShowAgreement(false);
      setShowEmailDraft(true);
    } catch (err) {
      console.error("Failed to record agreement:", err);
      setAgreementAccepted(true);
      setShowAgreement(false);
      setShowEmailDraft(true);
    }
  };

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalNotifications = invitations.length + joinRequests.length;

  return (
    <div className="px-10 py-7 font-[Poppins,system-ui,sans-serif] text-gray-900">
      {/* ============ Top bar with back button ============ */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.push("/Mainpage")}
          className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-100 transition hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Main
        </button>
        <div className="text-xs text-gray-400">/ Inventory View</div>
      </div>

      {/* ============ Header ============ */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Inventory View
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-gray-500">
            Find verified surplus stock at other pharmacies for patient-specific
            transfers — fully compliant with DSCSA and NJ Board of Pharmacy rules.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowInvitations((v) => !v)}
              className="relative inline-flex h-11 items-center justify-center rounded-2xl bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-100 transition hover:bg-gray-50"
            >
              <Bell className="h-4 w-4" />
              {totalNotifications > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-extrabold text-white">
                  {totalNotifications}
                </span>
              )}
            </button>
            {showInvitations && (
              <NotificationsInbox
                invitations={invitations}
                joinRequests={joinRequests}
                onClose={() => setShowInvitations(false)}
                onChange={() => {
                  fetchInvitations();
                  fetchGroups();
                  fetchListings();
                  fetchDiscoverable();
                }}
              />
            )}
          </div>

          <button
            onClick={() => setShowAddListingModal(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" />
            List Inventory
          </button>
        </div>
      </div>

      {/* ============ My pharmacy ribbon ============ */}
      {myPharmacy && (
        <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-extrabold text-gray-900">
                {myPharmacy.pharmacy_name}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-inset ring-emerald-200">
                <ShieldCheck className="h-3 w-3" /> Verified
              </span>
            </div>
            <div className="text-xs text-gray-500 truncate">
              {myPharmacy.address}
              {myPharmacy.npi_number ? ` · NPI ${myPharmacy.npi_number}` : ""}
            </div>
          </div>
          <div className="text-right text-xs text-gray-500">
            Browsing as <span className="font-semibold text-gray-900">{myUser?.name}</span>
          </div>
        </div>
      )}

      {/* ============ Compliance Pill ============ */}
      <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800 ring-1 ring-inset ring-amber-200">
        <AlertTriangle className="h-3.5 w-3.5" />
        All transfers must be patient-specific Rx transfers under DSCSA. Controlled
        substances cannot be listed.
      </div>

      {/* ============ Tabs ============ */}
      <div className="mb-5 flex items-center gap-2">
        <Tab
          active={activeTab === "search"}
          onClick={() => setActiveTab("search")}
          count={filteredListings.length}
          accent="violet"
        >
          Search Network
        </Tab>
        <Tab
          active={activeTab === "my_listings"}
          onClick={() => setActiveTab("my_listings")}
          count={myListings.length}
          accent="mint"
        >
          My Listings
        </Tab>
        <Tab
          active={activeTab === "groups"}
          onClick={() => setActiveTab("groups")}
          count={myGroups.length}
          accent="violet"
        >
          My Groups
        </Tab>
      </div>

      {activeTab === "search" && (
        <>
          {/* ============ Filter Bar ============ */}
          <div className="mb-5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[280px] flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search drug name, NDC, or manufacturer…"
                  className="h-11 w-full rounded-xl border-0 bg-gray-50 pl-11 pr-4 text-sm font-medium placeholder-gray-400 outline-none ring-1 ring-inset ring-transparent transition focus:bg-white focus:ring-gray-900"
                />
              </div>

              {/* Group filter dropdown */}
              <div className="relative">
                <select
                  value={listingGroupFilter}
                  onChange={(e) => setListingGroupFilter(e.target.value)}
                  className="h-11 cursor-pointer rounded-xl border-0 bg-gray-50 pl-9 pr-8 text-sm font-semibold text-gray-900 outline-none ring-1 ring-inset ring-transparent focus:bg-white focus:ring-gray-900"
                >
                  <option value="all">All Listings</option>
                  {myGroups.map((g) => (
                    <option key={g.id} value={g.id}>
                      Group: {g.name}
                    </option>
                  ))}
                </select>
                <Users className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
              </div>

              <div className="flex flex-wrap items-center gap-1 rounded-xl bg-gray-50 p-1">
                {(["all", "near_expiry"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setReasonFilter(r)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      reasonFilter === r
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {r === "all" ? "All" : "Near Expiry"}
                  </button>
                ))}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="h-11 cursor-pointer rounded-xl border-0 bg-gray-50 px-4 text-sm font-semibold text-gray-900 outline-none ring-1 ring-inset ring-transparent focus:bg-white focus:ring-gray-900"
              >
                <option value="distance">Nearest first</option>
                <option value="expiry">Expiring soonest</option>
                <option value="cost">Lowest cost</option>
              </select>
            </div>

            {listingGroupFilter !== "all" && (
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-violet-50 px-3 py-1 text-[11px] font-semibold text-violet-700 ring-1 ring-inset ring-violet-200">
                <Lock className="h-3 w-3" />
                Showing listings shared with this group only
                <button
                  onClick={() => setListingGroupFilter("all")}
                  className="ml-1 rounded-full bg-violet-100 px-1.5 hover:bg-violet-200"
                  title="Clear group filter"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {loading ? (
            <LoadingState />
          ) : filteredListings.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {filteredListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  bookmarked={bookmarked.has(listing.id)}
                  onView={() => setViewingListing(listing)}
                  onConnect={() => handleSendConnect(listing)}
                  onBookmark={() => toggleBookmark(listing.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === "my_listings" && (
        <MyListingsView
          listings={myListings}
          groups={myGroups}
          onRefresh={fetchListings}
        />
      )}

      {activeTab === "groups" && (
        <>
          {/* Sub-tabs */}
          <div className="mb-5 flex w-fit items-center gap-1 rounded-xl bg-white p-1 shadow-sm ring-1 ring-gray-100">
            <button
              onClick={() => setGroupSubTab("my")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                groupSubTab === "my"
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              My Groups
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  groupSubTab === "my" ? "bg-white/20" : "bg-gray-100 text-gray-600"
                }`}
              >
                {myGroups.length}
              </span>
            </button>
            <button
              onClick={() => setGroupSubTab("discover")}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition ${
                groupSubTab === "discover"
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              Discover
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                  groupSubTab === "discover"
                    ? "bg-white/20"
                    : "bg-violet-100 text-violet-700"
                }`}
              >
                {discoverableGroups.length}
              </span>
            </button>
          </div>

          {groupSubTab === "my" && (
            <GroupsView
              groups={myGroups}
              onCreate={() => setShowCreateGroup(true)}
              onView={(id) => setViewingGroupId(id)}
            />
          )}

          {groupSubTab === "discover" && (
            <DiscoverGroupsView
              groups={discoverableGroups}
              onRefresh={() => {
                fetchDiscoverable();
                fetchInvitations();
              }}
            />
          )}
        </>
      )}

      {/* ============ Side panel: View Details ============ */}
      {viewingListing && !showAgreement && !showEmailDraft && (
        <DetailsPanel
          listing={viewingListing}
          bookmarked={bookmarked.has(viewingListing.id)}
          onClose={() => setViewingListing(null)}
          onConnect={() => handleSendConnect(viewingListing)}
          onBookmark={() => toggleBookmark(viewingListing.id)}
        />
      )}

      {/* ============ Modals ============ */}
      {showAgreement && viewingListing && (
        <AgreementModal
          onAccept={handleAgreementAccept}
          onCancel={() => setShowAgreement(false)}
        />
      )}
      {showEmailDraft && viewingListing && myPharmacy && myUser && (
        <EmailDraftModal
          listing={viewingListing}
          myPharmacy={myPharmacy}
          myUser={myUser}
          requestData={requestData}
          setRequestData={setRequestData}
          onClose={() => {
            setShowEmailDraft(false);
            setViewingListing(null);
            setRequestData({ patientRx: "", quantity: 1, notes: "" });
          }}
        />
      )}
      {showAddListingModal && (
        <AddListingModal
          onClose={() => setShowAddListingModal(false)}
          onSuccess={() => {
            setShowAddListingModal(false);
            fetchListings();
          }}
        />
      )}

      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onSuccess={() => {
            setShowCreateGroup(false);
            fetchGroups();
            fetchDiscoverable();
          }}
        />
      )}

      {viewingGroupId && (
        <GroupDetailPanel
          groupId={viewingGroupId}
          onClose={() => setViewingGroupId(null)}
          onChange={() => {
            fetchGroups();
            fetchListings();
            fetchInvitations();
            fetchDiscoverable();
          }}
        />
      )}
    </div>
  );
}

// ============================================================================
// Tabs
// ============================================================================

function Tab({
  active,
  onClick,
  count,
  children,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  children: React.ReactNode;
  accent: "violet" | "mint";
}) {
  const accentMap = {
    violet: "bg-violet-100 text-violet-700",
    mint: "bg-emerald-100 text-emerald-700",
  };
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold transition ${
        active
          ? "bg-gray-900 text-white shadow-sm"
          : "bg-white text-gray-600 ring-1 ring-gray-100 hover:text-gray-900"
      }`}
    >
      {children}
      <span
        className={`inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[11px] ${
          active ? "bg-white/20 text-white" : accentMap[accent]
        }`}
      >
        {count}
      </span>
    </button>
  );
}

// ============================================================================
// Listing Card
// ============================================================================

function ListingCard({
  listing,
  bookmarked,
  onView,
  onConnect,
  onBookmark,
}: {
  listing: InventoryListing;
  bookmarked: boolean;
  onView: () => void;
  onConnect: () => void;
  onBookmark: () => void;
}) {
  const tag = getExpiryTag(listing.expiry);
  const daysToExpiry = listing.expiry
    ? Math.floor(
        (new Date(listing.expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : null;
  const expiryUrgent = daysToExpiry !== null && daysToExpiry <= EXPIRY_SOON_DAYS;

  return (
    <div className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md">
      <div className="grid grid-cols-12 items-center gap-4">
        {/* Drug Identity */}
        <div className="col-span-12 lg:col-span-4">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-violet-50 text-lg font-extrabold text-violet-600">
              {listing.drug_name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-extrabold tracking-tight text-gray-900">
                  {listing.drug_name}
                  {listing.strength ? ` ${listing.strength}` : ""}
                </h3>
                {tag && (
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${tag.bg} ${tag.text} ${tag.ring}`}
                  >
                    {tag.label}
                  </span>
                )}

                {listing.visibility === "groups_only" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-violet-700 ring-1 ring-inset ring-violet-200">
                    <Lock className="h-2.5 w-2.5" />
                    Group
                  </span>
                )}
              </div>
              <div className="mt-1 font-mono text-[11px] text-gray-400">
                NDC {listing.ndc}
              </div>
            </div>
          </div>
        </div>

        {/* Available Qty */}
        <div className="col-span-6 lg:col-span-2">
          <DataLabel>Available</DataLabel>
          <div className="mt-0.5 text-xl font-extrabold tracking-tight text-gray-900">
            {listing.quantity}
          </div>
          {listing.package_size && (
            <div className="text-[11px] text-gray-500">{listing.package_size}</div>
          )}
        </div>

        {/* Expiry */}
        <div className="col-span-6 lg:col-span-2">
          <DataLabel>Expiry</DataLabel>
          {listing.expiry ? (
            <>
              <div
                className={`mt-0.5 text-sm font-extrabold ${
                  expiryUrgent ? "text-rose-600" : "text-gray-900"
                }`}
              >
                {new Date(listing.expiry).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <div className="text-[11px] text-gray-500">
                {daysToExpiry}d
                {listing.lot_number ? ` · Lot ${listing.lot_number}` : ""}
              </div>
            </>
          ) : (
            <div className="text-xs text-gray-400">—</div>
          )}
        </div>

        {/* Cost */}
        <div className="col-span-6 lg:col-span-2">
          <DataLabel>Shelf Cost</DataLabel>
          <div className="mt-0.5 text-sm font-extrabold text-gray-900">
            {listing.acquisition_cost
              ? `$${listing.acquisition_cost.toFixed(2)}`
              : "—"}
          </div>
          <div className="text-[11px] text-gray-500">benchmarking</div>
        </div>

        {/* Pharmacy */}
        <div className="col-span-6 lg:col-span-2">
          <DataLabel>Holding Pharmacy</DataLabel>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs font-bold text-gray-900">
            <span className="truncate">{listing.pharmacy.pharmacy_name}</span>
            <ShieldCheck className="h-3 w-3 text-emerald-600" />
          </div>
          <div className="text-[11px] text-gray-500 truncate">
            {listing.pharmacy.address?.split(",")[0]}
            {listing.distance_miles !== null
              ? ` · ${listing.distance_miles} mi`
              : ""}
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-[11px]">
            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
            <span className="font-bold text-gray-900">
              {listing.pharmacy.rating.toFixed(1)}
            </span>
            <span className="text-gray-400">
              · {listing.pharmacy.total_transfers}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3">
        <div className="text-[11px] text-gray-500">
          Listed {timeAgo(listing.listed_at)} · Auto-expires in 30 days
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onBookmark}
            title={bookmarked ? "Remove bookmark" : "Save for later"}
            className={`rounded-lg p-2 transition ${
              bookmarked
                ? "bg-amber-50 text-amber-700"
                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
            }`}
          >
            <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={onView}
            className="rounded-lg bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            View Details
          </button>
          <button
            onClick={onConnect}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-800"
          >
            Send Connect Request
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Details Panel (slide-in from right) — z-[200] sits ABOVE sidebar
// ============================================================================

function DetailsPanel({
  listing,
  bookmarked,
  onClose,
  onConnect,
  onBookmark,
}: {
  listing: InventoryListing;
  bookmarked: boolean;
  onClose: () => void;
  onConnect: () => void;
  onBookmark: () => void;
}) {
  const tag = getExpiryTag(listing.expiry);
  const [showReportModal, setShowReportModal] = useState(false);

  const daysToExpiry = listing.expiry
    ? Math.floor(
        (new Date(listing.expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className="fixed inset-0 z-[200] flex justify-end bg-gray-900/40 backdrop-blur-sm">
      <div className="h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col">
        {/* Header — fixed */}
        <div className="border-b border-gray-100 bg-white px-7 py-5 flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-violet-50 text-lg font-extrabold text-violet-600">
                {listing.drug_name[0]}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                    {listing.drug_name}
                    {listing.strength ? ` ${listing.strength}` : ""}
                  </h2>
                  {tag && (
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${tag.bg} ${tag.text} ${tag.ring}`}
                    >
                      {tag.label}
                    </span>
                  )}
                </div>
                <div className="mt-1 font-mono text-xs text-gray-400">
                  NDC {listing.ndc}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg bg-gray-50 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto space-y-5 px-7 py-6">
          <SectionHeading icon={<Pill className="h-3.5 w-3.5" />}>
            Drug & Inventory
          </SectionHeading>
          <div className="grid grid-cols-2 gap-3">
            <InfoCard label="Available Quantity" value={listing.quantity.toString()} />
            <InfoCard label="Package Size" value={listing.package_size || "—"} />
            <InfoCard
              label="Expiry"
              value={
                listing.expiry
                  ? new Date(listing.expiry).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"
              }
              hint={daysToExpiry !== null ? `${daysToExpiry} days` : undefined}
              hintColor={
                daysToExpiry !== null && daysToExpiry <= EXPIRY_SOON_DAYS
                  ? "rose"
                  : "gray"
              }
            />
            <InfoCard label="Lot Number" value={listing.lot_number || "—"} mono />
            <InfoCard
              label="Shelf Cost"
              value={
                listing.acquisition_cost
                  ? `$${listing.acquisition_cost.toFixed(2)}`
                  : "—"
              }
              hint="per unit · benchmarking only"
            />
          </div>

          <SectionHeading icon={<Building2 className="h-3.5 w-3.5" />}>
            Holding Pharmacy
          </SectionHeading>
          <div className="rounded-2xl bg-gray-50 p-5 ring-1 ring-gray-100">
            <div className="mb-3 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-base font-extrabold text-gray-900">
                    {listing.pharmacy.pharmacy_name}
                  </div>
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                </div>
                {listing.pharmacy.pharmacist_name && (
                  <div className="text-xs text-gray-600">
                    PIC: {listing.pharmacy.pharmacist_name}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-xs ring-1 ring-gray-200">
                <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                <span className="font-bold text-gray-900">
                  {listing.pharmacy.rating.toFixed(1)}
                </span>
                <span className="text-gray-400">
                  · {listing.pharmacy.total_transfers} transfers
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <PharmacyDetailRow
                icon={<MapPin className="h-3.5 w-3.5" />}
                label="Address"
                value={listing.pharmacy.address || "—"}
              />
              {listing.pharmacy.phone && (
                <PharmacyDetailRow
                  icon={<Phone className="h-3.5 w-3.5" />}
                  label="Phone"
                  value={
                    <a
                      href={`tel:${listing.pharmacy.phone}`}
                      className="font-medium text-violet-700 hover:underline"
                    >
                      {listing.pharmacy.phone}
                    </a>
                  }
                />
              )}
              {listing.pharmacy.email && (
                <PharmacyDetailRow
                  icon={<Mail className="h-3.5 w-3.5" />}
                  label="Email"
                  value={
                    <a
                      href={`mailto:${listing.pharmacy.email}`}
                      className="font-medium text-violet-700 hover:underline"
                    >
                      {listing.pharmacy.email}
                    </a>
                  }
                />
              )}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <SmallStat label="NPI" value={listing.pharmacy.npi_number || "—"} />
                <SmallStat
                  label="NCPDP"
                  value={listing.pharmacy.ncpdp_number || "—"}
                />
              </div>
            </div>
          </div>

          {listing.distance_miles !== null && (
            <>
              <SectionHeading icon={<MapPin className="h-3.5 w-3.5" />}>
                Distance
              </SectionHeading>
              <div className="grid grid-cols-2 gap-3">
                <InfoCard
                  label="From your pharmacy"
                  value={`${listing.distance_miles} miles`}
                  hint="approx. driving distance"
                />
                <InfoCard
                  label="Suggested handoff"
                  value={listing.distance_miles < 10 ? "Pickup" : "Licensed courier"}
                  hint="informational only"
                />
              </div>
            </>
          )}

          <SectionHeading icon={<Clock className="h-3.5 w-3.5" />}>
            Listing Metadata
          </SectionHeading>
          <div className="grid grid-cols-2 gap-3">
            <InfoCard label="Listed" value={timeAgo(listing.listed_at)} />
            <InfoCard label="Auto-expires" value="In 30 days" />
          </div>
        </div>

        {/* Sticky footer actions — fixed */}
        <div className="border-t border-gray-100 bg-white px-7 py-4 flex-shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={onBookmark}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                  bookmarked
                    ? "bg-amber-50 text-amber-700"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Bookmark
                  className={`h-3.5 w-3.5 ${bookmarked ? "fill-current" : ""}`}
                />
                {bookmarked ? "Saved" : "Save for Later"}
              </button>
              <button
                onClick={() => setShowReportModal(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                <Flag className="h-3.5 w-3.5" />
                Report
              </button>
            </div>
            <button
              onClick={onConnect}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Send Connect Request
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Report modal */}
      {showReportModal && (
        <ReportListingModal
          listing={listing}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
}

// ============================================================================
// Report Listing Modal
// ============================================================================

function ReportListingModal({
  listing,
  onClose,
}: {
  listing: InventoryListing;
  onClose: () => void;
}) {
  const [reason, setReason] = useState<string>("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const REPORT_REASONS = [
    {
      code: "controlled_substance",
      label: "Controlled substance",
      desc: "This listing is for a Schedule II–V drug, which is prohibited.",
    },
    {
      code: "expired_or_damaged",
      label: "Expired or damaged stock",
      desc: "The product appears expired, mishandled, or otherwise unfit to dispense.",
    },
    {
      code: "suspicious_pricing",
      label: "Suspicious pricing or quantity",
      desc: "Quantity, price, or pattern suggests wholesale distribution rather than patient-specific transfer.",
    },
    {
      code: "fake_credentials",
      label: "Unverified or fake credentials",
      desc: "The listing pharmacy's license, NPI, or NCPDP appears invalid.",
    },
    {
      code: "duplicate",
      label: "Duplicate listing",
      desc: "Same lot number listed multiple times to game the system.",
    },
    {
      code: "other",
      label: "Other concern",
      desc: "Anything else that warrants compliance review.",
    },
  ];

  const handleSubmit = async () => {
    if (!reason) return;
    setSubmitting(true);
    try {
      await api.post(`/api/inventory-view/listings/${listing.id}/report`, {
        reason_code: reason,
        details: details.trim() || null,
      });
      setSubmitted(true);
    } catch (err: any) {
      console.error("Failed to submit report:", err);
      alert(
        "Failed to submit report. " +
          (err?.response?.data?.error || "Please try again.")
      );
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <ModalShell onClose={onClose} width="max-w-md">
        <div className="px-8 py-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-xl font-extrabold tracking-tight text-gray-900">
            Report Submitted
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
            Thank you for flagging this listing. Our compliance team will review it
            within 24 hours and take appropriate action.
          </p>
          <button
            onClick={onClose}
            className="mt-6 rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </ModalShell>
    );
  }

  return (
    <ModalShell onClose={onClose} width="max-w-lg">
      <div className="flex flex-col max-h-[85vh]">
        <div className="border-b border-gray-100 px-7 py-5 flex-shrink-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-700 ring-1 ring-inset ring-rose-200">
            <Flag className="h-3 w-3" />
            Compliance Report
          </div>
          <h2 className="mt-2 text-xl font-extrabold tracking-tight text-gray-900">
            Report this listing
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Reporting a listing for {listing.drug_name} (NDC {listing.ndc}). All
            reports are reviewed by the AuditProRx compliance team.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-5 space-y-4">
          <div>
            <FieldLabel required>Reason</FieldLabel>
            <div className="space-y-2">
              {REPORT_REASONS.map((r) => (
                <label
                  key={r.code}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl p-3 ring-1 ring-inset transition ${
                    reason === r.code
                      ? "bg-rose-50 ring-rose-300"
                      : "bg-gray-50 ring-transparent hover:bg-white hover:ring-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="report_reason"
                    checked={reason === r.code}
                    onChange={() => setReason(r.code)}
                    className="mt-0.5 h-4 w-4 cursor-pointer border-gray-300 text-rose-600 focus:ring-rose-500"
                  />
                  <div>
                    <div className="text-sm font-bold text-gray-900">
                      {r.label}
                    </div>
                    <div className="text-xs text-gray-600">{r.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <FieldLabel>Additional details (optional)</FieldLabel>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              placeholder="Provide any additional context that would help our compliance team review this listing…"
              className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-sm outline-none ring-1 ring-inset ring-transparent focus:bg-white focus:ring-gray-900"
            />
          </div>

          <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900 ring-1 ring-inset ring-amber-200">
            <span className="font-extrabold">Note:</span> Reports are anonymous to
            the listing pharmacy but logged with your account ID for audit purposes.
            False reports may result in account suspension.
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 px-7 py-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason || submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting…
              </>
            ) : (
              <>
                <Flag className="h-4 w-4" />
                Submit Report
              </>
            )}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

// ============================================================================
// Agreement Modal
// ============================================================================

function AgreementModal({
  onAccept,
  onCancel,
}: {
  onAccept: () => void;
  onCancel: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [checked, setChecked] = useState(false);

  return (
    <ModalShell onClose={onCancel} width="max-w-3xl">
      <div className="border-b border-gray-100 px-8 py-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700 ring-1 ring-inset ring-violet-200">
          Required · One-time
        </div>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-gray-900">
          Inventory Network Participation Agreement
        </h2>
        <p className="mt-1.5 text-sm text-gray-500">
          Before sending connect requests, please review and accept the network
          participation terms.
        </p>
      </div>

      <div
        onScroll={(e) => {
          const el = e.currentTarget;
          if (el.scrollHeight - el.scrollTop - el.clientHeight < 30) setScrolled(true);
        }}
        className="max-h-[min(420px,calc(90vh-280px))] space-y-4 overflow-y-auto px-8 py-5 text-sm leading-relaxed text-gray-700"
      >
        <AgrSection title="1. What this network is">
          AuditProRx Network is an information directory. It allows verified
          pharmacies to discover surplus inventory at other verified pharmacies. The
          platform does not buy, sell, transfer, ship, or take possession of any
          pharmaceutical product. The platform does not process payments for drug
          transactions.
        </AgrSection>
        <AgrSection title="2. Patient-specific transfers only (DSCSA)">
          Any actual drug transfer between pharmacies discovered through this platform
          must be a patient-specific prescription transfer permitted under the federal
          Drug Supply Chain Security Act. You agree not to use this platform to
          facilitate casual or commercial wholesale distribution of pharmaceutical
          products without appropriate licensing.
        </AgrSection>
        <AgrSection title="3. EPCIS pedigree obligation">
          Both pharmacies are responsible for exchanging compliant Transaction
          Information, Transaction History, and Transaction Statement (TI/TH/TS)
          documentation in EPCIS format for every transfer.
        </AgrSection>
        <AgrSection title="4. Controlled substances prohibited">
          Listings of any controlled substance (Schedule II–V) are prohibited and will
          be automatically rejected.
        </AgrSection>
        <AgrSection title="5. License verification">
          You confirm that the license credentials submitted during onboarding (NJ
          Board of Pharmacy permit, DEA registration, NPI) are accurate and current.
        </AgrSection>
        <AgrSection title="6. Audit log and records">
          All actions on this platform are logged with timestamps, user identity, and
          pharmacist NPI. Records are retained for seven years.
        </AgrSection>
        <AgrSection title="7. Bilateral transactions; platform is not a party">
          Any agreement to transfer drugs and any payment for transferred drugs is
          entered into directly and bilaterally between the two pharmacies. AuditProRx
          is not a party to any such transaction.
        </AgrSection>
        <AgrSection title="8. No marketplace, no transaction fees">
          The platform does not set prices, accept payment, take a transaction fee, or
          earn revenue tied to the volume or value of any drug transferred.
        </AgrSection>
        <AgrSection title="9. Anti-Kickback compliance">
          You confirm that your participation does not involve remuneration in
          exchange for referrals of business reimbursable under any federal healthcare
          program.
        </AgrSection>
        <AgrSection title="10. Term and termination">
          Either party may terminate participation at any time. AuditProRx may suspend
          or terminate accounts that violate these terms or applicable law.
        </AgrSection>
      </div>

      <div className="border-t border-gray-100 bg-gray-50 px-8 py-5">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            disabled={!scrolled}
            className="mt-0.5 h-5 w-5 cursor-pointer rounded border-gray-300 text-gray-900 focus:ring-gray-900 disabled:cursor-not-allowed"
          />
          <span
            className={`text-sm font-medium ${
              scrolled ? "text-gray-900" : "text-gray-400"
            }`}
          >
            I have read this agreement in full and I am authorized to bind my pharmacy
            to its terms. I am the Pharmacist-in-Charge or a designee of the PIC.
          </span>
        </label>
        {!scrolled && (
          <div className="mt-2 text-xs italic text-gray-500">
            Scroll to the end of the agreement to enable acceptance.
          </div>
        )}
        <div className="mt-4 flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={onAccept}
            disabled={!checked}
            className="rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Accept &amp; Continue
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function AgrSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="mb-1 font-extrabold text-gray-900">{title}</h4>
      <p>{children}</p>
    </div>
  );
}

// ============================================================================
// Email Draft Modal — fully scrollable structure
// ============================================================================

function EmailDraftModal({
  listing,
  myPharmacy,
  myUser,
  requestData,
  setRequestData,
  onClose,
}: {
  listing: InventoryListing;
  myPharmacy: PharmacyMini;
  myUser: { name: string; email: string };
  requestData: { patientRx: string; quantity: number; notes: string };
  setRequestData: (d: any) => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"form" | "preview" | "sending" | "success">("form");
  const [emailBody, setEmailBody] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [sendError, setSendError] = useState<string | null>(null);

  // Build subject/body when entering preview
  const buildEmail = () => {
    const subject = `Patient-specific transfer inquiry: ${listing.drug_name}${
      listing.strength ? " " + listing.strength : ""
    }`;

    const body = `Dear ${listing.pharmacy.pharmacist_name || "Pharmacist-in-Charge"},

I am reaching out regarding your listing for ${listing.drug_name}${
      listing.strength ? " " + listing.strength : ""
    } (NDC ${listing.ndc}).

We have a patient with an active prescription that we are unable to fill from current stock and would like to discuss arranging a patient-specific transfer under DSCSA.

REQUEST DETAILS
───────────────
Drug:           ${listing.drug_name}${listing.strength ? " " + listing.strength : ""}
NDC:            ${listing.ndc}
Lot Number:     ${listing.lot_number || "—"}
Quantity Need:  ${requestData.quantity}${listing.package_size ? " (" + listing.package_size + ")" : ""}
Patient Rx:     ${requestData.patientRx}
${requestData.notes ? "\nNotes: " + requestData.notes + "\n" : ""}
BUYER PHARMACY
──────────────
Pharmacy:       ${myPharmacy.pharmacy_name}
PIC / Contact:  ${myUser.name}
Email:          ${myUser.email}
Phone:          ${myPharmacy.phone || "—"}
Address:        ${myPharmacy.address}
NPI:            ${myPharmacy.npi_number || "—"}
NCPDP:          ${myPharmacy.ncpdp_number || "—"}

Please confirm availability at your earliest convenience. If you accept, both pharmacies will exchange EPCIS pedigree documentation for the transfer.

Please find the Network Participation Agreement attached for your records.

Thank you,
${myUser.name}
${myPharmacy.pharmacy_name}
${myUser.email}`;

    return { subject, body };
  };

  const handleProceedToPreview = () => {
    if (!requestData.patientRx.trim() || requestData.quantity < 1) return;
    const { subject, body } = buildEmail();
    setEmailSubject(subject);
    setEmailBody(body);
    setStep("preview");
  };

  const handleSend = async () => {
    setStep("sending");
    setSendError(null);
    try {
      const res = await api.post("/api/inventory-view/connect-request", {
        listing_id: listing.id,
        seller_pharmacy_id: listing.pharmacy.id,
        seller_email: listing.pharmacy.email,
        patient_rx: requestData.patientRx,
        quantity: requestData.quantity,
        notes: requestData.notes,
        email_subject: emailSubject,
        email_body: emailBody,
      });
      if (res.data?.status === "sent") {
        setStep("success");
      } else {
        setSendError(
          res.data?.email_error ||
            "The request was logged but the email could not be delivered. Please contact the pharmacy directly."
        );
        setStep("preview");
      }
    } catch (err: any) {
      console.error("Failed to send connect request:", err);
      setSendError(
        err?.response?.data?.error || "Failed to send request. Please try again."
      );
      setStep("preview");
    }
  };

  // ── Step: Success ──
  if (step === "success") {
    return (
      <ModalShell onClose={onClose} width="max-w-xl">
        <div className="px-10 py-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="mt-5 text-2xl font-extrabold tracking-tight text-gray-900">
            Connect Request Sent
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
            An email has been sent to{" "}
            <span className="font-bold text-gray-900">
              {listing.pharmacy.pharmacy_name}
            </span>{" "}
            with the agreement attached. They will reach out to you directly to
            coordinate the patient-specific transfer.
          </p>
          <div className="mx-auto mt-6 max-w-md rounded-2xl bg-gray-50 p-4 text-left text-xs">
            <div className="font-extrabold text-gray-900 text-sm">What happens next</div>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-gray-600">
              <li>Seller pharmacy receives email with full request details</li>
              <li>They reply directly to your email to coordinate</li>
              <li>Both pharmacies arrange the bilateral transfer</li>
              <li>EPCIS pedigree is exchanged between both parties</li>
            </ol>
          </div>
          <button
            onClick={onClose}
            className="mt-6 rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </ModalShell>
    );
  }

  // ── Step: Sending ──
  if (step === "sending") {
    return (
      <ModalShell onClose={() => {}} width="max-w-xl">
        <div className="px-10 py-16 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-gray-400" />
          <div className="mt-4 text-sm font-semibold text-gray-700">
            Sending request to {listing.pharmacy.pharmacy_name}…
          </div>
        </div>
      </ModalShell>
    );
  }

  // ── Step: Preview ──
  if (step === "preview") {
    return (
      <ModalShell onClose={onClose} width="max-w-3xl">
        <div className="flex flex-col max-h-[90vh]">
          <div className="border-b border-gray-100 px-7 py-5 flex-shrink-0">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-inset ring-emerald-200">
              Step 2 · Review email
            </div>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900">
              Review &amp; Send
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              This email will be sent to the holding pharmacy. The agreement is
              attached automatically.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-7 py-5 space-y-4">
            <div>
              <FieldLabel>To</FieldLabel>
              <div className="rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-900">
                {listing.pharmacy.pharmacist_name && (
                  <span>{listing.pharmacy.pharmacist_name} · </span>
                )}
                {listing.pharmacy.pharmacy_name}{" "}
                <span className="text-gray-500">
                  &lt;{listing.pharmacy.email || "no-email-on-file"}&gt;
                </span>
              </div>
            </div>

            <div>
              <FieldLabel>From</FieldLabel>
              <div className="rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-900">
                {myUser.name}{" "}
                <span className="text-gray-500">&lt;{myUser.email}&gt;</span>
              </div>
            </div>

            <div>
              <FieldLabel>Subject</FieldLabel>
              <div className="rounded-xl bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-900">
                {emailSubject}
              </div>
            </div>

            <div>
              <FieldLabel>Message</FieldLabel>
              <div
                className="w-full whitespace-pre-wrap rounded-xl bg-gray-50 px-4 py-3 font-mono text-xs leading-relaxed text-gray-900 ring-1 ring-inset ring-gray-100"
                style={{ maxHeight: "200px", overflowY: "auto" }}
              >
                {emailBody}
              </div>
            </div>

            <div>
              <FieldLabel>Attachments</FieldLabel>
              <div className="flex items-center gap-2 rounded-xl bg-violet-50 px-4 py-3 ring-1 ring-inset ring-violet-200">
                <Paperclip className="h-4 w-4 text-violet-700" />
                <div className="flex-1">
                  <div className="text-sm font-bold text-violet-900">
                    AuditProRx_Network_Agreement.pdf
                  </div>
                  <div className="text-[11px] text-violet-700">
                    Network participation agreement · Auto-attached
                  </div>
                </div>
              </div>
            </div>
          </div>

          {sendError && (
            <div className="border-t border-gray-100 bg-rose-50 px-7 py-3 text-xs text-rose-800 flex-shrink-0">
              <span className="font-bold">Email failed:</span> {sendError}
            </div>
          )}

          <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-7 py-4 flex-shrink-0">
            <button
              onClick={() => setStep("form")}
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Edit Request
            </button>
            <button
              onClick={handleSend}
              className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
            >
              <Send className="h-4 w-4" />
              Send Email
            </button>
          </div>
        </div>
      </ModalShell>
    );
  }

  // ── Step: Form ──
  return (
    <ModalShell onClose={onClose} width="max-w-2xl">
      <div className="flex flex-col max-h-[90vh]">
        <div className="border-b border-gray-100 px-7 py-5 flex-shrink-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700 ring-1 ring-inset ring-violet-200">
            Step 1 · Request details
          </div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900">
            Connect Request
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Provide the patient prescription details. We'll generate a professional
            email to the holding pharmacy with the agreement attached.
          </p>
        </div>

        {/* Scrollable middle section */}
        <div className="flex-1 overflow-y-auto">
          {/* Listing summary */}
          <div className="border-b border-gray-100 bg-gray-50 px-7 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <DataLabel>Requesting from</DataLabel>
                <div className="mt-0.5 flex items-center gap-1.5 text-sm font-extrabold text-gray-900">
                  {listing.pharmacy.pharmacy_name}
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {listing.pharmacy.address?.split(",")[0]}
                </div>
              </div>
              <div className="text-right">
                <DataLabel>Drug</DataLabel>
                <div className="mt-0.5 text-sm font-extrabold text-gray-900">
                  {listing.drug_name}
                </div>
                <div className="text-xs text-gray-500">
                  {listing.strength} · {listing.quantity} available
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4 px-7 py-5">
            <div>
              <FieldLabel required>Patient Rx Number</FieldLabel>
              <input
                type="text"
                value={requestData.patientRx}
                onChange={(e) =>
                  setRequestData({ ...requestData, patientRx: e.target.value })
                }
                placeholder="e.g. RX-2026-04-1234"
                className="h-11 w-full rounded-xl border-0 bg-gray-50 px-4 font-mono text-sm outline-none ring-1 ring-inset ring-transparent focus:bg-white focus:ring-gray-900"
              />
              <div className="mt-1 text-xs text-gray-500">
                Required by DSCSA to qualify as a patient-specific transfer.
              </div>
            </div>

            <div>
              <FieldLabel required>Quantity Requested</FieldLabel>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={listing.quantity}
                  value={requestData.quantity}
                  onChange={(e) =>
                    setRequestData({
                      ...requestData,
                      quantity: Number(e.target.value),
                    })
                  }
                  className="h-11 w-32 rounded-xl border-0 bg-gray-50 px-4 text-sm font-semibold outline-none ring-1 ring-inset ring-transparent focus:bg-white focus:ring-gray-900"
                />
                <span className="text-sm text-gray-500">
                  of {listing.quantity} available
                </span>
              </div>
            </div>

            <div>
              <FieldLabel>Notes for Pharmacist (optional)</FieldLabel>
              <textarea
                value={requestData.notes}
                onChange={(e) =>
                  setRequestData({ ...requestData, notes: e.target.value })
                }
                rows={3}
                placeholder="Patient context, urgency, preferred pickup arrangement…"
                className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-sm outline-none ring-1 ring-inset ring-transparent focus:bg-white focus:ring-gray-900"
              />
            </div>

            <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900 ring-1 ring-inset ring-amber-200">
              <div className="font-extrabold">By proceeding you confirm:</div>
              <ul className="mt-1 list-disc space-y-0.5 pl-5">
                <li>You hold a current, dispensable prescription for an identified patient</li>
                <li>The transfer will follow DSCSA patient-specific transfer requirements</li>
                <li>Both pharmacies will exchange EPCIS pedigree documentation</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 px-7 py-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={handleProceedToPreview}
            disabled={!requestData.patientRx.trim() || requestData.quantity < 1}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Generate Email
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

// ============================================================================
// My Listings View — Edit & Delist functional
// ============================================================================

function MyListingsView({
  listings,
  groups,
  onRefresh,
}: {
  listings: InventoryListing[];
  groups: InventoryGroup[];
  onRefresh: () => void;
}) {
  const [editingListing, setEditingListing] =
    useState<InventoryListing | null>(null);
  const [delistingListing, setDelistingListing] =
    useState<InventoryListing | null>(null);

  if (listings.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-100">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
          <Boxes className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-xl font-extrabold text-gray-900">
          No active listings
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          List your surplus, near-expiry, or overstock inventory to help other
          pharmacies.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {listings.map((listing) => {
        const tag = getExpiryTag(listing.expiry);
        return (
          <div
            key={listing.id}
            className="flex flex-wrap items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 text-lg font-extrabold text-emerald-600">
              {listing.drug_name[0]}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-extrabold text-gray-900">
                  {listing.drug_name}
                  {listing.strength ? ` ${listing.strength}` : ""}
                </h3>
                {tag && (
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${tag.bg} ${tag.text} ${tag.ring}`}
                  >
                    {tag.label}
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-600">
                NDC {listing.ndc}
                {listing.lot_number ? ` · Lot ${listing.lot_number}` : ""}
              </div>
              <div className="text-[11px] text-gray-400">
                Listed {timeAgo(listing.listed_at)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-extrabold text-gray-900">
                {listing.quantity}
              </div>
              <div className="text-[11px] text-gray-500">units listed</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingListing(listing)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button
                onClick={() => setDelistingListing(listing)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delist
              </button>
            </div>
          </div>
        );
      })}

      {editingListing && (
        <EditListingModal
          listing={editingListing}
          onClose={() => setEditingListing(null)}
          onSuccess={() => {
            setEditingListing(null);
            onRefresh();
          }}
        />
      )}

      {delistingListing && (
        <DelistConfirmModal
          listing={delistingListing}
          onClose={() => setDelistingListing(null)}
          onSuccess={() => {
            setDelistingListing(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
}

function EditListingModal({
  listing,
  onClose,
  onSuccess,
}: {
  listing: InventoryListing;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [quantity, setQuantity] = useState<string>(String(listing.quantity));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const qty = parseInt(quantity, 10);
  const invalid = isNaN(qty) || qty < 1;

  const handleSave = async () => {
    if (invalid) {
      setError("Please enter a valid quantity (at least 1).");
      return;
    }
    if (qty === listing.quantity) {
      onClose();
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await api.patch(`/api/inventory-view/listings/${listing.id}`, {
        quantity: qty,
      });
      onSuccess();
    } catch (err: any) {
      console.error("Failed to edit:", err);
      setError(
        err?.response?.data?.error ||
          "Failed to update listing. Please try again."
      );
      setSubmitting(false);
    }
  };

  return (
    <ModalShell onClose={onClose} width="max-w-md">
      <div className="flex flex-col">
        <div className="border-b border-gray-100 px-7 py-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700 ring-1 ring-inset ring-violet-200">
            <Pencil className="h-3 w-3" />
            Edit Listing
          </div>
          <h2 className="mt-2 text-xl font-extrabold tracking-tight text-gray-900">
            {listing.drug_name}
            {listing.strength ? ` ${listing.strength}` : ""}
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            NDC {listing.ndc}
            {listing.lot_number ? ` · Lot ${listing.lot_number}` : ""}
          </p>
        </div>

        <div className="space-y-4 px-7 py-5">
          <div>
            <FieldLabel required>Quantity Available</FieldLabel>
            <input
              type="number"
              min={1}
              autoFocus
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !invalid) handleSave();
              }}
              className="h-11 w-full rounded-xl border-0 bg-gray-50 px-4 text-sm font-semibold outline-none ring-1 ring-inset ring-transparent focus:bg-white focus:ring-gray-900"
            />
            <div className="mt-1 text-xs text-gray-500">
              Currently listed: {listing.quantity} units
            </div>
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-800 ring-1 ring-inset ring-rose-200">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 px-7 py-4">
          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={submitting || invalid}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {submitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Saving…
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

function DelistConfirmModal({
  listing,
  onClose,
  onSuccess,
}: {
  listing: InventoryListing;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setSubmitting(true);
    setError(null);
    try {
      await api.delete(`/api/inventory-view/listings/${listing.id}`);
      onSuccess();
    } catch (err: any) {
      console.error("Failed to delist:", err);
      setError(
        err?.response?.data?.error || "Failed to delist. Please try again."
      );
      setSubmitting(false);
    }
  };

  return (
    <ModalShell onClose={onClose} width="max-w-md">
      <div className="px-7 pb-2 pt-7 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
          <Trash2 className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-xl font-extrabold tracking-tight text-gray-900">
          Remove this listing?
        </h2>
        <p className="mx-auto mt-2 max-w-xs text-sm text-gray-500">
          <span className="font-bold text-gray-900">
            {listing.drug_name}
            {listing.strength ? ` ${listing.strength}` : ""}
          </span>{" "}
          will no longer be visible to other pharmacies. This cannot be undone.
        </p>
      </div>

      <div className="px-7 py-4">
        <div className="rounded-xl bg-gray-50 px-4 py-3 text-xs ring-1 ring-inset ring-gray-100">
          <div className="font-mono text-gray-500">
            NDC {listing.ndc}
            {listing.lot_number ? ` · Lot ${listing.lot_number}` : ""}
          </div>
          <div className="mt-1 text-gray-700">
            <span className="font-bold">{listing.quantity}</span> units listed
          </div>
        </div>

        {error && (
          <div className="mt-3 rounded-xl bg-rose-50 p-3 text-xs text-rose-800 ring-1 ring-inset ring-rose-200">
            {error}
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 px-7 py-4">
        <button
          onClick={onClose}
          disabled={submitting}
          className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={submitting}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {submitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Removing…
            </>
          ) : (
            <>
              <Trash2 className="h-3.5 w-3.5" />
              Yes, Delist
            </>
          )}
        </button>
      </div>
    </ModalShell>
  );
}

// ============================================================================
// Add Listing Modal — with NDC autocomplete and dosage form dropdown
// ============================================================================

function AddListingModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    ndc: "",
    drug_name: "",
    strength: "",
    dosage_form: "",
    manufacturer: "",
    package_size: "",
    lot_number: "",
    expiry: "",
    quantity: "",
    acquisition_cost: "",
    reason_code: "" as ReasonCode | "",
  });

  const [visibility, setVisibility] = useState<Visibility>("public");
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [availableGroups, setAvailableGroups] = useState<InventoryGroup[]>([]);

  useEffect(() => {
    api
      .get("/api/inventory-view/groups")
      .then((res) => setAvailableGroups(res.data || []))
      .catch(() => setAvailableGroups([]));
  }, []);

  // ── NDC autocomplete state ──
  const [ndcSuggestions, setNdcSuggestions] = useState<NdcSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const ndcInputRef = useRef<HTMLDivElement>(null);

  // ── Debounced NDC search ──
  useEffect(() => {
    const q = form.ndc.trim();
    if (q.length < 2) {
      setNdcSuggestions([]);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const res = await api.get(
          `/api/audits/ndc-suggestions?q=${encodeURIComponent(q)}`
        );
        setNdcSuggestions(res.data || []);
      } catch (err) {
        console.error("NDC suggestion error:", err);
        setNdcSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [form.ndc]);

  // ── Click outside closes dropdown ──
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ndcInputRef.current && !ndcInputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pickSuggestion = (s: NdcSuggestion) => {
    const parts = s.drug_name.split(/\s+/);
    const drugBase = parts[0] || s.drug_name;
    const strengthGuess = parts.slice(1).join(" ").toLowerCase();

    setForm({
      ...form,
      ndc: s.ndc,
      drug_name: drugBase.charAt(0) + drugBase.slice(1).toLowerCase(),
      strength: form.strength || strengthGuess,
      manufacturer: form.manufacturer || s.brand || "",
      package_size: form.package_size || s.package_size || "",
    });
    setShowSuggestions(false);
  };

  const handlePublish = async () => {
    let reasonCode: ReasonCode = "overstock";
    if (form.expiry) {
      const days = Math.floor(
        (new Date(form.expiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      if (days <= EXPIRY_SOON_DAYS) reasonCode = "near_expiry";
    }
    try {
      await api.post("/api/inventory-view/listings", {
        ...form,
        reason_code: reasonCode,
        visibility,
        group_ids: visibility === "groups_only" ? selectedGroupIds : [],
      });
      onSuccess();
    } catch (err: any) {
      console.error("Failed to create listing:", err);
      const msg = err?.response?.data?.error || "Please try again.";
      alert("Failed to publish listing. " + msg);
    }
  };

  return (
    <ModalShell onClose={onClose} width="max-w-2xl">
      <div className="flex flex-col max-h-[90vh]">
        <div className="border-b border-gray-100 px-7 py-5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700 ring-1 ring-inset ring-violet-200">
              Step {step} of 3
            </div>
            <div className="flex gap-1">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 w-10 rounded-full ${
                    s <= step ? "bg-gray-900" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-gray-900">
            {step === 1 && "Drug Identification"}
            {step === 2 && "Lot & Inventory"}
            {step === 3 && "Visibility"}
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 px-7 py-5">
          {step === 1 && (
            <>
              <div ref={ndcInputRef} className="relative">
                <FieldLabel required>NDC Number</FieldLabel>
                <input
                  type="text"
                  value={form.ndc}
                  onChange={(e) => {
                    setForm({ ...form, ndc: e.target.value });
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Type NDC or drug name (e.g. 00002-1495 or Mounjaro)"
                  className="h-11 w-full rounded-xl border-0 bg-gray-50 px-4 font-mono text-sm outline-none ring-1 ring-inset ring-transparent focus:bg-white focus:ring-gray-900"
                  autoComplete="off"
                />

                {showSuggestions && form.ndc.trim().length >= 2 && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-1.5 max-h-72 overflow-y-auto rounded-xl bg-white shadow-lg ring-1 ring-gray-200">
                    {isSearching ? (
                      <div className="flex items-center gap-2 px-4 py-3 text-xs text-gray-500">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Searching network…
                      </div>
                    ) : ndcSuggestions.length === 0 ? (
                      <div className="px-4 py-3 text-xs text-gray-500">
                        No matches in network. You can still enter the NDC manually.
                      </div>
                    ) : (
                      <div className="py-1">
                        <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          From AuditProRx network
                        </div>
                        {ndcSuggestions.map((s) => (
                          <button
                            key={s.ndc}
                            type="button"
                            onClick={() => pickSuggestion(s)}
                            className="group flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-violet-50/60"
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-xs font-extrabold text-violet-700">
                              {s.drug_name[0]}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-bold text-gray-900">
                                {s.drug_name}
                              </div>
                              <div className="font-mono text-[11px] text-gray-500">
                                NDC {s.ndc}
                                {s.brand ? ` · ${s.brand}` : ""}
                              </div>
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-violet-600" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-1.5 text-xs text-gray-500">
                  Pick from suggestions to auto-fill drug name and strength.
                </div>
              </div>

              <div>
                <FieldLabel required>Drug Name &amp; Strength</FieldLabel>
                <div
                  className={`flex h-11 w-full overflow-hidden rounded-xl bg-gray-50 ring-1 ring-inset ring-transparent transition focus-within:bg-white focus-within:ring-gray-900`}
                >
                  <input
                    type="text"
                    value={form.drug_name}
                    onChange={(e) =>
                      setForm({ ...form, drug_name: e.target.value })
                    }
                    placeholder="Mounjaro"
                    className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"
                  />
                  <div className="my-2 w-px bg-gray-200" />
                  <input
                    type="text"
                    value={form.strength}
                    onChange={(e) =>
                      setForm({ ...form, strength: e.target.value })
                    }
                    placeholder="7.5 mg/0.5 mL"
                    className="min-w-0 flex-1 bg-transparent px-4 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Package Size</FieldLabel>
                <input
                  type="text"
                  value={form.package_size}
                  onChange={(e) =>
                    setForm({ ...form, package_size: e.target.value })
                  }
                  placeholder="4 pens/carton"
                  className="h-11 w-full rounded-xl border-0 bg-gray-50 px-4 text-sm outline-none ring-1 ring-inset ring-transparent focus:bg-white focus:ring-gray-900"
                />
              </div>

              <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-900 ring-1 ring-inset ring-rose-200">
                <div className="font-extrabold">
                  Controlled substances cannot be listed.
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel required>Lot Number</FieldLabel>
                  <input
                    type="text"
                    value={form.lot_number}
                    onChange={(e) => setForm({ ...form, lot_number: e.target.value })}
                    placeholder="B2024-7891"
                    className="h-11 w-full rounded-xl border-0 bg-gray-50 px-4 font-mono text-sm outline-none ring-1 ring-inset ring-transparent focus:bg-white focus:ring-gray-900"
                  />
                </div>
                <div>
                  <FieldLabel required>Expiry Date</FieldLabel>
                  <input
                    type="date"
                    value={form.expiry}
                    onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                    className="h-11 w-full rounded-xl border-0 bg-gray-50 px-4 text-sm outline-none ring-1 ring-inset ring-transparent focus:bg-white focus:ring-gray-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel required>Quantity Available</FieldLabel>
                  <input
                    type="number"
                    min={1}
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    className="h-11 w-full rounded-xl border-0 bg-gray-50 px-4 text-sm outline-none ring-1 ring-inset ring-transparent focus:bg-white focus:ring-gray-900"
                  />
                </div>
                <div>
                  <FieldLabel>Shelf Cost (per unit, optional)</FieldLabel>
                  <input
                    type="number"
                    step="0.01"
                    value={form.acquisition_cost}
                    onChange={(e) =>
                      setForm({ ...form, acquisition_cost: e.target.value })
                    }
                    placeholder="0.00"
                    className="h-11 w-full rounded-xl border-0 bg-gray-50 px-4 text-sm outline-none ring-1 ring-inset ring-transparent focus:bg-white focus:ring-gray-900"
                  />
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Shelf cost is shown as benchmarking only — not a sale price.
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900 ring-1 ring-inset ring-amber-200">
                <span className="font-extrabold">Listing auto-expires in 30 days.</span>{" "}
                Visible only to verified pharmacies. Records retained for 7 years.
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setVisibility("public")}
                  className={`flex w-full items-start gap-3 rounded-xl p-4 text-left ring-1 ring-inset transition ${
                    visibility === "public"
                      ? "bg-violet-50 ring-violet-300"
                      : "bg-gray-50 ring-transparent hover:bg-white hover:ring-gray-300"
                  }`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-extrabold text-gray-900">
                      Public — visible to all verified pharmacies
                    </div>
                    <div className="mt-0.5 text-xs text-gray-600">
                      Maximum reach. Recommended unless you specifically want to limit visibility.
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setVisibility("groups_only")}
                  disabled={availableGroups.length === 0}
                  className={`flex w-full items-start gap-3 rounded-xl p-4 text-left ring-1 ring-inset transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    visibility === "groups_only"
                      ? "bg-violet-50 ring-violet-300"
                      : "bg-gray-50 ring-transparent hover:bg-white hover:ring-gray-300"
                  }`}
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-extrabold text-gray-900">
                      Groups only — selected groups can see this
                    </div>
                    <div className="mt-0.5 text-xs text-gray-600">
                      {availableGroups.length === 0
                        ? "Join or create a group first to use this option."
                        : "Pick which of your groups can see this listing."}
                    </div>
                  </div>
                </button>
              </div>

              {visibility === "groups_only" && availableGroups.length > 0 && (
                <div className="rounded-xl bg-gray-50 p-3 ring-1 ring-gray-100">
                  <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    Select groups
                  </div>
                  <div className="space-y-1.5">
                    {availableGroups.map((g) => {
                      const checked = selectedGroupIds.includes(g.id);
                      return (
                        <label
                          key={g.id}
                          className="flex cursor-pointer items-center gap-2 rounded-lg bg-white px-3 py-2 ring-1 ring-gray-100 hover:bg-violet-50/50"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => {
                              setSelectedGroupIds((prev) =>
                                checked
                                  ? prev.filter((id) => id !== g.id)
                                  : [...prev, g.id]
                              );
                            }}
                            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                          />
                          <Users className="h-3.5 w-3.5 text-violet-600" />
                          <span className="flex-1 text-sm font-bold text-gray-900">{g.name}</span>
                          <span className="text-[11px] text-gray-500">
                            {g.member_count} members
                          </span>
                        </label>
                      );
                    })}
                  </div>
                  {selectedGroupIds.length === 0 && (
                    <div className="mt-2 text-[11px] text-rose-600">
                      Pick at least one group, or switch to Public.
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-7 py-4 flex-shrink-0">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
          >
            {step > 1 ? "← Back" : "Cancel"}
          </button>
          <button
            onClick={() => {
              if (step < 3) setStep(step + 1);
              else handlePublish();
            }}
            disabled={
              (step === 1 && (!form.ndc || !form.drug_name)) ||
              (step === 2 && (!form.lot_number || !form.expiry || !form.quantity)) ||
              (step === 3 && visibility === "groups_only" && selectedGroupIds.length === 0)
            }
            className="rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {step < 3 ? "Continue" : "Publish Listing"}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

// ============================================================================
// Modal shell
// ============================================================================

function ModalShell({
  children,
  onClose,
  width = "max-w-2xl",
}: {
  children: React.ReactNode;
  onClose: () => void;
  width?: string;
}) {
  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center bg-gray-900/40 p-4 backdrop-blur-sm">
      <div
        className={`relative w-full ${width} max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl`}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-lg bg-gray-50 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
        >
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

// ============================================================================
// Atoms
// ============================================================================

function DataLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
      {children}
    </div>
  );
}

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-600">
      {children}
      {required && <span className="ml-1 text-rose-500">*</span>}
    </label>
  );
}

function SectionHeading({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500">
      <span className="text-gray-400">{icon}</span>
      {children}
    </div>
  );
}

function InfoCard({
  label,
  value,
  hint,
  hintColor = "gray",
  mono = false,
}: {
  label: string;
  value: string;
  hint?: string;
  hintColor?: "gray" | "rose";
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl bg-gray-50 p-3.5 ring-1 ring-gray-100">
      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
        {label}
      </div>
      <div
        className={`mt-1 text-sm font-extrabold text-gray-900 ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </div>
      {hint && (
        <div
          className={`mt-0.5 text-[11px] ${
            hintColor === "rose" ? "text-rose-600 font-semibold" : "text-gray-500"
          }`}
        >
          {hint}
        </div>
      )}
    </div>
  );
}

function PharmacyDetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 text-gray-400">{icon}</span>
      <div className="flex-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          {label}
        </div>
        <div className="text-sm text-gray-900">{value}</div>
      </div>
    </div>
  );
}

function SmallStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
        {label}
      </div>
      <div className="font-mono text-sm font-bold text-gray-900">{value}</div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-100">
      <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-400" />
      <div className="mt-3 text-sm font-semibold text-gray-600">
        Loading listings…
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-100">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
        <Search className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-xl font-extrabold text-gray-900">
        No listings available
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Be the first to list inventory or check back soon as more pharmacies join the
        network.
      </p>
    </div>
  );
}

function timeAgo(iso: string) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ============================================================================
// ConfirmModal — reusable confirmation dialog
// ============================================================================

function ConfirmModal({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onClose,
  loading = false,
}: {
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning";
  onConfirm: () => void;
  onClose: () => void;
  loading?: boolean;
}) {
  const variantStyles = {
    danger: {
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      button: "bg-rose-600 hover:bg-rose-700",
    },
    warning: {
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      button: "bg-gray-900 hover:bg-gray-800",
    },
  };
  const v = variantStyles[variant];

  return (
    <ModalShell onClose={loading ? () => {} : onClose} width="max-w-md">
      <div className="px-7 pb-2 pt-7 text-center">
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${v.iconBg} ${v.iconColor}`}
        >
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-xl font-extrabold tracking-tight text-gray-900">
          {title}
        </h2>
        <div className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
          {message}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 px-7 py-4 mt-6">
        <button
          onClick={onClose}
          disabled={loading}
          className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 disabled:opacity-50"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-gray-300 ${v.button}`}
        >
          {loading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Working…
            </>
          ) : (
            confirmLabel
          )}
        </button>
      </div>
    </ModalShell>
  );
}

// ============================================================================
// GroupsView — My Groups sub-tab (with Private/Discoverable badges + pending count)
// ============================================================================

function GroupsView({
  groups,
  onCreate,
  onView,
}: {
  groups: InventoryGroup[];
  onCreate: () => void;
  onView: (id: string) => void;
}) {
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-2">
        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
        >
          <Plus className="h-4 w-4" />
          Create Group
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-100">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-xl font-extrabold text-gray-900">
            No groups yet
          </h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
            Create a group to share inventory privately with trusted pharmacies, or check the Discover tab to find existing groups.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => onView(g.id)}
              className="group flex flex-col items-start rounded-2xl bg-white p-5 text-left shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
            >
              <div className="flex w-full items-start justify-between gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-violet-50 text-violet-600">
                  <Users className="h-6 w-6" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  {g.is_admin && (
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-inset ring-amber-200">
                      Admin
                    </span>
                  )}
                  {!g.is_discoverable && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-600">
                      <Lock className="h-2.5 w-2.5" />
                      Private
                    </span>
                  )}
                  {g.pending_join_requests > 0 && g.is_admin && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 ring-1 ring-inset ring-rose-200">
                      {g.pending_join_requests} pending
                    </span>
                  )}
                </div>
              </div>
              <h3 className="mt-3 text-lg font-extrabold text-gray-900">
                {g.name}
              </h3>
              {g.description && (
                <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                  {g.description}
                </p>
              )}
              <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span className="font-bold text-gray-900">{g.member_count}</span>
                  /{g.max_members} members
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// DiscoverGroupsView — NEW: browse public groups and request to join
// ============================================================================

function DiscoverGroupsView({
  groups,
  onRefresh,
}: {
  groups: DiscoverableGroup[];
  onRefresh: () => void;
}) {
  const [requestingId, setRequestingId] = useState<string | null>(null);
  const [messageInputId, setMessageInputId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleRequest = async (groupId: string) => {
    setRequestingId(groupId);
    setError(null);
    try {
      await api.post(`/api/inventory-view/groups/${groupId}/request-join`, {
        message: messageText.trim() || null,
      });
      setMessageInputId(null);
      setMessageText("");
      onRefresh();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to send join request");
    } finally {
      setRequestingId(null);
    }
  };

  if (groups.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-100">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
          <Compass className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-xl font-extrabold text-gray-900">
          No groups to discover
        </h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
          There are no discoverable groups right now. Be the first — create a public group from the My Groups tab.
        </p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-3 rounded-xl bg-rose-50 p-3 text-xs text-rose-800 ring-1 ring-inset ring-rose-200">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {groups.map((g) => (
          <div
            key={g.id}
            className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 transition hover:shadow-md"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-violet-50 text-violet-600">
                <Users className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-extrabold text-gray-900">{g.name}</h3>
                {g.admin_pharmacy_name && (
                  <div className="text-[11px] text-gray-500">
                    By <span className="font-semibold text-gray-700">{g.admin_pharmacy_name}</span>
                  </div>
                )}
              </div>
            </div>
            {g.description && (
              <p className="mt-2 line-clamp-2 text-xs text-gray-600">{g.description}</p>
            )}
            <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
              <span className="inline-flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span className="font-bold text-gray-900">{g.member_count}</span>
                /{g.max_members}
              </span>
              <span className="text-gray-400">·</span>
              <span>Created {timeAgo(g.created_at)}</span>
            </div>

            {messageInputId === g.id ? (
              <div className="mt-3 space-y-2">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={2}
                  placeholder="Optional: brief note to the admin (why join?)"
                  className="w-full rounded-lg border-0 bg-gray-50 px-3 py-2 text-xs outline-none ring-1 ring-inset ring-transparent focus:bg-white focus:ring-gray-900"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRequest(g.id)}
                    disabled={requestingId === g.id}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 disabled:bg-gray-300"
                  >
                    {requestingId === g.id ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="h-3 w-3" />
                        Send Request
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setMessageInputId(null);
                      setMessageText("");
                    }}
                    className="rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : g.has_pending_request ? (
              <div className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800 ring-1 ring-inset ring-amber-200">
                <Clock className="h-3.5 w-3.5" />
                Request Pending
              </div>
            ) : g.member_count >= g.max_members ? (
              <div className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-gray-50 px-3 py-2 text-xs font-bold text-gray-500 ring-1 ring-inset ring-gray-200">
                Group Full
              </div>
            ) : (
              <button
                onClick={() => {
                  setMessageInputId(g.id);
                  setMessageText("");
                }}
                className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Request to Join
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// CreateGroupModal — with Discoverable / Private toggle
// ============================================================================

// ============================================================================
// CreateGroupModal — with Discoverable / Private toggle
// ============================================================================

function CreateGroupModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isDiscoverable, setIsDiscoverable] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.post("/api/inventory-view/groups", {
        name: name.trim(),
        description: description.trim() || null,
        is_discoverable: isDiscoverable,
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create group");
      setSubmitting(false);
    }
  };

  return (
    <ModalShell onClose={onClose} width="max-w-md">
      <div className="flex flex-col max-h-[90vh]">
        {/* Header — fixed */}
        <div className="border-b border-gray-100 px-7 py-5 flex-shrink-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700 ring-1 ring-inset ring-violet-200">
            <Users className="h-3 w-3" />
            New Group
          </div>
          <h2 className="mt-2 text-xl font-extrabold tracking-tight text-gray-900">
            Create a Group
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Groups are circles of trusted pharmacies that share listings only with each other.
          </p>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto space-y-4 px-7 py-5">
          <div>
            <FieldLabel required>Group Name</FieldLabel>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="North Jersey Trust"
              className="h-11 w-full rounded-xl border-0 bg-gray-50 px-4 text-sm outline-none ring-1 ring-inset ring-transparent focus:bg-white focus:ring-gray-900"
            />
          </div>
          <div>
            <FieldLabel>Description (optional)</FieldLabel>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Independent pharmacies in Bergen and Hudson counties."
              className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-sm outline-none ring-1 ring-inset ring-transparent focus:bg-white focus:ring-gray-900"
            />
          </div>

          <div>
            <FieldLabel>Privacy</FieldLabel>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setIsDiscoverable(true)}
                className={`flex w-full items-start gap-3 rounded-xl p-3 text-left ring-1 ring-inset transition ${
                  isDiscoverable
                    ? "bg-violet-50 ring-violet-300"
                    : "bg-gray-50 ring-transparent hover:bg-white hover:ring-gray-300"
                }`}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                  <Globe className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-extrabold text-gray-900">
                    Discoverable
                  </div>
                  <div className="mt-0.5 text-[11px] leading-relaxed text-gray-600">
                    Other pharmacies can find this group and request to join. You approve each request.
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setIsDiscoverable(false)}
                className={`flex w-full items-start gap-3 rounded-xl p-3 text-left ring-1 ring-inset transition ${
                  !isDiscoverable
                    ? "bg-violet-50 ring-violet-300"
                    : "bg-gray-50 ring-transparent hover:bg-white hover:ring-gray-300"
                }`}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                  <Lock className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-extrabold text-gray-900">
                    Private
                  </div>
                  <div className="mt-0.5 text-[11px] leading-relaxed text-gray-600">
                    Hidden from discovery. Members can only join via your direct invitation.
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-900 ring-1 ring-inset ring-amber-200">
            <span className="font-extrabold">You'll be the group admin.</span> You can invite up to 25 pharmacies. You can be in at most 5 groups total.
          </div>
          {error && (
            <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-800 ring-1 ring-inset ring-rose-200">
              {error}
            </div>
          )}
        </div>

        {/* Footer — fixed at bottom */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 px-7 py-4 flex-shrink-0">
          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim() || submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {submitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Creating…
              </>
            ) : (
              "Create Group"
            )}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

// ============================================================================
// GroupDetailPanel — with privacy toggle + pending join requests
// ============================================================================

function GroupDetailPanel({
  groupId,
  onClose,
  onChange,
}: {
  groupId: string;
  onClose: () => void;
  onChange: () => void;
}) {
  const [data, setData] = useState<{
    group: any;
    members: GroupMember[];
    invite_codes: GroupInviteCode[];
    pending_invitations: PendingGroupInvitation[];
    pending_join_requests: PendingJoinRequest[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "remove" | "leave" | "delete";
    pharmacyId?: string;
    pharmacyName?: string;
  } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [togglingPrivacy, setTogglingPrivacy] = useState(false);
  const [actingRequestId, setActingRequestId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/inventory-view/groups/${groupId}`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to load group:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [groupId]);

  const requestRemoveMember = (pharmacyId: string, name: string) => {
    setConfirmAction({
      type: "remove",
      pharmacyId,
      pharmacyName: name,
    });
  };

  const requestLeave = () => {
    setConfirmAction({ type: "leave" });
  };

  const requestDelete = () => {
    setConfirmAction({ type: "delete" });
  };

  const executeConfirmedAction = async () => {
    if (!confirmAction) return;
    setConfirmLoading(true);
    setErrorMessage(null);
    try {
      if (confirmAction.type === "remove" && confirmAction.pharmacyId) {
        await api.delete(
          `/api/inventory-view/groups/${groupId}/members/${confirmAction.pharmacyId}`
        );
        setConfirmAction(null);
        load();
        onChange();
      } else if (confirmAction.type === "leave") {
        await api.post(`/api/inventory-view/groups/${groupId}/leave`);
        setConfirmAction(null);
        onChange();
        onClose();
      } else if (confirmAction.type === "delete") {
        await api.delete(`/api/inventory-view/groups/${groupId}`);
        setConfirmAction(null);
        onChange();
        onClose();
      }
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.error || "Action failed. Please try again.");
    } finally {
      setConfirmLoading(false);
    }
  };

  const togglePrivacy = async () => {
    if (!data) return;
    setTogglingPrivacy(true);
    try {
      await api.patch(`/api/inventory-view/groups/${groupId}`, {
        is_discoverable: !data.group.is_discoverable,
      });
      await load();
      onChange();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to update privacy");
    } finally {
      setTogglingPrivacy(false);
    }
  };

  const approveJoinRequest = async (requestId: string) => {
    setActingRequestId(requestId);
    try {
      await api.post(`/api/inventory-view/invitations/${requestId}/accept`);
      await load();
      onChange();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to approve");
    } finally {
      setActingRequestId(null);
    }
  };

  const declineJoinRequest = async (requestId: string) => {
    setActingRequestId(requestId);
    try {
      await api.post(`/api/inventory-view/invitations/${requestId}/decline`);
      await load();
      onChange();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to decline");
    } finally {
      setActingRequestId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex justify-end bg-gray-900/40 backdrop-blur-sm">
      <div className="h-full w-full max-w-2xl bg-white shadow-2xl flex flex-col">
        {loading || !data ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : (
          <>
            <div className="border-b border-gray-100 bg-white px-7 py-5 flex-shrink-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-100 to-violet-50 text-violet-600">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                        {data.group.name}
                      </h2>
                      {data.group.is_admin && (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-inset ring-amber-200">
                          Admin
                        </span>
                      )}
                      {data.group.is_discoverable ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 ring-1 ring-inset ring-emerald-200">
                          <Globe className="h-2.5 w-2.5" />
                          Discoverable
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gray-600">
                          <Lock className="h-2.5 w-2.5" />
                          Private
                        </span>
                      )}
                    </div>
                    {data.group.description && (
                      <div className="mt-1 max-w-md text-sm text-gray-600">
                        {data.group.description}
                      </div>
                    )}
                    <div className="mt-1 text-xs text-gray-400">
                      {data.members.length} of {data.group.max_members} members
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg bg-gray-50 p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Admin privacy toggle */}
              {data.group.is_admin && (
                <button
                  onClick={togglePrivacy}
                  disabled={togglingPrivacy}
                  className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-[11px] font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                >
                  {togglingPrivacy ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : data.group.is_discoverable ? (
                    <Lock className="h-3 w-3" />
                  ) : (
                    <Globe className="h-3 w-3" />
                  )}
                  {data.group.is_discoverable ? "Make Private" : "Make Discoverable"}
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 px-7 py-6">
              {/* Pending Join Requests (admin only) */}
              {data.group.is_admin &&
                data.pending_join_requests &&
                data.pending_join_requests.length > 0 && (
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <SectionHeading icon={<UserPlus className="h-3.5 w-3.5" />}>
                        Pending Join Requests
                      </SectionHeading>
                      <span className="inline-flex items-center justify-center rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                        {data.pending_join_requests.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {data.pending_join_requests.map((req) => (
                        <div
                          key={req.id}
                          className="rounded-xl bg-violet-50 p-4 ring-1 ring-inset ring-violet-200"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-xs font-extrabold text-violet-700">
                              {req.requester_pharmacy_name?.[0] || "?"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-bold text-gray-900">
                                {req.requester_pharmacy_name || "(unnamed pharmacy)"}
                              </div>
                              <div className="text-[11px] text-gray-600">
                                {req.requester_address?.split(",")[0] || "—"}
                                {req.requester_npi ? ` · NPI ${req.requester_npi}` : ""}
                              </div>
                              {req.message && (
                                <div className="mt-1.5 rounded-lg bg-white px-2.5 py-1.5 text-[11px] italic text-gray-700 ring-1 ring-violet-100">
                                  "{req.message}"
                                </div>
                              )}
                              <div className="mt-1 text-[10px] text-gray-400">
                                Requested {timeAgo(req.created_at)}
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <button
                              onClick={() => approveJoinRequest(req.id)}
                              disabled={actingRequestId === req.id}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                            >
                              {actingRequestId === req.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <UserCheck className="h-3.5 w-3.5" />
                              )}
                              Approve
                            </button>
                            <button
                              onClick={() => declineJoinRequest(req.id)}
                              disabled={actingRequestId === req.id}
                              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50 disabled:opacity-50"
                            >
                              <UserX className="h-3.5 w-3.5" />
                              Decline
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Members */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <SectionHeading icon={<Users className="h-3.5 w-3.5" />}>
                    Members
                  </SectionHeading>
                  {data.group.is_admin && (
                    <button
                      onClick={() => setShowInvite(true)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Invite
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {data.members.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-3 rounded-xl bg-gray-50 p-3 ring-1 ring-gray-100"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-xs font-extrabold text-violet-700">
                        {m.pharmacy_name?.[0] || "?"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-gray-900 truncate">
                            {m.pharmacy_name || "(unnamed pharmacy)"}
                          </span>
                          {m.role === "admin" && (
                            <span className="inline-flex items-center rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-700 ring-1 ring-inset ring-amber-200">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {m.address?.split(",")[0] || "—"}
                          {m.npi_number ? ` · NPI ${m.npi_number}` : ""}
                        </div>
                      </div>
                      {data.group.is_admin && m.role !== "admin" && (
                        <button
                          onClick={() =>
                            requestRemoveMember(m.pharmacy_id, m.pharmacy_name || "this pharmacy")
                          }
                          className="rounded-lg bg-rose-50 px-2.5 py-1 text-[10px] font-semibold text-rose-700 hover:bg-rose-100"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Invitations sent BY admin */}
              {data.group.is_admin && data.pending_invitations.length > 0 && (
                <div>
                  <SectionHeading icon={<Clock className="h-3.5 w-3.5" />}>
                    Invitations Sent
                  </SectionHeading>
                  <div className="mt-3 space-y-2">
                    {data.pending_invitations.map((inv) => (
                      <div
                        key={inv.id}
                        className="rounded-xl bg-amber-50 p-3 text-xs ring-1 ring-inset ring-amber-200"
                      >
                        <div className="font-bold text-amber-900">
                          {inv.invited_pharmacy_name ||
                            inv.invited_user_email ||
                            inv.invited_email}
                        </div>
                        <div className="text-amber-700">
                          Sent {timeAgo(inv.created_at)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 bg-white px-7 py-4 flex-shrink-0">
              <div className="flex justify-end gap-2">
                {data.group.is_admin ? (
                  <button
                    onClick={requestDelete}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete Group
                  </button>
                ) : (
                  <button
                    onClick={requestLeave}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Leave Group
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {showInvite && (
        <InviteMemberModal
          groupId={groupId}
          onClose={() => setShowInvite(false)}
          onSuccess={() => {
            setShowInvite(false);
            load();
          }}
        />
      )}

      {confirmAction && (
        <ConfirmModal
          title={
            confirmAction.type === "remove"
              ? `Remove ${confirmAction.pharmacyName}?`
              : confirmAction.type === "leave"
                ? "Leave this group?"
                : "Delete this group?"
          }
          message={
            confirmAction.type === "remove" ? (
              <>
                <span className="font-bold text-gray-900">
                  {confirmAction.pharmacyName}
                </span>{" "}
                will lose access to listings shared in this group. They can be
                re-invited later.
                {errorMessage && (
                  <div className="mt-3 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-800 ring-1 ring-inset ring-rose-200">
                    {errorMessage}
                  </div>
                )}
              </>
            ) : confirmAction.type === "leave" ? (
              <>
                You'll lose access to listings shared in this group. The admin can
                re-invite you later if needed.
                {errorMessage && (
                  <div className="mt-3 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-800 ring-1 ring-inset ring-rose-200">
                    {errorMessage}
                  </div>
                )}
              </>
            ) : (
              <>
                All members will lose access. Listings shared with this group will
                no longer be visible to anyone. This action cannot be undone.
                {errorMessage && (
                  <div className="mt-3 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-800 ring-1 ring-inset ring-rose-200">
                    {errorMessage}
                  </div>
                )}
              </>
            )
          }
          confirmLabel={
            confirmAction.type === "remove"
              ? "Remove Member"
              : confirmAction.type === "leave"
                ? "Leave Group"
                : "Delete Group"
          }
          variant="danger"
          loading={confirmLoading}
          onConfirm={executeConfirmedAction}
          onClose={() => {
            if (!confirmLoading) {
              setConfirmAction(null);
              setErrorMessage(null);
            }
          }}
        />
      )}
    </div>
  );
}

// ============================================================================
// InviteMemberModal — invite a member by email
// ============================================================================

function InviteMemberModal({
  groupId,
  onClose,
  onSuccess,
}: {
  groupId: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendInviteByEmail = async () => {
    if (!email.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.post(`/api/inventory-view/groups/${groupId}/invite`, {
        email: email.trim(),
        message: message.trim() || null,
      });
      onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to send invitation");
      setSubmitting(false);
    }
  };

  return (
    <ModalShell onClose={onClose} width="max-w-lg">
      <div className="flex flex-col max-h-[85vh]">
        <div className="border-b border-gray-100 px-7 py-5 flex-shrink-0">
          <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700 ring-1 ring-inset ring-violet-200">
            <UserPlus className="h-3 w-3" />
            Invite Pharmacy
          </div>
          <h2 className="mt-2 text-xl font-extrabold tracking-tight text-gray-900">
            Add a member to this group
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto px-7 py-5 space-y-4">
          <div>
            <FieldLabel required>Email address</FieldLabel>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="pharmacist@pharmacy.com"
              className="h-11 w-full rounded-xl border-0 bg-gray-50 px-4 text-sm outline-none ring-1 ring-inset ring-transparent focus:bg-white focus:ring-gray-900"
            />
            <div className="mt-1 text-xs text-gray-500">
              If they're already on AuditProRx, the invite shows in their inbox. Otherwise we email them.
            </div>
          </div>

          <div>
            <FieldLabel>Personal message (optional)</FieldLabel>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
              placeholder="Hey, joining this group lets us share inventory more easily."
              className="w-full rounded-xl border-0 bg-gray-50 px-4 py-3 text-xs outline-none ring-1 ring-inset ring-transparent focus:bg-white focus:ring-gray-900"
            />
          </div>

          {error && (
            <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-800 ring-1 ring-inset ring-rose-200">
              {error}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50 px-7 py-4 flex-shrink-0">
          <button
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={sendInviteByEmail}
            disabled={!email.trim() || submitting}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {submitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Sending…
              </>
            ) : (
              "Send Invite"
            )}
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

// ============================================================================
// NotificationsInbox — bell dropdown with TWO sections: Invitations + Join Requests
// ============================================================================

function NotificationsInbox({
  invitations,
  joinRequests,
  onClose,
  onChange,
}: {
  invitations: MyInvitation[];
  joinRequests: JoinRequestForMe[];
  onClose: () => void;
  onChange: () => void;
}) {
  const [actingId, setActingId] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const accept = async (id: string) => {
    setActingId(id);
    try {
      await api.post(`/api/inventory-view/invitations/${id}/accept`);
      onChange();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to accept");
    } finally {
      setActingId(null);
    }
  };

  const decline = async (id: string) => {
    setActingId(id);
    try {
      await api.post(`/api/inventory-view/invitations/${id}/decline`);
      onChange();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Failed to decline");
    } finally {
      setActingId(null);
    }
  };

  const total = invitations.length + joinRequests.length;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full z-30 mt-2 flex max-h-[600px] w-96 flex-col overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-100"
    >
      <div className="flex-shrink-0 border-b border-gray-100 px-5 py-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-extrabold text-gray-900">
            Notifications
          </div>
          <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-700 ring-1 ring-inset ring-rose-200">
            {total} pending
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {total === 0 ? (
          <div className="px-5 py-8 text-center">
            <Bell className="mx-auto h-6 w-6 text-gray-300" />
            <div className="mt-2 text-xs text-gray-500">
              No pending notifications.
            </div>
          </div>
        ) : (
          <>
            {/* Invitations TO ME */}
            {invitations.length > 0 && (
              <>
                <div className="bg-gray-50 px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  Invitations · You're invited to join
                </div>
                {invitations.map((inv) => (
                  <div
                    key={inv.id}
                    className="border-b border-gray-100 px-5 py-3"
                  >
                    <div className="text-sm font-bold text-gray-900">
                      {inv.group_name}
                    </div>
                    <div className="mt-0.5 text-xs text-gray-500">
                      {inv.inviter_name && (
                        <>
                          From <span className="font-semibold">{inv.inviter_name}</span>
                          {inv.inviter_pharmacy ? ` · ${inv.inviter_pharmacy}` : ""}
                        </>
                      )}
                    </div>
                    {inv.message && (
                      <div className="mt-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5 text-[11px] italic text-gray-600">
                        "{inv.message}"
                      </div>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => accept(inv.id)}
                        disabled={actingId === inv.id}
                        className="inline-flex items-center gap-1 rounded-lg bg-gray-900 px-3 py-1 text-[11px] font-semibold text-white hover:bg-gray-800 disabled:opacity-50"
                      >
                        {actingId === inv.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        Accept
                      </button>
                      <button
                        onClick={() => decline(inv.id)}
                        disabled={actingId === inv.id}
                        className="rounded-lg bg-gray-50 px-3 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Join Requests FOR MY GROUPS */}
            {joinRequests.length > 0 && (
              <>
                <div className="bg-violet-50 px-5 py-2 text-[10px] font-bold uppercase tracking-wider text-violet-700">
                  Join Requests · Pharmacies want to join your groups
                </div>
                {joinRequests.map((req) => (
  <div
    key={req.id}
    className="border-b border-gray-100 px-5 py-3"
  >
    <div className="text-sm font-bold text-gray-900">
      {req.requester_pharmacy || req.requester_name || "(unnamed)"}
    </div>
    <div className="mt-0.5 text-xs text-gray-500">
      wants to join{" "}
      <span className="font-semibold text-gray-900">
        {req.group_name}
      </span>
    </div>

    {/* Pharmacy details: address, phone */}
    <div className="mt-2 space-y-0.5 text-[11px] text-gray-600">
      {req.requester_address && (
        <div className="flex items-start gap-1.5">
          <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-gray-400" />
          <span className="truncate">{req.requester_address}</span>
        </div>
      )}
      {req.requester_phone && (
        <div className="flex items-center gap-1.5">
          <Phone className="h-3 w-3 shrink-0 text-gray-400" />
          <a
            href={`tel:${req.requester_phone}`}
            className="font-medium text-violet-700 hover:underline"
          >
            {req.requester_phone}
          </a>
        </div>
      )}
    </div>

    {req.message && (
      <div className="mt-2 rounded-lg bg-violet-50 px-2.5 py-1.5 text-[11px] italic text-gray-600">
        "{req.message}"
      </div>
    )}

    <div className="mt-2 flex items-center gap-2">
      <button
        onClick={() => accept(req.id)}
        disabled={actingId === req.id}
        className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {actingId === req.id ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <UserCheck className="h-3 w-3" />
        )}
        Approve
      </button>
      <button
        onClick={() => decline(req.id)}
        disabled={actingId === req.id}
        className="inline-flex items-center gap-1 rounded-lg bg-gray-50 px-3 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        <UserX className="h-3 w-3" />
        Decline
      </button>
    </div>
  </div>
))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}