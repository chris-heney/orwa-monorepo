import { createTheme } from "@mui/material/styles";
import { T } from "./tokens";

/** MUI dark theme anchored to the ink-ledger tokens so menus, selects and
 * checkboxes match the canvas without per-component styling. */
export const muiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: T.water },
    secondary: { main: T.committed },
    error: { main: T.exit },
    success: { main: T.inflow },
    background: {
      default: T.ink,
      paper: T.panelSoft,
    },
    text: {
      primary: T.textHi,
      secondary: T.textLo,
    },
    divider: T.line,
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
  },
});
