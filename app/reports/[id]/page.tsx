"use client";

import { useIsCompact } from "@/hooks/use-is-mobile";
import DesktopReport from "./DesktopReport";
import MobileReport from "./MobileReport";

/**
 * Picks a view by viewport width. These are separate component trees on purpose
 * — swapping whole components (rather than branching inside one) is what keeps
 * React's hook order stable when the breakpoint flips on resize/rotate.
 */
export default function ReportPage() {
  const isCompact = useIsCompact();

  // Width not measured yet. Render nothing rather than a placeholder loader —
  // the chosen view owns the loading UI. useIsCompact measures in a layout
  // effect, so this frame is never painted.
  if (isCompact === null) return null;

  return isCompact ? <MobileReport /> : <DesktopReport />;
}
