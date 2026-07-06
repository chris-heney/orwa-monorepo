import { Box, useMediaQuery } from '@mui/material'
import { Theme } from '@mui/material/styles'
import {
  List,
  TextField,
  SimpleList,
  DatagridConfigurable,
  ConfigurableDatagridColumn,
  useStore,
  ReferenceField,
  Pagination,
  RaRecord,
  DateField,
  FunctionField,
} from 'react-admin'
import React from 'react'
import CustomExportFunction from '../../../helpers/custom-export-function'
import CustomListActions from '../../_components/CustomListActions'
import { YearMonthDayMinute } from '../../../helpers/Data'

const TrainingHistoryList = () => {

  const preferenceKey = 'training-event-logs.datagrid'
  const [availableColumns] = useStore<
    ConfigurableDatagridColumn[]
  >(`preferences.${preferenceKey}.availableColumns`, [])

  const [columnIds] = useStore<string[]>(
    `preferences.${preferenceKey}.columns`,
    []
  )
  const exporter = (records: ConfigurableDatagridColumn[]) => {
    CustomExportFunction(records, availableColumns, columnIds, 'Training History')
  }
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'))

  return (
    <List exporter={exporter}
      title={'Training History'}
      actions={<CustomListActions createButtonLabel='New Training History'/>}
      pagination={<Box sx={{ maxWidth: '32vw', position: 'sticky', left: 0 }}><Pagination rowsPerPageOptions={[10, 25, 50, 100]} sx={{ flexDirection: 'row-reverse' }} /></Box>}
    >
      {isSmall ? (
        <SimpleList linkType='show' primaryText={
          <ReferenceField source="contact" label="Name" reference="contacts"
            link={false}
          >
            <TextField source="first" />
            {' '}
            <TextField source="last" />
            {' '}
          </ReferenceField>}
        secondaryText={(record) =>
          `${record.type} Hours: ${record.type === 'Block' ? '4' : '1'}`
        }
        tertiaryText={(record) => new Date(record.createdAt).toLocaleDateString('en-US', YearMonthDayMinute)}
        />

      ) : (
        <DatagridConfigurable
          bulkActionButtons={false}
          rowClick='show'
        >
          <ReferenceField source="contact" label="Name" reference="contacts" link="show">
            <>
              <TextField source="first" />
              {' '}
              <TextField source="last" />
            </>
          </ReferenceField>
          <ReferenceField source="event" label="Event" reference="training-events" link="show">
            <TextField source="program" />
          </ReferenceField>
          <DateField source='createdAt' label='Checked In' showTime noWrap/>
          <TextField source='type' label='Type' noWrap/>
          <ReferenceField source="block" label="Block" reference="training-schedule-blocks" link={false}>
            <TextField source='id' />
          </ReferenceField>
          <ReferenceField source="session" label="Session" reference="training-sessions" link={false}>
            <TextField source='id' label='' />
          </ReferenceField>
          <FunctionField render={(record: RaRecord) => record.type === 'Block' ? 4 : 1} label='Hours'/>
        </DatagridConfigurable>
      )}
    </List>
  )
}

export default TrainingHistoryList