import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { useStore } from "react-admin";
import { display, useSummaryTokens } from "./tokens";
import { MetricChip, Panel, SectionLabel, useToggleSx } from "./cards";
import { ConferenceMetrics } from "./useConferenceMetrics";

type View = "tickets" | "orgs";

/**
 * Who's coming: badge mix or organization leaderboard up top, with the
 * numbers a program chair actually plans rooms around underneath — training
 * seats, the voting floor, and speakers.
 */
const CrowdPanel: React.FC<{ metrics: ConferenceMetrics }> = ({ metrics }) => {
  const T = useSummaryTokens();
  const toggleSx = useToggleSx();
  const [view, setView] = useStore<View>("conference.crowdView", "tickets");
  const { ticketMix, orgLeaderboard, training, voting, speakers, voterOnly } =
    metrics;

  const options = useMemo((): Highcharts.Options => {
    const rows = (view === "tickets" ? ticketMix : orgLeaderboard).slice(0, 10);
    const color = view === "tickets" ? T.water : T.inflow;
    return {
      chart: {
        backgroundColor: "transparent",
        style: { fontFamily: display.fontFamily },
        type: "bar",
        height: Math.max(220, rows.length * 32 + 70),
      },
      title: { text: undefined },
      credits: { enabled: false },
      xAxis: {
        categories: rows.map((r) => r.name),
        labels: { style: { color: T.textLo, fontSize: "11px" } },
        lineColor: T.line,
        gridLineWidth: 0,
      },
      yAxis: {
        title: { text: undefined },
        allowDecimals: false,
        labels: { style: { color: T.textFaint, fontSize: "10px" } },
        gridLineColor: T.line,
      },
      legend: { enabled: false },
      tooltip: {
        backgroundColor: T.panelSoft,
        style: { color: T.textHi },
        formatter: function () {
          const p = this as unknown as { key: string; y: number };
          return `<b>${p.key}</b><br/>${p.y.toLocaleString()} ${
            view === "tickets" ? "badges" : "attendees"
          }`;
        },
      },
      plotOptions: {
        bar: {
          borderWidth: 0,
          borderRadius: 3,
          animation: { duration: 700 },
          groupPadding: 0.08,
          pointPadding: 0.04,
          color,
          dataLabels: {
            enabled: true,
            style: {
              color: T.textLo,
              fontSize: "10px",
              fontWeight: "600",
              textOutline: "none",
            },
          },
        },
      },
      series: [
        {
          type: "bar",
          name: view === "tickets" ? "Badges" : "Attendees",
          data: rows.map((r) => r.count),
        },
      ],
    };
  }, [view, ticketMix, orgLeaderboard, T]);

  const hasRows = (view === "tickets" ? ticketMix : orgLeaderboard).length > 0;

  return (
    <Panel>
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
            view === "tickets"
              ? "Badges by ticket type (Voter Only badges excluded)"
              : "Organizations bringing the most people"
          }
        >
          The Crowd
        </SectionLabel>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={view}
          onChange={(_, v) => v && setView(v)}
          sx={toggleSx}
        >
          <ToggleButton value="tickets">Ticket Types</ToggleButton>
          <ToggleButton value="orgs">Organizations</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {hasRows ? (
        <HighchartsReact highcharts={Highcharts} options={options} />
      ) : (
        <Typography
          sx={{ fontSize: 13, color: T.textFaint, fontStyle: "italic", py: 6, textAlign: "center" }}
        >
          No attendees yet for this selection.
        </Typography>
      )}

      <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap", mt: 1.5 }}>
        <MetricChip
          label="Operator Seats"
          value={training.operator}
          tone={T.water}
          hint="Attendees requesting Operator training credit (includes Both)"
        />
        <MetricChip
          label="Board Seats"
          value={training.board}
          tone={T.deepWater}
          hint="Attendees requesting Board training credit (includes Both)"
        />
        <MetricChip
          label="ORWA Voting Floor"
          value={voting.orwaDelegates}
          sub={voting.orwaAlternates ? `+${voting.orwaAlternates} alt` : undefined}
          tone={T.committed}
          hint="Registered ORWA voting delegates (alternates noted)"
        />
        <MetricChip
          label="ORWAAG Voting Floor"
          value={voting.orwaagDelegates}
          sub={voting.orwaagAlternates ? `+${voting.orwaagAlternates} alt` : undefined}
          tone={T.committed}
          hint="Registered ORWAAG voting delegates (alternates noted)"
        />
        <MetricChip label="Voter Only Badges" value={voterOnly} tone={T.violet} />
        <MetricChip label="Speakers" value={speakers} tone={T.inflow} />
      </Box>
    </Panel>
  );
};

export default CrowdPanel;
