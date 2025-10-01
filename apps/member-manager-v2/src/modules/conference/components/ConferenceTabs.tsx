import { Paper, Tab, Theme, useMediaQuery, useTheme } from '@mui/material';
import { TabPanel } from '@mui/lab';
import { TabList } from "@mui/lab";
import { TabContext } from "@mui/lab";
import { Box } from "@mui/material";
import React from "react";
import { useListFilterContext } from "react-admin";
import { useConferenceContext } from "../ConferenceContext";
import ConferenceSummary from "./ConferenceSummary";
import ConferenceTools from "./ConferenceTools";
import ConferenceRegistrations from "./ConferenceRegistrations";
import ConferenceBooths from "./ConferenceBooths";
import ConferenceContestants from "./ConferenceContestants";
import TasteTestContestants from "./TasteTestContestants";
import ConferenceTeams from "./ConferenceTeams";
import ConferenceTickets from "./ConferenceTickets";
import ConferenceSchedules from "./ConferenceSchedules";
import RegistrationAddons from "./RegistrationAddons";
import ConferenceGiving from "./ConferenceGiving";
import ConferenceEdit from "../ConferenceEdit";
import SponsorsList from "../sponsors/SponsorsList";
import FeedbackList from "./FeedbackList";
import ConferenceExtras from "../extras/ConferenceExtras";
import EditIcon from "@mui/icons-material/Edit";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BoothIcon from "@mui/icons-material/Store";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import AttendeeIcon from "@mui/icons-material/Groups";
import ScheduleIcon from "@mui/icons-material/AccessTimeFilled";
import SponsorIcon from "@mui/icons-material/Redeem";
import TicketIcon from "@mui/icons-material/BookOnline";
import ExtrasIcon from "@mui/icons-material/AddShoppingCart";
import GivingIcon from "@mui/icons-material/VolunteerActivism";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import TextsmsIcon from "@mui/icons-material/Textsms";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";  
import { a11yTabPanelProps, a11yTabProps } from "../../../helpers/TabFormatters";
import { WaterDrop } from "@mui/icons-material";
import AttendeeList from '../attendees/AttendeeList';


const getTabComponent = (tabValue: string) => {
    switch (tabValue) {
      case "tools":
        return <ConferenceTools />;
      case "summary":
        return <ConferenceSummary />;
      case "edit":
        return <ConferenceEdit />;
      case "registrations":
        return <ConferenceRegistrations />;
      case "attendees":
        return <AttendeeList />;
      case "booths":
        return <ConferenceBooths />;
      case "contestants":
        return <ConferenceContestants />;
      case "taste test":
        return <TasteTestContestants />;
      case "teams":
        return <ConferenceTeams />;
      case "sponsors":
        return <SponsorsList />;
      case "tickets":
        return <ConferenceTickets />;
      case "schedule":
        return <ConferenceSchedules />;
      case "extras":
        return <ConferenceExtras />;
      case "addons":
        return <RegistrationAddons />;
      case "sponsorships":
        return <ConferenceGiving />;
      case "feedback":
        return <FeedbackList />;
      default:
        return <ConferenceSummary />;
    }
  };

const ConferenceTabs = () => {
  const theme = useTheme();
  const { selectedTab, setSelectedTab, setResource, isFilterSidebarOpen } =
    useConferenceContext();
  const { filterValues } = useListFilterContext();

  const tabs = [
    {
      label: "Tools",
      value: "tools",
      icon: <BuildCircleIcon />,
    },
    {
      label: "Summary",
      value: "summary",
      icon: <DashboardIcon />,
      divider: true,
    },
    {
      label: "Registrations",
      value: "registrations",
      icon: <HowToRegIcon />,
      resource: "conference-registrations",
    },
    {
      label: "Attendees",
      value: "attendees",
      icon: <AttendeeIcon />,
      resource: "conference-attendees",
    },
    {
      label: "Booths",
      value: "booths",
      icon: <BoothIcon />,
      resource: "conference-booths",
    },
    {
      label: "Contestants",
      value: "contestants",
      icon: <PersonPinIcon />,
      resource: "conference-contestants",
    },
    {
      label: "Teams",
      value: "teams",
      icon: <Diversity3Icon />,
      resource: "conference-teams",
    },
    {
      label: "Taste Test",
      value: "taste test",
      icon: <WaterDrop />,
      resource: "taste-test-contestants",
    },
    {
      label: "Sponsors",
      value: "sponsors",
      icon: <SponsorIcon />,
      resource: "conference-sponsors",
      divider: true,
    },
    {
      label: "Edit",
      value: "edit",
      icon: <EditIcon />,
    },
    {
      label: "Schedule",
      value: "schedule",
      resource: "conference-schedules",
      icon: <ScheduleIcon />,
      divider: true,
    },
    {
      label: "Tickets",
      value: "tickets",
      resource: "conference-tickets",
      icon: <TicketIcon />,
    },
    {
      label: "Extras",
      value: "extras",
      resource: "conference-extras",
      icon: <ExtrasIcon />,
    },
    {
      label: "Addons",
      value: "addons",
      resource: "registration-addons",
      icon: <ExtrasIcon />,
    },
    {
      label: "Sponsorships",
      value: "sponsorships",
      resource: "conference-sponsorships",
      icon: <GivingIcon />,
    },
    {
      label: "Feedback",
      value: "feedback",
      resource: "conference-feedbacks",
      icon: <TextsmsIcon />,
    },
  ];

  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));
 

  return (
    <Box sx={{ p: 0 }}>
      <TabContext value={selectedTab.toString()}>
        <Box sx={{ justifyContent: "center", backgroundColor: theme.palette.background.paper }}>
          {/* need to fix max width for mobile and smallwer screen tab list isnt responsive  */}
          <TabList
            variant="scrollable"
            onChange={(event: React.SyntheticEvent, tv) => {
              setSelectedTab(tv);
              setResource(tabs.find((tab) => tab.value === tv)?.resource || "");
            }}
          >
            {tabs
              .filter((tab) => {
                if (!filterValues) return true;

                if (!filterValues.conference) {
                    return tab.label !== "Edit"
                }
                if (filterValues.conference === 1) {
                  return tab.label !== "Contestants" && tab.label !== "Teams";
                } else if (filterValues.conference === 2) {
                  // Expo: Hide Contestants, Taste Test, and Teams
                  return (
                    tab.label !== "Contestants" &&
                    tab.label !== "Taste Test" &&
                    tab.label !== "Teams"
                  );
                } else if (filterValues.conference === 3) {
                  // Fall: Hide Water Taste Test
                  return tab.label !== "Taste Test";
                }
                return true;
              })
              .map((tab, i) => (
                <Tab
                  sx={{
                    borderRight: tab.divider ? "2px solid #ccc;" : undefined,
                  }}
                  key={`tab-${i}`}
                  label={tab.label}
                  {...a11yTabProps(i)}
                  value={tab.value}
                  icon={tab.icon}
                />
              ))}
          </TabList>
        </Box>

        <Paper
          sx={{
            mb: 2,
            backgroundColor: theme.palette.background.paper,
            maxWidth: isSmall || isFilterSidebarOpen ? "95vw" : "80vw",
            overflow: "scroll",
          }}
        >
          {tabs.map((tab, index) => (
            <TabPanel
              key={`panel-${index}`}
              value={tab.value}
              {...a11yTabPanelProps(index)}
            >
              {getTabComponent(tab.value)}
            </TabPanel>
          ))}
        </Paper>
      </TabContext>
    </Box>
  );
};

export default ConferenceTabs;
