"use client";

import { useEffect, useMemo, useState, useRef } from "react";

import {
  Search,
  RefreshCw,
  Trash2,
  Newspaper,
  PencilLine,
  Plus,
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link2,
  Heading1,
  Heading2,
  Quote,
  MoreHorizontal,
  Send,
  MessageSquare,
  MessagesSquare,
  TrendingUp,
  CircleDot,
  Bell,
  MessageCircle,
  BellRing,
  Shield,
  Clock3,
  UserStar,
  User,
} from "lucide-react";

import AdminLayout from "@/components/adminLayout";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExt from "@tiptap/extension-link";
import UnderlineExt from "@tiptap/extension-underline";

interface Reaction {
  id: number;
  user: string;
  type: string;
}

interface Response {
  id: number;
  user: string;
  comment: string;
  createdAt: string;
}

// interface Post {
//   id: number;
//   articleId: string;
//   title: string;
//   category: string;
//   status: "Published" | "Draft";
//   location: string;
//   reactions: number;
//   responses: number;
//   views: number;
//   createdAt: string;
//   content: string;
//   reactionsData: Reaction[];
//   responsesData: Response[];

// }

interface Post {
  id: number;
  articleId: string;
  title: string;
  category: string;
  status: "Published" | "Draft";
  location: string;

  reactions: number;
  responses: number;
  views: number;

  unreadMessages: number;

  createdAt: string;
  content: string;

  reactionsData: Reaction[];
  responsesData: Response[];

  chatEnabled: boolean;
}

// interface ChatMessage {
//   id: string;
//   message: string;
//   sender_type: "client" | "admin";
//   created_at: string;
//   is_read: boolean;
// }

interface ChatMessage {
  id: string;
  message: string;
  sender_type: "client" | "admin";
  created_at: string;
  is_read: boolean;

  user_name?: string;
  pharmacy_name?: string;
}

export default function PublishingPage() {
  // const editorRef = useRef<HTMLDivElement>(null);

  const [posts, setPosts] = useState<Post[]>([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [postStatus, setPostStatus] = useState<"Published" | "Draft">(
    "Published",
  );

  const [view, setView] = useState<
    "table" | "create" | "view" | "edit" | "engagement" | "chat"
  >("table");

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("New York");
  const [locationFilter, setLocationFilter] = useState("All");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const [adminMessage, setAdminMessage] = useState("");
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExt,
      LinkExt.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
    ],

    content: "",

    editorProps: {
      attributes: {
        class:
          "min-h-[400px] outline-none prose prose-neutral dark:prose-invert max-w-none text-sm leading-7",
      },
    },
  });

  const filteredPosts = useMemo(() => {
    let rows = posts;

    if (status !== "all") {
      rows = rows.filter(
        (p) => p.status.toLowerCase() === status.toLowerCase(),
      );
    }

    if (locationFilter !== "All") {
      rows = rows.filter(
        (p) => p.location.toLowerCase() === locationFilter.toLowerCase(),
      );
    }

    if (search.trim()) {
      rows = rows.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return rows;
  }, [posts, search, status, locationFilter]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/post/posts`,
      );

      const formatted = res.data.map((post: any) => ({
        id: post.id,

        articleId: post.article_id,

        title: post.title,

        category: post.category,

        status: post.status,

        location: post.location || "All",

        reactions: post.reactions || 0,

        responses: post.responses || 0,

        views: post.views || 0,

        unreadMessages: post.unread_messages || 0,

        chatEnabled: post.chat_enabled || false,

        createdAt: new Date(post.created_at).toLocaleDateString(),

        content: post.content,

        reactionsData: [],

        responsesData: [],
      }));

      setPosts(formatted);
    } catch (err) {
      console.error("Fetch posts error:", err);
    }
  };

  // =========================================================
  // FETCH ENGAGEMENT
  // =========================================================

  const fetchEngagement = async (postId: string) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/post/engagement/${postId}`,
      );

      const reactionsData = res.data.reactions.map((r: any) => ({
        id: r.id,
        user: r.user_name,
        type: r.reaction_type,
      }));

      const responsesData = res.data.responses.map((c: any) => ({
        id: c.id,
        user: c.user_name,
        comment: c.comment,
        createdAt: new Date(c.created_at).toLocaleDateString(),
      }));

      setSelectedPost((prev: any) => ({
        ...prev,
        reactionsData,
        responsesData,
      }));
    } catch (err) {
      console.error("Fetch engagement error:", err);
    }
  };

  const fetchChat = async (postId: string) => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/post/chat/${postId}`,
      );

      setChatMessages(res.data);

      await fetchPosts();
    } catch (err) {
      console.error("Fetch chat error:", err);
    }
  };

  const sendAdminMessage = async () => {
    try {
      if (!selectedPost || !adminMessage.trim()) return;

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/post/chat/admin`,
        {
          post_id: selectedPost.id,
          message: adminMessage,
        },
      );

      setAdminMessage("");

      await fetchChat(selectedPost.id.toString());
    } catch (err) {
      console.error("Send admin message error:", err);
    }
  };

  const toggleChatStatus = async (postId: number, currentStatus: boolean) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/post/posts/${postId}/chat-toggle`,
        {
          chat_enabled: !currentStatus,
        },
      );

      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                chatEnabled: !currentStatus,
              }
            : post,
        ),
      );

      if (selectedPost?.id === postId) {
        setSelectedPost({
          ...selectedPost,
          chatEnabled: !currentStatus,
        });
      }
    } catch (err) {
      console.error("Toggle chat error:", err);
    }
  };

  // =========================================================
  // CREATE POST
  // =========================================================

  const createPost = async () => {
    try {
      // if (!title || !editorRef.current?.innerHTML) return;
      if (!title || !editor?.getHTML()) return;

      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/post/posts`, {
        title,
        category: category || "General",
        content: editor?.getHTML(),
        status: postStatus,
        location,
      });

      setTitle("");
      setCategory("");
      setPostStatus("Published");
      editor?.commands.setContent("");

      await fetchPosts();
      setView("table");
    } catch (err: any) {
      console.error("Create post error:", err);
      alert(err?.response?.data?.message || "Failed to create post.");
    }
  };

  // =========================================================
  // UPDATE POST
  // =========================================================

  const updatePost = async () => {
    try {
      if (!selectedPost) return;

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/post/posts/${selectedPost.id}`,
        {
          title,
          category,
          content: editor?.getHTML(),
          status: postStatus,
          location,
        },
      );

      await fetchPosts();
      setView("table");
    } catch (err: any) {
      console.error("Update post error:", err);
      alert(err?.response?.data?.message || "Failed to update post.");
    }
  };

  // =========================================================
  // DELETE POST
  // =========================================================

  const deletePost = async (id: number) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/post/posts/${id}`,
      );

      await fetchPosts();
    } catch (err) {
      console.error("Delete post error:", err);
    }
  };

  const formatChatTime = (dateString: string) => {
    const date = new Date(dateString);

    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const isYesterday = date.toDateString() === yesterday.toDateString();

    const time = date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    if (isToday) {
      return `Today • ${time}`;
    }

    if (isYesterday) {
      return `Yesterday • ${time}`;
    }

    return `${date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
    })} • ${time}`;
  };

  const getInitials = (name?: string) => {
    if (!name) return "A";

    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // =========================================================
  // REFRESH POSTS
  // =========================================================

  const refreshPosts = async () => {
    await fetchPosts();

    setSearch("");
    setStatus("all");
    setLocationFilter("All");
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-background">
        <div className="max-w-[1400px] mx-auto px-6 py-0">
          <div className="space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  LEAD PUBLISHING MANAGEMENT
                </h1>

                <p className="text-sm text-muted-foreground mt-1">
                  Create and manage platform publishing content
                </p>
              </div>

              {view === "table" && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refreshPosts}
                    className="gap-1.5 text-xs font-semibold"
                  >
                    <RefreshCw size={13} />
                    Refresh
                  </Button>

                  <Button
                    size="sm"
                    onClick={() => {
                      setTitle("");
                      setCategory("");
                      setPostStatus("Published");
                      editor?.commands.setContent("");
                      setView("create");
                    }}
                    className="gap-1.5 text-xs font-semibold"
                  >
                    <Plus size={13} />
                    Create Post
                  </Button>
                </div>
              )}
            </div>

            {/* ANALYTICS */}
            {view === "table" && (
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
                  <TrendingUp size={15} className="text-blue-500" />

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Total Views
                    </p>

                    <p className="text-sm font-semibold">
                      {posts.reduce((acc, post) => acc + post.views, 0)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
                  <CircleDot size={15} className="text-emerald-500" />

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Engagement
                    </p>

                    <p className="text-sm font-semibold">
                      {posts.reduce((acc, post) => acc + post.reactions, 0)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
                  <MessagesSquare size={15} className="text-violet-500" />

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Responses
                    </p>

                    <p className="text-sm font-semibold">
                      {posts.reduce((acc, post) => acc + post.responses, 0)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {view === "chat" && selectedPost && (
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setView("table")}
                    >
                      <ArrowLeft size={16} />
                    </Button>

                    <div>
                      <h2 className="text-lg font-semibold">Admin Chat</h2>

                      {/* <p className="text-xs text-muted-foreground mt-1">
                        {selectedPost.title}
                      </p> */}
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-xs text-muted-foreground">
                          {selectedPost.title}
                        </p>

                        {!selectedPost.chatEnabled && (
                          <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-500">
                            Chat Disabled
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedPost.unreadMessages > 0 && (
                    <div className="flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-500">
                      <BellRing size={13} />
                      {selectedPost.unreadMessages} unread
                    </div>
                  )}
                </div>

                {/* <div className="h-[500px] overflow-y-auto p-5 space-y-4 bg-muted/20">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender_type === "admin"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-3 ${
                          msg.sender_type === "admin"
                            ? "bg-primary text-primary-foreground"
                            : "bg-background border border-border"
                        }`}
                      >
                        {msg.sender_type === "client" && (
                          <p className="mb-1 text-[11px] font-semibold text-blue-500">
                            {msg.pharmacy_name || msg.user_name || "Client"}
                          </p>
                        )}

                        <p className="text-sm leading-6">{msg.message}</p>

                        <p
                          className={`mt-2 text-[10px] ${
                            msg.sender_type === "admin"
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {new Date(msg.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div> */}

                {/* <div className="h-[500px] overflow-y-auto bg-muted/20 p-5">
                  <div className="space-y-5">
                    {chatMessages.map((msg) => {
                      const isAdmin = msg.sender_type === "admin";

                      const displayName = isAdmin
                        ? "Admin Team"
                        : msg.pharmacy_name || msg.user_name || "Client";

                      return (
                        <div
                          key={msg.id}
                          className={`flex items-end gap-3 ${
                            isAdmin ? "justify-end" : "justify-start"
                          }`}
                        >
                          {!isAdmin && (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background shadow-sm">
                              <User size={16} className="text-blue-500" />
                            </div>
                          )}

                          <div
                            className={`max-w-[72%] rounded-2xl px-4 py-3 shadow-sm ${
                              isAdmin
                                ? "rounded-br-md bg-primary text-primary-foreground"
                                : "rounded-bl-md border border-border bg-background"
                            }`}
                          >
                            <div className="mb-2 flex items-center gap-2">
                              <div
                                className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                                  isAdmin
                                    ? "bg-primary-foreground/20 text-primary-foreground"
                                    : "bg-blue-500/10 text-blue-600"
                                }`}
                              >
                                {isAdmin ? (
                                  <Shield size={12} />
                                ) : (
                                  getInitials(displayName)
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <p
                                  className={`text-xs font-semibold ${
                                    isAdmin
                                      ? "text-primary-foreground"
                                      : "text-foreground"
                                  }`}
                                >
                                  {displayName}
                                </p>

                                <span
                                  className={`rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                                    isAdmin
                                      ? "bg-primary-foreground/15 text-primary-foreground/80"
                                      : "bg-blue-500/10 text-blue-600"
                                  }`}
                                >
                                  {isAdmin ? "Admin" : "Client"}
                                </span>
                              </div>
                            </div>

                            <p className="text-sm leading-7 whitespace-pre-wrap">
                              {msg.message}
                            </p>

                            <div
                              className={`mt-3 flex items-center gap-1 text-[11px] ${
                                isAdmin
                                  ? "text-primary-foreground/70"
                                  : "text-muted-foreground"
                              }`}
                            >
                              <Clock3 size={11} />

                              <span>{formatChatTime(msg.created_at)}</span>
                            </div>
                          </div>

                          {isAdmin && (
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                              <Shield size={16} />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div> */}

                <div className="h-[500px] overflow-y-auto bg-muted/10 px-6 py-6">
                  <div className="space-y-6">
                    {chatMessages.map((msg) => {
                      const isAdmin = msg.sender_type === "admin";

                      const displayName = isAdmin
                        ? "Admin"
                        : msg.pharmacy_name || msg.user_name || "Client";

                      return (
                        <div
                          key={msg.id}
                          className={`flex ${
                            isAdmin ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`flex max-w-[78%] items-end gap-3 ${
                              isAdmin ? "flex-row-reverse" : "flex-row"
                            }`}
                          >
                            {/* PROFILE */}
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border shadow-sm ${
                                isAdmin
                                  ? "border-primary/20 bg-primary text-primary-foreground"
                                  : "border-border bg-background text-blue-600"
                              }`}
                            >
                              {isAdmin ? (
                                <UserStar size={14} />
                              ) : (
                                getInitials(displayName)
                              )}
                            </div>

                            {/* MESSAGE */}
                            <div
                              className={`rounded-2xl px-4 py-3 shadow-sm ${
                                isAdmin
                                  ? "rounded-br-md bg-primary text-primary-foreground"
                                  : "rounded-bl-md border border-border bg-background"
                              }`}
                            >
                              {/* TOP */}
                              <div className="mb-2 flex items-center gap-2">
                                <p
                                  className={`text-[12px] font-semibold ${
                                    isAdmin
                                      ? "text-primary-foreground"
                                      : "text-foreground"
                                  }`}
                                >
                                  {displayName}
                                </p>

                                <span
                                  className={`h-1 w-1 rounded-full ${
                                    isAdmin
                                      ? "bg-primary-foreground/50"
                                      : "bg-muted-foreground/50"
                                  }`}
                                />

                                <p
                                  className={`text-[11px] ${
                                    isAdmin
                                      ? "text-primary-foreground/70"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {formatChatTime(msg.created_at)}
                                </p>
                              </div>

                              {/* BODY */}
                              <p className="text-sm leading-7 whitespace-pre-wrap break-words">
                                {msg.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-border p-4">
                  <div className="flex items-center gap-3">
                    <Input
                      placeholder="Reply to client..."
                      value={adminMessage}
                      onChange={(e) => setAdminMessage(e.target.value)}
                    />

                    <Button onClick={sendAdminMessage} className="gap-2">
                      <Send size={14} />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* CREATE / EDIT */}
            {(view === "create" || view === "edit") && (
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setView("table")}
                      className="h-8 w-8"
                    >
                      <ArrowLeft size={16} />
                    </Button>

                    <div>
                      <h2 className="text-sm font-semibold uppercase tracking-wider">
                        {view === "create" ? "Create Post" : "Edit Post"}
                      </h2>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={view === "edit" ? updatePost : createPost}
                    className="gap-1.5 text-xs"
                  >
                    <Send size={13} />
                    Post
                  </Button>
                </div>

                {/* TOOLBAR */}
                {/* TOOLBAR */}
                <div className="flex items-center gap-1 border-b border-border px-4 py-2 flex-wrap bg-muted/30">
                  <ToolBtn
                    editor={editor}
                    Icon={Bold}
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    active={editor?.isActive("bold")}
                  />
                  <ToolBtn
                    editor={editor}
                    Icon={Italic}
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    active={editor?.isActive("italic")}
                  />
                  <ToolBtn
                    editor={editor}
                    Icon={Underline}
                    onClick={() =>
                      editor?.chain().focus().toggleUnderline().run()
                    }
                    active={editor?.isActive("underline")}
                  />
                  <ToolBtn
                    editor={editor}
                    Icon={Heading1}
                    onClick={() =>
                      editor?.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    active={editor?.isActive("heading", { level: 1 })}
                  />
                  <ToolBtn
                    editor={editor}
                    Icon={Heading2}
                    onClick={() =>
                      editor?.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    active={editor?.isActive("heading", { level: 2 })}
                  />
                  <ToolBtn
                    editor={editor}
                    Icon={Quote}
                    onClick={() => {
                      if (!editor) return;
                      const { from, to, empty } = editor.state.selection;
                      if (empty) {
                        editor.chain().focus().insertContent('""').run();
                        editor.commands.setTextSelection(from + 1);
                      } else {
                        const selectedText = editor.state.doc.textBetween(
                          from,
                          to,
                          " ",
                        );
                        editor
                          .chain()
                          .focus()
                          .insertContent(`"${selectedText}"`)
                          .run();
                      }
                    }}
                  />
                  <ToolBtn
                    editor={editor}
                    Icon={List}
                    onClick={() =>
                      editor?.chain().focus().toggleBulletList().run()
                    }
                    active={editor?.isActive("bulletList")}
                  />
                  <ToolBtn
                    editor={editor}
                    Icon={ListOrdered}
                    onClick={() =>
                      editor?.chain().focus().toggleOrderedList().run()
                    }
                    active={editor?.isActive("orderedList")}
                  />
                  <ToolBtn
                    editor={editor}
                    Icon={Link2}
                    active={editor?.isActive("link")}
                    onClick={() => {
                      const previous = editor?.getAttributes("link").href || "";
                      setLinkUrl(previous);
                      setLinkModalOpen(true);
                    }}
                  />
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  <Input
                    placeholder="Post title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-0 shadow-none text-5xl font-semibold px-0 h-auto focus-visible:ring-0"
                  />

                  <div className="flex items-center gap-3 mt-4">
                    <Input
                      placeholder="Category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="max-w-[220px] h-9 text-xs"
                    />

                    <Select
                      value={postStatus}
                      onValueChange={(v) =>
                        setPostStatus(v as "Published" | "Draft")
                      }
                    >
                      <SelectTrigger className="w-[150px] h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="Published">Published</SelectItem>

                        <SelectItem value="Draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      defaultValue={
                        view === "edit" ? selectedPost?.location : "All"
                      }
                      onValueChange={setLocation}
                    >
                      <SelectTrigger className="w-[180px] h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="All">All</SelectItem>
                        <SelectItem value="New Jersey">New Jersey</SelectItem>
                        <SelectItem value="New York">New York</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="mt-6">
                    <EditorContent editor={editor} />
                  </div>
                </div>
              </div>
            )}

            {/* VIEW POST */}
            {view === "view" && selectedPost && (
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setView("table")}
                  >
                    <ArrowLeft size={16} />
                  </Button>

                  <div>
                    <h2 className="text-lg font-semibold">
                      {selectedPost.title}
                    </h2>

                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedPost.articleId} • {selectedPost.category}
                    </p>
                  </div>
                </div>

                <div className="p-6">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: selectedPost.content,
                    }}
                    className="prose prose-neutral dark:prose-invert max-w-none"
                  />
                </div>
              </div>
            )}

            {/* ENGAGEMENT */}
            {view === "engagement" && selectedPost && (
              <div className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setView("table")}
                  >
                    <ArrowLeft size={16} />
                  </Button>

                  <div>
                    <h2 className="text-lg font-semibold">
                      Audience Engagement
                    </h2>

                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedPost.title}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 p-6">
                  {/* REACTIONS */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <CircleDot size={14} className="text-emerald-500" />

                      <h3 className="text-sm font-semibold uppercase tracking-wider">
                        Reactions
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {selectedPost.reactionsData.map((reaction) => (
                        <div
                          key={reaction.id}
                          className="rounded-md border border-border px-4 py-3"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                              {reaction.user}
                            </p>

                            <span className="text-xs text-muted-foreground">
                              {reaction.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* RESPONSES */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <MessagesSquare size={14} className="text-violet-500" />

                      <h3 className="text-sm font-semibold uppercase tracking-wider">
                        Responses
                      </h3>
                    </div>

                    <div className="space-y-3">
                      {selectedPost.responsesData.map((response) => (
                        <div
                          key={response.id}
                          className="rounded-md border border-border px-4 py-3"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                              {response.user}
                            </p>

                            <span className="text-xs text-muted-foreground">
                              {response.createdAt}
                            </span>
                          </div>

                          <p className="mt-2 text-sm text-muted-foreground leading-6">
                            {response.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TABLE */}
            {view === "table" && (
              <>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="relative flex-1 max-w-sm">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />

                    <Input
                      type="text"
                      placeholder="Search posts..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 h-9 text-xs"
                    />
                  </div>

                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-[140px] h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>

                      <SelectItem value="published">Published</SelectItem>

                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={locationFilter}
                    onValueChange={setLocationFilter}
                  >
                    <SelectTrigger className="w-[160px] h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="All">All Locations</SelectItem>

                      <SelectItem value="new york">New York</SelectItem>

                      <SelectItem value="new jersey">New Jersey</SelectItem>
                    </SelectContent>
                  </Select>

                  <span className="text-[11px] text-muted-foreground ml-auto">
                    {filteredPosts.length} / {posts.length} shown
                  </span>
                </div>

                <div className="rounded-lg border border-border overflow-hidden">
                  <div
                    className="overflow-auto"
                    style={{
                      maxHeight: "calc(100vh - 360px)",
                    }}
                  >
                    <table className="min-w-full divide-y divide-border">
                      <thead className="bg-muted/50 sticky top-0 z-10">
                        <tr>
                          <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Article
                          </th>

                          <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Chat
                          </th>

                          <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Chat Toggle
                          </th>

                          <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Status
                          </th>

                          <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Engagement
                          </th>

                          <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Views
                          </th>

                          <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                            Created At
                          </th>

                          <th className="px-3 py-3 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-24">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody className="bg-card divide-y divide-border">
                        {filteredPosts.map((post) => (
                          <tr
                            key={post.id}
                            className="transition-colors hover:bg-muted/40"
                          >
                            <td className="px-3 py-3 min-w-[360px]">
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {post.title}
                                </p>

                                <p className="text-[11px] text-muted-foreground mt-1">
                                  {post.articleId} • {post.category} •{" "}
                                  <span
                                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                                      post.location === "New York"
                                        ? "bg-violet-500/10 text-violet-600"
                                        : post.location === "New Jersey"
                                          ? "bg-emerald-500/10 text-emerald-600"
                                          : "bg-blue-500/10 text-blue-600"
                                    }`}
                                  >
                                    {post.location}
                                  </span>
                                </p>
                              </div>
                            </td>

                            <td className="px-3 py-3">
                              {post.status === "Published" ? (
                                <button
                                  onClick={async () => {
                                    setSelectedPost(post);

                                    await fetchChat(post.id.toString());

                                    setView("chat");
                                  }}
                                  className="relative flex items-center gap-2 rounded-md border border-border px-3 py-1.5 hover:bg-muted/50 transition-colors"
                                >
                                  <MessageCircle
                                    size={14}
                                    className={
                                      post.chatEnabled
                                        ? "text-blue-500"
                                        : "text-muted-foreground"
                                    }
                                  />

                                  <span className="text-xs font-medium">
                                    {post.chatEnabled ? "Open" : "Disabled"}
                                  </span>

                                  {post.unreadMessages > 0 && (
                                    <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                                      {post.unreadMessages}
                                    </span>
                                  )}
                                </button>
                              ) : null}
                            </td>

                            <td className="px-3 py-6 flex justify-center">
                              {post.status === "Published" ? (
                                <>
                                  <Switch
                                    checked={post.chatEnabled}
                                    onCheckedChange={() =>
                                      toggleChatStatus(
                                        post.id,
                                        post.chatEnabled,
                                      )
                                    }
                                    className="scale-90"
                                  />
                                </>
                              ) : null}
                            </td>

                            <td className="px-3 py-3">
                              <span
                                className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                                  post.status === "Published"
                                    ? "bg-emerald-500/10 text-emerald-600"
                                    : "bg-yellow-500/10 text-yellow-600"
                                }`}
                              >
                                {post.status}
                              </span>
                            </td>

                            <td className="px-3 py-3">
                              {post.status === "Published" ? (
                                <button
                                  onClick={async () => {
                                    setSelectedPost(post);

                                    await fetchEngagement(post.id.toString());

                                    setView("engagement");
                                  }}
                                  className="flex items-center gap-4"
                                >
                                  <div className="flex items-center gap-1 text-xs">
                                    <CircleDot
                                      size={13}
                                      className="text-emerald-500"
                                    />

                                    <span>{post.reactions}</span>
                                  </div>

                                  <div className="flex items-center gap-1 text-xs">
                                    <MessagesSquare
                                      size={13}
                                      className="text-violet-500"
                                    />

                                    <span>{post.responses}</span>
                                  </div>
                                </button>
                              ) : null}
                            </td>

                            <td className="px-3 py-3 text-xs text-muted-foreground">
                              {post.status === "Published" ? (
                                <>{post.views}</>
                              ) : null}
                            </td>

                            <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
                              {post.createdAt}
                            </td>

                            <td className="px-3 py-3">
                              <div className="flex justify-center">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                    >
                                      <MoreHorizontal size={15} />
                                    </Button>
                                  </DropdownMenuTrigger>

                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedPost(post);

                                        setView("view");
                                      }}
                                    >
                                      <Newspaper className="mr-2 h-4 w-4" />
                                      View Post
                                    </DropdownMenuItem>

                                    <DropdownMenuItem
                                      onClick={() => {
                                        setSelectedPost(post);
                                        setTitle(post.title);
                                        setCategory(post.category);
                                        setPostStatus(post.status);
                                        setView("edit");
                                        setTimeout(() => {
                                          editor?.commands.setContent(
                                            post.content || "",
                                          );
                                        }, 100);
                                      }}
                                    >
                                      <PencilLine className="mr-2 h-4 w-4" />
                                      Edit Post
                                    </DropdownMenuItem>

                                    {post.status === "Published" && (
                                      <DropdownMenuItem
                                        onClick={async () => {
                                          setSelectedPost(post);

                                          await fetchEngagement(
                                            post.id.toString(),
                                          );

                                          setView("engagement");
                                        }}
                                      >
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        View Reactions
                                      </DropdownMenuItem>
                                    )}

                                    <DropdownMenuItem
                                      onClick={() => deletePost(post.id)}
                                      className="text-red-500"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete Post
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* LINK MODAL */}
      {linkModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setLinkModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md mx-4 rounded-xl bg-card border border-border shadow-2xl"
          >
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-semibold">Insert Link</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Paste a URL to link the selected text
              </p>
            </div>
            <div className="p-5">
              <Input
                autoFocus
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (linkUrl) {
                      editor
                        ?.chain()
                        .focus()
                        .extendMarkRange("link")
                        .setLink({ href: linkUrl })
                        .run();
                    } else {
                      editor
                        ?.chain()
                        .focus()
                        .extendMarkRange("link")
                        .unsetLink()
                        .run();
                    }
                    setLinkUrl("");
                    setLinkModalOpen(false);
                  }
                  if (e.key === "Escape") setLinkModalOpen(false);
                }}
                className="h-10"
              />
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border bg-muted/30 rounded-b-xl">
              {editor?.isActive("link") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    editor
                      ?.chain()
                      .focus()
                      .extendMarkRange("link")
                      .unsetLink()
                      .run();
                    setLinkUrl("");
                    setLinkModalOpen(false);
                  }}
                  className="mr-auto text-red-500 hover:text-red-600"
                >
                  Remove link
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLinkModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!linkUrl}
                onClick={() => {
                  if (!editor) return;

                  const { from, to, empty } = editor.state.selection;

                  if (empty) {
                    // No text selected — insert the URL itself as the link text
                    editor
                      .chain()
                      .focus()
                      .insertContent(`<a href="${linkUrl}">${linkUrl}</a>`)
                      .run();
                  } else {
                    // Text is selected — wrap it as a link
                    editor
                      .chain()
                      .focus()
                      .extendMarkRange("link")
                      .setLink({ href: linkUrl })
                      .run();
                  }

                  setLinkUrl("");
                  setLinkModalOpen(false);
                }}
              >
                Insert link
              </Button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function ToolBtn({
  Icon,
  onClick,
  active,
  editor,
}: {
  Icon: any;
  onClick: () => void;
  active?: boolean;
  editor: Editor | null;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      disabled={!editor}
      className={`h-8 w-8 ${active ? "bg-muted text-foreground" : ""}`}
    >
      <Icon size={15} />
    </Button>
  );
}
