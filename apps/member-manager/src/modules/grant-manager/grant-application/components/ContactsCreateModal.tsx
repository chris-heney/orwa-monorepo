import { Box, Modal } from "@mui/material";
import React from "react";
import {
  Create,
  DataProvider,
  Identifier,
  RaRecord,
  SaveButton,
  SimpleForm,
  Toolbar,
  useDataProvider,
  useNotify,
  useRefresh,
} from "react-admin";
import CustomHeader from "../../../_components/CustomHeader";
import ContactCreateFormFields from "../../../human-resources/contacts/fields/ContactCreateFields";
import { formatTitle } from "../../../../helpers/formatResourceTitle";
import { toRelationWriteId, toRelationWriteIds } from "../../../../helpers/strapiIds";

async function appendContactToWatersystem(
  dataProvider: DataProvider,
  watersystemId: Identifier,
  newContactId: Identifier
): Promise<void> {
  const meta = { raw: true, populate: ["contacts"] };
  const { data: ws } = await dataProvider.getOne("watersystems", {
    id: watersystemId,
    meta,
  });
  const raw = (ws as RaRecord).contacts;
  const ids = toRelationWriteIds(raw);
  const next = toRelationWriteId(newContactId);
  const nextIds = Array.from(new Set([...ids, ...(next != null ? [next] : [])]));
  await dataProvider.update("watersystems", {
    id: watersystemId,
    previousData: ws,
    data: { contacts: nextIds },
    meta,
  });
}

interface ContactsModalFormProps {
  createContact: boolean;
  setCreateContact: React.Dispatch<React.SetStateAction<boolean>>;
  defaultValues?: Record<string, unknown>;
  /** If set, after create the new contact id is merged into this water system’s `contacts` relation. */
  linkToWatersystemId?: Identifier | null;
  onCloseComplete?: () => void;
}

const ContactsCreateModal = ({
  createContact,
  setCreateContact,
  defaultValues = {},
  linkToWatersystemId = null,
  onCloseComplete,
}: ContactsModalFormProps) => {
  const dynamicGridItemProps = {
    xs: 12,
    sm: 12,
    md: 6,
    lg: 6,
  };

  const notify = useNotify();
  const dataProvider = useDataProvider();
  const refresh = useRefresh();

  const findDuplicateEmail = async (email: string) => {
    try {
      const { data: contacts } = await dataProvider.getList("contacts", {
        pagination: { page: 1, perPage: 1 },
        filter: { email },
        sort: { field: "id", order: "ASC" },
      });

      return contacts.length > 0;
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return false;
    }
  };

  const handleDismiss = () => {
    setCreateContact(false);
    onCloseComplete?.();
  };

  return (
    <Modal
      open={createContact}
      onClose={handleDismiss}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80vw",
        }}
      >
        {createContact && (
          <Create resource="contacts" redirect={false} title=" ">
            <CustomHeader sx={{ textAlign: "center" }} title="Create Contact" />
            <SimpleForm
              defaultValues={defaultValues}
              onSubmit={async (data) => {
                const email = typeof data.email === "string" ? data.email : "";
                const isDuplicate = email
                  ? await findDuplicateEmail(email)
                  : false;
                if (isDuplicate) {
                  notify("A contact with this email already exists.", {
                    type: "warning",
                  });
                  return;
                }

                const linkId = linkToWatersystemId;

                try {
                  const { data: created } = await dataProvider.create(
                    "contacts",
                    {
                      data,
                      meta: { raw: true, populate: true },
                    }
                  );

                  if (linkId != null && created?.id != null) {
                    await appendContactToWatersystem(
                      dataProvider,
                      linkId,
                      created.id
                    );
                  }

                  notify(`${formatTitle("contacts")} was Created`, {
                    type: "success",
                  });
                  setCreateContact(false);
                  onCloseComplete?.();
                  refresh();
                } catch (error) {
                  console.error("Error creating contact:", error);
                  notify(`Error creating Contact`, { type: "error" });
                }
              }}
              toolbar={
                <Toolbar>
                  <SaveButton label="Save" />
                </Toolbar>
              }
              sx={{ maxHeight: "60vh", overflowY: "scroll" }}
            >
              <ContactCreateFormFields gridItemProps={dynamicGridItemProps} />
            </SimpleForm>
          </Create>
        )}
      </Box>
    </Modal>
  );
};

export default ContactsCreateModal;
