import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import Link from "next/link";
import axios from "axios";

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
  const [headers, setHeaders] = useState<string[]>([]);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [showWarning, setShowWarning] = useState(false);
  const [missingRequiredHeaders, setMissingRequiredHeaders] = useState<string[]>(
    [],
  );

 const REQUIRED_FIELDS = [
    { key: "rxNumber", label: "Rx Number" },
    { key: "dateFilled", label: "Date Filled" },
    { key: "drugName", label: "Drug Name" },
    { key: "quantity", label: "Quantity" },
    { key: "primaryInsuranceBinNumber", label: "Primary Insurance Bin Number" },
    { key: "primaryInsurancePaid", label: "Primary Insurance Paid" },
    { key: "ndcNumber", label: "Ndc Number" },
    { key: "status", label: "Status" },
    { key: "packageSize", label: "Package Size" },
    { key: "secondaryInsuranceBinNumber", label: "Secondary Insurance Bin Number" },
    { key: "secondaryInsurancePaid", label: "Secondary Insurance Paid" },
    { key: "brand", label: "Brand" },
  ] as const;

  const STANDARD_HEADER_OPTIONS = [
    "ndc",
    "rx_number",
    "status",
    "date_filled",
    "drug_name",
    "quantity",
    "package_size",
    "primary_bin",
    "primary_paid",
    "secondary_bin",
    "secondary_paid",
    "brand",
  ];

  const STANDARD_FIELD_TO_VALUE: Record<string, string> = {
    ndcNumber: "ndc",
    rxNumber: "rx_number",
    status: "status",
    dateFilled: "date_filled",
    drugName: "drug_name",
    quantity: "quantity",
    packageSize: "package_size",
    primaryInsuranceBinNumber: "primary_bin",
    primaryInsurancePaid: "primary_paid",
    secondaryInsuranceBinNumber: "secondary_bin",
    secondaryInsurancePaid: "secondary_paid",
    brand: "brand",
  };

  const HEADER_ALIASES: Record<string, string[]> = {
    ndcNumber: ["ndc", "ndcnumber", "ndc_number"],
    rxNumber: ["rxnumber", "rx_number", "rx", "rxno", "rx#", "rxnum"],
    status: ["status", "rxstatus"],
    dateFilled: [
      "datefilled",
      "date_filled",
      "filldate",
      "fill_date",
      "date",
    ],
    drugName: ["drugname", "drug_name", "drug", "productname", "product"],
    quantity: ["quantity", "qty", "rxquantity", "rx_qty"],
    packageSize: ["packagesize", "package_size", "pkgsize", "pkg_size"],
    primaryInsuranceBinNumber: [
      "primarybin",
      "primary_bin",
      "primaryinsurancebinnumber",
      "primarybinnumber",
      "primarybinno",
    ],
    primaryInsurancePaid: [
      "primarypaid",
      "primary_paid",
      "primaryinsurancepaid",
      "primarypay",
    ],
    secondaryInsuranceBinNumber: [
      "secondarybin",
      "secondary_bin",
      "secondaryinsurancebinnumber",
      "secondarybinnumber",
      "secondarybinno",
    ],
    secondaryInsurancePaid: [
      "secondarypaid",
      "secondary_paid",
      "secondaryinsurancepaid",
      "secondarypay",
    ],
    brand: ["brand", "brandname", "brand_generic", "brand_indicator"],
  };

  const normalizeHeader = (value: string) =>
    value.toLowerCase().replace(/[\s_]/g, "");

  // const buildAutoMapping = (parsedHeaders: string[]) => {
  //   const normalizedMap = parsedHeaders.reduce<Record<string, string>>(
  //     (acc, header) => {
  //       acc[normalizeHeader(header)] = header;
  //       return acc;
  //     },
  //     {},
  //   );

  //   const allFields = [...REQUIRED_FIELDS, ...OPTIONAL_FIELDS];
  //   const autoMapping: Record<string, string> = {};

  //   allFields.forEach((field) => {
  //     const aliases = HEADER_ALIASES[field.key] || [];
  //     const normalizedAliases = aliases.map((a) => a.toLowerCase());
  //     const hasMatch = Object.keys(normalizedMap).some((normalizedHeader) =>
  //       normalizedAliases.includes(normalizedHeader),
  //     );

  //     if (hasMatch) {
  //       autoMapping[field.key] = STANDARD_FIELD_TO_VALUE[field.key];
  //     }
  //   });

  //   return autoMapping;
  // };

  const buildAutoMapping = (parsedHeaders: string[]) => {
  const normalizedHeaders = parsedHeaders.map((h) =>
    normalizeHeader(h)
  );

  const autoMapping: Record<string, string> = {};

  const allFields = [...REQUIRED_FIELDS];

  allFields.forEach((field) => {
    const aliases = HEADER_ALIASES[field.key] || [];

    const found = parsedHeaders.find((header) =>
      aliases.some(
        (alias) =>
          normalizeHeader(alias) === normalizeHeader(header)
      )
    );

    if (found) {
      autoMapping[field.key] = STANDARD_FIELD_TO_VALUE[field.key];
    }
  });

  return autoMapping;
};

  const parseCsvHeaderLine = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }

    if (current.length > 0) {
      result.push(current.trim());
    }

    return result.filter((h) => h.length > 0);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setInventoryFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = (e.target?.result as string) || "";
        const firstNonEmptyLine =
          text.split(/\r?\n/).find((line) => line.trim().length > 0) || "";
        const parsedHeaders = parseCsvHeaderLine(firstNonEmptyLine);
        setHeaders(parsedHeaders);
        const auto = buildAutoMapping(parsedHeaders);
        setFieldMapping(auto);
        setShowWarning(false);
        setMissingRequiredHeaders([]);
      };
      reader.readAsText(file);
    } else {
      setHeaders([]);
      setFieldMapping({});
    }
  };

  const handleSubmit = async () => {
    // const missing = REQUIRED_FIELDS.filter((field) => !fieldMapping[field.key])
    //   .map((field) => field.label);

   const missing = REQUIRED_FIELDS.filter((field) => !fieldMapping[field.key]);

console.log("fieldMapping:", fieldMapping);
console.log("missing fields:", missing.map(f => f.label));

if (missing.length > 0) {
  setMissingRequiredHeaders(missing);
  setShowWarning(true);
  return;
}

    const formData = new FormData();
    if (inventoryFile) {
      formData.append("file", inventoryFile);
      formData.append("headerMapping", JSON.stringify(fieldMapping));
      try {
        const id = localStorage.getItem("auditId");
        const res = await axios.post(
          `http://localhost:5000/api/audits/${id}/inventory`,
          formData,
        );
        console.log(res.data);
        alert("success");
        onNext();
      } catch (err) {
        alert("failed");
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-white via-slate-50 to-slate-100 rounded-2xl border border-border/60 p-8 shadow-md">
        <h2 className="text-3xl font-semibold text-foreground text-center mb-2 tracking-tight">
          Upload your inventory files
        </h2>
        <p className="text-sm text-muted-foreground text-center mb-8">
          Map your file columns to PRIMERX standard headers before processing.
        </p>

        <div className="space-y-6">
          {/* Upload area */}
          <div className="border-2 border-dashed border-primary/40 rounded-xl p-5 bg-primary/5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-foreground text-sm">PRIMERX</p>
              <p className="text-xs text-muted-foreground mt-1">
                Accepted formats: CSV
              </p>
              {inventoryFile && (
                <p className="text-xs text-foreground mt-2">
                  <span className="font-medium">Selected file:</span>{" "}
                  <span className="underline decoration-dotted">
                    {inventoryFile.name}
                  </span>
                </p>
              )}
            </div>
            <label htmlFor="inventory-file" className="self-start sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer bg-white hover:bg-primary/5 border-primary/60"
                asChild
              >
                <span className="flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Choose file
                </span>
              </Button>
              <input
                id="inventory-file"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept=".csv"
              />
            </label>
          </div>

          {/* Header mapping section - shown after file is selected */}
          {inventoryFile && headers.length > 0 && (
            <div className="bg-white rounded-2xl border border-border/70 p-6 shadow-sm">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-foreground tracking-tight">
                  PRIMERX | File Upload
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Select the file headers below and click upload
                </p>
                <p className="text-sm text-primary font-medium mt-2">
                  Please make sure to include all your columns below.
                </p>
                <p className="text-sm text-foreground mt-1">
                  File - {inventoryFile.name}
                </p>
              </div>

              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                {/* Header row selector - currently fixed to Row 1 */}
                <div className="flex items-center justify-between rounded-lg border bg-slate-50 px-4 py-2.5 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">Header row</span>
                    <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      Row 1
                    </span>
                  </div>
                  <span className="text-emerald-600 text-[11px] font-medium">
                    Detected automatically ✓
                  </span>
                </div>

                <hr className="my-2" />

                {[...REQUIRED_FIELDS].map((field) => {
                  const isRequired = true;

                  return (
                    <div
                      key={field.key}
                      className="grid grid-cols-1 sm:grid-cols-[1.7fr,2.3fr] gap-2 sm:gap-4 items-center rounded-md border border-transparent hover:border-primary/20 px-2 py-1.5 transition-colors"
                    >
                      <div className="flex items-center justify-between sm:justify-start gap-2 text-xs sm:text-sm font-medium text-foreground">
                        <span>{field.label}</span>
                        {isRequired ? (
                          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
                            Required
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                            Optional
                          </span>
                        )}
                      </div>
                      <select
                        className="w-full border border-border rounded-lg px-3 py-2 text-xs sm:text-sm bg-white hover:border-primary/70 focus:outline-none focus:ring-2 focus:ring-primary/70 transition"
                        value={fieldMapping[field.key] || ""}
                        onChange={(e) =>
                          setFieldMapping((prev) => ({
                            ...prev,
                            [field.key]: e.target.value,
                          }))
                        }
                      >
                        <option value="">
                          {fieldMapping[field.key]
                            ? "Change mapping"
                            : "Select column type"}
                        </option>
                        {headers.map((header) => (
                           <option key={header} value={header}>
                              {header}
                              </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Exclude options */}
          <div className="text-center space-y-4">
            <p className="text-sm text-foreground">
              Make sure to{" "}
              <span className="underline font-medium">EXCLUDE</span> these
              options before running the report.
            </p>
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="excludeTransferred"
                  checked={excludeTransferred}
                  onCheckedChange={(checked: boolean) =>
                    setExcludeTransferred(checked === true)
                  }
                />
                <Label
                  htmlFor="excludeTransferred"
                  className="text-sm text-foreground"
                >
                  Exclude Transferred Out
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="excludeUnbilled"
                  checked={excludeUnbilled}
                  onCheckedChange={(checked: boolean) =>
                    setExcludeUnbilled(checked === true)
                  }
                />
                <Label
                  htmlFor="excludeUnbilled"
                  className="text-sm text-foreground"
                >
                  Exclude Unbilled
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            {/* <Link href="/file-upload" className="px-8 bg-gradient-to-r from-[#0D0D0D] to-[#404040] text-white transition"> */}
            <Button
              onClick={() => {
                handleSubmit();
              }}
              disabled={!inventoryFile || headers.length === 0}
              className="px-8 bg-gradient-to-r from-[#0D0D0D] to-[#404040] text-white transition"
            >
              Submit Upload
            </Button>
            {/* </Link> */}
          </div>
        </div>
      </div>

      {/* Warning modal when required headers are missing */}
      {showWarning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              onClick={() => setShowWarning(false)}
            >
              ×
            </button>
            <h3 className="text-lg font-bold mb-3 text-foreground">Warning</h3>
            <p className="text-sm mb-2 text-red-600">
              Header{" "}
              <span className="font-semibold">
                {missingRequiredHeaders.join(", ")}
              </span>{" "}
              is required.
            </p>
            <p className="text-sm text-foreground">
              Please match header before proceeding.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadInventoryStep;

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { Upload } from "lucide-react";
// import Link from "next/link";
// import axios from "axios";

// interface UploadInventoryStepProps {
//   inventoryFile: File | null;
//   setInventoryFile: (file: File | null) => void;
//   excludeTransferred: boolean;
//   setExcludeTransferred: (exclude: boolean) => void;
//   excludeUnbilled: boolean;
//   setExcludeUnbilled: (exclude: boolean) => void;
//   onNext: () => void;
// }

// const UploadInventoryStep = ({
//   inventoryFile,
//   setInventoryFile,
//   excludeTransferred,
//   setExcludeTransferred,
//   excludeUnbilled,
//   setExcludeUnbilled,
//   onNext,
// }: UploadInventoryStepProps) => {
//   const [headers, setHeaders] = useState<string[]>([]);
//   const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
//   const [showWarning, setShowWarning] = useState(false);
//   const [missingRequiredHeaders, setMissingRequiredHeaders] = useState<string[]>(
//     [],
//   );

//   const REQUIRED_FIELDS = [
//     { key: "rxNumber", label: "Rx Number" },
//     { key: "dateFilled", label: "Date Filled" },
//     { key: "drugName", label: "Drug Name" },
//     { key: "quantity", label: "Quantity" },
//     { key: "primaryInsuranceBinNumber", label: "Primary Insurance Bin Number" },
//     { key: "primaryInsurancePaid", label: "Primary Insurance Paid" },
//   ] as const;

//   const OPTIONAL_FIELDS = [
//     { key: "ndcNumber", label: "Ndc Number" },
//     { key: "status", label: "Status" },
//     { key: "packageSize", label: "Package Size" },
//     {
//       key: "secondaryInsuranceBinNumber",
//       label: "Secondary Insurance Bin Number",
//     },
//     { key: "secondaryInsurancePaid", label: "Secondary Insurance Paid" },
//     { key: "brand", label: "Brand" },
//   ] as const;

//   const STANDARD_HEADER_OPTIONS = [
//     "ndc",
//     "rx_number",
//     "status",
//     "date_filled",
//     "drug_name",
//     "quantity",
//     "package_size",
//     "primary_bin",
//     "primary_paid",
//     "secondary_bin",
//     "secondary_paid",
//     "brand",
//   ];

//   const parseCsvHeaderLine = (line: string): string[] => {
//     const result: string[] = [];
//     let current = "";
//     let inQuotes = false;

//     for (let i = 0; i < line.length; i++) {
//       const char = line[i];

//       if (char === '"') {
//         if (inQuotes && line[i + 1] === '"') {
//           current += '"';
//           i++;
//         } else {
//           inQuotes = !inQuotes;
//         }
//       } else if (char === "," && !inQuotes) {
//         result.push(current.trim());
//         current = "";
//       } else {
//         current += char;
//       }
//     }

//     if (current.length > 0) {
//       result.push(current.trim());
//     }

//     return result.filter((h) => h.length > 0);
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0] || null;
//     setInventoryFile(file);

//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const text = (e.target?.result as string) || "";
//         const firstNonEmptyLine =
//           text.split(/\r?\n/).find((line) => line.trim().length > 0) || "";
//         const parsedHeaders = parseCsvHeaderLine(firstNonEmptyLine);
//         setHeaders(parsedHeaders);
//         setFieldMapping({});
//         setShowWarning(false);
//         setMissingRequiredHeaders([]);
//       };
//       reader.readAsText(file);
//     } else {
//       setHeaders([]);
//       setFieldMapping({});
//     }
//   };

//   const handleSubmit = async () => {
//     const missing = REQUIRED_FIELDS.filter((field) => !fieldMapping[field.key])
//       .map((field) => field.label);

//     if (missing.length > 0) {
//       setMissingRequiredHeaders(missing);
//       setShowWarning(true);
//       return;
//     }

//     const formData = new FormData();
//     if (inventoryFile) {
//       formData.append("file", inventoryFile);
//       formData.append("headerMapping", JSON.stringify(fieldMapping));
//       try {
//         const id = localStorage.getItem("auditId");
//         const res = await axios.post(
//           `http://localhost:5000/api/audits/${id}/inventory`,
//           formData,
//         );
//         console.log(res.data);
//         alert("success");
//         onNext();
//       } catch (err) {
//         alert("failed");
//       }
//     }
//   };

//   return (
//     <div className="w-full max-w-3xl mx-auto">
//       <div className="bg-card rounded-lg border border-border p-8 shadow-sm">
//         <h2 className="text-2xl font-bold text-foreground text-center mb-8">
//           Upload your inventory files
//         </h2>

//         <div className="space-y-6">
//           {/* Upload area */}
//           <div className="border-2 border-dashed border-primary/40 rounded-lg p-4 bg-primary/5">
//             <div className="flex items-center justify-between">
//               <span className="font-semibold text-foreground">PRIMERX</span>
//               <label htmlFor="inventory-file">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="cursor-pointer"
//                   asChild
//                 >
//                   <span>
//                     <Upload className="w-4 h-4 mr-2" />
//                     Upload file
//                   </span>
//                 </Button>
//                 <input
//                   id="inventory-file"
//                   type="file"
//                   className="hidden"
//                   onChange={handleFileChange}
//                   accept=".csv,.xlsx,.xls"
//                 />
//               </label>
//             </div>
//             {inventoryFile && (
//               <p className="text-sm text-muted-foreground mt-2">
//                 Selected: {inventoryFile.name}
//               </p>
//             )}
//           </div>

//           {/* Header mapping section - shown after file is selected */}
//           {inventoryFile && headers.length > 0 && (
//             <div className="bg-white rounded-lg border border-border p-6 shadow-sm">
//               <div className="text-center mb-4">
//                 <h3 className="text-xl font-bold text-foreground">
//                   PRIMERX | File Upload
//                 </h3>
//                 <p className="text-sm text-muted-foreground mt-1">
//                   Select the file headers below and click upload
//                 </p>
//                 <p className="text-sm text-primary font-medium mt-2">
//                   Please make sure to include all your columns below.
//                 </p>
//                 <p className="text-sm text-foreground mt-1">
//                   File - {inventoryFile.name}
//                 </p>
//               </div>

//               <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
//                 {/* Header row selector - currently fixed to Row 1 */}
//                 <div className="grid grid-cols-[1.5fr,2fr] gap-4 items-center">
//                   <div className="font-medium text-sm text-foreground">
//                     Header
//                   </div>
//                   <div className="flex items-center">
//                     <div className="flex items-center justify-between w-full border rounded-md px-3 py-2 text-sm bg-muted">
//                       <span>Row 1</span>
//                       <span className="text-emerald-500 text-xs font-semibold">
//                         ✓
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 <hr className="my-2" />

//                 {[...REQUIRED_FIELDS, ...OPTIONAL_FIELDS].map((field) => {
//                   const isRequired = REQUIRED_FIELDS.some(
//                     (req) => req.key === field.key,
//                   );

//                   return (
//                     <div
//                       key={field.key}
//                       className="grid grid-cols-[1.5fr,2fr] gap-4 items-center"
//                     >
//                       <div className="flex items-center text-sm font-medium text-foreground">
//                         <span>{field.label}</span>
//                         {isRequired && (
//                           <span className="ml-1 text-red-500">*</span>
//                         )}
//                       </div>
//                       <select
//                         className="w-full border border-border rounded-md px-3 py-2 text-sm bg-white hover:border-primary/70 focus:outline-none focus:ring-2 focus:ring-primary transition"
//                         value={fieldMapping[field.key] || ""}
//                         onChange={(e) =>
//                           setFieldMapping((prev) => ({
//                             ...prev,
//                             [field.key]: e.target.value,
//                           }))
//                         }
//                       >
//                         <option value="">Select column type</option>
//                         {STANDARD_HEADER_OPTIONS.map((option) => (
//                           <option key={option} value={option}>
//                             {option}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* Exclude options */}
//           <div className="text-center space-y-4">
//             <p className="text-sm text-foreground">
//               Make sure to{" "}
//               <span className="underline font-medium">EXCLUDE</span> these
//               options before running the report.
//             </p>
//             <div className="flex items-center justify-center gap-8">
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="excludeTransferred"
//                   checked={excludeTransferred}
//                   onCheckedChange={(checked: boolean) =>
//                     setExcludeTransferred(checked === true)
//                   }
//                 />
//                 <Label
//                   htmlFor="excludeTransferred"
//                   className="text-sm text-foreground"
//                 >
//                   Exclude Transferred Out
//                 </Label>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Checkbox
//                   id="excludeUnbilled"
//                   checked={excludeUnbilled}
//                   onCheckedChange={(checked: boolean) =>
//                     setExcludeUnbilled(checked === true)
//                   }
//                 />
//                 <Label
//                   htmlFor="excludeUnbilled"
//                   className="text-sm text-foreground"
//                 >
//                   Exclude Unbilled
//                 </Label>
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-center pt-4">
//             {/* <Link href="/file-upload" className="px-8 bg-gradient-to-r from-[#0D0D0D] to-[#404040] text-white transition"> */}
//             <Button
//               onClick={() => {
//                 handleSubmit();
//               }}
//               disabled={!inventoryFile || headers.length === 0}
//               className="px-8 bg-gradient-to-r from-[#0D0D0D] to-[#404040] text-white transition"
//             >
//               Submit Upload
//             </Button>
//             {/* </Link> */}
//           </div>
//         </div>
//       </div>

//       {/* Warning modal when required headers are missing */}
//       {showWarning && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
//             <button
//               className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
//               onClick={() => setShowWarning(false)}
//             >
//               ×
//             </button>
//             <h3 className="text-lg font-bold mb-3 text-foreground">Warning</h3>
//             <p className="text-sm mb-2 text-red-600">
//               Header{" "}
//               <span className="font-semibold">
//                 {missingRequiredHeaders.join(", ")}
//               </span>{" "}
//               is required.
//             </p>
//             <p className="text-sm text-foreground">
//               Please match header before proceeding.
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadInventoryStep;
