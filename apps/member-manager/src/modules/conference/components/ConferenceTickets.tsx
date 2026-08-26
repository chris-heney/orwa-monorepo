import React, { useContext, useState } from "react";
import {
  AutocompleteArrayInput,
  ChipField,
  Create,
  Edit,
  NumberField,
  NumberInput,
  RaRecord,
  ReferenceArrayInput,
  SelectInput,
  SimpleForm,
  SingleFieldList,
  TextField,
  TextInput,
  required,
  useCreate,
  useNotify,
  useRemoveFromStore,
  useUpdate,
} from "react-admin";
import { DatagridConfigurable } from "@orwa/entity-id";
import {
  Alert,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { CurrencyOptions } from "../../../config/Settings";
import CustomSecondaryHeader from "../../_components/CustomSecondaryHeader";
import CustomToolBar from "../../_components/CustomToolbar";
import HelpIcon from "@mui/icons-material/Info";
import { ConferenceContext, useConferenceContext } from "../ConferenceContext";
import { createRecord } from "../../_helpers/createRecord";
import { updateRecord } from "../../_helpers/updateRecord";
import { customDatagridStyle, positionStickyComponent } from "../../../css";
import CustomPagination from "../../_components/CustomPagination";
import SafeReferenceArrayField from "./SafeReferenceArrayField";
import { normalizeRecordArrays } from "../helpers/normalizeRecordArrays";

// @TODO: Implement ConferenceExtraForm a inline edit

const ConferenceTicketsForm = () => {
  const [showExtrasHelp, setShowExtrasHelp] = useState(false);

  const { currentFilter } = useConferenceContext();
  // Same shape as list filters: `conferences` for tickets tab (not top-level tabFilters)
  const conferenceId =
    currentFilter?.conferences?.[0] ?? currentFilter?.conference;

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6">Basic Ticket Information</Typography>
          <Divider />
          <Grid container spacing={2}>
            <Grid item xs={12} md={9}>
              <TextInput
                source="name"
                label="Name"
                fullWidth
                helperText={false}
                validate={required("Ticket name is required")}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <NumberInput
                source="price_online"
                label="Price Online"
                fullWidth
                helperText={false}
                validate={required("Price is required")}
              />
            </Grid>
            <Grid item xs={12} md={9}>
              <ReferenceArrayInput
                reference="conferences"
                source="conferences"
                label="Price at Event"
                fullWidth
                helperText={false}
              >
                <AutocompleteArrayInput
                  optionText="name"
                  fullWidth
                  helperText={false}
                  validate={required("Conference is required")}
                />
              </ReferenceArrayInput>
            </Grid>
            <Grid item xs={12} md={3}>
              <NumberInput
                source="price_event"
                label="Price at Event"
                fullWidth
                helperText={false}
                prefix="$"
                isRequired
              />
            </Grid>
            <Grid item xs={12}>
              <SelectInput
                source="context"
                label="Context"
                fullWidth
                choices={[
                  { id: "Attendee", name: "Attendee" },
                  { id: "Vendor", name: "Vendor" },
                  { id: "Contestant", name: "Contestant" },
                ]}
                helperText={"Is this ticket sold to Attendees or Vendors?"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                source="description"
                label="Description"
                multiline
                rows={10}
                fullWidth
                helperText={false}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">Included/Excluded Extras</Typography>
            <Button
              onClick={() => setShowExtrasHelp(!showExtrasHelp)}
              sx={{ ml: "auto" }}
            >
              <HelpIcon color={showExtrasHelp ? "info" : "disabled"} />
            </Button>
          </Box>
          <Divider />
          {showExtrasHelp && (
            <Alert severity="info" elevation={0} sx={{ my: 2 }}>
              If an extra is included, it will automatically be added to counts,
              otherwise will be an option during registration.
            </Alert>
          )}
          <ReferenceArrayInput
            reference="conference-extras"
            source="includes"
            label="Includes"
            filter={
              conferenceId != null ? { conferences: [conferenceId] } : {}
            }
          >
            <AutocompleteArrayInput
              optionText="name"
              fullWidth
              helperText="If Extra is free but *optional* - don't include it!"
            />
          </ReferenceArrayInput>
          <ReferenceArrayInput
            reference="conference-extras"
            source="excludes"
            label="Excludes"
            filter={
              conferenceId != null ? { conferences: [conferenceId] } : {}
            }
          >
            <AutocompleteArrayInput
              optionText="name"
              fullWidth
              helperText="Not available for this kind of attendence."
            />
          </ReferenceArrayInput>
        </Card>
      </Grid>
    </Grid>
  );
};

const ConferenceTickets = () => {
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
      sx={{
        mt: -2,
      }}
      title={" "}
      redirect={false}
      resource="conference-tickets"
    >
      <CustomSecondaryHeader title="Add New Ticket" />
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
            "conference-tickets"
          )
        }
      >
        <ConferenceTicketsForm />
      </SimpleForm>
    </Create>
  ) : (
    <>
      <DatagridConfigurable
        bulkActionButtons={false}
        expandSingle={true}
        isRowExpandable={() => true}
        isRowSelectable={() => false}
        rowClick="expand"
        sx={customDatagridStyle}
        expand={(record: RaRecord) => {
          return (
            <Edit
              sx={positionStickyComponent}
              title={" "}
              id={record.id}
              resource="conference-tickets"
              redirect={false}
            >
              <SimpleForm
                record={normalizeRecordArrays(record, [
                  "conferences",
                  "includes",
                  "excludes",
                ])}
                onSubmit={(formData) =>
                  updateRecord(
                    formData,
                    record,
                    update,
                    notify,
                    remove,
                    "conference-tickets"
                  )
                }
                toolbar={<CustomToolBar />}
              >
                <ConferenceTicketsForm />
              </SimpleForm>
            </Edit>
          );
        }}
      >
        <SafeReferenceArrayField
          source="conferences"
          reference="conferences"
          label="Conference"
        >
          <SingleFieldList linkType={false}>
            <ChipField source="name" />
          </SingleFieldList>
        </SafeReferenceArrayField>

        <TextField source="name" label="Name" />
        <NumberField
          source="price_online"
          label="Price Online"
          options={CurrencyOptions}
        />
        <NumberField
          source="price_event"
          label="Price at Event"
          options={CurrencyOptions}
        />

        <SafeReferenceArrayField
          source="includes"
          label="Includes"
          reference="conference-extras"
        >
          <SingleFieldList sx={{
            flexWrap: "nowrap",
          }} linkType={false}>
            <ChipField source="name" />
          </SingleFieldList>
        </SafeReferenceArrayField>

        <SafeReferenceArrayField
          source="excludes"
          label="Excludes"
          reference="conference-extras"
        >
          <SingleFieldList sx={{
            flexWrap: "nowrap",
          }} linkType={false}>
            <ChipField source="name" />
          </SingleFieldList>
        </SafeReferenceArrayField>
      </DatagridConfigurable>
      <CustomPagination />
    </>
  );
};

export default ConferenceTickets;
