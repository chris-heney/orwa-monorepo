import React from "react";
import { Grid } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { TextInput } from "../_components/TextInput";
import MaskedPhoneInput from "../_components/MaskedPhoneInput";
import { SelectInput } from "../_components/SelectInput";
import { RadioGroupInput } from "../_components/RadioGroupInput";
import WatersystemAutocomplete from "../_components/WatersystemAutocomplete";
import FormSection from "../_components/FormSection";
import { stateOptions } from "../../data/stateOptions";

const EligibilityStep = () => {
  const { watch } = useFormContext();
  const relationship = watch("relationship");
  const isSelf = relationship === "Self";

  const relationshipOptions = [
    { value: "Self", label: "Self (Water System Employee or Director)" },
    { value: "DependentChild", label: "Dependent Child" },
    { value: "DependentGrandchild", label: "Dependent Grandchild" },
  ];

  return (
    <FormSection
      title="Eligibility Criteria (refer to official rules)"
      description="Eligible participant: Member System employees, directors or their dependent children or grandchildren. Not eligible for schools, fire depts or police depts."
    >
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <WatersystemAutocomplete
            name="system_name"
            label="System Name"
            required
            helperText="ORWA Membership Required. Applicable to ORWA Member System Employees, Directors, or their dependent children or grandchildren. Note: If you do not see your water system listed, please contact your eligible participant's water system and request an ORWA Membership Renewal."
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <RadioGroupInput
            name="relationship"
            label="Eligible Participant's Relationship to Applicant"
            options={relationshipOptions}
            required
          />
        </Grid>

        {!isSelf && (
          <>
            <Grid size={{ xs: 12 }}>
              <p className="text-sm font-semibold text-gray-700 text-left mb-1">
                Eligible Participant Name: (member system director or employee){" "}
                <span className="text-red-500">*</span>
              </p>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextInput
                name="eligible_participant_name.first"
                label="First"
                required
                helperText="Director or Employee of the Water System holding an ORWA Membership."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextInput name="eligible_participant_name.last" label="Last" required />
            </Grid>
          </>
        )}

        <Grid size={{ xs: 12 }}>
          <TextInput
            name="eligible_participant_title"
            label="Eligible Participant Title: (member system director or employee)"
            required
            helperText="Director or Employee of the Water System holding an ORWA Membership."
          />
        </Grid>

        {!isSelf && (
          <>
            <Grid size={{ xs: 12 }}>
              <p className="text-sm font-semibold text-gray-700 text-left mb-1">
                Eligible Participant Address: (member system director or employee){" "}
                <span className="text-red-500">*</span>
              </p>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextInput
                name="eligible_participant_address.street"
                label="Street Address"
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextInput
                name="eligible_participant_address.city"
                label="City"
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <SelectInput
                name="eligible_participant_address.state"
                label="State"
                options={stateOptions}
                required
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextInput
                name="eligible_participant_address.zip"
                label="ZIP Code"
                required
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <MaskedPhoneInput
                name="eligible_participant_phone"
                label="Eligible Participant Phone Number"
                required
                helperText="Member system director or employee."
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextInput
                name="eligible_participant_email"
                label="Eligible Participant Email"
                type="email"
                required
                helperText="Member system director or employee."
              />
            </Grid>
          </>
        )}
      </Grid>
    </FormSection>
  );
};

export default EligibilityStep;
