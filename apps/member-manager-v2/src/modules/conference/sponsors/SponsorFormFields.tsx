import React from "react";
import {
  ArrayInput,
  AutocompleteInput,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
  useRecordContext,
} from "react-admin";
import {Card, Divider, Grid, Typography} from "@mui/material";
import { formatNumber } from "../../../helpers/Formators";
import CustomPhoneInput from "../../_components/MaskedPhoneInput";
import CalculateSponsorCost from "./CalculateSponsorCost";
import FileUploadField from "../../_components/FileUploadField";
import CustomToolBar from "../../_components/CustomToolbar";
import { useConferenceContext } from "../ConferenceContext";

const SponsorFormFields = () => {
  const { currentFilter } = useConferenceContext();
  const record = useRecordContext();

  return (
    <SimpleForm
      record={
        record
          ? {
              ...record,
              sponsorship_items: record.sponsorship_items.map((item: any) => ({
                sponsorship: item.sponsorship?.data?.id || item.sponsorship,
                label: item.label,
                value: item.value,
                key: item.key,
              })),
            }
          : {}
      }
      sx={{ p: 0, borderRadius: 0 }}
      toolbar={<CustomToolBar redirect="/conference/dashboard" />}
    >
      <Card sx={{ p: 3, width: "100%", borderRadius: 0, boxShadow: 2 }}>
        <Typography variant="h5" gutterBottom>
          Sponsor Information
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={4}>
          {/* Left Section */}
          <Grid xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              General Information
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid xs={12} md={6}>
                <TextInput
                  source="organization"
                  label="Organization"
                  fullWidth
                  helperText="Enter the name of the organization."
                />
              </Grid>
              <Grid xs={12} md={6}>
                <ReferenceInput
                  source="registration"
                  reference="conference-registrations"
                  label="Organization"
                  fullWidth
                  filter={{
                    conference: currentFilter.conference,
                    year: currentFilter.year,
                  }}
                >
                  <AutocompleteInput
                    optionText="organization"
                    helperText="Select the registration relted for this sponsor. not required if the isn't a registration created."
                  />
                </ReferenceInput>
              </Grid>
              <Grid xs={12} md={6}>
                <CustomPhoneInput
                  source="phone"
                  label="Phone"
                  fullWidth
                  helperText="Enter the phone number of the sponsor."
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextInput
                  source="email"
                  label="Email"
                  fullWidth
                  helperText="Enter the email address of the sponsor."
                />
              </Grid>
              <Grid xs={12} md={6}>
                <CalculateSponsorCost />
              </Grid>

              <FileUploadField source="logo" label="Logo" />
            </Grid>
          </Grid>

          {/* Right Section */}
          <Grid xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              Sponsorship Items
            </Typography>
            <ArrayInput source="sponsorship_items" label=" ">
              <SimpleFormIterator fullWidth>
                <ReferenceInput
                  source="sponsorship"
                  reference="conference-sponsorships"
                  label="Sponsorship"
                  helperText="Select a sponsorship item for this entry."
                  filter={{ conference: currentFilter.conference }}
                >
                  <AutocompleteInput
                    helperText={false}
                    fullWidth
                    optionText={(choice) =>
                      choice.name + " " + formatNumber(choice.amount)
                    }
                  />
                </ReferenceInput>
                {/* <SelectSponsorshipItem conference={conference} /> */}
              </SimpleFormIterator>
            </ArrayInput>
          </Grid>
        </Grid>

        {/* Hidden Inputs */}
        <NumberInput
          source="year"
          defaultValue={currentFilter.year}
          sx={{ display: "none" }}
        />
        <NumberInput
          source="conference"
          defaultValue={currentFilter.conference}
          sx={{ display: "none" }}
        />
      </Card>
    </SimpleForm>
  );
};

export default SponsorFormFields;
