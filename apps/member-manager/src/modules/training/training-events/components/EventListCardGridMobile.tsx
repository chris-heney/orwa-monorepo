import React from 'react'
import { Box } from '@mui/material'
import { Loading, OptionalRecordContextProvider, useListContext } from 'react-admin'
import EventCard from './EventListCardMobile'


const EventListCardGridMobile = () => {

  const {
    data,
    isLoading,
  } = useListContext()

  return isLoading ? <Loading /> : (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(1, 1fr)',
          md: 'repeat(1, 1fr)',
          lg: 'repeat(1, 1fr)',
        },
        gap: '1rem',
      }}
    >
      {
        data.map((record) => (
          <OptionalRecordContextProvider value={record} key={`contact-${record.id}`}>
            <EventCard/>
          </OptionalRecordContextProvider>
        ))
      }
    </Box>
  )
}

export default EventListCardGridMobile