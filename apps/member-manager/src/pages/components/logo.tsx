import React from 'react'
import LogoSrc from '../../assets/logo.png'
import { Theme, useMediaQuery } from '@mui/material'

const Logo = () => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const logo: Record<string,string> = {
    src: LogoSrc,
    width: isSmall ? '96' : '196',
    height: isSmall ? '96' : '196',
  }

  return <img src={logo.src} alt="logo" width={logo.width} />
}


export default Logo