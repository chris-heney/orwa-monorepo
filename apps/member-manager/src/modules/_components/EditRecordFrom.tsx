import React from "react";
import { Edit, SimpleForm } from "react-admin";
import CustomFormHeader from "./CustomFormHeader";
import { formResourceShellSx } from "../../css/formLayout";
import { useLocation } from "react-router-dom";

const CreateRecordFrom = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const path = location.pathname;
  const resource = path.split("/")[1];
  const redirectPath = `/${resource}`;

  return (
    <Edit title="Edit" redirect="list" component="div" sx={formResourceShellSx}>
      <SimpleForm sx={{ p: 0, m: 0 }}>
        <CustomFormHeader redirectTo={redirectPath} />
        {children}
      </SimpleForm>
    </Edit>
  );
};

export default CreateRecordFrom;
