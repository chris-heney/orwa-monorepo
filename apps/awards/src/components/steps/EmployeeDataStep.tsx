import React from "react";
import { Card, CardContent, Typography, Paper } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { TextInput } from "../_components/TextInput";
import { useFormContext } from "react-hook-form";

const EmployeeDataStep: React.FC = () => {

  const { watch } = useFormContext();

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Employee Information
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          Please provide employee count information for the system
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
              <Typography variant="subtitle1" gutterBottom>
                Employee Counts by Department
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Enter the number of employees in each department. Leave blank or enter 0 if not applicable.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextInput
              label="Clerical Employees"
              name="clerical_employees"
              type="number"
              placeholder="0"
              helperText="Number of clerical/administrative staff"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextInput
              label="Operation & Maintenance Employees"
              name="operation_maintenance_employees"
              type="number"
              placeholder="0"
              helperText="Number of O&M staff"
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextInput
              label="Management Employees"
              name="management_employees"
              type="number"
              placeholder="0"
              helperText="Number of management staff"
            />
          </Grid>
          
          <Grid item xs={12}>
            <Paper sx={{ p: 2, backgroundColor: '#e3f2fd' }}>
              <Typography variant="subtitle1" gutterBottom>
                Total Employees
              </Typography>
              <Typography variant="h4" color="primary">
                {(
                  (parseInt(watch("clerical_employees") || "0") || 0) +
                  (parseInt(watch("operation_maintenance_employees") || "0") || 0) +
                  (parseInt(watch("management_employees") || "0") || 0)
                )}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default EmployeeDataStep;
