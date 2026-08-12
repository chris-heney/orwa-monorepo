import { IGrantApplication } from "../../../../grant-application/GrantApplicationTypes";
import { IGrantPayout } from "../../GrantTypes";
import { APPROVED_STATUSES } from "../../../helpers/previousFyRollover";
import {
  isCountableTowardAward,
  sumPayoutAmounts,
  toMoney,
} from "../../../../payouts/helpers/payoutAmounts";

/**
 * The dimensional model of the grant program's money.
 *
 * Every dollar in the program can be located by walking six dimensions:
 *
 *   1. Total Available Funding  (the whole pot)
 *   2. Allocation (Budget)      (Administration vs Grant)
 *   3. Availability             (Available vs Unavailable/Reserved)
 *   4. Approval                 (Unapproved / Unclaimed / Approved / Under Review / On Hold)
 *   5. Distribution             (Disbursed / Undisbursed — has money moved?)
 *   6. Completeness             (Paid in Full / Paid in Partial / Needing Signature / …)
 *
 * This module is the single source of truth for the sunburst, the glossary,
 * and the Application Pathways prototypes: the tree shape lives in
 * PATHWAY_TREE, and aggregatePathways() turns applications + payouts + pool
 * numbers into a per-node { count, amount } map.
 */

// ---------------------------------------------------------------------------
// Status vocabulary
// ---------------------------------------------------------------------------

/** The committee said no. Their asked-for dollars return to the pool. */
export const DENIED_STATUSES = [
  "Not Approved",
  "Denial: Over Population Limit",
  "Denial: Insufficient",
  "Inelegible", // (sic — matches the status stored in Strapi)
];

/** The applicant exited (or the committee shelved it). Dollars return to the pool. */
export const WITHDRAWN_STATUSES = ["Withdrawn", "Tabled Application"];

/**
 * Statuses whose asks never count against the pool. Requested/Reserved totals
 * must always subtract these — a denied or withdrawn application's money is
 * available again the moment it exits.
 */
export const NON_RESERVING_STATUSES = [
  ...DENIED_STATUSES,
  ...WITHDRAWN_STATUSES,
];

/** Approved but the grant agreement has not been executed yet. */
const NEEDING_SIGNATURE_STATUSES = [
  "Committee Approved",
  "Award Letter Sent",
  "Authorized by DEQ",
  "Authorized by ORWA",
  "Revised per COR",
];

// ---------------------------------------------------------------------------
// The tree
// ---------------------------------------------------------------------------

export interface PathwayNodeDef {
  id: string;
  label: string;
  /** Analytical dimension this node segments (shown in tooltips/legend). */
  dimension: string;
  /** Dollar-only nodes carry no application count (count is null). */
  dollarOnly?: boolean;
  children?: PathwayNodeDef[];
}

export const PATHWAY_TREE: PathwayNodeDef = {
  id: "total",
  label: "Total Funding",
  dimension: "Total Available Funding",
  children: [
    {
      // The Administration branch is dollar-only: admin money is budget, not
      // applications. Per the model it is auto-approved (Available→Unapproved
      // is always $0) and its "Paid in Full" is simply what has been
      // disbursed to date.
      id: "admin",
      label: "Administration",
      dimension: "Allocation (Budget)",
      dollarOnly: true,
      children: [
        {
          id: "admin_available",
          label: "Available",
          dimension: "Availability",
          dollarOnly: true,
          children: [
            {
              // Always $0 — admin money never sits unapproved.
              id: "admin_unapproved",
              label: "Unapproved",
              dimension: "Approval",
              dollarOnly: true,
            },
          ],
        },
        {
          id: "admin_reserved",
          label: "Unavailable (Reserved)",
          dimension: "Availability",
          dollarOnly: true,
          children: [
            {
              id: "admin_approved",
              label: "Approved",
              dimension: "Approval",
              dollarOnly: true,
              children: [
                {
                  id: "admin_paid",
                  label: "Paid",
                  dimension: "Distribution",
                  dollarOnly: true,
                  children: [
                    {
                      id: "admin_paid_full",
                      label: "Paid in Full",
                      dimension: "Completeness",
                      dollarOnly: true,
                    },
                    {
                      // Always $0 per the model — admin payments are whole.
                      id: "admin_paid_partial",
                      label: "Paid in Partial",
                      dimension: "Completeness",
                      dollarOnly: true,
                    },
                  ],
                },
                {
                  // Always $0 per the model (no invoicing flow for admin).
                  id: "admin_invoiced",
                  label: "Invoiced",
                  dimension: "Distribution",
                  dollarOnly: true,
                },
                {
                  // JUDGMENT CALL: not in the spec tree. Added so the
                  // Administration "Approved" level sums to the full admin
                  // allocation instead of collapsing to disbursed-only —
                  // sunburst parents are the sum of their leaves.
                  id: "admin_undisbursed",
                  label: "Undisbursed",
                  dimension: "Distribution",
                  dollarOnly: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "grant",
      label: "Grant",
      dimension: "Allocation (Budget)",
      children: [
        {
          id: "grant_available",
          label: "Available",
          dimension: "Availability",
          children: [
            {
              id: "unapproved",
              label: "Unapproved",
              dimension: "Approval",
              children: [
                {
                  id: "denied",
                  label: "Denied",
                  dimension: "Resolution",
                },
                {
                  id: "withdrawn",
                  label: "Withdrawn",
                  dimension: "Resolution",
                },
              ],
            },
            {
              // Dollar-only: the slice of the pool nothing is reserved
              // against. funds available − Reserved (floored at $0).
              id: "unclaimed",
              label: "Unclaimed",
              dimension: "Approval",
              dollarOnly: true,
            },
          ],
        },
        {
          id: "grant_reserved",
          label: "Unavailable (Reserved)",
          dimension: "Availability",
          children: [
            {
              id: "approved",
              label: "Approved",
              dimension: "Approval",
              children: [
                {
                  id: "disbursed",
                  label: "Disbursed",
                  dimension: "Distribution",
                  children: [
                    {
                      id: "paid_full",
                      label: "Paid in Full",
                      dimension: "Completeness",
                    },
                    {
                      id: "paid_partial",
                      label: "Paid in Partial",
                      dimension: "Completeness",
                    },
                  ],
                },
                {
                  id: "undisbursed",
                  label: "Undisbursed",
                  dimension: "Distribution",
                  children: [
                    {
                      id: "needing_signature",
                      label: "Needing Signature",
                      dimension: "Completeness",
                    },
                    {
                      id: "awaiting_payment_request",
                      label: "Awaiting Payment Request",
                      dimension: "Completeness",
                    },
                  ],
                },
              ],
            },
            {
              id: "under_review",
              label: "Under Review",
              dimension: "Approval",
              children: [
                {
                  id: "awaiting_approval",
                  label: "Awaiting Approval",
                  dimension: "Review Stage",
                },
                {
                  id: "awaiting_committee",
                  label: "Awaiting Committee",
                  dimension: "Review Stage",
                },
              ],
            },
            {
              // On-hold applications keep their claim on the pool: the money
              // stays reserved until they resolve.
              id: "on_hold",
              label: "On Hold",
              dimension: "Approval",
            },
          ],
        },
      ],
    },
  ],
};

/** Flattened tree in render order, with depth for indentation. */
export interface FlatPathwayNode extends PathwayNodeDef {
  depth: number;
  parentId: string | null;
}

export const flattenPathways = (
  node: PathwayNodeDef = PATHWAY_TREE,
  depth = 0,
  parentId: string | null = null
): FlatPathwayNode[] => [
  { ...node, depth, parentId },
  ...(node.children ?? []).flatMap((child) =>
    flattenPathways(child, depth + 1, node.id)
  ),
];

// ---------------------------------------------------------------------------
// Classification
// ---------------------------------------------------------------------------

const num = (value: unknown): number => {
  const n = parseFloat(String(value ?? 0).replace(/[^0-9.-]/g, ""));
  return isNaN(n) ? 0 : n;
};

const isPfy = (app: IGrantApplication) =>
  (app.status?.name ?? "").includes("PFY");

/**
 * Classify one application into a leaf of the pathway tree, returning the
 * dollar amount it contributes there.
 *
 * Mapping decisions:
 * - PFY-suffixed statuses are prior-fiscal-year echoes → excluded (null).
 * - Approved apps contribute their award amount (falling back to their ask
 *   when no award is recorded yet); everything else contributes the raw ask.
 * - "Paid in Full" is the status of that name OR payouts >= award — some
 *   fully-drawn apps never get their status flipped.
 * - "Paid in Partial": some money out the door, but not all of it.
 * - Undisbursed approved apps split on whether the agreement is executed:
 *   "Grant Agreement Signed/Sealed/Returned" → Awaiting Payment Request,
 *   the pre-signature statuses → Needing Signature.
 * - "New Application" / "Awaiting Committee" → Awaiting Committee.
 * - "Change Order" and any unrecognized status → Awaiting Approval: they are
 *   non-terminal, reviewed-but-undecided, and their ask stays reserved.
 */
export const classifyApplication = (
  app: IGrantApplication,
  paidLookup?: (app: IGrantApplication) => number
): { leaf: string; amount: number } | null => {
  const status = app.status?.name ?? "";
  if (isPfy(app)) return null;

  const requested = num(app.requested_grant_amount);
  if (DENIED_STATUSES.includes(status)) return { leaf: "denied", amount: requested };
  if (WITHDRAWN_STATUSES.includes(status))
    return { leaf: "withdrawn", amount: requested };
  if (status === "On Hold") return { leaf: "on_hold", amount: requested };

  if (APPROVED_STATUSES.includes(status)) {
    const award = app.award_amount || requested;
    const paid =
      paidLookup?.(app) ??
      sumPayoutAmounts(app.payouts, isCountableTowardAward);
    const isFull = status === "Paid in Full" || (award > 0 && paid >= award);
    if (isFull) return { leaf: "paid_full", amount: award };
    if (paid > 0) return { leaf: "paid_partial", amount: award };
    if (status === "Grant Agreement Signed/Sealed/Returned")
      return { leaf: "awaiting_payment_request", amount: award };
    return { leaf: "needing_signature", amount: award };
  }

  if (status === "New Application" || status === "Awaiting Committee")
    return { leaf: "awaiting_committee", amount: requested };
  return { leaf: "awaiting_approval", amount: requested };
};

// ---------------------------------------------------------------------------
// Edge nodes (lifecycle endpoints)
// ---------------------------------------------------------------------------

/**
 * The "edge node" of an application: the endpoint bucket it currently sits in
 * when the tree above is flattened to leaves. Used by the requested-dollars
 * breakdown chart.
 *
 * Notes against the actual data (grant_statuses, checked 2026-07):
 * - "Awaiting Signature" is NOT a status in the DB. It is derived exactly like
 *   the model's Needing Signature leaf: approved statuses prior to
 *   "Grant Agreement Signed/Sealed/Returned" (Committee Approved, Award Letter
 *   Sent, Authorized by DEQ/ORWA, Revised per COR) with no payouts.
 * - "Approved" here means signed and awaiting a payment request (the
 *   awaiting_payment_request leaf), per the requested-dollars breakdown spec.
 * - The Withdrawn, Tabled, "Denial: ..." and Inelegible statuses don't exist
 *   in the DB either; the withdrawn leaf is folded into "Denied / Withdrawn"
 *   so those asks still land somewhere sensible if such statuses ever appear.
 */
export type EdgeNodeKey =
  | "awaiting_committee"
  | "awaiting_approval"
  | "awaiting_signature"
  | "approved"
  | "paid_partial"
  | "paid_full"
  | "on_hold"
  | "denied_withdrawn";

export interface EdgeNodeDef {
  key: EdgeNodeKey;
  label: string;
}

/** Pipeline order: review → commitment → paid, then the parked/exited asks. */
export const EDGE_NODES: EdgeNodeDef[] = [
  { key: "awaiting_committee", label: "Awaiting Committee" },
  { key: "awaiting_approval", label: "Awaiting Approval" },
  { key: "awaiting_signature", label: "Awaiting Signature" },
  { key: "approved", label: "Approved" },
  { key: "paid_partial", label: "Paid in Part" },
  { key: "paid_full", label: "Paid in Full" },
  { key: "on_hold", label: "On Hold" },
  { key: "denied_withdrawn", label: "Denied / Withdrawn" },
];

const LEAF_TO_EDGE: Record<string, EdgeNodeKey> = {
  awaiting_committee: "awaiting_committee",
  awaiting_approval: "awaiting_approval",
  needing_signature: "awaiting_signature",
  awaiting_payment_request: "approved",
  paid_partial: "paid_partial",
  paid_full: "paid_full",
  on_hold: "on_hold",
  denied: "denied_withdrawn",
  withdrawn: "denied_withdrawn",
};

/** Edge node for one application; null for PFY echoes. */
export const edgeNodeForApplication = (
  app: IGrantApplication,
  paidLookup?: (app: IGrantApplication) => number
): EdgeNodeKey | null => {
  const hit = classifyApplication(app, paidLookup);
  return hit ? LEAF_TO_EDGE[hit.leaf] ?? null : null;
};

// ---------------------------------------------------------------------------
// Aggregation
// ---------------------------------------------------------------------------

export interface PathwayValue {
  /** Number of applications at/under this node; null for dollar-only nodes. */
  count: number | null;
  amount: number;
}

export interface PathwayPoolInput {
  /** Grant pool for the period: annual allocation + previous FY rollover. */
  fundsAvailable: number;
  adminAllocation: number;
  adminDisbursed: number;
}

/** Reserved = total money requested, capped at (max) funds available. */
export const computeReserved = (
  totalRequested: number,
  fundsAvailable: number
): number => Math.min(totalRequested, fundsAvailable);

/**
 * Aggregate applications + payouts + pool numbers into per-node values.
 *
 * Parents are the sum of their children, so the sunburst geometry is
 * consistent. Two consequences worth knowing:
 * - "Unclaimed" is funds available − Reserved (capped, floored at $0), per
 *   the model's definition.
 * - The Grant ring can exceed the pool when demand is high: denied/withdrawn
 *   asks (under Available → Unapproved) flowed through the pipeline even
 *   though their dollars returned, and Reserved's children are shown uncapped
 *   so an over-subscribed year is visible instead of hidden.
 */
export const aggregatePathways = (
  applications: IGrantApplication[],
  payouts: IGrantPayout[],
  pool: PathwayPoolInput
): Record<string, PathwayValue> => {
  const values: Record<string, PathwayValue> = {};
  for (const node of flattenPathways()) {
    values[node.id] = { count: node.dollarOnly ? null : 0, amount: 0 };
  }

  // Reimbursements keyed by application id, as a fallback when an
  // application's own payouts relation is not populated.
  const paidByApp = new Map<number, number>();
  for (const payout of payouts) {
    if (payout.type !== "Reimbursement") continue;
    const appId = payout.application?.id;
    if (appId == null) continue;
    paidByApp.set(
      Number(appId),
      (paidByApp.get(Number(appId)) ?? 0) + toMoney(payout.amount)
    );
  }
  const paidLookup = (app: IGrantApplication): number => {
    if (app.payouts?.length)
      return sumPayoutAmounts(app.payouts, isCountableTowardAward);
    return app.id != null ? paidByApp.get(Number(app.id)) ?? 0 : 0;
  };

  for (const app of applications) {
    const hit = classifyApplication(app, paidLookup);
    if (!hit) continue;
    const leaf = values[hit.leaf];
    leaf.amount += hit.amount;
    if (leaf.count !== null) leaf.count += 1;
  }

  // Administration branch (dollar-only): Approved = allocation; Paid in Full
  // = disbursed to date; Undisbursed = the remainder (see tree comment).
  const adminDisbursed = Math.max(pool.adminDisbursed, 0);
  values.admin_paid_full.amount = Math.min(adminDisbursed, pool.adminAllocation);
  values.admin_undisbursed.amount = Math.max(
    pool.adminAllocation - adminDisbursed,
    0
  );

  // Roll leaves up into parents (children-sum invariant).
  const rollUp = (node: PathwayNodeDef): PathwayValue => {
    if (!node.children?.length) return values[node.id];
    const own = values[node.id];
    own.amount = 0;
    if (own.count !== null) own.count = 0;
    for (const child of node.children) {
      const v = rollUp(child);
      own.amount += v.amount;
      if (own.count !== null && v.count !== null) own.count += v.count;
    }
    return own;
  };
  rollUp(PATHWAY_TREE);

  // Unclaimed depends on the rolled-up Reserved total, then re-roll the
  // ancestors it feeds.
  const reserved = computeReserved(
    values.grant_reserved.amount,
    pool.fundsAvailable
  );
  values.unclaimed.amount = Math.max(pool.fundsAvailable - reserved, 0);
  rollUp(PATHWAY_TREE);

  return values;
};
