import React from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import { useSummaryTokens, display, money } from "./tokens";
import { LifecycleStage } from "./useGrantMetrics";

/**
 * Duotone stage card: count above the divider, dollars below.
 * Reads as "N applications … totaling $X".
 */
export const StageCard: React.FC<{ stage: LifecycleStage; dense?: boolean }> = ({
  stage,
  dense = false,
}) => {
  const T = useSummaryTokens();
  return (
  <Tooltip title={`${stage.label} — ${stage.caption}`} arrow>
    <Box
      sx={{
        position: "relative",
        minWidth: dense ? 148 : 168,
        flex: "1 1 0",
        borderRadius: "14px",
        overflow: "hidden",
        backgroundColor: T.panel,
        border: `1px solid ${T.line}`,
        transition: "transform 180ms ease, box-shadow 180ms ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: `${T.hoverShadow}, 0 0 0 1px ${stage.color}55`,
        },
      }}
    >
      {/* Count half (duotone top) */}
      <Box
        sx={{
          px: 2,
          pt: 1.5,
          pb: 1,
          background: `linear-gradient(135deg, ${stage.color}26 0%, transparent 65%)`,
        }}
      >
        <Typography
          sx={{
            ...display,
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: stage.color,
            lineHeight: 1.2,
          }}
        >
          {stage.label}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
          <Typography
            sx={{
              ...display,
              fontSize: dense ? 26 : 32,
              fontWeight: 700,
              color: T.textHi,
              fontVariantNumeric: "tabular-nums",
              lineHeight: 1.15,
            }}
          >
            {stage.count?.toLocaleString()}
          </Typography>
          <Typography sx={{ fontSize: 11, color: T.textLo }}>
            {stage.countLabel}
          </Typography>
        </Box>
      </Box>

      {/* Divider that carries the stage color */}
      <Box sx={{ height: 2, backgroundColor: stage.color, opacity: 0.85 }} />

      {/* Amount half */}
      <Box sx={{ px: 2, py: 1.25 }}>
        <Typography
          sx={{
            ...display,
            fontSize: dense ? 17 : 19,
            fontWeight: 600,
            color: stage.amount < 0 ? T.exit : T.textHi,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1.2,
          }}
        >
          {money(stage.amount)}
        </Typography>
        <Typography sx={{ fontSize: 11, color: T.textFaint }}>
          {stage.caption}
        </Typography>
      </Box>
    </Box>
  </Tooltip>
  );
};

/**
 * Amount-only chip for metrics where a count doesn't apply
 * (pool figures, averages). Deliberately smaller and quieter.
 */
export const AmountChip: React.FC<{
  label: string;
  value: number;
  format?: "money" | "count" | "percent" | "days";
  tone?: string;
  hint?: string;
}> = ({ label, value, format = "money", tone, hint }) => {
  const T = useSummaryTokens();
  const toneColor = tone ?? T.water;
  if (!value) return null;
  const rendered =
    format === "money"
      ? money(value)
      : format === "percent"
      ? `${value.toFixed(1)}%`
      : format === "days"
      ? `${Math.round(value)} days`
      : Math.round(value).toLocaleString();

  const chip = (
    <Box
      sx={{
        px: 1.75,
        py: 1,
        borderRadius: "10px",
        backgroundColor: T.panel,
        borderLeft: `3px solid ${value < 0 ? T.exit : toneColor}`,
        border: `1px solid ${T.line}`,
        borderLeftWidth: 3,
        borderLeftColor: value < 0 ? T.exit : toneColor,
        minWidth: 130,
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
