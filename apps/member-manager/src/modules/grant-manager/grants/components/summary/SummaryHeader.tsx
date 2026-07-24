import React from "react";
import {
  Box,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import { useSummaryTokens, display } from "./tokens";
import GlossaryModal from "./GlossaryModal";

export type SummaryView = "dashboard" | "graphs" | "tables";

const VIEWS: { key: SummaryView; label: string; icon: React.ReactNode }[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: <SpaceDashboardRoundedIcon fontSize="small" />,
  },
  {
    key: "graphs",
    label: "Graphs",
    icon: <InsightsRoundedIcon fontSize="small" />,
  },
  {
    key: "tables",
    label: "Tables",
    icon: <TableRowsRoundedIcon fontSize="small" />,
  },
];

const SummaryHeader: React.FC<{
  grantName: string;
  periodLabel: string;
  view: SummaryView;
  onViewChange: (view: SummaryView) => void;
  onLogoClick: () => void;
}> = ({ grantName, periodLabel, view, onViewChange, onLogoClick }) => {
  const T = useSummaryTokens();
  const [glossaryOpen, setGlossaryOpen] = React.useState(false);
  return (
  <Box
    sx={{
      display: "flex",
      flexWrap: "wrap",
      alignItems: "flex-end",
      justifyContent: "space-between",
      gap: 2,
      mb: 3,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.75 }}>
      {/* The logo, shrunk to a badge; still the god-mode latch */}
      <Box
        component="img"
        src="rig-logo.webp"
        alt=""
        onClick={onLogoClick}
        sx={{
          height: 52,
          cursor: "pointer",
          filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))",
          transition: "transform 200ms ease",
          "&:hover": { transform: "scale(1.06)" },
        }}
      />
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
          {grantName}
        </Typography>
        <Typography
          component="h1"
          sx={{
            ...display,
            fontSize: { xs: 26, md: 34 },
            fontWeight: 700,
            color: T.textHi,
            lineHeight: 1.1,
          }}
        >
          {periodLabel} Financial Summary
        </Typography>
      </Box>
    </Box>

    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Tooltip title="Glossary — what these terms mean" arrow>
        <IconButton
          onClick={() => setGlossaryOpen(true)}
          aria-label="Open glossary"
          sx={{
            color: T.textLo,
            border: `1px solid ${T.line}`,
            borderRadius: "12px",
            backgroundColor: T.panel,
            "&:hover": { color: T.water, backgroundColor: T.panelSoft },
          }}
        >
          <InfoOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <ToggleButtonGroup
      exclusive
      value={view}
      onChange={(_, v) => v && onViewChange(v)}
      sx={{
        backgroundColor: T.panel,
        border: `1px solid ${T.line}`,
        borderRadius: "12px",
        "& .MuiToggleButton-root": {
          color: T.textLo,
          border: "none",
          px: 2,
          py: 0.9,
          gap: 0.75,
          textTransform: "none",
          fontSize: 13,
          "&.Mui-selected": {
            color: T.textHi,
            backgroundColor: T.panelSoft,
            boxShadow: `inset 0 -2px 0 ${T.water}`,
          },
          "&:hover": { backgroundColor: T.panelSoft },
        },
      }}
    >
      {VIEWS.map((v) => (
        <ToggleButton key={v.key} value={v.key} aria-label={v.label}>
          <Tooltip title={v.label} arrow>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              {v.icon}
              <Box
                component="span"
                sx={{ display: { xs: "none", sm: "inline" } }}
              >
                {v.label}
              </Box>
            </Box>
          </Tooltip>
        </ToggleButton>
      ))}
      </ToggleButtonGroup>
    </Box>

    <GlossaryModal open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
  </Box>
  );
};

export default SummaryHeader;
