import { useContext } from "react";
import { Divider } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { IRegistrationOptions } from "../types/types";
import { RegistrationOptions } from "../AppContextProvider";
import { FormSection } from "mj-react-form-builder";
import AddRegistrationExtras from "../components/AddRegistrationExtras";
import SelectWatersystem from "../components/_components/SelectWatersystem";
import { ValidationHighlight } from "../helpers/validationHighlight";

const StepWaterContestant = () => {
  const { ConferenceOptions } =
    useContext<IRegistrationOptions>(RegistrationOptions);
  const { watch } = useFormContext();
  const addonIds = watch("registrationAddonIds") || [];

  return !ConferenceOptions ? (
    <>Loading</>
  ) : (
    <div className="container mx-auto max-w-3xl px-4">
      <FormSection title="Water Taste Test Contestant Information">
        <SelectWatersystem />
        <ValidationHighlight
          field="contestants"
          className="p-2"
          clearWhen={addonIds.length > 0}
        >
          <AddRegistrationExtras
            field="registrationAddonIds"
            context="Contestant"
          />
        </ValidationHighlight>
      </FormSection>
      <Divider />
    </div>
  );
};

export default StepWaterContestant;
