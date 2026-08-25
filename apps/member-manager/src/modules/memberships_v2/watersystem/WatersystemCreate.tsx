import React from "react";
import { Create, SimpleForm } from "react-admin";
import MembershipsContextProvider from "../../memberships_v2/MembershipsContextProvider";
import CustomFormHeader from "../../_components/CustomFormHeader";
import WaterSystemFields from "./components/WaterSystemFields";
import { formResourceShellSx } from "../../../css/formLayout";

const WatersystemCreate = () => {
  return (
    <MembershipsContextProvider>
      <Create
        title="Water Systems"
        redirect={() => "membership-management"}
        component="div"
        sx={formResourceShellSx}
      >
        <SimpleForm sx={{ p: 0, m: 0 }}>
          <CustomFormHeader />
          <WaterSystemFields />
        </SimpleForm>
      </Create>
    </MembershipsContextProvider>
  );
};

export default WatersystemCreate;
