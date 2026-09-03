import { describe, expect, it } from "vitest";
import {
  activeMembershipWatersystemsQuery,
  rollingOneYearAgo,
} from "./activeMembershipWatersystemsQuery";

describe("rollingOneYearAgo", () => {
  it("returns YYYY-MM-DD one year before the given date", () => {
    expect(rollingOneYearAgo(new Date("2026-08-28T15:00:00"))).toBe(
      "2025-08-28"
    );
  });
});

describe("activeMembershipWatersystemsQuery", () => {
  it("matches member-manager Member Status (not-null last payment within a year)", () => {
    expect(
      activeMembershipWatersystemsQuery(
        ["id", "documentId", "name"],
        new Date("2026-08-28T15:00:00")
      )
    ).toBe(
      "?filters[payment_last_date][$notNull]=true" +
        "&filters[payment_last_date][$gte]=2025-08-28" +
        "&pagination[limit]=1000" +
        "&sort=name:ASC" +
        "&fields[0]=id&fields[1]=documentId&fields[2]=name"
    );
  });
});
