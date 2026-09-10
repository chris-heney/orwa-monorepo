import React from 'react'
import {
  NumberField,
  ReferenceArrayField,
  SimpleShowLayout,
  SingleFieldList,
  TextField,
  ChipField,
} from 'react-admin'
import { CurrencyOptions } from '../../../config/Settings'

/**
 * Body of the `memberships.membershipShow` page — the framework's
 * `PageShell` (kind `show`) provides the `ShowBase`, the heading bar (title
 * from the record, Edit, Back far right) and the app-bar title.
 */
const MembershipShow = () => (
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
)

export default MembershipShow
