import React from "react";
import { Box, Button, Card, Divider, Grid, Typography } from "@mui/material";
import {
  AutocompleteArrayInput,
  AutocompleteInput,
  BooleanInput,
  DateInput,
  NumberInput,
  RaRecord,
  ReferenceArrayInput,
  ReferenceInput,
  SelectInput,
  TextInput,
  useRecordContext,
} from "react-admin";
import {
  AssociateMemberTypeChoices,
  StateChoices,
  associateTypeOptions,
  paymentOptions,
  reportType,
} from "../../../../helpers/Data";
import CustomPhoneInput from "../../../_components/MaskedPhoneInput";
import MembershipExpiration from "../../../_components/MembershipExpiration";
import { useMembershipContext } from "../../MembershipsContextProvider";
import { useFormContext } from "react-hook-form";
import FileUploadField from "../../../_components/FileUploadField";

const AssociateFields = () => {
  const record = useRecordContext();

  const { setIsContactModalOpen } = useMembershipContext();
  const { watch } = useFormContext();

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
            {/* <Grid item xs={6} sm={6} md={6} lg={6}>
              <BooleanInput source="active" label="Active" helperText={false} fullWidth />
            </Grid> */}
            <Grid item xs={6} sm={6} md={6} lg={6}>
              <BooleanInput
                source="directory_mailed"
                label="Directory Mailed"
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
            <Grid item xs={6} sm={6} md={6} lg={6}>
              <SelectInput
                source="member_level"
                label="Membership Level"
                helperText={false}
                choices={AssociateMemberTypeChoices}
                fullWidth
              />
              {/* refernece input for memberships */}
              <ReferenceInput
                source="membership"
                reference="memberships"
                label="Membership"
                fullWidth
                filter={{ context: "Associate" }}
              >
                <AutocompleteInput
                  optionText="name"
                  helperText={false}
                  fullWidth
                />
              </ReferenceInput>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6}>
              <NumberInput
                source="total_years"
                label="Total Years"
                fullWidth
                helperText={false}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <SelectInput
                choices={associateTypeOptions}
                source="category"
                label="Category"
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
            <Button onClick={() => setIsContactModalOpen(true)}>
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
            <Grid item xs={12} sm={12} md={12} lg={6}>
              <TextInput
                source="website"
                label="Website"
                helperText={false}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <ReferenceArrayInput
                source="contacts"
                reference="contacts"
                fullWidth
                perPage={10000}
              >
                <AutocompleteArrayInput
                  optionText={"email"}
                  helperText={false}
                ></AutocompleteArrayInput>
              </ReferenceArrayInput>
            </Grid>
            <Grid item xs={12} >
              <ReferenceInput
                source="contact_primary"
                reference="contacts"
                fullWidth
                perPage={10000}
              >
                <AutocompleteInput optionText={(record: RaRecord) => {
                  return record.first + " " + record.last + " - " + record.email
                }} helperText={false} />
              </ReferenceInput>
            </Grid>
            <Grid item xs={12} >
              <ReferenceInput
                source="contact_secondary"
                reference="contacts"
                fullWidth
                perPage={10000}
              >
                <AutocompleteInput optionText={(record: RaRecord) => {
                  return record.first + " " + record.last + " - " + record.email
                }} helperText={false} />
              </ReferenceInput>
            </Grid>
          </Grid>
        </Card>

        {/* Media */}

        <Card sx={{ p: 2, my: 2, mx: 1 }}>
          <Typography variant="h5">Media</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container columnSpacing={2} rowSpacing={1}>
              <FileUploadField multiple  source="logo" label="Logo" />
              <FileUploadField   source="primary_ad" label="Primary Ad" />
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
          <Typography variant="h5">Payment Information</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container columnSpacing={2}>
            <Grid item xs={12} lg={4}>
              <DateInput
                source="payment_last_date"
                label="Current Payment Date"
                helperText={false}
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
                label="Previous Payment Date"
                helperText={false}
                fullWidth
              />
            </Grid>

            {record && (
              <Grid item xs={12}>
                <MembershipExpiration
                  lastPayment={watch("payment_last_date")}
                  previousPayment={watch("payment_previous_date")}
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
          <Typography variant="h5">Primary Mailing Address</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container columnSpacing={2} rowSpacing={1}>
            <Grid item xs={12} lg={6}>
              <TextInput
                source="address_street"
                label="Street"
                fullWidth
                helperText={false}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextInput
                source="address_city"
                label="City"
                fullWidth
                helperText={false}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <SelectInput
                source="address_state"
                choices={StateChoices}
                label="State"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextInput source="address_zip" label="Zip" fullWidth />
            </Grid>
          </Grid>
        </Card>
        {/* Passport Details */}
        <Card sx={{ p: 2, my: 2, mx: 1 }}>
          <Typography variant="h5">Secondary Mailing Address</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container columnSpacing={2} rowSpacing={1}>
            <Grid item xs={12} lg={6}>
              <TextInput
                source="mailing_address_street"
                label="Street"
                fullWidth
                helperText={false}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextInput
                source="mailing_address_city"
                label="City"
                fullWidth
                helperText={false}
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <SelectInput
                source="mailing_address_state"
                choices={StateChoices}
                label="State"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} lg={6}>
              <TextInput source="mailing_address_zip" label="Zip" fullWidth />
            </Grid>
          </Grid>
        </Card>

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

export default AssociateFields;
