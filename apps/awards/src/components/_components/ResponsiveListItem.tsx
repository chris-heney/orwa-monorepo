import { Box, ListItem, SxProps } from '@mui/material'
import { ReactNode } from 'react'

const labelStyle = {
  fontWeight: 'bold',
  marginRight: '5px',
  whiteSpace: 'nowrap',
}

interface ResponsiveListItemProps {
  label: string
  value: string | ReactNode
  sx?: SxProps
  divider?: boolean
}

const ResponsiveListItem = ({ label, value, sx = {}, divider = false }: ResponsiveListItemProps) => {

  const listStyle = { ...sx, justifyContent: 'space-between' }

  const fieldStyle = {}

  return (
    <ListItem divider={divider as boolean} sx={listStyle}>
      <Box component='label' sx={labelStyle}>{label}</Box>
      {typeof value === 'string' ? (
        <span style={fieldStyle}>{value}</span>
      ) : typeof value === 'object' ? (
        value as ReactNode
      ) : null}
    </ListItem>
  )
}

export default ResponsiveListItem 