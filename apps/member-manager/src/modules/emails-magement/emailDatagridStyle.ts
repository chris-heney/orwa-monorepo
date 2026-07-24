import { Theme } from "@mui/material/styles";
import { SxProps } from "@mui/material";

/** Theme-aware datagrid styles for email management lists (avoids hardcoded light #eee/#ccc). */
export const emailDatagridStyle = (theme: Theme): SxProps<Theme> => {
  const oddBg =
    theme.palette.mode === "dark"
      ? theme.palette.action.hover
      : theme.palette.grey[200];
  const borderColor = theme.palette.divider;

  return {
    "& .RaDatagrid-rowOdd": {
      backgroundColor: oddBg,
    },
    "& .css-19tabqp-RaBulkActionsToolbar-root .RaBulkActionsToolbar-toolbar": {
      justifyContent: "flex-start",
      alignContent: "center",
    },
    "& .css-uw9l4c .RaBulkActionsToolbar-toolbar": {
      justifyContent: "flex-start",
      alignContent: "center",
    },
    "& .RaDatagrid-thead": {
      whiteSpace: "nowrap",
    },
    "tr th": {
      py: 1,
      border: `1px solid ${borderColor}`,
    },
    "tr td": {
      py: 0.5,
      border: `1px solid ${borderColor}`,
    },
  };
};
