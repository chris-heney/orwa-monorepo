import {
  isDocumentId,
  toRelationWriteId,
} from "../../../../helpers/strapiIds";

export const SPONSOR_WRITE_POPULATE =
  "populate=sponsorship_items.sponsorship&populate=logo&populate=registration&populate=sponsorships";

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

/**
 * PUT/POST body for conference-sponsors.
 *
 * The form's `sponsorship` value may be a documentId, a numeric entityId
 * (nested populate before withStableId), or a fat row. Resolve each line
 * against the catalog so we write documentIds, keep component instance ids
 * (Strapi updates vs recreates), and set the oneToMany `sponsorships`
 * relation — omitting that field is what unlinked "what they sponsored".
 */
export const toSponsorWritePayload = (
  data: Record<string, unknown>,
  catalog: SponsorshipCatalogRow[]
): Record<string, unknown> => {
  const incoming = Array.isArray(data.sponsorship_items)
    ? (data.sponsorship_items as SponsorItemInput[])
    : [];

  const sponsorship_items: Array<Record<string, unknown>> = [];

  incoming.forEach((item) => {
    const match = findSponsorshipCatalogRow(catalog, item?.sponsorship);
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

  return {
    ...data,
    sponsorship_items,
    sponsorships: sponsorship_items.map((item) => item.sponsorship),
  };
};
