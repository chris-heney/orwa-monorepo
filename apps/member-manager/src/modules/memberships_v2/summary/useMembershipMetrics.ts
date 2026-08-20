import { useMemo } from "react";
import { useGetList } from "react-admin";
import { isMembershipActiveByExpiration } from "../../_helpers/getExpirationDate";
import { useSummaryTokens, SummaryTokens } from "./tokens";

export type MembershipRecord = {
  payment_previous_date?: string;
  payment_last_date?: string;
};

export type RosterSlice = {
  key: string;
  label: string;
  count: number;
  caption: string;
  color: string;
  hint: string;
};

export type MembershipMetrics = {
  isLoading: boolean;
  associates: MembershipRecord[];
  watersystems: MembershipRecord[];
  activeAssociates: number;
  inactiveAssociates: number;
  activeWaterSystems: number;
  inactiveWaterSystems: number;
  total: number;
  activeTotal: number;
  activeRate: number;
  roster: RosterSlice[];
  expiredAssociates: number;
  expiredWaterSystems: number;
};

const buildMetrics = (
  associates: MembershipRecord[] | undefined,
  watersystems: MembershipRecord[] | undefined,
  associatesLoading: boolean,
  watersystemsLoading: boolean,
  T: SummaryTokens
): MembershipMetrics => {
  const assoc = associates ?? [];
  const systems = watersystems ?? [];

  // One rule for the whole panel: the same expiration test the lists and the
  // Member Status filters use. These counts previously came from a
  // "paid within 12 months" approximation while the year report below used
  // the expiration rule, so the two halves of this screen disagreed.
  const isActive = (r: MembershipRecord) =>
    isMembershipActiveByExpiration(r.payment_previous_date, r.payment_last_date);

  const activeAssociatesList = assoc.filter(isActive);
  const activeWaterSystemsList = systems.filter(isActive);

  const inactiveAssociates = assoc.length - activeAssociatesList.length;
  const inactiveWaterSystems = systems.length - activeWaterSystemsList.length;

  const expiredAssociates = inactiveAssociates;
  const expiredWaterSystems = inactiveWaterSystems;

  const total = assoc.length + systems.length;
  const activeTotal =
    activeAssociatesList.length + activeWaterSystemsList.length;
  const activeRate = total > 0 ? (activeTotal / total) * 100 : 0;

  const roster: RosterSlice[] = [
    {
      key: "ws-active",
      label: "Active Systems",
      count: activeWaterSystemsList.length,
      caption: "Water systems in good standing",
      color: T.water,
      hint: "Membership has not reached its expiration date",
    },
    {
      key: "ws-inactive",
      label: "Inactive Systems",
      count: inactiveWaterSystems,
      caption: "Water systems past due / lapsed",
      color: T.deepWater,
      hint: "Membership expiration date has passed",
    },
    {
      key: "assoc-active",
      label: "Active Associates",
      count: activeAssociatesList.length,
      caption: "Associate members current",
      color: T.inflow,
      hint: "Membership has not reached its expiration date",
    },
    {
      key: "assoc-inactive",
      label: "Inactive Associates",
      count: inactiveAssociates,
      caption: "Associates past due / lapsed",
      color: T.exit,
      hint: "Membership expiration date has passed",
    },
  ];

  return {
    isLoading:
      associatesLoading ||
      watersystemsLoading ||
      !associates ||
      !watersystems,
    associates: assoc,
    watersystems: systems,
    activeAssociates: activeAssociatesList.length,
    inactiveAssociates,
    activeWaterSystems: activeWaterSystemsList.length,
    inactiveWaterSystems,
    total,
    activeTotal,
    activeRate,
    roster,
    expiredAssociates,
    expiredWaterSystems,
  };
};

/**
 * Shared membership roster metrics for Summary widgets.
 * Active = last payment within a rolling ~12 months (list filters).
 * Expiration-active uses the payment overlap / expiration helper (year report).
 */
export const useMembershipMetrics = (): MembershipMetrics => {
  const T = useSummaryTokens();

  const { data: associates, isLoading: associatesLoading } = useGetList(
    "associates",
    {
      meta: { raw: true },
      pagination: { page: 1, perPage: 10000 },
    }
  );

  const { data: watersystems, isLoading: watersystemsLoading } = useGetList(
    "watersystems",
    {
      meta: { raw: true },
      pagination: { page: 1, perPage: 10000 },
    }
  );

  return useMemo(
    () =>
      buildMetrics(
        associates,
        watersystems,
        associatesLoading,
        watersystemsLoading,
        T
      ),
    [associates, watersystems, associatesLoading, watersystemsLoading, T]
  );
};
