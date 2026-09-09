import React from 'react';
import { DateField, FunctionField, ListView, TextField } from 'react-admin';
import { Datagrid } from '@orwa/entity-id';
import { useEditRowClick } from '../rbac-manager/useCan';
import { Theme } from '@mui/material';

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

/** Body of the `terms.list` page — renders inside the page's ListScope. */
const TermList = () => {
  const rowClick = useEditRowClick();

  return (
    <ListView title=" " actions={false}>
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
    </ListView>
  );
};

export default TermList;
