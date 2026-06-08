"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Loading from "./loading";

import {
  Users,
  Plus,
  Search,
  RotateCw,
  Mail,
  Check,
  X,
  Crown,
  User,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  LogOut,
  Trash2,
  FileText,
  UserPlus,
  Download,
  ArrowUpRight,
  Filter,
  ArrowUp,
  ArrowDown,
  ChevronsUpDown,
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

interface Group {
  id: string;
  name: string;
  role: "admin" | "member";
  members_count: number;
  reports_count: number;
  created_at: string;
}

interface Invite {
  id: string;
  email: string;
  group_name: string;
  created_at: string;
  inviter_email?: string;
  inviter_pharmacy_name?: string;
}

interface Member {
  id: string;
  role: string;
  user_id: string;
  name: string;
  email: string;
  pharmacy_name: string;
}

interface ReportItem {
  id: string;
  name: string;
  created_at: string;
}

type RoleFilter = "all" | "admin" | "member";

type SortKey = "name" | "role" | "created_at" | null;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const ROLE_OPTIONS: { value: RoleFilter; label: string }[] = [
  { value: "all", label: "All Roles" },
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
];

export default function AuditGroupsPage() {
  //
  // SIDEBAR
  //

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [activePanel, setActivePanel] = useState<string | null>(null);

  const router = useRouter();

  //
  // USER
  //

  const [userId, setUserId] = useState("");

  const [pharmacyName, setPharmacyName] = useState("Loading...");

  const [pharmacyEmail, setPharmacyEmail] = useState("");

  //
  // VIEW
  //

  const [activeView, setActiveView] = useState<"groups" | "invites">("groups");

  //
  // GROUPS
  //

  const [groups, setGroups] = useState<Group[]>([]);

  const [loadingGroups, setLoadingGroups] = useState(true);

  //
  // INVITES
  //

  const [invites, setInvites] = useState<Invite[]>([]);

  const [loadingInvites, setLoadingInvites] = useState(true);

  //
  // MEMBERS
  //

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const [groupMembers, setGroupMembers] = useState<Member[]>([]);

  const [membersModal, setMembersModal] = useState(false);

  const [loadingMembers, setLoadingMembers] = useState(false);

  //
  // REPORTS
  //

  const [selectedReportsGroup, setSelectedReportsGroup] =
    useState<Group | null>(null);

  const [groupReports, setGroupReports] = useState<ReportItem[]>([]);

  const [reportsModal, setReportsModal] = useState(false);

  const [reportsShow, setReportsShow] = useState(false);

  const [reportsSearch, setReportsSearch] = useState("");

  //
  // ADD MEMBER (ROW)
  //

  const [inviteModal, setInviteModal] = useState(false);

  const [inviteGroup, setInviteGroup] = useState<Group | null>(null);

  const [rowInviteEmail, setRowInviteEmail] = useState("");

  const [rowSendingInvite, setRowSendingInvite] = useState(false);

  //
  // SEARCH / FILTER / SORT
  //

  const [searchQuery, setSearchQuery] = useState("");

  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  const [roleFilterOpen, setRoleFilterOpen] = useState(false);

  const roleFilterRef = useRef<HTMLDivElement>(null);

  const [sortKey, setSortKey] = useState<SortKey>(null);

  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  //
  // CREATE GROUP MODAL
  //

  const [groupModal, setGroupModal] = useState(false);

  const [groupStep, setGroupStep] = useState(1);

  const [groupName, setGroupName] = useState("");

  const [createdGroupId, setCreatedGroupId] = useState("");

  const [inviteEmail, setInviteEmail] = useState("");

  const [creatingGroup, setCreatingGroup] = useState(false);

  const [sendingInvite, setSendingInvite] = useState(false);

  //
  // LOAD USER
  //

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get("/auth/pharmacy-details");

        const pharmacy =
          res?.data?.pharmacy?.pharmacy_name ||
          localStorage.getItem("pharmacyName") ||
          "Your Pharmacy";

        const email =
          res?.data?.user?.email || localStorage.getItem("userEmail") || "";

        const uid = res?.data?.user?.id || localStorage.getItem("userId") || "";

        setPharmacyName(pharmacy);

        setPharmacyEmail(email);

        setUserId(uid);
      } catch {
        setPharmacyName(
          localStorage.getItem("pharmacyName") || "Your Pharmacy",
        );

        setPharmacyEmail(localStorage.getItem("userEmail") || "");

        setUserId(localStorage.getItem("userId") || "");
      }
    };

    loadUser();
  }, []);

  //
  // CLOSE FILTER ON OUTSIDE CLICK
  //

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        roleFilterRef.current &&
        !roleFilterRef.current.contains(e.target as Node)
      ) {
        setRoleFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  //
  // LOAD GROUPS
  //

  const loadGroups = async (uid: string) => {
    try {
      setLoadingGroups(true);

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/audit-groups/user/${uid}`,
      );

      setGroups(res.data || []);
    } catch (err) {
      console.error(err);

      setGroups([]);
    } finally {
      setLoadingGroups(false);
    }
  };

  //
  // LOAD INVITES
  //

  const loadInvites = async (uid: string) => {
    try {
      setLoadingInvites(true);

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/audit-groups/invites/${uid}`,
      );

      setInvites(res.data || []);
    } catch (err) {
      console.error(err);

      setInvites([]);
    } finally {
      setLoadingInvites(false);
    }
  };

  //
  // INITIAL LOAD
  //

  useEffect(() => {
    if (!userId) return;

    loadGroups(userId);

    loadInvites(userId);
  }, [userId]);

  //
  // CREATE GROUP
  //

  const handleCreateGroup = async () => {
    try {
      if (!groupName.trim()) {
        return toast.error("Please enter group name");
      }

      setCreatingGroup(true);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/audit-groups`,
        {
          name: groupName,
          created_by: userId,
        },
      );

      setCreatedGroupId(res.data.group.id);

      await loadGroups(userId);

      setGroupStep(2);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create group");
    } finally {
      setCreatingGroup(false);
    }
  };

  //
  // SEND INVITE (CREATE FLOW)
  //

  const handleInvite = async () => {
    try {
      if (!inviteEmail.trim()) {
        return toast.error("Please enter pharmacy email");
      }

      setSendingInvite(true);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/audit-groups/invite`,
        {
          group_id: createdGroupId,
          invited_by: userId,
          email: inviteEmail,
        },
      );

      toast.success("Invite sent successfully");

      setInviteEmail("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send invite");
    } finally {
      setSendingInvite(false);
    }
  };

  //
  // ADD MEMBER FROM ROW
  //

  const openInviteModal = (group: Group) => {
    setInviteGroup(group);

    setRowInviteEmail("");

    setInviteModal(true);
  };

  const closeInviteModal = () => {
    setInviteModal(false);

    setInviteGroup(null);

    setRowInviteEmail("");
  };

  const handleInviteToGroup = async () => {
    if (!rowInviteEmail.trim()) {
      return toast.error("Please enter pharmacy email");
    }

    if (!inviteGroup) return;

    try {
      setRowSendingInvite(true);

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/audit-groups/invite`,
        {
          group_id: inviteGroup.id,
          invited_by: userId,
          email: rowInviteEmail,
        },
      );

      toast.success("Invite sent successfully");

      closeInviteModal();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send invite");
    } finally {
      setRowSendingInvite(false);
    }
  };

  //
  // ACCEPT INVITE
  //

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/audit-groups/invite/accept`,
        {
          invite_id: inviteId,
          user_id: userId,
        },
      );

      toast.success("Invite accepted");

      loadGroups(userId);

      loadInvites(userId);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to accept invite");
    }
  };

  //
  // LOAD MEMBERS
  //

  const openMembers = async (group: Group) => {
    try {
      setSelectedGroup(group);

      setMembersModal(true);

      setLoadingMembers(true);

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/audit-groups/${group.id}/members`,
      );

      setGroupMembers(res.data || []);
    } catch (err) {
      console.error(err);

      setGroupMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  };

  //
  // OPEN REPORTS DRAWER — real reports from the group-reports API
  //

  const openReports = async (group: Group) => {
    setSelectedReportsGroup(group);
    setGroupReports([]);
    setReportsSearch("");
    setReportsModal(true);
    setTimeout(() => setReportsShow(true), 10);

    try {
      const res = await api.get(
        `/api/inventory-view/groups/${group.id}/reports`,
      );
      const reports: ReportItem[] = (res.data || []).map((r: any) => ({
        id: r.id,
        name: r.label || r.pharmacy_name,
        created_at: r.created_at,
      }));
      setGroupReports(reports);
    } catch (err) {
      console.error("Failed to load group reports:", err);
      setGroupReports([]);
    }
  };

  const closeReports = () => {
    setReportsShow(false);

    setReportsSearch("");

    setTimeout(() => {
      setReportsModal(false);
    }, 300);
  };

  //
  // OPEN A SINGLE REPORT — full report page
  //

  const handleOpenReport = (report: ReportItem) => {
    if (!selectedReportsGroup) return;
    router.push(`/group-reports/${selectedReportsGroup.id}/${report.id}`);
  };

  //
  // DOWNLOAD A REPORT — fetch the merged report and export CSV
  //

  const handleDownloadReport = async (report: ReportItem) => {
    if (!selectedReportsGroup) return;
    try {
      const res = await api.get(
        `/api/inventory-view/groups/${selectedReportsGroup.id}/reports/${report.id}`,
      );
      const pharmacies: string[] = res.data?.pharmacies || [];
      const rows: any[] = res.data?.rows || [];
      const header = ["Rank", "NDC", "Drug Name", "Pkg Size", ...pharmacies];
      const csv = [
        header.join(","),
        ...rows.map((r, idx) =>
          [
            r.rank ?? idx + 1,
            r.ndc,
            r.drug_name,
            r.package_size,
            ...pharmacies.map((ph) => r.values?.[ph]),
          ]
            .map((v) => JSON.stringify(v ?? ""))
            .join(","),
        ),
      ].join("\n");
      const safeName = (report.name || "report")
        .replace(/[^a-z0-9]+/gi, "_")
        .toLowerCase();
      const a = Object.assign(document.createElement("a"), {
        href: URL.createObjectURL(new Blob([csv], { type: "text/csv" })),
        download: `${safeName}.csv`,
      });
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Failed to download report");
    }
  };

  //
  // REMOVE MEMBER
  //

  const handleRemoveMember = async (groupId: string, memberUserId: string) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/audit-groups/${groupId}/member/${memberUserId}`,
        {
          data: {
            current_user_id: userId,
          },
        },
      );

      toast.success("Member removed successfully");

      if (selectedGroup) {
        await openMembers(selectedGroup);
      }

      loadGroups(userId);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to remove member");
    }
  };

  //
  // LEAVE GROUP
  //

  const handleLeaveGroup = (groupId: string) => {
    toast("Are you sure you want to leave this group?", {
      action: {
        label: "Leave",
        onClick: async () => {
          try {
            await axios.delete(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/audit-groups/${groupId}/leave/${userId}`,
            );

            toast.success("Left group successfully");

            setMembersModal(false);

            loadGroups(userId);
          } catch (err: any) {
            toast.error(
              err?.response?.data?.message || "Failed to leave group",
            );
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  //
  // DELETE GROUP
  //

  const handleDeleteGroup = (groupId: string) => {
    toast("Are you sure you want to delete this group?", {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await axios.delete(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/audit-groups/${groupId}`,
              {
                data: {
                  current_user_id: localStorage.getItem("userId") || "",
                },
              },
            );

            toast.success("Group deleted successfully");

            setMembersModal(false);

            loadGroups(userId);
          } catch (err: any) {
            toast.error(
              err?.response?.data?.message || "Failed to delete group",
            );
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  //
  // CLOSE GROUP MODAL
  //

  const closeGroupModal = () => {
    setGroupModal(false);

    setGroupStep(1);

    setGroupName("");

    setCreatedGroupId("");

    setInviteEmail("");
  };

  //
  // SORT TOGGLE
  //

  const toggleSort = (key: Exclude<SortKey, null>) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  //
  // SEARCH + ROLE FILTER
  //

  const filteredGroups = groups.filter((g) => {
    const matchesSearch = g.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === "all" || g.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  //
  // SORT
  //

  const sortedGroups = [...filteredGroups].sort((a, b) => {
    if (!sortKey) return 0;

    let av: string | number = "";
    let bv: string | number = "";

    if (sortKey === "name") {
      av = a.name.toLowerCase();
      bv = b.name.toLowerCase();
    } else if (sortKey === "role") {
      av = a.role;
      bv = b.role;
    } else if (sortKey === "created_at") {
      av = new Date(a.created_at).getTime();
      bv = new Date(b.created_at).getTime();
    }

    if (av < bv) return sortDir === "asc" ? -1 : 1;
    if (av > bv) return sortDir === "asc" ? 1 : -1;
    return 0;
  });

  const filteredReports = groupReports.filter((r) =>
    r.name.toLowerCase().includes(reportsSearch.toLowerCase()),
  );

  const roleLabel =
    ROLE_OPTIONS.find((o) => o.value === roleFilter)?.label || "All Roles";

  //
  // FORMAT DATE (short)
  //

  const formatDate = (d?: string | null) => {
    const m = String(d ?? "")
      .slice(0, 10)
      .match(/^(\d{4})-(\d{2})-(\d{2})$/);

    return m ? `${m[2]}/${m[3]}/${m[1]}` : "-";
  };

  //
  // FORMAT DATE (long, e.g. "May 12, 2026")
  //

  const formatLongDate = (d?: string | null) => {
    const dt = new Date(String(d ?? ""));

    if (isNaN(dt.getTime())) return "-";

    return `${MONTHS[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()}`;
  };

  //
  // SORT ICON
  //

  const SortIcon = ({ column }: { column: Exclude<SortKey, null> }) => {
    if (sortKey !== column) {
      return (
        <ChevronsUpDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-400 transition-colors" />
      );
    }

    return sortDir === "asc" ? (
      <ArrowUp className="w-3.5 h-3.5 text-slate-700" />
    ) : (
      <ArrowDown className="w-3.5 h-3.5 text-slate-700" />
    );
  };

  return (
    <ProtectedRoute role="user">
      <Suspense fallback={<Loading />}>
        <div className="flex h-screen bg-slate-50">
          <Sidebar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            activePanel={activePanel}
            setActivePanel={setActivePanel}
          />

          <main className="flex-1 overflow-auto">
            <div className="bg-white border-b border-slate-200">
              <div className="px-8 pt-8 pb-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h1 className="text-[22px] font-bold tracking-tight text-slate-900">
                        GROUP INVENTORY REPORTS
                      </h1>

                      <button
                        onClick={() => {
                          loadGroups(userId);

                          loadInvites(userId);
                        }}
                        title="Refresh"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm text-slate-500 mt-1.5">
                      <span className="font-semibold text-slate-700">
                        {pharmacyName}
                      </span>

                      {pharmacyEmail ? (
                        <span className="text-slate-400">
                          {" "}
                          · {pharmacyEmail}
                        </span>
                      ) : null}
                    </p>
                  </div>

                  <button
                    onClick={() => setGroupModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold rounded-xl transition-colors shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    Create Group
                  </button>
                </div>
              </div>

              <div className="px-8 pb-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveView("groups")}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      activeView === "groups"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Your Groups ({groups.length})
                  </button>

                  <button
                    onClick={() => setActiveView("invites")}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      activeView === "invites"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    Pending Invites ({invites.length})
                  </button>
                </div>

                {activeView === "groups" && (
                  <div className="flex items-center gap-3">
                    <div className="relative" ref={roleFilterRef}>
                      <button
                        onClick={() => setRoleFilterOpen((o) => !o)}
                        className="inline-flex items-center gap-2 pl-3.5 pr-3 py-2 text-sm font-semibold text-slate-700 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors"
                      >
                        <Filter className="w-4 h-4 text-slate-400" />

                        <span>{roleLabel}</span>

                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                            roleFilterOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {roleFilterOpen && (
                        <div className="absolute left-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/60 z-20 p-1.5">
                          {ROLE_OPTIONS.map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => {
                                setRoleFilter(opt.value);

                                setRoleFilterOpen(false);
                              }}
                              className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                roleFilter === opt.value
                                  ? "bg-slate-900 text-white"
                                  : "text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              <span>{opt.label}</span>

                              {roleFilter === opt.value && (
                                <Check className="w-4 h-4" />
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="relative w-72">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                      <input
                        type="text"
                        placeholder="Search groups..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {activeView === "groups" && (
              <div className="p-8">
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200">
                        <th className="px-5 py-3.5 text-left">
                          <button
                            onClick={() => toggleSort("name")}
                            className="group inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider hover:text-slate-900 transition-colors"
                          >
                            Group Name
                            <SortIcon column="name" />
                          </button>
                        </th>

                        <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Reports
                        </th>

                        <th className="px-5 py-3.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Members
                        </th>

                        <th className="px-5 py-3.5 text-left">
                          <button
                            onClick={() => toggleSort("role")}
                            className="group inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider hover:text-slate-900 transition-colors"
                          >
                            Role
                            <SortIcon column="role" />
                          </button>
                        </th>

                        <th className="px-5 py-3.5 text-left">
                          <button
                            onClick={() => toggleSort("created_at")}
                            className="group inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider hover:text-slate-900 transition-colors"
                          >
                            Created
                            <SortIcon column="created_at" />
                          </button>
                        </th>

                        <th className="px-5 py-3.5 text-right text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {loadingGroups ? (
                        <tr>
                          <td colSpan={6} className="py-20 text-center">
                            <div className="flex justify-center">
                              <div className="w-10 h-10 rounded-full border-2 border-slate-300 border-t-slate-700 animate-spin" />
                            </div>
                          </td>
                        </tr>
                      ) : sortedGroups.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-20 text-center">
                            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />

                            <p className="text-sm text-slate-500">
                              No groups found
                            </p>
                          </td>
                        </tr>
                      ) : (
                        sortedGroups.map((group) => (
                          <tr
                            key={group.id}
                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
                          >
                            <td className="px-5 py-4">
                              <p className="text-sm font-semibold text-slate-900">
                                {group.name}
                              </p>
                            </td>

                            <td className="px-5 py-4">
                              <button
                                onClick={() => openReports(group)}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-sm font-semibold text-slate-700 transition-colors"
                              >
                                <FileText className="w-4 h-4 text-slate-400" />

                                <span>{group.reports_count}</span>
                              </button>
                            </td>

                            <td className="px-5 py-4 text-sm font-medium text-slate-600">
                              {group.members_count}
                            </td>

                            <td className="px-5 py-4">
                              <span
                                className={`capitalize text-[11px] font-bold px-3 py-1 rounded-full ${
                                  group.role === "admin"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {group.role}
                              </span>
                            </td>

                            <td className="px-5 py-4 text-sm text-slate-500">
                              {formatDate(group.created_at)}
                            </td>

                            <td className="px-5 py-4 text-right">
                              <div className="inline-flex items-center gap-2">
                                {group.role === "admin" && (
                                  <button
                                    onClick={() => openInviteModal(group)}
                                    title="Add member"
                                    className="inline-flex items-center justify-center w-9 h-9 border border-slate-200 rounded-xl hover:bg-slate-900 hover:text-white hover:border-slate-900 text-slate-600 transition-colors"
                                  >
                                    <UserPlus className="w-4 h-4" />
                                  </button>
                                )}

                                <button
                                  onClick={() => openMembers(group)}
                                  className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-sm font-semibold text-slate-700 transition-colors"
                                >
                                  <Users className="w-4 h-4" />
                                  Members
                                  <ChevronRight className="w-4 h-4 text-slate-400" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeView === "invites" && (
              <div className="p-8">
                {loadingInvites ? (
                  <div className="flex items-center justify-center py-32">
                    <div className="w-10 h-10 rounded-full border-2 border-slate-300 border-t-slate-700 animate-spin" />
                  </div>
                ) : invites.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-14 text-center">
                    <Mail className="w-12 h-12 text-slate-300 mx-auto mb-4" />

                    <h3 className="text-lg font-bold text-slate-900">
                      No Pending Invites
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      You're all caught up
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {invites.map((invite) => (
                      <div
                        key={invite.id}
                        className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                            <Users className="w-6 h-6 text-slate-500" />
                          </div>

                          <div>
                            <h3 className="text-base font-bold text-slate-900">
                              {invite.group_name}
                            </h3>

                            <p className="text-sm text-slate-500 mt-1">
                              Invited by{" "}
                              <span className="font-semibold text-slate-700">
                                {invite.inviter_pharmacy_name || "Pharmacy"}
                              </span>
                            </p>

                            {invite.inviter_email && (
                              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {invite.inviter_email}
                              </p>
                            )}

                            <p className="text-xs text-slate-400 mt-2">
                              Received on {formatDate(invite.created_at)}
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => handleAcceptInvite(invite.id)}
                          className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors shrink-0"
                        >
                          <Check className="w-4 h-4" />
                          Accept Invite
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {membersModal && selectedGroup && (
              <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {selectedGroup.name}
                      </h2>

                      <p className="text-xs text-slate-500 mt-1">
                        Group members
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {selectedGroup.role === "admin" && (
                        <button
                          onClick={() => openInviteModal(selectedGroup)}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-colors"
                        >
                          <UserPlus className="w-4 h-4" />
                          Add Member
                        </button>
                      )}

                      {selectedGroup.role === "admin" ? (
                        <button
                          onClick={() => handleDeleteGroup(selectedGroup.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Group
                        </button>
                      ) : (
                        <button
                          onClick={() => handleLeaveGroup(selectedGroup.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-sm font-semibold transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Leave Group
                        </button>
                      )}

                      <button
                        onClick={() => setMembersModal(false)}
                        className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {loadingMembers ? (
                      <div className="flex items-center justify-center py-16">
                        <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-slate-700 animate-spin" />
                      </div>
                    ) : groupMembers.length === 0 ? (
                      <div className="text-center py-12">
                        <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />

                        <p className="text-sm text-slate-500">
                          No members found
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {groupMembers.map((member) => (
                          <div
                            key={member.id}
                            className="border border-slate-200 rounded-2xl p-4 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
                                {member.role === "admin" ? (
                                  <Crown className="w-5 h-5 text-amber-500" />
                                ) : (
                                  <User className="w-5 h-5 text-slate-500" />
                                )}
                              </div>

                              <div>
                                <h4 className="text-sm font-bold text-slate-900">
                                  {member.pharmacy_name || member.name}
                                </h4>

                                <p className="text-xs text-slate-500 mt-0.5">
                                  {member.email}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <span
                                className={`capitalize text-[11px] font-bold px-3 py-1 rounded-full ${
                                  member.role === "admin"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {member.role}
                              </span>

                              {selectedGroup.role === "admin" &&
                                member.user_id !== userId && (
                                  <button
                                    onClick={() =>
                                      handleRemoveMember(
                                        selectedGroup.id,
                                        member.user_id,
                                      )
                                    }
                                    className="flex items-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-semibold transition-colors"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    Remove
                                  </button>
                                )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {reportsModal && selectedReportsGroup && (
              <div className="fixed inset-0 z-50">
                <div
                  onClick={closeReports}
                  className={`absolute inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity duration-300 ${
                    reportsShow ? "opacity-100" : "opacity-0"
                  }`}
                />

                <div
                  className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
                    reportsShow ? "translate-x-0" : "translate-x-full"
                  }`}
                >
                  <div className="px-6 pt-6 pb-5 border-b border-slate-100">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2.5">
                          <h2 className="text-xl font-bold tracking-tight text-slate-900">
                            Reports
                          </h2>

                          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 rounded-full px-2.5 py-0.5">
                            {groupReports.length}
                          </span>
                        </div>

                        <p className="text-sm text-slate-500 mt-1 truncate">
                          {selectedReportsGroup.name}
                        </p>
                      </div>

                      <button
                        onClick={closeReports}
                        className="p-2 -mr-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="relative mt-4">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                      <input
                        type="text"
                        placeholder="Search reports..."
                        value={reportsSearch}
                        onChange={(e) => setReportsSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-sm border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto px-6 py-5">
                    {filteredReports.length === 0 ? (
                      <div className="flex flex-col items-center justify-center text-center py-20">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                          <FileText className="w-7 h-7 text-slate-300" />
                        </div>

                        <p className="text-sm font-semibold text-slate-700">
                          {groupReports.length === 0
                            ? "No reports yet"
                            : "No matches found"}
                        </p>

                        <p className="text-xs text-slate-400 mt-1">
                          {groupReports.length === 0
                            ? "Reports shared to this group will appear here"
                            : "Try a different search term"}
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-slate-200 overflow-hidden">
                        {filteredReports.map((report, idx) => (
                          <div
                            key={report.id}
                            className={`group flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors ${
                              idx !== 0 ? "border-t border-slate-100" : ""
                            }`}
                          >
                            <button
                              onClick={() => handleOpenReport(report)}
                              className="flex items-center gap-3.5 flex-1 min-w-0 text-left"
                            >
                              <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-white group-hover:ring-1 group-hover:ring-slate-200 flex items-center justify-center shrink-0 transition-all">
                                <FileText className="w-[18px] h-[18px] text-slate-500" />
                              </div>

                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate">
                                  {report.name}
                                </p>

                                <p className="text-xs text-slate-400 mt-0.5">
                                  {formatLongDate(report.created_at)}
                                </p>
                              </div>
                            </button>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="hidden sm:inline-flex text-[10px] font-bold text-slate-400 border border-slate-200 rounded-md px-1.5 py-0.5 uppercase tracking-wider">
                                CSV
                              </span>

                              <button
                                onClick={() => handleDownloadReport(report)}
                                title="Download"
                                className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                              >
                                <Download className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleOpenReport(report)}
                                title="Open"
                                className="w-8 h-8 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                              >
                                <ArrowUpRight className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {inviteModal && inviteGroup && (
              <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        Add Member
                      </h2>

                      <p className="text-xs text-slate-500 mt-1">
                        Invite a pharmacy to{" "}
                        <span className="font-semibold text-slate-700">
                          {inviteGroup.name}
                        </span>
                      </p>
                    </div>

                    <button
                      onClick={closeInviteModal}
                      className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Pharmacy Email
                    </label>

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                      <input
                        type="email"
                        placeholder="Enter pharmacy email"
                        value={rowInviteEmail}
                        onChange={(e) => setRowInviteEmail(e.target.value)}
                        className="w-full border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                      />
                    </div>

                    <button
                      onClick={handleInviteToGroup}
                      disabled={rowSendingInvite}
                      className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl py-3 text-sm font-semibold transition-colors"
                    >
                      {rowSendingInvite ? "Sending..." : "Send Invite"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {groupModal && (
              <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        {groupStep === 1 ? "Create Group" : "Invite Members"}
                      </h2>

                      <p className="text-xs text-slate-500 mt-1">
                        {groupStep === 1
                          ? "Create a new audit sharing group"
                          : "Invite pharmacies by email"}
                      </p>
                    </div>

                    <button
                      onClick={closeGroupModal}
                      className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6">
                    {groupStep === 1 && (
                      <>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Group Name
                        </label>

                        <input
                          type="text"
                          placeholder="Enter group name"
                          value={groupName}
                          onChange={(e) => setGroupName(e.target.value)}
                          className="w-full border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                        />

                        <button
                          onClick={handleCreateGroup}
                          disabled={creatingGroup}
                          className="w-full mt-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
                        >
                          {creatingGroup ? (
                            "Creating..."
                          ) : (
                            <>
                              Next
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </button>
                      </>
                    )}

                    {groupStep === 2 && (
                      <>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                          Pharmacy Email
                        </label>

                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                          <input
                            type="email"
                            placeholder="Enter pharmacy email"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            className="w-full border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
                          />
                        </div>

                        <button
                          onClick={handleInvite}
                          disabled={sendingInvite}
                          className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl py-3 text-sm font-semibold transition-colors"
                        >
                          {sendingInvite ? "Sending..." : "Send Invite"}
                        </button>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                          <button
                            onClick={closeGroupModal}
                            className="border border-slate-200 rounded-2xl py-3 text-sm font-semibold hover:bg-slate-50 transition-colors"
                          >
                            Skip
                          </button>

                          <button
                            onClick={closeGroupModal}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-3 text-sm font-semibold transition-colors"
                          >
                            Finish
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </Suspense>
    </ProtectedRoute>
  );
}
