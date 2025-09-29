import React from 'react'
import { Card, CardContent, Theme, useMediaQuery } from '@mui/material'
import ClassIcon from '@mui/icons-material/Class'
import {  FilterList, FilterListItem, FilterLiveSearch } from 'react-admin'
import { SavedQueriesList } from '../../../_components/CustomSavedQueryList' 


const EventListFilter = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'))

  return (
    <Card sx={{ order: -1, mr: 2 , mt: isSmall ? 0 : 6, minWidth: 200, maxHeight: 500, width: 200, position: 'sticky', top: '0' }}>
      <CardContent>
        <SavedQueriesList />
        <FilterLiveSearch />
        {/* <SearchInput source="q" alwaysOn /> */}
        <FilterList label="Event Status" icon={<ClassIcon />}>
          <FilterListItem label="DRAFT" value={{ status: 'DRAFT' }} />
          <FilterListItem label="REVIEW" value={{ status: 'REVIEW' }} />
          <FilterListItem label="DEQ" value={{ status: 'DEQ' }} />
          <FilterListItem label="RSVP" value={{ status: 'RSVP' }} />
          <FilterListItem label="LIVE" value={{ status: 'LIVE' }} />
          <FilterListItem label="COMPLETE" value={{ status: 'COMPLETE' }} />
          <FilterListItem label="CANCELLED" value={{ status: 'CANCELLED' }} />
        </FilterList>
      </CardContent>
    </Card>
  )
}


export default EventListFilter
