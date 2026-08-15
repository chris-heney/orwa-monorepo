import React, { useContext } from "react";
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
  NumberInput,
  AutocompleteInput,
  TextInput,
  useNotify,
  Create,
  useRemoveFromStore,
  useUpdate,
  useCreate,
  FunctionField,
  required,
  useListContext,
} from "react-admin";
import { Button, Chip, Divider, Grid, Typography } from "@mui/material";
import { CurrencyOptions } from "../../../config/Settings";
import { ConferenceContext } from "../ConferenceContext";
import CustomSecondaryHeader from "../../_components/CustomSecondaryHeader";
import { createRecord } from "../../_helpers/createRecord";
import { updateRecord } from "../../_helpers/updateRecord";
import { customDatagridStyle, positionStickyComponent } from "../../../css";
import { ISharedMeta } from "../types/IConference";
import { getPrimaryConferenceId } from "../helpers/mergeConferenceAcrossTabFilters";
import { groupItemsByExtra } from "../helpers/contestantExtras";
import ContestantExtrasEditor from "./ContestantExtrasEditor";

const ContestantFormFields = () => {

  const { filterValues } = useListContext();
  const filterConferenceId = getPrimaryConferenceId(filterValues);

  return (
    <Grid item xs={12} md={12} sx={{ p: 2, overflow: "hidden" }}>
      <Typography variant="h6">Contestant Info.</Typography>
      <Divider />
      <Grid display={"none"} item xs={12} md={6} lg={4}>
        <ReferenceInput
          source="conference"
          reference="conferences"
          label="Conference"
        >
          <AutocompleteInput
            optionText="name"
            fullWidth
            defaultValue={{ conference: filterConferenceId }}
            helperText={false}
          />
        </ReferenceInput>
      </Grid>
      <Grid display={"none"} item xs={12} md={6} lg={4}>
        <NumberInput
          source="year"
          label="Year"
          defaultValue={filterValues.year}
          fullWidth
          helperText={false}
        />
      </Grid>
      <Grid container spacing={2}>
        {/* first,last email,phoen */}
        <Grid item xs={12} md={6} lg={4}>
          <TextInput
            source="first"
            label="First Name"
            fullWidth
            validate={required("First name is Required")}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <TextInput
            source="last"
            label="Last Name"
            fullWidth
            validate={required("Last name is Required")}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <TextInput source="email" label="Email" fullWidth />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <TextInput source="phone" label="Phone" fullWidth />
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <ReferenceInput
            source="team"
            reference="conference-teams"
            label="Team"
            fullWidth
          >
            <AutocompleteInput optionText="name" />
          </ReferenceInput>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <TextInput
            source="organization"
            label="Organization"
            fullWidth
            validate={required("Organization is Required")}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <ReferenceInput
            filter={
              filterConferenceId != null
                ? { conferences: [filterConferenceId] }
                : {}
            }
            source="conference_ticket"
            reference="conference-tickets"
            label="Title"
            fullWidth
            helperText={false}
          >
            <AutocompleteInput
              optionText={"name"}
              helperText={false}
              validate={required("Conference Ticket is required")}
            />
          </ReferenceInput>
          {/* <SelectInput source="type" label='Type' fullWidth choices={[
            {id: 'Golfer', name: 'Golfer'},
            {id: 'Fisher', name: 'Fisher'},
          ]} /> */}
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <NumberInput source="fee" label="Fee" fullWidth />
        </Grid>
      </Grid>
      <ContestantExtrasEditor conferenceId={filterConferenceId} />
    </Grid>
  );
};

const ConferenceContestants = () => {
  const {
    isCreating,
    setIsCreating,
  } = useContext(ConferenceContext);

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
      resource="conference-contestants"
      component={"div"}
    >
      <CustomSecondaryHeader title="Add New Contestant" />
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
            "conference-contestants"
          )
        }
      >
        <ContestantFormFields />
      </SimpleForm>
    </Create>
  ) : (
      <DatagridConfigurable
        sx={customDatagridStyle}
        bulkActionButtons={false}
        expandSingle={true}
        isRowExpandable={() => true}
        isRowSelectable={() => false}
        rowClick="expand"
        expand={(record: RaRecord) => {
          return (
            <Edit
              sx={positionStickyComponent}
              redirect={false}
              title={" "}
              resource="conference-contestants"
              component={"div"}
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
                    "conference-contestants"
                  )
                }
              >
                <Grid container spacing={2}>
                  <ContestantFormFields />
                </Grid>
              </SimpleForm>
            </Edit>
          );
        }}
      >
        <ReferenceField
          source="team"
          reference="conference-teams"
          label="Team"
          sortBy="team.name"
        >
          <TextField source="name" label="Team" noWrap />
        </ReferenceField>

        <TextField source="organization" label="Organization" noWrap />
        <TextField source="type" label="Type" />
        <ReferenceField
          source="conference_ticket"
          reference="conference-tickets"
          label="Ticket"
          sortBy="conference_ticket.name"
        >
          <TextField source="name" noWrap />
        </ReferenceField>
        <TextField source="first" label="First Name" noWrap />
        <TextField source="last" label="Last Name" noWrap />
        <TextField source="email" label="Email" noWrap />
        <TextField source="phone" label="Phone" noWrap />
        <TextField source="year" label="Year" />
        <DateField source="createdAt" label="Date Registered" />
        <NumberField
          source="fee"
          label="Fee"
          options={CurrencyOptions}
          sortable={false}
        />
        <FunctionField
          sx={{ display: "flex", gap: "5px", flexWrap: "wrap" }}
          label="Items"
          sortBy="items.label"
          render={(record: RaRecord) => {
            const grouped = groupItemsByExtra(
              (record?.items ?? []) as ISharedMeta[]
            );
            return [...grouped.entries()].map(([groupKey, { label, count }]) => (
              <Chip
                key={`item-${record.id}-${groupKey}`}
                size="small"
                label={`${label} (x${count})`}
              />
            ));
          }}
        />

        {/* Address */}
      </DatagridConfigurable>
  );
};

export default ConferenceContestants;
