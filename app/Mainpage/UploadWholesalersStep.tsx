import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, MoreVertical, Plus, Eye, Check } from "lucide-react";
import axios from "axios";

interface Wholesaler {
  id: string;
  name: string;
  file: File | null;
}

interface UploadWholesalersStepProps {
  wholesalers: Wholesaler[];
  setWholesalers: (wholesalers: Wholesaler[]) => void;
  onSkip: () => void;
  onAddSupplier: () => void;
  onViewAudit: () => void;
}

const defaultWholesalers: Wholesaler[] = [
  { id: "1", name: "AXIA", file: null },
  { id: "2", name: "CITYMED", file: null },
  { id: "3", name: "DRUGZONE", file: null },
  { id: "4", name: "EZRIRX", file: null },
];

const UploadWholesalersStep = ({
  wholesalers,
  setWholesalers,
  onSkip,
  onAddSupplier,
  onViewAudit,
}: UploadWholesalersStepProps) => {
  const [edit, setEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedInDrawer, setSelectedInDrawer] = useState<string[]>([]);

  // Available options for the drawer
  const availableSuppliers = [
    "340B",
    "ABC",
    "AKRON GENERICS",
    "ALPINE HEALTH",
    "ANDA",
    "APD",
    "API",
    "ASTOR DRUGS",
    "ATLAND",
    "AUBURN",
    "AYTU BIOPHARMA",
    "BESSE",
    "BIORIDGE",
    "BLUPAX",
    "BONITA",
    "CARDINAL",
    "COCHRAN WHOLESALE PHARMACEUTICAL",
    "DB DIAGNOSTICS",
    "DOCKSIDE PARTNERS",
    "EXELTIS",
    "FFF ENTERPRISES",
    "GALT DIRECT",
    "GEMCO MEDICAL",
    "GENETCO",
    "GLENVIEW PHARMA",
    "GREEN HILL TRADING",
    "GSK",
    "HEALTHSOURCE",
    "HYGEN PHARMACEUTICALS",
    "ICS DIRECT",
    "INDEPENDENT PHARMACEUTICAL",
    "INTEGRAL RX",
    "IPC",
    "IPD",
    "IXTHUS",
    "JAMRX",
    "JG",
    "JOURNEY",
    "KARES",
    "KEYSOURCE",
    "LANDMARK",
    "MAKS PHARMA",
    "MASTERS",
    "MATCHRX",
    "MATRIX",
    "MCKESSON",
    "MODERNA DIRECT",
    "NETCOSTRX",
    "NEW SUPPLIER 1",
    "NEW SUPPLIER 2",
    "NEW SUPPLIER 3",
    "NEW SUPPLIER 4",
    "NORTHEAST MEDICAL",
    "NUMED",
    "OAK DRUGS",
    "PAYLESS",
    "PBA HEALTH",
    "PFIZER DIRECT",
    "PHARMSAVER",
    "PHARMSOURCE",
    "PILL R HEALTH (340B)",
    "PRESCRIPTION SUPPLY",
    "PRIMED",
    "PRODIGY",
    "PRX WHOLESALE",
    "QUALITY CARE",
    "QUEST PHARMACEUTICAL",
    "REPUBLIC",
    "RX MART",
    "RX ONE SHOP",
    "RXPOST",
    "SAVEBIGRX",
    "SECOND SOURCE RX",
    "SEQIRUS",
    "SMART SOURCE",
    "SMITH DRUGS",
    "SOUTH POINTE",
    "SPECTRUM",
    "STARTING INVENTORY 1",
    "STARTING INVENTORY 2",
    "STARTING INVENTORY 3",
    "STERLING DISTRIBUTOR",
    "SURECOST",
    "TOPRX",
    "TRXADE",
    "VALUE DRUG",
    "VAXSERVE",
    "WELLGISTICS",
    "WESTERN WELLNES SOLUTION",
  ];

  const handleFileChange = (
    id: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] || null;
    setWholesalers(wholesalers.map((w) => (w.id === id ? { ...w, file } : w)));
  };

  const handleSubmit = async () => {
    try {
      const id = localStorage.getItem("auditId");
      if (!id) {
        alert("Audit not found");
        return;
      }

      const formData = new FormData();

      // build metadata array
      const metadata: { field: string; wholesaler_name: string }[] = [];

      wholesalers.forEach((w) => {
        if (w.file) {
          const fieldName = w.name.toLowerCase().replace(/\s+/g, "");
          metadata.push({
            field: fieldName,
            wholesaler_name: w.name,
          });

          formData.append(fieldName, w.file);
        }
      });

      // append metadata as string
      formData.append("metadata", JSON.stringify(metadata));

      const res = await axios.post(
        `http://localhost:5000/api/audits/${id}/wholesalers`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      console.log(res.data);
      alert("Files uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const handleDelete = (id: string) => {
    setWholesalers(wholesalers.filter((w) => w.id !== id));
    setEdit(false);
    setEditId(null);
  };

  const handleConfirmAddFromDrawer = () => {
    const newItems = selectedInDrawer.map((name) => ({
      id: Math.random().toString(36).substr(2, 9),
      name,
      file: null,
    }));
    setWholesalers([...wholesalers, ...newItems]);
    setSelectedInDrawer([]);
    setIsDrawerOpen(false);
  };

  return (
    <div className="w-xl relative">
      <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">
            Upload your wholesaler files
          </h2>
          <a href="#" className="text-sm text-primary hover:underline">
            Email Template
          </a>
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {wholesalers.map((wholesaler) => (
            <div
              key={wholesaler.id}
              className="relative flex items-center justify-between border border-border rounded-lg px-4 py-3"
            >
              <span className="font-medium text-foreground text-sm">
                {wholesaler.name}
              </span>
              <div className="flex items-center gap-2">
                <label htmlFor={`wholesaler-${wholesaler.id}`}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="cursor-pointer"
                    asChild
                  >
                    <span className="text-primary">
                      <Upload className="w-4 h-4 mr-1" />
                      Upload file
                    </span>
                  </Button>
                  <input
                    id={`wholesaler-${wholesaler.id}`}
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(wholesaler.id, e)}
                    accept=".csv,.xlsx,.xls"
                  />
                </label>
                {wholesaler.file && (
                  <span className="text-xs text-muted-foreground truncate max-w-24">
                    {wholesaler.file.name}
                  </span>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setEdit(!edit || editId !== wholesaler.id);
                    setEditId(wholesaler.id);
                  }}
                >
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>

              {/* DELETE POPUP - Background set to White */}
              {edit && editId === wholesaler.id && (
                <div className="absolute right-2 top-10 w-[max-content] bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                  <button
                    onClick={() => handleDelete(wholesaler.id)}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-border">
          <Button
            className="bg-gradient-to-r from-[#0D0D0D] to-[#404040] text-white transition"
            variant="outline"
            onClick={onSkip}
          >
            Skip
          </Button>
          <Button
            className="cursor-pointer"
            variant="default"
            onClick={() => setIsDrawerOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Supplier
          </Button>
          <Button
            className="bg-gradient-to-r from-[#0D0D0D] to-[#404040] text-white transition"
            variant="outline"
            onClick={handleSubmit}
          >
            <Eye className="w-4 h-4 mr-1" />
            View Audit
          </Button>
        </div>
      </div>

      {/* RIGHT SIDE DRAWER - Background set to White */}
      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 p-6 flex flex-col">
            <h3 className="text-xl font-bold mb-4">Select Suppliers</h3>
            <div className="flex-1 space-y-2 overflow-y-auto">
              {availableSuppliers.map((name) => (
                <div
                  key={name}
                  onClick={() => {
                    setSelectedInDrawer((prev) =>
                      prev.includes(name)
                        ? prev.filter((i) => i !== name)
                        : [...prev, name],
                    );
                  }}
                  className={`flex items-center justify-between p-3 border rounded-md cursor-pointer ${selectedInDrawer.includes(name) ? "border-primary bg-primary/5" : "border-gray-100"}`}
                >
                  <span className="text-sm font-medium">{name}</span>
                  {selectedInDrawer.includes(name) && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              <Button
                className="flex-1 bg-gradient-to-r from-[#0D0D0D] to-[#404040] text-white transition"
                variant="outline"
                onClick={() => setIsDrawerOpen(false)}
              >
                Cancel
              </Button>
              <Button className="flex-1" onClick={handleConfirmAddFromDrawer}>
                Add Selected
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export { defaultWholesalers };
export default UploadWholesalersStep;
