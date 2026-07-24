import React, { useState, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
// Highcharts v12 modules self-register on import
import "highcharts/modules/sunburst";
import "highcharts/modules/drilldown";
import { Box, Typography } from "@mui/material";
import { IGrantApplication } from "../../grant-application/GrantApplicationTypes";
import { IGrant, IGrantPayout } from "./GrantTypes";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { useGrantContext } from "../../GrantContextProvider";
import { display, money, useSummaryTokens, SummaryTokens } from "./summary/tokens";
import {
  aggregatePathways,
  flattenPathways,
  FlatPathwayNode,
  PathwayValue,
} from "./summary/pathways/model";

dayjs.extend(isSameOrAfter);

interface IWidgetFundAllocationProps {
  applications: IGrantApplication[];
  payouts: IGrantPayout[];
  grant: IGrant;
  to: Dayjs | null;
  from: Dayjs | null;
  previousFyRollover: number;
}

/** Lighten/darken a token color for sibling shades within a branch. */
const shade = (color: string, amount: number): string =>
  Highcharts.color(color).brighten(amount).get() as string;

/**
 * Slice colors follow the summary token families: violet = administration,
 * blue = requests/review, amber = committed (reserved), green = money
 * available or moved, red = exits (denied/withdrawn).
 */
const colorsFor = (T: SummaryTokens): Record<string, string> => ({
  total: T.deepWater,

  admin: T.violet,
  admin_available: shade(T.violet, 0.28),
  admin_unapproved: shade(T.violet, 0.38),
  admin_reserved: shade(T.violet, -0.08),
  admin_approved: shade(T.violet, -0.16),
  admin_paid: shade(T.violet, -0.24),
  admin_paid_full: shade(T.violet, -0.32),
  admin_paid_partial: shade(T.violet, -0.38),
  admin_invoiced: shade(T.violet, 0.12),
  admin_undisbursed: shade(T.violet, 0.16),

  grant: T.water,
  grant_available: T.inflow,
  unapproved: shade(T.exit, 0.08),
  denied: T.exit,
  withdrawn: shade(T.exit, 0.28),
  unclaimed: shade(T.inflow, -0.14),
  grant_reserved: T.committed,
  approved: shade(T.committed, -0.1),
  disbursed: T.stage.disbursed,
  paid_full: T.stage.paid,
  paid_partial: shade(T.stage.disbursed, 0.18),
  undisbursed: T.stage.signed,
  needing_signature: shade(T.stage.signed, -0.14),
  awaiting_payment_request: shade(T.stage.signed, 0.18),
  under_review: T.stage.review,
  awaiting_approval: shade(T.stage.review, -0.14),
  awaiting_committee: shade(T.stage.review, 0.14),
  on_hold: T.textFaint,
});

interface VisibleNode extends FlatPathwayNode {
  value: PathwayValue;
  color: string;
  /** True when none of this node's children carry data (chart leaf). */
  isLeaf: boolean;
}

const countText = (value: PathwayValue): string | null =>
  value.count === null
    ? null
    : `${value.count.toLocaleString()} application${value.count === 1 ? "" : "s"}`;

const WidgetFundAllocation: React.FC<IWidgetFundAllocationProps> = ({
  applications,
  payouts,
  grant,
  previousFyRollover,
}) => {
  const T = useSummaryTokens();
  const [selectedNode, setSelectedNode] = useState<string>("total");

  const { to, from, fiscalYearEnd, fiscalYearStart } = useGrantContext();

  // Calculate the fiscal year difference between `from` and `to` dates
  const calculateYearDifference = (
    from: Dayjs | null,
    to: Dayjs | null
  ): number => {
    const fromDate = from ? from : dayjs(fiscalYearStart);
    const toDate = from ? to : dayjs(fiscalYearEnd);

    if (!fromDate.isValid() || !toDate?.isValid())
      return new Date().getFullYear() - 2022;

    const fiscalYearStartMonth = 6; // July is the 6th month (0-indexed)
    const fiscalYearStartDay = 1; // Fiscal year starts on the 1st of July

    const fromFiscalYearStart = dayjs(fromDate).isSameOrAfter(
      dayjs(
        `${fromDate.year()}-${fiscalYearStartMonth + 1}-${fiscalYearStartDay}`
      )
    )
      ? fromDate.year()
      : fromDate.year() - 1;

    const toFiscalYearStart = dayjs(to).isSameOrAfter(
      dayjs(
        `${toDate.year()}-${fiscalYearStartMonth + 1}-${fiscalYearStartDay}`
      )
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

  // Pool numbers for the model. Previous FY rollover feeds the Funds
  // Available total only — it is no longer its own node in the hierarchy.
  const fundsAvailable =
    (parseInt(grant.grant_amount) || 0) * yearsMultiplier + previousFyRollover;
  const adminAllocation =
    (parseInt(grant.admin_amount) || 0) * yearsMultiplier;
  const adminDisbursed = useMemo(
    () =>
      payouts
        .filter((payout) => payout.type === "Administrative")
        .reduce((total, payout) => total + payout.amount, 0),
    [payouts]
  );

  const visibleNodes = useMemo((): VisibleNode[] => {
    const values = aggregatePathways(applications, payouts, {
      fundsAvailable,
      adminAllocation,
      adminDisbursed,
    });
    const colors = colorsFor(T);
    // A node earns a slice when it holds dollars or applications. Parents are
    // children-sums of non-negative values, so a visible node's ancestors are
    // always visible too ("always 0" nodes hide themselves).
    const flat = flattenPathways().filter((node) => {
      const v = values[node.id];
      return node.id === "total" || v.amount > 0.5 || (v.count ?? 0) > 0;
    });
    const visibleIds = new Set(flat.map((n) => n.id));
    return flat.map((node) => ({
      ...node,
      value: values[node.id],
      color: colors[node.id] ?? T.water,
      isLeaf: !(node.children ?? []).some((c) => visibleIds.has(c.id)),
    }));
  }, [applications, payouts, fundsAvailable, adminAllocation, adminDisbursed, T]);

  // Chart data: only chart-leaves carry values — Highcharts sunburst sizes
  // parents as the sum of their children.
  const chartData = useMemo(
    () =>
      visibleNodes.map((node) => ({
        id: node.id,
        parent: node.parentId ?? "",
        name: node.label,
        color: node.color,
        value: node.isLeaf ? Math.round(node.value.amount) : undefined,
        custom: {
          count: node.value.count,
          amount: node.value.amount,
          dimension: node.dimension,
        },
      })),
    [visibleNodes]
  );

  // Handle node selection in the chart (drives the legend's scope)
  const handleNodeSelection = (nodeId: string) => {
    if (nodeId === selectedNode) {
      const currentNode = visibleNodes.find((d) => d.id === selectedNode);
      if (currentNode?.parentId) setSelectedNode(currentNode.parentId);
    } else {
      const node = visibleNodes.find((d) => d.id === nodeId);
      const hasChildren = visibleNodes.some((d) => d.parentId === nodeId);
      if (node && (hasChildren || nodeId === "total")) setSelectedNode(nodeId);
    }
  };

  // Legend scope: the selected node and its visible subtree, in tree order.
  const legendNodes = useMemo((): VisibleNode[] => {
    const start = visibleNodes.findIndex((n) => n.id === selectedNode);
    if (start === -1) return visibleNodes;
    const scoped = [visibleNodes[start]];
    for (let i = start + 1; i < visibleNodes.length; i++) {
      if (visibleNodes[i].depth <= visibleNodes[start].depth) break;
      scoped.push(visibleNodes[i]);
    }
    return scoped;
  }, [visibleNodes, selectedNode]);

  const baseDepth = legendNodes[0]?.depth ?? 0;

  // Highcharts options
  const chartOptions = useMemo(
    () => ({
      chart: {
        type: "sunburst",
        backgroundColor: "transparent",
        style: { fontFamily: display.fontFamily },
        spacing: [10, 10, 10, 10],
        height: 520,
      },
      title: {
        text: `Total Funding (${
          from && to
            ? `${dayjs(fiscalYearStart).get("year")} - ${dayjs(fiscalYearEnd).get("year")}`
            : "Totals"
        })`,
        style: { color: T.textHi, fontSize: "18px" },
      },
      credits: { enabled: false },
      series: [
        {
          type: "sunburst",
          data: chartData,
          allowDrillToNode: true,
          cursor: "pointer",
          events: {
            click: (e: any) => e.point && handleNodeSelection(e.point.id),
          },
          // Slices are saturated/dark hues in both modes, so labels stay white.
          dataLabels: {
            format: "{point.name}",
            style: { color: "#FFFFFF", textOutline: "none", fontSize: "11px" },
          },
        },
      ],
      tooltip: {
        useHTML: true,
        backgroundColor: T.panelSoft,
        style: { color: T.textHi },
        formatter: function (): string {
          const point = (this as any).point;
          const custom = point.custom ?? {};
          const counts =
            custom.count != null
              ? `${custom.count.toLocaleString()} application${custom.count === 1 ? "" : "s"} · `
              : "";
          return (
            `<b>${point.name}</b><br/>` +
            `<span style="opacity:0.75">${custom.dimension ?? ""}</span><br/>` +
            `${counts}${money(custom.amount ?? point.value ?? 0)}`
          );
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
            style: { color: T.textHi, fontWeight: "bold" },
            states: {
              hover: { fill: "transparent", style: { color: T.committed } },
            },
          },
          showFullPath: false,
        },
      },
    }),
    [chartData, from, to, fiscalYearStart, fiscalYearEnd, T]
  );

  return (
    <Box
      sx={{
        backgroundColor: T.panel,
        border: `1px solid ${T.line}`,
        px: 2,
        py: 1,
        borderRadius: "10px",
        color: T.textHi,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { md: "flex-start" },
          gap: 2,
        }}
      >
        {/* Sunburst gets the lion's share of the width */}
        <Box sx={{ flex: { md: "1 1 64%" }, minWidth: 0, width: "100%" }}>
          <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        </Box>

        {/* Legend: single stacked column on the right (below on small screens) */}
        <Box
          sx={{
            flex: { md: "0 0 34%" },
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            pt: { md: 5 },
            pb: 1,
            maxHeight: { md: 500 },
            overflowY: { md: "auto" },
            "&::-webkit-scrollbar": { width: 6 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: T.panelSoft,
              borderRadius: 3,
            },
          }}
        >
          {legendNodes.map((node) => {
            const counts = countText(node.value);
            const drillable =
              visibleNodes.some((d) => d.parentId === node.id) ||
              node.id === "total";
            return (
              <Box
                key={node.id}
                onClick={() => drillable && handleNodeSelection(node.id)}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                  ml: (node.depth - baseDepth) * 1.5,
                  px: 1,
                  py: 0.4,
                  borderRadius: "8px",
                  cursor: drillable ? "pointer" : "default",
                  backgroundColor:
                    node.id === selectedNode ? T.panelSoft : "transparent",
                  "&:hover": { backgroundColor: T.panelSoft },
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    mt: 0.55,
                    flex: "0 0 auto",
                    borderRadius: "3px",
                    backgroundColor: node.color,
                  }}
                />
                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 12.5,
                      fontWeight: 600,
                      color: T.textHi,
                      lineHeight: 1.25,
                    }}
                  >
                    {node.label}
                    <Box
                      component="span"
                      sx={{ ml: 0.75, fontSize: 10, color: T.textFaint }}
                    >
                      {node.dimension}
                    </Box>
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 11.5,
                      color: T.textLo,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {counts ? `${counts} · ` : ""}
                    <Box component="span" sx={{ color: node.color, fontWeight: 700 }}>
                      {money(node.value.amount)}
                    </Box>
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default WidgetFundAllocation;
