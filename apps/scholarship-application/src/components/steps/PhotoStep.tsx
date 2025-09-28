import React from 'react';
import { Grid } from '@mui/material';
import SectionHeading from '../_components/SectionHeading';
import FileInput from '../_components/FileInput';
import FormSection from '../_components/FormSection';

const PhotoStep = () => {
  return (
    <FormSection title="High Quality Photograph">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <FileInput
            name="photograph"
            label="Upload High Quality Photograph"
            required
            maxSizeMB={50}
            acceptedTypes={['.jpg', '.jpeg', '.gif', '.png', '.tiff', '.tif']}
            helperText="Please upload a high quality photograph. Accepted formats: JPG, GIF, PNG, TIFF."
          />
        </Grid>
      </Grid>
    </FormSection>
  );
};

export default PhotoStep;
