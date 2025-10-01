import React, {  useState } from 'react'
import {
  TextField,
  DatagridConfigurable,
  useStore,
  SimpleList,
  NumberField,
  ReferenceArrayField,
  SingleFieldList,
  Pagination,
  List,
  Loading,
  ChipField,
} from 'react-admin'
// import { BulkUpdateFormButton } from '@react-admin/ra-form-layout'
import { Box, Button, useMediaQuery } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { CurrencyOptions } from '../../../config/Settings'
import { useMembershipContext } from '../../memberships_v2/MembershipsContextProvider'
import { customDatagridStyle } from '../../../css'
import useCurrentUser from '../../_helpers/useCurrentUser'



const MembershipList = () => {

  const [filterListOpen, setFilterListOpen] = useState(false)
  const {membershipFilters, isLoading} = useMembershipContext()
  const selectedIds = useStore('watersystems.selectedIds')[0] ?? []
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'))

  const {role} = useCurrentUser()

  return isLoading ? <Loading/> : (
    <List
      component={'div'}
      resource="memberships"
      filter={membershipFilters}
      disableSyncWithLocation
      title={' '}
      actions={false}
      // if ids are selected dont add marin top to this component make it a transition
      sx={{
        mt: (selectedIds.length) > 0 ? 6 : 0,
        '& .RaList-noActions': {
          mt: '0',
        },
      }}
      pagination={<Box sx={{ maxWidth: '32vw', position: 'sticky', left: 0 }}><Pagination rowsPerPageOptions={[10, 25, 50, 100]} sx={{ flexDirection: 'row-reverse' }} /></Box>}
    >
      {isSmall && <Button onClick={() => filterListOpen ? setFilterListOpen(false) : setFilterListOpen(true)}>
        {filterListOpen ? 'Hide Filters' : 'Add Filters'}
      </Button>}
      {isSmall ? (

        <Box style={{ whiteSpace: 'nowrap' }}>
          <SimpleList
            linkType='edit'
            primaryText={(record) => record.name}
            secondaryText={(record) => (record.price)}
          />
        </Box>
      ) : (
        <DatagridConfigurable
          sx={customDatagridStyle}
          rowClick={role === 'Admin' ? 'edit' : false}
          bulkActionButtons={false}
        >
          <TextField  source="name" label='Name' noWrap/>
          <NumberField source="price" label='Price' options={CurrencyOptions} />
          <TextField source="description" label='Description'/>
          <ReferenceArrayField source="membership_items" label="Items" reference="membership-items">
            <SingleFieldList linkType={false}>
              <ChipField source="name" />
            </SingleFieldList>
          </ReferenceArrayField>
        </DatagridConfigurable>
      )}
    </List>
  )
}

export default MembershipList