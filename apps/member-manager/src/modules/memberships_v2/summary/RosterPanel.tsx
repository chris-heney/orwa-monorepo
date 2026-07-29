import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import "highcharts/modules/sunburst";
import SectionLabel from "./SectionLabel";
import { MetricChip, RosterCard } from "./MetricChip";
import { display, useSummaryTokens } from "./tokens";
import {
  MembershipMetrics,
  useMembershipMetrics,
} from "./useMembershipMetrics";

type Props = {
  metrics?: MembershipMetrics;
  /** Compact layout for home dashboard cards (~400px). */
  compact?: boolean;
  /** When true, omit the in-panel title (DashboardCard already shows it). */
  hideTitle?: boolean;
};

const RosterPanel: React.FC<Props> = ({
  metrics: metricsProp,
  compact = false,
  hideTitle = false,
}) => {
  const T = useSummaryTokens();
  const hooked = useMembershipMetrics();
  const metrics = metricsProp ?? hooked;

  // Untyped options object — Highcharts sunburst module typings lag the runtime API
  // (same pattern as grant WidgetFundAllocation).
  const chartOptions = useMemo(() => {
    const {
      activeWaterSystems,
      inactiveWaterSystems,
      activeAssociates,
      inactiveAssociates,
    } = metrics;

    return {
      chart: {
        backgroundColor: "transparent",
        // Compact dashboard: fill the taller center column without overflowing.
        height: compact ? 520 : 320,
        style: { fontFamily: display.fontFamily },
      },
      title: { text: undefined },
      credits: { enabled: false },
      tooltip: {
        backgroundColor: T.panelSoft,
        borderColor: T.line,
        style: { color: T.textHi, fontSize: "12px" },
        pointFormat: "<b>{point.name}</b>: {point.value}",
      },
      plotOptions: {
        sunburst: { allowDrillToNode: true, levelIsConstant: false },
      },
      series: [
        {
          type: "sunburst" as const,
          name: "Membership",
          allowDrillToNode: true,
          cursor: "pointer",
          dataLabels: {
            format: "{point.name}",
            filter: { property: "innerArcLength", operator: ">", value: 16 },
            style: {
              // Slice fills are saturated in both modes — labels stay white (grant pattern).
              color: "#FFFFFF",
              textOutline: "none",
              fontWeight: "600",
              fontSize: compact ? "10px" : "11px",
            },
          },
          levels: [
            {
              level: 1,
              levelIsConstant: false,
              dataLabels: {
                filter: { property: "outerArcLength", operator: ">", value: 64 },
              },
            },
            { level: 2, colorByPoint: true },
            {
              level: 3,
              colorVariation: { key: "brightness", to: -0.2 },
            },
          ],
          data: [
            {
              id: "root",
              parent: "",
              name: "Members",
              color: T.panelSoft,
              // Center sits on panelSoft (light in light mode) — use theme text,
              // not the white slice labels used on saturated ring fills.
              dataLabels: {
                style: {
                  color: T.textHi,
                  textOutline: "none",
                  fontWeight: "700",
                },
              },
            },
            {
              id: "systems",
              parent: "root",
              name: "Water Systems",
              color: T.water,
            },
            {
              id: "associates",
              parent: "root",
              name: "Associates",
              color: T.committed,
            },
            {
              id: "ws-active",
              parent: "systems",
              name: "Active",
              value: Math.max(activeWaterSystems, 0),
              color: T.inflow,
            },
            {
              id: "ws-inactive",
              parent: "systems",
              name: "Inactive",
              value: Math.max(inactiveWaterSystems, 0),
              color: T.deepWater,
            },
            {
              id: "assoc-active",
              parent: "associates",
              name: "Active",
              value: Math.max(activeAssociates, 0),
              color: T.inflow,
            },
            {
              id: "assoc-inactive",
              parent: "associates",
              name: "Inactive",
              value: Math.max(inactiveAssociates, 0),
              color: T.exit,
            },
          ],
        },
      ],
    };
  }, [metrics, T, compact]);

  if (metrics.isLoading) {
    return (
      <Box sx={{ py: compact ? 3 : 6, textAlign: "center", color: T.textLo }}>
        Loading roster…
      </Box>
    );
  }

  if (compact) {
    return (
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {!hideTitle ? (
          <Typography
            sx={{
              ...display,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: T.water,
            }}
          >
            Memberships
          </Typography>
        ) : null}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            gap: 1.25,
          }}
        >
          <Box
            sx={{
              flex: "1 1 auto",
              minWidth: 0,
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "& .highcharts-container": { width: "100% !important" },
            }}
          >
            <HighchartsReact
              highcharts={Highcharts}
              options={chartOptions}
              containerProps={{ style: { width: "100%", height: "100%" } }}
            />
          </Box>
          <Box
            sx={{
              // Compact legend — size to content, leave the rest for the sunburst.
              flex: "0 0 auto",
              width: "max-content",
              minWidth: 108,
              maxWidth: 148,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 0.75,
            }}
          >
            {metrics.roster.map((slice) => (
              <Box
                key={slice.key}
                sx={{
                  px: 1,
                  py: 0.7,
                  borderRadius: "8px",
                  border: `1px solid ${T.line}`,
                  borderLeft: `3px solid ${slice.color}`,
                  backgroundColor: T.panel,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 9.5,
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: T.textLo,
                    lineHeight: 1.2,
                  }}
                >
                  {slice.label}
                </Typography>
                <Typography
                  sx={{
                    ...display,
                    fontSize: 18,
                    fontWeight: 700,
                    color: T.textHi,
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1.1,
                  }}
                >
                  {slice.count.toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Box>
        <SectionLabel>The roster</SectionLabel>
        <Typography
          sx={{ fontSize: 12.5, color: T.textFaint, mb: 1.5, maxWidth: 720 }}
        >
          Active means a qualifying payment in the past 12 months. Drill the
          starburst from member type into active / inactive.
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", lg: "row" },
            gap: 2,
            alignItems: "stretch",
          }}
        >
          <Box
            sx={{
              flex: "0 1 360px",
              borderRadius: "14px",
              border: `1px solid ${T.line}`,
              backgroundColor: T.panel,
              px: 1,
              py: 1,
            }}
          >
            <HighchartsReact highcharts={Highcharts} options={chartOptions} />
          </Box>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexWrap: "wrap",
              gap: 1.25,
              alignContent: "flex-start",
            }}
          >
            {metrics.roster.map((slice) => (
              <RosterCard
                key={slice.key}
                label={slice.label}
                count={slice.count}
                caption={slice.caption}
                color={slice.color}
                hint={slice.hint}
              />
            ))}
          </Box>
        </Box>
      </Box>

      <Box>
        <SectionLabel>Signals</SectionLabel>
        <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap" }}>
          <MetricChip
            label="Total Members"
            value={metrics.total}
            tone={T.water}
            hint="Water systems + associates on file"
          />
          <MetricChip
            label="Currently Active"
            value={metrics.activeTotal}
            tone={T.inflow}
          />
          <MetricChip
            label="Active Rate"
            value={metrics.activeRate}
            format="percent"
            tone={T.committed}
            hint="Share of all members with a payment in the past 12 months"
          />
          <MetricChip
            label="Water Systems"
            value={metrics.watersystems.length}
            tone={T.water}
          />
          <MetricChip
            label="Associates"
            value={metrics.associates.length}
            tone={T.committed}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default RosterPanel;
