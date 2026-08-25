import React from 'react';
import {
  Datagrid,
  DateField,
  FunctionField,
  List,
  TextField,
  Title,
} from 'react-admin';
import CreateButton from '../_components/CustomCreateButton';
import { useEditRowClick } from '../rbac-manager/useCan';
import { Box, Theme } from '@mui/material';
import PageHeadingBar from '../_components/PageHeadingBar';

const barButtonSx = {
  color: 'white',
  '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
};

const termDatagridSx = (theme: Theme) => ({
  '& .RaDatagrid-rowOdd': {
    backgroundColor:
      theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.04)' : '#eeeeee',
  },
  '& .RaDatagrid-thead': {
    whiteSpace: 'nowrap',
  },
  'tr th': {
    py: 1,
    border: `1px solid ${theme.palette.divider}`,
    color: 'text.primary',
  },
  'tr td': {
    py: 0.5,
    border: `1px solid ${theme.palette.divider}`,
    color: 'text.primary',
  },
});

const TermListHeader = () => (
  <PageHeadingBar
    title="Terms Manager"
    info="Create and tag legal documents shown by TermsGate. Use identifiers like Global, All Conferences, or ORWA Conference ID #N."
    actions={<CreateButton label="Add Term" sx={barButtonSx} />}
  />
);

const TermList = () => {
  const rowClick = useEditRowClick();

  return (
    <Box sx={{ width: 1, minWidth: 0, boxSizing: 'border-box' }}>
      <Title title="Terms Manager" />
      <List
        title=" "
        sort={{ field: 'updatedAt', order: 'DESC' }}
        actions={false}
        sx={{
          '& .RaList-main': { marginTop: 0 },
          '& .RaList-content': { boxShadow: 'none' },
        }}
      >
        <TermListHeader />
        <Datagrid
          rowClick={rowClick}
          bulkActionButtons={false}
          sx={termDatagridSx}
        >
          <TextField source="title" />
          <TextField source="slug" />
          <FunctionField
            label="Identifiers"
            render={(record: { identifiers?: string[] }) =>
              Array.isArray(record.identifiers)
                ? record.identifiers.join(', ')
                : ''
            }
          />
          <DateField source="updatedAt" label="Last Modified" showTime />
        </Datagrid>
      </List>
    </Box>
  );
};

export default TermList;
