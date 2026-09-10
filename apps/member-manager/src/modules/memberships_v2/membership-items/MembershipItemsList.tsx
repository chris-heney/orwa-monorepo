import React from 'react';
import {
  TextField,
  SimpleList,
  NumberField,
  ListView,
  ReferenceArrayField,
  SingleFieldList,
  ChipField,
} from 'react-admin';
import { DatagridConfigurable } from "@orwa/entity-id";
import { Box, useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { CurrencyOptions } from '../../../config/Settings';
import { customDatagridStyle } from '../../../css';
import CustomPagination from '../../_components/CustomPagination';
import { useCan } from '../../rbac-manager/useCan';

/** Membership Items tab panel — renders INSIDE the tab's `ListScope` (shared `ListBase`). */
const MembershipItemsList = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));
  const { can } = useCan();

  return (
    <ListView
      component={'div'}
      title={' '}
      actions={false}
      pagination={<CustomPagination />}
    >
      {isSmall ? (
        <Box style={{ whiteSpace: 'nowrap' }}>
          <SimpleList
            linkType={can('update', 'membership-item') ? 'edit' : 'show'}
            primaryText={(record) => record.name}
            secondaryText={(record) => record.price}
          />
        </Box>
      ) : (
        <DatagridConfigurable
          sx={customDatagridStyle}
          rowClick={can('update', 'membership-item') ? 'edit' : 'show'}
          bulkActionButtons={false}
        >
          <TextField source="name" label="Name" noWrap />
          <TextField source="description" label="Description" />
          <NumberField source="price" label="Price" options={CurrencyOptions} />
          <NumberField source="max_price" label="Max Price" />
          <NumberField source="max_purchasable" label="Max Purchasable" />
          <NumberField source="min_purchasable" label="Min Purchasable" />
          <ReferenceArrayField
            source="memberships"
            label="Included"
            reference="memberships"
          >
            <SingleFieldList linkType={false}>
              <ChipField source="name" />
            </SingleFieldList>
          </ReferenceArrayField>
        </DatagridConfigurable>
      )}
    </ListView>
  );
};

export default MembershipItemsList;
