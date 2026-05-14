"use client";

import { useEffect, useMemo, useState } from "react";

import api from "@/lib/api";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExt from "@tiptap/extension-link";
import UnderlineExt from "@tiptap/extension-underline";

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

interface Post {
  id: number;
  articleId: string;
  title: string;
  category: string;
  status: "Published" | "Draft";
  reactions: number;
  responses: number;
  views: number;
  createdAt: string;
  content: string;
  reactionsData: Reaction[];
  responsesData: Response[];
}

export default function PublishingPage() {
const [posts, setPosts] = useState<Post[]>([]);

const [linkModalOpen, setLinkModalOpen] = useState(false);
const [linkUrl, setLinkUrl] = useState("");

const editor = useEditor({
  extensions: [
    StarterKit.configure({
      // Disable extensions that might also exist as separate packages
      // (key names depend on StarterKit version — extras are simply ignored)
      link: false,
      underline: false,
    } as any),
    UnderlineExt,
    LinkExt.configure({
      openOnClick: false,
      autolink: true,
      HTMLAttributes: {
        class: "text-blue-600 underline",
        rel: "noopener noreferrer",
        target: "_blank",
      },
    }),
  ],
  content: "",
  editorProps: {
    attributes: {
      class:
        "tiptap-editor min-h-[500px] rounded-md border border-border bg-background p-5 text-[15px] leading-8 outline-none max-w-none",
      spellcheck: "false",
      autocorrect: "off",
      autocapitalize: "off",
      autocomplete: "off",
      "data-gramm": "false",
      "data-gramm_editor": "false",
      "data-enable-grammarly": "false",
    },
  },
  immediatelyRender: false,
});

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [postStatus, setPostStatus] = useState<"Published" | "Draft">("Published");

  const [view, setView] = useState<
    "table" | "create" | "view" | "edit" | "engagement"
  >("table");

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  const filteredPosts = useMemo(() => {
    let rows = posts;

    if (status !== "all") {
      rows = rows.filter(
        (p) => p.status.toLowerCase() === status.toLowerCase(),
      );
    }

    if (search.trim()) {
      rows = rows.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return rows;
  }, [posts, search, status]);


  // =========================================================
  // FETCH POSTS
  // =========================================================

  const fetchPosts = async () => {
    try {
      const res = await api.get(`/post/posts`);

      const formatted = res.data.map((post: any) => ({
        id: post.id,
        articleId: post.article_id,
        title: post.title,
        category: post.category,
        status: post.status,
        reactions: post.reactions || 0,
        responses: post.responses || 0,
        views: post.views || 0,
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
      const res = await api.get(`/post/engagement/${postId}`);

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

  // =========================================================
  // CREATE POST
  // =========================================================

 const createPost = async () => {
  try {
    const html = editor?.getHTML() || "";
    const textOnly = html.replace(/<[^>]*>/g, "").trim();

    if (!title.trim() || !textOnly) {
      alert("Title and content are required");
      return;
    }

    await api.post(`/post/posts`, {
      title: title.trim(),
      category: category || "General",
      content: html,
      status: postStatus,
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

    await api.put(`/post/posts/${selectedPost.id}`, {
      title: title.trim(),
      category,
      content: editor?.getHTML() || "",
      status: postStatus,
    });

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
      await api.delete(`/post/posts/${id}`);

      await fetchPosts();
    } catch (err) {
      console.error("Delete post error:", err);
    }
  };

  // =========================================================
  // REFRESH POSTS
  // =========================================================

  const refreshPosts = async () => {
    await fetchPosts();

    setSearch("");
    setStatus("all");
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
  <ToolBtn editor={editor} Icon={Bold} onClick={() => editor?.chain().focus().toggleBold().run()} active={editor?.isActive("bold")} />
  <ToolBtn editor={editor} Icon={Italic} onClick={() => editor?.chain().focus().toggleItalic().run()} active={editor?.isActive("italic")} />
  <ToolBtn editor={editor} Icon={Underline} onClick={() => editor?.chain().focus().toggleUnderline().run()} active={editor?.isActive("underline")} />
  <ToolBtn editor={editor} Icon={Heading1} onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} active={editor?.isActive("heading", { level: 1 })} />
  <ToolBtn editor={editor} Icon={Heading2} onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} active={editor?.isActive("heading", { level: 2 })} />
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
        const selectedText = editor.state.doc.textBetween(from, to, " ");
        editor.chain().focus().insertContent(`"${selectedText}"`).run();
      }
    }}
  />
  <ToolBtn editor={editor} Icon={List} onClick={() => editor?.chain().focus().toggleBulletList().run()} active={editor?.isActive("bulletList")} />
  <ToolBtn editor={editor} Icon={ListOrdered} onClick={() => editor?.chain().focus().toggleOrderedList().run()} active={editor?.isActive("orderedList")} />
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
  onValueChange={(v) => setPostStatus(v as "Published" | "Draft")}
>
                      <SelectTrigger className="w-[150px] h-9 text-xs">
                        <SelectValue />
                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="Published">Published</SelectItem>

                        <SelectItem value="Draft">Draft</SelectItem>
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
                                  {post.articleId} • {post.category}
                                </p>
                              </div>
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
                            </td>

                            <td className="px-3 py-3 text-xs text-muted-foreground">
                              {post.views}
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
      editor?.commands.setContent(post.content || "");
    }, 100);
  }}
>
  <PencilLine className="mr-2 h-4 w-4" />
  Edit Post
</DropdownMenuItem>

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
                      editor?.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
                    } else {
                      editor?.chain().focus().extendMarkRange("link").unsetLink().run();
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
                    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
                    setLinkUrl("");
                    setLinkModalOpen(false);
                  }}
                  className="mr-auto text-red-500 hover:text-red-600"
                >
                  Remove link
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setLinkModalOpen(false)}>
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
