import React from "react";
import { EditBase, SimpleForm } from "react-admin";
import { positionStickyComponent } from "../../../css";
import CustomToolBar from "../../_components/CustomToolbar";
import ConferenceExtraForm from "./ConferenceExtraForm";
import ConferenceContextProvider from "../ConferenceContext";
import CustomFormHeader from "../../_components/CustomFormHeader";
import { Box, Card } from "@mui/material";

const EditExtra = () => {
  return (
    <ConferenceContextProvider>
        <Box sx={{
            py: 2,
        }}>
      <EditBase
        sx={positionStickyComponent}
        title={" "}
        resource="conference-extras"
        redirect={false}
      >
        <CustomFormHeader
          hasShow={false}
          displayField="name"
          redirectTo="/conference/dashboard"
        />
        <SimpleForm
          sx={{
            p: 0,
          }}
          toolbar={<CustomToolBar />}
        >
          <Card>
            <ConferenceExtraForm />
          </Card>
        </SimpleForm>
      </EditBase>
      </Box>
    </ConferenceContextProvider>
  );
};

export default EditExtra;
