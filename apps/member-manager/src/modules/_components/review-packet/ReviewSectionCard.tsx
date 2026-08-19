import React, { ReactNode } from "react";
import { Box, Card, Typography } from "@mui/material";
import { sectionCardSx } from "./styles";

const ReviewSectionCard = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <Card sx={sectionCardSx}>
    <Typography
      variant="h6"
      color="text.primary"
      sx={{ fontWeight: 700, mb: 1.5, letterSpacing: "0.01em" }}
    >
      {title}
    </Typography>
    <Box sx={{ width: "100%" }}>{children}</Box>
  </Card>
);

export default ReviewSectionCard;
