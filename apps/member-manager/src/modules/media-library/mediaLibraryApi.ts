import CookieStore from "../../helpers/ra-strapi-data-provider/src/CookieStore";

const VITE_API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
const VITE_API_KEY = import.meta.env.VITE_API_KEY;

function authHeaders(): HeadersInit {
  const token = CookieStore.getCookie("token");
  if (token) return { Authorization: `Bearer ${token}` };
  if (VITE_API_KEY) return { Authorization: `Bearer ${VITE_API_KEY}` };
  return {};
}

export type MediaLibraryFileRow = {
  id: number;
  name: string;
  url: string;
  mime: string;
  createdAt: string;
};

function mapRows(data: unknown): MediaLibraryFileRow[] {
  const raw =
    data &&
    typeof data === "object" &&
    "data" in data &&
    Array.isArray((data as { data: unknown }).data)
      ? (data as { data: Record<string, unknown>[] }).data
      : Array.isArray(data)
        ? (data as Record<string, unknown>[])
        : [];
  return raw.map((item: Record<string, unknown>) => {
    const attrs = item.attributes as Record<string, string> | undefined;
    if (attrs) {
      return {
        id: Number(item.id),
        name: attrs.name,
        url: attrs.url,
        mime: attrs.mime,
        createdAt: attrs.createdAt,
      };
    }
    return item as unknown as MediaLibraryFileRow;
  });
}

/**
 * Load all upload files in the browser: merge offset requests when the API honors
 * pagination, or use a single payload when it returns the full list every time.
 */
export async function fetchAllMediaFiles(): Promise<MediaLibraryFileRow[]> {
  const BATCH = 250;
  let start = 0;
  const merged: MediaLibraryFileRow[] = [];
  const seen = new Set<number>();

  for (;;) {
    const params = new URLSearchParams({
      "pagination[start]": String(start),
      "pagination[limit]": String(BATCH),
      sort: "createdAt:desc",
    });
    const httpResponse = await fetch(
      `${VITE_API_ENDPOINT}/api/upload/files?${params.toString()}`,
      {
        method: "GET",
        headers: {
          ...authHeaders(),
          Accept: "application/json",
        },
      }
    );
    if (!httpResponse.ok) {
      throw new Error(`HTTP Error: ${httpResponse.status}`);
    }
    const json = (await httpResponse.json()) as Record<string, unknown>;
    const rows = mapRows(json);

    if (rows.length === 0) break;

    if (start === 0 && rows.length > BATCH) {
      return rows;
    }

    for (const r of rows) {
      if (!seen.has(r.id)) {
        seen.add(r.id);
        merged.push(r);
      }
    }

    if (rows.length < BATCH) break;
    start += BATCH;
    if (merged.length > 100_000) break;
  }

  return merged;
}
