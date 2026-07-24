import React from 'react'
import { useMediaQuery } from '@mui/material'
import { Theme } from '@mui/material/styles'
import {
  List,
  TextField,
  SimpleList,
  ConfigurableDatagridColumn,
  useStore,
  DatagridConfigurable,
  NumberField,
  RaRecord,
} from 'react-admin'
import CustomExportFunction from '../../../helpers/custom-export-function'
import CustomListActions from '../../_components/CustomListActions'


const SessionList = () => {
  const preferenceKey = 'training-topics.datagrid'
  const [availableColumns] = useStore<
    ConfigurableDatagridColumn[]
  >(`preferences.${preferenceKey}.availableColumns`, [])

  const [columnIds] = useStore<string[]>(
    `preferences.${preferenceKey}.columns`,
    []
  )

  const exporter = (records: RaRecord[]) => {
    CustomExportFunction(records, availableColumns, columnIds, 'TopicsList')
  }

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'))
  return (
    <List title={'Training Topics'} actions={<CustomListActions createButtonLabel="New Topics" />} exporter={exporter}>
      {isSmall ? (
        <SimpleList
          linkType='edit'
          primaryText={(record) => record.name }
          secondaryText={(record) => record.category} tertiaryText={(record) => record.hours}
        />
      ) : (
        <DatagridConfigurable
          bulkActionButtons={false}
          rowClick="edit"
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

  )
}

export default SessionList