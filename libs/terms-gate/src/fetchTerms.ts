import type { TermDocument } from './types';

function normalizeTerm(raw: Record<string, unknown>): TermDocument {
  const identifiers = raw.identifiers;
  return {
    id: (raw.id as number | string) ?? '',
    documentId: raw.documentId as string | undefined,
    title: String(raw.title ?? ''),
    slug: String(raw.slug ?? ''),
    identifiers: Array.isArray(identifiers)
      ? identifiers.map(String)
      : [],
    content: String(raw.content ?? ''),
    updatedAt: String(raw.updatedAt ?? raw.updated_at ?? ''),
  };
}

function requestTerms(base: string, apiKey?: string): Promise<Response> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  return fetch(
    `${base}/terms?pagination[pageSize]=100&sort=updatedAt:asc`,
    { headers }
  );
}

export async function fetchTerms(
  apiEndpoint: string,
  apiKey?: string
): Promise<TermDocument[]> {
  const base = apiEndpoint.replace(/\/$/, '');
  let res = await requestTerms(base, apiKey);

  // An invalid/deleted API token 401s even when Public can GET /terms.
  if (!res.ok && apiKey && (res.status === 401 || res.status === 403)) {
    res = await requestTerms(base);
  }

  if (!res.ok) {
    throw new Error(`Failed to load terms (${res.status})`);
  }

  const json = (await res.json()) as { data?: Record<string, unknown>[] };
  const rows = Array.isArray(json.data) ? json.data : [];
  return rows.map(normalizeTerm).filter((t) => t.slug && t.title);
}
