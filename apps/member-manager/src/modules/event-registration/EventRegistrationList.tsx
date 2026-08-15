import { Box, useMediaQuery } from '@mui/material'
import { Theme } from '@mui/material/styles'
import CustomExportFunction from '../../helpers/custom-export-function'
import React from 'react'
import {
  List,
  TextField,
  TopToolbar,
  SelectColumnsButton,
  CreateButton,
  ExportButton,
  ConfigurableDatagridColumn,
  useStore,
  DatagridConfigurable,
  SimpleList,
  useDataProvider,
} from 'react-admin'
import { useLocation } from 'react-router-dom'

const TrainingEventListActions = () => {
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const filterParam = searchParams.get('filter')
  let eventId
  // Check if filterParam is not null
  if (filterParam) {
    // Parse the JSON object in the filter parameter
    const filterObject = JSON.parse(decodeURIComponent(filterParam))
    eventId = filterObject.event
  }
  return (
    <TopToolbar>
      <SelectColumnsButton />
      <ExportButton />
      <CreateButton label='Register Attendee' to={{
        pathname: `/training-event-registrationss/create/${eventId}`,
      }} />
    </TopToolbar>
  )
}

const EventRegistrationList = () => {
  const preferenceKey = 'training-event-registrationss.datagrid'
  const [availableColumns] = useStore<
    ConfigurableDatagridColumn[]
  >(`preferences.${preferenceKey}.availableColumns`, [])

  const [columnIds] = useStore<string[]>(
    `preferences.${preferenceKey}.columns`,
    []
  )

  const dataProvider = useDataProvider()
  const exporter = (records: ConfigurableDatagridColumn[]) => {
    CustomExportFunction(
      records,
      availableColumns,
      columnIds,
      'Class Roster',
      dataProvider
    )
  }

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'))
  return (
    <List hasCreate exporter={exporter} actions={<TrainingEventListActions />}
      title={'Class Rosters'}
      resource="training-event-registrationss">
      {isSmall ? (

        <Box style={{ whiteSpace: 'nowrap' }}>
          <SimpleList primaryText={(record) => record.first + ' ' + record.last} secondaryText={(record) => ('Attendee ID: ' + record.attendee_id) + ' | ' + (record.email)}
            tertiaryText={record => record.phone} />
        </Box>
      ) : (
        <DatagridConfigurable
          rowClick="edit"
        >
          <TextField source="event" label="Event" noWrap/>
          <TextField source="first" label="First Name" noWrap/>
          <TextField source="last" label="Last Name" noWrap/>
          <TextField source="attendee_id" label="Attendee ID"noWrap />
          <TextField source="email" label="Email" noWrap/>
          <TextField source="phone" label="Phone" noWrap/>
        </DatagridConfigurable>
      )}
    </List>
  )
}
export default EventRegistrationList
