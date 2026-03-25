// "use client";

// import axios from "axios";
// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { FileText, Download, Eye } from "lucide-react";
// import { toast } from "sonner";
// import api from "@/lib/api";

// const files = [
//   { label: "Pharmacy License", type: "license_file" },
//   { label: "DEA File", type: "dea_file" },
//   { label: "CDS File", type: "cds_file" },
//   { label: "Pharmacist License", type: "pharmacist_file" },
//   { label: "CMEA Certificate", type: "cmea_file" },
//   { label: "EIN Document", type: "ein_file" },
//   { label: "Liability Insurance", type: "liability_insurance_file" },
//   { label: "Workers Compensation", type: "workers_comp_file" },
//   { label: "Surety Bond", type: "surety_bond_file" },
//   { label: "Voided Cheque", type: "voided_cheque_file" },
// ];

// const PharmacyDocs = () => {
//   const [loading, setLoading] = useState<string | null>(null);

//   const fetchBlob = async (type: string) => {
//     const token = localStorage.getItem("accessToken");

//     const res = await api.get(`/auth/pharmacy-file/${type}`, {
//       responseType: "blob",
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     // ✅ Use actual MIME type from response headers, not hardcoded
//     const mimeType = res.headers["content-type"] || "application/octet-stream";
//     const blob = new Blob([res.data], { type: mimeType });
//     return { blob, mimeType };
//   };

//   const handleView = async (type: string) => {
//     try {
//       setLoading(type);
//       const { blob } = await fetchBlob(type);
//       const url = window.URL.createObjectURL(blob);
//       window.open(url, "_blank");
//       setTimeout(() => window.URL.revokeObjectURL(url), 10000);
//     } catch {
//       toast.error("Unable to fetch file");
//     } finally {
//       setLoading(null);
//     }
//   };

//   const handleDownload = async (type: string) => {
//     try {
//       setLoading(type);
//       const { blob, mimeType } = await fetchBlob(type);
//       const url = window.URL.createObjectURL(blob);

//       // ✅ Derive correct extension from actual MIME type
//       const extMap: Record<string, string> = {
//         "application/pdf": "pdf",
//         "image/jpeg": "jpg",
//         "image/png": "png",
//         "image/gif": "gif",
//         "image/bmp": "bmp",
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
//           "docx",
//       };
//       const ext = extMap[mimeType] || "bin";

//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `${type}.${ext}`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       setTimeout(() => window.URL.revokeObjectURL(url), 10000);
//     } catch {
//       toast.error("Download failed");
//     } finally {
//       setLoading(null);
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <div className="bg-card border border-border rounded-2xl p-6">
//         {/* <h2 className="text-lg font-semibold text-foreground mb-6">
//           Pharmacy Documents
//         </h2> */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {files.map((file) => (
//             <div
//               key={file.type}
//               className="border border-border rounded-xl bg-input p-4 flex flex-col justify-between hover:border-muted-foreground transition-colors"
//             >
//               <div className="flex items-center gap-3 mb-4">
//                 <FileText size={18} className="text-muted-foreground" />
//                 <span className="text-sm font-medium text-foreground">
//                   {file.label}
//                 </span>
//               </div>
//               <div className="flex gap-2">
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   className="flex-1 border-border"
//                   disabled={loading === file.type}
//                   onClick={() => handleView(file.type)}
//                 >
//                   <Eye size={14} className="mr-1" />
//                   View
//                 </Button>
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   className="flex-1 border-border"
//                   disabled={loading === file.type}
//                   onClick={() => handleDownload(file.type)}
//                 >
//                   <Download size={14} className="mr-1" />
//                   Save
//                 </Button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PharmacyDocs;

"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Copy } from "lucide-react";

interface Pharmacy {
  pharmacy_name: string;
  address: string;
  phone: string;
  fax: string;
}

const PharmacyDetails = () => {
  const [pharmacy, setPharmacy] = useState<Pharmacy | null>(null);
  const [loading, setLoading] = useState(true);

  const copyToClipboard = (text: any, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  useEffect(() => {
    const fetchPharmacy = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        const res = await api.get("/auth/pharmacy-details", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPharmacy(res?.data?.pharmacy);
      } catch (err) {
        console.log("Error fetching pharmacy details");
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacy();
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-muted-foreground">
        Loading Pharmacy Details...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-card border border-border rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-6">
          Pharmacy Details
        </h2>

        <div className="space-y-4">
          {/* Row Item */}
          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-muted-foreground">Pharmacy Name :</span>
            <div className="flex items-center gap-2 max-w-[60%]">
              <span className="text-foreground font-medium">
                {pharmacy?.pharmacy_name || "-"}
              </span>
              <button
                onClick={() => copyToClipboard(pharmacy?.pharmacy_name, "Name")}
                className="text-muted-foreground hover:text-foreground"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>

          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-muted-foreground">Address :</span>
            <div className="flex items-center gap-2 max-w-[60%]">
              <span className="text-foreground font-medium">
                {pharmacy?.address || "-"}
              </span>
              <button
                onClick={() => copyToClipboard(pharmacy?.address, "Address")}
                className="text-muted-foreground hover:text-foreground"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>

          <div className="flex justify-between border-b border-border pb-2">
            <span className="text-muted-foreground">Phone :</span>
            <div className="flex items-center gap-2 max-w-[60%]">
              <span className="text-foreground font-medium">
                {pharmacy?.phone || "-"}
              </span>
              <button
                onClick={() => copyToClipboard(pharmacy?.phone, "Fax")}
                className="text-muted-foreground hover:text-foreground"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>

          <div className="flex justify-between">
            <span className="text-muted-foreground">Fax :</span>
            <div className="flex items-center gap-2 max-w-[60%]">
              <span className="text-foreground font-medium">
                {pharmacy?.fax || "-"}
              </span>
              <button
                onClick={() => copyToClipboard(pharmacy?.fax, "Fax")}
                className="text-muted-foreground hover:text-foreground"
              >
                <Copy size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDetails;
