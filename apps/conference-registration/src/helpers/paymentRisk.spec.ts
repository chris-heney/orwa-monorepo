import { describe, expect, it } from "vitest";

import {
  PAYMENT_RISK_MESSAGE,
  shouldLockRegistrationSubmit,
} from "./paymentRisk";

describe("payment risk submit guard", () => {
  it("locks resubmit only when the backend says payment may have succeeded", () => {
    expect(shouldLockRegistrationSubmit({ result: "error" })).toBe(false);
    expect(
      shouldLockRegistrationSubmit({
        result: "error",
        paymentMayHaveSucceeded: true,
      })
    ).toBe(true);
    expect(PAYMENT_RISK_MESSAGE).toContain("contact ORWA");
    expect(PAYMENT_RISK_MESSAGE).toContain("duplicate charge");
  });
});
