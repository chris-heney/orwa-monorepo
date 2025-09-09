import { StrapiFormattedFile } from "../types/types";

export const transformFile = (file: File, name: string, cacheId?: string): StrapiFormattedFile => {
  if (!(file instanceof File)) {
    return file as any; // Handle non-File inputs for backwards compatibility
  }

  const preview = URL.createObjectURL(file);
  const transformedFile: StrapiFormattedFile = {
    rawFile: file,
    src: preview,
    title: `${file.name}${name}`,
    ...(cacheId && { cacheId })
  };
  return transformedFile;
};