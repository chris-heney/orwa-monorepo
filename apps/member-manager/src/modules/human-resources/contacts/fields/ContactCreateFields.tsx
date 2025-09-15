import React from "react";
import {Box, Card, Divider, Grid, Typography} from "@mui/material";
import {
  NumberInput,
  SelectInput,
  TextInput,
} from "react-admin";
import CustomPhoneInput from "../../../_components/MaskedPhoneInput";
import FileUploadField from "../../../_components/FileUploadField";

interface ContactFormProps {
  gridItemProps?: {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
  };
}
const ContactCreateFormFields = ({ gridItemProps = {} }: ContactFormProps) => {
  const defaultGridItemProps = {
    xs: 12,
    sm: 12,
    md: 6,
    lg: 6,
  };
  const mergedGridItemProps = { ...defaultGridItemProps, ...gridItemProps };
  return (
    <Box>
      <Grid container
        spacing={0}
        gap={0} sx={{ alignItems: "stretch" }} justifyItems={"stretch"}
        alignSelf={"stretch"}>
        <Grid {...mergedGridItemProps} sx={{ alignItems: "stretch" }} justifyItems={"stretch"}
          alignSelf={"stretch"}>
          {/* Information */}
          <Card sx={{ p: 2, my: 2, mx: 1, boxShadow: "none" }}>
            <Typography variant="h5">Information</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextInput
                  source="first"
                  label="First Name"
                  fullWidth
                  helperText={false}
                />
              </Grid>
              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextInput
                  source="last"
                  label="Last Name"
                  fullWidth
                  helperText={false}
                />
              </Grid>
              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextInput
                  source="email"
                  label="Email"
                  fullWidth
                  helperText={false}
                />
              </Grid>
              <Grid xs={12} sm={6} md={6} lg={6}>
                <CustomPhoneInput
                  source="phone"
                  label="Phone"
                  fullWidth
                  helperText={false}
                />
              </Grid>
              <Grid xs={12} sm={6} md={6} lg={6}>
                <TextInput
                  source="title"
                  label="Title"
                  fullWidth
                  helperText={false}
                />
              </Grid>
              <Grid xs={12} sm={6} md={6} lg={6} display={"none"}>
                <NumberInput
                  source="user"
                  label="User"
                  fullWidth
                  helperText={false}
                />
              </Grid>
              <Grid xs={12} sm={6} md={6} lg={6}>
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
            </Grid>
          </Card>
        </Grid>
        <Grid {...mergedGridItemProps} sx={{ alignItems: "stretch" }} justifyItems={"stretch"}
          alignSelf={"stretch"}>
          {/* Avatar */}
          <Card sx={{ p: 2, my: 2, mx: 1, boxShadow: "none" }}>
            <Typography variant="h5">Avatar</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
                <FileUploadField fullWidth source="avatar" label="Avatar" />
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ContactCreateFormFields;
