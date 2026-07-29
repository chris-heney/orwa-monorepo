import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useConferenceKioskProvider } from "../ConferenceKioskContextProvider";

const AttendeeInformation = () => {
  const { conference } = useConferenceKioskProvider();

  return (
    <div className="w-full mx-auto my-2 bg-stone-100 rounded-lg overflow-hidden">
      <div className="mb-4">
        <h2 className="text-4xl font-bold text-center mb-2 p-2">
          Attendee Information
        </h2>
      </div>
      {conference.attendee_information &&
        conference.attendee_information
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
                  expandIcon={
                    <ExpandMoreIcon
                      sx={{
                        ml: 1,
                      }}
                    />
                  }
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
                      backgroundColor: "#e4e4e4",
                    },
                    backgroundColor: "#F5F5F4",
                    " & > .MuiAccordionSummary-expandIconWrapper": {
                      position: "absolute",
                      left: 0,
                    },
                    borderRight: "none",
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
                    backgroundColor: "#F5F5F4",
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

export default AttendeeInformation;
