import { useState } from "react";
import { X } from "lucide-react";
import StepIndicator from "./StepIndicator";
import NameReportStep from "./NameReportStep";
import DateRangeStep from "./DateRangeStep";
import UploadInventoryStep from "./UploadInventoryStep";
import UploadWholesalersStep, {
  defaultWholesalers,
} from "./UploadWholesalersStep";
import { Button } from "@/components/ui/button";
// import { toast } from "@/components/ui/use-toast";

interface Wholesaler {
  id: string;
  name: string;
  file: File | null;
}

const steps = [
  { id: 1, label: "NAME", sublabel: "Name" },
  { id: 2, label: "SELECT", sublabel: "Date" },
  { id: 3, label: "UPLOAD", sublabel: "Inventory" },
  { id: 4, label: "UPLOAD", sublabel: "Supplier" },
];

const AuditWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 state
  const [auditName, setAuditName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Step 2 state
  const [inventoryStartDate, setInventoryStartDate] = useState<
    Date | undefined
  >();
  const [inventoryEndDate, setInventoryEndDate] = useState<Date | undefined>();
  const [wholesalerStartDate, setWholesalerStartDate] = useState<
    Date | undefined
  >();
  const [wholesalerEndDate, setWholesalerEndDate] = useState<
    Date | undefined
  >();

  // Step 3 state
  const [inventoryFile, setInventoryFile] = useState<File | null>(null);
  const [excludeTransferred, setExcludeTransferred] = useState(false);
  const [excludeUnbilled, setExcludeUnbilled] = useState(false);

  // Step 4 state
  const [wholesalers, setWholesalers] =
    useState<Wholesaler[]>(defaultWholesalers);

  const handleClose = () => {
    // Reset wizard
    setCurrentStep(1);
    setAuditName("");
    setAgreedToTerms(false);
    setInventoryStartDate(undefined);
    setInventoryEndDate(undefined);
    setWholesalerStartDate(undefined);
    setWholesalerEndDate(undefined);
    setInventoryFile(null);
    setExcludeTransferred(false);
    setExcludeUnbilled(false);
    setWholesalers(defaultWholesalers);
  };

  const handleStep1Continue = () => {
    setCurrentStep(2);
  };

  const handleStep2Continue = () => {
    setCurrentStep(3);
  };

  const handleStep3Next = () => {
    setCurrentStep(4);
  };

  const handleSkip = () => {
    alert({
      title: "Audit Created",
      description: `Your audit "${auditName}" has been created successfully.`,
    });
  };

  const handleAddSupplier = () => {
    const newId = String(wholesalers.length + 1);
    setWholesalers([
      ...wholesalers,
      { id: newId, name: `NEW SUPPLIER ${newId}`, file: null },
    ]);
  };

  const handleViewAudit = () => {
    alert({
      title: "Audit Ready",
      description: `Viewing audit "${auditName}"`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header with close button */}
      <div className="p-4">
        {/* <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="rounded-full border border-border"
        >
          <X className="w-4 h-4" />
        </Button> */}
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center px-4 py-10">
        {/* Step indicator */}
        <StepIndicator steps={steps} currentStep={currentStep} />

        {/* Step content */}
        <div className="w-full">
          {currentStep === 1 && (
            <NameReportStep
              auditName={auditName}
              setAuditName={setAuditName}
              agreedToTerms={agreedToTerms}
              setAgreedToTerms={setAgreedToTerms}
              onContinue={handleStep1Continue}
            />
          )}

          {currentStep === 2 && (
            <DateRangeStep
              inventoryStartDate={inventoryStartDate}
              setInventoryStartDate={setInventoryStartDate}
              inventoryEndDate={inventoryEndDate}
              setInventoryEndDate={setInventoryEndDate}
              wholesalerStartDate={wholesalerStartDate}
              setWholesalerStartDate={setWholesalerStartDate}
              wholesalerEndDate={wholesalerEndDate}
              setWholesalerEndDate={setWholesalerEndDate}
              onContinue={handleStep2Continue}
            />
          )}

          {currentStep === 3 && (
            <UploadInventoryStep
              inventoryFile={inventoryFile}
              setInventoryFile={setInventoryFile}
              excludeTransferred={excludeTransferred}
              setExcludeTransferred={setExcludeTransferred}
              excludeUnbilled={excludeUnbilled}
              setExcludeUnbilled={setExcludeUnbilled}
              onNext={handleStep3Next}
            />
          )}

          {currentStep === 4 && (
            <UploadWholesalersStep
              wholesalers={wholesalers}
              setWholesalers={setWholesalers}
              onSkip={handleSkip}
              onAddSupplier={handleAddSupplier}
              onViewAudit={handleViewAudit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditWizard;
