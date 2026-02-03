import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";

interface UploadInventoryStepProps {
  inventoryFile: File | null;
  setInventoryFile: (file: File | null) => void;
  excludeTransferred: boolean;
  setExcludeTransferred: (exclude: boolean) => void;
  excludeUnbilled: boolean;
  setExcludeUnbilled: (exclude: boolean) => void;
  onNext: () => void;
}

const UploadInventoryStep = ({
  inventoryFile,
  setInventoryFile,
  excludeTransferred,
  setExcludeTransferred,
  excludeUnbilled,
  setExcludeUnbilled,
  onNext,
}: UploadInventoryStepProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setInventoryFile(file);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">
          Upload your inventory files
        </h2>

        <div className="space-y-6">
          {/* Upload area */}
          <div className="border-2 border-dashed border-primary/40 rounded-lg p-4 bg-primary/5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">PRIMERX</span>
              <label htmlFor="inventory-file">
                <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                  <span>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload file
                  </span>
                </Button>
                <input
                  id="inventory-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".csv,.xlsx,.xls"
                />
              </label>
            </div>
            {inventoryFile && (
              <p className="text-sm text-muted-foreground mt-2">
                Selected: {inventoryFile.name}
              </p>
            )}
          </div>

          {/* Exclude options */}
          <div className="text-center space-y-4">
            <p className="text-sm text-foreground">
              Make sure to <span className="underline font-medium">EXCLUDE</span> these options before running the report.
            </p>
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="excludeTransferred"
                  checked={excludeTransferred}
                  onCheckedChange={(checked : boolean) => setExcludeTransferred(checked === true)}
                />
                <Label htmlFor="excludeTransferred" className="text-sm text-foreground">
                  Exclude Transferred Out
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="excludeUnbilled"
                  checked={excludeUnbilled}
                  onCheckedChange={(checked : boolean) => setExcludeUnbilled(checked === true)}
                />
                <Label htmlFor="excludeUnbilled" className="text-sm text-foreground">
                  Exclude Unbilled
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button
              onClick={onNext}
              disabled={!inventoryFile}
              className="px-8 bg-gradient-to-r from-[#0D0D0D] to-[#404040] text-white transition"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadInventoryStep;
