import { Theme } from "@mui/material/styles";
import { SxProps } from "@mui/material";

/**
 * Theme-aware datagrid styles for Grant Manager lists.
 * Avoids hardcoded light zebra/header colors that break dark mode contrast.
 */
export const grantDatagridStyle = (theme: Theme): SxProps<Theme> => {
  const oddBg =
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.04)"
      : theme.palette.grey[200];

  return {
    "& .RaDatagrid-rowOdd": {
      backgroundColor: oddBg,
    },
    "& .RaDatagrid-thead": {
      whiteSpace: "nowrap",
    },
    "tr th": {
      py: 1,
      border: `1px solid ${theme.palette.divider}`,
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.paper,
      fontWeight: "bold",
      fontSize: "0.9rem",
    },
    "tr td": {
      py: 0.5,
      border: `1px solid ${theme.palette.divider}`,
      color: theme.palette.text.primary,
      backgroundColor: "transparent",
    },
    "& .css-19tabqp-RaBulkActionsToolbar-root .RaBulkActionsToolbar-toolbar": {
      justifyContent: "flex-start",
      alignContent: "center",
    },
    "& .css-uw9l4c .RaBulkActionsToolbar-toolbar": {
      justifyContent: "flex-start",
      alignContent: "center",
    },
  };
};
