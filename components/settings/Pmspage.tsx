"use client";

import { useState } from "react";

const ALL_PMS = [
  "PRIMERX",
  "PIONEERRX",
  "BESTRX",
  "DATASCAN",
  "DIGITALRX",
  "SRS",
  "LIBERTY",
  "RX30",
];

export default function PMSPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const filtered = ALL_PMS.filter((p) =>
    p.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-5">PMS List</h1>

      {/* Search */}
      <div className="relative mb-4 w-72">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Table */}
      <div className="w-[520px] border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background">
              <th className="text-left px-4 py-3 font-semibold text-foreground w-10">#</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">PMS</th>
              <th className="text-left px-4 py-3 font-semibold text-foreground">SELECT</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((pms, i) => (
              <tr key={pms} className="border-b border-border last:border-0 hover:bg-muted/40">
                <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                <td className="px-4 py-3 font-medium text-foreground">{pms}</td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(pms)}
                    onChange={() => toggle(pms)}
                    className="w-4 h-4 accent-[#2d5a3d] cursor-pointer rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}