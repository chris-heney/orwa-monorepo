import React from 'react';
import { Grid } from '@mui/material';
import SectionHeading from '../_components/SectionHeading';
import { TextAreaInput } from '../_components/TextAreaInput';
import FormSection from '../_components/FormSection';

const AwardsStep = () => {
  return (
    <FormSection title="Awards and Recognition">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextAreaInput
            name="awards"
            label="List of Awards, Memberships, or Special Recognition"
            helperText="Include recognitions since Sophomore year of High School."
            rows={6}
            placeholder="Please list any awards, memberships, or special recognition you have received..."
          />
        </Grid>
      </Grid>
    </FormSection>
  );
};

export default AwardsStep;
