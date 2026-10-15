import { describe, expect, it } from "vitest";
import {
  formatSubmittedDate,
  nominationExportRows,
} from "./exportNominations";
import {
  LEGACY_AWARD_COLUMN_IDS,
  DEFAULT_AWARD_COLUMN_IDS,
  nextAwardColumnIds,
} from "./recordDisplay";

describe("formatSubmittedDate", () => {
  it("renders the ISO instant as the local calendar date", () => {
    const iso = "2026-08-19T16:49:29.697Z";
    expect(formatSubmittedDate(iso, "en-US")).toBe(
      new Date(iso).toLocaleDateString("en-US")
    );
  });

  it("passes blanks and garbage through", () => {
    expect(formatSubmittedDate(null)).toBe("");
    expect(formatSubmittedDate("")).toBe("");
    expect(formatSubmittedDate("not a date")).toBe("not a date");
  });
});

describe("nominationExportRows", () => {
  it("formats submission_date and leaves other fields alone", () => {
    const iso = "2026-08-26T19:52:44.716Z";
    const rows = nominationExportRows(
      [
        { id: "a", nominee_name: "Jane", submission_date: iso },
        { id: "b", nominee_name: "No date" },
      ],
      "en-US"
    );
    expect(rows[0]).toEqual({
      id: "a",
      nominee_name: "Jane",
      submission_date: new Date(iso).toLocaleDateString("en-US"),
    });
    expect(rows[1]).toEqual({ id: "b", nominee_name: "No date" });
  });
});

describe("nextAwardColumnIds", () => {
  it("seeds the default when nothing is saved", () => {
    expect(nextAwardColumnIds(undefined)).toEqual(DEFAULT_AWARD_COLUMN_IDS);
    expect(nextAwardColumnIds(null)).toEqual(DEFAULT_AWARD_COLUMN_IDS);
  });

  it("upgrades a user still on the legacy default (adds Status + Submitted)", () => {
    expect(nextAwardColumnIds([...LEGACY_AWARD_COLUMN_IDS])).toEqual(
      DEFAULT_AWARD_COLUMN_IDS
    );
    expect(DEFAULT_AWARD_COLUMN_IDS).toContain("8");
  });

  it("never touches a customised selection", () => {
    expect(nextAwardColumnIds(["1", "2", "8"])).toBeNull();
    expect(nextAwardColumnIds(DEFAULT_AWARD_COLUMN_IDS)).toBeNull();
  });
});
