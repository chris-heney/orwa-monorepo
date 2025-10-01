import React, { useState } from "react";
import {
  TextField,
  DatagridConfigurable,
  BooleanField,
  useStore,
  SimpleList,
  NumberField,
  DateField,
  RaRecord,
  List,
  FunctionField,
  Loading,
} from "react-admin";
import { Box, Button, useMediaQuery } from "@mui/material";
import { Theme } from "@mui/material/styles";
import { CurrencyOptions } from "../../../config/Settings";
import getExpirationDate from "../../_helpers/getExpirationDate";
import getExpiryBackground from "../../_helpers/getExpiryBackground";
import WaterSystemBulkUpdateButton from "./components/WaterSystemBulkUpdate";
import { useMembershipContext } from "../../memberships_v2/MembershipsContextProvider";
import { customDatagridStyle } from "../../../css";
import CustomPagination from "../../_components/CustomPagination";
import { oneYearAgoFormatted } from "../../memberships_v2/helpers/activeOrInactiveMembership";
import useCurrentUser from "../../_helpers/useCurrentUser";


const WaterSystemList = () => {
  const [filterListOpen, setFilterListOpen] = useState(false);
  const { watersystemFilters, isLoading } = useMembershipContext();
  const selectedIds = useStore("watersystems.selectedIds")[0] ?? [];
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  const { role } = useCurrentUser();

  return isLoading ? (
    <Loading />
  ) : (
    <List
      component={"div"}
      resource="watersystems"
      filter={watersystemFilters ?? null}
      title={" "}
      actions={false}
      perPage={100}
      sx={{
        mt: selectedIds.length > 0 ? 6 : 0,
        '& .RaList-noActions': {
          mt: '0',
        },
      }}
      disableSyncWithLocation
      pagination={<CustomPagination />}
    >
      {isSmall && (
        <Button onClick={() => setFilterListOpen(!filterListOpen)}>
          {filterListOpen ? "Hide Filters" : "Add Filters"}
        </Button>
      )}
      {isSmall ? (
        <Box style={{ whiteSpace: "nowrap" }}>
          <SimpleList
            linkType="edit"
            primaryText={(record) => record.name}
            secondaryText={(record) =>
              `${record.region === null ? "No Region" : record.region} | ${
                record.active ? "Active" : "Inactive"
              }`
            }
            tertiaryText={(record) => record.county}
          />
        </Box>
      ) : (
        <DatagridConfigurable
          sx={customDatagridStyle}
          rowClick={role === "Admin" ? "edit" : "show"}
          bulkActionButtons={role === "Admin" ?  <WaterSystemBulkUpdateButton /> : false}
        >
          <FunctionField
            label="Member"
            sortBy="payment_last_date"
            sx={{ textWrap: "nowrap" }}
            render={(record: RaRecord) => {
              const expirationDate = getExpirationDate(
                record.payment_previous_date,
                record.payment_last_date
              );
              const backgroundColor = getExpiryBackground(expirationDate);
              const active = getExpirationDate(
                record.payment_previous_date,
                record.payment_last_date
              ).isAfter(new Date());
              return (
                <Box
                  sx={{
                    backgroundColor: active ? backgroundColor : "#ff5555",
                    textAlign: "center",
                    fontWeight: 600,
                    px: 1,
                  }}
                >
                  {record.payment_last_date > oneYearAgoFormatted
                    ? "Active"
                    : "Inactive"}
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
          <FunctionField
            label="Expiration Sent"
            render={(record: RaRecord) => {
              if (!record.expiration_notification_sent) return "N/A";

              const date = new Date(record.expiration_notification_sent);
              return date.toLocaleString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
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
        </DatagridConfigurable>
      )}
    </List>
  );
};

export default WaterSystemList;
