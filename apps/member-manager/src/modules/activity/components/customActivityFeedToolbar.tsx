import React, { useEffect, useState } from 'react'
import { FilterLiveSearch, Identifier, TopToolbar, useDataProvider } from 'react-admin'
import CustomSelectInput from './customSelectInput'
import { Grid } from '@mui/material'

interface ActivityFeedToolBarProps {
    setFilter: React.Dispatch<React.SetStateAction<object>>
}

const CustomActivityFeedToolbar = ({ setFilter } : ActivityFeedToolBarProps) => {
  const dataProvider = useDataProvider()
  const [staffChoices, setStaffChoices] = useState<{ value: Identifier, label: React.ReactNode }[]>([])
    
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const { data } = await dataProvider.getList('staff', {
          pagination: { page: 1, perPage: 100 },
          sort: { field: 'id', order: 'ASC' },
          filter: {},
          meta: {
            raw: true,
            populate: true
          }
        })
  
        setStaffChoices(
          data.map((staff) => ({
            value: staff.id,
            // Staff rows can have a null/unpopulated contact; guard so the
            // activity feed toolbar never crashes the dashboard.
            label: `${staff.contact?.first ?? ''} ${
              staff.contact?.last ?? ''
            }`.trim(),
          }))
        )
          
      } catch (error) {
        console.error('Error fetching staff data:', error)
      }
    }
    fetchStaff()
  }, [dataProvider])
  
  const entityChoices = [
    { value: ' ', label: 'Empty' },
    { value: 'staff', label: 'Staff' },
    { value: 'asset', label: 'Asset' },
  ]
  const entity_id = [
    { value: ' ', label: 'Empty' },
    ...staffChoices.map((choice) => ({ value: choice.value, label: choice.label })),
  ]  
  return (
    <TopToolbar sx={{ justifyContent: 'flex-start' }}>
      <Grid container spacing={2}>
        {/* SearchBar taking full width on extra-small (xs) screens */}
        <Grid item xs={12} sm={12} lg={4}>
          <FilterLiveSearch fullWidth />
        </Grid>

        {/* CustomSelectInput components taking half width each on extra-small (xs) screens */}
        <Grid item xs={6} sm={6} lg={4}>
          <CustomSelectInput label={'Entity'} setFilter={setFilter} items={entityChoices} type="entity" />
        </Grid>

        <Grid item xs={6} sm={6} lg={4}>
          <CustomSelectInput label={'Staff'} setFilter={setFilter} items={entity_id} type="entity_id" />
        </Grid>
      </Grid>
    </TopToolbar>
  )
}

export default CustomActivityFeedToolbar
