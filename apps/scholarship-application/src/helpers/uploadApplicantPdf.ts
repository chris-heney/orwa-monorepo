import uploadService from "../services/uploadService";
import { IScholarshipApplicationPayload } from "../types/types";
import { generateScholarshipApplicationPDF } from "./generateScholarshipApplicationPdf";

interface ScholarshipApplicationWithId extends IScholarshipApplicationPayload {
  id: string;
}

export const uploadApplicantPDF = async (
  payload: IScholarshipApplicationPayload, 
  notify: (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void
) => {
  try {
    // Generate the PDF Blob
    const pdfBlob = await generateScholarshipApplicationPDF(payload as ScholarshipApplicationWithId);
    console.log("Generated PDF blob:", pdfBlob);
    console.log("PDF blob size:", pdfBlob.byteLength);

    // Create a File object from the Uint8Array
    const fileName = `${payload.applicant_first_name}_${payload.applicant_last_name}_scholarship_application.pdf`;
    const file = new File([pdfBlob as BlobPart], fileName, { type: "application/pdf" });
    console.log("Created file:", file);
    console.log("File size:", file.size);
    console.log("File type:", file.type);

    // Upload the file using the upload service
    const uploadedFile = await uploadService.uploadFile(file);

    // Log the response from the upload
    console.log("Uploaded Scholarship Application PDF:", uploadedFile);

    return uploadedFile;
  } catch (error) {
    console.error("Error uploading PDF:", error);
    notify("Error uploading PDF", "error");
    throw error;
  }
};