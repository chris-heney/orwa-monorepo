import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  ExportButton,
  ListBase,
  SelectColumnsButton,
  useStore,
} from "react-admin";
import { useAwardContext } from "../AwardContextProvider";
import RecordCount from "../../_components/RecordCount";
import PageHeadingBar from "../../_components/PageHeadingBar";
import type { AgDatagridPrefs } from "../../_components/AgDatagrid";
import { buildAwardListFilter } from "../helpers/listFilters";
import { useAwardColumnDefaults } from "../helpers/useAwardColumnDefaults";

const AG_PREFS_KEY = "agGrid.award-nominations";
const RESOURCE = "award-nominations";

const TAB_TITLES: Record<string, string> = {
  summary: "Summary",
  nominations: "Nominations",
};

const AwardDashboardHeader = () => {
  const {
    selectedTab,
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    search,
    status,
    year,
  } = useAwardContext();
  const [agPrefs] = useStore<AgDatagridPrefs>(AG_PREFS_KEY, {});
  useAwardColumnDefaults();

  return (
    <PageHeadingBar
      title={TAB_TITLES[selectedTab] || selectedTab}
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
        </>
      }
    />
  );
};

export default AwardDashboardHeader;
