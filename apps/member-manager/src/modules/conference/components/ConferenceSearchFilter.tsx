import React from 'react'
import { FilterLiveSearch, useListFilterContext } from 'react-admin'
import { useConferenceContext } from '../ConferenceContext'

const ConferenceSearchFilter = () => {

  const { setSearchFilter } = useConferenceContext()
  const { filterValues } = useListFilterContext()

  React.useEffect(() => {
    if (filterValues) setSearchFilter(filterValues)
  }, [filterValues])

  return (
    <FilterLiveSearch />
  )
}

export default ConferenceSearchFilter
