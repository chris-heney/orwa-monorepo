import React from 'react'
import ActivityFeed from '../../activity/ActivityFeed'
import { Grid } from '@mui/material'
import UpComingEventCard from './UpComingEventCard'
import EventsAwaitingReviewCard from './EventsWaitingReviewCard'

const TrainingDashboard = () => {


  return (
    <Grid justifyContent={'center'} mt={2} container spacing={2}>
      <Grid item height={400} xs={12} sm={12} md={6} lg={4}>
        <EventsAwaitingReviewCard />
      </Grid>
      <Grid height={400} item xs={12} sm={12} md={6} lg={4}>
        <ActivityFeed variant='h5' entity='training-event' sx={{ height: '100%', width: '100%', borderRadius: '10px',}} title="Training Dashboard" />
      </Grid>
      <Grid height={400} item xs={12} sm={12} md={6} lg={4}>
        <UpComingEventCard />
      </Grid>
      <Grid height={390} item xs={12} sm={12} md={6} lg={4}>

      </Grid>
      <Grid height={390} item xs={12} sm={12} md={6} lg={4}>

      </Grid>
      <Grid height={390} item xs={12} sm={12} md={6} lg={4}>
      </Grid>
    </Grid>
  )
}

export default TrainingDashboard
