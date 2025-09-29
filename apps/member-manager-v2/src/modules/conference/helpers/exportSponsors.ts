import jsonExport from "jsonexport/dist";
import {
  downloadCSV,
  ConfigurableDatagridColumn,
  RaRecord,
  DataProvider,
} from "react-admin";

const exportSponsors = async (
  RecordList: RaRecord[],
  availableColumns: ConfigurableDatagridColumn[],
  columnIds: string[],
  title: string,
  dataProvider: DataProvider
) => {

    const data = await Promise.all(
    RecordList.map(async (record, index) => {
      const filteredRecord = {} as Record<string, string>;

      let columns = availableColumns;

      if (columnIds.length > 0) {
        columns = availableColumns.filter((column) =>
          columnIds?.includes(column.index)
        );
      }

      const { data: registration } =
        typeof record.registration === "number"
          ? await dataProvider.getOne("conference-registrations", {
              id: record.registration,
            })
          : { data: {} };

      for (const column of columns) {
        // Check if the column has a label and it's not empty
        if (column.label && column.label.trim() !== "") {
          let value =
            typeof column.source !== "undefined"
              ? Array.isArray(record[column.source as keyof typeof record])
                ? record[column.source as keyof typeof record]
                    .map((item: ConfigurableDatagridColumn) => `${item.label}`)
                    .join(", ")
                : typeof record[column.source as keyof typeof record] ===
                  "boolean"
                ? record[column.source as keyof typeof record]
                  ? "Yes"
                  : "No"
                : record[column.source as keyof typeof record]
              : typeof record[
                  column.label.toLowerCase() as keyof typeof record
                ] !== "undefined"
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

          if (
            column.label === "Date Registered" &&
            registration.registration_date
          ) {
            value = registration.registration_date;
          }

          if (column.label === "Items") {
            // Use the columnIds which contains the items for each record
            value = record.sponsorship_items.map((item: any) => item.label).join(", ");
             
          }
          filteredRecord[column.label as keyof typeof record] = value as string;
        }
      }
      return filteredRecord;
    })
  );

  return jsonExport(data, (err: Error, csv: string) =>
    downloadCSV(csv, `${title}`)
  );
};

export default exportSponsors;
