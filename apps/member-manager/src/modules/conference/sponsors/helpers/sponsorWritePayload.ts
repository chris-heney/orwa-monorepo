import {
  isDocumentId,
  toRelationWriteId,
} from "../../../../helpers/strapiIds";

export const SPONSOR_WRITE_POPULATE =
  "populate=sponsorship_items.sponsorship&populate=logo&populate=registration&populate=sponsorships&populate=conference";

export type SponsorshipCatalogRow = {
  id?: string | number;
  documentId?: string;
  entityId?: number | string;
  name?: string;
  amount?: number | string | null;
};

export type SponsorItemInput = {
  id?: number;
  sponsorship?: unknown;
  label?: string;
  value?: number | string | null;
  key?: string;
};

const asIdSet = (value: unknown): Set<string> => {
  const ids = new Set<string>();
  const add = (part: unknown) => {
    if (part == null || part === "") return;
    ids.add(String(part));
  };

  if (value == null || value === "") return ids;
  if (typeof value !== "object") {
    add(value);
    return ids;
  }

  const obj = value as {
    id?: unknown;
    documentId?: unknown;
    entityId?: unknown;
    data?: { id?: unknown; documentId?: unknown };
  };
  add(obj.documentId);
  add(obj.id);
  add(obj.entityId);
  add(obj.data?.documentId);
  add(obj.data?.id);
  return ids;
};

/** True when any id shape on the catalog row overlaps any id shape on the form value. */
export const sponsorshipRefMatches = (
  catalog: SponsorshipCatalogRow,
  raw: unknown
): boolean => {
  const catalogIds = asIdSet(catalog);
  if (catalogIds.size === 0) return false;
  for (const id of asIdSet(raw)) {
    if (catalogIds.has(id)) return true;
  }
  return false;
};

export const findSponsorshipCatalogRow = (
  catalog: SponsorshipCatalogRow[],
  raw: unknown
): SponsorshipCatalogRow | undefined =>
  catalog.find((row) => sponsorshipRefMatches(row, raw));

/**
 * Autocomplete choices use withStableId (id = documentId). Nested populate
 * still exposes the numeric PK as `id` — prefer documentId so the input
 * keeps the current selection instead of looking empty and submitting null.
 */
export const toSponsorshipFormId = (
  value: unknown
): string | number | "" => {
  if (value == null || value === "") return "";
  if (typeof value === "object") {
    const obj = value as { documentId?: unknown; id?: unknown };
    if (typeof obj.documentId === "string" && obj.documentId) {
      return obj.documentId;
    }
    if (typeof obj.id === "string" && (isDocumentId(obj.id) || obj.id)) {
      return obj.id;
    }
    if (typeof obj.id === "number") return obj.id;
    return "";
  }
  return value as string | number;
};

const toComponentInstanceId = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isInteger(value) && value > 0) {
    return value;
  }
  if (typeof value === "string" && /^\d+$/.test(value)) {
    return parseInt(value, 10);
  }
  return undefined;
};

export type SponsorWriteOptions = {
  previousData?: Record<string, unknown> | null;
  fallbackConference?: unknown;
  fallbackYear?: unknown;
};

const isUsableRelationId = (value: unknown): boolean => {
  if (value == null || value === "") return false;
  if (typeof value === "number") return Number.isFinite(value) && value > 0;
  if (typeof value === "string") {
    if (isDocumentId(value)) return true;
    if (/^\d+$/.test(value)) return Number(value) > 0;
    return false;
  }
  return toRelationWriteId(value as never) != null;
};

const pickRelationId = (...candidates: unknown[]): string | number | undefined => {
  for (const candidate of candidates) {
    if (!isUsableRelationId(candidate)) continue;
    const id = toRelationWriteId(candidate as never);
    if (id != null && id !== "" && !(typeof id === "number" && Number.isNaN(id))) {
      return id;
    }
  }
  return undefined;
};

const pickYear = (...candidates: unknown[]): number | undefined => {
  for (const candidate of candidates) {
    const n = typeof candidate === "number" ? candidate : Number(candidate);
    if (Number.isFinite(n) && n > 0) return n;
  }
  return undefined;
};

const findByLabel = (
  catalog: SponsorshipCatalogRow[],
  label: unknown
): SponsorshipCatalogRow | undefined => {
  if (typeof label !== "string") return undefined;
  const needle = label.trim().toLowerCase();
  if (!needle) return undefined;
  return catalog.find(
    (row) => typeof row.name === "string" && row.name.trim().toLowerCase() === needle
  );
};

const itemsFromUnknown = (value: unknown): SponsorItemInput[] =>
  Array.isArray(value) ? (value as SponsorItemInput[]) : [];

const buildItems = (
  incoming: SponsorItemInput[],
  catalog: SponsorshipCatalogRow[]
): Array<Record<string, unknown>> => {
  const sponsorship_items: Array<Record<string, unknown>> = [];

  incoming.forEach((item) => {
    const match =
      findSponsorshipCatalogRow(catalog, item?.sponsorship) ??
      findByLabel(catalog, item?.label);
    const sponsorship =
      toRelationWriteId(match) ?? toRelationWriteId(item?.sponsorship as never);
    if (sponsorship == null) return;

    const label = match?.name ?? item.label;
    const value = match?.amount ?? item.value;
    const componentId = toComponentInstanceId(item.id);

    sponsorship_items.push({
      ...(componentId != null ? { id: componentId } : {}),
      sponsorship,
      label,
      value,
      key: item.key || `${label ?? "item"}-${sponsorship_items.length}`,
    });
  });

  return sponsorship_items;
};

/**
 * PUT/POST body for conference-sponsors.
 *
 * The form's `sponsorship` value may be a documentId, a numeric entityId
 * (nested populate before withStableId), or a fat row. Resolve each line
 * against the catalog so we write documentIds, keep component instance ids
 * (Strapi updates vs recreates), and set the oneToMany `sponsorships`
 * relation.
 *
 * Never write null `conference`/`year` — the hidden NumberInput + a shallow
 * getOne (conference omitted) would otherwise unlink the sponsor from the
 * conference filter and make the row vanish from the dashboard.
 */
export const toSponsorWritePayload = (
  data: Record<string, unknown>,
  catalog: SponsorshipCatalogRow[],
  options: SponsorWriteOptions = {}
): Record<string, unknown> => {
  const previous = options.previousData ?? {};
  const incoming = itemsFromUnknown(data.sponsorship_items);
  let sponsorship_items = buildItems(incoming, catalog);

  if (sponsorship_items.length === 0 && incoming.length > 0) {
    sponsorship_items = buildItems(itemsFromUnknown(previous.sponsorship_items), catalog);
  }

  const conference = pickRelationId(
    data.conference,
    previous.conference,
    options.fallbackConference
  );
  const year = pickYear(data.year, previous.year, options.fallbackYear);
  const registration = pickRelationId(data.registration, previous.registration);

  const out: Record<string, unknown> = {
    ...data,
    sponsorship_items,
    sponsorships: sponsorship_items.map((item) => item.sponsorship),
  };

  if (conference != null) out.conference = conference;
  else delete out.conference;

  if (year != null) out.year = year;
  else delete out.year;

  if (registration != null) out.registration = registration;
  else delete out.registration;

  return out;
};
