import { describe, expect, it } from "vitest";

import { contestantCreateDefaults } from "./contestantFormDefaults";

describe("contestantFormDefaults", () => {
  it("uses scalar conference and year defaults for Add Contestant", () => {
    expect(contestantCreateDefaults({ conference: 3, year: 2026 })).toEqual({
      conference: 3,
      year: 2026,
    });
  });

  it("omits unavailable defaults instead of sending nested placeholder objects", () => {
    expect(contestantCreateDefaults({})).toEqual({});
  });
});
