import { Box, ListItem, SxProps, Typography } from '@mui/material'
import { ReactNode } from 'react'

export const labelStyle = {
  fontWeight: 'bold',
  marginRight: '5px',
  whiteSpace: 'nowrap',
  fontSize: '16px'
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
        <Typography style={fieldStyle}>{value}</Typography>
      ) : typeof value === 'object' ? (
        value as ReactNode
      ) : null}
    </ListItem>
  )
}

export default ResponsiveListItem 