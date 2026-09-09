import React from 'react'
import {
  NumberField,
  ReferenceArrayField,
  Show,
  SimpleShowLayout,
  SingleFieldList,
  TextField,
  ChipField,
} from 'react-admin'
import { CurrencyOptions } from '../../../config/Settings'
import CustomShowHeader from '../componenets/CustomShowHeader'
import { formResourceShellSx } from '../../../css/formLayout'

// Heading bar sits outside SimpleShowLayout so its padding never pushes the
// bar off the app bar; the layout keeps its own gutter for the fields.
const MembershipShow = () => (
  <Show actions={false} component="div" sx={formResourceShellSx}>
    <CustomShowHeader />
    <SimpleShowLayout>
      <TextField source="name" label="Name" />
      <NumberField source="price" label="Price" options={CurrencyOptions} />
      <TextField source="description" label="Description" />
      <ReferenceArrayField source="membership_items" label="Items" reference="membership-items">
        <SingleFieldList linkType={false}>
          <ChipField source="name" />
        </SingleFieldList>
      </ReferenceArrayField>
    </SimpleShowLayout>
  </Show>
)

export default MembershipShow
