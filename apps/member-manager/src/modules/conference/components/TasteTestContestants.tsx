import React, { useContext, useEffect } from "react";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import {
  TextField,
  RaRecord,
  Edit,
  NumberInput,
  SimpleForm,
  useCreate,
  useNotify,
  TextInput,
  ReferenceInput,
  useUpdate,
  ReferenceField,
  DateField,
  Create,
  useRefresh,
  useRemoveFromStore,
  AutocompleteInput,
  required,
  useListContext,
} from "react-admin";
import { DatagridConfigurable } from "@orwa/entity-id";
import CustomSecondaryHeader from "../../_components/CustomSecondaryHeader";
import CustomToolBar from "../../_components/CustomToolbar";
import { ConferenceContext } from "../ConferenceContext";
import { updateRecord } from "../../_helpers/updateRecord";
import { createRecord } from "../../_helpers/createRecord";
import { customDatagridStyle, positionStickyComponent } from "../../../css";
import CustomPagination from "../../_components/CustomPagination";
import CustomPhoneInput from "../../_components/MaskedPhoneInput";
import { getPrimaryConferenceId } from "../helpers/mergeConferenceAcrossTabFilters";

const ConferenceAttendeeFields = () => {
  const { filterValues } = useListContext();
  const filterConferenceId = getPrimaryConferenceId(filterValues);
  const refresh = useRefresh();
  const [updated, setUpdated] = React.useState(false);

  useEffect(() => {
    if (updated) {
      setTimeout(() => {
        refresh();
      }, 100);
    }
    setUpdated(false);
  }, [updated]);

  return (
    <Box>
        <Typography ml={1} variant="h6">
          Taste Test Contestant Information
        </Typography>
        <Divider />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <ReferenceInput
              filter={{
                conference: filterConferenceId,
                year: filterValues.year,
              }}
              source="registration"
              reference="conference-registrations"
              label="Registration"
              fullWidth
              helperText={false}
              perPage={1000}
            >
              <AutocompleteInput
                optionText={"organization"}
                helperText={"Relation the Registration"}
              />
            </ReferenceInput>
          </Grid>
          <Grid item xs={12} md={6}>
            <ReferenceInput
              source="watersystem"
              reference="watersystems"
              label="Watersystem"
              fullWidth
              helperText={false}
              perPage={1000}
            >
              <AutocompleteInput
                optionText={"name"}
                helperText={"Contestants Watersystem"}
                validate={required("Conference Registration is required")}   
              />
            </ReferenceInput>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput
              source="first"
              label="First"
              fullWidth
              helperText={false}
              validate={required("First Name is required")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput
              source="last"
              label="Last"
              fullWidth
              helperText={false}
              validate={required("Last Name is required")}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput
              validate={required("Email is required")}
              source="email"
              label="Email"
              fullWidth
              helperText={false}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CustomPhoneInput
              source="phone"
              label="Phone"
              fullWidth
              helperText={false}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextInput
              source="organization"
              label="Organization"
              fullWidth
              helperText={false}
            />
          </Grid>
          <NumberInput
            source="year"
            defaultValue={filterValues.year}
            sx={{ display: "none" }}
          />
          <NumberInput
            source="conference"
            defaultValue={filterConferenceId}
            sx={{ display: "none" }}
          />
        </Grid>
    </Box>
  );
};

const TasteTestContestants = () => {
  const {
    isCreating,
    setIsCreating,
  } = useContext(ConferenceContext);

  const [create] = useCreate();
  const [update] = useUpdate();
  const remove = useRemoveFromStore();
  const notify = useNotify();


  return isCreating ? (
    <Create
      title={" "}
      resource="conference-attendes"
      component={"div"}
      sx={{
        mt: -2,
      }}
    >
      <CustomSecondaryHeader title="Add New Taste Test Contestant" />
      <Button
        onClick={() =>
          isCreating ? setIsCreating(false) : setIsCreating(true)
        }
      >
        {" "}
        Back
      </Button>
      <SimpleForm
        onSubmit={(formData) =>
          createRecord(
            formData,
            create,
            notify,
            setIsCreating,
            "taste-test-contestants"
          )
        }
      >
        <ConferenceAttendeeFields />
      </SimpleForm>
    </Create>
  ) : (
    <>
      <DatagridConfigurable
        sx={customDatagridStyle}
        bulkActionButtons={false}
        rowClick="expand"
        expandSingle={true}
        isRowExpandable={() => true}
        isRowSelectable={() => false}
        expand={(record: RaRecord) => (
          <Edit
            sx={positionStickyComponent}
            component={"div"}
            title=" "
            id={record.id}
            resource="taste-test-contestants"
            redirect={false}
          >
            <SimpleForm
              onSubmit={(formData) =>
                updateRecord(
                  formData,
                  record,
                  update,
                  notify,
                  remove,
                  "taste-test-contestants"
                )
              }
              toolbar={<CustomToolBar />}
            >
              <ConferenceAttendeeFields />
            </SimpleForm>
          </Edit>
        )}
      >
        <TextField source="id" label="ID" />
        <ReferenceField
          source="registration"
          reference="conference-registrations"
          label="Date Registered"
          link={false}
          sortBy="registration.registration_date"
        >
          <DateField
            source="registration_date"
            label="Date Registered"
            noWrap
          />
        </ReferenceField>
        <ReferenceField
          source="watersystem"
          reference="watersystems"
          label="Watersystem"
          link={false}
          sortBy="watersystem.name"
        >
          <TextField source="name" label="Watersystem" noWrap />
        </ReferenceField>
        <TextField source="first" label="First" noWrap />
        <TextField source="last" label="Last" noWrap />
        <TextField source="email" label="Email" noWrap />
        <TextField source="phone" label="Phone" noWrap />
        <TextField source="organization" label="Organization" noWrap />
        {/*  */}
      </DatagridConfigurable>
      <CustomPagination />
    </>
  );
};

export default TasteTestContestants;
