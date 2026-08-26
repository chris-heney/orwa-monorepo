import React, { useState } from 'react';
import {
  TextField,
  BooleanField,
  useStore,
  SimpleList,
  NumberField,
  DateField,
  RaRecord,
  List,
  FunctionField,
  Loading,
} from 'react-admin';
import { DatagridConfigurable } from "@orwa/entity-id";
import { Box, Button, useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { CurrencyOptions } from '../../../config/Settings';
import getExpirationDate, {
  isMembershipActiveByExpiration,
} from '../../_helpers/getExpirationDate';
import getExpiryBackground from '../../_helpers/getExpiryBackground';
import coloredSurfaceSx from '../../_helpers/coloredSurfaceSx';
import WaterSystemBulkUpdateButton from './components/WaterSystemBulkUpdate';
import { useMembershipContext } from '../../memberships_v2/MembershipsContextProvider';
import { customDatagridStyle } from '../../../css';
import CustomPagination from '../../_components/CustomPagination';
import { useCan } from '../../rbac-manager/useCan';
import { getDirectoryContactField } from './directoryContacts';

const WaterSystemList = () => {
  const [filterListOpen, setFilterListOpen] = useState(false);
  const { watersystemFilters, isLoading } = useMembershipContext();
  const selectedIds = useStore('watersystems.selectedIds')[0] ?? [];
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down('sm'));

  const { can } = useCan();

  return isLoading ? (
    <Loading />
  ) : (
    <List
      component={'div'}
      resource="watersystems"
      filter={watersystemFilters ?? null}
      title={' '}
      actions={false}
      perPage={100}
      sx={{
        mt: selectedIds.length > 0 ? 6 : 0,
      }}
      disableSyncWithLocation
      pagination={<CustomPagination />}
      queryOptions={{
        meta: { raw: true, populate: ['contacts'] },
      }}
    >
      {isSmall && (
        <Button onClick={() => setFilterListOpen(!filterListOpen)}>
          {filterListOpen ? 'Hide Filters' : 'Add Filters'}
        </Button>
      )}
      {isSmall ? (
        <Box style={{ whiteSpace: 'nowrap' }}>
          <SimpleList
            linkType={can('update', 'watersystem') ? 'edit' : 'show'}
            primaryText={(record) => record.name}
            secondaryText={(record) =>
              `${record.region === null ? 'No Region' : record.region} | ${
                isMembershipActiveByExpiration(
                  record.payment_previous_date,
                  record.payment_last_date
                )
                  ? 'Active'
                  : 'Inactive'
              }`
            }
            tertiaryText={(record) => record.county}
          />
        </Box>
      ) : (
        <DatagridConfigurable
          sx={customDatagridStyle}
          rowClick={can('update', 'watersystem') ? 'edit' : 'show'}
          bulkActionButtons={
            can('update', 'watersystem') ? (
              <WaterSystemBulkUpdateButton />
            ) : (
              false
            )
          }
        >
          <FunctionField
            label="Member"
            sortBy="payment_last_date"
            sx={{ textWrap: 'nowrap' }}
            render={(record: RaRecord) => {
              const expirationDate = getExpirationDate(
                record.payment_previous_date,
                record.payment_last_date
              );
              const backgroundColor = getExpiryBackground(expirationDate);
              const active = isMembershipActiveByExpiration(
                record.payment_previous_date,
                record.payment_last_date
              );

              return (
                <Box
                  sx={coloredSurfaceSx(active ? backgroundColor : '#ff5555', {
                    textAlign: 'center',
                    fontWeight: 600,
                    px: 1,
                  })}
                >
                  {active ? 'Active' : 'Inactive'}
                </Box>
              );
            }}
          />
          <NumberField source="total_years" label="Total Years" noWrap />
          <TextField source="county" label="County" noWrap />
          <TextField source="name" label="Name" noWrap />
          <TextField source="member_type" label="Member Type" noWrap />
          <FunctionField
            source="payment_last_date"
            label="Renewal"
            render={(record: RaRecord) => {
              const expirationDate = getExpirationDate(
                record.payment_previous_date,
                record.payment_last_date
              );
              const backgroundColor = 'transparent'; // Set background color to orange if date is invalid (N/A)
              const displayDate = expirationDate.isValid()
                ? expirationDate.format('MM/DD/YY')
                : 'N/A';

              return (
                <Box
                  sx={{
                    backgroundColor,
                    textAlign: 'center',
                    px: 1,
                  }}
                >
                  {displayDate}
                </Box>
              );
            }}
          />
          <FunctionField
            label="Expiration Sent"
            render={(record: RaRecord) => {
              if (!record.expiration_notification_sent) return 'N/A';

              const date = new Date(record.expiration_notification_sent);
              return date.toLocaleString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
              });
            }}
            noWrap
          />
          <TextField source="region" label="Region" noWrap />
          <TextField
            source="address_mailing_pobox"
            label="Address (PO Box)"
            noWrap
          />
          <TextField
            source="address_physical_line2"
            label="Address Line 2 (Physical)"
            noWrap
          />
          <TextField
            source="address_mailing_city"
            label="City (PO Box)"
            noWrap
          />
          <TextField
            source="address_mailing_state"
            label="State (PO Box)"
            noWrap
          />
          <TextField source="address_mailing_zip" label="Zip (PO Box)" noWrap />
          <TextField
            source="address_physical_line1"
            label="Address (Physical)"
            noWrap
          />
          <TextField
            source="address_physical_city"
            label="City (Physical)"
            noWrap
          />
          <TextField
            source="address_physical_state"
            label="State (Physical)"
            noWrap
          />
          <TextField
            source="address_physical_zip"
            label="Zip (Physical)"
            noWrap
          />
          <TextField source="email" label="Office Email" noWrap />
          <TextField source="phone" label="Phone" noWrap />
          <TextField source="office_hours" label="Office Hours" noWrap />
          <NumberField source="meters" label="Meters" />
          <TextField source="fax" label="Fax" noWrap />
          <TextField source="board_meeting" label="Board Meeting" noWrap />
          <BooleanField source="funding" label="Funding" />
          <TextField source="system_type_dirty" label="System Type" noWrap />
          <BooleanField source="orwaag" label="ORWAAG" />
          <BooleanField source="workmans_comp" label="Workmans Comp" />
          <BooleanField source="soonerwarn" label="Soonerwarn" />
          <BooleanField source="directory_mailed" label="Mailed" />
          <DateField source="directory_sent_date" label="Sent Date" noWrap />
          <TextField
            source="membership_directory_type"
            label="Directory Type"
            noWrap
          />
          <TextField source="payment_method" label="Payment Method" noWrap />
          <DateField
            source="payment_previous_date"
            label="Previous Payment"
            noWrap
          />
          <DateField source="payment_last_date" label="Latest Payment" noWrap />
          <DateField
            source="application_date"
            label="Application Date"
            noWrap
          />
          <NumberField
            options={CurrencyOptions}
            source="payment_amount"
            label="Payment Amount"
            noWrap
          />
          <NumberField
            options={CurrencyOptions}
            source="fee_membership"
            label="Base Membership Fee"
            noWrap
          />
          <NumberField
            options={CurrencyOptions}
            source="fee_connections"
            label="Per Connections Fee"
            noWrap
          />
          <NumberField
            options={CurrencyOptions}
            source="fee_scholarship"
            label="Scholarship Donation"
            noWrap
          />
          <NumberField
            options={CurrencyOptions}
            source="fee_apprenticeship"
            label="Apprenticeship Donation"
            noWrap
          />
          <TextField source="payment_details" label="Payment Details" noWrap />
          <NumberField source="wp_uid" label="WP-UID" noWrap />
          <NumberField source="wp_eid" label="WP-EID" noWrap />
          <TextField source="payment_details" label="Payment Details" noWrap />
          <TextField source="legal_entity_name" label="Entity Name" noWrap />
          <DateField source="directory_sent_date" label="Sent Date" noWrap />
          <TextField source="url" label="URL" />
          {[1, 2, 3].flatMap((n) => [
            <FunctionField
              key={`dir-${n}-first`}
              source={`dir_contact_${n}_first`}
              label={`Contact ${n}: First Name`}
              render={(record: RaRecord) =>
                getDirectoryContactField(record, n, 'first')
              }
              noWrap
            />,
            <FunctionField
              key={`dir-${n}-last`}
              source={`dir_contact_${n}_last`}
              label={`Contact ${n}: Last Name`}
              render={(record: RaRecord) =>
                getDirectoryContactField(record, n, 'last')
              }
              noWrap
            />,
            <FunctionField
              key={`dir-${n}-title`}
              source={`dir_contact_${n}_title`}
              label={`Contact ${n}: Title`}
              render={(record: RaRecord) =>
                getDirectoryContactField(record, n, 'title')
              }
              noWrap
            />,
            <FunctionField
              key={`dir-${n}-email`}
              source={`dir_contact_${n}_email`}
              label={`Contact ${n}: Email`}
              render={(record: RaRecord) =>
                getDirectoryContactField(record, n, 'email')
              }
              noWrap
            />,
            <FunctionField
              key={`dir-${n}-phone`}
              source={`dir_contact_${n}_phone`}
              label={`Contact ${n}: Phone`}
              render={(record: RaRecord) =>
                getDirectoryContactField(record, n, 'phone')
              }
              noWrap
            />,
            <FunctionField
              key={`dir-${n}-mail-line1`}
              source={`dir_contact_${n}_mail_line1`}
              label={`Contact ${n}: Mailing line 1`}
              render={(record: RaRecord) =>
                getDirectoryContactField(record, n, 'address_mailing_line1')
              }
              noWrap
            />,
            <FunctionField
              key={`dir-${n}-mail-line2`}
              source={`dir_contact_${n}_mail_line2`}
              label={`Contact ${n}: Mailing line 2`}
              render={(record: RaRecord) =>
                getDirectoryContactField(record, n, 'address_mailing_line2')
              }
              noWrap
            />,
            <FunctionField
              key={`dir-${n}-city`}
              source={`dir_contact_${n}_mail_city`}
              label={`Contact ${n}: Mail city`}
              render={(record: RaRecord) =>
                getDirectoryContactField(record, n, 'address_mailing_city')
              }
              noWrap
            />,
            <FunctionField
              key={`dir-${n}-mail-state`}
              source={`dir_contact_${n}_mail_state`}
              label={`Contact ${n}: Mail state`}
              render={(record: RaRecord) =>
                getDirectoryContactField(record, n, 'address_mailing_state')
              }
              noWrap
            />,
            <FunctionField
              key={`dir-${n}-mail-zip`}
              source={`dir_contact_${n}_mail_zip`}
              label={`Contact ${n}: Mail ZIP`}
              render={(record: RaRecord) =>
                getDirectoryContactField(record, n, 'address_mailing_zip')
              }
              noWrap
            />,
          ])}
        </DatagridConfigurable>
      )}
    </List>
  );
};

export default WaterSystemList;
