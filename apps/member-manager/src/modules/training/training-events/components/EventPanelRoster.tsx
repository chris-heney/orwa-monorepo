import React from 'react'
import {
  ConfigurableDatagridColumn,
  DatagridConfigurable,
  List,
  MenuItemLink,
  SimpleList,
  TextField,
  useRecordContext,
  useStore
} from 'react-admin'
import {
  Box,
  Button,
  Theme,
  Typography,
  useMediaQuery
} from '@mui/material'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import CustomExportFunction from '../../../../helpers/custom-export-function'


const EventPanelRoster = () => {

  const trainingEvent = useRecordContext()

  const preferenceKey = 'training-event-registrationss.datagrid'
  
  const [availableColumns] = useStore<
    ConfigurableDatagridColumn[]
  >(`preferences.${preferenceKey}.availableColumns`, [])

  const [columnIds] = useStore<string[]>(
    `preferences.${preferenceKey}.columns`,
    []
  )

  const exporter = (records: ConfigurableDatagridColumn[]) => {
    CustomExportFunction(records, availableColumns, columnIds, 'Class Roster')
  }

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'))

  return trainingEvent.deq_class_number !== null ? (
    <>

      DEQ Class Number: {trainingEvent.deq_class_number}

      <Button>
        <MenuItemLink
          sx={{ color: '#1976d2' }}
          to={{
            pathname: '/training-event-registrationss',
            search: `?filter=%7B"event"%3A"${trainingEvent.id}"%7D&order=ASC&page=1&perPage=10&sort=id`,
          }}
        >
          Register Attendees
          <HowToRegIcon />
        </MenuItemLink>
      </Button>

      <List resource="training-event-registrationss" hasCreate={false} exporter={exporter} filter={{ event: trainingEvent.id}} title={' '} >
        { isSmall ? (
          <Box>
            <SimpleList
              primaryText={(record) => record.first + ' ' + record.last}
              secondaryText={(record) => ( 'Attendee ID: '+record.attendee_id) }
              tertiaryText={record =>  record.email}
            />
          </Box>
        ) : (
          <DatagridConfigurable
            rowClick="show"
          >
            <TextField source="first" label="First Name" noWrap />
            <TextField source="last" label="Last Name" noWrap />
            <TextField source="attendee_id" label="Attendee ID"noWrap />
            <TextField source="email" label="Email" noWrap/>
            <TextField source="phone" label="Phone"noWrap />
          </DatagridConfigurable>
        )}
      </List>
    </>
  ) : (
    <Typography mb={1} variant='h4' textAlign={'center'} fontWeight={'bold'}>Request a Class ID from DEQ</Typography>
  )
}

export default EventPanelRoster
