"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import api from "@/lib/api";

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

// The supplier routes need a login. This provider wraps every page, public
// ones included, so it must ask the API for nothing while nobody is signed
// in: a refused call would send a visitor of the home page to the sign-in
// page.
function isSignedIn(): boolean {
  try {
    return !!localStorage.getItem("accessToken");
  } catch {
    return false;
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

  // Whether the master list has been asked for under the current sign-in.
  const askedAllRef = useRef(false);

  // ── Fetch master supplier list from DB ──────────────────────
  const fetchAllSuppliers = useCallback(async () => {
    if (!isSignedIn()) {
      askedAllRef.current = false;
      setAllSuppliers([]);
      return;
    }

    askedAllRef.current = true;
    try {
      const res = await api.get("/api/suppliers");
      const names = (res.data || []).map((s: any) => s.name);
      setAllSuppliers(names);
    } catch (err) {
      askedAllRef.current = false;
      console.error("Failed to fetch suppliers:", err);
      setAllSuppliers([]);
    }
  }, []);

  // ── Fetch this user's selected suppliers from DB ────────────
  const fetchUserSuppliers = useCallback(async () => {
    const userId = getUserId();
    setCurrentUserId(userId);

    if (!userId || !isSignedIn()) {
      setSelectedSuppliersState([]);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get(`/api/user-suppliers/${userId}`);
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
      if (!userId || !isSignedIn()) return;

      // Optimistic update — update UI immediately
      setSelectedSuppliersState(suppliers);

      try {
        await api.post(`/api/user-suppliers/${userId}`, {
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
    // Signed in after this provider mounted (during sign-up): the master
    // list has not been loaded yet, so load it now.
    if (!askedAllRef.current) fetchAllSuppliers();
  }, [pathname, fetchUserSuppliers, fetchAllSuppliers]);

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