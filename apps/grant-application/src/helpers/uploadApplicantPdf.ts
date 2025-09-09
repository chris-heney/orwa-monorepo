import uploadService from "../services/uploadService";
import { IGrantApplicationFormPayload } from "../types/types";
import { generatePDF } from "./generateApplicantPdf";

interface GrantApplicationWithId extends IGrantApplicationFormPayload {
  id: string;
}
export  const uploadApplicantPDF = async (
  payload: GrantApplicationWithId, 
  notify:  (message: string, type?: 'success' | 'error' | 'info' | 'warning') => void, 
  scoringCriterias: (string | boolean)[][]
  ) => {

    try {
      // Generate the PDF Blob
      const pdfBlob = await generatePDF(payload, scoringCriterias);
  
      // Create a File object from the Blob
      const file = new File([pdfBlob], `${payload.legal_entity_name}-application.pdf`, { type: "application/pdf" });
  
      // Log the Blob and File for debugging
  
      // Upload the file using the upload service
      const uploadedFile = await uploadService.uploadFile(file);
  
      // Log the response from the upload
      console.log("Uploaded File:", uploadedFile);
  
      return uploadedFile;
    } catch (error) {
      console.error("Error uploading PDF:", error);
      notify("Error uploading PDF", "error");
      throw error;
    }
  };