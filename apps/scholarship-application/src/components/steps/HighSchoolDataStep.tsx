import React from 'react';
import { Grid } from '@mui/material';
import SectionHeading from '../_components/SectionHeading';
import { TextInput } from '../_components/TextInput';
import { NumberInput } from '../_components/NumberInput';
import FileInput from '../_components/FileInput';
import FormSection from '../_components/FormSection';

const HighSchoolDataStep = () => {
  return (
    <FormSection title="High School Data">
      <Grid container spacing={3}>
        {/* School Information */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="school_name"
            label="School Name"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="graduation_date"
            label="Graduation Date"
            type="date"
            required
          />
        </Grid>

        {/* School Address */}
        <Grid size={{ xs: 12 }}>
          <TextInput
            name="school_address.street"
            label="School Street Address"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextInput
            name="school_address.city"
            label="City"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextInput
            name="school_address.state"
            label="State"
            defaultValue="Oklahoma"
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextInput
            name="school_address.zip"
            label="ZIP Code"
            required
          />
        </Grid>

        {/* Academic Information */}
        <Grid size={{ xs: 12, md: 4 }}>
          <NumberInput
            name="high_school_gpa"
            label="Grade Point Average"
            step={0.01}
            min={0}
            max={4.0}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <NumberInput
            name="sat_score"
            label="SAT Test Score"
            min={400}
            max={1600}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <NumberInput
            name="act_score"
            label="ACT Test Score"
            min={1}
            max={36}
            required
          />
        </Grid>

        {/* File Uploads */}
        <Grid size={{ xs: 12, md: 6 }}>
          <FileInput
            name="transcript"
            label="Upload High School Transcript"
            required
            // maxSizeMB={50}
            // acceptedTypes={['.pdf', '.doc', '.docx', '.jpg', '.png']}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FileInput
            name="test_scores"
            label="Upload ACT/SAT Scores"
            required
            maxSizeMB={50}
            acceptedTypes={['.pdf', '.doc', '.docx', '.jpg', '.png']}
          />
        </Grid>
      </Grid>
    </FormSection>
  );
};

export default HighSchoolDataStep;
