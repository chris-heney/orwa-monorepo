import { DataProvider, RaRecord } from "react-admin";
import { isMembershipActiveByExpiration } from "../../_helpers/getExpirationDate";
import { IWatersystem } from "../watersystem/WatersystemInterface";
import {
  DirectoryContactShape,
  sortDirectoryContactsByTitle,
} from "../watersystem/directoryContacts";
import {
  fetchDirectoryOptOutEmails,
  getPublishableDirectoryContacts,
} from "./directoryOptOut";
import downloadJsonAsCsv from "../../../helpers/downloadJsonAsCsv";

/** Directory contact slots printed per system in the Naylor file. */
export const NAYLOR_CONTACT_SLOTS = 3;

/**
 * Per-contact columns in the Naylor file, in print order: name and title only.
 * The system row already carries the office phone, email and mailing address,
 * and ORWA asked (2026-09-15) that the per-contact email and phone be dropped
 * from the printed directory. The contact's email is still read — it remains
 * the key that correlates directory opt-outs across duplicate contact rows.
 */
export const NAYLOR_CONTACT_FIELDS: Array<{
  label: string;
  field: keyof DirectoryContactShape;
}> = [
  { label: "Title", field: "title" },
  { label: "First Name", field: "first" },
  { label: "Last Name", field: "last" },
];

/** `Contact 1: Title` … column labels, in the order they are printed. */
export const naylorContactColumnLabels = (): string[] => {
  const labels: string[] = [];
  for (let slot = 1; slot <= NAYLOR_CONTACT_SLOTS; slot += 1) {
    for (const { label } of NAYLOR_CONTACT_FIELDS) {
      labels.push(`Contact ${slot}: ${label}`);
    }
  }
  return labels;
};

/**
 * The system columns of the Naylor file, in print order, each read straight
 * off the water system record.
 *
 * This list is the contract with Naylor and the ONLY thing that decides what
 * the file contains. It used to be derived from the grid — the exporter walked
 * the user's *visible* `DatagridConfigurable` columns and renamed their labels
 * — so hiding "Office Hours" in the grid silently blanked "Office Hours" in
 * the directory file (reported 2026-09-17: ten columns exported empty). The
 * grid's columns, filters and sort are a personal view; none of them may reach
 * this export.
 */
export const NAYLOR_SYSTEM_FIELDS: Array<{
  label: string;
  value: (system: IWatersystem) => unknown;
}> = [
  {
    label: "System Name",
    // A leading `*` marks a current member in the printed directory.
    value: (system) =>
      isMembershipActiveByExpiration(
        system.payment_previous_date,
        system.payment_last_date
      )
        ? `*${system.name}`
        : `${system.name}`,
  },
  { label: "County", value: (system) => system.county },
  { label: "Office Hours", value: (system) => system.office_hours },
  { label: "# Meters", value: (system) => system.meters },
  { label: "Website", value: (system) => system.url },
  { label: "Board Meeting", value: (system) => system.board_meeting },
  { label: "ORWAAG", value: (system) => system.orwaag },
  { label: "Physical Address", value: (system) => system.address_physical_line1 },
  { label: "Physical City", value: (system) => system.address_physical_city },
  { label: "Physical State", value: (system) => system.address_physical_state },
  { label: "Physical Zip", value: (system) => system.address_physical_zip },
  { label: "Mailing Address", value: (system) => system.address_mailing_pobox },
  { label: "Mailing City", value: (system) => system.address_mailing_city },
  { label: "Mailing State", value: (system) => system.address_mailing_state },
  { label: "Mailing Zip", value: (system) => system.address_mailing_zip },
  { label: "System Type", value: (system) => system.system_type_dirty },
  { label: "Email", value: (system) => system.email },
  { label: "Phone", value: (system) => system.phone },
  { label: "Fax", value: (system) => system.fax },
];

/** Every column of the Naylor file, in print order. */
export const naylorColumnLabels = (): string[] => [
  ...NAYLOR_SYSTEM_FIELDS.map(({ label }) => label),
  ...naylorContactColumnLabels(),
];

/**
 * One printable cell. Booleans print as the directory's `+` mark (blank when
 * false). Line breaks collapse to "; " — office hours are typed on several
 * lines, and a cell that spans lines breaks the row-per-system layout Naylor
 * imports.
 */
export const naylorCell = (value: unknown): string => {
  if (value == null) return "";
  if (typeof value === "boolean") return value ? "+" : " ";
  // Trim first so a trailing line break doesn't leave a dangling "; ".
  return String(value)
    .trim()
    .replace(/\s*[\r\n]+\s*/g, "; ");
};

const compareRows = (
  a: Record<string, string>,
  b: Record<string, string>
): number => {
  const countyA = (a["County"] || "").toLowerCase();
  const countyB = (b["County"] || "").toLowerCase();
  if (countyA < countyB) return -1;
  if (countyA > countyB) return 1;

  const nameA = a["System Name"] || "";
  const nameB = b["System Name"] || "";

  // "… RWD #2" sorts before "… RWD #10", and numbered systems lead a county.
  const districtNumber = (name: string) => {
    const match = name.match(/#(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  };
  const numA = districtNumber(nameA);
  const numB = districtNumber(nameB);
  if (numA !== null && numB !== null) return numA - numB;
  if (numA !== null) return -1;
  if (numB !== null) return 1;

  if (nameA.toLowerCase() < nameB.toLowerCase()) return -1;
  if (nameA.toLowerCase() > nameB.toLowerCase()) return 1;
  return 0;
};

/**
 * Build and download the Naylor directory file for water systems.
 *
 * @param systems every water system, with `contacts` populated — the caller
 *   (`MembershipExportAction`) re-queries them unfiltered for this export.
 * @param title file name, without extension
 * @param dataProvider used for the directory opt-out sweep only
 */
export const NaylorExportWaterSystem = async (
  systems: IWatersystem[],
  title: string,
  dataProvider?: DataProvider
) => {
  // Fetched once for the whole export. A failure here rejects on purpose:
  // MembershipExportAction catches it and notifies "Export failed". Falling
  // back to the inline flag alone would publish people who opted out.
  const optOutEmails = dataProvider
    ? await fetchDirectoryOptOutEmails(dataProvider)
    : new Set<string>();

  const rows = systems.map((system) => {
    const row: Record<string, string> = {};

    for (const { label, value } of NAYLOR_SYSTEM_FIELDS) {
      row[label] = naylorCell(value(system));
    }

    // Directory contacts: publishable only, ordered by title for print
    // (Chairman → Vice-Chairman → Director → Manager → Operator → Bookkeeper →
    // anything else), then re-indexed so slot 1 is the first contact who has
    // not opted out.
    const publishable = sortDirectoryContactsByTitle(
      getPublishableDirectoryContacts(
        system as unknown as RaRecord,
        optOutEmails
      )
    );
    for (let slot = 1; slot <= NAYLOR_CONTACT_SLOTS; slot += 1) {
      const contact = publishable[slot - 1];
      for (const { label, field } of NAYLOR_CONTACT_FIELDS) {
        row[`Contact ${slot}: ${label}`] = naylorCell(contact?.[field]);
      }
    }

    return row;
  });

  rows.sort(compareRows);

  // Re-key in print order so the CSV header is the contract, whatever order
  // the row object was filled in.
  const labels = naylorColumnLabels();
  const ordered = rows.map((row) => {
    const out: Record<string, string> = {};
    labels.forEach((label) => {
      out[label] = row[label] ?? "";
    });
    return out;
  });

  return downloadJsonAsCsv(ordered, `${title}`);
};
