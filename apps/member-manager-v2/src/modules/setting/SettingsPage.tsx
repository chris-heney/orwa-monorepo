import React, { useEffect, useState } from "react";
import { Create, Edit, SimpleForm } from "react-admin";
import ContactValidate from "../human-resources/contacts/components/ContactValidate";
import ContactFormFields from "../human-resources/contacts/fields/ContactEditFormFields";
import CustomAvatarHeader from "../_components/CustomAvatarHeader";
import { useSettingsContext } from "./SettingsContextProvider";
import { useUserContext } from "../../context/UserContextProvider";
import IContact from "../human-resources/contacts/types/IContact";
import ContactCreateFormFields from "../human-resources/contacts/fields/ContactCreateFields";
import CustomHeader from "../_components/CustomHeader";
import CustomToolBar from "../_components/CustomToolbar";

const SettingsPage = () => {
  const { fetchContact } = useSettingsContext();
  const { user } = useUserContext();

  const [contact, setContact] = useState<IContact>();

  useEffect(() => {
    if (!user) return;
    fetchContact(user).then((data) => {
      setContact(data);
    });
  }, [user]);

  if (!contact && user) {
    return (
      <Create
        resource="contacts"
        title={"Settings"}
        redirect={() => "/admin/settings"}
      >
        <CustomHeader title={`Setup your profile!`} />
        <SimpleForm
          defaultValues={{
            ...user,
            user: user.id,
          }}
          validate={ContactValidate}
        >
          <ContactCreateFormFields />
        </SimpleForm>
      </Create>
    );
  }

  if (!contact) {
    return null;
  }

  return (
    <Edit
      title={"Settings"}
      redirect={false}
      id={contact.id}
      resource={"contacts"}
      actions={false}
    >
      <CustomAvatarHeader
        title={`${contact.first} ${contact.last}`}
        url={`${import.meta.env.VITE_API_ENDPOINT}${
          contact.avatar ? contact.avatar[0].url : null
        }`}
        dashboardButton={false}
      />
      <SimpleForm toolbar={<CustomToolBar />} validate={ContactValidate}>
        <ContactFormFields />
      </SimpleForm>
    </Edit>
  );
};

export default SettingsPage;
