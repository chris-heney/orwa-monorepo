import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useConferenceKioskProvider } from "../ConferenceKioskContextProvider";
import { parseConferenceDate } from "../helpers/parseConferenceDate";
import { ui } from "../ui/tokens";

const accordionSx = {
  px: 0,
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

const ConferenceDetailsAccordion = () => {
  const { conference } = useConferenceKioskProvider();

  const startDate = parseConferenceDate(conference.start_date);
  const endDate = parseConferenceDate(conference.end_date);

  const sameDay = startDate.toDateString() === endDate.toDateString();
  const dateLabel = sameDay
    ? startDate.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : `${startDate.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })} – ${endDate.toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })}`;

  return (
    <section className={ui.panel}>
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-5 py-5 text-white">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Status
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          {conference.status === "Coming Soon"
            ? `${conference.status} · ${startDate.toLocaleString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}`
            : conference.status}
        </h2>
        {conference.venue != null && (
          <p className="mt-2 text-sm text-slate-200">
            {[
              conference.venue.name,
              conference.venue.street,
              `${conference.venue.city}, ${conference.venue.state} ${conference.venue.zip}`,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
        <p className="mt-1 text-sm font-medium text-blue-200">{dateLabel}</p>
      </div>

      {(conference.conference_details ?? [])
        .filter((item) => !item.hidden)
        .sort((a, b) => a.order - b.order)
        .map((item, index) => (
          <Accordion disableGutters elevation={0} key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${index}-content`}
              id={`panel${index}-header`}
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
        ))}
    </section>
  );
};

export default ConferenceDetailsAccordion;
