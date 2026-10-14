"use client";

import React from "react";
import Image from "next/image";
import l from "@/public/l.png";

type LoaderVariant = "overlay" | "card" | "inline";

interface LoaderProps {
  /** Render nothing when false. Default: true. */
  show?: boolean;
  /** Fade the overlay out (opacity-0 + pointer-events-none). Default: false. */
  done?: boolean;
  /** 0–100. Omit for an indeterminate loader (no bar / no %). */
  progress?: number;
  /** Main message line. */
  title?: string;
  /** Secondary line (e.g. "Please wait a moment" or a filename). */
  subtitle?: string;
  /** Left-hand label under the progress bar. Default: "Loading". */
  progressLabel?: string;
  /** Layout: full overlay, modal card, or compact inline. Default: "overlay". */
  variant?: LoaderVariant;
  /** Backdrop tone for overlay/card. Default: "light". */
  tone?: "light" | "dark";
  /** Fixed vs absolute positioning for overlay/card. Default: true. */
  fixed?: boolean;
}

/**
 * Brand spinner: the AuditProRx logo rotates continuously inside a spinning
 * black ring. `size="lg"` for overlay/card, `size="sm"` for inline.
 */
function LogoSpinner({ size = "lg" }: { size?: "lg" | "sm" }) {
  const tile = size === "lg" ? "h-11 w-11" : "h-8 w-8";
  return (
    <div className="relative">
      <div className={`${tile} relative overflow-hidden rounded-xl bg-black`}>
        <Image
          src={l}
          alt="AuditProRx"
          fill
          priority
          className="object-cover"
        />
      </div>
      <div className="absolute -inset-1 rounded-[18px] border-2 border-transparent border-t-gray-900 border-r-gray-300 animate-spin" />
    </div>
  );
}

export default function Loader({
  show = true,
  done = false,
  progress,
  title,
  subtitle,
  progressLabel = "Loading",
  variant = "overlay",
  tone = "light",
  fixed = true,
}: LoaderProps) {
  if (!show) return null;

  // ── Inline: compact spinner + label, no backdrop ──
  if (variant === "inline") {
    return (
      <div className="flex flex-col items-center gap-3 text-center">
        <LogoSpinner size="sm" />
        {title && <span className="text-sm text-slate-400">{title}</span>}
      </div>
    );
  }

  const hasProgress = typeof progress === "number";
  const pct = hasProgress ? Math.min(progress as number, 100) : 0;

  // Shared inner content for overlay + card
  const content = (
    <>
      <LogoSpinner size="lg" />
      {(title || subtitle) && (
        <div className="w-full min-w-0 text-center space-y-1">
          {title && (
            <p className="text-sm font-semibold text-slate-700 tracking-wide">
              {title}
            </p>
          )}
          {subtitle && (
            <p className="w-full min-w-0 px-2 text-xs text-slate-400 wrap-anywhere">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {hasProgress && (
        <div className="w-full space-y-2">
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 transition-all duration-300 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">{progressLabel}</span>
            <span className="text-xs font-bold text-gray-900 tabular-nums">
              {Math.round(pct)}%
            </span>
          </div>
        </div>
      )}
    </>
  );

  const position = fixed ? "fixed" : "absolute";
  const backdrop = tone === "dark" ? "bg-black/50" : "bg-white/90";

  // ── Card: modal card on a dark backdrop ──
  if (variant === "card") {
    return (
      <div
        className={`${position} inset-0 z-[10000] flex items-center justify-center ${backdrop} backdrop-blur-sm`}
      >
        <div className="bg-white rounded-2xl shadow-2xl max-w-xs w-full mx-4 p-6 flex flex-col items-center text-center gap-4">
          {content}
        </div>
      </div>
    );
  }

  // ── Overlay: bare centered column ──
  return (
    <div
      className={`${position} inset-0 z-[10000] flex items-center justify-center ${backdrop} backdrop-blur-sm transition-opacity duration-400 ${
        done ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-6 w-72">{content}</div>
    </div>
  );
}
