import { entryPayload } from "../types/types";

const asSearchText = (value: unknown): string => {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") {
    return String(value).toLowerCase();
  }
  return "";
};

const watersystemLabel = (value: unknown): string => {
  if (value == null) return "";
  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }
  if (typeof value === "object") {
    const record = value as { name?: unknown; legal_entity_name?: unknown };
    return asSearchText(record.legal_entity_name || record.name);
  }
  return "";
};

export const matchesAwardNominationSearch = (
  submission: Partial<entryPayload> | null | undefined,
  searchTerm: string
): boolean => {
  const searchLower = String(searchTerm || "").toLowerCase();
  if (!searchLower) return true;

  const data = submission?.data;
  const haystack = [
    asSearchText(data?.nominee_name),
    asSearchText(data?.system_name),
    asSearchText(data?.award_name_printed),
    asSearchText(data?.award_type),
    watersystemLabel(data?.watersystem),
  ].join(" ");

  return haystack.includes(searchLower);
};
