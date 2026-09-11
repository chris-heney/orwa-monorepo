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

const exportAttendees = async (
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

      const conferenceTicket = await fetchRelatedRecord(
        dataProvider,
        "conference-tickets",
        record.conference_ticket
      );

      for (const column of columns) {
        if (column.label && column.label.trim() !== "") {
          let value = relationDisplayValue(readExportColumn(record, column));

          if (column.label === "Date Registered") {
            // Always overwrite — source is often "registration" (documentId).
            value = formatExportDate(registration.registration_date);
          }

          if (column.label === "Type" && conferenceTicket.name) {
            value = conferenceTicket.name;
          }

          filteredRecord[column.label as keyof typeof record] = value as string;
        }
      }
      return filteredRecord;
    })
  );

  return downloadJsonAsCsv(data, `${title}`);
};

export default exportAttendees;
