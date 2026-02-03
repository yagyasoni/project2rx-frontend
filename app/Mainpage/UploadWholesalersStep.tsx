import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, MoreVertical, Plus, Eye } from "lucide-react";

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
  // { id: "5", name: "KINRAY", file: null },
];

const UploadWholesalersStep = ({
  wholesalers,
  setWholesalers,
  onSkip,
  onAddSupplier,
  onViewAudit,
}: UploadWholesalersStepProps) => {
  const handleFileChange = (id: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setWholesalers(
      wholesalers.map((w) => (w.id === id ? { ...w, file } : w))
    );
  };

  return (
    <div className="w-xl">
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
              className="flex items-center justify-between border border-border rounded-lg px-4 py-3"
            >
              <span className="font-medium text-foreground text-sm">
                {wholesaler.name}
              </span>
              <div className="flex items-center gap-2">
                <label htmlFor={`wholesaler-${wholesaler.id}`}>
                  <Button variant="ghost" size="sm" className="cursor-pointer" asChild>
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
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-border">
          <Button className="bg-gradient-to-r from-[#0D0D0D] to-[#404040] text-white transition" variant="outline" onClick={onSkip}>
            Skip
          </Button>
          <Button className="cursor-pointer" variant="default" onClick={onAddSupplier}>
            <Plus className="w-4 h-4 mr-1" />
            Add Supplier
          </Button>
          <Button className="bg-gradient-to-r from-[#0D0D0D] to-[#404040] text-white transition" variant="outline" onClick={onViewAudit}>
            <Eye className="w-4 h-4 mr-1" />
            View Audit
          </Button>
        </div>
      </div>
    </div>
  );
};

export { defaultWholesalers };
export default UploadWholesalersStep;
