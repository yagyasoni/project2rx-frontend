import { useState, useEffect } from "react";
import axios from "axios";
import { X, ArrowLeft } from "lucide-react";
import StepIndicator from "./StepIndicator";
import NameReportStep from "./NameReportStep";
import DateRangeStep from "./DateRangeStep";
import UploadInventoryStep from "./UploadInventoryStep";
import UploadWholesalersStep, {
  defaultWholesalers,
} from "./UploadWholesalersStep";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

interface AuditWizardProps {
  initialStep?: number;
  initialAuditId?: string | null;
}

const AuditWizard = ({
  initialStep = 1,
  initialAuditId = null,
}: AuditWizardProps) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [auditId, setAuditId] = useState<string | null>(initialAuditId);

  // ✅ Edit mode: any time we arrive with an existing auditId
  const isEditMode = !!initialAuditId;

  // Step 1 state
  const [auditName, setAuditName] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Step 2 state
  const [inventoryStartDate, setInventoryStartDate] = useState<Date | undefined>();
  const [inventoryEndDate, setInventoryEndDate] = useState<Date | undefined>();
  const [wholesalerStartDate, setWholesalerStartDate] = useState<Date | undefined>();
  const [wholesalerEndDate, setWholesalerEndDate] = useState<Date | undefined>();

  // Step 3 state
  const [inventoryFile, setInventoryFile] = useState<File | null>(null);
  const [excludeTransferred, setExcludeTransferred] = useState(true);
  const [excludeUnbilled, setExcludeUnbilled] = useState(true);

  // Step 4 state
  const [wholesalers, setWholesalers] = useState<Wholesaler[]>(defaultWholesalers);

  // ✅ Prefill state from existing audit when in edit mode
  useEffect(() => {
    if (!initialAuditId) return;
    localStorage.setItem("auditId", initialAuditId);

    axios
      .get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/${initialAuditId}`,
      )
      .then((res) => {
        const a = res.data || {};
        if (a.name) setAuditName(a.name);
        setAgreedToTerms(true); // already agreed when audit was created

        if (a.inventory_start_date)
          setInventoryStartDate(new Date(a.inventory_start_date));
        if (a.inventory_end_date)
          setInventoryEndDate(new Date(a.inventory_end_date));
        if (a.wholesaler_start_date)
          setWholesalerStartDate(new Date(a.wholesaler_start_date));
        if (a.wholesaler_end_date)
          setWholesalerEndDate(new Date(a.wholesaler_end_date));
      })
      .catch((err) => {
        console.warn("Failed to prefill audit:", err?.message);
      });
  }, [initialAuditId]);

  const handleClose = () => {
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

  const handleStep1Continue = () => setCurrentStep(2);
  const handleStep2Continue = () => setCurrentStep(3);
  const handleStep3Next = () => setCurrentStep(4);

  const handleSkip = () => {
    toast(`Your audit "${auditName}" has been created successfully.`);
  };

  const handleAddSupplier = () => {
    const newId = String(wholesalers.length + 1);
    setWholesalers([
      ...wholesalers,
      { id: newId, name: `NEW SUPPLIER ${newId}`, file: null },
    ]);
  };

  const handleViewAudit = () => {
    toast(`Viewing audit "${auditName}"`);
  };

  // ✅ In edit mode, allow clicking any step. Otherwise, only past steps.
  const handleStepClick = (stepId: number) => {
    if (isEditMode || stepId < currentStep) {
      setCurrentStep(stepId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4" />

      <div className="flex-1 flex flex-col items-center px-4 py-10">
        <StepIndicator
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          isEditMode={isEditMode}
        />

        {currentStep > 1 && (
          <button
            onClick={() => setCurrentStep(currentStep - 1)}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors mb-6 self-start"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
        )}

        <div className="w-full">
          {currentStep === 1 && (
            <NameReportStep
              auditName={auditName}
              setAuditName={setAuditName}
              agreedToTerms={agreedToTerms}
              setAgreedToTerms={setAgreedToTerms}
              onContinue={handleStep1Continue}
              isEditMode={isEditMode}
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