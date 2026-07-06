import React, { useState } from "react";
import {
  TextField,
  DatagridConfigurable,
  BooleanField,
  useStore,
  SimpleList,
  NumberField,
  DateField,
  List,
  FunctionField,
  RaRecord,
  Loading,
  ReferenceField,
} from "react-admin";
import { CurrencyOptions } from "../../../config/Settings";
import { Box, Button, useMediaQuery } from "@mui/material";
import { Theme } from "@mui/material/styles";
import getExpirationDate, {
  isMembershipActiveByExpiration,
} from "../../_helpers/getExpirationDate";
import getExpiryBackground from "../../_helpers/getExpiryBackground";
import AssociateBulkUpdateButton from "./components/AssociateBulkUpdateButton";
import AssociateGrid from "./components/AssociateGrid";
import { useMembershipContext } from "../MembershipsContextProvider";
import { customDatagridStyle } from "../../../css";
import CustomPagination from "../../_components/CustomPagination";
import useCurrentUser from "../../_helpers/useCurrentUser";

const AssociateList = () => {
  const [filterListOpen, setFilterListOpen] = useState(false);
  const { associateFilters, isLoading, isGridView } = useMembershipContext();
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
  const selectedIds = useStore("associates.selectedIds")[0] ?? [];
  const { role } = useCurrentUser();

  return isLoading ? (
    <Loading />
  ) : (
    <List
      component={"div"}
      resource="associates"
      title={" "}
      filter={associateFilters}
      actions={false}
      sx={{
        mt: selectedIds.length > 0 ? 6 : 0,
      }}
      disableSyncWithLocation
      perPage={100}
      pagination={<CustomPagination />}
    >
      {isSmall && (
        <Button onClick={() => setFilterListOpen(!filterListOpen)}>
          {filterListOpen ? "Hide Filters" : "Add Filters"}
        </Button>
      )}
      {isSmall ? (
        <SimpleList
          linkType="show"
          primaryText={(record) => record.name}
          secondaryText={(record) =>
            `${
              isMembershipActiveByExpiration(
                record.payment_previous_date,
                record.payment_last_date
              )
                ? "Active"
                : "Not Active"
            } | ${record.email}`
          }
          tertiaryText={(record) => record.member_level}
        />
      ) : isGridView ? (
        <AssociateGrid />
      ) : (
        <DatagridConfigurable
          sx={customDatagridStyle}
          bulkActionButtons={
            role === "Admin" ? <AssociateBulkUpdateButton /> : false
          }
          rowClick={role === "Admin" ? "edit" : "show"}
        >
          <FunctionField
            label="Member"
            sx={{ textWrap: "nowrap" }}
            sortBy="payment_last_date"
            render={(record: RaRecord) => {
              const expirationDate = getExpirationDate(
                record.payment_previous_date,
                record.payment_last_date
              );
              const backgroundColor = expirationDate.isValid()
                ? getExpiryBackground(expirationDate)
                : "orange"; // Set background color to orange if date is invalid (N/A)
              const active = isMembershipActiveByExpiration(
                record.payment_previous_date,
                record.payment_last_date
              );
              return (
                <Box
                  sx={{
                    backgroundColor: active ? backgroundColor : "#ff5555",
                    textAlign: "center",
                    fontWeight: 600,
                    px: 1,
                  }}
                >
                  {active ? "Active" : "Not Active"}
                </Box>
              );
            }}
          />
          <BooleanField source="directory_mailed" label="Mailed" noWrap />
          <TextField source="name" label="Organization" noWrap />
          <FunctionField
            source="payment_last_date"
            label="Renewal"
            render={(record: RaRecord) => {
              const expirationDate = getExpirationDate(
                record.payment_previous_date,
                record.payment_last_date
              );
              const backgroundColor = "transparent"; // Set background color to orange if date is invalid (N/A)
              const displayDate = expirationDate.isValid()
                ? expirationDate.format("MM/DD/YY")
                : "N/A";

              return (
                <Box
                  sx={{
                    backgroundColor,
                    textAlign: "center",
                    px: 1,
                  }}
                >
                  {displayDate}
                </Box>
              );
            }}
          />
          {/* Display member_level or membership.name */}
          <FunctionField
            source="member_level"
            label="Level"
            render={(record: RaRecord) => {
              return typeof record.membership === "number" ? (
                <ReferenceField
                  source="membership"
                  reference="memberships"
                  label="Membership"
                  sortBy="membership.name"
                  link={(record) => {
                    return `/memberships/${record.id}/?redirect=/membership-management`;
                  }}
                >
                  <TextField source="name" label="Name" noWrap />
                </ReferenceField>
              ) : (
                record.member_level
              );
            }}
          />

          <TextField source="total_years" label="Total Years" />
          <TextField source="category" label="Category" noWrap />
          <TextField source="email" label="Office Email" noWrap />
          <TextField source="phone" label="Phone" noWrap />
          <TextField source="website" label="Website" noWrap />
          {/* First, Last, Email */}

          <ReferenceField
            source="contact_primary"
            reference="contacts"
            label="Primary Contact First"
            sortBy="contact_primary.first"
            link={(record) => {
              return `/contacts/${record.id}/?redirect=/membership-management`;
            }}
          >
            <TextField source="first" label="First" noWrap />
          </ReferenceField>
          <ReferenceField
            source="contact_primary"
            reference="contacts"
            label="Primary Contact Last"
            sortBy="contact_primary.last"
            link={(record) => {
              return `/contacts/${record.id}/?redirect=/membership-management`;
            }}
          >
            <TextField source="last" label="Last" noWrap />
          </ReferenceField>

          <ReferenceField
            source="contact_primary"
            reference="contacts"
            label="Primary Contact Email"
            sortBy="contact_primary.email"
            link={(record) => {
              return `/contacts/${record.id}/?redirect=/membership-management`;
            }}
          >
            <TextField source="email" label="Email" noWrap />
          </ReferenceField>

          <ReferenceField
            source="contact_secondary"
            reference="contacts"
            label="Secondary Contact First"
            sortBy="contact_secondary.first"
            link={(record) => {
              return `/contacts/${record.id}/?redirect=/membership-management`;
            }}
          >
            <TextField source="first" label="First" noWrap />
          </ReferenceField>
          <ReferenceField
            source="contact_secondary"
            reference="contacts"
            label="Secondary Contact Last"
            sortBy="contact_secondary.last"
            link={(record) => {
              return `/contacts/${record.id}/?redirect=/membership-management`;
            }}
          >
            <TextField source="last" label="Last" noWrap />
          </ReferenceField>
          <ReferenceField
            source="contact_secondary"
            reference="contacts"
            label="Secondary Contact Email"
            sortBy="contact_secondary.email"
            link={(record) => {
              return `/contacts/${record.id}?redirect=/membership-management`;
            }}
          >
            <TextField source="email" label="Email" noWrap />
          </ReferenceField>
          {/* Display primary and secondary mailing addresses in a function field */}
          {/* <FunctionField
            label="Primary Mailing Address"
            noWrap
            source="address_street"
            render={(record: RaRecord) => {
              return record.address_state ? (
                <Box>
                  <Box>{record.address_street}</Box>
                  <Box>
                    {record.address_city}, {record.address_state}{" "}
                    {record.address_zip}
                  </Box>
                </Box>
              ) : (
                <></>
              );
            }}
          /> */}
          <TextField
            source="address_street"
            label="Primary Address (Street)"
            noWrap
          />
          <TextField
            source="address_city"
            label="Primary Address (City)"
            noWrap
          />
          <TextField
            source="address_state"
            label="Primary Address (State)"
            noWrap
          />
          <TextField
            source="address_zip"
            label="Primary Address (Zip)"
            noWrap
          />
          <TextField
            source="mailing_address_street"
            label="Secondary Address (Street)"
            noWrap
          />
          <TextField
            source="mailing_address_city"
            label="Secondary Address (City)"
            noWrap
          />
          <TextField
            source="mailing_address_state"
            label="Secondary Address (State)"
            noWrap
          />
          <TextField
            source="mailing_address_zip"
            label="Secondary Address (Zip)"
            noWrap
          />
          <TextField
            source="membership_directory_type"
            label="Directory Type"
            noWrap
          />
          <DateField source="payment_last_date" label="Last Payment Date" />
          <TextField source="payment_method" label="Payment Method" />
          <TextField source="payment_details" label="Payment Details" noWrap />
          <DateField source="directory_sent_date" label="Sent Date" noWrap />
          <NumberField source="wp_uid" label="WP-UID" />
          <NumberField source="wp_eid" label="WP-EID" />
          <NumberField
            options={CurrencyOptions}
            source="payment_amount"
            label="Last Payment Amount"
          />
          <NumberField
            options={CurrencyOptions}
            source="fee_membership"
            label="Membership Fee"
          />
          <NumberField
            options={CurrencyOptions}
            source="fee_apprenticeship"
            label="Apprenticeship Fee"
          />
          <NumberField
            options={CurrencyOptions}
            source="fee_scholarship"
            label="Scholarship"
          />
        </DatagridConfigurable>
      )}
    </List>
  );
};

export default AssociateList;
