import jsonExport from "jsonexport/dist";
import {
  downloadCSV,
  ConfigurableDatagridColumn,
  DataProvider,
  Identifier,
} from "react-admin";
import { balance } from "../../payouts/components/BalanceField";
import { totalPaidOut } from "../../payouts/components/TotalPayoutField";
import { IGrantApplication } from "../GrantApplicationTypes";
import {
  fetchRelatedRecord,
  relationDisplayValue,
} from "../../../../helpers/fetchRelatedRecord";

const ExportApplications = async (
  RecordList: IGrantApplication[],
  availableColumns: ConfigurableDatagridColumn[],
  columnIds: string[],
  title: string,
  dataProvider: DataProvider
) => {
  // When you use async functions within map, it returns an array of promises,
  // not the actual data you're expecting. That's why adding await inside the map function
  // will cause the export to be blank because jsonExport is called before all the promises are resolved.

  const data = await Promise.all(
    RecordList.map(async (application) => {
      const filteredRecord = {} as IGrantApplication[];

      const pointOfContact = await fetchRelatedRecord(
        dataProvider,
        "contacts",
        application.point_of_contact
      );
      const email =
        (pointOfContact.email as string) || application.email;

      let columns = availableColumns;

      const statusRecord = await fetchRelatedRecord(
        dataProvider,
        "grant-statuses",
        application.status
      );
      const status = (statusRecord.name as string) || "";


      if (columnIds.length > 0) {
        columns = availableColumns.filter((column) =>
          columnIds?.includes(column.index)
        );
      }

      for (const column of columns) {
        if (column.label && column.label.trim() !== "") {
          let value;

          if (column.label === "Balance") {
            value = await balance(dataProvider, application.id as Identifier);
          } else if (column.label === "Total Paid Out") {
            value = await totalPaidOut(
              dataProvider,
              application.id as Identifier
            );
          } else {
            value = relationDisplayValue(
              application[column.source as keyof typeof application]
            );
          }

          if (column.label === "Selected Projects") {
            value = application.selected_projects
              .map((project) => project.name)
              .join(", ");
          }

          if (column.label === "Projects Approved") {
            value = application.approved_projects
              .map((project) => project.name)
              .join(", ");
          }

          if (column.label === "COR") {
            value = application.change_order_request
              ? application.change_order_request.includes("Yes")
                ? "Yes"
                : "No"
              : "No";
          }

          // Closed Out
          if (column.label === "Closed") {
            value = application.closed_out ? "Yes" : "No";
          }

          if (column.label === "Email") {
            value = email ? email : application.email;
          }

          if (column.label === "Status") {
            value = status;
          }

          // Assign the value to the corresponding label in the filtered record
          filteredRecord[column.label] = value as string;
        }
      }

      return filteredRecord;
    })
  );

  return jsonExport(data, (err: Error, csv: string) =>
    downloadCSV(csv, `${title}`)
  );
};

export default ExportApplications;
