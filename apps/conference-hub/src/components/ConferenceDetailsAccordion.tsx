import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useConferenceKioskProvider } from "../ConferenceKioskContextProvider";
import { parseConferenceDate } from "../helpers/parseConferenceDate";

const ConferenceDetailsAccordion = () => {
  const { conference } = useConferenceKioskProvider();

  const startDate = parseConferenceDate(conference.start_date);
  const endDate = parseConferenceDate(conference.end_date);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-blue-500 text-white p-5 flex flex-col gap-2">
        <span className="text-4xl font-bold">
          {conference.status === "Coming Soon"
            ? conference.status +
              " " +
              startDate.toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : conference.status}
        </span>
        {/* Full venue — Strapi v5 may return null for empty components */}
        {conference.venue != null && (
          <span className="font-bold">
            {conference.venue.name +
              " " +
              conference.venue.street +
              ", " +
              conference.venue.city +
              ", " +
              conference.venue.state +
              " " +
              conference.venue.zip}
          </span>
        )}
        {/* Conference Date start and end */}
        <span className="font-bold">
          {/* If its only one day, show only the start date */}
          {startDate.getDay() === endDate.getDay() ? (
            startDate.toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
          ) : (
            <>
            {startDate.toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
            {" - "}
            {endDate.toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
            </>
          )}
          
        </span>
      </div>
      {(conference.conference_details ?? [])
        .filter((item) => {
          return !item.hidden;
        })
        .sort((a, b) => {
          return a.order - b.order;
        })
        .map((item, index) => {
          return (
            <Accordion disableGutters square key={index}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
                sx={{
                  px: 0,
                  " & > .MuiAccordionSummary-content": {
                    my: 0,
                    pl: 4,
                  },
                  borderBottom: "1px solid #f0f0f0",
                  ":hover": {
                    backgroundColor: "#f9f9f9",
                  },
                  " & > .MuiAccordionSummary-expandIconWrapper": {
                    position: "absolute",
                    left: 0,
                  },
                }}
              >
                <div
                  className={`font-bold ${
                    item.important ? "text-red-500" : "text-gray-800"
                  }`}
                >
                  {item.title}
                </div>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  p: 0,
                }}
              >
                <div
                  className="text-justify fetched-html-content"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </AccordionDetails>
            </Accordion>
          );
        })}
    </div>
  );
};

export default ConferenceDetailsAccordion;
