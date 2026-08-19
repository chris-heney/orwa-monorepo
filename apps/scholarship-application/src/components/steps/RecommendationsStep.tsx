import React from 'react';
import { Grid } from '@mui/material';
import { TextInput } from '../_components/TextInput';
import MaskedPhoneInput from '../_components/MaskedPhoneInput';
import FileInput from '../_components/FileInput';
import FormSection from '../_components/FormSection';

const RecommendationsStep = () => {
  return (
    <FormSection
      title="Letters of Recommendation"
      description="Two letters of recommendation are required."
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <h3 className="text-lg font-semibold mb-2 text-left">First Recommenders Name</h3>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="recommender1_name.first"
            label="First"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="recommender1_name.last"
            label="Last"
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="recommender1_email"
            label="Email"
            type="email"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MaskedPhoneInput
            name="recommender1_phone"
            label="Phone Number"
            required
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FileInput
            name="recommendation_letter_1"
            label="Please Submit Your First Letter of Recommendation."
            required
            maxSizeMB={50}
            acceptedTypes={['.pdf', '.doc', '.docx']}
            helperText="Max. file size: 50 MB."
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <h3 className="text-lg font-semibold mb-2 mt-6 text-left">Second Recommenders Name</h3>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="recommender2_name.first"
            label="First"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="recommender2_name.last"
            label="Last"
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="recommender2_email"
            label="Email"
            type="email"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <MaskedPhoneInput
            name="recommender2_phone"
            label="Phone Number"
            required
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <FileInput
            name="recommendation_letter_2"
            label="Please Submit Your Second Letter of Recommendation."
            required
            maxSizeMB={50}
            acceptedTypes={['.pdf', '.doc', '.docx']}
            helperText="Max. file size: 50 MB."
          />
        </Grid>
      </Grid>
    </FormSection>
  );
};

export default RecommendationsStep;
