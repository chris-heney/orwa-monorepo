import React from "react";
import { Grid } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { TextInput } from "../_components/TextInput";
import { RadioGroupInput } from "../_components/RadioGroupInput";
import { CheckboxInput } from "../_components/CheckboxInput";
import FormSection from "../_components/FormSection";

const CertificationStep = () => {
  const { watch } = useFormContext();
  const ageConfirm = watch("age_confirm");
  const under18 = ageConfirm === "No, I am under the age of 18";

  const ageConfirmOptions = [
    {
      value: "Yes, I am 18 years or older",
      label: "Yes, I am 18 years or older.",
    },
    {
      value: "No, I am under the age of 18",
      label: "No, I am under the age of 18.",
    },
  ];

  return (
    <FormSection title="Scholarship Application Certification">
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <RadioGroupInput
            name="age_confirm"
            label="Please indicate the following:"
            options={ageConfirmOptions}
            required
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <p className="text-sm font-semibold text-gray-700 text-left mb-2">
            Scholarship Applicant Certification{" "}
            <span className="text-red-500">*</span>
          </p>
          <CheckboxInput
            name="applicant_certification"
            label="I agree"
            required
            helperText="In submitting this application, I certify that the information provided is complete and accurate to the best of my knowledge. False Information will result in the revocation of any scholarship granted. All eligibility requirements must be met."
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextInput
            name="applicant_certification_date"
            label="Date"
            type="date"
            required
            helperText="(Date of submission)"
          />
        </Grid>

        {under18 && (
          <>
            <Grid size={{ xs: 12 }}>
              <p className="text-sm font-semibold text-gray-700 text-left mb-1 mt-4">
                Name of Guardian <span className="text-red-500">*</span>
              </p>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextInput
                name="guardian_name.first"
                label="First"
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextInput
                name="guardian_name.last"
                label="Last"
                required
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <p className="text-sm font-semibold text-gray-700 text-left mb-2 mt-2">
                Applicant&apos;s Guardian Certification (If applicant is under 18){" "}
                <span className="text-red-500">*</span>
              </p>
              <CheckboxInput
                name="guardian_certification"
                label="I/We Certify"
                required
                helperText="In submitting this application, I/we certify that the information provided is complete and accurate to the best of My/Our knowledge. False Information will result in the revocation of any scholarship granted. All eligibility requirements must be met."
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextInput
                name="guardian_certification_date"
                label="Date"
                type="date"
                required
                helperText="(Date of submission)"
              />
            </Grid>
          </>
        )}
      </Grid>
    </FormSection>
  );
};

export default CertificationStep;
