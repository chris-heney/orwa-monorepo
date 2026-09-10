import { RaRecord } from "react-admin";

export type DirectoryContactShape = {
  id?: number;
  first?: string;
  last?: string;
  title?: string;
  email?: string;
  phone?: string;
  address_mailing_line1?: string;
  address_mailing_line2?: string;
  address_mailing_city?: string;
  address_mailing_state?: string;
  address_mailing_zip?: string;
  directory_opt_out?: boolean;
};

/** Normalize watersystem `contacts` from API (ids only vs raw populated objects). */
export function getDirectoryContactsFromRecord(
  record: RaRecord | undefined
): DirectoryContactShape[] {
  const raw = record?.contacts;
  if (!Array.isArray(raw)) return [];
  return raw.filter((c): c is DirectoryContactShape => {
    if (c == null || typeof c !== "object") return false;
    const id = (c as DirectoryContactShape).id;
    return typeof id === "number" || typeof id === "string";
  });
}

export function getDirectoryContactField(
  record: RaRecord | undefined,
  /** 1-based index (first directory contact = 1) */
  oneBasedIndex: number,
  field: keyof DirectoryContactShape
): string {
  const list = getDirectoryContactsFromRecord(record);
  const c = list[oneBasedIndex - 1];
  if (!c) return "";
  const v = c[field];
  return v != null ? String(v) : "";
}

const DIR_CONTACT_SOURCE_RE =
  /^dir_contact_(\d+)_(first|last|title|email|phone|mail_line1|mail_line2|mail_city|mail_state|mail_zip)$/;

const DIR_CONTACT_SOURCE_TO_FIELD: Record<
  string,
  keyof DirectoryContactShape
> = {
  first: "first",
  last: "last",
  title: "title",
  email: "email",
  phone: "phone",
  mail_line1: "address_mailing_line1",
  mail_line2: "address_mailing_line2",
  mail_city: "address_mailing_city",
  mail_state: "address_mailing_state",
  mail_zip: "address_mailing_zip",
};

/** Parse `dir_contact_1_title` style keys for CSV export. */
export function directoryContactFieldFromSource(
  record: RaRecord | undefined,
  sourceKey: string
): string {
  const m = sourceKey.match(DIR_CONTACT_SOURCE_RE);
  if (!m) return "";
  const idx = parseInt(m[1], 10);
  const part = m[2];
  const field = DIR_CONTACT_SOURCE_TO_FIELD[part];
  if (!field) return "";
  return getDirectoryContactField(record, idx, field);
}

/**
 * Print order for directory contacts, left to right, by title.
 *
 * Held separately from WATERSYSTEM_DIRECTORY_TITLE_CHOICES on purpose: that
 * list drives a form picker and may be reordered for data-entry convenience,
 * while this is the order a published directory reads in. The two are kept in
 * step by a spec that fails if a picker choice has no rank here.
 *
 * Any title outside this list (including a blank one) sorts last.
 */
export const DIRECTORY_TITLE_PRINT_ORDER = [
  "Chairman",
  "Vice-Chairman",
  "Director",
  "Manager",
  "Operator",
  "Bookkeeper",
] as const;

/**
 * Comparison key for a title: case-, space- and punctuation-insensitive, so
 * "Vice-Chairman", "Vice Chairman" and "vice chairman" all rank together.
 * Titles are free text in Strapi, so they will not always match the picker.
 */
const normalizeTitleKey = (title: unknown): string =>
  typeof title === "string" ? title.toLowerCase().replace(/[^a-z0-9]/g, "") : "";

const TITLE_RANK = new Map<string, number>(
  DIRECTORY_TITLE_PRINT_ORDER.map((title, index) => [
    normalizeTitleKey(title),
    index,
  ])
);

/** Rank of a title in the print order; unknown/blank titles rank last. */
export const directoryTitleRank = (title: unknown): number =>
  TITLE_RANK.get(normalizeTitleKey(title)) ?? DIRECTORY_TITLE_PRINT_ORDER.length;

/**
 * Directory contacts ordered by title for publication. Stable: contacts that
 * share a rank (two Directors, or two untitled contacts) keep the order they
 * were entered in. Returns a new array; the input is untouched.
 */
export function sortDirectoryContactsByTitle<T extends { title?: string }>(
  contacts: readonly T[]
): T[] {
  return [...contacts].sort(
    (a, b) => directoryTitleRank(a.title) - directoryTitleRank(b.title)
  );
}
