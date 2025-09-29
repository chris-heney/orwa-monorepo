import React from "react";
import { Create, SimpleForm } from "react-admin";
import ConferenceFields from "./components/ConferenceForm";
import CustomHeader from "../_components/CustomHeader";

const ConferenceCreate = () => {
  return (
    <Create title={"Conference Manager"} component="div">
      <SimpleForm
        warnWhenUnsavedChanges
        sanitizeEmptyValues
        shouldUnregister
        sx={{ backgroundColor: "#fafafb", m: 0, p: 0 }}
      >
        {" "}
        <CustomHeader title="Create Conference" />
        <ConferenceFields />
      </SimpleForm>
    </Create>
  );
};

export default ConferenceCreate;
