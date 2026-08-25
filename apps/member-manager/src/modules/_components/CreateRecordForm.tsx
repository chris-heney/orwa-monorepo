import React from "react";
import {
  Create,
  RedirectionSideEffect,
  SimpleForm,
} from "react-admin";
import CustomFormHeader from "./CustomFormHeader";
import { formResourceShellSx } from "../../css/formLayout";

const CreateRecordForm = ({
  children,
  redirectPath,
  redirectOnSave,
}: {
  children: React.ReactNode;
  redirectOnSave?: RedirectionSideEffect;
  redirectPath: string;
}) => {
  return (
    <Create
      component="div"
      sx={formResourceShellSx}
      redirect={redirectOnSave ?? "edit"}
    >
      <SimpleForm sx={{ p: 0, m: 0 }}>
        <CustomFormHeader redirectTo={redirectPath} hasShow={false} />
        {children}
      </SimpleForm>
    </Create>
  );
};

export default CreateRecordForm;
