import React from "react";
import { Chip } from "@mui/material";
import { useSummaryTokens } from "../../grant-manager/grants/components/summary/tokens";

const StatusChip = ({
  label,
  colorKey,
}: {
  label: string;
  colorKey: keyof ReturnType<typeof useSummaryTokens>["stage"];
}) => {
  const T = useSummaryTokens();
  const color = T.stage[colorKey] || T.water;

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        fontWeight: 700,
        letterSpacing: "0.02em",
        bgcolor: `${color}22`,
        color,
        border: `1px solid ${color}66`,
      }}
    />
  );
};

export default StatusChip;
