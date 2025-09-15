import jsonExport from "jsonexport/dist";
import { downloadCSV, ConfigurableDatagridColumn } from "react-admin";
import { oneYearAgoFormatted } from "./activeOrInactiveMembership";
import { IWatersystem } from "../../membership/watersystem/WatersystemInterface";

export const NaylorExportWaterSystem = (
  RecordList: IWatersystem[],
  availableColumns: ConfigurableDatagridColumn[],
  columnIds: string[],
  title: string
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

  const data = RecordList.map((watersytem) => {
    const filteredRecord: Record<string, string> = {};

    let columns = availableColumns;

    if (columnIds.length > 0) {
      columns = availableColumns.filter((column) =>
        columnIds?.includes(column.index)
      );
    }

    for (const column of columns) {
      if (column.label && column.label.trim() !== "") {
        let value = watersytem[column.source as keyof typeof watersytem];
     
        value = typeof value === "boolean" ? (value ? "+" : " ") : value;


        // if (column.label === "System Name") then {record.payment_last_date > oneYearAgoFormatted ? 'Active' : 'Inactive'}

        if (column.label === "Name") {
          value = (watersytem["payment_last_date"] as any) > oneYearAgoFormatted ? `*${watersytem.name}` : `${watersytem.name}`;
        }

        // Use the columnMap to get the new label
        const newLabel =
          columnMap[column.label as keyof typeof columnMap] || column.label;
        filteredRecord[newLabel] = value as string;
      }
    }
    return filteredRecord;
  });

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
