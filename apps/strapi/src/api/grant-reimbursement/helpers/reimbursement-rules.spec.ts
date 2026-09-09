import { describe, expect, it } from "vitest";
import {
  computeAwardBalance,
  computeRequestedAmount,
  createReimbursementToken,
  isReimbursementEligibleStatusName,
  normalizePhone,
  reimbursementSubjectLine,
  validateReimbursementSubmission,
  verifyReimbursementToken,
} from "./reimbursement-rules";

const SECRET = "test-secret";

const validBody = () => ({
  application: "abc123def456ghi789jkl012",
  invoices: [
    { vendor: " Acme Pipe Co ", invoice_number: "INV-1", amount: 1000.005 },
    { vendor: "Smith Electric", invoice_number: "88", amount: "2,500.50" },
  ],
  requester_name: "Jane Doe",
  requester_title: "Manager",
  requester_email: "Jane@Example.com",
  requester_phone: "4055551234",
  requester_signature: "data:image/png;base64,AAAA",
  certified: true,
  applicant_notes: "",
  paid_invoices: [1, "2", { id: 3 }, 1],
  proof_of_payment: [4],
  project_photos: [],
  photos_not_applicable: true,
  portal_submission_id: "sub_0123456789",
});

describe("eligibility", () => {
  it("accepts signed agreements and COR revisions, including PFY variants", () => {
    expect(
      isReimbursementEligibleStatusName("Grant Agreement Signed/Sealed/Returned")
    ).toBe(true);
    expect(isReimbursementEligibleStatusName("Revised per COR")).toBe(true);
    expect(isReimbursementEligibleStatusName("Revised per COR PFY")).toBe(true);
  });

  it("rejects everything else", () => {
    expect(isReimbursementEligibleStatusName("New Application")).toBe(false);
    expect(isReimbursementEligibleStatusName("Paid in Full")).toBe(false);
    expect(isReimbursementEligibleStatusName(null)).toBe(false);
  });
});

describe("computeAwardBalance", () => {
  it("counts paid + pending reimbursements, ignores admin and rejected rows", () => {
    const balance = computeAwardBalance({
      award_amount: 50000,
      payouts: [
        { type: "Reimbursement", amount: "10000.00", payout_status: { name: "Paid" } },
        { type: "Reimbursement", amount: 5000, payout_status: { name: "Requested" } },
        { type: "Reimbursement", amount: 999, payout_status: { name: "Not Approved" } },
        { type: "Administrative", amount: 777, payout_status: { name: "Paid" } },
      ],
    });
    expect(balance).toEqual({ award: 50000, paid: 10000, pending: 5000, remaining: 35000 });
  });

  it("never goes negative and treats string decimals as money", () => {
    const balance = computeAwardBalance({
      award_amount: "1000",
      payouts: [{ type: "Reimbursement", amount: "1500.00", payout_status: { name: "Paid" } }],
    });
    expect(balance.remaining).toBe(0);
    expect(balance.paid).toBe(1500);
  });
});

describe("computeRequestedAmount", () => {
  it("caps at remaining balance and floors at zero", () => {
    expect(computeRequestedAmount(3000, 5000)).toBe(3000);
    expect(computeRequestedAmount(6000, 5000)).toBe(5000);
    expect(computeRequestedAmount(6000, 0)).toBe(0);
  });
});

describe("tokens", () => {
  it("round-trips the email and rejects tampering/expiry", () => {
    const now = 1_700_000_000_000;
    const token = createReimbursementToken("Jane@Example.com", SECRET, now);
    expect(verifyReimbursementToken(token, SECRET, now)?.email).toBe("jane@example.com");
    expect(verifyReimbursementToken(token, "other", now)).toBeNull();
    expect(verifyReimbursementToken(token + "x", SECRET, now)).toBeNull();
    expect(
      verifyReimbursementToken(token, SECRET, now + 15 * 24 * 60 * 60 * 1000)
    ).toBeNull();
    expect(verifyReimbursementToken(undefined, SECRET, now)).toBeNull();
  });
});

describe("validateReimbursementSubmission", () => {
  it("normalizes a valid payload", () => {
    const result = validateReimbursementSubmission(validBody());
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.invoice_total).toBe(3500.51);
    expect(result.value.invoices[0]).toEqual({
      vendor: "Acme Pipe Co",
      invoice_number: "INV-1",
      amount: 1000.01,
      description: undefined,
    });
    expect(result.value.requester_email).toBe("jane@example.com");
    expect(result.value.requester_phone).toBe("(405) 555-1234");
    expect(result.value.paid_invoices).toEqual([1, 2, 3]);
    expect(result.value.photos_not_applicable).toBe(true);
  });

  it("collects every problem instead of failing on the first", () => {
    const result = validateReimbursementSubmission({
      ...validBody(),
      invoices: [{ vendor: "", invoice_number: "", amount: 0 }],
      requester_email: "nope",
      requester_signature: "",
      certified: false,
      paid_invoices: [],
      proof_of_payment: [],
      photos_not_applicable: false,
    });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors).toEqual(
      expect.arrayContaining([
        "Invoice 1: vendor name is required.",
        "Invoice 1: invoice # is required.",
        "Invoice 1: amount must be greater than $0.",
        "A valid requester email is required.",
        "Please sign the certification.",
        "You must certify that the information provided is true and correct.",
        "Attach a copy of all paid invoices / pay applications.",
        "Attach proof of payment (cleared check, card receipt, ACH, etc.).",
        "Attach project photos, or confirm that photos are not applicable to this request.",
      ])
    );
  });

  it("rejects duplicate invoice numbers per vendor and an empty invoice list", () => {
    const dup = validateReimbursementSubmission({
      ...validBody(),
      invoices: [
        { vendor: "Acme", invoice_number: "1", amount: 10 },
        { vendor: "acme", invoice_number: "1", amount: 20 },
      ],
    });
    expect(dup.ok).toBe(false);
    if (!dup.ok) {
      expect(dup.errors).toContain("Invoice 1 from acme is listed more than once.");
    }
    const empty = validateReimbursementSubmission({ ...validBody(), invoices: [] });
    expect(empty.ok).toBe(false);
    if (!empty.ok) expect(empty.errors).toContain("Add at least one paid invoice.");
  });

  it("keeps photos when uploaded even if the N/A box was also ticked", () => {
    const result = validateReimbursementSubmission({
      ...validBody(),
      project_photos: [9],
      photos_not_applicable: true,
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.project_photos).toEqual([9]);
      expect(result.value.photos_not_applicable).toBe(false);
    }
  });
});

describe("misc", () => {
  it("formats phones and the required subject line", () => {
    expect(normalizePhone("1-405-555-1234")).toBe("(405) 555-1234");
    expect(normalizePhone("+44 20 1234")).toBe("+44 20 1234");
    expect(reimbursementSubjectLine(" Rural Water District #3 ", "2024-017")).toBe(
      "REIMBURSEMENT REQUEST | Rural Water District #3 | 2024-017"
    );
  });
});
