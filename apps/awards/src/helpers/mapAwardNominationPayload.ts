import { IAwardNominationPayload } from "../types/types";
import { nextConferenceYear } from "./nextConferenceYear";
import { resolveAwardNamePrinted } from "./awardType";

const asNumber = (value: unknown) => {
  if (value === "" || value == null) return undefined;
  const numeric = Number(value);
  return Number.isNaN(numeric) ? undefined : numeric;
};

const asDateString = (value: unknown) => {
  if (value == null || value === "") return undefined;
  if (typeof value === "string") return value;
  return undefined;
};

const normalizeAwardType = (value: unknown) => {
  if (value === "Water/Wastewater System of the Year") {
    return "System of the Year";
  }
  return value;
};

/**
 * Keep only award-nomination schema fields. Dates stay YYYY-MM-DD strings.
 */
export const mapAwardNominationPayload = (
  payload: IAwardNominationPayload & Record<string, unknown>
) => ({
  nominee_name: payload.nominee_name,
  email: payload.email,
  daytime_phone: payload.daytime_phone,
  address: payload.address,
  city: payload.city,
  state: payload.state || "OK",
  zip: payload.zip,
  system_name: payload.system_name,
  county: payload.county,
  award_name_printed: resolveAwardNamePrinted(payload),
  nominator_first_name: payload.nominator_first_name,
  nominator_last_name: payload.nominator_last_name,
  nominator_address: payload.nominator_address,
  nominator_address_2: payload.nominator_address_2,
  nominator_city: payload.nominator_city,
  nominator_state: payload.nominator_state,
  nominator_zip: payload.nominator_zip,
  nominator_country: payload.nominator_country || "United States",
  nominator_phone: payload.nominator_phone,
  nominator_email: payload.nominator_email,
  watersystem: payload.watersystem ?? payload.watersystem_id ?? null,
  operation_start_date: asDateString(payload.operation_start_date),
  employment_date: asDateString(payload.employment_date),
  current_members: asNumber(payload.current_members),
  beginning_members: asNumber(payload.beginning_members),
  clerical_employees: asNumber(payload.clerical_employees),
  operation_maintenance_employees: asNumber(
    payload.operation_maintenance_employees
  ),
  management_employees: asNumber(payload.management_employees),
  justification: payload.justification || payload.nomination_description,
  award_type: normalizeAwardType(payload.award_type),
  award_year: asNumber(payload.award_year) ?? nextConferenceYear(),
  biography_method: payload.biography_method || undefined,
  biography_text: payload.biography_text || undefined,
  biography_file: payload.biography_file ?? null,
  photographs: payload.photographs ?? null,
  board_list_method: payload.board_list_method || undefined,
  board_list_file: payload.board_list_file ?? null,
  board_members: Array.isArray(payload.board_members)
    ? payload.board_members
    : undefined,
  supporting_documents: payload.supporting_documents ?? null,
  nomination_pdf: payload.nomination_pdf ?? null,
  accepted_terms: (payload as { accepted_terms?: unknown[] }).accepted_terms,
  adminOptions: payload.adminOptions,
  watersystem_id: undefined,
});
