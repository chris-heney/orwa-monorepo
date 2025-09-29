import React from "react";
import { Create, SimpleForm } from "react-admin";
import MembershipsContextProvider from "../../memberships_v2/MembershipsContextProvider";
import CustomFormHeader from "../../_components/CustomFormHeader";
import WaterSystemFields from "./components/WaterSystemFields";
import { Card } from "@mui/material";

const WatersystemCreate = () => {
  return (
    <MembershipsContextProvider>
      <Create
        title="Water Systems"
        redirect={() => "membership-management"}
        component="div"
      >
        <SimpleForm
          sx={{
            p: 0,
          }}
        >
          <CustomFormHeader />
          <Card
            sx={{
              borderRadius: 0,
            }}
          >
            <WaterSystemFields />
          </Card>
        </SimpleForm>
      </Create>
    </MembershipsContextProvider>
  );
};

export default WatersystemCreate;
