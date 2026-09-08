import { isCancelledContestant } from "./contestantStatus";

export function partitionContestants<T extends { status?: string | null }>(
  records: T[] | null | undefined
): { active: T[]; cancelled: T[] } {
  const active: T[] = [];
  const cancelled: T[] = [];

  for (const record of records ?? []) {
    if (isCancelledContestant(record)) {
      cancelled.push(record);
    } else {
      active.push(record);
    }
  }

  return { active, cancelled };
}
