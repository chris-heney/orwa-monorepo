import { ConfigurableDatagridColumn, DataProvider, RaRecord } from "react-admin";
import jsonExport from "jsonexport/dist";
import getExpirationDate, {
  isMembershipActiveByExpiration,
} from "../../_helpers/getExpirationDate";
import { directoryContactFieldFromSource } from "../watersystem/directoryContacts";
import {
  exportRelationResource,
  resolveExportCell,
} from "../../../helpers/fetchRelatedRecord";

export const defaultWatersystemExport = async (
  records: RaRecord[],
  availableColumns: ConfigurableDatagridColumn[],
  columnIds: string[],
  fileName: string,
  dataProvider?: DataProvider
) => {
  // Filter columns based on columnIds if provided
  const columns = columnIds?.length > 0
    ? availableColumns.filter(column => columnIds.includes(column.index))
    : availableColumns;

  const exportData = await Promise.all(
    records.map(async (record) => {
    const exportRecord: Record<string, any> = {};

    await Promise.all(
      columns.map(async (column) => {
      const columnLabel = column.label || column.source;
      if (!columnLabel) return;
      
      // Handle special function fields
      if (columnLabel === "Member") {
        exportRecord[columnLabel] = isMembershipActiveByExpiration(
          record.payment_previous_date,
          record.payment_last_date
        )
          ? "Active"
          : "Inactive";
      }
      else if (columnLabel === "Renewal") {
        if (record.payment_last_date) {
          const expirationDate = getExpirationDate(
            record.payment_previous_date,
            record.payment_last_date
          );
          exportRecord[columnLabel] = expirationDate.isValid() 
            ? expirationDate.format("MM/DD/YY") 
            : "N/A";
        } else {
          exportRecord[columnLabel] = "N/A";
        }
      }
      else if (columnLabel === "Expiration Sent") {
        if (record.expiration_notification_sent) {
          const date = new Date(record.expiration_notification_sent);
          exportRecord[columnLabel] = date.toLocaleString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          });
        } else {
          exportRecord[columnLabel] = "N/A";
        }
      }
      else {
        const sourceKey = column.source as string;
        if (sourceKey?.startsWith("dir_contact_")) {
          exportRecord[columnLabel] = directoryContactFieldFromSource(
            record,
            sourceKey
          );
        } else if (sourceKey && record[sourceKey] !== undefined) {
          exportRecord[columnLabel] = await resolveExportCell(
            record[sourceKey],
            {
              dataProvider,
              resource: exportRelationResource(sourceKey, columnLabel),
            }
          );
        } else {
          exportRecord[columnLabel] = '';
        }
      }
    })
    );

    return exportRecord;
  })
  );

  // Export to CSV
  jsonExport(exportData, (err, csv) => {
    if (err) {
      console.error('Error exporting CSV:', err);
      return;
    }
    
    // Create download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
};
