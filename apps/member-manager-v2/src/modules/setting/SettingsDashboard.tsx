import React from "react";
import SettingsContextProvider from "./SettingsContextProvider";
import SettingsPage from "./SettingsPage";
import UserContextProvider from "../../context/UserContextProvider";
import RolesContextProvider from "../../context/RolesContextProvider";

const SettingsDashboard = () => {
  return (
    <UserContextProvider>
      <RolesContextProvider>
        <SettingsContextProvider>
          <SettingsPage />
        </SettingsContextProvider>
      </RolesContextProvider>
    </UserContextProvider>
  );
};

export default SettingsDashboard;
