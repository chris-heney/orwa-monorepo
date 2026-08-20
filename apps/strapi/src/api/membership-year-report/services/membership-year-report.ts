/**
 * Year-over-year membership counts, derived from the invoice ledger.
 *
 * `invoices` is the transaction record: membership-forms writes one per new
 * application and per renewal, and it is completed (payment_date set) when the
 * card settles or an admin confirms the invoice. Counting distinct members per
 * year of payment answers "how many memberships were transacted in year N"
 * from data, so the series gains each new year on its own.
 *
 * Rows without a payment_date are invoices that were raised but never paid, so
 * they are not transactions and are excluded.
 */

const MEMBER_RESOURCES = ['watersystems', 'associates'];

export interface MembershipYearRow {
  year: number;
  systems: number;
  associates: number;
}

/**
 * The years that predate the invoice ledger. There are no transactions to
 * derive these from, so they stay as the recorded figures the summary has
 * always shown. Any year that has real transactions replaces its entry here
 * outright — these are a floor for history, never a supplement to live data.
 */
export const HISTORICAL_YEARS: MembershipYearRow[] = [
  { year: 2021, systems: 529, associates: 111 },
  { year: 2022, systems: 380, associates: 96 },
  { year: 2023, systems: 458, associates: 104 },
];

/**
 * The first year memberships were tracked through the ledger for a full year.
 * 2024 has a handful of transactions from the ledger coming online mid-year —
 * a couple of rows against four hundred in 2025 — which reads as a collapse in
 * membership rather than the start of record keeping. Years before this are
 * not reported at all.
 */
export const TRANSACTION_TRACKING_START_YEAR = 2025;

/**
 * Reshapes the grouped SQL rows into one entry per year with both counts, then
 * layers them over the pre-ledger history. A year appears if it has either.
 */
export const buildYearRows = (
  rows: { year: unknown; resource: string; members: unknown }[],
  historical: MembershipYearRow[] = HISTORICAL_YEARS,
  trackingStartYear: number = TRANSACTION_TRACKING_START_YEAR,
): MembershipYearRow[] => {
  const byYear = new Map<number, MembershipYearRow>();

  for (const row of rows) {
    // Number(null) is 0, which is finite — check for absence before coercing.
    if (row.year == null || row.year === '') {
      continue;
    }
    const year = Number(row.year);
    if (!Number.isFinite(year) || year <= 0) {
      continue;
    }
    // Partial years from before tracking was in place are not reportable.
    if (year < trackingStartYear) {
      continue;
    }

    const entry = byYear.get(year) ?? { year, systems: 0, associates: 0 };
    const members = Number(row.members) || 0;

    if (row.resource === 'watersystems') {
      entry.systems = members;
    } else if (row.resource === 'associates') {
      entry.associates = members;
    }

    byYear.set(year, entry);
  }

  // Start from history, then let any year with real transactions replace its
  // entry wholesale — never merge the two, or a year with only water system
  // transactions would keep a historical associate count beside a live one.
  const merged = new Map(historical.map((row) => [row.year, { ...row }]));
  for (const [year, row] of byYear) {
    merged.set(year, row);
  }

  return [...merged.values()].sort((a, b) => a.year - b.year);
};

export default ({ strapi }) => ({
  getYearReport: async (): Promise<MembershipYearRow[]> => {
    const connection = strapi.db.connection;

    const rows = await connection('invoices')
      .select(
        connection.raw('YEAR(payment_date) as year'),
        'resource',
        // A member paying twice in a year is still one membership that year.
        connection.raw('COUNT(DISTINCT entity_id) as members'),
      )
      .whereNotNull('payment_date')
      .whereNotNull('entity_id')
      .whereIn('resource', MEMBER_RESOURCES)
      .groupByRaw('YEAR(payment_date), resource')
      .orderByRaw('YEAR(payment_date)');

    return buildYearRows(rows);
  },
});
