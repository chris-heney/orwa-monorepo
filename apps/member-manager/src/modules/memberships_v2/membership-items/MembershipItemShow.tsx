import React from 'react'
import {
  ChipField,
  NumberField,
  ReferenceArrayField,
  SimpleShowLayout,
  SingleFieldList,
  TextField,
} from 'react-admin'
import { CurrencyOptions } from '../../../config/Settings'

/**
 * Body of the `memberships.membershipItemShow` page — the framework's
 * `PageShell` (kind `show`) provides the `ShowBase`, the heading bar (title
 * from the record, Edit, Back far right) and the app-bar title.
 */
const MembershipItemShow = () => (
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
)

export default MembershipItemShow
