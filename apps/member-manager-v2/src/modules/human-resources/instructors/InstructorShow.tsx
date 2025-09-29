import React from "react";
import {
  ReferenceField,
  Show,
  SimpleShowLayout,
  useShowController,
} from "react-admin";
import { Box, Divider, Theme, useMediaQuery } from "@mui/material";
import {
  ContactAvatar,
  ContactEmail,
  ContactFullName,
  ContactPhone,
  ContactTitle,
} from "../contacts/fields";
import ContactVcard from "../contacts/fields/ContactVcard";
import ShowHeader from "../_components/ShowHeader";

const TrainerShow = () => {
  const { record } = useShowController();
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  if (typeof record === "undefined" || !record) return null;

  return (
    <Show actions={false} title={"Training Instructors"}>
      <ShowHeader first={""} last={""} />
      <SimpleShowLayout>
        <ReferenceField
          reference="contacts"
          source="instructor"
          label=""
          link={false}
        >
          <Box
            sx={{
              textAlign: "center",
              flex: {
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "0.5rem",
                alignItems: "center",
              },
            }}
          >
            <ContactAvatar personId={record.id} />
            <Divider sx={{ my: "1rem", width: "100%" }} />
            <ContactFullName link personId={record.id} instructorLink />
            <ContactTitle />
            {isSmall ? (
              <Box
                sx={{
                  display: "flex",
                  textAlign: "center",
                  borderTop: "1px solid rgba(0, 0, 0, 0.12)",
                  pt: "0.5rem",
                  width: "100%",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <ContactVcard />
                <ContactEmail link icon />
                <ContactPhone link icon />
              </Box>
            ) : (
              <>
                <ContactEmail link />
                <ContactPhone link />
              </>
            )}
          </Box>
        </ReferenceField>
      </SimpleShowLayout>
    </Show>
  );
};

export default TrainerShow;
