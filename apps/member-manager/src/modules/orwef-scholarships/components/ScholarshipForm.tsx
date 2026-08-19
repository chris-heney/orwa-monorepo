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
} from "react-admin";
import { Box, Grid, Typography } from "@mui/material";
import { useRecordContext } from "react-admin";
import {
  dateInputProps,
  emailFieldSx,
  fullFieldSx,
  ReviewPageBar,
  ReviewSectionCard,
  ReviewToolbar,
  reviewFormSx,
} from "../../_components/review-packet";
import MediaLink from "./MediaLink";
import {
  MAX_FINANCIAL_RESOURCES,
  listFinancialResources,
} from "../helpers/financialResources";

const SCHOLARSHIP_BACK = "/orwef-scholarships/dashboard";

const statuses = [
  { id: "Draft", name: "Draft" },
  { id: "Submitted", name: "Submitted" },
  { id: "Under Review", name: "Under Review" },
  { id: "Approved", name: "Approved" },
  { id: "Denied", name: "Denied" },
];

const relationships = [
  { id: "Self", name: "Self" },
  { id: "DependentChild", name: "Dependent Child" },
  { id: "DependentGrandchild", name: "Dependent Grandchild" },
];

const educationTypes = [
  { id: "FourYearCollege", name: "4-Year College/University" },
  { id: "TwoYearCollege", name: "2-Year Community/Junior College" },
  { id: "VocationalSchool", name: "Vocational Technical School" },
];

const ScholarshipForm = () => {
  const record = useRecordContext<Record<string, unknown>>();

  return (
    <SimpleForm sx={reviewFormSx} toolbar={<ReviewToolbar redirect={SCHOLARSHIP_BACK} />}>
      <ReviewPageBar title="Review Scholarship Application" backTo={SCHOLARSHIP_BACK} />
      <Box sx={{ width: 1, px: { xs: 1, sm: 2 }, pb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ReviewSectionCard title="Status / Review">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <SelectInput
                    source="application_status"
                    label="Status"
                    choices={statuses}
                    validate={required()}
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DateInput
                    source="submission_date"
                    label="Submission date"
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
            <ReviewSectionCard title="Applicant">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <TextInput source="applicant_first_name" label="First name" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput source="applicant_middle_name" label="Middle name" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput source="applicant_last_name" label="Last name" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="applicant_email"
                    label="Email"
                    type="email"
                    fullWidth
                    sx={emailFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput source="applicant_phone" label="Phone" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12}>
                  <TextInput source="applicant_street" label="Street" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput source="applicant_city" label="City" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput source="applicant_state" label="State" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput source="applicant_zip" label="ZIP" fullWidth sx={fullFieldSx} />
                </Grid>
              </Grid>
            </ReviewSectionCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <ReviewSectionCard title="Eligibility">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextInput source="system_name" label="Water system" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12}>
                  <SelectInput
                    source="relationship"
                    label="Relationship"
                    choices={relationships}
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    source="eligible_participant_title"
                    label="Eligible participant title"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    source="eligible_participant_email"
                    label="Eligible participant email"
                    type="email"
                    fullWidth
                    sx={emailFieldSx}
                  />
                </Grid>
              </Grid>
            </ReviewSectionCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <ReviewSectionCard title="School">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextInput source="school_name" label="School" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DateInput
                    source="graduation_date"
                    label="Graduation date"
                    fullWidth
                    sx={fullFieldSx}
                    {...dateInputProps}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput source="gpa" label="GPA" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput source="sat_score" label="SAT" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput source="act_score" label="ACT" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <SelectInput
                    source="education_type"
                    label="Education type"
                    choices={educationTypes}
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput source="major" label="Major" fullWidth sx={fullFieldSx} />
                </Grid>
              </Grid>
            </ReviewSectionCard>
          </Grid>

          <Grid item xs={12}>
            <ReviewSectionCard title="Financial Data">
              <ArrayInput
                source="financial_resources"
                label={false}
                format={(value) =>
                  Array.isArray(value) && value.length > 0
                    ? value
                    : listFinancialResources(record)
                }
              >
                <SimpleFormIterator fullWidth disableReordering>
                  <TextInput
                    source="institution"
                    label="Institution"
                    fullWidth
                    sx={fullFieldSx}
                  />
                  <NumberInput
                    source="amount"
                    label="Amount ($)"
                    min={0}
                    fullWidth
                    sx={fullFieldSx}
                  />
                </SimpleFormIterator>
              </ArrayInput>
              <Typography variant="caption" color="text.secondary">
                Up to {MAX_FINANCIAL_RESOURCES} financial resources.
              </Typography>
            </ReviewSectionCard>
          </Grid>

          <Grid item xs={12}>
            <ReviewSectionCard title="Uploads">
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6} md={4}>
                  <MediaLink file={record?.transcript} label="Transcript" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <MediaLink file={record?.test_scores} label="Test scores" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <MediaLink file={record?.recommendation_letter_1} label="Recommendation 1" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <MediaLink file={record?.recommendation_letter_2} label="Recommendation 2" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <MediaLink file={record?.essay} label="Essay" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <MediaLink file={record?.biography} label="Biography" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <MediaLink file={record?.photograph} label="Photograph" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <MediaLink file={record?.applicant_pdf} label="Application PDF" />
                </Grid>
              </Grid>
            </ReviewSectionCard>
          </Grid>
        </Grid>
      </Box>
    </SimpleForm>
  );
};

export default ScholarshipForm;
