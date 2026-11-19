// Which supplier rows the "Upload supplier files" step starts with.
//
//  • An existing report (opened from Reports → Supplier Files or Inventory
//    Files) shows one row per supplier that has a file uploaded for THAT
//    report, A–Z. The account's supplier list is not used: it changes every
//    time a new report is set up, and an older report must keep showing its
//    own suppliers.
//  • A new report starts with the account's selected suppliers, as before,
//    plus any supplier already uploaded to it, so an uploaded file always has
//    a row.
export function initialSupplierNames(
  isEditMode: boolean,
  accountSuppliers: string[],
  uploadedFiles: { wholesaler_name: string }[],
): string[] {
  const uploaded = uploadedFiles.map((f) => f.wholesaler_name);
  const names = isEditMode
    ? [...uploaded].sort((a, b) =>
        String(a).localeCompare(String(b), undefined, { sensitivity: "base" }),
      )
    : [...accountSuppliers, ...uploaded];
  // A report can hold two files for one supplier: one row is enough.
  return names.filter((name, i) => !!name && names.indexOf(name) === i);
}
