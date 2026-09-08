import { describe, expect, it } from "vitest";
import {
  activeContestantFilter,
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
});
