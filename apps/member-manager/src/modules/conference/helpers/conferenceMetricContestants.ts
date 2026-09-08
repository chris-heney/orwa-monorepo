import { partitionContestants } from "./partitionContestants";

const num = (v: unknown): number => {
  const n = typeof v === "string" ? parseFloat(v) : Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const buildContestantMetricsFilter = (
  scope: Record<string, unknown>
): Record<string, unknown> => ({ ...scope });

export const activeMetricContestants = <
  T extends { status?: string | null }
>(
  records: T[] | null | undefined
): T[] => partitionContestants(records ?? []).active;

export const deriveConferenceRevenueBreakdown = ({
  registrations,
  booths,
  sponsors,
  contestants,
}: {
  registrations: Array<{ total?: unknown }>;
  booths: Array<{ subtotal?: unknown }>;
  sponsors: Array<{ amount?: unknown }>;
  contestants: Array<{ fee?: unknown; status?: string | null }>;
}) => {
  const total = registrations.reduce((s, r) => s + num(r.total), 0);
  const boothRevenue = booths.reduce((s, b) => s + num(b.subtotal), 0);
  const sponsorRevenue = sponsors.reduce((s, sp) => s + num(sp.amount), 0);
  const { active, cancelled } = partitionContestants(contestants);
  const activeContestants = active.reduce((s, c) => s + num(c.fee), 0);
  const cancelledPendingRefundContestants = cancelled.reduce(
    (s, c) => s + num(c.fee),
    0
  );
  const ticketsExtras = Math.max(
    total -
      boothRevenue -
      sponsorRevenue -
      activeContestants -
      cancelledPendingRefundContestants,
    0
  );

  return {
    total,
    booths: boothRevenue,
    sponsorships: sponsorRevenue,
    activeContestants,
    cancelledPendingRefundContestants,
    ticketsExtras,
  };
};
