import React, { JSX } from 'react'
import { Box, Theme, Typography, useMediaQuery } from '@mui/material'
import { SxProps } from '@mui/system'
import { useTheme } from '@mui/material/styles'

interface CustomHeaderProps {
  title: string
  Component?: () => JSX.Element
  textSx?: SxProps
  sx?: SxProps
}

const CustomHeader: React.FC<CustomHeaderProps> = ({ title, sx, Component, textSx}) => {

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'))

  const theme = useTheme();

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      width: '100%', 
      backgroundColor: theme.palette.primary.main,
      overflow: 'hidden',
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
          color: 'white',
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
