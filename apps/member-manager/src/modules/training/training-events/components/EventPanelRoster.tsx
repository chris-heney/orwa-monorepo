import React from 'react'
import {
  ConfigurableDatagridColumn,
  DatagridConfigurable,
  List,
  RaRecord,
  SimpleList,
  TextField,
  useRecordContext,
  useStore,
} from 'react-admin'
import { Alert, Box, Button, Chip, Theme, Typography, useMediaQuery } from '@mui/material'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import { Link } from 'react-router-dom'
import CustomExportFunction from '../../../../helpers/custom-export-function'

const rosterDatagridSx = (theme: Theme) => ({
  '& .RaDatagrid-thead': { whiteSpace: 'nowrap' },
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
})

const EventPanelRoster = () => {
  const trainingEvent = useRecordContext()

  const preferenceKey = 'training-event-registrations.datagrid'
  const [availableColumns] = useStore<ConfigurableDatagridColumn[]>(
    `preferences.${preferenceKey}.availableColumns`,
    []
  )
  const [columnIds] = useStore<string[]>(`preferences.${preferenceKey}.columns`, [])
  const exporter = (records: RaRecord[]) => {
    CustomExportFunction(records, availableColumns, columnIds, 'Class Roster')
  }

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'))

  if (!trainingEvent) return null

  if (trainingEvent.deq_class_number == null) {
    return (
      <Alert severity="info">
        Request a class number from DEQ before managing the roster. Once the
        class number is saved on the event, registrations appear here.
      </Alert>
    )
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
          mb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Class Roster
          </Typography>
          <Chip size="small" label={`DEQ #${trainingEvent.deq_class_number}`} />
        </Box>
        <Button
          component={Link}
          variant="outlined"
          size="small"
          startIcon={<HowToRegIcon />}
          to={{
            pathname: '/training-event-registrations',
            search: `?filter=${encodeURIComponent(
              JSON.stringify({ training_event: trainingEvent.id })
            )}&order=ASC&page=1&perPage=10&sort=id`,
          }}
        >
          Register Attendees
        </Button>
      </Box>

      <List
        resource="training-event-registrations"
        hasCreate={false}
        exporter={exporter}
        filter={{ training_event: trainingEvent.id }}
        actions={false}
        title=" "
        disableSyncWithLocation
        sx={{ '& .RaList-content': { boxShadow: 'none' } }}
      >
        {isSmall ? (
          <Box>
            <SimpleList
              primaryText={(record) => `${record.first} ${record.last}`}
              secondaryText={(record) => `Attendee ID: ${record.attendee_id ?? '—'}`}
              tertiaryText={(record) => record.email}
            />
          </Box>
        ) : (
          <DatagridConfigurable rowClick="show" sx={rosterDatagridSx}>
            <TextField source="first" label="First Name" noWrap />
            <TextField source="last" label="Last Name" noWrap />
            <TextField source="attendee_id" label="Attendee ID" noWrap />
            <TextField source="email" label="Email" noWrap />
            <TextField source="phone" label="Phone" noWrap />
          </DatagridConfigurable>
        )}
      </List>
    </>
  )
}

export default EventPanelRoster
