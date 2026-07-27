import { describe, expect, it } from "vitest";
import {
  assertEligiblePreviousRegistration,
  buildAttachedRegistrationUpdate,
} from "./previous-registration";

const registration = {
  id: 42,
  documentId: "stable-registration-id",
  conference: { id: 3 },
  year: 2026,
  type: "Vendor",
  total: "400.00",
  items: [{ key: "existing", label: "Existing", value: "10", item: 8 }],
};

describe("previous conference registration linkage", () => {
  it("accepts an Attendee or Vendor from the same conference and year", () => {
    expect(assertEligiblePreviousRegistration(registration, 3, 2026)).toBe(
      registration
    );
    expect(
      assertEligiblePreviousRegistration(
        { ...registration, type: "Attendee" },
        3,
        2026
      )
    ).toBeTruthy();
  });

  it.each([
    [{ ...registration, conference: { id: 2 } }, "conference"],
    [{ ...registration, year: 2025 }, "year"],
    [{ ...registration, type: "Contestant" }, "Attendee or Vendor"],
  ])("rejects an ineligible selected registration", (candidate, message) => {
    expect(() =>
      assertEligiblePreviousRegistration(candidate, 3, 2026)
    ).toThrow(message);
  });

  it("increments the exact parent total and preserves existing audit line items", () => {
    expect(
      buildAttachedRegistrationUpdate(registration, 90, [
        { key: "dinner", label: "Dinner", value: "15", item: 9 },
      ])
    ).toEqual({
      total: 490,
      items: [
        { key: "existing", label: "Existing", value: "10", item: 8 },
        { key: "dinner", label: "Dinner", value: "15", item: 9 },
      ],
    });
  });
});
