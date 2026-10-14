// proxy.ts — Next 16 "proxy" convention (replaces middleware.ts).
//
// Temporary maintenance gate. When the Vercel env var MAINTENANCE_MODE is
// "true", every app / auth / admin route listed in `config.matcher` below is
// 307-redirected to the static /maintenance page. Marketing pages, legal pages,
// SEO files (sitemap.xml, robots.txt, manifest, opengraph-image, icons),
// /_next/* and /api/* are NOT in the matcher, so this function never runs for
// them. With the env var unset (or "false") the gate is a no-op.
//
// Turn on:  Vercel → Settings → Environment Variables → MAINTENANCE_MODE=true
//           (Production only) → Redeploy.
// Turn off: set it to "false" or delete it → Redeploy. Keep this file.
//
// Next 16 always runs proxy on the Node.js runtime — do NOT add
// `export const runtime` here (the build rejects it).

import { NextResponse, type NextRequest } from "next/server";

const MAINTENANCE_ON =
  process.env.MAINTENANCE_MODE === "true" || process.env.MAINTENANCE_MODE === "1";

// Keep in sync with `config.matcher`. Case-sensitive on purpose: App Router
// routes are case-sensitive (/Mainpage exists, /mainpage is a 404).
const BLOCKED_PREFIXES = [
  // auth + onboarding
  "/auth",
  "/reset-password",
  "/info-page",
  "/agreements",
  // user app
  "/Mainpage",
  "/ReportsPage",
  "/reports",
  "/DrugLookup",
  "/bin-search",
  "/InventoryView",
  "/group-reports",
  "/Notification",
  "/settings",
  "/how-to",
  "/coming-soon",
  "/dashboard",
  // admin
  "/admin",
  "/admin-dashboard",
  "/master-sheet",
  "/master-sheet-queue",
  "/ndc-sheet",
  "/supplier-mappings",
  "/publishing",
  "/report-listings",
  "/feedbacks",
];

function isBlocked(pathname: string): boolean {
  const path = pathname.replace(/\/+$/, "") || "/";
  // Exact segment match: "/admin" must not swallow "/admin-dashboard" and
  // "/reports" must not swallow "/report-listings" (each is listed on its own).
  return BLOCKED_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));
}

export default function proxy(request: NextRequest) {
  if (!MAINTENANCE_ON) return NextResponse.next();

  const { pathname } = request.nextUrl;

  // Loop guard + framework/static passthrough. Redundant with the matcher
  // today, but keeps this file safe if the matcher is ever widened.
  if (
    pathname === "/maintenance" ||
    pathname.startsWith("/maintenance/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    /\.[A-Za-z0-9]+$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (isBlocked(pathname)) {
    // 307 = temporary and never cached by browsers. new URL() drops any query
    // string and hash, which is intended.
    return NextResponse.redirect(new URL("/maintenance", request.url), 307);
  }

  return NextResponse.next();
}

export const config = {
  // Must be a literal array: Next extracts it statically at build time
  // (no variables, spreads or .map()). Patterns are compiled case-insensitively
  // and trailing-slash tolerant; the case-sensitive check lives in isBlocked().
  matcher: [
    "/auth/:path*",
    "/reset-password/:path*",
    "/info-page/:path*",
    "/agreements/:path*",
    "/Mainpage/:path*",
    "/ReportsPage/:path*",
    "/reports/:path*",
    "/DrugLookup/:path*",
    "/bin-search/:path*",
    "/InventoryView/:path*",
    "/group-reports/:path*",
    "/Notification/:path*",
    "/settings/:path*",
    "/how-to/:path*",
    "/coming-soon/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/admin-dashboard/:path*",
    "/master-sheet/:path*",
    "/master-sheet-queue/:path*",
    "/ndc-sheet/:path*",
    "/supplier-mappings/:path*",
    "/publishing/:path*",
    "/report-listings/:path*",
    "/feedbacks/:path*",
  ],
};
