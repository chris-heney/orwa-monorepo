import { EditBase, Title } from "react-admin";
import AssociateForm from "./components/AssociateForm";
import React from "react";
import MembershipsContextProvider from "../MembershipsContextProvider";
import { Box } from "@mui/material";

const EditAssociateForm = () => {
  return (
    <MembershipsContextProvider>
      <Box sx={{ py: 2 }}>
      <EditBase
        hasShow={false}
        title="Associates"
        redirect={false}
        mutationMode="pessimistic"
      >
        <Title title="Memberships" />
        <AssociateForm />
      </EditBase>
      </Box>
    </MembershipsContextProvider>
  );
};

export default EditAssociateForm;
