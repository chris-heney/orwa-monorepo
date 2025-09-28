import React from 'react';
import { Grid } from '@mui/material';
import { TextInput } from '../_components/TextInput';
import MaskedPhoneInput from '../_components/MaskedPhoneInput';
import { SelectInput } from '../_components/SelectInput';
import WatersystemAutocomplete from '../_components/WatersystemAutocomplete';
import FormSection from '../_components/FormSection';
import { stateOptions } from '../../data/stateOptions';

const EligibilityStep = () => {
  const relationshipOptions = [
    { value: 'Self', label: 'Self' },
    { value: 'DependentChild', label: 'Dependent Child' },
    { value: 'DependentGrandchild', label: 'Dependent Grandchild' }
  ];

  return (
    <FormSection title="Eligibility Criteria">
      {/* description="Eligible participants: ORWA Member System employees, directors, or their dependent children/grandchildren." */}
      
      <Grid container spacing={3}>
        {/* System Name */}
        <Grid size={{ xs: 12 }}>
          <WatersystemAutocomplete
            name="watersystem"
            label="Water System Name"
            required
            helperText="Select the ORWA member water system associated with the eligible participant"
          />
        </Grid>

        {/* Relationship */}
        <Grid size={{ xs: 12 }}>
          <SelectInput
            name="relationship"
            label="Eligible Participant's Relationship to Applicant"
            options={relationshipOptions}
            required
          />
        </Grid>

        {/* Eligible Participant Name */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="eligible_participant_name.first"
            label="Eligible Participant First Name"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="eligible_participant_name.last"
            label="Eligible Participant Last Name"
            required
          />
        </Grid>

        {/* Title */}
        <Grid size={{ xs: 12 }}>
          <TextInput
            name="eligible_participant_title"
            label="Eligible Participant Title"
            required
          />
        </Grid>

        {/* Contact Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <MaskedPhoneInput
            name="eligible_participant_phone"
            label="Eligible Participant Phone Number"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="eligible_participant_email"
            label="Eligible Participant Email"
            type="email"
            required
          />
        </Grid>

        {/* Address */}
        <Grid size={{ xs: 12 }}>
          <TextInput
            name="eligible_participant_address.street"
            label="Eligible Participant Street Address"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextInput
            name="eligible_participant_address.city"
            label="City"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SelectInput
            name="eligible_participant_address.state"
            label="State"
            options={stateOptions}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextInput
            name="eligible_participant_address.zip"
            label="ZIP Code"
            required
          />
        </Grid>
      </Grid>
    </FormSection>
  );
};

export default EligibilityStep;
