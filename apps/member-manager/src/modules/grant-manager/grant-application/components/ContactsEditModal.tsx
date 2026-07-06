import { Box, Modal } from "@mui/material";
import React from "react";
import {
  Button,
  Edit,
  Identifier,
  RaRecord,
  SaveButton,
  SimpleForm,
  Toolbar,
  useNotify,
  useRecordContext,
  useRefresh,
} from "react-admin";
import UserContextProvider from "../../../../context/UserContextProvider";
import CustomHeader from "../../../_components/CustomHeader";
import ContactValidate from "../../../human-resources/contacts/components/ContactValidate";
import ContactFormFields from "../../../human-resources/contacts/fields/ContactEditFormFields";

const dynamicGridItemProps = {
  xs: 12,
  sm: 12,
  md: 6,
  lg: 6,
};

interface ContactsEditModalProps {
  contactId: Identifier | null;
  onClose: () => void;
}

/** Strapi relation: numeric id or populated { id }. */
function linkedUserIdFromContactRecord(
  record: RaRecord | undefined
): Identifier | undefined {
  const u = record?.user as unknown;
  if (typeof u === "number") {
    return u;
  }
  if (u != null && typeof u === "object" && "id" in u) {
    return (u as { id: Identifier }).id;
  }
  return undefined;
}

/**
 * Loads the contact via <Edit>, applies UserContextProvider when the contact has a linked App user
 * (same pattern as EditHumanResource), so ContactEditFormFields / EditUserModal see the right user.
 */
const ContactsEditFormWithUserContext = ({
  onClose,
}: {
  onClose: () => void;
}) => {
  const record = useRecordContext();
  const linkedUid = linkedUserIdFromContactRecord(record);

  const inner = (
    <>
      <CustomHeader sx={{ textAlign: "center" }} title="Edit contact" />
      <SimpleForm
        validate={ContactValidate}
        toolbar={
          <Toolbar>
            <SaveButton label="Save" />
            <Button label="Cancel" onClick={onClose} type="button" />
          </Toolbar>
        }
        sx={{ maxHeight: "65vh", overflowY: "auto" }}
      >
        <ContactFormFields gridItemProps={dynamicGridItemProps} />
      </SimpleForm>
    </>
  );

  if (linkedUid != null && linkedUid !== "") {
    return <UserContextProvider id={linkedUid}>{inner}</UserContextProvider>;
  }

  return inner;
};

/**
 * Lets <SimpleForm> use Edit save context (RA mutation path, meta).
 */
const ContactsEditModal = ({ contactId, onClose }: ContactsEditModalProps) => {
  const refresh = useRefresh();
  const notify = useNotify();

  const handleMutationSuccess = () => {
    refresh();
    notify("Contact updated", { type: "success" });
    onClose();
  };

  return (
    <Modal
      open={contactId != null}
      onClose={onClose}
      aria-labelledby="edit-contact-modal-title"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80vw",
          maxWidth: "900px",
        }}
      >
        {contactId != null && (
          <Edit
            key={String(contactId)}
            resource="contacts"
            id={contactId}
            actions={false}
            redirect={false}
            sx={{ "& .RaEdit-main": { p: 0 } }}
            mutationMode="pessimistic"
            queryOptions={{
              meta: { raw: true, populate: true },
            }}
            mutationOptions={{
              meta: { raw: true, populate: true },
              onSuccess: handleMutationSuccess,
            }}
          >
            <ContactsEditFormWithUserContext onClose={onClose} />
          </Edit>
        )}
      </Box>
    </Modal>
  );
};

export default ContactsEditModal;
