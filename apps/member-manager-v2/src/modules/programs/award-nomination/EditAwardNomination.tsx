import React from "react";
import { EditBase, SimpleForm, Title } from "react-admin";
import { Box, Card } from "@mui/material";
import CustomFormHeader from "../../_components/CustomFormHeader";
import CustomToolBar from "../../_components/CustomToolbar";
import AwardFormFields from "./components/AwardFormFields";

const EditAwardNomination = () => {
  return (
    <Box sx={{ py: 2 }}>
      <EditBase title="Edit Award Nomination" redirect="show">
        <Card sx={{ borderRadius: 0 }}>
          <Title title="Award Nomination Edit" />
          <CustomFormHeader
            displayField={(record: any) => 
              `${record?.nominee_name} - ${record?.award_type}`
            }
            redirectTo="/award-nominations"
          />
          <SimpleForm toolbar={<CustomToolBar />}>
            <AwardFormFields />
          </SimpleForm>
        </Card>
      </EditBase>
    </Box>
  );
};

export default EditAwardNomination;
