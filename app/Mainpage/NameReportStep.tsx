import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";

interface NameReportStepProps {
  auditName: string;
  setAuditName: (name: string) => void;
  agreedToTerms: boolean;
  setAgreedToTerms: (agreed: boolean) => void;
  onContinue: () => void;
}

const NameReportStep = ({
  auditName,
  setAuditName,
  agreedToTerms,
  setAgreedToTerms,
  onContinue,
}: NameReportStepProps) => {
  const isValid = auditName.trim() !== "" && agreedToTerms;

  const handleSubmit = async () => {
    const name: string = auditName;
    try {
      const res = await axios.post("http://localhost:5000/api/audits", {
        name,
      });
      console.log(res.data);
      localStorage.setItem("auditId", res.data.id);
      alert("success");
      onContinue();
    } catch (err) {
      alert("failed");
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-foreground text-center mb-8">
          Let's name your inventory report
        </h2>

        <div className="space-y-6">
          <div className="space-y-4">
            <Label
              htmlFor="auditName"
              className="text-sm font-medium text-foreground"
            >
              Inventory Audit Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="auditName"
              placeholder="Enter audit name"
              value={auditName}
              onChange={(e) => setAuditName(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={agreedToTerms}
              onCheckedChange={(checked: boolean) =>
                setAgreedToTerms(checked === true)
              }
            />
            <Label htmlFor="terms" className="text-sm text-foreground">
              I agree to the Terms of Service.{" "}
              <a
                href="#"
                className="text-foreground underline font-medium hover:text-primary"
              >
                Read more
              </a>
            </Label>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={() => {
                handleSubmit();
                // onContinue;
              }}
              disabled={!isValid}
              className="px-8 bg-gradient-to-r from-[#0D0D0D] to-[#404040] text-white transition"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameReportStep;
