import { StoredStrapiFile, StrapiFormattedFile } from "../types/types";
import uploadService from "./uploadService";

export const processAndUploadFiles = async (payload: any, notify: {
    (message: string, severity: "success" | "error"): void;
}) => {
    const processedPayload = { ...payload };

    for (const key in processedPayload) {
      if (key === "extras") {
        return processedPayload;
      }
      if (Array.isArray(processedPayload[key])) {
        // If the key holds an array, check if it contains StrapiFormattedFiles
        const fileArray = processedPayload[key].filter(
          (file: StoredStrapiFile) => {
            return !file.id;
          }
        );

        if (fileArray.length > 0 && fileArray[0]?.rawFile) {
          try {
            const uploadedFiles = await uploadService.uploadFiles(
              fileArray.map((file: StrapiFormattedFile) => file.rawFile),
            );
            processedPayload[key] = uploadedFiles.concat(
              processedPayload[key]
                .filter((file: StoredStrapiFile) => {
                  return file.id;
                })
                .map((file: StoredStrapiFile) => file.id)
            );
          } catch (error: unknown) {
            console.error(`Error uploading files for ${key}:`, error);
            notify(
              `Error uploading files for ${key}. Please try again later.`,
              "error"
            );
          }
        }
      } else if (processedPayload[key]?.rawFile) {
        // If the key holds a single StrapiFormattedFile
        if (processedPayload[key].id) {
          processedPayload[key] = processedPayload[key].id;
        } else {
          try {
            const uploadedFile = await uploadService.uploadFile(
              processedPayload[key].rawFile
            );
            processedPayload[key] = uploadedFile[0]; // Replace with uploaded file metadata
          } catch (error) {
            console.error(`Error uploading file for ${key}:`, error);
            notify(
              `Error uploading file for ${key}. Please try again later.`,
              "error"
            );
          }
        }
      }
    }

    return processedPayload;
  };