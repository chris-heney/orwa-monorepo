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

export async function fetchTerms(
  apiEndpoint: string,
  apiKey?: string
): Promise<TermDocument[]> {
  const base = apiEndpoint.replace(/\/$/, '');
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  const res = await fetch(
    `${base}/terms?pagination[pageSize]=100&sort=updatedAt:asc`,
    { headers }
  );

  if (!res.ok) {
    throw new Error(`Failed to load terms (${res.status})`);
  }

  const json = (await res.json()) as { data?: Record<string, unknown>[] };
  const rows = Array.isArray(json.data) ? json.data : [];
  return rows.map(normalizeTerm).filter((t) => t.slug && t.title);
}
