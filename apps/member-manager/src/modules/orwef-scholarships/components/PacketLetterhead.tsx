import React from "react";
import { Box, Typography } from "@mui/material";
import { useSummaryTokens } from "../../grant-manager/grants/components/summary/tokens";

const PacketLetterhead = ({
  title = "ORWEF Scholarship Application",
  meta,
}: {
  title?: string;
  meta?: string | null;
}) => {
  const T = useSummaryTokens();

  return (
    <Box
      sx={{
        bgcolor: T.panel,
        color: T.textHi,
        border: `1px solid ${T.line}`,
        borderLeft: `4px solid ${T.water}`,
        px: { xs: 2, sm: 3 },
        py: 2.25,
        mb: 0,
      }}
    >
      <Typography
        variant="overline"
        sx={{
          display: "block",
          color: T.water,
          fontWeight: 800,
          letterSpacing: "0.16em",
          lineHeight: 1.4,
        }}
      >
        Oklahoma Rural Water Foundation · ORWA
      </Typography>
      <Typography
        component="h2"
        sx={{
          mt: 0.5,
          fontWeight: 700,
          fontSize: { xs: "1.35rem", sm: "1.6rem" },
          letterSpacing: "-0.01em",
          color: T.textHi,
          lineHeight: 1.25,
        }}
      >
        {title}
      </Typography>
      {meta ? (
        <Typography
          variant="body2"
          sx={{ mt: 0.75, color: T.textLo, letterSpacing: "0.01em" }}
        >
          {meta}
        </Typography>
      ) : null}
    </Box>
  );
};

export default PacketLetterhead;
