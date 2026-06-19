// "use client";

// import { Linkedin, X } from "lucide-react";
// import Image from "next/image";
// import "../app/landing.css";

// const Logo = () => (
//   <div className="flex items-center">
//     <div className="relative h-30 w-40 shrink-0">
//       <a href="/">
//         <Image
//           src="/l1.png"
//           alt="AuditProRx"
//           fill
//           priority
//           sizes="200px"
//           className="object-contain object-left"
//         />
//       </a>
//     </div>
//   </div>
// );

// const currentYear = new Date().getFullYear();

// export default function Footer() {
//   return (
//     <footer className="py-14">
//       <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-8 px-4 sm:gap-10 sm:px-7 md:grid-cols-6">
//         <div className="col-span-2">
//           <Logo />
//           <p className="mt-4 max-w-xs text-sm text-muted-foreground">
//             The enterprise pharmacy operations platform trusted by pharmacy
//             groups nationwide.
//           </p>
//           <div className="mt-5 flex gap-2">
//             {[
//               {
//                 Icon: X,
//                 href: "https://x.com/auditprorx",
//                 label: "AuditProRx on X (Twitter)",
//               },
//               {
//                 Icon: Linkedin,
//                 href: "https://www.linkedin.com/company/auditprorx/",
//                 label: "AuditProRx on LinkedIn",
//               },
//             ].map(({ Icon, href, label }, i) => (
//               <a
//                 key={i}
//                 href={href}
//                 target="_blank"
//                 rel="noopener noreferrer me"
//                 aria-label={label}
//                 className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface text-muted-foreground hover:text-foreground transition-colors animate-fadeInUp"
//                 style={{ animationDelay: `${i * 0.1}s` }}
//               >
//                 <Icon className="h-4 w-4" />
//               </a>
//             ))}
//           </div>
//         </div>
//         {[
//           [
//             "Platform",
//             [
//               "Audit Management",
//               "Drug Lookup",
//               "Audit Reports",
//               "Pharmacy Network",
//               "Analytics",
//               "Pricing",
//             ],
//           ],
//           ["Company", ["About Us", "Careers", "Blog", "Press", "Contact"]],
//           [
//             "Legal",
//             [
//               "Privacy Policy",
//               "Terms of Service",
//               "Cancellation Policy",
//               "HIPAA Policy",
//             ],
//           ],
//           [
//             "Support",
//             [
//               "Documentation",
//               "Help Center",
//               "System Status",
//               "Remote Assistance",
//             ],
//           ],
//         ].map(([t, items]: any) => (
//           <div key={t}>
//             <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
//               {t}
//             </div>
//             <ul className="mt-4 space-y-2 text-sm">
//               {items.map((i: string) => {
//                 // Links that have real pages keep redirecting to them.
//                 // Links without a page (e.g. HIPAA Policy) point to "#".
//                 const livePages = [
//                   "Privacy Policy",
//                   "Terms of Service",
//                   "Cancellation Policy",
//                 ];
//                 const href = livePages.includes(i)
//                   ? `/${i.toLowerCase().replace(/\s+/g, "-")}`
//                   : "#";
//                 return (
//                   <li key={i}>
//                     <a
//                       href={href}
//                       className="text-foreground/80 hover:text-foreground transition-colors animate-fadeInUp"
//                     >
//                       {i}
//                     </a>
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>
//         ))}
//       </div>
//       <div className="mx-auto mt-12 flex max-w-[1280px] flex-col items-center gap-4 border-t border-border px-4 pt-6 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-7 sm:text-left">
//         <span>© {currentYear} AuditProRx. All rights reserved.</span>
//         <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
//           <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 animate-fadeInUp stagger-0">
//             <span className="h-1.5 w-1.5 rounded-full bg-success" />
//             All systems operational
//           </span>
//           <span>HIPAA Compliant Platform</span>
//         </div>
//       </div>
//     </footer>
//   );
// }

// "use client";

// import { Linkedin, Facebook, Instagram, Youtube } from "lucide-react";
// import Image from "next/image";
// import "../app/landing.css";

// const XLogo = ({ className }: { className?: string }) => (
//   <svg
//     viewBox="0 0 24 24"
//     fill="currentColor"
//     className={className}
//     aria-hidden="true"
//   >
//     <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.829L0 1.153h7.594l5.243 6.932L18.901 1.153zm-1.29 19.494h2.039L6.486 3.24H4.298l13.313 17.407z" />
//   </svg>
// );

// const Logo = () => (
//   <div className="flex items-center">
//     <div className="relative h-36 w-52 shrink-0">
//       <a href="/">
//         <Image
//           src="/l1.png"
//           alt="AuditProRx"
//           fill
//           priority
//           sizes="250px"
//           className="object-contain object-left"
//         />
//       </a>
//     </div>
//   </div>
// );

// const currentYear = new Date().getFullYear();

// const footerSections = [
//   [
//     "Platform",
//     [
//       "Capabilities",
//       "Drug Intelligence",
//       "Audit Reports",
//       "Inventory Exchange",
//       "Reimbursement Leads",
//       "Pricing",
//     ],
//   ],
//   ["Company", ["About Us", "Careers", "Contact"]],
//   ["Legal", ["Privacy Policy", "Terms of Service", "Cancellation Policy"]],
//   ["Support", ["Documentation", "Help Center", "Remote Assistance"]],
// ];

// const pageLinks: Record<string, string> = {
//   // Platform
//   Capabilities: "#features",
//   "Drug Intelligence": "#drug-lookup",
//   "Audit Reports": "#audit-reports",
//   "Inventory Exchange": "#inventory-view",
//   "Reimbursement Leads": "#leads",
//   Pricing: "#pricing",

//   // Company
//   "About Us": "/company/about-us",
//   Careers: "/company/careers",
//   Contact: "/company/contact",

//   // Legal
//   "Privacy Policy": "/privacy-policy",
//   "Terms of Service": "/terms-of-service",
//   "Cancellation Policy": "/cancellation-policy",

//   // Support
//   Documentation: "/support/documentation",
//   "Help Center": "/support/help-center",
//   "Remote Assistance": "/support/remote-assistance",
// };

// export default function Footer() {
//   return (
//     <footer className="py-14">
//       <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-8 px-4 sm:gap-10 sm:px-7 md:grid-cols-6">
//         <div className="col-span-2">
//           <Logo />

//           <p className="mt-4 max-w-xs text-sm text-muted-foreground">
//             The enterprise pharmacy operations platform trusted by pharmacy
//             groups nationwide.
//           </p>

//           <div className="mt-5 flex gap-2">
//             {[
//               {
//                 Icon: XLogo,
//                 href: "https://x.com/auditprorx",
//                 label: "AuditProRx on X",
//               },
//               {
//                 Icon: Linkedin,
//                 href: "https://www.linkedin.com/company/auditprorx/",
//                 label: "AuditProRx on LinkedIn",
//               },
//               {
//                 Icon: Facebook,
//                 href: "#",
//                 label: "AuditProRx on Facebook",
//               },
//               {
//                 Icon: Instagram,
//                 href: "#",
//                 label: "AuditProRx on Instagram",
//               },
//               {
//                 Icon: Youtube,
//                 href: "#",
//                 label: "AuditProRx on YouTube",
//               },
//             ].map(({ Icon, href, label }, i) => (
//               <a
//                 key={i}
//                 href={href}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 aria-label={label}
//                 className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface text-muted-foreground hover:text-foreground transition-colors animate-fadeInUp"
//                 style={{ animationDelay: `${i * 0.1}s` }}
//               >
//                 <Icon className="h-4 w-4" />
//               </a>
//             ))}
//           </div>
//         </div>

//         {footerSections.map(([title, items]: any) => (
//           <div key={title}>
//             <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
//               {title}
//             </div>

//             <ul className="mt-4 space-y-2 text-sm">
//               {items.map((item: string) => (
//                 <li key={item}>
//                   <a
//                     href={pageLinks[item] || "#"}
//                     className="text-foreground/80 hover:text-foreground transition-colors animate-fadeInUp"
//                   >
//                     {item}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ))}
//       </div>

//       <div className="mx-auto mt-12 flex max-w-[1280px] flex-col items-center gap-4 border-t border-border px-4 pt-6 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-7 sm:text-left">
//         <span>© {currentYear} AuditProRx. All rights reserved.</span>

//         <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
//           <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 animate-fadeInUp stagger-0">
//             <span className="h-1.5 w-1.5 rounded-full bg-success" />
//             All systems operational
//           </span>

//           <span>HIPAA Compliant Platform</span>
//         </div>
//       </div>
//     </footer>
//   );
// }

"use client";

import { Linkedin, Facebook, Instagram, Youtube } from "lucide-react";
import Image from "next/image";
import "../app/landing.css";

const XLogo = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.847h-7.406l-5.8-7.584-6.64 7.584H.47l8.6-9.829L0 1.153h7.594l5.243 6.932L18.901 1.153zm-1.29 19.494h2.039L6.486 3.24H4.298l13.313 17.407z" />
  </svg>
);

const Logo = () => (
  <div className="flex items-center">
    <div className="relative h-36 w-52 shrink-0">
      <a href="/">
        <Image
          src="/l1.png"
          alt="AuditProRx"
          fill
          priority
          sizes="250px"
          className="object-contain object-left"
        />
      </a>
    </div>
  </div>
);

const currentYear = new Date().getFullYear();

// Turn a label into a url slug: "Remote Assistance" -> "remote-assistance"
const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

// Build {label, href} pairs under a fixed base path. The base is applied to
// EVERY item, so a section's links can never come out without their prefix.
const linksUnder = (base: string, labels: string[]) =>
  labels.map((label) => ({ label, href: `${base}/${slug(label)}` }));

const footerSections = [
  {
    title: "Platform",
    // In-page anchors. Root-relative (/#...) so they also work from subpages.
    links: [
      { label: "Capabilities", href: "/#features" },
      { label: "Drug Intelligence", href: "/#drug-lookup" },
      { label: "Audit Reports", href: "/#audit-reports" },
      { label: "Inventory Exchange", href: "/#inventory-view" },
      { label: "Reimbursement Leads", href: "/#leads" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    title: "Company",
    links: linksUnder("/company", ["About Us", "Careers", "Contact"]),
  },
  {
    title: "Legal",
    links: linksUnder("", [
      "Privacy Policy",
      "Terms of Service",
      "Cancellation Policy",
    ]),
  },
  {
    title: "Support",
    links: linksUnder("/support", [
      "Documentation",
      "Help Center",
      "Remote Assistance",
    ]),
  },
];

export default function Footer() {
  return (
    <footer className="py-14">
      <div className="mx-auto grid max-w-[1280px] grid-cols-2 gap-8 px-4 sm:gap-10 sm:px-7 md:grid-cols-6">
        <div className="col-span-2">
          <Logo />

          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            The enterprise pharmacy operations platform trusted by pharmacy
            groups nationwide.
          </p>

          <div className="mt-5 flex gap-2">
            {[
              {
                Icon: XLogo,
                href: "https://x.com/auditprorx",
                label: "AuditProRx on X",
              },
              {
                Icon: Linkedin,
                href: "https://www.linkedin.com/company/auditprorx/",
                label: "AuditProRx on LinkedIn",
              },
              {
                Icon: Facebook,
                href: "#",
                label: "AuditProRx on Facebook",
              },
              {
                Icon: Instagram,
                href: "#",
                label: "AuditProRx on Instagram",
              },
              {
                Icon: Youtube,
                href: "#",
                label: "AuditProRx on YouTube",
              },
            ].map(({ Icon, href, label }, i) => (
              <a
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface text-muted-foreground hover:text-foreground transition-colors animate-fadeInUp"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {footerSections.map(({ title, links }) => (
          <div key={title}>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {title}
            </div>

            <ul className="mt-4 space-y-2 text-sm">
              {links.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="text-foreground/80 hover:text-foreground transition-colors animate-fadeInUp"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-[1280px] flex-col items-center gap-4 border-t border-border px-4 pt-6 text-center text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-7 sm:text-left">
        <span>© {currentYear} AuditProRx. All rights reserved.</span>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 animate-fadeInUp stagger-0">
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
            All systems operational
          </span>

          <span>HIPAA Compliant Platform</span>
        </div>
      </div>
    </footer>
  );
}
