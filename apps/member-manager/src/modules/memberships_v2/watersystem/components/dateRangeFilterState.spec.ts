import { describe, expect, it } from "vitest";
import {
  getActiveDateField,
  getDateRange,
  withDateRange,
  withoutDateFields,
} from "./dateRangeFilterState";

const FIELDS = [
  "payment_last_date",
  "application_date",
  "directory_sent_date",
  "payment_previous_date",
];

/** The rest of the Water Systems drawer, which the Date toggle must not disturb. */
const otherFilters = {
  region: "Region 1",
  contacts: { title: { $in: ["Manager"] } },
  funding: true,
};

describe("getActiveDateField", () => {
  it("finds the field carrying a $between", () => {
    expect(
      getActiveDateField(FIELDS, {
        ...otherFilters,
        application_date: { $between: ["2026-01-01", "2026-06-30"] },
      })
    ).toBe("application_date");
  });

  it("is undefined when no date field is filtered", () => {
    expect(getActiveDateField(FIELDS, otherFilters)).toBeUndefined();
    expect(getActiveDateField(FIELDS, {})).toBeUndefined();
    expect(getActiveDateField(FIELDS, undefined)).toBeUndefined();
  });

  // Member Status › "Expiring in 1 month" writes a top-level payment_last_date
  // $between. Reporting that as active is correct: the range really is applied.
  it("reports a range written by another filter control", () => {
    expect(
      getActiveDateField(FIELDS, {
        payment_last_date: { $between: ["2025-09-10", "2025-10-10"] },
      })
    ).toBe("payment_last_date");
  });

  // A $gte/$notNull on the same field is the Member/Non Member filter, not a range.
  it("ignores non-range operators on a date field", () => {
    expect(
      getActiveDateField(FIELDS, {
        payment_last_date: { $gte: "2025-09-10" },
      })
    ).toBeUndefined();
  });
});

describe("getDateRange", () => {
  it("reads back the applied range", () => {
    expect(
      getDateRange("application_date", {
        application_date: { $between: ["2026-01-01", "2026-06-30"] },
      })
    ).toEqual({ start: "2026-01-01", end: "2026-06-30" });
  });

  it("is undefined for no field, no filter, or a malformed range", () => {
    expect(getDateRange(undefined, {})).toBeUndefined();
    expect(getDateRange("application_date", otherFilters)).toBeUndefined();
    expect(
      getDateRange("application_date", { application_date: { $between: [1, 2] } })
    ).toBeUndefined();
  });
});

describe("withoutDateFields", () => {
  it("drops every date key and keeps the rest of the drawer", () => {
    expect(
      withoutDateFields(FIELDS, {
        ...otherFilters,
        payment_last_date: { $between: ["2026-01-01", "2026-06-30"] },
      })
    ).toEqual(otherFilters);
  });

  it("does not mutate the filters it is given", () => {
    const filters = {
      ...otherFilters,
      application_date: { $between: ["2026-01-01", "2026-06-30"] },
    };
    withoutDateFields(FIELDS, filters);
    expect(filters.application_date).toBeDefined();
  });

  it("is a no-op when nothing is applied", () => {
    expect(withoutDateFields(FIELDS, otherFilters)).toEqual(otherFilters);
    expect(withoutDateFields(FIELDS, undefined)).toEqual({});
  });
});

describe("withDateRange", () => {
  it("applies a range alongside the drawer's other filters", () => {
    expect(
      withDateRange(
        FIELDS,
        otherFilters,
        "application_date",
        "2026-01-01",
        "2026-06-30"
      )
    ).toEqual({
      ...otherFilters,
      application_date: { $between: ["2026-01-01", "2026-06-30"] },
    });
  });

  // Switching the field must move the range, not AND a second one onto the query.
  it("clears a range on a sibling field when the field changes", () => {
    const applied = withDateRange(
      FIELDS,
      otherFilters,
      "payment_last_date",
      "2026-01-01",
      "2026-06-30"
    );
    const moved = withDateRange(
      FIELDS,
      applied,
      "application_date",
      "2026-02-01",
      "2026-07-31"
    );

    expect(moved.payment_last_date).toBeUndefined();
    expect(moved.application_date).toEqual({
      $between: ["2026-02-01", "2026-07-31"],
    });
    expect(moved.region).toBe("Region 1");
  });

  it("round-trips through the readers", () => {
    const applied = withDateRange(
      FIELDS,
      otherFilters,
      "directory_sent_date",
      "2026-03-01",
      "2026-03-31"
    );
    const field = getActiveDateField(FIELDS, applied);

    expect(field).toBe("directory_sent_date");
    expect(getDateRange(field, applied)).toEqual({
      start: "2026-03-01",
      end: "2026-03-31",
    });
    expect(withoutDateFields(FIELDS, applied)).toEqual(otherFilters);
  });
});
