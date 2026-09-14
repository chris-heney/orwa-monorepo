/**
 * Attachment handling for POST /mailer/send-email.
 *
 * A template's own attachments (uploaded in the email template manager) must
 * always go out. Attachments posted by the caller — e.g. the generated RIG
 * Agreement PDF for the "Grant Award Letter" — are added to them, never
 * substituted for them.
 */

export interface MailAttachment {
  name: string;
  url: string;
}

interface UploadFile {
  name?: string;
  url?: string;
}

/**
 * Public origin that serves /uploads. STRAPI_API_ENDPOINT ends in /api, and
 * /api/uploads/... is a 404, so it can only be used with that suffix removed.
 */
export const uploadsBaseUrl = (env: NodeJS.ProcessEnv = process.env): string => {
  const base =
    env.PUBLIC_URL ||
    env.URL ||
    (env.STRAPI_API_ENDPOINT ?? "").replace(/\/api\/?$/, "") ||
    "https://admin.orwa.org";
  return base.replace(/\/+$/, "");
};

/** Template uploads as Brevo attachments, with absolute, fetchable URLs. */
export const templateAttachments = (
  files: UploadFile[] | null | undefined,
  baseUrl: string
): MailAttachment[] =>
  (files ?? [])
    .filter((file): file is Required<UploadFile> => Boolean(file?.url))
    .map((file) => ({
      name: file.name || file.url.split("/").pop() || "attachment",
      url: /^https?:\/\//i.test(file.url) ? file.url : `${baseUrl}${file.url}`,
    }));

/**
 * Template attachments first, then the caller's; the same URL is attached
 * once. Returns undefined when there is nothing to attach, because Brevo
 * rejects an empty attachment list.
 */
export const mergeAttachments = (
  fromTemplate: MailAttachment[],
  fromRequest: MailAttachment[] | null | undefined
): MailAttachment[] | undefined => {
  const seen = new Set<string>();
  const merged = [...fromTemplate, ...(fromRequest ?? [])].filter((attachment) => {
    if (!attachment?.url || seen.has(attachment.url)) return false;
    seen.add(attachment.url);
    return true;
  });
  return merged.length > 0 ? merged : undefined;
};
