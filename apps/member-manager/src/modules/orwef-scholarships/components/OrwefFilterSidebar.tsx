import React from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { WATER_SYSTEM_REGIONS, calendarYearChoices } from "../helpers/listFilters";
import { SavedFiltersSection } from "../../_components/SavedFiltersSection";
import {
  useScholarshipRegion,
  useScholarshipSearch,
  useScholarshipYear,
} from "../helpers/orwefStore";

/**
 * Filters drawer body for the Applications tab. Values live in the legacy
 * RaStore keys; the manifest watches them and derives the permanent filter.
 */
const OrwefFilterSidebar = () => {
  const [search, setSearch] = useScholarshipSearch();
  const [region, setRegion] = useScholarshipRegion();
  const [year, setYear] = useScholarshipYear();

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2.5 }}>
      <SavedFiltersSection />
      <FormControl fullWidth>
        <FormLabel>Search</FormLabel>
        <TextField
          size="small"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Name, email, system…"
          inputProps={{ "aria-label": "Search applications" }}
          fullWidth
        />
      </FormControl>
      <FormControl>
        <FormLabel>Region</FormLabel>
        <RadioGroup
          value={region}
          onChange={(event) => setRegion(event.target.value)}
        >
          <FormControlLabel value="all" control={<Radio />} label="All" />
          {WATER_SYSTEM_REGIONS.map((value) => (
            <FormControlLabel
              key={value}
              value={value}
              control={<Radio />}
              label={value}
            />
          ))}
        </RadioGroup>
      </FormControl>
      <FormControl fullWidth>
        <FormLabel>Year</FormLabel>
        <TextField
          select
          size="small"
          value={year}
          onChange={(event) =>
            setYear(
              event.target.value === "all" ? "all" : Number(event.target.value)
            )
          }
        >
          {calendarYearChoices().map((value) => (
            <MenuItem key={String(value)} value={value}>
              {value === "all" ? "All years" : value}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>
    </Box>
  );
};

export default OrwefFilterSidebar;
