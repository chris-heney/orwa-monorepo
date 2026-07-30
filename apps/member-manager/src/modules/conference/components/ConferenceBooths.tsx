import React, { useContext, useEffect } from "react";
import {
  TextInput,
  NumberInput,
  TextField,
  NumberField,
  RaRecord,
  DatagridConfigurable,
  Create,
  SimpleForm,
  useNotify,
  useUpdate,
  useRefresh,
  useCreate,
  Edit,
  ReferenceField,
  DateField,
  FunctionField,
  useRemoveFromStore,
  useListContext,
} from "react-admin";
import { Box, Button, Grid, Chip } from "@mui/material";
import CustomSecondaryHeader from "../../_components/CustomSecondaryHeader";
import CustomToolBar from "../../_components/CustomToolbar";
import { CurrencyOptions } from "../../../config/Settings";
import MetaComponent from "./ConferenceMetaRepeatableComponent";
import SelectInputRegistration from "./SelectInputRegistration";
import { ISharedMeta } from "../types/IConference";
import { ConferenceContext } from "../ConferenceContext";
import { updateRecord } from "../../_helpers/updateRecord";
import { createRecord } from "../../_helpers/createRecord";
import { customDatagridStyle, positionStickyComponent } from "../../../css";
import CustomPagination from "../../_components/CustomPagination";
import { getPrimaryConferenceId } from "../helpers/mergeConferenceAcrossTabFilters";

interface AddBoothFormProps {
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  context: "edit" | "create";
}

const AddBoothForm = ({ context }: AddBoothFormProps) => {
  const { filterValues } = useListContext();
  const filterConferenceId = getPrimaryConferenceId(filterValues);
  const [updated, setUpdated] = React.useState(false);
  const refresh = useRefresh();

  useEffect(() => {
    if (updated) {
      setTimeout(() => {
        refresh();
      }, 100);
    }
    setUpdated(false);
  }, [updated]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <SelectInputRegistration type="Vendor" />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextInput source="organization" label="Organization" fullWidth />
      </Grid>
      <Grid item xs={12} md={3}>
        <NumberInput source="subtotal" label="Subtotal" fullWidth />
      </Grid>
      <Grid item xs={12} md={6}>
        <NumberInput
          source="conference"
          defaultValue={filterConferenceId}
          sx={{ display: "none" }}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <NumberInput
          source="year"
          defaultValue={filterValues.year}
          sx={{ display: "none" }}
          fullWidth
        />
      </Grid>
      {context === "edit" && (
        <Box>
          <MetaComponent
            setUpdated={setUpdated}
            context="Booth"
            resource="conference-booths"
            conferenceId={filterConferenceId}
          />
        </Box>
      )}
    </Grid>
  );
};

const ConferenceBooths = () => {
  // @see training form fields
  const {
    isCreating,
    setIsCreating,
  } = useContext(ConferenceContext);

  const [update] = useUpdate();
  const [create] = useCreate();
  const notify = useNotify();
  const remove = useRemoveFromStore();

  return isCreating ? (
    <Create
      title={" "}
      component={"div"}
      sx={{ mt: -2 }}
      redirect={false}
      resource="conference-booths"
    >
      <CustomSecondaryHeader title="Add New Booth" />
      <Button
        onClick={() => {
          isCreating ? setIsCreating(false) : setIsCreating(true);
        }}
      >
        {" "}
        Cancel
      </Button>
      <SimpleForm
        onSubmit={(formData) =>
          createRecord(
            formData,
            create,
            notify,
            setIsCreating,
            "conference-booths"
          )
        }
      >
        <AddBoothForm setIsCreating={setIsCreating} context="create" />
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
        expand={(record) => {
          return (
            <Edit
              sx={positionStickyComponent}
              title={" "}
              component={"div"}
              redirect={false}
              resource="conference-booths"
              id={record.id}
            >
              <SimpleForm
                onSubmit={(formData) =>
                  updateRecord(
                    formData,
                    record,
                    update,
                    notify,
                    remove,
                    "conference-booths"
                  )
                }
                toolbar={<CustomToolBar />}
              >
                <AddBoothForm setIsCreating={setIsCreating} context="edit" />
              </SimpleForm>
            </Edit>
          );
        }}
      >
        <TextField source="organization" label="Organization" noWrap />
        <ReferenceField
          source="registration"
          reference="conference-registrations"
          label="Email"
          sortBy="registration.registrant.email"
        >
          <ReferenceField
            source="registrant"
            reference="contacts"
            label="Email"
            link={false}
            sortBy="registration.registrant.email"
          >
            <TextField source="email" label="Email" noWrap />
          </ReferenceField>
        </ReferenceField>
        <ReferenceField
          source="registration"
          reference="conference-registrations"
          label="Registrant"
          sortBy="registration.registrant.first"
        >
          <ReferenceField
            source="registrant"
            reference="contacts"
            label="Registrant"
            link={false}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <TextField source="first" label="Registrant" mr={1} />{" "}
              <TextField source="last" label="Registrant" />
            </div>
          </ReferenceField>
        </ReferenceField>
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
        <NumberField
          source="subtotal"
          label="Subtotal"
          options={CurrencyOptions}
          noWrap
        />

        <ReferenceField
          source="registration"
          reference="conference-registrations"
          label="Phone"
          sortBy="registration.registration_date"
        >
          <ReferenceField
            source="registrant"
            reference="contacts"
            label="Phone"
            link={false}
          >
            <TextField source="phone" label="Phone" noWrap />
          </ReferenceField>
        </ReferenceField>

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
        {/* Address */}
        <ReferenceField
          source="registration"
          reference="conference-registrations"
          label="Address"
          link={false}
          sortBy="registration.address.street"
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              whiteSpace: "nowrap",
            }}
          >
            <TextField source="address.street" label="Address" />
            <TextField source="address.city" label="Address" mr={1} />
            <TextField source="address.state" label="Address" mr={1} />
            <TextField source="address.zip" label="Address" mr={1} />
          </div>
        </ReferenceField>
      </DatagridConfigurable>
      <CustomPagination />
    </>
  );
};

export default ConferenceBooths;
