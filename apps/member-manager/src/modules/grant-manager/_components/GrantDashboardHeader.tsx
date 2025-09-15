import React from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Theme,
  Typography,
  useMediaQuery,
} from "@mui/material";
import MarkunreadMailboxIcon from "@mui/icons-material/MarkunreadMailbox";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import RecordCount from "../../_components/RecordCount";
import {
  ConfigurableDatagridColumn,
  ExportButton,
  ListBase,
  RaRecord,
  SelectColumnsButton,
  TopToolbar,
  useDataProvider,
  useStore,
} from "react-admin";
import CustomExportFunction from "../../../helpers/custom-export-function";
import { useGrantContext } from "../../grant-manager/GrantContextProvider";
import exportPayouts from "../../grant-manager/payouts/helpers/exportPayouts";
import ExportApplications from "../../grant-manager/grant-application/helpers/ExportApplication";
import ExportAdminPayouts from "../grant-application/helpers/ExportAdminPayouts";
import { IGrantApplication } from "../grant-application/GrantApplicationTypes";

const GrantDashboardHeader = () => {
  const {
    isFilterSidebarOpen,
    setIsFilterSidebarOpen,
    grants,
    grantIndex,
    selectedTab,
    dashboardContext,
    isSettingsOpen,
    setIsSettingsOpen,
    isActivitySidebarOpen,
    setIsActivitySidebarOpen,
    resource,
    applicationStatuses,
    grantId,
    payoutStatusId,
    fiscalYearStart,
    fiscalYearEnd,
    setGodMode,
  } = useGrantContext();

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  const dataProvider = useDataProvider();

  const preferenceKey = `${resource}.datagrid`;
  const [availableColumns] = useStore<ConfigurableDatagridColumn[]>(
    `preferences.${preferenceKey}.availableColumns`,
    []
  );

  const [columnIds] = useStore<string[]>(
    `preferences.${preferenceKey}.columns`,
    []
  );

  const payoutExport = (records: RaRecord[]) => {
    exportPayouts(
      records,
      availableColumns,
      columnIds,
      "Rig Payouts",
      dataProvider
    );
  };

  const applicationExport = (records: RaRecord[]) => {
    ExportApplications(
      records as IGrantApplication[],
      availableColumns,
      columnIds,
      "Rig Applications",
      dataProvider
    );
  };

  const defaultExport = (records: RaRecord[]) => {
    CustomExportFunction(records, availableColumns, columnIds, "Grant Scores");
  };

  const adminPayoutExport = (records: RaRecord[]) => {
    ExportAdminPayouts(
      records,
      "Administrative Payouts",
      dataProvider
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#262626",
        px: 2,
      }}
    >
      <Typography
        onClick={() => setGodMode((prev) => !prev)}
        variant="h6"
        sx={{
          fontSize: isSmall ? "10px" : null,
          color: "white",
          fontWeight: "bold",
          textTransform: "uppercase",
          textAlign: "left",
        }}
      >
        {isSettingsOpen
          ? "Grant Management Settings"
          : dashboardContext === "create"
          ? "New Grant"
          : `${
              grants[grantIndex].name !== "grant" ? grants[grantIndex].name : ""
            } ${isSmall ? "" : `: ${selectedTab}`}`}
      </Typography>
      <TopToolbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          {resource && (
            <ListBase
              disableSyncWithLocation
              exporter={
                resource === "grant-application-finals"
                  ? applicationExport
                  : resource === "grant-payouts" && selectedTab === "payouts"
                  ? payoutExport
                  : selectedTab === "Admin Payouts"
                  ? adminPayoutExport
                  : defaultExport
              }
              resource={resource}
              filter={
                resource === "grant-application-finals"
                  ? applicationStatuses.length > 0
                    ? { grant: grantId, status: applicationStatuses }
                    : { grant: grantId }
                  : resource === "grant-payouts"
                  ? payoutStatusId
                    ? {
                        grant: grantId,
                        payout_status: payoutStatusId,
                        type:
                          selectedTab === "Admin Payouts"
                            ? "Administrative"
                            : "Reimbursement",
                            ...(fiscalYearStart && fiscalYearEnd && {
                              transaction_date: {
                                $between: [fiscalYearStart, fiscalYearEnd],
                              },
                          }),
                        
                      }
                    : { grant: grantId,
                      type:
                          selectedTab === "Admin Payouts"
                            ? "Administrative"
                            : "Reimbursement",
                            ...(fiscalYearStart && fiscalYearEnd && {
                              transaction_date: {
                                $between: [fiscalYearStart, fiscalYearEnd],
                              },
                          }),

                    }
                  : undefined
              }
            >
              <RecordCount />
              <ExportButton sx={{ color: "white" }} />
              <SelectColumnsButton style={{ color: "white" }} />
            </ListBase>
          )}

          {/* <Tooltip
            title={
              dashboardContext === "create" ? "Edit Grant" : "Add New Grant"
            }
          >
            <IconButton
              onClick={() =>
                setDashboardContext(
                  dashboardContext === "create" ? "edit" : "create"
                )
              }
              size="small"
              color="primary"
            >
              {dashboardContext === "create" ? (
                <EditIcon
                  sx={{
                    "&:hover": {
                      color: "white",
                    },
                  }}
                  fontSize="small"
                />
              ) : (
                <AddIcon
                  sx={{
                    "&:hover": {
                      color: "white",
                    },
                  }}
                  fontSize="small"
                />
              )}
            </IconButton>
          </Tooltip> */}

          <Tooltip title="Filter">
            <IconButton
              onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
              size="small"
              color="primary"
            >
              <FilterAltIcon
                fontSize="small"
                style={
                  !isFilterSidebarOpen ? { stroke: "white" } : { fill: "white" }
                }
                sx={{
                  "&:hover": {
                    color: "white",
                  },
                }}
              />
            </IconButton>
          </Tooltip>

          {selectedTab === "summary" && (
            <Tooltip title="Activity">
              <IconButton
                onClick={() => setIsActivitySidebarOpen(!isActivitySidebarOpen)}
                size="small"
                color="primary"
              >
                <MarkunreadMailboxIcon
                  fontSize="small"
                  sx={{
                    "&:hover": {
                      color: "white",
                    },
                  }}
                  style={
                    !isActivitySidebarOpen
                      ? { stroke: "white" }
                      : { fill: "white" }
                  }
                />
              </IconButton>
            </Tooltip>
          )}

          <Tooltip title="Settings">
            <IconButton
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              size="small"
              color="primary"
            >
              <SettingsIcon
                fontSize="small"
                sx={{
                  "&:hover": {
                    color: "white",
                  },
                }}
                style={
                  !isSettingsOpen ? { stroke: "white" } : { fill: "white" }
                }
              />
            </IconButton>
          </Tooltip>
        </Box>
      </TopToolbar>
    </Box>
  );
};

export default GrantDashboardHeader;
