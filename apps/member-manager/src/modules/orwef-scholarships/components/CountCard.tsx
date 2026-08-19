import React from "react";
import { Box, Tooltip, Typography } from "@mui/material";
import {
  display,
  useSummaryTokens,
} from "../../grant-manager/grants/components/summary/tokens";

const CountCard = ({
  label,
  caption,
  count,
  color,
}: {
  label: string;
  caption: string;
  count: number;
  color: string;
}) => {
  const T = useSummaryTokens();
  if (!count) return null;

  return (
    <Tooltip title={`${label} — ${caption}`} arrow>
      <Box
        sx={{
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
            pb: 1.25,
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
          <Typography sx={{ fontSize: 11, color: T.textLo, mt: 0.5 }}>
            {caption}
          </Typography>
        </Box>
        <Box sx={{ height: 2, backgroundColor: color, opacity: 0.85 }} />
      </Box>
    </Tooltip>
  );
};

export default CountCard;
