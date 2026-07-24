import React from "react";
import { Box, Grid } from "@mui/material";
import { Dayjs } from "dayjs";
import ApplicationStatusSummary from "../ApplicationStatusSummary";
import WidgetFundAllocation from "../WidgetFundAllocation";
import MoneyFlowSankey from "./MoneyFlowSankey";
import DisbursementTimeline from "./DisbursementTimeline";
import { useGrantMetrics } from "./useGrantMetrics";
import { IGrantApplication } from "../../../grant-application/GrantApplicationTypes";
import { IGrant, IGrantPayout } from "../GrantTypes";

interface GraphViewProps {
  grant: IGrant;
  applications: IGrantApplication[];
  payouts: IGrantPayout[];
  previousFyRollover: number;
  from: Dayjs | null;
  to: Dayjs | null;
  statusFrom: Dayjs | null;
  statusTo: Dayjs | null;
  metrics: ReturnType<typeof useGrantMetrics>;
}

/** The animated chart wall: sunburst, status ledger, sankey, timeline. */
const GraphView: React.FC<GraphViewProps> = ({
  grant,
  applications,
  payouts,
  previousFyRollover,
  from,
  to,
  statusFrom,
  statusTo,
  metrics,
}) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
    <Grid container spacing={2.5}>
      <Grid item xs={12} lg={4}>
        <ApplicationStatusSummary
          from={statusFrom}
          to={statusTo}
          applications={applications}
        />
      </Grid>
      <Grid item xs={12} lg={8}>
        <WidgetFundAllocation
          previousFyRollover={previousFyRollover}
          grant={grant}
          applications={applications}
          payouts={payouts}
          to={to}
          from={from}
        />
      </Grid>
    </Grid>
    <MoneyFlowSankey pool={metrics.pool} />
    <DisbursementTimeline payouts={payouts} />
  </Box>
);

export default GraphView;
