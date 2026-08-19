import React from 'react';
import { Grid } from '@mui/material';
import FileInput from '../_components/FileInput';
import FormSection from '../_components/FormSection';

const PhotoStep = () => {
  return (
    <FormSection title="High Quality Photograph">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <FileInput
            name="photograph"
            label="Please Upload Your High Quality Photograph."
            required
            maxSizeMB={50}
            acceptedTypes={['.jpg', '.jpeg', '.gif', '.png', '.tiff', '.tif']}
            helperText="Max. file size: 50 MB."
          />
        </Grid>
      </Grid>
    </FormSection>
  );
};

export default PhotoStep;
