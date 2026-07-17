"use client";

import { useEffect, useLayoutEffect, useState } from "react";

/**
 * Below this width we serve the compact (mobile) view. 1024px, not 768px, so
 * that a phone in LANDSCAPE (e.g. iPhone 14 Pro Max is 932px wide) is still
 * treated as compact — the desktop table freezes ~856px of columns and would
 * leave almost nothing to scroll into.
 */
const COMPACT_QUERY = "(max-width: 1023px)";

// useLayoutEffect warns when run during SSR, so fall back to useEffect there.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Returns `null` until the viewport has been measured, then true/false.
 *
 * Measured in a LAYOUT effect, which runs before the browser paints — so the
 * `null` frame is never visible and callers can render nothing during it. If
 * this used a plain effect (which runs after paint), that frame would flash.
 *
 * The null phase matters: if it returned `false` first, every phone would
 * briefly mount the full desktop tree before swapping.
 */
export function useIsCompact(): boolean | null {
  const [isCompact, setIsCompact] = useState<boolean | null>(null);

  useIsoLayoutEffect(() => {
    const mql = window.matchMedia(COMPACT_QUERY);
    const sync = () => setIsCompact(mql.matches);

    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  return isCompact;
}
