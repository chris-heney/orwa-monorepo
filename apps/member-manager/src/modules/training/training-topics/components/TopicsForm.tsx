import {
  SimpleForm,
  TextInput,
  NumberInput,
  useRecordContext,
  SelectInput,
  ReferenceInput,
} from 'react-admin'
import { Grid } from '@mui/material'
import React from 'react'
import CustomHeader from '../../../_components/CustomHeader'
import { TopicCategories } from '../../../../helpers/Data'
import { TrainingInstructorAutocompleteInput } from '../../../_components/autocompletes/TrainingInstructorAutocomplete'

const SessionForm = () => {
  const record = useRecordContext()
  const title = record ? record.name : 'New Training Topic'
  return (
    <>
      <CustomHeader title={title} />
      <SimpleForm>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <TextInput helperText={false} fullWidth source="name" label="Name" />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <SelectInput  helperText={false} choices={TopicCategories} fullWidth source="category" label="Category" />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={4}>
            <NumberInput  helperText={false} fullWidth source="hours" label="Hours" defaultValue={1} />
          </Grid>
          <Grid item xs={6} >
            <ReferenceInput
              reference="training-instructors"
              source="training_instructors"
              helperText={false}
            >
              <TrainingInstructorAutocompleteInput source={'training_instructors'} />
            </ReferenceInput>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextInput  helperText={false} fullWidth source="description" label="Description" multiline rows={5} />
          </Grid>
        </Grid>
      </SimpleForm>
    </>
  )
}
export default SessionForm
