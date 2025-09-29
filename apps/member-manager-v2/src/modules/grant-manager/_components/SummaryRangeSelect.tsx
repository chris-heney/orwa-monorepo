import React from 'react'
import { Box, Button, FormControl, FormLabel } from '@mui/material'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useGrantContext } from '../GrantContextProvider'

const SummaryRangeSelection = () => {
  const {
    from,
    setFrom,
    to,
    setTo,
  } = useGrantContext()

  return (
    <Box p={2}>
      {(from !== null && to !== null) && <Button onClick={() => {
        setFrom(null)
        setTo(null)
      }}
      >Reset
      </Button>}
      <FormLabel>Summary Range</FormLabel>
      <Box sx={{ gap: 2 }}>
        <FormControl fullWidth>
          <DemoContainer components={['DatePicker']}>
            <DatePicker
              label="From"
              value={from}
              onChange={(newValue) => setFrom(newValue)}
            />
          </DemoContainer>
        </FormControl>
        <FormControl fullWidth>
          <DemoContainer components={['DatePicker']}>
            <DatePicker
              label="To"
              value={to}
              onChange={(newValue) => {
                from !== null && newValue?.isBefore(from) ? alert('Please select a date after the start date') : setTo(newValue)  
              }}
            />
          </DemoContainer>
        </FormControl>
      </Box>
    </Box>
  )
}

export default SummaryRangeSelection
