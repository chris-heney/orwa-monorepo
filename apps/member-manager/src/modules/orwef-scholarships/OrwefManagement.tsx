import React from "react";
import OrwefContextProvider from "./OrwefContextProvider";
import OrwefDashboard from "./OrwefDashboard";

const OrwefManagement = () => (
  <OrwefContextProvider>
    <OrwefDashboard />
  </OrwefContextProvider>
);

export default OrwefManagement;
