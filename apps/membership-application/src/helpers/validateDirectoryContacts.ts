import { WatersystemDirectoryContactRow } from "../types/WatersystemMebership";

const trim = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/**
 * Validates ORWA directory contact rows: title required when any person/address field is set;
 * if any mailing field is set, street, city, and state are required; ZIP stays optional.
 */
export function validateDirectoryContacts(
  contacts: WatersystemDirectoryContactRow[] | undefined
): string | null {
  if (!contacts?.length) return null;

  for (let i = 0; i < contacts.length; i++) {
    const row = contacts[i];
    const title = trim(row.title);
    const first = trim(row.first);
    const last = trim(row.last);
    const email = trim(row.email);
    const phone = trim(row.phone);
    const l1 = trim(row.address_mailing_line1);
    const l2 = trim(row.address_mailing_line2);
    const city = trim(row.address_mailing_city);
    const state = trim(row.address_mailing_state);
    const zip = trim(row.address_mailing_zip);

    const anyPerson = !!(title || first || last || email || phone);
    const anyAddr = !!(l1 || l2 || city || state || zip);

    if (!anyPerson && !anyAddr) continue;

    if (!title) {
      return `Directory contact ${
        i + 1
      }: Title is required when entering contact or mailing information.`;
    }
    if (anyAddr) {
      if (!l1 || !city || !state) {
        return `Directory contact ${
          i + 1
        }: Please complete mailing street, city, and state when entering an address (ZIP is optional).`;
      }
    }
  }
  return null;
}
