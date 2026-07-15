import React from 'react'
import { Identifier, UpdateParams, useDataProvider, useGetList, useRecordContext, useRefresh } from 'react-admin'
import { Box, Chip, Grid, IconButton, Tooltip } from '@mui/material'
import { useLocation } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete'
interface BadgeGridProps {
  filter?: string | string[]
  filterGrid?: boolean
}
const BadgeGrid = ({ filter, filterGrid = false }: BadgeGridProps) => {
  const record = useRecordContext()
  const dataProvider = useDataProvider()
  const location = useLocation()
  const refresh = useRefresh()
  const pathname = location.pathname
  const param = pathname.split('/').pop()
  const { data: badges = [] } = useGetList('contact-badges', {
    meta: {
      raw: true,
    },
    pagination: { page: 1, perPage: 100 },
    filter: filterGrid ? { id: filter } : undefined,
  })
  if (filterGrid && filter?.length === 0) {
    return <div>No badges to display</div>
  }

  const removeBadge = async (badgeId: Identifier) => {
    const updatedRecordParams: UpdateParams = {
      id: record.id,
      previousData: record,
      data: {
        badges: record.badges.filter((id: Identifier) => id !== badgeId),
      }
    }
    await dataProvider.update('contacts', updatedRecordParams)        
    refresh()
  }

  const deleteBadge = async (badgeId: Identifier) => {
    console.log('delete badge', badgeId)
    await dataProvider.delete('contact-badges', { id: badgeId })
    refresh()
  }

  const handleBoxClick = (badgeId: Identifier) => {
    if (param === 'dashboard') {
      deleteBadge(badgeId)
      //add use notify and reload page
    } else {
      removeBadge(badgeId)
    }
  }

  return (
    <Grid container mx={1} my={1} spacing={1} sx={{ position: 'relative', textAlign: 'center' }}>
      {badges.map((badge, index: number) => (
        badge.icon?.url !== undefined && (
          <Grid item key={`${badge.title}-${index}`}>
            <Box
            >

              <IconButton
                onClick={() => handleBoxClick(badge.id)}
                sx={{
                  cursor: 'pointer',
                  position: 'relative'
                }}>

                <Tooltip title={param === 'dashboard' ? 'Delete Badge' : 'Remove Badge'} arrow>
                  <DeleteIcon
                    sx={{
                      position: 'absolute',
                      top: -10,
                      left: 0,
                      height: 12,
                      color: '#d32f2f',
                      zIndex: 1,
                    }}
                  />
                </Tooltip>
              </IconButton>

              <Tooltip title={badge.title} arrow>
                <Chip
                  label={<img src={`${import.meta.env.VITE_API_ENDPOINT}` + badge.icon.url} style={{height: 24, filter: badge.invert === true ? 'invert(1)' : ''}} />}
                  sx={{ padding: '0px', backgroundColor: badge.color_code }}
                />
              </Tooltip>
            </Box>
          </Grid>
        )
      ))}
    </Grid>
  )
}

export default BadgeGrid
