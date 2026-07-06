import CookieStore from "../../helpers/ra-strapi-data-provider/src/CookieStore";

const VITE_API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
const VITE_API_KEY = import.meta.env.VITE_API_KEY;

/** Prefer logged-in admin JWT; fall back to API token (e.g. local tools). */
const authHeaders = (): HeadersInit => {
    const token = CookieStore.getCookie("token");
    if (token) return { Authorization: `Bearer ${token}` };
    if (VITE_API_KEY) return { Authorization: `Bearer ${VITE_API_KEY}` };
    return {};
};

export type UploadFileRow = {
    id: number;
    name: string;
    url: string;
    mime: string;
    createdAt: string;
};

function mapUploadApiRows(data: unknown): UploadFileRow[] {
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
        return item as unknown as UploadFileRow;
    });
}

const uploadService = {

    uploadFile: async (file: File, raw?: true) => {
        const data = new FormData();
        data.append("files", file);
        return fetch(`${VITE_API_ENDPOINT}/api/upload`, {
            method: "POST",
            body: data,
            headers: {
                ...authHeaders(),
            },
        })
            .then((httpResponse) => {
                if (!httpResponse.ok) {
                    throw new Error(`HTTP Error: ${httpResponse.status}`);
                }
                return httpResponse.json();
            })
            .then((data) => {
                if (!data || !Array.isArray(data) || data.length === 0) {
                    throw new Error('Invalid response format from upload API');
                }
                return raw ? data[0] : data[0].id;
            })
            .catch((error) => {
                console.error("Error uploading file:", error);
                throw error;
            });
    },
    uploadFiles: async (files: File[]) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append("files", file);
        });
        return fetch(`${VITE_API_ENDPOINT}/api/upload`, {
            method: "POST",
            body: formData,
            headers: {
                ...authHeaders(),
            },
        })
            .then((httpResponse) => {
                if (!httpResponse.ok) {
                    throw new Error(`HTTP Error: ${httpResponse.status}`);
                }
                return httpResponse.json();
            })
            .then((data) => {
                if (!data || !Array.isArray(data) || data.length === 0) {
                    throw new Error('Invalid response format from upload API');
                }
                return data.map(file => file.id);
            })
            .catch((error) => {
                console.error("Error uploading files:", error);
                throw error;
            });
    },
    getFile: async (id: number) => {
        return fetch(`${VITE_API_ENDPOINT}/api/upload/files/${id}`, {
            method: "GET",
            headers: {
                ...authHeaders(),
                Accept: "application/json",
            },
        })
            .then((httpResponse) => httpResponse.json())
            .then((data) => data);
    },
    /**
     * Single request, capped — used by pickers/dialogs that only need a subset.
     */
    getAllFiles: async () => {
        return fetch(`${VITE_API_ENDPOINT}/api/upload/files?pagination[limit]=1000&sort=createdAt:desc`, {
            method: "GET",
            headers: {
                ...authHeaders(),
                Accept: "application/json",
            },
        })
            .then((httpResponse) => {
                if (!httpResponse.ok) {
                    throw new Error(`HTTP Error: ${httpResponse.status}`);
                }
                return httpResponse.json();
            })
            .then((data) => mapUploadApiRows(data))
            .catch((error) => {
                console.error("Error fetching files:", error);
                throw error;
            });
    },
};

export default uploadService;
