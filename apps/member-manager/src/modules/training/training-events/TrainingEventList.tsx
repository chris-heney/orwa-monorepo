import { Box, Button, useMediaQuery } from '@mui/material'
import { Theme } from '@mui/material/styles'
import CustomExportFunction from '../../../helpers/custom-export-function'
import React, { useEffect, useState } from 'react'
import {
  List,
  TextField,
  BooleanField,
  DateField,
  DatagridConfigurable,
  ConfigurableDatagridColumn,
  useStore,
  RaRecord,
  useDataProvider,
  Pagination,
  ReferenceField,
  FunctionField,
} from 'react-admin'
import TrainingClassActionsButton from './components/EventListActionsPopUp'
import TrainingEventListFilter from './components/EventListFilter'
import CustomListActions from '../../_components/CustomListActions'
import EventCardGird from './components/EventListCardGridMobile'


const TrainingEventList = () => {
  const [filterListOpen, setFilterListOpen] = useState(false)
  const preferenceKey = 'training-events.datagrid'
  const [availableColumns] = useStore<
    ConfigurableDatagridColumn[]
  >(`preferences.${preferenceKey}.availableColumns`, [])

  const [columnIds] = useStore<string[]>(
    `preferences.${preferenceKey}.columns`,
    []
  )
  const exporter = (records: ConfigurableDatagridColumn[]) => {
    CustomExportFunction(records, availableColumns, columnIds, 'Training Events')
  }

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'))

  const checkAndUpdateRecords = async (records: RaRecord[]) => {
    const currentTime = new Date()

    // Create an array of promises for record updates
    const updatePromises = records.map(async (record) => {
      if (record.status === 'CANCELLED' || record.status === 'DRAFT' || record.status === 'DEQ' || record.status === 'REVIEW' || record.status === 'COMPLETE') {
        return null
      }
      const start = new Date(record.start)
      const end = new Date(record.end)

      if (currentTime > start && currentTime < end) {
        const newStatus = 'LIVE'
        const updatedRecordParams = {
          id: record.id,
          previousData: record,
          data: {
            status: newStatus,
          },
        }
        return dataProvider.update('training-events', updatedRecordParams) // Use Promise.all to update records in parallel
      }
      if (end < currentTime) {
        const newStatus = 'COMPLETE'
        const updatedRecordParams = {
          id: record.id,
          previousData: record,
          data: {
            status: newStatus,
          },
        }
        return dataProvider.update('training-events', updatedRecordParams) // Use Promise.all to update records in parallel
      }

      return null
    })

    await Promise.all(updatePromises)
  }

  const dataProvider = useDataProvider()
  useEffect(() => {
    dataProvider
      .getList('training-events', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'start', order: 'ASC' },
        filter: {},
      })
      .then(({ data }) => {
        checkAndUpdateRecords(data)
      })
  }, [dataProvider])


  // store whoever created the class 
  return (
    <List exporter={exporter}
      actions={<CustomListActions createButtonLabel='Create New Training Event' />}
      aside={!isSmall ? <TrainingEventListFilter /> : isSmall && filterListOpen ? (
        <TrainingEventListFilter />
      ) : <></>}
      pagination={<Box sx={{ maxWidth: '32vw', position: 'sticky', left: 0 }}><Pagination rowsPerPageOptions={[10, 25, 50, 100]} sx={{ flexDirection: 'row-reverse' }} /></Box>}
      title={'Training Events'}>
      {isSmall && <Button onClick={() => filterListOpen ? setFilterListOpen(false) : setFilterListOpen(true)}>
        {filterListOpen ? 'Hide Filters' : 'Add Filters'}
      </Button>}
      {isSmall ?
        (
          <EventCardGird />
        )
        : (
          <DatagridConfigurable
            bulkActionButtons={false}
          >
            <FunctionField
              label="Actions"
              render={() => <TrainingClassActionsButton />}
            />           
            {/* <ReferenceManyCount reference='training-event-registrationss' target='event'/> */}
            <TextField source="id" label="ID" noWrap />
            <TextField source="deq_class_number" label="DEQ Class Number" noWrap />
            <TextField source="status" label="Status" />
            <ReferenceField
              reference="training-instructors"
              source="instructor"
              label="Instructor"
              link={false}
            >
              <ReferenceField
                reference="contacts"
                source="instructor"
                link={false}
              >
                <Box sx={{ display: 'flex' }}>
                  <TextField source="first" noWrap />
                  <TextField source="last" ml={1} noWrap />
                </Box>
              </ReferenceField>
            </ReferenceField>
            <DateField source="start" label="Start" noWrap />
            <DateField source="end" label="End" noWrap />
            <TextField source="hours" label="Training Hours" noWrap />
            <TextField source="training_type" label="Training Type" noWrap />
            <TextField source="program" label="Program" noWrap />
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
  )
}

export default TrainingEventList