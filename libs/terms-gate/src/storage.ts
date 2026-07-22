import type { AcceptedTerm } from './types';

const STORAGE_PREFIX = 'orwa.terms-gate.accepted:';

export function readAcceptance(slug: string): AcceptedTerm | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${slug}`);
    if (!raw) return null;
    return JSON.parse(raw) as AcceptedTerm;
  } catch {
    return null;
  }
}

export function writeAcceptance(term: AcceptedTerm): void {
  localStorage.setItem(`${STORAGE_PREFIX}${term.slug}`, JSON.stringify(term));
}

export function isAcceptedForVersion(slug: string, updatedAt: string): boolean {
  const existing = readAcceptance(slug);
  return !!existing && existing.updatedAt === updatedAt;
}

/** All locally accepted terms (for registration audit payload). */
export function getAcceptedTerms(): AcceptedTerm[] {
  const out: AcceptedTerm[] = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(STORAGE_PREFIX)) continue;
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      out.push(JSON.parse(raw) as AcceptedTerm);
    }
  } catch {
    /* ignore */
  }
  return out;
}
