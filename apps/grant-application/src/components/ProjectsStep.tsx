import { TextAreaInput } from "./_components/TextAreaInput";
import { NumberInput } from "./_components/NumberInput";
import FormSection from "./_components/FormSection";
import FileInput from "./_components/FileInput";
import { useFormContext } from "react-hook-form";
import { useEffect } from "react";

const ProjectStep = () => {

  const { watch, setValue } = useFormContext();

  const combined_cost_of_projects = watch("combined_cost_of_projects");

  useEffect(() => {

    setValue("minimum_utility_financial_contribution", combined_cost_of_projects * .8 > 100000 ? combined_cost_of_projects - 100000 :combined_cost_of_projects * .2 )
    setValue("requested_grant_amount", combined_cost_of_projects * .8 > 100000 ? 100000 : combined_cost_of_projects * .8)

  }, [combined_cost_of_projects])

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <FormSection title="Project Details">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <TextAreaInput
              maxCharCount={650}
              label="Project/Justification/Estimated Cost Description"
              name="description_justification_estimated_cost"
              required
              maxRows={8}
              helperText="Please describe in detail each of the projects selected. If describing multiple projects, please itemize the estimated project cost for each in this box."
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <FileInput 
            label="Upload Project Proposals" 
            name="proposals" 
            multiple
            required
            helperText="Upload Project Proposals/Bids with the total cost for the project listed. Applications with project proposals/bids that do not list the total expected project costs will be placed on hold."
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <NumberInput
              label="Combined Cost of Projects"
              name="combined_cost_of_projects"
              mask="currency"
              required
              helperText="This amount should be supported by submitted project proposals/bids with the total project costs listed including in-kind contributions."
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <NumberInput
              label="Requested Grant Amount"
              name="requested_grant_amount"
              max={100000}
              mask="currency"
              disabled
              helperText="The maximum grant amount is $100,000."
            />
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <NumberInput
              label="Minimum Utility Financial Contribution"
              name="minimum_utility_financial_contribution"
              mask="currency"
              disabled
              helperText="Based on the total cost of the projects listed, the utility must contribute at least this amount towards the completion of the project"
            />
          </div>
        </div>        
      </FormSection>
    </div>
  );
};

export default ProjectStep;
