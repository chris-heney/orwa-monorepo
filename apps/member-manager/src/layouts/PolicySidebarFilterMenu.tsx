import React from 'react'

import { Card, CardContent, Box } from '@mui/material'
import PriceCheckIcon from '@mui/icons-material/PriceCheck'
import { FilterList, FilterListItem, FilterLiveSearch, SavedQueriesList } from 'react-admin'
import AcUnitIcon from '@mui/icons-material/AcUnit'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork'
import AddRoadIcon from '@mui/icons-material/AddRoad'
import AirIcon from '@mui/icons-material/Air'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import AddTaskIcon from '@mui/icons-material/AddTask'
import AirlineStopsIcon from '@mui/icons-material/AirlineStops'

const PolicySidebarFilterMenu = () => (
  <Card sx={{ order: -1, mr: 2, mt: 9, width: 200, height: '450px', overflow: 'scroll' }}>
    <CardContent>
      <SavedQueriesList />
      <FilterLiveSearch />
      {/* <SearchInput source="q" alwaysOn /> */}
      <FilterList label="Watersystem Status" icon={<PriceCheckIcon />}>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginLeft: '20px' }}>
          <AcUnitIcon />
          <FilterListItem
            label="Active"
            value={{ field: '[Watersystem][status]', operator: { field: 'contains' }, value: 'Initialized' }}
          />
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginLeft: '20px' }}>
          <AccountTreeIcon />
          <FilterListItem
            label="Initialized Draft"
            value={{ field: '[Watersystem][status]', operator: { field: 'contains' }, value: 'Initialized-Draft' }}
          />
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginLeft: '20px' }}>
          <AddHomeWorkIcon />
          <FilterListItem
            label="Expired"
            value={{ field: '[Watersystem][status]', operator: { field: 'contains' }, value: 'Expired' }}
          />
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginLeft: '20px' }}>
          <AddRoadIcon />
          <FilterListItem
            label="Approved Active"
            value={{ field: '[Watersystem][status]', operator: { field: 'contains' }, value: 'Approved-Active' }}
          />
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginLeft: '20px' }}>
          <AirIcon />
          <FilterListItem
            label="Expired Draft"
            value={{ field: '[Watersystem][status]', operator: { field: 'contains' }, value: 'Expired-Draft' }}
          />
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginLeft: '20px' }}>
          <AdminPanelSettingsIcon />
          <FilterListItem
            label="Initialized Pending Review"
            value={{
              field: '[Watersystem][status]',
              operator: { field: 'contains' },
              value: 'Initialized-Pending-Review',
            }}
          />
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginLeft: '20px' }}>
          <AddTaskIcon />
          <FilterListItem
            label="Expired Pending Review"
            value={{ field: '[Watersystem][status]', operator: { field: 'contains' }, value: 'Expired-Pending-Review' }}
          />
        </Box>
        <Box display="flex" justifyContent="center" alignItems="center" sx={{ marginLeft: '20px' }}>
          <AirlineStopsIcon />
          <FilterListItem
            label="Tentative Approved"
            value={{ field: '[Watersystem][status]', operator: { field: 'contains' }, value: 'Tentative-Approved' }}
          />
        </Box>
      </FilterList>
      <FilterList label="Payment Status" icon={<PriceCheckIcon />}>
        <FilterListItem label="Paid" value={{}} />
        <FilterListItem label="Payment Pending" value={{}} />
        <FilterListItem label="Payment Overdue" value={{}} />
      </FilterList>
    </CardContent>
  </Card>
)

export default PolicySidebarFilterMenu 