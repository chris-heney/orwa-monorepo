import React, { useState } from "react";
import {
  AutocompleteArrayInput,
  BooleanInput,
  ChipField,
  Create,
  DatagridConfigurable,
  Edit,
  NumberField,
  NumberInput,
  RaRecord,
  ReferenceArrayField,
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
import { CurrencyOptions } from "../../../config/Settings";
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import CustomSecondaryHeader from "../../_components/CustomSecondaryHeader";
import CustomToolBar from "../../_components/CustomToolbar";
import { RichTextInput } from "ra-input-rich-text";
import { useConferenceContext } from "../ConferenceContext";
import { createRecord } from "../../_helpers/createRecord";
import { updateRecord } from "../../_helpers/updateRecord";
import { customDatagridStyle, positionStickyComponent } from "../../../css";
import CustomPagination from "../../_components/CustomPagination";

// @TODO: Implement ConferenceExtraForm a inline edit

const ConferenceExtraForm = () => {

  const [editHtml, setEditHtml] = useState(false);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6">Basic Extra Information</Typography>
          <Divider />
          <Grid container spacing={2}>
            <Grid item xs={12} md={9}>
              <TextInput
                source="name"
                label="Name"
                fullWidth
                helperText={false}
                validate={required("Extra name is required")}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <NumberInput
                source="price_online"
                label="Price Online"
                fullWidth
                helperText={false}
                validate={required("Price online is required")}
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
                  validate={required("Price at event is required")}
                />
              </ReferenceArrayInput>
            </Grid>
            <Grid item xs={12} md={3}>
              <NumberInput
                source="price_event"
                label="Price at Event"
                fullWidth
                helperText={false}
                validate={required("Price at event is required")}
              />
            </Grid>
            <Grid item xs={12}>
              <SelectInput
                source="context"
                label="Context"
                fullWidth
                helperText={"Who is this extra for?"}
                choices={[
                  { id: "Attendee", name: "Attendee" },
                  { id: "Contestant", name: "Contestant" },
                  { id: "Vendor", name: "Vendor" },
                  { id: "Booth", name: "Booth" },
                ]}
                validate={required("Context is required")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextInput
                source="description"
                label="Description"
                multiline
                rows={3}
                fullWidth
                helperText={false}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        {/* <Card sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">Included/Excluded Tickets</Typography>
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
              If a ticket includes this extra, it will automatically be added to
              counts, and will <strong>not</strong> be an <em>option</em> during
              registration.
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <ReferenceArrayInput
                filter={{ conferences: [conference] }}
                reference="conference-tickets"
                source="included"
                label="Included"
              >
                <AutocompleteArrayInput
                  optionText="name"
                  fullWidth
                  helperText={false}
                />
              </ReferenceArrayInput>
            </Grid>
            <Grid item xs={12} md={6}>
              <ReferenceArrayInput
                filter={{ conferences: [conference] }}
                reference="conference-tickets"
                source="excluded"
                label="Excluded"
              >
                <AutocompleteArrayInput
                  optionText="name"
                  fullWidth
                  helperText={false}
                />
              </ReferenceArrayInput>
            </Grid>
          </Grid>
        </Card> */}
        <Card sx={{ p: 2, mt: 2.5 }}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">Count/Amounts</Typography>
          </Box>
          <Divider />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <NumberInput
                source="max_qty_each"
                label="Max purchase Quantity"
                fullWidth
                helperText={false}
                validate={required("Max purchase quantity is required")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <NumberInput
                source="max_qty"
                label="Available to sell"
                fullWidth
                helperText={false}
                validate={required("Available to sell is required")}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <BooleanInput
                source="counted"
                label="Counted in Summary"
                fullWidth
                helperText={false}
                validate={required("Counted in summary is required")}
              />
            </Grid>
          </Grid>
        </Card>
        {/* <Card sx={{ p: 2, mt: 2 }}>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1
          }}>
            <Typography variant='h6'>Icon</Typography>
            <Link to='https://www.svgrepo.com/' target='_blank' rel='noopener noreferrer'>
              <Button variant='contained' color='primary'>
                Find Icon
              </Button>
            </Link>
          </Box>
          <Divider />
          <Grid container spacing={2}>         
            <Grid item xs={12} >
              <NumberInput source="icon" label="Icon" fullWidth helperText={false} multiline rows={5}/>
            </Grid>
          </Grid>
        </Card> */}
      </Grid>
      <Card
        sx={{
          p: 2,
          mt: 2,
          ml: 2,
          width: "100%",
        }}
      >
        <Button onClick={() => setEditHtml(!editHtml)}>
          {editHtml ? "Default View" : "Edit raw HTML"}
        </Button>
        {editHtml ? (
          <TextInput
            source={"details"}
            label="Edit HTML"
            fullWidth
            multiline
            rows={8}
          />
        ) : (
          <RichTextInput
            source="details"
            label="Details"
            fullWidth
            helperText={false}
          />
        )}
      </Card>
    </Grid>
  );
};

const RegistrationAddons = () => {
  const {
    isCreating,
    setIsCreating,
  } = useConferenceContext();
  const [update] = useUpdate();
  const [create] = useCreate();
  const notify = useNotify();
  const remove = useRemoveFromStore();

  return isCreating ? (
    <Create
      sx={{ mt: -2 }}
      title={" "}
      redirect={false}
      resource="registration-addons"
    >
      <CustomSecondaryHeader title="Add New Extra" />
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
            "registration-addons"
          )
        }
      >
        <ConferenceExtraForm />
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
              resource="registration-addons"
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
                    "registration-addons"
                  )
                }
                toolbar={<CustomToolBar />}
              >
                <ConferenceExtraForm />
              </SimpleForm>
            </Edit>
          );
        }}
      >
        <ReferenceArrayField
          source="conferences"
          reference="conferences"
          label="Conference"
        >
          <SingleFieldList linkType={false}>
            <ChipField source="name" />
          </SingleFieldList>
        </ReferenceArrayField>

        <TextField source="name" label="Name" />
        <TextField source="description" label="Description" />
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
        {/* 
        <ReferenceArrayField
          source="included"
          label="Included"
          reference="conference-tickets"
        >
          <SingleFieldList sx={{
            flexWrap: "nowrap",
          }} linkType={false}>
            <ChipField source="name" />
          </SingleFieldList>
        </ReferenceArrayField>

        <ReferenceArrayField
          source="excluded"
          label="Excluded"
          reference="conference-tickets"
        >
          <SingleFieldList sx={{
            flexWrap: "nowrap",
          }}   linkType={false}>
            <ChipField source="name" />
          </SingleFieldList>
        </ReferenceArrayField> */}
      </DatagridConfigurable>
      <CustomPagination />
    </>
  );
};

export default RegistrationAddons;
