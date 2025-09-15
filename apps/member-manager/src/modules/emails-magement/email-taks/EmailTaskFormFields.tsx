import {Box, Grid, Typography} from "@mui/material";
import React, { useEffect, useState, useMemo } from "react";
import {
  TextInput,
  SelectInput,
  ReferenceInput,
  DateField,
  required,
  useGetList,
  useNotify,
  BooleanInput,
  useRecordContext,
  AutocompleteInput,
} from "react-admin";
import { useFormContext } from "react-hook-form";
import { useGetIdentity } from "../../../helpers/useGetIdentity";

const cronOptions = [
  { label: "Every Minute", value: "* * * * *" },
  { label: "Every 5 Minutes", value: "*/5 * * * *" },
  { label: "Every 15 Minutes", value: "*/15 * * * *" },
  { label: "Every 30 Minutes", value: "*/30 * * * *" },
  { label: "Every Hour", value: "0 * * * *" },
  { label: "Every Day at 8 AM", value: "0 8 * * *" },
  { label: "Every Friday at 6 PM", value: "0 18 * * 5" },
  { label: "Every Monday at 8 AM", value: "0 8 * * 1" },
  { label: "First Day of Month at 8 AM", value: "0 8 1 * *" },
  { label: "Last Day of Month at 6 PM", value: "0 18 L * *" },
];

const entityOptions = [
  // Membership resources
  { id: "watersystem", name: "Water Systems" },
  { id: "associate", name: "Associates" },
  { id: "contact", name: "Contacts" },
  { id: "staff-member", name: "Staff Members" },
  { id: "user", name: "Users" },
  
  // Training resources
  { id: "training-event", name: "Training Events" },
  { id: "training-event-registration", name: "Training Event Registrations" },
  { id: "training-instructor", name: "Training Instructors" },
  { id: "training-instructor-certification", name: "Training Instructor Certifications" },
  { id: "training-topic", name: "Training Topics" },
  { id: "training-setting", name: "Training Settings" },
  { id: "training-log", name: "Training Logs" },
  { id: "training-session", name: "Training Sessions" },
  
  // Conference resources
  { id: "conference", name: "Conferences" },
  { id: "conference-attendee", name: "Conference Attendees" },
  { id: "conference-sponsor", name: "Conference Sponsors" },
  { id: "conference-booth", name: "Conference Booths" },
  { id: "conference-contestant", name: "Conference Contestants" },
  { id: "conference-registration", name: "Conference Registrations" },
  { id: "conference-schedule", name: "Conference Schedules" },
  { id: "conference-ticket", name: "Conference Tickets" },
  { id: "conference-sponsorship", name: "Conference Sponsorships" },
  
  // Event roster resources
  { id: "events-annual-conference-attendee-roster", name: "Annual Conference Attendee Roster" },
  { id: "events-annual-conference-booth-roster", name: "Annual Conference Booth Roster" },
  { id: "events-expo-attendee-roster", name: "Expo Attendee Roster" },
  { id: "events-expo-booth-roster", name: "Expo Booth Roster" },
  { id: "events-fall-conference-attendee-roster", name: "Fall Conference Attendee Roster" },
  { id: "events-fall-conference-booth-roster", name: "Fall Conference Booth Roster" },
  { id: "events-contestant-roster", name: "Contestant Roster" },
  
  // Grant resources
  { id: "grant", name: "Grants" },
  { id: "grant-application-final", name: "Grant Applications" },
  { id: "grant-status", name: "Grant Statuses" },
  { id: "grant-sub-status", name: "Grant Sub Statuses" },
  { id: "grant-type", name: "Grant Types" },
  
  // Additional resources
  { id: "asset", name: "Assets" },
  { id: "venue", name: "Venues" },
  { id: "invoice", name: "Invoices" },
  { id: "membership", name: "Memberships" },
  { id: "email-template", name: "Email Templates" },
  { id: "email-log", name: "Email Logs" },
  { id: "scheduled-email-task", name: "Scheduled Email Tasks" },
  { id: "saved-query", name: "Saved Queries" },
  { id: "setting", name: "Settings" },
  { id: "taste-test-contestant", name: "Taste Test Contestants" },
  { id: "soonerwarn", name: "SoonerWarn Systems" },
  { id: "corporate-sponsor", name: "Corporate Sponsors" },
]

const ScheduledEmailTaskFormFields = () => {
  const form = useFormContext();
  const identity = useGetIdentity();
  const notify = useNotify();
  const record = useRecordContext();
  const [selectedQueryId, setSelectedQueryId] = useState<number | null>(null);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [userHasCleared, setUserHasCleared] = useState(false);

  // Watch the entity field to filter saved queries
  const selectedEntity = form.watch("entity");

  // Reset initialization when record changes
  useEffect(() => {
    if (record?.id) {
      setHasInitialized(false);
      setUserHasCleared(false);
    }
  }, [record?.id]);

  // Stabilize the entity filter to prevent constant re-renders
  const stableEntityFilter = useMemo(() => {
    if (!selectedEntity) return {};
    return {
      resource: {
        "$containsi": selectedEntity
      }
    };
  }, [selectedEntity]);

  // Fetch user's saved queries
  const { data: savedQueries = [], isLoading } = useGetList("saved-queries", {
    pagination: { page: 1, perPage: 50 },
    sort: { field: "createdAt", order: "DESC" },
    filter: stableEntityFilter
  });

  // Filter saved queries by selected entity and user permissions
  const filteredSavedQueries = useMemo(() => {
    return savedQueries.filter((query) => {
      // Check user permissions
      const hasPermission = identity ? (query.user.toString() === identity.id || query.is_public) : query.is_public;
      
      // Check resource match - if no entity selected, show all queries
      const resourceMatch = !selectedEntity || 
        query.resource === selectedEntity || 
        query.resource === selectedEntity + "s" || // Handle plural forms
        query.resource === selectedEntity.replace(/s$/, ""); // Handle singular forms
      
      return hasPermission && resourceMatch;
    });
  }, [savedQueries, identity, selectedEntity]);

  // Initialize from record on load (only once)
  useEffect(() => {
    if (record && !hasInitialized && !userHasCleared) {
      // Check if record has a saved_query field and set it
      if (record.saved_query) {
        // Wait for savedQueries to load if they haven't yet
        if (savedQueries.length === 0 && isLoading) {
          return; // Still loading, wait
        }
        
        const savedQueryFromRecord = savedQueries.find(
          (query) => query.id === record.saved_query
        );
        
        if (savedQueryFromRecord) {
          setSelectedQueryId(savedQueryFromRecord.id);
          form.setValue("saved_query", savedQueryFromRecord.id);
          form.setValue("condition", savedQueryFromRecord.filters || {});
        }
      } else if (record.condition) {
        // Set condition from record
        form.setValue("condition", record.condition);
        
        // Try to find matching saved query by condition if queries are loaded
        if (savedQueries.length > 0) {
          const matchedQuery = savedQueries.find(
            (query) =>
              JSON.stringify(query.filters) === JSON.stringify(record.condition)
          );

          if (matchedQuery) {
            setSelectedQueryId(matchedQuery.id);
            form.setValue("saved_query", matchedQuery.id);
          }
        }
      }
      
      // Mark as initialized only if we're not waiting for queries to load
      if (!isLoading) {
        setHasInitialized(true);
      }
    }
  }, [record, savedQueries, form, hasInitialized, userHasCleared, isLoading]);

  // Clear saved query when entity changes or is removed
  useEffect(() => {
    if (selectedQueryId) {
      setSelectedQueryId(null);
      form.setValue("saved_query", "");
      form.setValue("condition", {});
      setUserHasCleared(true);
    }
  }, [selectedEntity]); // This triggers when selectedEntity changes OR becomes undefined/null

  const handleQuerySelect = (event: any, value: any) => {
    // Handle clearing the selection
    if (!value) {
      setSelectedQueryId(null);
      form.setValue("condition", {});
      form.setValue("saved_query", "");
      setUserHasCleared(true); // Mark as user cleared to prevent re-initialization
      return;
    }

    const selectedQuery = filteredSavedQueries.find(
      (query) => query.id === (typeof value === 'object' ? value.id : value)
    );

    if (selectedQuery) {
      try {
        setSelectedQueryId(selectedQuery.id);
        form.setValue("condition", selectedQuery.filters);
        form.setValue("saved_query", selectedQuery.id);
        setUserHasCleared(false); // Reset the flag when user selects a query

        // 🔹 Check if the selected query contains a "q" filter
        if ("q" in selectedQuery.filters) {
          notify("Search filters do not work as conditions.", {
            type: "warning",
          });
          form.setValue("condition", {});
        }
      } catch (error) {
        notify("Error parsing JSON", { type: "error" });
        setSelectedQueryId(null);
        form.setValue("condition", {});
        form.setValue("saved_query", "");
        setUserHasCleared(true);
      }
    }
  };

  if (!identity) {
    return null;
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Grid container spacing={2}>
        {/* 📛 Task Name */}
        <Grid xs={12} sm={6}>
          <TextInput
            source="name"
            fullWidth
            label="Name"
            helperText="Name of the task"
            validate={required("Please enter a name for the task")}
          />
        </Grid>

        {/* 📅 Cron Rule Selector */}
        <Grid xs={12} sm={6}>
          <SelectInput
            label="When to Send"
            helperText="Select when you want the email to be sent"
            source="cron_rule"
            choices={cronOptions.map(({ label, value }) => ({
              id: value,
              name: label,
            }))}
            validate={required("Please select when to send the email")}
            fullWidth
          />
        </Grid>

        {/* ✉️ Email Template Selector (Relation) */}
        <Grid xs={12} sm={6}>
          <ReferenceInput
            source="email_template"
            reference="email-templates"
            fullWidth
          >
            <SelectInput
              fullWidth
              optionText="email_name"
              helperText="What email template to use"
              validate={required("Please select an email template")}
            />
          </ReferenceInput>
        </Grid>



        <Grid xs={12} sm={6}>
          <Typography>Active</Typography>
          <BooleanInput
            source="active"
            label="Active"
            helperText="Is the task active?"
          />
        </Grid>

        

        {/* 🔍 JSON Condition Input */}
        <Grid xs={12} sm={6}>
            <AutocompleteInput
            source="saved_query"
            label="Use Saved Query"
            choices={filteredSavedQueries.map((query) => ({
              id: query.id,
              name: query.name,
            }))}
            onChange={handleQuerySelect}
            fullWidth
            value={selectedQueryId ? filteredSavedQueries.find(q => q.id === selectedQueryId) || null : null}
            disabled={isLoading}
            helperText={`Select a saved query to apply filters${selectedEntity ? ` for ${selectedEntity}` : ""}, or clear to remove all conditions`}
          />
        </Grid>

        {/* 🔄 Entity Selector */}
        <Grid xs={12} sm={6}>
          <AutocompleteInput
            source="entity"
            label="Entity"
            helperText="Select the entity to send the email to"
            choices={entityOptions}
            fullWidth
            optionText="name"
            
          />
        </Grid>

        {/* 📆 Last Sent (Read-only) */}
        <Grid xs={12} sm={6}>
          <Typography variant="subtitle1">Last Sent</Typography>
          <DateField
            source="last_sent"
            showTime
            options={{
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true, // Use 24-hour format
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default ScheduledEmailTaskFormFields;
