import React from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import { SxProps } from '@mui/system'
import GroupIcon from '@mui/icons-material/Group'

interface ScheduleHeaderProps {
  title: string
  sx?: SxProps
  button?: boolean
  onClick?: () => void
}

const EventScheduleHeader: React.FC<ScheduleHeaderProps> = ({ title, sx, button, onClick }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      <Typography
        variant='h5'
        sx={{
          alignItems: 'center',
          color: 'white',
          backgroundColor: '#262626',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          flexGrow: 1,
          p: 1,
          ...sx
        }}
      >
        {title}
        {button && (
          <IconButton
            style={{
              color: 'white',
              transition: 'transform 0.2s',
              padding: '2px',
              fontSize: '8px',
              marginLeft: 10
            }}
            onClick={onClick} 
            size='large'
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.5)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <GroupIcon />
          </IconButton>
        )}
      </Typography>
    </Box>
  )
}

export default EventScheduleHeader
