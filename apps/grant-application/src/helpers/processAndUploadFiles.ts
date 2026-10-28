import uploadService from "../services/uploadService";
import { StrapiFormattedFile } from "../types/types";
import { fileCache } from "./fileCache";

// When editing an existing application, file fields can contain a mix of
// already-uploaded Strapi files ({ id, src, title } — no rawFile) and newly
// selected files ({ rawFile, ... }). Existing files keep their ids; only new
// rawFiles are uploaded.

const isUploadedFile = (value: any) =>
  value && typeof value === "object" && !value.rawFile && value.id !== undefined;

const isNewFile = (value: any) => !!value?.rawFile;

/**
 * A selected file could not be uploaded. The submit MUST stop here: sending
 * the raw `{ src, rawFile }` object on to Strapi fails the whole save (and
 * used to surface as an opaque 500 — TAFT PWA, 2026-10-28).
 */
export class FileUploadError extends Error {
  field: string;
  title: string;

  constructor(field: string, title: string, cause?: unknown) {
    super(`Could not upload "${title}".`);
    this.name = "FileUploadError";
    this.field = field;
    this.title = title;
    if (cause !== undefined) (this as any).cause = cause;
  }
}

export const fileUploadErrorMessage = (error: unknown): string | null =>
  error instanceof FileUploadError
    ? `Could not upload "${error.title}". Remove it and choose it again.`
    : null;

const displayTitle = (file: StrapiFormattedFile) =>
  (file.rawFile as File | undefined)?.name || file.title || "file";

/**
 * Bytes to send for a newly selected file. Prefer the IndexedDB copy written
 * when the file was picked: it was read successfully then, whereas the
 * original File handle can fail at send time (Chrome aborts the request when
 * the file changed on disk or lives in a cloud "on demand" folder).
 */
const uploadableFile = async (file: StrapiFormattedFile): Promise<File> => {
  const raw = file.rawFile as File;
  const cacheId = (file as any).cacheId as string | undefined;
  if (cacheId) {
    try {
      const cached = await fileCache.getFile(cacheId);
      if (cached && cached.size > 0) {
        return cached instanceof File
          ? cached
          : new File([cached], raw?.name ?? file.title, { type: (cached as Blob).type || raw?.type });
      }
    } catch {
      // fall through to the original handle
    }
  }
  return raw;
};

const uploadOne = async (field: string, file: StrapiFormattedFile): Promise<number> => {
  const title = displayTitle(file);
  try {
    const candidate = await uploadableFile(file);
    if (!(candidate instanceof Blob)) throw new Error("not a file");
    const id = await uploadService.uploadFile(candidate);
    if (id === undefined || id === null) throw new Error("upload returned no id");
    return id;
  } catch (error) {
    throw new FileUploadError(field, title, error);
  }
};

export const processAndUploadFiles = async (
  payload: any,
  // Kept for call-site compatibility; failures now throw FileUploadError
  // instead of notifying and continuing with a half-processed payload.
  _notify?: (message: string, severity: "success" | "error") => void
) => {
  const processedPayload = { ...payload };

  for (const key in processedPayload) {
    const value = processedPayload[key];

    if (Array.isArray(value)) {
      const hasNewFiles = value.some(isNewFile);
      const hasUploadedFiles = value.some(isUploadedFile);
      if (!hasNewFiles && !hasUploadedFiles) continue;

      const ids: number[] = [];
      for (const entry of value) {
        if (isUploadedFile(entry)) {
          ids.push(entry.id);
        } else if (isNewFile(entry)) {
          ids.push(await uploadOne(key, entry));
        }
      }
      processedPayload[key] = ids;
    } else if (isNewFile(value)) {
      processedPayload[key] = await uploadOne(key, value);
    } else if (isUploadedFile(value)) {
      processedPayload[key] = value.id;
    }
  }

  return processedPayload;
};
