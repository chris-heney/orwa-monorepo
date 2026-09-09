import React from "react";
import { Box, MenuItem, TextField } from "@mui/material";
import { ListBase, useStore } from "react-admin";
import { useAwardContext } from "../AwardContextProvider";
import RecordCount from "../../_components/RecordCount";
import PageHeadingBar from "../../_components/PageHeadingBar";
import {
  ColumnsAction,
  CreateAction,
  ExportAction,
  FilterAction,
} from "../../_components/heading/HeadingActions";
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
  settings: "Settings",
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
    year,
    setYear,
    region,
    awardType,
  } = useAwardContext();
  const [agPrefs] = useStore<AgDatagridPrefs>(AG_PREFS_KEY, {});
  useAwardColumnDefaults();

  const showYear = selectedTab !== "settings";
  const yearLabel = year === "all" ? "All Years" : String(year);

  return (
    <PageHeadingBar
      title={
        <>
          {TAB_TITLES[selectedTab] || selectedTab}
          {showYear ? (
            <Box component="span" sx={{ fontWeight: 500, opacity: 0.85 }}>
              {` · ${yearLabel}`}
            </Box>
          ) : null}
        </>
      }
      actions={
        <>
          {selectedTab === "nominations" ? (
            <ListBase
              disableSyncWithLocation
              resource={RESOURCE}
              filter={buildAwardListFilter(search, year, region, awardType)}
              perPage={agPrefs.pageSize || 50}
            >
              <RecordCount />
              <ExportAction />
              <ColumnsAction />
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
              <CreateAction resource="award-winners" label="Add Winner" />
            </ListBase>
          ) : null}
          {showYear ? (
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
          ) : null}
          {selectedTab !== "settings" ? (
            <FilterAction
              active={isFilterSidebarOpen}
              onClick={() => setIsFilterSidebarOpen((open) => !open)}
            />
          ) : null}
          {selectedTab === "nominations" ? <AwardPrintSelectedButton /> : null}
        </>
      }
    />
  );
};

export default AwardDashboardHeader;
