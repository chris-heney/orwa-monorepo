import { describe, expect, it } from "vitest";
import { matchesAwardNominationSearch } from "./awardEntrySearch";

describe("matchesAwardNominationSearch", () => {
  it("does not throw when award_type or data is missing", () => {
    expect(() =>
      matchesAwardNominationSearch({ createdAt: new Date(), id: 1, resource: "award-nomination" } as any, "ops")
    ).not.toThrow();
    expect(matchesAwardNominationSearch({ data: { nominee_name: "Pat" } } as any, "pat")).toBe(true);
    expect(matchesAwardNominationSearch({ data: {} } as any, "system")).toBe(false);
    expect(matchesAwardNominationSearch(null, "x")).toBe(false);
  });

  it("matches nominee, system name, and award type", () => {
    const submission = {
      data: {
        nominee_name: "Jane Doe",
        system_name: "Ada RWD",
        award_name_printed: "Ada Rural Water",
        award_type: "Excellence in Operations",
      },
    };
    expect(matchesAwardNominationSearch(submission as any, "JANE")).toBe(true);
    expect(matchesAwardNominationSearch(submission as any, "ada rural")).toBe(true);
    expect(matchesAwardNominationSearch(submission as any, "operations")).toBe(true);
    expect(matchesAwardNominationSearch(submission as any, "golf")).toBe(false);
  });
});
