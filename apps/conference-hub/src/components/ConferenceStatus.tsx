import React from "react";
import { IConference } from "../types/IConferenceKioskProvider";
import { CalendarIcon } from "@heroicons/react/20/solid";
import { motion } from "framer-motion";
import { addToCalendar } from "../helpers/addToCalendar";
import { parseConferenceDate } from "../helpers/parseConferenceDate";

interface ConferenceStatusProps {
  conference: IConference;
  isAdminView: boolean;
}

const ConferenceStatus: React.FC<ConferenceStatusProps> = ({
  conference,
  isAdminView,
}) => {
  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
  const logoUrl = conference?.logo?.url
    ? `${API_ENDPOINT.replace("/api", "")}${conference.logo.url}`
    : "";

  if (!isAdminView && conference.status === "Online Registration Closed") {
    return (
      <div className="text-center">
        <p className="text-lg text-gray-700 mb-6">
          While online registration is closed, vendors and attendees can still
          register at the event!
        </p>
        {/* <div className="flex justify-center pb-5">
          <button
            onClick={() => addToCalendar(conference)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-800"
          >
            <CalendarIcon className="w-5 h-5 mr-2" />
            Add to Calendar
          </button>
        </div> */}
      </div>
    );
  }

  if (
    (conference.status === "Closed" ||
      (conference.status === "Coming Soon" && !isAdminView)) &&
    !isAdminView
  ) {
    return (
      <div className="flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-center"
        >
          {logoUrl && (
            <motion.img
              src={logoUrl}
              alt="Conference Logo"
              className="h-32 w-auto mx-auto object-contain mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            />
          )}
          <motion.h1
            className=""
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            {conference.status === "Closed" ? (
              // "ORWA Sequoyah Fall Conference, October 1-3, 2025:\n\nEVENT CANCELED!\n\nWe regret to inform you that the 2025 ORWA Sequoyah Fall Conference, originally scheduled for October 1–3, has been canceled. A recent fire at the host facility has caused significant damage and disrupted operations, making it impossible for the event to move forward as planned.\n\nWe know many of you were looking forward to this year's conference - we were too. This decision was not made lightly, and we deeply appreciate your understanding and continued support during this unexpected situation.\n\nAt this time, no rescheduled date is planned, but we are hopeful we'll be able to return to Sequoyah Lodge in the future. In the meantime, we'll keep you informed of any updates or alternate opportunities to connect later in the year.\n\nThank you again for your patience and support."

              <div className="text-xl font-bold whitespace-pre-line leading-relaxed text-gray-800 text-justify mx-auto max-w-2xl mt-4 mb-4" dangerouslySetInnerHTML={{ __html: (conference.closed_message ?? "").replace(/\n/g, '<br />') }} />
            ) : (
              <div className="text-3xl font-bold" dangerouslySetInnerHTML={{ __html: conference.closed_message ?? "" }} />
            )}
          </motion.h1>
          {conference.status === "Coming Soon" && (
            <>
              <motion.h2
                className="text-2xl font-bold mt-4"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 1 }}
              >
                Save the Date!
              </motion.h2>
              <motion.p
                className="text-lg mt-3 text-gray-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 1 }}
              >
                {parseConferenceDate(conference.start_date).toLocaleString(
                  "en-US",
                  {
                    day: "numeric",
                    month: "long",
                  }
                )}{" "}
                -{" "}
                {parseConferenceDate(conference.end_date).toLocaleString(
                  "en-US",
                  {
                    day: "numeric",
                  }
                ) +
                  ", " +
                  parseConferenceDate(conference.end_date).toLocaleString(
                    "en-US",
                    {
                      year: "numeric",
                    }
                  )}
              </motion.p>
              <motion.div
                className="flex justify-center mt-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, duration: 1 }}
              >
                <button
                  onClick={() => addToCalendar(conference)}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <CalendarIcon className="w-5 h-5 mr-3" />
                  Add to Calendar
                </button>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  return null;
};

export default ConferenceStatus;
