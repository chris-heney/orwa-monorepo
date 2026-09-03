import React, { useEffect } from "react";
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
import { useGetList, useNotify } from "react-admin";
import FilterSidebarShell from "../../_components/FilterSidebarShell";
import { useAwardContext } from "../AwardContextProvider";
import {
  calendarYearChoices,
  WATER_SYSTEM_REGIONS,
} from "../helpers/listFilters";
import {
  awardTypeChoices,
  type AwardTypeRecord,
} from "../helpers/awardTypes";

const AwardFilterSidebar = () => {
  const {
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    search,
    setSearch,
    year,
    setYear,
    region,
    setRegion,
    awardType,
    setAwardType,
    selectedTab,
  } = useAwardContext();
  const notify = useNotify();
  const { data, isError } = useGetList<AwardTypeRecord>("award-types", {
    pagination: { page: 1, perPage: 200 },
    sort: { field: "order", order: "ASC" },
  });

  useEffect(() => {
    if (isError) {
      notify(
        "Could not load award types. Using the previous hardcoded list.",
        { type: "warning" }
      );
    }
  }, [isError, notify]);

  const typeChoices = awardTypeChoices(data);
  const hideSidebar = selectedTab === "settings";

  return (
    <FilterSidebarShell
      open={isFilterSidebarOpen && !hideSidebar}
      onClose={() => setIsFilterSidebarOpen(false)}
    >
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2.5 }}>
        {selectedTab !== "winners" ? (
          <>
            <FormControl fullWidth>
              <FormLabel>Search</FormLabel>
              <TextField
                size="small"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nominee, email, system…"
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
            <FormControl>
              <FormLabel>Award Type</FormLabel>
              <RadioGroup
                value={awardType}
                onChange={(event) => setAwardType(event.target.value)}
              >
                <FormControlLabel
                  value="all"
                  control={<Radio />}
                  label="All"
                />
                {typeChoices.map((choice) => (
                  <FormControlLabel
                    key={choice.id}
                    value={choice.id}
                    control={<Radio />}
                    label={choice.name}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </>
        ) : null}
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

export default AwardFilterSidebar;
