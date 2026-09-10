/**
 * Pull the human-readable message out of a Strapi 5 error body.
 *
 * react-admin's `fetchUtils.fetchJson` builds its HttpError as
 * `new HttpError((json && json.message) || statusText, status, json)`.
 * Strapi 5 never puts `message` at the top level — it answers
 * `{ data: null, error: { status, name, message, details } }` — so every API
 * rejection reached the UI as the bare status text, and over HTTP/2 (where
 * `statusText` is always "") as an empty string. Callers that notify
 * `error.message || 'Error creating X'` therefore showed their generic
 * fallback and swallowed messages the API had deliberately written for the
 * user (e.g. "The golf tournament is sold out — no golfer spots remain.").
 */

type StrapiValidationDetail = {
  message?: unknown;
};

const asRecord = (value: unknown): Record<string, unknown> | null =>
  typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;

const asNonEmptyString = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

/**
 * `ValidationError`s carry one message per offending field under
 * `error.details.errors`; the top-level message for those is an unhelpful
 * "2 errors occurred". Collect the per-field list so it can be appended.
 */
const readValidationDetails = (
  error: Record<string, unknown>
): string | null => {
  const details = asRecord(error.details);
  const errors = details?.errors;
  if (!Array.isArray(errors)) return null;

  const messages = (errors as StrapiValidationDetail[])
    .map((entry) => asNonEmptyString(asRecord(entry)?.message))
    .filter((message): message is string => message !== null);

  return messages.length > 0 ? messages.join("; ") : null;
};

/**
 * @param body the parsed response body carried on the HttpError (`error.body`)
 * @returns the message to show the user, or null to leave the error untouched
 */
export const extractStrapiErrorMessage = (body: unknown): string | null => {
  const payload = asRecord(body);
  if (!payload) return null;

  const error = asRecord(payload.error);
  const message = asNonEmptyString(error?.message) ?? asNonEmptyString(payload.message);
  const details = error ? readValidationDetails(error) : null;

  if (message && details && !message.includes(details)) {
    return `${message}: ${details}`;
  }

  return message ?? details;
};

export default extractStrapiErrorMessage;
