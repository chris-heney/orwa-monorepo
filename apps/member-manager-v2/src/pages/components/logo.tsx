import React from 'react'
import { Theme, useMediaQuery } from '@mui/material'

const Logo = () => {
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const logo: Record<string,string> = {
    src: "/orwa-black.png",
    width: isSmall ? '96' : '196',
    height: isSmall ? '96' : '196',
  }

  return <img src={logo.src} alt="logo" width={logo.width} />
}


export default Logo