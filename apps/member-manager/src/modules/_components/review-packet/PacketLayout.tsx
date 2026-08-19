import React, { ReactNode } from "react";
import { Box } from "@mui/material";

const PacketLayout = ({
  heading,
  sidebar,
  children,
}: {
  heading: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
}) => (
  <Box sx={{ width: 1, minWidth: 0 }}>
    {heading}
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 320px" },
        gap: 2,
        px: { xs: 1, sm: 2 },
        pb: 3,
        width: 1,
        minWidth: 0,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          minWidth: 0,
          order: { xs: 2, lg: 1 },
        }}
      >
        {children}
      </Box>
      <Box sx={{ minWidth: 0, order: { xs: 1, lg: 2 } }}>{sidebar}</Box>
    </Box>
  </Box>
);

export default PacketLayout;
