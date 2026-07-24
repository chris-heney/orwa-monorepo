import React, { useMemo } from "react";
import { Box } from "@mui/material";
import { Loading, useGetList, useRecordContext } from "react-admin";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { IGrantApplication } from "../../grant-application/GrantApplicationTypes";
import { IGrant, IGrantPayout } from "./GrantTypes";
import { useGrantContext } from "../../GrantContextProvider";
import FilterExplanationModal from "./FinancialsDateExplination";
import { computeBalance } from "../../payouts/components/BalanceField";
import {
  computePreviousFyRollover,
  fiscalYearOf,
} from "../helpers/previousFyRollover";
import { useSummaryTokens } from "./summary/tokens";
import SummaryHeader, { SummaryView } from "./summary/SummaryHeader";
import { useGrantMetrics } from "./summary/useGrantMetrics";
import DashboardView from "./summary/DashboardView";
import GraphView from "./summary/GraphView";
import TableView from "./summary/TableView";

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

/**
 * Financial reports attribute a payout to the fiscal year the application was
 * approved (committee date), NOT the year the check was cut. Otherwise a FY
 * shows more money disbursed than approved while the prior FY appears to have
 * money missing. Administrative payouts are not tied to an application, so
 * their transaction date is the only meaningful date.
 */
export const payoutReportDate = (payout: IGrantPayout) =>
  payout.type === "Reimbursement"
    ? payout.application?.committee_date ??
      payout.application?.createdAt ??
      payout.transaction_date
    : payout.transaction_date;

const GrantSummary = () => {
  const T = useSummaryTokens();
  const { setGodMode, to, from, fiscalYearStart, fiscalYearEnd } =
    useGrantContext();
  const [applications, setApplications] = React.useState<
    IGrantApplication[] | null
  >(null);
  const [payouts, setPayouts] = React.useState<IGrantPayout[] | null>(null);
  const grant = useRecordContext<IGrant>();
  const [isModalOpen, setIsModalOpen] = React.useState(false); // State for modal
  const [view, setView] = React.useState<SummaryView>("dashboard");

  // Fetch all payouts without filtering by date
  const { data: allPayoutsData, isLoading: payoutsLoading } = useGetList(
    "grant-payouts",
    {
      meta: {
        populate: true,
        raw: true,
      },
      pagination: { page: 1, perPage: 1000 },
    }
  );

  // Fetch all applications
  const { data: applicationsData, isLoading: applicationLoading } = useGetList(
    "grant-application-finals",
    {
      meta: {
        populate: true,
        raw: true,
      },
      pagination: { page: 1, perPage: 1000 },
      sort: { field: "id", order: "ASC" },
      filter: { grant: grant.id },
    }
  );

  React.useEffect(() => {
    const updateApplicationsWithBalance = () => {
      if (!applicationsData) return;

      // Normalize from and to dates to UTC
      let fromUTC;
      let toUTC;
      if (fiscalYearStart && fiscalYearEnd) {
        fromUTC = dayjs(fiscalYearStart).utc().startOf("day");
        toUTC = dayjs(fiscalYearEnd).utc().endOf("day");
      } else if (from && to) {
        fromUTC = dayjs(from).utc().startOf("day");
        toUTC = dayjs(to).utc().endOf("day");
      } else {
        // If no date filters, set all applications directly
        setApplications(applicationsData);
        return;
      }

      // Filter applications by createdAt or committee_date in UTC
      const filteredApplications = applicationsData.filter(
        (application: IGrantApplication) => {
          const dateToCheck =
            application.status.name === "New Application" ||
            application.status.name === "Awaiting Committee"
              ? application.createdAt || application.application_date
              : application.committee_date;

          return (
            dateToCheck &&
            dayjs(dateToCheck.toString()).utc().isSameOrAfter(fromUTC) &&
            dayjs(dateToCheck.toString()).utc().isSameOrBefore(toUTC)
          );
        }
      );

      // The list query already populates payouts, so balances can be computed
      // locally — no per-application getOne round-trips.
      const applicationsWithBalance = filteredApplications.map(
        (application) => ({
          ...application,
          balance: computeBalance(application),
        })
      );

      setApplications(applicationsWithBalance);
    };

    updateApplicationsWithBalance();
  }, [applicationsData, to, from, fiscalYearStart, fiscalYearEnd]);

  React.useEffect(() => {
    if ((from && to) || (fiscalYearStart && fiscalYearEnd)) {
      // Normalize from and to dates to UTC
      let fromUTC;
      let toUTC;
      if (fiscalYearStart && fiscalYearEnd) {
        fromUTC = dayjs(fiscalYearStart).utc().startOf("day");
        toUTC = dayjs(fiscalYearEnd).utc().endOf("day");
      } else {
        fromUTC = dayjs(from).utc().startOf("day");
        toUTC = dayjs(to).utc().endOf("day");
      }

      // Filter payouts by their report date (application approval date for
      // reimbursements, transaction date for administrative payouts) in UTC
      const filteredPayouts = allPayoutsData?.filter((payout: IGrantPayout) => {
        const reportDate = payoutReportDate(payout);
        return reportDate
          ? dayjs(reportDate.toString()).utc().isSameOrAfter(fromUTC) &&
              dayjs(reportDate.toString()).utc().isSameOrBefore(toUTC)
          : false;
      });
      setPayouts(filteredPayouts || null);
    } else {
      setPayouts(allPayoutsData || null);
    }
  }, [allPayoutsData, to, from, fiscalYearStart, fiscalYearEnd]);

  // Grant funds carried into the selected FY from all earlier years
  // (unawarded allocation + closeout returns, chained year over year).
  const previousFyRollover = useMemo(() => {
    if (!grant || !applicationsData) return 0;
    const rangeStart = fiscalYearStart || from;
    if (!rangeStart) return 0; // "Totals" view spans all years; nothing rolls in
    return computePreviousFyRollover(
      applicationsData,
      parseInt(grant.grant_amount),
      fiscalYearOf(dayjs(rangeStart).toISOString())
    );
  }, [applicationsData, grant, fiscalYearStart, from]);

  const metrics = useGrantMetrics(
    applications ?? [],
    payouts ?? [],
    (allPayoutsData as IGrantPayout[] | undefined) ?? [],
    grant,
    previousFyRollover
  );

  const periodLabel = useMemo(() => {
    if (fiscalYearStart && fiscalYearEnd)
      return `FY ${dayjs(fiscalYearStart).year()}`;
    if (from && to)
      return `${dayjs(from).format("MMM YYYY")} – ${dayjs(to).format("MMM YYYY")}`;
    return "All-Time";
  }, [fiscalYearStart, fiscalYearEnd, from, to]);

  return payoutsLoading ||
    applicationLoading ||
    !grant ||
    !payouts ||
    !applications ? (
    <Loading />
  ) : (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        backgroundColor: T.ink,
        borderRadius: "0 0 18px 18px",
        p: { xs: 2, md: 3 },
        overflow: "hidden",
        isolation: "isolate",
      }}
    >
      {/* RIG logo as a faint watermark instead of a real-estate hog */}
      <Box
        component="img"
        src="rig-logo.webp"
        alt=""
        aria-hidden
        sx={{
          position: "absolute",
          top: -40,
          right: -60,
          height: 480,
          opacity: T.watermarkOpacity,
          pointerEvents: "none",
          filter: T.watermarkFilter,
          zIndex: 0,
        }}
      />

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <SummaryHeader
          grantName={grant.name || "Rural Infrastructure Grant"}
          periodLabel={periodLabel}
          view={view}
          onViewChange={setView}
          onLogoClick={() => setGodMode((prev) => !prev)}
        />

        {view === "dashboard" && (
          <DashboardView
            metrics={metrics}
            applications={applications}
            payouts={payouts}
          />
        )}

        {view === "graphs" && (
          <GraphView
            grant={grant}
            applications={applications}
            payouts={payouts}
            previousFyRollover={previousFyRollover}
            from={from}
            to={to}
            statusFrom={fiscalYearStart ? dayjs(fiscalYearStart) : null}
            statusTo={fiscalYearEnd ? dayjs(fiscalYearEnd) : null}
            metrics={metrics}
          />
        )}

        {view === "tables" && (
          <TableView
            applications={applications}
            payouts={payouts}
            setIsModalOpen={setIsModalOpen}
          />
        )}
      </Box>

      {/* Modal */}
      <FilterExplanationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
};

export default GrantSummary;
