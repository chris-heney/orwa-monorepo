import { describe, expect, it } from "vitest";
import {
  applyContestantStatusFilter,
  contestantStatusFromFilters,
  expandContestantStatusForApi,
  normalizeFiltersForListQuery,
  preserveContestantStatusFilter,
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

  it("defaults conference contestants to the active view", () => {
    expect(
      normalizeFiltersForListQuery(
        "conference-contestants",
        { conference: 3, year: 2026 },
        "contestants"
      )
    ).toEqual({ conference: 3, year: 2026, status: "active" });
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

  // The sentinel has to survive normalization, because normalization output is
  // what gets written back into the store. Stripping "all" here is what made
  // the All view silently collapse back to Active.
  it("keeps the all sentinel so the view survives a normalization round trip", () => {
    const chosen = { conference: 3, year: 2026, status: "all" };

    expect(
      normalizeFiltersForListQuery("conference-contestants", chosen, "contestants")
    ).toEqual(chosen);
  });

  it("upgrades a legacy $or status clause to the active sentinel", () => {
    expect(
      normalizeFiltersForListQuery(
        "conference-contestants",
        {
          conference: 3,
          $or: [{ status: { $eq: "active" } }, { status: { $null: true } }],
        },
        "contestants"
      )
    ).toEqual({ conference: 3, status: "active" });
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

  it("records the all view as an explicit sentinel rather than an absent status", () => {
    expect(applyContestantStatusFilter(listDefaults, "all")).toEqual({
      conference: 3,
      year: 2026,
      status: "all",
    });
  });

  // The regression: All used to be encoded as "no status key", which is also
  // how a freshly seeded list looks, so the very next normalization pass read
  // it as Active and the operator's choice evaporated.
  it("survives a normalization round trip for every view", () => {
    for (const status of ["active", "cancelled", "all"] as const) {
      const chosen = applyContestantStatusFilter(listDefaults, status);
      const roundTripped = normalizeFiltersForListQuery(
        "conference-contestants",
        chosen,
        "contestants"
      );

      expect(roundTripped).toEqual(chosen);
      expect(contestantStatusFromFilters(roundTripped)).toBe(status);
    }
  });

  it("carries the chosen view across a tab round trip that rebuilds filters", () => {
    // Tab filters are shared across tabs and never carry contestant status, so
    // re-deriving list filters from them would otherwise reset the view.
    const rebuiltFromTabFilters = { conference: 3, year: 2026 };

    for (const status of ["active", "cancelled", "all"] as const) {
      const live = applyContestantStatusFilter(listDefaults, status);

      expect(
        preserveContestantStatusFilter(
          "conference-contestants",
          live,
          rebuiltFromTabFilters
        )
      ).toEqual({ conference: 3, year: 2026, status });
    }
  });

  it("leaves non-contestant resources untouched when carrying filters over", () => {
    expect(
      preserveContestantStatusFilter(
        "conference-attendees",
        { conference: 3, status: "all" },
        { conference: 3 }
      )
    ).toEqual({ conference: 3 });
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

    for (const status of ["active", "cancelled", "all"] as const) {
      expect(applyContestantStatusFilter(searched, status)).toEqual({
        conference: 3,
        status,
        $or: [{ first_name: { $contains: "ann" } }],
      });
    }
  });
});

describe("expandContestantStatusForApi", () => {
  const searchClause = { first_name: { $contains: "ann" } };

  it("drops the all sentinel so Strapi is never asked for status=all", () => {
    expect(
      expandContestantStatusForApi("conference-contestants", {
        conference: 3,
        status: "all",
      })
    ).toEqual({ conference: 3 });
  });

  it("expands the active sentinel to active-or-legacy-null", () => {
    expect(
      expandContestantStatusForApi("conference-contestants", {
        conference: 3,
        status: "active",
      })
    ).toEqual({
      conference: 3,
      $or: [{ status: { $eq: "active" } }, { status: { $null: true } }],
    });
  });

  // The conference metrics dashboard deliberately asks for every contestant and
  // splits active from cancelled itself, so defaulting to active here would
  // quietly drop cancelled fees out of the revenue breakdown.
  it("leaves a request with no status alone rather than defaulting it", () => {
    expect(
      expandContestantStatusForApi("conference-contestants", { conference: 3 })
    ).toEqual({ conference: 3 });
  });

  it("passes a legacy $or status clause straight through", () => {
    const legacy = {
      conference: 3,
      $or: [{ status: { $eq: "active" } }, { status: { $null: true } }],
    };

    expect(
      expandContestantStatusForApi("conference-contestants", legacy)
    ).toEqual(legacy);
  });

  it("sends cancelled as a plain equality", () => {
    expect(
      expandContestantStatusForApi("conference-contestants", {
        conference: 3,
        status: "cancelled",
      })
    ).toEqual({ conference: 3, status: "cancelled" });
  });

  // Two top-level $or groups cannot coexist, so the active clause has to be
  // ANDed alongside the search rather than overwriting it — overwriting would
  // quietly widen the result set past what the operator searched for.
  it("ands the active clause with an unrelated $or instead of replacing it", () => {
    expect(
      expandContestantStatusForApi("conference-contestants", {
        conference: 3,
        status: "active",
        $or: [searchClause],
      })
    ).toEqual({
      conference: 3,
      $and: [
        { $or: [searchClause] },
        { $or: [{ status: { $eq: "active" } }, { status: { $null: true } }] },
      ],
    });
  });

  it("keeps an unrelated $or intact for the cancelled and all views", () => {
    expect(
      expandContestantStatusForApi("conference-contestants", {
        conference: 3,
        status: "cancelled",
        $or: [searchClause],
      })
    ).toEqual({ conference: 3, status: "cancelled", $or: [searchClause] });

    expect(
      expandContestantStatusForApi("conference-contestants", {
        conference: 3,
        status: "all",
        $or: [searchClause],
      })
    ).toEqual({ conference: 3, $or: [searchClause] });
  });

  it("appends to an existing $and rather than dropping it", () => {
    const existing = { year: { $gte: 2020 } };

    expect(
      expandContestantStatusForApi("conference-contestants", {
        status: "active",
        $and: [existing],
        $or: [searchClause],
      })
    ).toEqual({
      $and: [
        existing,
        { $or: [searchClause] },
        { $or: [{ status: { $eq: "active" } }, { status: { $null: true } }] },
      ],
    });
  });

  it("leaves other resources exactly as they were", () => {
    const attendees = { conference: 3, status: "all" };

    expect(expandContestantStatusForApi("conference-attendees", attendees)).toEqual(
      attendees
    );
  });
});
