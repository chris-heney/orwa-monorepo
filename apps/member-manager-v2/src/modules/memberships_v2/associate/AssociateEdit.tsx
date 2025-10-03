import { EditBase, Title } from "react-admin";
import AssociateForm from "./components/AssociateForm";
import React from "react";
import MembershipsContextProvider from "../MembershipsContextProvider";
import { Box } from "@mui/material";

const EditAssociateForm = () => {
  return (
    <MembershipsContextProvider>
      <EditBase hasShow={false} title="Associates" redirect={false}>
        <Title title="Memberships" />
        <AssociateForm />
      </EditBase>
    </MembershipsContextProvider>
  );
};

export default EditAssociateForm;
