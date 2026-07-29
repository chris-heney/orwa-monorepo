import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  IConference,
  IConferenceKioskProvider,
  ITab,
} from "./types/IConferenceKioskProvider";
import { useGetConference } from "./helpers/API";
import authProvider from "./helpers/authProvider";
import FeedbackForm from "./sections/form-feedback";
import Tournament from "./sections/tournament";
import Booths from "./sections/booths";
import SponsorShowcaseTab from "./sections/sponsor-showcase-tab";
import AttendeeShowcase from "./sections/attendee-showcase";
import VendorShowcase from "./sections/vendor-showcase";
import Showcase from "./sections/showcase";
import Dashboard from "./sections/dashboard";
import Schedule from "./sections/schedule";
import Loading from "./components/Loading";
import WaterContestantsShowcase from "./sections/water-contesants";

export const ConferenceKioskProvider = createContext<IConferenceKioskProvider>({
  conferenceId: "",
  conference: {} as IConference,
  setConference: () => {
    return;
  },
  selectedTab: 0,
  setSelectedTab: () => {
    return;
  },
  isLoggedIn: false,
  setIsLoggedIn: () => {
    return;
  },
  tabs: [],
  handleTabChange: () => {
    return;
  },
  isAdminView: false,
  setIsAdminView: () => {
    return;
  },
});

// eslint-disable-next-line react-refresh/only-export-components
export const useConferenceKioskProvider = () =>
  useContext(ConferenceKioskProvider);

const ConferenceKioskContextProvider = ({ children }: PropsWithChildren) => {
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAdminView, setIsAdminView] = useState<boolean>(false); // New state
  const conferenceId =
    new URLSearchParams(window.location.search).get("conference_id") ?? "3";
  const { data: conferenceData, loading: loadingConference } =
    useGetConference();
  const [conference, setConference] = useState<IConference | undefined>(
    undefined
  );

  const isSmall = window.innerWidth < 640;

  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        await authProvider.checkAuth();
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkUserAuth();
  }, []);

  useEffect(() => {
    setConference(conferenceData);
  }, [conferenceData]);

  const tabs =
    (conference?.status === "Closed" || conference?.status === "Coming Soon") &&
    !isAdminView
      ? []
      : [
          { name: "Dashboard", component: <Dashboard /> },
          { name: "Schedule", component: <Schedule /> },
          ...(isSmall
            ? [
                { name: "Attendee Roster", component: <AttendeeShowcase /> },
                { name: "Vendor Showcase", component: <VendorShowcase /> },
              ]
            : [{ name: "Showcase", component: <Showcase /> }]),
          { name: "Sponsors", component: <SponsorShowcaseTab /> },
          { name: "Booths", component: <Booths /> },
          {
            name: "Tournament",
            show: conferenceId === "3",
            component: <Tournament />,
          }, // ONLY FOR FALL CONFERENCE
          {
            name: "Water Taste Test",
            show: conferenceId === "1",
            component: <WaterContestantsShowcase />,
          }, // ONLY FOR Annual CONFERENCE
          { name: "Feedback", component: <FeedbackForm /> },
          {
            name: "Buy Tickets",
            external: true,
            href: `https://orwa.org/conference-registration?conference_id=${conferenceId}&source=${
              conference?.status === "Online Registration" ? "online" : "kiosk"
            }`,
          },
        ].filter((tab) => tab.show !== false); // Show all tabs if Admin View is active

  const handleTabChange = (index: number) => {
    setSelectedTab(index);
  };

  if (loadingConference || !conference) {
    return <Loading />;
  }

  return (
    <ConferenceKioskProvider.Provider
      value={{
        conference,
        setConference,
        conferenceId,
        selectedTab,
        setSelectedTab,
        isLoggedIn,
        setIsLoggedIn,
        tabs: tabs as ITab[],
        handleTabChange,
        isAdminView,
        setIsAdminView,
      }}
    >
      {children}
    </ConferenceKioskProvider.Provider>
  );
};

export default ConferenceKioskContextProvider;
