import React from 'react';
import { Box } from '@mui/material';
import { Button, ListBase, SelectColumnsButton } from 'react-admin';
import CreateButton from '../_components/CustomCreateButton';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useEmailManagementContext } from './EmailManagementContextProvider';
import RecordCount from '../_components/RecordCount';
import PageHeadingBar from '../_components/PageHeadingBar';

const EmailManagemenHeader = () => {
  const { selectedTab, setIsFilterSidebarOpen, isSettingsOpen } =
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
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                alignItems: 'center',
              }}
            >
              <RecordCount />

              {selectedTab !== 'email-logs' && (
                <CreateButton size="small" sx={{ color: 'white' }} />
              )}

              <SelectColumnsButton style={{ color: 'white' }} />

              <Button
                label="Filter"
                sx={{ color: 'white', mr: 2 }}
                onClick={() => {
                  setIsFilterSidebarOpen((prev) => !prev);
                  setTimeout(() => {
                    window.scrollTo(document.body.scrollWidth, 0);
                  }, 150);
                }}
              >
                <FilterAltIcon />
              </Button>
            </Box>
          </ListBase>
        ) : undefined
      }
    />
  );
};

export default EmailManagemenHeader;
