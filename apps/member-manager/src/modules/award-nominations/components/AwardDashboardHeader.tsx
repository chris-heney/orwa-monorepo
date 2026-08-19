import React from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  ExportButton,
  ListBase,
  SelectColumnsButton,
  useStore,
} from "react-admin";
import { useAwardContext } from "../AwardContextProvider";
import RecordCount from "../../_components/RecordCount";
import type { AgDatagridPrefs } from "../../_components/AgDatagrid";
import { buildAwardListFilter } from "../helpers/listFilters";

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
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
  const [agPrefs] = useStore<AgDatagridPrefs>(AG_PREFS_KEY, {});

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#262626",
        px: 1.5,
        py: 0.75,
        minHeight: 48,
      }}
    >
      <Typography
        variant={isSmall ? "subtitle2" : "h6"}
        sx={{
          color: "white",
          fontWeight: "bold",
          textTransform: "uppercase",
          lineHeight: 1.2,
          m: 0,
          fontSize: isSmall ? "10px" : undefined,
        }}
      >
        {TAB_TITLES[selectedTab] || selectedTab}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          "& .MuiButton-root": { minHeight: 0, py: 0.5, lineHeight: 1.2 },
        }}
      >
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
      </Box>
    </Box>
  );
};

export default AwardDashboardHeader;
