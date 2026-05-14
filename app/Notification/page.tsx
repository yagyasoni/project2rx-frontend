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
} from "lucide-react";
import api from "@/lib/api";
import Sidebar from "@/components/Sidebar"; // <- adjust path to match your project

/* ────────────────────────────────────────────────────────────────────────── */
/*  TYPES                                                                     */
/* ────────────────────────────────────────────────────────────────────────── */

type Category = "system" | "audit" | "announcement" | "alert" | "update";

type Reaction = { emoji: string; count: number };

type Notification = {
  id: string;
  title?: string;
  body: string;
  sender_name: string;
  sender_role?: string;
  category: Category;
  pinned?: boolean;
  created_at: string;
  read_at: string | null;
  reactions: Reaction[];
  user_reaction?: string | null;
  user_response?: string | null;
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
  system: { label: "System", Icon: Info, text: "text-blue-700", bg: "bg-blue-50" },
  audit: { label: "Audit", Icon: ShieldAlert, text: "text-amber-700", bg: "bg-amber-50" },
  announcement: { label: "Announcement", Icon: Megaphone, text: "text-purple-700", bg: "bg-purple-50" },
  alert: { label: "Alert", Icon: ShieldAlert, text: "text-red-700", bg: "bg-red-50" },
  update: { label: "Update", Icon: Sparkles, text: "text-emerald-700", bg: "bg-emerald-50" },
};

const DEMO: Notification[] = [
  {
    id: "demo-1",
    title: "New Feature: Inventory Network View",
    body: "We just rolled out the new Inventory View — you can now see real-time stock across every pharmacy in your network 🎉 Check it out from the sidebar and let us know what you think!",
    sender_name: "Fahad Mulla",
    sender_role: "Founder, AuditProRx",
    category: "update",
    pinned: true,
    created_at: new Date().toISOString(),
    read_at: null,
    reactions: [
      { emoji: "🎉", count: 12 },
      { emoji: "👍", count: 8 },
    ],
  },
  {
    id: "demo-2",
    title: "Scheduled maintenance tonight",
    body: "Heads up — we'll be running database upgrades from 2:00 AM to 3:00 AM EST tonight. Brief downtime expected (~5 min). No action needed on your end ⚙️",
    sender_name: "Fahad Mulla",
    sender_role: "Founder, AuditProRx",
    category: "system",
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    read_at: null,
    reactions: [{ emoji: "👀", count: 4 }],
  },
  {
    id: "demo-3",
    title: "Audit deadline reminder",
    body: "Express Scripts SIU audit response is due Friday. Make sure you've uploaded all wholesaler invoices to the audit folder 📋",
    sender_name: "Fahad Mulla",
    sender_role: "Founder, AuditProRx",
    category: "audit",
    created_at: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    read_at: null,
    reactions: [],
  },
];

/* ────────────────────────────────────────────────────────────────────────── */
/*  HELPERS                                                                   */
/* ────────────────────────────────────────────────────────────────────────── */

function timeAgo(date: string): string {
  const diff = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function groupByDate(items: Notification[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
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
  // Decode HTML entities (handles single OR double encoding from backend/JSON paths)
  while (/&(amp|lt|gt|quot|#39|nbsp);/.test(html) && !/<[a-z][^>]*>/i.test(html)) {
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

function mapPostToNotification(post: any): Notification {
  const rawCat = (post.category || "announcement").toLowerCase();
  const validCats = ["system", "audit", "announcement", "alert", "update"];
  const category = validCats.includes(rawCat) ? rawCat : "announcement";

 const reactions =
    post.reactions > 0
      ? [{ emoji: "💡", count: Number(post.reactions) }]
      : [];

  return {
    id: post.id,
    title: post.title,
    body: normalizeBodyHtml(post.content),
    category: category as Category,
    sender_name: "Fahad Mulla",
    sender_role: "Founder, AuditProRx",
    pinned: false,
    created_at: post.created_at,
    read_at: null,
    reactions,
    user_reaction: null,
    user_response: null,
  };
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  MAIN PAGE                                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

export default function NotificationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [reactionPickerFor, setReactionPickerFor] = useState<string | null>(null);
  const [responseDropdownFor, setResponseDropdownFor] = useState<string | null>(null);

  useEffect(() => {
  const load = async () => {
    try {
      const token = localStorage.getItem("accessToken");
     const res = await api.get("/post/client/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const posts = Array.isArray(res?.data) ? res.data : [];
      console.log("[Notifications] fetched", posts.length, "posts", posts);
      setNotifications(posts.map(mapPostToNotification));
    } catch (err) {
      console.error("[Notifications] failed to fetch:", err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };
  load();
}, []);

  useEffect(() => {
    if (loading) return;
    const unreadIds = notifications.filter((n) => !n.read_at).map((n) => n.id);
    if (unreadIds.length === 0) return;
    const timer = setTimeout(() => markAsRead(unreadIds), 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

 const markAsRead = useCallback(async (ids: string[]) => {
  setNotifications((prev) =>
    prev.map((n) =>
      ids.includes(n.id) ? { ...n, read_at: new Date().toISOString() } : n
    )
  );
  // No API call — backend doesn't track per-user reads yet
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
              r.emoji === n.user_reaction ? { ...r, count: r.count - 1 } : r
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
            r.emoji === emoji ? { ...r, count: r.count + 1 } : r
          );
        } else {
          reactions.push({ emoji, count: 1 });
        }
        return { ...n, reactions, user_reaction: emoji };
      })
    );
    try {
  const token = localStorage.getItem("accessToken");
  const userId =
    localStorage.getItem("userId") ||
    localStorage.getItem("pharmacyId") ||
    "anonymous";

  const res = await api.post(
    "/post/reactions",
    {
      post_id: id,
      user_id: userId,
      reaction_type: emoji,
    },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  console.log("[Reaction] saved:", res.data);
} catch (err) {
  console.error("[Reaction] failed:", err);
}
  }, []);

  const handleRespond = useCallback(async (id: string, response: string) => {
  setResponseDropdownFor(null);
  setNotifications((prev) =>
    prev.map((n) => (n.id === id ? { ...n, user_response: response } : n))
  );

  const RESPONSE_LABELS: Record<string, string> = {
    need_info: "Need more info",
    working: "Working",
    not_working: "Not working",
    acknowledged: "Acknowledged",
  };

  try {
    const token = localStorage.getItem("accessToken");
    const userId =
      localStorage.getItem("userId") ||
      localStorage.getItem("pharmacyId") ||
      "anonymous";

    const res = await api.post(
      "/post/responses",
      {
        post_id: id,
        user_id: userId,
        comment: RESPONSE_LABELS[response] || response,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("[Response] saved:", res.data);
  } catch (err) {
    console.error("[Response] failed:", err);
  }
}, []);

  useEffect(() => {
    if (!reactionPickerFor && !responseDropdownFor) return;
    const close = () => {
      setReactionPickerFor(null);
      setResponseDropdownFor(null);
    };
    const timer = setTimeout(() => document.addEventListener("click", close), 0);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", close);
    };
  }, [reactionPickerFor, responseDropdownFor]);

  const visible = filter === "unread" ? notifications.filter((n) => !n.read_at) : notifications;
  const pinned = visible.filter((n) => n.pinned);
  const groups = groupByDate(visible.filter((n) => !n.pinned));
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activePanel={activePanel}
        setActivePanel={setActivePanel}
      />

      <main className="flex-1 overflow-y-auto bg-gray-50/40">
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

            <div className="flex items-center gap-1 mt-5 -mb-px">
              {(["all", "unread"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors capitalize ${
                    filter === t ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {t}
                  {t === "unread" && unreadCount > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-semibold px-1.5 py-0.5 min-w-[18px]">
                      {unreadCount}
                    </span>
                  )}
                  {filter === t && (
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
            <EmptyState filter={filter} />
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
  pickerOpen: boolean;
  setPicker: (id: string | null) => void;
  respondOpen: boolean;
  setRespond: (id: string | null) => void;
}

function NotificationCard({
  n,
  onReact,
  onRespond,
  pickerOpen,
  setPicker,
  respondOpen,
  setRespond,
}: CardProps) {
  const meta = CATEGORY_META[n.category];
  const isUnread = !n.read_at;
  const userResponseMeta = RESPONSE_OPTIONS.find((r) => r.value === n.user_response);

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
            {initials(n.sender_name)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-900">{n.sender_name}</span>
              {n.sender_role && (
                <span className="text-[12px] text-gray-500">· {n.sender_role}</span>
              )}
              <span className="text-[12px] text-gray-400">· {timeAgo(n.created_at)}</span>
            </div>

            <div className="flex items-center gap-2 mt-1">
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
  // r.emoji is actually the reaction type string (e.g. "Useful")
  // Look up the matching emoji from REACTION_TYPES
  const reactionMeta = REACTION_TYPES.find((rt) => rt.type === r.emoji);
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
      <span className="text-[14px] leading-none">{displayEmoji}</span>
      <span>{displayLabel}</span>
      <span className={`text-[11px] ${reacted ? "text-gray-300" : "text-gray-500"}`}>
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

function EmptyState({ filter }: { filter: "all" | "unread" }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 mb-4">
        <Inbox className="h-7 w-7 text-gray-400" />
      </div>
      <h3 className="text-base font-semibold text-gray-900">
        {filter === "unread" ? "No unread messages" : "No notifications yet"}
      </h3>
      <p className="text-sm text-gray-500 mt-1 max-w-xs">
        {filter === "unread"
          ? "You're fully caught up. Take a breather ☕"
          : "When the team posts an update, it'll show up here."}
      </p>
    </div>
  );
}