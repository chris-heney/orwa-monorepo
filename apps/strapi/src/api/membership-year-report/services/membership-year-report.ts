/**
 * Year-over-year membership counts, derived from the invoice ledger.
 *
 * `invoices` is the transaction record: membership-forms writes one per new
 * application and per renewal, and it is completed (payment_date set) when the
 * card settles or an admin confirms the invoice. Counting distinct members per
 * year of payment therefore answers "how many memberships were transacted in
 * year N" from data, rather than the hardcoded 2021–2023 figures the summary
 * chart used to carry.
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
 * Reshapes the grouped SQL rows into one entry per year with both counts.
 * Years with no transactions simply do not appear — the chart shows what was
 * recorded rather than inventing a zero.
 */
export const buildYearRows = (
  rows: { year: unknown; resource: string; members: unknown }[],
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

    const entry = byYear.get(year) ?? { year, systems: 0, associates: 0 };
    const members = Number(row.members) || 0;

    if (row.resource === 'watersystems') {
      entry.systems = members;
    } else if (row.resource === 'associates') {
      entry.associates = members;
    }

    byYear.set(year, entry);
  }

  return [...byYear.values()].sort((a, b) => a.year - b.year);
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
