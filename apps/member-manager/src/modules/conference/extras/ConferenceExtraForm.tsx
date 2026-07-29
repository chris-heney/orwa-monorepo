import {
  Alert,
  Box,
  Card,
  Divider,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import {
  NumberInput,
  TextInput,
  ReferenceArrayInput,
  AutocompleteArrayInput,
  SelectInput,
  BooleanInput,
  Link,
} from "react-admin";
import { required } from "ra-core";
import HelpIcon from "@mui/icons-material/Help";
import FileUploadField from "../../_components/FileUploadField";
import { RichTextInput } from "ra-input-rich-text";
import { useWatch } from "react-hook-form";

const ConferenceExtraForm = () => {

  const [showExtrasHelp, setShowExtrasHelp] = useState(false);

  const conferences = useWatch({ name: "conferences" });

  // Stabilize the filter object identity so nested ReferenceArrayInputs
  // don't refetch/re-render on every keystroke elsewhere in the form.
  const ticketsFilter = useMemo(
    () => ({ conferences }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(conferences)]
  );

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
            <Grid item xs={6}>
              <SelectInput
                source="context"
                label="Context"
                fullWidth
                helperText={"Who is this extra for?"}
                choices={[
                  { id: "Attendee", name: "Attendee" },
                  { id: "Booth", name: "Booth" },
                  { id: "Registration", name: "Registration" },
                  { id: "Contestant", name: "Contestant" },
                ]}
                validate={required("Context is required")}
              />
            </Grid>
            <Grid item xs={6}>
              <NumberInput
                source="order"
                label="Order"
                fullWidth
                helperText={"What priority do you want this extra to have in the conference kiosk?"}         
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
        <Card sx={{ p: 2 }}>
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
                filter={ticketsFilter}
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
                filter={ticketsFilter}
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
        </Card>
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
        <Card sx={{ p: 2, mt: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 1,
            }}
          >
            <Typography variant="h6">Icon</Typography>
            <Link
              to="https://www.svgrepo.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="contained" color="primary">
                Find Icon
              </Button>
            </Link>
          </Box>
          <Divider />
          <FileUploadField fullWidth source="icon" label="Icon" />
        </Card>
      </Grid>
      <Card
        sx={{
          p: 2,
          mt: 2,
          ml: 2,
          width: "100%",
        }}
      >
        <RichTextInput
          source="details"
          label="Details"
          fullWidth
          helperText={false}
        />
      </Card>
    </Grid>
  );
};

export default ConferenceExtraForm;
