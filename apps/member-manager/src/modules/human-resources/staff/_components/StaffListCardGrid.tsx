import React from 'react'
import { Box } from '@mui/material'
import { Loading, OptionalRecordContextProvider, useListContext } from 'react-admin'
import StaffCard from './StaffCard'

interface ListContextProvider {
  source?: string
}
const StaffListCardGrid = ({ source }: ListContextProvider) => {

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
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: '1rem',
      }}
    >
      {
        data.map((record) => (
          <OptionalRecordContextProvider value={record || {}} key={`staff-${record.id}`}>
            <StaffCard source={source} link />
          </OptionalRecordContextProvider>
        ))
      }
    </Box>
  )
}
export default StaffListCardGrid 