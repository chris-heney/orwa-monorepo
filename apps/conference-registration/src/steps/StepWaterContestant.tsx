import { useContext } from "react";
import { Divider } from "@mui/material";
import { IRegistrationOptions } from "../types/types";
import { RegistrationOptions } from "../AppContextProvider";
import { FormSection } from "mj-react-form-builder";
import AddRegistrationExtras from "../components/AddRegistrationExtras";
import SelectWatersystem from "../components/_components/SelectWatersystem";

const StepWaterContestant = () => {
  const { ConferenceOptions } =
    useContext<IRegistrationOptions>(RegistrationOptions);

  return !ConferenceOptions ? (
    <>Loading</>
  ) : (
    <div className="container mx-auto max-w-3xl px-4">
      <FormSection title="Water Taste Test Contestant Information">
        <SelectWatersystem />        
        <AddRegistrationExtras field="registrationAddonIds" context="Contestant" />
      </FormSection>
      <Divider />
    </div>
  );
};

export default StepWaterContestant;
