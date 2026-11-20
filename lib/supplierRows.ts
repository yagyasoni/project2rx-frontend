// Which supplier rows the "Upload supplier files" step starts with.
//
// Every report keeps its own supplier list on the server (the suppliers
// picked for it, with or without an uploaded file). A new report gets a copy
// of the account's list when it is created. After that the two are separate:
// changing one report never changes another report or the account's list.
//
//  • reportSuppliers given: the rows are that report's own list, A–Z. Any
//    supplier with an uploaded file is included, so a file always has a row.
//  • reportSuppliers null (the list could not be loaded, for example the
//    server is older than this screen): fall back to the earlier rule. An
//    existing report shows the suppliers it has files for. A new report
//    starts with the account's selected suppliers plus anything uploaded.
const az = (names: string[]) =>
  [...names].sort((a, b) =>
    String(a).localeCompare(String(b), undefined, { sensitivity: "base" }),
  );

export function initialSupplierNames(
  isEditMode: boolean,
  accountSuppliers: string[],
  uploadedFiles: { wholesaler_name: string }[],
  reportSuppliers: string[] | null = null,
): string[] {
  const uploaded = uploadedFiles.map((f) => f.wholesaler_name);
  let names: string[];
  if (reportSuppliers) {
    names = az([...reportSuppliers, ...uploaded]);
  } else if (isEditMode) {
    names = az(uploaded);
  } else {
    names = [...accountSuppliers, ...uploaded];
  }
  // A report can hold two files for one supplier: one row is enough.
  return names.filter((name, i) => !!name && names.indexOf(name) === i);
}
