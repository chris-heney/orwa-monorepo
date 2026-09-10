import React from "react";
import { MenuItem, TextField } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import { HEADING_ACTION_SIZE } from "../../../framework/layoutTokens";
import { calendarYearChoices } from "../helpers/listFilters";
import { useAwardYear } from "../helpers/awardStore";

/**
 * Heading-bar look: compact outlined select in the bar's foreground colour,
 * same 32px footprint as every other heading action (bar stays 48px).
 */
export const YEAR_SELECT_SX: SxProps<Theme> = {
  minWidth: 118,
  "& .MuiInputBase-root": { height: HEADING_ACTION_SIZE },
  "& .MuiSelect-select": {
    color: (theme) => theme.palette.headingBar.fg,
    py: 0,
    minHeight: 0,
    height: HEADING_ACTION_SIZE,
    display: "flex",
    alignItems: "center",
    fontSize: 14,
  },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "grey.600" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "grey.400" },
  "& .MuiSvgIcon-root": { color: (theme) => theme.palette.headingBar.fg },
};

/**
 * Page-level action of the Awards dashboard: the award-cycle year. Writes the
 * legacy RaStore key, which the manifest watches to re-derive the bar title
 * and every list tab's permanent filter.
 */
export const AwardYearSelectAction = () => {
  const [year, setYear] = useAwardYear();
  return (
    <TextField
      select
      variant="outlined"
      size="small"
      // The app theme defaults TextField to `margin="dense"` (+12px) — the bar
      // must stay 48px.
      margin="none"
      value={year}
      onChange={(event) =>
        setYear(
          event.target.value === "all" ? "all" : Number(event.target.value)
        )
      }
      aria-label="Award year"
      inputProps={{ "aria-label": "Award year" }}
      sx={YEAR_SELECT_SX}
    >
      {calendarYearChoices().map((value) => (
        <MenuItem key={String(value)} value={value}>
          {value === "all" ? "All years" : value}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default AwardYearSelectAction;
