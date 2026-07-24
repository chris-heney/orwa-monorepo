import React from 'react'
import { Theme, useMediaQuery, useTheme } from '@mui/material'
import LogoSrc from '../../assets/logo.png'
import LogoWhiteSrc from '../../assets/logo-white.webp'

const Logo = () => {
  const theme = useTheme()
  const isSmall = useMediaQuery((t: Theme) => t.breakpoints.down('sm'))
  const isDark = theme.palette.mode === 'dark'

  const width = isSmall ? 96 : 196

  return (
    <img
      src={isDark ? LogoWhiteSrc : LogoSrc}
      alt="ORWA logo"
      width={width}
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  )
}

export default Logo
