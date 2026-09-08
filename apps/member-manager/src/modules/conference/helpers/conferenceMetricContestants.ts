import { partitionContestants } from "./partitionContestants";

export const buildContestantMetricsFilter = (
  scope: Record<string, unknown>
): Record<string, unknown> => ({ ...scope });

export const activeMetricContestants = <
  T extends { status?: string | null }
>(
  records: T[] | null | undefined
): T[] => partitionContestants(records ?? []).active;
