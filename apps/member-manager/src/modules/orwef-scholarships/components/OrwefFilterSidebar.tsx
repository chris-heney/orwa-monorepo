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
import {
  SCHOLARSHIP_STATUS_VALUES,
  WATER_SYSTEM_REGIONS,
  calendarYearChoices,
} from "../helpers/listFilters";
import {
  useScholarshipRegion,
  useScholarshipSearch,
  useScholarshipStatuses,
  useScholarshipSubmittedFrom,
  useScholarshipSubmittedTo,
  useScholarshipYear,
} from "../helpers/orwefStore";
import SubmittedDateRangeFields from "../../_components/SubmittedDateRangeFields";
import StatusCheckboxFilter from "../../award-nominations/components/StatusCheckboxFilter";

/**
 * Filters drawer body for the Applications tab. Values live in the legacy
 * RaStore keys; the manifest watches them and derives the permanent filter.
 */
const OrwefFilterSidebar = () => {
  const [search, setSearch] = useScholarshipSearch();
  const [region, setRegion] = useScholarshipRegion();
  const [year, setYear] = useScholarshipYear();
  const [submittedFrom, setSubmittedFrom] = useScholarshipSubmittedFrom();
  const [submittedTo, setSubmittedTo] = useScholarshipSubmittedTo();
  const [statuses, setStatuses] = useScholarshipStatuses();

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2.5 }}>
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
      <StatusCheckboxFilter
        ariaPrefix="Applications"
        options={SCHOLARSHIP_STATUS_VALUES}
        value={statuses}
        onChange={setStatuses}
      />
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
      <SubmittedDateRangeFields
        ariaPrefix="Applications"
        from={submittedFrom}
        to={submittedTo}
        onFromChange={setSubmittedFrom}
        onToChange={setSubmittedTo}
      />
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
