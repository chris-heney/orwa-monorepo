import React from "react";
import { Box } from "@mui/material";
import YearReportPanel from "../summary/YearReportPanel";
import { useSummaryTokens } from "../summary/tokens";

/**
 * Standalone membership year report card (legacy import path).
 * Prefer YearReportPanel inside MembershipsSummary.
 */
const MembershipReportCard = () => {
  const T = useSummaryTokens();
  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: "14px",
        border: `1px solid ${T.line}`,
        backgroundColor: T.ink,
        p: 2,
      }}
    >
      <YearReportPanel />
    </Box>
  );
};

export default MembershipReportCard;
