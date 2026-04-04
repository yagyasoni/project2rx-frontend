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

  return (
    <html lang="en">
      <body>
        {/* ✅ Only show after role is loaded */}
        {role !== null && role !== "admin" ? <InactiveAccount /> : null}

        <Toaster />
        <SupplierProvider>{children}</SupplierProvider>
      </body>
    </html>
  );
}
