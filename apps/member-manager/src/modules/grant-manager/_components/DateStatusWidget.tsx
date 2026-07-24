import { Box, Card, SvgIconTypeMap, Typography } from '@mui/material'
import { OverridableComponent } from '@mui/material/OverridableComponent'
import React from 'react'

interface StatWidgetProps {
  heading: string;
  subheading: string;
  WidgetIcon: OverridableComponent<SvgIconTypeMap>
}

const DateStatusWidget = ({ heading, subheading, WidgetIcon }: StatWidgetProps) => {
  return (
    <Card
      sx={{
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #1a3a5c 0%, #234e78 55%, #2a5f8f 100%)'
            : 'linear-gradient(to right, #3498db, #6bb9f0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 2,
        borderRadius: '16px',
        boxShadow: (theme) =>
          theme.palette.mode === 'dark'
            ? '0px 4px 12px rgba(0, 0, 0, 0.45)'
            : '0px 4px 8px rgba(0, 0, 0, 0.1)',
        color: 'white',
        border: (theme) =>
          theme.palette.mode === 'dark'
            ? '1px solid rgba(144, 202, 249, 0.25)'
            : 'none',
      }}
    >
      <Box
        sx={{
          p: 2,
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark'
              ? 'rgba(255,255,255,0.12)'
              : 'rgba(255,255,255,0.2)',
          borderRadius: '50%',
          marginRight: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <WidgetIcon sx={{ color: '#fff', fontSize: 32 }} />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography variant='h6' sx={{ mb: -1, fontWeight: 700 }}>{heading}</Typography>
        <Typography
          variant='subtitle2'
          sx={{
            color: (theme) =>
              theme.palette.mode === 'dark'
                ? 'rgba(255, 255, 255, 0.9)'
                : 'inherit',
            fontWeight: 500,
          }}
        >
          {subheading}
        </Typography>
      </Box>
    </Card>
  )
}

export default DateStatusWidget