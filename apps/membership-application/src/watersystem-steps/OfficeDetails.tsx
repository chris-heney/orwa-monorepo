import {
  FormSection,
  MaskedPhoneInput,
  SelectInput,
  TextInput,
} from "mj-react-form-builder";
import { MaskedFaxInput } from "../components/MaskedFaxInput";

const OfficeDetails = () => {
  return (
    <div className="container mx-auto max-w-6xl px-4">
      <p className="text-red-600 text-xs md:text-sm text-left py-2">
        Fields marked with * are required
      </p>
      <FormSection title="Office Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextInput source="office_hours" label="Office Hours" required />
          <TextInput
            source="board_meeting"
            label="Board Meeting"
            required
            helperText="Please provide when your board meetings are held."
          />
          <MaskedPhoneInput source="phone" required />
          <MaskedFaxInput source="fax" required />
          <TextInput source="url" label="URL" />
          <TextInput source="email" label="Email" required />
          <SelectInput
            options={[
              { value: "Mail", label: "Mail" },
              { value: "Digital", label: "Digital" },
              { value: "Both", label: "Both" },
              { value: "None", label: "None" },
            ]}
            source="membership_directory_type"
            label="How would you like to receive the ORWA Membership Directory?"
            required
          />
        </div>
      </FormSection>
    </div>
  );
};

export default OfficeDetails;
