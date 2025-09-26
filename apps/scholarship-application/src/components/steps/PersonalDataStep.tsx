import React from 'react';
import { Grid } from '@mui/material';
import SectionHeading from '../_components/SectionHeading';
import { TextInput } from '../_components/TextInput';
import { SelectInput } from '../_components/SelectInput';
import MaskedPhoneInput from '../_components/MaskedPhoneInput';
import FormSection from '../_components/FormSection';
import { stateOptions } from '../../data/stateOptions';

const PersonalDataStep = () => {
  return (
    <FormSection title="Personal Data">
      {/* description="The individual applying for scholarship" */}
      <Grid container spacing={3}>
        {/* Applicant Name */}
        <Grid size={{ xs: 12, md: 4 }}>
          <TextInput
            name="applicant_first_name"
            label="First Name"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextInput
            name="applicant_middle_name"
            label="Middle Name"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextInput
            name="applicant_last_name"
            label="Last Name"
            required
          />
        </Grid>

        {/* Contact Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <MaskedPhoneInput
            name="applicant_phone"
            label="Applicant Phone"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="applicant_email"
            label="Applicant Email"
            type="email"
            required
          />
        </Grid>

        {/* Address */}
        <Grid size={{ xs: 12 }}>
          <TextInput
            name="applicant_street"
            label="Street Address"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextInput
            name="applicant_city"
            label="City"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <SelectInput
            name="applicant_state"
            label="State"
            options={stateOptions}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextInput
            name="applicant_zip"
            label="ZIP Code"
            required
          />
        </Grid>
      </Grid>
    </FormSection>
  );
};

export default PersonalDataStep;
