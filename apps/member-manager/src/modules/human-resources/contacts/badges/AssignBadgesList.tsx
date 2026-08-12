import React from 'react'
import { Identifier, UpdateParams, useDataProvider, useGetList, useRecordContext, useRefresh } from 'react-admin'
import { Box, Chip, Grid, IconButton, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { toRelationWriteId, toRelationWriteIds } from '../../../../helpers/strapiIds'

const AssignBadgesList = () => {
  const record = useRecordContext()
  const dataProvider = useDataProvider()
  const refresh = useRefresh()
  const { data: badges = [] } = useGetList('contact-badges', {
    meta: {
      raw: true,
    },
    pagination: { page: 1, perPage: 100 },
  })

  const assignBadge = async (badgeId: Identifier) => {
    const updatedRecordParams: UpdateParams = {
      id: record.id,
      previousData: record,
      data: {
        badges: [...toRelationWriteIds(record.badges), toRelationWriteId(badgeId)].filter(
          (id): id is string | number => id != null
        ),
      }
    }
    await dataProvider.update('contacts', updatedRecordParams)
    refresh()
  }
  return (
    <Grid container mx={1} my={1} spacing={1} justifyContent="flex-start">
      {badges.map((badge, index: number) => (
        badge.icon?.url !== undefined && (

          <Grid item key={`${badge.title}-${index}`} sx={{ position: 'relative', textAlign: 'center' }}>
            <Box>

              <IconButton
                onClick={() => assignBadge(badge.id)}
                sx={{
                  cursor: 'pointer',
                }}>
                <Tooltip title="Assign Badge" arrow >
                  <AddIcon sx={{
                    color: '#1976d2',
                    position: 'absolute',
                    top: -12,
                    left: 0,
                    height: 16,
                    backgroundColor: 'transparent',
                    zIndex: 1,
                  }}
                  />
                </Tooltip>
              </IconButton>

              <Tooltip title={badge.title} arrow>
                <Chip
                  label={
                    <img src={`${import.meta.env.VITE_API_ENDPOINT}` + badge.icon.url}
                      style={{ height: 24, filter: badge.invert === true ? 'invert(1)' : '' }}
                    />}
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

export default AssignBadgesList
