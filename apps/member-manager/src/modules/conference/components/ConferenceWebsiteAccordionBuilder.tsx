import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import { Button, NumberInput, SelectInput, TextInput } from "react-admin";
import { useFormContext } from "react-hook-form";
import { RichTextInput } from "ra-input-rich-text";
import { Add, Delete } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ConferenceDetails {
  title: string;
  description: string;
  important: boolean;
  order: number;
  hidden: boolean;
}

const emptyDetail = (order: number): ConferenceDetails => ({
  title: "",
  description: "",
  important: false,
  order,
  hidden: false,
});

const ConferenceWebsiteAccordionBuilder = ({
  field,
  title,
  caption,
}: {
  field: string;
  title: string;
  caption: string;
}) => {
  const { setValue, watch } = useFormContext();
  const [editMode, setEditMode] = useState(false);

  // RHF only re-renders on watch() when the value reference changes — never mutate.
  const details = (watch(field) as ConferenceDetails[] | null | undefined) ?? [];
  const sortedEntries = details
    .map((item, originalIndex) => ({ item, originalIndex }))
    .sort((a, b) => (a.item.order ?? 0) - (b.item.order ?? 0));

  const nextOrder =
    details.length === 0
      ? 1
      : Math.max(...details.map((d) => d.order ?? 0)) + 1;

  const handleAdd = () => {
    setValue(field, [...details, emptyDetail(nextOrder)], {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleDelete = (originalIndex: number) => {
    setValue(
      field,
      details.filter((_, i) => i !== originalIndex),
      { shouldDirty: true, shouldTouch: true }
    );
  };

  return (
    <Accordion
      disableGutters
      square
      sx={{
        boxShadow: "none",
        position: "relative",
        borderBottom: "1px solid",
        borderColor: "divider",
        m: 0,
        p: 0,
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="recipient-details-content"
        id="recipient-details-header"
      >
        <Box>
          <Typography variant="h5">{title}</Typography>
          <Typography variant="caption">({caption})</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Box
          sx={{
            display: "flex",
            justifyContent: "end",
            alignItems: "center",
            px: 2,
          }}
        >
          {details.length === 0 && (
            <Button label="Add New Conference Details" onClick={handleAdd}>
              <Add />
            </Button>
          )}
        </Box>
        {sortedEntries.map(({ item: _item, originalIndex }) => (
          <Box key={originalIndex}>
            <Card sx={{ p: 2, m: 0, borderRadius: 0, boxShadow: 'none' }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 1,
                }}
              >
                <Typography variant="body1">
                  Please enter the details below.
                </Typography>
                <Button
                  onClick={() => {
                    handleDelete(originalIndex);
                  }}
                >
                  <Delete color="error" />
                </Button>
              </Box>

              <Divider />
              <Grid container columnSpacing={1}>
                <Grid item sm={12} md={5}>
                  <TextInput
                    source={`${field}.${originalIndex}.title`}
                    label="Title"
                    fullWidth
                  />
                </Grid>
                <Grid item sm={12} md={3}>
                  <SelectInput
                    helperText={"Displays as red in the conference details"}
                    source={`${field}.${originalIndex}.important`}
                    label="Important"
                    fullWidth
                    choices={[
                      { id: true, name: "Yes" },
                      { id: false, name: "No" },
                    ]}
                  />
                </Grid>
                <Grid item sm={12} md={2}>
                  <SelectInput
                    helperText={
                      "Hides the conference detail from the kiosk app dropdown"
                    }
                    source={`${field}.${originalIndex}.hidden`}
                    label="Hidden?"
                    fullWidth
                    choices={[
                      { id: true, name: "Yes" },
                      { id: false, name: "No" },
                    ]}
                  />
                </Grid>
                <Grid item sm={12} md={2}>
                  <NumberInput
                    source={`${field}.${originalIndex}.order`}
                    label="Order"
                    fullWidth
                  />
                </Grid>

                <Grid item sm={12} md={12}>
                  <Button
                    label={editMode ? "Default View" : "Edit raw HTML"}
                    onClick={() => setEditMode(!editMode)}
                  />

                  <Accordion
                    disableGutters
                    square
                    sx={{
                      boxShadow: "none",
                      position: "relative",
                      borderBottom: "1px solid",
        borderColor: "divider",
                      m: 0,
                      p: 0,
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="recipient-details-content"
                      id="recipient-details-header"
                    >
                      <Typography>Details</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {editMode ? (
                        <TextInput
                          source={`${field}.${originalIndex}.description`}
                          label="Edit HTML"
                          fullWidth
                          multiline
                          rows={8}
                        />
                      ) : (
                        <RichTextInput
                          helperText={false}
                          source={`${field}.${originalIndex}.description`}
                          label="Description"
                          fullWidth
                        />
                      )}
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              </Grid>
            </Card>
            <Box
              sx={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                px: 2,
              }}
            >
              <Button label="Add New Conference Details" onClick={handleAdd}>
                <Add />
              </Button>
            </Box>
          </Box>
        ))}
      </AccordionDetails>
    </Accordion>
  );
};

export default ConferenceWebsiteAccordionBuilder;
