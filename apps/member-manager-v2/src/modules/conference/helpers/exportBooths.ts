import jsonExport from "jsonexport/dist";
import {
  downloadCSV,
  ConfigurableDatagridColumn,
  DataProvider,
  RaRecord,
} from "react-admin";
import { formatNumber } from "../../../helpers/Formators";

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

      const { data: registration } =
        typeof booth.registration === "number"
          ? await dataProvider.getOne("conference-registrations", {
              id: booth.registration,
            })
          : { data: {} };

      const {
        data: registrant = { first: "", last: "", email: "", phone: "" },
      } =
        typeof registration.registrant === "number"
          ? await dataProvider.getOne("contacts", {
              id: registration.registrant,
            })
          : { data: { first: "", last: "", email: "", phone: "" } };

      for (const column of columns) {
        if (column.label && column.label.trim() !== "") {
          let value = booth[column.source as keyof typeof booth];
          if (column.label === "Registrant") {
            value = `${registrant.first} ${registrant.last}`.trim();
          } else if (column.label === "Email") {
            value = registrant.email;
          } else if (column.label === "Phone") {
            value = registrant.phone;
          } else if (column.label === "Date Registered") {
            value = registration.registration_date;
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
          // Assign the value to the corresponding label in the filtered record
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
