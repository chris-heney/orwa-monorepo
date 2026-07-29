import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useConferenceKioskProvider } from "../ConferenceKioskContextProvider";

const VendorInformation = () => {
  const { conference } = useConferenceKioskProvider();

  return (
    <div className="w-full mx-auto my-2 bg-neutral-500 rounded-lg overflow-hidden text-white">
      <div className="mb-4">
        <h2 className="text-4xl font-bold text-center mb-2 p-2">Vendor Information</h2>
      </div>

      {conference.booths_available < 1000 && (
        <div className="flex flex-col mt-4">
          <p className="text-xl font-bold">Available Booths</p>
          <h1 className="text-7xl font-bold mb-1">{conference.booths_available}</h1>
        </div>
      )}
      {conference.vendor_information && conference.vendor_information
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
                expandIcon={<ExpandMoreIcon sx={{ color: "white", ml: 1}} />}
                aria-controls={`panel${index}-content`}
                id={`panel${index}-header`}
                sx={{
                  px: 0,
                  " & > .MuiAccordionSummary-content": {
                    my: 0,
                    pl: 4,
                  },
                  color: "white",
                  ":hover": {
                    backgroundColor: "#828282",
                  },

                  backgroundColor: "#707070",
                  " & > .MuiAccordionSummary-expandIconWrapper": {
                    position: "absolute",
                    left: 0,
                  },
                }}
              >
                <div
                  className={`font-bold ${
                    item.important ? "text-red-500" : "text-white"
                  }`}
                >
                  {item.title}
                </div>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  backgroundColor: "#707070",
                  color: "white",
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

export default VendorInformation;
