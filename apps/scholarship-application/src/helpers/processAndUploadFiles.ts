import uploadService from "../services/uploadService";
import { StrapiFormattedFile } from "../types/types";

const SINGLE_MEDIA_FIELDS = new Set([
  "transcript",
  "test_scores",
  "recommendation_letter_1",
  "recommendation_letter_2",
  "essay",
  "biography",
  "photograph",
  "applicant_pdf",
]);

const isFormattedFile = (value: unknown): value is StrapiFormattedFile =>
  Boolean(value && typeof value === "object" && (value as StrapiFormattedFile).rawFile);

const uploadValue = async (
  value: unknown,
  key: string,
  notify: (message: string, severity: "success" | "error") => void
) => {
  if (Array.isArray(value) && value.length > 0 && isFormattedFile(value[0])) {
    try {
      const uploaded = await uploadService.uploadFiles(
        value.map((file) => file.rawFile)
      );
      return SINGLE_MEDIA_FIELDS.has(key) ? uploaded[0] ?? null : uploaded;
    } catch (error) {
      notify(`Error uploading files for ${key}. Please try again later.`, "error");
      throw error;
    }
  }

  if (isFormattedFile(value)) {
    try {
      return await uploadService.uploadFile(value.rawFile);
    } catch (error) {
      notify(`Error uploading file for ${key}. Please try again later.`, "error");
      throw error;
    }
  }

  return value;
};

export const processAndUploadFiles = async (
  payload: Record<string, unknown>,
  notify: (message: string, severity: "success" | "error") => void
) => {
  const processed: Record<string, unknown> = { ...payload };

  for (const key of Object.keys(processed)) {
    const value = processed[key];
    processed[key] = await uploadValue(value, key, notify);
  }

  return processed;
};
