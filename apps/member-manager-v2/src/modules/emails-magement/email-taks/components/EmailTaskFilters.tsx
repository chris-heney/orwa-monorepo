import React, { useEffect } from "react";
import { Card, CardContent } from "@mui/material";
import {
  FilterList,
  FilterListItem,
  FilterLiveSearch,
  Loading,
  useListFilterContext,
} from "react-admin";
import { Group } from "@mui/icons-material";
import { useEmailManagementContext } from "../../EmailManagementContextProvider";
import SavedFilters from "../../../_components/SavedFilters";

const EmailTaskFilters = () => {
  const { setEmailTaskFilters, selectedTab, savingQuery, setSavingQuery } =
    useEmailManagementContext();
  const { filterValues } = useListFilterContext();

  useEffect(() => {
    if (filterValues) setEmailTaskFilters(filterValues);
  }, [filterValues]);

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

  return !filterValues ? (
    <Loading />
  ) : (
    <Card
      component={"div"}
      sx={{
        minWidth: 200,
        maxHeight: "70vh",
        overflow: "auto",
        position: "sticky",
      }}
    >
      <CardContent>
        <SavedFilters
          resource={selectedTab}
          savingQuery={savingQuery}
          setSavingQuery={setSavingQuery}
        />
        <FilterLiveSearch />
        <FilterList label="Entity" icon={<Group />}>
          {entityOptions.map((entity: any) => {
            return (
              <FilterListItem
                key={entity.id}
                label={entity.name}
                value={{ entity: entity.id }}
              />
            );
          })}
        </FilterList>
      </CardContent>
    </Card>
  );
};
export default  EmailTaskFilters;
