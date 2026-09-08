export type ContestantStatus = "active" | "cancelled";

export const isCancelledContestant = (record: {
  status?: string | null;
}): boolean => record.status === "cancelled";

export const activeContestantFilter = (
  showCancelled: boolean
): Record<string, string> => (showCancelled ? {} : { status: "active" });
