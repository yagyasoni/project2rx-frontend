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
