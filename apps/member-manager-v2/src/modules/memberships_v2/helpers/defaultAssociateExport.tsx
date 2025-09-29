import { ConfigurableDatagridColumn, RaRecord, DataProvider } from "react-admin";
import jsonExport from "jsonexport/dist";

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
  const getContactInfo = async (recordId: any, field: string) => {
    // Check if recordId exists and is a valid number
    if (!recordId || typeof recordId !== 'number' || isNaN(recordId)) return '';
    try {
      const contactResult = await dataProvider.getOne('contacts', { id: recordId });
      const contact = contactResult.data as Record<string, any>;
      return contact && contact[field] ? contact[field] : '';
    } catch (error) {
      console.error(`Error fetching contact ${field}:`, error);
      return '';
    }
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
        const expirationDate = record.payment_last_date ? new Date(record.payment_last_date) : null;
        const now = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        
        if (expirationDate && expirationDate > oneYearAgo) {
          exportRecord[columnLabel] = "Active";
        } else {
          exportRecord[columnLabel] = "Not Active";
        }
      }
      
      // Renewal date
      else if (columnLabel === "Renewal") {
        if (record.payment_last_date) {
          const paymentDate = new Date(record.payment_last_date);
          const renewalDate = new Date(paymentDate);
          renewalDate.setFullYear(renewalDate.getFullYear() + 1);
          exportRecord[columnLabel] = renewalDate.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit'
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
