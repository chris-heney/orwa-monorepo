import { motion } from "framer-motion";
import ConferenceDetailsAccordion from "../components/ConferenceDetailsAccordion";
import AttendeeInformation from "../components/AttendeeInformation";
import VendorInformation from "../components/VendorInformation";
import EarlyRegistrationDiscount from "../components/EarlyRegistrationDiscount";
import { useConferenceKioskProvider } from "../ConferenceKioskContextProvider";
import { addToCalendar } from "../helpers/addToCalendar";
import { CalendarIcon, DocumentTextIcon } from "@heroicons/react/20/solid";
import ConferenceBeginsIn from "../components/ConferenceBeginsIn";

const Dashboard = () => {
  const { conference } = useConferenceKioskProvider();

  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
  const logoUrl = conference?.logo?.url
    ? `${API_ENDPOINT.replace("/api", "")}${
        conference.logo.url
      }`
    : "";

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-4">
        {/* Left Section */}
        <motion.div
          className="flex justify-center flex-col items-center md:items-center space-y-6"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Conference Logo"
              className="min-h-max w-auto object-contain"
            />
          )}

          {/* Button that link to the conference brochure if field is empty default to this link https://issuu.com/oklahomaruralwater/docs/2025_orwa_annual_conference_program */}
          {conference?.brochure_link && <a
            href={conference.brochure_link || "https://issuu.com/oklahomaruralwater/docs/2025_orwa_annual_conference_program"}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded block text-center flex items-center justify-center"
          >
            <DocumentTextIcon className="w-5 h-5 mr-2" />
            View The Program
          </a>}
        </motion.div>

        {/* Right Section */}
        <motion.div
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {conference.status === "Online Registration" &&
            conference.online_registration_end && (
            <EarlyRegistrationDiscount
              startDate={conference.online_registration_end}
            />
          )}
          {(conference.status === "Kiosk Registration" ||
            conference.status === "Archived" ||
            conference.status === "Online Registration Closed") && (
            <ConferenceBeginsIn />
          )}
          <button
            onClick={() => addToCalendar(conference)}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-800"
          >
            <CalendarIcon className="w-5 h-5 mr-2" />
            Add to Calendar
          </button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <ConferenceDetailsAccordion />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 h-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <div className="flex flex-col h-full">
          <AttendeeInformation />
        </div>
        <div className="flex flex-col h-full">
          <VendorInformation />
        </div>
      </motion.div>
      <div className="container grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <a
          href={`https://orwa.org/conference-registration/?conference_id=${conference.id}&source=${
            conference.status === "Online Registration" ? "online" : "kiosk"
          }`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded block text-center"
        >
          Register Now
        </a>

        {/* <a
          href={`https://orwa.org/conference-registration/?conference_id=3&source=${
            conference.status === "Online Registration" ? "online" : "kiosk"
          }`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded block text-center"
        >
          Become a Sponsor
        </a> */}

        <a
          href="https://orwa.org/call-for-abstracts/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded block text-center"
        >
          Submit an Abstract
        </a>
      </div>
    </>
  );
};

export default Dashboard;
