import React from "react";
import {
  ArrayInput,
  AutocompleteInput,
  ReferenceInput,
  SimpleForm,
  SimpleFormIterator,
  TextInput,
  useRecordContext,
} from "react-admin";
import { Card, Divider, Grid, Typography } from "@mui/material";
import { formatNumber } from "../../../helpers/Formators";
import CustomPhoneInput from "../../_components/MaskedPhoneInput";
import CalculateSponsorCost from "./CalculateSponsorCost";
import FileUploadField from "../../_components/FileUploadField";
import CustomToolBar from "../../_components/CustomToolbar";
import { useConferenceContext } from "../ConferenceContext";
import { toSponsorshipFormId } from "./helpers/sponsorWritePayload";

const SponsorFormFields = () => {
  const { currentFilter } = useConferenceContext();
  const record = useRecordContext();

  return (
    <SimpleForm
      record={
            record
          ? {
              ...record,
              conference:
                toSponsorshipFormId(record.conference) ||
                currentFilter.conference,
              registration: toSponsorshipFormId(record.registration),
              // Strapi 5 returns `null` for a repeatable component with no
              // items instead of `[]` (see AGENTS.md Strapi 5 notes) — guard
              // so `.map` doesn't crash the form for sponsors with no items.
              sponsorship_items: (record.sponsorship_items ?? []).map(
                (item: any) => ({
                  id: item.id,
                  sponsorship: toSponsorshipFormId(item.sponsorship),
                  label: item.label,
                  value: item.value,
                  key: item.key,
                })
              ),
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
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" gutterBottom>
              General Information
            </Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <TextInput
                  source="organization"
                  label="Organization"
                  fullWidth
                  helperText="Enter the name of the organization."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <ReferenceInput
                  source="registration"
                  reference="conference-registrations"
                  label="Linked registration"
                  fullWidth
                  filter={{
                    conference: currentFilter.conference,
                    year: currentFilter.year,
                  }}
                >
                  <AutocompleteInput
                    optionText={(choice) =>
                      choice?.organization
                        ? `${choice.organization}${
                            choice.type ? ` (${choice.type})` : ""
                          }${
                            choice.registration_date
                              ? ` — ${choice.registration_date}`
                              : ""
                          }`
                        : ""
                    }
                    helperText="Optional. Same-conference registration for this sponsor — leave blank if none."
                  />
                </ReferenceInput>
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomPhoneInput
                  source="phone"
                  label="Phone"
                  fullWidth
                  helperText="Enter the phone number of the sponsor."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextInput
                  source="email"
                  label="Email"
                  fullWidth
                  helperText="Enter the email address of the sponsor."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CalculateSponsorCost />
              </Grid>

              <FileUploadField source="logo" label="Logo" />
            </Grid>
          </Grid>

          {/* Right Section */}
          <Grid item xs={12} md={6}>
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

        {/* Hidden: TextInput (not NumberInput) so a Strapi documentId is not
            coerced to NaN/null and written back, which unlinks the sponsor
            from the conference and drops it off the dashboard list. */}
        <TextInput
          source="year"
          defaultValue={currentFilter.year}
          sx={{ display: "none" }}
        />
        <TextInput
          source="conference"
          defaultValue={currentFilter.conference}
          sx={{ display: "none" }}
        />
      </Card>
    </SimpleForm>
  );
};

export default SponsorFormFields;
