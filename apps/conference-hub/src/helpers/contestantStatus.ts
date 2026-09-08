type ContestantStatusRecord = {
  status?: string | null;
};

export const activeContestants = <T extends ContestantStatusRecord>(
  records: Array<T | null | undefined> = []
) => records.filter((record): record is T => record != null && record.status !== "cancelled");
