import React from 'react';
import {
  TextField,
  SimpleList,
  NumberField,
  ReferenceArrayField,
  SingleFieldList,
  ListView,
  ChipField,
} from 'react-admin';
import { DatagridConfigurable } from "@orwa/entity-id";
import { Box, useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { CurrencyOptions } from '../../../config/Settings';
import { customDatagridStyle } from '../../../css';
import CustomPagination from '../../_components/CustomPagination';
import { useCan } from '../../rbac-manager/useCan';

/** Memberships tab panel — renders INSIDE the tab's `ListScope` (shared `ListBase`). */
const MembershipList = () => {
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
            linkType={can('update', 'membership') ? 'edit' : 'show'}
            primaryText={(record) => record.name}
            secondaryText={(record) => record.price}
          />
        </Box>
      ) : (
        <DatagridConfigurable
          sx={customDatagridStyle}
          rowClick={can('update', 'membership') ? 'edit' : 'show'}
          bulkActionButtons={false}
        >
          <TextField source="name" label="Name" noWrap />
          <NumberField source="price" label="Price" options={CurrencyOptions} />
          <TextField source="description" label="Description" />
          <ReferenceArrayField
            source="membership_items"
            label="Items"
            reference="membership-items"
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

export default MembershipList;
