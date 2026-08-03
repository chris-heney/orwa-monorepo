import React, { useMemo } from "react";
import { RaRecord, useGetList } from "react-admin";
import dayjs from "dayjs";
import httpClient from "../../../../helpers/ra-strapi-data-provider/src/httpClient";
import {
  getFilterYear,
  getPrimaryConferenceId,
} from "../../helpers/mergeConferenceAcrossTabFilters";
import { useConferenceContext } from "../../ConferenceContext";

/** Coerce Strapi decimals / bigintegers (often strings) into numbers. */
export const num = (v: unknown): number => {
  const n = typeof v === "string" ? parseFloat(v) : Number(v);
  return Number.isFinite(n) ? n : 0;
};

export interface NamedCount {
  name: string;
  count: number;
}

export interface NamedAmount extends NamedCount {
  amount: number;
}

export interface CateringItem {
  name: string;
  count: number;
  icon?: string;
}

export type ShowtimeMode = "countdown" | "live" | "wrapped" | "archive";

export interface Showtime {
  mode: ShowtimeMode;
  /** Days until doors (countdown), day-of-event (live), or days since (wrapped). */
  days: number;
  eventLengthDays: number;
  startDate?: string;
  endDate?: string;
  /** 0..1 share of the registration window already elapsed (null = no window). */
  regWindowProgress: number | null;
  regDaysLeft: number | null;
  regWindowOpen: boolean;
}

const PER_PAGE = { page: 1, perPage: 5000 };
const RAW = { meta: { raw: true } };

const scopeFilter = (
  confId: number | undefined,
  year: number | undefined
): Record<string, unknown> => ({
  ...(confId != null ? { conference: confId } : {}),
  ...(year != null ? { year } : {}),
});

const buildShowtime = (
  conference: RaRecord | undefined,
  selectedYear: number | undefined
): Showtime | null => {
  const start = conference?.start_date as string | undefined;
  const end = (conference?.end_date as string | undefined) || start;
  if (!start) return null;

  const startD = dayjs(start).startOf("day");
  const endD = dayjs(end).endOf("day");
  const eventLengthDays = Math.max(endD.diff(startD, "day") + 1, 1);
  const today = dayjs();

  // The conference record carries only the *current* edition's dates; when
  // browsing a past year the countdown would lie, so fall back to archive mode.
  if (selectedYear != null && startD.year() !== selectedYear) {
    return {
      mode: "archive",
      days: 0,
      eventLengthDays,
      startDate: start,
      endDate: end,
      regWindowProgress: null,
      regDaysLeft: null,
      regWindowOpen: false,
    };
  }

  let mode: ShowtimeMode;
  let days: number;
  if (today.isBefore(startD)) {
    mode = "countdown";
    days = Math.ceil(startD.diff(today, "day", true));
  } else if (today.isAfter(endD)) {
    mode = "wrapped";
    days = today.diff(endD, "day");
  } else {
    mode = "live";
    days = today.diff(startD, "day") + 1;
  }

  const regStart = conference?.registration_start as string | undefined;
  const regEnd = (conference?.online_registration_end ||
    conference?.registration_end) as string | undefined;
  let regWindowProgress: number | null = null;
  let regDaysLeft: number | null = null;
  let regWindowOpen = false;
  if (regStart && regEnd) {
    const rs = dayjs(regStart).startOf("day");
    const re = dayjs(regEnd).endOf("day");
    const span = re.diff(rs, "day", true);
    if (span > 0) {
      regWindowProgress = Math.min(Math.max(today.diff(rs, "day", true) / span, 0), 1);
      regDaysLeft = Math.max(Math.ceil(re.diff(today, "day", true)), 0);
      regWindowOpen = today.isAfter(rs) && today.isBefore(re);
    }
  }

  return {
    mode,
    days,
    eventLengthDays,
    startDate: start,
    endDate: end,
    regWindowProgress,
    regDaysLeft,
    regWindowOpen,
  };
};

const topCounts = (
  values: (string | undefined | null)[],
  fallback = "Unspecified"
): NamedCount[] => {
  const map = new Map<string, number>();
  for (const v of values) {
    const key = (v || "").trim() || fallback;
    map.set(key, (map.get(key) || 0) + 1);
  }
  return Array.from(map, ([name, count]) => ({ name, count })).sort(
    (a, b) => b.count - a.count
  );
};

/**
 * Every figure the Command Center shows, computed client-side from bulk list
 * queries scoped to the selected conference + year (the grant summary
 * pattern: a handful of getList calls, never per-record fan-out).
 */
export const useConferenceMetrics = (
  filterValues: Record<string, unknown> | undefined
) => {
  const { conferences } = useConferenceContext();
  const confId = getPrimaryConferenceId(filterValues);
  const year = getFilterYear(filterValues);
  const scope = scopeFilter(confId, year);

  const conference = useMemo(
    () => conferences.find((c) => Number(c.id) === confId) as RaRecord | undefined,
    [conferences, confId]
  );

  const { data: registrations, isLoading: l1 } = useGetList(
    "conference-registrations",
    { ...RAW, filter: scope, pagination: PER_PAGE }
  );
  const { data: priorRegistrations } = useGetList(
    "conference-registrations",
    {
      ...RAW,
      filter: scopeFilter(confId, year != null ? year - 1 : undefined),
      pagination: PER_PAGE,
    },
    { enabled: year != null }
  );
  const { data: attendees, isLoading: l2 } = useGetList("conference-attendees", {
    ...RAW,
    filter: scope,
    pagination: PER_PAGE,
  });
  const { data: booths, isLoading: l3 } = useGetList("conference-booths", {
    ...RAW,
    filter: scope,
    pagination: PER_PAGE,
  });
  const { data: sponsors, isLoading: l4 } = useGetList("conference-sponsors", {
    ...RAW,
    filter: scope,
    pagination: PER_PAGE,
  });
  const { data: contestants } = useGetList("conference-contestants", {
    ...RAW,
    filter: scope,
    pagination: PER_PAGE,
  });
  const { data: teams } = useGetList("conference-teams", {
    ...RAW,
    filter: scope,
    pagination: PER_PAGE,
  });
  const { data: tasteTest } = useGetList("taste-test-contestants", {
    ...RAW,
    filter: scope,
    pagination: PER_PAGE,
  });
  const { data: feedback } = useGetList("conference-feedbacks", {
    ...RAW,
    filter: scope,
    pagination: PER_PAGE,
  });

  // Catering counts stay on the server: the conference-summary endpoint already
  // tallies `counted` extras across attendees, booths, and registrations and
  // resolves each extra's uploaded icon.
  const [catering, setCatering] = React.useState<CateringItem[] | null>(null);
  React.useEffect(() => {
    let cancelled = false;
    const base = `${import.meta.env.VITE_API_ENDPOINT}/api/conference-summary`;
    const url = `${base}/${confId ?? -1}/${year ?? -1}`;
    setCatering(null);
    httpClient(url)
      .then((response) => {
        if (cancelled) return;
        const data = JSON.parse(response.body);
        const items: CateringItem[] = (data.itemCounts || []).map(
          ([, metric]: [number, { name: string; count: number; icon?: string }]) => ({
            name: metric.name,
            count: num(metric.count),
            icon: metric.icon,
          })
        );
        setCatering(items.sort((a, b) => b.count - a.count));
      })
      .catch(() => {
        if (!cancelled) setCatering([]);
      });
    return () => {
      cancelled = true;
    };
  }, [confId, year]);

  return useMemo(() => {
    const regs = registrations ?? [];
    const priorRegs = priorRegistrations ?? [];
    const att = attendees ?? [];
    const boo = booths ?? [];
    const spo = sponsors ?? [];
    const con = contestants ?? [];

    const ticketName = (a: RaRecord): string =>
      ((a.conference_ticket as RaRecord | null)?.name as string) ||
      (a.type as string) ||
      "Unspecified";

    const isVoterOnly = (a: RaRecord) => ticketName(a) === "Voter Only";

    // --- Crowd ---------------------------------------------------------
    const headcount = att.filter((a) => !isVoterOnly(a)).length;
    const voterOnly = att.length - headcount;
    const ticketMix = topCounts(att.filter((a) => !isVoterOnly(a)).map(ticketName));
    const orgLeaderboard = topCounts(
      att.map((a) => a.organization as string),
      "No organization on file"
    ).filter((o) => o.name !== "No organization on file");

    const training = {
      operator: att.filter((a) => a.training_type === "Operator" || a.training_type === "Both").length,
      board: att.filter((a) => a.training_type === "Board" || a.training_type === "Both").length,
      both: att.filter((a) => a.training_type === "Both").length,
    };
    const voting = {
      orwaDelegates: att.filter((a) => a.orwa_voting_status === "Voting Delegate").length,
      orwaAlternates: att.filter((a) => a.orwa_voting_status === "Voting Alternate").length,
      orwaagDelegates: att.filter((a) => a.orwaag_voting_status === "Voting Delegate").length,
      orwaagAlternates: att.filter((a) => a.orwaag_voting_status === "Voting Alternate").length,
    };
    const speakers = att.filter((a) => a.speaker === true).length;

    // --- Money ---------------------------------------------------------
    const totalRevenue = regs.reduce((s, r) => s + num(r.total), 0);
    const boothRevenue = boo.reduce((s, b) => s + num(b.subtotal), 0);
    const sponsorRevenue = spo.reduce((s, sp) => s + num(sp.amount), 0);
    const contestantRevenue = con.reduce((s, c) => s + num(c.fee), 0);
    const ticketExtraRevenue = Math.max(
      totalRevenue - boothRevenue - sponsorRevenue - contestantRevenue,
      0
    );
    const paidRegs = regs.filter((r) => num(r.total) > 0);
    const avgPerRegistration = paidRegs.length
      ? totalRevenue / paidRegs.length
      : 0;
    const largestRegistration = regs.reduce((m, r) => Math.max(m, num(r.total)), 0);

    const paymentMap = new Map<string, { amount: number; count: number }>();
    for (const r of regs) {
      const key = ((r.payment_method as string) || "").trim() || "Unrecorded";
      const cur = paymentMap.get(key) || { amount: 0, count: 0 };
      cur.amount += num(r.total);
      cur.count += 1;
      paymentMap.set(key, cur);
    }
    const paymentMix: NamedAmount[] = Array.from(paymentMap, ([name, v]) => ({
      name,
      count: v.count,
      amount: v.amount,
    })).sort((a, b) => b.amount - a.amount);

    const sourceMix = {
      online: regs.filter((r) => r.registration_source === "online").length,
      kiosk: regs.filter((r) => r.registration_source === "kiosk").length,
      unrecorded: regs.filter((r) => !r.registration_source).length,
    };

    // --- Conference floor ------------------------------------------------
    // Sold booths come from conference-booths scoped to confId + year;
    // remaining capacity is the selected conference's booths_available.
    const boothsSold = boo.length;
    const remainingRaw = num(conference?.booths_available);
    // A five-digit `booths_available` is the legacy "unlimited" sentinel;
    // zero is real data (sold out), matching the legacy summary widget.
    const boothsTracked = conference != null && remainingRaw >= 0 && remainingRaw < 5000;
    const boothCapacity = boothsTracked ? boothsSold + remainingRaw : null;
    const boothsUnnumbered = boo.filter((b) => b.booth_number == null).length;
    // Open inventory and its dollar value at each conference's first-booth
    // list price. `booths_available` is a live counter, so with no conference
    // selected the open floor is summed across every conference.
    const availabilityPool = (conference ? [conference] : conferences) as Array<
      Record<string, unknown>
    >;
    let boothsAvailable: number | null = null;
    let boothsAvailableValue = 0;
    for (const c of availabilityPool) {
      const rem = num(c.booths_available);
      if (rem >= 0 && rem < 5000) {
        boothsAvailable = (boothsAvailable ?? 0) + rem;
        boothsAvailableValue += rem * num(c.booth_price);
      }
    }

    // --- Sponsors --------------------------------------------------------
    const sponsorsMissingLogo = spo.filter((s) => s.logo == null).length;
    const topSponsors: NamedAmount[] = spo
      .map((s) => ({
        name:
          ((s.organization as string) || "").trim() ||
          ((s.email as string) || "").trim() ||
          "Unnamed sponsor",
        amount: num(s.amount),
        count: 1,
      }))
      .sort((a, b) => b.amount - a.amount);

    // --- Contest ---------------------------------------------------------
    const contestantsByType = topCounts(con.map((c) => c.type as string));

    return {
      isLoading: l1 || l2 || l3 || l4,
      conference,
      confId,
      year,
      showtime: buildShowtime(conference, year),

      registrations: regs,
      priorRegistrations: priorRegs,
      registrationCount: regs.length,
      vendorRegistrations: regs.filter((r) => r.type === "Vendor").length,
      // Sponsor Only registrations have no attendees/vendors/contestants —
      // exclude them so they don't inflate the attendee headcount bucket.
      attendeeRegistrations: regs.filter(
        (r) => r.type !== "Vendor" && r.type !== "Sponsor"
      ).length,

      headcount,
      voterOnly,
      ticketMix,
      orgLeaderboard,
      training,
      voting,
      speakers,

      revenue: {
        total: totalRevenue,
        booths: boothRevenue,
        sponsorships: sponsorRevenue,
        contestants: contestantRevenue,
        ticketsExtras: ticketExtraRevenue,
        avgPerRegistration,
        largestRegistration,
      },
      paymentMix,
      sourceMix,

      booths: {
        sold: boothsSold,
        remaining: boothsTracked ? remainingRaw : null,
        capacity: boothCapacity,
        revenue: boothRevenue,
        unnumbered: boothsUnnumbered,
        available: boothsAvailable,
        availableValue: boothsAvailableValue,
      },

      sponsors: {
        count: spo.length,
        dollars: sponsorRevenue,
        missingLogo: sponsorsMissingLogo,
        top: topSponsors,
        records: spo,
      },

      contest: {
        contestants: con.length,
        byType: contestantsByType,
        fees: contestantRevenue,
        teams: (teams ?? []).length,
        tasteTest: (tasteTest ?? []).length,
      },

      catering,
      feedbackCount: (feedback ?? []).length,
      attendeesMissingEmail: att.filter((a) => !((a.email as string) || "").trim())
        .length,
    };
  }, [
    registrations,
    priorRegistrations,
    attendees,
    booths,
    sponsors,
    contestants,
    teams,
    tasteTest,
    feedback,
    catering,
    conference,
    conferences,
    confId,
    year,
    l1,
    l2,
    l3,
    l4,
  ]);
};

export type ConferenceMetrics = ReturnType<typeof useConferenceMetrics>;
