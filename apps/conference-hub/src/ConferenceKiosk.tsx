import "./App.css";
import AppBar from "./components/AppBar";
import Footer from "./components/layout-footer";
import ConferenceStatus from "./components/ConferenceStatus";
import Sponsors from "./sections/sponsors";
import { useConferenceKioskProvider } from "./ConferenceKioskContextProvider";
import { ui } from "./ui/tokens";

function ConferenceKiosk() {
  const { selectedTab, conference, isAdminView, tabs } =
    useConferenceKioskProvider();

  const showSponsorMarquee =
    (conference.status !== "Closed" && conference.status !== "Coming Soon") ||
    isAdminView;

  return (
    <div className={ui.page}>
      <AppBar />
      {showSponsorMarquee && (
        <section
          className="sponsors border-b border-slate-200 bg-white"
          aria-label="Sponsor logos"
        >
          <div className={ui.container}>
            <Sponsors />
          </div>
        </section>
      )}
      <main className={`${ui.container} py-8`}>
        <ConferenceStatus conference={conference} isAdminView={isAdminView} />
        {tabs[selectedTab]?.component}
      </main>
      <footer className={`${ui.container} border-t border-slate-200 py-6`}>
        <Footer />
      </footer>
    </div>
  );
}

export default ConferenceKiosk;
