"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Upload, Calendar, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import axios from "axios";

interface FileUpload {
  file: File | null;
  name: string;
}

const PharmacyDetailsForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pharmacy Info
  const [pharmacyName, setPharmacyName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [fax, setFax] = useState("");

  // License Numbers
  const [ncpdpNumber, setNcpdpNumber] = useState("");
  const [npiNumber, setNpiNumber] = useState("");
  const [pharmacyLicenseNumber, setPharmacyLicenseNumber] = useState("");
  const [licenseExpiryDate, setLicenseExpiryDate] = useState<
    Date | undefined
  >();

  // DEA
  const [deaNumber, setDeaNumber] = useState("");
  const [deaExpiryDate, setDeaExpiryDate] = useState<Date | undefined>();
  const [deaFile, setDeaFile] = useState<FileUpload>({ file: null, name: "" });

  // CDS
  const [cdsNumber, setCdsNumber] = useState("");
  const [cdsExpiry, setCdsExpiry] = useState<Date | undefined>();
  const [cdsFile, setCdsFile] = useState<FileUpload>({ file: null, name: "" });

  // Pharmacist In-Charge
  const [pharmacistName, setPharmacistName] = useState("");
  const [pharmacistLicenseNumber, setPharmacistLicenseNumber] = useState("");
  const [pharmacistExpiration, setPharmacistExpiration] = useState<
    Date | undefined
  >();
  const [pharmacistFile, setPharmacistFile] = useState<FileUpload>({
    file: null,
    name: "",
  });

  // CMEA
  const [cmeaExpiry, setCmeaExpiry] = useState<Date | undefined>();
  const [cmeaFile, setCmeaFile] = useState<FileUpload>({
    file: null,
    name: "",
  });

  // License file
  const [licenseFile, setLicenseFile] = useState<FileUpload>({
    file: null,
    name: "",
  });

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<FileUpload>>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setter({ file, name: file.name });
    }
  };

  const clearFile = (
    setter: React.Dispatch<React.SetStateAction<FileUpload>>,
  ) => {
    setter({ file: null, name: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pharmacyName || !address || !phone) {
      toast.error(
        "Missing required fields: Please fill in Pharmacy Name, Address, and Phone.",
      );
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    const formData = new FormData();
    formData.append("userId", localStorage.getItem("userId") || "");

    formData.append("pharmacyName", pharmacyName);
    formData.append("address", address);
    formData.append("phone", phone);
    formData.append("fax", fax);

    formData.append("ncpdpNumber", ncpdpNumber);
    formData.append("npiNumber", npiNumber);
    formData.append("pharmacyLicenseNumber", pharmacyLicenseNumber);

    if (licenseExpiryDate)
      formData.append("licenseExpiryDate", licenseExpiryDate.toISOString());

    if (licenseFile.file) formData.append("licenseFile", licenseFile.file);

    if (deaFile.file) formData.append("deaFile", deaFile.file);

    if (cdsFile.file) formData.append("cdsFile", cdsFile.file);

    if (pharmacistFile.file)
      formData.append("pharmacistFile", pharmacistFile.file);

    if (cmeaFile.file) formData.append("cmeaFile", cmeaFile.file);

    try {
      // TODO: Replace with actual API endpoint
      console.log("Submitting pharmacy details:", formData);

      // Simulate network delay
      const res = await axios.post(
        "http://localhost:5000/auth/pharmacy",
        formData,
      );
      console.log(res?.data);
      toast.success(
        "Details submitted successfully! Your pharmacy details have been saved.",
      );
      router.push("/auth");
    } catch {
      toast.error("Submission failed: Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const DatePickerField = ({
    label,
    date,
    setDate,
  }: {
    label: string;
    date: Date | undefined;
    setDate: (d: Date | undefined) => void;
  }) => (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full h-12 justify-start text-left font-normal bg-input border-border text-foreground",
              !date && "text-muted-foreground",
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {date ? format(date, "MM/dd/yyyy") : "Select date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          {/* <div className="[&_.rdp-head_cell]:text-left [&_.rdp-head_cell]:pl-2 [&_.rdp-cell]:text-left [&_.rdp-cell]:pl-2"> */}
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            locale={enUS}
            showOutsideDays={true}
            fixedWeeks={true}
            className="rounded-md border p-3 pointer-events-auto"
            classNames={{
              months: "flex flex-col",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              table: "w-full border-collapse",
              head_row: "flex w-full",
              head_cell:
                "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] flex-1 text-center",
              row: "flex w-full mt-2",
              cell: "flex-1 pl-1 text-center text-sm p-0 relative",
              day: "h-9 w-9 mx-auto p-0 font-normal aria-selected:opacity-100",
            }}
          />
          {/* </div> */}
        </PopoverContent>
      </Popover>
    </div>
  );

  const FileUploadField = ({
    label,
    fileState,
    onFileChange,
    onClear,
    id,
  }: {
    label: string;
    fileState: FileUpload;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
    id: string;
  }) => (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      {fileState.name ? (
        <div className="flex items-center gap-2 h-12 px-3 rounded-md border border-border bg-input">
          <Upload size={16} className="text-muted-foreground shrink-0" />
          <span className="text-sm text-foreground truncate flex-1">
            {fileState.name}
          </span>
          <button
            type="button"
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <label
          htmlFor={id}
          className="flex items-center gap-2 h-12 px-3 rounded-md border border-dashed border-border bg-input cursor-pointer hover:border-muted-foreground transition-colors"
        >
          <Upload size={16} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Choose file</span>
          <input
            id={id}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            onChange={onFileChange}
          />
        </label>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background noise-bg relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(0 0% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 50%) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          {/* <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-4">
            <span className="text-primary-foreground font-bold text-lg">A</span>
          </div> */}
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Pharmacy Details
          </h1>
          <p className="text-muted-foreground text-sm mt-1.5">
            Complete your pharmacy profile to get started
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-2xl border border-border p-8 auth-glow">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section: Pharmacy Information */}
            <div>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 pb-2 border-b border-border">
                Pharmacy Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm text-muted-foreground">
                    Pharmacy Name *
                  </Label>
                  <Input
                    value={pharmacyName}
                    onChange={(e) => setPharmacyName(e.target.value)}
                    placeholder="Enter pharmacy name"
                    className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm text-muted-foreground">
                    Address *
                  </Label>
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter full address"
                    className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Phone *
                  </Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                    className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Fax</Label>
                  <Input
                    value={fax}
                    onChange={(e) => setFax(e.target.value)}
                    placeholder="(555) 123-4568"
                    className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
            </div>

            {/* Section: License & Identification Numbers */}
            <div>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 pb-2 border-b border-border">
                License & Identification Numbers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    NCPDP Number
                  </Label>
                  <Input
                    value={ncpdpNumber}
                    onChange={(e) => setNcpdpNumber(e.target.value)}
                    placeholder="Enter NCPDP number"
                    className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    NPI Number
                  </Label>
                  <Input
                    value={npiNumber}
                    onChange={(e) => setNpiNumber(e.target.value)}
                    placeholder="Enter NPI number"
                    className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Pharmacy License Number
                  </Label>
                  <Input
                    value={pharmacyLicenseNumber}
                    onChange={(e) => setPharmacyLicenseNumber(e.target.value)}
                    placeholder="Enter license number"
                    className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                  />
                </div>
                <DatePickerField
                  label="License Expiry Date"
                  date={licenseExpiryDate}
                  setDate={setLicenseExpiryDate}
                />
                <FileUploadField
                  label="Upload License File"
                  fileState={licenseFile}
                  onFileChange={(e) => handleFileChange(e, setLicenseFile)}
                  onClear={() => clearFile(setLicenseFile)}
                  id="license-file"
                />
              </div>
            </div>

            {/* Section: DEA Information */}
            <div>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 pb-2 border-b border-border">
                DEA Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    DEA Number
                  </Label>
                  <Input
                    value={deaNumber}
                    onChange={(e) => setDeaNumber(e.target.value)}
                    placeholder="Enter DEA number"
                    className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                  />
                </div>
                <DatePickerField
                  label="DEA Expiry Date"
                  date={deaExpiryDate}
                  setDate={setDeaExpiryDate}
                />
                <FileUploadField
                  label="Upload DEA File"
                  fileState={deaFile}
                  onFileChange={(e) => handleFileChange(e, setDeaFile)}
                  onClear={() => clearFile(setDeaFile)}
                  id="dea-file"
                />
              </div>
            </div>

            {/* Section: CDS Information */}
            <div>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 pb-2 border-b border-border">
                CDS Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    CDS Number
                  </Label>
                  <Input
                    value={cdsNumber}
                    onChange={(e) => setCdsNumber(e.target.value)}
                    placeholder="Enter CDS number"
                    className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                  />
                </div>
                <DatePickerField
                  label="CDS Expiry"
                  date={cdsExpiry}
                  setDate={setCdsExpiry}
                />
                <FileUploadField
                  label="Upload CDS File"
                  fileState={cdsFile}
                  onFileChange={(e) => handleFileChange(e, setCdsFile)}
                  onClear={() => clearFile(setCdsFile)}
                  id="cds-file"
                />
              </div>
            </div>

            {/* Section: Pharmacist In-Charge */}
            <div>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 pb-2 border-b border-border">
                Pharmacist In-Charge
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm text-muted-foreground">
                    Pharmacist Name
                  </Label>
                  <Input
                    value={pharmacistName}
                    onChange={(e) => setPharmacistName(e.target.value)}
                    placeholder="Enter pharmacist name"
                    className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    License Number
                  </Label>
                  <Input
                    value={pharmacistLicenseNumber}
                    onChange={(e) => setPharmacistLicenseNumber(e.target.value)}
                    placeholder="Enter license number"
                    className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                  />
                </div>
                <DatePickerField
                  label="Expiration"
                  date={pharmacistExpiration}
                  setDate={setPharmacistExpiration}
                />
                <FileUploadField
                  label="Upload File"
                  fileState={pharmacistFile}
                  onFileChange={(e) => handleFileChange(e, setPharmacistFile)}
                  onClear={() => clearFile(setPharmacistFile)}
                  id="pharmacist-file"
                />
              </div>
            </div>

            {/* Section: CMEA */}
            <div>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 pb-2 border-b border-border">
                CMEA Certification
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <DatePickerField
                  label="CMEA Expiry"
                  date={cmeaExpiry}
                  setDate={setCmeaExpiry}
                />
                <FileUploadField
                  label="Upload CMEA File"
                  fileState={cmeaFile}
                  onFileChange={(e) => handleFileChange(e, setCmeaFile)}
                  onClear={() => clearFile(setCmeaFile)}
                  id="cmea-file"
                />
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-200 group"
            >
              {isSubmitting ? "Submitting..." : "Submit Details"}
              {!isSubmitting && (
                <ArrowRight
                  size={16}
                  className="ml-2 group-hover:translate-x-0.5 transition-transform"
                />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDetailsForm;
