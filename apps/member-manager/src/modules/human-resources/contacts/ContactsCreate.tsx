import React from "react";
import CreateRecordForm from "../../_components/CreateRecordForm";
import ContactCreateFormFields from "./fields/ContactCreateFields";
const ContactsCreate = () => {
  return (
    <CreateRecordForm redirectPath="/human-resources/dashboard">
      <ContactCreateFormFields />
    </CreateRecordForm>
  );
};

export default ContactsCreate;
