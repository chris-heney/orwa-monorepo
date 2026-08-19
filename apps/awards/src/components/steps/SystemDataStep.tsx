import React, { useEffect } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { TextInput } from "../_components/TextInput";
import { SelectInput } from "../_components/SelectInput";
import { useFormContext } from "react-hook-form";
import WatersystemAutocomplete from "../_components/WatersystemAutocomplete";
import AwardNamePrintedField from "../_components/AwardNamePrintedField";
import { isSystemOfTheYearAward } from "../../helpers/awardType";

const awardTypeOptions = [
  { value: "System of the Year", label: "System of the Year" },
  { value: "Excellence in Operations", label: "Excellence in Operations" },
  { value: "Excellence in Management", label: "Excellence in Management" },
  {
    value: "Excellence in Office Operations",
    label: "Excellence in Office Operations",
  },
];

const EMPLOYEE_FIELDS = [
  "clerical_employees",
  "operation_maintenance_employees",
  "management_employees",
] as const;

const isIndividualAward = (awardType: string | undefined) =>
  !isSystemOfTheYearAward(awardType) && Boolean(awardType);

const FieldPair: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start md:gap-6">
    {children}
  </div>
);

const SystemDataStep: React.FC = () => {
  const { watch, setValue, register, unregister } = useFormContext();
  const awardType = watch("award_type");
  const showEmploymentDate = isIndividualAward(awardType);
  const showPrintedSystemName = isSystemOfTheYearAward(awardType);
  const showEmployeeCounts = isSystemOfTheYearAward(awardType);

  const handleChange = (name: string, value: string | null) => {
    setValue(name, value);
  };

  useEffect(() => {
    if (showEmployeeCounts) return;
    for (const field of EMPLOYEE_FIELDS) {
      unregister(field);
      setValue(field, 0, { shouldDirty: false, shouldValidate: false });
    }
  }, [setValue, showEmployeeCounts, unregister]);

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

          <div className="flex flex-col gap-6">
            <FieldPair>
              <SelectInput
                label="Please select the type of award"
                name="award_type"
                required
                options={awardTypeOptions}
              />
              <WatersystemAutocomplete
                label="System Name"
                name="watersystem"
                required
                helperText="ORWA Membership Required. Applicable to ORWA Member System Employees and Directors only. Note: If you do not see your water system listed, please contact your eligible participant's water system and request an ORWA Membership Renewal."
              />
            </FieldPair>

            <input type="hidden" {...register("system_name")} />
            <AwardNamePrintedField visible={showPrintedSystemName} />

            <FieldPair>
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
              {showEmploymentDate ? (
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
              ) : (
                <div aria-hidden className="hidden md:block" />
              )}
            </FieldPair>

            <FieldPair>
              <TextInput
                label="Number of Beginning Meter Connections"
                name="beginning_members"
                type="number"
                required
                placeholder="0"
              />
              <TextInput
                label="Number of Current Meter Connections"
                name="current_members"
                type="number"
                required
                placeholder="0"
              />
            </FieldPair>

            {showEmployeeCounts && (
              <div className="flex flex-col gap-4">
                <div className="rounded-lg bg-gray-100 p-4 text-left">
                  <p className="m-0 text-base font-semibold text-gray-800">
                    Employee Counts by Department
                  </p>
                  <p className="mt-1 mb-0 text-sm text-gray-600">
                    Enter the number of employees in each department. Leave
                    blank or enter 0 if not applicable.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:items-start">
                  <TextInput
                    label="Clerical Employees"
                    name="clerical_employees"
                    type="number"
                    required
                    placeholder="0"
                    helperText="The number of system employees"
                  />
                  <TextInput
                    label="Operation & Maintenance Employees"
                    name="operation_maintenance_employees"
                    type="number"
                    required
                    placeholder="0"
                    helperText="The number of system employees"
                  />
                  <TextInput
                    label="Management Employees"
                    name="management_employees"
                    type="number"
                    required
                    placeholder="0"
                    helperText="The number of system employees"
                  />
                </div>
                <div className="rounded-lg bg-blue-50 p-4 text-left">
                  <p className="m-0 text-base font-semibold text-gray-800">
                    Total Employees
                  </p>
                  <p className="mt-1 mb-0 text-3xl font-semibold text-blue-700">
                    {(parseInt(watch("clerical_employees") || "0") || 0) +
                      (parseInt(
                        watch("operation_maintenance_employees") || "0"
                      ) || 0) +
                      (parseInt(watch("management_employees") || "0") || 0)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </LocalizationProvider>
  );
};

export default SystemDataStep;
