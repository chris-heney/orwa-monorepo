import React from 'react'
import {
  ExportButton,
  FilterLiveSearch,
  SelectColumnsButton,
  useListContext,
} from 'react-admin'
import TopToolbar from './CustomToptoolBar'
import CreateButton from './CustomCreateButton'
import { Theme, useMediaQuery } from '@mui/material'

const CustomListActions = ({
  filterLiveSearch = false,
  selectColumnsButton = true,
  exportButton = true,
  createButtonLabel = 'Add New',
  filterLiveSearchLabel = 'Search',
  hasCreate = true
}: {
  filterLiveSearch?: boolean
  selectColumnsButton?: boolean
  exportButton?: boolean
  createButtonLabel?: string
  filterLiveSearchLabel?: string
  hasCreate?: boolean
}) => {
  const total = useListContext().total
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'))
  return (

    <TopToolbar className="heading-actions" sx={{
      right: 0,
      WebkitJustifyContent: 'flex-start',
    }}>
      {total > 0   && (
        <span style={{ fontSize: isSmall ? 8 : 18, fontWeight: 'bold' }}>{`${total} Records`}</span>
      )}
      {filterLiveSearch && <FilterLiveSearch label={filterLiveSearchLabel} />}
      {hasCreate && <CreateButton label={createButtonLabel} />}
      {selectColumnsButton && !isSmall && <SelectColumnsButton />}
      {exportButton && <ExportButton />}
    </TopToolbar>
  )
}

export default CustomListActions
