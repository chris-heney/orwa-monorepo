import { useLayoutEffect } from "react";
import { useStore } from "react-admin";
import {
  AWARD_COLUMNS_PREF_KEY,
  DEFAULT_AWARD_COLUMN_IDS,
} from "./recordDisplay";

/** Compact default: Nominee, Email, System, Award, Year, Status, County. */
export const useAwardColumnDefaults = () => {
  const [columnIds, setColumnIds] = useStore<string[] | undefined>(
    AWARD_COLUMNS_PREF_KEY,
    undefined
  );

  useLayoutEffect(() => {
    if (columnIds === undefined) {
      setColumnIds(DEFAULT_AWARD_COLUMN_IDS);
    }
  }, [columnIds, setColumnIds]);
};
