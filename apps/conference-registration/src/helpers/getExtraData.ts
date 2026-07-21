import { IExtraOption } from "../types/types";

type ExtraRef =
  | number
  | string
  | { id?: number | string; documentId?: string }
  | null
  | undefined;

const normalizeExtraRef = (extraOptionId: ExtraRef) => {
  if (extraOptionId == null) return null;

  if (typeof extraOptionId === "object") {
    return {
      id: extraOptionId.id,
      documentId: extraOptionId.documentId,
    };
  }

  return { id: extraOptionId, documentId: undefined };
};

export const getExtraData = (
  extraOptions: IExtraOption[],
  extraOptionId: ExtraRef
) => {
  if (!Array.isArray(extraOptions)) return undefined;

  const ref = normalizeExtraRef(extraOptionId);
  if (!ref) return undefined;

  return extraOptions.find((extraOption) => {
    if (ref.id != null && String(extraOption.id) === String(ref.id)) {
      return true;
    }

    if (
      ref.documentId != null &&
      String((extraOption as { documentId?: string }).documentId) ===
        String(ref.documentId)
    ) {
      return true;
    }

    // Allow looking up by documentId when the stored value is a bare documentId string
    if (
      typeof ref.id === "string" &&
      String((extraOption as { documentId?: string }).documentId) === ref.id
    ) {
      return true;
    }

    return false;
  });
};
