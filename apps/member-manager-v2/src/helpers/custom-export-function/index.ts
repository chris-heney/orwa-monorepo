import jsonExport from "jsonexport/dist";
import { downloadCSV, ConfigurableDatagridColumn, RaRecord } from "react-admin";

const CustomExportFunction = (
  RecordList: RaRecord[],
  availableColumns: ConfigurableDatagridColumn[],
  columnIds: string[],
  title: string
) => {
  const data = RecordList.map((record) => {
    const filteredRecord = {} as Record<string, string>;

    let columns = availableColumns;

    if (columnIds.length > 0) {
      columns = availableColumns.filter((column) =>
        columnIds?.includes(column.index)
      );
    }

    for (const column of columns) {
      // Check if the column has a label and it's not empty
      if (column.label && column.label.trim() !== "") {
        let value = record[column.source as keyof typeof record]
          ? Array.isArray(record[column.source as keyof typeof record])
            ? record[column.source as keyof typeof record]
                .map((item: ConfigurableDatagridColumn) => `${item.label}`)
                .join(", ")
            : typeof record[column.source as keyof typeof record] === "boolean"
            ? record[column.source as keyof typeof record]
              ? "Yes"
              : "No"
            : record[column.source as keyof typeof record]
          : typeof record[column.label.toLowerCase() as keyof typeof record] !==
            "undefined"
          ? Array.isArray(
              record[column.label.toLowerCase() as keyof typeof record]
            )
            ? record[column.label.toLowerCase() as keyof typeof record]
                .map((item: ConfigurableDatagridColumn) => `${item.label}`)
                .join(", ")
            : typeof record[
                column.label.toLowerCase() as keyof typeof record
              ] === "boolean"
            ? record[column.label.toLowerCase() as keyof typeof record]
              ? "Yes"
              : "No"
            : record[column.label.toLowerCase() as keyof typeof record]
          : "";
        filteredRecord[column.label as keyof typeof record] = value as string;
      }

      if (column.label === "Team" && record.createdAt) {
        filteredRecord["team"] = record.team.name;
      }
    }
    return filteredRecord;
  });

  return jsonExport(data, (err: Error, csv: string) =>
    downloadCSV(csv, `${title}`)
  );
};

export default CustomExportFunction;
