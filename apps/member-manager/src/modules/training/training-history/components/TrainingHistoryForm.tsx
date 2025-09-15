import React from 'react'
import { SimpleForm, ReferenceInput, AutocompleteInput, SelectInput, useRecordContext, ReferenceField, TextField } from 'react-admin'
import { Grid } from '@mui/material'
import { TrainingEventAutocompleteInput } from '../../../_components/autocompletes/TrainingEventAutocomplete'
import { TrainingBlockAutocompleteInput } from '../../../_components/autocompletes/TrainingBlockAutocomplete'
import { TrainingSessionAutocompleteInput } from '../../../_components/autocompletes/TrainingSessionAutocomplete'
import CustomHeader from '../../../_components/CustomHeader'
const TrainingHistoryForm = () => {
  const record = useRecordContext()
  const title = record ? (
    <ReferenceField link={false} reference="contacts" source="contact">
      <TextField variant='h6' fontWeight={'bold'} source="first" /> 
      {' '}
      <TextField variant='h6' fontWeight={'bold'} source="last" /> 
    </ReferenceField>
  ) : 'New Training History'
  return (
    <>
      <CustomHeader title={title} />
      <SimpleForm >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={4}>
            <ReferenceInput source="contact" reference="Contacts" perPage={1000} fullWidth>
              <AutocompleteInput optionText={(choice) => `${choice.id} - ${choice.email}`} />
            </ReferenceInput>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4}>
            <ReferenceInput source="block" reference='training-schedule-blocks' helperText={false} >
              <TrainingBlockAutocompleteInput source='block' />
            </ReferenceInput>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4}>
            <ReferenceInput source="session" reference='training-sessions' helperText={false} >
              <TrainingSessionAutocompleteInput source='session' />
            </ReferenceInput>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4}>
            <ReferenceInput perPage={1000} source="event" reference='training-events' helperText={false} >
              <TrainingEventAutocompleteInput source={'event'} />
            </ReferenceInput>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={4}>
            <SelectInput source="type" fullWidth choices={[
              { id: 'Block', name: 'Block' },
              { id: 'Session', name: 'Session' }
            ]} />
          </Grid>
        </Grid>
      </SimpleForm>
    </>
  )
}

export default TrainingHistoryForm
