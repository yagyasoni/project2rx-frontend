"use client";

import { useState } from "react";

type Doc = {
  id: number;
  name: string;
  fileUrl: string;
};

const ALL_DOCS: Doc[] = [
  {
    id: 1,
    name: "Non-Disclosure Agreement (NDA)",
    fileUrl: "/AuditProRx_NDA.pdf",
  },
  {
    id: 2,
    name: "Release Agreement",
    fileUrl: "/AuditProRx_Release_Agreement.pdf",
  },
];

export default function Agreements() {
  const [search, setSearch] = useState("");

  const filteredDocs = ALL_DOCS.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase()),
  );

  const openDoc = (url: string) => {
    window.open(url, "_blank");
  };

  const downloadDoc = (url: string, name: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    link.click();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-5">Agreements</h1>

      {/* Search */}
      <div className="relative mb-4 w-72">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search documents"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Docs Container */}
      <div className="w-[520px] border border-border rounded-xl overflow-hidden">
        {filteredDocs.map((doc, index) => (
          <div
            key={doc.id}
            className="flex items-center justify-between px-4 py-3 border-b border-border last:border-0 hover:bg-muted/40"
          >
            {/* Left section */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => openDoc(doc.fileUrl)}
            >
              <span className="text-muted-foreground w-5">{index + 1}</span>

              <div>
                <p className="font-medium text-foreground">{doc.name}</p>
                <p className="text-xs text-muted-foreground">Click to view</p>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => openDoc(doc.fileUrl)}
                className="text-xs px-3 py-1.5 rounded-md border border-border hover:bg-muted"
              >
                View
              </button>

              <button
                onClick={() => downloadDoc(doc.fileUrl, doc.name)}
                className="text-xs px-3 py-1.5 rounded-md bg-black text-white hover:opacity-90"
              >
                Download
              </button>
            </div>
          </div>
        ))}

        {filteredDocs.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            No documents found
          </div>
        )}
      </div>
    </div>
  );
}
