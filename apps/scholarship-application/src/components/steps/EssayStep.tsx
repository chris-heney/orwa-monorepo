import React from 'react';
import { Grid } from '@mui/material';
import SectionHeading from '../_components/SectionHeading';
import FileInput from '../_components/FileInput';
import FormSection from '../_components/FormSection';

const EssayStep = () => {
  return (
    <FormSection title="Essay">
      {/* description="Upload essay (250 words or less) about goals related to education, career, and future plans." */}
      
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <FileInput
            name="essay_upload"
            label="Upload Essay"
            required
            maxSizeMB={50}
            acceptedTypes={['.pdf', '.doc', '.docx']}
            helperText="Please upload your essay (250 words or less) about your goals related to education, career, and future plans."
          />
        </Grid>
      </Grid>
    </FormSection>
  );
};

export default EssayStep;
