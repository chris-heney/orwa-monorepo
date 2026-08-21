import React from 'react';
import { Box } from '@mui/material';
import {
  ConfigurableDatagridColumn,
  ListBase,
  useDataProvider,
  useRedirect,
  useStore,
} from 'react-admin';
import RecordCount from '../../_components/RecordCount';
import PageHeadingBar from '../../_components/PageHeadingBar';
import {
  AddAction,
  ColumnsAction,
  ExportAction,
  FilterAction,
} from '../../_components/heading/HeadingActions';
import CustomContactExport from '../contacts/CustomContactExport';
import { useHumanResourcesContext } from '../HumanResourcesContext';
import { useCan } from '../../rbac-manager/useCan';

/**
 * Contacts page heading — standardized on PageHeadingBar + icon-only actions
 * (RecordCount, Columns, Export, Add, Filter). The ListBase here only provides
 * count/export context for the toolbar; the grid renders its own List below.
 */
const ContactsHeader = () => {
  const { setIsFilterSidebarOpen, contactFilters } = useHumanResourcesContext();
  const { canOnResource } = useCan();
  const dataProvider = useDataProvider();
  const redirect = useRedirect();

  const [availableColumns] = useStore<ConfigurableDatagridColumn[]>(
    'preferences.contacts.datagrid.availableColumns',
    []
  );
  const [columnIds] = useStore<string[]>(
    'preferences.contacts.datagrid.columns',
    []
  );

  const handleExport = () =>
    CustomContactExport(
      'contacts',
      availableColumns,
      columnIds,
      dataProvider,
      `Contacts-${new Date().toLocaleDateString()}`
    );

  const openFilters = () => {
    setIsFilterSidebarOpen((prev) => !prev);
    setTimeout(() => window.scrollTo(document.body.scrollWidth, 0), 150);
  };

  return (
    <ListBase
      disableSyncWithLocation
      resource="contacts"
      filter={contactFilters || {}}
      filterDefaultValues={contactFilters || {}}
      exporter={handleExport}
    >
      <PageHeadingBar
        title="Contacts"
        sx={{ mb: 0 }}
        actions={
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              flexWrap: 'wrap',
              justifyContent: 'flex-end',
            }}
          >
            <RecordCount />
            <ColumnsAction />
            <ExportAction />
            {canOnResource('create', 'contacts') && (
              <AddAction
                label="Add Contact"
                onClick={() => redirect('/contacts/create')}
              />
            )}
            <FilterAction onClick={openFilters} />
          </Box>
        }
      />
    </ListBase>
  );
};

export default ContactsHeader;
