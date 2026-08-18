import { describe, expect, it } from "vitest";
import {
  isPayoutEligibleStatusName,
  normalizePayoutCreateData,
  payoutEligibleApplicationFilter,
  payoutTypeFromCreateState,
  payoutTypeFromTab,
  resolveDefaultPayoutStatusId,
  shouldShowApplicationPicker,
} from "./payoutCreateDefaults";

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

describe("payoutTypeFromTab", () => {
  it("maps Award Payouts tab to Reimbursement", () => {
    expect(payoutTypeFromTab("payouts")).toBe("Reimbursement");
  });

  it("maps Admin Payouts tab to Administrative", () => {
    expect(payoutTypeFromTab("Admin Payouts")).toBe("Administrative");
  });

  it("defaults unknown tabs to Reimbursement", () => {
    expect(payoutTypeFromTab("summary")).toBe("Reimbursement");
    expect(payoutTypeFromTab(undefined)).toBe("Reimbursement");
  });
});

describe("isPayoutEligibleStatusName", () => {
  it("matches Grant Agreement Signed / Revised per COR, including PFY suffix", () => {
    expect(
      isPayoutEligibleStatusName("Grant Agreement Signed/Sealed/Returned")
    ).toBe(true);
    expect(
      isPayoutEligibleStatusName("Grant Agreement Signed/Sealed/Returned PFY")
    ).toBe(true);
    expect(isPayoutEligibleStatusName("Revised per COR")).toBe(true);
  });

  it("rejects other statuses", () => {
    expect(isPayoutEligibleStatusName("New Application")).toBe(false);
    expect(isPayoutEligibleStatusName(undefined)).toBe(false);
    expect(isPayoutEligibleStatusName("")).toBe(false);
  });
});

describe("payoutEligibleApplicationFilter", () => {
  it("filters to status ids 3 and 6 (Grant Agreement Signed / Revised per COR)", () => {
    expect(payoutEligibleApplicationFilter()).toEqual({ status: [3, 6] });
  });

  it("includes a documentId-safe grant when provided", () => {
    expect(payoutEligibleApplicationFilter("grantdocumentidxxx")).toEqual({
      status: [3, 6],
      grant: "grantdocumentidxxx",
    });
    expect(payoutEligibleApplicationFilter(4)).toEqual({
      status: [3, 6],
      grant: 4,
    });
  });

  it("omits grant when missing", () => {
    expect(payoutEligibleApplicationFilter(undefined)).toEqual({ status: [3, 6] });
    expect(payoutEligibleApplicationFilter(0)).toEqual({ status: [3, 6] });
    expect(payoutEligibleApplicationFilter("")).toEqual({ status: [3, 6] });
  });
});

describe("shouldShowApplicationPicker", () => {
  it("is visible on Award Payouts when no application is selected", () => {
    expect(shouldShowApplicationPicker(undefined)).toBe(true);
    expect(shouldShowApplicationPicker(null)).toBe(true);
    expect(shouldShowApplicationPicker(undefined, "Reimbursement")).toBe(true);
  });

  it("is hidden when the application is already known (show page)", () => {
    expect(shouldShowApplicationPicker(42)).toBe(false);
    expect(shouldShowApplicationPicker("appdocumentidxxxxx")).toBe(false);
  });

  it("stays hidden for Administrative payouts", () => {
    expect(shouldShowApplicationPicker(undefined, "Administrative")).toBe(false);
    expect(shouldShowApplicationPicker(42, "Administrative")).toBe(false);
  });
});

describe("resolveDefaultPayoutStatusId", () => {
  it("uses the Requested status id (documentId after remap), not an application id", () => {
    expect(
      resolveDefaultPayoutStatusId([
        { id: "docpaidxxxxxxxxxxxx", name: "Paid" },
        { id: "docrequestedxxxxxxxx", name: "Requested" },
      ])
    ).toBe("docrequestedxxxxxxxx");
  });

  it("falls back to numeric payout-status id 1", () => {
    expect(resolveDefaultPayoutStatusId(undefined)).toBe(1);
    expect(resolveDefaultPayoutStatusId([])).toBe(1);
  });
});

describe("normalizePayoutCreateData", () => {
  it("writes documentId scalars and defaults type/grant/status", () => {
    expect(
      normalizePayoutCreateData(
        {
          amount: 1500,
          application: { id: "appdocumentidxxxxx", entityId: 9 },
        },
        {
          type: "Reimbursement",
          grantId: "grantdocumentidxxx",
          payoutStatusId: "docrequestedxxxxxxxx",
        }
      )
    ).toEqual({
      amount: 1500,
      application: "appdocumentidxxxxx",
      grant: "grantdocumentidxxx",
      payout_status: "docrequestedxxxxxxxx",
      type: "Reimbursement",
    });
  });

  it("omits application for Administrative payouts when none is selected", () => {
    const result = normalizePayoutCreateData(
      { amount: 200, application: null },
      { type: "Administrative", grantId: 4, payoutStatusId: 1 }
    );
    expect(result.application).toBeUndefined();
    expect(result.type).toBe("Administrative");
    expect(result.grant).toBe(4);
  });
});
