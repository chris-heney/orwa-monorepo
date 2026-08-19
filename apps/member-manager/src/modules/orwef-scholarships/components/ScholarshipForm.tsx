import React from "react";
import {
  ArrayInput,
  BooleanInput,
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

const firstYearChoices = [
  { id: "Yes", name: "Yes" },
  { id: "No", name: "No" },
];

const ageConfirmChoices = [
  { id: "Yes, I am 18 years or older", name: "Yes, I am 18 years or older" },
  {
    id: "No, I am under the age of 18",
    name: "No, I am under the age of 18",
  },
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

          <Grid item xs={12}>
            <ReviewSectionCard title="Eligibility">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextInput source="system_name" label="Water system" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <SelectInput
                    source="relationship"
                    label="Relationship"
                    choices={relationships}
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="eligible_participant_name.first"
                    label="Eligible participant first name"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="eligible_participant_name.last"
                    label="Eligible participant last name"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="eligible_participant_title"
                    label="Title"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="eligible_participant_phone"
                    label="Participant phone"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="eligible_participant_email"
                    label="Participant email"
                    type="email"
                    fullWidth
                    sx={emailFieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    source="eligible_participant_address.street"
                    label="Participant street"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput
                    source="eligible_participant_address.city"
                    label="Participant city"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput
                    source="eligible_participant_address.state"
                    label="Participant state"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput
                    source="eligible_participant_address.zip"
                    label="Participant ZIP"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
              </Grid>
            </ReviewSectionCard>
          </Grid>

          <Grid item xs={12}>
            <ReviewSectionCard title="High School">
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
                <Grid item xs={12}>
                  <TextInput
                    source="school_address.street"
                    label="School street"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput source="school_address.city" label="School city" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput source="school_address.state" label="School state" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput source="school_address.zip" label="School ZIP" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput source="gpa" label="GPA" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <NumberInput source="sat_score" label="SAT" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <NumberInput source="act_score" label="ACT" fullWidth sx={fullFieldSx} />
                </Grid>
              </Grid>
            </ReviewSectionCard>
          </Grid>

          <Grid item xs={12}>
            <ReviewSectionCard title="College / University">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <SelectInput
                    source="first_year"
                    label="First year"
                    choices={firstYearChoices}
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <NumberInput
                    source="credits_completed"
                    label="Credits completed"
                    min={0}
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <NumberInput
                    source="credits_required"
                    label="Credits required"
                    min={0}
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput source="college_gpa" label="College GPA" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <SelectInput
                    source="education_type"
                    label="Education type"
                    choices={educationTypes}
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput source="major" label="Major" fullWidth sx={fullFieldSx} />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    source="awards"
                    label="Awards, memberships, or special recognition"
                    multiline
                    minRows={3}
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
              </Grid>
            </ReviewSectionCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <ReviewSectionCard title="Recommender 1">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="recommender1_name.first"
                    label="First name"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="recommender1_name.last"
                    label="Last name"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    source="recommender1_email"
                    label="Email"
                    type="email"
                    fullWidth
                    sx={emailFieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput source="recommender1_phone" label="Phone" fullWidth sx={fullFieldSx} />
                </Grid>
              </Grid>
            </ReviewSectionCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <ReviewSectionCard title="Recommender 2">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="recommender2_name.first"
                    label="First name"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="recommender2_name.last"
                    label="Last name"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput
                    source="recommender2_email"
                    label="Email"
                    type="email"
                    fullWidth
                    sx={emailFieldSx}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextInput source="recommender2_phone" label="Phone" fullWidth sx={fullFieldSx} />
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
                  <MediaLink file={record?.photograph} label="Photograph" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <MediaLink file={record?.transcript} label="Transcript" />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <MediaLink file={record?.test_scores} label="SAT/ACT scores" />
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
                  <MediaLink file={record?.applicant_pdf} label="Application PDF" />
                </Grid>
              </Grid>
            </ReviewSectionCard>
          </Grid>

          <Grid item xs={12}>
            <ReviewSectionCard title="Certification">
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <SelectInput
                    source="age_confirm"
                    label="Age confirmation"
                    choices={ageConfirmChoices}
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <BooleanInput
                    source="applicant_certification"
                    label="Applicant certified"
                    helperText={false}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DateInput
                    source="applicant_certification_date"
                    label="Applicant certification date"
                    fullWidth
                    sx={fullFieldSx}
                    {...dateInputProps}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="guardian_name.first"
                    label="Guardian first name"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextInput
                    source="guardian_name.last"
                    label="Guardian last name"
                    fullWidth
                    sx={fullFieldSx}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <BooleanInput
                    source="guardian_certification"
                    label="Guardian certified"
                    helperText={false}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DateInput
                    source="guardian_certification_date"
                    label="Guardian certification date"
                    fullWidth
                    sx={fullFieldSx}
                    {...dateInputProps}
                  />
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
