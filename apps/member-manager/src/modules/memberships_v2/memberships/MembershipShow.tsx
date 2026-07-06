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

const MembershipShow = () => (
  <Show actions={false}>
    <SimpleShowLayout>
      <CustomShowHeader />
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
