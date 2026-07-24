import { Box, Button, FormControlLabel, FormLabel, Radio, RadioGroup, Theme, useMediaQuery } from '@mui/material'
import React from 'react'
import { useGetList } from 'react-admin'
import coloredSurfaceSx from '../../_helpers/coloredSurfaceSx'

const SoonerwarnStatusFilter = ({
  resource,
  selectedStatuses,
  setSelectedStatuses,
} : {
  resource: string
  selectedStatuses: string[]
  setSelectedStatuses: (status: string[]) => void
}) => {
 
  const { data: legendData } = useGetList(resource, {
    pagination: { page: 1, perPage: 1000 },
    sort: { field: 'order', order: 'ASC' },
  })

  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

  const handleStatusChange = (statusId: string) => {
    if (selectedStatuses.includes(statusId)) {
      // Deselect if already selected
      setSelectedStatuses(selectedStatuses.filter((status) => status !== statusId))
    } else {
      // Select the status
      setSelectedStatuses([...selectedStatuses, statusId])
    }
  }

  return (
    <Box p={2} width={isSmall ? '90%' : '100%'}>
      <RadioGroup value={selectedStatuses} onChange={(e) => handleStatusChange(e.target.value)}>
        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
          <FormLabel component="legend">Statuses</FormLabel>
          {selectedStatuses.length !== 0 && (
            <Button sx={{ mr: isSmall ? 0 : 1 }} onClick={() => { 
                setSelectedStatuses([])
            }}>
              Reset
            </Button>
          )}
        </Box>
        {legendData?.map((legend, i) => (
          <FormControlLabel
            key={`status-${i}`}
            sx={coloredSurfaceSx(legend.color || '#cccccc', {
              whiteSpace: isSmall ? 'normal' : 'nowrap',
              px: 0.5,
              borderRadius: 0.5,
            })}
            value={legend.id}
            control={<Radio onClick={() => handleStatusChange(legend.id.toString())} />}
            label={legend.name}
            checked={selectedStatuses.includes(legend.id.toString())}
          />
        ))}
      </RadioGroup>
    </Box>
  )
}

export default SoonerwarnStatusFilter