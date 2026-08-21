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
import { contactAvatarSrc } from "../../helpers/contactAvatar";

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
        title="My Profile"
        redirect={() => "/profile"}
        sx={{
          "& .RaCreate-main": { bgcolor: "transparent" },
          "& .RaCreate-card": {
            bgcolor: "background.default",
            boxShadow: "none",
          },
        }}
      >
        <CustomHeader title={`Setup your profile!`} />
        <SimpleForm
          defaultValues={{
            ...user,
            user: user.id,
          }}
          validate={ContactValidate}
          sx={{
            bgcolor: "background.default",
            color: "text.primary",
            "& .MuiCard-root": {
              bgcolor: "background.paper",
              color: "text.primary",
              border: (theme) =>
                theme.palette.mode === "dark"
                  ? `1px solid ${theme.palette.divider}`
                  : undefined,
            },
          }}
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
      title="My Profile"
      redirect={false}
      id={contact.id}
      resource={"contacts"}
      actions={false}
      sx={{
        "& .RaEdit-main": {
          bgcolor: "transparent",
        },
        "& .RaEdit-card": {
          bgcolor: "background.default",
          boxShadow: "none",
        },
      }}
    >
      <CustomAvatarHeader
        title={`${contact.first} ${contact.last}`}
        url={contactAvatarSrc(contact.avatar)}
        dashboardButton={false}
      />
      <SimpleForm
        toolbar={<CustomToolBar />}
        validate={ContactValidate}
        sx={{
          bgcolor: "background.default",
          color: "text.primary",
          "& .MuiCard-root": {
            bgcolor: "background.paper",
            color: "text.primary",
            border: (theme) =>
              theme.palette.mode === "dark"
                ? `1px solid ${theme.palette.divider}`
                : undefined,
          },
        }}
      >
        <ContactFormFields />
      </SimpleForm>
    </Edit>
  );
};

export default SettingsPage;
