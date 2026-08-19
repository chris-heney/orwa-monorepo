type MediaItem = {
  name?: string | null;
  url?: string | null;
};

type BoardMember = {
  first?: string;
  last?: string;
  title?: string;
};

const asMediaList = (value: unknown): MediaItem[] => {
  if (value == null) return [];
  const raw = Array.isArray(value)
    ? value
    : typeof value === "object" &&
        value !== null &&
        Array.isArray((value as { data?: unknown }).data)
      ? ((value as { data: unknown[] }).data as unknown[])
      : [value];
  return raw.filter(
    (item): item is MediaItem =>
      item != null && typeof item === "object" && ("url" in item || "name" in item)
  );
};

export const mediaSummary = (value: unknown): string => {
  const items = asMediaList(value);
  if (items.length === 0) return "None";
  if (items.length === 1) return items[0].name || "1 file";
  return `${items.length} files`;
};

export const hasMedia = (value: unknown): string =>
  asMediaList(value).length > 0 ? "Yes" : "No";

export const truncateText = (value: unknown, max = 80): string => {
  const text = value == null ? "" : String(value);
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
};

export const watersystemName = (record: {
  watersystem?: { name?: string } | null;
}): string => record.watersystem?.name || "";

export const watersystemCounty = (record: {
  watersystem?: { county?: string | null } | string | null;
}): string => {
  const watersystem = record.watersystem;
  if (!watersystem || typeof watersystem === "string") return "";
  return watersystem.county?.trim() || "";
};

export const contactSummary = (record: {
  contact?: {
    first?: string;
    last?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    name?: string;
  } | null;
}): string => {
  const contact = record.contact;
  if (!contact) return "";
  const name =
    contact.name ||
    [contact.first_name || contact.first, contact.last_name || contact.last]
      .filter(Boolean)
      .join(" ");
  if (name && contact.email) return `${name} (${contact.email})`;
  return name || contact.email || "";
};

export const boardMembersSummary = (value: unknown): string => {
  if (!Array.isArray(value) || value.length === 0) return "";
  return (value as BoardMember[])
    .map((member) => {
      const name = [member.first, member.last].filter(Boolean).join(" ");
      return member.title ? `${name} (${member.title})` : name;
    })
    .filter(Boolean)
    .join("; ");
};

export const employeeTotal = (record: {
  clerical_employees?: number | null;
  operation_maintenance_employees?: number | null;
  management_employees?: number | null;
}): number => {
  const total =
    Number(record.clerical_employees || 0) +
    Number(record.operation_maintenance_employees || 0) +
    Number(record.management_employees || 0);
  return Number.isFinite(total) ? total : 0;
};

export const AWARD_TYPE_CHOICES = [
  { id: "System of the Year", name: "System of the Year" },
  {
    id: "Water/Wastewater System of the Year",
    name: "Water/Wastewater System of the Year (legacy)",
  },
  { id: "Excellence in Operations", name: "Excellence in Operations" },
  { id: "Excellence in Management", name: "Excellence in Management" },
  {
    id: "Excellence in Office Operations",
    name: "Excellence in Office Operations",
  },
];

export const BIOGRAPHY_METHOD_CHOICES = [
  {
    id: "Copy/Paste or Type Biography",
    name: "Copy/Paste or Type Biography",
  },
  { id: "Upload Biography", name: "Upload Biography" },
];

export const BOARD_LIST_METHOD_CHOICES = [
  { id: "File You Upload", name: "File You Upload" },
  { id: "Keyed In List", name: "Keyed In List" },
];

export const DEFAULT_AWARD_COLUMN_IDS = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
];

export const AWARD_COLUMNS_PREF_KEY =
  "preferences.award-nominations.datagrid.columns";
