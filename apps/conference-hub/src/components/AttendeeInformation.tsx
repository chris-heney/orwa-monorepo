import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useConferenceKioskProvider } from "../ConferenceKioskContextProvider";
import { ui } from "../ui/tokens";

const accordionSx = {
  px: 0,
  backgroundColor: "#ffffff",
  "& > .MuiAccordionSummary-content": {
    my: 0,
    pl: 4,
  },
  borderBottom: "1px solid #e2e8f0",
  ":hover": {
    backgroundColor: "#f8fafc",
  },
  "& > .MuiAccordionSummary-expandIconWrapper": {
    position: "absolute",
    left: 8,
  },
};

const AttendeeInformation = () => {
  const { conference } = useConferenceKioskProvider();
  const items = (conference.attendee_information ?? [])
    .filter((item) => !item.hidden)
    .sort((a, b) => a.order - b.order);

  return (
    <section className={`${ui.panel} h-full`}>
      <div className={ui.titleBar}>Attendee Information</div>
      {items.length === 0 ? (
        <p className={ui.empty}>No attendee details published yet.</p>
      ) : (
        items.map((item, index) => (
          <Accordion disableGutters elevation={0} key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`attendee-panel${index}-content`}
              id={`attendee-panel${index}-header`}
              sx={accordionSx}
            >
              <div
                className={`text-sm font-semibold ${
                  item.important ? "text-red-600" : "text-slate-800"
                }`}
              >
                {item.title}
              </div>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 2, pt: 0 }}>
              <div
                className="fetched-html-content"
                dangerouslySetInnerHTML={{ __html: item.description }}
              />
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </section>
  );
};

export default AttendeeInformation;
