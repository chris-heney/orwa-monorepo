import React from 'react'
import { AutocompleteInput, NumberInput, ReferenceInput, SimpleForm, TextInput } from 'react-admin'
import {Grid} from "@mui/material"
import { useLocation } from 'react-router-dom'
import CustomHeader from '../_components/CustomHeader'


const EventRegistrationForm = () => {
  const location = useLocation()
  const pathname = location.pathname
  const eventId = pathname.split('/').pop()
  return (
    <>
      <CustomHeader title='event register form' />
      <SimpleForm >
        <Grid container spacing={2}>
          <Grid xs={12} sm={6} md={4} lg={4}>
            <ReferenceInput source="event" label="Event" reference="training-events" perPage={1000} fullWidth>
              <AutocompleteInput disabled defaultValue={eventId} optionText={(choice) => `${choice.id} - ${choice.training_type}`} />
            </ReferenceInput>
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={4}>
            <TextInput source="first" label="First Name" fullWidth />
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={4}>
            <TextInput source="last" label="Last Name" fullWidth />
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={4}>
            <NumberInput source="attendee_id" label="Attendee ID" fullWidth />
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={4}>
            <TextInput source="phone" label="Phone" fullWidth />
          </Grid>
          <Grid xs={12} sm={6} md={4} lg={4}>
            <TextInput source="email" label="Email" fullWidth />
          </Grid>
        </Grid>
      </SimpleForm>
    </>
  )
}

export default EventRegistrationForm
