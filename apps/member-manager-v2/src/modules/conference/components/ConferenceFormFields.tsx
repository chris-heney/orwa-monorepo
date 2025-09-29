import React from "react";
import {Card, Divider, Grid, Typography} from "@mui/material";
import {
  AutocompleteArrayInput,
  DateInput,
  NumberInput,
  ReferenceInput,
  SelectInput,
  TextInput,
} from "react-admin";
import { StateChoices, conferenceStatus } from "../../../helpers/Data";
import FileUploadField from "../../_components/FileUploadField";

const ConferenceFormFields = () => {

  return (
    <Grid container
      spacing={0}
      gap={0} sx={{ alignItems: "stretch" }} justifyItems={"stretch"}
      alignSelf={"stretch"}>
      <Grid xs={12}
        md={6}
        sm={12} sx={{ alignItems: "stretch" }} justifyItems={"stretch"}
        alignSelf={"stretch"}>
        {/* DETAILS */}
        <Card sx={{ p: 2, my: 2, mx: 1 }}>
          <Typography variant="h5">Details</Typography>
          <Typography variant="body1">
            Please enter the details of the event below.
          </Typography>
          <Divider />
          <Grid xs={12} sm={12} md={12} lg={12}>
            <TextInput
              helperText={false}
              source="name"
              label="Name"
              fullWidth
            />
            <TextInput
              helperText={false}
              source="slug"
              label="Slug"
              fullWidth
            />
            <TextInput
              helperText={false}
              source="description"
              label="Description"
              fullWidth
              multiline
              rows={5}
            />
            <SelectInput
              helperText={false}
              source="status"
              label="Status"
              fullWidth
              choices={conferenceStatus}
            />
            <TextInput
              source="closed_message"
              label="Closed Message"
              helperText="Message to display when conference is closed for the conference registration"
              fullWidth
              multiline
              rows={5}
            />
            <TextInput
              source="brochure_link"
              label="Borchure Link"
              helperText="Disaplys a link on the conference hub to the brochure"
              fullWidth
              multiline
            />
          </Grid>
        </Card>

        {/* Registration Details */}

        <Card sx={{ p: 2, my: 2, mx: 1 }}>
          <Typography variant="h5">Registration Details</Typography>
          <Divider />
          <Grid container spacing={2}>
            <Grid xs={12} md={6}>
              <NumberInput
                source="booths_available"
                label="Booths Available"
                fullWidth
              />
            </Grid>
            <Grid xs={12} md={6}>
              <NumberInput
                source="training_hours_available"
                label="Training Hours Available"
                fullWidth
              />
            </Grid>
            <Grid xs={12} md={6}>
              <NumberInput
                source="non_member_fee"
                label="Non Member Fee"
                fullWidth
                type="decimal"
              />
            </Grid>
            <Grid xs={12} md={6}>
              <NumberInput
                source="booth_price"
                label="Booth Price 1"
                fullWidth
                type="decimal"
              />
            </Grid>
            <Grid xs={12} md={6}>
              <NumberInput
                source="booth_price_2"
                label="Booth Price 2"
                fullWidth
                type="decimal"
              />
            </Grid>
            <Grid xs={12} md={6}>
              <NumberInput
                source="purchasable_booths"
                label="Purchasable Booths"
                fullWidth
                helperText="How many booths can be purchased at the conference?"
              />
            </Grid>
            <Grid xs={12} md={6}>
              <NumberInput
                source="available_contestants"
                label="Available Contestants"
                fullWidth
                helperText="How many contestants are available at this conference?"
              />
            </Grid>
          </Grid>
        </Card>

        {/* LOCATION */}
        <Card sx={{ p: 2, my: 2, mx: 1 }}>
          <Typography variant="h5">Venue</Typography>
          <Typography variant="body1">
            Please enter the Venue of the event below.
          </Typography>
          <Divider />
          <Grid container spacing={2}>
            <Grid xs={12} sm={12} md={12} lg={12}>
              <TextInput
                helperText={false}
                source="venue.name"
                label="Venue Name"
                fullWidth
              />
            </Grid>
            <Grid xs={12} sm={12} md={6} lg={6}>
              <TextInput
                helperText={false}
                source="venue.street"
                label="Street"
                fullWidth
              />
            </Grid>
            <Grid xs={12} sm={12} md={6} lg={6}>
              <TextInput
                helperText={false}
                source="venue.city"
                label="City"
                fullWidth
              />
            </Grid>
            <Grid xs={12} sm={12} md={6} lg={6}>
              <SelectInput
                helperText={false}
                source="venue.state"
                label="State"
                fullWidth
                choices={StateChoices}
              />
            </Grid>
            <Grid xs={12} sm={12} md={6} lg={6}>
              <TextInput
                helperText={false}
                source="venue.zip"
                label="Zip"
                fullWidth
              />
              <Grid />
            </Grid>
          </Grid>
        </Card>
      </Grid>

      <Grid xs={12}
        md={6}
        sm={12} sx={{ alignItems: "stretch" }} justifyItems={"stretch"}
        alignSelf={"stretch"}>
        {/* EVENT DATES */}
        <Card sx={{ p: 2, my: 2, mx: 1 }}>
          <Typography variant="h5">Dates</Typography>
          <Typography variant="body1">Enter conference dates below.</Typography>
          <Divider />
          <Grid container spacing={2}>
            <Grid xs={6}>
              <DateInput
                helperText={false}
                source="start_date"
                label="Start Date"
                fullWidth
              />
            </Grid>
            <Grid xs={6}>
              <DateInput
                helperText={false}
                source="end_date"
                label="End Date"
                fullWidth
              />
            </Grid>
            <Grid xs={6}>
              <DateInput
                helperText={false}
                source="registration_start"
                label="Registration Start Date"
                fullWidth
              />
            </Grid>
            <Grid xs={6}>
              <DateInput
                helperText={false}
                source="registration_end"
                label="Registration End Date"
                fullWidth
              />
            </Grid>
            <Grid xs={6}>
              <DateInput
                helperText={false}
                source="online_registration_end"
                label="Early Registration End Date"
                fullWidth
              />
            </Grid>
          </Grid>
        </Card>

        {/* Conference Extras */}
        <Card sx={{ p: 2, my: 2, mx: 1 }}>
          <Typography variant="h5">Conference Extras</Typography>
          <Typography variant="body1">
            Please Select the Conference Extras Below.
          </Typography>
          <Divider />
          <ReferenceInput
            source="conference_extras"
            reference="conference-extras"
            fullWidth
            perPage={1000}
          >
            <AutocompleteArrayInput optionText={"name"} />
          </ReferenceInput>
        </Card>

        {/* Conference Tickets */}
        <Card sx={{ p: 2, my: 2, mx: 1 }}>
          <Typography variant="h5">Conference Tickets</Typography>
          <Typography variant="body1">
            Please Select the Conference Tickets Below.
          </Typography>
          <Divider />
          <ReferenceInput
            source="conference_tickets"
            reference="conference-tickets"
            fullWidth
            perPage={1000}
          >
            <AutocompleteArrayInput optionText={"name"} />
          </ReferenceInput>
        </Card>

        <Card sx={{ p: 2, my: 2, mx: 1 }}>
          <Typography variant="h5">Settings</Typography>
          <Divider />
          <Grid xs={12} sm={12} md={12} lg={12}>
            <TextInput
              helperText={
                "Recipient Email for Confenrence Manager Applications"
              }
              source="recipient"
              label="Recipient Email"
              fullWidth
            />
          </Grid>
        </Card>
        {/* Media */}

        <Card sx={{ p: 2, my: 2, mx: 1 }}>
          <Typography variant="h5">Media</Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <FileUploadField source="logo" label="Conference Logo" />
            <FileUploadField source="booth_map" label="Booth Map" />
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ConferenceFormFields;
