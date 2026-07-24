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
          color: 'text.primary',
          '& .MuiPickersCalendarHeader-label': { color: 'text.primary' },
          '& .MuiDayCalendar-weekDayLabel': { color: 'text.secondary' },
          '& .MuiPickersDay-root': { color: 'text.primary' },
          '& .MuiPickersArrowSwitcher-button': { color: 'text.primary' },
        }}
      />
    </LocalizationProvider>
  )
}
