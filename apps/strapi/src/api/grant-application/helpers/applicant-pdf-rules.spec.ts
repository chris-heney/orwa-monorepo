import { describe, expect, it } from "vitest";
import { invalidMediaField, shouldRegenerateFor } from "./applicant-pdf-rules";

describe("shouldRegenerateFor", () => {
  it("regenerates for New Application / Awaiting Committee when a PDF field changes", () => {
    expect(shouldRegenerateFor("New Application", ["legal_entity_name"])).toBe(true);
    expect(shouldRegenerateFor("Awaiting Committee", ["project_costs", "status"])).toBe(true);
  });

  it("skips status-only, payout-only and token-only writes", () => {
    expect(shouldRegenerateFor("New Application", ["status"])).toBe(false);
    expect(shouldRegenerateFor("New Application", ["payouts", "award_amount"])).toBe(false);
    expect(shouldRegenerateFor("New Application", ["edit_token", "edit_token_expires"])).toBe(false);
  });

  it("never auto-regenerates after committee", () => {
    expect(shouldRegenerateFor("Committee Approved", ["legal_entity_name"])).toBe(false);
    expect(shouldRegenerateFor(null, ["legal_entity_name"])).toBe(false);
  });
});

describe("invalidMediaField", () => {
  it("accepts ids, {id}, arrays of them, null and empty", () => {
    expect(
      invalidMediaField({
        proposals: [5611, { id: 5612 }, "5613"],
        consent_order: null,
        uploaded_additional_files: [],
        applicant_pdf: 6080,
      })
    ).toBeNull();
  });

  it("names the field and file title of an un-uploaded entry", () => {
    expect(
      invalidMediaField({
        proposals: [
          { id: 5611, src: "https://admin.orwa.org/uploads/x.pdf" },
          { src: "blob:https://orwa.org/abc", title: "FY 2025 Audit Agreement.pdf", rawFile: {} },
        ],
      })
    ).toEqual({ field: "proposals", title: "FY 2025 Audit Agreement.pdf" });
  });

  it("ignores non-media keys", () => {
    expect(invalidMediaField({ legal_entity_name: { weird: true } })).toBeNull();
  });
});
