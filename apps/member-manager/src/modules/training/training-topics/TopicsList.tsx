import React from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';
import {
  List,
  TextField,
  SimpleList,
  ConfigurableDatagridColumn,
  useStore,
  NumberField,
  RaRecord,
  useDataProvider,
  Title,
  ExportButton,
  SelectColumnsButton,
} from 'react-admin';
import { DatagridConfigurable } from "@orwa/entity-id";
import CustomExportFunction from '../../../helpers/custom-export-function';
import CreateButton from '../../_components/CustomCreateButton';
import PageHeadingBar from '../../_components/PageHeadingBar';
import { useEditRowClick } from '../../rbac-manager/useCan';

const barButtonSx = {
  color: 'white',
  '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
};

const SessionList = () => {
  const rowClick = useEditRowClick();
  const preferenceKey = 'training-topics.datagrid';
  const [availableColumns] = useStore<ConfigurableDatagridColumn[]>(
    `preferences.${preferenceKey}.availableColumns`,
    []
  );

  const [columnIds] = useStore<string[]>(
    `preferences.${preferenceKey}.columns`,
    []
  );

  const dataProvider = useDataProvider();
  const exporter = (records: RaRecord[]) => {
    CustomExportFunction(
      records,
      availableColumns,
      columnIds,
      'TopicsList',
      dataProvider
    );
  };

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
  return (
    <Box sx={{ width: 1, minWidth: 0, boxSizing: 'border-box' }}>
      <Title title="Training Topics" />
      <List
        title=" "
        actions={false}
        exporter={exporter}
        sx={{
          '& .RaList-main': { marginTop: 0 },
          '& .RaList-content': { boxShadow: 'none' },
        }}
      >
        <PageHeadingBar
          title="Training Topics"
          actions={
            <>
              <CreateButton label="New Topics" sx={barButtonSx} />
              {!isSmall && (
                <Box sx={{ '& .MuiButton-root': barButtonSx }}>
                  <SelectColumnsButton />
                </Box>
              )}
              <ExportButton sx={barButtonSx} />
            </>
          }
        />
        {isSmall ? (
          <SimpleList
            linkType="edit"
            primaryText={(record) => record.name}
            secondaryText={(record) => record.category}
            tertiaryText={(record) => record.hours}
          />
        ) : (
          <DatagridConfigurable
            bulkActionButtons={false}
            rowClick={rowClick}
            sx={{
              width: 'calc(100vw -500)',
            }}
          >
            <TextField source="id" label="ID" noWrap />
            <TextField source="name" label="Name" noWrap />
            <TextField source="category" label="Category" noWrap />
            <NumberField source="hours" label="Hours" noWrap />
            <TextField source="description" label="Summary" noWrap />
          </DatagridConfigurable>
        )}
      </List>
    </Box>
  );
};

export default SessionList;
