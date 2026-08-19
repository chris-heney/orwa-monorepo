import uploadService from "../services/uploadService";
import { IAwardNominationPayload } from "../types/types";
import { generateAwardNominationPDF } from "./generateAwardNominationPdf";

export const uploadNominationPDF = async (
  payload: IAwardNominationPayload,
  notify: (message: string, type?: "success" | "error" | "info" | "warning") => void
) => {
  try {
    const pdfBlob = await generateAwardNominationPDF(payload);
    const fileName = `${String(payload.nominee_name || "nominee").replace(
      /\s+/g,
      "_"
    )}_award_nomination.pdf`;
    const file = new File([pdfBlob], fileName, { type: "application/pdf" });
    return await uploadService.uploadFile(file);
  } catch (error) {
    console.error("Error uploading nomination PDF:", error);
    notify("Error generating nomination PDF", "error");
    throw error;
  }
};
