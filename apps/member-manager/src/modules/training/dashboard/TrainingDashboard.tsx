import React from 'react'
import ActivityFeed from '../../activity/ActivityFeed'
import {Grid} from "@mui/material"
import UpComingEventCard from './UpComingEventCard'
import EventsAwaitingReviewCard from './EventsWaitingReviewCard'

const TrainingDashboard = () => {


  return (
    <Grid sx={{ justifyContent: 'center' }} mt={2} container spacing={2}>
      <Grid sx={{ height: 400 }} xs={12} sm={12} md={6} lg={4}>
        <EventsAwaitingReviewCard />
      </Grid>
      <Grid sx={{ height: 400 }} xs={12} sm={12} md={6} lg={4}>
        <ActivityFeed variant='h5' entity='training-event' sx={{ height: '100%', width: '100%', borderRadius: '10px',}} title="Training Dashboard" />
      </Grid>
      <Grid sx={{ height: 400 }} xs={12} sm={12} md={6} lg={4}>
        <UpComingEventCard />
      </Grid>
      <Grid sx={{ height: 390 }} xs={12} sm={12} md={6} lg={4}>

      </Grid>
      <Grid sx={{ height: 390 }} xs={12} sm={12} md={6} lg={4}>

      </Grid>
      <Grid sx={{ height: 390 }} xs={12} sm={12} md={6} lg={4}>
      </Grid>
    </Grid>
  )
}

export default TrainingDashboard
