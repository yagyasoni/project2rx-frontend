"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Bell,
  CheckCheck,
  ShieldAlert,
  Megaphone,
  Sparkles,
  Info,
  Inbox,
  Pin,
  ChevronDown,
  Smile,
  MessageSquare,
  Send,
  X,
  Lock,
  MapPin,
} from "lucide-react";
import { containsProfanity } from "@/lib/profanityFilter";
import api from "@/lib/api";
import Sidebar from "@/components/Sidebar";
import axios from "axios";
import { useRouter } from "next/navigation";

/* ────────────────────────────────────────────────────────────────────────── */
/*  TYPES                                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

type Category = "system" | "audit" | "announcement" | "alert" | "update";
type LocationFilter = "all" | "new_jersey" | "new_york";

type Reaction = { emoji: string; count: number };

type Notification = {
  id: string;
  title?: string;
  body: string;
  sender_name: string;
  category: Category;
  pinned?: boolean;
  created_at: string;
  read_at: string | null;
  reactions: Reaction[];
  user_reaction?: string | null;
  user_response?: string | null;
  comments_count?: number;
  chat_enabled?: boolean;
  location?: string;
};

type Comment = {
  id: string;
  message: string;
  sender_type: "client" | "admin";
  created_at: string;
  user_name?: string;
  pharmacy_name?: string;
};

/* ────────────────────────────────────────────────────────────────────────── */
/*  CONSTANTS                                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

const REACTION_TYPES = [
  { type: "Insightful", emoji: "💡" },
  { type: "Helpful", emoji: "🙌" },
  { type: "Useful", emoji: "✅" },
  { type: "Forward Thinking", emoji: "🚀" },
];

const RESPONSE_OPTIONS = [
  { value: "need_info", label: "Need more info", icon: "❓" },
  { value: "working", label: "Working", icon: "✔️" },
  { value: "not_working", label: "Not working", icon: "❌" },
  { value: "acknowledged", label: "Acknowledge", icon: "✅" },
];

const CATEGORY_META: Record<
  Category,
  { label: string; Icon: typeof Info; text: string; bg: string }
> = {
  system: {
    label: "System",
    Icon: Info,
    text: "text-blue-700",
    bg: "bg-blue-50",
  },
  audit: {
    label: "Audit",
    Icon: ShieldAlert,
    text: "text-rose-700",
    bg: "bg-rose-50",
  },
  announcement: {
    label: "Announcement",
    Icon: Megaphone,
    text: "text-purple-700",
    bg: "bg-purple-50",
  },
  alert: {
    label: "Alert",
    Icon: ShieldAlert,
    text: "text-red-700",
    bg: "bg-red-50",
  },
  update: {
    label: "Update",
    Icon: Sparkles,
    text: "text-emerald-700",
    bg: "bg-emerald-50",
  },
};

const LOCATION_TABS: {
  value: LocationFilter;
  label: string;
  matchValues: string[];
}[] = [
  { value: "all", label: "All", matchValues: [] },
  { value: "new_jersey", label: "New Jersey", matchValues: ["New Jersey"] },
  { value: "new_york", label: "New York", matchValues: ["New York"] },
];

/* ────────────────────────────────────────────────────────────────────────── */
/*  HELPERS                                                                   */
/* ────────────────────────────────────────────────────────────────────────── */

const READ_IDS_KEY = "notif_read_ids";

function getReadIds(): Set<string> {
  try {
    const raw = localStorage.getItem(READ_IDS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveReadIds(ids: Set<string>) {
  try {
    localStorage.setItem(READ_IDS_KEY, JSON.stringify([...ids]));
  } catch {}
}

function timeAgo(date: string): string {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function groupByDate(items: Notification[]) {
  const now = new Date();
  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const yesterday = today - 86400000;
  const weekAgo = today - 7 * 86400000;

  const groups: Record<string, Notification[]> = {};
  items.forEach((n) => {
    const d = new Date(n.created_at).getTime();
    let key: string;
    if (d >= today) key = "Today";
    else if (d >= yesterday) key = "Yesterday";
    else if (d >= weekAgo) key = "This week";
    else key = "Earlier";
    (groups[key] ||= []).push(n);
  });
  return groups;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((s) => s.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function normalizeBodyHtml(raw: string | null | undefined): string {
  if (!raw) return "";
  let html = String(raw);
  while (
    /&(amp|lt|gt|quot|#39|nbsp);/.test(html) &&
    !/<[a-z][^>]*>/i.test(html)
  ) {
    html = html
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ");
  }
  return html;
}

function mapPostToNotification(post: any, readIds: Set<string>): Notification {
  const rawCat = (post.category || "announcement").toLowerCase();
  const validCats = ["system", "audit", "announcement", "alert", "update"];
  const category = validCats.includes(rawCat) ? rawCat : "announcement";

  return {
    id: post.id,
    title: post.title,
    body: normalizeBodyHtml(post.content),
    category: category as Category,
    sender_name: "Lead Support Team",
    pinned: false,
    created_at: post.created_at,
    read_at: readIds.has(post.id)
      ? new Date(post.created_at).toISOString()
      : null,
    reactions: [],
    user_reaction: null,
    user_response: null,
    comments_count: Number(post.responses) || 0,
    chat_enabled: post.chat_enabled !== false,
    location: post.location || "All",
  };
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  LOCATION FILTER HELPER                                                    */
/* ────────────────────────────────────────────────────────────────────────── */

function filterByLocation(
  notifications: Notification[],
  filter: LocationFilter,
): Notification[] {
  if (filter === "all") return notifications;
  const tab = LOCATION_TABS.find((t) => t.value === filter);
  if (!tab) return notifications;
  return notifications.filter((n) => {
    const loc = (n.location || "All").trim();
    // Show if post location matches selected tab OR if post is "All"
    return loc === "All" || tab.matchValues.includes(loc);
  });
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  MAIN PAGE                                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

export default function NotificationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationFilter, setLocationFilter] = useState<LocationFilter>("all");
  const [reactionPickerFor, setReactionPickerFor] = useState<string | null>(
    null,
  );
  const [responseDropdownFor, setResponseDropdownFor] = useState<string | null>(
    null,
  );
  const [subscription, setSubscription] = useState<any>(null);
  const [subscriptionLoaded, setSubscriptionLoaded] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          setSubscriptionLoaded(true);
          return;
        }

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/subscription/${userId}`,
        );

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

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/pay/subscription/${userId}`,
        );

        setSubscription(res.data.subscription);
      } catch {}
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const readIds = getReadIds();

        const res = await api.get("/post/client/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const posts = Array.isArray(res?.data) ? res.data : [];
        const baseNotifs = posts.map((p: any) =>
          mapPostToNotification(p, readIds),
        );

        const enriched = await Promise.all(
          baseNotifs.map(async (n: Notification) => {
            try {
              const eng = await api.get(`/post/engagement/${n.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              const counts: Record<string, number> = {};
              (eng.data.reactions || []).forEach((r: any) => {
                counts[r.reaction_type] = (counts[r.reaction_type] || 0) + 1;
              });

              const reactions = Object.entries(counts).map(
                ([emoji, count]) => ({ emoji, count }),
              );

              return { ...n, reactions };
            } catch {
              return n;
            }
          }),
        );

        setNotifications(enriched);
      } catch (err) {
        console.error("[Notifications] failed to fetch:", err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Auto-mark as read after 1.5s
  useEffect(() => {
    if (loading) return;
    const unreadIds = notifications.filter((n) => !n.read_at).map((n) => n.id);
    if (unreadIds.length === 0) return;
    const timer = setTimeout(() => markAsRead(unreadIds), 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const markAsRead = useCallback(async (ids: string[]) => {
    const readIds = getReadIds();
    ids.forEach((id) => readIds.add(id));
    saveReadIds(readIds);

    setNotifications((prev) =>
      prev.map((n) =>
        ids.includes(n.id) ? { ...n, read_at: new Date().toISOString() } : n,
      ),
    );

    window.dispatchEvent(new CustomEvent("notifications-updated"));
  }, []);

  const handleMarkAllRead = () => {
    const unread = notifications.filter((n) => !n.read_at).map((n) => n.id);
    if (unread.length) markAsRead(unread);
  };

  const handleReact = useCallback(async (id: string, emoji: string) => {
    setReactionPickerFor(null);
    setNotifications((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;
        const wasSameReaction = n.user_reaction === emoji;
        let reactions = [...n.reactions];

        if (n.user_reaction && !wasSameReaction) {
          reactions = reactions
            .map((r) =>
              r.emoji === n.user_reaction ? { ...r, count: r.count - 1 } : r,
            )
            .filter((r) => r.count > 0);
        }

        if (wasSameReaction) {
          reactions = reactions
            .map((r) => (r.emoji === emoji ? { ...r, count: r.count - 1 } : r))
            .filter((r) => r.count > 0);
          return { ...n, reactions, user_reaction: null };
        }

        const existing = reactions.find((r) => r.emoji === emoji);
        if (existing) {
          reactions = reactions.map((r) =>
            r.emoji === emoji ? { ...r, count: r.count + 1 } : r,
          );
        } else {
          reactions.push({ emoji, count: 1 });
        }
        return { ...n, reactions, user_reaction: emoji };
      }),
    );
    try {
      const token = localStorage.getItem("accessToken");
      const userId =
        localStorage.getItem("userId") ||
        localStorage.getItem("pharmacyId") ||
        "anonymous";

      await api.post(
        "/post/reactions",
        { post_id: id, user_id: userId, reaction_type: emoji },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (err) {
      console.error("[Reaction] failed:", err);
    }
  }, []);

  const handleRespond = useCallback(async (id: string, response: string) => {
    const RESPONSE_LABELS: Record<string, string> = {
      need_info: "Need more info",
      working: "Working",
      not_working: "Not working",
      acknowledged: "Acknowledged",
    };

    const comment = RESPONSE_LABELS[response] || response;

    if (containsProfanity(comment)) {
      alert("Please remove inappropriate language before submitting.");
      return;
    }

    setResponseDropdownFor(null);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, user_response: response } : n)),
    );

    try {
      const token = localStorage.getItem("accessToken");
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      await api.post(
        "/post/responses",
        { post_id: id, user_id: userId, comment },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (err) {
      console.error("[Response] failed:", err);
    }
  }, []);

  /* ─────────────────────────────────────────────────────────────────
     Comments modal
  ───────────────────────────────────────────────────────────────── */

  const [commentsOpenFor, setCommentsOpenFor] = useState<string | null>(null);
  const [commentsChatEnabled, setCommentsChatEnabled] = useState<boolean>(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  const openComments = useCallback(
    async (postId: string, chatEnabled: boolean) => {
      setCommentsOpenFor(postId);
      setCommentsChatEnabled(chatEnabled);
      setCommentsLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const res = await api.get(`/post/chat/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list = (Array.isArray(res.data) ? res.data : []).sort(
          (a: Comment, b: Comment) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        );
        setComments(list);
      } catch (err) {
        console.error("[Comments] failed to load:", err);
        setComments([]);
      } finally {
        setCommentsLoading(false);
      }
    },
    [],
  );

  const closeComments = useCallback(() => {
    setCommentsOpenFor(null);
    setCommentsChatEnabled(true);
    setComments([]);
    setCommentInput("");
  }, []);

  const submitComment = useCallback(async () => {
    if (!commentsOpenFor || !commentInput.trim()) return;

    if (containsProfanity(commentInput)) {
      alert("Your comment contains inappropriate language. Please revise it.");
      return;
    }

    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("You must be logged in to comment.");
      return;
    }

    const commentText = commentInput.trim();
    setCommentInput("");
    setCommentSubmitting(true);

    const tempComment: Comment = {
      id: `temp-${Date.now()}`,
      message: commentText,
      sender_type: "client",
      created_at: new Date().toISOString(),
    };
    setComments((prev) => [...prev, tempComment]);

    try {
      await api.post(
        "/post/chat/client",
        { post_id: commentsOpenFor, user_id: userId, message: commentText },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const res = await api.get(`/post/chat/${commentsOpenFor}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const list = (Array.isArray(res.data) ? res.data : []).sort(
        (a: Comment, b: Comment) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      );
      setComments(list);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === commentsOpenFor
            ? { ...n, comments_count: (n.comments_count || 0) + 1 }
            : n,
        ),
      );
    } catch (err: any) {
      console.error("[Comments] submit failed:", err);
      setComments((prev) => prev.filter((c) => c.id !== tempComment.id));
      alert(err?.response?.data?.message || "Failed to post comment");
    } finally {
      setCommentSubmitting(false);
    }
  }, [commentsOpenFor, commentInput]);

  // Light polling so admin replies appear without manual refresh
  useEffect(() => {
    if (!commentsOpenFor) return;
    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await api.get(`/post/chat/${commentsOpenFor}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const list = (Array.isArray(res.data) ? res.data : []).sort(
          (a: Comment, b: Comment) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
        );
        setComments(list);
      } catch {
        /* silent */
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [commentsOpenFor]);

  useEffect(() => {
    if (!reactionPickerFor && !responseDropdownFor) return;
    const close = () => {
      setReactionPickerFor(null);
      setResponseDropdownFor(null);
    };
    const timer = setTimeout(
      () => document.addEventListener("click", close),
      0,
    );
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", close);
    };
  }, [reactionPickerFor, responseDropdownFor]);

  // Apply location filter
  const visible = filterByLocation(notifications, locationFilter);
  const pinned = visible.filter((n) => n.pinned);
  const groups = groupByDate(visible.filter((n) => !n.pinned));
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  // Count per location tab for badges
  const tabCounts: Record<LocationFilter, number> = {
    all: notifications.length,
    new_jersey: filterByLocation(notifications, "new_jersey").length,
    new_york: filterByLocation(notifications, "new_york").length,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePanel={activePanel}
        setActivePanel={setActivePanel}
      />

      <main className="flex-1 overflow-y-auto bg-gray-50/40">
        {subscriptionLoaded && !subscription?.leads_access && (
          <div className="absolute inset-0 z-[129] backdrop-blur-[5px] bg-white/55 flex items-center justify-center">
            <div className="relative overflow-hidden rounded-2xl border border-rose-200 bg-white/95 shadow-2xl px-8 py-7 min-w-[340px]">
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-rose-200/30 blur-3xl" />

              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 border border-rose-200 shadow-sm mb-4">
                  <Lock className="h-8 w-8 text-rose-600" />
                </div>

                <h3 className="text-[22px] font-extrabold text-slate-900 tracking-tight">
                  Leads Locked
                </h3>

                <p className="mt-2 text-[14px] leading-6 text-slate-500 max-w-[280px]">
                  Upgrade your subscription to unlock advanced group reporting
                  and leads overview.
                </p>

                <button
                  onClick={() => router.push("/settings")}
                  className="mt-5 inline-flex items-center justify-center rounded-xl bg-rose-500 hover:bg-rose-600 transition-colors px-5 py-3 text-[14px] font-bold text-white shadow-lg shadow-rose-500/20"
                >
                  Subscribe to Unlock
                </button>

                <p className="mt-3 text-[11px] font-semibold uppercase tracking-widest text-rose-600">
                  Pro Feature
                </p>
              </div>
            </div>
          </div>
        )}
        {/* HEADER */}
        <div className="sticky top-0 z-10 bg-white/85 backdrop-blur-md border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900">
                  <Bell className="h-5 w-5 text-white" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500 ring-2 ring-white" />
                    </span>
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
                    Notifications
                  </h1>
                  <p className="text-[13px] text-gray-500">
                    {unreadCount > 0
                      ? `${unreadCount} unread ${unreadCount === 1 ? "message" : "messages"}`
                      : "You're all caught up"}
                  </p>
                </div>
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <CheckCheck className="h-4 w-4" />
                  Mark all read
                </button>
              )}
            </div>

            {/* LOCATION TABS */}
            <div className="flex items-center gap-1 mt-5 -mb-px">
              {LOCATION_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setLocationFilter(tab.value)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
                    locationFilter === tab.value
                      ? "text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.value !== "all" && (
                    <MapPin className="h-3 w-3 shrink-0" />
                  )}
                  {tab.label}
                  {locationFilter === tab.value && (
                    <div className="absolute -bottom-px left-0 right-0 h-0.5 bg-gray-900 rounded-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="max-w-3xl mx-auto px-6 py-6">
          {loading ? (
            <SkeletonList />
          ) : visible.length === 0 ? (
            <EmptyState locationFilter={locationFilter} />
          ) : (
            <div className="space-y-8">
              {pinned.length > 0 && (
                <section>
                  <div className="flex items-center gap-1.5 mb-3 px-1">
                    <Pin className="h-3 w-3 text-gray-400" />
                    <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                      Pinned
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {pinned.map((n) => (
                      <NotificationCard
                        key={n.id}
                        n={n}
                        onReact={handleReact}
                        onRespond={handleRespond}
                        onOpenComments={openComments}
                        pickerOpen={reactionPickerFor === n.id}
                        setPicker={setReactionPickerFor}
                        respondOpen={responseDropdownFor === n.id}
                        setRespond={setResponseDropdownFor}
                      />
                    ))}
                  </div>
                </section>
              )}

              {Object.entries(groups).map(([date, items]) => (
                <section key={date}>
                  <h3 className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-3 px-1">
                    {date}
                  </h3>
                  <div className="space-y-3">
                    {items.map((n) => (
                      <NotificationCard
                        key={n.id}
                        n={n}
                        onReact={handleReact}
                        onRespond={handleRespond}
                        onOpenComments={openComments}
                        pickerOpen={reactionPickerFor === n.id}
                        setPicker={setReactionPickerFor}
                        respondOpen={responseDropdownFor === n.id}
                        setRespond={setResponseDropdownFor}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Comments / Chat modal */}
      {commentsOpenFor && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-gray-700" />
                <h3 className="font-semibold text-gray-900">
                  Comments
                  {comments.length > 0 && (
                    <span className="ml-1.5 text-gray-400 font-normal">
                      ({comments.length})
                    </span>
                  )}
                </h3>
              </div>
              <button
                onClick={closeComments}
                className="rounded-md p-1.5 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Body — chat disabled gate */}
            {!commentsChatEnabled ? (
              <div className="flex flex-col items-center justify-center flex-1 py-16 px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 mb-4">
                  <Lock className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  Comments are closed
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  The support team has disabled comments for this post.
                </p>
              </div>
            ) : (
              <>
                {/* Messages list */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                  {commentsLoading ? (
                    <p className="text-center text-xs text-gray-400 py-8">
                      Loading…
                    </p>
                  ) : comments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 mb-3">
                        <MessageSquare className="h-5 w-5 text-gray-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        No messages yet
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Send a message to the support team
                      </p>
                    </div>
                  ) : (
                    comments.map((c) => {
                      const isAdmin = c.sender_type === "admin";
                      const displayName = isAdmin
                        ? "Support Team"
                        : c.pharmacy_name || c.user_name || "You";
                      const avatarInitials = isAdmin
                        ? "ST"
                        : initials(displayName);

                      return (
                        <div key={c.id} className="flex items-end gap-2">
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white text-[10px] font-bold shadow-sm ${
                              isAdmin
                                ? "bg-gradient-to-br from-blue-500 to-blue-700"
                                : "bg-gradient-to-br from-gray-600 to-gray-800"
                            }`}
                          >
                            {avatarInitials}
                          </div>

                          <div className="max-w-[75%] flex flex-col items-start">
                            <span className="text-[10px] font-medium text-gray-400 mb-0.5 px-1">
                              {displayName}
                            </span>
                            <div
                              className={`rounded-2xl rounded-bl-sm px-3.5 py-2 ${
                                isAdmin
                                  ? "bg-blue-50 border border-blue-100"
                                  : "bg-gray-100"
                              }`}
                            >
                              <p
                                className={`text-[13px] leading-relaxed whitespace-pre-wrap break-words ${
                                  isAdmin ? "text-blue-900" : "text-gray-800"
                                }`}
                              >
                                {c.message}
                              </p>
                            </div>
                            <span className="text-[10px] text-gray-400 mt-0.5 px-1">
                              {timeAgo(c.created_at)}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Composer */}
                <div className="border-t border-gray-200 p-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && !commentSubmitting && submitComment()
                    }
                    placeholder="Send a message…"
                    disabled={commentSubmitting}
                    maxLength={500}
                    className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-gray-400 disabled:opacity-50"
                  />
                  <button
                    onClick={submitComment}
                    disabled={!commentInput.trim() || commentSubmitting}
                    className="rounded-full bg-gray-900 px-4 py-2 text-white text-sm font-medium disabled:opacity-40 transition-opacity"
                  >
                    {commentSubmitting ? "Sending…" : "Send"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  NOTIFICATION CARD                                                         */
/* ────────────────────────────────────────────────────────────────────────── */

interface CardProps {
  n: Notification;
  onReact: (id: string, emoji: string) => void;
  onRespond: (id: string, response: string) => void;
  onOpenComments: (id: string, chatEnabled: boolean) => void;
  pickerOpen: boolean;
  setPicker: (id: string | null) => void;
  respondOpen: boolean;
  setRespond: (id: string | null) => void;
}

function NotificationCard({
  n,
  onReact,
  onRespond,
  onOpenComments,
  pickerOpen,
  setPicker,
  respondOpen,
  setRespond,
}: CardProps) {
  const meta = CATEGORY_META[n.category];
  const isUnread = !n.read_at;
  const userResponseMeta = RESPONSE_OPTIONS.find(
    (r) => r.value === n.user_response,
  );

  // Location badge colors
  const locationBadge =
    n.location && n.location !== "All"
      ? n.location === "New Jersey"
        ? {
            bg: "bg-emerald-50",
            text: "text-emerald-700",
            border: "border-emerald-100",
          }
        : n.location === "New York"
          ? {
              bg: "bg-violet-50",
              text: "text-violet-700",
              border: "border-violet-100",
            }
          : null
      : null;

  return (
    <article
      className={`group relative rounded-xl border bg-white transition-all duration-300 ${
        isUnread
          ? "border-gray-200 shadow-sm ring-1 ring-gray-900/[0.02]"
          : "border-gray-200/70 hover:border-gray-200"
      }`}
    >
      {isUnread && (
        <span className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-gray-900" />
      )}

      <div className="px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gray-800 to-gray-900 text-white text-[12px] font-semibold ring-2 ring-white shadow-sm">
            LS
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-900">
                {n.sender_name}
              </span>
              <span className="text-[12px] text-gray-400">
                · {timeAgo(n.created_at)}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${meta.bg} ${meta.text}`}
              >
                <meta.Icon className="h-3 w-3" />
                {meta.label}
              </span>
              {isUnread && (
                <span className="inline-flex items-center gap-1 rounded-md bg-gray-900 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                  New
                </span>
              )}
              {locationBadge && (
                <span
                  className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${locationBadge.bg} ${locationBadge.text} ${locationBadge.border}`}
                >
                  <MapPin className="h-2.5 w-2.5" />
                  {n.location}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 pl-12">
          {n.title && (
            <h4 className="text-[15px] font-semibold text-gray-900 mb-1 leading-snug">
              {n.title}
            </h4>
          )}
          <div
            className="notification-body text-[14px] text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: n.body || "" }}
          />
        </div>

        <div className="mt-4 pl-12 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 flex-wrap">
            {n.reactions.map((r) => {
              const reactionMeta = REACTION_TYPES.find(
                (rt) => rt.type === r.emoji,
              );
              const displayEmoji = reactionMeta?.emoji || "👍";
              const displayLabel = reactionMeta?.type || r.emoji;
              const reacted = n.user_reaction === r.emoji;

              return (
                <button
                  key={r.emoji}
                  onClick={(e) => {
                    e.stopPropagation();
                    onReact(n.id, r.emoji);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-medium transition-all ${
                    reacted
                      ? "border-gray-900 bg-gray-900 text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-[14px] leading-none">
                    {displayEmoji}
                  </span>
                  <span>{displayLabel}</span>
                  <span
                    className={`text-[11px] ${reacted ? "text-gray-300" : "text-gray-500"}`}
                  >
                    {r.count}
                  </span>
                </button>
              );
            })}

            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPicker(pickerOpen ? null : n.id);
                  setRespond(null);
                }}
                className="inline-flex items-center gap-1 rounded-full border border-dashed border-gray-300 px-2 py-0.5 text-[12px] text-gray-500 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-colors"
              >
                <Smile className="h-3 w-3" />
                {n.reactions.length === 0 && "React"}
              </button>

              {pickerOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-full left-0 mb-2 flex items-center gap-1 rounded-xl border border-gray-200 bg-white px-2 py-1.5 shadow-lg z-20 whitespace-nowrap"
                >
                  {REACTION_TYPES.map((r) => (
                    <button
                      key={r.type}
                      onClick={() => onReact(n.id, r.type)}
                      title={r.type}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap shrink-0"
                    >
                      <span className="text-base leading-none">{r.emoji}</span>
                      <span className="text-[12px] font-medium text-gray-700 whitespace-nowrap">
                        {r.type}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenComments(n.id, n.chat_enabled !== false);
              }}
              className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[12px] font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
            >
              {n.chat_enabled === false ? (
                <Lock className="h-3 w-3 text-gray-400" />
              ) : (
                <MessageSquare className="h-3 w-3" />
              )}
              {n.comments_count && n.comments_count > 0
                ? `Comments · ${n.comments_count}`
                : "Comment"}
            </button>

            <div className="relative">
              {userResponseMeta ? (
                <div className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-[12px] font-medium text-emerald-700 border border-emerald-100">
                  <span>{userResponseMeta.icon}</span>
                  <span>{userResponseMeta.label}</span>
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setRespond(respondOpen ? null : n.id);
                    setPicker(null);
                  }}
                  className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-[12px] font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Respond
                  <ChevronDown className="h-3 w-3" />
                </button>
              )}

              {respondOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 bottom-full mb-2 w-52 rounded-lg border border-gray-200 bg-white p-1 shadow-lg z-20"
                >
                  {RESPONSE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => onRespond(n.id, opt.value)}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[13px] text-gray-700 hover:bg-gray-100 transition-colors text-left"
                    >
                      <span className="text-base">{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  SKELETON + EMPTY                                                          */
/* ────────────────────────────────────────────────────────────────────────── */

function SkeletonList() {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-full bg-gray-100 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 rounded bg-gray-100 animate-pulse" />
              <div className="h-3 w-1/4 rounded bg-gray-100 animate-pulse" />
            </div>
          </div>
          <div className="pl-12 mt-4 space-y-2">
            <div className="h-3 w-3/4 rounded bg-gray-100 animate-pulse" />
            <div className="h-3 w-full rounded bg-gray-100 animate-pulse" />
            <div className="h-3 w-5/6 rounded bg-gray-100 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ locationFilter }: { locationFilter: LocationFilter }) {
  const locationLabel =
    locationFilter === "new_jersey"
      ? "New Jersey"
      : locationFilter === "new_york"
        ? "New York"
        : null;

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mb-4">
        <Inbox className="h-7 w-7 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-900">
        {locationLabel
          ? `No notifications for ${locationLabel}`
          : "No notifications yet"}
      </h3>
      <p className="text-sm text-gray-500 mt-1 max-w-xs">
        {locationLabel
          ? `When the team posts an update for ${locationLabel}, it'll show up here.`
          : "When the team posts an update, it'll show up here."}
      </p>
    </div>
  );
}
