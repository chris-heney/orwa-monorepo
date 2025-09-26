import React from 'react';
import { Grid } from '@mui/material';
import SectionHeading from '../_components/SectionHeading';
import { TextInput } from '../_components/TextInput';
import { NumberInput } from '../_components/NumberInput';
import { SelectInput } from '../_components/SelectInput';
import FormSection from '../_components/FormSection';

const CollegeDataStep = () => {
  const firstYearOptions = [
    { value: 'Yes', label: 'Yes' },
    { value: 'No', label: 'No' }
  ];

  const educationTypeOptions = [
    { value: 'FourYearCollege', label: '4-Year College/University' },
    { value: 'TwoYearCollege', label: '2-Year Community/Junior College' },
    { value: 'VocationalSchool', label: 'Vocational Technical School' }
  ];

  return (
    <FormSection title="College/University Data">
      <Grid container spacing={3}>
        {/* First Year Question */}
        <Grid size={{ xs: 12 }}>
          <SelectInput
            name="first_year"
            label="Is this your first year of higher education?"
            options={firstYearOptions}
            required
          />
        </Grid>

        {/* Credit Hours */}
        <Grid size={{ xs: 12, md: 6 }}>
          <NumberInput
            name="credits_completed"
            label="Credit Hours Completed"
            min={0}
            required
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <NumberInput
            name="credits_required"
            label="Credit Hours Required to Graduate"
            min={0}
            required
          />
        </Grid>

        {/* GPA */}
        <Grid size={{ xs: 12, md: 6 }}>
          <NumberInput
            name="college_gpa"
            label="Grade Point Average"
            step={0.01}
            min={0}
            max={4.0}
            required
          />
        </Grid>

        {/* Education Type */}
        <Grid size={{ xs: 12, md: 6 }}>
          <SelectInput
            name="education_type"
            label="Please indicate your education"
            options={educationTypeOptions}
            required
          />
        </Grid>

        {/* Major */}
        <Grid size={{ xs: 12 }}>
          <TextInput
            name="major"
            label="Major Course of Study"
            helperText="Priority given to water-related studies."
          />
        </Grid>
      </Grid>
    </FormSection>
  );
};

export default CollegeDataStep;
