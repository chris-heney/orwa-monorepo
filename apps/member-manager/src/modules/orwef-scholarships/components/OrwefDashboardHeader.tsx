import React from "react";
import { ListBase, useStore } from "react-admin";
import { useOrwefContext } from "../OrwefContextProvider";
import RecordCount from "../../_components/RecordCount";
import PageHeadingBar from "../../_components/PageHeadingBar";
import {
  ColumnsAction,
  FilterAction,
} from "../../_components/heading/HeadingActions";
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
    region,
    year,
  } = useOrwefContext();
  const [agPrefs] = useStore<AgDatagridPrefs>(AG_PREFS_KEY, {});

  return (
    <PageHeadingBar
      title={TAB_TITLES[selectedTab] || selectedTab}
      actions={
        <>
          {selectedTab === "applications" ? (
            <ListBase
              disableSyncWithLocation
              resource={RESOURCE}
              filter={buildScholarshipListFilter(search, year, region)}
              perPage={agPrefs.pageSize || 50}
            >
              <RecordCount />
              <ScholarshipPrintButton listMode sx={{ color: "white" }} />
              <ColumnsAction />
            </ListBase>
          ) : null}
          <FilterAction
            active={isFilterSidebarOpen}
            onClick={() => setIsFilterSidebarOpen((open) => !open)}
          />
        </>
      }
    />
  );
};

export default OrwefDashboardHeader;
