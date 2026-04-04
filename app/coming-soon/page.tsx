"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function NotFound() {
  return (
    <ProtectedRoute role="user">
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <h1 className="text-5xl font-bold tracking-wide">Coming Soon</h1>

        <p className="mt-4 text-gray-400 text-lg">
          This page is under development.
        </p>

        <button
          onClick={() => (window.location.href = "/Mainpage")}
          className="mt-6 px-6 py-2 border border-white hover:bg-white hover:text-black transition-all duration-300"
        >
          Go Home
        </button>
      </div>
    </ProtectedRoute>
  );
}
