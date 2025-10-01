import React, { useMemo } from "react";
import {Box, Grid, useTheme} from "@mui/material";
import {
  Loading,
  useDataProvider,
  useGetList,
  useRecordContext,
} from "react-admin";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { IGrantApplication } from "../../grant-application/GrantApplicationTypes";
import { IGrant, IGrantPayout } from "./GrantTypes";
import { useGrantContext } from "../../GrantContextProvider";
import ApplicationStatusSummary from "./ApplicationStatusSummary";
import WidgetFundAllocation from "./WidgetFundAllocation";
import FinancialBreakdown from "./FinancialBreakdown";
import FilterExplanationModal from "./FinancialsDateExplination";
import { balance } from "../../payouts/components/BalanceField";

dayjs.extend(utc);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const GrantSummary = () => {
  const { setGodMode, to, from, fiscalYearStart, fiscalYearEnd } =
    useGrantContext();
  const [applications, setApplications] = React.useState<
    IGrantApplication[] | null
  >(null);
  const [payouts, setPayouts] = React.useState<IGrantPayout[] | null>(null);
  const grant = useRecordContext<IGrant>();
  const [isModalOpen, setIsModalOpen] = React.useState(false); // State for modal
  const dataProvider = useDataProvider();
  const [leftoverFunds, setLeftoverFunds] = React.useState(0);
  const [fY1LeftoverFunds, setFY1LeftoverFunds] = React.useState(0);
  const [fy1AdminFundsRemaining, setFY1AdminFundsRemaining] = React.useState(0);
  const [fy2AdminFundsRemaining, setFY2AdminFundsRemaining] = React.useState(0);

  const theme = useTheme();

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
    const updateApplicationsWithBalance = async () => {
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

      // Fetch balances in parallel and attach them to applications
      const applicationsWithBalance = await Promise.all(
        filteredApplications.map(async (application) => {
          const balanceAmount = await balance(dataProvider, application.id);
          return { ...application, balance: balanceAmount };
        })
      );

      setApplications(applicationsWithBalance);
    };

    updateApplicationsWithBalance();
  }, [
    applicationsData,
    to,
    from,
    fiscalYearStart,
    fiscalYearEnd,
    dataProvider,
  ]);

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

      // Filter payouts by transaction_date in UTC
      const filteredPayouts = allPayoutsData?.filter((payout: IGrantPayout) =>
        payout.transaction_date
          ? dayjs(payout.transaction_date.toString())
              .utc()
              .isSameOrAfter(fromUTC) &&
            dayjs(payout.transaction_date.toString())
              .utc()
              .isSameOrBefore(toUTC)
          : false
      );
      setPayouts(filteredPayouts || null);
    } else {
      setPayouts(allPayoutsData || null);
    }
  }, [allPayoutsData, to, from, fiscalYearStart, fiscalYearEnd]);

  // Calculate leftover funds from the previous fiscal year
  const previousFiscalYearEnd = dayjs(fiscalYearEnd).subtract(1, "year");
  const previousFiscalYearStart = dayjs(fiscalYearStart).subtract(1, "year");

  const previousFiscalYearApplications = useMemo(
    () =>
      applicationsData?.filter((application) => {
        const dateToCheck =
          application.status.name === "New Application" ||
          application.status.name === "Awaiting Committee"
            ? application.createdAt || application.application_date
            : application.committee_date;

        return (
          application.closed_out === true &&
          dateToCheck &&
          dayjs(dateToCheck.toString())
            .utc()
            .isSameOrAfter(previousFiscalYearStart) &&
          dayjs(dateToCheck.toString())
            .utc()
            .isSameOrBefore(previousFiscalYearEnd)
        );
      }),
    [applicationsData, previousFiscalYearStart, previousFiscalYearEnd]
  );

  const fY1End = dayjs(fiscalYearEnd).subtract(2, "year");
  const fY1Start = dayjs(fiscalYearStart).subtract(2, "year");

  const fY2End = dayjs(fiscalYearEnd).subtract(1, "year");
  const fY2Start = dayjs(fiscalYearStart).subtract(1, "year");

  const fY1Applications = useMemo(
    () =>
      applicationsData?.filter((application) => {
        const dateToCheck =
          application.status.name === "New Application" ||
          application.status.name === "Awaiting Committee"
            ? application.createdAt || application.application_date
            : application.committee_date;

        return (
          application.closed_out === true &&
          dateToCheck &&
          dayjs(dateToCheck.toString()).utc().isSameOrAfter(fY1Start) &&
          dayjs(dateToCheck.toString()).utc().isSameOrBefore(fY1End)
        );
      }),
    [applicationsData, previousFiscalYearStart, previousFiscalYearEnd]
  );

  const fy1AdminPayouts = useMemo(
    () =>
      allPayoutsData?.filter((payout) => {
        return (
          payout.transaction_date &&
          payout.type === "Administrative" &&
          dayjs(payout.transaction_date.toString())
            .utc()
            .isSameOrAfter(fY1Start) &&
          dayjs(payout.transaction_date.toString()).utc().isSameOrBefore(fY1End)
        );
      }),
    [allPayoutsData, fiscalYearStart, fiscalYearEnd]
  );

  const fy2AdminPayouts = useMemo(
    () =>
      allPayoutsData?.filter((payout) => {
        return (
          payout.transaction_date &&
          payout.type === "Administrative" &&
          dayjs(payout.transaction_date.toString())
            .utc()
            .isSameOrAfter(fY2Start) &&
          dayjs(payout.transaction_date.toString()).utc().isSameOrBefore(fY2End)
        );
      }),
    [allPayoutsData, fiscalYearStart, fiscalYearEnd]
  );

  React.useEffect(() => {
    const calculateLeftoverFunds = async () => {
      if (!previousFiscalYearApplications) return;
      if (!fY1Applications) return;
      if (!fy1AdminPayouts) return;
      if (!fy2AdminPayouts) return;

      let total = 0;
      let total2 = 0;
      let total3 = 0;
      let total4 = 0;
      for (const application of previousFiscalYearApplications) {
        const balanceAmount = await balance(dataProvider, application.id);
        total += balanceAmount || 0;
      }

      for (const application of fY1Applications) {
        const balanceAmount = await balance(dataProvider, application.id);
        total2 += balanceAmount || 0;
      }

      for (const payout of fy1AdminPayouts) {
        total3 += payout.amount || 0;
      }

      for (const payout of fy2AdminPayouts) {
        total4 += payout.amount || 0;
      }

      setLeftoverFunds(total);
      setFY1LeftoverFunds(total2);
      setFY1AdminFundsRemaining(parseInt(grant.admin_amount) - Math.round(total3));
      setFY2AdminFundsRemaining(parseInt(grant.admin_amount) - Math.round(total4));

    };

    calculateLeftoverFunds();
  }, [to, from, fiscalYearStart, fiscalYearEnd]);

  return payoutsLoading ||
    applicationLoading ||
    !grant ||
    !payouts ||
    !applications ? (
    <Loading />
  ) : (
    <Box maxWidth={1200} mx="auto" p={2}>
      <Grid container spacing={2} p={1}>
        <Grid item xs={12} md={5}>
          <Box
            component="img"
            sx={{ height: 250, mx: "auto", flexGrow: 1, display: "block", filter: theme.palette.mode === 'dark' ? 'invert(1) hue-rotate(180deg)' : 'none' }}
            src={"rig-logo.webp"}
            alt="Grant Manager Logo"
            // allow to set false and true
            onClick={() => setGodMode((prev) => !prev)}
          />
          <ApplicationStatusSummary
            from={dayjs(fiscalYearStart)}
            to={dayjs(fiscalYearEnd)}
            applications={applications}
          />
        </Grid>
        {/* Display Leftover Funds */}
        <Grid item xs={12} md={7}>
          <WidgetFundAllocation
            fy1AdminFundsRemaining={fy1AdminFundsRemaining}
            fy2AdminFundsRemaining={fy2AdminFundsRemaining}
            lastCloseoutBalance={leftoverFunds}
            grant={grant}
            applications={applications}
            payouts={payouts}
            to={to}
            from={from}
            fy1CloseoutBalance={fY1LeftoverFunds}
          />
        </Grid>
        <Grid item xs={12}>
          <FinancialBreakdown
            setIsModalOpen={setIsModalOpen}
            applications={applications}
            payouts={payouts}
          />
        </Grid>
      </Grid>

      {/* Modal */}
      <FilterExplanationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Box>
  );
};

export default GrantSummary;
