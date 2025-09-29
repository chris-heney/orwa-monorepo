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

  const handleDelete = (index: number) => {
    const details = watch(field) as ConferenceDetails[];
    details.splice(index, 1);
    setValue(field, details);
  };

  return (
    <Accordion
      disableGutters
      square
      sx={{
        boxShadow: "none",
        position: "relative",
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
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
          {(watch(field) as ConferenceDetails[]) !== undefined &&
            (watch(field) as ConferenceDetails[]).length === 0 && (
              <Button
                label="Add New Conference Details"
                onClick={() => {
                  const details = watch(field) as ConferenceDetails[];
                  details.push({
                    title: "",
                    description: "",
                    important: false,
                    order: 1,
                    hidden: false,
                  });
                  setValue(field, details);
                }}
              >
                <Add />
              </Button>
            )}
        </Box>
        {(watch(field) as ConferenceDetails[]) !== undefined &&
          (watch(field) as ConferenceDetails[])
            ?.sort((a, b) => a.order - b.order)
            .map((item2, index) => (
              <Box key={index}>
                <Card sx={{ p: 2, mx: 1, my: 2 }}>
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
                        handleDelete(index);
                      }}
                    >
                      <Delete color="error" />
                    </Button>
                  </Box>

                  <Divider />
                  <Grid container columnSpacing={1}>
                    <Grid item sm={12} md={5}>
                      <TextInput
                        source={`${field}[${index}].title`}
                        label="Title"
                        fullWidth
                      />
                    </Grid>
                    <Grid item sm={12} md={3}>
                      <SelectInput
                        helperText={"Displays as red in the conference details"}
                        source={`${field}[${index}].important`}
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
                        source={`${field}[${index}].hidden`}
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
                        source={`${field}[${index}].order`}
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
                          borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
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
                            // Raw HTML Text Input Mode
                            <TextInput
                              source={`${field}[${index}].description`}
                              label="Edit HTML"
                              fullWidth
                              multiline
                              rows={8}
                            />
                          ) : (
                            // Rich Text View Mode
                            <RichTextInput
                              helperText={false}
                              source={`${field}[${index}].description`}
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
                  <Button
                    label="Add New Conference Details"
                    onClick={() => {
                      const details = watch(field) as ConferenceDetails[];
                      details.push({
                        title: "",
                        description: "",
                        important: false,
                        order: details[index].order + 1,
                        hidden: false,
                      });
                      setValue(field, details);
                    }}
                  >
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
