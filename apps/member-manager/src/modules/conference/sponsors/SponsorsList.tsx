import React, { JSX } from 'react';
import { Box } from '@mui/material';
import {
  ChipField,
  DatagridConfigurable,
  DateField,
  FunctionField,
  NumberField,
  RaRecord,
  ReferenceArrayField,
  ReferenceField,
  SingleFieldList,
  TextField,
} from 'react-admin';
import { customDatagridStyle } from '../../../css';
import CustomPagination from '../../_components/CustomPagination';
import { useCan } from '../../rbac-manager/useCan';

const SponsorsList = () => {
  const { can } = useCan();

  return (
    <>
      <DatagridConfigurable
        sx={customDatagridStyle}
        bulkActionButtons={false}
        rowClick={can('update', 'conference-sponsor') ? 'edit' : false}
      >
        <FunctionField
          label="Organization"
          source="organization"
          sortBy="organization"
          render={(record) => {
            return record.registration != null && record.registration !== '' ? (
              <ReferenceField
                source="registration"
                reference="conference-registrations"
                label="Organization"
                link={false}
              >
                <TextField source="organization" label="Organization" noWrap />
              </ReferenceField>
            ) : (
              <TextField source="organization" />
            );
          }}
        />
        <ReferenceField
          source="registration"
          reference="conference-registrations"
          label="Date Registered"
          link={false}
          sortBy="registration.registration_date"
        >
          <DateField
            source="registration_date"
            label="Date Registered"
            noWrap
          />
        </ReferenceField>

        <TextField source="phone" label="Phone" noWrap />
        <TextField source="email" label="Email" noWrap />
        {/* sponsorships */}
        <FunctionField
          sx={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}
          label="Items"
          sortBy="items.label"
          render={(record: RaRecord) => {
            if (!record)
              return (
                <Box component="span" sx={{ color: 'text.secondary' }}>
                  No record data
                </Box>
              );

            const itemsToRender: JSX.Element[] = [];

            // Case 1: Render sponsorship_items if available
            if (
              record.sponsorship_items &&
              Array.isArray(record.sponsorship_items)
            ) {
              record.sponsorship_items.forEach(
                (
                  item: {
                    id: number;
                    key: string;
                    label: string;
                    value: number;
                  },
                  index: number
                ) => {
                  itemsToRender.push(
                    <ChipField
                      key={`item-${record.id}-${item.key}-${index}`}
                      record={item}
                      source="label"
                      label={item.label}
                    />
                  );
                }
              );
            }

            // Case 2: Render sponsorships if available
            if (record?.sponsorships && Array.isArray(record.sponsorships)) {
              itemsToRender.push(
                <ReferenceArrayField
                  key={`sponsorship-${record.id}`}
                  source="sponsorships"
                  reference="conference-sponsorships"
                >
                  <SingleFieldList linkType={false}>
                    <ChipField source="name" />
                  </SingleFieldList>
                </ReferenceArrayField>
              );
            }

            // If no items to render, display fallback message
            if (itemsToRender.length === 0) {
              return (
                <Box
                  component="span"
                  sx={{ color: 'text.secondary', fontStyle: 'italic' }}
                >
                  No items or sponsorships available
                </Box>
              );
            }

            // Render collected items
            return (
              <div style={{ display: 'flex', gap: '5px' }}>{itemsToRender}</div>
            );
          }}
        />

        <NumberField
          source="amount"
          label="Amount"
          options={{ style: 'currency', currency: 'USD' }}
        />
      </DatagridConfigurable>
      <CustomPagination />
    </>
  );
};

export default SponsorsList;
