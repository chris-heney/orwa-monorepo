import React from 'react'
import { Box, Typography } from '@mui/material'
import { SxProps } from '@mui/system'

interface CustomHeaderProps {
  title: string
  sx?: SxProps
  button: React.ReactNode
}

const TrainingScheduleEditHeader: React.FC<CustomHeaderProps> = ({ title, sx, button }) => {
  return (
    <Box sx={{
      display: 'flex', 
      alignItems: 'center',
      width: '100%', 
      justifyContent: 'space-between', 
      backgroundColor: '#262626', 
      ...sx }}>
      <Typography
        variant="h6"
        sx={{
          ml: 2,
          color: 'white',
          fontSize: '18px',
          overflow: 'hidden',
        }}
      >
        {title}
      </Typography>
      {button}
    </Box>
  )
}

export default TrainingScheduleEditHeader
