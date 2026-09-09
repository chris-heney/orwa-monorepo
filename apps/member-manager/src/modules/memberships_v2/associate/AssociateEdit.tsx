import { EditBase, Title } from "react-admin";
import AssociateForm from "./components/AssociateForm";
import React from "react";
import MembershipsContextProvider from "../MembershipsContextProvider";

const EditAssociateForm = () => {
  return (
    <MembershipsContextProvider>
      <EditBase
        hasShow={false}
        title="Associates"
        redirect={false}
        mutationMode="pessimistic"
      >
        <Title title="Memberships" />
        <AssociateForm />
      </EditBase>
    </MembershipsContextProvider>
  );
};

export default EditAssociateForm;
