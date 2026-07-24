import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Box, Typography } from "@mui/material";
import dayjs from "dayjs";
import { useSummaryTokens, display, money } from "./tokens";
import { IGrantPayout } from "../GrantTypes";

/** Cumulative disbursements over time, by the date each check was cut. */
const DisbursementTimeline: React.FC<{ payouts: IGrantPayout[] }> = ({
  payouts,
}) => {
  const T = useSummaryTokens();
  const options = useMemo((): Highcharts.Options => {
    const build = (type: IGrantPayout["type"]) => {
      let running = 0;
      return payouts
        .filter((p) => p.type === type && p.transaction_date)
        .sort(
          (a, b) =>
            dayjs(a.transaction_date.toString()).unix() -
            dayjs(b.transaction_date.toString()).unix()
        )
        .map((p) => {
          running += p.amount || 0;
          return [
            dayjs(p.transaction_date.toString()).valueOf(),
            running,
          ] as [number, number];
        });
    };

    const reimb = build("Reimbursement");
    const admin = build("Administrative");

    return {
      chart: {
        type: "areaspline",
        backgroundColor: "transparent",
        height: 320,
        style: { fontFamily: display.fontFamily },
      },
      title: { text: undefined },
      credits: { enabled: false },
      xAxis: {
        type: "datetime",
        labels: { style: { color: T.textLo, fontSize: "11px" } },
        lineColor: T.line,
        tickColor: T.line,
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
      legend: {
        itemStyle: { color: T.textLo, fontWeight: "500" },
        itemHoverStyle: { color: T.textHi },
      },
      tooltip: {
        backgroundColor: T.panelSoft,
        style: { color: T.textHi },
        formatter: function () {
          const p = this as unknown as {
            x: number;
            y: number;
            series: { name: string };
          };
          return `${dayjs(p.x).format("MMM D, YYYY")}<br/>${p.series.name}: <b>${money(p.y)}</b>`;
        },
      },
      plotOptions: {
        areaspline: {
          marker: { enabled: false },
          lineWidth: 2,
          animation: { duration: 900 },
          fillOpacity: 0.18,
        },
      },
      series: [
        {
          type: "areaspline",
          name: "Reimbursements (cumulative)",
          color: T.inflow,
          data: reimb,
        },
        {
          type: "areaspline",
          name: "Administrative (cumulative)",
          color: T.violet,
          data: admin,
        },
      ].filter((s) => s.data.length > 0) as Highcharts.SeriesOptionsType[],
    };
  }, [payouts, T]);

  if (!payouts.length) return null;

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
        Disbursements over time
      </Typography>
      <Typography sx={{ fontSize: 11, color: T.textFaint, mb: 1 }}>
        Plotted by the date each payment was made
      </Typography>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </Box>
  );
};

export default DisbursementTimeline;
