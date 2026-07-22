import type { TermDocument } from './types';

const BUCKET_GLOBAL = 0;
const BUCKET_ALL_CONFERENCES = 1;
const BUCKET_OTHER = 2;

function bucketFor(term: TermDocument): number {
  const ids = term.identifiers ?? [];
  if (ids.includes('Global')) return BUCKET_GLOBAL;
  if (ids.includes('All Conferences')) return BUCKET_ALL_CONFERENCES;
  return BUCKET_OTHER;
}

export function neededIdentifiers(
  terms: string[] | undefined,
  global: boolean
): string[] {
  const needed = new Set<string>();
  if (global) needed.add('Global');
  for (const t of terms ?? []) {
    if (t) needed.add(t);
  }
  return [...needed];
}

export function filterAndSortTerms(
  all: TermDocument[],
  needed: string[]
): TermDocument[] {
  if (needed.length === 0) return [];

  const neededSet = new Set(needed);
  const matched = all.filter((term) => {
    const ids = Array.isArray(term.identifiers) ? term.identifiers : [];
    return ids.some((id) => neededSet.has(id));
  });

  return matched.sort((a, b) => {
    const bucketDiff = bucketFor(a) - bucketFor(b);
    if (bucketDiff !== 0) return bucketDiff;
    return String(a.updatedAt).localeCompare(String(b.updatedAt));
  });
}
