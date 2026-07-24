import React from "react";
import { Box } from "@mui/material";
import RosterPanel from "../../memberships_v2/summary/RosterPanel";
import { useSummaryTokens } from "../../memberships_v2/summary/tokens";

/**
 * Home-dashboard membership widget — compact roster language matching
 * Membership Summary (fits the ~400px dashboard tile).
 */
const MembershipsCard = () => {
  const T = useSummaryTokens();
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        borderRadius: "14px",
        border: `1px solid ${T.line}`,
        backgroundColor: T.ink,
        p: 1.5,
        overflow: "hidden",
      }}
    >
      <RosterPanel compact />
    </Box>
  );
};

export default MembershipsCard;
