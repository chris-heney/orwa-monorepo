import { useFormContext } from "react-hook-form";
import { TextAreaInput } from "./_components/TextAreaInput";
import { TextInput } from "./_components/TextInput";
import { CheckboxInput } from "./_components/CheckboxInput";
import { SelectInput } from "./_components/SelectInput";
import FormSection from "./_components/FormSection";
import FileInput from "./_components/FileInput";
import { NumberInput } from "./_components/NumberInput";

const StatusImpactStep = () => {

  const { watch } = useFormContext();
  const hasEngineeringReport = watch("engineering_report");
  const resolvesViolation = watch("resolves_violation");

  const satisfyDeqIssue = watch("satisfy_deq_issued_order");

  return (
    <div className="container mx-auto max-w-6xl px-4 ">
      <h2 className="text-2xl  mb-6 ">Status and Impact Details</h2>

      <FormSection title="Engineering Report">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-3 ">
          {/* <CheckboxInput
            label="Has an engineering report been prepared?"
            name="engineering_report"
          /> */}
          {/* Yes No N/A */}
          <SelectInput
            label="Has an engineering report been prepared?"
            source="engineering_report"
            options={[
              { value: "Yes", label: "Yes" },
              { value: "No", label: "No" },
              { value: "N/A", label: "N/A" },
            ]}
            required
          />
          {hasEngineeringReport === "Yes" && (
            <FileInput
              label="Upload Engineering Report"
              name="uploaded_engineering_report"
              required
            />
          )}
          {/* engineering_report_deq_approved */}
          {hasEngineeringReport === "Yes" && (
             <SelectInput
             label="as the engineering report been approved by DEQ?"
             source="engineering_report_deq_approved"
             options={[
               { value: "Yes", label: "Yes" },
               { value: "No", label: "No" },
             ]}
             required
           /> 
          )}
        </div>
      </FormSection>

      <FormSection title="Project Impact">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectInput
            label="Will this project resolve a current/potential violation?"
            source="resolves_violation"
            options={[
              {
                value: "Yes - a current violation",
                label: "Yes - a current violation",
              },
              {
                value: "Yes - a potential violation",
                label: "Yes - a potential violation",
              },
              { value: "No", label: "No" },
            ]}
            required
          />
          {resolvesViolation && resolvesViolation === "Yes - a current violation" && (
            <FileInput
              label="Notice of Violation"
              name="uploaded_notice_of_violation"
              multiple
              required
            />
          )}
        </div>
      </FormSection>

      <FormSection title="Compliance and Funding">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CheckboxInput
            label="Will project satisfy a task on a DEQ issued order?"
            name="satisfy_deq_issued_order"
          />
          {satisfyDeqIssue && <TextInput label="Consent Order Number" name="consent_order_number" required/>}
          {satisfyDeqIssue && <div className="w-full">
            <FileInput label="Consent Order" name="consent_order" required />
          </div>}
        </div>
      </FormSection>

      {/* Sustainability Commitment */}

      <FormSection title="Sustainability Commitment">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CheckboxInput
            label="Is your utility working towards or has it completed a Long Range Sustainability Plan (LRSP) with the Oklahoma Strategic Alliance??"
            name="lrsp_plan"
          />
           <CheckboxInput
            label="Would you like more information about starting a Long Range Sustainability Plan for your utility?"
            name="more_info_lrsp"
          />
        </div>
      </FormSection>

      <FormSection title="Additional Funding">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CheckboxInput 
          label="Money Set Aside" 
          name="money_set_aside" 
          helperText="eg. bank, development/improvement authority, state agency."
          />
          <CheckboxInput
            label="Applied to Other Funding"
            name="applied_to_other_loans"
            helperText="Enter the total amount in this box. If multiple applications have been placed for other loans/grants, please itemize those amounts in the box provided to the left."
          />
     
          {/* Amount of additional funding requested on other loans/grant applications */}
        </div>
        {watch("applied_to_other_loans") && <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <NumberInput
            label="Amount of additional funding requested on other loans/grant applications"
            name="additional_funding_requested"
            mask="currency"
            required={watch("applied_to_other_loans")}
          />
               <TextAreaInput
            label="With which other entities did you apply for loans/grants for this project?"
            name="other_entities"
            required={watch("applied_to_other_loans")}
            rows={1}
          />
        </div>}
      </FormSection>
    </div>
  );
};

export default StatusImpactStep;
