import React from "react";
import { Create, SimpleForm, useRedirect } from "react-admin";
import ConferenceFields from "./components/ConferenceForm";
import PageHeadingBar from "../_components/PageHeadingBar";
import { formResourceShellSx } from "../../css/formLayout";

const ConferenceCreate = () => {
  const redirect = useRedirect();
  return (
    <Create title={"Conference Manager"} component="div" sx={formResourceShellSx}>
      {/* Back is the far-right action; the bar sits flush on the content. */}
      <PageHeadingBar
        title="Create Conference"
        onBack={() => redirect("/conference/dashboard")}
      />
      <SimpleForm
        warnWhenUnsavedChanges
        sanitizeEmptyValues
        shouldUnregister
        sx={{ backgroundColor: "background.default", m: 0, p: 0 }}
      >
        <ConferenceFields />
      </SimpleForm>
    </Create>
  );
};

export default ConferenceCreate;
