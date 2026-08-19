import React from "react";
import {
  ArrayInput,
  DateInput,
  NumberInput,
  SelectInput,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
  required,
  useRecordContext,
} from "react-admin";
import { Box, Grid, Typography } from "@mui/material";
import {
  dateInputProps,
  emailFieldSx,
  fullFieldSx,
  ReviewPageBar,
  ReviewSectionCard,
  ReviewToolbar,
  reviewFormSx,
} from "../../_components/review-packet";
import MediaLink from "../../orwef-scholarships/components/MediaLink";
import {
  AWARD_TYPE_CHOICES,
  BIOGRAPHY_METHOD_CHOICES,
  BOARD_LIST_METHOD_CHOICES,
  contactSummary,
  watersystemName,
} from "../helpers/recordDisplay";
import { AWARD_STATUSES } from "../helpers/listFilters";

const AWARD_BACK = "/orwa-awards/dashboard";

const AwardForm = () => {
  const record = useRecordContext<Record<string, unknown>>();

  return (
    <SimpleForm
      sx={reviewFormSx}
      toolbar={<ReviewToolbar redirect={AWARD_BACK} />}
    >
      <ReviewPageBar title="Review Award Nomination" backTo={AWARD_BACK} />
      <Box sx={{ width: 1, px: { xs: 1, sm: 2 }, pb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ReviewSectionCard title="Status / Review">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <SelectInput
                    source="nomination_status"
                    label="Status"
                    choices={AWARD_STATUSES}
                    validate={required()}
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <NumberInput
                    source="award_year"
                    label="Award Year"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <SelectInput
                    source="award_type"
                    label="Please select the type of award"
                    choices={AWARD_TYPE_CHOICES}
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <DateInput
                    source="submission_date"
                    label="Submitted"
                    fullWidth
                    sx={fullFieldSx}
                    {...dateInputProps}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    source="review_notes"
                    label="Review notes"
                    multiline
                    minRows={3}
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
              </Grid>
            </ReviewSectionCard>
          </Grid>

          <Grid item xs={12}>
            <ReviewSectionCard title="Nominator Information">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="nominator_first_name"
                    label="First"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="nominator_last_name"
                    label="Last"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="nominator_email"
                    label="Nominator's Email"
                    type="email"
                    fullWidth
                    sx={emailFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="nominator_phone"
                    label="Nominator's Phone"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    source="nominator_address"
                    label="Street Address"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    source="nominator_address_2"
                    label="Address Line 2"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput
                    source="nominator_city"
                    label="City"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput
                    source="nominator_state"
                    label="State / Province / Region"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput
                    source="nominator_zip"
                    label="ZIP / Postal Code"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="nominator_country"
                    label="Country"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
              </Grid>
            </ReviewSectionCard>
          </Grid>

          <Grid item xs={12}>
            <ReviewSectionCard title="Nominee Information">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="nominee_name"
                    label="Nominee Full Name"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    sx={emailFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="daytime_phone"
                    label="Daytime Phone"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="county"
                    label="County"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    source="address"
                    label="Street Address"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput source="city" label="City" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput source="state" label="State" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput source="zip" label="ZIP Code" fullWidth sx={fullFieldSx} />
                </Grid>
                {contactSummary(record || {}) ? (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Linked contact: {contactSummary(record || {})}
                    </Typography>
                  </Grid>
                ) : null}
              </Grid>
            </ReviewSectionCard>
          </Grid>

          <Grid item xs={12}>
            <ReviewSectionCard title="System Information">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="system_name"
                    label="System Name (if not in list)"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ pt: 1 }}>
                    System Name: {watersystemName(record || {}) || "—"}
                  </Typography>
                </Grid>
                <Grid item xs={12} md={6}>
                  <DateInput
                    source="operation_start_date"
                    label="Date System Began Operation"
                    fullWidth
                    sx={fullFieldSx}
                    {...dateInputProps}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DateInput
                    source="employment_date"
                    label="Date Employed"
                    fullWidth
                    sx={fullFieldSx}
                    {...dateInputProps}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <NumberInput
                    source="beginning_members"
                    label="Number of Beginning Meter Connections"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <NumberInput
                    source="current_members"
                    label="Number of Current Meter Connections"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
              </Grid>
            </ReviewSectionCard>
          </Grid>

          <Grid item xs={12}>
            <ReviewSectionCard title="Employee Information">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <NumberInput
                    source="clerical_employees"
                    label="Clerical Employees"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <NumberInput
                    source="operation_maintenance_employees"
                    label="Operation & Maintenance Employees"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <NumberInput
                    source="management_employees"
                    label="Management Employees"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
              </Grid>
            </ReviewSectionCard>
          </Grid>

          <Grid item xs={12}>
            <ReviewSectionCard title="Nomination Description">
              <TextInput
                source="nomination_description"
                label="What makes the nominee deserving of this award?"
                multiline
                minRows={6}
                fullWidth
                sx={fullFieldSx}
              />
            </ReviewSectionCard>
          </Grid>

          <Grid item xs={12}>
            <ReviewSectionCard title="Biography">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <SelectInput
                    source="biography_method"
                    label="How would you like to provide your biography?"
                    choices={BIOGRAPHY_METHOD_CHOICES}
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    source="biography_text"
                    label="Biography"
                    multiline
                    minRows={6}
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <MediaLink file={record?.biography_file} label="Biography" />
                </Grid>
              </Grid>
            </ReviewSectionCard>
          </Grid>

          <Grid item xs={12}>
            <ReviewSectionCard title="Board Members & Employees">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <SelectInput
                    source="board_list_method"
                    label="Provide Board Members & Employee List via"
                    choices={BOARD_LIST_METHOD_CHOICES}
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <MediaLink
                    file={record?.board_list_file}
                    label="Upload Board Member & Employee List"
                  />
                </Grid>
                <Grid item xs={12}>
                  <ArrayInput source="board_members" label="Board Members & Employees">
                    <SimpleFormIterator inline>
                      <TextInput source="first" label="First Name" />
                      <TextInput source="last" label="Last Name" />
                      <TextInput source="title" label="Title / Position" />
                    </SimpleFormIterator>
                  </ArrayInput>
                </Grid>
              </Grid>
            </ReviewSectionCard>
          </Grid>

          <Grid item xs={12}>
            <ReviewSectionCard title="Photographs & Documents">
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <MediaLink file={record?.photographs} label="Photographs" />
                <MediaLink
                  file={record?.supporting_documents}
                  label="Supporting Documents"
                />
                <MediaLink
                  file={record?.nomination_pdf}
                  label="Nomination packet PDF"
                />
              </Box>
            </ReviewSectionCard>
          </Grid>
        </Grid>
      </Box>
    </SimpleForm>
  );
};

export default AwardForm;
