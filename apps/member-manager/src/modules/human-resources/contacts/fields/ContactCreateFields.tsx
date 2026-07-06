import React from "react";
import { Box, Card, Divider, Grid, Typography } from "@mui/material";
import { NumberInput, SelectInput, TextInput } from "react-admin";
import { useWatch } from "react-hook-form";
import CustomPhoneInput from "../../../_components/MaskedPhoneInput";
import FileUploadField from "../../../_components/FileUploadField";
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
const ContactCreateFormFields = ({ gridItemProps = {} }: ContactFormProps) => {
  const contactType = useWatch({ name: "contact_type" });

  const defaultGridItemProps = {
    xs: 12,
    sm: 12,
    md: 6,
    lg: 6,
  };
  const mergedGridItemProps = { ...defaultGridItemProps, ...gridItemProps };
  const directoryTitleHelper =
    "Required if you enter any information for this contact";
  return (
    <Box>
      <Grid
        container
        spacing={0}
        gap={0}
        alignItems={"stretch"}
        justifyItems={"stretch"}
        alignSelf={"stretch"}
      >
        <Grid
          item
          {...mergedGridItemProps}
          alignItems={"stretch"}
          justifyItems={"stretch"}
          alignSelf={"stretch"}
        >
          {/* Information */}
          <Card sx={{ p: 2, my: 2, mx: 1, boxShadow: "none" }}>
            <Typography variant="h5">Information</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container columnSpacing={2} rowSpacing={1}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
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
                  helperText={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                {contactType === "watersystem" ? (
                  <SelectInput
                    source="title"
                    label="Title (directory)"
                    choices={[...WATERSYSTEM_DIRECTORY_TITLE_CHOICES]}
                    fullWidth
                    helperText={directoryTitleHelper}
                  />
                ) : (
                  <TextInput
                    source="title"
                    label="Title"
                    fullWidth
                    helperText={false}
                  />
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextInput
                  source="first"
                  label="First Name"
                  fullWidth
                  helperText={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextInput
                  source="last"
                  label="Last Name"
                  fullWidth
                  helperText={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextInput
                  source="email"
                  label="Email"
                  fullWidth
                  helperText={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <CustomPhoneInput
                  source="phone"
                  label="Phone"
                  fullWidth
                  helperText={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} display={"none"}>
                <NumberInput
                  source="user"
                  label="User"
                  fullWidth
                  helperText={false}
                />
              </Grid>
            </Grid>
          </Card>
          <Card sx={{ p: 2, my: 2, mx: 1, boxShadow: "none" }}>
            <Typography variant="h5">Mailing address (directory)</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container columnSpacing={2} rowSpacing={1}>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextInput
                  source="address_mailing_line1"
                  label="Street / PO Box"
                  fullWidth
                  helperText={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextInput
                  source="address_mailing_line2"
                  label="Line two"
                  fullWidth
                  helperText={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextInput
                  source="address_mailing_city"
                  label="City"
                  fullWidth
                  helperText={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <SelectInput
                  source="address_mailing_state"
                  label="State"
                  choices={StateChoices}
                  fullWidth
                  helperText={false}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextInput
                  source="address_mailing_zip"
                  label="ZIP"
                  fullWidth
                  helperText={false}
                />
              </Grid>
            </Grid>
          </Card>
        </Grid>
        <Grid
          item
          {...mergedGridItemProps}
          alignItems={"stretch"}
          justifyItems={"stretch"}
          alignSelf={"stretch"}
        >
          {/* Avatar */}
          <Card sx={{ p: 2, my: 2, mx: 1, boxShadow: "none" }}>
            <Typography variant="h5">Avatar</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container columnSpacing={2} rowSpacing={1}>
              <FileUploadField fullWidth source="avatar" label="Avatar" />
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactCreateFormFields;
