import React from "react";
import { Grid } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { TextInput } from "../_components/TextInput";
import { NumberInput } from "../_components/NumberInput";
import { RadioGroupInput } from "../_components/RadioGroupInput";
import FormSection from "../_components/FormSection";

const CollegeDataStep = () => {
  const { watch } = useFormContext();
  const firstYear = watch("first_year");
  const showCreditsCompleted = firstYear === "No";

  const firstYearOptions = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
  ];

  const educationTypeOptions = [
    { value: "FourYearCollege", label: "4 - Year College/University" },
    { value: "TwoYearCollege", label: "2 - Year Community/Junior College" },
    { value: "VocationalSchool", label: "Vocational Technical School" },
  ];

  return (
    <FormSection title="College/University Data">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <RadioGroupInput
            name="first_year"
            label="Is this your first year of higher education?"
            options={firstYearOptions}
            required
          />
        </Grid>

        {showCreditsCompleted && (
          <Grid size={{ xs: 12, md: 6 }}>
            <NumberInput
              name="credits_completed"
              label="Credit hours completed:"
              min={0}
              required
            />
          </Grid>
        )}
        <Grid size={{ xs: 12, md: showCreditsCompleted ? 6 : 12 }}>
          <NumberInput
            name="credits_required"
            label="Number of credit hours required to graduate:"
            min={0}
            required
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <NumberInput
            name="college_gpa"
            label="Grade Point Average:"
            step={0.01}
            min={0}
            max={4.0}
            required
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <RadioGroupInput
            name="education_type"
            label="Please indicate your education:"
            options={educationTypeOptions}
            required
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextInput
            name="major"
            label="Major Course of Study:"
            required
            helperText="(Priority will be given, but not limited to water related studies.)"
          />
        </Grid>
      </Grid>
    </FormSection>
  );
};

export default CollegeDataStep;
