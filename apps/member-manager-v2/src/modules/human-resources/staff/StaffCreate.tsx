import StaffFormFields from "./_components/StaffFormFields";
import React from "react";
import CreateRecordForm from "../../_components/CreateRecordForm";
const StaffCreateForm = () => {
  return (
    <CreateRecordForm redirectPath="/human-resources/dashboard">
      <StaffFormFields />
    </CreateRecordForm>
  );
};

export default StaffCreateForm;
