import React from 'react'
import { Box } from '@mui/material'
import ClassIcon from '@mui/icons-material/Class'
import { FilterList, FilterListItem, FilterLiveSearch } from 'react-admin'
import { SavedFiltersSection } from '../../../_components/SavedFiltersSection'
import { STAGE_META, STAGE_ORDER } from '../../workflow'

/** Filters drawer body for the Training Events page (renders inside its ListScope). */
const EventListFilter = () => (
  <Box sx={{ p: 2 }}>
    <SavedFiltersSection />
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
  </Box>
)

export default EventListFilter
