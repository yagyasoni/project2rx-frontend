"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
  role?: "admin" | "user"; // expected role for this route
}

export default function ProtectedRoute({ children, role }: Props) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const userRole = localStorage.getItem("role"); // <-- store this during login

    if (!userId) {
      setAuthorized(false);
      return;
    }

    // 🔐 Role-based check
    if (role === "admin") {
      if (userRole === "admin") {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
    } else {
      // default = user routes
      if (userRole === "admin") {
        // admin trying to access user routes → optional (allow or block)
        setAuthorized(true); // usually allow
      } else {
        setAuthorized(true);
      }
    }
  }, [role]);

  // Loading state
  if (authorized === null) return null;

  // ❌ Not authorized
  if (!authorized) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-white rounded-xl p-8 text-center shadow-xl max-w-sm">
          <h2 className="text-xl font-semibold mb-3">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You are not authorized to access this page.
          </p>

          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-black text-white rounded-lg hover:opacity-90"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
