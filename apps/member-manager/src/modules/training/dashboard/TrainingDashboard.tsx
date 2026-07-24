import React from 'react'
import { Box, Grid } from '@mui/material'
import { Title } from 'react-admin'
import RateReviewIcon from '@mui/icons-material/RateReview'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import ActivityFeed from '../../activity/ActivityFeed'
import PageHeadingBar from '../../_components/PageHeadingBar'
import StatsStrip from './StatsStrip'
import WorkQueueCard from './WorkQueueCard'
import UpComingEventCard from './UpComingEventCard'

/**
 * Action-oriented training dashboard: pipeline counts, work queues grouped by
 * "what needs doing", the activity feed, and the upcoming-events calendar.
 */
const TrainingDashboard = () => {
  // Stable across renders so work-queue query keys don't churn
  const [{ now, in30Days }] = React.useState(() => ({
    now: new Date().toISOString(),
    in30Days: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  }))

  return (
    <Box sx={{ width: 1, minWidth: 0, boxSizing: 'border-box', p: { xs: 1, sm: 2 } }}>
      <Title title="Training Dashboard" />
      <PageHeadingBar
        title="Training Dashboard"
        info="Pipeline overview: review queue, DEQ queue, upcoming events, and recent activity."
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <StatsStrip />
        </Grid>

        <Grid item xs={12} md={6} lg={4} sx={{ minHeight: 320 }}>
          <WorkQueueCard
            title="Needs Review"
            icon={<RateReviewIcon sx={{ color: '#ef6c00' }} />}
            filter={{ status: 'REVIEW' }}
            emptyText="Nothing waiting on review."
            actionLabel="Review"
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4} sx={{ minHeight: 320 }}>
          <WorkQueueCard
            title="At DEQ"
            icon={<AccountBalanceIcon sx={{ color: '#1565c0' }} />}
            filter={{ status: 'DEQ' }}
            emptyText="Nothing waiting on DEQ."
            actionLabel="Open"
            secondary={(record) =>
              record.deq_class_number
                ? `DEQ #${record.deq_class_number} — ready to post`
                : 'awaiting class number'
            }
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4} sx={{ minHeight: 320 }}>
          <WorkQueueCard
            title="Starting Soon"
            icon={<EventAvailableIcon sx={{ color: '#2e7d32' }} />}
            filter={{
              status: 'RSVP',
              start: { $between: [now, in30Days] },
            }}
            emptyText="No RSVP events starting in the next 30 days."
            actionLabel="Open"
          />
        </Grid>

        <Grid item xs={12} md={6} sx={{ minHeight: 380 }}>
          <ActivityFeed
            variant="h6"
            entity="training-event"
            sx={{ height: '100%', width: '100%' }}
            title=" "
          />
        </Grid>
        <Grid item xs={12} md={6} sx={{ minHeight: 380 }}>
          <UpComingEventCard />
        </Grid>
      </Grid>
    </Box>
  )
}

export default TrainingDashboard
