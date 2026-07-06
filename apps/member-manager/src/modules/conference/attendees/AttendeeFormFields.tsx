import React from "react";
import { Card, Typography } from "@mui/material";
import { Box } from "@mui/material";
import { Grid } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import {
  BooleanInput,
  useGetOne,
  useRecordContext,
  useRefresh,
} from "react-admin";
import { useFormContext } from "react-hook-form";
import { Divider } from "@mui/material";
import { ReferenceInput } from "react-admin";
import { AutocompleteInput } from "react-admin";
import { required } from "react-admin";
import { DateInput } from "react-admin";
import { NumberInput } from "react-admin";
import { TextInput } from "react-admin";
import { SelectInput } from "react-admin";
import SelectInputRegistration from "../components/SelectInputRegistration";
import {
  trainingTypeOptions,
  VotingStatusOptions,
} from "../../../helpers/Data";
import MetaComponent from "../components/ConferenceMetaRepeatableComponent";
import { useConferenceContext } from "../ConferenceContext";

interface ConferenceAttendeeFieldsProps {
  context: "create" | "edit";
}

/** Matches list `conference_ticket.name` / `type`; use ticket context to detect vendor. */
function typeLabelFromTicket(
  ticket: { name?: string; context?: string } | null | undefined
): string {
  if (!ticket) {
    return "";
  }
  if (ticket.context === "Vendor") {
    return "Vendor";
  }
  return (ticket.name as string) || "";
}

export const ConferenceAttendeeFields = ({
  context,
}: ConferenceAttendeeFieldsProps) => {
  const { currentFilter } = useConferenceContext();
  const [registrationType, setRegistrationType] = useState<
    "Vendor" | "Attendee" | null
  >(null);
  const record = useRecordContext();
  const refresh = useRefresh();
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    if (updated) {
      setTimeout(() => {
        refresh();
      }, 100);
    }
    setUpdated(false);
  }, [updated]);

  // vendor then training nor licenses apply
  const form = useFormContext();

  const conferenceTicketId = form.watch("conference_ticket");
  const ticketIdForQuery =
    conferenceTicketId != null && conferenceTicketId !== ""
      ? typeof conferenceTicketId === "object" &&
        conferenceTicketId !== null &&
        "id" in conferenceTicketId
        ? (conferenceTicketId as { id: number }).id
        : conferenceTicketId
      : undefined;

  const { data: selectedTicket } = useGetOne(
    "conference-tickets",
    { id: ticketIdForQuery as number },
    { enabled: ticketIdForQuery != null && ticketIdForQuery !== "" }
  );

  const recordTicket =
    record &&
    record.conference_ticket &&
    typeof record.conference_ticket === "object"
      ? (record.conference_ticket as { id?: number; name?: string; context?: string })
      : undefined;
  const recordTicketId = record
    ? typeof record.conference_ticket === "object" &&
      record.conference_ticket !== null
      ? (record.conference_ticket as { id: number }).id
      : (record.conference_ticket as number | string | undefined)
    : undefined;
  const canUseRecordTicket =
    recordTicketId != null &&
    ticketIdForQuery != null &&
    Number(recordTicketId) === Number(ticketIdForQuery);

  // Prefer the selected ticket record (updates when the dropdown changes). The
  // `type` string is not updated by ReferenceInput, and VIP/Attendee both use
  // context "Attendee", so the stored `type` can stay "Attendee" while the
  // ticket name is "VIP".
  const typeFromTicket =
    typeLabelFromTicket(selectedTicket) ||
    (canUseRecordTicket ? typeLabelFromTicket(recordTicket) : "") ||
    "";
  const ticketType: string =
    typeFromTicket ||
    (form.watch("type") as string) ||
    (record?.type as string) ||
    "";

  useEffect(() => {
    setRegistrationType(ticketType === "Vendor" ? "Vendor" : "Attendee");
  }, [ticketType]);

  console.log("ticket type", ticketType);

  useEffect(() => {
    if (!selectedTicket) {
      return;
    }
    const next = typeLabelFromTicket(selectedTicket);
    if (next && form.getValues("type") !== next) {
      form.setValue("type", next, { shouldDirty: true, shouldTouch: true });
    }
  }, [selectedTicket, form]);

  // Prefer the saved attendee's conference so edit screens match the record when
  // dashboard filters (currentFilter) point at a different default conference.
  const recordConferenceId =
    record && record.conference != null && record.conference !== ""
      ? Number(record.conference)
      : undefined;
  const conferenceId =
    recordConferenceId !== undefined && !Number.isNaN(recordConferenceId)
      ? recordConferenceId
      : (currentFilter.conference as number) ?? 0;
  const yearValue =
    record && record.year != null && record.year !== ""
      ? Number(record.year)
      : (currentFilter.year as number) ?? new Date().getFullYear();

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          md={
            ticketType !== "Vendor" &&
            (conferenceId === 1 || conferenceId === 3)
              ? 6
              : 12
          }
        >
          <Card sx={{ p: 1 }}>
            <Typography ml={1} variant="h6">
              Attendee Information
            </Typography>
            <Divider />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <ReferenceInput
                  filter={
                    conferenceId
                      ? { conferences: [conferenceId] }
                      : {}
                  }
                  source="conference_ticket"
                  reference="conference-tickets"
                  label="Title"
                  fullWidth
                  helperText={false}
                >
                  <AutocompleteInput
                    optionText={"name"}
                    helperText={false}
                    validate={required("Conference Ticket is required")}
                  />
                </ReferenceInput>
              </Grid>
              <Grid display={"none"} item xs={12} md={6}>
                <DateInput
                  hidden
                  source="registration_date"
                  label="Registration Date"
                  fullWidth
                  helperText={false}
                  defaultValue={new Date()}
                />
              </Grid>
              <NumberInput source="type_id" sx={{ display: "none" }} />
              <Grid item xs={12} md={6}>
                <TextInput
                  source="title"
                  label="Title"
                  fullWidth
                  helperText={false}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextInput
                  source="first"
                  label="First"
                  fullWidth
                  helperText={false}
                  validate={required("First Name is required")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextInput
                  source="last"
                  label="Last"
                  fullWidth
                  helperText={false}
                  validate={required("Last Name is required")}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextInput
                  validate={required("Email is required")}
                  source="email"
                  label="Email"
                  fullWidth
                  helperText={false}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextInput
                  source="phone"
                  label="Phone"
                  fullWidth
                  helperText={false}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <SelectInputRegistration type={registrationType} />
                {/* <ReferenceInput
                    source="registration"
                    reference="conference-registrations"
                    label="Registration"
                    fullWidth
                    helperText={false}
                  >
                    <AutocompleteInput
                    
                      optionText={"organization"}
                      helperText={false}
                    />
                  </ReferenceInput> */}
              </Grid>
              <Grid item xs={12} md={6}>
                <TextInput
                  source="organization"
                  label="Organization"
                  fullWidth
                  helperText={false}
                />
              </Grid>
              {ticketType !== "Vendor" &&
                ticketType !== "Guest" &&
                ticketType !== "Speaker" &&
                ticketType !== "Staff" && (
                  <Grid item xs={12} md={6}>
                    <TextInput
                      source="license"
                      label="License"
                      fullWidth
                      helperText={false}
                    />
                  </Grid>
                )}
              {ticketType !== "Vendor" && (
                <Grid item xs={12} md={6}>
                  <SelectInput
                    source="training_type"
                    choices={trainingTypeOptions}
                    fullWidth
                    helperText={false}
                  />
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <TextInput
                  source="passport_id"
                  helperText="*Only Required if Participating in Training"
                  label="Passport ID"
                  fullWidth
                />
              </Grid>
              {context === "edit" && (
                <Grid item xs={12} md={6}>
                  <NumberInput source="wp_eid" label="WP EID" fullWidth />
                </Grid>
              )}
              <Grid item xs={6} md={6}>
                <BooleanInput
                  source="speaker"
                  label="This Conference Attendee is a Speaker"
                  fullWidth
                  helperText={false}
                />
              </Grid>

              <Grid item xs={6} md={6}>
                <BooleanInput
                  source="promotional_emails"
                  label="Send Promotional Emails"
                  fullWidth
                  helperText={false}
                />
              </Grid>
              <NumberInput
                source="year"
                defaultValue={yearValue}
                sx={{ display: "none" }}
              />
              <NumberInput
                source="conference"
                defaultValue={conferenceId}
                sx={{ display: "none" }}
              />
              
              {/* Only show MetaComponent here if Voting Delegates card is NOT displayed */}
              {context === "edit" && 
               !(ticketType !== "Vendor" &&
                (conferenceId === 1 || conferenceId === 3)) && (
                <Grid item xs={12}>
                  <Box mt={2}>
                    <MetaComponent
                      ticketType={ticketType}
                      context="Attendee"
                      resource="conference-attendees"
                      setUpdated={setUpdated}
                      conferenceId={conferenceId}
                    />
                  </Box>
                </Grid>
              )}
            </Grid>
          </Card>
        </Grid>
        {ticketType !== "Vendor" &&
          conferenceId === 1 && (
            <Grid item xs={12} md={6}>
              <Card sx={{ p: 1 }}>
                <Typography variant="h6">Voting Delegates</Typography>
                <Divider />
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <SelectInput
                        source="orwa_voting_status"
                        label="ORWA Voting Status"
                        choices={VotingStatusOptions}
                        fullWidth
                      />
                    </Grid>
                    {conferenceId === 1 && (
                      <Grid item xs={12} md={6}>
                        <SelectInput
                          source="orwaag_voting_status"
                          label="ORWAAG Voting Status"
                          choices={VotingStatusOptions}
                          fullWidth
                        />
                      </Grid>
                    )}
                    <Grid item xs={12} md={6} display={"none"}>
                      <ReferenceInput
                        source="conference"
                        reference="conferences"
                        fullWidth
                      >
                        <NumberInput
                          source="conference"
                          defaultValue={conferenceId}
                          label="Conference"
                          fullWidth
                        />
                      </ReferenceInput>
                    </Grid>
                    <Grid item xs={12} md={6} display={"none"}>
                      <NumberInput
                        source="year"
                        defaultValue={yearValue}
                        label="Year"
                        fullWidth
                      />
                    </Grid>
                    
                    {/* Add MetaComponent here when in edit mode */}
                    {context === "edit" && (
                      <Grid item xs={12}>
                        <Box mt={2}>
                          <Divider sx={{ mb: 2 }} />
                          <MetaComponent
                            ticketType={ticketType}
                            context="Attendee"
                            resource="conference-attendees"
                            setUpdated={setUpdated}
                            conferenceId={conferenceId}
                          />
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Card>
            </Grid>
          )}
      </Grid>
    </Box>
  );
};
