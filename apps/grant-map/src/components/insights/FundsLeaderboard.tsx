import React, { useMemo, useState } from "react";
import { Box, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { T, display, money } from "../../theme/tokens";
import {
  BreakdownDimension,
  BreakdownRow,
} from "../../helpers/useMapMetrics";
import { useAppContext } from "../../providers/AppContext";
import { findFilter } from "../../helpers/FiltersService";
import { SectionLabel } from "./StatCards";

const ROW_LIMIT = 12;

const toggleSx = {
  backgroundColor: T.panel,
  border: `1px solid ${T.line}`,
  borderRadius: "10px",
  "& .MuiToggleButton-root": {
    color: T.textLo,
    border: "none",
    px: 1.5,
    py: 0.4,
    textTransform: "none",
    fontSize: 12,
    "&.Mui-selected": {
      color: T.textHi,
      backgroundColor: T.panelSoft,
      boxShadow: `inset 0 -2px 0 ${T.water}`,
    },
    "&:hover": { backgroundColor: T.panelSoft },
  },
} as const;

/**
 * "Where the money goes": top counties or project types ranked by dollars.
 * Amber = approved (committed) money, green = disbursed, blue hairline =
 * requested. County rows double as map filters.
 */
const FundsLeaderboard: React.FC<{
  breakdown: (dimension: BreakdownDimension) => BreakdownRow[];
}> = ({ breakdown }) => {
  const [dimension, setDimension] = useState<BreakdownDimension>("county");
  const [expanded, setExpanded] = useState(false);
  const { filters, setFilters } = useAppContext();

  const rows = useMemo(() => breakdown(dimension), [breakdown, dimension]);
  const visible = expanded ? rows : rows.slice(0, ROW_LIMIT);
  const max = Math.max(...rows.map((r) => Math.max(r.approved, r.requested)), 1);

  const countyFilter = findFilter("county", filters);
  const selectedCounties: string[] = Array.isArray(countyFilter?.value)
    ? (countyFilter?.value as string[])
    : [];

  const toggleCounty = (name: string) => {
    if (dimension !== "county" || name === "Unspecified") return;
    const next = selectedCounties.includes(name)
      ? selectedCounties.filter((c) => c !== name)
      : [...selectedCounties, name];
    const others = filters.filter((f) => f.key !== "county");
    setFilters(next.length ? [...others, { key: "county", value: next }] : others);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 1,
          mb: 1,
        }}
      >
        <SectionLabel>Where the money goes</SectionLabel>
        <ToggleButtonGroup
          size="small"
          exclusive
          value={dimension}
          onChange={(_, v) => v && setDimension(v)}
          sx={toggleSx}
        >
          <ToggleButton value="county">Counties</ToggleButton>
          <ToggleButton value="project">Projects</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box
        sx={{
          backgroundColor: T.panel,
          border: `1px solid ${T.line}`,
          borderRadius: "14px",
          p: 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 0.75,
        }}
      >
        {visible.map((row) => {
          const selected = selectedCounties.includes(row.name);
          const clickable = dimension === "county" && row.name !== "Unspecified";
          return (
            <Box
              key={row.name}
              onClick={() => toggleCounty(row.name)}
              sx={{
                px: 1,
                py: 0.5,
                borderRadius: "8px",
                cursor: clickable ? "pointer" : "default",
                outline: selected ? `1px solid ${T.water}` : "none",
                backgroundColor: selected ? `${T.water}14` : "transparent",
                "&:hover": clickable
                  ? { backgroundColor: T.panelSoft }
                  : undefined,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    ...display,
                    fontSize: 13,
                    fontWeight: 600,
                    color: T.textHi,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {row.name}
                  <Box
                    component="span"
                    sx={{ color: T.textFaint, fontWeight: 500, ml: 0.75, fontSize: 11 }}
                  >
                    {Math.round(row.count)} app{Math.round(row.count) === 1 ? "" : "s"}
                  </Box>
                </Typography>
                <Typography
                  sx={{
                    ...display,
                    fontSize: 13,
                    fontWeight: 700,
                    color: row.approved > 0 ? T.committed : T.textLo,
                    fontVariantNumeric: "tabular-nums",
                    whiteSpace: "nowrap",
                  }}
                >
                  {money(row.approved > 0 ? row.approved : row.requested, true)}
                  {row.approved <= 0 && (
                    <Box component="span" sx={{ color: T.textFaint, fontSize: 10, ml: 0.5 }}>
                      asked
                    </Box>
                  )}
                </Typography>
              </Box>

              {/* Requested hairline + committed bar + disbursed overlay */}
              <Box
                sx={{
                  position: "relative",
                  height: 6,
                  mt: 0.5,
                  borderRadius: 3,
                  backgroundColor: T.panelSoft,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    width: `${(row.requested / max) * 100}%`,
                    backgroundColor: `${T.water}40`,
                    borderRadius: 3,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    width: `${(row.approved / max) * 100}%`,
                    backgroundColor: T.committed,
                    borderRadius: 3,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    width: `${(row.disbursed / max) * 100}%`,
                    backgroundColor: T.inflow,
                    borderRadius: 3,
                  }}
                />
              </Box>
            </Box>
          );
        })}

        {rows.length > ROW_LIMIT && (
          <Typography
            onClick={() => setExpanded((prev) => !prev)}
            sx={{
              fontSize: 12,
              color: T.water,
              cursor: "pointer",
              textAlign: "center",
              pt: 0.5,
              "&:hover": { color: T.textHi },
            }}
          >
            {expanded ? "Show fewer" : `Show all ${rows.length}`}
          </Typography>
        )}

        {/* Key */}
        <Box sx={{ display: "flex", gap: 1.5, pt: 0.75, flexWrap: "wrap" }}>
          {[
            { color: `${T.water}40`, label: "Requested" },
            { color: T.committed, label: "Approved" },
            { color: T.inflow, label: "Disbursed" },
          ].map((k) => (
            <Box key={k.label} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box sx={{ width: 14, height: 5, borderRadius: 3, backgroundColor: k.color }} />
              <Typography sx={{ fontSize: 10.5, color: T.textFaint }}>{k.label}</Typography>
            </Box>
          ))}
          {dimension === "county" && (
            <Typography sx={{ fontSize: 10.5, color: T.textFaint, ml: "auto" }}>
              Click a county to focus the map
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FundsLeaderboard;
