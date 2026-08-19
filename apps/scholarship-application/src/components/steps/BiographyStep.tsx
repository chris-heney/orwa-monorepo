import React from 'react';
import { Grid } from '@mui/material';
import SectionHeading from '../_components/SectionHeading';
import FileInput from '../_components/FileInput';
import FormSection from '../_components/FormSection';

const BiographyStep = () => {
  return (
    <FormSection title="Biography">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <FileInput
            name="biography"
            label="Upload Biography"
            required
            maxSizeMB={50}
            acceptedTypes={['.pdf', '.doc', '.docx']}
            helperText="Please upload your biography document."
          />
        </Grid>
      </Grid>
    </FormSection>
  );
};

export default BiographyStep;
