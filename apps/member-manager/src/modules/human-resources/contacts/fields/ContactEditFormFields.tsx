import React, { useState } from "react";
import {
  Box,
  Card,
  Divider,
  Grid,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  BooleanInput,
  SelectInput,
  TextInput,
  useRecordContext,
} from "react-admin";
import { useWatch } from "react-hook-form";
import CustomPhoneInput from "../../../_components/MaskedPhoneInput";
import BadgeGrid from "../badges/BadgeGrid";
import AssignBadgesList from "../badges/AssignBadgesList";
import SendResetPasswordButton from "../../_components/SendResetPasswordButton";
import EditUserModal from "../../users/EditUserModal";
import { useUserContext } from "../../../../context/UserContextProvider";
import { Edit } from "@mui/icons-material";
import FileUploadField from "../../../_components/FileUploadField";
import useCurrentUser from "../../../_helpers/useCurrentUser";
import { StateChoices } from "../../../../helpers/Data";
import { WATERSYSTEM_DIRECTORY_TITLE_CHOICES } from "../constants/watersystemDirectoryTitles";

interface ContactFormProps {
  gridItemProps?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
}

const directoryTitleHelper =
  "Required if you enter any information for this contact";

const ContactFormFields = ({ gridItemProps = {} }: ContactFormProps) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const defaultGridItemProps = {
    xs: 12,
    sm: 12,
    md: 6,
    lg: 6,
  };
  const mergedGridItemProps = { ...defaultGridItemProps, ...gridItemProps };
  const record = useRecordContext();
  const { user } = useUserContext();
  const { role } = useCurrentUser();
  const badges = record.badges;

  const contactType = useWatch({ name: "contact_type" });
  const effectiveContactType = contactType ?? record?.contact_type;

  const handleEditModalOpen = () => setEditModalOpen(true);
  const handleEditModalClose = () => setEditModalOpen(false);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item {...mergedGridItemProps}>
          <Card sx={{ p: 3, my: 2, boxShadow: "none" }}>
            {user && user.email && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography variant="h5">Contact Information</Typography>
                <Box>
                  <SendResetPasswordButton isSmall email={record.email} />
                  {role === "Admin" &&
                    typeof record.user === "number" && (
                      <Tooltip title="Edit User">
                        <IconButton
                          sx={{ ml: 2 }}
                          onClick={handleEditModalOpen}
                          size="small"
                        >
                          <Edit fontSize="small" color="primary" />
                        </IconButton>
                      </Tooltip>
                    )}
                </Box>
              </Box>
            )}
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <SelectInput
                  source="contact_type"
                  label="Type"
                  choices={[
                    { id: "watersystem", name: "Water System" },
                    { id: "associate", name: "Associate" },
                    { id: "instructor", name: "Instructor" },
                    { id: "staff", name: "Staff" },
                    { id: "administrator", name: "Administrator" },
                  ]}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                {effectiveContactType === "watersystem" ? (
                  <SelectInput
                    source="title"
                    label="Title (directory)"
                    choices={[...WATERSYSTEM_DIRECTORY_TITLE_CHOICES]}
                    fullWidth
                    helperText={directoryTitleHelper}
                  />
                ) : (
                  <TextInput source="title" label="Title" fullWidth />
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextInput source="first" label="First Name" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextInput source="last" label="Last Name" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextInput source="email" label="Email" fullWidth />
              </Grid>
              <Grid item xs={12} sm={6}>
                <CustomPhoneInput source="phone" label="Phone" fullWidth />
              </Grid>
              {effectiveContactType === "watersystem" && (
                <Grid item xs={12}>
                  <BooleanInput
                    source="directory_opt_out"
                    label="Opt out of ORWA directory"
                    helperText="When enabled, this contact stays on file but is not published in the membership directory."
                  />
                </Grid>
              )}
            </Grid>
          </Card>
          <Card sx={{ p: 3, my: 2, boxShadow: "none" }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Mailing address (directory)
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextInput
                  source="address_mailing_line1"
                  label="Street / PO Box"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextInput
                  source="address_mailing_line2"
                  label="Line two"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextInput
                  source="address_mailing_city"
                  label="City"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <SelectInput
                  source="address_mailing_state"
                  label="State"
                  choices={StateChoices}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextInput
                  source="address_mailing_zip"
                  label="ZIP"
                  fullWidth
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid item {...mergedGridItemProps}>
          <Card sx={{ p: 3, my: 2, boxShadow: "none" }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Avatar
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <FileUploadField fullWidth source="avatar" label="Avatar" />
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, my: 2, boxShadow: "none" }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Assigned Badges
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <BadgeGrid filterGrid filter={badges} />
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ p: 3, my: 2, boxShadow: "none" }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Badges
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <AssignBadgesList />
          </Card>
        </Grid>
      </Grid>

      <EditUserModal
        user={user}
        open={editModalOpen}
        onClose={handleEditModalClose}
        onUserUpdated={() => {}}
      />
    </Box>
  );
};

export default ContactFormFields;
