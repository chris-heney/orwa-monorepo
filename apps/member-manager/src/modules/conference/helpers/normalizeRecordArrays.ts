import { RaRecord } from "react-admin";

/**
 * Strapi 5 can return `null`/`undefined` for relation fields that have no
 * linked entries instead of an empty array (see AGENTS.md: "Strapi 5 ...
 * returns `null` (not `undefined`) for empty media/relation/component
 * fields"). react-admin's `ReferenceArrayField`/`ReferenceArrayInput`
 * require an array and will otherwise warn on every render
 * ("Value of field '<source>' is not an array.") which can cascade into
 * constant re-renders and focus loss in an open edit form.
 *
 * Call this on any record before handing it to a form/list that renders
 * array-relation fields (e.g. conference-extra's `included`/`excluded`,
 * or manyToMany `conferences`) to guarantee those fields are always arrays.
 */
export const normalizeRecordArrays = <T extends RaRecord | undefined>(
  record: T,
  fields: string[]
): T => {
  if (!record) return record;

  let changed = false;
  const normalized: RaRecord = { ...record };

  for (const field of fields) {
    if (!Array.isArray(normalized[field])) {
      normalized[field] = [];
      changed = true;
    }
  }

  return (changed ? normalized : record) as T;
};
