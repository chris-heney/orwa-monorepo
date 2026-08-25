import React, { JSX, ReactNode } from 'react'
import { SxProps } from '@mui/system'
import PageHeadingBar from './PageHeadingBar'

interface CustomHeaderProps {
  title: ReactNode
  Component?: () => JSX.Element
  textSx?: SxProps
  sx?: SxProps
}

/** Alias of PageHeadingBar so every module heading stays flush and square. */
const CustomHeader: React.FC<CustomHeaderProps> = ({ title, sx, Component }) => (
  <PageHeadingBar
    title={title}
    actions={Component ? <Component /> : undefined}
    sx={sx}
  />
)

export default CustomHeader
