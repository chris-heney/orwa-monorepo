import React from "react";
import InstructorCertficationFormFields from "./components/InstructorCertficationFormFields";
import CreateRecordForm from "../../_components/CreateRecordForm";
const CreateInstructorCertification = () => {
  return (
    <CreateRecordForm redirectPath="/human-resources/dashboard">
      <InstructorCertficationFormFields />
    </CreateRecordForm>
  );
};

export default CreateInstructorCertification;
