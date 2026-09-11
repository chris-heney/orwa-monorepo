import {
  ConfigurableDatagridColumn,
  RaRecord,
  DataProvider,
} from "react-admin";
import { formatDate } from "../../../helpers/dateFormatter";
import fetchRelatedRecord, {
  readExportColumn,
  relationDisplayValue,
  selectExportColumns,
} from "../../../helpers/fetchRelatedRecord";
import downloadJsonAsCsv from "../../../helpers/downloadJsonAsCsv";

const formatExportDate = (value: unknown): string => {
  if (value == null || value === "") return "";
  if (typeof value !== "string") return String(value);
  const dateOnly = value.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
    return formatDate(dateOnly);
  }
  return value;
};

const exportSponsors = async (
  RecordList: RaRecord[],
  availableColumns: ConfigurableDatagridColumn[],
  columnIds: string[],
  title: string,
  dataProvider: DataProvider
) => {
  const data = await Promise.all(
    RecordList.map(async (record) => {
      const filteredRecord = {} as Record<string, string>;

      const columns = selectExportColumns(availableColumns, columnIds);

      const registration = await fetchRelatedRecord(
        dataProvider,
        "conference-registrations",
        record.registration
      );

      for (const column of columns) {
        if (column.label && column.label.trim() !== "") {
          let value = relationDisplayValue(readExportColumn(record, column));

          if (column.label === "Organization") {
            value =
              (record.organization as string) ||
              (registration.organization as string) ||
              "";
          }

          if (column.label === "Date Registered") {
            // Always overwrite — column.source is "registration", which is a
            // documentId after Strapi 5 and must not leak into the CSV.
            value = formatExportDate(registration.registration_date);
          }

          if (column.label === "Items") {
            value = Array.isArray(record.sponsorship_items)
              ? record.sponsorship_items
                  .map((item: { label?: string }) => item.label ?? "")
                  .filter(Boolean)
                  .join(", ")
              : "";
          }

          filteredRecord[column.label as keyof typeof record] = value as string;
        }
      }
      return filteredRecord;
    })
  );

  return downloadJsonAsCsv(data, `${title}`);
};

export default exportSponsors;
