import { useMemo } from "react";
import IGrantApplication from "../types/IGrantApplication";
import IGrant from "../types/IGrant";
import { T } from "../theme/tokens";
import {
  APPROVED_STATUSES,
  computePreviousFyRollover,
  isPfy,
} from "./fiscalYear";
import { NEEDS_REVIEW_STATUSES, UNAPPROVED_STATUSES } from "./stages";

/**
 * Financial metrics for the grant map, adapted from the member-manager
 * Grant Manager summary (useGrantMetrics) so both surfaces report identical
 * numbers. Works off the map's application payload: payouts ride inline on
 * each application rather than as a standalone collection.
 */

const isApproved = (app: IGrantApplication) =>
  !isPfy(app) && APPROVED_STATUSES.includes(app.status?.name ?? "");

const num = (value: unknown): number => {
  const n = parseFloat(String(value ?? 0).replace(/[^0-9.-]/g, ""));
  return isNaN(n) ? 0 : n;
};

const paidTotal = (app: IGrantApplication) =>
  (app.payouts ?? []).reduce((sum, p) => sum + (p.amount || 0), 0);

export interface LifecycleStage {
  key: string;
  label: string;
  caption: string;
  count: number | null;
  countLabel: string;
  amount: number;
  color: string;
}

export interface BreakdownRow {
  name: string;
  count: number;
  requested: number;
  approved: number;
  disbursed: number;
}

export type BreakdownDimension = "county" | "project";

interface ProjectTypeRef {
  name?: string;
}

interface ProjectCostRef {
  name?: string | null;
  amount?: string | number | null;
}

/**
 * Some project-type records are legacy form artifacts ("Engineering Report
 * N/A", question text). Fold them into "Other" so the breakdown reads as a
 * list of real project categories without dropping their dollars.
 */
const cleanProjectName = (name: string): string =>
  /n\/a|\?|other describe/i.test(name) ? "Other" : name;

const projectNames = (list: ProjectTypeRef[] | undefined | null): string[] =>
  ((list ?? []).map((p) => p?.name).filter(Boolean) as string[]).map(
    cleanProjectName
  );

/**
 * Per-type weights for an application. Prefer real cost shares from
 * `project_costs` (amount / Σ amounts, names via cleanProjectName); fall
 * back to an even split across `fallbackNames` when costs are missing or
 * sum to zero — today's historical behavior. Weights always sum to 1.
 */
const projectWeights = (
  fallbackNames: string[],
  costs: ProjectCostRef[] | undefined | null
): { name: string; weight: number }[] => {
  const byName = new Map<string, number>();
  for (const row of costs ?? []) {
    const name = row?.name ? cleanProjectName(row.name) : "";
    const amount = num(row?.amount);
    if (!name || amount <= 0) continue;
    byName.set(name, (byName.get(name) ?? 0) + amount);
  }
  const costSum = Array.from(byName.values()).reduce((s, a) => s + a, 0);
  if (costSum > 0) {
    return Array.from(byName.entries()).map(([name, amount]) => ({
      name,
      weight: amount / costSum,
    }));
  }

  const names = fallbackNames.length ? fallbackNames : ["Unspecified"];
  const weight = 1 / names.length;
  return names.map((name) => ({ name, weight }));
};

export const useMapMetrics = (
  applications: IGrantApplication[],
  allApplications: IGrantApplication[],
  grant: IGrant | null,
  selectedFy: number | null
) => {
  return useMemo(() => {
    const live = applications.filter((a) => !isPfy(a));
    const approved = live.filter(isApproved);
    const needsReview = live.filter((a) =>
      NEEDS_REVIEW_STATUSES.includes(a.status?.name ?? "")
    );
    const declined = live.filter((a) =>
      UNAPPROVED_STATUSES.includes(a.status?.name ?? "")
    );
    const changeOrders = live.filter((a) => a.status?.name === "Change Order");
    const signed = approved.filter((a) =>
      ["Grant Agreement Signed/Sealed/Returned", "Paid in Full"].includes(
        a.status?.name ?? ""
      )
    );
    const paidInFull = approved.filter(
      (a) => a.status?.name === "Paid in Full"
    );
    const closedOut = approved.filter((a) => a.closed_out);

    const rawRequested = live.reduce(
      (sum, a) => sum + num(a.requested_grant_amount),
      0
    );
    const approvedFunds = approved.reduce(
      (sum, a) => sum + (a.award_amount || 0),
      0
    );
    const disbursed = approved.reduce((sum, a) => sum + paidTotal(a), 0);
    const closeoutReturned = closedOut.reduce(
      (sum, a) => sum + ((a.award_amount || 0) - paidTotal(a)),
      0
    );

    // ---- The dollar lifecycle (stage cards; zero stages hide) -----------
    const stages: LifecycleStage[] = [
      {
        key: "received",
        label: "Received",
        caption: "applications submitted",
        count: live.length,
        countLabel: "applications",
        amount: rawRequested,
        color: T.stage.received,
      },
      {
        key: "review",
        label: "Needing Review",
        caption: "awaiting committee",
        count: needsReview.length,
        countLabel: "applications",
        amount: needsReview.reduce(
          (s, a) => s + num(a.requested_grant_amount),
          0
        ),
        color: T.stage.review,
      },
      {
        key: "approved",
        label: "Approved",
        caption: "committed by committee",
        count: approved.length,
        countLabel: "applications",
        amount: approvedFunds,
        color: T.stage.approved,
      },
      {
        key: "signed",
        label: "Agreement Signed",
        caption: "contracts executed",
        count: signed.length,
        countLabel: "agreements",
        amount: signed.reduce((s, a) => s + (a.award_amount || 0), 0),
        color: T.stage.signed,
      },
      {
        key: "disbursed",
        label: "Disbursed",
        caption: "reimbursements paid",
        count: approved.filter((a) => paidTotal(a) > 0).length,
        countLabel: "systems paid",
        amount: disbursed,
        color: T.stage.disbursed,
      },
      {
        key: "paid",
        label: "Paid in Full",
        caption: "award fully drawn",
        count: paidInFull.length,
        countLabel: "applications",
        amount: paidInFull.reduce((s, a) => s + (a.award_amount || 0), 0),
        color: T.stage.paid,
      },
      {
        key: "closed",
        label: "Closed Out",
        caption: "returned to the pool",
        count: closedOut.length,
        countLabel: "applications",
        amount: closeoutReturned,
        color: T.stage.closed,
      },
    ].filter((s) => (s.count ?? 0) > 0 || s.amount > 0);

    const exits: LifecycleStage[] = [
      {
        key: "declined",
        label: "Unable to Approve",
        caption: "denied / withdrawn / on hold",
        count: declined.length,
        countLabel: "applications",
        amount: declined.reduce((s, a) => s + num(a.requested_grant_amount), 0),
        color: T.stage.declined,
      },
      {
        key: "cor",
        label: "Change Orders",
        caption: "revisions in progress",
        count: changeOrders.length,
        countLabel: "requests",
        amount: changeOrders.reduce(
          (s, a) => s + num(a.requested_grant_amount),
          0
        ),
        color: T.stage.cor,
      },
    ].filter((s) => (s.count ?? 0) > 0);

    // ---- Pool figures (only meaningful for a single fiscal year) --------
    const annualGrant = num(grant?.grant_amount);
    const previousFyRollover =
      selectedFy != null && annualGrant > 0
        ? computePreviousFyRollover(allApplications, annualGrant, selectedFy)
        : 0;
    const fundsAvailable =
      selectedFy != null && annualGrant > 0
        ? annualGrant + previousFyRollover
        : 0;

    const pool = {
      annualGrant: selectedFy != null ? annualGrant : 0,
      previousFyRollover,
      fundsAvailable,
      fundsStillAvailable:
        fundsAvailable > 0 ? fundsAvailable - approvedFunds : 0,
      approvedFunds,
      disbursed,
      undistributed: approvedFunds - disbursed,
      closeoutReturned,
    };

    // ---- Insights --------------------------------------------------------
    const awardValues = approved
      .map((a) => a.award_amount || 0)
      .filter((v) => v > 0)
      .sort((a, b) => a - b);

    const insights = {
      avgAward: awardValues.length ? approvedFunds / awardValues.length : 0,
      medianAward: awardValues.length
        ? awardValues[Math.floor(awardValues.length / 2)]
        : 0,
      largestAward: awardValues.length
        ? awardValues[awardValues.length - 1]
        : 0,
      populationServed: approved.reduce(
        (s, a) => s + num(a.population_served),
        0
      ),
      countiesServed: new Set(
        approved.map((a) => a.county?.trim()).filter(Boolean)
      ).size,
      approvalRatio:
        live.length - needsReview.length > 0
          ? (approved.length / (live.length - needsReview.length)) * 100
          : 0,
    };

    // ---- Where the money goes -------------------------------------------
    const breakdown = (dimension: BreakdownDimension): BreakdownRow[] => {
      const rows = new Map<string, BreakdownRow>();
      const row = (name: string): BreakdownRow => {
        const existing = rows.get(name);
        if (existing) return existing;
        const fresh = { name, count: 0, requested: 0, approved: 0, disbursed: 0 };
        rows.set(name, fresh);
        return fresh;
      };

      if (dimension === "project") {
        for (const app of live) {
          const chosen = projectNames(app.approved_projects);
          const fallback = projectNames(app.selected_projects);
          const names = chosen.length ? chosen : fallback;
          const requested = num(app.requested_grant_amount);
          const award = isApproved(app) ? app.award_amount || 0 : 0;
          const paid = isApproved(app) ? paidTotal(app) : 0;
          // Dollar fields and fractional counts share the same weights so a
          // multi-type app still contributes 1.0 to the count total.
          for (const { name, weight } of projectWeights(
            names,
            app.project_costs
          )) {
            const r = row(name);
            r.count += weight;
            r.requested += requested * weight;
            r.approved += award * weight;
            r.disbursed += paid * weight;
          }
        }
      } else {
        for (const app of live) {
          const name = app.county?.trim() || "Unspecified";
          const r = row(name);
          r.count += 1;
          r.requested += num(app.requested_grant_amount);
          if (isApproved(app)) {
            r.approved += app.award_amount || 0;
            r.disbursed += paidTotal(app);
          }
        }
      }

      return Array.from(rows.values()).sort(
        (a, b) =>
          b.approved + b.requested + b.disbursed -
          (a.approved + a.requested + a.disbursed)
      );
    };

    return { stages, exits, pool, insights, breakdown };
  }, [applications, allApplications, grant, selectedFy]);
};
