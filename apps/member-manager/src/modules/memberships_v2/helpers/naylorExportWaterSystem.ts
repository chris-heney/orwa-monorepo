import {
  ConfigurableDatagridColumn,
  DataProvider,
  RaRecord,
} from "react-admin";
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
import {
  exportRelationResource,
  readExportField,
  resolveExportCell,
} from "../../../helpers/fetchRelatedRecord";
import downloadJsonAsCsv from "../../../helpers/downloadJsonAsCsv";

/** Directory contact slots printed per system in the Naylor file. */
export const NAYLOR_CONTACT_SLOTS = 3;

/**
 * Per-contact columns in the Naylor file, in print order. The system row
 * already carries a mailing address, so the per-contact one is left out.
 */
export const NAYLOR_CONTACT_FIELDS: Array<{
  label: string;
  field: keyof DirectoryContactShape;
}> = [
  { label: "Title", field: "title" },
  { label: "First Name", field: "first" },
  { label: "Last Name", field: "last" },
  { label: "Email", field: "email" },
  { label: "Phone", field: "phone" },
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

export const NaylorExportWaterSystem = async (
  RecordList: IWatersystem[],
  availableColumns: ConfigurableDatagridColumn[],
  columnIds: string[],
  title: string,
  dataProvider?: DataProvider
) => {

  const columnMap: Record<string, string> = {
    Meters: "# Meters",
    URL: "Website",
    "Address (Physical)": "Physical Address",
    "City (Physical)": "Physical City",
    "State (Physical)": "Physical State",
    "Zip (Physical)": "Physical Zip",
    "Address (PO Box)": "Mailing Address",
    "City (PO Box)": "Mailing City",
    "State (PO Box)": "Mailing State",
    "Zip (PO Box)": "Mailing Zip",
    ORWAAG: "ORWAAG",
    Name: "System Name",
    "Office Email": "Email",
  };

  // Fetched once for the whole export. A failure here rejects on purpose:
  // MembershipExportAction catches it and notifies "Export failed". Falling
  // back to the inline flag alone would publish people who opted out.
  const optOutEmails = dataProvider
    ? await fetchDirectoryOptOutEmails(dataProvider)
    : new Set<string>();

  const data = await Promise.all(
    RecordList.map(async (watersytem) => {
    const filteredRecord: Record<string, string> = {};

    let columns = availableColumns;

    if (columnIds.length > 0) {
      columns = availableColumns.filter((column) =>
        columnIds?.includes(column.index)
      );
    }

    for (const column of columns) {
      if (column.label && column.label.trim() !== "") {
        const sourceKey = String(column.source ?? "");
        // Directory contacts are written as a fixed block below, from the
        // opt-out-filtered list — not from the user's column selection.
        if (sourceKey.startsWith("dir_contact_")) continue;
        let value: unknown = readExportField(watersytem, column.source);

        if (column.label === "Name") {
          value = isMembershipActiveByExpiration(
            watersytem.payment_previous_date,
            watersytem.payment_last_date
          )
            ? `*${watersytem.name}`
            : `${watersytem.name}`;
        } else if (typeof value === "boolean") {
          value = value ? "+" : " ";
        } else {
          value = await resolveExportCell(value, {
            dataProvider,
            resource: exportRelationResource(column.source, column.label),
          });
        }

        // Use the columnMap to get the new label
        const newLabel =
          columnMap[column.label as keyof typeof columnMap] || column.label;
        filteredRecord[newLabel] = value as string;
      }
    }

    // Directory contacts: publishable only, ordered by title for print
    // (Chairman → Vice-Chairman → Director → Manager → Operator → Bookkeeper →
    // anything else), then re-indexed so slot 1 is the first contact who has
    // not opted out. Written regardless of column selection so the Naylor file
    // always carries the same contact block.
    const publishable = sortDirectoryContactsByTitle(
      getPublishableDirectoryContacts(
        watersytem as unknown as RaRecord,
        optOutEmails
      )
    );
    for (let slot = 1; slot <= NAYLOR_CONTACT_SLOTS; slot += 1) {
      const contact = publishable[slot - 1];
      for (const { label, field } of NAYLOR_CONTACT_FIELDS) {
        const raw = contact?.[field];
        filteredRecord[`Contact ${slot}: ${label}`] =
          raw == null ? "" : String(raw);
      }
    }

    return filteredRecord;
  })
  );

  const sortFunction = (
    a: Record<string, string>,
    b: Record<string, string>,
    countyColumn: string
  ) => {
    const countyA = a[countyColumn] || "";
    const countyB = b[countyColumn] || "";

    if (countyA.toLowerCase() < countyB.toLowerCase()) return -1;
    if (countyA.toLowerCase() > countyB.toLowerCase()) return 1;

    const systemNameA = a["System Name"] || "";
    const systemNameB = b["System Name"] || "";

    const extractNumber = (str: string) => {
      const match = str.match(/#(\d+)/);
      return match ? parseInt(match[1], 10) : null;
    };

    const numA = extractNumber(systemNameA);
    const numB = extractNumber(systemNameB);

    if (numA !== null && numB !== null) {
      return numA - numB;
    }

    if (numA !== null) return -1;
    if (numB !== null) return 1;

    if (systemNameA.toLowerCase() < systemNameB.toLowerCase()) return -1;
    if (systemNameA.toLowerCase() > systemNameB.toLowerCase()) return 1;

    return 0;
  };

  const countyColumn = "County";

  const sortedData = data.sort((a, b) => sortFunction(a, b, countyColumn));

  const columnOrder = [
    "System Name",
    "County",
    "Office Hours",
    "# Meters",
    "Website",
    "Board Meeting",
    "ORWAAG",
    "Physical Address",
    "Physical City",
    "Physical State",
    "Physical Zip",
    "Mailing Address",
    "Mailing City",
    "Mailing State",
    "Mailing Zip",
    "System Type",
    "Email",
    "Phone",
    "Fax",
    ...naylorContactColumnLabels(),
  ];

  const orderedData = sortedData.map((record) => {
    const orderedRecord: Record<string, string> = {};
    columnOrder.forEach((column) => {
      orderedRecord[column] = record[column] || "";
    });
    return orderedRecord;
  });

  return downloadJsonAsCsv(orderedData, `${title}`);
};
