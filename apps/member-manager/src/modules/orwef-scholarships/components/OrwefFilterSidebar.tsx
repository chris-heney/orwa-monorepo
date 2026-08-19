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
import FilterSidebarShell from "../../_components/FilterSidebarShell";
import { useOrwefContext } from "../OrwefContextProvider";
import {
  SCHOLARSHIP_STATUSES,
  calendarYearChoices,
} from "../helpers/listFilters";

const OrwefFilterSidebar = () => {
  const {
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    search,
    setSearch,
    status,
    setStatus,
    year,
    setYear,
  } = useOrwefContext();

  return (
    <FilterSidebarShell
      open={isFilterSidebarOpen}
      onClose={() => setIsFilterSidebarOpen(false)}
    >
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2.5 }}>
        <FormControl fullWidth>
          <FormLabel>Search</FormLabel>
          <TextField
            size="small"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name, email, system…"
            fullWidth
          />
        </FormControl>
        <FormControl>
          <FormLabel>Status</FormLabel>
          <RadioGroup
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <FormControlLabel value="all" control={<Radio />} label="All" />
            {SCHOLARSHIP_STATUSES.map((choice) => (
              <FormControlLabel
                key={choice.id}
                value={choice.id}
                control={<Radio />}
                label={choice.name}
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
    </FilterSidebarShell>
  );
};

export default OrwefFilterSidebar;
