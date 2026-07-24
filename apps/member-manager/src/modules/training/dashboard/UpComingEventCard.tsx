import React from 'react'
import 'react-calendar/dist/Calendar.css'
import { Box, Card, Divider, Typography } from '@mui/material'
import EventsIcon from '@mui/icons-material/CalendarMonth'
import { useGetList } from 'react-admin'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { YearMonthDay } from '../../../helpers/Data'
import NextConference from '../../dashboard/_components/MuiCalender'

/** Next scheduled events — server-side filtered, no client-side scans. */
const UpComingEventCard = () => {
  // Stable across renders so the query key doesn't change every paint
  const [now] = React.useState(() => new Date().toISOString())
  const { data: upcoming = [] } = useGetList('training-events', {
    pagination: { page: 1, perPage: 5 },
    sort: { field: 'start', order: 'ASC' },
    filter: {
      start: { $gt: now },
      status: { $in: ['REVIEW', 'DEQ', 'RSVP', 'LIVE'] },
    },
  })

  const nextEvent = upcoming[0]
  const daysLeft = nextEvent
    ? dayjs(nextEvent.start).diff(dayjs(), 'days') + 1
    : null

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.25 }}>
        <EventsIcon sx={{ color: 'primary.main' }} />
        <Typography variant="subtitle1" fontWeight="bold">
          Upcoming Events
        </Typography>
        {nextEvent && daysLeft != null && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
            next in {daysLeft} day{daysLeft === 1 ? '' : 's'}
          </Typography>
        )}
      </Box>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          justifyContent: 'center',
          gap: 2,
          p: 2,
          flexGrow: 1,
        }}
      >
        <NextConference selectedDate={nextEvent ? dayjs(nextEvent.start) : dayjs()} />
        <Box sx={{ flexGrow: 1, minWidth: 220 }}>
          {upcoming.length === 0 && (
            <Typography variant="body2" color="text.secondary" textAlign="center">
              No upcoming training events.
            </Typography>
          )}
          {upcoming.map((event) => (
            <Box
              key={event.id}
              component={Link}
              to={`/training-events/${event.id}/show`}
              sx={{
                display: 'block',
                textDecoration: 'none',
                color: 'text.primary',
                py: 0.75,
                px: 1,
                borderRadius: 1,
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              <Typography variant="body2" fontWeight={600} noWrap>
                {event.training_type}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(event.start).toLocaleDateString('en-US', YearMonthDay)}
                {event.address?.city ? ` · ${event.address.city}` : ''}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Card>
  )
}

export default UpComingEventCard
