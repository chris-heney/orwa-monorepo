import { TextAreaInput } from "./_components/TextAreaInput";
import FormSection from "./_components/FormSection";
import FileInput from "./_components/FileInput";

const OtherNeedsStep = () => {

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <FormSection title="Additional Details">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <TextAreaInput
              label="Other Needs"
              name="additional_information"
              helperText="Please describe any other needs or additional information you would like to include in your application."
              
            />
          </div>
          <div className="w-full md:w-1/2 px-3">
            <FileInput 
            label="Additional Files" 
            name="uploaded_additional_files" 
            multiple
            helperText="Please upload any additional files you would like to include in your application."
            />
          </div>
        </div>
           
      </FormSection>
    </div>
  );
};

export default OtherNeedsStep;
