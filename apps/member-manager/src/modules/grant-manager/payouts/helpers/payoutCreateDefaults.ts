import type { Identifier } from "react-admin";
import { toRelationWriteId } from "../../../../helpers/strapiIds";

export type PayoutType = "Administrative" | "Reimbursement";

type CreateLocationState = {
  record?: {
    type?: unknown;
  };
} | null;

/** Status ids used by the MAKE PAYOUT modal: Grant Agreement Signed / Revised per COR. */
export const PAYOUT_ELIGIBLE_STATUS_IDS = [3, 6] as const;

export const PAYOUT_ELIGIBLE_STATUS_NAMES = [
  "Grant Agreement Signed/Sealed/Returned",
  "Revised per COR",
] as const;

export const DEFAULT_PAYOUT_STATUS_ID = 1;
export const DEFAULT_PAYOUT_STATUS_NAME = "Requested";

/**
 * Legacy location.state from the removed `/grant-payouts/create` page.
 * Default to Reimbursement unless Administrative was requested.
 */
export function payoutTypeFromCreateState(state: unknown): PayoutType {
  const type = (state as CreateLocationState)?.record?.type;
  return type === "Administrative" ? "Administrative" : "Reimbursement";
}

/** Dashboard tab → payout type for the shared MAKE PAYOUT modal. */
export function payoutTypeFromTab(tab: unknown): PayoutType {
  return tab === "Admin Payouts" ? "Administrative" : "Reimbursement";
}

export function isPayoutEligibleStatusName(
  statusName?: string | null
): boolean {
  if (!statusName) return false;
  return (PAYOUT_ELIGIBLE_STATUS_NAMES as readonly string[]).includes(
    statusName.replace(" PFY", "")
  );
}

export function payoutEligibleApplicationFilter(
  grantId?: Identifier | null
): { status: number[]; grant?: Identifier } {
  const filter: { status: number[]; grant?: Identifier } = {
    status: [...PAYOUT_ELIGIBLE_STATUS_IDS],
  };
  if (grantId != null && grantId !== "" && grantId !== 0) {
    filter.grant = grantId;
  }
  return filter;
}

export function shouldShowApplicationPicker(
  applicationId?: Identifier | null,
  type: PayoutType = "Reimbursement"
): boolean {
  if (type === "Administrative") return false;
  return applicationId == null || applicationId === "" || applicationId === 0;
}

export function resolveDefaultPayoutStatusId(
  statuses?: Array<{ id?: unknown; name?: string }> | null
): Identifier {
  const requested = statuses?.find(
    (status) => status.name === DEFAULT_PAYOUT_STATUS_NAME
  );
  if (requested?.id != null && requested.id !== "") {
    return requested.id as Identifier;
  }
  return DEFAULT_PAYOUT_STATUS_ID;
}

type PayoutCreateDefaults = {
  type: PayoutType;
  grantId?: Identifier;
  applicationId?: Identifier;
  payoutStatusId?: Identifier;
};

export function normalizePayoutCreateData(
  data: Record<string, unknown>,
  defaults: PayoutCreateDefaults
): Record<string, unknown> {
  const application =
    toRelationWriteId(data.application as never) ?? defaults.applicationId;
  const grant = toRelationWriteId(data.grant as never) ?? defaults.grantId;
  const payoutStatus =
    toRelationWriteId(data.payout_status as never) ?? defaults.payoutStatusId;

  const result: Record<string, unknown> = {
    ...data,
    type: data.type ?? defaults.type,
  };

  if (grant != null) result.grant = grant;
  else delete result.grant;

  if (payoutStatus != null) result.payout_status = payoutStatus;
  else delete result.payout_status;

  if (application != null) result.application = application;
  else delete result.application;

  return result;
}
