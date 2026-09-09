import React from "react";
import { Button, Theme, useMediaQuery } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RecordCount from "../../_components/RecordCount";
import PageHeadingBar from "../../_components/PageHeadingBar";
import {
  ActivityAction,
  ColumnsAction,
  ExportAction,
  FilterAction,
  SearchAction,
  SettingsAction,
} from "../../_components/heading/HeadingActions";
import {
  ConfigurableDatagridColumn,
  ListBase,
  RaRecord,
  useDataProvider,
  useStore,
} from "react-admin";
import CustomExportFunction from "../../../helpers/custom-export-function";
import { useGrantContext } from "../../grant-manager/GrantContextProvider";
import exportPayouts from "../../grant-manager/payouts/helpers/exportPayouts";
import ExportApplications from "../../grant-manager/grant-application/helpers/ExportApplication";
import ExportAdminPayouts from "../grant-application/helpers/ExportAdminPayouts";
import { IGrantApplication } from "../grant-application/GrantApplicationTypes";
import { isSearchableTab } from "../helpers/searchBarTabs";
import {
  buildApplicationListFilter,
  buildScoreFiscalYearFilter,
} from "../helpers/fiscalYearFilters";

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
    grantFilterId,
    payoutStatusId,
    fiscalYearStart,
    fiscalYearEnd,
    setGodMode,
    searchBarOpen,
    setSearchBarOpenForTab,
    setApplicationSearchFilter,
    openCreatePayoutModal,
  } = useGrantContext();

  const searchableTab = isSearchableTab(selectedTab) ? selectedTab : null;

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
    CustomExportFunction(
      records,
      availableColumns,
      columnIds,
      "Grant Scores",
      dataProvider
    );
  };

  const adminPayoutExport = (records: RaRecord[]) => {
    ExportAdminPayouts(
      records,
      "Administrative Payouts",
      dataProvider
    );
  };

  // Financial reporting: reimbursement payouts are attributed to the fiscal
  // year their application was approved (committee date); administrative
  // payouts have no application, so they keep the transaction date.
  const payoutFiscalYearFilter =
    fiscalYearStart && fiscalYearEnd
      ? selectedTab === "Admin Payouts"
        ? {
            transaction_date: {
              $between: [fiscalYearStart, fiscalYearEnd],
            },
          }
        : {
            application: {
              committee_date: {
                $between: [fiscalYearStart, fiscalYearEnd],
              },
            },
          }
      : {};

  const title = isSettingsOpen
    ? "Grant Management Settings"
    : dashboardContext === "create"
    ? "New Grant"
    : `${
        grants[grantIndex].name !== "grant" ? grants[grantIndex].name : ""
      } ${isSmall ? "" : `: ${selectedTab}`}`;

  const toggleSearch = () => {
    if (!searchableTab) return;
    const willOpen = !searchBarOpen[searchableTab];
    if (!willOpen) {
      // Clear persisted application search before closing so the
      // provider effect cannot immediately re-open the bar.
      if (searchableTab === "applications") {
        setApplicationSearchFilter("");
      }
      setSearchBarOpenForTab(searchableTab, false);
    } else {
      setSearchBarOpenForTab(searchableTab, true);
    }
  };

  return (
    <PageHeadingBar
      title={title}
      onTitleClick={() => setGodMode((prev) => !prev)}
      actions={
        <>
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
                  ? buildApplicationListFilter(
                      grantFilterId,
                      applicationStatuses,
                      fiscalYearStart,
                      fiscalYearEnd
                    )
                  : resource === "grant-payouts"
                  ? {
                      grant: grantFilterId,
                      ...(payoutStatusId && { payout_status: payoutStatusId }),
                      type:
                        selectedTab === "Admin Payouts"
                          ? "Administrative"
                          : "Reimbursement",
                      ...payoutFiscalYearFilter,
                    }
                  : resource === "grant-application-scores"
                  ? buildScoreFiscalYearFilter(
                      fiscalYearStart,
                      fiscalYearEnd
                    ) ?? undefined
                  : undefined
              }
            >
              <RecordCount />
              <ExportAction />
              <ColumnsAction />
              {(selectedTab === "payouts" ||
                selectedTab === "Admin Payouts") && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => openCreatePayoutModal()}
                  sx={{
                    backgroundColor: "primary.main",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "primary.dark",
                    },
                  }}
                >
                  Payout
                </Button>
              )}
            </ListBase>
          )}

          {searchableTab && (
            <SearchAction
              active={Boolean(searchBarOpen[searchableTab])}
              onClick={toggleSearch}
            />
          )}

          <FilterAction
            active={isFilterSidebarOpen}
            onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
          />

          {selectedTab === "summary" && (
            <ActivityAction
              active={isActivitySidebarOpen}
              onClick={() => setIsActivitySidebarOpen(!isActivitySidebarOpen)}
            />
          )}

          <SettingsAction
            active={isSettingsOpen}
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          />
        </>
      }
    />
  );
};

export default GrantDashboardHeader;
