import React, { useState, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Sunburst from "highcharts/modules/sunburst";
import HCDrilldown from "highcharts/modules/drilldown";
import {Box, Grid, Typography, useTheme} from "@mui/material";
import { formatNumber } from "../../../../helpers/Formators";
import { IGrantApplication } from "../../grant-application/GrantApplicationTypes";
import { IGrant, IGrantPayout } from "./GrantTypes";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { useGrantContext } from "../../GrantContextProvider";

dayjs.extend(isSameOrAfter);

// Initialize Highcharts modules
if (typeof Sunburst === "function") (Sunburst as any)(Highcharts);
if (typeof HCDrilldown === "function") (HCDrilldown as any)(Highcharts);

interface IWidgetFundAllocationProps {
  applications: IGrantApplication[];
  payouts: IGrantPayout[];
  grant: IGrant;
  to: Dayjs | null;
  from: Dayjs | null;
  lastCloseoutBalance: number;
  fy1CloseoutBalance: number;
  fy1AdminFundsRemaining: number;
  fy2AdminFundsRemaining: number;
}

const WidgetFundAllocation: React.FC<IWidgetFundAllocationProps> = ({
  applications,
  payouts,
  grant,
  lastCloseoutBalance,
  fy1CloseoutBalance,
  fy1AdminFundsRemaining,
  fy2AdminFundsRemaining,
}) => {
  const [selectedNode, setSelectedNode] = useState<string>("root");
  const theme = useTheme();

  const { to, from, fiscalYearEnd, fiscalYearStart } = useGrantContext();

  // Calculate the fiscal year difference between `from` and `to` dates
  const calculateYearDifference = (
    from: Dayjs | null,
    to: Dayjs | null
  ): number => {

    const fromDate = from ? from : dayjs(fiscalYearStart);  
    const toDate = from ? to : dayjs(fiscalYearEnd);

    if (!fromDate.isValid() || !toDate?.isValid()) return new Date().getFullYear() - 2022;

    const fiscalYearStartMonth = 6; // July is the 6th month (0-indexed)
    const fiscalYearStartDay = 1; // Fiscal year starts on the 1st of July
    

    const fromFiscalYearStart = dayjs(fromDate).isSameOrAfter(
      dayjs(`${fromDate.year()}-${fiscalYearStartMonth + 1}-${fiscalYearStartDay}`)
    )
      ? fromDate.year()
      : fromDate.year() - 1;

    const toFiscalYearStart = dayjs(to).isSameOrAfter(
      dayjs(`${toDate.year()}-${fiscalYearStartMonth + 1}-${fiscalYearStartDay}`)
    )
      ? toDate.year()
      : toDate.year() - 1;

    const yearsDifference = Math.min(
      toFiscalYearStart - fromFiscalYearStart + 1,
      3
    ); // Cap at 3 years
    return Math.max(yearsDifference, 1); // Ensure at least 1 year
  };

  const yearsMultiplier = useMemo(
    () => calculateYearDifference(from, to),
    [from, to, fiscalYearStart, fiscalYearEnd]
  );

  // Calculate total funding and admin funding
  const totalFunding = useMemo(
    () => parseInt(grant.grant_amount) * yearsMultiplier,
    [grant.grant_amount, yearsMultiplier]
  );
  const totalAdminFunding = useMemo(
    () => parseInt(grant.admin_amount) * yearsMultiplier,
    [grant.admin_amount, yearsMultiplier]
  );

  // Filter applications and calculate approved funds
  // Filter applications and calculate approved funds
  const approvedApplications = useMemo(
    () =>
      applications
        .filter((app) => !app.status.name.includes("PFY")) // Exclude any status with PFY
        .filter((app) =>
          [
            "Grant Agreement Signed/Sealed/Returned",
            "Paid in Full",
            "Revised per COR",
            "Authorized by DEQ",
            "Authorized by ORWA",
            "Committee Approved",
            "Award Letter Sent",
          ].includes(app.status.name)
        ),
    [applications]
  );

  // Calculate total requested grant funds
  const totalRequested = useMemo(
    () =>
      applications
        .filter(
          (app) =>
            !["Not Approved", "Change Order"].includes(app.status.name) &&
            !app.status.name.includes("PFY") // Exclude any status with PFY
        )
        .reduce(
          (total, app) =>
            total + (parseInt(app.requested_grant_amount.toString() || "0") || 0),
          0
        ),
    [applications]
  );

  const approvedFunds = useMemo(
    () =>
      approvedApplications.reduce(
        (total, app) => total + (app.award_amount || 0),
        0
      ),
    [approvedApplications]
  );

  // Calculate total admin and awarded payouts
  const totalAdminPayouts = useMemo(
    () =>
      payouts
        .filter((payout) => payout.type === "Administrative")
        .reduce((total, payout) => total + payout.amount, 0),
    [payouts]
  );

  const totalAwardedPayouts = useMemo(
    () =>
      payouts
        .filter((payout) => payout.type === "Reimbursement")
        .reduce((total, payout) => total + payout.amount, 0),
    [payouts]
  );

  const rootFunding = dayjs(fiscalYearEnd).year() === 2025 ? totalFunding + (parseInt(grant.admin_amount) + fy1CloseoutBalance + fy1AdminFundsRemaining + fy2AdminFundsRemaining) : totalFunding + parseInt(grant.admin_amount);
  const totalRootFunding =  dayjs(fiscalYearEnd).year() === 2025 ? totalFunding + (fy1CloseoutBalance + fy1AdminFundsRemaining + fy2AdminFundsRemaining) : totalFunding;
  
  // Chart data
  const chartData = useMemo(
    () => [
      {
        id: "root",
        name: "Funding",
        color: theme.palette.success.main,
        value: rootFunding,
      },
      {
        id: "funding",
        name: "Funds Available",
        parent: "root",
        color: theme.palette.success.dark,
        value: totalRootFunding,
      },
      {
        id: "admin",
        name: "Admin Funding",
        parent: "root",
        color: theme.palette.secondary.main,
        value: totalAdminFunding,
      },
      {
        id: "requested",
        name: "Requested Grant Funds",
        parent: "funding",
        color: theme.palette.success.light,
        value: totalRequested,
      },
     
      {
        id: "approved",
        name: "Funds Approved",
        parent: "requested",
        color: theme.palette.primary.main,
        value: approvedFunds,
      },
      {
        id: "applied_not_approved",
        name: "Awaiting Approval",
        parent: "requested",
        color: theme.palette.warning.main,
        value: totalRequested - approvedFunds,
      },
      {
        name: "Funds Still Available",
        parent: "funding",
        color: theme.palette.error.main,
        value: totalRootFunding - approvedFunds,
      },
      {
        id: "disbursed",
        name: "Funds Disbursed",
        parent: "approved",
        color: theme.palette.error.light,
        value: totalAwardedPayouts,
      },
      {
        id: "undistributed",
        name: "Undistributed Funds",
        parent: "approved",
        color: theme.palette.warning.dark,
        value: approvedFunds - totalAwardedPayouts,
      },
      {
        id: "admin_disbursed",
        name: "Admin Funds Disbursed",
        parent: "admin",
        color: theme.palette.secondary.dark,
        value: Math.round(totalAdminPayouts),
      },
      {
        id: "admin_available",
        name: "Admin Funds Available",
        parent: "admin",
        color: theme.palette.secondary.light,
        value: Math.round(totalAdminFunding - totalAdminPayouts),
      },
      {
        id: "closeout",
        name: "Closeout Funds Remaining",
        parent: "root",
        color: theme.palette.error.main,
        value: lastCloseoutBalance,
      },
    ],
    [
      totalFunding,
      totalAdminFunding,
      totalRequested,
      approvedFunds,
      totalAwardedPayouts,
      totalAdminPayouts,
      lastCloseoutBalance,
      fiscalYearStart,
      fiscalYearEnd,
      fy1CloseoutBalance,
      fy1AdminFundsRemaining,
      fy2AdminFundsRemaining,
      theme,
    ]
  );

  // Handle node selection in the chart
  const handleNodeSelection = (nodeId: string) => {
    if (nodeId === selectedNode) {
      const currentNode = chartData.find((d) => d.id === selectedNode);
      if (currentNode?.parent) setSelectedNode(currentNode.parent);
    } else {
      const children = chartData.filter((d) => d.parent === nodeId);
      if (children.length > 0 || nodeId === "root") setSelectedNode(nodeId);
    }
  };

  // Get filtered data based on the selected node
  const getChildrenWithParent = (parentId: string = ""): any[] => {
    const parent = chartData.find((d) => d.id === parentId);
    const children = chartData
      .filter((d) => d.parent === parentId)
      .flatMap((child) => [child, ...getChildrenWithParent(child.id)]);
    return parentId === selectedNode && parent
      ? [parent, ...children]
      : children;
  };

  const filteredData = useMemo(
    () =>
      selectedNode === "root" ? chartData : getChildrenWithParent(selectedNode),
    [selectedNode, chartData]
  );

  // Highcharts options
  const chartOptions = useMemo(
    () => ({
      chart: {
        type: "sunburst",
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.background.paper,
        spacing: [10, 10, 10, 10],
      },
      title: {
        text: `Funding (${
          from && to
            ? `${dayjs(fiscalYearStart).get("year")} - ${dayjs(fiscalYearEnd).get("year")}`
            : "Totals"
        })`,
        style: { color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary, fontSize: "18px" },
      },
      series: [
        {
          type: "sunburst",
          data: chartData,
          allowDrillToNode: true,
          cursor: "pointer",
          events: {
            click: (e: any) => e.point && handleNodeSelection(e.point.id),
          },
          dataLabels: { format: "{point.name}", style: { color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary } },
        },
      ],
      tooltip: {
        useHTML: true,
        formatter: function (): any {
          return `<b>${(this as any).point.name}</b>: $${(
            this as any
          ).point.value.toLocaleString()}`;
        },
      },
      plotOptions: {
        sunburst: { allowDrillToNode: true, levelIsConstant: false },
      },
      drilldown: {
        breadcrumbs: {
          floating: false,
          position: { align: "center", verticalAlign: "top", y: -30 },
          buttonTheme: {
            fill: "transparent",
            style: { color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary, fontWeight: "bold" },
            states: {
              hover: { fill: "transparent", style: { color: theme.palette.warning.main } },
            },
          },
          showFullPath: false,
        },
      },
    }),
    [chartData, from, to, lastCloseoutBalance, theme]
  );

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.background.paper,
        px: 2,
        py: 1,
        borderRadius: "10px",
        color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
        border: theme.palette.mode === 'light' ? `1px solid ${theme.palette.divider}` : 'none',
      }}
    >
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      <Grid container spacing={2} sx={{ mt: -2 }}>
        {filteredData.map((metric, index) => (
          <Grid item xs={filteredData.length> 5 ? 4 : 6} key={index}>
            <Box
              sx={{
                textAlign: "center",
                borderTop: `4px solid ${metric.color}`,
              }}
            >
              <Typography fontSize="0.9rem" sx={{ color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary }}>
                {metric.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: "1rem",
                  color: metric.color,
                  fontWeight: "bold",
                }}
              >
                {formatNumber(metric.value)}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default WidgetFundAllocation;
