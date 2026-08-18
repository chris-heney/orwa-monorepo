import { describe, expect, it } from "vitest";
import { payoutTypeFromCreateState } from "./payoutCreateDefaults";

describe("payoutTypeFromCreateState", () => {
  it("defaults Award Payouts / missing state to Reimbursement", () => {
    expect(payoutTypeFromCreateState(undefined)).toBe("Reimbursement");
    expect(payoutTypeFromCreateState(null)).toBe("Reimbursement");
    expect(payoutTypeFromCreateState({})).toBe("Reimbursement");
    expect(payoutTypeFromCreateState({ record: { type: "Reimbursement" } })).toBe(
      "Reimbursement"
    );
  });

  it("honors Admin Payouts create state", () => {
    expect(
      payoutTypeFromCreateState({ record: { type: "Administrative" } })
    ).toBe("Administrative");
  });
});
