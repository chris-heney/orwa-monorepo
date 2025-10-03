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
  ReferenceInput,
  AutocompleteInput,
  useRecordContext,
  required,
  email,
  minValue,
  maxValue,
  maxLength,
} from "react-admin";
import FileUploadField from "../../../_components/FileUploadField";

const AwardFormFields = () => {
  const record = useRecordContext();

  const awardTypes = [
    { id: "Water/Wastewater System of the Year", name: "Water/Wastewater System of the Year" },
    { id: "Excellence in Operations", name: "Excellence in Operations" },
    { id: "Excellence in Management", name: "Excellence in Management" },
    { id: "Excellence in Office Operations", name: "Excellence in Office Operations" },
  ];

  const oklahomaCounties = [
    "Adair", "Alfalfa", "Atoka", "Beaver", "Beckham", "Blaine", "Bryan", "Caddo",
    "Canadian", "Carter", "Cherokee", "Choctaw", "Cimarron", "Cleveland", "Coal",
    "Comanche", "Cotton", "Craig", "Creek", "Custer", "Delaware", "Dewey", "Ellis",
    "Garfield", "Garvin", "Grady", "Grant", "Greer", "Harmon", "Harper", "Haskell",
    "Hughes", "Jackson", "Jefferson", "Johnston", "Kay", "Kingfisher", "Kiowa",
    "Latimer", "LeFlore", "Lincoln", "Logan", "Love", "Major", "Marshall", "Mayes",
    "McClain", "McCurtain", "McIntosh", "Murray", "Muskogee", "Noble", "Nowata",
    "Okfuskee", "Oklahoma", "Okmulgee", "Osage", "Ottawa", "Pawnee", "Payne",
    "Pittsburg", "Pontotoc", "Pottawatomie", "Pushmataha", "Roger Mills", "Rogers",
    "Seminole", "Sequoyah", "Stephens", "Texas", "Tillman", "Tulsa", "Wagoner",
    "Washington", "Washita", "Woods", "Woodward"
  ].map(county => ({ id: county, name: county }));

  return (
    <Grid container spacing={2}>
      {/* Award Information */}
      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Award Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <SelectInput
                source="award_type"
                label="Award Type"
                choices={awardTypes}
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <NumberInput
                source="award_year"
                label="Award Year"
                fullWidth
                defaultValue={new Date().getFullYear()}
                validate={[required(), minValue(2020), maxValue(2030)]}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* Nominee/System Information */}
      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Nominee/System Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextInput
                source="nominee_name"
                label="Name of System or Person (as it should appear on award)"
                fullWidth
                validate={required()}
                helperText="NAME MUST BE SPELLED THE WAY YOU WANT IT ON THE AWARD"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInput
                source="system_name"
                label="System Name"
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ReferenceInput
                source="watersystem"
                reference="watersystems"
                label="Water System (if applicable)"
              >
                <AutocompleteInput
                  optionText="name"
                  fullWidth
                />
              </ReferenceInput>
            </Grid>
            <Grid item xs={12} md={6}>
              <SelectInput
                source="county"
                label="County"
                choices={oklahomaCounties}
                fullWidth
                validate={required()}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* Contact Information */}
      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Contact Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextInput
                source="daytime_phone"
                label="Daytime Contact Phone Number"
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextInput
                source="email"
                label="Email"
                fullWidth
                validate={[required(), email()]}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* Address Information */}
      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Address Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextInput
                source="address"
                label="Street Address"
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextInput
                source="city"
                label="City"
                fullWidth
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextInput
                source="state"
                label="State / Province / Region"
                fullWidth
                defaultValue="OK"
                validate={required()}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextInput
                source="zip"
                label="ZIP Code"
                fullWidth
                validate={required()}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* General Information */}
      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            General Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <DateInput
                source="operation_start_date"
                label="Date system began operation"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DateInput
                source="employment_date"
                label="Date Employed"
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <NumberInput
                source="current_members"
                label="Number of current members"
                fullWidth
                validate={minValue(0)}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <NumberInput
                source="beginning_members"
                label="Number of beginning members"
                fullWidth
                validate={minValue(0)}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* Employee Information */}
      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Employee Information
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <NumberInput
                source="clerical_employees"
                label="Clerical Employees"
                fullWidth
                validate={minValue(0)}
                defaultValue={0}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <NumberInput
                source="operation_maintenance_employees"
                label="Operation & Maintenance Employees"
                fullWidth
                validate={minValue(0)}
                defaultValue={0}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <NumberInput
                source="management_employees"
                label="Management Employees"
                fullWidth
                validate={minValue(0)}
                defaultValue={0}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* Nomination Description */}
      <Grid item xs={12}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Nomination Description
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <TextInput
            source="nomination_description"
            label="Please provide as much information in 300 words or less, be specific"
            fullWidth
            multiline
            rows={8}
            validate={[required(), maxLength(300)]}
            helperText="Maximum 300 characters"
          />
        </Card>
      </Grid>

      {/* Document Uploads */}
      {record && (
        <Grid item xs={12}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Supporting Documents
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <FileUploadField
                source="supporting_documents"
                label="Supporting Documents"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                multiple
              />
              <FileUploadField
                source="nomination_pdf"
                label="Complete Nomination PDF (Optional)"
                accept=".pdf"
              />
            </Grid>
          </Card>
        </Grid>
      )}

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
                  source="nomination_status"
                  label="Nomination Status"
                  choices={[
                    { id: "Draft", name: "Draft" },
                    { id: "Submitted", name: "Submitted" },
                    { id: "Under Review", name: "Under Review" },
                    { id: "Winner", name: "Winner" },
                    { id: "Runner Up", name: "Runner Up" },
                    { id: "Not Selected", name: "Not Selected" },
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

export default AwardFormFields;
