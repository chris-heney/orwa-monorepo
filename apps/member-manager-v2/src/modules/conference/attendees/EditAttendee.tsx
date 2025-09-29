import React from "react";
import CustomToolBar from "../../_components/CustomToolbar";
import { EditBase, SimpleForm,Title } from "react-admin";
import { ConferenceAttendeeFields } from "./AttendeeFormFields";
import ConferenceContextProvider from "../ConferenceContext";
import CustomFormHeader from "../../_components/CustomFormHeader";

const EditAttendee = () => {
  return (
    <ConferenceContextProvider>
      <EditBase
        component={"div"}
        title=" "
        resource="conference-attendees"
        redirect={false}
      >
        <CustomFormHeader
        hasShow={false}
        displayField="email"
        redirectTo="/conference/dashboard"
        sx={{
          mt: 2,
        }}
      />
      <Title title="Edit Attendee" />
        <SimpleForm 
        sx={{ p: 0, borderRadius: 0 }}
        toolbar={<CustomToolBar />}>
          <ConferenceAttendeeFields context="edit" />
        </SimpleForm>
      </EditBase>
    </ConferenceContextProvider>
  );
};

export default EditAttendee;
