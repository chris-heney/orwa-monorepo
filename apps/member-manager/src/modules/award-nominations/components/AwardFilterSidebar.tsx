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
import { usePageManifest } from "../../../framework/PageContext";
import { calendarYearChoices, WATER_SYSTEM_REGIONS } from "../helpers/listFilters";
import { awardTypeChoices, type AwardTypeRecord } from "../helpers/awardTypes";
import { SavedFiltersSection } from "../../_components/SavedFiltersSection";
import {
  useAwardRegion,
  useAwardSearch,
  useAwardType,
  useAwardYear,
} from "../helpers/awardStore";

/**
 * Filters drawer body for the Awards dashboard (Nominations + Winners tabs).
 * Values live in the legacy RaStore keys; the manifest watches them and
 * derives each tab's permanent list filter. Winners only filters by year.
 */
const AwardFilterSidebar = () => {
  const tab = usePageManifest().tab?.key;
  const [search, setSearch] = useAwardSearch();
  const [year, setYear] = useAwardYear();
  const [region, setRegion] = useAwardRegion();
  const [awardType, setAwardType] = useAwardType();
  const notify = useNotify();
  const nominations = tab !== "winners";
  const { data, isError } = useGetList<AwardTypeRecord>(
    "award-types",
    {
      pagination: { page: 1, perPage: 200 },
      sort: { field: "order", order: "ASC" },
    },
    { enabled: nominations }
  );

  useEffect(() => {
    if (isError) {
      notify(
        "Could not load award types. Using the previous hardcoded list.",
        { type: "warning" }
      );
    }
  }, [isError, notify]);

  const typeChoices = awardTypeChoices(data);

  return (
    <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2.5 }}>
      <SavedFiltersSection />
      {nominations ? (
        <>
          <FormControl fullWidth>
            <FormLabel>Search</FormLabel>
            <TextField
              size="small"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Nominee, email, system…"
              inputProps={{ "aria-label": "Search nominations" }}
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
              <FormControlLabel value="all" control={<Radio />} label="All" />
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
  );
};

export default AwardFilterSidebar;
