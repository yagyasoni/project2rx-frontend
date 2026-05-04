"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// DEA validator — checksum-based, runs client-side
function isValidDEA(dea: string): boolean {
  const s = dea.toUpperCase().trim();
  if (!/^[ABFGMPRX][A-Z]\d{7}$/.test(s)) return false;

  const digits = s.slice(2).split("").map(Number);
  const sum1 = digits[0] + digits[2] + digits[4];
  const sum2 = (digits[1] + digits[3] + digits[5]) * 2;
  const checkDigit = (sum1 + sum2) % 10;

  return checkDigit === digits[6];
}

interface FileUpload {
  file: File | null;
  name: string;
}

const US_STATES = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" }, { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" },
  { code: "DC", name: "District of Columbia" }, { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" }, { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" }, { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" }, { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" }, { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" }, { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" }, { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" }, { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" }, { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" }, { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" }, { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" }, { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" }, { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" }, { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" }, { code: "PR", name: "Puerto Rico" },
];

const PharmacyDetailsForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pharmacy Info
  const [pharmacyName, setPharmacyName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateCode, setStateCode] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [phone, setPhone] = useState("");
  const [fax, setFax] = useState("");

  // License Numbers
  const [ncpdpNumber, setNcpdpNumber] = useState("");
  const [npiNumber, setNpiNumber] = useState("");
  const [pharmacyLicenseNumber, setPharmacyLicenseNumber] = useState("");
  const [licenseExpiryDate, setLicenseExpiryDate] = useState<Date | undefined>();

  // DEA / CDS / Pharmacist / CMEA / EIN / Insurance / Workers Comp / Surety Bond / Cheque
  const [deaNumber, setDeaNumber] = useState("");
  const [deaExpiryDate, setDeaExpiryDate] = useState<Date | undefined>();
  const [deaFile, setDeaFile] = useState<FileUpload>({ file: null, name: "" });

  const [cdsNumber, setCdsNumber] = useState("");
  const [cdsExpiry, setCdsExpiry] = useState<Date | undefined>();
  const [cdsFile, setCdsFile] = useState<FileUpload>({ file: null, name: "" });

  const [pharmacistName, setPharmacistName] = useState("");
  const [pharmacistLicenseNumber, setPharmacistLicenseNumber] = useState("");
  const [pharmacistExpiration, setPharmacistExpiration] = useState<Date | undefined>();
  const [pharmacistFile, setPharmacistFile] = useState<FileUpload>({ file: null, name: "" });

  const [cmeaExpiry, setCmeaExpiry] = useState<Date | undefined>();
  const [cmeaFile, setCmeaFile] = useState<FileUpload>({ file: null, name: "" });

  const [licenseFile, setLicenseFile] = useState<FileUpload>({ file: null, name: "" });
  const [confirmed, setConfirmed] = useState(false);

  const [einNumber, setEinNumber] = useState("");
  const [einFile, setEinFile] = useState<FileUpload>({ file: null, name: "" });

  const [insuranceExpiration, setInsuranceExpiration] = useState<Date | undefined>();
  const [liabilityInsuranceFile, setLiabilityInsuranceFile] = useState<FileUpload>({ file: null, name: "" });

  const [workersCompExpiration, setWorkersCompExpiration] = useState<Date | undefined>();
  const [workersCompFile, setWorkersCompFile] = useState<FileUpload>({ file: null, name: "" });

  const [suretyBondExpiration, setSuretyBondExpiration] = useState<Date | undefined>();
  const [suretyBondFile, setSuretyBondFile] = useState<FileUpload>({ file: null, name: "" });

  const [voidedChequeFile, setVoidedChequeFile] = useState<FileUpload>({ file: null, name: "" });

  const [errors, setErrors] = useState({
  pharmacyName: "",
  address: "",
  city: "",
  stateCode: "",
  zipCode: "",
  phone: "",
  fax: "",
  pharmacyLicenseNumber: "",
  deaNumber: "",
  general: "",
});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({
  pharmacyName: "", address: "", city: "", stateCode: "",
  zipCode: "", phone: "", fax: "",
  pharmacyLicenseNumber: "", deaNumber: "",
  general: "",
});

    const newErrors: any = {};

    if (!pharmacyName.trim()) newErrors.pharmacyName = "Pharmacy name is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!city.trim()) newErrors.city = "City is required";
    if (!stateCode) newErrors.stateCode = "State is required";

    if (!zipCode.trim()) {
      newErrors.zipCode = "Zip code is required";
    } else if (!/^\d{5}(-\d{4})?$/.test(zipCode.trim())) {
      newErrors.zipCode = "Zip must be 5 digits (or 5+4)";
    }

    if (!phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.phone = "Phone must be exactly 10 digits";
    }

    if (!fax) {
      newErrors.fax = "Fax number is required";
    } else if (!/^\d{10}$/.test(fax)) {
      newErrors.fax = "Fax must be exactly 10 digits";
    }

    const licenseClean = pharmacyLicenseNumber.trim().toUpperCase();
if (!licenseClean) {
  newErrors.pharmacyLicenseNumber = "Pharmacy license number is required";
} else if (licenseClean.length < 5) {
  newErrors.pharmacyLicenseNumber = "License number looks too short";
}

const deaClean = deaNumber.trim().toUpperCase();
if (!deaClean) {
  newErrors.deaNumber = "DEA number is required";
} else if (!isValidDEA(deaClean)) {
  newErrors.deaNumber = "Invalid DEA number (format or checksum failed)";
}

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("userId", localStorage.getItem("userId") || "");

    formData.append("pharmacyName", pharmacyName);
    formData.append("address", address);
    formData.append("city", city);
    formData.append("state", stateCode);
    formData.append("zipCode", zipCode);
    formData.append("phone", phone);
    formData.append("fax", fax);

    formData.append("ncpdpNumber", ncpdpNumber);
    formData.append("npiNumber", npiNumber);
    formData.append("pharmacyLicenseNumber", pharmacyLicenseNumber);

    if (licenseExpiryDate) formData.append("licenseExpiryDate", licenseExpiryDate.toISOString());

    formData.append("deaNumber", deaNumber);
if (deaExpiryDate) formData.append("deaExpiryDate", deaExpiryDate.toISOString());

    if (licenseFile.file) formData.append("licenseFile", licenseFile.file);
    if (deaFile.file) formData.append("deaFile", deaFile.file);
    if (cdsFile.file) formData.append("cdsFile", cdsFile.file);
    if (pharmacistFile.file) formData.append("pharmacistFile", pharmacistFile.file);
    if (cmeaFile.file) formData.append("cmeaFile", cmeaFile.file);
    formData.append("einNumber", einNumber);
    if (einFile.file) formData.append("einFile", einFile.file);

    if (insuranceExpiration) formData.append("insuranceExpiration", insuranceExpiration.toISOString());
    if (liabilityInsuranceFile.file) formData.append("liabilityInsuranceFile", liabilityInsuranceFile.file);

    if (workersCompExpiration) formData.append("workersCompExpiration", workersCompExpiration.toISOString());
    if (workersCompFile.file) formData.append("workersCompFile", workersCompFile.file);

    if (suretyBondExpiration) formData.append("suretyBondExpiration", suretyBondExpiration.toISOString());
    if (suretyBondFile.file) formData.append("suretyBondFile", suretyBondFile.file);

    if (voidedChequeFile.file) formData.append("voidedChequeFile", voidedChequeFile.file);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/pharmacy`,
        formData,
      );
      console.log(res?.data);
      localStorage.setItem("pharmacyName", pharmacyName);
      toast.success("Details submitted successfully! Your pharmacy details have been saved.");
      router.push("/agreements");
    } catch (err: any) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        general: err?.response?.data?.message || "Something went wrong. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="text-center mb-10">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Pharmacy Details
          </h1>
          <p className="text-muted-foreground text-sm mt-1.5">
            Complete your pharmacy profile to get started
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 auth-glow">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 pb-2 border-b border-border">
                Pharmacy Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Pharmacy Name */}
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm text-muted-foreground">Pharmacy Name *</Label>
                  <Input
                    value={pharmacyName}
                    onChange={(e) => {
                      setPharmacyName(e.target.value);
                      setErrors((prev) => ({ ...prev, pharmacyName: "" }));
                    }}
                    placeholder="Enter pharmacy name"
                    className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                  />
                  {errors.pharmacyName && (
                    <p className="text-xs text-red-500">{errors.pharmacyName}</p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm text-muted-foreground">Address *</Label>
                  <Input
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setErrors((prev) => ({ ...prev, address: "" }));
                    }}
                    placeholder="Street address"
                    className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                  />
                  {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                </div>

                {/* City */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">City *</Label>
                  <Input
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      setErrors((prev) => ({ ...prev, city: "" }));
                    }}
                    placeholder="Newark"
                    className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                  />
                  {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                </div>

                {/* State */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">State *</Label>
                  <Select
                    value={stateCode}
                    onValueChange={(v) => {
                      setStateCode(v);
                      setErrors((prev) => ({ ...prev, stateCode: "" }));
                    }}
                  >
                    <SelectTrigger className="h-12 bg-input border-border text-foreground">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {US_STATES.map((s) => (
                        <SelectItem key={s.code} value={s.code}>
                          {s.name} ({s.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.stateCode && <p className="text-xs text-red-500">{errors.stateCode}</p>}
                </div>

                {/* Zip */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Zip Code *</Label>
                  <Input
                    value={zipCode}
                    onChange={(e) => {
                      setZipCode(e.target.value);
                      setErrors((prev) => ({ ...prev, zipCode: "" }));
                    }}
                    placeholder="07105 or 07105-1234"
                    maxLength={10}
                    className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                  />
                  {errors.zipCode && <p className="text-xs text-red-500">{errors.zipCode}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Phone *</Label>
                  <Input
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, ""));
                      setErrors((prev) => ({ ...prev, phone: "" }));
                    }}
                    placeholder="5551234567"
                    maxLength={10}
                    className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                  />
                  {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>

                {/* Fax */}
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm text-muted-foreground">Fax *</Label>
                  <Input
                    value={fax}
                    onChange={(e) => {
                      setFax(e.target.value.replace(/\D/g, ""));
                      setErrors((prev) => ({ ...prev, fax: "" }));
                    }}
                    placeholder="5551234568"
                    maxLength={10}
                    className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
                  />
                  {errors.fax && <p className="text-xs text-red-500">{errors.fax}</p>}
                </div>
              </div>
            </div>

            <div>
  <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4 pb-2 border-b border-border">
    Licensing & Identifiers
  </h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
    {/* Pharmacy License Number */}
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">Pharmacy License Number *</Label>
      <Input
        value={pharmacyLicenseNumber}
        onChange={(e) => {
          setPharmacyLicenseNumber(e.target.value.toUpperCase());
          setErrors((prev) => ({ ...prev, pharmacyLicenseNumber: "" }));
        }}
        placeholder="28RP00012345"
        className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring"
      />
      {errors.pharmacyLicenseNumber && (
        <p className="text-xs text-red-500">{errors.pharmacyLicenseNumber}</p>
      )}
    </div>

    {/* License Expiry */}
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">License Expiry Date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-12 w-full justify-start font-normal bg-input border-border",
              !licenseExpiryDate && "text-muted-foreground"
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {licenseExpiryDate ? format(licenseExpiryDate, "PPP", { locale: enUS }) : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={licenseExpiryDate}
            onSelect={setLicenseExpiryDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>

    {/* DEA Number */}
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">DEA Number *</Label>
      <Input
        value={deaNumber}
        onChange={(e) => {
          setDeaNumber(e.target.value.toUpperCase());
          setErrors((prev) => ({ ...prev, deaNumber: "" }));
        }}
        placeholder="BM1234563"
        maxLength={9}
        className="h-12 bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-ring font-mono"
      />
      {errors.deaNumber && (
        <p className="text-xs text-red-500">{errors.deaNumber}</p>
      )}
    </div>

    {/* DEA Expiry */}
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">DEA Expiry Date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "h-12 w-full justify-start font-normal bg-input border-border",
              !deaExpiryDate && "text-muted-foreground"
            )}
          >
            <Calendar className="mr-2 h-4 w-4" />
            {deaExpiryDate ? format(deaExpiryDate, "PPP", { locale: enUS }) : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="single"
            selected={deaExpiryDate}
            onSelect={setDeaExpiryDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  </div>
</div>

            <div className="space-y-4 pt-2">
              <div
                className="flex items-start gap-3 cursor-pointer group select-none"
                onClick={() => setConfirmed((v) => !v)}
              >
                <div
                  className={cn(
                    "mt-0.5 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-150",
                    confirmed
                      ? "bg-primary border-primary"
                      : "border-border bg-input group-hover:border-muted-foreground",
                  )}
                  style={{ height: 18, width: 18 }}
                >
                  {confirmed && (
                    <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2">
                      <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8"
                        strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-muted-foreground leading-relaxed">
                  I confirm that all the information provided above is{" "}
                  <span className="font-semibold text-foreground">accurate and complete</span>.
                  I understand that submitting incorrect information may affect my pharmacy registration.
                </span>
              </div>

              {confirmed && (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all duration-200 group"
                >
                  {isSubmitting ? "Submitting..." : "Submit Details"}
                  {!isSubmitting && (
                    <ArrowRight size={16} className="ml-2 group-hover:translate-x-0.5 transition-transform" />
                  )}
                </Button>
              )}
            </div>

            {errors.general && (
              <p className="text-sm text-red-500 text-center">{errors.general}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDetailsForm;