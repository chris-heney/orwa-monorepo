import React from "react";
import {
  ConfigurableDatagridColumn,
  ListBase,
  RaRecord,
  useStore,
  useDataProvider,
} from "react-admin";
import {
  ActivityAction,
  AddAction,
  ColumnsAction,
  ExportAction,
  FilterAction,
  NotificationsAction,
  SettingsAction,
} from "../../_components/heading/HeadingActions";
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
              <ExportAction />
              <ColumnsAction />
            </ListBase>
          )}

          <AddAction
            label="Add New"
            active={isCreating}
            onClick={() => setIsCreating((prev) => !prev)}
          />

          {selectedTab !== "summary" && (
            <FilterAction
              active={isFilterSidebarOpen}
              onClick={() => setIsFilterSidebarOpen(!isFilterSidebarOpen)}
            />
          )}

          {selectedTab === "summary" && (
            <ActivityAction
              label="Activity"
              active={isActivitySidebarOpen}
              onClick={() => setIsActivitySidebarOpen(!isActivitySidebarOpen)}
            />
          )}

          {selectedTab === "soonerwarn applications" && !isSettingsOpen && (
            <NotificationsAction
              label="Email"
              active={isEmailSidebarOpen}
              onClick={() => setIsEmailSidebarOpen(!isEmailSidebarOpen)}
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

export default SoonerwarnDashboardHeader;
