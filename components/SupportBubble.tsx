"use client";

import { Headset } from "lucide-react";

/**
 * Floating "Get Live Support" bubble, fixed to the bottom-left on every page.
 * Opens the ScreenConnect guest join page in a new tab so a client can start
 * an attended remote-support session with the admin.
 *
 * `raised` nudges it up so it clears the fixed BetaBanner on app routes.
 */
export default function SupportBubble({ raised = false }: { raised?: boolean }) {
  const openSupport = () => {
    window.open(
      "https://auditprorx.screenconnect.com/",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <button
      onClick={openSupport}
      aria-label="Get live support"
      title="Get Live Support"
      className={`group fixed left-5 z-50 flex items-center gap-2 rounded-full bg-gradient-to-b from-zinc-100 to-zinc-300 px-4 py-3 text-sm font-medium text-background shadow-lg shadow-black/30 ring-1 ring-white/10 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:from-white hover:shadow-xl active:translate-y-0 ${
        raised ? "bottom-16" : "bottom-5"
      }`}
    >
      <Headset className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
      <span className="hidden sm:inline">Get Live Support</span>
    </button>
  );
}
