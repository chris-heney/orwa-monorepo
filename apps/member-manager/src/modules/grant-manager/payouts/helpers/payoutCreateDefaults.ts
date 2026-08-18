export type PayoutType = "Administrative" | "Reimbursement";

type CreateLocationState = {
  record?: {
    type?: unknown;
  };
} | null;

/**
 * Award Payouts and Admin Payouts share `/grant-payouts/create`.
 * Default to Reimbursement (the Award Payouts "Grant Payout") unless the
 * Admin Payouts button explicitly asked for Administrative.
 */
export function payoutTypeFromCreateState(state: unknown): PayoutType {
  const type = (state as CreateLocationState)?.record?.type;
  return type === "Administrative" ? "Administrative" : "Reimbursement";
}
