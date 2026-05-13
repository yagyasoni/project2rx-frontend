// "use client";

// import { useMemo, useRef, useState } from "react";

// import {
//   Search,
//   RefreshCw,
//   Trash2,
//   Newspaper,
//   PencilLine,
//   Plus,
//   ArrowLeft,
//   Bold,
//   Italic,
//   Underline,
//   List,
//   ListOrdered,
//   Link2,
//   Heading1,
//   Heading2,
//   Quote,
//   MoreHorizontal,
//   Send,
//   MessageSquare,
//   MessagesSquare,
//   TrendingUp,
//   CircleDot,
// } from "lucide-react";

// import AdminLayout from "@/components/adminLayout";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// interface Reaction {
//   id: number;
//   user: string;
//   type: string;
// }

// interface Response {
//   id: number;
//   user: string;
//   comment: string;
//   createdAt: string;
// }

// interface Post {
//   id: number;
//   articleId: string;
//   title: string;
//   category: string;
//   status: "Published" | "Draft";
//   reactions: number;
//   responses: number;
//   views: number;
//   createdAt: string;
//   content: string;
//   reactionsData: Reaction[];
//   responsesData: Response[];
// }

// export default function PublishingPage() {
//   const editorRef = useRef<HTMLDivElement>(null);

//   const initialPosts: Post[] = [
//     {
//       id: 1,
//       articleId: "ART-1001",
//       title: "How AI Is Transforming Modern Healthcare",
//       category: "Healthcare",
//       status: "Published",
//       reactions: 124,
//       responses: 18,
//       views: 1890,
//       createdAt: "12 May 2026",
//       content:
//         "<h2>Healthcare & AI</h2><p>Artificial intelligence is transforming modern healthcare systems globally.</p>",
//       reactionsData: [
//         {
//           id: 1,
//           user: "Rahul Sharma",
//           type: "Insightful",
//         },
//         {
//           id: 2,
//           user: "Anjali Verma",
//           type: "Helpful",
//         },
//       ],
//       responsesData: [
//         {
//           id: 1,
//           user: "Priya",
//           comment: "Really loved the depth of this article.",
//           createdAt: "2h ago",
//         },
//       ],
//     },

//     {
//       id: 2,
//       articleId: "ART-1002",
//       title: "Future Of Telemedicine In India",
//       category: "Technology",
//       status: "Draft",
//       reactions: 92,
//       responses: 10,
//       views: 960,
//       createdAt: "10 May 2026",
//       content:
//         "<p>Telemedicine is rapidly changing healthcare accessibility.</p>",
//       reactionsData: [
//         {
//           id: 1,
//           user: "Akshay",
//           type: "Forward Thinking",
//         },
//       ],
//       responsesData: [
//         {
//           id: 1,
//           user: "Sneha",
//           comment: "Waiting for the next part.",
//           createdAt: "1d ago",
//         },
//       ],
//     },

//     {
//       id: 3,
//       articleId: "ART-1003",
//       title: "Digital Prescription Systems Explained",
//       category: "Business",
//       status: "Published",
//       reactions: 211,
//       responses: 28,
//       views: 3520,
//       createdAt: "08 May 2026",
//       content:
//         "<p>Digital prescriptions reduce manual errors and improve efficiency.</p>",
//       reactionsData: [
//         {
//           id: 1,
//           user: "Harshit",
//           type: "Useful",
//         },
//       ],
//       responsesData: [
//         {
//           id: 1,
//           user: "Simran",
//           comment: "Very informative and practical.",
//           createdAt: "3d ago",
//         },
//       ],
//     },
//   ];

//   const [posts, setPosts] = useState<Post[]>(initialPosts);

//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("all");

//   const [view, setView] = useState<
//     "table" | "create" | "view" | "edit" | "engagement"
//   >("table");

//   const [selectedPost, setSelectedPost] = useState<Post | null>(null);

//   const [title, setTitle] = useState("");
//   const [category, setCategory] = useState("");

//   const filteredPosts = useMemo(() => {
//     let rows = posts;

//     if (status !== "all") {
//       rows = rows.filter(
//         (p) => p.status.toLowerCase() === status.toLowerCase(),
//       );
//     }

//     if (search.trim()) {
//       rows = rows.filter((p) =>
//         p.title.toLowerCase().includes(search.toLowerCase()),
//       );
//     }

//     return rows;
//   }, [posts, search, status]);

//   const executeCommand = (command: string, value?: string) => {
//     document.execCommand(command, false, value);
//   };

//   const createPost = () => {
//     if (!title || !editorRef.current?.innerHTML) return;

//     const newPost: Post = {
//       id: Date.now(),

//       articleId: `ART-${Math.floor(Math.random() * 9999)}`,

//       title,

//       category: category || "General",

//       status: "Published",

//       reactions: 0,

//       responses: 0,

//       views: 0,

//       createdAt: "Just now",

//       content: editorRef.current.innerHTML,

//       reactionsData: [],

//       responsesData: [],
//     };

//     setPosts((prev) => [newPost, ...prev]);

//     setTitle("");
//     setCategory("");

//     if (editorRef.current) {
//       editorRef.current.innerHTML = "";
//     }

//     setView("table");
//   };

//   const deletePost = (id: number) => {
//     setPosts((prev) => prev.filter((p) => p.id !== id));
//   };

//   const refreshPosts = () => {
//     setPosts(initialPosts);
//     setSearch("");
//     setStatus("all");
//   };

//   return (
//     <AdminLayout>
//       <div className="min-h-screen bg-background">
//         <div className="max-w-[1400px] mx-auto px-6 py-0">
//           <div className="space-y-6">
//             {/* HEADER */}
//             <div className="flex items-center justify-between pb-4 border-b border-border">
//               <div>
//                 <h1 className="text-2xl font-bold tracking-tight text-foreground">
//                   PUBLISHING MANAGEMENT
//                 </h1>

//                 <p className="text-sm text-muted-foreground mt-1">
//                   Create and manage platform publishing content
//                 </p>
//               </div>

//               {view === "table" && (
//                 <div className="flex items-center gap-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={refreshPosts}
//                     className="gap-1.5 text-xs font-semibold"
//                   >
//                     <RefreshCw size={13} />
//                     Refresh
//                   </Button>

//                   <Button
//                     size="sm"
//                     onClick={() => setView("create")}
//                     className="gap-1.5 text-xs font-semibold"
//                   >
//                     <Plus size={13} />
//                     Create Post
//                   </Button>
//                 </div>
//               )}
//             </div>

//             {/* ANALYTICS */}
//             {view === "table" && (
//               <div className="flex items-center gap-3 flex-wrap">
//                 <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
//                   <TrendingUp size={15} className="text-blue-500" />

//                   <div>
//                     <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
//                       Total Views
//                     </p>

//                     <p className="text-sm font-semibold">6,370</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
//                   <CircleDot size={15} className="text-emerald-500" />

//                   <div>
//                     <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
//                       Engagement
//                     </p>

//                     <p className="text-sm font-semibold">427</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2">
//                   <MessagesSquare size={15} className="text-violet-500" />

//                   <div>
//                     <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
//                       Responses
//                     </p>

//                     <p className="text-sm font-semibold">56</p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* CREATE / EDIT */}
//             {(view === "create" || view === "edit") && (
//               <div className="rounded-lg border border-border bg-card overflow-hidden">
//                 {/* TOP */}
//                 <div className="flex items-center justify-between border-b border-border px-5 py-4">
//                   <div className="flex items-center gap-3">
//                     <Button
//                       variant="ghost"
//                       size="icon"
//                       onClick={() => setView("table")}
//                       className="h-8 w-8"
//                     >
//                       <ArrowLeft size={16} />
//                     </Button>

//                     <div>
//                       <h2 className="text-sm font-semibold uppercase tracking-wider">
//                         {view === "create" ? "Create Post" : "Edit Post"}
//                       </h2>

//                       {/* <p className="text-xs text-muted-foreground mt-1">
//                         Rich content editor
//                       </p> */}
//                     </div>
//                   </div>

//                   <Button
//                     size="sm"
//                     onClick={createPost}
//                     className="gap-1.5 text-xs"
//                   >
//                     <Send size={13} />
//                     Publish Post
//                   </Button>
//                 </div>

//                 {/* TOOLBAR */}
//                 <div className="flex items-center gap-1 border-b border-border px-4 py-2 flex-wrap bg-muted/30">
//                   {[
//                     {
//                       icon: Bold,
//                       action: () => executeCommand("bold"),
//                     },

//                     {
//                       icon: Italic,
//                       action: () => executeCommand("italic"),
//                     },

//                     {
//                       icon: Underline,
//                       action: () => executeCommand("underline"),
//                     },

//                     {
//                       icon: Heading1,
//                       action: () => executeCommand("formatBlock", "h1"),
//                     },

//                     {
//                       icon: Heading2,
//                       action: () => executeCommand("formatBlock", "h2"),
//                     },

//                     {
//                       icon: Quote,
//                       action: () => executeCommand("formatBlock", "blockquote"),
//                     },

//                     {
//                       icon: List,
//                       action: () => executeCommand("insertUnorderedList"),
//                     },

//                     {
//                       icon: ListOrdered,
//                       action: () => executeCommand("insertOrderedList"),
//                     },

//                     {
//                       icon: Link2,
//                       action: () => {
//                         const url = prompt("Enter URL");

//                         if (url) {
//                           executeCommand("createLink", url);
//                         }
//                       },
//                     },
//                   ].map((item, idx) => (
//                     <Button
//                       key={idx}
//                       variant="ghost"
//                       size="icon"
//                       className="h-8 w-8"
//                       onClick={item.action}
//                     >
//                       <item.icon size={15} />
//                     </Button>
//                   ))}
//                 </div>

//                 {/* CONTENT */}
//                 <div className="p-6">
//                   <Input
//                     placeholder="Post title..."
//                     value={title}
//                     onChange={(e) => setTitle(e.target.value)}
//                     className="border-0 shadow-none text-5xl font-semibold px-0 h-auto focus-visible:ring-0"
//                   />

//                   <div className="flex items-center gap-3 mt-4">
//                     <Input
//                       placeholder="Category"
//                       value={category}
//                       onChange={(e) => setCategory(e.target.value)}
//                       className="max-w-[220px] h-9 text-xs"
//                     />

//                     <Select defaultValue="Published">
//                       <SelectTrigger className="w-[150px] h-9 text-xs">
//                         <SelectValue />
//                       </SelectTrigger>

//                       <SelectContent>
//                         <SelectItem value="Published">Published</SelectItem>

//                         <SelectItem value="Draft">Draft</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div
//                     ref={editorRef}
//                     contentEditable
//                     suppressContentEditableWarning
//                     className="mt-6 min-h-[500px] rounded-md border border-border bg-background p-5 text-[15px] leading-8 outline-none"
//                   />
//                 </div>
//               </div>
//             )}

//             {/* VIEW POST */}
//             {view === "view" && selectedPost && (
//               <div className="rounded-lg border border-border bg-card overflow-hidden">
//                 <div className="flex items-center gap-3 border-b border-border px-5 py-4">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8"
//                     onClick={() => setView("table")}
//                   >
//                     <ArrowLeft size={16} />
//                   </Button>

//                   <div>
//                     <h2 className="text-lg font-semibold">
//                       {selectedPost.title}
//                     </h2>

//                     <p className="text-xs text-muted-foreground mt-1">
//                       {selectedPost.articleId} • {selectedPost.category}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="p-6">
//                   <div
//                     dangerouslySetInnerHTML={{
//                       __html: selectedPost.content,
//                     }}
//                     className="prose prose-neutral dark:prose-invert max-w-none"
//                   />
//                 </div>
//               </div>
//             )}

//             {/* ENGAGEMENT */}
//             {view === "engagement" && selectedPost && (
//               <div className="rounded-lg border border-border bg-card overflow-hidden">
//                 <div className="flex items-center gap-3 border-b border-border px-5 py-4">
//                   <Button
//                     variant="ghost"
//                     size="icon"
//                     className="h-8 w-8"
//                     onClick={() => setView("table")}
//                   >
//                     <ArrowLeft size={16} />
//                   </Button>

//                   <div>
//                     <h2 className="text-lg font-semibold">
//                       Audience Engagement
//                     </h2>

//                     <p className="text-xs text-muted-foreground mt-1">
//                       {selectedPost.title}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-6 p-6">
//                   {/* REACTIONS */}
//                   <div>
//                     <div className="flex items-center gap-2 mb-4">
//                       <CircleDot size={14} className="text-emerald-500" />

//                       <h3 className="text-sm font-semibold uppercase tracking-wider">
//                         Reactions
//                       </h3>
//                     </div>

//                     <div className="space-y-3">
//                       {selectedPost.reactionsData.map((reaction) => (
//                         <div
//                           key={reaction.id}
//                           className="rounded-md border border-border px-4 py-3"
//                         >
//                           <div className="flex items-center justify-between">
//                             <p className="text-sm font-medium">
//                               {reaction.user}
//                             </p>

//                             <span className="text-xs text-muted-foreground">
//                               {reaction.type}
//                             </span>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* RESPONSES */}
//                   <div>
//                     <div className="flex items-center gap-2 mb-4">
//                       <MessagesSquare size={14} className="text-violet-500" />

//                       <h3 className="text-sm font-semibold uppercase tracking-wider">
//                         Responses
//                       </h3>
//                     </div>

//                     <div className="space-y-3">
//                       {selectedPost.responsesData.map((response) => (
//                         <div
//                           key={response.id}
//                           className="rounded-md border border-border px-4 py-3"
//                         >
//                           <div className="flex items-center justify-between">
//                             <p className="text-sm font-medium">
//                               {response.user}
//                             </p>

//                             <span className="text-xs text-muted-foreground">
//                               {response.createdAt}
//                             </span>
//                           </div>

//                           <p className="mt-2 text-sm text-muted-foreground leading-6">
//                             {response.comment}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* TABLE */}
//             {view === "table" && (
//               <>
//                 {/* SEARCH */}
//                 <div className="flex items-center gap-3 flex-wrap">
//                   <div className="relative flex-1 max-w-sm">
//                     <Search
//                       size={14}
//                       className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
//                     />

//                     <Input
//                       type="text"
//                       placeholder="Search posts..."
//                       value={search}
//                       onChange={(e) => setSearch(e.target.value)}
//                       className="pl-9 h-9 text-xs"
//                     />
//                   </div>

//                   <Select value={status} onValueChange={setStatus}>
//                     <SelectTrigger className="w-[140px] h-9 text-xs">
//                       <SelectValue />
//                     </SelectTrigger>

//                     <SelectContent>
//                       <SelectItem value="all">All</SelectItem>

//                       <SelectItem value="published">Published</SelectItem>

//                       <SelectItem value="draft">Draft</SelectItem>
//                     </SelectContent>
//                   </Select>

//                   <span className="text-[11px] text-muted-foreground ml-auto">
//                     {filteredPosts.length} / {posts.length} shown
//                   </span>
//                 </div>

//                 {/* TABLE */}
//                 <div className="rounded-lg border border-border overflow-hidden">
//                   <div
//                     className="overflow-auto"
//                     style={{
//                       maxHeight: "calc(100vh - 360px)",
//                     }}
//                   >
//                     <table className="min-w-full divide-y divide-border">
//                       <thead className="bg-muted/50 sticky top-0 z-10">
//                         <tr>
//                           <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
//                             Article
//                           </th>

//                           <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
//                             Status
//                           </th>

//                           <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
//                             Engagement
//                           </th>

//                           <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
//                             Views
//                           </th>

//                           <th className="px-3 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
//                             Created At
//                           </th>

//                           <th className="px-3 py-3 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider w-24">
//                             Actions
//                           </th>
//                         </tr>
//                       </thead>

//                       <tbody className="bg-card divide-y divide-border">
//                         {filteredPosts.map((post) => (
//                           <tr
//                             key={post.id}
//                             className="transition-colors hover:bg-muted/40"
//                           >
//                             {/* ARTICLE */}
//                             <td className="px-3 py-3 min-w-[360px]">
//                               <div>
//                                 <p className="text-sm font-medium text-foreground">
//                                   {post.title}
//                                 </p>

//                                 <p className="text-[11px] text-muted-foreground mt-1">
//                                   {post.articleId} • {post.category}
//                                 </p>
//                               </div>
//                             </td>

//                             {/* STATUS */}
//                             <td className="px-3 py-3">
//                               <span
//                                 className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
//                                   post.status === "Published"
//                                     ? "bg-emerald-500/10 text-emerald-600"
//                                     : "bg-yellow-500/10 text-yellow-600"
//                                 }`}
//                               >
//                                 {post.status}
//                               </span>
//                             </td>

//                             {/* ENGAGEMENT */}
//                             <td className="px-3 py-3">
//                               <button
//                                 onClick={() => {
//                                   setSelectedPost(post);

//                                   setView("engagement");
//                                 }}
//                                 className="flex items-center gap-4"
//                               >
//                                 <div className="flex items-center gap-1 text-xs">
//                                   <CircleDot
//                                     size={13}
//                                     className="text-emerald-500"
//                                   />

//                                   <span>{post.reactions}</span>
//                                 </div>

//                                 <div className="flex items-center gap-1 text-xs">
//                                   <MessagesSquare
//                                     size={13}
//                                     className="text-violet-500"
//                                   />

//                                   <span>{post.responses}</span>
//                                 </div>
//                               </button>
//                             </td>

//                             {/* VIEWS */}
//                             <td className="px-3 py-3 text-xs text-muted-foreground">
//                               {post.views}
//                             </td>

//                             {/* CREATED */}
//                             <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
//                               {post.createdAt}
//                             </td>

//                             {/* ACTIONS */}
//                             <td className="px-3 py-3">
//                               <div className="flex justify-center">
//                                 <DropdownMenu>
//                                   <DropdownMenuTrigger asChild>
//                                     <Button
//                                       variant="ghost"
//                                       size="icon"
//                                       className="h-8 w-8"
//                                     >
//                                       <MoreHorizontal size={15} />
//                                     </Button>
//                                   </DropdownMenuTrigger>

//                                   <DropdownMenuContent align="end">
//                                     <DropdownMenuItem
//                                       onClick={() => {
//                                         setSelectedPost(post);

//                                         setView("view");
//                                       }}
//                                     >
//                                       <Newspaper className="mr-2 h-4 w-4" />
//                                       View Post
//                                     </DropdownMenuItem>

//                                     <DropdownMenuItem
//                                       onClick={() => {
//                                         setSelectedPost(post);

//                                         setTitle(post.title);

//                                         setCategory(post.category);

//                                         setView("edit");

//                                         setTimeout(() => {
//                                           if (editorRef.current) {
//                                             editorRef.current.innerHTML =
//                                               post.content;
//                                           }
//                                         }, 100);
//                                       }}
//                                     >
//                                       <PencilLine className="mr-2 h-4 w-4" />
//                                       Edit Post
//                                     </DropdownMenuItem>

//                                     <DropdownMenuItem
//                                       onClick={() => {
//                                         setSelectedPost(post);

//                                         setView("engagement");
//                                       }}
//                                     >
//                                       <MessageSquare className="mr-2 h-4 w-4" />
//                                       View Reactions
//                                     </DropdownMenuItem>

//                                     <DropdownMenuItem
//                                       onClick={() => deletePost(post.id)}
//                                       className="text-red-500"
//                                     >
//                                       <Trash2 className="mr-2 h-4 w-4" />
//                                       Delete Post
//                                     </DropdownMenuItem>
//                                   </DropdownMenuContent>
//                                 </DropdownMenu>
//                               </div>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </AdminLayout>
//   );
// }

"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import axios from "axios";

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
  const editorRef = useRef<HTMLDivElement>(null);

  const [posts, setPosts] = useState<Post[]>([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [postStatus, setPostStatus] = useState("all");

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

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  // =========================================================
  // FETCH POSTS
  // =========================================================

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

  // =========================================================
  // CREATE POST
  // =========================================================

  const createPost = async () => {
    try {
      if (!title || !editorRef.current?.innerHTML) return;

      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/post/posts`, {
        title,
        category: category || "General",
        content: editorRef.current.innerHTML,
        status: postStatus,
      });

      setTitle("");
      setCategory("");

      if (editorRef.current) {
        editorRef.current.innerHTML = "";
      }

      await fetchPosts();

      setView("table");
    } catch (err) {
      console.error("Create post error:", err);
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
          content: editorRef.current?.innerHTML,
          status: postStatus,
        },
      );

      await fetchPosts();

      setView("table");
    } catch (err) {
      console.error("Update post error:", err);
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
                    onClick={() => setView("create")}
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
                <div className="flex items-center gap-1 border-b border-border px-4 py-2 flex-wrap bg-muted/30">
                  {[
                    {
                      icon: Bold,
                      action: () => executeCommand("bold"),
                    },

                    {
                      icon: Italic,
                      action: () => executeCommand("italic"),
                    },

                    {
                      icon: Underline,
                      action: () => executeCommand("underline"),
                    },

                    {
                      icon: Heading1,
                      action: () => executeCommand("formatBlock", "h1"),
                    },

                    {
                      icon: Heading2,
                      action: () => executeCommand("formatBlock", "h2"),
                    },

                    {
                      icon: Quote,
                      action: () => executeCommand("formatBlock", "blockquote"),
                    },

                    {
                      icon: List,
                      action: () => executeCommand("insertUnorderedList"),
                    },

                    {
                      icon: ListOrdered,
                      action: () => executeCommand("insertOrderedList"),
                    },

                    {
                      icon: Link2,
                      action: () => {
                        const url = prompt("Enter URL");

                        if (url) {
                          executeCommand("createLink", url);
                        }
                      },
                    },
                  ].map((item, idx) => (
                    <Button
                      key={idx}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={item.action}
                    >
                      <item.icon size={15} />
                    </Button>
                  ))}
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
                      defaultValue={
                        view === "edit" ? selectedPost?.status : "Published"
                      }
                      onValueChange={(value) => setPostStatus(value)}
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

                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    className="mt-6 min-h-[500px] rounded-md border border-border bg-background p-5 text-[15px] leading-8 outline-none"
                  />
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

                                        setView("edit");

                                        setTimeout(() => {
                                          if (editorRef.current) {
                                            editorRef.current.innerHTML =
                                              post.content;
                                          }
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
    </AdminLayout>
  );
}
