import { DataProvider, RaRecord } from "react-admin";
import { isDocumentId } from "./strapiIds";

/**
 * Resolve a Strapi relation that may be a numeric id, documentId string,
 * or an already-populated object (post Strapi 5 / data-provider remapping).
 *
 * Exporters used to gate fetches on `typeof rel === "number"`. After Strapi 5
 * the value is usually a documentId string, so that check skipped the lookup
 * and the CSV wrote the id (conference Date Registered, grant Status, …).
 */
export const fetchRelatedRecord = async (
  dataProvider: DataProvider,
  resource: string,
  relation: unknown
): Promise<RaRecord> => {
  if (relation == null) return {} as RaRecord;

  if (typeof relation === "object" && !Array.isArray(relation)) {
    const obj = relation as RaRecord;
    // Already populated with useful fields — skip another round-trip.
    if (
      "registration_date" in obj ||
      "organization" in obj ||
      "first" in obj ||
      "name" in obj ||
      "email" in obj ||
      "legal_entity_name" in obj
    ) {
      return obj;
    }
    const id = obj.id ?? (obj as { documentId?: string }).documentId;
    if (id == null) return {} as RaRecord;
    try {
      const { data } = await dataProvider.getOne(resource, { id });
      return (data ?? {}) as RaRecord;
    } catch {
      return {} as RaRecord;
    }
  }

  if (
    typeof relation === "number" ||
    isDocumentId(relation) ||
    (typeof relation === "string" && /^\d+$/.test(relation))
  ) {
    try {
      const { data } = await dataProvider.getOne(resource, { id: relation });
      return (data ?? {}) as RaRecord;
    } catch {
      return {} as RaRecord;
    }
  }

  return {} as RaRecord;
};

/**
 * Human-readable CSV cell for a relation or scalar.
 * Populated objects export name / person / email — never a raw id object.
 */
export function relationDisplayValue(value: unknown): string {
  if (value == null || value === "") return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    return value.map(relationDisplayValue).filter(Boolean).join(", ");
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    if (typeof obj.name === "string" && obj.name) return obj.name;
    const person = [obj.first, obj.last]
      .filter((part): part is string => typeof part === "string" && part.length > 0)
      .join(" ");
    if (person) return person;
    if (typeof obj.legal_entity_name === "string" && obj.legal_entity_name) {
      return obj.legal_entity_name;
    }
    if (typeof obj.email === "string" && obj.email) return obj.email;
    if (typeof obj.label === "string" && obj.label) return obj.label;
    if (typeof obj.title === "string" && obj.title) return obj.title;
    return "";
  }
  return String(value);
}

export async function fetchRelatedField(
  dataProvider: DataProvider,
  resource: string,
  relation: unknown,
  field: string
): Promise<string> {
  const record = await fetchRelatedRecord(dataProvider, resource, relation);
  const value = record[field];
  return value == null || value === "" ? "" : String(value);
}

/** Common datagrid `source` → Strapi resource for CSV relation resolution. */
export const DEFAULT_EXPORT_RELATION_RESOURCES: Record<string, string> = {
  assigned_to: "staff",
  application: "grant-application-finals",
  grant_application: "grant-application-finals",
  block: "training-schedule-blocks",
  conference_ticket: "conference-tickets",
  contact: "contacts",
  contact_primary: "contacts",
  contact_secondary: "contacts",
  event: "training-events",
  instructor: "training-instructors",
  membership: "memberships",
  payout_status: "payout-statuses",
  point_of_contact: "contacts",
  program_billed: "programs",
  registrant: "contacts",
  registration: "conference-registrations",
  session: "training-sessions",
  team: "conference-teams",
  training_event: "training-events",
  user: "users",
};

const looksLikeRelationId = (value: unknown): boolean =>
  typeof value === "number" ||
  isDocumentId(value) ||
  (typeof value === "string" && /^\d+$/.test(value));

/**
 * CSV cell for a datagrid value. Unwraps populated relations; when the value
 * is a Strapi 5 documentId/number and a resource is known, fetches the label
 * instead of writing the id.
 */
export async function resolveExportCell(
  value: unknown,
  options?: { dataProvider?: DataProvider; resource?: string }
): Promise<string> {
  if (value == null || value === "") return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";

  if (Array.isArray(value)) {
    const parts = await Promise.all(
      value.map((item) => resolveExportCell(item, options))
    );
    return parts.filter(Boolean).join(", ");
  }

  if (typeof value === "object") {
    const unwrapped = relationDisplayValue(value);
    if (unwrapped) return unwrapped;
    if (options?.dataProvider && options.resource) {
      const record = await fetchRelatedRecord(
        options.dataProvider,
        options.resource,
        value
      );
      return relationDisplayValue(record);
    }
    return "";
  }

  if (looksLikeRelationId(value) && options?.dataProvider && options.resource) {
    const record = await fetchRelatedRecord(
      options.dataProvider,
      options.resource,
      value
    );
    const label = relationDisplayValue(record);
    if (label) return label;
    return "";
  }

  return String(value);
}

export function exportRelationResource(
  source: string | undefined,
  label: string | undefined,
  extras?: Record<string, string>
): string | undefined {
  const keys = [source, label, label?.toLowerCase()].filter(
    (key): key is string => Boolean(key)
  );
  for (const key of keys) {
    if (extras?.[key]) return extras[key];
    if (DEFAULT_EXPORT_RELATION_RESOURCES[key]) {
      return DEFAULT_EXPORT_RELATION_RESOURCES[key];
    }
  }
  return undefined;
}

export default fetchRelatedRecord;
