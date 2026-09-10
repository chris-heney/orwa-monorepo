import React from "react";
import {
  ReferenceField,
  Show,
  SimpleShowLayout,
  useShowController,
} from "react-admin";
import { Box, Divider, Theme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  ContactAvatar,
  ContactEmail,
  ContactFullName,
  ContactPhone,
  ContactTitle,
} from "../contacts/fields";
import ContactVcard from "../contacts/fields/ContactVcard";
import PageHeadingBar from "../../_components/PageHeadingBar";
import { EditAction } from "../../_components/heading/HeadingActions";
import { useCan } from "../../rbac-manager/useCan";

const INSTRUCTORS_HOME = "/admin/settings?tab=training-instructors";

/**
 * `training-instructors` is owned by the Training module, so this stays a
 * plain RA show page — but with the shared heading bar (Edit, then Back
 * far right) instead of the old ShowHeader.
 */
const TrainerShow = () => {
  const { record } = useShowController();
  const navigate = useNavigate();
  const { canOnResource } = useCan();
  const isSmall = useMediaQuery((theme: Theme) => theme.breakpoints.down("sm"));
  if (typeof record === "undefined" || !record) return null;

  return (
    <Show actions={false} title={"Training Instructors"} component="div">
      <PageHeadingBar
        title="Training Instructor"
        actions={
          canOnResource("update", "training-instructors") ? (
            <EditAction
              label="Edit Instructor"
              onClick={() => navigate(`/training-instructors/${record.id}`)}
            />
          ) : undefined
        }
        onBack={() => navigate(INSTRUCTORS_HOME)}
        backLabel="Settings"
      />
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
                  borderTop: "1px solid",
                  borderColor: "divider",
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
