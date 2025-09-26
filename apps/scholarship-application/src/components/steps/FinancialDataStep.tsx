import React from 'react';
import { Grid } from '@mui/material';
import SectionHeading from '../_components/SectionHeading';
import { TextInput } from '../_components/TextInput';
import { NumberInput } from '../_components/NumberInput';
import FormSection from '../_components/FormSection';

const FinancialDataStep = () => {
  return (
    <FormSection title="Financial Data">
      {/* description="List other financial aid, including ORWEF scholarships." */}
      <Grid container spacing={3}>
        {/* First Financial Aid */}
        <Grid size={{ xs: 12 }}>
          <h3 className="text-lg font-semibold mb-4">Financial Aid #1</h3>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="financial1_institution"
            label="Institution"
            placeholder="Name of institution providing financial aid"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <NumberInput
            name="financial1_amount"
            label="Amount ($)"
            min={0}
            step={0.01}
          />
        </Grid>

        {/* Second Financial Aid */}
        <Grid size={{ xs: 12 }}>
          <h3 className="text-lg font-semibold mb-4 mt-6">Financial Aid #2</h3>
        </Grid>
        
        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="financial2_institution"
            label="Institution"
            placeholder="Name of institution providing financial aid"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <NumberInput
            name="financial2_amount"
            label="Amount ($)"
            min={0}
            step={0.01}
          />
        </Grid>
      </Grid>
    </FormSection>
  );
};

export default FinancialDataStep;
