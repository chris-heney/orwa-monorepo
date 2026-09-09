import React, { useState } from 'react'
import { InfiniteList, useRecordContext } from 'react-admin'
import ActivityListCardGird from './ActivityFeedGrid'
import { Box, Card, SxProps } from '@mui/material'
import ActivityFeedHeader from './ActivityFeedHeader'
import CustomActivityFeedToolbar from './components/customActivityFeedToolbar'
import { getRelationFilterId } from '../../helpers/strapiIds'
import { useRecordDrawerContext } from '../_components/drawer/DrawerContext'

interface ActivityFeedProps {
  /** activity-relation `entity` name written by the Strapi activity-feed plugin. */
  entity?: string
  /**
   * Numeric Strapi PK of the entity. Defaults to the enclosing drawer's
   * record context, then react-admin's RecordContext. Never pass a documentId.
   */
  entityId?: number
  /** @deprecated legacy alias of `entityId`. */
  entity_id?: number | string
  title?: string
  sx?: SxProps,
  headerSx?: React.CSSProperties
  admin?: boolean
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  listSx?: React.CSSProperties
  /**
   * `card` (default) — self-contained Card with its own "Activity Feed" header.
   * `plain` — body only, for use inside a RightDrawer that already has a header.
   */
  frame?: 'card' | 'plain'
}

/**
 * Resolve the numeric entity id the activity-relations API filters on.
 *
 * `activity_relations.entity_id` is the numeric Strapi PK. The data provider
 * remaps `record.id` to the documentId, so `Number(record.id)` is `NaN` and
 * silently widened the feed to every record of the entity type — always read
 * `entityId` (or a numeric explicit prop).
 */
const resolveEntityId = (
  explicit: number | string | undefined,
  drawerEntityId: number | undefined,
  record: ReturnType<typeof useRecordContext>
): number | undefined => {
  const fromProp = getRelationFilterId({ id: explicit })
  if (fromProp != null && fromProp > 0) return fromProp
  if (drawerEntityId != null && drawerEntityId > 0) return drawerEntityId
  const fromRecord = getRelationFilterId(record)
  return fromRecord != null && fromRecord > 0 ? fromRecord : undefined
}

const ActivityFeed = ({
  entity = '',
  entityId,
  entity_id,
  title = '',
  sx,
  admin = false,
  variant,
  headerSx,
  listSx,
  frame = 'card',
}: ActivityFeedProps) => {

  const [displaySearch, setDisplaySearch] = useState(false)
  const [filter, setFilter] = useState({})
  const record = useRecordContext()
  const drawer = useRecordDrawerContext()

  const resolvedEntityId = resolveEntityId(
    entityId ?? entity_id,
    drawer?.entityId,
    record
  )

  const list = (
    <InfiniteList
      sx={{
        maxHeight: frame === 'plain' ? 'none' : 500,
        overflowY: frame === 'plain' ? 'visible' : 'scroll',
        bgcolor: 'background.paper',
        color: 'text.primary',
        '& .RaList-content': {
          bgcolor: 'transparent',
          boxShadow: 'none',
        },
        ...listSx,
      }}
      filter={
        resolvedEntityId != null
          ? {
              entity: entity || undefined,
              entity_id: resolvedEntityId,
            }
          : entity
            ? { entity }
            : undefined
      }
      disableSyncWithLocation
      resource={(resolvedEntityId != null || entity || Object.keys(filter).length > 0) ? 'activity-relations' : 'activities'}
      sort={{ field: 'id', order: 'DESC' }}
      title={title}
      component={'div'}
      exporter={false}
      perPage={500}
      pagination={false}
      actions={displaySearch ? <CustomActivityFeedToolbar setFilter={setFilter} /> : false}
    >
      <ActivityListCardGird />
    </InfiniteList>
  )

  if (frame === 'plain') {
    return (
      <Box sx={{ width: '100%', bgcolor: 'background.paper', color: 'text.primary', ...sx }}>
        {list}
      </Box>
    )
  }

  return (
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
      {list}
    </Card>
  )
}

export default ActivityFeed
