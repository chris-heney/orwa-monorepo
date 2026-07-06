import React from 'react'
import { Box } from '@mui/material'
import { Loading, OptionalRecordContextProvider, useListContext } from 'react-admin'
import ActivityItem from './ActivityItem'

const ActivityListCardGrid = () => {
  const { data, isLoading } = useListContext()

  return isLoading ? (
    <Loading />
  ) : (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr', 
      }}
    >
      {data.map((record) => (
        <OptionalRecordContextProvider value={record} key={`activity-${record.id}`}>
          <ActivityItem />
        </OptionalRecordContextProvider>
      ))}
    </Box>
  )
}

export default ActivityListCardGrid
