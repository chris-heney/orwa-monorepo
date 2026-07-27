import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useStore } from "react-admin";
import { display, money, useSummaryTokens } from "./tokens";
import { MetricChip, Panel, SectionLabel, useToggleSx } from "./cards";
import { ConferenceMetrics } from "./useConferenceMetrics";

type View = "source" | "payment";

/**
 * Where the money came from: checkout dollars split by product line, or by
 * how people paid. Center of the donut carries the headline total.
 */
const RevenueMix: React.FC<{ metrics: ConferenceMetrics }> = ({ metrics }) => {
  const T = useSummaryTokens();
  const toggleSx = useToggleSx();
  const [view, setView] = useStore<View>("conference.revenueView", "source");
  const { revenue, paymentMix } = metrics;

  const options = useMemo((): Highcharts.Options => {
    const paymentColors = [T.water, T.inflow, T.committed, T.violet, T.deepWater, T.exit];
    const points =
      view === "source"
        ? [
            { name: "Tickets & Extras", y: revenue.ticketsExtras, color: T.water },
            { name: "Booths", y: revenue.booths, color: T.deepWater },
            { name: "Sponsorships", y: revenue.sponsorships, color: T.committed },
            { name: "Contest Fees", y: revenue.contestants, color: T.violet },
          ].filter((p) => p.y > 0)
        : paymentMix
            .filter((p) => p.amount > 0)
            .slice(0, 6)
            .map((p, i) => ({
              name: p.name,
              y: p.amount,
              color: paymentColors[i % paymentColors.length],
            }));

    return {
      chart: {
        backgroundColor: "transparent",
        style: { fontFamily: display.fontFamily },
        height: 260,
      },
      title: {
        text: `<span style="font-size:22px;font-weight:700;color:${T.textHi}">${money(
          revenue.total,
          true
        )}</span><br/><span style="font-size:10px;letter-spacing:0.1em;color:${T.textLo}">TOTAL</span>`,
        align: "center",
        verticalAlign: "middle",
        useHTML: false,
        y: 10,
      },
      credits: { enabled: false },
      tooltip: {
        backgroundColor: T.panelSoft,
        style: { color: T.textHi },
        formatter: function () {
          const p = this as unknown as {
            key: string;
            y: number;
            percentage: number;
          };
          return `<b>${p.key}</b><br/>${money(p.y)} · ${p.percentage.toFixed(1)}%`;
        },
      },
      plotOptions: {
        pie: {
          innerSize: "68%",
          borderWidth: 2,
          borderColor: T.panel,
          animation: { duration: 600 },
          dataLabels: {
            enabled: true,
            style: {
              color: T.textLo,
              fontSize: "11px",
              fontWeight: "500",
              textOutline: "none",
            },
            formatter: function () {
              const p = this as unknown as { key: string; percentage: number };
              return `${p.key} ${p.percentage.toFixed(0)}%`;
            },
          },
        },
      },
      series: [{ type: "pie", name: "Revenue", data: points }],
    };
  }, [view, revenue, paymentMix, T]);

  return (
    <Panel sx={{ display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <SectionLabel
          caption={
            view === "source"
              ? "Checkout dollars split by product line"
              : "Checkout dollars split by how registrants paid"
          }
        >
          The Take
        </SectionLabel>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={view}
          onChange={(_, v) => v && setView(v)}
          sx={toggleSx}
        >
          <ToggleButton value="source">By Source</ToggleButton>
          <ToggleButton value="payment">By Payment</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {revenue.total > 0 ? (
        <HighchartsReact highcharts={Highcharts} options={options} />
      ) : (
        <Typography
          sx={{ fontSize: 13, color: T.textFaint, fontStyle: "italic", py: 6, textAlign: "center" }}
        >
          No revenue recorded yet for this selection.
        </Typography>
      )}

      <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap", mt: "auto" }}>
        <MetricChip
          label="Avg per Registration"
          value={revenue.avgPerRegistration}
          format="money"
          tone={T.water}
          hint="Total revenue divided by registrations with a nonzero total"
        />
        <MetricChip
          label="Largest Checkout"
          value={revenue.largestRegistration}
          format="money"
          tone={T.committed}
        />
      </Box>
    </Panel>
  );
};

export default RevenueMix;
