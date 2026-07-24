import { TextAreaInput } from "./_components/TextAreaInput";
import FormSection from "./_components/FormSection";
import StepShell from "./_components/StepShell";
import FileInput from "./_components/FileInput";
import { ValidationHighlight } from "../helpers/validationHighlight";

const OtherNeedsStep = () => {
  return (
    <StepShell
      title="Other Needs"
      description="Optional — share anything else that should be considered with this application."
    >
      <ValidationHighlight field="other">
        <FormSection title="Additional details">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <TextAreaInput
              label="Other Needs"
              name="additional_information"
              helperText="Describe any other needs or information to include."
            />
            <FileInput
              label="Additional Files"
              name="uploaded_additional_files"
              multiple
              helperText="Upload any additional supporting files."
            />
          </div>
        </FormSection>
      </ValidationHighlight>
    </StepShell>
  );
};

export default OtherNeedsStep;
