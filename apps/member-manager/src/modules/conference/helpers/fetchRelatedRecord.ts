import { DataProvider, RaRecord } from "react-admin";
import { isDocumentId } from "../../../helpers/strapiIds";

/**
 * Resolve a Strapi relation that may be a numeric id, documentId string,
 * or an already-populated object (post Strapi 5 / data-provider remapping).
 */
const fetchRelatedRecord = async (
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
      "email" in obj
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

export default fetchRelatedRecord;
