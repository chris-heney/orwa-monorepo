import { Box, Button, Theme, useMediaQuery } from '@mui/material'
import CustomExportFunction from '../../../helpers/custom-export-function'
import React, { useState } from 'react'
import {
  List,
  TextField,
  BooleanField,
  DateField,
  DatagridConfigurable,
  ConfigurableDatagridColumn,
  useStore,
  Pagination,
  ReferenceField,
  FunctionField,
  RaRecord,
  CreateButton,
  ExportButton,
  SelectColumnsButton,
  Title,
} from 'react-admin'
import TrainingClassActionsButton from './components/EventListActionsPopUp'
import TrainingEventListFilter from './components/EventListFilter'
import EventCardGird from './components/EventListCardGridMobile'
import PageHeadingBar from '../../_components/PageHeadingBar'
import TrainingStatusChip from '../_components/TrainingStatusChip'

const barButtonSx = {
  color: 'white',
  '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' },
}

const datagridSx = (theme: Theme) => ({
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

const ListHeader = () => (
  <PageHeadingBar
    title="Training Events"
    info="Create training events and move them through the pipeline: Draft → Review → DEQ → RSVP → Live → Complete."
    actions={
      <>
        <CreateButton label="New Event" sx={barButtonSx} />
        <Box sx={{ '& .MuiButton-root': barButtonSx }}>
          <SelectColumnsButton />
        </Box>
        <ExportButton sx={barButtonSx} />
      </>
    }
  />
)

const TrainingEventList = () => {
  const [filterListOpen, setFilterListOpen] = useState(false)
  const preferenceKey = 'training-events.datagrid'
  const [availableColumns] = useStore<ConfigurableDatagridColumn[]>(
    `preferences.${preferenceKey}.availableColumns`,
    []
  )
  const [columnIds] = useStore<string[]>(`preferences.${preferenceKey}.columns`, [])
  const exporter = (records: RaRecord[]) => {
    CustomExportFunction(records, availableColumns, columnIds, 'Training Events')
  }

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'))

  return (
    <Box sx={{ width: 1, minWidth: 0, boxSizing: 'border-box', p: { xs: 1, sm: 2 } }}>
      <Title title="Training Events" />
      <List
        exporter={exporter}
        title=" "
        actions={false}
        sort={{ field: 'start', order: 'DESC' }}
        aside={
          !isSmall ? (
            <TrainingEventListFilter />
          ) : filterListOpen ? (
            <TrainingEventListFilter />
          ) : (
            <></>
          )
        }
        pagination={
          <Box sx={{ maxWidth: '32vw', position: 'sticky', left: 0 }}>
            <Pagination
              rowsPerPageOptions={[10, 25, 50, 100]}
              sx={{ flexDirection: 'row-reverse' }}
            />
          </Box>
        }
        sx={{
          '& .RaList-main': { marginTop: 0 },
          '& .RaList-content': { boxShadow: 'none' },
        }}
      >
        <ListHeader />
        {isSmall && (
          <Button onClick={() => setFilterListOpen(!filterListOpen)}>
            {filterListOpen ? 'Hide Filters' : 'Show Filters'}
          </Button>
        )}
        {isSmall ? (
          <EventCardGird />
        ) : (
          <DatagridConfigurable
            bulkActionButtons={false}
            sx={datagridSx}
            omit={[
              'audience',
              'location',
              'address.street',
              'address.city',
              'address.state',
              'address.zip',
              'phone',
              'deq_exam',
              'exam_datetime',
            ]}
          >
            <FunctionField
              label="Actions"
              render={() => <TrainingClassActionsButton />}
            />
            <FunctionField
              source="status"
              label="Status"
              render={(record: RaRecord) => (
                <TrainingStatusChip status={record.status} />
              )}
            />
            <TextField source="training_type" label="Training Type" noWrap />
            <DateField source="start" label="Start" noWrap />
            <DateField source="end" label="End" noWrap />
            <TextField source="deq_class_number" label="DEQ Class #" noWrap />
            <ReferenceField
              reference="training-instructors"
              source="instructor"
              label="Instructor"
              link={false}
            >
              <ReferenceField reference="contacts" source="instructor" link={false}>
                <Box sx={{ display: 'flex' }}>
                  <TextField source="first" noWrap />
                  <TextField source="last" ml={1} noWrap />
                </Box>
              </ReferenceField>
            </ReferenceField>
            <TextField source="hours" label="Hours" noWrap />
            <ReferenceField
              reference="programs"
              source="program_billed"
              label="Program Billed"
              link={false}
            >
              <TextField source="name" noWrap />
            </ReferenceField>
            <TextField source="audience" label="Audience" noWrap />
            <TextField source="location" label="Location Code" noWrap />
            <TextField source="address.street" label="Street" noWrap />
            <TextField source="address.city" label="City" noWrap />
            <TextField source="address.state" label="State" noWrap />
            <TextField source="address.zip" label="Zip" noWrap />
            <TextField source="phone" label="Phone" noWrap />
            <BooleanField source="deq_exam" label="DEQ Exam" noWrap />
            <DateField source="exam_datetime" label="Exam Date" noWrap />
          </DatagridConfigurable>
        )}
      </List>
    </Box>
  )
}

export default TrainingEventList
