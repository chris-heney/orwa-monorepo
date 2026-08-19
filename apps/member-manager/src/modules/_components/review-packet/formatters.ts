export const blank = "—";

export const displayText = (value: unknown): string => {
  if (value == null || value === "") return blank;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
};

export const formatPersonName = (
  name?: { first?: string | null; last?: string | null } | null
): string => {
  if (name == null) return blank;
  const joined = `${name.first || ""} ${name.last || ""}`.trim();
  return joined || blank;
};

export const formatAddress = (
  addr?: {
    street?: string | null;
    city?: string | null;
    state?: string | null;
    zip?: string | null;
  } | null
): string => {
  if (addr == null) return blank;
  const line1 = addr.street || "";
  const cityState = [addr.city, addr.state].filter(Boolean).join(", ");
  const line2 = [cityState, addr.zip].filter(Boolean).join(" ");
  const joined = [line1, line2].filter(Boolean).join("\n");
  return joined || blank;
};

export const formatMoney = (value: unknown): string => {
  if (value == null || value === "") return blank;
  const n = Number(value);
  if (!Number.isFinite(n)) return blank;
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
};

export const RELATIONSHIP_LABELS: Record<string, string> = {
  Self: "Self",
  DependentChild: "Dependent Child",
  DependentGrandchild: "Dependent Grandchild",
};

export const EDUCATION_LABELS: Record<string, string> = {
  FourYearCollege: "4-Year College/University",
  TwoYearCollege: "2-Year Community/Junior College",
  VocationalSchool: "Vocational Technical School",
};
