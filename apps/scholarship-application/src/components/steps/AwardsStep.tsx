import React from 'react';
import { Grid } from '@mui/material';
import { TextAreaInput } from '../_components/TextAreaInput';
import FormSection from '../_components/FormSection';

const AwardsStep = () => {
  return (
    <FormSection title="List of Awards, Memberships or other Special Recognition">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextAreaInput
            name="awards"
            label="List of Awards, Memberships or other Special Recognition"
            helperText="List of Awards, Memberships or other Special Recognition you have received dating back to your Sophomore year of High School."
            rows={6}
          />
        </Grid>
      </Grid>
    </FormSection>
  );
};

export default AwardsStep;
