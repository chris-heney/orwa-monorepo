import React from "react";
import { Edit, EditBase, Identifier, SimpleForm, Title } from "react-admin";
import ScheduledEmailTaskFormFields from "./EmailTaskFormFields";
import CustomToolBar from "../../_components/CustomToolbar";
import CustomFormHeader from "../../_components/CustomFormHeader";
import {Card, Grid} from "@mui/material";
import FormConnectedRecipientList from "./components/FormConnectedRecipientList";

interface EmailInterfaceProps {
  id: Identifier;
}

const EditEmailTask = ({ id }: EmailInterfaceProps) => {
  return (
    <EditBase
      resource="scheduled-email-tasks"
      redirect={false}
      component={"div"}
      title={" "}
      id={id}
    >
      <Title title="Email Management" />
      <Card sx={{ p: 0, my: 2, mx: 1 }}>
        <CustomFormHeader
          displayField="name"
          redirectTo="/email-management"
          hasShow
        />
        <SimpleForm toolbar={<CustomToolBar />}>
          <Grid container spacing={2}>
            <Grid xs={12} md={8}>
              <ScheduledEmailTaskFormFields />
            </Grid>
            <Grid xs={12} md={4}>
              <FormConnectedRecipientList maxHeight={600} />
            </Grid>
          </Grid>
        </SimpleForm>
      </Card>
    </EditBase>
  );
};

export default EditEmailTask;
