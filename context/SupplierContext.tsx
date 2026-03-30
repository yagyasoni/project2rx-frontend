// "use client";

// import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// const ALL_SUPPLIERS = [
//   "340B", "ABC", "AKRON GENERICS", "ALPINE HEALTH", "ANDA", "APD", "API",
//   "ASTOR DRUGS", "ATLAND", "AUBURN", "AXIA", "AYTU BIOPHARMA",
//   "BESSE", "BIORIDGE", "BLUPAX", "BONITA", "CARDINAL", "CITYMED",
//   "COCHRAN WHOLESALE PHARMACEUTICAL", "DB DIAGNOSTICS", "DOCKSIDE PARTNERS",
//   "DRUGZONE", "EXELTIS", "EZRIRX", "FFF ENTERPRISES", "GALT DIRECT",
//   "GEMCO MEDICAL", "GENETCO", "GLENVIEW PHARMA", "GREEN HILL TRADING",
//   "GSK", "HEALTHSOURCE", "HHCRX", "HYGEN PHARMACEUTICALS", "ICS DIRECT",
//   "INDEPENDENT PHARMACEUTICAL", "INTEGRAL RX", "IPC", "IPD", "IXTHUS",
//   "JAMRX", "JG", "JOURNEY", "KARES", "KEYSOURCE", "KINRAY", "LANDMARK",
//   "LEGACY HEALTH", "MAKS PHARMA", "MASTERS", "MATCHRX", "MATRIX",
//   "MCKESSON", "MODERNA DIRECT", "NDC DISTRIBUTORS", "NETCOSTRX",
//   "NEW SUPPLIER 1", "NEW SUPPLIER 2", "NEW SUPPLIER 3", "NEW SUPPLIER 4",
//   "NORTHEAST MEDICAL", "NUMED", "OAK DRUGS", "PARMED", "PAYLESS",
//   "PBA HEALTH", "PFIZER DIRECT", "PHARMASAVER", "PHARMASOURCE",
//   "PILL R HEALTH (340B)", "PRESCRIPTION SUPPLY", "PRIMED", "PRODIGY",
//   "PRX WHOLESALE", "QUALITY CARE", "QUEST PHARMACEUTICAL", "REAL VALUE RX",
//   "REPUBLIC", "RX MART", "RX ONE SHOP", "RXEED", "RXMART", "RXPOST",
//   "SAVEBIGRX", "SECOND SOURCE RX", "SEQIRUS", "SMART SOURCE", "SMITH DRUGS",
//   "SOUTH PIONTE", "SPECTRUM", "STARTING INVENTORY 1", "STARTING INVENTORY 2",
//   "STARTING INVENTORY 3", "STERLING DISTRIBUTOR", "SURECOST", "SURPLUS DIABETIC",
//   "TOPRX", "TRUMARKER", "TRXADE", "VALUE DRUG", "VAXSERVE",
//   "WELLGISTICS", "WESTERN WELLNES SOLUTION", "WINDMILL HEALTH PRODUCTS",
// ];

// interface SupplierContextType {
//   allSuppliers: string[];
//   selectedSuppliers: string[];
//   setSelectedSuppliers: (suppliers: string[]) => void;
//   toggleSupplier: (name: string) => void;
//   removeSupplier: (name: string) => void;
// }

// const SupplierContext = createContext<SupplierContextType | undefined>(undefined);

// // ✅ User-specific storage key based on userId in localStorage
// function getStorageKey(): string {
//   try {
//     const userId = localStorage.getItem("userId");
//     if (userId) {
//       return `selectedSuppliers_${userId}`;
//     }
//   } catch {
//     // ignore
//   }
//   return "selectedSuppliers_default";
// }

// export function SupplierProvider({ children }: { children: ReactNode }) {
//   const [selectedSuppliers, setSelectedSuppliersState] = useState<string[]>([]);
//   const [hydrated, setHydrated] = useState(false);
//   const [storageKey, setStorageKey] = useState<string>("selectedSuppliers_default");

//   // ✅ On mount: read userId and load that user's supplier selections
//   useEffect(() => {
//     const key = getStorageKey();
//     setStorageKey(key);
//     try {
//       const stored = localStorage.getItem(key);
//       if (stored) {
//         setSelectedSuppliersState(JSON.parse(stored));
//       } else {
//         setSelectedSuppliersState([]);
//       }
//     } catch {
//       setSelectedSuppliersState([]);
//     }
//     setHydrated(true);
//   }, []);

//   // ✅ Re-check userId when window gets focus (handles admin impersonation user switch)
//   useEffect(() => {
//     const handleFocus = () => {
//       const newKey = getStorageKey();
//       if (newKey !== storageKey) {
//         setStorageKey(newKey);
//         try {
//           const stored = localStorage.getItem(newKey);
//           setSelectedSuppliersState(stored ? JSON.parse(stored) : []);
//         } catch {
//           setSelectedSuppliersState([]);
//         }
//       }
//     };

//     window.addEventListener("focus", handleFocus);
//     return () => window.removeEventListener("focus", handleFocus);
//   }, [storageKey]);

//   // ✅ Save to user-specific key whenever selections change
//   useEffect(() => {
//     if (hydrated) {
//       localStorage.setItem(storageKey, JSON.stringify(selectedSuppliers));
//     }
//   }, [selectedSuppliers, hydrated, storageKey]);

//   const setSelectedSuppliers = (suppliers: string[]) => {
//     setSelectedSuppliersState(suppliers);
//   };

//   const toggleSupplier = (name: string) => {
//     setSelectedSuppliersState((prev) =>
//       prev.includes(name) ? prev.filter((s) => s !== name) : [...prev, name]
//     );
//   };

//   const removeSupplier = (name: string) => {
//     setSelectedSuppliersState((prev) => prev.filter((s) => s !== name));
//   };

//   return (
//     <SupplierContext.Provider
//       value={{
//         allSuppliers: ALL_SUPPLIERS,
//         selectedSuppliers,
//         setSelectedSuppliers,
//         toggleSupplier,
//         removeSupplier,
//       }}
//     >
//       {children}
//     </SupplierContext.Provider>
//   );
// }

// export function useSuppliers() {
//   const context = useContext(SupplierContext);
//   if (!context) {
//     throw new Error("useSuppliers must be used within a SupplierProvider");
//   }
//   return context;
// }

// export { ALL_SUPPLIERS };

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import axios from "axios";

const API_BASE = "https://api.auditprorx.com";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────
interface SupplierContextType {
  allSuppliers: string[];
  selectedSuppliers: string[];
  loading: boolean;
  toggleSupplier: (name: string) => void;
  removeSupplier: (name: string) => void;
  setSelectedSuppliers: (suppliers: string[]) => void;
  saveSuppliers: (suppliers: string[]) => Promise<void>;
  refetch: () => Promise<void>;
}

const SupplierContext = createContext<SupplierContextType | undefined>(
  undefined
);

// ─────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────
function getUserId(): string | null {
  try {
    return localStorage.getItem("userId");
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────
export function SupplierProvider({ children }: { children: ReactNode }) {
  const [allSuppliers, setAllSuppliers] = useState<string[]>([]);
  const [selectedSuppliers, setSelectedSuppliersState] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // ✅ Track route changes — refetch when user navigates
  const pathname = usePathname();

  // ── Fetch master supplier list from DB ──────────────────────
  const fetchAllSuppliers = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/suppliers`);
      const names = (res.data || []).map((s: any) => s.name);
      setAllSuppliers(names);
    } catch (err) {
      console.error("Failed to fetch suppliers:", err);
      setAllSuppliers([]);
    }
  }, []);

  // ── Fetch this user's selected suppliers from DB ────────────
  const fetchUserSuppliers = useCallback(async () => {
    const userId = getUserId();
    setCurrentUserId(userId);

    if (!userId) {
      setSelectedSuppliersState([]);
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${API_BASE}/api/user-suppliers/${userId}`
      );
      const names = (res.data || []).map((s: any) => s.name);
      setSelectedSuppliersState(names);
    } catch (err) {
      console.error("Failed to fetch user suppliers:", err);
      setSelectedSuppliersState([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Save suppliers to DB ────────────────────────────────────
  const saveSuppliers = useCallback(
    async (suppliers: string[]) => {
      const userId = getUserId();
      if (!userId) return;

      // Optimistic update — update UI immediately
      setSelectedSuppliersState(suppliers);

      try {
        await axios.post(`${API_BASE}/api/user-suppliers/${userId}`, {
          supplierNames: suppliers,
        });
      } catch (err) {
        console.error("Failed to save suppliers:", err);
        // Revert on failure
        await fetchUserSuppliers();
      }
    },
    [fetchUserSuppliers]
  );

  // ── Load on mount ───────────────────────────────────────────
  useEffect(() => {
    fetchAllSuppliers();
    fetchUserSuppliers();
  }, [fetchAllSuppliers, fetchUserSuppliers]);

  // ✅ Refetch when route changes (e.g. agreements → settings)
  useEffect(() => {
    fetchUserSuppliers();
  }, [pathname, fetchUserSuppliers]);

  // ✅ Refetch when window gets focus (handles admin impersonation)
  useEffect(() => {
    const handleFocus = () => {
      const newUserId = getUserId();
      if (newUserId !== currentUserId) {
        fetchUserSuppliers();
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [currentUserId, fetchUserSuppliers]);

  // ── Toggle a single supplier ────────────────────────────────
  const toggleSupplier = (name: string) => {
    const updated = selectedSuppliers.includes(name)
      ? selectedSuppliers.filter((s) => s !== name)
      : [...selectedSuppliers, name];
    saveSuppliers(updated);
  };

  // ── Remove a single supplier ────────────────────────────────
  const removeSupplier = (name: string) => {
    const updated = selectedSuppliers.filter((s) => s !== name);
    saveSuppliers(updated);
  };

  // ── Replace all selections ──────────────────────────────────
  const setSelectedSuppliers = (suppliers: string[]) => {
    saveSuppliers(suppliers);
  };

  return (
    <SupplierContext.Provider
      value={{
        allSuppliers,
        selectedSuppliers,
        loading,
        toggleSupplier,
        removeSupplier,
        setSelectedSuppliers,
        saveSuppliers,
        refetch: fetchUserSuppliers,
      }}
    >
      {children}
    </SupplierContext.Provider>
  );
}

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────
export function useSuppliers() {
  const context = useContext(SupplierContext);
  if (!context) {
    throw new Error("useSuppliers must be used within a SupplierProvider");
  }
  return context;
}