import { StrapiFormattedFile } from "../types/types";

const fileTitleSuffix = (name?: string) => {
  const suffix = typeof name === "string" ? name.trim() : "";
  return suffix && suffix !== "undefined" ? suffix : "";
};

export const transformFile = (file: File, name?: string, cacheId?: string): StrapiFormattedFile => {
  if (!(file instanceof File)) {
    return file as any; // Handle non-File inputs for backwards compatibility
  }

  const preview = URL.createObjectURL(file);
  const suffix = fileTitleSuffix(name);
  const transformedFile: StrapiFormattedFile = {
    rawFile: file,
    src: preview,
    title: suffix ? `${file.name} - ${suffix}` : file.name,
    ...(cacheId && { cacheId })
  };
  return transformedFile;
};