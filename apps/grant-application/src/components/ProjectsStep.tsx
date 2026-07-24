import { TextAreaInput } from "./_components/TextAreaInput";
import { NumberInput } from "./_components/NumberInput";
import FormSection from "./_components/FormSection";
import StepShell from "./_components/StepShell";
import FileInput from "./_components/FileInput";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";
import { ValidationHighlight } from "../helpers/validationHighlight";

const ProjectStep = () => {
  const { watch, setValue } = useFormContext();
  const combined_cost_of_projects = watch("combined_cost_of_projects");

  useEffect(() => {
    setValue(
      "minimum_utility_financial_contribution",
      combined_cost_of_projects * 0.8 > 100000
        ? combined_cost_of_projects - 100000
        : combined_cost_of_projects * 0.2
    );
    setValue(
      "requested_grant_amount",
      combined_cost_of_projects * 0.8 > 100000
        ? 100000
        : combined_cost_of_projects * 0.8
    );
  }, [combined_cost_of_projects, setValue]);

  return (
    <StepShell
      title="Project Details"
      description="Describe each selected project, upload proposals/bids with total costs, and confirm funding amounts."
    >
      <ValidationHighlight field="projects">
        <FormSection title="Description & proposals">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextAreaInput
              maxCharCount={650}
              label="Project/Justification/Estimated Cost Description"
              name="description_justification_estimated_cost"
              required
              maxRows={8}
              helperText="Describe each selected project in detail. If multiple, itemize estimated cost for each."
            />
            <FileInput
              label="Upload Project Proposals"
              name="proposals"
              multiple
              required
              helperText="Upload proposals/bids that list total expected project costs. Missing totals will place the application on hold."
            />
          </div>
        </FormSection>

        <FormSection title="Costs">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <NumberInput
              label="Combined Cost of Projects"
              name="combined_cost_of_projects"
              mask="currency"
              required
              helperText="Supported by submitted proposals/bids including in-kind contributions."
            />
            <NumberInput
              label="Requested Grant Amount"
              name="requested_grant_amount"
              max={100000}
              mask="currency"
              disabled
              helperText="The maximum grant amount is $100,000."
            />
            <NumberInput
              label="Minimum Utility Financial Contribution"
              name="minimum_utility_financial_contribution"
              mask="currency"
              disabled
              helperText="Minimum utility contribution based on total project cost."
            />
          </div>
        </FormSection>
      </ValidationHighlight>
    </StepShell>
  );
};

export default ProjectStep;
