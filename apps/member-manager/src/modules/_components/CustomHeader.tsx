import React, { JSX } from 'react'
import { Box, Theme, Typography, useMediaQuery } from '@mui/material'
import { SxProps } from '@mui/system'

interface CustomHeaderProps {
  title: React.ReactNode
  Component?: () => JSX.Element
  textSx?: SxProps
  sx?: SxProps
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title, sx, Component, textSx}) => {

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'))

  return (
    <Box sx={{
      display: 'flex', 
      alignItems: 'center', 
      width: '100%', 
      backgroundColor: '#262626',  
      overflow: 'hidden',
      borderTopRightRadius: 3,
      borderTopLeftRadius: 3,
      px: 1.5,
      py: 0.75,
      minHeight: 48,
      justifyContent: 'space-between',
      ...sx
    }}>
      <Typography
        variant='h6'
        sx={{
          fontSize: isSmall ? '10px'  : null,
          color: 'white',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          lineHeight: 1.2,
          m: 0,
          ...textSx
        }}
      >
        {title}
      </Typography>
      {Component && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            '& .MuiButton-root': {
              minHeight: 0,
              py: 0.5,
              lineHeight: 1.2,
            },
          }}
        >
          <Component />
        </Box>
      )}
    </Box>
  )
}

export default CustomHeader
