import React, { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import SectionLabel from "./SectionLabel";
import { display, useSummaryTokens } from "./tokens";
import {
  MembershipMetrics,
  useMembershipMetrics,
} from "./useMembershipMetrics";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

type Props = {
  metrics?: MembershipMetrics;
};

/**
 * Year-over-year membership counts — theme-aware Chart.js bars.
 * Historical years are snapshots; the latest year uses expiration-based counts
 * (see glossary footnote).
 */
const YearReportPanel: React.FC<Props> = ({ metrics: metricsProp }) => {
  const T = useSummaryTokens();
  const hooked = useMembershipMetrics();
  const metrics = metricsProp ?? hooked;

  const chartData = useMemo(() => {
    const rows = metrics.yearReport;
    return {
      labels: rows.map((r) => String(r.year)),
      datasets: [
        {
          label: "Water Systems",
          data: rows.map((r) => r.systems),
          backgroundColor: T.water,
          borderRadius: 6,
          maxBarThickness: 42,
        },
        {
          label: "Associates",
          data: rows.map((r) => r.associates),
          backgroundColor: T.committed,
          borderRadius: 6,
          maxBarThickness: 42,
        },
      ],
    };
  }, [metrics.yearReport, T.water, T.committed]);

  const chartOptions = useMemo((): ChartOptions<"bar"> => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: "index", intersect: false },
      plugins: {
        legend: {
          position: "top",
          align: "end",
          labels: {
            color: T.textLo,
            boxWidth: 12,
            boxHeight: 12,
            usePointStyle: true,
            pointStyle: "rectRounded",
            font: { family: display.fontFamily, size: 12, weight: 600 },
          },
        },
        tooltip: {
          backgroundColor: T.panelSoft,
          titleColor: T.textHi,
          bodyColor: T.textLo,
          borderColor: T.line,
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          grid: { color: T.line, drawTicks: false },
          ticks: {
            color: T.textLo,
            font: { family: display.fontFamily, weight: 600 },
          },
          border: { color: T.line },
        },
        y: {
          beginAtZero: true,
          grid: { color: T.line },
          ticks: {
            color: T.textLo,
            font: { family: display.fontFamily },
          },
          border: { display: false },
        },
      },
    };
  }, [T]);

  if (metrics.isLoading) {
    return (
      <Box sx={{ py: 6, textAlign: "center", color: T.textLo }}>
        Loading report…
      </Box>
    );
  }

  return (
    <Box>
      <SectionLabel>Membership over years</SectionLabel>
      <Typography sx={{ fontSize: 12.5, color: T.textFaint, mb: 1.5, maxWidth: 720 }}>
        Side-by-side water system and associate counts. Older years are
        historical snapshots; the current year reflects members whose
        membership has expired by payment rules.
      </Typography>

      <Box
        sx={{
          borderRadius: "14px",
          border: `1px solid ${T.line}`,
          backgroundColor: T.panel,
          p: { xs: 1.5, md: 2 },
          height: 340,
        }}
      >
        <Bar data={chartData} options={chartOptions} />
      </Box>

      <Typography
        sx={{ mt: 1.25, fontSize: 11, color: T.textFaint, fontStyle: "italic" }}
      >
        Glossary · “Expired” for the current year uses payment last / previous
        dates and overlap rules — not the same as the rolling 12-month “Active”
        definition in The roster. A transactions-based year series is planned.
      </Typography>
    </Box>
  );
};

export default YearReportPanel;
