export type ContestantStatus = "active" | "cancelled";
export type ContestantAction = "cancel" | "restore";

const CONTESTANT_ACTION_PERMISSION_UIDS: Record<ContestantAction, string> = {
  cancel: "api::conference-contestant.conference-contestant.cancel",
  restore: "api::conference-contestant.conference-contestant.restore",
};

export const isCancelledContestant = (record: {
  status?: string | null;
}): boolean => record.status === "cancelled";

export const canEditContestant = (record: {
  status?: string | null;
}): boolean => !isCancelledContestant(record);

export const contestantActionPermissionUid = (
  action: ContestantAction
): string => CONTESTANT_ACTION_PERMISSION_UIDS[action];

export const activeContestantFilter = (
  showCancelled: boolean
): Record<string, string> => (showCancelled ? {} : { status: "active" });
