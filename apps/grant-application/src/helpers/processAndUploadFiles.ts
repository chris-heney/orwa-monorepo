import uploadService from "../services/uploadService";
import { StrapiFormattedFile } from "../types/types";

// When editing an existing application, file fields can contain a mix of
// already-uploaded Strapi files ({ id, src, title } — no rawFile) and newly
// selected files ({ rawFile, ... }). Existing files keep their ids; only new
// rawFiles are uploaded.

const isUploadedFile = (value: any) =>
  value && typeof value === "object" && !value.rawFile && value.id !== undefined;

export const processAndUploadFiles = async (payload: any, notify: {
    (message: string, severity: "success" | "error"): void;
}) => {

    const processedPayload = { ...payload };

    for (const key in processedPayload) {
      if (Array.isArray(processedPayload[key])) {
        // If the key holds an array, check if it contains file entries
        const fileArray = processedPayload[key];
        const hasNewFiles = fileArray.some((file: any) => file?.rawFile);
        const hasUploadedFiles = fileArray.some(isUploadedFile);

        if (hasNewFiles || hasUploadedFiles) {
          try {
            const existingIds = fileArray
              .filter(isUploadedFile)
              .map((file: any) => file.id);

            const newFiles = fileArray
              .filter((file: any) => file?.rawFile)
              .map((file: StrapiFormattedFile) => file.rawFile as File);

            const uploadedFiles = newFiles.length > 0
              ? await uploadService.uploadFiles(newFiles)
              : [];

            processedPayload[key] = [...existingIds, ...uploadedFiles];
          } catch (error) {
            notify(
              `Error uploading files for ${key}. Please try again later.`,
              "error"
            );
          }
        }
      } else if (processedPayload[key]?.rawFile) {
        // If the key holds a single new StrapiFormattedFile
        try {
          // uploadService.uploadFile resolves to the numeric file id;
          // link it directly (Strapi 5 media fields accept file ids in JSON writes)
          const uploadedFileId = await uploadService.uploadFile(
            processedPayload[key].rawFile
          );
          processedPayload[key] = uploadedFileId;
        } catch (error) {
          console.error(`Error uploading file for ${key}:`, error);
          notify(
            `Error uploading file for ${key}. Please try again later.`,
            "error"
          );
        }
      } else if (isUploadedFile(processedPayload[key])) {
        // Already-uploaded single file: keep linking its id
        processedPayload[key] = processedPayload[key].id;
      }
    }

    return processedPayload;
  };
