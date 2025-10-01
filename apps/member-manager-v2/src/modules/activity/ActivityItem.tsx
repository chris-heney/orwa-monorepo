import React, { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { useDataProvider, useRecordContext } from 'react-admin'
import { YearMonthDayMinute } from '../../helpers/Data'
type ActivityProps = {
  description?: string
  timestamp: string
};

const ActivityItem = () => {
  const record = useRecordContext()
  const stamp = new Date(record.timestamp)
  const dataProvider = useDataProvider()

  const [activity, setActivity] = useState<ActivityProps>({ timestamp: '' })

  useEffect(() => {
    // Fetch the related activity item when the component mounts
    if (record.description === undefined) {
      const fetchActivity = async () => {
        const { data } = await dataProvider.getOne('activities', { id: record.activity })
        setActivity(data as ActivityProps)
      }

      fetchActivity()
    }
  }, [record.description, record.activity])

  // Extract timestamp and description from the activity state
  const { timestamp: activityTimestamp, description: activityDescription } = activity
  return (
    <Box
      sx={{
        borderBottom: '1px solid',
        borderBottomColor: 'divider',
        boxShadow: 1,
        backgroundColor: 'background.paper',
        color: 'text.primary',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
        {record.description !== undefined && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between', 
              alignItems: 'center', 
            }}
          >
            {(record.description.toLowerCase().includes('event') ||  activityDescription?.toLowerCase().includes('event'))  && <svg width="50px" height="50px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M325.1 277.6h372.5V756H325.1z" fill="#96C8D1" /><path d="M372.8 322.7h276v386.5h-276z" fill="#CDE9E3" /><path d="M597.9 574.9H558v79.7l19.9-17.8 20 17.8z" fill="#96C96C" /><path d="M611.2 568.3c0 18.3-14.9 33.2-33.3 33.2s-33.3-14.9-33.3-33.2c0-18.4 14.9-33.2 33.3-33.2s33.3 14.9 33.3 33.2z" fill="#FBBA22" /><path d="M697.6 264.4H325.1c-7.3 0-13.3 6-13.3 13.3v478.4c0 7.3 6 13.3 13.3 13.3h372.5c7.3 0 13.3-6 13.3-13.3V277.6c0-7.3-6-13.2-13.3-13.2z m-13.3 478.4H338.4V290.9h345.9v451.9z" fill="#211F1E" /><path d="M371.7 716.2H651c3.7 0 6.7-3 6.7-6.6V324.2c0-3.7-3-6.6-6.7-6.6H371.7c-3.7 0-6.7 3-6.7 6.6v385.4c0 3.6 3 6.6 6.7 6.6z m6.6-385.4h266v372.1h-266V330.8z" fill="#211F1E" /><path d="M469.8 609.8h-39.9c-3.7 0-6.7 3-6.7 6.6 0 3.7 3 6.6 6.7 6.6h39.9c3.7 0 6.7-3 6.7-6.6-0.1-3.6-3.1-6.6-6.7-6.6zM424.9 463.4h172.9c3.7 0 6.7-3 6.7-6.6 0-3.7-3-6.6-6.7-6.6H424.9c-3.7 0-6.7 3-6.7 6.6 0 3.6 3 6.6 6.7 6.6zM511.3 490h-86.5c-3.7 0-6.7 3-6.7 6.6 0 3.7 3 6.6 6.7 6.6h86.5c3.7 0 6.7-3 6.7-6.6 0-3.7-3-6.6-6.7-6.6zM424.9 423.5h172.9c3.7 0 6.7-3 6.7-6.6 0-3.7-3-6.6-6.7-6.6H424.9c-3.7 0-6.7 3-6.7 6.6 0 3.6 3 6.6 6.7 6.6zM424.9 383.7h172.9c3.7 0 6.7-3 6.7-6.6 0-3.7-3-6.6-6.7-6.6H424.9c-3.7 0-6.7 3-6.7 6.6 0 3.6 3 6.6 6.7 6.6zM571.3 529.8c-22 0-39.9 17.9-39.9 39.9 0 11.8 5.2 22.3 13.3 29.6V656c0 2.6 1.5 5 3.9 6.1 2.4 1.1 5.2 0.6 7.2-1.1l15.5-13.9 15.5 13.9c1.2 1.1 2.8 1.7 4.4 1.7 0.9 0 1.8-0.2 2.7-0.6 2.4-1.1 3.9-3.4 3.9-6.1v-56.7c8.1-7.3 13.3-17.9 13.3-29.6 0.1-22-17.8-39.9-39.8-39.9z m13.3 111.3l-8.9-7.9c-2.5-2.3-6.4-2.3-8.9 0l-8.9 7.9v-33.9c4.2 1.5 8.6 2.3 13.3 2.3 4.7 0 9.1-0.8 13.3-2.3v33.9z m-13.3-44.8c-14.7 0-26.6-11.9-26.6-26.6 0-14.7 11.9-26.6 26.6-26.6 14.7 0 26.6 11.9 26.6 26.6 0 14.7-11.9 26.6-26.6 26.6z" fill="#211F1E" /></svg>}
            {(record.description.includes('assigned') || record.description.includes('returned')) && 
            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 14H15M4.6 10H19.4C19.9601 10 20.2401 10 20.454 9.89101C20.6422 9.79513 20.7951 9.64215 20.891 9.45399C21 9.24008 21 8.96005 21 8.4V5.6C21 5.03995 21 4.75992 20.891 4.54601C20.7951 4.35785 20.6422 4.20487 20.454 4.10899C20.2401 4 19.9601 4 19.4 4H4.6C4.03995 4 3.75992 4 3.54601 4.10899C3.35785 4.20487 3.20487 4.35785 3.10899 4.54601C3 4.75992 3 5.03995 3 5.6V8.4C3 8.96005 3 9.24008 3.10899 9.45399C3.20487 9.64215 3.35785 9.79513 3.54601 9.89101C3.75992 10 4.03995 10 4.6 10ZM5 10H19V16.8C19 17.9201 19 18.4802 18.782 18.908C18.5903 19.2843 18.2843 19.5903 17.908 19.782C17.4802 20 16.9201 20 15.8 20H8.2C7.07989 20 6.51984 20 6.09202 19.782C5.71569 19.5903 5.40973 19.2843 5.21799 18.908C5 18.4802 5 17.9201 5 16.8V10Z" stroke="#000000" />
            </svg>}
            <Typography variant="subtitle1">
              {stamp.toLocaleString('en-US', YearMonthDayMinute)}
            </Typography>


          </Box>
        )}
        {record.description === undefined && activityTimestamp && (
          <Typography variant="subtitle1">
            {new Date(activityTimestamp).toLocaleString('en-US', YearMonthDayMinute)}
          </Typography>
        )}
      </Box>
      {record.description !== undefined && (
        <Typography variant="body2">{record.description}</Typography>
      )}
      {record.description === undefined && activityDescription && (
        <Typography variant="body2">{activityDescription}</Typography>
      )}
    </Box>
  )
}

export default ActivityItem
