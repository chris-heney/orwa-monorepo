import React from 'react';
import { ListBase } from 'react-admin';
import { useEmailManagementContext } from './EmailManagementContextProvider';
import RecordCount from '../_components/RecordCount';
import PageHeadingBar from '../_components/PageHeadingBar';
import {
  ColumnsAction,
  CreateAction,
  FilterAction,
} from '../_components/heading/HeadingActions';

/**
 * Email Management heading bar — the reference implementation for every
 * module heading: PageHeadingBar + 32px HeadingAction presets, no ad-hoc
 * margins, Filters as the right-most icon (under the app bar account icon).
 */
const EmailManagemenHeader = () => {
  const { selectedTab, setIsFilterSidebarOpen, isFilterSidebarOpen, isSettingsOpen } =
    useEmailManagementContext();

  const resource = selectedTab;
  const title = (
    selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)
  ).replace(/-/g, ' ');

  return (
    <PageHeadingBar
      title={isSettingsOpen ? 'Settings' : title}
      actions={
        resource !== null && !isSettingsOpen ? (
          <ListBase
            disableSyncWithLocation
            exporter={undefined}
            resource={resource}
          >
            <RecordCount />
            {selectedTab !== 'email-logs' && <CreateAction />}
            <ColumnsAction />
            <FilterAction
              active={isFilterSidebarOpen}
              onClick={() => setIsFilterSidebarOpen((prev) => !prev)}
            />
          </ListBase>
        ) : undefined
      }
    />
  );
};

export default EmailManagemenHeader;
