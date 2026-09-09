import { describe, expect, it } from "vitest";

import { conferenceCycleYear } from "./conference-cycle-year";

describe("conferenceCycleYear", () => {
  it("prefers event dates over registration window dates", () => {
    expect(
      conferenceCycleYear({
        start_date: "2026-09-14",
        end_date: "2026-09-16",
        registration_start: "2025-11-01",
        registration_end: "2026-09-01",
      })
    ).toBe(2026);
  });

  it("falls back to registration window and then current year when dates are absent", () => {
    expect(conferenceCycleYear({ registration_start: "2025-11-01" }, 2026)).toBe(2025);
    expect(conferenceCycleYear({}, 2026)).toBe(2026);
  });
});
