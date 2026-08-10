import React from "react";
import {
  Box,
  Drawer,
  IconButton,
  Theme,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import KeyboardDoubleArrowRightRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowRightRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";

export type FilterSidebarShellProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  headerActions?: React.ReactNode;
  width?: number;
  topOffset?: number;
  /** When true (default), drawer never opens below the `sm` breakpoint. */
  hideOnSmall?: boolean;
};

/**
 * Shared Grant-style right persistent Filters drawer.
 * Callers own open state and filter body children.
 */
const FilterSidebarShell: React.FC<FilterSidebarShellProps> = ({
  open,
  onClose,
  children,
  title = "Filters",
  headerActions,
  width = 320,
  topOffset = 48,
  hideOnSmall = true,
}) => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
  const visible = open && !(hideOnSmall && isSmall);

  return (
    <Drawer
      anchor="right"
      variant="persistent"
      open={visible}
      sx={{
        "& .MuiDrawer-paper": {
          width,
          top: topOffset,
          height: `calc(100% - ${topOffset}px)`,
          borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
          boxShadow: "-8px 0 24px rgba(0,0,0,0.18)",
          backgroundImage: "none",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1,
          bgcolor: "common.black",
          color: "common.white",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <TuneRoundedIcon fontSize="small" />
          <Typography sx={{ fontWeight: 600 }}>{title}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          {headerActions}
          <Tooltip title="Collapse filters">
            <IconButton
              size="small"
              sx={{ color: "common.white" }}
              onClick={onClose}
              aria-label="Collapse filters"
            >
              <KeyboardDoubleArrowRightRoundedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Box sx={{ overflowY: "auto", flex: 1 }}>{children}</Box>
    </Drawer>
  );
};

export default FilterSidebarShell;
