import React from "react";
import {
  DatagridConfigurable,
  TextField,
  ReferenceField,
  DateField,
  NumberField,
  RaRecord,
  Edit,
  SimpleForm,
  ReferenceInput,
  AutocompleteArrayInput,
  DateInput,
  NumberInput,
  AutocompleteInput,
  TextInput,
  SelectInput,
  Show,
  useNotify,
  Create,
  useRemoveFromStore,
  useUpdate,
  useCreate,
  useListContext,
  FunctionField,
} from "react-admin";
import {Box, Button, Chip, Divider, Grid, Typography} from "@mui/material";
import { CurrencyOptions } from "../../../config/Settings";
import {
  RegistrationType,
  StateChoices,
  paymentOptions,
} from "../../../helpers/Data";
import CustomToolBar from "./CustomToolBar";
import { useConferenceContext } from "../ConferenceContext";
import CustomSecondaryHeader from "../../_components/CustomSecondaryHeader";
import { createRecord } from "../../_helpers/createRecord";
import { updateRecord } from "../../_helpers/updateRecord";
import { customDatagridStyle, positionStickyComponent } from "../../../css";
import CustomPagination from "../../_components/CustomPagination";
import RegistrationReceipt from "./RegistrationReceipt";
import EditIcon from "@mui/icons-material/Edit";
import { ISharedMeta } from "../types/IConference";
//TODO fix so tickets and extras work theyre turning the contact into a null object

interface RegistrationProps {
  context?: string;
  ticketType?: string;
}

const RegistrationFormFields = ({ ticketType }: RegistrationProps) => {

  const {filterValues} = useListContext()

  return (
    <Grid xs={12} md={12} sx={{ p: 2, overflow: "hidden" }}>
      <Typography variant="h6">Registration Info.</Typography>
      <Divider />
      <Grid display={"none"} xs={12} md={6} lg={4}>
        <ReferenceInput
          source="conference"
          reference="conferences"
          label="Conference"
        >
          <AutocompleteInput
            optionText="name"
            fullWidth
            defaultValue={filterValues?.conference}
            helperText={false}
          />
        </ReferenceInput>
      </Grid>
      <Grid display={"none"} xs={12} md={6} lg={4}>
        <NumberInput
          source="year"
          label="Year"
          defaultValue={filterValues?.ear}
          fullWidth
          helperText={false}
        />
      </Grid>
      <Grid container spacing={2}>
        <Grid xs={12} md={6} lg={4}>
          <ReferenceInput
            source="registrant"
            reference="Contacts"
            label="Registrant"
          >
            <AutocompleteInput
              optionText={(record) => record.first + " " + record.last}
              fullWidth
              helperText={false}
            />
          </ReferenceInput>
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <DateInput
            source="registration_date"
            label="Registration Date"
            fullWidth
            helperText={false}
          />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <TextInput
            source="organization"
            label="Organization"
            fullWidth
            helperText={false}
          />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <SelectInput
            source="type"
            label="Type"
            fullWidth
            helperText={false}
            choices={RegistrationType}
          />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <NumberInput
            source="total"
            label="Total"
            fullWidth
            helperText={false}
          />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <SelectInput
            source="payment_method"
            label="Payment Method"
            choices={paymentOptions}
            fullWidth
            helperText={false}
          />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <ReferenceInput
            perPage={10000}
            source="sponsorships"
            reference="conference-sponsorships"
            label="Sponsorships"
          >
            <AutocompleteArrayInput
              optionText={(record) => record.name}
              fullWidth
              helperText={false}
            />
          </ReferenceInput>
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <ReferenceInput
            perPage={10000}
            source="attendees"
            reference="conference-attendees"
            label="Attendees"
          >
            <AutocompleteArrayInput
              optionText={(record) => record.first + " " + record.last}
              fullWidth
              helperText={false}
            />
          </ReferenceInput>
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <ReferenceInput
            perPage={10000}
            source="contestants"
            reference="conference-contestants"
            label="Contestants"
          >
            <AutocompleteArrayInput
              optionText={(record) => record.first + " " + record.last}
              fullWidth
              helperText={false}
            />
          </ReferenceInput>
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <ReferenceInput
            perPage={10000}
            source="conference_sponsor"
            reference="conference-sponsors"
            label="Sponsor"
          >
            <AutocompleteArrayInput
              optionText={(record) => record.organization ?? record.email}
              fullWidth
              helperText={false}
            />
          </ReferenceInput>
        </Grid>
        {ticketType === "Vendor" && (
          <Grid xs={12} md={6} lg={4}>
            <ReferenceInput
              perPage={1000}
              source="booths"
              reference="conference-booths"
              label="Booths"
            >
              <AutocompleteArrayInput
                optionText="organization"
                fullWidth
                helperText={false}
              />
            </ReferenceInput>
          </Grid>
        )}
        <Grid xs={12} md={6} lg={4}>
          <TextInput source="address.street" label="Street" fullWidth />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <TextInput source="address.city" label="City" fullWidth />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <SelectInput
            source="address.state"
            label="State"
            fullWidth
            choices={StateChoices}
          />
        </Grid>
        <Grid xs={12} md={6} lg={4}>
          <TextInput source="address.zip" label="Zip" fullWidth />
        </Grid>
      </Grid>
    </Grid>
  );
};

const ConferenceRegistrations = () => {
  const {
    isCreating,
    setIsCreating,
  } = useConferenceContext();

  const [isEditing, setIsEditing] = React.useState(false);
  const notify = useNotify();
  const [create] = useCreate();
  const [update] = useUpdate();
  const remove = useRemoveFromStore();

  return isCreating ? (
    <Create
      sx={{
        mt: -2,
      }}
      title={" "}
      resource="conference-registrations"
      component={"div"}
    >
      <CustomSecondaryHeader title="Add New Registration" />
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
            "conference-registrations"
          )
        }
      >
        <RegistrationFormFields ticketType="" context="create" />
      </SimpleForm>
    </Create>
  ) : (
    <>
      <DatagridConfigurable
        sx={customDatagridStyle}
        bulkActionButtons={false}
        expandSingle={true}
        isRowExpandable={() => true}
        isRowSelectable={() => false}
        rowClick="expand"
        expand={(record: RaRecord) => {
          return isEditing ? (
            <Edit
              sx={positionStickyComponent}
              redirect={false}
              title={" "}
              resource="conference-registrations"
              component={"div"}
              id={record.id}
            >
              <Button
                onClick={() => {
                  isEditing ? setIsEditing(false) : setIsEditing(true);
                }}
              >
                {" "}
                Back
              </Button>
              <SimpleForm
                toolbar={<CustomToolBar setIsEditing={setIsEditing} />}
                onSubmit={(formData) =>
                  updateRecord(
                    formData,
                    record,
                    update,
                    notify,
                    remove,
                    "conference-registrations"
                  )
                }
              >
                <Grid container spacing={2}>
                  <RegistrationFormFields
                    context="edit"
                    ticketType={record.record.type}
                  />
                </Grid>
              </SimpleForm>
            </Edit>
          ) : (
            <Show
              sx={positionStickyComponent}
              title={" "}
              resource="conference-registrations"
              component={"div"}
              queryOptions={{
                meta: {
                  populate: false,
                },
              }}
              id={record.id}
            >
              <Button
                onClick={() => {
                  isEditing ? setIsEditing(false) : setIsEditing(true);
                }}
              >
                {" "}
                Edit <EditIcon />
              </Button>
              <RegistrationReceipt />
            </Show>
          );
        }}
      >
        <TextField source="organization" label="Organization" noWrap />
        {/* <TextField source="type" label="Type" /> */}
        <TextField source="year" label="Year" />
        <ReferenceField
          source="registrant"
          reference="contacts"
          sortBy="registrant.first"
          label="Registrant"
          link={false}
        >
          <Box display={"flex"}>
            <TextField source="first" label="First Name" noWrap />
            <TextField ml={0.5} source="last" label="Last Name" noWrap />
          </Box>
        </ReferenceField>
        <DateField source="registration_date" label="Date Registered" />
        <NumberField
          source="total"
          label="Total"
          options={CurrencyOptions}
          sortable={false}
        />
        <ReferenceField
          source="registrant"
          label="Email"
          reference="contacts"
          sortBy="registrant.email"
          link={false}
        >
          <TextField source="email" label="Email" noWrap />
        </ReferenceField>
        <ReferenceField
          source="registrant"
          label="Phone"
          reference="contacts"
          sortBy="registrant.phone"
          link={false}
        >
          <TextField source="phone" label="Phone" noWrap />
        </ReferenceField>
        {/* Address */}

        <TextField source="address.street" label="Street" noWrap />
        <TextField source="address.city" label="City" noWrap />
        <TextField source="address.state" label="State" noWrap />
        <TextField source="address.zip" label="Zip" noWrap />
        <FunctionField
          sx={{ display: "flex", gap: "5px" }}
          label="Items"
          sortBy="items.label"
          render={(record: RaRecord) => {
            return record?.items?.map((item: ISharedMeta, index: number) => {
              return (
                <Chip
                  key={`item-${record.id}-${item.key + " " + index}`}
                  label={(item.label ?? item.key).replace(/\d/g, " ")}
                />
              );
            });
          }}
        />
      </DatagridConfigurable>
      <CustomPagination />
    </>
  );
};

export default ConferenceRegistrations;
