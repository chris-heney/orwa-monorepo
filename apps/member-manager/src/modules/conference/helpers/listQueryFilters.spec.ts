import { describe, expect, it } from "vitest";
import { normalizeFiltersForListQuery } from "./listQueryFilters";
import { ensureConferenceInFilters } from "./mergeConferenceAcrossTabFilters";

describe("ensureConferenceInFilters", () => {
  it("rewrites stale conferences[] to conference for sponsorships", () => {
    expect(
      ensureConferenceInFilters({ conferences: [1], year: 2026 }, "sponsorships")
    ).toEqual({ conference: 1, year: 2026 });
  });

  it("rewrites conference to conferences[] for tickets", () => {
    expect(
      ensureConferenceInFilters({ conference: 1 }, "tickets")
    ).toEqual({ conferences: [1] });
  });
});

describe("normalizeFiltersForListQuery", () => {
  it("strips year and plural key for conference-sponsorships", () => {
    expect(
      normalizeFiltersForListQuery(
        "conference-sponsorships",
        { conferences: [1], year: 2026 },
        "sponsorships"
      )
    ).toEqual({ conference: 1 });
  });

  it("keeps conferences[] for tickets", () => {
    expect(
      normalizeFiltersForListQuery(
        "conference-tickets",
        { conference: 1, year: 2026 },
        "tickets"
      )
    ).toEqual({ conferences: [1] });
  });
});
