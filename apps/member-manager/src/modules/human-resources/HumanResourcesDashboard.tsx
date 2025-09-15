import React from "react";
import {Box, Tab, Grid, Divider} from "@mui/material";
import { Title } from "react-admin";

import { useMediaQuery } from "@mui/material";
import { Theme } from "@mui/material/styles";
import ContactList from "./contacts/ContactList";
import StaffList from "./staff/StaffList";
import InstructorsList from "./instructors/InstructorList";
import HumanResourcesHeader from "./_components/HumanResourcesHeader";
import { Contacts, Person } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useHumanResourcesContext } from "./HumanResourcesContext";
import { a11yTabPanelProps, a11yTabProps } from "../../helpers/TabFormatters";
import HumanResourcesFilters from "./_components/HumanResourceFilters";
import UserList from "./users/UserList";
import BadgeList from "./contacts/badges/BadgeList";
import RolesContextProvider from "../../context/RolesContextProvider";
import useCurrentUser from "../_helpers/useCurrentUser";

export type TabValue = "contacts" | "staffs" | "training-instructors";

const HumanResourcesDashboard = () => {
  const isSmall = useMediaQuery<Theme>((theme) => theme.breakpoints.down("sm"));

  const { 
    selectedTab, 
    setSelectedTab, 
    isSettingsOpen, 
    isFilterSidebarOpen, 
  } = useHumanResourcesContext();

  const { role } = useCurrentUser();

  const tabs = [
    {
      label: "Contacts",
      value: "contacts",
      icon: <Contacts />,
      divider: true,
    },
    {
      label: "Staff",
      value: "staff",
      icon: <Person />,
      resource: "staff",
      divider: true,
    },
    {
      label: "Instructors",
      value: "training-instructors",
      icon: <Person />,
      resource: "training-instructors",
      divider: true,
    },
    role === "Admin"
      ? {
          label: "Users",
          value: "users",
          icon: <Person />,
          resource: "users",
        }
      : {},
  ];

  return (
    <Grid container spacing={0} maxWidth={"95vw"}>
      <Grid xs={12} md={isFilterSidebarOpen && !isSettingsOpen ? 10 : 12}>
        <Box sx={{ position: "sticky", top: 0, zIndex: 10, mt: 3 }}>
          <Title title="Human Resources" />
          <HumanResourcesHeader />
          {isSettingsOpen ? (
            <>
              <Title title="Settings" />
              <BadgeList />
            </>
          ) : (
            <Box sx={{ justifyContent: "center" }}>
              <TabContext value={selectedTab.toString()}>
                <TabList
                  variant="scrollable"
                  sx={{
                    backgroundColor: "#eee",
                    maxWidth: isSmall ? 320 : undefined,
                    overflow: "clip",
                  }}
                  onChange={(event: React.SyntheticEvent, tv) => {
                    setSelectedTab(tv);
                  }}
                >
                  {tabs.map((tab, i) => (
                    <Tab
                      key={`tab-${i}`}
                      label={tab.label}
                      {...a11yTabProps(i)}
                      value={tab.value}
                      icon={tab.icon}
                    />
                  ))}
                </TabList>
                <Divider />
              </TabContext>
            </Box>
          )}
        </Box>

        {isSettingsOpen ? (
          <BadgeList />
        ) : (
          <Box
            component="main"
            sx={{
              display: "flex",
              flexDirection: isSmall ? "column" : "row",
              flexGrow: 1,
              justifyContent: "start",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Box sx={{ overflow: "hidden", flexGrow: 1, width: "100%" }}>
              <Box sx={{ overflow: "auto" }}>
                <TabContext value={selectedTab}>
                  <Box sx={{ backgroundColor: "#fff" }}>
                    <TabPanel value="contacts" {...a11yTabPanelProps(0)}>
                      <ContactList title=" "/>
                    </TabPanel>
                    <TabPanel value="staff" {...a11yTabPanelProps(1)}>
                      <StaffList title=" "/>
                    </TabPanel>
                    <TabPanel
                      value="training-instructors"
                      {...a11yTabPanelProps(2)}
                    >
                      <InstructorsList title=" "/>
                    </TabPanel>
                    <TabPanel value="users" {...a11yTabPanelProps(2)}>
                      <RolesContextProvider>
                        <UserList />
                      </RolesContextProvider>
                    </TabPanel>
                  </Box>
                </TabContext>
              </Box>
            </Box>
          </Box>
        )}
      </Grid>
      {!isSettingsOpen && isFilterSidebarOpen && <Grid xs={12} md={2}>
        <HumanResourcesFilters />
      </Grid>}
    </Grid>
  );
};

export default HumanResourcesDashboard;
