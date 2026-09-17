import CookieStore from "../../../helpers/ra-strapi-data-provider/src/CookieStore";
import { extractStrapiErrorMessage } from "../../../helpers/ra-strapi-data-provider/src/strapiErrorMessage";
import { getImpersonateRoleHeader } from "../../rbac-manager/rolePreview";

/**
 * The Naylor directory file for water systems is produced by Strapi
 * (`GET /api/watersystems/naylor-export`: query → rows → CSV). This app only
 * downloads it.
 *
 * That is deliberate. The file is a contract with the directory publisher, and
 * while it was assembled here it kept picking up the user's view: hiding a
 * grid column blanked that column in the published file (2026-09-17). There is
 * no column list, filter, sort, page size or data-provider call on this side
 * any more — nothing in the browser can change what the file contains.
 */
export const NAYLOR_WATERSYSTEMS_PATH = "/api/watersystems/naylor-export";

/** `attachment; filename="Watersystems-Naylor-2026-09-17.csv"` → the file name. */
export const fileNameFromContentDisposition = (
  header: string | null | undefined
): string | null => {
  if (!header) return null;
  const encoded = header.match(/filename\*\s*=\s*(?:UTF-8'')?([^;]+)/i);
  if (encoded) {
    try {
      return decodeURIComponent(encoded[1].trim().replace(/^"|"$/g, ""));
    } catch {
      // fall through to the plain form
    }
  }
  const plain = header.match(/filename\s*=\s*("([^"]*)"|[^;]+)/i);
  const name = (plain?.[2] ?? plain?.[1] ?? "").trim();
  return name !== "" ? name : null;
};

const saveBlob = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

/**
 * Download the server-built Naylor file. Rejects with the API's own message
 * (403 when the role lacks the export permission, etc.) so the caller can show
 * it.
 */
export const downloadNaylorWaterSystems = async (): Promise<void> => {
  const headers: Record<string, string> = { Accept: "text/csv" };
  const token = CookieStore.getCookie("token");
  if (token) headers.Authorization = `Bearer ${token}`;
  const impersonateRoleId = getImpersonateRoleHeader();
  if (impersonateRoleId) headers["X-Impersonate-Role"] = impersonateRoleId;

  const response = await fetch(
    `${import.meta.env.VITE_API_ENDPOINT}${NAYLOR_WATERSYSTEMS_PATH}`,
    { headers, cache: "no-store" }
  );

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(
      extractStrapiErrorMessage(body) ??
        `the server answered ${response.status}`
    );
  }

  const fileName =
    fileNameFromContentDisposition(
      response.headers.get("Content-Disposition")
    ) ?? `Watersystems-Naylor-${new Date().toISOString().slice(0, 10)}.csv`;

  saveBlob(await response.blob(), fileName);
};

export default downloadNaylorWaterSystems;
