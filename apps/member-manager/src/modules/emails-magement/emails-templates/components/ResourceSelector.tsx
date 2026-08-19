import { FormControl, Grid } from "@mui/material";
import { AutocompleteInput } from "react-admin";
import React from "react";

interface ResourceSelectorProps {
  onResourceChange: (value: string) => void;
}

const ResourceSelector = ({ onResourceChange }: ResourceSelectorProps) => {
  return (
    <Grid item xs={12}>
        <AutocompleteInput
          fullWidth
          helperText="Select the resource you want to use for the email"
          label="Select Resource"
          source="resource"
          choices={[
            // Membership resources
            { id: "watersystems", name: "Water Systems" },
            { id: "associates", name: "Associates" },
            
            // Training resources
            { id: "training-events", name: "Training Events" },
            { id: "training-event-logs", name: "Training Event Logs" },
            { id: "training-event-registrations", name: "Training Event Registrations" },
            { id: "training-schedule-blocks", name: "Training Schedule Blocks" },
            { id: "training-instructors", name: "Training Instructors" },
            { id: "training-topics", name: "Training Topics" },
            { id: "training-settings", name: "Training Settings" },
            { id: "training-instructor-certifications", name: "Training Instructor Certifications" },
            
            // Conference resources
            { id: "conference-attendees", name: "Conference Attendees" },
            { id: "conference-sponsors", name: "Conference Sponsors" },
            { id: "conference-booths", name: "Conference Booths" },
            { id: "conference-contestants", name: "Conference Contestants" },
            { id: "conference-registrations", name: "Conference Registrations" },
            
            // Scholarships / Awards
            { id: "scholarship-applications", name: "Scholarship Applications" },
            { id: "award-nominations", name: "Award Nominations" },

            // Grant resources
            { id: "grant-application-finals", name: "Grant Applications" },
            
            // General resources
            { id: "staff", name: "Staff" },
            { id: "contacts", name: "Contacts" },
            { id: "users", name: "Users" },
          ]}
          onChange={(value) => onResourceChange(value)}
          optionText="name"
        />
    </Grid>
  );
};

export default ResourceSelector; 