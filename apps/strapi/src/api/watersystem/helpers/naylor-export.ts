/**
 * The Naylor directory file for water systems — built entirely on the server.
 *
 *   GET /api/watersystems/naylor-export
 *     query water systems (+ contacts)  →  active members  →  rows  →  CSV
 *
 * This file is the contract with Naylor (the directory publisher): which
 * columns exist, in what order, which systems count as current members,
 * which contacts print and in which slot. It used to be assembled in
 * member-manager, where it walked the user's visible grid columns — hiding
 * "Office Hours" in the grid blanked "Office Hours" in the published
 * directory (2026-09-17). Nothing about
 * a user's view (columns, filters, sort, saved preferences, page size) can reach
 * it from here. Every function below is pure; the controller does the two
 * queries and hands the rows in.
 */
import dayjs, { Dayjs } from 'dayjs';

/** Directory contact slots printed per system. */
export const NAYLOR_CONTACT_SLOTS = 3;

export type NaylorContact = {
  id?: number | string;
  first?: string | null;
  last?: string | null;
  title?: string | null;
  email?: string | null;
  directory_opt_out?: boolean | null;
};

export type NaylorSystem = Record<string, unknown> & {
  name?: string | null;
  county?: string | null;
  payment_previous_date?: string | null;
  payment_last_date?: string | null;
  contacts?: NaylorContact[] | null;
};

/**
 * Per-contact columns, in print order: name and title only. ORWA asked
 * (2026-09-15) that the per-contact email and phone stay out of the printed
 * directory — the system row already carries the office phone and email. The
 * contact's email is still read: it is the key that applies a directory
 * opt-out across duplicate contact rows.
 */
export const NAYLOR_CONTACT_FIELDS: Array<{
  label: string;
  field: 'title' | 'first' | 'last';
}> = [
  { label: 'Title', field: 'title' },
  { label: 'First Name', field: 'first' },
  { label: 'Last Name', field: 'last' },
];

// ---------------------------------------------------------------------------
// Membership: only current members are published in the directory.
// ---------------------------------------------------------------------------

const parsePaymentDate = (value: unknown): Dayjs | null => {
  if (value == null || value === '') return null;
  const parsed = dayjs(value as string);
  return parsed.isValid() ? parsed : null;
};

/**
 * Expiration = last payment + 1 year, plus the overlap days when they renewed
 * before the previous period ended (paid 02/10 against a 04/08 expiry → the new
 * period still ends 04/08 next year). Mirrors member-manager's
 * `getExpirationDate`, which is what the grid's Active / Inactive badge shows —
 * NOT the older rule in `update-membership-status`, and not the
 * `get-active-systems` middleware's flat "paid within a year".
 *
 * @returns null when there is no payment to derive an end from.
 */
export const membershipExpiration = (
  previousPayment: unknown,
  lastPayment: unknown
): Dayjs | null => {
  const current = parsePaymentDate(lastPayment);
  const previous = parsePaymentDate(previousPayment);

  if (!current) return previous ? previous.add(1, 'year') : null;
  if (!previous) return current.add(1, 'year');

  const newPeriodEnd = current.add(1, 'year');
  const previousPeriodEnd = previous.add(1, 'year');
  if (current.isBefore(previousPeriodEnd)) {
    return newPeriodEnd.add(previousPeriodEnd.diff(current, 'day'), 'day');
  }
  return newPeriodEnd;
};

export const isMembershipActive = (
  previousPayment: unknown,
  lastPayment: unknown,
  now: Date = new Date()
): boolean => {
  const expiration = membershipExpiration(previousPayment, lastPayment);
  return expiration !== null && expiration.isAfter(now);
};

// ---------------------------------------------------------------------------
// Columns
// ---------------------------------------------------------------------------

/**
 * The system columns, in print order, each read straight off the record.
 *
 * The name is printed plain. It used to carry a leading `*` for current
 * members, back when the file listed every system; the file is members-only
 * now (see `buildNaylorRows`), so the mark would be on every row.
 */
export const NAYLOR_SYSTEM_FIELDS: Array<{
  label: string;
  value: (system: NaylorSystem) => unknown;
}> = [
  { label: 'System Name', value: (system) => system.name },
  { label: 'County', value: (system) => system.county },
  { label: 'Office Hours', value: (system) => system.office_hours },
  { label: '# Meters', value: (system) => system.meters },
  { label: 'Website', value: (system) => system.url },
  { label: 'Board Meeting', value: (system) => system.board_meeting },
  { label: 'ORWAAG', value: (system) => system.orwaag },
  { label: 'Physical Address', value: (system) => system.address_physical_line1 },
  { label: 'Physical City', value: (system) => system.address_physical_city },
  { label: 'Physical State', value: (system) => system.address_physical_state },
  { label: 'Physical Zip', value: (system) => system.address_physical_zip },
  { label: 'Mailing Address', value: (system) => system.address_mailing_pobox },
  { label: 'Mailing City', value: (system) => system.address_mailing_city },
  { label: 'Mailing State', value: (system) => system.address_mailing_state },
  { label: 'Mailing Zip', value: (system) => system.address_mailing_zip },
  { label: 'System Type', value: (system) => system.system_type_dirty },
  { label: 'Email', value: (system) => system.email },
  { label: 'Phone', value: (system) => system.phone },
  { label: 'Fax', value: (system) => system.fax },
];

/** `Contact 1: Title` … in the order they are printed. */
export const naylorContactColumnLabels = (): string[] => {
  const labels: string[] = [];
  for (let slot = 1; slot <= NAYLOR_CONTACT_SLOTS; slot += 1) {
    for (const { label } of NAYLOR_CONTACT_FIELDS) {
      labels.push(`Contact ${slot}: ${label}`);
    }
  }
  return labels;
};

/** Every column of the file, in print order. */
export const naylorColumnLabels = (): string[] => [
  ...NAYLOR_SYSTEM_FIELDS.map(({ label }) => label),
  ...naylorContactColumnLabels(),
];

/**
 * One printable cell. `true` prints as the directory's `+` mark, `false` as
 * nothing. Line breaks collapse to "; " — office hours are typed on several
 * lines, and a cell spanning lines breaks the row-per-system layout Naylor
 * imports.
 */
export const naylorCell = (value: unknown): string => {
  if (value == null) return '';
  if (typeof value === 'boolean') return value ? '+' : '';
  // Trim first so a trailing line break doesn't leave a dangling "; ".
  return String(value)
    .trim()
    .replace(/\s*[\r\n]+\s*/g, '; ');
};

// ---------------------------------------------------------------------------
// Directory contacts: opt-out, then print order
// ---------------------------------------------------------------------------

/** "" when there is no usable email — never a set member. */
export const normalizeEmail = (email: unknown): string =>
  typeof email === 'string' ? email.trim().toLowerCase() : '';

/**
 * Emails that opted out of the directory, from the contacts table. The same
 * person often exists as several contact rows (one per system, or a
 * duplicate); an opt-out on any of them is a statement about the person.
 */
export const collectOptOutEmails = (
  optedOutContacts: Array<{ email?: unknown }>
): Set<string> => {
  const emails = new Set<string>();
  for (const contact of optedOutContacts) {
    const email = normalizeEmail(contact?.email);
    // An empty key would match every contact that has no email at all.
    if (email) emails.add(email);
  }
  return emails;
};

export const isOptedOut = (
  contact: NaylorContact,
  optOutEmails: ReadonlySet<string>
): boolean => {
  if (contact.directory_opt_out === true) return true;
  const email = normalizeEmail(contact.email);
  return email !== '' && optOutEmails.has(email);
};

/**
 * Print order for directory contacts, left to right. Any title outside this
 * list (including a blank one) sorts last.
 */
export const DIRECTORY_TITLE_PRINT_ORDER = [
  'Chairman',
  'Vice-Chairman',
  'Director',
  'Manager',
  'Operator',
  'Bookkeeper',
] as const;

/** Titles are free text: compare case-, space- and punctuation-insensitively. */
const titleKey = (title: unknown): string =>
  typeof title === 'string' ? title.toLowerCase().replace(/[^a-z0-9]/g, '') : '';

const TITLE_RANK = new Map<string, number>(
  DIRECTORY_TITLE_PRINT_ORDER.map((title, index) => [titleKey(title), index])
);

export const directoryTitleRank = (title: unknown): number =>
  TITLE_RANK.get(titleKey(title)) ?? DIRECTORY_TITLE_PRINT_ORDER.length;

/**
 * The contacts that may be published for a system, in print order. Stable:
 * contacts sharing a rank keep the order they were linked in. Re-indexed, so
 * suppressing someone closes the gap instead of leaving an empty slot.
 */
export const publishableContacts = (
  system: NaylorSystem,
  optOutEmails: ReadonlySet<string>
): NaylorContact[] => {
  const contacts = Array.isArray(system.contacts) ? system.contacts : [];
  return contacts
    .filter(
      (contact): contact is NaylorContact =>
        contact != null && typeof contact === 'object'
    )
    .filter((contact) => !isOptedOut(contact, optOutEmails))
    .map((contact, index) => ({ contact, index }))
    .sort(
      (a, b) =>
        directoryTitleRank(a.contact.title) -
          directoryTitleRank(b.contact.title) || a.index - b.index
    )
    .map(({ contact }) => contact);
};

// ---------------------------------------------------------------------------
// Rows and CSV
// ---------------------------------------------------------------------------

const districtNumber = (name: string): number | null => {
  const match = name.match(/#(\d+)/);
  return match ? parseInt(match[1], 10) : null;
};

/** County, then "… RWD #2" before "… RWD #10" (numbered systems lead), then name. */
const compareRows = (
  a: Record<string, string>,
  b: Record<string, string>
): number => {
  const countyA = (a['County'] || '').toLowerCase();
  const countyB = (b['County'] || '').toLowerCase();
  if (countyA < countyB) return -1;
  if (countyA > countyB) return 1;

  const nameA = a['System Name'] || '';
  const nameB = b['System Name'] || '';
  const numA = districtNumber(nameA);
  const numB = districtNumber(nameB);
  if (numA !== null && numB !== null && numA !== numB) return numA - numB;
  if (numA !== null && numB === null) return -1;
  if (numA === null && numB !== null) return 1;

  if (nameA.toLowerCase() < nameB.toLowerCase()) return -1;
  if (nameA.toLowerCase() > nameB.toLowerCase()) return 1;
  return 0;
};

/**
 * @param systems every water system, with `contacts` populated (members are
 *   selected here, not by the caller)
 * @param optedOutContacts contacts rows flagged `directory_opt_out`
 * @param now injectable clock for the membership test (tests)
 * @returns one row per ACTIVE member system, keyed by column label, in
 *   directory order
 */
export const buildNaylorRows = (
  systems: NaylorSystem[],
  optedOutContacts: Array<{ email?: unknown }> = [],
  now: Date = new Date()
): Array<Record<string, string>> => {
  const optOutEmails = collectOptOutEmails(optedOutContacts);

  // The published directory is current members only (ORWA, 2026-09-17).
  // "Active" is exactly what the member-manager grid's Active badge means:
  // paid within the last year, extended by the overlap when they renewed early
  // — so a system staff see as Active is never missing from the directory.
  const members = systems.filter((system) =>
    isMembershipActive(
      system.payment_previous_date,
      system.payment_last_date,
      now
    )
  );

  const rows = members.map((system) => {
    const row: Record<string, string> = {};
    for (const { label, value } of NAYLOR_SYSTEM_FIELDS) {
      row[label] = naylorCell(value(system));
    }
    const contacts = publishableContacts(system, optOutEmails);
    for (let slot = 1; slot <= NAYLOR_CONTACT_SLOTS; slot += 1) {
      const contact = contacts[slot - 1];
      for (const { label, field } of NAYLOR_CONTACT_FIELDS) {
        row[`Contact ${slot}: ${label}`] = naylorCell(contact?.[field]);
      }
    }
    return row;
  });

  return rows.sort(compareRows);
};

const csvCell = (value: string): string => `"${value.replace(/"/g, '""')}"`;

/**
 * RFC 4180: every cell quoted, quotes doubled, CRLF rows. Quoting everything
 * keeps commas in system names and leading zeros in ZIP codes intact without
 * per-cell rules.
 */
export const toNaylorCsv = (rows: Array<Record<string, string>>): string => {
  const labels = naylorColumnLabels();
  const lines = [
    labels.map(csvCell).join(','),
    ...rows.map((row) =>
      labels.map((label) => csvCell(row[label] ?? '')).join(',')
    ),
  ];
  return `${lines.join('\r\n')}\r\n`;
};
