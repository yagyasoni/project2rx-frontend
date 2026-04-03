"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("userId");

    if (!user) {
      setAuthorized(false);
    } else {
      setAuthorized(true);
    }
  }, []);

  // Loading state
  if (authorized === null) {
    return null;
  }

  // If not logged in → show overlay
  if (!authorized) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-white rounded-xl p-8 text-center shadow-xl max-w-sm">
          <h2 className="text-xl font-semibold mb-3">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please register or log in first to access this page.
          </p>

          <button
            onClick={() => router.push("/auth")}
            className="px-6 py-2 bg-black text-white rounded-lg hover:opacity-90"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
