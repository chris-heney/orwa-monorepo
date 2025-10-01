import React, {  useState } from 'react'
import {
  TextField,
  DatagridConfigurable,
  SimpleList,
  NumberField,
  Pagination,
  List,
  Loading,
  ReferenceArrayField,
  SingleFieldList,
  ChipField,
} from 'react-admin'
// import { BulkUpdateFormButton } from '@react-admin/ra-form-layout'
import { Box, Button, useMediaQuery } from '@mui/material'
import { Theme } from '@mui/material/styles'
import { CurrencyOptions } from '../../../config/Settings'
import { useMembershipContext } from '../../memberships_v2/MembershipsContextProvider'
import { customDatagridStyle } from '../../../css'
import useCurrentUser from '../../_helpers/useCurrentUser'



const MembershipItemsList = () => {

  const [filterListOpen, setFilterListOpen] = useState(false)
  const {membershipExtraFilters, isLoading} = useMembershipContext()
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'))
  const {role} = useCurrentUser()

  return isLoading ? <Loading/> : (
    <List
      component={'div'}
      resource="membership-items"
      filter={membershipExtraFilters}
      disableSyncWithLocation
      title={' '}
      actions={false}
      // if ids are selected dont add marin top to this component make it a transition
      pagination={<Box sx={{ maxWidth: '32vw', position: 'sticky', left: 0 }}><Pagination rowsPerPageOptions={[10, 25, 50, 100]} sx={{ flexDirection: 'row-reverse' }} /></Box>}
      sx={{
        '& .RaList-noActions': {
          mt: '0',
        },
      }}
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
          <TextField source="description" label='Description'/>
          <NumberField source="price" label='Price' options={CurrencyOptions} />
          <NumberField source='max_price' label='Max Price'/>
          <NumberField source='max_purchasable' label='Max Purchasable'/>
          <NumberField source='min_purchasable' label='Min Purchasable'/>
          <ReferenceArrayField source="memberships" label="Included" reference="memberships">
            <SingleFieldList linkType={false}>
              <ChipField source="name" />
            </SingleFieldList>
          </ReferenceArrayField>
        </DatagridConfigurable>
      )}
    </List>
  )
}

export default MembershipItemsList