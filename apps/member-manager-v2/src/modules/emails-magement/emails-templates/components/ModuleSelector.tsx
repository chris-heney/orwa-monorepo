import {Grid} from "@mui/material";
import { AutocompleteInput, required } from "react-admin";
import React from "react";

interface ModuleSelectorProps {
  moduleValue?: string;
}

const ModuleSelector = ({ moduleValue }: ModuleSelectorProps) => {
  return (
    <Grid item xs={12} md={6}>
      <AutocompleteInput
        source="module"
        defaultValue={moduleValue}
        choices={[
          // Membership related
          { id: "Memberships", name: "Memberships" },
          { id: "Associates", name: "Associates" },
          { id: "Watersystems", name: "Watersystems" },
          { id: "Membership Items", name: "Membership Items" },
          { id: "Transactions", name: "Transactions" },
          { id: "Invoices", name: "Invoices" },
          
          // Training related
          { id: "Training", name: "Training" },
          { id: "Training Events", name: "Training Events" },
          { id: "Training History", name: "Training History" },
          { id: "Event Registration", name: "Event Registration" },
          { id: "Instructors", name: "Instructors" },
          { id: "Topics", name: "Topics" },
          { id: "Training Settings", name: "Training Settings" },
          { id: "Instructor Certification", name: "Instructor Certification" },
          
          // Conference related
          { id: "Conference", name: "Conference" },
          { id: "Conference Attendees", name: "Conference Attendees" },
          { id: "Conference Extras", name: "Conference Extras" },
          { id: "Conference Sponsorships", name: "Conference Sponsorships" },
          { id: "Conference Sponsors", name: "Conference Sponsors" },
          { id: "Conference Tickets", name: "Conference Tickets" },
          { id: "Conference Booths", name: "Conference Booths" },
          { id: "Conference Contestants", name: "Conference Contestants" },
          { id: "Conference Registrations", name: "Conference Registrations" },
          { id: "Conference Schedules", name: "Conference Schedules" },
          
          // Grants related
          { id: "Grant Management", name: "Grant Management" },
          { id: "Grants", name: "Grants" },
          { id: "Grant Applications", name: "Grant Applications" },
          { id: "Grant Payouts", name: "Grant Payouts" },
          { id: "Grant Statuses", name: "Grant Statuses" },
          
          // General resources
          { id: "Contacts", name: "Contacts" },
          { id: "Users", name: "Users" },
          { id: "Staff", name: "Staff" },
          { id: "Assets", name: "Assets" },
          { id: "Activities", name: "Activities" },
          { id: "Scholarship Applications", name: "Scholarship Applications" },
        ]}
        fullWidth
        helperText="Select the module this email is associated with"
        optionText="name"
        validate={required("Module is required")}
      />
    </Grid>
  );
};

export default ModuleSelector; 