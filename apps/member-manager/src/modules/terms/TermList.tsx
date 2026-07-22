import React from 'react'
import {
  CreateButton,
  Datagrid,
  DateField,
  FunctionField,
  List,
  TextField,
  Title,
} from 'react-admin'
import { Box } from '@mui/material'
import { customDatagridStyle } from '../../css'
import PageHeadingBar from '../_components/PageHeadingBar'

const barButtonSx = {
  color: 'white',
  '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
}

const TermListHeader = () => (
  <PageHeadingBar
    title="Terms Manager"
    info="Create and tag legal documents shown by TermsGate. Use identifiers like Global, All Conferences, or ORWA Conference ID #N."
    actions={<CreateButton label="Add Term" sx={barButtonSx} />}
  />
)

const TermList = () => (
  <Box sx={{ width: 1, minWidth: 0, boxSizing: 'border-box', p: 2 }}>
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
      <Datagrid rowClick="edit" bulkActionButtons={false} sx={customDatagridStyle}>
        <TextField source="title" />
        <TextField source="slug" />
        <FunctionField
          label="Identifiers"
          render={(record: { identifiers?: string[] }) =>
            Array.isArray(record.identifiers) ? record.identifiers.join(', ') : ''
          }
        />
        <DateField source="updatedAt" label="Last Modified" showTime />
      </Datagrid>
    </List>
  </Box>
)

export default TermList
