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
import { useMembershipYearReport } from "./useMembershipYearReport";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

/**
 * Year-over-year membership counts — theme-aware Chart.js bars.
 * Every bar is a real count of memberships transacted that year, from the
 * invoice ledger.
 */
const YearReportPanel: React.FC = () => {
  const T = useSummaryTokens();
  const { rows, isLoading, error } = useMembershipYearReport();

  const chartData = useMemo(() => {
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
  }, [rows, T.water, T.committed]);

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

  if (isLoading) {
    return (
      <Box sx={{ py: 6, textAlign: "center", color: T.textLo }}>
        Loading report…
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 6, textAlign: "center", color: T.textLo }}>
        Could not load the membership year report.
      </Box>
    );
  }

  return (
    <Box>
      <SectionLabel>Membership over years</SectionLabel>
      <Typography sx={{ fontSize: 12.5, color: T.textFaint, mb: 1.5, maxWidth: 720 }}>
        Water systems and associates by membership year. Recent years are
        counted from recorded payments; earlier years are figures carried over
        from before those records were kept.
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
        {rows.length === 0 ? (
          <Box
            sx={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              color: T.textLo,
              fontSize: 13,
            }}
          >
            No membership transactions recorded yet.
          </Box>
        ) : (
          <Bar data={chartData} options={chartOptions} />
        )}
      </Box>

      <Typography
        sx={{ mt: 1.25, fontSize: 11, color: T.textFaint, fontStyle: "italic" }}
      >
        Glossary · A member counts once per year, in the year their payment was
        recorded. 2021–2023 are carried figures rather than transaction counts.
        Years in between are omitted because payments were not yet being
        recorded for a full year, and a partial count would read as a drop in
        membership rather than the start of record keeping.
      </Typography>
    </Box>
  );
};

export default YearReportPanel;
