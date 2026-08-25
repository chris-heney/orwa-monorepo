import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import EmailIcon from "@mui/icons-material/Email";
import AddIcon from "@mui/icons-material/Add";
import {
  ConfigurableDatagridColumn,
  ExportButton,
  ListBase,
  RaRecord,
  SelectColumnsButton,
  useStore,
  useDataProvider,
} from "react-admin";
import { useSoonerwarnContext } from "../SoonerwarnContextProvider";
import CustomExportFunction from "../../../helpers/custom-export-function";
import RecordCount from "../../_components/RecordCount";
import PageHeadingBar from "../../_components/PageHeadingBar";

const SoonerwarnDashboardHeader = () => {
  const {
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    selectedTab,
    isSettingsOpen,
    setIsSettingsOpen,
    isActivitySidebarOpen,
    setIsActivitySidebarOpen,
    isEmailSidebarOpen,
    setIsEmailSidebarOpen,
    resource,
    setIsCreating,
    isCreating,
  } = useSoonerwarnContext();

  const preferenceKey = `${resource}.datagrid`;
  const [availableColumns] = useStore<ConfigurableDatagridColumn[]>(
    `preferences.${preferenceKey}.availableColumns`,
    []
  );

  const [columnIds] = useStore<string[]>(
    `preferences.${preferenceKey}.columns`,
    []
  );

  const dataProvider = useDataProvider();
  const defaultExport = (records: RaRecord[]) => {
    CustomExportFunction(
      records,
      availableColumns,
      columnIds,
      "SoonerWARN Applications",
      dataProvider,
      { status: "soonerwarn-statuses" }
    );
  };

  return (
    <PageHeadingBar
      title={
        isSettingsOpen ? "SoonerWARN Management Settings" : `${selectedTab}`
      }
      actions={
        <>
          {resource !== "summary" && resource !== null && (
            <ListBase
              disableSyncWithLocation
              exporter={
                resource === "soonerwarn-applications" ? defaultExport : false
              }
              resource={resource}
              filter={undefined}
            >
              <RecordCount />
              <ExportButton sx={{ color: "white" }} />
              <SelectColumnsButton style={{ color: "white" }} />
            </ListBase>
          )}

          <Tooltip title="Add New">
            <IconButton
              onClick={() => setIsCreating((prev) => !prev)}
              size="small"
              color="primary"
            >
              <AddIcon
                fontSize="small"
                sx={{ "&:hover": { color: "white" } }}
                style={!isCreating ? { stroke: "white" } : { fill: "white" }}
              />
            </IconButton>
          </Tooltip>

          {selectedTab !== "summary" && (
            <Tooltip title="Filter">
              <IconButton
                onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
                size="small"
                color="primary"
              >
                <FilterAltIcon
                  fontSize="small"
                  sx={{ "&:hover": { color: "white" } }}
                  style={
                    !isFilterSidebarOpen ? { stroke: "white" } : { fill: "white" }
                  }
                />
              </IconButton>
            </Tooltip>
          )}

          {selectedTab === "summary" && (
            <Tooltip title="Activity">
              <IconButton
                onClick={() => setIsActivitySidebarOpen(!isActivitySidebarOpen)}
                size="small"
                color="primary"
              >
                <MarkunreadMailboxIcon
                  fontSize="small"
                  style={
                    !isActivitySidebarOpen
                      ? { stroke: "white" }
                      : { fill: "white" }
                  }
                  sx={{ "&:hover": { color: "white" } }}
                />
              </IconButton>
            </Tooltip>
          )}

          {selectedTab === "soonerwarn applications" && !isSettingsOpen && (
            <Tooltip title="Email">
              <IconButton
                onClick={() => setIsEmailSidebarOpen(!isEmailSidebarOpen)}
                size="small"
                color="primary"
              >
                <EmailIcon
                  fontSize="small"
                  sx={{ "&:hover": { color: "white" } }}
                  style={
                    !isEmailSidebarOpen ? { stroke: "white" } : { fill: "white" }
                  }
                />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Settings">
            <IconButton
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              sx={{ p: 0.5 }}
              size="small"
              color="primary"
            >
              <SettingsIcon
                fontSize="small"
                sx={{ "&:hover": { color: "white" } }}
                style={!isSettingsOpen ? { stroke: "white" } : { fill: "white" }}
              />
            </IconButton>
          </Tooltip>
        </>
      }
    />
  );
};

export default SoonerwarnDashboardHeader;
