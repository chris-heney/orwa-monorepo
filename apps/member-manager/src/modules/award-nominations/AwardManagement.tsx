import React from "react";
import AwardContextProvider from "./AwardContextProvider";
import AwardDashboard from "./AwardDashboard";

const AwardManagement = () => (
  <AwardContextProvider>
    <AwardDashboard />
  </AwardContextProvider>
);

export default AwardManagement;
