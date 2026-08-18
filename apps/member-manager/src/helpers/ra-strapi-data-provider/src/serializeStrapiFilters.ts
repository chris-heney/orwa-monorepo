/**
 * Serialize React Admin list filters into Strapi 5 Content API query params.
 *
 * After withStableId remaps record.id → documentId, call sites naturally pass
 * documentIds into relation filters. Bare `filters[rel]=<documentId>` returns
 * 0 rows; `filters[rel][documentId]=…` works. Numeric values keep the bare form.
 */

/**
 * Strapi 5 documentIds are nanoid-like lowercase alphanumeric tokens
 * (typically 24 chars). Must NOT match enum/label strings like
 * "Reimbursement", emails, or digit-only numeric ids.
 */
export const isDocumentId = (id: unknown): id is string =>
  typeof id === "string" && /^[a-z0-9]{16,64}$/.test(id);

/** Path segment for a filter key when the leaf value is a documentId. */
export const documentIdFilterPath = (prefix: string, key: string): string =>
  key === "id" ? `${prefix}[documentId]` : `${prefix}[${key}][documentId]`;

/** Path segment for a filter key when the leaf value is numeric / other. */
export const bareFilterPath = (prefix: string, key: string): string =>
  `${prefix}[${key}]`;

const encodeLeaf = (value: unknown): string =>
  encodeURIComponent(String(value));

/**
 * Emit one or more query-string fragments for a single filter key/value.
 * Mutates `out` by pushing fragments (without leading `&`).
 */
const isUnusableFilterValue = (value: unknown): boolean =>
  value === undefined ||
  value === null ||
  value === "" ||
  value === "NaN" ||
  (typeof value === "number" && Number.isNaN(value));

export const appendFilterQuery = (
  out: string[],
  key: string,
  value: unknown,
  prefix = "filters"
): void => {
  if (isUnusableFilterValue(value)) {
    return;
  }

  if (key === "q" && typeof value === "string" && value) {
    out.push(`_q=${encodeURIComponent(value)}`);
    return;
  }

  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    Object.entries(value as Record<string, unknown>).forEach(
      ([operator, opValue]) => {
        if (operator === "$null") {
          out.push(`${prefix}[${key}][$null]=true`);
          return;
        }

        if (operator === "$or" && Array.isArray(opValue)) {
          opValue.forEach((cond, index) => {
            if (!cond || typeof cond !== "object" || Array.isArray(cond)) {
              return;
            }
            Object.entries(cond as Record<string, unknown>).forEach(
              ([nestedKey, nestedValue]) => {
                appendFilterQuery(
                  out,
                  nestedKey,
                  nestedValue,
                  `${prefix}[${key}][$or][${index}]`
                );
              }
            );
          });
          return;
        }

        if (
          ["$in", "$nin", "$notIn"].includes(operator) &&
          Array.isArray(opValue)
        ) {
          opValue.forEach((v) => {
            if (isDocumentId(v)) {
              // Mix of documentIds in $in: filter via documentId field.
              // For relation keys this becomes filters[rel][documentId][$in][]=
              // For id key: filters[documentId][$in][]=
              const path =
                key === "id"
                  ? `${prefix}[documentId][${operator}][]`
                  : `${prefix}[${key}][documentId][${operator}][]`;
              out.push(`${path}=${encodeLeaf(v)}`);
            } else {
              out.push(
                `${prefix}[${key}][${operator}][]=${encodeLeaf(v)}`
              );
            }
          });
          return;
        }

        if (["$lt", "$lte", "$gt", "$gte"].includes(operator)) {
          out.push(
            `${prefix}[${key}][${operator}]=${encodeLeaf(opValue)}`
          );
          return;
        }

        if (operator === "$between" && Array.isArray(opValue)) {
          out.push(
            `${prefix}[${key}][$between][0]=${encodeLeaf(opValue[0])}`,
            `${prefix}[${key}][$between][1]=${encodeLeaf(opValue[1])}`
          );
          return;
        }

        if (
          !operator.startsWith("$") &&
          typeof opValue === "object" &&
          opValue !== null &&
          !Array.isArray(opValue)
        ) {
          // Nested relational filter, e.g. { application: { committee_date: { $between } } }
          appendFilterQuery(out, operator, opValue, `${prefix}[${key}]`);
          return;
        }

        // Operators like $eq / $ne / $contains whose value may be a documentId
        if (isDocumentId(opValue)) {
          if (key === "id") {
            out.push(
              `${prefix}[documentId][${operator}]=${encodeLeaf(opValue)}`
            );
          } else if (operator === "$eq") {
            // Bare equality on a relation: prefer [documentId] form
            out.push(
              `${prefix}[${key}][documentId]=${encodeLeaf(opValue)}`
            );
          } else {
            out.push(
              `${prefix}[${key}][documentId][${operator}]=${encodeLeaf(opValue)}`
            );
          }
          return;
        }

        out.push(
          `${prefix}[${key}][${operator}]=${encodeLeaf(opValue)}`
        );
      }
    );
    return;
  }

  // Scalar / array leaf (RA sometimes passes id arrays without $in)
  if (Array.isArray(value)) {
    value.forEach((v) => {
      if (isUnusableFilterValue(v)) return;
      if (isDocumentId(v)) {
        out.push(`${documentIdFilterPath(prefix, key)}[$in][]=${encodeLeaf(v)}`);
      } else {
        out.push(`${bareFilterPath(prefix, key)}[$in][]=${encodeLeaf(v)}`);
      }
    });
    return;
  }

  if (isDocumentId(value)) {
    out.push(`${documentIdFilterPath(prefix, key)}=${encodeLeaf(value)}`);
    return;
  }

  out.push(`${bareFilterPath(prefix, key)}=${encodeLeaf(value)}`);
};

export type RaListFilterParams = {
  sort?: { field?: string; order?: string };
  filter?: Record<string, unknown>;
  pagination?: { page: number; perPage: number };
};

/**
 * Full RA → Strapi list query string (sort + filters + pagination).
 */
export const convertRaParamsToStrapiParams = (
  params: RaListFilterParams
): string => {
  const { sort: s, filter: f = {}, pagination = { page: 1, perPage: 25 } } =
    params;

  const sort = s?.field
    ? `sort=${encodeURIComponent(s.field)}:${(s.order || "ASC").toLowerCase()}`
    : "sort=updatedAt:desc";

  const filters: string[] = [];

  if ("$or" in f && Array.isArray(f.$or)) {
    f.$or.forEach((orCondition: Record<string, unknown>, index: number) => {
      Object.entries(orCondition).forEach(([key, value]) => {
        appendFilterQuery(filters, key, value, `filters[$or][${index}]`);
      });
    });
  }
  if ("$and" in f && Array.isArray(f.$and)) {
    f.$and.forEach((andCondition: Record<string, unknown>, index: number) => {
      Object.entries(andCondition).forEach(([key, value]) => {
        appendFilterQuery(filters, key, value, `filters[$and][${index}]`);
      });
    });
  }
  Object.entries(f).forEach(([key, value]) => {
    if (key === "$or" || key === "$and") return;
    appendFilterQuery(filters, key, value);
  });

  const start = (pagination.page - 1) * pagination.perPage;
  const paginationParams = `pagination[start]=${start}&pagination[limit]=${pagination.perPage}`;

  return [sort, ...filters, paginationParams].join("&");
};
