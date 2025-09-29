import React, { useEffect, useState } from "react";
import { useDataProvider, useListContext, useNotify, useStore } from "react-admin";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { IConferenceAttendee } from "../types";
import IConferenceTicket from "../types/IConferenceTicket";


const RandomAttendeeGenerator = () => {

  const { filterValues } = useListContext();
  const dataProvider = useDataProvider();
  const notify = useNotify();

  const [ticketOptions, setTicketOptions] = useState<
    IConferenceTicket[] | null
  >([]);
  const [selectedTicketIds, setSelectedTicketIds] = useStore("conference-eligible-tickets", []);
  const [randomAttendee, setRandomAttendee] =
    useState<IConferenceAttendee | null>(null);
  const [loadingTickets, setLoadingTickets] = useState(false);

  // Fetch ticket options from "conference-ticket" on mount
  useEffect(() => {
    const fetchTickets = async () => {
      setLoadingTickets(true);
      try {
        const { data } = await dataProvider.getList("conference-tickets", {
          pagination: { page: 1, perPage: 100 },
          sort: { field: "name", order: "ASC" },
          filter: filterValues?.conference ? { conferences: filterValues?.conference } : {},
          meta: {
            populate: true,
            raw: true,
          },
        });
        setTicketOptions(data as IConferenceTicket[]);
      } catch (error) {
        console.error(error);
        notify("Error fetching tickets", { type: "error" });
      } finally {
        setLoadingTickets(false);
      }
    };
    fetchTickets();
  }, [filterValues?.conference]);

  // Update selected tickets
  const handleTicketChange = (event: any) => {
    setSelectedTicketIds(event.target.value);
  };

  // Generate a random attendee based on the selected ticket options
  const handleGenerate = async () => {

    if (selectedTicketIds.length === 0) {
      notify("Please select at least one ticket type", { type: "warning" });
      return;
    }

    if (filterValues?.year === undefined) {
      notify("Please select a year", { type: "warning" });
      return;
    }

    if (filterValues?.conference === undefined) {
      notify("Please select a conference", { type: "warning" });
      return;
    }
    try {
      // Fetch conference-attendee records with conference_ticket in selectedTicketIds.
      const { data } = await dataProvider.getList("conference-attendees", {
        pagination: { page: 1, perPage: 100 },
        sort: { field: "id", order: "ASC" },
        meta: {
          populate: true,
          raw: true,
        },
        filter: { conference_ticket: selectedTicketIds, year: filterValues?.year },
      });
      if (data.length === 0) {
        notify("No eligible attendees found", { type: "warning" });
        setRandomAttendee(null);
        return;
      }
      // Pick a random attendee from the fetched list.
      const randomIndex = Math.floor(Math.random() * data.length);
      setRandomAttendee(data[randomIndex]);
    } catch (error) {
      console.error(error);
      notify("Error fetching attendees", { type: "error" });
    }
  };

  return (
    <Box sx={{ p: 2, border: "1px solid #ccc" }}>
      <Typography variant="h6" gutterBottom>
        Random Attendee Generator
      </Typography>
      <FormControl fullWidth margin="normal" disabled={loadingTickets}>
        <InputLabel id="ticket-options-label">Eligible Ticket Types</InputLabel>
        <Select
          labelId="ticket-options-label"
          multiple
          value={selectedTicketIds}
          onChange={handleTicketChange}
          label="Eligible Ticket Types"
          MenuProps={{
            sx: {
              maxHeight: 300,
            },
          }}
        >
          {ticketOptions?.map((ticket) => (
            <MenuItem key={ticket.id} value={ticket.id}>
                {ticket.name} {!filterValues?.id ? `(${ticket.conferences.map((conference) => (conference as any).name).join(", ")})` : ""}
            </MenuItem>
          ))}
        </Select>
        <Typography variant="caption">
          Select one or more ticket types to generate a random attendee.
        </Typography>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGenerate}
        disabled={selectedTicketIds.length === 0}
      >
        Generate Random Attendee
      </Button>
      {randomAttendee && (
        <Box mt={2} sx={{ p: 1, background: "#f5f5f5", borderRadius: 1 }}>
          <Typography variant="subtitle1">Selected Attendee:</Typography>
          <Typography>
            Name: {randomAttendee.first} {randomAttendee.last}
          </Typography>
          <Typography>
            Organization: {randomAttendee.organization ?? "N/A"}
          </Typography>
          <Typography>
            Ticket:{" "}
            {randomAttendee.conference_ticket
              ? randomAttendee.conference_ticket.name
              : "No ticket assigned"}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default RandomAttendeeGenerator;
