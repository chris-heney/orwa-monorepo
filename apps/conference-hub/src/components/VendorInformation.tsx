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

const VendorInformation = () => {
  const { conference } = useConferenceKioskProvider();
  const items = (conference.vendor_information ?? [])
    .filter((item) => !item.hidden)
    .sort((a, b) => a.order - b.order);

  return (
    <section className={`${ui.panel} h-full`}>
      <div className={ui.titleBar}>Vendor Information</div>

      {conference.booths_available < 1000 && (
        <div className="border-b border-slate-100 px-4 py-4 text-left">
          <p className={ui.subheading}>Available booths</p>
          <p className="mt-1 text-4xl font-semibold tracking-tight text-slate-900">
            {conference.booths_available}
          </p>
        </div>
      )}

      {items.length === 0 ? (
        <p className={ui.empty}>No vendor details published yet.</p>
      ) : (
        items.map((item, index) => (
          <Accordion disableGutters elevation={0} key={index}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`vendor-panel${index}-content`}
              id={`vendor-panel${index}-header`}
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

export default VendorInformation;
