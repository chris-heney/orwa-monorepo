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
import { formResourceShellSx } from '../../../css/formLayout'

// Heading bar sits outside SimpleShowLayout so its padding never pushes the
// bar off the app bar; the layout keeps its own gutter for the fields.
const MembershipItemShow = () => (
  <Show actions={false} component="div" sx={formResourceShellSx}>
    <CustomShowHeader />
    <SimpleShowLayout>
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
