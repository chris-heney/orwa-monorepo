import React from "react";
import { Box, Typography } from "@mui/material";
import { display, useSummaryTokens } from "./tokens";

const MembershipHeader: React.FC<{ subtitle?: string }> = ({
  subtitle = "Roster · Trends · Dues",
}) => {
  const T = useSummaryTokens();
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
          Membership Management
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
          Membership Summary
        </Typography>
        <Typography sx={{ mt: 0.5, fontSize: 13, color: T.textLo }}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
};

export default MembershipHeader;
