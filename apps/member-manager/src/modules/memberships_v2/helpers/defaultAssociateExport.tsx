import { ConfigurableDatagridColumn, RaRecord, DataProvider } from "react-admin";
import jsonExport from "jsonexport/dist";
import getExpirationDate, {
  isMembershipActiveByExpiration,
} from "../../_helpers/getExpirationDate";
import {
  fetchRelatedRecord,
  relationDisplayValue,
} from "../../../helpers/fetchRelatedRecord";

export const defaultAssociateExport = async (
  records: RaRecord[],
  availableColumns: ConfigurableDatagridColumn[],
  columnIds: string[],
  fileName: string,
  dataProvider: DataProvider
) => {
  // Filter columns based on columnIds if provided
  const columns = columnIds?.length > 0
    ? availableColumns.filter(column => columnIds.includes(column.index))
    : availableColumns;

  // Helper function to get contact information
  const getContactInfo = async (recordId: unknown, field: string) => {
    const contact = await fetchRelatedRecord(dataProvider, "contacts", recordId);
    const value = contact[field];
    return value == null || value === "" ? "" : String(value);
  };

  // Process records for export
  const exportData = await Promise.all(records.map(async record => {
    const exportRecord: Record<string, any> = {};

    // Process each column
    await Promise.all(columns.map(async (column) => {
      const columnLabel = column.label || column.source;
      if (!columnLabel) return;

      // Contact information fields
      if (columnLabel.startsWith("Primary Contact")) {
        const field = columnLabel.includes("First") ? "first" : 
                      columnLabel.includes("Last") ? "last" : 
                      columnLabel.includes("Email") ? "email" : null;
        
        if (field) {
          exportRecord[columnLabel] = await getContactInfo(record.contact_primary, field);
          return;
        }
      }
      
      else if (columnLabel.startsWith("Secondary Contact")) {
        const field = columnLabel.includes("First") ? "first" : 
                      columnLabel.includes("Last") ? "last" : 
                      columnLabel.includes("Email") ? "email" : null;
        
        if (field) {
          exportRecord[columnLabel] = await getContactInfo(record.contact_secondary, field);
          return;
        }
      }

      // Member status
      else if (columnLabel === "Member") {
        exportRecord[columnLabel] = isMembershipActiveByExpiration(
          record.payment_previous_date,
          record.payment_last_date
        )
          ? "Active"
          : "Not Active";
      }
      
      // Renewal date
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
      
      // Handle regular fields
      else {
        const sourceKey = column.source as string;
        if (sourceKey && record[sourceKey] !== undefined) {
          exportRecord[columnLabel] = relationDisplayValue(record[sourceKey]);
        } else {
          exportRecord[columnLabel] = '';
        }
      }
    }));

    return exportRecord;
  }));

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
