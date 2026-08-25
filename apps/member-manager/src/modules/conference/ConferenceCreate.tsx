import React from "react";
import { Create, SimpleForm } from "react-admin";
import ConferenceFields from "./components/ConferenceForm";
import CustomHeader from "../_components/CustomHeader";
import { formResourceShellSx } from "../../css/formLayout";

const ConferenceCreate = () => {
  return (
    <Create title={"Conference Manager"} component="div" sx={formResourceShellSx}>
      <SimpleForm
        warnWhenUnsavedChanges
        sanitizeEmptyValues
        shouldUnregister
        sx={{ backgroundColor: "background.default", m: 0, p: 0 }}
      >
        {" "}
        <CustomHeader title="Create Conference" />
        <ConferenceFields />
      </SimpleForm>
    </Create>
  );
};

export default ConferenceCreate;
