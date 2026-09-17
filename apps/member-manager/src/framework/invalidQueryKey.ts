/**
 * Recovering from a list query Strapi refuses to run.
 *
 * Strapi 5 validates every key in `sort` / `filters` and answers 400 when one
 * is not an attribute of the content type:
 *
 *   { error: { status: 400, name: "ValidationError",
 *              message: "Invalid key dir_contact_1_title",
 *              details: { key: "dir_contact_1_title", path: null,
 *                         source: "query", param: "sort" } } }
 *
 * A grid column whose `source` is computed client-side (the water systems
 * "Contact 1: Title" column, say) is sortable by default, so one click on its
 * header sends that key as `sort`. The framework then persists the list params
 * — locally in RaStore and remotely in the user's synced preferences — and the
 * list fails the same way on every later visit, on every device. These helpers
 * read the offending key out of the error so `ListScope` can drop exactly that
 * sort or filter and let the corrected params overwrite the saved ones.
 */

export type InvalidQueryParam = 'sort' | 'filters' | 'unknown';

export interface InvalidQueryKey {
  /** The key Strapi rejected, e.g. `dir_contact_1_title`. */
  key: string;
  /** Which part of the query carried it. */
  param: InvalidQueryParam;
  /** Dotted path to the key inside the param, when Strapi reports one. */
  path: string | null;
}

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

const asKey = (value: unknown): string | null =>
  typeof value === 'string' && value.trim() !== '' ? value.trim() : null;

const INVALID_KEY_MESSAGE = /^Invalid key ([^\s:;,]+)/i;

const toParam = (value: unknown): InvalidQueryParam =>
  value === 'sort' ? 'sort' : value === 'filters' ? 'filters' : 'unknown';

/**
 * The key a failed list request was rejected for, or null when the error is
 * anything else (network failure, 401/403, a 400 about the request *body*, …).
 *
 * @param error whatever the data provider rejected with — react-admin's
 *   `HttpError` carries `status` and the parsed response `body`.
 */
export const parseStrapiInvalidQueryKey = (
  error: unknown
): InvalidQueryKey | null => {
  const httpError = asRecord(error);
  if (!httpError) return null;

  const status = httpError.status;
  if (typeof status === 'number' && status !== 400) return null;

  const strapiError = asRecord(asRecord(httpError.body)?.error);
  const details = asRecord(strapiError?.details);

  // "Invalid key" on a write body is a different problem; only queries are
  // recoverable by dropping a sort or a filter.
  const source = details?.source;
  if (typeof source === 'string' && source !== 'query') return null;

  const detailKey = asKey(details?.key);
  if (detailKey) {
    return {
      key: detailKey,
      param: toParam(details?.param),
      path: asKey(details?.path),
    };
  }

  // Older/other responses only carry the message (httpClient copies Strapi's
  // message onto `error.message`).
  const message = asKey(strapiError?.message) ?? asKey(httpError.message);
  const match = message?.match(INVALID_KEY_MESSAGE);
  return match ? { key: match[1], param: 'unknown', path: null } : null;
};

/** True when a sort field is, or traverses, the rejected key (`a.key`, `key`). */
export const sortUsesKey = (field: unknown, key: string): boolean =>
  typeof field === 'string' && (field === key || field.split('.').includes(key));

const mentionsKey = (name: string, key: string): boolean =>
  name === key || name.split('.').includes(key);

const deepStrip = (value: unknown, key: string): [unknown, boolean] => {
  if (Array.isArray(value)) {
    let changed = false;
    const next = value.map((item) => {
      const [stripped, itemChanged] = deepStrip(item, key);
      changed = changed || itemChanged;
      return stripped;
    });
    return [changed ? next : value, changed];
  }
  const record = asRecord(value);
  if (!record) return [value, false];

  let changed = false;
  const next: Record<string, unknown> = {};
  for (const [name, child] of Object.entries(record)) {
    if (mentionsKey(name, key)) {
      changed = true;
      continue;
    }
    const [stripped, childChanged] = deepStrip(child, key);
    changed = changed || childChanged;
    next[name] = stripped;
  }
  return [changed ? next : value, changed];
};

/**
 * `filter` without the rejected key. Looks at the top level first (the common
 * case: a filter input whose `source` is not an attribute), then the first
 * segment of Strapi's `path`, then anywhere in the tree.
 *
 * @returns the cleaned filter, or null when the key is not in it.
 */
export const stripFilterKey = (
  filter: Record<string, unknown> | undefined | null,
  invalid: Pick<InvalidQueryKey, 'key' | 'path'>
): Record<string, unknown> | null => {
  if (!filter) return null;

  const topLevel = Object.keys(filter).filter(
    (name) =>
      mentionsKey(name, invalid.key) ||
      (invalid.path != null && name === invalid.path.split('.')[0])
  );
  if (topLevel.length > 0) {
    const next = { ...filter };
    topLevel.forEach((name) => delete next[name]);
    return next;
  }

  const [stripped, changed] = deepStrip(filter, invalid.key);
  return changed ? (stripped as Record<string, unknown>) : null;
};
