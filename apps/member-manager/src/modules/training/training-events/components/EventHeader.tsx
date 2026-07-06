import React from 'react'
import { Box, SxProps, Theme, Typography, useMediaQuery } from '@mui/material'
import EventActionButtons from './EventActionButtons'
import { useRecordContext } from 'react-admin'

interface EventHeaderProps {
  sx?: SxProps
  title?: string
  context: 'edit' | 'create' | 'show'
}

const EventHeader = ({ sx = {}, title, context }: EventHeaderProps) => {
  const record = useRecordContext()
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  return (
    <Box sx={{ 
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      justifyContent: 'space-between',
      backgroundColor: '#262626',
      ...sx 
    }}>
      <Typography
        variant="h6"
        sx={{
          ml: 2,
          color: 'white',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontSize: isSmall ? '12px' : '18px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {title}
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
      }}>
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            mr: 2,
            fontSize: isSmall ? '12px' : '18px',
          }}
        >
          {record ? record.status : ''}
        </Typography>
        {context !== 'create' && <EventActionButtons />}
      </Box>
    </Box>
  )
}

export default EventHeader
