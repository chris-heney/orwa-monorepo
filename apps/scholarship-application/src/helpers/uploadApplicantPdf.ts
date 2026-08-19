import uploadService from "../services/uploadService";
import { IScholarshipApplicationPayload } from "../types/types";
import { generateScholarshipApplicationPDF } from "./generateScholarshipApplicationPdf";

export const uploadApplicantPDF = async (
  payload: IScholarshipApplicationPayload,
  notify: (message: string, type?: "success" | "error" | "info" | "warning") => void
) => {
  try {
    const pdfBlob = await generateScholarshipApplicationPDF(payload);
    const fileName = `${payload.applicant_last_name || "applicant"}_${
      payload.applicant_first_name || "scholarship"
    }_application.pdf`;
    const file = new File([pdfBlob], fileName, { type: "application/pdf" });
    return await uploadService.uploadFile(file);
  } catch (error) {
    console.error("Error uploading PDF:", error);
    notify("Error generating application PDF", "error");
    throw error;
  }
};
