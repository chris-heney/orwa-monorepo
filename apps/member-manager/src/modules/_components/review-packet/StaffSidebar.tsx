import React, { ReactNode } from "react";
import { Box, Card, Typography } from "@mui/material";
import { sectionCardSx } from "./styles";
import { blank, displayText } from "./formatters";

const StaffSidebar = ({
  title = "Staff review",
  chip,
  notes,
  extra,
}: {
  title?: string;
  chip: ReactNode;
  notes?: string | null;
  extra?: ReactNode;
}) => (
  <Card sx={{ ...sectionCardSx, position: { lg: "sticky" }, top: { lg: 64 } }}>
    <Typography
      variant="overline"
      color="text.secondary"
      sx={{ fontWeight: 800, letterSpacing: "0.12em", display: "block", mb: 1 }}
    >
      {title}
    </Typography>
    <Box sx={{ mb: 1.5 }}>{chip}</Box>
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{
        display: "block",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        fontWeight: 700,
        mb: 0.5,
      }}
    >
      Review notes
    </Typography>
    <Typography
      variant="body2"
      color="text.primary"
      sx={{ whiteSpace: "pre-wrap", mb: extra != null ? 2 : 0 }}
    >
      {notes ? displayText(notes) : blank}
    </Typography>
    {extra}
  </Card>
);

export default StaffSidebar;
