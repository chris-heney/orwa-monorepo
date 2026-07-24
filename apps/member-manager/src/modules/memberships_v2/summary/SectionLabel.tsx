import React from "react";
import { Typography } from "@mui/material";
import { display, useSummaryTokens } from "./tokens";

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const T = useSummaryTokens();
  return (
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
};

export default SectionLabel;
