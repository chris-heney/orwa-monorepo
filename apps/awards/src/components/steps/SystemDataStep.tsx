import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { TextInput } from "../_components/TextInput";
import { useFormContext } from "react-hook-form";
import WatersystemAutocomplete from "../_components/WatersystemAutocomplete";

const SystemDataStep: React.FC = () => {

  const { watch, setValue } = useFormContext();
  
  
  const handleChange = (name: string, value: string | null) => {
    setValue(name, value);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            System Information
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Please provide information about the water system
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <WatersystemAutocomplete
                label="Water System"
                name="watersystem"
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextInput
                label="System Name (if not in list)"
                name="system_name"
                required
                placeholder="Enter system name"
                helperText="Required if water system is not selected from the list above"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Operation Start Date"
                value={watch("operation_start_date") ? dayjs(watch("operation_start_date")) : null}
                onChange={(newValue) => {
                  handleChange("operation_start_date", newValue ? newValue.format('YYYY-MM-DD') : null);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Employment Date (if applicable)"
                value={watch("employment_date") ? dayjs(watch("employment_date")) : null}
                onChange={(newValue) => {
                  handleChange("employment_date", newValue ? newValue.format('YYYY-MM-DD') : null);
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                    helperText: "For individual awards only"
                  }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextInput
                label="Current Members Served"
                name="current_members"
                type="number"
                placeholder="0"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextInput
                label="Beginning Members Served"
                name="beginning_members"
                type="number"
                placeholder="0"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default SystemDataStep;