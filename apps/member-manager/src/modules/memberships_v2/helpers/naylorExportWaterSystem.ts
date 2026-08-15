import jsonExport from "jsonexport/dist";
import {
  downloadCSV,
  ConfigurableDatagridColumn,
  DataProvider,
  RaRecord,
} from "react-admin";
import { isMembershipActiveByExpiration } from "../../_helpers/getExpirationDate";
import { IWatersystem } from "../watersystem/WatersystemInterface";
import { directoryContactFieldFromSource } from "../watersystem/directoryContacts";
import {
  exportRelationResource,
  resolveExportCell,
} from "../../../helpers/fetchRelatedRecord";

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
        let value: unknown = sourceKey.startsWith("dir_contact_")
          ? directoryContactFieldFromSource(
              watersytem as unknown as RaRecord,
              sourceKey
            )
          : watersytem[column.source as keyof typeof watersytem];

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
  ];

  const orderedData = sortedData.map((record) => {
    const orderedRecord: Record<string, string> = {};
    columnOrder.forEach((column) => {
      orderedRecord[column] = record[column] || "";
    });
    return orderedRecord;
  });

  return jsonExport(orderedData, (err: Error, csv: string) =>
    downloadCSV(csv, `${title}`)
  );
};
