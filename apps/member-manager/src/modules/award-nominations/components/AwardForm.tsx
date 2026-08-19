import React from "react";
import {
  DateInput,
  NumberInput,
  SelectInput,
  SimpleForm,
  TextInput,
  required,
  useRecordContext,
} from "react-admin";
import { Box, Grid } from "@mui/material";
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

const AWARD_BACK = "/orwa-awards/dashboard";

const statuses = [
  { id: "Draft", name: "Draft" },
  { id: "Submitted", name: "Submitted" },
  { id: "Under Review", name: "Under Review" },
  { id: "Winner", name: "Winner" },
  { id: "Runner Up", name: "Runner Up" },
  { id: "Not Selected", name: "Not Selected" },
];

const awardTypes = [
  { id: "System of the Year", name: "System of the Year" },
  {
    id: "Water/Wastewater System of the Year",
    name: "System of the Year (legacy)",
  },
  { id: "Excellence in Operations", name: "Excellence in Operations" },
  { id: "Excellence in Management", name: "Excellence in Management" },
  { id: "Excellence in Office Operations", name: "Excellence in Office Operations" },
];

const AwardForm = () => {
  const record = useRecordContext<Record<string, unknown>>();

  return (
    <SimpleForm sx={reviewFormSx} toolbar={<ReviewToolbar redirect={AWARD_BACK} />}>
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
                    choices={statuses}
                    validate={required()}
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <NumberInput source="award_year" label="Award year" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <SelectInput
                    source="award_type"
                    label="Award type"
                    choices={awardTypes}
                    fullWidth
                    sx={fullFieldSx}
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
            <ReviewSectionCard title="Nominator">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="nominator_first_name"
                    label="First name"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="nominator_last_name"
                    label="Last name"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="nominator_email"
                    label="Email"
                    type="email"
                    fullWidth
                    sx={emailFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="nominator_phone"
                    label="Phone"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    source="nominator_address"
                    label="Street address"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    source="nominator_address_2"
                    label="Address line 2"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput source="nominator_city" label="City" fullWidth sx={fullFieldSx} />
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
                  <TextInput source="nominator_zip" label="ZIP" fullWidth sx={fullFieldSx} />
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
            <ReviewSectionCard title="Nominee">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextInput source="nominee_name" label="Nominee name" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="email"
                    label="Email"
                    type="email"
                    fullWidth
                    sx={emailFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput source="daytime_phone" label="Daytime phone" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput source="county" label="County" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12}>
                  <TextInput source="address" label="Street address" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput source="city" label="City" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput source="state" label="State" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput source="zip" label="ZIP" fullWidth sx={fullFieldSx} />
                </Grid>
              </Grid>
            </ReviewSectionCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <ReviewSectionCard title="System">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextInput source="system_name" label="System name" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DateInput
                    source="operation_start_date"
                    label="Date system began operation"
                    fullWidth
                    sx={fullFieldSx}
                    {...dateInputProps}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DateInput
                    source="employment_date"
                    label="Date employed"
                    fullWidth
                    sx={fullFieldSx}
                    {...dateInputProps}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <NumberInput
                    source="beginning_members"
                    label="Beginning meter connections"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <NumberInput
                    source="current_members"
                    label="Current meter connections"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
              </Grid>
            </ReviewSectionCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <ReviewSectionCard title="Documents">
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <MediaLink file={record?.biography_file} label="Biography file" />
                <MediaLink file={record?.photographs} label="Photographs" />
                <MediaLink file={record?.board_list_file} label="Board list file" />
                <MediaLink file={record?.supporting_documents} label="Supporting documents" />
              </Box>
            </ReviewSectionCard>
          </Grid>
        </Grid>
      </Box>
    </SimpleForm>
  );
};

export default AwardForm;
