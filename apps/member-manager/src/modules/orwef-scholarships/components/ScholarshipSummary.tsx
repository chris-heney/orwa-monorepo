import React, { useMemo, useState } from "react";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import { Loading, useGetList } from "react-admin";
import { useSummaryTokens } from "../../grant-manager/grants/components/summary/tokens";
import { useOrwefContext } from "../OrwefContextProvider";
import { calendarYearChoices } from "../helpers/listFilters";
import {
  buildScholarshipMetrics,
  ScholarshipApplication,
} from "../helpers/metrics";
import CountCard from "./CountCard";
import ScholarshipGlossary from "./ScholarshipGlossary";

const ScholarshipSummary = () => {
  const T = useSummaryTokens();
  const { year, setYear } = useOrwefContext();
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const { data, isLoading } = useGetList<ScholarshipApplication>(
    "scholarship-applications",
    {
      pagination: { page: 1, perPage: 1000 },
      sort: { field: "submission_date", order: "DESC" },
    }
  );

  const metrics = useMemo(
    () => buildScholarshipMetrics(data || [], year),
    [data, year]
  );

  if (isLoading) return <Loading />;

  const relationshipRows = Object.entries(metrics.byRelationship).filter(
    ([, count]) => count > 0
  );
  const systemRows = Object.entries(metrics.bySystem)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const yearRows = Object.entries(metrics.byYear)
    .map(([label, count]) => [Number(label), count] as const)
    .sort((a, b) => b[0] - a[0]);

  return (
    <Box
      sx={{
        backgroundColor: T.ink,
        borderRadius: "0 0 18px 18px",
        px: { xs: 2, md: 3 },
        py: 3,
        minHeight: 360,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          mb: 2,
        }}
      >
        <Typography sx={{ color: T.textHi, fontWeight: 700, fontSize: 18 }}>
          ORWEF Scholarships
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Select
            size="small"
            value={year}
            onChange={(event) =>
              setYear(
                event.target.value === "all"
                  ? "all"
                  : Number(event.target.value)
              )
            }
            sx={{
              color: T.textHi,
              minWidth: 120,
              "& .MuiSelect-icon": { color: T.textLo },
              "& .MuiOutlinedInput-notchedOutline": { borderColor: T.line },
            }}
          >
            {calendarYearChoices().map((value) => (
              <MenuItem key={String(value)} value={value}>
                {value === "all" ? "All years" : value}
              </MenuItem>
            ))}
          </Select>
          <Typography
            component="button"
            onClick={() => setGlossaryOpen(true)}
            sx={{
              background: "none",
              border: 0,
              color: T.water,
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Glossary
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 3 }}>
        <CountCard
          label="Applications"
          caption={year === "all" ? "All years" : `Calendar year ${year}`}
          count={metrics.total}
          color={T.water}
        />
        {metrics.byStatus.map((stage) => (
          <CountCard
            key={stage.status}
            label={stage.label}
            caption={stage.caption}
            count={stage.count}
            color={T.stage[stage.colorKey]}
          />
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
          gap: 2,
        }}
      >
        <Breakdown title="By relationship" rows={relationshipRows} />
        <Breakdown title="By water system" rows={systemRows} />
        <Breakdown
          title="By year"
          rows={yearRows.map(([label, count]) => [String(label), count])}
        />
      </Box>
      <ScholarshipGlossary
        open={glossaryOpen}
        onClose={() => setGlossaryOpen(false)}
      />
    </Box>
  );
};

const Breakdown = ({
  title,
  rows,
}: {
  title: string;
  rows: (readonly [string, number])[];
}) => {
  const T = useSummaryTokens();
  if (rows.length === 0) return null;
  return (
    <Box
      sx={{
        backgroundColor: T.panel,
        border: `1px solid ${T.line}`,
        borderRadius: "14px",
        p: 2,
      }}
    >
      <Typography sx={{ color: T.textLo, fontSize: 12, mb: 1, letterSpacing: "0.08em" }}>
        {title.toUpperCase()}
      </Typography>
      {rows.map(([label, count]) => (
        <Box
          key={label}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            py: 0.5,
            color: T.textHi,
          }}
        >
          <Typography sx={{ fontSize: 13 }}>{label}</Typography>
          <Typography sx={{ fontSize: 13, fontVariantNumeric: "tabular-nums" }}>
            {count}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default ScholarshipSummary;
