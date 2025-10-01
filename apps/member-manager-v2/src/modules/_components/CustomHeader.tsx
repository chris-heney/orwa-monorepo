import React, { JSX } from 'react'
import { Box, Theme, Typography, useMediaQuery, useTheme } from '@mui/material'
import { SxProps } from '@mui/system'

interface CustomHeaderProps {
  title: string
  Component?: () => JSX.Element
  textSx?: SxProps
  sx?: SxProps
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title, sx, Component, textSx}) => {
  const theme = useTheme();
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'))

  return (
    <Box sx={{
      display: 'flex', 
      alignItems: 'center', 
      width: '100%', 
      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
      overflow: 'hidden',
      borderTopRightRadius: 3,
      borderTopLeftRadius: 3,
      p: isSmall ? 1 : 0, 
      px: 1,
      justifyContent: 'space-between',
      ...sx
    }}>
      <Typography
        variant='h6'
        sx={{
          fontSize: isSmall ? '10px'  : null,
          alignItems: 'center',
          color: 'primary.contrastText',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          p: 1,
          ...textSx
        }}
      >
        {title}
      </Typography>
      {Component && <Box><Component/></Box>}
    </Box>
  )
}

export default CustomHeader
