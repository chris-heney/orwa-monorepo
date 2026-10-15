import { useLayoutEffect } from "react";
import { useStore } from "react-admin";
import { AWARD_COLUMNS_PREF_KEY, nextAwardColumnIds } from "./recordDisplay";

/**
 * Compact default: ID, Nominee, Email, System, Name as printed, Award, Year,
 * Status, Submitted. Applied when nothing is saved yet, and once more for
 * users still on the pre-Submitted default (see `nextAwardColumnIds`).
 */
export const useAwardColumnDefaults = () => {
  const [columnIds, setColumnIds] = useStore<string[] | undefined>(
    AWARD_COLUMNS_PREF_KEY,
    undefined
  );

  useLayoutEffect(() => {
    const next = nextAwardColumnIds(columnIds);
    if (next) setColumnIds(next);
  }, [columnIds, setColumnIds]);
};
