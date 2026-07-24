import React from "react";
import {
  Box,
  IconButton,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { T, display } from "../../theme/tokens";
import { useAppContext } from "../../providers/AppContext";
import { useMapMetrics } from "../../helpers/useMapMetrics";
import { fyLabel } from "../../helpers/fiscalYear";
import { StageCard, AmountChip, SectionLabel } from "./StatCards";
import FundsLeaderboard from "./FundsLeaderboard";

export const fySelectSx = {
  ...display,
  color: T.textHi,
  fontSize: 13,
  fontWeight: 600,
  backgroundColor: T.panel,
  borderRadius: "10px",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: T.line },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: T.water },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: T.water },
  "& .MuiSelect-icon": { color: T.textLo },
} as const;

export const fyMenuProps = {
  PaperProps: {
    sx: {
      backgroundColor: T.panelSoft,
      color: T.textHi,
      border: `1px solid ${T.line}`,
      "& .MuiMenuItem-root": {
        fontSize: 13,
        "&:hover": { backgroundColor: `${T.water}22` },
        "&.Mui-selected": { backgroundColor: `${T.water}33` },
      },
    },
  },
} as const;

export const FySelect: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const { fiscalYear, setFiscalYear, fyOptions } = useAppContext();
  return (
    <Select
      size="small"
      value={fiscalYear ?? "all"}
      onChange={(e) =>
        setFiscalYear(e.target.value === "all" ? null : Number(e.target.value))
      }
      MenuProps={fyMenuProps}
      sx={{ ...fySelectSx, minWidth: compact ? 110 : 140 }}
    >
      <MenuItem value="all">All Years</MenuItem>
      {fyOptions.map((fy) => (
        <MenuItem key={fy} value={fy}>
          {fyLabel(fy)}
        </MenuItem>
      ))}
    </Select>
  );
};

/**
 * The financial reporting sidecar — the Grant Manager summary dashboard
 * re-imagined as a map companion. Slides in from the right; every figure
 * honors the map's fiscal-year and geography filters.
 */
const InsightsPanel: React.FC = () => {
  const {
    insightsOpen,
    setInsightsOpen,
    reportApplications,
    allApplications,
    grant,
    fiscalYear,
  } = useAppContext();

  const metrics = useMapMetrics(
    reportApplications,
    allApplications,
    grant,
    fiscalYear
  );
  const { stages, exits, pool, insights, breakdown } = metrics;

  return (
    /* Outer shell animates width so the panel slides like the left sidebar */
    <Box
      component="aside"
      sx={{
        width: insightsOpen ? { xs: "100%", sm: 440 } : 0,
        flexShrink: 0,
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        transition: "width 0.4s ease-in-out, padding 0.4s ease-in-out",
        backgroundColor: T.ink,
        borderLeft: insightsOpen ? `1px solid ${T.line}` : "none",
        p: insightsOpen ? 2 : 0,
        display: "flex",
        flexDirection: "column",
        gap: 2.5,
        // keep the content at full width while sliding so it doesn't squish
        "& > *": { minWidth: { xs: "calc(100vw - 32px)", sm: 440 - 32 } },
        // slim scrollbar on the night canvas
        "&::-webkit-scrollbar": { width: 8 },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: T.panelSoft,
          borderRadius: 4,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Box>
          <Typography
            sx={{
              ...display,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: T.water,
            }}
          >
            Rural Infrastructure Grant
          </Typography>
          <Typography
            component="h2"
            sx={{
              ...display,
              fontSize: 24,
              fontWeight: 700,
              color: T.textHi,
              lineHeight: 1.1,
            }}
          >
            {fiscalYear != null ? fyLabel(fiscalYear) : "All-Time"} Financial
            Summary
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FySelect compact />
          <Tooltip title="Close insights" arrow>
            <IconButton
              size="small"
              onClick={() => setInsightsOpen(false)}
              sx={{
                color: T.textLo,
                border: `1px solid ${T.line}`,
                borderRadius: "10px",
                "&:hover": { color: T.textHi, backgroundColor: T.panelSoft },
              }}
            >
              <CloseRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* The dollar lifecycle */}
      {stages.length > 0 && (
      <Box>
        <SectionLabel>The dollar lifecycle</SectionLabel>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 1.25,
          }}
        >
          {stages.map((stage) => (
            <StageCard key={stage.key} stage={stage} />
          ))}
        </Box>
      </Box>
      )}

      {/* Off-ramps (only ones with data render) */}
      {exits.length > 0 && (
        <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap" }}>
          {exits.map((stage) => (
            <Box key={stage.key} sx={{ flex: "1 1 190px" }}>
              <StageCard stage={stage} dense />
            </Box>
          ))}
        </Box>
      )}

      {/* The pool (zero values hide themselves) */}
      {(pool.annualGrant > 0 ||
        pool.approvedFunds > 0 ||
        pool.disbursed > 0) && (
        <Box>
          <SectionLabel>The pool</SectionLabel>
          <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap" }}>
            <AmountChip
              label="Annual Allocation"
              value={pool.annualGrant}
              tone={T.water}
            />
            <AmountChip
              label="Previous FY Rollover"
              value={pool.previousFyRollover}
              tone={T.deepWater}
              hint="Unawarded allocation and closeout returns carried in from every earlier fiscal year"
            />
            <AmountChip
              label="Funds Available"
              value={pool.fundsAvailable}
              tone={T.inflow}
            />
            <AmountChip
              label="Still Available"
              value={pool.fundsStillAvailable}
              tone={T.inflow}
              hint="Funds available minus what the committee has approved"
            />
            <AmountChip
              label="Undistributed"
              value={pool.undistributed}
              tone={T.committed}
              hint="Approved but not yet paid out"
            />
            <AmountChip
              label="Closeout Returns"
              value={pool.closeoutReturned}
              tone={T.deepWater}
              hint="Money returned by closed-out applications"
            />
          </Box>
        </Box>
      )}

      {/* Signals */}
      <Box>
        <SectionLabel>Signals</SectionLabel>
        <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap" }}>
          <AmountChip label="Average Award" value={insights.avgAward} tone={T.committed} />
          <AmountChip label="Median Award" value={insights.medianAward} tone={T.committed} />
          <AmountChip label="Largest Award" value={insights.largestAward} tone={T.committed} />
          <AmountChip
            label="Approval Ratio"
            value={insights.approvalRatio}
            format="percent"
            tone={T.water}
            hint="Approved share of reviewed applications"
          />
          <AmountChip
            label="Oklahomans Served"
            value={insights.populationServed}
            format="count"
            tone={T.inflow}
            hint="Combined population served by approved systems"
          />
          <AmountChip
            label="Counties Reached"
            value={insights.countiesServed}
            format="count"
            tone={T.water}
          />
        </Box>
      </Box>

      {/* Where the money goes */}
      <FundsLeaderboard breakdown={breakdown} />

      <Typography sx={{ fontSize: 11, color: T.textFaint, fontStyle: "italic" }}>
        Figures attribute awards and payouts to the fiscal year of each
        application&apos;s committee approval date (July 1 – June 30). County
        and water-type filters shape this report; status filters only shape
        the map.
      </Typography>
    </Box>
  );
};

export default InsightsPanel;
