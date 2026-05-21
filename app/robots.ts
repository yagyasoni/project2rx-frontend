import type { MetadataRoute } from "next";

const SITE_URL = "https://www.auditprorx.com";

const PROTECTED_PATHS = [
  "/api/",
  "/admin",
  "/admin/",
  "/admin-dashboard",
  "/admin-dashboard/",
  "/Mainpage",
  "/Mainpage/",
  "/ReportsPage",
  "/ReportsPage/",
  "/reports/",
  "/InventoryView",
  "/InventoryView/",
  "/DrugLookup",
  "/DrugLookup/",
  "/bin-search",
  "/bin-search/",
  "/how-to",
  "/how-to/",
  "/settings",
  "/settings/",
  "/Notification",
  "/Notification/",
  "/agreements",
  "/agreements/",
  "/supplier-mappings",
  "/supplier-mappings/",
  "/master-sheet",
  "/master-sheet/",
  "/master-sheet-queue",
  "/master-sheet-queue/",
  "/publishing",
  "/publishing/",
  "/feedbacks",
  "/feedbacks/",
  "/dashboard",
  "/dashboard/",
  "/reset-password",
  "/reset-password/",
  "/info-page",
  "/info-page/",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: PROTECTED_PATHS,
      },
      {
        userAgent: "Googlebot",
        allow: ["/"],
        disallow: PROTECTED_PATHS,
      },
      {
        userAgent: "Bingbot",
        allow: ["/"],
        disallow: PROTECTED_PATHS,
      },
      {
        userAgent: "GPTBot",
        allow: ["/"],
        disallow: PROTECTED_PATHS,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
