import jsonExport from "jsonexport/dist";
import {
  downloadCSV,
  ConfigurableDatagridColumn,
  DataProvider,
  RaRecord,
} from "react-admin";
import { formatDate } from "../../../helpers/dateFormatter";
import { formatNumber } from "../../../helpers/Formators";
import fetchRelatedRecord from "./fetchRelatedRecord";

const formatExportDate = (value: unknown): string => {
  if (value == null || value === "") return "";
  if (typeof value !== "string") return String(value);
  const dateOnly = value.slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
    return formatDate(dateOnly);
  }
  return value;
};

const exportBooths = async (
  RecordList: RaRecord[],
  availableColumns: ConfigurableDatagridColumn[],
  columnIds: string[],
  title: string,
  dataProvider: DataProvider
) => {
  const data = await Promise.all(
    RecordList.map(async (booth) => {
      const filteredRecord = {} as Record<string, string>;

      let columns = availableColumns;

      if (columnIds.length > 0) {
        columns = availableColumns.filter((column) =>
          columnIds?.includes(column.index)
        );
      }

      const registration = await fetchRelatedRecord(
        dataProvider,
        "conference-registrations",
        booth.registration
      );

      const registrant = await fetchRelatedRecord(
        dataProvider,
        "contacts",
        registration.registrant
      );

      for (const column of columns) {
        if (column.label && column.label.trim() !== "") {
          let value = booth[column.source as keyof typeof booth];
          if (column.label === "Registrant") {
            value = `${registrant.first ?? ""} ${registrant.last ?? ""}`.trim();
          } else if (column.label === "Email") {
            value = registrant.email ?? "";
          } else if (column.label === "Phone") {
            value = registrant.phone ?? "";
          } else if (column.label === "Date Registered") {
            value = formatExportDate(registration.registration_date);
          } else if (column.label === "Subtotal") {
            value = formatNumber(booth.subtotal);
          } else if (column.label === "Address") {
            value = registration.address
              ? `${registration.address.street} ${registration.address.city} ${registration.address.state} ${registration.address.zip}`
              : "";
          } else if (
            Array.isArray(
              booth[column.label.toLowerCase() as keyof typeof booth]
            )
          ) {
            value = booth[column.label.toLowerCase() as keyof typeof booth]
              .map((item: ConfigurableDatagridColumn) => `${item.label}`)
              .join(", ");
          } else {
            value = booth[column.source as keyof typeof booth];
            value = typeof value === "boolean" ? (value ? "Yes" : "No") : value;
          }
          filteredRecord[column.label as keyof typeof booth] = value as string;
        }
      }

      return filteredRecord;
    })
  );

  return jsonExport(data, (err: Error, csv: string) =>
    downloadCSV(csv, `${title}`)
  );
};

export default exportBooths;
