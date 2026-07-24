import React, { useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Loading } from "react-admin";
import { DateField } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import httpClient from "../../helpers/ra-strapi-data-provider/src/httpClient";
import SectionLabel from "./summary/SectionLabel";
import { MetricChip } from "./summary/MetricChip";
import { display, money, useSummaryTokens } from "./summary/tokens";

interface IFinancialAudit {
  unearnedTotal: number;
  unearnedDailyAverage: number;
  collectedDailyAverage: number;
  collectedTotal: number;
}

interface IFinancialAuditTotals {
  watersystems: IFinancialAudit;
  associates: IFinancialAudit;
  total: IFinancialAudit;
}

type AuditSlice = {
  label: string;
  watersystems: number;
  associates: number;
  total: number;
  toneWs: string;
  toneAssoc: string;
  toneTotal: string;
  hint: string;
};

/**
 * Unearned / collected membership dues — grant "pool" chip layout with
 * attribution date filter and glossary footnotes.
 */
const FinancialAuditDashboard = () => {
  const T = useSummaryTokens();
  const [financialAuditTotals, setFinancialAuditTotals] = React.useState<
    undefined | IFinancialAuditTotals
  >(undefined);
  const [fromDate, setFromDate] = React.useState<Dayjs>(dayjs());
  const [loadError, setLoadError] = React.useState<string | null>(null);

  useEffect(() => {
    setLoadError(null);
    httpClient(
      `${import.meta.env.VITE_API_ENDPOINT}/api/financial-audit/get-unearned-dues?fromDate=${fromDate.format("YYYY-MM-DD")}`
    )
      .then((response) => {
        setFinancialAuditTotals(
          JSON.parse(response.body) as IFinancialAuditTotals
        );
      })
      .catch(() => {
        setLoadError("Could not load financial audit totals.");
        setFinancialAuditTotals(undefined);
      });
  }, [fromDate]);

  if (loadError) {
    return (
      <Box sx={{ py: 3, color: T.exit }}>
        <Typography>{loadError}</Typography>
      </Box>
    );
  }

  if (typeof financialAuditTotals === "undefined") {
    return <Loading />;
  }

  const rangeLabel = `${fromDate.subtract(1, "year").format("MMM D, YYYY")} – ${fromDate.format("MMM D, YYYY")}`;

  const slices: AuditSlice[] = [
    {
      label: "Unearned membership dues",
      watersystems: financialAuditTotals.watersystems.unearnedTotal,
      associates: financialAuditTotals.associates.unearnedTotal,
      total: financialAuditTotals.total.unearnedTotal,
      toneWs: T.water,
      toneAssoc: T.committed,
      toneTotal: T.exit,
      hint: "Dues recognized as revenue that still cover future periods (deferred)",
    },
    {
      label: "Collected membership dues",
      watersystems: financialAuditTotals.watersystems.collectedTotal,
      associates: financialAuditTotals.associates.collectedTotal,
      total: financialAuditTotals.total.collectedTotal,
      toneWs: T.water,
      toneAssoc: T.committed,
      toneTotal: T.inflow,
      hint: "Cash collected for membership dues in the attribution window",
    },
    {
      label: "Average daily unearned",
      watersystems: financialAuditTotals.watersystems.unearnedDailyAverage,
      associates: financialAuditTotals.associates.unearnedDailyAverage,
      total: financialAuditTotals.total.unearnedDailyAverage,
      toneWs: T.water,
      toneAssoc: T.committed,
      toneTotal: T.violet,
      hint: "Unearned total spread across days in the attribution window",
    },
    {
      label: "Average daily collected",
      watersystems: financialAuditTotals.watersystems.collectedDailyAverage,
      associates: financialAuditTotals.associates.collectedDailyAverage,
      total: financialAuditTotals.total.collectedDailyAverage,
      toneWs: T.water,
      toneAssoc: T.committed,
      toneTotal: T.inflow,
      hint: "Collected total spread across days in the attribution window",
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <SectionLabel>Financial audits</SectionLabel>
          <Typography
            sx={{
              ...display,
              fontSize: { xs: 20, md: 24 },
              fontWeight: 700,
              color: T.textHi,
              lineHeight: 1.15,
            }}
          >
            Unearned Membership Dues
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: 13, color: T.textLo }}>
            Attribution window · {rangeLabel}
          </Typography>
        </Box>

        <Box
          sx={{
            minWidth: 220,
            px: 1.75,
            py: 1.25,
            borderRadius: "12px",
            border: `1px solid ${T.line}`,
            backgroundColor: T.panel,
          }}
        >
          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: T.textLo,
              mb: 0.75,
            }}
          >
            Attribution date
          </Typography>
          <DateField
            label="As of"
            value={fromDate}
            onChange={(d) => d && setFromDate(d as Dayjs)}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                color: T.textHi,
                backgroundColor: T.panelSoft,
                "& fieldset": { borderColor: T.line },
                "&:hover fieldset": { borderColor: T.water },
              },
              "& .MuiInputLabel-root": { color: T.textLo },
              "& .MuiInputLabel-root.Mui-focused": { color: T.water },
            }}
          />
        </Box>
      </Box>

      {/* Hero totals */}
      <Box
        sx={{
          display: "flex",
          gap: 1.5,
          flexWrap: "wrap",
          alignItems: "stretch",
        }}
      >
        <Box
          sx={{
            flex: "1 1 240px",
            px: 2,
            py: 1.5,
            borderRadius: "14px",
            border: `1px solid ${T.line}`,
            background: `linear-gradient(120deg, ${T.exit}22, ${T.panel} 55%)`,
          }}
        >
          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: T.textLo,
            }}
          >
            Total unearned
          </Typography>
          <Typography
            sx={{
              ...display,
              fontSize: 28,
              fontWeight: 700,
              color: T.textHi,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {money(financialAuditTotals.total.unearnedTotal)}
          </Typography>
        </Box>
        <Box
          sx={{
            flex: "1 1 240px",
            px: 2,
            py: 1.5,
            borderRadius: "14px",
            border: `1px solid ${T.line}`,
            background: `linear-gradient(120deg, ${T.inflow}22, ${T.panel} 55%)`,
          }}
        >
          <Typography
            sx={{
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: T.textLo,
            }}
          >
            Total collected
          </Typography>
          <Typography
            sx={{
              ...display,
              fontSize: 28,
              fontWeight: 700,
              color: T.textHi,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {money(financialAuditTotals.total.collectedTotal)}
          </Typography>
        </Box>
      </Box>

      {slices.map((slice) => (
        <Box key={slice.label}>
          <SectionLabel>{slice.label}</SectionLabel>
          <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap" }}>
            <MetricChip
              label="Water Systems"
              value={slice.watersystems}
              format="money"
              tone={slice.toneWs}
              hint={slice.hint}
            />
            <MetricChip
              label="Associates"
              value={slice.associates}
              format="money"
              tone={slice.toneAssoc}
              hint={slice.hint}
            />
            <MetricChip
              label="Total"
              value={slice.total}
              format="money"
              tone={slice.toneTotal}
              hint={slice.hint}
            />
          </Box>
        </Box>
      ))}

      <Typography sx={{ fontSize: 11, color: T.textFaint, fontStyle: "italic" }}>
        Glossary · Unearned dues are the deferred portion of membership
        payments still covering future service days. Collected is cash taken in
        during the rolling year ending on the attribution date. Daily averages
        divide those totals by days in the window.
      </Typography>
    </Box>
  );
};

export default FinancialAuditDashboard;
