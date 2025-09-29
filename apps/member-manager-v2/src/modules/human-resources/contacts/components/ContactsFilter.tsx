import React from 'react'
import { Card, CardContent } from '@mui/material'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import { FilterList, FilterListItem, FilterLiveSearch, SavedQueriesList } from 'react-admin'

const ContactsFilter = () => (
  <Card sx={{ order: -1, mr: 2, mt: 6, width: 200, maxHeight: 500, minWidth: 150 }}>
    <CardContent>
      <SavedQueriesList />
      <FilterLiveSearch />
			
      <FilterList label="Contact" icon={<VerifiedUserIcon />}>
        <FilterListItem
          label="Owner"
          value={{ title: 'OWNER' }} 
        />
        <FilterListItem
          label="Associate"
          value={{ contact_type: 'associate' }} 
        />
      </FilterList>
			
    </CardContent>
  </Card>
)
export default ContactsFilter