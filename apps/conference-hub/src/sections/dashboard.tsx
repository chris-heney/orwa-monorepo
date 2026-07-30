import ConferenceDetailsAccordion from "../components/ConferenceDetailsAccordion";
import AttendeeInformation from "../components/AttendeeInformation";
import VendorInformation from "../components/VendorInformation";
import EarlyRegistrationDiscount from "../components/EarlyRegistrationDiscount";
import { useConferenceKioskProvider } from "../ConferenceKioskContextProvider";
import { addToCalendar } from "../helpers/addToCalendar";
import { CalendarIcon, DocumentTextIcon } from "@heroicons/react/20/solid";
import ConferenceBeginsIn from "../components/ConferenceBeginsIn";
import { ui } from "../ui/tokens";

const Dashboard = () => {
  const { conference } = useConferenceKioskProvider();

  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
  const logoUrl = conference?.logo?.url
    ? `${API_ENDPOINT.replace("/api", "")}${conference.logo.url}`
    : "";

  const registerHref = `https://orwa.org/conference-registration/?conference_id=${conference.id}&source=${
    conference.status === "Online Registration" ? "online" : "kiosk"
  }`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
        <div className="flex flex-col items-center gap-5">
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Conference Logo"
              className="max-h-40 w-auto object-contain"
            />
          )}
          {conference?.brochure_link && (
            <a
              href={conference.brochure_link}
              target="_blank"
              rel="noopener noreferrer"
              className={ui.btnPrimary}
            >
              <DocumentTextIcon className="h-5 w-5" />
              View the Program
            </a>
          )}
        </div>

        <div className="flex flex-col items-center gap-4">
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
            type="button"
            onClick={() => addToCalendar(conference)}
            className={ui.btnSecondary}
          >
            <CalendarIcon className="h-5 w-5" />
            Add to Calendar
          </button>
        </div>
      </div>

      <ConferenceDetailsAccordion />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AttendeeInformation />
        <VendorInformation />
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <a
          href={registerHref}
          target="_blank"
          rel="noopener noreferrer"
          className={ui.btnPrimary}
        >
          Register Now
        </a>
        <a
          href="https://orwa.org/call-for-abstracts/"
          target="_blank"
          rel="noopener noreferrer"
          className={ui.btnSecondary}
        >
          Submit an Abstract
        </a>
      </div>
    </div>
  );
};

export default Dashboard;
