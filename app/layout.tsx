// "use client";

// import "./globals.css";
// import { Toaster } from "@/components/ui/sonner";
// import { SupplierProvider } from "@/context/SupplierContext";
// import InactiveAccount from "@/components/inactiveAccount";

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const role = localStorage.getItem("role");

//   return (
//     <html lang="en">
//       <body>
//         {role !== "admin" ? <InactiveAccount /> : null}
//         <Toaster />
//         <SupplierProvider>{children}</SupplierProvider>
//       </body>
//     </html>
//   );
// }

"use client";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SupplierProvider } from "@/context/SupplierContext";
import InactiveAccount from "@/components/inactiveAccount";
import { useEffect, useState } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  function BetaBanner() {
    const subject = encodeURIComponent("Beta Support Request");
    const body = encodeURIComponent(
      "Hello Support Team,\n\nI am experiencing an issue while using the beta version of the application.\n\nDetails:\n- Issue:\n- Steps to reproduce:\n\nThank you.",
    );

    return (
      <div className="w-full bg-black text-white text-sm py-2 px-4 text-center border-b border-gray-800">
        <span className="font-semibold">Beta</span> — This application is
        currently in testing. Some features may not work as expected.{" "}
        <a
          href={`https://mail.google.com/mail/?view=cm&fs=1&to=drugdroprx@gmail.com&su=${subject}&body=${body}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-300"
        >
          Contact support
        </a>{" "}
        for any issues or feedback.
      </div>
    );
  }

  return (
    <html lang="en">
      <body>
        <BetaBanner />
        {/* ✅ Only show after role is loaded */}
        {role !== null && role !== "admin" ? <InactiveAccount /> : null}

        <Toaster />
        <SupplierProvider>{children}</SupplierProvider>
      </body>
    </html>
  );
}
