/**
 * Directory contacts on a membership form submission are ADDITIVE.
 *
 * The public renewal form never shows a system's existing contacts (it cannot:
 * it is unauthenticated, and prefilling would hand anyone who picks a system
 * name that system's people). So what it submits is only "the contacts this
 * person typed today" — possibly none. The service used to write that list
 * straight onto `watersystem.contacts`, which REPLACES the relation:
 *
 *   - a renewal with no contact rows detached every contact the system had
 *     (3 systems lost theirs in Jul–Aug 2026; 46 of 118 submissions since the
 *     contacts step returned were empty), and
 *   - a renewal naming one person detached everyone else.
 *
 * A form submission may add people and update the ones it names (matched by
 * email upstream). It can never remove anyone — that is a staff decision, made
 * in member-manager where the existing contacts are visible.
 */

const toId = (value: unknown): number | null => {
  const id =
    typeof value === 'number'
      ? value
      : typeof value === 'string' && /^\d+$/.test(value)
        ? parseInt(value, 10)
        : value && typeof value === 'object'
          ? toId((value as { id?: unknown }).id)
          : null;
  return typeof id === 'number' && Number.isFinite(id) ? id : null;
};

/**
 * @param existing the contacts linked to the system now (ids or rows)
 * @param submitted the contact ids this submission resolved to
 * @returns the full list to store — existing first, in their order, then the
 *   new ones — or `null` when the submission adds nobody and the relation must
 *   be left untouched.
 */
export const mergeDirectoryContactIds = (
  existing: unknown[] | null | undefined,
  submitted: unknown[] | null | undefined
): number[] | null => {
  const current = (existing ?? []).map(toId).filter((id): id is number => id !== null);
  const seen = new Set(current);
  const added: number[] = [];
  for (const id of (submitted ?? []).map(toId)) {
    if (id !== null && !seen.has(id)) {
      seen.add(id);
      added.push(id);
    }
  }
  return added.length > 0 ? [...current, ...added] : null;
};
