import React from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import { display, money, useSummaryTokens } from "./tokens";

/** Uppercase, letterspaced section eyebrow shared across panels. */
export const SectionLabel: React.FC<{
  children: React.ReactNode;
  caption?: string;
}> = ({ children, caption }) => {
  const T = useSummaryTokens();
  return (
    <Box sx={{ mb: 1 }}>
      <Typography
        sx={{
          ...display,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: T.textLo,
        }}
      >
        {children}
      </Typography>
      {caption && (
        <Typography sx={{ fontSize: 11, color: T.textFaint }}>
          {caption}
        </Typography>
      )}
    </Box>
  );
};

/** Rounded panel surface all charts and boards sit on. */
export const Panel: React.FC<{
  children: React.ReactNode;
  sx?: object;
}> = ({ children, sx }) => {
  const T = useSummaryTokens();
  return (
    <Box
      sx={{
        backgroundColor: T.panel,
        border: `1px solid ${T.line}`,
        borderRadius: "14px",
        p: 2,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

export type ChipFormat = "money" | "count" | "percent" | "days";

const renderValue = (value: number, format: ChipFormat): string =>
  format === "money"
    ? money(value)
    : format === "percent"
    ? `${value.toFixed(1)}%`
    : format === "days"
    ? `${Math.round(value)} days`
    : Math.round(value).toLocaleString();

/**
 * Amount-only chip (grant AmountChip pattern). Hides itself at zero unless
 * told otherwise — zero-value widgets stay out of the way.
 */
export const MetricChip: React.FC<{
  label: string;
  value: number;
  format?: ChipFormat;
  tone?: string;
  hint?: string;
  showZero?: boolean;
  sub?: string;
}> = ({ label, value, format = "count", tone, hint, showZero = false, sub }) => {
  const T = useSummaryTokens();
  const toneColor = tone ?? T.water;
  if (!showZero && !value) return null;

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
        "&:hover": { transform: "translateY(-2px)", boxShadow: T.hoverShadow },
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
          lineHeight: 1.25,
        }}
      >
        {renderValue(value, format)}
        {sub && (
          <Box component="span" sx={{ fontSize: 11.5, color: T.textLo, ml: 0.75 }}>
            {sub}
          </Box>
        )}
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
 * Duotone stat card: headline figure above the colored rule, caption (and
 * optional secondary figure) below. Reads as "N things … meaning X".
 */
export const StatCard: React.FC<{
  label: string;
  value: string;
  valueSuffix?: string;
  caption: string;
  color: string;
  hint?: string;
  footer?: string;
  progress?: number; // 0..1 fill bar under the rule
  dense?: boolean;
}> = ({ label, value, valueSuffix, caption, color, hint, footer, progress, dense }) => {
  const T = useSummaryTokens();
  const card = (
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
            {value}
          </Typography>
          {valueSuffix && (
            <Typography sx={{ fontSize: 11, color: T.textLo }}>
              {valueSuffix}
            </Typography>
          )}
        </Box>
      </Box>

      {progress != null ? (
        <Box sx={{ height: 3, backgroundColor: `${color}33` }}>
          <Box
            sx={{
              height: "100%",
              width: `${Math.min(Math.max(progress, 0), 1) * 100}%`,
              backgroundColor: color,
              transition: "width 600ms ease",
            }}
          />
        </Box>
      ) : (
        <Box sx={{ height: 2, backgroundColor: color, opacity: 0.85 }} />
      )}

      <Box sx={{ px: 2, py: 1.25 }}>
        <Typography sx={{ fontSize: 11, color: T.textFaint }}>{caption}</Typography>
        {footer && (
          <Typography
            sx={{ fontSize: 12, color: T.textLo, fontWeight: 600, mt: 0.25 }}
          >
            {footer}
          </Typography>
        )}
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

/** Shared toggle styling for panel-corner view switches. */
export const useToggleSx = () => {
  const T = useSummaryTokens();
  return {
    "& .MuiToggleButton-root": {
      color: T.textLo,
      borderColor: T.line,
      textTransform: "none",
      fontSize: 12,
      px: 1.5,
      py: 0.4,
      "&.Mui-selected": {
        color: T.textHi,
        backgroundColor: T.panelSoft,
        borderColor: T.line,
      },
      "&:hover": { backgroundColor: T.panelSoft },
    },
  } as const;
};
