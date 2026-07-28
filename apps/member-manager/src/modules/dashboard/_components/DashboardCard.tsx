import React from "react";
import { Box, Typography, IconButton, SxProps, Theme } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import { Loading } from "react-admin";
import {
  display,
  useSummaryTokens,
} from "../../memberships_v2/summary/tokens";

export type DashboardCardProps = {
  icon: React.ReactNode;
  title: string;
  /** Shown only when provided. */
  count?: number | string;
  /** When set, renders a search affordance in the header. */
  onSearch?: () => void;
  searchActive?: boolean;
  /** When set, renders a filter affordance in the header. */
  onFilter?: () => void;
  filterActive?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  /** Extra styles on the outer shell. */
  sx?: SxProps<Theme>;
  /** Extra styles on the scrollable body. */
  bodySx?: SxProps<Theme>;
  /** Disable body scroll (e.g. chart that manages its own layout). */
  disableBodyScroll?: boolean;
};

/**
 * Standard home-dashboard card shell.
 * Header: [icon + title] … [search?] [filter?] [count?]
 */
const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  title,
  count,
  onSearch,
  searchActive,
  onFilter,
  filterActive,
  loading,
  children,
  sx,
  bodySx,
  disableBodyScroll = false,
}) => {
  const T = useSummaryTokens();
  const showCount = count !== undefined && count !== null && count !== "";

  return (
    <Box
      sx={{
        height: "100%",
        borderRadius: "14px",
        border: `1px solid ${T.line}`,
        backgroundColor: T.ink,
        color: T.textHi,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        ...((sx as object) || {}),
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          px: 1.5,
          pt: 1.35,
          pb: 1,
          borderBottom: `1px solid ${T.line}`,
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            color: T.water,
            "& .MuiSvgIcon-root": { fontSize: 22 },
          }}
        >
          {icon}
        </Box>
        <Typography
          sx={{
            ...display,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: T.textHi,
            flex: 1,
            minWidth: 0,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {title}
        </Typography>

        {onSearch ? (
          <IconButton
            size="small"
            aria-label="Search"
            onClick={onSearch}
            sx={{
              color: searchActive ? T.water : T.textLo,
              "&:hover": { color: T.water, backgroundColor: T.panelSoft },
            }}
          >
            <SearchOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        ) : null}

        {onFilter ? (
          <IconButton
            size="small"
            aria-label="Filter"
            onClick={onFilter}
            sx={{
              color: filterActive ? T.water : T.textLo,
              "&:hover": { color: T.water, backgroundColor: T.panelSoft },
            }}
          >
            <FilterListOutlinedIcon sx={{ fontSize: 18 }} />
          </IconButton>
        ) : null}

        {showCount ? (
          <Box
            sx={{
              minWidth: 28,
              height: 28,
              px: 0.75,
              borderRadius: "999px",
              backgroundColor: T.panelSoft,
              border: `1px solid ${T.line}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...display,
              fontSize: 12,
              fontWeight: 700,
              color: T.textLo,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {count}
          </Box>
        ) : null}
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflowY: disableBodyScroll ? "hidden" : "auto",
          scrollbarWidth: "thin",
          scrollbarColor: `${T.line} transparent`,
          ...((bodySx as object) || {}),
        }}
      >
        {loading ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              py: 4,
            }}
          >
            <Loading />
          </Box>
        ) : (
          children
        )}
      </Box>
    </Box>
  );
};

export default DashboardCard;
