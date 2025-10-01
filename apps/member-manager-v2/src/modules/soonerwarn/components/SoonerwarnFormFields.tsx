import React from "react";
import {Box, Card, Divider, Grid, Typography} from "@mui/material";
import {
  AutocompleteArrayInput,
  AutocompleteInput,
  DateInput,
  ReferenceArrayInput,
  ReferenceInput,
  SelectInput,
  TextInput,
} from "react-admin";
import CustomPhoneInput from "../../_components/MaskedPhoneInput";
import { StateChoices, countyOptions } from "../../../helpers/Data";

const SoonerwarnFormFields = () => {
  return (
    <Box>
      <Grid container spacing={2}>
        {/* Basic Information Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, my: 2, boxShadow: "none" }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Basic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextInput source="system_name" label="System Name" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextInput source="email" label="Email" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomPhoneInput source="phone" label="Phone" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateInput
                  source="application_date"
                  label="Application Date"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* Address Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, my: 2, boxShadow: "none" }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Address Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextInput
                  source="physical_address_street"
                  label="Street"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextInput
                  source="physical_address_city"
                  label="City"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectInput
                  source="physical_address_state"
                  label="State"
                  choices={StateChoices}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextInput
                  source="physical_address_zip"
                  label="Zip"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>

        {/* County and Status Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, my: 2, boxShadow: "none" }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Additional Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <SelectInput
                  source="county"
                  label="County"
                  choices={countyOptions}
                  fullWidth
                />
              </Grid>
              {/* Status field (add choices based on available statuses) */}
              <Grid item xs={12} sm={6}>
                <ReferenceInput
                  source="primary_contact"
                  label="Primary Contact"
                  reference="contacts"
                  perPage={1000}
                  helperText={false}
                  fullWidth
                >
                  <AutocompleteInput
                    optionText={"email"}
                    helperText={false}
                  />
                </ReferenceInput>
               
              </Grid>
              <Grid item xs={12} sm={6}>
                <ReferenceInput
                  source="secondary_contact"
                  label="Secondary Contact"
                  reference="contacts"
                  perPage={1000}
                  helperText={false}
                  fullWidth
                >
                  <AutocompleteInput
                    optionText={"email"}
                    helperText={false}
                  />
                </ReferenceInput>
               
              </Grid>
              <Grid item xs={12} sm={6}>
                <ReferenceArrayInput
                  source="contacts"
                  label="Additional Contacts"
                  reference="contacts"
                  perPage={1000}
                  helperText={false}
                  fullWidth
                >
                  <AutocompleteArrayInput
                    optionText={"email"}
                    helperText={false}
                  />
                </ReferenceArrayInput>
               
              </Grid>
              <Grid item xs={12} sm={6}>
                <DateInput
                  source="member_since"
                  label="Application Date"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ReferenceInput
                  source="status"
                  label="Status"
                  reference="soonerwarn-statuses"
                  perPage={1000}
                  helperText={false}
                  fullWidth
                >
                  <AutocompleteInput
                    optionText={"name"}
                    helperText={false}
                  />
                </ReferenceInput>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SoonerwarnFormFields;
