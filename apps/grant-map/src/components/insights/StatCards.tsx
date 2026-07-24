import React from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import { T, display, money } from "../../theme/tokens";
import { LifecycleStage } from "../../helpers/useMapMetrics";

/**
 * Duotone stage card ported from the Grant Manager summary: count above the
 * divider, dollars below. Reads as "N applications … totaling $X".
 */
export const StageCard: React.FC<{ stage: LifecycleStage; dense?: boolean }> = ({
  stage,
  dense = false,
}) => (
  <Tooltip title={`${stage.label} — ${stage.caption}`} arrow>
    <Box
      sx={{
        position: "relative",
        minWidth: dense ? 132 : 168,
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
          px: dense ? 1.5 : 2,
          pt: dense ? 1 : 1.5,
          pb: dense ? 0.5 : 1,
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
            whiteSpace: "nowrap",
          }}
        >
          {stage.label}
        </Typography>
        <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
          <Typography
            sx={{
              ...display,
              fontSize: dense ? 24 : 32,
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
      <Box sx={{ px: dense ? 1.5 : 2, py: dense ? 0.75 : 1.25 }}>
        <Typography
          sx={{
            ...display,
            fontSize: dense ? 16 : 19,
            fontWeight: 600,
            color: stage.amount < 0 ? T.exit : T.textHi,
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1.2,
          }}
        >
          {money(stage.amount)}
        </Typography>
        {!dense && (
          <Typography sx={{ fontSize: 11, color: T.textFaint }}>
            {stage.caption}
          </Typography>
        )}
      </Box>
    </Box>
  </Tooltip>
);

/**
 * Amount-only chip for metrics where a count doesn't apply
 * (pool figures, averages). Deliberately smaller and quieter.
 * Zero values hide themselves.
 */
export const AmountChip: React.FC<{
  label: string;
  value: number;
  format?: "money" | "count" | "percent";
  tone?: string;
  hint?: string;
}> = ({ label, value, format = "money", tone, hint }) => {
  const toneColor = tone ?? T.water;
  if (!value) return null;
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
        borderLeftStyle: "solid",
        borderLeftColor: value < 0 ? T.exit : toneColor,
        minWidth: 130,
        flex: "1 1 auto",
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

export const SectionLabel: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
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
    {children}
  </Typography>
);
