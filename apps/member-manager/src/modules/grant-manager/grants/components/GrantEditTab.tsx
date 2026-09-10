import React from "react";
import { Edit, SimpleForm } from "react-admin";
import { useGrantContext } from "../../GrantContextProvider";
import GrantForm from "./GrantForm";

/** Edit tab panel: edit the selected grant in place (no redirect after save). */
const GrantEditTab = () => {
  const { grantId } = useGrantContext();
  return (
    <Edit
      redirect={false}
      component={"div"}
      title={" "}
      id={grantId}
      resource="grants"
    >
      <SimpleForm>
        <GrantForm />
      </SimpleForm>
    </Edit>
  );
};

export default GrantEditTab;
