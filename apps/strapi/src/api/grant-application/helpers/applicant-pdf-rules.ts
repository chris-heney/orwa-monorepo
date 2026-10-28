/**
 * When does a grant-application write regenerate the stored applicant PDF?
 *
 * Automatic regeneration is limited to statuses in which the application is
 * still being shaped (applicant edit link, grant-manager corrections). After
 * committee the PDF is part of the record and only the explicit Grant Manager
 * "Regenerate PDF" action may replace it.
 */
export const AUTO_REGENERATE_STATUSES = ["New Application", "Awaiting Committee"];

/** Every attribute the rendered PDF reads (relations included). */
export const PDF_RELEVANT_FIELDS = [
  "legal_entity_name",
  "facility_id",
  "county",
  "population_served",
  "physical_address_street",
  "physical_address_city",
  "physical_address_state",
  "physical_address_zip",
  "point_of_contact",
  "chairman",
  "engineer",
  "has_engineer",
  "additional_contacts",
  "drinking_or_wastewater",
  "selected_projects",
  "project_costs",
  "combined_cost_of_projects",
  "requested_grant_amount",
  "minimum_utility_financial_contribution",
  "description_justification_estimated_cost",
  "engineering_report",
  "report_approved_by_deq",
  "resolves_violation",
  "satisfy_deq_issued_order",
  "money_set_aside",
  "applied_to_other_loans",
  "change_order_request",
  "signatory_name",
  "signatory_title",
  "signature",
  "application_date",
  "application_id",
];

export const isAutoRegenerateStatus = (statusName: string | null | undefined) =>
  !!statusName && AUTO_REGENERATE_STATUSES.includes(statusName);

export const touchesPdfFields = (dataKeys: Iterable<string>) => {
  for (const key of dataKeys) {
    if (PDF_RELEVANT_FIELDS.includes(key)) return true;
  }
  return false;
};

export const shouldRegenerateFor = (
  statusName: string | null | undefined,
  dataKeys: Iterable<string>
) => isAutoRegenerateStatus(statusName) && touchesPdfFields(dataKeys);

/** Media attributes a public form may send on a grant application write. */
export const GRANT_APPLICATION_MEDIA_FIELDS = [
  "proposals",
  "uploaded_engineering_report",
  "uploaded_notice_of_violation",
  "uploaded_additional_files",
  "consent_order",
  "applicant_pdf",
];

const isMediaId = (value: unknown): boolean => {
  if (typeof value === "number") return Number.isInteger(value) && value > 0;
  if (typeof value === "string") return /^\d+$/.test(value);
  if (value && typeof value === "object") {
    const id = (value as { id?: unknown }).id;
    return typeof id === "number" ? Number.isInteger(id) && id > 0 : typeof id === "string" && /^\d+$/.test(id);
  }
  return false;
};

export type InvalidMedia = { field: string; title: string | null };

/**
 * First media field whose value is not an uploaded file id (or a list of
 * them). gapp-form sends `{ src, title, rawFile }` when a browser upload was
 * aborted; letting that reach the Document Service ends in a 500.
 */
export const invalidMediaField = (
  data: Record<string, unknown>,
  fields: string[] = GRANT_APPLICATION_MEDIA_FIELDS
): InvalidMedia | null => {
  for (const field of fields) {
    const value = data[field];
    if (value === null || value === undefined || value === "") continue;
    const entries = Array.isArray(value) ? value : [value];
    for (const entry of entries) {
      if (isMediaId(entry)) continue;
      const title =
        entry && typeof entry === "object"
          ? ((entry as { title?: unknown; name?: unknown }).title ??
              (entry as { name?: unknown }).name ??
              null)
          : null;
      return { field, title: typeof title === "string" ? title : null };
    }
  }
  return null;
};
