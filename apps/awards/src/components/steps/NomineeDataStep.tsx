import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { countyOptions } from "../../data/countyOptions";
import { TextInput } from "../_components/TextInput";
import { SelectInput } from "../_components/SelectInput";

// Water/Wastewater System of the Year
  // | 'Excellence in Operations'
  // | 'Excellence in Management'
  // | 'Excellence in Office Operations';
const awardTypeOptions = [
  { value: 'Water/Wastewater System of the Year', label: 'Water/Wastewater System of the Year' },
  { value: 'Excellence in Operations', label: 'Excellence in Operations' },
  { value: 'Excellence in Management', label: 'Excellence in Management' },
  { value: 'Excellence in Office Operations', label: 'Excellence in Office Operations' },
];

const NomineeDataStep: React.FC = () => {

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Nominee Information
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Please provide information about the nominee
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextInput
              label="Nominee Full Name"
              name="nominee_name"
              required
              placeholder="Enter nominee's full name"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <SelectInput
              label="Award Type"
              name="award_type"
              required
              options={awardTypeOptions}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextInput
              label="Email Address"
              name="email"
              type="email"
              required
              placeholder="nominee@example.com"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextInput
              label="Daytime Phone"
              name="daytime_phone"
              required
              placeholder="(555) 123-4567"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextInput
              label="Street Address"
              name="address"
              required
              placeholder="123 Main Street"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextInput
              label="City"
              name="city"
              required
              placeholder="Oklahoma City"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
                <TextInput
              label="State"
              name="state"
              required
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextInput
              label="ZIP Code"
              name="zip"
              required
              placeholder="73101"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <SelectInput
              label="County"
              name="county"
              options={countyOptions}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextInput
              label="Award Year"
              name="award_year"
              type="number" 
              placeholder={new Date().getFullYear().toString()}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default NomineeDataStep;