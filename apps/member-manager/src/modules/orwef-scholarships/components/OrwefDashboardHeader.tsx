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
  ListBase,
  SelectColumnsButton,
  useStore,
} from "react-admin";
import { useOrwefContext } from "../OrwefContextProvider";
import RecordCount from "../../_components/RecordCount";
import type { AgDatagridPrefs } from "../../_components/AgDatagrid";
import { buildScholarshipListFilter } from "../helpers/listFilters";
import ScholarshipPrintButton from "./ScholarshipPrintButton";

const AG_PREFS_KEY = "agGrid.scholarship-applications";
const RESOURCE = "scholarship-applications";

const TAB_TITLES: Record<string, string> = {
  summary: "Summary",
  applications: "Applications",
};

const OrwefDashboardHeader = () => {
  const {
    selectedTab,
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    search,
    status,
    year,
  } = useOrwefContext();
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
        {selectedTab === "applications" ? (
          <ListBase
            disableSyncWithLocation
            resource={RESOURCE}
            filter={buildScholarshipListFilter(search, status, year)}
            perPage={agPrefs.pageSize || 50}
          >
            <RecordCount />
            <ScholarshipPrintButton listMode sx={{ color: "white" }} />
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

export default OrwefDashboardHeader;
