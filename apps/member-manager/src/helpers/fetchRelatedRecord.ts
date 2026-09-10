import { DataProvider, Identifier, RaRecord } from "react-admin";
import { getDisplayEntityId, isDocumentId } from "./strapiIds";

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
 * Column sources that identify a record rather than describe it.
 * The data provider remaps the Strapi 5 `documentId` onto `record.id` and
 * keeps the numeric PK as `entityId`, so a raw `record[source]` read on any
 * of these writes a documentId into the CSV.
 */
const ID_SOURCES = new Set(["id", "documentId", "entityId"]);

export const isIdSource = (source: string | undefined): boolean =>
  typeof source === "string" && ID_SOURCES.has(source);

/**
 * Read a datagrid column off a record for export.
 *
 * Mirrors what the screen shows: `ensureEntityIdColumn` remaps every
 * display `source="id"` column to `EntityIdField` (the numeric `entityId`),
 * so the CSV must resolve id columns the same way instead of emitting the
 * documentId. Never falls back to the documentId — a record with no numeric
 * PK exports an empty cell.
 */
export function readExportField(record: unknown, source: string | undefined): unknown {
  if (!record || typeof record !== "object" || !source) return undefined;
  if (isIdSource(source)) {
    const entityId = getDisplayEntityId(
      record as { id?: unknown; entityId?: unknown }
    );
    return entityId != null ? entityId : "";
  }
  return readPath(record, source);
}

/**
 * Read a datagrid `source` off a record, following dotted paths.
 *
 * Datagrid columns address populated relations the way RA's own fields do
 * (`<TextField source="point_of_contact.phone" />`). A flat `record[source]`
 * read returns undefined for those, which is why Phone exported blank while
 * the grid showed it — the CSV has to walk the path like the screen does.
 */
export function readPath(record: unknown, source: string): unknown {
  if (!record || typeof record !== "object") return undefined;
  if (!source.includes(".")) {
    return (record as Record<string, unknown>)[source];
  }
  let cursor: unknown = record;
  for (const segment of source.split(".")) {
    if (cursor == null || typeof cursor !== "object") return undefined;
    cursor = (cursor as Record<string, unknown>)[segment];
  }
  return cursor;
}

/**
 * The columns to export, in the order the user arranged them on screen.
 *
 * `preferences.<key>.columns` is the ordered list of visible column indices —
 * both `DatagridConfigurable` and `AgDatagrid` render
 * `columnIds.map(i => children[i])`, so that array *is* the on-screen order.
 * Exporters used to `availableColumns.filter(c => columnIds.includes(c.index))`,
 * which keeps the original declaration order and silently discards the user's
 * drag-reordering. Map over `columnIds` instead so the CSV mirrors the grid.
 */
export function selectExportColumns<T extends { index: string }>(
  availableColumns: T[],
  columnIds: string[] | undefined
): T[] {
  if (!columnIds || columnIds.length === 0) return availableColumns;
  const byIndex = new Map(
    availableColumns.map((column) => [column.index, column])
  );
  return columnIds
    .map((index) => byIndex.get(index))
    .filter((column): column is T => Boolean(column));
}

/**
 * Read a configurable-datagrid column off a record for export, using the
 * column's `source` and falling back to its lowercased `label` (the legacy
 * exporter convention) when the column carries no source.
 */
export function readExportColumn(
  record: unknown,
  column: { source?: string; label?: string }
): unknown {
  const source =
    typeof column.source !== "undefined"
      ? column.source
      : column.label?.trim().toLowerCase();
  return readExportField(record, source);
}

/**
 * `readExportField` for exporters that also probe `column.label` as a
 * fallback source (the legacy `record[label.toLowerCase()]` pattern).
 */
export function readExportCellValue(
  record: unknown,
  source: string | undefined,
  label?: string
): unknown {
  const bySource = readExportField(record, source);
  if (bySource !== undefined && bySource !== null) return bySource;
  const fallback = label?.trim().toLowerCase();
  if (!fallback) return bySource;
  return readExportField(record, fallback);
}

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
 * Relation records already fetched for an export, keyed `resource:id`.
 *
 * Exports used to resolve every unresolved relation with its own
 * `dataProvider.getOne`, so a 500-row list fired 500+ requests and took
 * minutes. `buildExportRelationCache` fetches each relation *type* once with a
 * single `getMany`; `resolveExportCell` then reads cells out of the map.
 */
export type ExportRelationCache = Map<string, RaRecord>;

const relationCacheKey = (resource: string, id: unknown) => `${resource}:${id}`;

/** The id to look a relation up by, or undefined when it is not id-shaped. */
const relationLookupId = (value: unknown): Identifier | undefined => {
  if (value == null || value === "") return undefined;
  if (looksLikeRelationId(value)) return value as Identifier;
  if (typeof value === "object" && !Array.isArray(value)) {
    const obj = value as RaRecord;
    // A populated object needs no lookup — only bare {id}/{documentId} refs do.
    if (relationDisplayValue(obj)) return undefined;
    const id = obj.id ?? (obj as { documentId?: string }).documentId;
    return looksLikeRelationId(id) ? (id as Identifier) : undefined;
  }
  return undefined;
};

/**
 * Pre-fetch every relation an export will need: one `getMany` per resource
 * instead of one `getOne` per record per column.
 *
 * Collects the id-shaped values the chosen columns point at, de-duplicates
 * them per resource, and resolves each resource in one round trip. Failures
 * are swallowed per resource — a missing lookup exports a blank cell exactly
 * as the per-record path did, rather than failing the whole download.
 */
export async function buildExportRelationCache(
  records: readonly RaRecord[],
  columns: readonly { source?: string; label?: string }[],
  dataProvider?: DataProvider,
  relationResources?: Record<string, string>
): Promise<ExportRelationCache> {
  const cache: ExportRelationCache = new Map();
  if (!dataProvider || records.length === 0) return cache;

  const idsByResource = new Map<string, Set<Identifier>>();

  for (const column of columns) {
    if (isIdSource(column.source)) continue;
    const resource = exportRelationResource(
      column.source,
      column.label,
      relationResources
    );
    if (!resource) continue;
    for (const record of records) {
      const raw = readExportColumn(record, column);
      const values = Array.isArray(raw) ? raw : [raw];
      for (const value of values) {
        const id = relationLookupId(value);
        if (id === undefined) continue;
        const bucket = idsByResource.get(resource) ?? new Set<Identifier>();
        bucket.add(id);
        idsByResource.set(resource, bucket);
      }
    }
  }

  await Promise.all(
    Array.from(idsByResource.entries()).map(async ([resource, ids]) => {
      try {
        const { data } = await dataProvider.getMany(resource, {
          ids: Array.from(ids),
        });
        for (const related of data ?? []) {
          // Index under every id shape a cell might carry: the RA id
          // (documentId after `withStableId`), the numeric PK, and the raw
          // documentId — the same record answers all three.
          const record = related as RaRecord;
          for (const key of [
            record.id,
            (record as { entityId?: unknown }).entityId,
            (record as { documentId?: unknown }).documentId,
          ]) {
            if (key == null) continue;
            cache.set(relationCacheKey(resource, key), record);
          }
        }
      } catch {
        /* leave these cells blank, as the per-record path did */
      }
    })
  );

  return cache;
}

/**
 * CSV cell for a datagrid value. Unwraps populated relations; when the value
 * is a Strapi 5 documentId/number and a resource is known, fetches the label
 * instead of writing the id.
 */
export async function resolveExportCell(
  value: unknown,
  options?: {
    dataProvider?: DataProvider;
    resource?: string;
    /** Pre-fetched relations (`buildExportRelationCache`) — consulted first. */
    cache?: ExportRelationCache;
  }
): Promise<string> {
  if (value == null || value === "") return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";

  if (Array.isArray(value)) {
    const parts = await Promise.all(
      value.map((item) => resolveExportCell(item, options))
    );
    return parts.filter(Boolean).join(", ");
  }

  // A pre-fetched relation answers without another round trip.
  if (options?.resource && options.cache?.size) {
    const id = relationLookupId(value);
    if (id !== undefined) {
      const cached = options.cache.get(relationCacheKey(options.resource, id));
      if (cached) return relationDisplayValue(cached);
    }
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
