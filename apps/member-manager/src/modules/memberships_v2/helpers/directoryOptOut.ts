import { DataProvider, RaRecord } from "react-admin";
import {
  DirectoryContactShape,
  getDirectoryContactsFromRecord,
} from "../watersystem/directoryContacts";

/** Page size for the opt-out sweep of the contacts table. */
const OPT_OUT_PAGE_SIZE = 1000;

/** Hard stop so a bad `total` from the API cannot spin forever. */
const OPT_OUT_MAX_PAGES = 50;

/**
 * Normalized key for correlating a directory contact with a contacts-table row.
 * Returns "" when there is no usable email — callers must treat that as
 * "no email match possible", never as a set member.
 */
export const normalizeContactEmail = (email: unknown): string =>
  typeof email === "string" ? email.trim().toLowerCase() : "";

/**
 * Every email address that has opted out of the ORWA directory, from the
 * contacts table itself.
 *
 * The watersystem's inline `contacts` are a populated snapshot: the same person
 * often exists as several contact rows (one per system, or a duplicate), and an
 * opt-out recorded on any one of them is a statement about the person, not that
 * row. Correlating on email applies the opt-out everywhere they appear.
 *
 * Throws on failure — the caller must abort the export rather than publish a
 * directory that silently includes people who asked to be left out.
 */
export async function fetchDirectoryOptOutEmails(
  dataProvider: DataProvider
): Promise<Set<string>> {
  const optedOut = new Set<string>();
  let page = 1;

  for (;;) {
    const { data, total } = await dataProvider.getList("contacts", {
      pagination: { page, perPage: OPT_OUT_PAGE_SIZE },
      sort: { field: "id", order: "ASC" },
      filter: { directory_opt_out: true },
    });

    const rows = Array.isArray(data) ? data : [];
    for (const row of rows) {
      const email = normalizeContactEmail((row as { email?: unknown }).email);
      // An empty key would match every contact that has no email at all.
      if (email) optedOut.add(email);
    }

    const seen = page * OPT_OUT_PAGE_SIZE;
    if (
      rows.length < OPT_OUT_PAGE_SIZE ||
      (typeof total === "number" && seen >= total) ||
      page >= OPT_OUT_MAX_PAGES
    ) {
      break;
    }
    page += 1;
  }

  return optedOut;
}

/**
 * True when a contact must be kept out of the published directory: either the
 * row itself is flagged, or the person's email is flagged anywhere in the
 * contacts table. The inline flag still matters — it is the only signal for a
 * contact with no email address.
 */
export function isDirectoryOptedOut(
  contact: DirectoryContactShape,
  optOutEmails: ReadonlySet<string>
): boolean {
  if (contact.directory_opt_out === true) return true;
  const email = normalizeContactEmail(contact.email);
  return email !== "" && optOutEmails.has(email);
}

/**
 * The watersystem's directory contacts that may be published, in order and
 * re-indexed: slot 1 is the first publishable contact, so suppressing someone
 * closes the gap instead of leaving a blank column block.
 */
export function getPublishableDirectoryContacts(
  record: RaRecord | undefined,
  optOutEmails: ReadonlySet<string>
): DirectoryContactShape[] {
  return getDirectoryContactsFromRecord(record).filter(
    (contact) => !isDirectoryOptedOut(contact, optOutEmails)
  );
}
