import { RaRecord } from "react-admin";
import jsonExport from "jsonexport/dist";
import { saveAs } from "file-saver";
import uploadService from "src/services/uploadService";

const exportCorporateSponsors = async (
  records: RaRecord[],
  fileName: string,
) => {
  try {
    // Process records with Promise.all to handle async operations
    const exportDataPromises = records.map(async (record) => {
      let logoUrl = "No Logo";
      
      if (record.logo) {
        try {
          const file = await uploadService.getFile(record.logo);
          if (file && file.url) {
            logoUrl = `${import.meta.env.VITE_API_ENDPOINT}${file.url}`;
          }
        } catch (error) {
          console.error("Error fetching logo:", error);
        }
      }
      
      return {
        "ID": record.id,
        "Company Name": record.name,
        "Active": record.active ? "Yes" : "No",
        "Logo": logoUrl,
        "Created At": new Date(
          record.createdAt || record.created_at
        ).toLocaleDateString(),
        "Updated At": new Date(
          record.updatedAt || record.updated_at
        ).toLocaleDateString(),
      };
    });

    // Wait for all promises to resolve
    const exportData = await Promise.all(exportDataPromises);
    
    // Export to CSV
    jsonExport(exportData, (err: Error, csv: string) => {
      if (err) {
        console.error("Error exporting data:", err);
        return;
      }
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      saveAs(blob, `${fileName}.csv`);
    });
  } catch (error) {
    console.error("Error during export:", error);
  }
};

export default exportCorporateSponsors;
