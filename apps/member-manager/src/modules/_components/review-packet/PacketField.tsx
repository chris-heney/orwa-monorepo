import React, { ReactNode } from "react";
import { Box, Typography } from "@mui/material";
import { blank, displayText } from "./formatters";

const PacketField = ({
  label,
  value,
  children,
  span = false,
  email = false,
}: {
  label: string;
  value?: unknown;
  children?: ReactNode;
  span?: boolean;
  email?: boolean;
}) => {
  const text = displayText(value);

  return (
    <Box
      sx={{
        gridColumn: span ? "1 / -1" : undefined,
        minWidth: 0,
        py: 1,
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          display: "block",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontWeight: 700,
          mb: 0.25,
        }}
      >
        {label}
      </Typography>
      {children != null ? (
        children
      ) : (
        <Typography
          variant="body1"
          color="text.primary"
          sx={{
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
            wordBreak: email ? "break-word" : "normal",
            minWidth: 0,
          }}
        >
          {text || blank}
        </Typography>
      )}
    </Box>
  );
};

export default PacketField;
