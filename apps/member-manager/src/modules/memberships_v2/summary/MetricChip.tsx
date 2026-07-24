import React from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import { display, money, useSummaryTokens } from "./tokens";

/**
 * Theme-aware metric chip (grant AmountChip pattern) that can show zeros —
 * membership counts and audit dollars of $0 still communicate meaning.
 */
export const MetricChip: React.FC<{
  label: string;
  value: number;
  format?: "money" | "count" | "percent";
  tone?: string;
  hint?: string;
  hideZero?: boolean;
}> = ({
  label,
  value,
  format = "count",
  tone,
  hint,
  hideZero = false,
}) => {
  const T = useSummaryTokens();
  const toneColor = tone ?? T.water;
  if (hideZero && !value) return null;

  const rendered =
    format === "money"
      ? money(value)
      : format === "percent"
      ? `${value.toFixed(1)}%`
      : Math.round(value).toLocaleString();

  const chip = (
    <Box
      sx={{
        px: 1.75,
        py: 1,
        borderRadius: "10px",
        backgroundColor: T.panel,
        border: `1px solid ${T.line}`,
        borderLeftWidth: 3,
        borderLeftColor: value < 0 ? T.exit : toneColor,
        minWidth: 130,
        transition: "transform 180ms ease, box-shadow 180ms ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: T.hoverShadow,
        },
      }}
    >
      <Typography
        sx={{
          fontSize: 10.5,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: T.textLo,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          ...display,
          fontSize: 20,
          fontWeight: 700,
          color: value < 0 ? T.exit : T.textHi,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {rendered}
      </Typography>
    </Box>
  );

  return hint ? (
    <Tooltip title={hint} arrow>
      {chip}
    </Tooltip>
  ) : (
    chip
  );
};

/**
 * Duotone roster card: count above a colored rule, caption below.
 */
export const RosterCard: React.FC<{
  label: string;
  count: number;
  caption: string;
  color: string;
  hint?: string;
}> = ({ label, count, caption, color, hint }) => {
  const T = useSummaryTokens();
  const card = (
    <Box
      sx={{
        position: "relative",
        minWidth: 148,
        flex: "1 1 0",
        borderRadius: "14px",
        overflow: "hidden",
        backgroundColor: T.panel,
        border: `1px solid ${T.line}`,
        transition: "transform 180ms ease, box-shadow 180ms ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: `${T.hoverShadow}, 0 0 0 1px ${color}55`,
        },
      }}
    >
      <Box
        sx={{
          px: 2,
          pt: 1.5,
          pb: 1,
          background: `linear-gradient(135deg, ${color}26 0%, transparent 65%)`,
        }}
      >
        <Typography
          sx={{
            ...display,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color,
            lineHeight: 1.2,
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            ...display,
            fontSize: 32,
            fontWeight: 700,
            color: T.textHi,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1.15,
          }}
        >
          {count.toLocaleString()}
        </Typography>
      </Box>
      <Box sx={{ height: 2, backgroundColor: color, opacity: 0.85 }} />
      <Box sx={{ px: 2, py: 1.25 }}>
        <Typography sx={{ fontSize: 11, color: T.textFaint }}>{caption}</Typography>
      </Box>
    </Box>
  );

  return hint ? (
    <Tooltip title={hint} arrow>
      {card}
    </Tooltip>
  ) : (
    card
  );
};
