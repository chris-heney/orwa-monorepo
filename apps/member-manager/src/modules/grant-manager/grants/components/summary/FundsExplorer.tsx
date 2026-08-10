import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
// Highcharts v12 modules self-register on import
import "highcharts/modules/treemap";
import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { SummaryTokens, useSummaryTokens, display, money } from "./tokens";
import { BreakdownRow, Dimension, EdgeBreakdownRow } from "./useGrantMetrics";
import { EDGE_NODES, EdgeNodeKey } from "./pathways/model";

type Measure = "breakdown" | "requested" | "approved" | "disbursed";

const DIMENSIONS: { key: Dimension; label: string }[] = [
  { key: "project", label: "Project Type" },
  { key: "county", label: "County" },
  { key: "senate", label: "Senate" },
  { key: "house", label: "House" },
  { key: "congress", label: "Congressional" },
];

const measuresFor = (
  T: SummaryTokens
): { key: Measure; label: string; color: string }[] => [
  // Default: raw requested dollars stacked by lifecycle endpoint.
  { key: "breakdown", label: "Breakdown", color: T.textHi },
  // "Reserved" basis: breakdown rows already subtract withdrawn/denied asks.
  { key: "requested", label: "Reserved", color: T.water },
  { key: "approved", label: "Approved", color: T.committed },
  { key: "disbursed", label: "Disbursed", color: T.inflow },
];

/**
 * Edge-node segment colors follow the stage ramp: blue pipeline → amber
 * commitments → green paid, with violet for parked and red for exited asks.
 */
const edgeColorsFor = (T: SummaryTokens): Record<EdgeNodeKey, string> => ({
  awaiting_committee: T.stage.review,
  awaiting_approval: T.stage.received,
  awaiting_signature: T.stage.approved,
  approved: T.stage.signed,
  paid_partial: T.stage.disbursed,
  paid_full: T.stage.paid,
  on_hold: T.stage.cor,
  denied_withdrawn: T.stage.declined,
});

const toggleSxFor = (T: SummaryTokens) => ({
  "& .MuiToggleButton-root": {
    color: T.textLo,
    borderColor: T.line,
    textTransform: "none",
    fontSize: 12,
    px: 1.5,
    py: 0.4,
    "&.Mui-selected": {
      color: T.textHi,
      backgroundColor: T.panelSoft,
      borderColor: T.line,
    },
    "&:hover": { backgroundColor: T.panelSoft },
  },
});

const baseChart = {
  backgroundColor: "transparent",
  style: { fontFamily: display.fontFamily },
};

const FundsExplorer: React.FC<{
  breakdown: (dimension: Dimension) => BreakdownRow[];
  edgeBreakdown: (dimension: Dimension) => EdgeBreakdownRow[];
}> = ({ breakdown, edgeBreakdown }) => {
  const T = useSummaryTokens();
  const MEASURES = useMemo(() => measuresFor(T), [T]);
  const toggleSx = useMemo(() => toggleSxFor(T), [T]);
  const [dimension, setDimension] = useState<Dimension>("project");
  const [measure, setMeasure] = useState<Measure>("breakdown");

  const rows = useMemo(
    () => breakdown(dimension).filter((r) => r.requested || r.approved || r.disbursed),
    [breakdown, dimension]
  );

  const edgeRows = useMemo(
    () => edgeBreakdown(dimension).filter((r) => r.total > 0),
    [edgeBreakdown, dimension]
  );

  // County keeps its treemap for single measures; the stacked breakdown is
  // always a bar list.
  const useTreemap = dimension === "county" && measure !== "breakdown";

  const options = useMemo((): Highcharts.Options => {
    if (measure === "breakdown") {
      const top = edgeRows.slice(0, 14);
      const categories = top.map((r) => r.name);
      const colors = edgeColorsFor(T);
      const series: Highcharts.SeriesOptionsType[] = EDGE_NODES.map((edge) => ({
        type: "bar" as const,
        name: edge.label,
        color: colors[edge.key],
        data: top.map((r) => Math.round(r.segments[edge.key])),
      })).filter((s) => (s.data as number[]).some((v) => v > 0));

      return {
        chart: {
          ...baseChart,
          type: "bar",
          height: Math.max(320, top.length * 40 + 130),
        },
        title: { text: undefined },
        credits: { enabled: false },
        xAxis: {
          categories,
          labels: { style: { color: T.textLo, fontSize: "11px" } },
          lineColor: T.line,
          gridLineWidth: 0,
        },
        yAxis: {
          title: { text: undefined },
          // Keep series order = stack order, base to tip (pipeline → exits).
          reversedStacks: false,
          labels: {
            style: { color: T.textFaint, fontSize: "10px" },
            formatter: function () {
              return money(Number(this.value), true);
            },
          },
          gridLineColor: T.line,
        },
        legend: {
          enabled: true,
          itemStyle: { color: T.textLo, fontWeight: "500" },
          itemHoverStyle: { color: T.textHi },
        },
        tooltip: {
          backgroundColor: T.panelSoft,
          style: { color: T.textHi },
          formatter: function () {
            const p = this as unknown as {
              key: string;
              y: number;
              total: number;
              series: { name: string };
            };
            return (
              `<b>${p.key}</b><br/>` +
              `${p.series.name}: ${money(p.y)}<br/>` +
              `Total requested: ${money(p.total)}`
            );
          },
        },
        plotOptions: {
          bar: {
            stacking: "normal",
            borderWidth: 0,
            animation: { duration: 700 },
            groupPadding: 0.08,
            pointPadding: 0.04,
          },
        },
        series,
      };
    }

    if (useTreemap) {
      const points = rows
        .map((r) => ({ name: r.name, value: Math.max(r[measure], 0) }))
        .filter((p) => p.value > 0);
      const max = Math.max(...points.map((p) => p.value), 1);
      const color = MEASURES.find((m) => m.key === measure)?.color || T.water;
      return {
        chart: { ...baseChart, type: "treemap", height: 420 },
        title: { text: undefined },
        credits: { enabled: false },
        tooltip: {
          backgroundColor: T.panelSoft,
          style: { color: T.textHi },
          formatter: function () {
            const p = this as unknown as { key: string; point: { value: number } };
            return `<b>${p.key}</b><br/>${money(p.point.value)}`;
          },
        },
        series: [
          {
            type: "treemap",
            layoutAlgorithm: "squarified",
            animation: { duration: 600 },
            levels: [{ level: 1, borderWidth: 2, borderColor: T.ink }],
            dataLabels: {
              style: {
                color: T.textHi,
                textOutline: "none",
                fontWeight: "600",
                fontSize: "11px",
              },
            },
            data: points.map((p) => ({
              ...p,
              color: Highcharts.color(color)
                .setOpacity(0.25 + 0.75 * (p.value / max))
                .get("rgba") as string,
            })),
          },
        ],
      };
    }

    const top = rows.slice(0, 14);
    const categories = top.map((r) => r.name);
    const series: Highcharts.SeriesOptionsType[] = [
      {
        type: "bar",
        name: MEASURES.find((m) => m.key === measure)?.label,
        color: MEASURES.find((m) => m.key === measure)?.color,
        data: top.map((r) => Math.round(r[measure as Exclude<Measure, "breakdown">])),
      },
    ];

    return {
      chart: {
        ...baseChart,
        type: "bar",
        height: Math.max(300, top.length * 34 + 90),
      },
      title: { text: undefined },
      credits: { enabled: false },
      xAxis: {
        categories,
        labels: { style: { color: T.textLo, fontSize: "11px" } },
        lineColor: T.line,
        gridLineWidth: 0,
      },
      yAxis: {
        title: { text: undefined },
        labels: {
          style: { color: T.textFaint, fontSize: "10px" },
          formatter: function () {
            return money(Number(this.value), true);
          },
        },
        gridLineColor: T.line,
      },
      legend: { enabled: false },
      tooltip: {
        backgroundColor: T.panelSoft,
        style: { color: T.textHi },
        formatter: function () {
          const p = this as unknown as {
            key: string;
            y: number;
            series: { name: string };
          };
          return `<b>${p.key}</b><br/>${p.series.name}: ${money(p.y)}`;
        },
      },
      plotOptions: {
        bar: {
          borderWidth: 0,
          borderRadius: 3,
          animation: { duration: 700 },
          groupPadding: 0.08,
          pointPadding: 0.04,
        },
      },
      series,
    };
  }, [rows, edgeRows, measure, useTreemap, T, MEASURES]);

  return (
    <Box
      sx={{
        backgroundColor: T.panel,
        border: `1px solid ${T.line}`,
        borderRadius: "14px",
        p: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          mb: 1.5,
        }}
      >
        <Box>
          <Typography
            sx={{
              ...display,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: T.textLo,
            }}
          >
            Where the money goes
          </Typography>
          <Typography sx={{ fontSize: 11, color: T.textFaint }}>
            {measure === "breakdown"
              ? "Raw requested dollars by where each application sits today — requests can exceed the pool"
              : dimension === "project"
              ? "Attributed by each application's project cost shares when available; otherwise split evenly across selected types"
              : "Grouped by the applicant's location on file"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={dimension}
            onChange={(_, v) => v && setDimension(v)}
            sx={toggleSx}
          >
            {DIMENSIONS.map((d) => (
              <ToggleButton key={d.key} value={d.key}>
                {d.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <ToggleButtonGroup
            size="small"
            exclusive
            value={measure}
            onChange={(_, v) => v && setMeasure(v)}
            sx={toggleSx}
          >
            {MEASURES.map((m) => (
              <ToggleButton key={m.key} value={m.key}>
                {m.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Box>
  );
};

export default FundsExplorer;
