import React, { useEffect } from "react";
import { Box, Card, Typography, Divider } from "@mui/material";
import { Button, useRecordContext } from "react-admin";
import { useFormContext } from "react-hook-form";
import ConferenceWebsiteAccordionBuilder from "./ConferenceWebsiteAccordionBuilder";
import ConferenceFormFields from "./ConferenceFormFields";

const ConferenceForm = () => {
  const record = useRecordContext();
  const { setValue } = useFormContext();

  useEffect(() => {
    if (record) {
      setValue(
        "conference_details",
        record.conference_details ? record.conference_details : []
      );
    }
  }, [record, setValue]);

  const handleRedirect = () => {
    if (record?.id) {
      window.open(`/conference-hub/?conference_id=${record.id}&admin`, "_blank");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Conference Hub Settings Header */}
      {/* Main Form Fields */}
      <Card sx={{ p: 3, mb: 4 }}>
        <ConferenceFormFields />
      </Card>

      <Box
        sx={{
          position: "relative",
          textAlign: "center",
          mb: 4,
          p: 2,
          backgroundColor: "primary.main",
          color: "white",
          borderRadius: "8px",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Conference Hub Settings
        </Typography>
        <Typography variant="subtitle1">
          Manage all settings and configurations for your conference.
        </Typography>

        {/* Visit Button */}
        <Button
          variant="contained"
          label="Visit Conference Hub"
          onClick={handleRedirect}
          sx={{
            position: "absolute",
            top: "50%",
            right: "16px",
            transform: "translateY(-50%)",
            backgroundColor: "white",
            color: "primary.main",
            fontWeight: "bold",
            "&:hover": {
              backgroundColor: "primary.light",
            },
          }}
        />
      </Box>

      {/* Accordion Sections */}
      {[
        {
          title: "Conference Details",
          field: "conference_details",
          caption:
            "These details will populate the accordion on the dashboard page of the conference hubs.",
        },
        {
          title: "Attendee Information",
          field: "attendee_information",
          caption:
            "The details will popualte the attendee information section of the conference hub.",
        },
        {
          title: "Vendor Information",
          field: "vendor_information",
          caption:
            "The details will populate the vendor information section of the conference hub.",
        },
      ].map((accordion, index) => (
        <Card key={index} sx={{ p: 3, mb: 3 }}>
          <ConferenceWebsiteAccordionBuilder
            title={accordion.title}
            caption={accordion.caption}
            field={accordion.field}
          />
        </Card>
      ))}

      {/* Footer Divider */}
      <Divider sx={{ mt: 4 }} />
    </Box>
  );
};

export default ConferenceForm;
