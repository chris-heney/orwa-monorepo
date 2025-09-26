import React from 'react';
import { Grid } from '@mui/material';
import SectionHeading from '../_components/SectionHeading';
import { TextInput } from '../_components/TextInput';
import MaskedPhoneInput from '../_components/MaskedPhoneInput';
import FileInput from '../_components/FileInput';
import FormSection from '../_components/FormSection';

const RecommendationsStep = () => {
  return (
    <FormSection title="Letters of Recommendation">
      {/* description="Two letters of recommendation are required." */}
      <Grid container spacing={3}>
        {/* First Recommender */}
        <Grid size={{ xs: 12 }}>
          <h3 className="text-lg font-semibold mb-4">First Recommender</h3>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="recommender1_name.first"
            label="First Recommender First Name"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="recommender1_name.last"
            label="First Recommender Last Name"
            required
          />
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="recommender1_email"
            label="First Recommender Email"
            type="email"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MaskedPhoneInput
            name="recommender1_phone"
            label="First Recommender Phone"
            required
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FileInput
            name="recommender1_file"
            label="First Letter of Recommendation"
            required
            maxSizeMB={50}
            acceptedTypes={['.pdf', '.doc', '.docx']}
          />
        </Grid>

        {/* Second Recommender */}
        <Grid size={{ xs: 12 }}>
          <h3 className="text-lg font-semibold mb-4 mt-6">Second Recommender</h3>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="recommender2_name.first"
            label="Second Recommender First Name"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="recommender2_name.last"
            label="Second Recommender Last Name"
            required
          />
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="recommender2_email"
            label="Second Recommender Email"
            type="email"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MaskedPhoneInput
            name="recommender2_phone"
            label="Second Recommender Phone"
            required
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FileInput
            name="recommender2_file"
            label="Second Letter of Recommendation"
            required
            maxSizeMB={50}
            acceptedTypes={['.pdf', '.doc', '.docx']}
          />
        </Grid>
      </Grid>
    </FormSection>
  );
};

export default RecommendationsStep;
