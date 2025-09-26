import React from 'react';
import { Grid } from '@mui/material';
import SectionHeading from '../_components/SectionHeading';
import { TextInput } from '../_components/TextInput';
import { SelectInput } from '../_components/SelectInput';
import { CheckboxInput } from '../_components/CheckboxInput';
import FormSection from '../_components/FormSection';

const CertificationStep = () => {
  const ageConfirmOptions = [
    { value: 'Yes, I am 18 years or older', label: 'Yes, I am 18 years or older' },
    { value: 'No, I am under the age of 18', label: 'No, I am under the age of 18' }
  ];

  return (
    <FormSection title="Scholarship Application Certification">
      <Grid container spacing={3}>
        {/* Age Confirmation */}
        <Grid size={{ xs: 12 }}>
          <SelectInput
            name="age_confirm"
            label="Please indicate the following"
            options={ageConfirmOptions}
            required
          />
        </Grid>

        {/* Applicant Certification */}
        <Grid size={{ xs: 12 }}>
          <CheckboxInput
            name="applicant_certification"
            label="Scholarship Applicant Certification"
            options={[{ value: 'I agree', label: 'I agree' }]}
            helperText="Applicant certifies information is complete and accurate."
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="applicant_certification_date"
            label="Date"
            type="date"
            required
          />
        </Grid>

        {/* Guardian Information */}
        <Grid size={{ xs: 12 }}>
          <h3 className="text-lg font-semibold mb-4 mt-6">Guardian Information (if under 18)</h3>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="guardian_name.first"
            label="Guardian First Name"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="guardian_name.last"
            label="Guardian Last Name"
            required
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <CheckboxInput
            name="guardian_certification"
            label="Applicant's Guardian Certification"
            options={[{ value: 'I/We Certify', label: 'I/We Certify' }]}
            helperText="Guardian certifies accuracy if applicant is under 18."
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="guardian_certification_date"
            label="Guardian Certification Date"
            type="date"
          />
        </Grid>
      </Grid>
    </FormSection>
  );
};

export default CertificationStep;
