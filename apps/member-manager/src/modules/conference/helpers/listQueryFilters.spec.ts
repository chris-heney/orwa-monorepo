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

  it("defaults conference contestants to not-cancelled so legacy null rows stay visible", () => {
    expect(
      normalizeFiltersForListQuery(
        "conference-contestants",
        { conference: 3, year: 2026 },
        "contestants"
      )
    ).toEqual({ conference: 3, year: 2026, status: { $ne: "cancelled" } });
  });

  it("keeps an explicit cancelled status", () => {
    expect(
      normalizeFiltersForListQuery(
        "conference-contestants",
        { conference: 3, year: 2026, status: "cancelled" },
        "contestants"
      )
    ).toEqual({ conference: 3, year: 2026, status: "cancelled" });
  });

  it("omits contestant status when all is selected", () => {
    expect(
      normalizeFiltersForListQuery(
        "conference-contestants",
        { conference: 3, year: 2026, status: "all" },
        "contestants"
      )
    ).toEqual({ conference: 3, year: 2026 });
  });
});
