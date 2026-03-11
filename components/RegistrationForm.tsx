"use client";

import { useState, useRef } from "react";
import {
  User, Mail, Phone, Lock, Building2, MapPin, FileText,
  Upload, Calendar, ChevronRight, ChevronLeft, Check, Eye, EyeOff
} from "lucide-react";

// ── types ──────────────────────────────────────────────────────────────────
interface FormData {
  // Step 1 – Personal
  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  phone: string;
  confirmPhone: string;
  password: string;
  confirmPassword: string;
  // Step 2 – Pharmacy
  pharmacyName: string;
  address: string;
  pharmacyPhone: string;
  fax: string;
  // Step 3 – Licenses
  ncpdp: string;
  npi: string;
  pharmacyLicense: string;
  pharmacyLicenseExpiry: string;
  pharmacyLicenseFile: File | null;
  deaNumber: string;
  deaExpiry: string;
  deaFile: File | null;
  cdsNumber: string;
  cdsExpiry: string;
  cdsFile: File | null;
  // Step 4 – Pharmacist
  pharmacistName: string;
  pharmacistLicense: string;
  pharmacistExpiry: string;
  pharmacistFile: File | null;
  cmeaExpiry: string;
  cmeaFile: File | null;
}

const INITIAL: FormData = {
  firstName: "", lastName: "", email: "", confirmEmail: "",
  phone: "", confirmPhone: "", password: "", confirmPassword: "",
  pharmacyName: "", address: "", pharmacyPhone: "", fax: "",
  ncpdp: "", npi: "", pharmacyLicense: "", pharmacyLicenseExpiry: "",
  pharmacyLicenseFile: null, deaNumber: "", deaExpiry: "", deaFile: null,
  cdsNumber: "", cdsExpiry: "", cdsFile: null,
  pharmacistName: "", pharmacistLicense: "", pharmacistExpiry: "",
  pharmacistFile: null, cmeaExpiry: "", cmeaFile: null,
};

const STEPS = ["Personal Info", "Pharmacy Info", "Licenses & DEA", "Pharmacist"];

// ── sub-components ─────────────────────────────────────────────────────────
function Field({
  label, icon: Icon, type = "text", value, onChange, placeholder, required,
}: {
  label: string; icon?: React.ElementType; type?: string;
  value: string; onChange: (v: string) => void;
  placeholder?: string; required?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        )}
        <input
          type={isPassword ? (show ? "text" : "password") : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full ${Icon ? "pl-9" : "pl-3"} ${isPassword ? "pr-10" : "pr-3"} py-2.5 rounded-lg border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[#2d5a3d]/40 focus:border-[#2d5a3d] transition-all`}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
            {show ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}

function FileUpload({
  label, value, onChange,
}: {
  label: string; value: File | null; onChange: (f: File | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</label>
      <div
        onClick={() => ref.current?.click()}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-dashed border-border bg-muted/30 hover:bg-muted/60 cursor-pointer transition-all group"
      >
        <Upload size={15} className="text-muted-foreground group-hover:text-[#2d5a3d] transition-colors shrink-0" />
        <span className="text-sm text-muted-foreground truncate">
          {value ? value.name : "Click to upload file"}
        </span>
        {value && (
          <button type="button"
            onClick={(e) => { e.stopPropagation(); onChange(null); }}
            className="ml-auto text-xs text-muted-foreground hover:text-destructive"
          >✕</button>
        )}
      </div>
      <input ref={ref} type="file" className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)} />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="text-sm font-bold uppercase tracking-widest text-[#2d5a3d]">{children}</span>
      <div className="flex-1 h-px bg-[#2d5a3d]/20" />
    </div>
  );
}

// ── main component ─────────────────────────────────────────────────────────
export default function RegistrationForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof FormData) => (val: string) =>
    setForm((p) => ({ ...p, [key]: val }));
  const setFile = (key: keyof FormData) => (val: File | null) =>
    setForm((p) => ({ ...p, [key]: val }));

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const prev = () => setStep((s) => Math.max(s - 1, 0));
  const handleSubmit = () => setSubmitted(true);

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-16 h-16 rounded-full bg-[#2d5a3d] flex items-center justify-center">
          <Check size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Registration Submitted!</h2>
        <p className="text-muted-foreground text-sm max-w-xs">
          Your pharmacy registration has been received. We'll review and contact you shortly.
        </p>
        <button
          onClick={() => { setSubmitted(false); setStep(0); setForm(INITIAL); }}
          className="mt-2 px-6 py-2.5 rounded-lg bg-[#2d5a3d] text-white text-sm font-semibold hover:bg-[#1e3f2b] transition-colors"
        >
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Pharmacy Registration</h1>
        <p className="text-sm text-muted-foreground mt-1">Complete all steps to register your pharmacy</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all
                ${i < step ? "bg-[#2d5a3d] border-[#2d5a3d] text-white"
                  : i === step ? "border-[#2d5a3d] text-[#2d5a3d] bg-background"
                  : "border-border text-muted-foreground bg-background"}`}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap
                ${i === step ? "text-[#2d5a3d]" : "text-muted-foreground"}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 transition-all ${i < step ? "bg-[#2d5a3d]" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Form card */}
      <div className="border border-border rounded-2xl bg-background p-6 shadow-sm">

        {/* ── Step 0: Personal Info ─────────────────────────────────── */}
        {step === 0 && (
          <div className="space-y-4">
            <SectionTitle>Personal Details</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              <Field label="First Name" icon={User} value={form.firstName} onChange={set("firstName")} placeholder="John" required />
              <Field label="Last Name" icon={User} value={form.lastName} onChange={set("lastName")} placeholder="Doe" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Email" icon={Mail} type="email" value={form.email} onChange={set("email")} placeholder="john@example.com" required />
              <Field label="Verify Email" icon={Mail} type="email" value={form.confirmEmail} onChange={set("confirmEmail")} placeholder="Confirm email" required />
            </div>
            {form.email && form.confirmEmail && form.email !== form.confirmEmail && (
              <p className="text-xs text-red-500">Emails do not match</p>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Phone" icon={Phone} type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 (555) 000-0000" required />
              <Field label="Verify Phone" icon={Phone} type="tel" value={form.confirmPhone} onChange={set("confirmPhone")} placeholder="Confirm phone" required />
            </div>
            {form.phone && form.confirmPhone && form.phone !== form.confirmPhone && (
              <p className="text-xs text-red-500">Phone numbers do not match</p>
            )}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Password" icon={Lock} type="password" value={form.password} onChange={set("password")} placeholder="Min 8 characters" required />
              <Field label="Confirm Password" icon={Lock} type="password" value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Repeat password" required />
            </div>
            {form.password && form.confirmPassword && form.password !== form.confirmPassword && (
              <p className="text-xs text-red-500">Passwords do not match</p>
            )}
          </div>
        )}

        {/* ── Step 1: Pharmacy Info ─────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-4">
            <SectionTitle>Pharmacy Details</SectionTitle>
            <Field label="Pharmacy Name" icon={Building2} value={form.pharmacyName} onChange={set("pharmacyName")} placeholder="City Pharmacy LLC" required />
            <Field label="Address" icon={MapPin} value={form.address} onChange={set("address")} placeholder="123 Main St, City, State ZIP" required />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Phone" icon={Phone} type="tel" value={form.pharmacyPhone} onChange={set("pharmacyPhone")} placeholder="+1 (555) 000-0000" required />
              <Field label="Fax" icon={Phone} type="tel" value={form.fax} onChange={set("fax")} placeholder="+1 (555) 000-0001" />
            </div>
          </div>
        )}

        {/* ── Step 2: Licenses ──────────────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <SectionTitle>Pharmacy Numbers</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <Field label="NCPDP Number" icon={FileText} value={form.ncpdp} onChange={set("ncpdp")} placeholder="7-digit NCPDP" required />
                <Field label="NPI Number" icon={FileText} value={form.npi} onChange={set("npi")} placeholder="10-digit NPI" required />
              </div>
            </div>

            <div className="space-y-4">
              <SectionTitle>Pharmacy License</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <Field label="License Number" icon={FileText} value={form.pharmacyLicense} onChange={set("pharmacyLicense")} placeholder="License #" required />
                <Field label="Expiry Date" icon={Calendar} type="date" value={form.pharmacyLicenseExpiry} onChange={set("pharmacyLicenseExpiry")} required />
              </div>
              <FileUpload label="Upload License File" value={form.pharmacyLicenseFile} onChange={setFile("pharmacyLicenseFile")} />
            </div>

            <div className="space-y-4">
              <SectionTitle>DEA Registration</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <Field label="DEA Number" icon={FileText} value={form.deaNumber} onChange={set("deaNumber")} placeholder="DEA #" required />
                <Field label="DEA Expiry Date" icon={Calendar} type="date" value={form.deaExpiry} onChange={set("deaExpiry")} required />
              </div>
              <FileUpload label="Upload DEA File" value={form.deaFile} onChange={setFile("deaFile")} />
            </div>

            <div className="space-y-4">
              <SectionTitle>CDS Registration</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <Field label="CDS Number" icon={FileText} value={form.cdsNumber} onChange={set("cdsNumber")} placeholder="CDS #" />
                <Field label="CDS Expiry Date" icon={Calendar} type="date" value={form.cdsExpiry} onChange={set("cdsExpiry")} />
              </div>
              <FileUpload label="Upload CDS File" value={form.cdsFile} onChange={setFile("cdsFile")} />
            </div>
          </div>
        )}

        {/* ── Step 3: Pharmacist ────────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <SectionTitle>Pharmacist In Charge</SectionTitle>
              <Field label="Full Name" icon={User} value={form.pharmacistName} onChange={set("pharmacistName")} placeholder="Pharmacist full name" required />
              <div className="grid grid-cols-2 gap-4">
                <Field label="License Number" icon={FileText} value={form.pharmacistLicense} onChange={set("pharmacistLicense")} placeholder="License #" required />
                <Field label="Expiration Date" icon={Calendar} type="date" value={form.pharmacistExpiry} onChange={set("pharmacistExpiry")} required />
              </div>
              <FileUpload label="Upload License File" value={form.pharmacistFile} onChange={setFile("pharmacistFile")} />
            </div>

            <div className="space-y-4">
              <SectionTitle>CMEA Compliance</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <Field label="CMEA Expiry Date" icon={Calendar} type="date" value={form.cmeaExpiry} onChange={set("cmeaExpiry")} />
                <div />
              </div>
              <FileUpload label="Upload CMEA File" value={form.cmeaFile} onChange={setFile("cmeaFile")} />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <button
            type="button"
            onClick={prev}
            disabled={step === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={16} /> Back
          </button>

          <span className="text-xs text-muted-foreground">
            Step {step + 1} of {STEPS.length}
          </span>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={next}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2d5a3d] text-white text-sm font-semibold hover:bg-[#1e3f2b] transition-colors"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2d5a3d] text-white text-sm font-semibold hover:bg-[#1e3f2b] transition-colors"
            >
              <Check size={16} /> Submit Registration
            </button>
          )}
        </div>
      </div>
    </div>
  );
}