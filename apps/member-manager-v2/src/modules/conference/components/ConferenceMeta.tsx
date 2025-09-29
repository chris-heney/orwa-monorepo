import { Box, Chip } from '@mui/material'
import React from 'react'
import { FunctionField, RaRecord } from 'react-admin'

interface ISharedMeta {
    id?: number
    label: string
    value: string
    key: string
    item: number | null
  }

  
const ConferenceMeta = () => {
  return (
    <FunctionField label="Attendee Items" render={(attendee: RaRecord) => 
      <Box sx={{ px: 2, gap: 1, display: 'flex', ml: 10 }}>
        {attendee.items.map((meta: ISharedMeta) => (<Chip
          label={`${meta.label}: ${meta.value}`}
          key={`${meta.key}-${meta.id}`}
        />))}
      </Box>
    } />
  )
}

export default ConferenceMeta