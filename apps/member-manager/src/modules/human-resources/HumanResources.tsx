import React from "react";
import HumanResourcesContextProvider from "./HumanResourcesContext";
import HumanResourcesDashboard from "./HumanResourcesDashboard";
import UserContextProvider from "../../context/UserContextProvider";

const HumanResources = () => {
  return (
    <HumanResourcesContextProvider>
      <UserContextProvider>
        <HumanResourcesDashboard />
      </UserContextProvider>
    </HumanResourcesContextProvider>
  );
};

export default HumanResources;
