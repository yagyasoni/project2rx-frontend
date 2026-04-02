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