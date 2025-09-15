import React from "react";
import EmailManagementContextProvider from "./EmailManagementContextProvider";
import EmailManagementDashboard from "./EmailManagementDashboard";

const EmailManagement = () => {
  return (
    <EmailManagementContextProvider>
      <EmailManagementDashboard />
    </EmailManagementContextProvider>
  );
};

export default EmailManagement;
