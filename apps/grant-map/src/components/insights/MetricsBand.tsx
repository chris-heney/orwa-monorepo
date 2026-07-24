import React from "react";
import { Box } from "@mui/material";
import { useAppContext } from "../../providers/AppContext";
import { useMapMetrics } from "../../helpers/useMapMetrics";
import { StageCard } from "./StatCards";

/** Stages worth keeping in view when the full insights panel is closed. */
const BAND_STAGES = ["received", "approved", "disbursed", "paid"];

/**
 * Compact strip of headline stage cards floating over the top of the map —
 * the key figures stay visible even with the insights panel closed.
 */
const MetricsBand: React.FC = () => {
  const { insightsOpen, reportApplications, allApplications, grant, fiscalYear } =
    useAppContext();
  const metrics = useMapMetrics(
    reportApplications,
    allApplications,
    grant,
    fiscalYear
  );

  if (insightsOpen) return null;

  const stages = metrics.stages.filter((s) => BAND_STAGES.includes(s.key));
  if (!stages.length) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        top: 12,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 900,
        display: { xs: "none", md: "flex" },
        gap: 1.25,
        maxWidth: "calc(100% - 380px)",
        overflowX: "auto",
      }}
    >
      {stages.map((stage) => (
        <Box key={stage.key} sx={{ minWidth: 168 }}>
          <StageCard stage={stage} dense />
        </Box>
      ))}
    </Box>
  );
};

export default MetricsBand;
