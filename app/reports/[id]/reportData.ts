/**
 * Single source of truth for report row shape and the derived financial math
 * (shortages, unit, njBilled, rank, highestShortage).
 *
 * Both the desktop and mobile report views import from here. Do NOT duplicate
 * these calculations — two copies would drift and report different dollar
 * figures for the same drug.
 */

export interface InventoryRow {
  id: number;
  ndc: string;
  drugName: string;
  rank: number;
  pkgSize: number;
  unit: number;
  totalOrdered: number;
  totalBilled: number;
  totalShortage: number;
  highestShortage: number;
  cost: number;
  amount: number;
  // Commercial
  horizon: number;
  shortageHorizon: number;
  express: number;
  shortageExpress: number;
  cvsCaremark: number;
  shortageCvsCaremark: number;
  optumrx: number;
  shortageOptumrx: number;
  humana: number;
  shortageHumana: number;
  ssc: number;
  shortageSsc: number;
  pdmi: number;
  shortagePdmi: number;
  // Coupon
  coupon: number;
  shortageCoupon: number;
  // Others
  govMilitary: number;
  shortageGovMilitary: number;
  // Medicare
  medicare: number;
  shortageMedicare: number;
  // Medicaid
  njMedicaid: number;
  shortageNjMedicaid: number;
  // Medicare + Medicaid combined
  njBilled: number;
  shortageNjBilled: number;

  brand: string | null;

  // Aberrant report
  claimsCount: number;
  isAberrant: boolean;
  aberrantCaremarkClaims: number;
  aberrantCaremarkAmount: number;
  caremarkClaimsCount: number;
  caremarkAmountTotal: number;
}

/** Maps the raw API payload to InventoryRow[] and derives every computed field. */
export function normalizeReportRows(json: unknown): InventoryRow[] {
  const data: any[] = Array.isArray(json)
    ? json
    : Array.isArray((json as any)?.inventory)
      ? (json as any).inventory
      : [];

  const norm: InventoryRow[] = data.map((row: any, i: number) => {
    const to = Number(row.total_ordered ?? 0);
    const n = (x: any) => Number(x ?? 0);

    const medicareVal = n(row.medicare);
    const njMedicaidVal = n(row.nj_medicaid ?? row.njMedicaid);
    const njBilledVal = medicareVal + njMedicaidVal;
    // Shortages calculated individually first so combined can sum them
    const shortageMedicareVal = to - medicareVal;
    const shortageNjMedicaidVal = to - njMedicaidVal;

    return {
      id: row.id ?? i + 1,
      ndc: row.ndc ?? "",
      drugName: (row.drug_name ?? row.drugName ?? "")
        .replace(/\s*\(\d{5}-\d{4}-\d{2}\).*$/, "")
        .trim(),
      brand: row.brand ?? null,
      rank: 0,
      pkgSize: row.package_size ?? 0,
      unit:
        row.package_size > 0
          ? Number((n(row.total_billed) / Number(row.package_size)).toFixed(2))
          : 0,
      totalOrdered: to,
      totalBilled: n(row.total_billed),
      totalShortage:
        row.total_shortage != null
          ? n(row.total_shortage)
          : to - n(row.total_billed),
      highestShortage: 0,
      cost: n(row.cost),
      amount: n(row.total_amount ?? row.amount),
      // Commercial
      horizon: n(row.horizon),
      shortageHorizon: to - n(row.horizon),
      express: n(row.express),
      shortageExpress: to - n(row.express),
      cvsCaremark: n(row.cvs_caremark ?? row.cvsCaremark),
      shortageCvsCaremark: to - n(row.cvs_caremark ?? row.cvsCaremark),
      optumrx: n(row.optumrx),
      shortageOptumrx: to - n(row.optumrx),
      humana: n(row.humana),
      shortageHumana: to - n(row.humana),
      ssc: n(row.ssc),
      shortageSsc: to - n(row.ssc),
      pdmi: n(row.pdmi),
      shortagePdmi: to - n(row.pdmi),
      // Coupon
      coupon: n(row.coupon),
      shortageCoupon: to - n(row.coupon),
      // Others
      govMilitary: n(row.gov_military),
      shortageGovMilitary: to - n(row.gov_military),
      // Medicare
      medicare: medicareVal,
      shortageMedicare: shortageMedicareVal,
      // Medicaid
      njMedicaid: njMedicaidVal,
      shortageNjMedicaid: shortageNjMedicaidVal,
      // NJ Billed = njMedicaid + medicare; shortage = sum of both shortages
      njBilled: njBilledVal,
      shortageNjBilled: shortageMedicareVal + shortageNjMedicaidVal,
      // Aberrant report
      claimsCount: n(row.claims_count),
      isAberrant: Boolean(row.is_aberrant),
      aberrantCaremarkClaims: n(row.aberrant_caremark_claims),
      aberrantCaremarkAmount: n(row.aberrant_caremark_amount),
      caremarkClaimsCount: n(row.caremark_claims_count),
      caremarkAmountTotal: n(row.caremark_amount_total),
    };
  });

  // Rank by dollar amount, descending.
  [...norm]
    .sort((a, b) => b.amount - a.amount)
    .forEach((r, i) => {
      r.rank = i + 1;
    });

  // Highest shortage = the most negative PBM shortage, or 0 if none are negative.
  norm.forEach((r) => {
    const min = Math.min(
      r.shortageHorizon,
      r.shortageExpress,
      r.shortageCvsCaremark,
      r.shortageOptumrx,
      r.shortageHumana,
      r.shortageSsc,
      r.shortagePdmi,
      r.shortageCoupon,
      r.shortageGovMilitary,
      r.shortageMedicare,
      r.shortageNjMedicaid,
    );
    r.highestShortage = min < 0 ? min : 0;
  });

  return norm;
}

/** Fetches the report for an audit and returns fully normalized rows. */
export async function fetchReportRows(auditId: string): Promise<InventoryRow[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/audits/${auditId}/report`,
  );
  return normalizeReportRows(await res.json());
}
