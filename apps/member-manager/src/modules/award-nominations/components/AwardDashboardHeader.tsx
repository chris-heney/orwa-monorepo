import React from "react";
import { Box, IconButton, MenuItem, TextField, Tooltip } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  CreateButton,
  ExportButton,
  ListBase,
  SelectColumnsButton,
  useStore,
} from "react-admin";
import { useAwardContext } from "../AwardContextProvider";
import RecordCount from "../../_components/RecordCount";
import PageHeadingBar from "../../_components/PageHeadingBar";
import type { AgDatagridPrefs } from "../../_components/AgDatagrid";
import {
  buildAwardListFilter,
  calendarYearChoices,
} from "../helpers/listFilters";
import { useAwardColumnDefaults } from "../helpers/useAwardColumnDefaults";
import { AwardPrintSelectedButton } from "./AwardPrintButton";

const AG_PREFS_KEY = "agGrid.award-nominations";
const RESOURCE = "award-nominations";

const TAB_TITLES: Record<string, string> = {
  summary: "Summary",
  nominations: "Nominations",
  winners: "Winners",
};

const YEAR_SELECT_SX = {
  minWidth: 118,
  "& .MuiInputBase-input": { color: "white", py: 0.75, fontSize: 14 },
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "grey.600" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "grey.400" },
  "& .MuiSvgIcon-root": { color: "white" },
};

const AwardDashboardHeader = () => {
  const {
    selectedTab,
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    search,
    status,
    year,
    setYear,
  } = useAwardContext();
  const [agPrefs] = useStore<AgDatagridPrefs>(AG_PREFS_KEY, {});
  useAwardColumnDefaults();

  const yearLabel = year === "all" ? "All Years" : String(year);

  return (
    <PageHeadingBar
      title={
        <>
          {TAB_TITLES[selectedTab] || selectedTab}
          <Box component="span" sx={{ fontWeight: 500, opacity: 0.85 }}>
            {` · ${yearLabel}`}
          </Box>
        </>
      }
      actions={
        <>
          {selectedTab === "nominations" ? (
            <ListBase
              disableSyncWithLocation
              resource={RESOURCE}
              filter={buildAwardListFilter(search, status, year)}
              perPage={agPrefs.pageSize || 50}
            >
              <RecordCount />
              <ExportButton sx={{ color: "white" }} />
              <SelectColumnsButton style={{ color: "white" }} />
            </ListBase>
          ) : null}
          {selectedTab === "winners" ? (
            <ListBase
              disableSyncWithLocation
              resource="award-winners"
              filter={year === "all" ? {} : { award_year: year }}
              perPage={50}
            >
              <RecordCount />
              <CreateButton
                resource="award-winners"
                label="Add Winner"
                sx={{ color: "white" }}
              />
            </ListBase>
          ) : null}
          <TextField
            select
            size="small"
            value={year}
            onChange={(event) =>
              setYear(
                event.target.value === "all" ? "all" : Number(event.target.value)
              )
            }
            aria-label="Award year"
            sx={YEAR_SELECT_SX}
          >
            {calendarYearChoices().map((value) => (
              <MenuItem key={String(value)} value={value}>
                {value === "all" ? "All years" : value}
              </MenuItem>
            ))}
          </TextField>
          <Tooltip title="Filter">
            <IconButton
              onClick={() => setIsFilterSidebarOpen((open) => !open)}
              size="small"
              color="primary"
              aria-label="Filter"
            >
              <FilterAltIcon
                fontSize="small"
                style={
                  !isFilterSidebarOpen ? { stroke: "white" } : { fill: "white" }
                }
                sx={{ "&:hover": { color: "white" } }}
              />
            </IconButton>
          </Tooltip>
          {selectedTab === "nominations" ? <AwardPrintSelectedButton /> : null}
        </>
      }
    />
  );
};

export default AwardDashboardHeader;
