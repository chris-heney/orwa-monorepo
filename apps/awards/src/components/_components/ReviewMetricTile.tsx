import React from "react";
import { Paper, Typography } from "@mui/material";

type ReviewMetricTileProps = {
  value: number | string | null | undefined;
  label: string;
};

const ReviewMetricTile: React.FC<ReviewMetricTileProps> = ({
  value,
  label,
}) => {
  const display =
    value === null || value === undefined || value === "" ? 0 : value;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        textAlign: "center",
        borderRadius: 1.5,
        bgcolor: "background.paper",
        borderColor: "divider",
      }}
    >
      <Typography
        variant="h4"
        color="primary"
        sx={{ fontWeight: 600, lineHeight: 1.2 }}
      >
        {display}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {label}
      </Typography>
    </Paper>
  );
};

export default ReviewMetricTile;
