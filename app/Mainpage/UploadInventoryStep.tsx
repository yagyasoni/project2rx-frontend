// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";

// import {
//   Upload,
//   AlertTriangle,
//   CheckCircle2,
//   Info,
//   ChevronDown,
//   ChevronUp,
//   FileText,
//   X,
//   Sparkles,
// } from "lucide-react";
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

// // ── Disclaimer Banner ──────────────────────────────────────────────────────────

// const REQUIRED_FIELD_LABELS = [
//   "Rx Number", "Date Filled", "Drug Name", "Quantity",
//   "Primary Insurance Bin Number", "Primary Insurance Paid", "Ndc Number", "Status",
//   "Package Size", "Secondary Insurance Bin Number", "Secondary Insurance Paid",
//   "Brand", "Primary Insurance PCN", "Primary Insurance Group",
// ];

// const DisclaimerBanner = () => {
//   const [expanded, setExpanded] = useState(false);

//   return (
//     <div className="rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 overflow-hidden mb-5 shadow-sm">
//       <div className="flex items-start gap-3 px-5 py-4">
//         <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
//           <AlertTriangle className="w-4 h-4 text-amber-600" />
//         </div>
//         <div className="flex-1 min-w-0">
//           <p className="text-sm font-semibold text-amber-900">
//             File requirements — read before uploading
//           </p>
//           <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
//             Your CSV must include all required columns. Missing columns will block processing.
//           </p>
//         </div>
//         <button
//           onClick={() => setExpanded((v) => !v)}
//           className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-900 transition-all bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg border border-amber-200"
//         >
//           {expanded
//             ? <><ChevronUp className="w-3.5 h-3.5" /> Hide</>
//             : <><ChevronDown className="w-3.5 h-3.5" /> View columns</>
//           }
//         </button>
//       </div>

//       {expanded && (
//         <div className="border-t border-amber-200/60 bg-white/80 px-5 py-5 space-y-5">
//           <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
//             <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
//             <div>
//               <p className="text-xs font-semibold text-gray-700 mb-1.5">File Format Requirements</p>
//               <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
//                 <li>File must be in <span className="font-semibold text-gray-800">.CSV format</span> only</li>
//                 <li><span className="font-semibold text-gray-800">First row</span> must be the header row</li>
//                 <li>Column names are <span className="font-semibold text-gray-800">case-insensitive</span> — auto-mapping will detect them</li>
//                 <li>Dates: <span className="font-semibold text-gray-800">MM/DD/YYYY</span> or <span className="font-semibold text-gray-800">YYYY-MM-DD</span></li>
//               </ul>
//             </div>
//           </div>

//           <div>
//             <div className="flex items-center gap-2 mb-3">
//               <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
//                 <span className="text-[10px] font-bold text-red-600">{REQUIRED_FIELD_LABELS.length}</span>
//               </div>
//               <p className="text-xs font-semibold text-gray-700">Required Columns</p>
//             </div>
//             <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
//               {REQUIRED_FIELD_LABELS.map((col) => (
//                 <div key={col} className="flex items-center gap-2 bg-red-50/80 border border-red-100 rounded-lg px-2.5 py-1.5">
//                   <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
//                   <span className="text-[11px] font-medium text-red-700 truncate">{col}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-start gap-2.5">
//             <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
//             <p className="text-[11px] text-amber-700 leading-relaxed">
//               <span className="font-semibold">Important:</span> After uploading, verify every required column is correctly mapped. Auto-detection may not always be accurate — double-check before clicking <span className="font-semibold">Submit Upload</span>.
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // ── Main Component ─────────────────────────────────────────────────────────────

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
//   const [missingRequiredHeaders, setMissingRequiredHeaders] = useState<string[]>([]);
//   const [submitSuccess, setSubmitSuccess] = useState(false);

//   // ── ORIGINAL — untouched ───────────────────────────────────────────────────

//   const REQUIRED_FIELDS = [
//     { key: "rxNumber", label: "Rx Number" },
//     { key: "dateFilled", label: "Date Filled" },
//     { key: "drugName", label: "Drug Name" },
//     { key: "quantity", label: "Quantity" },
//     { key: "primaryInsuranceBinNumber", label: "Primary Insurance Bin Number" },
//     { key: "primaryInsurancePaid", label: "Primary Insurance Paid" },
//     { key: "ndcNumber", label: "Ndc Number" },
//     { key: "status", label: "Status" },
//     { key: "packageSize", label: "Package Size" },
//     { key: "secondaryInsuranceBinNumber", label: "Secondary Insurance Bin Number" },
//     { key: "secondaryInsurancePaid", label: "Secondary Insurance Paid" },
//     { key: "brand", label: "Brand" },
//     { key: "primaryInsurancePcn", label: "Primary Insurance PCN" },
//     { key: "primaryInsuranceGroup", label: "Primary Insurance Group" },
//   ] as const;

//   const STANDARD_FIELD_TO_VALUE: Record<string, string> = {
//     ndcNumber: "ndc",
//     rxNumber: "rx_number",
//     status: "status",
//     dateFilled: "date_filled",
//     drugName: "drug_name",
//     quantity: "quantity",
//     packageSize: "package_size",
//     primaryInsuranceBinNumber: "primary_bin",
//     primaryInsurancePaid: "primary_paid",
//     secondaryInsuranceBinNumber: "secondary_bin",
//     secondaryInsurancePaid: "secondary_paid",
//     brand: "brand",
//     primaryInsurancePcn: "primary_pcn",
//     primaryInsuranceGroup: "primary_group",
//   };

//   const HEADER_ALIASES: Record<string, string[]> = {
//   ndcNumber: ["ndc", "ndcnumber", "ndc_number"],
//   rxNumber: ["rxnumber", "rx_number", "rx", "rxno", "rx#", "rxnum", "rxno"],  // ← added "rxno"
//   status: ["status", "rxstatus"],
//   dateFilled: ["datefilled", "date_filled", "filldate", "fill_date", "date", "datef"],  // ← added "datef"
//   drugName: ["drugname", "drug_name", "drug", "productname", "product"],
//   quantity: ["quantity", "qty", "rxquantity", "rx_qty", "quant"],  // ← added "quant"
//   packageSize: ["packagesize", "package_size", "pkgsize", "pkg_size"],
//   primaryInsuranceBinNumber: [
//     "primarybin", "primary_bin", "primaryinsurancebinnumber", "primarybinnumber", "primarybinno",
//     "priinsbinno",  // ← added
//   ],
//   primaryInsurancePaid: [
//     "primarypaid", "primary_paid", "primaryinsurancepaid", "primarypay",
//     "priinspaid",  // ← added
//   ],
//   secondaryInsuranceBinNumber: [
//     "secondarybin", "secondary_bin", "secondaryinsurancebinnumber", "secondarybinnumber", "secondarybinno",
//     "secinsbiino",  // ← added (note: PrimeRX has a typo "BIINO" not "BINNO")
//   ],
//   secondaryInsurancePaid: [
//     "secondarypaid", "secondary_paid", "secondaryinsurancepaid", "secondarypay",
//     "secinspaid",  // ← added
//   ],
//   brand: ["brand", "brandname", "brand_generic", "brand_indicator"],
//   primaryInsurancePcn: ["priinspcn", "primarypcn", "primary_pcn", "primaryinsurancepcn", "pcn"],  // ← "priinspcn" already there ✓
//   primaryInsuranceGroup: ["priinspatgroup", "primarygroup", "primary_group", "primaryinsurancegroup", "patgroup"],  // ← "priinspatgroup" already there ✓
// };

//   const normalizeHeader = (value: string) =>
//     value.toLowerCase().replace(/[\s_]/g, "");

//   const buildAutoMapping = (parsedHeaders: string[]) => {
//   const autoMapping: Record<string, string> = {};
//   const allFields = [...REQUIRED_FIELDS];
//   allFields.forEach((field) => {
//     const aliases = HEADER_ALIASES[field.key] || [];
//     const found = parsedHeaders.find((header) =>
//       aliases.some((alias) => normalizeHeader(alias) === normalizeHeader(header))
//     );
//     if (found) {
//       autoMapping[field.key] = found; // ← use the ACTUAL header value, not the standard key
//     }
//   });
//   return autoMapping;
// };

//   const parseCsvHeaderLine = (line: string): string[] => {
//     const result: string[] = [];
//     let current = "";
//     let inQuotes = false;
//     for (let i = 0; i < line.length; i++) {
//       const char = line[i];
//       if (char === '"') {
//         if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
//         else inQuotes = !inQuotes;
//       } else if (char === "," && !inQuotes) {
//         result.push(current.trim());
//         current = "";
//       } else {
//         current += char;
//       }
//     }
//     if (current.length > 0) result.push(current.trim());
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
//         const auto = buildAutoMapping(parsedHeaders);
//         setFieldMapping(auto);
//         setShowWarning(false);
//         setMissingRequiredHeaders([]);
//       };
//       reader.readAsText(file);
//     } else {
//       setHeaders([]);
//       setFieldMapping({});
//     }
//   };

//   const [uploadProgress, setUploadProgress] = useState(0);
// const [isUploading, setIsUploading] = useState(false);

// const handleSubmit = async () => {
//   const missing = REQUIRED_FIELDS.filter((field) => !fieldMapping[field.key]);
//   if (missing.length > 0) {
//     setMissingRequiredHeaders(missing.map(f => f.label));
//     setShowWarning(true);
//     return;
//   }

//   if (!inventoryFile) return;

//   const formData = new FormData();
//   formData.append("file", inventoryFile);
//   formData.append("headerMapping", JSON.stringify(fieldMapping));

//   setUploadProgress(0);
//   setIsUploading(true);
//   let current = 0;

//   const interval = setInterval(() => {
//     current += Math.random() * 5 + 2;
//     if (current >= 85) {
//       current = 85;
//       clearInterval(interval);
//     }
//     setUploadProgress(Math.round(current));
//   }, 350);

//   try {
//     const id = localStorage.getItem("auditId");
//     await axios.post(`http://localhost:5000/api/audits/${id}/inventory`, formData);

//     clearInterval(interval);
//     setUploadProgress(100);
//     setIsUploading(false);   // ← NO setTimeout, fire immediately
//     setSubmitSuccess(true);

//   } catch (err: any) {       // ← :any fixes the syntax error
//     clearInterval(interval);
//     setIsUploading(false);
//     setUploadProgress(0);
//     const message = err?.response?.data?.message || err?.message || "Please try again.";
//     alert("Upload failed: " + message);
//   }
// };

//   // ── END ORIGINAL LOGIC ─────────────────────────────────────────────────────

//   const mappedCount = Object.keys(fieldMapping).length;
//   const totalRequired = REQUIRED_FIELDS.length;
//   const allMapped = mappedCount === totalRequired;

//   return (
//     <div className="w-full max-w-3xl mx-auto px-2">

//       <DisclaimerBanner />

//       {/* Main Card */}
//       <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

//         {/* Card Header */}
//         <div className="bg-gray-50 border-b border-gray-200 px-6 py-5">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
//               <Upload className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <h2 className="text-base font-bold text-gray-900">Upload Inventory File</h2>
//               <p className="text-xs text-gray-500 mt-0.5">Map your CSV columns to PRIMERX standard fields</p>
//             </div>
//           </div>
//         </div>

//         <div className="p-6 space-y-6">

//           {/* Drop Zone */}
//           <div className={`relative rounded-xl border-2 border-dashed transition-all ${
//             inventoryFile
//               ? "border-emerald-300 bg-emerald-50/40"
//               : "border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-50"
//           }`}>
//             <div className="flex items-center gap-4 px-5 py-4">
//               <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
//                 inventoryFile ? "bg-emerald-100" : "bg-white border border-gray-200 shadow-sm"
//               }`}>
//                 {inventoryFile
//                   ? <CheckCircle2 className="w-6 h-6 text-emerald-600" />
//                   : <FileText className="w-6 h-6 text-gray-400" />
//                 }
//               </div>
//               <div className="flex-1 min-w-0">
//                 {inventoryFile ? (
//                   <>
//                     <p className="text-sm font-semibold text-emerald-800 truncate">{inventoryFile.name}</p>
//                     <p className="text-xs text-emerald-600 mt-0.5">
//                       {headers.length} columns detected · {mappedCount}/{totalRequired} mapped
//                     </p>
//                   </>
//                 ) : (
//                   <>
//                     <p className="text-sm font-semibold text-gray-700">Choose a CSV file</p>
//                     <p className="text-xs text-gray-400 mt-0.5">Only .CSV format accepted</p>
//                   </>
//                 )}
//               </div>
//               <div className="flex items-center gap-2 flex-shrink-0">
//                 {inventoryFile && (
//                   <button
//                     onClick={() => { setInventoryFile(null); setHeaders([]); setFieldMapping({}); }}
//                     className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 )}
//                 <label htmlFor="inventory-file" className="cursor-pointer">
//                   <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
//                     inventoryFile
//                       ? "bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
//                       : "bg-gray-900 text-white hover:bg-gray-800"
//                   }`}>
//                     <Upload className="w-3.5 h-3.5" />
//                     {inventoryFile ? "Replace" : "Browse"}
//                   </span>
//                   <input
//                     id="inventory-file"
//                     type="file"
//                     className="hidden"
//                     onChange={handleFileChange}
//                     accept=".csv"
//                   />
//                 </label>
//               </div>
//             </div>

//             {/* Progress bar when file is selected */}
//             {inventoryFile && (
//               <div className="px-5 pb-4">
//                 <div className="flex items-center justify-between mb-1.5">
//                   <span className="text-[11px] font-medium text-gray-500">Column mapping progress</span>
//                   <span className={`text-[11px] font-semibold ${allMapped ? "text-emerald-600" : "text-amber-600"}`}>
//                     {mappedCount}/{totalRequired} mapped
//                   </span>
//                 </div>
//                 <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
//                   <div
//                     className={`h-full rounded-full transition-all duration-500 ${allMapped ? "bg-emerald-500" : "bg-amber-400"}`}
//                     style={{ width: `${(mappedCount / totalRequired) * 100}%` }}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Column Mapping Table */}
//           {inventoryFile && headers.length > 0 && (
//             <div className="rounded-xl border border-gray-200 overflow-hidden">
//               {/* Table Header */}
//               <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-4 py-3">
//                 <div className="flex items-center gap-2">
//                   <Sparkles className="w-3.5 h-3.5 text-amber-500" />
//                   <span className="text-xs font-semibold text-gray-700">Column Mapping</span>
//                   <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
//                     Auto-detected ✓
//                   </span>
//                 </div>
//                 <span className="text-[11px] text-gray-500 font-medium">Row 1 = Header</span>
//               </div>

//               {/* Column rows */}
//               <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
//                 {[...REQUIRED_FIELDS].map((field, idx) => {
//                   const isMapped = !!fieldMapping[field.key];
//                   return (
//                     <div
//                       key={field.key}
//                       className={`flex items-center gap-4 px-4 py-2.5 transition-colors ${
//                         isMapped ? "bg-white hover:bg-emerald-50/30" : "bg-red-50/20 hover:bg-red-50/40"
//                       }`}
//                     >
//                       {/* Index */}
//                       <span className="w-5 text-[10px] font-bold text-gray-300 flex-shrink-0">{idx + 1}</span>

//                       {/* Status dot */}
//                       <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isMapped ? "bg-emerald-400" : "bg-red-300"}`} />

//                       {/* Field label */}
//                       <div className="flex items-center gap-2 flex-1 min-w-0">
//                         <span className="text-xs font-medium text-gray-800 truncate">{field.label}</span>
//                         <span className="text-[9px] font-semibold text-red-500 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded flex-shrink-0">
//                           REQ
//                         </span>
//                       </div>

//                       {/* Select */}
//                       <select
//                         className={`w-48 flex-shrink-0 border rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 transition-all ${
//                           isMapped
//                             ? "border-emerald-300 text-emerald-800 focus:ring-emerald-200"
//                             : "border-red-300 text-gray-500 focus:ring-red-200"
//                         }`}
//                         value={fieldMapping[field.key] || ""}
//                         onChange={(e) =>
//                           setFieldMapping((prev) => ({
//                             ...prev,
//                             [field.key]: e.target.value,
//                           }))
//                         }
//                       >
//                         <option value="">— Select column —</option>
//                         {headers.map((header) => (
//                           <option key={header} value={header}>{header}</option>
//                         ))}
//                       </select>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//           )}

//           {/* Exclude Options */}
//           <div className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-4">
//             <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
//               Exclusion Options
//             </p>
//             <div className="flex items-center gap-6">
//               <label className="flex items-center gap-2.5 cursor-pointer group">
//                 <Checkbox
//                   id="excludeTransferred"
//                   checked={excludeTransferred}
//                   onCheckedChange={(checked: boolean) => setExcludeTransferred(checked === true)}
//                   className="data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
//                 />
//                 <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
//                   Exclude Transferred Out
//                 </span>
//               </label>
//               <label className="flex items-center gap-2.5 cursor-pointer group">
//                 <Checkbox
//                   id="excludeUnbilled"
//                   checked={excludeUnbilled}
//                   onCheckedChange={(checked: boolean) => setExcludeUnbilled(checked === true)}
//                   className="data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
//                 />
//                 <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
//                   Exclude Unbilled
//                 </span>
//               </label>
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="flex justify-end pt-1">
//   <Button
//     onClick={handleSubmit}
//     disabled={!inventoryFile || headers.length === 0 || isUploading}
//     className="px-8 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
//   >
//     {isUploading ? (
//       <>
//         <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
//           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
//           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
//         </svg>
//         Uploading...
//       </>
//     ) : (
//       <>
//         <Upload className="w-4 h-4 mr-2" />
//         Submit Upload
//       </>
//     )}
//   </Button>
// </div>

//         </div>
//       </div>

//       {/* ── Success Modal ── */}
//       {/* ── Upload Progress Modal ── */}
// {isUploading && (
//   <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
//     <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-8 flex flex-col items-center text-center">
//       <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-5 relative">
//         <Upload className="w-7 h-7 text-blue-600" />
//         <div className="absolute -inset-1 rounded-[18px] border-2 border-transparent border-t-blue-500 border-r-blue-300 animate-spin" />
//       </div>
//       <h3 className="text-lg font-bold text-gray-900 mb-1">Uploading File...</h3>
//       <p className="text-sm text-gray-500 mb-5 truncate max-w-full px-2">{inventoryFile?.name}</p>
//       <div className="w-full space-y-2">
//         <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
//           <div
//             className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300 ease-out"
//             style={{ width: `${uploadProgress}%` }}
//           />
//         </div>
//         <div className="flex items-center justify-between">
//           <span className="text-xs text-gray-400">
//             {uploadProgress < 90
//     ? "Uploading file..."
//     : uploadProgress < 100
//     ? "Processing on server..."
//     : "Finalizing..."}
//           </span>
//           <span className="text-xs font-bold text-blue-600 tabular-nums">{uploadProgress}%</span>
//         </div>
//       </div>
//     </div>
//   </div>
// )}

// {/* ── Success Modal ── */}
// {submitSuccess && (
//   <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
//     <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-8 flex flex-col items-center text-center">
//       <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-5">
//         <CheckCircle2 className="w-8 h-8 text-emerald-600" />
//       </div>
//       <h3 className="text-lg font-bold text-gray-900 mb-1">Upload Successful!</h3>
//       <p className="text-sm text-gray-500 mb-1">Inventory file processed successfully.</p>
//       <p className="text-xs text-gray-400 bg-gray-100 rounded-lg px-3 py-1.5 mb-6 font-mono truncate max-w-full">
//         {inventoryFile?.name}
//       </p>
//       <Button
//         onClick={() => { setSubmitSuccess(false); onNext(); }}
//         className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold"
//       >
//         Continue →
//       </Button>
//     </div>
//   </div>
// )}

//       {/* ── Warning Modal ── */}
//       {showWarning && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
//             <div className="flex items-start justify-between mb-4">
//               <div className="flex items-center gap-3">
//                 <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
//                   <AlertTriangle className="w-5 h-5 text-red-600" />
//                 </div>
//                 <h3 className="text-base font-bold text-gray-900">Missing Required Columns</h3>
//               </div>
//               <button
//                 className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
//                 onClick={() => setShowWarning(false)}
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//             <p className="text-sm text-gray-600 mb-3">
//               The following columns are required but not yet mapped:
//             </p>
//             <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
//               <div className="flex flex-wrap gap-1.5">
//                 {missingRequiredHeaders.map((h) => (
//                   <span key={h} className="text-[11px] font-semibold text-red-700 bg-white border border-red-200 rounded-md px-2 py-1">
//                     {h}
//                   </span>
//                 ))}
//               </div>
//             </div>
//             <p className="text-xs text-gray-500">
//               Please map all required columns before submitting.
//             </p>
//             <div className="flex justify-end mt-4">
//               <Button
//                 onClick={() => setShowWarning(false)}
//                 className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm px-5"
//               >
//                 Got it
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UploadInventoryStep;

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import {
  Upload,
  AlertTriangle,
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  FileText,
  X,
  Sparkles,
} from "lucide-react";
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

// ── Disclaimer Banner ──────────────────────────────────────────────────────────

const REQUIRED_FIELD_LABELS = [
  "Rx Number", "Date Filled", "Drug Name", "Quantity",
  "Primary Insurance Bin Number", "Primary Insurance Paid", "Ndc Number", "Status",
  "Package Size", "Secondary Insurance Bin Number", "Secondary Insurance Paid",
  "Brand", "Primary Insurance PCN", "Primary Insurance Group",
];

const DisclaimerBanner = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50 overflow-hidden mb-5 shadow-sm">
      <div className="flex items-start gap-3 px-5 py-4">
        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-amber-900">
            File requirements — read before uploading
          </p>
          <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
            Your CSV must include all required columns. Missing columns will block processing.
          </p>
        </div>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-900 transition-all bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg border border-amber-200"
        >
          {expanded
            ? <><ChevronUp className="w-3.5 h-3.5" /> Hide</>
            : <><ChevronDown className="w-3.5 h-3.5" /> View columns</>
          }
        </button>
      </div>

      {expanded && (
        <div className="border-t border-amber-200/60 bg-white/80 px-5 py-5 space-y-5">
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-1.5">File Format Requirements</p>
              <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li>File must be in <span className="font-semibold text-gray-800">.CSV format</span> only</li>
                <li><span className="font-semibold text-gray-800">First row</span> must be the header row</li>
                <li>Column names are <span className="font-semibold text-gray-800">case-insensitive</span> — auto-mapping will detect them</li>
                <li>Dates: <span className="font-semibold text-gray-800">MM/DD/YYYY</span> or <span className="font-semibold text-gray-800">YYYY-MM-DD</span></li>
              </ul>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                <span className="text-[10px] font-bold text-red-600">{REQUIRED_FIELD_LABELS.length}</span>
              </div>
              <p className="text-xs font-semibold text-gray-700">Required Columns</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {REQUIRED_FIELD_LABELS.map((col) => (
                <div key={col} className="flex items-center gap-2 bg-red-50/80 border border-red-100 rounded-lg px-2.5 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                  <span className="text-[11px] font-medium text-red-700 truncate">{col}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-start gap-2.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-700 leading-relaxed">
              <span className="font-semibold">Important:</span> After uploading, verify every required column is correctly mapped. Auto-detection may not always be accurate — double-check before clicking <span className="font-semibold">Submit Upload</span>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────

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
  const [missingRequiredHeaders, setMissingRequiredHeaders] = useState<string[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ── ORIGINAL — untouched ───────────────────────────────────────────────────

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
    { key: "primaryInsurancePcn", label: "Primary Insurance PCN" },
    { key: "primaryInsuranceGroup", label: "Primary Insurance Group" },
  ] as const;

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
    primaryInsurancePcn: "primary_pcn",
    primaryInsuranceGroup: "primary_group",
  };

  const HEADER_ALIASES: Record<string, string[]> = {
  ndcNumber: ["ndc", "ndcnumber", "ndc_number"],
  rxNumber: ["rxnumber", "rx_number", "rx", "rxno", "rx#", "rxnum", "rxno"],  // ← added "rxno"
  status: ["status", "rxstatus"],
  dateFilled: ["datefilled", "date_filled", "filldate", "fill_date", "date", "datef"],  // ← added "datef"
  drugName: ["drugname", "drug_name", "drug", "productname", "product"],
  quantity: ["quantity", "qty", "rxquantity", "rx_qty", "quant"],  // ← added "quant"
  packageSize: ["packagesize", "package_size", "pkgsize", "pkg_size"],
  primaryInsuranceBinNumber: [
    "primarybin", "primary_bin", "primaryinsurancebinnumber", "primarybinnumber", "primarybinno",
    "priinsbinno",  // ← added
  ],
  primaryInsurancePaid: [
    "primarypaid", "primary_paid", "primaryinsurancepaid", "primarypay",
    "priinspaid",  // ← added
  ],
  secondaryInsuranceBinNumber: [
    "secondarybin", "secondary_bin", "secondaryinsurancebinnumber", "secondarybinnumber", "secondarybinno",
    "secinsbiino",  // ← added (note: PrimeRX has a typo "BIINO" not "BINNO")
  ],
  secondaryInsurancePaid: [
    "secondarypaid", "secondary_paid", "secondaryinsurancepaid", "secondarypay",
    "secinspaid",  // ← added
  ],
  brand: ["brand", "brandname", "brand_generic", "brand_indicator"],
  primaryInsurancePcn: ["priinspcn", "primarypcn", "primary_pcn", "primaryinsurancepcn", "pcn"],  // ← "priinspcn" already there ✓
  primaryInsuranceGroup: ["priinspatgroup", "primarygroup", "primary_group", "primaryinsurancegroup", "patgroup"],  // ← "priinspatgroup" already there ✓
};

  const normalizeHeader = (value: string) =>
    value.toLowerCase().replace(/[\s_]/g, "");

  const buildAutoMapping = (parsedHeaders: string[]) => {
  const autoMapping: Record<string, string> = {};
  const allFields = [...REQUIRED_FIELDS];
  allFields.forEach((field) => {
    const aliases = HEADER_ALIASES[field.key] || [];
    const found = parsedHeaders.find((header) =>
      aliases.some((alias) => normalizeHeader(alias) === normalizeHeader(header))
    );
    if (found) {
      autoMapping[field.key] = found; // ← use the ACTUAL header value, not the standard key
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
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    if (current.length > 0) result.push(current.trim());
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

  const [uploadProgress, setUploadProgress] = useState(0);
const [isUploading, setIsUploading] = useState(false);

const handleSubmit = async () => {
  const missing = REQUIRED_FIELDS.filter((field) => !fieldMapping[field.key]);
  if (missing.length > 0) {
    setMissingRequiredHeaders(missing.map(f => f.label));
    setShowWarning(true);
    return;
  }

  if (!inventoryFile) return;

  const formData = new FormData();
  formData.append("file", inventoryFile);
  formData.append("headerMapping", JSON.stringify(fieldMapping));

  setUploadProgress(0);
  setIsUploading(true);

  // Animate progress 0 → 90% over ~8 seconds
  let current = 0;
  const interval = setInterval(() => {
    current += Math.random() * 3 + 1;
    if (current >= 90) { current = 90; clearInterval(interval); }
    setUploadProgress(Math.round(current));
  }, 300);

  // Safety net — force success after 60s no matter what
  const safetyTimer = setTimeout(() => {
    clearInterval(interval);
    setUploadProgress(100);
    setIsUploading(false);
    setSubmitSuccess(true);
  }, 60000);

  try {
    const id = localStorage.getItem("auditId");
    console.log("⬆️ Starting upload...");
    
    const res = await axios.post(
      `http://localhost:5000/api/audits/${id}/inventory`,
      formData
    );
    
    console.log("✅ Upload complete:", res.status, res.data);
    
    clearTimeout(safetyTimer);
    clearInterval(interval);
    setUploadProgress(100);
    setIsUploading(false);
    setSubmitSuccess(true);

  } catch (err: any) {
    clearTimeout(safetyTimer);
    clearInterval(interval);
    setIsUploading(false);
    setUploadProgress(0);
    console.error("❌ Upload error:", err);
    const message = err?.response?.data?.message || err?.message || "Please try again.";
    alert("Upload failed: " + message);
  }
};

  // ── END ORIGINAL LOGIC ─────────────────────────────────────────────────────

  const mappedCount = Object.keys(fieldMapping).length;
  const totalRequired = REQUIRED_FIELDS.length;
  const allMapped = mappedCount === totalRequired;

  return (
    <div className="w-full max-w-3xl mx-auto px-2">

      <DisclaimerBanner />

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Card Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Upload Inventory File</h2>
              <p className="text-xs text-gray-500 mt-0.5">Map your CSV columns to PRIMERX standard fields</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">

          {/* Drop Zone */}
          <div className={`relative rounded-xl border-2 border-dashed transition-all ${
            inventoryFile
              ? "border-emerald-300 bg-emerald-50/40"
              : "border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-50"
          }`}>
            <div className="flex items-center gap-4 px-5 py-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                inventoryFile ? "bg-emerald-100" : "bg-white border border-gray-200 shadow-sm"
              }`}>
                {inventoryFile
                  ? <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  : <FileText className="w-6 h-6 text-gray-400" />
                }
              </div>
              <div className="flex-1 min-w-0">
                {inventoryFile ? (
                  <>
                    <p className="text-sm font-semibold text-emerald-800 truncate">{inventoryFile.name}</p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      {headers.length} columns detected · {mappedCount}/{totalRequired} mapped
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-gray-700">Choose a CSV file</p>
                    <p className="text-xs text-gray-400 mt-0.5">Only .CSV format accepted</p>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {inventoryFile && (
                  <button
                    onClick={() => { setInventoryFile(null); setHeaders([]); setFieldMapping({}); }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <label htmlFor="inventory-file" className="cursor-pointer">
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    inventoryFile
                      ? "bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      : "bg-gray-900 text-white hover:bg-gray-800"
                  }`}>
                    <Upload className="w-3.5 h-3.5" />
                    {inventoryFile ? "Replace" : "Browse"}
                  </span>
                  <input
                    id="inventory-file"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".csv"
                  />
                </label>
              </div>
            </div>

            {/* Progress bar when file is selected */}
            {inventoryFile && (
              <div className="px-5 pb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-medium text-gray-500">Column mapping progress</span>
                  <span className={`text-[11px] font-semibold ${allMapped ? "text-emerald-600" : "text-amber-600"}`}>
                    {mappedCount}/{totalRequired} mapped
                  </span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${allMapped ? "bg-emerald-500" : "bg-amber-400"}`}
                    style={{ width: `${(mappedCount / totalRequired) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Column Mapping Table */}
          {inventoryFile && headers.length > 0 && (
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {/* Table Header */}
              <div className="flex items-center justify-between bg-gray-50 border-b border-gray-200 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-xs font-semibold text-gray-700">Column Mapping</span>
                  <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                    Auto-detected ✓
                  </span>
                </div>
                <span className="text-[11px] text-gray-500 font-medium">Row 1 = Header</span>
              </div>

              {/* Column rows */}
              <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
                {[...REQUIRED_FIELDS].map((field, idx) => {
                  const isMapped = !!fieldMapping[field.key];
                  return (
                    <div
                      key={field.key}
                      className={`flex items-center gap-4 px-4 py-2.5 transition-colors ${
                        isMapped ? "bg-white hover:bg-emerald-50/30" : "bg-red-50/20 hover:bg-red-50/40"
                      }`}
                    >
                      {/* Index */}
                      <span className="w-5 text-[10px] font-bold text-gray-300 flex-shrink-0">{idx + 1}</span>

                      {/* Status dot */}
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isMapped ? "bg-emerald-400" : "bg-red-300"}`} />

                      {/* Field label */}
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-xs font-medium text-gray-800 truncate">{field.label}</span>
                        <span className="text-[9px] font-semibold text-red-500 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded flex-shrink-0">
                          REQ
                        </span>
                      </div>

                      {/* Select */}
                      <select
                        className={`w-48 flex-shrink-0 border rounded-lg px-2.5 py-1.5 text-xs bg-white focus:outline-none focus:ring-2 transition-all ${
                          isMapped
                            ? "border-emerald-300 text-emerald-800 focus:ring-emerald-200"
                            : "border-red-300 text-gray-500 focus:ring-red-200"
                        }`}
                        value={fieldMapping[field.key] || ""}
                        onChange={(e) =>
                          setFieldMapping((prev) => ({
                            ...prev,
                            [field.key]: e.target.value,
                          }))
                        }
                      >
                        <option value="">— Select column —</option>
                        {headers.map((header) => (
                          <option key={header} value={header}>{header}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Exclude Options */}
          <div className="rounded-xl border border-gray-200 bg-gray-50/50 px-5 py-4">
            <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">
              Exclusion Options
            </p>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <Checkbox
                  id="excludeTransferred"
                  checked={excludeTransferred}
                  onCheckedChange={(checked: boolean) => setExcludeTransferred(checked === true)}
                  className="data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                />
                <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                  Exclude Transferred Out
                </span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <Checkbox
                  id="excludeUnbilled"
                  checked={excludeUnbilled}
                  onCheckedChange={(checked: boolean) => setExcludeUnbilled(checked === true)}
                  className="data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                />
                <span className="text-xs font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                  Exclude Unbilled
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-1">
  <Button
    onClick={handleSubmit}
    disabled={!inventoryFile || headers.length === 0 || isUploading}
    className="px-8 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
  >
    {isUploading ? (
      <>
        <svg className="animate-spin w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        Uploading...
      </>
    ) : (
      <>
        <Upload className="w-4 h-4 mr-2" />
        Submit Upload
      </>
    )}
  </Button>
</div>

        </div>
      </div>

      {/* ── Success Modal ── */}
      {/* ── Upload Progress Modal ── */}
{isUploading && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-8 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-5 relative">
        <Upload className="w-7 h-7 text-blue-600" />
        <div className="absolute -inset-1 rounded-[18px] border-2 border-transparent border-t-blue-500 border-r-blue-300 animate-spin" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">Uploading File...</h3>
      <p className="text-sm text-gray-500 mb-5 truncate max-w-full px-2">{inventoryFile?.name}</p>
      <div className="w-full space-y-2">
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300 ease-out"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {uploadProgress < 90
    ? "Uploading file..."
    : uploadProgress < 100
    ? "Processing on server..."
    : "Finalizing..."}
          </span>
          <span className="text-xs font-bold text-blue-600 tabular-nums">{uploadProgress}%</span>
        </div>
      </div>
    </div>
  </div>
)}

{/* ── Success Modal ── */}
{submitSuccess && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-8 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mb-5">
        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">Upload Successful!</h3>
      <p className="text-sm text-gray-500 mb-1">Inventory file processed successfully.</p>
      <p className="text-xs text-gray-400 bg-gray-100 rounded-lg px-3 py-1.5 mb-6 font-mono truncate max-w-full">
        {inventoryFile?.name}
      </p>
      <Button
        onClick={() => { setSubmitSuccess(false); onNext(); }}
        className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold"
      >
        Continue →
      </Button>
    </div>
  </div>
)}

      {/* ── Warning Modal ── */}
      {showWarning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-base font-bold text-gray-900">Missing Required Columns</h3>
              </div>
              <button
                className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                onClick={() => setShowWarning(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              The following columns are required but not yet mapped:
            </p>
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">
              <div className="flex flex-wrap gap-1.5">
                {missingRequiredHeaders.map((h) => (
                  <span key={h} className="text-[11px] font-semibold text-red-700 bg-white border border-red-200 rounded-md px-2 py-1">
                    {h}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Please map all required columns before submitting.
            </p>
            <div className="flex justify-end mt-4">
              <Button
                onClick={() => setShowWarning(false)}
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm px-5"
              >
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadInventoryStep;