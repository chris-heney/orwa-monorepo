import { EditBase, SimpleForm, Title } from "react-admin";
import React from "react";
import GrantApplicationFormFields from "./components/ApplicationFormFields";
import CustomFormHeader from "../../_components/CustomFormHeader";
import { Box, Card } from "@mui/material";
import CustomToolBar from "../../_components/CustomToolbar";

const GrantApplicationEditForm = () => {
  return (
    <Box
      sx={{
        py: 2,
      }}
    >
      <EditBase title="Edit Grant Application" redirect="show">  
        <Card
          sx={{
            borderRadius: 0,
          }}
        >     
          <Title title="Grant Application Edit" />
          <CustomFormHeader
            displayField="legal_entity_name"
            redirectTo="/grant/dashboard"
          />
          <SimpleForm toolbar={<CustomToolBar/>} >
            <GrantApplicationFormFields />
          </SimpleForm>
        </Card>
      </EditBase>
    </Box>
  );
};

export default GrantApplicationEditForm;
