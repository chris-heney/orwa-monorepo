import * as React from 'react'
import dayjs from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'

interface DateCalendarViewsProps {
    selectedDate: dayjs.Dayjs
}
export default function NextConference({selectedDate}: DateCalendarViewsProps) {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        views={['day']}
        value={selectedDate}
        onChange={(date) => console.log('Selected Date:', date)}
        sx={{
          '& .MuiPickersCalendarHeader-root': {
            color: 'text.primary',
          },
          '& .MuiDayCalendar-weekDayLabel': {
            color: 'text.secondary',
          },
          '& .MuiPickersDay-root': {
            color: 'text.primary',
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
            },
            '&:hover': {
              backgroundColor: 'action.hover',
            },
          },
        }}
      />
    </LocalizationProvider>
  )
}
