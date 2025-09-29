import React from 'react'
import 'react-calendar/dist/Calendar.css'
import { Card, Box, Typography } from '@mui/material'
import EventsIcon from '@mui/icons-material/CalendarMonth'
import { useGetList } from 'react-admin'
import dayjs from 'dayjs'
import { YearMonthDay } from '../../../helpers/Data'
import NextConference from '../../dashboard/_components/MuiCalender'

const UpComingEventCard = () => {
  const { data: event } = useGetList('training-events', {
    pagination: {
      page: 1,
      perPage: 10000
    },
  })

  const upComingEvents = event?.filter((event) => {
    const eventDate = new Date(event.start)
    return eventDate > new Date()
  })
  const mostRecentEvent = upComingEvents?.length
    ? upComingEvents.reduce((prev, current) => {
      const prevDate = new Date(prev.start)
      const currentDate = new Date(current.start)
      return currentDate < prevDate ? current : prev
    })
    : null

  const daysLeft = mostRecentEvent
    ? dayjs(mostRecentEvent?.start).diff(dayjs(new Date()), 'days') + 1
    : null

  const start = mostRecentEvent?.start
  const formattedStartDate = start ? new Date(start).toLocaleDateString('en-US', YearMonthDay) : null
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        position: 'relative',
        mb: 2,
        borderRadius: '10px',
        backgroundColor: '#f0f0f0',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
      }}
    ><Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          margin: '8px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <EventsIcon sx={{ fontSize: 30, marginRight: '8px' }} />
        <Typography variant='h5'> {mostRecentEvent?.name ? `${mostRecentEvent?.name},` : ' '} {mostRecentEvent ? formattedStartDate : 'No Upcoming Training Events'}</Typography>
      </Box>
      <Box mb={5} />
      <Box sx={{
        '& .react-calendar': {
          width: 200
        }
      }}>
      </Box>
      <NextConference selectedDate={dayjs(mostRecentEvent?.start_date)} />
      <Box
        sx={{
          textAlign: 'center',
          marginTop: '5px'
        }}
      >
        {mostRecentEvent && <Typography variant='h6'> Days Left:  {daysLeft}</Typography>}
      </Box>
    </Card>
  )
}

export default UpComingEventCard
