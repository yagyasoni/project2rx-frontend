"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useSuppliers } from "@/context/SupplierContext";

export default function SuppliersPage() {
  // ✅ CHANGED: replaced local useState with shared context
  const {
    allSuppliers,
    selectedSuppliers,
    toggleSupplier,
    removeSupplier,
  } = useSuppliers();

  const [search, setSearch] = useState("");

  // ✅ CHANGED: uses allSuppliers from context instead of local ALL_SUPPLIERS
  const filtered = allSuppliers.filter((s) =>
    s.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-5">Suppliers</h1>

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

      {/* Two-column layout */}
      <div className="flex gap-6 items-start">
        {/* Left: supplier list with checkboxes */}
        <div className="w-80 border border-border rounded-xl overflow-hidden flex-shrink-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="text-left px-4 py-3 font-semibold text-foreground w-10 whitespace-nowrap">#</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">SUPPLIER NAME</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">SELECT</th>
              </tr>
            </thead>
          </table>
          <div className="overflow-y-auto max-h-[420px]">
            <table className="w-full text-sm">
              <tbody>
                {filtered.map((supplier, i) => (
                  <tr key={supplier} className="border-b border-border last:border-0 hover:bg-muted/40">
                    <td className="px-4 py-2.5 text-muted-foreground w-10 whitespace-nowrap">{i + 1}</td>
                    <td className="px-4 py-2.5 font-medium text-foreground">{supplier}</td>
                    <td className="px-4 py-2.5">
                      {/* ✅ CHANGED: uses selectedSuppliers & toggleSupplier from context */}
                      <input
                        type="checkbox"
                        checked={selectedSuppliers.includes(supplier)}
                        onChange={() => toggleSupplier(supplier)}
                        className="w-4 h-4 accent-[#2d5a3d] cursor-pointer rounded"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Divider */}
        <div className="w-px bg-border self-stretch" />

        {/* Right: selected suppliers */}
        <div className="w-72 border border-border rounded-xl overflow-hidden h-fit flex-shrink-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="text-left px-4 py-3 font-semibold text-foreground">SUPPLIERS SELECTED</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {/* ✅ CHANGED: uses selectedSuppliers & removeSupplier from context */}
              {selectedSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-4 py-6 text-center text-muted-foreground text-xs">
                    No suppliers selected
                  </td>
                </tr>
              ) : (
                selectedSuppliers.map((supplier) => (
                  <tr key={supplier} className="border-b border-border last:border-0 hover:bg-muted/40">
                    <td className="px-4 py-2.5 font-medium text-foreground">{supplier}</td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => removeSupplier(supplier)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}