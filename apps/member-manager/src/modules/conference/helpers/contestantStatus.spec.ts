import { describe, expect, it } from "vitest";
import {
  activeContestantFilter,
  canEditContestant,
  contestantActionPermissionUid,
  isCancelledContestant,
} from "./contestantStatus";

describe("contestantStatus", () => {
  it("treats legacy records without status as active", () => {
    expect(isCancelledContestant({})).toBe(false);
  });

  it("recognizes cancelled records", () => {
    expect(isCancelledContestant({ status: "cancelled" })).toBe(true);
  });

  it("filters the normal view to active records", () => {
    expect(activeContestantFilter(false)).toEqual({ status: "active" });
    expect(activeContestantFilter(true)).toEqual({});
  });

  it("marks cancelled contestants read-only while active contestants remain editable", () => {
    expect(canEditContestant({ status: "active" })).toBe(true);
    expect(canEditContestant({ status: "cancelled" })).toBe(false);
    expect(canEditContestant({})).toBe(true);
  });

  it("uses real Strapi custom action UIDs for contestant cancel and restore", () => {
    expect(contestantActionPermissionUid("cancel")).toBe(
      "api::conference-contestant.conference-contestant.cancel"
    );
    expect(contestantActionPermissionUid("restore")).toBe(
      "api::conference-contestant.conference-contestant.restore"
    );
  });
});
