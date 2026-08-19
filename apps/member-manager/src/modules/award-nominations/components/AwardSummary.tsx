import React, { useMemo, useState } from "react";
import { Box, Dialog, DialogContent, DialogTitle, MenuItem, Select, Typography } from "@mui/material";
import { Loading, useGetList } from "react-admin";
import { useSummaryTokens } from "../../grant-manager/grants/components/summary/tokens";
import { useAwardContext } from "../AwardContextProvider";
import { calendarYearChoices } from "../helpers/listFilters";
import { AwardNomination, buildAwardMetrics } from "../helpers/metrics";
import CountCard from "../../orwef-scholarships/components/CountCard";

const AwardSummary = () => {
  const T = useSummaryTokens();
  const { year, setYear } = useAwardContext();
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const { data, isLoading } = useGetList<AwardNomination>("award-nominations", {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: "award_year", order: "DESC" },
  });
  const metrics = useMemo(
    () => buildAwardMetrics(data || [], year),
    [data, year]
  );

  if (isLoading) return <Loading />;

  const typeRows = Object.entries(metrics.byType).filter(([, count]) => count > 0);
  const yearRows = Object.entries(metrics.byYear)
    .map(([label, count]) => [label, count] as const)
    .sort((a, b) => Number(b[0]) - Number(a[0]));

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
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography sx={{ color: T.textHi, fontWeight: 700, fontSize: 18 }}>
          ORWA Awards
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Select
            size="small"
            value={year}
            onChange={(event) =>
              setYear(
                event.target.value === "all" ? "all" : Number(event.target.value)
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
            sx={{ background: "none", border: 0, color: T.water, cursor: "pointer" }}
          >
            Glossary
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 3 }}>
        <CountCard
          label="Nominations"
          caption={year === "all" ? "All years" : `Award year ${year}`}
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
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 2,
        }}
      >
        <Panel title="By award type" rows={typeRows} />
        <Panel title="By year" rows={yearRows} />
      </Box>
      <Dialog open={glossaryOpen} onClose={() => setGlossaryOpen(false)}>
        <DialogTitle>What these counts mean</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 1 }}>
            <strong>Winner / Runner Up</strong> are the committee outcomes.
            Submitted and Under Review are still in play.
          </Typography>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

const Panel = ({
  title,
  rows,
}: {
  title: string;
  rows: (readonly [string, number])[];
}) => {
  const T = useSummaryTokens();
  if (!rows.length) return null;
  return (
    <Box
      sx={{
        backgroundColor: T.panel,
        border: `1px solid ${T.line}`,
        borderRadius: "14px",
        p: 2,
      }}
    >
      <Typography sx={{ color: T.textLo, fontSize: 12, mb: 1 }}>
        {title.toUpperCase()}
      </Typography>
      {rows.map(([label, count]) => (
        <Box
          key={label}
          sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}
        >
          <Typography sx={{ color: T.textHi, fontSize: 13 }}>{label}</Typography>
          <Typography sx={{ color: T.textHi, fontSize: 13 }}>{count}</Typography>
        </Box>
      ))}
    </Box>
  );
};

export default AwardSummary;
