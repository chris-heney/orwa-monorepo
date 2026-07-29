import { IConference } from "../types/IConferenceKioskProvider";
import { saveAs } from "file-saver";
import * as ics from "ics";
import { parseConferenceDate } from "./parseConferenceDate";

export const addToCalendar = (conference: IConference) => {
    const { name, description, start_date, end_date, venue } = conference;

    const start = parseConferenceDate(start_date);
    const end = parseConferenceDate(end_date);

    const event = {
      start: [
        start.getFullYear(),
        start.getMonth() + 1,
        start.getDate(),
        start.getHours(),
        start.getMinutes(),
      ],
      end: [
        end.getFullYear(),
        end.getMonth() + 1,
        end.getDate(),
        end.getHours(),
        end.getMinutes(),
      ],
      title: name,
      description: description ?? name,
      location: venue
        ? `${venue.name}, ${venue.street}, ${venue.city}, ${venue.state}, ${venue.zip}`
        : "",
    };

    ics.createEvent(event as never, (error, value) => {
      if (error) {
        console.error("Error creating calendar event:", error);
        return;
      }
      const blob = new Blob([value || ""], {
        type: "text/calendar;charset=utf-8",
      });
      saveAs(blob, `${name}.ics`);
    });
  };