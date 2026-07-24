import React from "react";
import { Box, Typography } from "@mui/material";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { useSummaryTokens, display } from "./tokens";
import { LifecycleStage } from "./useGrantMetrics";
import { StageCard } from "./StatCards";

/**
 * The signature element: a horizontal rail tracing a grant dollar's life
 * from application to closeout. Stage color travels blue -> amber -> green.
 */
const LifecycleRail: React.FC<{ stages: LifecycleStage[] }> = ({ stages }) => {
  const T = useSummaryTokens();
  return (
  <Box>
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
      The life of a grant dollar
    </Typography>
    <Box
      sx={{
        display: "flex",
        alignItems: "stretch",
        gap: 0.5,
        overflowX: "auto",
        pb: 1,
        "&::-webkit-scrollbar": { height: 6 },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: T.panelSoft,
          borderRadius: 3,
        },
      }}
    >
      {stages.map((stage, i) => (
        <React.Fragment key={stage.key}>
          {i > 0 && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: stage.color,
                opacity: 0.65,
                px: 0.25,
                animation: "railPulse 2.4s ease-in-out infinite",
                animationDelay: `${i * 0.25}s`,
                "@keyframes railPulse": {
                  "0%, 100%": { opacity: 0.35 },
                  "50%": { opacity: 0.9 },
                },
                "@media (prefers-reduced-motion: reduce)": {
                  animation: "none",
                  opacity: 0.6,
                },
              }}
            >
              <ArrowForwardIosRoundedIcon sx={{ fontSize: 14 }} />
            </Box>
          )}
          <StageCard stage={stage} />
        </React.Fragment>
      ))}
    </Box>
  </Box>
  );
};

export default LifecycleRail;
