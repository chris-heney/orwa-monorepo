import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useSummaryTokens, display } from "../../memberships_v2/summary/tokens";

type Props = {
  primary: string;
  secondary?: string;
  imageUrl?: string;
  /** Squared thumb for assets; circular for people. */
  square?: boolean;
  onClick?: () => void;
};

/**
 * Compact directory row — avatar + name + subtitle.
 * Shared by People and Assets dashboard cards.
 */
const DirectoryRow: React.FC<Props> = ({
  primary,
  secondary,
  imageUrl,
  square = false,
  onClick,
}) => {
  const T = useSummaryTokens();

  return (
    <Box
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.25,
        px: 1,
        py: 0.85,
        borderRadius: "10px",
        cursor: onClick ? "pointer" : "default",
        transition: "background-color 0.15s ease, transform 0.15s ease",
        "&:hover": onClick
          ? {
              backgroundColor: T.panelSoft,
            }
          : undefined,
        "&:focus-visible": {
          outline: `2px solid ${T.water}`,
          outlineOffset: 1,
        },
      }}
    >
      <Avatar
        src={imageUrl}
        variant={square ? "rounded" : "circular"}
        alt=""
        sx={{
          width: square ? 42 : 40,
          height: square ? 42 : 40,
          border: `1.5px solid ${T.line}`,
          bgcolor: T.panelSoft,
          color: T.textLo,
          fontSize: 14,
          fontWeight: 600,
          flexShrink: 0,
          borderRadius: square ? "10px" : "50%",
        }}
      >
        {primary?.charAt(0)?.toUpperCase() || "?"}
      </Avatar>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          sx={{
            ...display,
            fontSize: 13.5,
            fontWeight: 600,
            color: T.textHi,
            lineHeight: 1.25,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {primary}
        </Typography>
        {secondary ? (
          <Typography
            sx={{
              fontSize: 11.5,
              color: T.textLo,
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {secondary}
          </Typography>
        ) : null}
      </Box>
    </Box>
  );
};

export default DirectoryRow;
