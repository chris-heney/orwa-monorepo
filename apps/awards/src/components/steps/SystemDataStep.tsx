import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import Grid from "@mui/material/GridLegacy";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { TextInput } from "../_components/TextInput";
import { SelectInput } from "../_components/SelectInput";
import { useFormContext } from "react-hook-form";
import WatersystemAutocomplete from "../_components/WatersystemAutocomplete";

const awardTypeOptions = [
  { value: "System of the Year", label: "System of the Year" },
  { value: "Excellence in Operations", label: "Excellence in Operations" },
  { value: "Excellence in Management", label: "Excellence in Management" },
  {
    value: "Excellence in Office Operations",
    label: "Excellence in Office Operations",
  },
];

const isIndividualAward = (awardType: string | undefined) =>
  awardType === "Excellence in Operations" ||
  awardType === "Excellence in Management" ||
  awardType === "Excellence in Office Operations";

const SystemDataStep: React.FC = () => {
  const { watch, setValue } = useFormContext();
  const awardType = watch("award_type");
  const showEmploymentDate = isIndividualAward(awardType);

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
              <SelectInput
                label="Please select the type of award"
                name="award_type"
                required
                options={awardTypeOptions}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <WatersystemAutocomplete
                label="System Name"
                name="watersystem"
                required
                helperText="ORWA Membership Required. Applicable to ORWA Member System Employees and Directors only. Note: If you do not see your water system listed, please contact your eligible participant's water system and request an ORWA Membership Renewal."
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextInput
                label="System Name (if not in list)"
                name="system_name"
                required
                placeholder="Enter system name"
                helperText="Required if water system is not selected from the list above. NAME MUST BE SPELLED THE WAY YOU WANT IT ON THE AWARD"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <DatePicker
                label="Date System Began Operation"
                value={
                  watch("operation_start_date")
                    ? dayjs(watch("operation_start_date"))
                    : null
                }
                onChange={(newValue) => {
                  handleChange(
                    "operation_start_date",
                    newValue ? newValue.format("YYYY-MM-DD") : null
                  );
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                    required: true,
                  },
                }}
              />
            </Grid>

            {showEmploymentDate && (
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="Date Employed"
                  value={
                    watch("employment_date")
                      ? dayjs(watch("employment_date"))
                      : null
                  }
                  onChange={(newValue) => {
                    handleChange(
                      "employment_date",
                      newValue ? newValue.format("YYYY-MM-DD") : null
                    );
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                      required: true,
                      helperText: "For individual awards only",
                    },
                  }}
                />
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <TextInput
                label="Number of Beginning Meter Connections"
                name="beginning_members"
                type="number"
                required
                placeholder="0"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextInput
                label="Number of Current Meter Connections"
                name="current_members"
                type="number"
                required
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
