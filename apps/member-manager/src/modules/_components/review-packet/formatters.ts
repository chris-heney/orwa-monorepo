export const blank = "—";

/**
 * Cycle-year rule (May rollover) lives in one place —
 * `helpers/conferenceCycleYear.ts`. Re-exported here so the print paths keep
 * importing it from the review-packet barrel. Use `cycleYearOf` only as the
 * fallback for legacy rows where the stamped `award_year` / `scholarship_year`
 * is NULL.
 */
export {
  CYCLE_ROLLOVER_MONTH,
  cycleYearOf,
} from "../../../helpers/conferenceCycleYear";
import { formatScholarshipYear } from "../../../helpers/conferenceCycleYear";

/**
 * Year wording for printed packets (cover band, running header, index).
 * Staff asked for "Year: 2027" — never "Cycle 2027". The value comes from the
 * record (Awards `award_year`, ORWEF `scholarship_year`), not from the clock.
 * Awards packets use this as-is (single conference year).
 */
export const formatPacketYear = (
  year: number | string | null | undefined
): string => {
  const text = String(year ?? "").trim();
  return `Year: ${text || blank}`;
};

/**
 * ORWEF variant: the stored start year prints as the split academic year —
 * "Year: 2027-2028". Blank stays "Year: —".
 */
export const formatScholarshipPacketYear = (
  startYear: number | string | null | undefined
): string => {
  const text = String(startYear ?? "").trim();
  return formatPacketYear(text ? formatScholarshipYear(text) : null);
};

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
