import React from "react";
import {
  Card,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import {
  TextInput,
  DateInput,
  NumberInput,
  SelectInput,
  BooleanInput,
  ReferenceInput,
  AutocompleteInput,
  useRecordContext,
  required,
  email,
  minValue,
  maxValue,
} from "react-admin";
import { useFormContext } from "react-hook-form";
import FileUploadField from "../../../_components/FileUploadField";

const ScholarshipFormFields = () => {
  const record = useRecordContext();
  const form = useFormContext();
  const relationship = form?.watch("relationship");
  const isMinor = relationship === "DependentChild" || relationship === "DependentGrandchild";

  return (
    <Grid container spacing={2}>
      {/* Applicant Information */}
      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Applicant Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextInput
                source="applicant_first_name"
                label="First Name"
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextInput
                source="applicant_middle_name"
                label="Middle Name"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextInput
                source="applicant_last_name"
                label="Last Name"
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInput
                source="applicant_email"
                label="Email"
                fullWidth
                validate={[required(), email()]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInput
                source="applicant_phone"
                label="Phone"
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInput
                source="applicant_street"
                label="Street Address"
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInput
                source="applicant_city"
                label="City"
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInput
                source="applicant_state"
                label="State"
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInput
                source="applicant_zip"
                label="ZIP Code"
                fullWidth
                validate={required()}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* Water System Information */}
      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Water System Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <ReferenceInput
                source="watersystem"
                reference="watersystems"
                label="Water System"
              >
                <AutocompleteInput
                  optionText="name"
                  fullWidth
                />
              </ReferenceInput>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInput
                source="system_name"
                label="System Name (if not in list)"
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectInput
                source="relationship"
                label="Relationship to System"
                choices={[
                  { id: "Self", name: "Self (Employee/Board Member)" },
                  { id: "DependentChild", name: "Dependent Child" },
                  { id: "DependentGrandchild", name: "Dependent Grandchild" },
                ]}
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ReferenceInput
                source="contact"
                reference="contacts"
                label="Related Contact"
              >
                <AutocompleteInput
                  optionText={(record) => `${record.first} ${record.last}`}
                  fullWidth
                />
              </ReferenceInput>
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* Eligible Participant (if not self) */}
      {relationship && relationship !== "Self" && (
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Eligible Participant (Employee/Board Member)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextInput
                  source="eligible_participant_name.first"
                  label="First Name"
                  fullWidth
                  validate={required()}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  source="eligible_participant_name.middle"
                  label="Middle Name"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  source="eligible_participant_name.last"
                  label="Last Name"
                  fullWidth
                  validate={required()}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextInput
                  source="eligible_participant_title"
                  label="Title/Position"
                  fullWidth
                  validate={required()}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextInput
                  source="eligible_participant_phone"
                  label="Phone"
                  fullWidth
                  validate={required()}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextInput
                  source="eligible_participant_email"
                  label="Email"
                  fullWidth
                  validate={[required(), email()]}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextInput
                  source="eligible_participant_address.street"
                  label="Street Address"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  source="eligible_participant_address.city"
                  label="City"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  source="eligible_participant_address.state"
                  label="State"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextInput
                  source="eligible_participant_address.zip"
                  label="ZIP Code"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      )}

      {/* School Information */}
      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            School Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextInput
                source="school_name"
                label="School Name"
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DateInput
                source="graduation_date"
                label="Expected/Actual Graduation Date"
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInput
                source="school_address.street"
                label="School Street Address"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInput
                source="school_address.city"
                label="School City"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInput
                source="school_address.state"
                label="School State"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInput
                source="school_address.zip"
                label="School ZIP Code"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectInput
                source="education_type"
                label="Education Type"
                choices={[
                  { id: "FourYearCollege", name: "Four Year College" },
                  { id: "TwoYearCollege", name: "Two Year College" },
                  { id: "VocationalSchool", name: "Vocational/Technical School" },
                ]}
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInput
                source="major"
                label="Major/Field of Study"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInput
                source="first_year"
                label="First Year Enrolled"
                fullWidth
                validate={required()}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* Academic Information */}
      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Academic Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <NumberInput
                source="gpa"
                label="High School GPA"
                fullWidth
                validate={[required(), minValue(0), maxValue(4)]}
                step={0.01}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <NumberInput
                source="sat_score"
                label="SAT Score"
                fullWidth
                validate={[required(), minValue(400), maxValue(1600)]}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <NumberInput
                source="act_score"
                label="ACT Score"
                fullWidth
                validate={[required(), minValue(1), maxValue(36)]}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <NumberInput
                source="college_gpa"
                label="College GPA (if applicable)"
                fullWidth
                validate={[required(), minValue(0), maxValue(4)]}
                step={0.01}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <NumberInput
                source="credits_completed"
                label="Credits Completed"
                fullWidth
                validate={[required(), minValue(0)]}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <NumberInput
                source="credits_required"
                label="Credits Required for Degree"
                fullWidth
                validate={[required(), minValue(0)]}
              />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                source="awards"
                label="Awards and Honors"
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* Recommenders */}
      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Recommenders
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {/* Recommender 1 */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Recommender 1
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextInput
                source="recommender1_name.first"
                label="First Name"
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextInput
                source="recommender1_name.middle"
                label="Middle Name"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextInput
                source="recommender1_name.last"
                label="Last Name"
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInput
                source="recommender1_email"
                label="Email"
                fullWidth
                validate={[required(), email()]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInput
                source="recommender1_phone"
                label="Phone"
                fullWidth
                validate={required()}
              />
            </Grid>

            {/* Recommender 2 */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1, mt: 2 }}>
                Recommender 2
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextInput
                source="recommender2_name.first"
                label="First Name"
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextInput
                source="recommender2_name.middle"
                label="Middle Name"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextInput
                source="recommender2_name.last"
                label="Last Name"
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInput
                source="recommender2_email"
                label="Email"
                fullWidth
                validate={[required(), email()]}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInput
                source="recommender2_phone"
                label="Phone"
                fullWidth
                validate={required()}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* Financial Information */}
      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Financial Aid Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextInput
                source="financial1_institution"
                label="Financial Institution 1"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <NumberInput
                source="financial1_amount"
                label="Amount from Institution 1"
                fullWidth
                validate={minValue(0)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInput
                source="financial2_institution"
                label="Financial Institution 2"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <NumberInput
                source="financial2_amount"
                label="Amount from Institution 2"
                fullWidth
                validate={minValue(0)}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* Document Uploads */}
      {record && (
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Required Documents
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <FileUploadField
                source="transcript"
                label="Official Transcript"
                accept=".pdf,.doc,.docx"
              />
              <FileUploadField
                source="test_scores"
                label="SAT/ACT Test Scores"
                accept=".pdf,.doc,.docx"
              />
              <FileUploadField
                source="recommendation_letter_1"
                label="Recommendation Letter 1"
                accept=".pdf,.doc,.docx"
              />
              <FileUploadField
                source="recommendation_letter_2"
                label="Recommendation Letter 2"
                accept=".pdf,.doc,.docx"
              />
              <FileUploadField
                source="essay"
                label="Essay"
                accept=".pdf,.doc,.docx"
              />
              <FileUploadField
                source="biography"
                label="Biography"
                accept=".pdf,.doc,.docx"
              />
              <FileUploadField
                source="photograph"
                label="Photograph"
                accept=".jpg,.jpeg,.png"
              />
              <FileUploadField
                source="applicant_pdf"
                label="Complete Application PDF (Optional)"
                accept=".pdf"
              />
            </Grid>
          </Card>
        </Grid>
      )}

      {/* Certifications */}
      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Certifications
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextInput
                source="age_confirm"
                label="Age Confirmation"
                fullWidth
                validate={required()}
                helperText="Please confirm applicant's age"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DateInput
                source="applicant_certification_date"
                label="Certification Date"
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12}>
              <BooleanInput
                source="applicant_certification"
                label="I certify that all information provided is true and accurate"
                validate={required()}
              />
            </Grid>

            {/* Guardian section if minor */}
            {isMinor && (
              <>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 2 }}>
                    Guardian Information (Required for Minors)
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput
                    source="guardian_name.first"
                    label="Guardian First Name"
                    fullWidth
                    validate={required()}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput
                    source="guardian_name.middle"
                    label="Guardian Middle Name"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextInput
                    source="guardian_name.last"
                    label="Guardian Last Name"
                    fullWidth
                    validate={required()}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DateInput
                    source="guardian_certification_date"
                    label="Guardian Certification Date"
                    fullWidth
                    validate={required()}
                  />
                </Grid>
                <Grid item xs={12}>
                  <BooleanInput
                    source="guardian_certification"
                    label="Guardian certifies that all information provided is true and accurate"
                    validate={required()}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </Card>
      </Grid>

      {/* Application Status (Admin only) */}
      {record && (
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Application Management
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <SelectInput
                  source="application_status"
                  label="Application Status"
                  choices={[
                    { id: "Draft", name: "Draft" },
                    { id: "Submitted", name: "Submitted" },
                    { id: "Under Review", name: "Under Review" },
                    { id: "Approved", name: "Approved" },
                    { id: "Denied", name: "Denied" },
                  ]}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DateInput
                  source="submission_date"
                  label="Submission Date"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextInput
                  source="review_notes"
                  label="Review Notes"
                  fullWidth
                  multiline
                  rows={4}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
      )}
    </Grid>
  );
};

export default ScholarshipFormFields;
