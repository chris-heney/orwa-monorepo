import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { RaRecord, useStore } from "react-admin";
import dayjs from "dayjs";
import { display, money, useSummaryTokens } from "./tokens";
import { Panel, SectionLabel, useToggleSx } from "./cards";
import { num, Showtime } from "./useConferenceMetrics";

type Measure = "registrations" | "revenue";
type Mode = "cumulative" | "weekly";

const regDate = (r: RaRecord): dayjs.Dayjs | null => {
  const d = (r.createdAt as string) || (r.registration_date as string);
  if (!d) return null;
  const parsed = dayjs(d);
  return parsed.isValid() ? parsed : null;
};

/** Shift a date onto the selected year so last season overlays this one. */
const mapToYear = (d: dayjs.Dayjs, targetYear: number): dayjs.Dayjs =>
  d.year(targetYear);

const buildPoints = (
  regs: RaRecord[],
  measure: Measure,
  mode: Mode,
  targetYear: number | null
): [number, number][] => {
  const buckets = new Map<number, number>();
  for (const r of regs) {
    let d = regDate(r);
    if (!d) continue;
    if (targetYear != null) d = mapToYear(d, targetYear);
    const key = (mode === "weekly" ? d.startOf("week") : d.startOf("day")).valueOf();
    const inc = measure === "revenue" ? num(r.total) : 1;
    buckets.set(key, (buckets.get(key) || 0) + inc);
  }
  const sorted = Array.from(buckets.entries()).sort((a, b) => a[0] - b[0]);
  if (mode === "weekly") return sorted;
  let running = 0;
  return sorted.map(([ts, v]) => {
    running += v;
    return [ts, running];
  });
};

const MEASURES: { key: Measure; label: string }[] = [
  { key: "registrations", label: "Registrations" },
  { key: "revenue", label: "Revenue" },
];

const MODES: { key: Mode; label: string }[] = [
  { key: "cumulative", label: "Cumulative" },
  { key: "weekly", label: "Per Week" },
];

/**
 * Registration pace: this season's sign-up curve with last season replayed on
 * the same calendar dates. The question it answers: are we ahead or behind?
 */
const RegistrationMomentum: React.FC<{
  registrations: RaRecord[];
  priorRegistrations: RaRecord[];
  year?: number;
  showtime: Showtime | null;
}> = ({ registrations, priorRegistrations, year, showtime }) => {
  const T = useSummaryTokens();
  const toggleSx = useToggleSx();
  const [measure, setMeasure] = useStore<Measure>(
    "conference.momentumMeasure",
    "registrations"
  );
  const [mode, setMode] = useStore<Mode>("conference.momentumMode", "cumulative");

  const isMoney = measure === "revenue";

  const options = useMemo((): Highcharts.Options => {
    const current = buildPoints(registrations, measure, mode, null);
    const prior =
      year != null && priorRegistrations.length
        ? buildPoints(priorRegistrations, measure, mode, year)
        : [];

    const plotLines: Highcharts.XAxisPlotLinesOptions[] = [];
    if (showtime?.startDate && (showtime.mode === "countdown" || showtime.mode === "live" || showtime.mode === "wrapped")) {
      plotLines.push({
        value: dayjs(showtime.startDate).valueOf(),
        color: T.committed,
        dashStyle: "ShortDash",
        width: 1.5,
        zIndex: 4,
        label: {
          text: "Doors open",
          style: { color: T.committed, fontSize: "10px", fontWeight: "600" },
          rotation: 0,
          y: 12,
        },
      });
    }

    const series: Highcharts.SeriesOptionsType[] = [];
    if (mode === "cumulative") {
      series.push({
        type: "area",
        name: year != null ? `${year}` : "All time",
        data: current,
        color: T.water,
        lineWidth: 2.5,
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, `${T.water}59`],
            [1, `${T.water}05`],
          ],
        },
        marker: { enabled: false },
      });
      if (prior.length) {
        series.push({
          type: "line",
          name: `${(year as number) - 1} pace`,
          data: prior,
          color: T.textFaint,
          dashStyle: "Dash",
          lineWidth: 1.75,
          marker: { enabled: false },
        });
      }
    } else {
      series.push({
        type: "column",
        name: year != null ? `${year}` : "All time",
        data: current,
        color: T.water,
        borderWidth: 0,
        borderRadius: 3,
      });
      if (prior.length) {
        series.push({
          type: "column",
          name: `${(year as number) - 1} pace`,
          data: prior,
          color: `${T.textFaint}88`,
          borderWidth: 0,
          borderRadius: 3,
        });
      }
    }

    return {
      chart: {
        backgroundColor: "transparent",
        style: { fontFamily: display.fontFamily },
        height: 300,
        spacingTop: 8,
      },
      title: { text: undefined },
      credits: { enabled: false },
      xAxis: {
        type: "datetime",
        lineColor: T.line,
        tickColor: T.line,
        labels: { style: { color: T.textLo, fontSize: "10px" } },
        plotLines,
      },
      yAxis: {
        title: { text: undefined },
        min: 0,
        gridLineColor: T.line,
        labels: {
          style: { color: T.textFaint, fontSize: "10px" },
          formatter: function () {
            return isMoney
              ? money(Number(this.value), true)
              : Number(this.value).toLocaleString();
          },
        },
      },
      legend: {
        enabled: series.length > 1,
        itemStyle: { color: T.textLo, fontWeight: "500" },
        itemHoverStyle: { color: T.textHi },
      },
      tooltip: {
        backgroundColor: T.panelSoft,
        style: { color: T.textHi },
        xDateFormat: mode === "weekly" ? "Week of %b %e" : "%b %e, %Y",
        formatter: function () {
          const value = isMoney
            ? money(this.y as number)
            : (this.y as number).toLocaleString();
          const when = dayjs(this.x as number).format(
            mode === "weekly" ? "[Week of] MMM D" : "MMM D, YYYY"
          );
          return `<b>${when}</b><br/>${this.series.name}: ${value}`;
        },
      },
      plotOptions: {
        series: { animation: { duration: 700 } },
        column: { groupPadding: 0.1, pointPadding: 0.05 },
      },
      series,
    };
  }, [registrations, priorRegistrations, measure, mode, year, showtime, T, isMoney]);

  return (
    <Panel>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1,
          mb: 1,
        }}
      >
        <SectionLabel
          caption={
            year != null && priorRegistrations.length
              ? `Dashed line replays ${year - 1} on the same calendar dates`
              : "Sign-up pace across the registration season"
          }
        >
          Registration Pace
        </SectionLabel>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
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
          <ToggleButtonGroup
            size="small"
            exclusive
            value={mode}
            onChange={(_, v) => v && setMode(v)}
            sx={toggleSx}
          >
            {MODES.map((m) => (
              <ToggleButton key={m.key} value={m.key}>
                {m.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Panel>
  );
};

export default RegistrationMomentum;
