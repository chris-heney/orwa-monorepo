import React, { ReactNode } from "react";
import { Box, Card, Typography } from "@mui/material";
import { sectionCardSx } from "./styles";

const PacketSection = ({
  title,
  children,
  columns = 2,
}: {
  title: string;
  children: ReactNode;
  columns?: 1 | 2;
}) => (
  <Card sx={sectionCardSx}>
    <Typography
      variant="overline"
      color="text.secondary"
      sx={{ fontWeight: 800, letterSpacing: "0.12em", display: "block", mb: 0.5 }}
    >
      {title}
    </Typography>
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: columns === 1 ? "1fr" : "1fr 1fr",
        },
        columnGap: 3,
        alignItems: "start",
      }}
    >
      {children}
    </Box>
  </Card>
);

export default PacketSection;
