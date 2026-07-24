import React from 'react'
import { Card, CardContent, Theme, useMediaQuery } from '@mui/material'
import ClassIcon from '@mui/icons-material/Class'
import { FilterList, FilterListItem, FilterLiveSearch } from 'react-admin'
import { SavedQueriesList } from '../../../_components/CustomSavedQueryList'
import { STAGE_META, STAGE_ORDER } from '../../workflow'

const EventListFilter = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'))

  return (
    <Card
      sx={{
        order: -1,
        mr: 2,
        mt: isSmall ? 0 : 0,
        minWidth: 210,
        width: 210,
        alignSelf: 'flex-start',
        position: 'sticky',
        top: 0,
        bgcolor: 'background.paper',
        color: 'text.primary',
      }}
    >
      <CardContent sx={{ pt: 1 }}>
        <SavedQueriesList />
        <FilterLiveSearch />
        <FilterList label="Event Status" icon={<ClassIcon />}>
          {[...STAGE_ORDER, 'CANCELLED' as const].map((stage) => (
            <FilterListItem
              key={stage}
              label={STAGE_META[stage].label}
              value={{ status: stage }}
            />
          ))}
        </FilterList>
      </CardContent>
    </Card>
  )
}

export default EventListFilter
