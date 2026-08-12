import { describe, expect, it } from "vitest";
import {
  computeBalance,
  isAwardPaidInFull,
  sumPayoutAmounts,
  toMoney,
} from "./payoutAmounts";

const paid = (amount: unknown, type = "Reimbursement") => ({
  amount,
  type,
  payout_status: { name: "Paid" },
});

describe("toMoney", () => {
  it("parses Strapi decimal strings", () => {
    expect(toMoney("71715.00")).toBe(71715);
    expect(toMoney("70,240.00")).toBe(70240);
  });

  it("returns 0 for junk", () => {
    expect(toMoney(undefined)).toBe(0);
    expect(toMoney("")).toBe(0);
    expect(toMoney(NaN)).toBe(0);
  });
});

describe("computeBalance", () => {
  it("does not concatenate decimal strings across multiple payouts", () => {
    // Burnt Cabin 20274: $100,000 award, $71,715 + $20,280 paid.
    expect(
      computeBalance({
        award_amount: "100000.00",
        payouts: [paid("71715.00"), paid("20280.00")],
      })
    ).toBe(8005);
  });

  it("ignores administrative payouts linked to the application", () => {
    expect(
      computeBalance({
        award_amount: 80000,
        payouts: [paid(17143, "Administrative"), paid(10000)],
      })
    ).toBe(70000);
  });

  it("ignores Not Approved reimbursements", () => {
    expect(
      computeBalance({
        award_amount: 100000,
        payouts: [
          paid(50000),
          {
            amount: 50000,
            type: "Reimbursement",
            payout_status: { name: "Not Approved" },
          },
        ],
      })
    ).toBe(50000);
  });
});

describe("isAwardPaidInFull", () => {
  it("is false when reimbursements do not cover the award", () => {
    expect(
      isAwardPaidInFull({
        award_amount: 100000,
        payouts: [paid("71715.00"), paid("20280.00")],
      })
    ).toBe(false);
  });

  it("is true when Paid reimbursements cover the award", () => {
    expect(
      isAwardPaidInFull({
        award_amount: 100000,
        payouts: [paid(60000), paid(40000)],
      })
    ).toBe(true);
  });

  it("does not treat Requested or admin draws as paid in full", () => {
    expect(
      isAwardPaidInFull({
        award_amount: 100000,
        payouts: [
          {
            amount: 100000,
            type: "Reimbursement",
            payout_status: { name: "Requested" },
          },
        ],
      })
    ).toBe(false);
    expect(
      isAwardPaidInFull({
        award_amount: 100000,
        payouts: [paid(100000, "Administrative")],
      })
    ).toBe(false);
  });

  it("is false when there are no payouts (Goltry 20313)", () => {
    expect(isAwardPaidInFull({ award_amount: 80000, payouts: [] })).toBe(false);
  });

  it("is false for a partial single reimbursement (Okfuskee 20318)", () => {
    expect(
      isAwardPaidInFull({
        award_amount: "75840.00",
        payouts: [paid("70240.00")],
      })
    ).toBe(false);
    expect(
      computeBalance({
        award_amount: "75840.00",
        payouts: [paid("70240.00")],
      })
    ).toBe(5600);
  });
});

describe("sumPayoutAmounts", () => {
  it("starts from numeric 0 so a single decimal string does not concatenate", () => {
    expect(sumPayoutAmounts([paid("70240.00")])).toBe(70240);
  });
});
