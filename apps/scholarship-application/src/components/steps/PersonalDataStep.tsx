import React from 'react';
import { Grid } from '@mui/material';
import { TextInput } from '../_components/TextInput';
import { SelectInput } from '../_components/SelectInput';
import MaskedPhoneInput from '../_components/MaskedPhoneInput';
import FormSection from '../_components/FormSection';
import { stateOptions } from '../../data/stateOptions';

const PersonalDataStep = () => {
  return (
    <FormSection
      title="Personal Data (The individual applying for Scholarship)"
      footerNotice="Incomplete applications and submissions received after the deadline will not be considered."
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <p className="text-sm font-semibold text-gray-700 text-left mb-1">
            Applicant Name: (Individual applying for Scholarship){" "}
            <span className="text-red-500">*</span>
          </p>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextInput
            name="applicant_first_name"
            label="First"
            required
            helperText="Individual applying for scholarship."
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextInput
            name="applicant_middle_name"
            label="Middle"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextInput
            name="applicant_last_name"
            label="Last"
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <MaskedPhoneInput
            name="applicant_phone"
            label="Applicant Phone"
            required
            helperText="(Individual applying for Scholarship)"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="applicant_email"
            label="Applicant Email"
            type="email"
            required
            helperText="(Individual applying for Scholarship)"
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <p className="text-sm font-semibold text-gray-700 text-left mb-1">
            Applicant Address: (Individual applying for Scholarship){" "}
            <span className="text-red-500">*</span>
          </p>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextInput
            name="applicant_street"
            label="Mailing Address"
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
