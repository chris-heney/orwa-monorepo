import { Box, Card, SvgIconTypeMap, Typography, useTheme } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import React from 'react'

interface StatWidgetProps {
  heading: string;
  subheading: string;
  WidgetIcon: OverridableComponent<SvgIconTypeMap>
}

const DateStatusWidget = ({ heading, subheading, WidgetIcon }: StatWidgetProps) => {
  const theme = useTheme();
  
  return (
    <Card
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 2,
        borderRadius: '16px',
        boxShadow: theme.palette.mode === 'dark' ? '0px 4px 8px rgba(0, 0, 0, 0.3)' : '0px 4px 8px rgba(0, 0, 0, 0.1)',
        color: theme.palette.common.white,
      }}
    >
      <Box
        sx={{
          p: 2,
          backgroundColor: 'rgba(255,255,255,0.2)',
          borderRadius: '50%',
          marginRight: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <WidgetIcon sx={{ color: theme.palette.common.white, fontSize: 32 }} />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant='h6' sx={{ mb: -1 }}>{heading}</Typography>
        <Typography variant='subtitle2'>{subheading}</Typography>
      </Box>
    </Card>
  )
}

export default DateStatusWidget