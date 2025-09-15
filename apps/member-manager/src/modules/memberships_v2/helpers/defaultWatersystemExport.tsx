import { ConfigurableDatagridColumn, RaRecord } from "react-admin";
import jsonExport from "jsonexport/dist";
import getExpirationDate from "../../_helpers/getExpirationDate";

export const defaultWatersystemExport = (
  records: RaRecord[],
  availableColumns: ConfigurableDatagridColumn[],
  columnIds: string[],
  fileName: string
) => {
  // Filter columns based on columnIds if provided
  const columns = columnIds?.length > 0
    ? availableColumns.filter(column => columnIds.includes(column.index))
    : availableColumns;

  // Process records for export
  const exportData = records.map(record => {
    const exportRecord: Record<string, any> = {};

    // Process each column
    columns.forEach(column => {
      const columnLabel = column.label || column.source;
      if (!columnLabel) return;
      
      // Handle special function fields
      if (columnLabel === "Member") {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
        const paymentDate = record.payment_last_date ? new Date(record.payment_last_date) : null;
        
        if (paymentDate && paymentDate > oneYearAgo) {
          exportRecord[columnLabel] = "Active";
        } else {
          exportRecord[columnLabel] = "Inactive";
        }
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
      // Handle regular fields
      else {
        const sourceKey = column.source as string;
        if (sourceKey && record[sourceKey] !== undefined) {
          // Handle different data types
          if (typeof record[sourceKey] === 'boolean') {
            exportRecord[columnLabel] = record[sourceKey] ? 'Yes' : 'No';
          } else if (Array.isArray(record[sourceKey])) {
            exportRecord[columnLabel] = record[sourceKey].join(', ');
          } else if (record[sourceKey] === null) {
            exportRecord[columnLabel] = '';
          } else {
            exportRecord[columnLabel] = record[sourceKey];
          }
        } else {
          exportRecord[columnLabel] = '';
        }
      }
    });

    return exportRecord;
  });

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
