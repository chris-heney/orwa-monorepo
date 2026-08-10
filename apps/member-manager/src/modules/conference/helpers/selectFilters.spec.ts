import { describe, expect, it } from "vitest";
import { isSelected, toggleFilter } from "./selectFilters";

describe("toggleFilter multi-select ($in / OR)", () => {
  it("promotes a scalar ticket filter to an array when selecting a second ticket", () => {
    const afterFirst = toggleFilter(
      { conference_ticket: 10 },
      { conference: 3 }
    );
    expect(afterFirst).toEqual({ conference: 3, conference_ticket: 10 });

    const afterSecond = toggleFilter(
      { conference_ticket: 11 },
      afterFirst
    );
    expect(afterSecond).toEqual({
      conference: 3,
      conference_ticket: [10, 11],
    });
  });

  it("keeps both tickets selected and allows toggling one off", () => {
    const filters = { conference_ticket: [10, 11] };
    expect(isSelected({ conference_ticket: 10 }, filters)).toBe(true);
    expect(isSelected({ conference_ticket: 11 }, filters)).toBe(true);

    const after = toggleFilter({ conference_ticket: 10 }, filters);
    expect(after).toEqual({ conference_ticket: 11 });
    expect(isSelected({ conference_ticket: 10 }, after)).toBe(false);
    expect(isSelected({ conference_ticket: 11 }, after)).toBe(true);
  });

  it("treats numeric and string ids as equal", () => {
    const filters = { conference_ticket: "10" };
    expect(isSelected({ conference_ticket: 10 }, filters)).toBe(true);
    const after = toggleFilter({ conference_ticket: 11 }, filters);
    expect(after.conference_ticket).toEqual(["10", 11]);
  });
});
