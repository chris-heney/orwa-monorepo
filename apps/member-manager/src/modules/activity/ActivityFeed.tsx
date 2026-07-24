import React, { useState } from 'react'
import { InfiniteList, useRecordContext } from 'react-admin'
import ActivityListCardGird from './ActivityFeedGrid'
import { Card, SxProps } from '@mui/material'
import ActivityFeedHeader from './ActivityFeedHeader'
import CustomActivityFeedToolbar from './components/customActivityFeedToolbar'

interface ActivityFeedProps {
  entity_id?: number
  entity?: string
  title?: string
  sx?: SxProps,
  headerSx?: React.CSSProperties
  admin?: boolean
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  listSx?: React.CSSProperties
}

const ActivityFeed = ({ entity = '', entity_id = 0, title = '', sx, admin = false, variant, headerSx, listSx }: ActivityFeedProps) => {

  const [displaySearch, setDisplaySearch] = useState(false)
  const [filter, setFilter] = useState({})
  const record = useRecordContext()

  if (record) {
    entity_id = Number(record.id);
  } else {
    entity_id = entity_id ? entity_id : 0;
  }


  return (
    <>
      <Card
        sx={{
          ...sx,
          width: '100%',
          mb: 20,
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <ActivityFeedHeader sx={headerSx} variant={variant} admin={admin} setDisplaySearch={setDisplaySearch} />
        <InfiniteList
          sx={{
            maxHeight: 500,
            overflowY: 'scroll',
            bgcolor: 'background.paper',
            color: 'text.primary',
            '& .RaList-content': {
              bgcolor: 'transparent',
              boxShadow: 'none',
            },
            ...listSx,
          }} 
          filter={
            entity_id > 0
              ? {
                entity: entity_id ? entity : undefined,
                entity_id,
              }
              : entity
                ? { entity }
                : undefined
          }
          disableSyncWithLocation
          resource={(entity_id > 0 || entity || Object.keys(filter).length > 0) ? 'activity-relations' : 'activities'}
          sort={{ field: 'id', order: 'DESC' }}
          title={title}
          component={'div'}
          exporter={false}
          perPage={500} // Set the limit to 1000
          pagination={false} // Disable pagination
          actions={displaySearch ? <CustomActivityFeedToolbar setFilter={setFilter} /> : false}
        >
          {/* {Activity Feed} */}
          <ActivityListCardGird />
        </InfiniteList>
      </Card >
    </>
  )
}

export default ActivityFeed
