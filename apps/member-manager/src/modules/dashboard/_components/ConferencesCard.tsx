import React from 'react'
import 'react-calendar/dist/Calendar.css'
import { Card, Box, Typography } from '@mui/material'
import EventsIcon from '@mui/icons-material/CalendarMonth'
import { Loading, useGetList } from 'react-admin'
import dayjs from 'dayjs'
import { YearMonthDay } from '../../../helpers/Data'
import 'react-calendar/dist/Calendar.css'
import NextConference from './MuiCalender'


const NextConferencsCard = () => {

  const { data: conferences, isLoading } = useGetList('conferences', {
    pagination: {
      page: 1,
      perPage: 1000
    },
  })
  const upComingConference = conferences?.filter((event) => {
    const eventDate = new Date(event.start_date)
    return eventDate > new Date()
  })
  const mostRecentEvent = upComingConference?.length
    ? upComingConference.reduce((prev, current) => {
      const prevDate = new Date(prev.start_date)
      const currentDate = new Date(current.start_date)
      return currentDate < prevDate ? current : prev
    })
    : null

  const daysLeft = mostRecentEvent
    ? dayjs(mostRecentEvent?.start_date).diff(dayjs(new Date()), 'days') 
    : null

  const start = mostRecentEvent?.start_date
  const formattedStartDate = start ? new Date(start).toLocaleDateString('en-US', YearMonthDay) : null
  return isLoading ? <Loading/> : (
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
        <Typography variant='h6'> {mostRecentEvent?.name}, {mostRecentEvent ? formattedStartDate : 'No Upcoming Conferences'}</Typography>
      </Box>
      <Box mb={5} />
      <Box sx={{'& .react-calendar' : {
        width: 200
      }}}>
      </Box>
      <NextConference selectedDate={dayjs(mostRecentEvent?.start_date)}/>
      <Box
        sx={{
          textAlign: 'center',
          marginTop: '5px'
        }}
      >
      
        <Typography variant='h6'> Days Left:  {daysLeft}</Typography>
      </Box>
    </Card>
  )
}

export default NextConferencsCard
