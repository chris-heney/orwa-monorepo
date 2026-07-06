import React from 'react'
import {
  ChipField,
  NumberField,
  ReferenceArrayField,
  Show,
  SimpleShowLayout,
  SingleFieldList,
  TextField,
} from 'react-admin'
import { CurrencyOptions } from '../../../config/Settings'
import CustomShowHeader from '../componenets/CustomShowHeader'

const MembershipItemShow = () => (
  <Show actions={false}>
    <SimpleShowLayout>
      <CustomShowHeader />
      <TextField source="name" label="Name" />
      <TextField source="description" label="Description" />
      <NumberField source="price" label="Price" options={CurrencyOptions} />
      <NumberField source="max_price" label="Max Price" />
      <NumberField source="max_purchasable" label="Max Purchasable" />
      <NumberField source="min_purchasable" label="Min Purchasable" />
      <ReferenceArrayField source="memberships" label="Included" reference="memberships">
        <SingleFieldList linkType={false}>
          <ChipField source="name" />
        </SingleFieldList>
      </ReferenceArrayField>
    </SimpleShowLayout>
  </Show>
)

export default MembershipItemShow
