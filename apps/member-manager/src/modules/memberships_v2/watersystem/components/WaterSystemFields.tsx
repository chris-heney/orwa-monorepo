import React from "react";
import { Box, Button, Card, Divider, Grid, Typography } from "@mui/material";
import {
  AutocompleteArrayInput,
  BooleanInput,
  DateInput,
  NumberInput,
  ReferenceArrayInput,
  SelectInput,
  TextInput,
  useRecordContext,
} from "react-admin";
import {
  WatersystemMemberTypeChoices,
  StateChoices,
  countyOptions,
  paymentOptions,
  regionOptions,
  reportType,
  systemTypeOptions,
} from "../../../../helpers/Data";
import CustomPhoneInput from "../../../_components/MaskedPhoneInput";
import MembershipExpiration from "../../../_components/MembershipExpiration";
import { useMembershipContext } from "../../../memberships_v2/MembershipsContextProvider";

const WaterSystemFields = () => {
  const record = useRecordContext();

  const {
    setIsContactModalOpen,
    setContactCreateDefaultValues,
    setLinkNewContactToWatersystemId,
  } = useMembershipContext();

  const [lastPayment, setLastPayment] = React.useState(
    record ? record.payment_last_date : null
  );
  const [previousPayment, setPreviousPayment] = React.useState(
    record ? record.payment_previous_date : null
  );

  return (
    <Grid
      container
      spacing={0}
      gap={0}
      alignItems={"stretch"}
      justifyItems={"stretch"}
      alignSelf={"stretch"}
    >
      <Grid
        item
        xs={12}
        md={6}
        lg={6}
        sm={12}
        alignItems={"stretch"}
        justifyItems={"stretch"}
        alignSelf={"stretch"}
      >
        {/* Status */}
        <Card sx={{ p: 2, my: 2, mx: 1 }}>
          <Typography variant="h5">Status</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container columnSpacing={2} rowSpacing={1}>
            {/* <Grid item xs={6} sm={6} md={6} lg={4}>
              <BooleanInput source="active" label="Active" helperText={false} fullWidth />
            </Grid> */}
            <Grid item xs={6} sm={6} md={6} lg={4}>
              <BooleanInput
                source="funding"
                label="Funding"
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={4}>
              <BooleanInput
                source="orwaag"
                label="ORWAAG"
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={4}>
              <BooleanInput
                source="workmans_comp"
                label="Workers Comp"
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={4}>
              <BooleanInput
                source="soonerwarn"
                label="Soonerwarn"
                helperText={false}
                fullWidth
              />
            </Grid>
          </Grid>
        </Card>
        {/* General Information */}
        <Card sx={{ p: 2, my: 2, mx: 1 }}>
          <Typography variant="h5">General Information</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container columnSpacing={2} rowSpacing={1}>
            <Grid item xs={12} lg={12}>
              <TextInput
                source="name"
                label="Name"
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <TextInput
                source="legal_entity_name"
                label="Legal Entity Name"
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <SelectInput
                source="region"
                label="Region"
                choices={regionOptions}
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <SelectInput
                source="county"
                label="County"
                choices={countyOptions}
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <TextInput
                source="office_hours"
                label="Office Hours"
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <TextInput
                source="board_meeting"
                label="Board Meeting"
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <NumberInput
                source="meters"
                label="Meters"
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <NumberInput
                source="total_years"
                label="Total Years"
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <SelectInput
                source="member_type"
                label="Member Type"
                choices={WatersystemMemberTypeChoices}
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <SelectInput
                source="system_type_dirty"
                label="System Type"
                choices={systemTypeOptions}
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <DateInput
                source="directory_sent_date"
                label="Directory Sent Date"
                helperText={false}
                fullWidth
              />
            </Grid>
          </Grid>
        </Card>
        {/* Cntact Information */}
        <Card sx={{ p: 2, my: 2, mx: 1 }}>
          <Box
            sx={{
              paddingBottom: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">Contact Information</Typography>
            <Button
              onClick={() => {
                setLinkNewContactToWatersystemId(null);
                setContactCreateDefaultValues({ contact_type: "watersystem" });
                setIsContactModalOpen(true);
              }}
            >
              Add Contact
            </Button>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Grid container columnSpacing={2} rowSpacing={1}>
            <Grid item xs={12} lg={6}>
              <TextInput
                source="email"
                label="Office Email"
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <CustomPhoneInput
                source="phone"
                label="Phone"
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <ReferenceArrayInput
                source="contacts"
                label="Contacts"
                reference="contacts"
                perPage={1000}
                helperText={false}
                fullWidth
              >
                <AutocompleteArrayInput
                  optionText={(rec) => {
                    const r = rec as {
                      first?: string;
                      last?: string;
                      email?: string;
                      title?: string;
                      id?: number;
                    };
                    const name = [r.first, r.last].filter(Boolean).join(" ");
                    const bits = [name || null, r.title || null, r.email || null].filter(
                      Boolean
                    );
                    return bits.length > 0 ? bits.join(" — ") : `#${r.id ?? ""}`;
                  }}
                  helperText={false}
                />
              </ReferenceArrayInput>
            </Grid>
            <Grid item xs={12} lg={12}>
              <TextInput
                source="fax"
                label="Fax"
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={12}>
              <TextInput
                source="url"
                label="URL"
                helperText={false}
                fullWidth
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sm={12}
        alignItems={"stretch"}
        justifyItems={"stretch"}
        alignSelf={"stretch"}
      >
        {/* Billing Information */}
        <Card sx={{ p: 2, my: 2, mx: 1 }}>
          <Typography variant="h5">Billing Information</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container columnSpacing={2} rowSpacing={1}>
            <Grid item xs={12} lg={4}>
              <DateInput
                source="payment_last_date"
                label="Current Payment Date"
                helperText={false}
                onChange={(e) => setLastPayment(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <DateInput
                source="application_date"
                label="Application Date"
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <DateInput
                source="payment_previous_date"
                onChange={(e) => setPreviousPayment(e.target.value)}
                label="Previous Payment Date"
                helperText={false}
                fullWidth
              />
            </Grid>
            {record && (
              <Grid item xs={12}>
                <MembershipExpiration
                  lastPayment={lastPayment}
                  previousPayment={previousPayment}
                  format="MM/DD/YYYY"
                />
              </Grid>
            )}
            <Grid item xs={12} lg={6}>
              <NumberInput
                source="payment_amount"
                label="Payment Amount"
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <SelectInput
                source="payment_method"
                label="Payment Method"
                choices={paymentOptions}
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <SelectInput
                source="membership_directory_type"
                label="Membership Directory Type"
                choices={reportType}
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                source="payment_details"
                label="Payment Details"
                helperText={false}
                fullWidth
                multiline
                rows={9}
              />
            </Grid>
          </Grid>
        </Card>

        {/* Physical Address */}
        <Card sx={{ p: 2, my: 2, mx: 1 }}>
          <Typography variant="h5">Physical Address</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container columnSpacing={2} rowSpacing={1}>
            <Grid item xs={12} lg={6}>
              <TextInput
                source="address_physical_line1"
                label="Physical Address Line 1"
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextInput
                source="address_physical_line2"
                label="Physical Address Line 2"
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextInput
                source="address_physical_city"
                label="Physical Address City"
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <SelectInput
                source="address_physical_state"
                label="Pysical Address State"
                choices={StateChoices}
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <TextInput
                source="address_physical_zip"
                label="Physical Address Zip"
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <TextInput
                source="latitude"
                label="Latitude"
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={4}>
              <TextInput
                source="longitude"
                label="Longitude"
                helperText={false}
                fullWidth
              />
            </Grid>
          </Grid>
        </Card>
        {/* Mailing Address */}
        <Card sx={{ p: 2, my: 2, mx: 1 }}>
          <Typography variant="h5">Mailing Address</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container columnSpacing={2} rowSpacing={1}>
            <Grid item xs={12} lg={6}>
              <TextInput
                source="address_mailing_pobox"
                label="PO Box"
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextInput
                source="address_mailing_city"
                label="City"
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <SelectInput
                source="address_mailing_state"
                label="State"
                choices={StateChoices}
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextInput
                source="address_mailing_zip"
                label="Zip"
                helperText={false}
                fullWidth
              />
            </Grid>
          </Grid>
        </Card>

        {/* Passport Details */}

        <Card sx={{ p: 2, my: 2, mx: 1 }}>
          <Typography variant="h5">Passport</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container columnSpacing={2} rowSpacing={1}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <NumberInput
                source="wp_uid"
                label="WP UID"
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <NumberInput
                source="wp_eid"
                label="WP EID"
                helperText={false}
                fullWidth
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default WaterSystemFields;
