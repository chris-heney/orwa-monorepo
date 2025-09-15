import { Grid } from '@mui/material'
import React from 'react'
import RandomAttendeeGenerator from './RandomAttendeeGenerator'

const ConferenceTools = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
         <RandomAttendeeGenerator />
      </Grid>
    </Grid>
  )
}

export default ConferenceTools
