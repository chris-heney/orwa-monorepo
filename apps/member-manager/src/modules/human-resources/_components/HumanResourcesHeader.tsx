import React from 'react';
import { Box, Theme, Typography, useMediaQuery } from '@mui/material';
import {
  Button,
  ConfigurableDatagridColumn,
  ListBase,
  SelectColumnsButton,
  TopToolbar,
  useStore,
  useDataProvider,
  ExportButton,
} from 'react-admin';
import CustomCreateButton from '../../_components/CustomCreateButton';
import CustomExportFunction from '../../../helpers/custom-export-function';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RecordCount from '../../_components/RecordCount';
import { useHumanResourcesContext } from '../HumanResourcesContext';
import CreateUserModal from '../users/CreateUserModal';
import SettingsIcon from '@mui/icons-material/Settings';
import { formatTitle } from '../../../helpers/formatResourceTitle';
import CustomContactExport from '../contacts/CustomContactExport';
import { useCan, resourceToApiName } from '../../rbac-manager/useCan';
import RolesContextProvider from '../../../context/RolesContextProvider';

const HumanResourcesHeader = () => {
  const {
    selectedTab,
    setIsFilterSidebarOpen,
    setIsSettingsOpen,
    isSettingsOpen,
    contactFilters,
    staffFilters,
    instructorFilters,
    userFilters,
  } = useHumanResourcesContext();

  const { can } = useCan();

  const resource = selectedTab;

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

  // Get current filters based on selected tab
  const getCurrentFilters = () => {
    switch (selectedTab) {
      case 'contacts':
        return contactFilters || {};
      case 'staff':
        return staffFilters || {};
      case 'training-instructors':
        return instructorFilters || {};
      case 'users':
        return userFilters || {};
      default:
        return {};
    }
  };

  const handleExport = async () => {
    if (!resource) {
      console.error('Resource is null, cannot perform export.');
      return;
    }

    const { data: records } = await dataProvider.getList(resource, {
      pagination: { page: 1, perPage: 1000 }, // Adjust pagination as needed
      sort: { field: 'id', order: 'ASC' }, // Adjust sorting as needed
      filter: getCurrentFilters(),
    });

    if (selectedTab === 'contacts') {
      CustomContactExport(
        'contacts',
        availableColumns,
        columnIds,
        dataProvider,
        `${formatTitle(resource)}-${new Date().toLocaleDateString()}`
      );
    } else {
      CustomExportFunction(
        records,
        availableColumns,
        columnIds,
        `${formatTitle(resource)}-${new Date().toLocaleDateString()}`,
        dataProvider
      );
    }
  };

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#262626',
        px: 1,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontSize: isSmall ? '10px' : null,
          alignItems: 'center',
          color: 'white',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          textAlign: 'left',
        }}
      >
        {isSettingsOpen ? 'Settings' : formatTitle(resource)}
      </Typography>
      <TopToolbar>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 1,
          }}
        >
          {resource !== null && !isSettingsOpen && (
            <ListBase
              disableSyncWithLocation
              exporter={() => handleExport()}
              resource={resource}
              filter={getCurrentFilters()}
              filterDefaultValues={getCurrentFilters()}
            >
              {resource !== 'users' && <RecordCount />}

              {selectedTab === 'contacts' && (
                <SelectColumnsButton
                  style={{
                    color: 'white',
                  }}
                />
              )}

              {resource !== 'users' && (
                <ExportButton
                  size="small"
                  sx={{
                    color: 'white',
                  }}
                />
              )}
              {resource === 'users' && (
                <RolesContextProvider>
                  <CreateUserModal isSmall />
                </RolesContextProvider>
              )}

              {resource !== 'users' &&
                can('create', resourceToApiName(resource)) && (
                  <CustomCreateButton
                    size="small"
                    sx={{
                      color: 'white',
                    }}
                    label=""
                  />
                )}

              <Button
                sx={{
                  color: 'white',
                }}
                size="small"
                onClick={() => {
                  setIsFilterSidebarOpen((prev) => !prev);
                  setTimeout(() => {
                    window.scrollTo(document.body.scrollWidth, 0);
                  }, 150);
                }}
              >
                <FilterAltIcon />
              </Button>
            </ListBase>
          )}
          {/* The settings panel (BadgeList) manages contact-badge records. */}
          {can('create', 'contact-badge') && (
            <Button
              onClick={() => {
                setIsSettingsOpen((prev) => !prev);
              }}
              size="small"
            >
              <SettingsIcon
                fontSize="small"
                sx={{
                  color: 'white',
                  '&:hover': {
                    color: 'white',
                  },
                }}
              />
            </Button>
          )}
        </Box>
      </TopToolbar>
    </Box>
  );
};

export default HumanResourcesHeader;
