import React, { ReactNode } from 'react'
import { styled } from '@mui/material'
import BookmarkIcon from '@mui/icons-material/BookmarkBorder'
import { useListContext } from 'ra-core'
import isEqual from 'lodash/isEqual'
import { extractValidSavedQueries, useSavedQueries,SavedQueryFilterListItem,FilterList, RemoveSavedQueryIconButton, AddSavedQueryIconButton} from 'react-admin'


export  const SavedQueriesList = ({
  icon = defaultIcon,
}: SavedQueriesListProps) => {
  const {
    resource,
    filterValues,
    displayedFilters,
    sort,
    perPage,
  } = useListContext()


  
  const [savedQueries] = useSavedQueries(resource)
  const validSavedQueries = extractValidSavedQueries(savedQueries)
  const hasSavedCurrentFilterValue = validSavedQueries.some(savedQuery =>
    isEqual(savedQuery.value, {
      filter: filterValues ,
      sort,
      perPage,
      displayedFilters,
    })
  )
  const hasFilterValues = !isEqual(filterValues, {})

  return (
    <Root label="ra.saved_queries.label" icon={icon}>
      {hasSavedCurrentFilterValue ? (
        <RemoveSavedQueryIconButton
              
          className={SavedQueriesListClasses.floatingIcon}
        />
      ) : hasFilterValues ? (
        <AddSavedQueryIconButton
          className={SavedQueriesListClasses.floatingIcon}
        />
      ) : null}
      {validSavedQueries.map((savedQuery, index) => (
        <SavedQueryFilterListItem
          label={savedQuery.label}
          value={savedQuery.value}
          key={index}
        />
      ))}
    </Root>
  )
}

const PREFIX = 'RaSavedQueriesList'

export const SavedQueriesListClasses = {
  floatingIcon: `${PREFIX}-floatingIcon`,
  floatingTooltip: `${PREFIX}-floatingTooltip`,
  titleContainer: `${PREFIX}-titleContainer`,
  titleIcon: `${PREFIX}-titleIcon`,
}

const Root = styled(FilterList, {
  name: PREFIX,
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  [`& .${SavedQueriesListClasses.floatingIcon}`]: {
    position: 'absolute',
    top: '-1.8em',
    right: 0,
  },
  [`& .${SavedQueriesListClasses.floatingTooltip}`]: {
    position: 'absolute',
    top: '-1.2em',
    right: 3,
    color: theme.palette.action.disabled,
  },
}))

const defaultIcon = <BookmarkIcon />

export interface SavedQueriesListProps {
    icon?: ReactNode,
}
