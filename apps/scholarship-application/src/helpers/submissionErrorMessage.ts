/**
 * Pull a user-facing message out of a failed `POST /submissions/*` response.
 *
 * Strapi's `ctx.badRequest(message)` answers `{ data: null, error: { status,
 * name, message, details } }`; the controller's own catch block answers
 * `{ message: "error", error: "<string>" }`; older 400s answer `{ message }`.
 * Never return an object — the toast renders this as text.
 */
export const submissionErrorMessage = (
  response: unknown,
  fallback: string
): string => {
  if (!response || typeof response !== "object") return fallback;
  const body = response as {
    error?: unknown;
    message?: unknown;
  };

  if (body.error && typeof body.error === "object") {
    const message = (body.error as { message?: unknown }).message;
    if (typeof message === "string" && message.trim()) return message;
  }
  if (typeof body.error === "string" && body.error.trim()) return body.error;
  if (
    typeof body.message === "string" &&
    body.message.trim() &&
    body.message !== "success" &&
    body.message !== "error"
  ) {
    return body.message;
  }
  return fallback;
};
