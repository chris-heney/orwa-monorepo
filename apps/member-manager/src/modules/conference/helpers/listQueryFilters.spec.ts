import { describe, expect, it } from "vitest";
import {
  applyContestantStatusFilter,
  contestantStatusFromFilters,
  normalizeFiltersForListQuery,
} from "./listQueryFilters";
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
    ).toEqual({
      conference: 3,
      year: 2026,
      $or: [{ status: { $eq: "active" } }, { status: { $null: true } }],
    });
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

describe("contestant status view control", () => {
  // What the list actually starts with: `normalizeFiltersForListQuery` output
  // seeded into react-admin `filterValues`.
  const listDefaults = normalizeFiltersForListQuery(
    "conference-contestants",
    { conference: 3, year: 2026 },
    "contestants"
  );

  it("reports the default list filters as the active view", () => {
    expect(contestantStatusFromFilters(listDefaults)).toBe("active");
  });

  it("reads back every view it writes", () => {
    for (const status of ["active", "cancelled", "all"] as const) {
      expect(
        contestantStatusFromFilters(
          applyContestantStatusFilter(listDefaults, status)
        )
      ).toBe(status);
    }
  });

  it("replaces the default active clause instead of ANDing cancelled onto it", () => {
    const cancelled = applyContestantStatusFilter(listDefaults, "cancelled");

    expect(cancelled).toEqual({
      conference: 3,
      year: 2026,
      status: "cancelled",
    });
    expect(cancelled.$or).toBeUndefined();
  });

  it("clears the status constraint entirely for the all view", () => {
    expect(applyContestantStatusFilter(listDefaults, "all")).toEqual({
      conference: 3,
      year: 2026,
    });
  });

  it("restores the active clause when switching back from cancelled", () => {
    const cancelled = applyContestantStatusFilter(listDefaults, "cancelled");

    expect(applyContestantStatusFilter(cancelled, "active")).toEqual(
      listDefaults
    );
  });

  it("never stacks status constraints across repeated toggling", () => {
    const filters = (["cancelled", "all", "active", "cancelled"] as const).reduce<
      Record<string, any>
    >(
      (acc, status) => applyContestantStatusFilter(acc, status),
      listDefaults
    );

    expect(filters).toEqual({ conference: 3, year: 2026, status: "cancelled" });
  });

  it("preserves unrelated $or branches such as a search clause", () => {
    const searched = {
      conference: 3,
      $or: [{ first_name: { $contains: "ann" } }],
    };

    expect(applyContestantStatusFilter(searched, "cancelled")).toEqual({
      conference: 3,
      status: "cancelled",
      $or: [{ first_name: { $contains: "ann" } }],
    });
  });
});
