import { useMemo } from "react";
import { useGetList } from "react-admin";
import { getRollingOneYearAgoForFilters } from "../helpers/activeOrInactiveMembership";
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
  yearReport: { year: number; systems: number; associates: number }[];
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
  const paymentActiveAfter = getRollingOneYearAgoForFilters();
  const assoc = associates ?? [];
  const systems = watersystems ?? [];

  const activeAssociatesList = assoc.filter(
    (a) => a.payment_last_date && a.payment_last_date >= paymentActiveAfter
  );
  const activeWaterSystemsList = systems.filter(
    (s) => s.payment_last_date && s.payment_last_date >= paymentActiveAfter
  );

  const inactiveAssociates = assoc.length - activeAssociatesList.length;
  const inactiveWaterSystems = systems.length - activeWaterSystemsList.length;

  const expiredAssociates = assoc.filter(
    (r) =>
      !isMembershipActiveByExpiration(
        r.payment_previous_date,
        r.payment_last_date
      )
  ).length;
  const expiredWaterSystems = systems.filter(
    (r) =>
      !isMembershipActiveByExpiration(
        r.payment_previous_date,
        r.payment_last_date
      )
  ).length;

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
      hint: "Last payment within the past 12 months",
    },
    {
      key: "ws-inactive",
      label: "Inactive Systems",
      count: inactiveWaterSystems,
      caption: "Water systems past due / lapsed",
      color: T.deepWater,
      hint: "No qualifying payment in the past 12 months",
    },
    {
      key: "assoc-active",
      label: "Active Associates",
      count: activeAssociatesList.length,
      caption: "Associate members current",
      color: T.inflow,
      hint: "Last payment within the past 12 months",
    },
    {
      key: "assoc-inactive",
      label: "Inactive Associates",
      count: inactiveAssociates,
      caption: "Associates past due / lapsed",
      color: T.exit,
      hint: "No qualifying payment in the past 12 months",
    },
  ];

  const currentYear = new Date().getFullYear();
  const yearReport = [
    { year: 2021, systems: 529, associates: 111 },
    { year: 2022, systems: 380, associates: 96 },
    { year: 2023, systems: 458, associates: 104 },
    {
      year: currentYear >= 2024 ? currentYear : 2024,
      systems: expiredWaterSystems,
      associates: expiredAssociates,
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
    yearReport,
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
