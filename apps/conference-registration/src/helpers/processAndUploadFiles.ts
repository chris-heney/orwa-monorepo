import { StoredStrapiFile, StrapiFormattedFile } from "../types/types";
import uploadService from "./uploadService";

const isUploadedFile = (value: unknown): value is StoredStrapiFile =>
  Boolean(
    value &&
      typeof value === "object" &&
      !(value as { rawFile?: unknown }).rawFile &&
      (value as { id?: unknown }).id !== undefined
  );

/** True when FileInput leftovers (blob URL / rawFile) never became a Strapi file id. */
export const isUnresolvedUpload = (value: unknown): boolean => {
  if (value == null) return false;
  const items = Array.isArray(value) ? value : [value];
  return items.some((item) => {
    if (item == null || typeof item !== "object") return false;
    const obj = item as { rawFile?: unknown; src?: unknown; id?: unknown };
    if (obj.rawFile) return true;
    if (typeof obj.src === "string" && obj.src.startsWith("blob:")) return true;
    return false;
  });
};

export const processAndUploadFiles = async (
  payload: any,
  notify: {
    (message: string, severity: "success" | "error"): void;
  }
) => {
  const processedPayload = { ...payload };

  for (const key in processedPayload) {
    // Ticket/booth extra id lists are not files — never treat them as uploads
    // and never abort the rest of the payload (the previous `return` here
    // skipped the sponsor logo when an `extras` key existed).
    if (key === "extras" || key === "tickets" || key === "booths") {
      continue;
    }

    if (Array.isArray(processedPayload[key])) {
      const fileArray = processedPayload[key];
      const hasNewFiles = fileArray.some((file: { rawFile?: unknown }) => file?.rawFile);
      const hasUploadedFiles = fileArray.some(isUploadedFile);

      if (hasNewFiles || hasUploadedFiles) {
        try {
          const existingIds = fileArray
            .filter(isUploadedFile)
            .map((file: StoredStrapiFile) => file.id);

          const newFiles = fileArray
            .filter((file: { rawFile?: File }) => file?.rawFile instanceof File)
            .map((file: StrapiFormattedFile) => file.rawFile as File);

          if (hasNewFiles && newFiles.length === 0) {
            throw new Error(
              `Logo file is no longer attached. Please re-upload ${key}.`
            );
          }

          const uploadedFiles =
            newFiles.length > 0
              ? await uploadService.uploadFiles(newFiles)
              : [];

          processedPayload[key] = [...existingIds, ...uploadedFiles];
        } catch (error: unknown) {
          console.error(`Error uploading files for ${key}:`, error);
          notify(
            `Error uploading files for ${key}. Please re-attach the file and try again.`,
            "error"
          );
          throw error;
        }
      }
    } else if (processedPayload[key]?.rawFile) {
      if (processedPayload[key].id) {
        processedPayload[key] = processedPayload[key].id;
      } else if (!(processedPayload[key].rawFile instanceof File)) {
        const error = new Error(
          `Logo file is no longer attached. Please re-upload ${key}.`
        );
        notify(
          `Error uploading files for ${key}. Please re-attach the file and try again.`,
          "error"
        );
        throw error;
      } else {
        try {
          const uploadedFileId = await uploadService.uploadFile(
            processedPayload[key].rawFile
          );
          processedPayload[key] = uploadedFileId;
        } catch (error) {
          console.error(`Error uploading file for ${key}:`, error);
          notify(
            `Error uploading files for ${key}. Please re-attach the file and try again.`,
            "error"
          );
          throw error;
        }
      }
    } else if (isUploadedFile(processedPayload[key])) {
      processedPayload[key] = processedPayload[key].id;
    }
  }

  return processedPayload;
};
