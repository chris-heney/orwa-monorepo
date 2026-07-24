import { useMemo } from "react";
import dayjs from "dayjs";
import { IGrantApplication } from "../../../grant-application/GrantApplicationTypes";
import { IGrant, IGrantPayout } from "../GrantTypes";
import { APPROVED_STATUSES } from "../../helpers/previousFyRollover";
import {
  EDGE_NODES,
  EdgeNodeKey,
  NON_RESERVING_STATUSES,
  computeReserved,
  edgeNodeForApplication,
} from "./pathways/model";
import { useSummaryTokens } from "./tokens";

const UNAPPROVED_STATUSES = [
  "Not Approved",
  "Withdrawn",
  "On Hold",
  "Tabled Application",
  "Denial: Over Population Limit",
  "Denial: Insufficient",
  "Inelegible",
];

const NEEDS_REVIEW_STATUSES = ["New Application", "Awaiting Committee"];

const isPfy = (app: IGrantApplication) => app.status.name.includes("PFY");
const isApproved = (app: IGrantApplication) =>
  !isPfy(app) && APPROVED_STATUSES.includes(app.status.name);

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
  requested: number;
  approved: number;
  disbursed: number;
}

/** Raw requested dollars per category, segmented by lifecycle edge node. */
export interface EdgeBreakdownRow {
  name: string;
  total: number;
  segments: Record<EdgeNodeKey, number>;
}

export type Dimension = "project" | "county" | "senate" | "house" | "congress";

const REGION_KEYS: Record<string, string> = {
  senate: "Senate District",
  house: "State House District",
  congress: "Congressional District",
};

const shortDistrict = (value: string) =>
  value
    .replace("State Senate District", "SD")
    .replace("State House District", "HD")
    .replace("Congressional District", "CD");

const regionOf = (
  app: IGrantApplication | undefined,
  dimension: Dimension
): string | null => {
  if (!app) return null;
  if (dimension === "county") return app.county?.trim() || null;
  const regions = (app as unknown as { regions?: Record<string, string> })
    .regions;
  const raw = regions?.[REGION_KEYS[dimension]];
  return raw ? shortDistrict(raw) : null;
};

interface ProjectTypeRef {
  name?: string;
}

/**
 * Some project-type records are legacy form artifacts ("Engineering Report
 * N/A", question text). Fold them into "Other" so the breakdown reads as a
 * list of real project categories without dropping their dollars.
 */
const cleanProjectName = (name: string): string =>
  /n\/a|\?|other describe/i.test(name) ? "Other" : name;

const projectNames = (list: ProjectTypeRef[] | undefined): string[] =>
  ((list ?? []).map((p) => p?.name).filter(Boolean) as string[]).map(
    cleanProjectName
  );

export const useGrantMetrics = (
  applications: IGrantApplication[],
  payouts: IGrantPayout[],
  allPayouts: IGrantPayout[],
  grant: IGrant | undefined,
  previousFyRollover: number
) => {
  // Stage colors follow the active light/dark token set so the lifecycle
  // ramp stays legible on both canvases.
  const T = useSummaryTokens();
  return useMemo(() => {
    const live = applications.filter((a) => !isPfy(a));
    const approved = live.filter(isApproved);
    const needsReview = live.filter((a) =>
      NEEDS_REVIEW_STATUSES.includes(a.status.name)
    );
    const declined = live.filter((a) =>
      UNAPPROVED_STATUSES.includes(a.status.name)
    );
    const changeOrders = live.filter((a) => a.status.name === "Change Order");
    const signed = approved.filter((a) =>
      ["Grant Agreement Signed/Sealed/Returned", "Paid in Full"].includes(
        a.status.name
      )
    );
    const paidInFull = approved.filter((a) => a.status.name === "Paid in Full");
    const closedOut = approved.filter((a) => a.closed_out);

    // Reserved-basis "requested": withdrawn and denied applications always
    // drop out — their dollars returned to the pool the moment they exited.
    // Change orders stay excluded too (revisions of already-counted awards).
    const requestable = live.filter(
      (a) =>
        a.status.name !== "Change Order" &&
        !NON_RESERVING_STATUSES.includes(a.status.name)
    );
    const totalRequested = requestable.reduce(
      (sum, a) => sum + num(a.requested_grant_amount),
      0
    );
    // Raw ask across every live application, regardless of outcome or the
    // pool's size — the only place "Requested" keeps its old meaning.
    const rawRequested = live.reduce(
      (sum, a) => sum + num(a.requested_grant_amount),
      0
    );
    const approvedFunds = approved.reduce(
      (sum, a) => sum + (a.award_amount || 0),
      0
    );

    const reimbursements = payouts.filter((p) => p.type === "Reimbursement");
    const adminPayouts = payouts.filter((p) => p.type === "Administrative");
    const disbursed = reimbursements.reduce((s, p) => s + (p.amount || 0), 0);
    const adminDisbursed = adminPayouts.reduce((s, p) => s + (p.amount || 0), 0);

    const closeoutReturned = closedOut.reduce(
      (sum, a) => sum + ((a.award_amount || 0) - paidTotal(a)),
      0
    );

    // ---- The dollar lifecycle (signature rail) -------------------------
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
        count: reimbursements.length,
        countLabel: "payouts",
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
        key: "awaiting",
        label: "Awaiting Approval",
        caption: "requested, not yet decided",
        count: live.length - approved.length - declined.length,
        countLabel: "applications",
        amount: Math.max(totalRequested - approvedFunds, 0),
        color: T.stage.awaiting,
      },
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

    // ---- Pool & insight numbers ----------------------------------------
    const annualGrant = parseInt(grant?.grant_amount ?? "0") || 0;
    const annualAdmin = parseInt(grant?.admin_amount ?? "0") || 0;
    const fundsAvailable = annualGrant + previousFyRollover;

    const decidedDays = approved
      .map((a) => {
        const start = a.application_date || a.createdAt;
        if (!start || !a.committee_date) return null;
        const d = dayjs(a.committee_date).diff(dayjs(start), "day");
        return d >= 0 && d < 1000 ? d : null;
      })
      .filter((d): d is number => d !== null);

    const awardValues = approved
      .map((a) => a.award_amount || 0)
      .filter((v) => v > 0)
      .sort((a, b) => a - b);

    const insights = {
      avgAward: awardValues.length
        ? approvedFunds / awardValues.length
        : 0,
      medianAward: awardValues.length
        ? awardValues[Math.floor(awardValues.length / 2)]
        : 0,
      largestAward: awardValues.length
        ? awardValues[awardValues.length - 1]
        : 0,
      avgPayout: reimbursements.length ? disbursed / reimbursements.length : 0,
      avgDaysToDecision: decidedDays.length
        ? Math.round(decidedDays.reduce((s, d) => s + d, 0) / decidedDays.length)
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

    const lastPayout = [...allPayouts]
      .filter((p) => p.transaction_date)
      .sort(
        (a, b) =>
          dayjs(b.transaction_date.toString()).unix() -
          dayjs(a.transaction_date.toString()).unix()
      )[0];

    // ---- Groupings: where the money goes -------------------------------
    const breakdown = (dimension: Dimension): BreakdownRow[] => {
      const rows = new Map<string, BreakdownRow>();
      const row = (name: string) => {
        const existing = rows.get(name);
        if (existing) return existing;
        const fresh = { name, requested: 0, approved: 0, disbursed: 0 };
        rows.set(name, fresh);
        return fresh;
      };

      if (dimension === "project") {
        for (const app of requestable) {
          const selected = projectNames(
            (app as unknown as { selected_projects?: ProjectTypeRef[] })
              .selected_projects
          );
          const requested = num(app.requested_grant_amount);
          const share = selected.length ? requested / selected.length : 0;
          if (!selected.length && requested)
            row("Unspecified").requested += requested;
          for (const name of selected) row(name).requested += share;
        }
        for (const app of approved) {
          const chosen = projectNames(
            (app as unknown as { approved_projects?: ProjectTypeRef[] })
              .approved_projects
          );
          const fallback = projectNames(
            (app as unknown as { selected_projects?: ProjectTypeRef[] })
              .selected_projects
          );
          const names = chosen.length ? chosen : fallback;
          const award = app.award_amount || 0;
          const share = names.length ? award / names.length : 0;
          if (!names.length && award) row("Unspecified").approved += award;
          for (const name of names) row(name).approved += share;
        }
        for (const payout of reimbursements) {
          const raw = (payout as unknown as { project_type?: ProjectTypeRef })
            .project_type?.name;
          row(raw ? cleanProjectName(raw) : "Unspecified").disbursed +=
            payout.amount || 0;
        }
      } else {
        for (const app of requestable) {
          const name = regionOf(app, dimension) || "Unspecified";
          row(name).requested += num(app.requested_grant_amount);
        }
        for (const app of approved) {
          const name = regionOf(app, dimension) || "Unspecified";
          row(name).approved += app.award_amount || 0;
        }
        for (const payout of reimbursements) {
          const name = regionOf(payout.application, dimension) || "Unspecified";
          row(name).disbursed += payout.amount || 0;
        }
      }

      return Array.from(rows.values()).sort(
        (a, b) =>
          b.approved + b.requested + b.disbursed -
          (a.approved + a.requested + a.disbursed)
      );
    };

    // ---- Raw requested dollars, segmented by lifecycle endpoint ---------
    // Every live application counts at its raw ask (requests can exceed the
    // pool), bucketed by where it currently sits in the pipeline.
    const edgeBreakdown = (dimension: Dimension): EdgeBreakdownRow[] => {
      const rows = new Map<string, EdgeBreakdownRow>();
      const row = (name: string): EdgeBreakdownRow => {
        const existing = rows.get(name);
        if (existing) return existing;
        const fresh: EdgeBreakdownRow = {
          name,
          total: 0,
          segments: Object.fromEntries(
            EDGE_NODES.map((e) => [e.key, 0])
          ) as Record<EdgeNodeKey, number>,
        };
        rows.set(name, fresh);
        return fresh;
      };
      const add = (name: string, edge: EdgeNodeKey, amount: number) => {
        const r = row(name);
        r.segments[edge] += amount;
        r.total += amount;
      };

      for (const app of live) {
        const edge = edgeNodeForApplication(app);
        if (!edge) continue;
        const requested = num(app.requested_grant_amount);
        if (!requested) continue;
        if (dimension === "project") {
          const selected = projectNames(
            (app as unknown as { selected_projects?: ProjectTypeRef[] })
              .selected_projects
          );
          const names = selected.length ? selected : ["Unspecified"];
          const share = requested / names.length;
          for (const name of names) add(name, edge, share);
        } else {
          add(regionOf(app, dimension) || "Unspecified", edge, requested);
        }
      }

      return Array.from(rows.values()).sort((a, b) => b.total - a.total);
    };

    return {
      stages,
      exits,
      pool: {
        annualGrant,
        annualAdmin,
        previousFyRollover,
        fundsAvailable,
        fundsStillAvailable: fundsAvailable - approvedFunds,
        totalRequested,
        rawRequested,
        // Reserved = requested money capped at what the pool actually holds.
        reserved: computeReserved(totalRequested, fundsAvailable),
        approvedFunds,
        disbursed,
        undistributed: approvedFunds - disbursed,
        adminDisbursed,
        adminAvailable: annualAdmin - adminDisbursed,
        closeoutReturned,
      },
      insights,
      lastPayout,
      breakdown,
      edgeBreakdown,
    };
  }, [applications, payouts, allPayouts, grant, previousFyRollover, T]);
};
