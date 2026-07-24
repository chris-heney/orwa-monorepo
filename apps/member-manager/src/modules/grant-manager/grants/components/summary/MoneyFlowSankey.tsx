import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
// Highcharts v12 modules self-register on import
import "highcharts/modules/sankey";
import { Box, Typography } from "@mui/material";
import { useSummaryTokens, display, money } from "./tokens";
import { useGrantMetrics } from "./useGrantMetrics";

type Pool = ReturnType<typeof useGrantMetrics>["pool"];

/** Sankey tracing the fiscal year's money from source to destination. */
const MoneyFlowSankey: React.FC<{ pool: Pool }> = ({ pool }) => {
  const T = useSummaryTokens();
  const options = useMemo((): Highcharts.Options => {
    const links: Array<[string, string, number]> = [];
    const push = (from: string, to: string, weight: number) => {
      if (weight > 0) links.push([from, to, Math.round(weight)]);
    };

    push("Annual Allocation", "Funds Available", pool.annualGrant);
    push("Previous FY Rollover", "Funds Available", pool.previousFyRollover);
    push("Funds Available", "Approved Awards", pool.approvedFunds);
    push("Funds Available", "Still Available", pool.fundsStillAvailable);
    push("Approved Awards", "Disbursed", pool.disbursed);
    push("Approved Awards", "Returned at Closeout", pool.closeoutReturned);
    push(
      "Approved Awards",
      "Committed, Not Yet Paid",
      pool.undistributed - pool.closeoutReturned
    );

    const nodeColors: Record<string, string> = {
      "Annual Allocation": T.water,
      "Previous FY Rollover": T.deepWater,
      "Funds Available": T.water,
      "Approved Awards": T.committed,
      "Still Available": T.inflow,
      Disbursed: T.inflow,
      "Returned at Closeout": T.deepWater,
      "Committed, Not Yet Paid": T.committed,
    };

    return {
      chart: {
        backgroundColor: "transparent",
        height: 380,
        style: { fontFamily: display.fontFamily },
      },
      title: { text: undefined },
      credits: { enabled: false },
      tooltip: {
        backgroundColor: T.panelSoft,
        style: { color: T.textHi },
      },
      series: [
        {
          type: "sankey",
          keys: ["from", "to", "weight"],
          tooltip: {
            nodeFormatter: function () {
              const node = this as unknown as { name: string; sum: number };
              return `<b>${node.name}</b><br/>${money(node.sum)}`;
            },
            pointFormatter: function () {
              const p = this as unknown as {
                fromNode: { name: string };
                toNode: { name: string };
                weight: number;
              };
              return `${p.fromNode.name} → ${p.toNode.name}: <b>${money(p.weight)}</b>`;
            },
          },
          animation: { duration: 900 },
          linkOpacity: 0.35,
          nodeWidth: 14,
          nodePadding: 18,
          nodes: Object.entries(nodeColors).map(([id, color]) => ({
            id,
            color,
          })),
          dataLabels: {
            style: {
              color: T.textHi,
              textOutline: "none",
              fontWeight: "600",
              fontSize: "12px",
            },
          },
          data: links,
        },
      ],
    };
  }, [pool, T]);

  return (
    <Box
      sx={{
        backgroundColor: T.panel,
        border: `1px solid ${T.line}`,
        borderRadius: "14px",
        p: 2,
      }}
    >
      <Typography
        sx={{
          ...display,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: T.textLo,
          mb: 1,
        }}
      >
        How this year&apos;s money flows
      </Typography>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Box>
  );
};

export default MoneyFlowSankey;
