import "./App.css";
import AppBar from "./components/AppBar";
import Footer from "./components/layout-footer";
import ConferenceStatus from "./components/ConferenceStatus";
import Sponsors from "./sections/sponsors";
import { useConferenceKioskProvider } from "./ConferenceKioskContextProvider";

function ConferenceKiosk() {
  const { selectedTab, conference, isAdminView, tabs} = useConferenceKioskProvider();

  const showSponsorMarquee =
    (conference.status !== "Closed" &&
      conference.status !== "Coming Soon") ||
    isAdminView;

  return (
    <div>
      <AppBar />
      {showSponsorMarquee && (
        <section
          className="w-full bg-white shadow-md shadow-gray-300 overflow-hidden"
          aria-label="Sponsor logos"
        >
          <Sponsors />
        </section>
      )}
      <section className="container mx-auto max-w-6xl px-4 py-8">
        <ConferenceStatus conference={conference} isAdminView={isAdminView} />
        {tabs[selectedTab]?.component}
      </section>

      <footer className="container mx-auto max-w-6xl px-4 py-8">
        <Footer />
      </footer>
    </div>
  );
}

export default ConferenceKiosk;