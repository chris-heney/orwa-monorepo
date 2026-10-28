import CookieStore from "../../../../helpers/ra-strapi-data-provider/src/CookieStore";
import { extractStrapiErrorMessage } from "../../../../helpers/ra-strapi-data-provider/src/strapiErrorMessage";
import { getImpersonateRoleHeader } from "../../../rbac-manager/rolePreview";

/**
 * Grant Manager override for the stored applicant PDF. Strapi re-renders the
 * PDF from the current record and overwrites the existing media file in place
 * (same id and URL), regardless of status. Saves in New Application /
 * Awaiting Committee already do this automatically; this is for everything
 * else and for retries.
 */
export const regenerateApplicantPdfPath = (documentId: string) =>
  `/api/grant-application/${encodeURIComponent(documentId)}/regenerate-pdf`;

export interface RegeneratedApplicantPdf {
  id: number;
  url: string;
  name: string;
  updatedAt?: string;
}

export const regenerateApplicantPdf = async (
  documentId: string
): Promise<RegeneratedApplicantPdf> => {
  const headers: Record<string, string> = { Accept: "application/json" };
  const token = CookieStore.getCookie("token");
  if (token) headers.Authorization = `Bearer ${token}`;
  const impersonateRoleId = getImpersonateRoleHeader();
  if (impersonateRoleId) headers["X-Impersonate-Role"] = impersonateRoleId;

  const response = await fetch(
    `${import.meta.env.VITE_API_ENDPOINT}${regenerateApplicantPdfPath(documentId)}`,
    { method: "POST", headers, cache: "no-store" }
  );

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      extractStrapiErrorMessage(body) ??
        body?.error ??
        `the server answered ${response.status}`
    );
  }
  return body.file as RegeneratedApplicantPdf;
};

/**
 * `replace()` keeps the URL stable, so a browser that already viewed the PDF
 * would show the cached bytes. Key the link on the file's updatedAt.
 */
export const applicantPdfViewUrl = (file: { url: string; updatedAt?: string }) => {
  const base = `${import.meta.env.VITE_API_ENDPOINT}${file.url}`;
  return file.updatedAt ? `${base}?v=${encodeURIComponent(file.updatedAt)}` : base;
};
